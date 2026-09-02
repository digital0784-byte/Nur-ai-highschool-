import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

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

  // 2. Interactive AI Student Tutor Chat
  app.post('/api/ai/tutor-chat', async (req, res) => {
    try {
      const { messages, context, language = 'am' } = req.body;
      const ai = getAI();

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

      if (ai && Array.isArray(messages) && messages.length > 0) {
        const systemPrompt = `You are a friendly, encouraging, and highly knowledgeable Ethiopian High School AI Tutor.
Current Context:
- Subject: ${context?.subjectName || 'General'}
- Grade: ${context?.grade || '9-12'}
- Unit / Topic: ${context?.unitTitle || 'General Lesson'}
- Excerpt: ${context?.contentSummary || ''}

Teaching guidelines:
1. Explain step-by-step with clear logic.
2. If solving a math/physics/chemistry problem, break down the Given, Required, Formula, and Step-by-Step Calculation.
3. Be supportive and build student confidence.
4. ${langInstruction}`;

        const lastMessage = messages[messages.length - 1].content;
        const previousTurns = messages.slice(0, -1).map((m: any) => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`).join('\n');

        const prompt = `${systemPrompt}

Conversation History:
${previousTurns}

Student Question: ${lastMessage}

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
        return res.json({
          reply: `ጤና ይስጥልኝ! የ${context?.subjectName || 'ትምህርት'} ረዳት AI አስተማሪ ነኝ። የፈለጉትን የትምህርት ጥያቄ፣ የቀመር ማብራሪያ ወይም የፈተና ጥያቄ ይጠይቁኝ፤ በደስታ አብራራሎታለሁ!`,
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
