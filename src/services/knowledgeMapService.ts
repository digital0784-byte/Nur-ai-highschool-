import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Grade } from '../types';
import {
  KnowledgeTopicNode,
  StudentTopicMasteryRecord,
  WeakTopicRecord,
  PersonalizedRecommendationRecord,
  LearningAlertRecord,
  VerifiedLearningEvent,
  PerformanceSnapshot,
  StudentAnalyticsSummary,
  TeacherClassroomAnalytics,
  SuperAdminAggregatedAnalytics,
  MasteryStatus,
  WeakTopicSeverity,
  PrerequisiteRef,
} from '../types/knowledgeMap';
import { ETHIOPIAN_KNOWLEDGE_MAP_NODES } from '../data/curriculumKnowledgeMapData';
import { offlineSyncEngine } from './offlineSyncEngine';

class KnowledgeMapService {
  private nodes: KnowledgeTopicNode[] = ETHIOPIAN_KNOWLEDGE_MAP_NODES;

  public getUserId(): string {
    return auth.currentUser?.uid || localStorage.getItem('nur_student_uid') || 'guest_student_nur';
  }

  // Retrieve full knowledge map tree
  public getAllTopicNodes(): KnowledgeTopicNode[] {
    return this.nodes;
  }

  public getNodesByGradeAndSubject(grade: Grade, subject?: string): KnowledgeTopicNode[] {
    return this.nodes.filter(
      (n) => n.grade === grade && (!subject || n.subject.toLowerCase() === subject.toLowerCase())
    );
  }

  public getNodeById(topicId: string): KnowledgeTopicNode | undefined {
    return this.nodes.find((n) => n.id === topicId);
  }

  // =========================================================================
  // 1. RECORD VERIFIED LEARNING EVENT & COMPUTE MASTERY
  // =========================================================================
  public async recordLearningEvent(
    eventData: Omit<VerifiedLearningEvent, 'id' | 'timestamp' | 'studentId'> & { studentId?: string }
  ): Promise<{ mastery: StudentTopicMasteryRecord; weakTopic?: WeakTopicRecord; alert?: LearningAlertRecord }> {
    const studentId = eventData.studentId || this.getUserId();
    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const timestamp = new Date().toISOString();

    const fullEvent: VerifiedLearningEvent = {
      ...eventData,
      id: eventId,
      studentId,
      timestamp,
    };

    // Queue for offline sync
    try {
      const activityType = eventData.eventType === 'QUIZ_SUBMISSION' ? 'quiz_taken' : 'practice_completed';
      offlineSyncEngine.recordOfflineActivity(
        activityType,
        eventData.subject,
        eventData.topicId,
        eventData.topicTitle || eventData.topicId,
        fullEvent
      );
    } catch {
      // ignore offline queuing error
    }

    // Persist event in Firestore if online
    try {
      if (auth.currentUser) {
        const eventRef = doc(db, 'learning_events', eventId);
        await setDoc(eventRef, {
          ...fullEvent,
          serverReceivedAt: serverTimestamp(),
        });
      }
    } catch (e) {
      console.warn('[KnowledgeMap] Firestore learning event persist skipped/offline:', e);
    }

    // Update Student Mastery Score
    const updatedMastery = await this.updateTopicMasteryFromEvent(fullEvent);

    // Check Weak Topic Detection
    const weakTopic = await this.evaluateWeakTopic(studentId, updatedMastery, fullEvent);

    // Check Prerequisite Gap & Early Warnings
    const alert = await this.evaluateEarlyWarnings(studentId, updatedMastery, fullEvent);

    // Refresh Recommendations
    await this.generateRecommendations(studentId);

    // Update Daily Performance Snapshot
    await this.updateDailySnapshot(studentId, fullEvent);

    return { mastery: updatedMastery, weakTopic, alert };
  }

  // Secure mastery score calculation based on verified weights
  private async updateTopicMasteryFromEvent(event: VerifiedLearningEvent): Promise<StudentTopicMasteryRecord> {
    const studentId = event.studentId;
    const topicId = event.topicId;
    const storageKey = `nur_mastery_${studentId}_${topicId}`;
    
    // Load existing record
    let current: StudentTopicMasteryRecord | null = null;
    try {
      const localStr = localStorage.getItem(storageKey);
      if (localStr) {
        current = JSON.parse(localStr);
      }
    } catch {
      current = null;
    }

    if (!current && auth.currentUser) {
      try {
        const docRef = doc(db, 'student_mastery', `${studentId}_${topicId}`);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          current = snap.data() as StudentTopicMasteryRecord;
        }
      } catch (e) {
        console.warn('[KnowledgeMap] Fetch mastery error:', e);
      }
    }

    if (!current) {
      const node = this.getNodeById(topicId);
      current = {
        id: `${studentId}_${topicId}`,
        studentId,
        grade: event.grade,
        subject: event.subject,
        unit: event.unitNumber,
        lesson: event.lessonNumber,
        topic: topicId,
        topicTitle: event.topicTitle || node?.topicTitle || topicId,
        masteryScore: 0,
        status: 'NOT_STARTED',
        prerequisiteStatus: 'SATISFIED',
        lastActivityAt: event.timestamp,
        lastAssessmentAt: event.timestamp,
        updatedAt: event.timestamp,
        accuracyRate: 0,
        completedLessonsCount: 0,
        quizzesTakenCount: 0,
        practiceAttemptsCount: 0,
      };
    }

    // Update counters
    if (event.eventType === 'LESSON_COMPLETION') {
      current.completedLessonsCount += 1;
    } else if (event.eventType === 'QUIZ_SUBMISSION') {
      current.quizzesTakenCount += 1;
    } else if (event.eventType === 'PRACTICE_ATTEMPT') {
      current.practiceAttemptsCount += 1;
    }

    // Weight Calculations:
    // Lesson completion: up to 15%
    // Practice accuracy: up to 25%
    // Quiz score: up to 25%
    // Exam score: up to 20%
    // Mistake correction & repetitions: up to 10%
    // Consistency: up to 5%
    const lessonPoints = Math.min(15, current.completedLessonsCount * 15);
    const accuracy = event.score !== undefined ? event.score : (event.isCorrect ? 100 : 40);
    const runningAccuracy = current.accuracyRate === 0 ? accuracy : Math.round((current.accuracyRate * 0.6) + (accuracy * 0.4));
    current.accuracyRate = runningAccuracy;

    const practicePoints = Math.min(25, Math.round((runningAccuracy / 100) * 25));
    const quizPoints = Math.min(25, Math.round((runningAccuracy / 100) * 25));
    const examBonus = event.eventType === 'EXAM_SUBMISSION' ? Math.round(((event.score || 70) / 100) * 20) : 10;
    const correctionBonus = event.mistakeCorrected ? 10 : 5;
    const consistencyBonus = 5;

    let computedScore = lessonPoints + practicePoints + quizPoints + examBonus + correctionBonus + consistencyBonus;
    computedScore = Math.max(0, Math.min(100, computedScore));

    // Determine status
    let status: MasteryStatus = 'NOT_STARTED';
    if (computedScore >= 80) status = 'MASTERED';
    else if (computedScore >= 60) status = 'DEVELOPING';
    else if (computedScore > 0) status = 'LEARNING';

    // Verify prerequisites
    const prereqStatus = await this.checkPrerequisiteGaps(studentId, topicId);

    current.masteryScore = computedScore;
    current.status = status;
    current.prerequisiteStatus = prereqStatus.gapsExist ? 'GAPS_EXIST' : 'SATISFIED';
    current.lastActivityAt = event.timestamp;
    if (event.score !== undefined) {
      current.lastAssessmentAt = event.timestamp;
    }
    current.updatedAt = new Date().toISOString();

    // Cache locally
    localStorage.setItem(storageKey, JSON.stringify(current));

    // Save to Firestore if authenticated
    if (auth.currentUser) {
      try {
        const docRef = doc(db, 'student_mastery', current.id);
        await setDoc(docRef, {
          ...current,
          serverUpdatedAt: serverTimestamp(),
        }, { merge: true });
      } catch (e) {
        console.warn('[KnowledgeMap] Save mastery to Firestore skipped/offline:', e);
      }
    }

    return current;
  }

  // =========================================================================
  // 2. PREREQUISITE ANALYSIS & GAP CHECKING
  // =========================================================================
  public async checkPrerequisiteGaps(
    studentId: string,
    topicId: string
  ): Promise<{ gapsExist: boolean; missingPrerequisites: PrerequisiteRef[] }> {
    const node = this.getNodeById(topicId);
    if (!node || !node.prerequisites || node.prerequisites.length === 0) {
      return { gapsExist: false, missingPrerequisites: [] };
    }

    const missingPrerequisites: PrerequisiteRef[] = [];

    for (const prereq of node.prerequisites) {
      const storageKey = `nur_mastery_${studentId}_${prereq.topicId}`;
      let masteryScore = 0;
      try {
        const local = localStorage.getItem(storageKey);
        if (local) {
          const parsed = JSON.parse(local);
          masteryScore = parsed.masteryScore || 0;
        }
      } catch {
        masteryScore = 0;
      }

      if (masteryScore < prereq.minRequiredScore) {
        missingPrerequisites.push(prereq);
      }
    }

    return {
      gapsExist: missingPrerequisites.length > 0,
      missingPrerequisites,
    };
  }

  // =========================================================================
  // 3. WEAK TOPIC DETECTION & AUTO-RESOLUTION
  // =========================================================================
  private async evaluateWeakTopic(
    studentId: string,
    mastery: StudentTopicMasteryRecord,
    event: VerifiedLearningEvent
  ): Promise<WeakTopicRecord | undefined> {
    const weakKey = `nur_weak_${studentId}_${mastery.topic}`;
    const recordId = `weak_${studentId}_${mastery.topic}`;

    // Auto-resolve if mastery is >= 80% and accuracy >= 80%
    if (mastery.masteryScore >= 80 && mastery.accuracyRate >= 80) {
      const existingStr = localStorage.getItem(weakKey);
      if (existingStr) {
        try {
          const existing: WeakTopicRecord = JSON.parse(existingStr);
          existing.status = 'RESOLVED';
          existing.resolvedAt = new Date().toISOString();
          localStorage.setItem(weakKey, JSON.stringify(existing));

          if (auth.currentUser) {
            const docRef = doc(db, 'weak_topics', recordId);
            await setDoc(docRef, existing, { merge: true });
          }
          return existing;
        } catch {}
      }
      return undefined;
    }

    // Detect weak topic: if score < 60 or accuracy < 60%
    const isWeak = mastery.accuracyRate < 60 || (event.score !== undefined && event.score < 60);
    if (!isWeak) return undefined;

    let severity: WeakTopicSeverity = 'LOW';
    if (mastery.accuracyRate < 35 || (event.score !== undefined && event.score < 35)) {
      severity = 'CRITICAL';
    } else if (mastery.accuracyRate < 50) {
      severity = 'HIGH';
    } else if (mastery.accuracyRate < 65) {
      severity = 'MEDIUM';
    }

    const prereqCheck = await this.checkPrerequisiteGaps(studentId, mastery.topic);

    const record: WeakTopicRecord = {
      id: recordId,
      studentId,
      topicId: mastery.topic,
      topicTitle: mastery.topicTitle,
      subject: mastery.subject,
      grade: mastery.grade,
      severity,
      evidence: {
        accuracyRate: mastery.accuracyRate,
        failedAttemptsCount: (mastery.quizzesTakenCount || 1) - (mastery.masteryScore > 60 ? 1 : 0),
        lastFailedDate: new Date().toISOString(),
        missingPrerequisites: prereqCheck.missingPrerequisites.map((p) => p.title),
        sampleMistakeConcept: event.metadata?.concept || 'Application of core formula and boundary verification',
      },
      detectedAt: new Date().toISOString(),
      status: 'ACTIVE',
    };

    localStorage.setItem(weakKey, JSON.stringify(record));

    if (auth.currentUser) {
      try {
        const docRef = doc(db, 'weak_topics', record.id);
        await setDoc(docRef, record, { merge: true });
      } catch (e) {
        console.warn('[KnowledgeMap] Weak topic save skipped/offline:', e);
      }
    }

    return record;
  }

  // =========================================================================
  // 4. EARLY-WARNING ENGINE (ACADEMIC SUPPORT ALERTS)
  // =========================================================================
  private async evaluateEarlyWarnings(
    studentId: string,
    mastery: StudentTopicMasteryRecord,
    event: VerifiedLearningEvent
  ): Promise<LearningAlertRecord | undefined> {
    const alertId = `alert_${studentId}_${Date.now()}`;
    let alertToCreate: LearningAlertRecord | null = null;

    // Check 1: Prerequisite gap in advanced or national exam topic
    const node = this.getNodeById(mastery.topic);
    const prereqCheck = await this.checkPrerequisiteGaps(studentId, mastery.topic);

    if (prereqCheck.gapsExist) {
      const missingTitles = prereqCheck.missingPrerequisites.map((p) => p.title).join(', ');
      alertToCreate = {
        id: alertId,
        studentId,
        type: 'PREREQUISITE_GAP',
        severity: node?.isNationalExamPriority ? 'CRITICAL' : 'WARNING',
        title: `Prerequisite Gap Detected: ${node?.topicTitle}`,
        message: `Before advancing to ${node?.topicTitle}, solidify fundamental understanding in: ${missingTitles}.`,
        suggestedAction: `Review ${prereqCheck.missingPrerequisites[0].title} with AI Tutor and complete 5 foundational practice problems.`,
        evidence: {
          topicId: mastery.topic,
          subject: mastery.subject,
        },
        createdAt: new Date().toISOString(),
        status: 'ACTIVE',
      };
    } else if (event.score !== undefined && event.score < 40 && mastery.quizzesTakenCount >= 2) {
      // Check 2: Repeated quiz difficulties
      alertToCreate = {
        id: alertId,
        studentId,
        type: 'REPEATED_QUIZ_FAILURES',
        severity: 'HIGH' as any,
        title: `Repeated Difficulty in ${mastery.topicTitle}`,
        message: `Recent quiz accuracy (${event.score}%) shows that foundational concepts need reinforcement before testing again.`,
        suggestedAction: `Break down this chapter with interactive flashcards and step-by-step worked examples.`,
        evidence: {
          consecutiveFails: 2,
          topicId: mastery.topic,
          subject: mastery.subject,
        },
        createdAt: new Date().toISOString(),
        status: 'ACTIVE',
      };
    }

    if (alertToCreate) {
      localStorage.setItem(`nur_alert_${studentId}_${alertToCreate.id}`, JSON.stringify(alertToCreate));
      if (auth.currentUser) {
        try {
          const docRef = doc(db, 'learning_alerts', alertToCreate.id);
          await setDoc(docRef, alertToCreate, { merge: true });
        } catch (e) {
          console.warn('[KnowledgeMap] Alert save skipped/offline:', e);
        }
      }
    }

    return alertToCreate || undefined;
  }

  // =========================================================================
  // 5. PERSONALIZED RECOMMENDATION ENGINE
  // =========================================================================
  public async generateRecommendations(studentId: string): Promise<PersonalizedRecommendationRecord[]> {
    const recommendations: PersonalizedRecommendationRecord[] = [];
    const weakTopics = await this.getStudentWeakTopics(studentId);

    // 1. Weak topic remediation priority
    for (const weak of weakTopics.slice(0, 3)) {
      recommendations.push({
        id: `rec_weak_${weak.topicId}`,
        studentId,
        type: 'WEAK_TOPIC_PRACTICE',
        topicId: weak.topicId,
        topicTitle: weak.topicTitle,
        subject: weak.subject,
        grade: weak.grade,
        title: `Mastery Booster: ${weak.topicTitle}`,
        reason: `Your recent practice accuracy was ${weak.evidence.accuracyRate}%. A quick 10-minute session will strengthen key formulas.`,
        priority: weak.severity === 'CRITICAL' ? 'URGENT' : 'HIGH',
        estimatedMinutes: 10,
        createdAt: new Date().toISOString(),
        status: 'PENDING',
      });
    }

    // 2. National exam priorities for Grade 11 & 12
    const examPriorities = this.nodes.filter((n) => n.isNationalExamPriority);
    for (const examNode of examPriorities.slice(0, 2)) {
      if (!recommendations.some((r) => r.topicId === examNode.id)) {
        recommendations.push({
          id: `rec_exam_${examNode.id}`,
          studentId,
          type: 'EXAM_PREP_HIGH_PRIORITY',
          topicId: examNode.id,
          topicTitle: examNode.topicTitle,
          subject: examNode.subject,
          grade: examNode.grade,
          title: `National Exam Priority: ${examNode.topicTitle}`,
          reason: `Frequently tested high-weight topic on the Ethiopian University Entrance Examination.`,
          priority: 'HIGH',
          estimatedMinutes: 15,
          createdAt: new Date().toISOString(),
          status: 'PENDING',
        });
      }
    }

    // 3. Next logical lesson in sequence
    const nextNode = this.nodes.find((n) => !weakTopics.some((w) => w.topicId === n.id));
    if (nextNode && !recommendations.some((r) => r.topicId === nextNode.id)) {
      recommendations.push({
        id: `rec_next_${nextNode.id}`,
        studentId,
        type: 'NEXT_LESSON',
        topicId: nextNode.id,
        topicTitle: nextNode.topicTitle,
        subject: nextNode.subject,
        grade: nextNode.grade,
        title: `Next Up: Unit ${nextNode.unitNumber} — ${nextNode.lessonTitle}`,
        reason: `Continue your continuous curriculum progression seamlessly.`,
        priority: 'MEDIUM',
        estimatedMinutes: 12,
        createdAt: new Date().toISOString(),
        status: 'PENDING',
      });
    }

    // Cache locally
    localStorage.setItem(`nur_recommendations_${studentId}`, JSON.stringify(recommendations));

    if (auth.currentUser) {
      try {
        for (const rec of recommendations) {
          const docRef = doc(db, 'recommendations', rec.id);
          await setDoc(docRef, rec, { merge: true });
        }
      } catch {}
    }

    return recommendations;
  }

  // =========================================================================
  // 6. PERFORMANCE TRENDS & DAILY SNAPSHOTS
  // =========================================================================
  private async updateDailySnapshot(studentId: string, event: VerifiedLearningEvent): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const snapshotId = `snap_${studentId}_${today}`;
    const storageKey = `nur_snapshot_${snapshotId}`;

    let snapshot: PerformanceSnapshot = {
      id: snapshotId,
      studentId,
      timeframe: 'daily',
      dateLabel: today,
      quizAccuracy: 75,
      examScoresAvg: 70,
      questionsCompleted: 0,
      studyTimeMinutes: 0,
      topicsMasteredCount: 0,
      weakTopicsCount: 0,
      learningStreak: 1,
      completionRate: 50,
      updatedAt: new Date().toISOString(),
    };

    try {
      const local = localStorage.getItem(storageKey);
      if (local) snapshot = JSON.parse(local);
    } catch {}

    snapshot.questionsCompleted += event.totalQuestions || 1;
    snapshot.studyTimeMinutes += Math.round((event.durationSeconds || 180) / 60);
    if (event.score !== undefined) {
      snapshot.quizAccuracy = Math.round((snapshot.quizAccuracy * 0.7) + (event.score * 0.3));
    }
    snapshot.updatedAt = new Date().toISOString();

    localStorage.setItem(storageKey, JSON.stringify(snapshot));

    if (auth.currentUser) {
      try {
        const docRef = doc(db, 'performance_snapshots', snapshotId);
        await setDoc(docRef, snapshot, { merge: true });
      } catch {}
    }
  }

  public async getPerformanceSnapshots(studentId: string): Promise<PerformanceSnapshot[]> {
    const results: PerformanceSnapshot[] = [];
    // Read local snapshots
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`nur_snapshot_snap_${studentId}_`)) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          results.push(data);
        } catch {}
      }
    }

    // If empty, generate 7-day initial demo snapshot history
    if (results.length === 0) {
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const daySnap: PerformanceSnapshot = {
          id: `snap_${studentId}_${dateStr}`,
          studentId,
          timeframe: 'daily',
          dateLabel: dateStr,
          quizAccuracy: 68 + (i * 3) + Math.round(Math.random() * 8),
          examScoresAvg: 65 + (i * 2),
          questionsCompleted: 8 + (i * 4),
          studyTimeMinutes: 25 + (i * 6),
          topicsMasteredCount: Math.min(8, 2 + i),
          weakTopicsCount: Math.max(1, 4 - Math.floor(i / 2)),
          learningStreak: Math.min(7, 7 - i),
          completionRate: 40 + (i * 8),
          updatedAt: new Date().toISOString(),
        };
        results.push(daySnap);
        localStorage.setItem(`nur_snapshot_${daySnap.id}`, JSON.stringify(daySnap));
      }
    }

    return results.sort((a, b) => a.dateLabel.localeCompare(b.dateLabel));
  }

  // =========================================================================
  // 7. STUDENT ANALYTICS SUMMARY
  // =========================================================================
  public async getStudentAnalyticsSummary(studentId: string): Promise<StudentAnalyticsSummary> {
    const allMasteries = await this.getAllStudentMasteries(studentId);
    const weakTopics = await this.getStudentWeakTopics(studentId);
    const activeAlerts = await this.getStudentAlerts(studentId);
    const recommendations = await this.generateRecommendations(studentId);

    const totalTopicsTracked = this.nodes.length;
    const mastered = allMasteries.filter((m) => m.status === 'MASTERED').length;
    const developing = allMasteries.filter((m) => m.status === 'DEVELOPING').length;
    const learning = allMasteries.filter((m) => m.status === 'LEARNING').length;
    const notStarted = Math.max(0, totalTopicsTracked - (mastered + developing + learning));

    let sumScores = 0;
    allMasteries.forEach((m) => { sumScores += m.masteryScore; });
    const overallMasteryPercent = totalTopicsTracked > 0 ? Math.round(sumScores / totalTopicsTracked) : 0;

    // Subject breakdown
    const subjectMap: Record<string, {
      subjectName: string;
      masteryScore: number;
      topicsCount: number;
      masteredCount: number;
      weakCount: number;
    }> = {};

    this.nodes.forEach((node) => {
      if (!subjectMap[node.subject]) {
        subjectMap[node.subject] = {
          subjectName: node.subject,
          masteryScore: 0,
          topicsCount: 0,
          masteredCount: 0,
          weakCount: 0,
        };
      }
      subjectMap[node.subject].topicsCount += 1;
    });

    allMasteries.forEach((m) => {
      if (subjectMap[m.subject]) {
        subjectMap[m.subject].masteryScore += m.masteryScore;
        if (m.status === 'MASTERED') subjectMap[m.subject].masteredCount += 1;
      }
    });

    weakTopics.forEach((w) => {
      if (subjectMap[w.subject]) {
        subjectMap[w.subject].weakCount += 1;
      }
    });

    Object.keys(subjectMap).forEach((subj) => {
      if (subjectMap[subj].topicsCount > 0) {
        subjectMap[subj].masteryScore = Math.round(subjectMap[subj].masteryScore / subjectMap[subj].topicsCount);
      }
    });

    // High school entrance exam readiness for Grade 11 & 12
    const highPriorityWeaks = weakTopics.filter((w) => w.grade >= 11);
    const entranceReadinessPercent = Math.min(100, Math.round((mastered * 8) + (overallMasteryPercent * 0.4)));

    // AI Pedagogical Advice (Non-medical, strictly learning advice)
    const advice: string[] = [
      `Your strongest subject is currently ${Object.values(subjectMap).sort((a, b) => b.masteryScore - a.masteryScore)[0]?.subjectName || 'Mathematics'}. Build on this foundation to master related topics.`,
      weakTopics.length > 0
        ? `Focus your next study session on ${weakTopics[0].topicTitle} (${weakTopics[0].subject}) to resolve a key prerequisite before proceeding to advanced problem sets.`
        : `Consistent daily study has kept your prerequisite gaps minimal. Advance into new textbook chapters!`,
      `Reviewing worked examples before taking timed chapter quizzes increases accuracy by over 30%.`,
    ];

    return {
      studentId,
      overallMasteryPercent,
      totalTopicsTracked,
      masteredTopicsCount: mastered,
      developingTopicsCount: developing,
      learningTopicsCount: learning,
      notStartedTopicsCount: notStarted,
      activeWeakTopicsCount: weakTopics.length,
      criticalPrerequisiteGapsCount: weakTopics.filter((w) => w.severity === 'CRITICAL').length,
      subjectMasteryBreakdown: subjectMap,
      aiPedagogicalAdvice: advice,
      activeAlerts,
      topRecommendations: recommendations,
      entranceExamReadiness: {
        overallReadinessPercent: entranceReadinessPercent,
        highPriorityWeakTopics: highPriorityWeaks,
        prerequisiteGaps: [],
        strongSubjects: Object.values(subjectMap).filter((s) => s.masteryScore >= 70).map((s) => s.subjectName),
        revisionFocusAreas: highPriorityWeaks.map((w) => w.topicTitle),
      },
    };
  }

  // =========================================================================
  // 8. HELPERS & GETTERS
  // =========================================================================
  public async getAllStudentMasteries(studentId: string): Promise<StudentTopicMasteryRecord[]> {
    const list: StudentTopicMasteryRecord[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`nur_mastery_${studentId}_`)) {
        try {
          const item = JSON.parse(localStorage.getItem(key) || '{}');
          list.push(item);
        } catch {}
      }
    }

    if (list.length === 0 && auth.currentUser) {
      try {
        const q = query(collection(db, 'student_mastery'), where('studentId', '==', studentId));
        const snap = await getDocs(q);
        snap.forEach((d) => list.push(d.data() as StudentTopicMasteryRecord));
      } catch {}
    }

    // Default seed for preview if totally fresh
    if (list.length === 0) {
      const seeded: StudentTopicMasteryRecord[] = [
        {
          id: `${studentId}_g9_math_u1_l1`,
          studentId,
          grade: 9,
          subject: 'Mathematics',
          unit: 1,
          lesson: 1,
          topic: 'g9_math_u1_l1',
          topicTitle: 'Venn Diagrams & Set Operations',
          masteryScore: 88,
          status: 'MASTERED',
          prerequisiteStatus: 'SATISFIED',
          lastActivityAt: new Date().toISOString(),
          lastAssessmentAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          accuracyRate: 90,
          completedLessonsCount: 3,
          quizzesTakenCount: 2,
          practiceAttemptsCount: 4,
        },
        {
          id: `${studentId}_g10_math_u2_l1`,
          studentId,
          grade: 10,
          subject: 'Mathematics',
          unit: 2,
          lesson: 1,
          topic: 'g10_math_u2_l1',
          topicTitle: 'Quadratic Functions & Parabola Vertex Form',
          masteryScore: 68,
          status: 'DEVELOPING',
          prerequisiteStatus: 'SATISFIED',
          lastActivityAt: new Date().toISOString(),
          lastAssessmentAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          accuracyRate: 65,
          completedLessonsCount: 2,
          quizzesTakenCount: 2,
          practiceAttemptsCount: 3,
        },
        {
          id: `${studentId}_g11_phy_u1_l1`,
          studentId,
          grade: 11,
          subject: 'Physics',
          unit: 1,
          lesson: 1,
          topic: 'g11_phy_u1_l1',
          topicTitle: '2D Kinematics and Projectile Motion Analysis',
          masteryScore: 48,
          status: 'LEARNING',
          prerequisiteStatus: 'GAPS_EXIST',
          lastActivityAt: new Date().toISOString(),
          lastAssessmentAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          accuracyRate: 45,
          completedLessonsCount: 1,
          quizzesTakenCount: 2,
          practiceAttemptsCount: 2,
        },
        {
          id: `${studentId}_g12_math_u1_l1`,
          studentId,
          grade: 12,
          subject: 'Mathematics',
          unit: 1,
          lesson: 1,
          topic: 'g12_math_u1_l1',
          topicTitle: 'Limits, Continuity, and Asymptotic Behavior',
          masteryScore: 42,
          status: 'LEARNING',
          prerequisiteStatus: 'GAPS_EXIST',
          lastActivityAt: new Date().toISOString(),
          lastAssessmentAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          accuracyRate: 40,
          completedLessonsCount: 1,
          quizzesTakenCount: 1,
          practiceAttemptsCount: 1,
        }
      ];

      seeded.forEach((s) => {
        localStorage.setItem(`nur_mastery_${studentId}_${s.topic}`, JSON.stringify(s));
        list.push(s);
      });
    }

    return list;
  }

  public async getStudentWeakTopics(studentId: string): Promise<WeakTopicRecord[]> {
    const list: WeakTopicRecord[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`nur_weak_${studentId}_`)) {
        try {
          const item = JSON.parse(localStorage.getItem(key) || '{}');
          if (item.status === 'ACTIVE') list.push(item);
        } catch {}
      }
    }

    // Default sample if empty
    if (list.length === 0) {
      const sampleWeak: WeakTopicRecord = {
        id: `weak_${studentId}_g11_phy_u1_l1`,
        studentId,
        topicId: 'g11_phy_u1_l1',
        topicTitle: '2D Kinematics and Projectile Motion Analysis',
        subject: 'Physics',
        grade: 11,
        severity: 'HIGH',
        evidence: {
          accuracyRate: 45,
          failedAttemptsCount: 2,
          lastFailedDate: new Date().toISOString(),
          missingPrerequisites: ['Vector Algebra, Dot Product, and Cross Product'],
          sampleMistakeConcept: 'Resolving velocity vectors into independent horizontal and vertical components',
        },
        detectedAt: new Date().toISOString(),
        status: 'ACTIVE',
      };
      list.push(sampleWeak);
      localStorage.setItem(`nur_weak_${studentId}_${sampleWeak.topicId}`, JSON.stringify(sampleWeak));
    }

    return list;
  }

  public async getStudentAlerts(studentId: string): Promise<LearningAlertRecord[]> {
    const list: LearningAlertRecord[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`nur_alert_${studentId}_`)) {
        try {
          const item = JSON.parse(localStorage.getItem(key) || '{}');
          if (item.status === 'ACTIVE') list.push(item);
        } catch {}
      }
    }

    if (list.length === 0) {
      const sampleAlert: LearningAlertRecord = {
        id: `alert_${studentId}_prereq1`,
        studentId,
        type: 'PREREQUISITE_GAP',
        severity: 'CRITICAL',
        title: 'Prerequisite Gap in Grade 11 Physics',
        message: 'Projectile Motion requires vector decomposition mastery. Current accuracy is below the 65% requirement.',
        suggestedAction: 'Complete the Vector Algebra booster module before continuing the next kinematics problem set.',
        evidence: {
          topicId: 'g11_phy_u1_l1',
          subject: 'Physics',
        },
        createdAt: new Date().toISOString(),
        status: 'ACTIVE',
      };
      list.push(sampleAlert);
      localStorage.setItem(`nur_alert_${studentId}_${sampleAlert.id}`, JSON.stringify(sampleAlert));
    }

    return list;
  }

  // =========================================================================
  // 9. TEACHER CLASSROOM ANALYTICS
  // =========================================================================
  public async getTeacherClassroomAnalytics(classId: string = 'class_9a'): Promise<TeacherClassroomAnalytics> {
    return {
      classId,
      className: 'Grade 11 Natural Science (Section A)',
      grade: 11,
      totalStudents: 42,
      averageMasteryScore: 71,
      studentsNeedingSupportCount: 6,
      commonWeakTopics: [
        {
          topicId: 'g11_phy_u1_l1',
          topicTitle: '2D Kinematics and Projectile Motion Analysis',
          subject: 'Physics',
          affectedStudentsCount: 14,
          averageScore: 48,
        },
        {
          topicId: 'g11_math_u2_l1',
          topicTitle: 'Vector Algebra, Dot Product, and Cross Product',
          subject: 'Mathematics',
          affectedStudentsCount: 11,
          averageScore: 54,
        },
        {
          topicId: 'g11_math_u1_l1',
          topicTitle: 'Arithmetic and Geometric Sequences & Infinite Series',
          subject: 'Mathematics',
          affectedStudentsCount: 7,
          averageScore: 61,
        }
      ],
      atRiskStudents: [
        {
          studentId: 'std_101',
          displayName: 'Yared Tesfaye',
          weakTopicsCount: 4,
          averageScore: 46,
          lastActive: '1 hour ago',
          primaryNeed: 'Prerequisite Gap: Vector dot product & kinematics',
        },
        {
          studentId: 'std_102',
          displayName: 'Bethlehem Haile',
          weakTopicsCount: 3,
          averageScore: 51,
          lastActive: '3 hours ago',
          primaryNeed: 'Declining quiz accuracy in Quadratic Functions',
        },
        {
          studentId: 'std_103',
          displayName: 'Dawit Abebe',
          weakTopicsCount: 3,
          averageScore: 53,
          lastActive: 'Yesterday',
          primaryNeed: 'Missed practice activities for 4 consecutive days',
        },
        {
          studentId: 'std_104',
          displayName: 'Samrawit Bekele',
          weakTopicsCount: 2,
          averageScore: 58,
          lastActive: '2 days ago',
          primaryNeed: 'Formulas application in projectile motion',
        }
      ]
    };
  }

  // =========================================================================
  // 10. SUPER ADMIN AGGREGATED SYSTEM ANALYTICS
  // =========================================================================
  public async getSuperAdminSystemAnalytics(): Promise<SuperAdminAggregatedAnalytics> {
    return {
      totalStudents: 14820,
      activeStudentsToday: 3240,
      activeStudentsThisWeek: 11450,
      gradeDistribution: {
        9: 4120,
        10: 3950,
        11: 3480,
        12: 3270,
      },
      averageMasteryBySubject: {
        'Mathematics': 68,
        'Physics': 63,
        'Chemistry': 72,
        'Biology': 77,
        'English': 79,
        'Economics': 74,
        'Geography': 81,
        'History': 84,
        'Information Technology': 86,
      },
      systemWideWeakTopics: [
        {
          topicId: 'g12_math_u1_l1',
          topicTitle: 'Limits, Continuity, and Asymptotic Behavior',
          subject: 'Mathematics',
          grade: 12,
          studentCount: 1840,
        },
        {
          topicId: 'g11_phy_u1_l1',
          topicTitle: '2D Kinematics and Projectile Motion Analysis',
          subject: 'Physics',
          grade: 11,
          studentCount: 1620,
        },
        {
          topicId: 'g10_math_u2_l1',
          topicTitle: 'Quadratic Functions & Parabola Vertex Form',
          subject: 'Mathematics',
          grade: 10,
          studentCount: 1290,
        },
        {
          topicId: 'g12_eng_u1_l1',
          topicTitle: 'Conditional Clauses, Inversion, and Wish Structures',
          subject: 'English',
          grade: 12,
          studentCount: 980,
        }
      ],
      averageQuizScore: 73.4,
      averageExamScore: 69.8,
      criticalAlertsCount: 412,
      overallCompletionRate: 64.2,
    };
  }

  // AI Tutor Context Builder for integration with Part 4
  public async buildAITutorPedagogicalContext(studentId: string, currentTopicId?: string): Promise<string> {
    const weakTopics = await this.getStudentWeakTopics(studentId);
    const activeAlerts = await this.getStudentAlerts(studentId);

    let context = `[NUR AI KNOWLEDGE MAP & LEARNING PROFILE]\n`;
    if (weakTopics.length > 0) {
      context += `ACTIVE WEAK TOPICS: ${weakTopics.map((w) => `${w.topicTitle} (${w.subject}, Severity: ${w.severity})`).join('; ')}\n`;
    }
    if (activeAlerts.length > 0) {
      context += `ACTIVE ACADEMIC ALERTS: ${activeAlerts.map((a) => a.title).join('; ')}\n`;
    }

    if (currentTopicId) {
      const prereqCheck = await this.checkPrerequisiteGaps(studentId, currentTopicId);
      if (prereqCheck.gapsExist) {
        context += `PREREQUISITE GAP ALERT: Student has not mastered prerequisites for this topic (${prereqCheck.missingPrerequisites.map((p) => p.title).join(', ')}). INSTRUCTION FOR AI TUTOR: Gently break down the prerequisite concepts first using everyday Ethiopian context before advancing into complex derivations.\n`;
      }
    }

    return context;
  }
}

export const knowledgeMapService = new KnowledgeMapService();
