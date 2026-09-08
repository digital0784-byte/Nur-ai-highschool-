import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { ethiopianCurriculumEngine } from './src/engine/curriculumRegistry';
import { ethiopianAITutorEngine } from './src/engine/aiTutorEngine';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lazy initialization of GoogleGenAI
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', hasGeminiKey: !!process.env.GEMINI_API_KEY });
  });

  // 1. AI Chapter Analysis Endpoint
  app.post('/api/ai/analyze-chapter', async (req, res) => {
    try {
      const {
        subjectName,
        grade,
        unitNumber,
        unitTitle,
        sectionTitle,
        content,
        language = 'am',
      } = req.body;

      const ai = getAI();
      const langPrompt =
        language === 'en'
          ? 'Respond in clear, professional English.'
          : language === 'om'
          ? 'Respond in Afaan Oromoo with English key terms in parentheses.'
          : language === 'ti'
          ? 'Respond in Tigrinya with English key terms in parentheses.'
          : language === 'ar'
          ? 'Respond in Arabic with English key terms in parentheses.'
          : language === 'so'
          ? 'Respond in Somali with English key terms in parentheses.'
          : 'Respond in fluent Amharic (አማርኛ) with key technical/scientific terms included in English in parentheses where helpful.';

      if (ai) {
        const prompt = `You are a distinguished Ethiopian High School Master Teacher and Curriculum Expert specializing in the FDRE Ministry of Education New Secondary Curriculum (Grades 9-12).

Provide a comprehensive, high-yield AI Pedagogical Analysis for:
- Subject: ${subjectName} (Grade ${grade})
- Unit ${unitNumber}: ${unitTitle}
- Section / Topic: ${sectionTitle || 'General Chapter Overview'}
- Textbook Excerpt / Concepts:
${Array.isArray(content) ? content.join('\n') : content || 'Standard curriculum concepts'}

Please structure your response into the following clear Markdown sections:
### 1. 🎯 የፅንሰ-ሀሳቡ ዋና ፍሬ ነገር (Core Conceptual Breakdown)
Explain the foundational concept simply and deeply using intuitive everyday analogies.

### 2. 💡 ቀመር እና ሳይንሳዊ መርሆዎች (Formulas & Key Laws)
Detail the mathematical equations, scientific laws, or core principles with clear variable explanations and units.

### 3. 🇪🇹 በኢትዮጵያ ነባራዊ ሁኔታ ተግባራዊ መገለጫ (Ethiopian Context & Real-World Application)
Provide concrete examples of how this concept applies in Ethiopia (e.g. GERD hydroelectricity, Ethiopian agriculture, regional geology, health, technology, industry).

### 4. ⚠️ ተማሪዎች በፈተና የሚሰሯቸው የተለመዱ ስህተቶች (Common Pitfalls & Exam Traps)
Highlight frequent student misconceptions and how to avoid them in national (ESSLCE) or school exams.

### 5. 🚀 የብቃት ማረጋገጫ የፈተና ጥያቄዎች (Mastery Check Questions)
Give 2 high-yield exam-style practice questions with step-by-step solutions and explanations.

${langPrompt}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
        });

        return res.json({
          analysis: response.text,
          modelUsed: 'gemini-3.7-flash',
          status: 'success',
        });
      } else {
        // Fallback pedagogical analysis
        return res.json({
          analysis: `### 1. 🎯 የፅንሰ-ሀሳቡ ዋና ፍሬ ነገር (Core Conceptual Breakdown)
ይህ ምዕራፍ **${subjectName} - ክፍል ${grade} (${unitTitle})** በኢትዮጵያ አዲሱ ስርዓተ-ትምህርት መሰረት የተቀረፀ ሲሆን፣ ተማሪዎች በንድፈ-ሀሳብ እና በተግባር የተደገፈ ጥልቅ ግንዛቤ እንዲያገኙ ታስቦ የተዘጋጀ ነው።

### 2. 💡 ቀመር እና ሳይንሳዊ መርሆዎች (Formulas & Key Laws)
- የርዕሰ ጉዳዩ ዋና ዋና መርሆዎች ደረጃ በደረጃ ተተንትነዋል።
- ቁልፍ የሆኑ ህጎች እና ፎርሙላዎች በተግባራዊ ምሳሌዎች ተብራርተዋል።

### 3. 🇪🇹 በኢትዮጵያ ነባራዊ ሁኔታ ተግባራዊ መገለጫ (Ethiopian Context & Real-World Application)
ይህ ትምህርት በኢትዮጵያ ኢኮኖሚ፣ ግብርና፣ ታዳሽ ሃይል (እንደ ታላቁ የህዳሴ ግድብ) እና በዲጂታል ቴክኖሎጂ ውስጥ ቀጥተኛ ተፈፃሚነት አለው።

### 4. ⚠️ ተማሪዎች በፈተና የሚሰሯቸው የተለመዱ ስህተቶች (Common Pitfalls)
- ፅንሰ-ሀሳቦችን በቃላት ብቻ ከማስታወስ ይልቅ ምክንያታዊ ትስስራቸውን መረዳት ይገባል።
- ለሀገር አቀፍ የዩኒቨርሲቲ መግቢያ ፈተና (ESSLCE) የፅንሰ-ሀሳብ ጥያቄዎች ላይ ጥንቃቄ ማድረግ።

### 5. 🚀 የብቃት ማረጋገጫ የፈተና ጥያቄዎች (Mastery Check)
1. የዚህን ምዕራፍ ዋና መርህ በራስዎ ቃላት ያብራሩ?
2. በቀረቡት የተሰሩ ምሳሌዎች ላይ በመመስረት የልምምድ ጥያቄዎችን ይስሩ።`,
          modelUsed: 'offline-curriculum-engine',
          status: 'fallback',
        });
      }
    } catch (error: any) {
      console.error('Error in analyze-chapter:', error);
      res.status(500).json({ error: error.message || 'Analysis failed' });
    }
  });

  // 2. Interactive AI Student Tutor Chat (Context-aware of student review & weak areas)
  app.post('/api/ai/tutor-chat', async (req, res) => {
    try {
      const {
        messages,
        context,
        subjectName,
        grade,
        chapterTitle,
        topicTitle,
        language = 'am',
        weakAreas,
        studentReview,
      } = req.body;
      const ai = getAI();

      const effectiveSubject = context?.subjectName || subjectName || 'General';
      const effectiveGrade = context?.grade || grade || '9-12';
      const effectiveTopic = context?.unitTitle || chapterTitle || topicTitle || 'General Lesson';
      const effectiveSummary = context?.contentSummary || '';

      const langInstruction =
        language === 'en'
          ? 'Respond in clear, helpful English.'
          : language === 'om'
          ? 'Respond in Afaan Oromoo with English technical terms in brackets.'
          : language === 'ti'
          ? 'Respond in Tigrinya with English technical terms in brackets.'
          : language === 'ar'
          ? 'Respond in Arabic with English technical terms in brackets.'
          : language === 'so'
          ? 'Respond in Somali with English technical terms in brackets.'
          : 'Respond in encouraging, clear Amharic (አማርኛ). Use English technical terms in parentheses where appropriate.';

      let diagnosticContext = '';
      const identifiedWeakAreas = weakAreas || studentReview?.weakAreas;
      if (Array.isArray(identifiedWeakAreas) && identifiedWeakAreas.length > 0) {
        diagnosticContext = `
Student's Diagnostic Profile & Known Weak Areas (Inferred from Quiz & Lesson Records):
${identifiedWeakAreas.map((w: any, idx: number) => `${idx + 1}. [${w.subjectName || effectiveSubject}] ${w.topicTitle || w.topicId}: Inferred gap: ${w.missingConcept || 'Needs reinforcement'}. Remedy: ${w.remedy || 'Review fundamentals'}`).join('\n')}
Proactive Instruction: Be acutely aware of these weaknesses. If this is the start of the conversation, warmly greet the student acknowledging their recent learning effort, mention that you are their dedicated personal AI teacher, and ask if they'd like to work through their struggle with these specific concepts step-by-step.`;
      }

      if (ai && Array.isArray(messages) && messages.length > 0) {
        const systemPrompt = `You are an elite, caring Ethiopian High School Personal AI Teacher and Tutor. You serve as the student's personal instructor, guiding them through the Ethiopian New Secondary Curriculum without needing human intervention.
Current Classroom Context:
- Subject: ${effectiveSubject}
- Grade: ${effectiveGrade}
- Topic: ${effectiveTopic}
- Excerpt: ${effectiveSummary}
${diagnosticContext}

Teaching guidelines:
1. Explain step-by-step with intuitive clarity, using everyday Ethiopian life analogies where appropriate.
2. If solving a math/physics/chemistry problem, break down: Given, Required, Formula, Step-by-Step Calculation, and Sanity Check.
3. Be supportive, empathetic, and celebrate student breakthroughs.
4. If the student has made errors in related quiz concepts, guide them gently to realize where the misconception was.
5. ${langInstruction}`;

        const lastMessage = messages[messages.length - 1].content;
        const previousTurns = messages.slice(0, -1).map((m: any) => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`).join('\n');

        const prompt = `${systemPrompt}

Conversation History:
${previousTurns}

Student Question / Message: ${lastMessage}

Please provide your tutor response:`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
        });

        return res.json({
          reply: response.text,
          status: 'success',
        });
      } else {
        const greetingWeakness = Array.isArray(identifiedWeakAreas) && identifiedWeakAreas.length > 0
          ? ` በቅርብ ጊዜ በተመለከትኩት ግምገማ በ"${identifiedWeakAreas[0].topicTitle || identifiedWeakAreas[0].topicId}" ላይ አንዳንድ ክፍተቶች አሉ። በዚህ ዙሪያ አብረን እንለማመድ?`
          : ' የትኛውንም የትምህርት ጥያቄ፣ የቀመር ማብራሪያ ወይም የፈተና ጥያቄ ይጠይቁኝ፤ በደስታ አብራራሎታለሁ!';

        return res.json({
          reply: `ጤና ይስጥልኝ! የ${effectiveSubject} የግል AI አስተማሪዎ ነኝ።${greetingWeakness}`,
          status: 'fallback',
        });
      }
    } catch (error: any) {
      console.error('Error in tutor-chat:', error);
      res.status(500).json({ error: error.message || 'Tutor chat failed' });
    }
  });

  // 3. Chapter Objectives Assessment & Evaluation Endpoint
  app.post('/api/ai/evaluate-objectives', async (req, res) => {
    try {
      const {
        subjectName,
        grade,
        unitTitle,
        objectives = [],
        answers = [],
        score,
        total,
        language = 'am',
      } = req.body;

      const ai = getAI();
      const langPrompt =
        language === 'en'
          ? 'Provide the assessment feedback in English.'
          : 'Provide the assessment feedback in Amharic (አማርኛ).';

      if (ai) {
        const prompt = `You are an Ethiopian National Assessment Specialist evaluating a student's completion of a textbook chapter.
Subject: ${subjectName} (Grade ${grade})
Unit: ${unitTitle}
Student Test Score: ${score} out of ${total} (${Math.round((score / (total || 1)) * 100)}%)

Chapter Learning Objectives Tested:
${objectives.map((obj: string, i: number) => `${i + 1}. ${obj}`).join('\n')}

Student Performance on Questions:
${answers.map((a: any, i: number) => `Q${i + 1}: ${a.question} | Student Answered: ${a.selectedOption} (${a.isCorrect ? 'CORRECT' : 'INCORRECT'}) | Target Objective: ${a.objective || 'General'}`).join('\n')}

Provide a structured evaluation in Markdown:
### 1. 📊 የውጤት እና የብቃት ደረጃ ግምገማ (Mastery Level Summary)
Rate their mastery level (e.g. ከፍተኛ ብቃት / Excellent Mastery, መካከለኛ / Proficient, ተጨማሪ ክለሳ ያስፈልጋል / Needs Review) with encouraging feedback.

### 2. ✅ የተሳኩ የትምህርት ዓላማዎች (Mastered Objectives)
List which specific chapter objectives the student has solidly demonstrated.

### 3. ⚠️ ተጨማሪ ትኩረት የሚሹ ዓላማዎች (Objectives Requiring Review)
Identify any missed objectives and clearly explain the conceptual misunderstanding.

### 4. 📝 የጥናት እና የፈተና ዝግጅት መመሪያ (Targeted Study Roadmap)
Provide 3 concrete, actionable steps the student should take before moving to the next chapter.

${langPrompt}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
        });

        return res.json({
          evaluation: response.text,
          percentage: Math.round((score / (total || 1)) * 100),
          status: 'success',
        });
      } else {
        const percentage = Math.round((score / (total || 1)) * 100);
        return res.json({
          evaluation: `### 1. 📊 የውጤት እና የብቃት ደረጃ ግምገማ
ውጤትዎ: **${score}/${total} (${percentage}%)**
${percentage >= 75 ? '🎉 **ከፍተኛ የብቃት ደረጃ (Mastery Achieved)**! የዚህን ምዕራፍ ዋና ዋና ዓላማዎች በሚገባ ተረድተዋል።' : '📚 **መካከለኛ ደረጃ** - ምዕራፉን በድጋሚ በመከለስ ይበልጥ ማሳደግ ይችላሉ።'}

### 2. ✅ የተሳኩ የትምህርት ዓላማዎች
- በምዕራፉ የተካተቱትን መሰረታዊ ፅንሰ-ሀሳቦች በሚገባ መለየት ችለዋል።
- ለቀረቡት ፈተናዎች ትክክለኛ ምላሽ ሰጥተዋል።

### 3. 📝 የጥናት መመሪያ
1. ያልተመለሱትን ጥያቄዎች ማብራሪያ በድጋሚ ያንብቡ።
2. የፍላሽካርድ ልምምዱን በመጠቀም ፅንሰ-ሀሳቦችን ያጠናክሩ።
3. ወደ ቀጣዩ ምዕራፍ ይለፉ!`,
          percentage,
          status: 'fallback',
        });
      }
    } catch (error: any) {
      console.error('Error in evaluate-objectives:', error);
      res.status(500).json({ error: error.message || 'Evaluation failed' });
    }
  });

  // 4. Supplementary & Reference Book AI Analysis Endpoint
  app.post('/api/ai/analyze-supplementary', async (req, res) => {
    try {
      const {
        bookTitle,
        category,
        subjectName,
        grade,
        chapterTitle,
        content,
        language = 'am',
      } = req.body;

      const ai = getAI();
      const langPrompt =
        language === 'en'
          ? 'Respond in English.'
          : 'Respond in Amharic (አማርኛ) with English technical terms in parentheses.';

      if (ai) {
        const prompt = `You are a lead author of Ethiopian High School Supplementary Study Guides (like Extreme Series, Alpha, and ESSLCE National Exam Compendiums).

Provide an in-depth Supplementary Guide Analysis for:
- Reference Book: ${bookTitle} (${category})
- Target Subject & Grade: ${subjectName} (Grade ${grade})
- Chapter / Module: ${chapterTitle}
- Reference Excerpt: ${content || 'Comprehensive study guide materials'}

Structure your response into the following Markdown sections:
### 1. 📖 የዚህ አጋዥ መጽሐፍ ዋና ጠቀሜታ (Key Value & Objective)
Why is this supplementary material crucial for mastering this specific topic?

### 2. ⚡ ፈጣን የፈተና አሰራር ዘዴዎች (High-Speed Exam Tricks & Shortcuts)
Provide proven shortcut techniques, mnemonics, and formula tricks used by top-scoring ESSLCE students.

### 3. 🧠 የላቁ የፈተና ጥያቄዎች ትንታኔ (Advanced ESSLCE Model Analysis)
Analyze an advanced multi-step exam problem with complete step-by-step derivation.

### 4. 📌 ማጠቃለያ የቀመር ሰሌዳ (Formula Cheat Sheet & Summary Table)
List the indispensable formulas and definitions from this supplementary unit.

${langPrompt}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
        });

        return res.json({
          analysis: response.text,
          status: 'success',
        });
      } else {
        return res.json({
          analysis: `### 1. 📖 የዚህ አጋዥ መጽሐፍ ዋና ጠቀሜታ
ይህ **${bookTitle}** የተሰኘው አጋዥ መጽሐፍ ለ${subjectName} ክፍል ${grade} ተማሪዎች ንድፈ-ሀሳብን ከፈተና ጥያቄዎች ጋር አጣምሮ የሚያቀርብ ከፍተኛ ጠቀሜታ ያለው መመሪያ ነው።

### 2. ⚡ ፈጣን የፈተና አሰራር ዘዴዎች
- ፈጣን የስሌት መንገዶችና ቴክኒኮች ተካትተዋል።
- በሀገር አቀፍ የዩኒቨርሲቲ መግቢያ ፈተናዎች ላይ የሚደጋገሙ ዋና ዋና ነጥቦች ተለይተዋል።

### 3. 📌 ማጠቃለያ የቀመር ሰሌዳ
- በምዕራፉ ውስጥ የተካተቱትን ቀመሮች እና ህጎች በደብተርዎ ላይ በመጻፍ ይለማመዱ።`,
          status: 'fallback',
        });
      }
    } catch (error: any) {
      console.error('Error in analyze-supplementary:', error);
      res.status(500).json({ error: error.message || 'Analysis failed' });
    }
  });

  // 5. Video Lesson AI Summary & Notes Endpoint
  app.post('/api/ai/video-summary', async (req, res) => {
    try {
      const { videoTitle, subjectName, grade, timestamps = [], language = 'am' } = req.body;
      const ai = getAI();

      if (ai) {
        const prompt = `You are an Ethiopian educational multimedia specialist.
Create a comprehensive visual study guide and video summary for:
- Video Lesson: ${videoTitle}
- Subject: ${subjectName} (Grade ${grade})
- Timestamps & Topics Covered:
${timestamps.map((t: any) => `- ${t.time}: ${t.title}`).join('\n')}

Structure in Markdown:
### 1. 🎥 የቪዲዮ ትምህርቱ ዋና ጭብጥ (Key Visual Takeaways)
### 2. 🔬 የተብራሩ ተግባራዊና የላብራቶሪ ምልከታዎች (Demonstrations & Experiments)
### 3. 📝 የተማሪው ማስታወሻ (Essential Video Notes & Formulas)
### 4. ❓ ከቪዲዮው የሚነሱ የፈተና ጥያቄዎች (Check for Understanding)`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
        });

        return res.json({
          summary: response.text,
          visualNotes: response.text,
          status: 'success',
        });
      } else {
        const fallbackText = `### 1. 🎥 የቪዲዮ ትምህርቱ ዋና ጭብጥ
ይህ ቪዲዮ በ**${subjectName || 'የትምህርት'} - ክፍል ${grade || '9-12'} (${videoTitle})** ዙሪያ በምስል እና በድምጽ የተደገፈ ግልጽ ማብራሪያ ይሰጣል።

### 2. 🔬 የተብራሩ ተግባራዊ ምልከታዎች
- ፅንሰ-ሀሳቡ በገሃዱ አለም እንዴት እንደሚሰራ በቪዲዮው ላይ በዝርዝር ተመልክተናል።

### 3. 📝 የተማሪው ማስታወሻ
- ዋና ዋና ነጥቦችንና ቀመሮችን በማስታወሻ ደብተርዎ ይያዙ።`;

        return res.json({
          summary: fallbackText,
          visualNotes: fallbackText,
          status: 'fallback',
        });
      }
    } catch (error: any) {
      console.error('Error in video-summary:', error);
      res.status(500).json({ error: error.message || 'Video summary failed' });
    }
  });

  // 6. Interactive Organization & Concept Animation Generator Endpoint
  app.post('/api/ai/generate-animation-concept', async (req, res) => {
    try {
      const { topic, subjectName = 'General Science', grade = 10, language = 'am' } = req.body;
      const ai = getAI();

      if (ai && topic) {
        const prompt = `You are a high-level educational animator and Ethiopian curriculum visualizer.
Generate a structured JSON animation simulation script explaining any concept, organization, body system, state institution, or scientific mechanism:
Requested Concept / Organization: "${topic}"
Subject Context: ${subjectName} (Grade ${grade})
Language: ${language} (if 'am', all labels, narrations, roles and notes MUST be in natural, accurate Amharic with key terms in brackets).

CRITICAL: Return ONLY valid, raw JSON (no markdown ticks, no backticks, no wrapping text).
JSON format schema:
{
  "title": "string (Short descriptive Amharic title)",
  "conceptName": "string",
  "category": "string",
  "overview": "string (2-3 sentences explaining this system/organization)",
  "nodes": [
    {
      "id": "node1",
      "label": "string",
      "role": "string",
      "details": "string",
      "color": "string (hex color e.g. #2563EB, #DC2626, #16A34A, #D97706, #9333EA, #0891B2)",
      "iconName": "string (one of: 'Building', 'Atom', 'Zap', 'Shield', 'Users', 'Cpu', 'Layers', 'Boxes', 'Globe', 'CheckCircle', 'Activity', 'Eye', 'Compass')"
    }
  ],
  "stages": [
    {
      "step": 1,
      "title": "string (Phase 1 title)",
      "narration": "string (Detailed spoken narration explaining step 1)",
      "activeNodeIds": ["node1"],
      "particleFlowLabel": "string (e.g. 'የመረጃ ፍሰት', 'የኤሌክትሮን እንቅስቃሴ')",
      "keyInsight": "string"
    },
    {
      "step": 2,
      "title": "string (Phase 2 title)",
      "narration": "string (Detailed spoken narration explaining step 2)",
      "activeNodeIds": ["node1", "node2"],
      "particleFlowLabel": "string",
      "keyInsight": "string"
    },
    {
      "step": 3,
      "title": "string (Phase 3 title)",
      "narration": "string (Detailed spoken narration explaining step 3)",
      "activeNodeIds": ["node2", "node3"],
      "particleFlowLabel": "string",
      "keyInsight": "string"
    },
    {
      "step": 4,
      "title": "string (Phase 4 title - Final outcome/synergy)",
      "narration": "string (Detailed spoken narration explaining conclusion)",
      "activeNodeIds": ["node1", "node2", "node3"],
      "particleFlowLabel": "string",
      "keyInsight": "string"
    }
  ],
  "keyTakeaways": [
    "string (Point 1)",
    "string (Point 2)",
    "string (Point 3)"
  ]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
        });

        let jsonText = response.text?.trim() || '';
        if (jsonText.startsWith('```')) {
          jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/```$/, '').trim();
        }

        try {
          const parsed = JSON.parse(jsonText);
          return res.json({
            animationData: parsed,
            status: 'success',
          });
        } catch (parseError) {
          console.warn('JSON parse error on AI response, using smart structured fallback');
        }
      }

      // Offline / Fallback generator for topic
      const isGov = topic.includes('መንግስት') || topic.includes('ዴሞክራሲ') || topic.includes('state') || topic.includes('government');
      const isCell = topic.includes('ሕዋስ') || topic.includes('cell') || topic.includes('ባዮሎጂ') || topic.includes('bio');
      const isBank = topic.includes('ባንክ') || topic.includes('ንግድ') || topic.includes('ገበያ') || topic.includes('ኢኮኖሚ');

      let fallbackData;

      if (isGov) {
        fallbackData = {
          title: `የመንግስት ድርጅታዊ አወቃቀር እና የስልጣን ክፍፍል (${topic})`,
          conceptName: topic,
          category: 'Citizenship & Governance',
          overview: 'በዴሞክራሲያዊ ስርዓት የመንግስት ስልጣን በሶስት ራሳቸውን በቻሉ አካላት (ሕግ አውጪ፣ ሕግ አስፈፃሚ፣ እና ሕግ ተርጓሚ) መካከል ተከፋፍሎ የእርስ በርስ ቁጥጥር ይደረጋል።',
          nodes: [
            { id: 'leg', label: 'የህዝብ ተወካዮች ምክር ቤት (ሕግ አውጪ)', role: 'ህጎችን ያወጣል፣ በጀትን ያጸድቃል', details: 'የህዝብን ድምጽ በመወከል የሀገሪቱን ከፍተኛ ፖሊሲዎችና ህጎች ያጸድቃል።', color: '#2563EB', iconName: 'Building' },
            { id: 'exec', label: 'የሚኒስትሮች ምክር ቤት (ሕግ አስፈፃሚ)', role: 'ህግን ያስፈጽማል፣ ሀገርን ይመራል', details: 'በጠቅላይ ሚኒስትሩ የሚመራ ሆኖ የወጡትን አዋጆችና የልማት ስራዎች ይተገብራል።', color: '#16A34A', iconName: 'Shield' },
            { id: 'jud', label: 'ጠቅላይ ፍርድ ቤት (ሕግ ተርጓሚ)', role: 'ፍትህን ያስከብራል፣ ህግን ይተረጉማል', details: 'የዳኝነት ነፃነቱን ጠብቆ ህገ-መንግስታዊ ስርዓቱ እና ሰብአዊ መብቶች እንዲከበሩ ይሰራል', color: '#9333EA', iconName: 'Compass' },
            { id: 'public', label: 'የኢትዮጵያ ህዝብ እና ህብረተሰብ', role: 'የስልጣን ባለቤት እና ድምጽ ሰጪ', details: 'በምርጫ ተወካዮቹን ይመርጣል፣ የመንግስትን ስራዎች ይከታተላል።', color: '#D97706', iconName: 'Users' },
          ],
          stages: [
            { step: 1, title: 'የህዝብ ተሳትፎ እና ውክልና', narration: 'ህዝቡ በምርጫ ወቅት ተወካዮቹን በመምረጥ የመንግስት ምስረታን ይጀምራል። ይህ የዴሞክራሲ መሰረት ነው።', activeNodeIds: ['public', 'leg'], particleFlowLabel: 'የድምጽ ውክልና ፍሰት', keyInsight: 'ስልጣን ከህዝብ ይመነጫል' },
            { step: 2, title: 'የህግ ረቂቅ ማዘጋጀትና ማጽደቅ', narration: 'ሕግ አውጪው ምክር ቤት ሀገራዊ አዋጆችን እና በጀቶችን መርምሮ ያጸድቃል።', activeNodeIds: ['leg', 'exec'], particleFlowLabel: 'የህግ ማዕቀፍ እና የፖሊሲ ፍሰት', keyInsight: 'የህግ የበላይነት ይረጋገጣል' },
            { step: 3, title: 'ህጎችን በተግባር ማዋል እና አገልግሎት መስጠት', narration: 'ሕግ አስፈፃሚው አካል ትምህርት፣ ጤና፣ መንገድ እና የፀጥታ ስራዎችን በወጣው ህግ መሰረት ያከናውናል።', activeNodeIds: ['exec', 'public'], particleFlowLabel: 'የልማት አገልግሎት ፍሰት', keyInsight: 'ፈጣንና ፍትሃዊ አገልግሎት' },
            { step: 4, title: 'የእርስ በርስ ቁጥጥር እና ፍትህ (Checks & Balances)', narration: 'ፍርድ ቤቶች እና የቁጥጥር ተቋማት ሁሉም አካላት በህጉ ገደብ መስራታቸውን ይቆጣጠራሉ።', activeNodeIds: ['jud', 'exec', 'leg'], particleFlowLabel: 'የህገ-መንግስት ቁጥጥር ፍሰት', keyInsight: 'የስልጣን አለአግባብ መዋል ይከላከላል' },
          ],
          keyTakeaways: [
            'የስልጣን ክፍፍል የአምባገነንነት አደጋን ይከላከላል።',
            'ሶስቱም አካላት ተቀናጅተው ግን ነፃነታቸውን ጠብቀው ይሰራሉ።',
            'ዋናው የስልጣን ባለቤት ህዝብ ነው።'
          ]
        };
      } else if (isBank) {
        fallbackData = {
          title: `የፋይናንስ እና የባንክ ድርጅታዊ አሰራር (${topic})`,
          conceptName: topic,
          category: 'Economics & Business',
          overview: 'የፋይናንስ ስርዓት የገንዘብ ዝውውርን፣ ብድርን፣ ቁጠባን እና ዲጂታል ክፍያን በብሔራዊ ባንክ ቁጥጥር ስር አቀናጅቶ የሚመራ የኢኮኖሚ ምሰሶ ነው።',
          nodes: [
            { id: 'nbe', label: 'የኢትዮጵያ ብሔራዊ ባንክ (NBE)', role: 'የፋይናንስ ተቆጣጣሪ እና የፖሊሲ አውጪ', details: 'የገንዘብ ፖሊሲን ይቀርጻል፣ የዋጋ ግሽበትን ይቆጣጠራል፣ የባንኮችን ፈቃድ ይሰጣል።', color: '#DC2626', iconName: 'Building' },
            { id: 'banks', label: 'የንግድ ባንኮች (Commercial Banks)', role: 'ቁጠባ፣ ብድር እና የውጭ ምንዛሪ አገልግሎት', details: 'ከህዝብ ገንዘብ ይሰበስባሉ፣ ለልማትና ንግድ ስራዎች ብድር ያቀርባሉ።', color: '#2563EB', iconName: 'Layers' },
            { id: 'digital', label: 'ዲጂታል የክፍያ ስርዓቶች (Telebirr/EthSwitch)', role: 'ፈጣን የኤሌክትሮኒክስ ዝውውር', details: 'በስልክና ካርድ ፈጣን የገንዘብ ዝውውርን በማስቻል ኢኮኖሚውን ያቀላጥፋል።', color: '#16A34A', iconName: 'Zap' },
            { id: 'customers', label: 'ነጋዴዎች፣ ገበሬዎች እና ሸማቾች', role: 'የኢኮኖሚ አንቀሳቃሽ ተዋናዮች', details: 'ገንዘብ ይቆጥባሉ፣ ይበደራሉ፣ የገበያ ግብይት ያከናውናሉ።', color: '#D97706', iconName: 'Users' }
          ],
          stages: [
            { step: 1, title: 'የገንዘብ ፖሊሲ እና ቁጥጥር', narration: 'ብሔራዊ ባንክ የሀገሪቱን የገንዘብ መጠንና የቁጥጥር መመሪያ ለባንኮች ያስተላልፋል።', activeNodeIds: ['nbe', 'banks'], particleFlowLabel: 'የፖሊሲ እና የጥሬ ገንዘብ ፍሰት', keyInsight: 'የፋይናንስ መረጋጋት' },
            { step: 2, title: 'የቁጠባ ማሰባሰብ እና ተቀማጭ', narration: 'ህዝቡና ድርጅቶች ገንዘባቸውን በባንኮች ውስጥ በማስቀመጥ የወለድ ገቢ ያገኛሉ።', activeNodeIds: ['customers', 'banks'], particleFlowLabel: 'የተቀማጭ ገንዘብ ፍሰት', keyInsight: 'የሀገር ውስጥ ቁጠባ ማደግ' },
            { step: 3, title: 'የኢንቨስትመንት ብድር እና ልማት', narration: 'ባንኮች የተሰበሰበውን ገንዘብ ለፋብሪካዎች፣ ለግብርና እና ለአገልግሎት ዘርፍ በብድር መልክ ያቀርባሉ።', activeNodeIds: ['banks', 'customers'], particleFlowLabel: 'የብድር እና የልማት ካፒታል', keyInsight: 'የስራ እድል እና ምርት ማደግ' },
            { step: 4, title: 'ፈጣን ዲጂታል ግብይት እና ክትትል', narration: 'በስልክ እና በኤሌክትሮኒክስ የሚደረግ ግብይት የገንዘብ ዝውውርን በሰከንዶች ውስጥ ያጠናቅቃል።', activeNodeIds: ['digital', 'customers', 'banks', 'nbe'], particleFlowLabel: 'የዲጂታል መረጃና ገንዘብ ፍሰት', keyInsight: 'ዘመናዊ ጥሬ-ገንዘብ አልባ ኢኮኖሚ' }
          ],
          keyTakeaways: [
            'ባንኮች የገንዘብ አቅርቦትን እና ፍላጎትን የሚያገናኙ ድልድዮች ናቸው።',
            'ዲጂታል ክፍያ የግብይት ወጪንና ጊዜን በእጅጉ ይቀንሳል።',
            'ብሔራዊ ባንክ የገንዘብ ዋጋን የመጠበቅ ሃላፊነት አለበት።'
          ]
        };
      } else {
        fallbackData = {
          title: `የ${topic} ድርጅታዊ አወቃቀር እና የክፍሎች ቅንጅት`,
          conceptName: topic,
          category: subjectName,
          overview: `የ${topic} ድርጅታዊ መዋቅር እያንዳንዱ ክፍል የራሱን ልዩ ተግባር በማከናወን አጠቃላይ ስርዓቱ በተቀናጀ መልኩ እንዲሰራ የሚያስችል ነው።`,
          nodes: [
            { id: 'n1', label: `ዋና መሪ / መቆጣጠሪያ ማዕከል (${topic})`, role: 'የስርዓቱ ዋና መመሪያ እና እቅድ አውጪ', details: 'ሁሉንም ክፍሎች ያስተባብራል፣ መረጃ ይሰበስባል፣ ውሳኔ ይሰጣል።', color: '#2563EB', iconName: 'Cpu' },
            { id: 'n2', label: 'የሃይል እና ግብአት ማቀነባበሪያ ክፍል', role: 'አስፈላጊ ግብአቶችንና ጉልበትን ያቀርባል', details: 'ስርዓቱ ሳይቋረጥ እንዲንቀሳቀስ የሚያስፈልጉ ንጥረ ነገሮችን ያዘጋጃል።', color: '#DC2626', iconName: 'Zap' },
            { id: 'n3', label: 'የማምረቻ እና ተግባር ማከናወኛ ክፍል', role: 'ዋናውን ምርት ወይም ስራ ይሰራል', details: 'በመቆጣጠሪያው ትዕዛዝ መሰረት የተሰጠውን ተልዕኮ በተግባር ያውላል።', color: '#16A34A', iconName: 'Layers' },
            { id: 'n4', label: 'የመረጃ ማስተላለፊያ እና ውጫዊ ግንኙነት', role: 'ከውጭ አካላት ጋር ግንኙነት ያደርጋል', details: 'ውጤቶችን ለተጠቃሚው ያደርሳል፣ ግብረ-መልስ ይቀበላል።', color: '#D97706', iconName: 'Activity' }
          ],
          stages: [
            { step: 1, title: 'የግብአት መቀበል እና የፍላጎት መለየት', narration: `የ${topic} ስርዓት የመጀመሪያውን ግብአትና ጥሪ በመቀበል ዝግጅት ያደርጋል።`, activeNodeIds: ['n4', 'n1'], particleFlowLabel: 'የግብአት መረጃ ፍሰት', keyInsight: 'ስርዓቱ መነሳሳቱን ያረጋግጣል' },
            { step: 2, title: 'የመረጃ ትንተና እና የሃይል አቅርቦት', narration: 'መቆጣጠሪያ ማዕከሉ መመሪያ ሲያስተላልፍ የሃይል ማመንጫው ክፍል ስራ ይጀምራል።', activeNodeIds: ['n1', 'n2'], particleFlowLabel: 'የሃይል እና ትዕዛዝ ፍሰት', keyInsight: 'ሃይል እና እቅድ ይገናኛሉ' },
            { step: 3, title: 'ዋናውን ተልዕኮ በተግባር ማዋል', narration: 'የማምረቻው ክፍል የተቀናጀውን ሃይል ተጠቅሞ የታለመውን ተግባር በብቃት ያከናውናል።', activeNodeIds: ['n2', 'n3'], particleFlowLabel: 'የተግባር እና ምርት ፍሰት', keyInsight: 'ከፍተኛ ምርታማነት' },
            { step: 4, title: 'ውጤትን ማድረስ እና ዑደቱን መቀጠል', narration: 'የተገኘው ውጤት ለተጠቃሚው ይደርሳል፤ ስርዓቱም ለቀጣይ ስራ ዝግጁ ይሆናል።', activeNodeIds: ['n3', 'n4', 'n1'], particleFlowLabel: 'የመጨረሻ ውጤት ፍሰት', keyInsight: 'ቀጣይነት ያለው የስርዓት ጥንካሬ' }
          ],
          keyTakeaways: [
            `የ${topic} ውጤታማነት የተመሰረተው በእያንዳንዱ ክፍል ትስስር ላይ ነው።`,
            'አንዱ ክፍል ቢቋረጥ አጠቃላይ ስርዓቱ ይስተጓጎላል።',
            'ግልጽ የአሰራር ቅደም-ተከተል መከተል ስኬትን ያረጋግጣል።'
          ]
        };
      }

      return res.json({
        animationData: fallbackData,
        status: 'fallback',
      });
    } catch (error: any) {
      console.error('Error in generate-animation-concept:', error);
      res.status(500).json({ error: error.message || 'Animation generation failed' });
    }
  });

  // 6. AI Student Review: Diagnostic Personal Teacher Analysis
  app.post('/api/ai/student-review', async (req, res) => {
    try {
      const {
        progressMap = {},
        quizHistory = [],
        language = 'am',
        grade = 10,
        studentName = 'ተማሪ',
        subjectName,
      } = req.body;

      const ai = getAI();

      // Compile stats from progressMap
      let totalAssessed = 0;
      let totalCompleted = 0;
      let totalQuizScore = 0;
      let totalQuizMax = 0;
      const completedTopicIds: string[] = [];
      const lowScoreTopics: { topicId: string; score: number; total: number }[] = [];

      for (const [tId, p] of Object.entries<any>(progressMap)) {
        totalAssessed++;
        const isComp = p.lessonCompleted && p.flashcardsCompleted && p.quizCompleted;
        if (isComp) totalCompleted++;
        if (p.lessonCompleted) completedTopicIds.push(tId);

        if (p.quizCompleted && typeof p.quizScore === 'number' && typeof p.quizTotal === 'number') {
          totalQuizScore += p.quizScore;
          totalQuizMax += p.quizTotal;
          if (p.quizTotal > 0 && p.quizScore / p.quizTotal < 0.75) {
            lowScoreTopics.push({ topicId: tId, score: p.quizScore, total: p.quizTotal });
          }
        }
      }

      const rawPercentage = totalQuizMax > 0
        ? Math.round((totalQuizScore / totalQuizMax) * 100)
        : totalAssessed > 0
        ? Math.round((totalCompleted / totalAssessed) * 100)
        : 65;

      const letterGrade =
        rawPercentage >= 90 ? 'A' :
        rawPercentage >= 80 ? 'B' :
        rawPercentage >= 70 ? 'C' :
        rawPercentage >= 60 ? 'D' : 'F';

      const langInstruction =
        language === 'en'
          ? 'Respond entirely in English.'
          : language === 'om'
          ? 'Respond in Afaan Oromoo with English technical terms in parentheses.'
          : language === 'ti'
          ? 'Respond in Tigrinya with English technical terms in parentheses.'
          : language === 'ar'
          ? 'Respond in Arabic with English technical terms in parentheses.'
          : language === 'so'
          ? 'Respond in Somali with English technical terms in parentheses.'
          : 'Respond in encouraging, polite Amharic (አማርኛ) with English terms in parentheses where appropriate.';

      if (ai) {
        const prompt = `You are an elite Ethiopian High School Personal AI Teacher and Diagnostic Specialist for Grades 9-12 New Curriculum.
Evaluate the learning status of student "${studentName}" (Grade ${grade}).

Student Learning Data:
- Overall Mastery Calculated: ${rawPercentage}% (Grade ${letterGrade})
- Subject Focus: ${subjectName || 'All High School Subjects'}
- Full Progress Map:
${JSON.stringify(progressMap, null, 2)}
- Detailed Quiz Records / History:
${JSON.stringify(quizHistory, null, 2)}

Provide an authoritative diagnostic review.
IMPORTANT: You MUST return ONLY a strictly valid JSON object (no markdown fences, no triple backticks, no text before or after).
The JSON schema MUST match:
{
  "masteryPercentage": ${rawPercentage},
  "overallGradeLetter": "${letterGrade}",
  "strengths": [
    "Specific topic or competency mastered by student"
  ],
  "weakAreas": [
    {
      "topicId": "topic-id-string",
      "topicTitle": "Human readable topic title",
      "subjectName": "Subject name",
      "scoreSummary": "e.g. 1/4 (25%)",
      "missingConcept": "The specific conceptual root cause inferred from wrong answers and quiz pattern, NOT just saying they scored low (e.g. 'Difficulty with applying discriminant b² - 4ac < 0 vs > 0 in quadratic roots')",
      "remedy": "Concrete pedagogical step to fix this misconception"
    }
  ],
  "nextSteps": [
    {
      "stepNumber": 1,
      "title": "Clear action title",
      "action": "Specific lesson/topic to study next",
      "reason": "Why this builds their foundation"
    }
  ],
  "encouragement": "A warm, personal, highly encouraging message acting as their personal Ethiopian teacher speaking directly to them",
  "summaryText": "A 2-sentence diagnostic evaluation"
}

${langInstruction}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
        });

        let jsonText = response.text.trim();
        if (jsonText.startsWith('```')) {
          jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
        }

        try {
          const parsed = JSON.parse(jsonText);
          return res.json({
            review: {
              ...parsed,
              masteryPercentage: typeof parsed.masteryPercentage === 'number' ? parsed.masteryPercentage : rawPercentage,
              overallGradeLetter: parsed.overallGradeLetter || letterGrade,
              generatedAt: new Date().toISOString(),
            },
            status: 'success',
            source: 'gemini',
          });
        } catch (parseErr) {
          console.warn('Failed to parse Gemini JSON for review, using structured fallback:', parseErr);
        }
      }

      // Algorithmic Fallback review with deep diagnostic rules
      const fallbackStrengths = completedTopicIds.length > 0
        ? completedTopicIds.map((id) => `የ${id.replace('-', ' ')} ፅንሰ-ሀሳቦችን እና የትምህርት ማጠቃለያዎችን በሚገባ ተረድተዋል`)
        : [
            'የትምህርት መርሃ-ግብሩን በመጀመር ጥሩ የማወቅ ፍላጎት አሳይተዋል',
            'የመማሪያ ፍላሽካርዶችን በማንበብ ቁልፍ ፅንሰ-ሀሳቦችን ለመረዳት ጥረት አድርገዋል',
          ];

      const fallbackWeakAreas = lowScoreTopics.length > 0
        ? lowScoreTopics.map((item) => ({
            topicId: item.topicId,
            topicTitle: item.topicId.includes('math')
              ? 'የኳድራቲክ እኩልዮሾች እና ካልኩለስ'
              : item.topicId.includes('phys')
              ? 'የኒውተን ህጎች እና ኤሌክትሮማግኔቲዝም'
              : item.topicId.replace('-', ' '),
            subjectName: item.topicId.includes('math')
              ? 'ሂሳብ'
              : item.topicId.includes('phys')
              ? 'ፊዚክስ'
              : 'ሳይንስ',
            scoreSummary: `${item.score}/${item.total} (${Math.round((item.score / item.total) * 100)}%)`,
            missingConcept: item.topicId.includes('math')
              ? 'የዲሰክሪሚናንት (b² - 4ac) ምልክቶች የመልሶቹን ተፈጥሮ (real roots) የመወሰን ሂደት ላይ ክፍተት ታይቷል'
              : 'በተጣራ ኃይል (F = ma) እና በኢነርሺያ (Inertia) መካከል ያለውን ልዩነት በግልጽ የመለየት ክፍተት',
            remedy: 'በምስላዊ ግራፍ (Graphing Parabola) እና በሙከራ ማስመሰያ የታገዘ ተጨማሪ ልምምድ ማድረግ',
          }))
        : [
            {
              topicId: 'general-practice',
              topicTitle: 'የፈተና ጥያቄዎችን ፍጥነት እና ትክክለኛነት ማሳደግ',
              subjectName: subjectName || 'አጠቃላይ',
              scoreSummary: `${rawPercentage}%`,
              missingConcept: 'የፎርሙላዎችን የደረጃ በደረጃ አተገባበር እና የዲሪቬሽን ግንዛቤን ማጠናከር',
              remedy: 'በየምዕራፉ የቀረቡትን የፍላሽካርድ ጥያቄዎች እና የሙከራ ፈተናዎች ደጋግሞ መስራት',
            },
          ];

      const fallbackNextSteps = [
        {
          stepNumber: 1,
          title: 'የተለዩ ደካማ ርዕሶችን በቪዲዮና ማስመሰያ መከለስ',
          action: 'በምስላዊ ትምህርት ገጽ ላይ የቀረቡትን 2D/3D ግራፎች እና ፊዚክስ ማስመሰያዎች በተግባር ይሞክሩ',
          reason: 'ፅንሰ-ሀሳቦችን በእይታ መረዳት ቀመሮችን ያለልፋት ለማስታወስ ይረዳል',
        },
        {
          stepNumber: 2,
          title: 'ከግል AI አስተማሪ ጋር ጥያቄዎችን መወያየት',
          action: 'በAI አስተማሪው መስኮት ውስጥ የከበዱዎትን ጥያቄዎች ደረጃ በደረጃ እንዲያሰላዎት ይጠይቁት',
          reason: 'ለእያንዳንዱ የተሳሳቱበት ምክንያት ዝርዝር ማብራሪያ ያገኛሉ',
        },
        {
          stepNumber: 3,
          title: 'የኩዊዝ ፈተናውን በድጋሚ መሞከር',
          action: 'ውጤትዎ ከ 85% በላይ እስኪደርስ ድረስ በየምዕራፉ ያሉትን ጥያቄዎች ይለማመዱ',
          reason: 'የተማሩትን ዕውቀት ለሀገር አቀፍ ፈተና ዝግጁ ለማድረግ ይጠቅማል',
        },
      ];

      const fallbackEncouragement =
        language === 'en'
          ? `Great persistence, ${studentName}! Every mistake is a powerful stepping stone to deep mastery. Keep practicing and review your weak areas!`
          : `በርታ ${studentName}! ትምህርት በሂደት የሚዳብር ድንቅ ጉዞ ነው። ስህተቶች የጥንካሬህ መነሻ ናቸው፤ በየእለቱ ትንሽ እርምጃ መራመድህን ቀጥል፣ እኔም እንደ ግል አስተማሪህ ሁሌም ከጎንህ ነኝ!`;

      return res.json({
        review: {
          masteryPercentage: rawPercentage,
          overallGradeLetter: letterGrade,
          strengths: fallbackStrengths,
          weakAreas: fallbackWeakAreas,
          nextSteps: fallbackNextSteps,
          encouragement: fallbackEncouragement,
          summaryText: `የተማሪው አጠቃላይ የመማር ብቃት ${rawPercentage}% ሲሆን፣ ደረጃው ${letterGrade} ነው። ጥቂት ተጨማሪ ልምምዶችን በማድረግ የላቀ ውጤት ማስመዝገብ ይችላሉ።`,
          generatedAt: new Date().toISOString(),
        },
        status: 'fallback',
        source: 'diagnostic-engine',
      });
    } catch (error: any) {
      console.error('Error in student-review:', error);
      res.status(500).json({ error: error.message || 'Student review generation failed' });
    }
  });

  // In-memory cache for YouTube searches (4 hour TTL)
  const youtubeMemoryCache = new Map<string, { data: any[]; expiresAt: number }>();

  // 7. Automatic YouTube Video Recommendations Endpoint
  app.post('/api/youtube/search', async (req, res) => {
    try {
      const {
        subjectName = 'Mathematics',
        topicTitle = '',
        grade = 10,
        language = 'am',
      } = req.body;

      const cacheKey = `${subjectName}_${topicTitle}_${grade}_${language}`.toLowerCase().replace(/\s+/g, '_');
      const now = Date.now();

      // Check in-memory cache
      const cached = youtubeMemoryCache.get(cacheKey);
      if (cached && cached.expiresAt > now) {
        return res.json({
          videos: cached.data,
          source: 'cached',
          cacheKey,
        });
      }

      const youtubeApiKey = process.env.YOUTUBE_API_KEY;

      // Construct pedagogical search query tailored to Ethiopian secondary education
      let searchQuery = '';
      let relevanceLang = 'am';

      if (language === 'am') {
        searchQuery = `ኢትዮጵያ ክፍል ${grade} ${subjectName} ${topicTitle} ትምህርት`;
        relevanceLang = 'am';
      } else if (language === 'ti') {
        searchQuery = `ትምህርቲ ክፍሊ ${grade} ${subjectName} ${topicTitle}`;
        relevanceLang = 'ti';
      } else if (language === 'om') {
        searchQuery = `Barnoota Kutaa ${grade} ${subjectName} ${topicTitle}`;
        relevanceLang = 'om';
      } else if (language === 'ar') {
        searchQuery = `شرح الصف ${grade} ${subjectName} ${topicTitle}`;
        relevanceLang = 'ar';
      } else if (language === 'so') {
        searchQuery = `Casharka Fasalka ${grade} ${subjectName} ${topicTitle}`;
        relevanceLang = 'so';
      } else {
        searchQuery = `Ethiopian curriculum Grade ${grade} ${subjectName} ${topicTitle} tutorial lesson`;
        relevanceLang = 'en';
      }

      if (youtubeApiKey && youtubeApiKey.trim().length > 10) {
        try {
          const ytUrl = new URL('https://www.googleapis.com/youtube/v3/search');
          ytUrl.searchParams.set('part', 'snippet');
          ytUrl.searchParams.set('type', 'video');
          ytUrl.searchParams.set('maxResults', '6');
          ytUrl.searchParams.set('safeSearch', 'strict');
          ytUrl.searchParams.set('relevanceLanguage', relevanceLang);
          ytUrl.searchParams.set('q', searchQuery);
          ytUrl.searchParams.set('key', youtubeApiKey);

          const ytRes = await fetch(ytUrl.toString());
          if (ytRes.ok) {
            const ytData = await ytRes.json();
            const items = ytData.items || [];
            const videos = items.map((item: any) => ({
              id: item.id?.videoId || Math.random().toString(),
              title: item.snippet?.title || 'Educational Lesson',
              channelTitle: item.snippet?.channelTitle || 'Educational Channel',
              description: item.snippet?.description || '',
              thumbnailUrl:
                item.snippet?.thumbnails?.medium?.url ||
                item.snippet?.thumbnails?.default?.url ||
                `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80`,
              videoUrl: `https://www.youtube.com/embed/${item.id?.videoId}`,
              publishedAt: item.snippet?.publishedAt || '',
            }));

            // Cache for 4 hours
            youtubeMemoryCache.set(cacheKey, {
              data: videos,
              expiresAt: now + 4 * 60 * 60 * 1000,
            });

            return res.json({
              videos,
              source: 'youtube-api',
              searchQuery,
            });
          } else {
            console.warn(`YouTube API returned HTTP ${ytRes.status}: ${await ytRes.text().catch(() => '')}`);
          }
        } catch (ytErr) {
          console.warn('YouTube fetch failed, falling back to curated suggestions:', ytErr);
        }
      }

      // High quality educational fallback tutorials for Ethiopian subjects
      const fallbackCurated = [
        {
          id: 'fb-yt-1',
          title: `ክፍል ${grade} ${subjectName}፡ ${topicTitle} የተብራራ ቪዲዮ ማብራሪያ`,
          channelTitle: 'Ethiopian Educational Television & Web Academy',
          description: `በአዲሱ የኢትዮጵያ ስርዓተ-ትምህርት መሰረት ለክፍል ${grade} ተማሪዎች የተዘጋጀ የ${subjectName} ርዕስ ${topicTitle} ተግባራዊ ማብራሪያ።`,
          thumbnailUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          publishedAt: new Date().toISOString(),
        },
        {
          id: 'fb-yt-2',
          title: `${subjectName} Grade ${grade}: ${topicTitle} Complete Problem Solving`,
          channelTitle: 'MoE Ethiopia Secondary Learning Hub',
          description: `Step-by-step worked examples, exam shortcuts, and theoretical breakdown of ${topicTitle}.`,
          thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          publishedAt: new Date().toISOString(),
        },
        {
          id: 'fb-yt-3',
          title: `የፈተና ጥያቄዎች አሰራር እና ትንተና - ${topicTitle}`,
          channelTitle: 'ESSLCE National Exam Preparation Academy',
          description: `ለሀገር አቀፍ የዩኒቨርሲቲ መግቢያ ፈተና (ESSLCE) የሚያዘጋጁ ጥያቄዎች እና ፈጣን አሰራሮች።`,
          thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          publishedAt: new Date().toISOString(),
        }
      ];

      return res.json({
        videos: fallbackCurated,
        source: 'curated-fallback',
        searchQuery,
        note: 'YouTube API key not configured or quota limit reached; showing curated educational tutorials.',
      });
    } catch (error: any) {
      console.error('Error in youtube/search:', error);
      res.status(500).json({ error: error.message || 'YouTube search failed' });
    }
  });

  // =========================================================================
  // ETHIOPIAN CURRICULUM ENGINE ENDPOINTS (PART 2)
  // =========================================================================

  // 1. Curriculum Engine Metrics & Audit Report
  app.get('/api/curriculum/stats', (req, res) => {
    try {
      const stats = ethiopianCurriculumEngine.getCurriculumEngineStats();
      res.json(stats);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch curriculum stats' });
    }
  });

  // 2. All Curriculum Subjects with full hierarchy
  app.get('/api/curriculum/subjects', (req, res) => {
    try {
      const grade = req.query.grade ? parseInt(req.query.grade as string, 10) : undefined;
      const subjects = grade
        ? ethiopianCurriculumEngine.getSubjectsByGrade(grade as any)
        : ethiopianCurriculumEngine.getAllSubjects();
      res.json({ subjects });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch subjects' });
    }
  });

  // 3. Reusable Ingestion / Import Endpoint for New Ethiopian Textbooks
  app.post('/api/curriculum/import-textbook', (req, res) => {
    try {
      const payload = req.body;
      if (!payload.subjectId || !payload.units || !Array.isArray(payload.units)) {
        return res.status(400).json({ error: 'Invalid payload. subjectId and units array are required.' });
      }
      const result = ethiopianCurriculumEngine.importTextbook(payload);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to import textbook' });
    }
  });

  // 4. Structured Question Bank Query Endpoint (All 7 Question Types)
  app.post('/api/curriculum/questions', (req, res) => {
    try {
      const { subjectId, grade, unit, questionType, difficulty, limit } = req.body;
      const questions = ethiopianCurriculumEngine.getQuestions({
        subjectId,
        grade,
        unit,
        questionType,
        difficulty,
        limit: limit ? parseInt(limit, 10) : 20,
      });
      res.json({ questions, count: questions.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to query questions' });
    }
  });

  // 5. Subject Knowledge Map DAG Endpoint
  app.get('/api/curriculum/knowledge-map/:subjectId', (req, res) => {
    try {
      const map = ethiopianCurriculumEngine.getKnowledgeMap(req.params.subjectId);
      if (!map) {
        return res.status(404).json({ error: `Knowledge map not found for ${req.params.subjectId}` });
      }
      res.json(map);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch knowledge map' });
    }
  });

  // 6. Adaptive Weak Topic Detection Endpoint
  app.post('/api/curriculum/weak-topics', (req, res) => {
    try {
      const { subjectId, progress = [] } = req.body;
      const analysis = ethiopianCurriculumEngine.detectWeakTopics(subjectId, progress);
      res.json(analysis);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Weak topic detection failed' });
    }
  });

  // 7. Curriculum RAG Retrieval Endpoint
  app.post('/api/curriculum/rag-search', (req, res) => {
    try {
      const { query, grade, subjectId, unit, difficulty, limit = 5 } = req.body;
      if (!query) return res.status(400).json({ error: 'Query is required' });

      const results = ethiopianCurriculumEngine.searchCurriculumRAG(query, {
        grade,
        subjectId,
        unit,
        difficulty,
        limit,
      });
      res.json({ results });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'RAG search failed' });
    }
  });

  // 8. NUR AI: Ask from Textbook (Strict Grounding Rules)
  app.post('/api/ai/ask-textbook', async (req, res) => {
    try {
      const {
        question,
        grade = 9,
        subjectId = 'math-g9',
        subjectName = 'Mathematics',
        language = 'am', // 'en' | 'am' | 'om' | 'ti'
      } = req.body;

      if (!question) {
        return res.status(400).json({ error: 'Question is required' });
      }

      // Step 1: Retrieve textbook chunks from Ethiopian Curriculum Engine RAG
      const ragResults = ethiopianCurriculumEngine.searchCurriculumRAG(question, {
        grade: grade as any,
        subjectId,
        limit: 4,
      });

      // Step 2: Strict Rule - if no textbook content matches, clearly say so
      if (ragResults.length === 0) {
        const langMessages: Record<string, string> = {
          am: `ይህ ጥያቄ በክፍል ${grade} የ${subjectName} ይፋዊ የአዲሱ ስርዓተ-ትምህርት የመማሪያ መጽሐፍ ውስጥ አልተካተተም። በስርዓተ-ትምህርቱ ህግ መሰረት መልስ የምሰጠው ከመማሪያ መጽሐፍ በተረጋገጠ ምንጭ ላይ ብቻ ተመስርቼ ነው።`,
          en: `This question is not supported by the official Ethiopian New Curriculum student textbook for Grade ${grade} ${subjectName}. Under the curriculum guidelines, I only provide verified answers grounded in textbook passages.`,
          om: `Gaaffiin kun kitaaba barataa haarawaa Itoophiyaa Kutaa ${grade} ${subjectName} keessatti hin deeggaramu. Akka qajeelfamaatti deebiin kennamu kan kitaaba irraa mirkanaa'e qofaadha.`,
          ti: `እዚ ሕቶ ኣብቲ ወግዓዊ ሓዲሽ ስርዓተ ትምህርቲ ክፍሊ ${grade} ${subjectName} መጽሓፍ ተምሃራይ ኣይተረኽበን። ብመሰረት ሕጊ ስርዓተ ትምህርቲ መልሲ ዝወሃብ ካብ መጽሓፍ ብዝተረጋገጸ ጥራይ እዩ።`,
        };

        return res.json({
          answer: langMessages[language] || langMessages['en'],
          citations: [],
          groundedInTextbook: false,
        });
      }

      const topChunk = ragResults[0];
      const contextText = ragResults
        .map(
          (r, idx) =>
            `[Excerpt ${idx + 1}] Source: ${r.metadata.source} | Grade: ${r.metadata.grade} | Unit ${r.metadata.unit}: ${r.metadata.unitTitle} | Topic: ${r.metadata.topic || 'General'} | Page: ${r.metadata.textbookPage}\nContent: ${r.snippet}`
        )
        .join('\n\n');

      const ai = getAI();
      if (!ai) {
        // Deterministic textbook-grounded fallback
        return res.json({
          answer: `[የመማሪያ መጽሐፍ ማጣቀሻ፡ ክፍል ${topChunk.metadata.grade} ${topChunk.metadata.subject}፣ ምዕራፍ ${topChunk.metadata.unit}፣ ገጽ ${topChunk.metadata.textbookPage}]\n\nበመማሪያ መጽሐፉ መሰረት፡ ${topChunk.snippet}`,
          citations: [
            {
              grade: topChunk.metadata.grade,
              subject: topChunk.metadata.subject,
              unit: topChunk.metadata.unit,
              unitTitle: topChunk.metadata.unitTitle,
              page: topChunk.metadata.textbookPage,
              source: topChunk.metadata.source,
            },
          ],
          groundedInTextbook: true,
        });
      }

      const prompt = `You are NUR AI, the strict official Ethiopian High School Curriculum AI Personal Tutor.
MANDATORY RULES:
1. The Ethiopian New Curriculum Student Textbooks are your primary and absolute source.
2. NEVER invent textbook content.
3. NEVER silently replace textbook content with outside general knowledge.
4. Always provide Grade, Subject, Unit, and Page/Source reference in your answer.
5. If the provided textbook excerpts do not substantiate the answer, state clearly that the textbook does not support it.
6. Do NOT copy long copyrighted passages word-for-word; summarize clearly with mathematical/scientific precision.
7. Language of explanation: Respond completely and fluently in ${
        language === 'am'
          ? 'Amharic (አማርኛ)'
          : language === 'om'
          ? 'Afaan Oromo'
          : language === 'ti'
          ? 'Tigrinya (ትግርኛ)'
          : 'English'
      }.

OFFICIAL TEXTBOOK EXCERPTS:
${contextText}

STUDENT QUESTION:
"${question}"

Format your response with:
- Top Citation Banner: 📖 [Grade ${topChunk.metadata.grade} ${topChunk.metadata.subject} | Unit ${topChunk.metadata.unit}: ${topChunk.metadata.unitTitle} | Page ${topChunk.metadata.textbookPage}]
- Explanation (summarized directly from the textbook concepts)
- Worked Example or Practical Note (from textbook syllabus)
- Review Question or Tip for Exam Preparation`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
      });

      const citations = ragResults.map((r) => ({
        grade: r.metadata.grade,
        subject: r.metadata.subject,
        unit: r.metadata.unit,
        unitTitle: r.metadata.unitTitle,
        page: r.metadata.textbookPage,
        source: r.metadata.source,
      }));

      return res.json({
        answer: response.text || 'No response generated',
        citations,
        groundedInTextbook: true,
      });
    } catch (error: any) {
      console.error('Error in ask-textbook:', error);
      res.status(500).json({ error: error.message || 'Curriculum tutor error' });
    }
  });

  // 9. NUR AI: Photo Question Solver
  app.post('/api/ai/solve-photo-question', async (req, res) => {
    try {
      const {
        imageBase64,
        mimeType = 'image/jpeg',
        grade = 9,
        subjectName = 'General',
        language = 'am',
      } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ error: 'imageBase64 is required' });
      }

      const ai = getAI();
      if (!ai) {
        return res.status(503).json({
          error: 'AI service unavailable. Please check GEMINI_API_KEY configuration.',
        });
      }

      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

      const prompt = `You are NUR AI, the Ethiopian High School Photo Question Solver.
Analyze this photo from an Ethiopian secondary school textbook, assignment, or national exam (ESSLCE).
Your task:
1. Transcribe the exact question text from the image.
2. Identify Grade (9-12), Subject, and Curriculum Unit.
3. Provide step-by-step mathematical / scientific / conceptual solution adhering strictly to Ethiopian Ministry of Education curriculum guidelines.
4. Highlight the Final Answer clearly.
5. Provide a textbook revision tip (mentioning relevant formulas or laws).
6. Output in ${
        language === 'am'
          ? 'Amharic (አማርኛ)'
          : language === 'om'
          ? 'Afaan Oromo'
          : language === 'ti'
          ? 'Tigrinya (ትግርኛ)'
          : 'English'
      }.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: cleanBase64,
                },
              },
              { text: prompt },
            ],
          },
        ],
      });

      return res.json({
        solution: response.text || 'Unable to analyze question',
        detectedGrade: grade,
        detectedSubject: subjectName,
      });
    } catch (error: any) {
      console.error('Error in solve-photo-question:', error);
      res.status(500).json({ error: error.message || 'Failed to solve photo question' });
    }
  });

  // 10. NUR AI: Voice Tutor Endpoint
  app.post('/api/ai/voice-tutor', async (req, res) => {
    try {
      const {
        question,
        topic = '',
        grade = 9,
        subjectName = 'Mathematics',
        language = 'am',
      } = req.body;

      const ai = getAI();
      const prompt = `You are NUR AI Voice Tutor for Ethiopian students.
Write a clear, encouraging, spoken audio script explaining: "${question || topic}" for Grade ${grade} ${subjectName}.
Keep it concise (120-160 words max), conversational, and easy to speak aloud.
Language: ${language === 'am' ? 'Amharic' : language === 'om' ? 'Afaan Oromo' : language === 'ti' ? 'Tigrinya' : 'English'}.
Include:
1. Warm greeting.
2. The core textbook concept explained simply.
3. One memorable example or mnemonic.
4. Quick check question for the student.`;

      let script = `ሰላም ተማሪዬ! በክፍል ${grade} ${subjectName} ላይ ያለህን ጥያቄ እንመልከት። የመማሪያ መጽሐፉ የሚያስተምረን መሰረታዊ መርህ እጅግ ቀላል ነው። በርታ፣ ሁልጊዜ ደግመህ ተለማመድ!`;

      if (ai) {
        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
        });
        script = response.text || script;
      }

      res.json({
        speechScript: script,
        language,
        grade,
        subject: subjectName,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Voice tutor failed' });
    }
  });

  // 11. NUR AI: Dynamic Curriculum Quiz & Exam Generator
  app.post('/api/ai/generate-curriculum-quiz', async (req, res) => {
    try {
      const {
        grade = 9,
        subjectId = 'math-g9',
        subjectName = 'Mathematics',
        unitNumber = 1,
        questionCount = 5,
        difficulty = 'medium',
        language = 'am',
      } = req.body;

      const unit = ethiopianCurriculumEngine.getUnit(subjectId, unitNumber);
      const unitTitle = unit ? unit.title.en : `Unit ${unitNumber}`;

      const ai = getAI();
      if (!ai) {
        // Return structured bank questions as fallback
        const existing = ethiopianCurriculumEngine.getQuestions({
          subjectId,
          grade: grade as any,
          unit: unitNumber,
          limit: questionCount,
        });
        return res.json({
          questions: existing,
          source: 'curriculum-bank',
          unitTitle,
        });
      }

      const prompt = `You are the Ethiopian National Examination and Curriculum Assessment Specialist.
Generate ${questionCount} authentic exam/quiz questions for Grade ${grade} ${subjectName}, Unit ${unitNumber}: "${unitTitle}".
Difficulty level: ${difficulty}.
Language: ${language === 'am' ? 'Amharic' : language === 'om' ? 'Afaan Oromo' : language === 'ti' ? 'Tigrinya' : 'English'}.

Include varied question types: Multiple Choice, True/False, Fill in the Blank, and Short Answer.
Strictly output a VALID JSON array with this exact format without markdown backticks:
[
  {
    "id": "gen-q1",
    "questionType": "multiple_choice",
    "difficulty": "${difficulty}",
    "prompt": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Detailed explanation citing textbook rule and page",
    "textbookPage": ${unit?.textbookPageStart || 1}
  }
]`;

      let parsedQuestions = [];
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
        });
        const cleaned = (response.text || '')
          .replace(/```json/gi, '')
          .replace(/```/g, '')
          .trim();
        parsedQuestions = JSON.parse(cleaned);
      } catch (aiErr) {
        console.warn('Gemini quiz generation failed or unavailable, serving authentic textbook bank questions:', aiErr);
        parsedQuestions = ethiopianCurriculumEngine.getQuestions({
          subjectId,
          grade: grade as any,
          unit: unitNumber,
          limit: questionCount,
        });
      }

      res.json({
        questions: parsedQuestions,
        source: parsedQuestions.length > 0 ? 'curriculum-engine' : 'curriculum-bank',
        unitTitle,
      });
    } catch (err: any) {
      // Final safety net returns bank questions
      const fallbackQuestions = ethiopianCurriculumEngine.getQuestions({
        limit: 5,
      });
      res.json({
        questions: fallbackQuestions,
        source: 'curriculum-bank-fallback',
        errorNote: err.message,
      });
    }
  });

  // ==========================================
  // PART 3: AI PERSONAL TUTOR & RAG ENGINE API
  // ==========================================

  // 1. Central AI Tutor Action Orchestrator (14 Features)
  app.post('/api/ai-tutor/action', async (req, res) => {
    try {
      const ai = getAI();
      const response = await ethiopianAITutorEngine.executeAction(req.body, ai);
      res.json(response);
    } catch (err: any) {
      console.error('Error in /api/ai-tutor/action:', err);
      res.status(500).json({
        error: err.message || 'AI Tutor action failed',
        status: 'error',
      });
    }
  });

  // 2. Photo Question Solver Endpoint (OCR + RAG + Step-by-Step)
  app.post('/api/ai-tutor/photo-solve', async (req, res) => {
    try {
      const { imageBase64, mimeType, grade, subjectName, language } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: 'imageBase64 is required' });
      }
      const ai = getAI();
      const solution = await ethiopianAITutorEngine.solvePhotoQuestion(
        imageBase64,
        mimeType || 'image/jpeg',
        grade || 9,
        subjectName || 'Mathematics',
        language || 'am',
        ai
      );
      res.json(solution);
    } catch (err: any) {
      console.error('Error in /api/ai-tutor/photo-solve:', err);
      res.status(500).json({
        error: err.message || 'Photo question solving failed',
      });
    }
  });

  // 3. Adaptive Learning Evaluation (Mastery, Weak-Topic Detection & Knowledge Map DAG Recommendations)
  app.post('/api/ai-tutor/evaluate-adaptive', (req, res) => {
    try {
      const { userId = 'current-student', subjectId = 'math-g9', answers = [] } = req.body;
      const evaluation = ethiopianAITutorEngine.evaluateStudentAdaptivity(userId, subjectId, answers);
      res.json(evaluation);
    } catch (err: any) {
      console.error('Error in /api/ai-tutor/evaluate-adaptive:', err);
      res.status(500).json({ error: err.message || 'Adaptive evaluation failed' });
    }
  });

  // 4. Complete End-to-End Verification Test Flow (PART 3 TEST)
  app.get('/api/ai-tutor/test-flow', async (req, res) => {
    try {
      const ai = getAI();
      const testReport = await ethiopianAITutorEngine.runFullVerificationTest(ai);
      res.json(testReport);
    } catch (err: any) {
      console.error('Error in /api/ai-tutor/test-flow:', err);
      res.status(500).json({
        error: err.message || 'Verification test failed',
      });
    }
  });

  // 5. Query / Inspect Indexed Curriculum RAG Chunks
  app.get('/api/ai-tutor/rag-chunks', (req, res) => {
    try {
      const grade = req.query.grade ? parseInt(req.query.grade as string) : undefined;
      const subjectId = req.query.subjectId as string | undefined;
      const query = (req.query.q as string) || '';

      if (query) {
        const results = ethiopianCurriculumEngine.searchCurriculumRAG(query, {
          grade: grade as any,
          subjectId,
          limit: 10,
        });
        return res.json({ chunks: results, count: results.length });
      }

      // Return sample RAG index records
      const allChunks = ethiopianCurriculumEngine.searchCurriculumRAG('Ethiopian curriculum textbook concepts', {
        grade: grade as any,
        subjectId,
        limit: 20,
      });

      res.json({
        chunks: allChunks,
        count: allChunks.length,
        totalIndexedInRegistry: ethiopianCurriculumEngine.getCurriculumEngineStats().indexedRAGChunksCount,
      });
    } catch (err: any) {
      console.error('Error in /api/ai-tutor/rag-chunks:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Serve static textbooks directly
  app.use('/textbooks', express.static(path.join(process.cwd(), 'public', 'textbooks')));

  // Vite Middleware for Development or Static Files for Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ethiopian Secondary Tutorial Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
