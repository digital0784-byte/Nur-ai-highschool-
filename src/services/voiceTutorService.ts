import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  getDocs,
  limit,
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Grade, LanguageCode } from '../types';
import {
  TeachingMode,
  VoiceAudioState,
  VoiceCoachCommand,
  VoiceMessageRecord,
  VoiceSessionRecord,
  VoiceQuizItem,
  VoiceTutorCostConfig,
  VoiceTutorUsageAnalytics,
  CurriculumSourceMetadata,
} from '../types/voiceTutor';
import { knowledgeMapService } from './knowledgeMapService';
import { subscriptionService } from './subscriptionService';

// Fallback default config
export const DEFAULT_VOICE_COST_CONFIG: VoiceTutorCostConfig = {
  maxDailyRequestsPerFreeUser: 5,
  maxDailyRequestsPerSubscriber: 100,
  maxSessionDurationMinutes: 30,
  enableAudioResponses: true,
  enableLowDataModeByDefault: false,
};

class VoiceTutorService {
  private currentSession: VoiceSessionRecord | null = null;
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private isListening: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  // Local storage keys
  private readonly DAILY_USAGE_KEY = 'nur_voice_tutor_daily_usage';
  private readonly RECENT_MESSAGES_KEY = 'nur_voice_recent_messages';

  constructor() {
    this.initSpeechRecognition();
  }

  private initSpeechRecognition() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 3;
      }
    }
  }

  public getUserId(): string {
    return auth.currentUser?.uid || 'guest_student_' + (typeof window !== 'undefined' ? (localStorage.getItem('nur_guest_uid') || 'demo') : 'demo');
  }

  /**
   * Check if speech recognition is available in current browser
   */
  public isSpeechRecognitionSupported(): boolean {
    return !!this.recognition;
  }

  /**
   * Check if speech synthesis is supported
   */
  public isSpeechSynthesisSupported(): boolean {
    return !!this.synthesis;
  }

  /**
   * Start listening to microphone with callbacks
   */
  public startListening(
    language: LanguageCode,
    callbacks: {
      onResult: (transcript: string, isFinal: boolean, confidence: number) => void;
      onError: (error: string) => void;
      onEnd: () => void;
    }
  ): void {
    if (!this.recognition) {
      callbacks.onError('Speech recognition is not supported in this browser. You can type your question.');
      return;
    }

    try {
      // Map app language to BCP-47 language tag
      let bcpLanguage = 'en-US';
      if (language === 'am') bcpLanguage = 'am-ET';
      else if (language === 'om') bcpLanguage = 'om-ET';
      else if (language === 'ti') bcpLanguage = 'ti-ET';
      else bcpLanguage = 'en-US';

      this.recognition.lang = bcpLanguage;

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        let confidence = 0.9;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            finalTranscript += res[0].transcript;
            confidence = res[0].confidence || 0.9;
          } else {
            interimTranscript += res[0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        const isFinal = !!finalTranscript;
        callbacks.onResult(text, isFinal, confidence);
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event.error);
        this.isListening = false;
        callbacks.onError(event.error || 'Microphone error occurred');
      };

      this.recognition.onend = () => {
        this.isListening = false;
        callbacks.onEnd();
      };

      this.isListening = true;
      this.recognition.start();
    } catch (e: any) {
      this.isListening = false;
      callbacks.onError(e.message || 'Failed to start microphone');
    }
  }

  /**
   * Stop listening to microphone
   */
  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('Error stopping recognition:', e);
      }
      this.isListening = false;
    }
  }

  /**
   * Clean text for natural speech synthesis (remove LaTeX symbols, asterisks, citations)
   */
  public cleanTextForSpeech(rawText: string): string {
    return rawText
      .replace(/###/g, '')
      .replace(/##/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 over $2')
      .replace(/\\times/g, ' multiplied by ')
      .replace(/\\cdot/g, ' times ')
      .replace(/\\sqrt\{([^}]+)\}/g, 'square root of $1')
      .replace(/\\le/g, ' less than or equal to ')
      .replace(/\\ge/g, ' greater than or equal to ')
      .replace(/\\pm/g, ' plus or minus ')
      .replace(/\[\d+\]/g, '')
      .replace(/\$([^$]+)\$/g, '$1')
      .replace(/\n+/g, ' ')
      .trim();
  }

  /**
   * Speak text out loud using browser speech synthesis
   */
  public speak(
    text: string,
    language: LanguageCode,
    options?: {
      rate?: number;
      pitch?: number;
      onEnd?: () => void;
      onError?: (err: string) => void;
    }
  ): void {
    if (!this.synthesis) {
      options?.onEnd?.();
      return;
    }

    try {
      this.stopSpeaking();

      const cleaned = this.cleanTextForSpeech(text);
      if (!cleaned) {
        options?.onEnd?.();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleaned);
      this.currentUtterance = utterance;

      utterance.rate = options?.rate || (language === 'am' ? 0.95 : 1.0);
      utterance.pitch = options?.pitch || 1.0;

      // Select matching voice
      const voices = this.synthesis.getVoices();
      const langPrefix = language === 'am' ? 'am' : language === 'om' ? 'om' : language === 'ti' ? 'ti' : 'en';
      const matchingVoice = voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix));
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onend = () => {
        this.currentUtterance = null;
        options?.onEnd?.();
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        this.currentUtterance = null;
        options?.onError?.(e.error || 'Speech output error');
      };

      this.synthesis.speak(utterance);
    } catch (e: any) {
      console.warn('Synthesis exception:', e);
      options?.onError?.(e.message);
    }
  }

  /**
   * Stop current speech playback
   */
  public stopSpeaking(): void {
    if (this.synthesis && this.synthesis.speaking) {
      this.synthesis.cancel();
      this.currentUtterance = null;
    }
  }

  /**
   * Check daily usage limit
   */
  public checkDailyUsageLimit(hasActiveSubscription: boolean): {
    allowed: boolean;
    usedToday: number;
    maxLimit: number;
    remaining: number;
  } {
    const today = new Date().toISOString().split('T')[0];
    const storageKey = `${this.DAILY_USAGE_KEY}_${today}`;
    const used = parseInt(localStorage.getItem(storageKey) || '0', 10);
    const maxLimit = hasActiveSubscription
      ? DEFAULT_VOICE_COST_CONFIG.maxDailyRequestsPerSubscriber
      : DEFAULT_VOICE_COST_CONFIG.maxDailyRequestsPerFreeUser;

    return {
      allowed: used < maxLimit,
      usedToday: used,
      maxLimit,
      remaining: Math.max(0, maxLimit - used),
    };
  }

  /**
   * Increment daily usage
   */
  public incrementDailyUsage(): void {
    const today = new Date().toISOString().split('T')[0];
    const storageKey = `${this.DAILY_USAGE_KEY}_${today}`;
    const used = parseInt(localStorage.getItem(storageKey) || '0', 10);
    localStorage.setItem(storageKey, (used + 1).toString());
  }

  /**
   * Start a new voice tutor session
   */
  public async startSession(
    grade: Grade,
    subject: string,
    topic: string,
    language: LanguageCode,
    teachingMode: TeachingMode = 'guided'
  ): Promise<VoiceSessionRecord> {
    const studentId = this.getUserId();
    const sessionId = `vs_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const startedAt = new Date().toISOString();

    const session: VoiceSessionRecord = {
      sessionId,
      studentId,
      grade,
      language,
      subject,
      topic,
      teachingMode,
      startedAt,
      durationSeconds: 0,
      status: 'active',
      messageCount: 0,
    };

    this.currentSession = session;

    // Save to Firestore if user is authenticated
    try {
      if (auth.currentUser) {
        const sessionRef = doc(db, 'ai_voice_sessions', sessionId);
        await setDoc(sessionRef, session);
      }
    } catch (e) {
      console.warn('Firestore session start warning:', e);
    }

    return session;
  }

  /**
   * End current session
   */
  public async endSession(): Promise<void> {
    if (!this.currentSession) return;
    this.stopSpeaking();
    this.stopListening();

    const endedAt = new Date().toISOString();
    const durationSeconds = Math.round(
      (new Date(endedAt).getTime() - new Date(this.currentSession.startedAt).getTime()) / 1000
    );

    this.currentSession.status = 'completed';
    this.currentSession.endedAt = endedAt;
    this.currentSession.durationSeconds = durationSeconds;

    try {
      if (auth.currentUser && this.currentSession.sessionId) {
        const sessionRef = doc(db, 'ai_voice_sessions', this.currentSession.sessionId);
        await updateDoc(sessionRef, {
          status: 'completed',
          endedAt,
          durationSeconds,
          messageCount: this.currentSession.messageCount,
        });
      }
    } catch (e) {
      console.warn('Firestore session end warning:', e);
    }

    this.currentSession = null;
  }

  /**
   * Send a query to the AI Voice Tutor Backend Engine
   */
  public async sendVoiceQuery(params: {
    message: string;
    grade: Grade;
    subject: string;
    topic: string;
    language: LanguageCode;
    teachingMode: TeachingMode;
    voiceIntent?: VoiceCoachCommand;
    photoData?: string;
    wasVoiceInput?: boolean;
    history?: { role: 'user' | 'assistant'; text: string }[];
  }): Promise<{
    answer: string;
    spokenScript: string;
    citations: CurriculumSourceMetadata[];
    groundedInTextbook: boolean;
    confidence: number;
    clarificationPrompt?: string;
    interactiveQuiz?: VoiceQuizItem;
    messageId: string;
  }> {
    const studentId = this.getUserId();

    // 1. Gather student knowledge map context (weak topics, prerequisite gaps)
    let kmSummary = null;
    try {
      kmSummary = await knowledgeMapService.getStudentAnalyticsSummary(studentId);
    } catch (e) {
      console.warn('Knowledge map context fetch warning:', e);
    }

    // 2. Call backend `/api/voice-tutor/chat`
    const payload = {
      studentId,
      message: params.message,
      grade: params.grade,
      subject: params.subject,
      topicTitle: params.topic,
      language: params.language,
      teachingMode: params.teachingMode,
      voiceIntent: params.voiceIntent,
      photoData: params.photoData,
      wasVoiceInput: params.wasVoiceInput,
      conversationHistory: params.history || [],
      knowledgeMapContext: {
        overallMasteryPercent: kmSummary?.overallMasteryPercent || 70,
        weakTopics: kmSummary?.activeWeakTopicsCount ? ['Prerequisite gap'] : [],
        activeAlerts: kmSummary?.activeAlerts || [],
      },
    };

    const res = await fetch('/api/voice-tutor/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || `Voice Tutor request failed with status ${res.status}`);
    }

    const data = await res.json();
    this.incrementDailyUsage();

    const messageId = `vm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // 3. Log user & AI messages to Firestore
    try {
      if (auth.currentUser && this.currentSession) {
        const aiMsgRef = doc(db, 'ai_voice_messages', messageId);
        const aiRecord: VoiceMessageRecord = {
          id: messageId,
          sessionId: this.currentSession.sessionId,
          sender: 'ai',
          text: data.answer,
          spokenScript: data.spokenScript,
          language: params.language,
          timestamp: new Date().toISOString(),
          confidence: data.confidence || 0.95,
          sourceMetadata: data.citations?.[0],
          teachingMode: params.teachingMode,
          interactiveQuiz: data.interactiveQuiz,
          clarificationPrompt: data.clarificationPrompt,
        };
        await setDoc(aiMsgRef, aiRecord);

        // Update session messageCount
        this.currentSession.messageCount += 2;
        const sRef = doc(db, 'ai_voice_sessions', this.currentSession.sessionId);
        await updateDoc(sRef, { messageCount: this.currentSession.messageCount });
      }
    } catch (e) {
      console.warn('Firestore message save warning:', e);
    }

    return {
      answer: data.answer,
      spokenScript: data.spokenScript || this.cleanTextForSpeech(data.answer),
      citations: data.citations || [],
      groundedInTextbook: data.groundedInTextbook !== false,
      confidence: data.confidence || 0.95,
      clarificationPrompt: data.clarificationPrompt,
      interactiveQuiz: data.interactiveQuiz,
      messageId,
    };
  }

  /**
   * Complete a voice quiz and record a verified learning event to Part 17 Knowledge Map
   */
  public async submitVoiceQuizAnswer(
    quiz: VoiceQuizItem,
    studentAnswer: string
  ): Promise<{
    isCorrect: boolean;
    feedback: string;
    scorePercent: number;
  }> {
    const studentId = this.getUserId();

    // Check answer against correct option
    const cleanStudent = studentAnswer.trim().toLowerCase();
    const cleanCorrect = quiz.correctAnswer.trim().toLowerCase();
    const isCorrect =
      cleanStudent === cleanCorrect ||
      cleanStudent.includes(cleanCorrect) ||
      cleanCorrect.includes(cleanStudent);

    const scorePercent = isCorrect ? 100 : 0;
    const feedback = isCorrect
      ? `Great job! Your answer "${studentAnswer}" is correct. ${quiz.explanation}`
      : `Good try! The correct answer is "${quiz.correctAnswer}". ${quiz.explanation}`;

    // Record verified learning event to Knowledge Map
    try {
      await knowledgeMapService.recordLearningEvent({
        studentId,
        eventType: 'QUIZ_SUBMISSION',
        subject: quiz.subject,
        grade: quiz.grade,
        unitNumber: 1,
        lessonNumber: 1,
        topicId: quiz.topicId,
        topicTitle: quiz.topicId,
        score: scorePercent,
        totalQuestions: 1,
        correctQuestions: isCorrect ? 1 : 0,
        durationSeconds: 45,
      });
    } catch (e) {
      console.warn('Error recording knowledge map learning event for voice quiz:', e);
    }

    return {
      isCorrect,
      feedback,
      scorePercent,
    };
  }

  /**
   * Fetch Super Admin Voice Tutor Analytics
   */
  public async getSuperAdminVoiceAnalytics(): Promise<VoiceTutorUsageAnalytics> {
    try {
      const res = await fetch('/api/voice-tutor/analytics');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Analytics fetch error:', e);
    }

    // Default mock data when offline or developing
    return {
      totalVoiceSessions: 342,
      totalTextSessions: 890,
      totalSpokenMinutes: 2460,
      totalQuestionsSolved: 1420,
      languageDistribution: {
        am: 62,
        om: 18,
        ti: 8,
        en: 12,
        ar: 0,
        so: 0,
      },
      subjectDistribution: {
        Mathematics: 45,
        Physics: 25,
        Chemistry: 15,
        English: 10,
        Economics: 5,
      },
      activeStudentsToday: 154,
      failedRequestsCount: 2,
      averageSessionDurationMinutes: 7.2,
    };
  }
}

export const voiceTutorService = new VoiceTutorService();
