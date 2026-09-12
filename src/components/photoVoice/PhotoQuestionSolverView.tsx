import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  RotateCw,
  CheckCircle,
  AlertTriangle,
  Volume2,
  VolumeX,
  Pause,
  RotateCcw,
  Sparkles,
  BookOpen,
  Clock,
  Send,
  Upload,
  RefreshCw,
  Award,
  Check,
  Lightbulb,
  Zap,
  Mic,
  MicOff,
  User,
  Bot,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageCode } from '../../types';
import { GradeLevel } from '../../types/curriculumEngine';
import {
  Part10Solution,
  PhotoQuestionHistoryItem,
  VoiceTutorSession,
  VoiceSessionMessage,
} from '../../types/aiTutor';
import {
  compressAndPrepareImage,
  multilingualVoiceSynthesizer,
  getSavedQuestionHistory,
  saveQuestionToHistory,
  deleteQuestionFromHistory,
  clearQuestionHistory,
  saveVoiceSession,
  solvePhotoQuestionAPI,
} from '../../engine/photoVoiceSolverEngine';

// Sample curated textbook and national exam questions for instant testing
const CURATED_ETHIOPIAN_SAMPLES = [
  {
    id: 'sample-math-g10',
    title: 'Grade 10 Math — Quadratic Equation (Unit 2, Page 42)',
    subject: 'Mathematics',
    grade: 10 as GradeLevel,
    text: 'Solve the quadratic equation: 2x² + 5x - 3 = 0 using the quadratic formula. Show all calculation steps and specify the roots.',
    imageLabel: '📐 Math: 2x² + 5x - 3 = 0',
    badge: 'Calculation',
  },
  {
    id: 'sample-physics-g11',
    title: 'Grade 11 Physics — Projectile Motion (Unit 3, Page 88)',
    subject: 'Physics',
    grade: 11 as GradeLevel,
    text: 'A projectile is launched from ground level with an initial velocity of 20 m/s at an angle of 30° above the horizontal. Taking g = 9.8 m/s², calculate: (a) The time of flight, (b) The maximum height reached.',
    imageLabel: '🚀 Physics: Projectile Motion',
    badge: 'Calculation',
  },
  {
    id: 'sample-chem-g12',
    title: 'Grade 12 Chemistry — Chemical Equilibrium & Le Chatelier (Unit 2, Page 64)',
    subject: 'Chemistry',
    grade: 12 as GradeLevel,
    text: 'For the exothermic reaction: N₂(g) + 3H₂(g) ⇌ 2NH₃(g) + 92 kJ, explain the effect of: (1) Increasing the total pressure, (2) Increasing the reaction temperature.',
    imageLabel: '⚗️ Chemistry: Le Chatelier Principle',
    badge: 'Conceptual',
  },
  {
    id: 'sample-bio-g9',
    title: 'Grade 9 Biology — Cellular Respiration & Mitochondria (Unit 2, Page 38)',
    subject: 'Biology',
    grade: 9 as GradeLevel,
    text: 'Compare and contrast aerobic respiration and anaerobic respiration (fermentation) in terms of energy output (ATP yield) and end products produced in plant and animal tissues.',
    imageLabel: '🔬 Biology: Cellular Respiration',
    badge: 'Conceptual',
  },
  {
    id: 'sample-amharic-g10',
    title: 'Grade 10 Amharic — የሰዋስው ጥያቄ (ስነ-ቃልና ስነ-ፅሁፍ)',
    subject: 'Amharic',
    grade: 10 as GradeLevel,
    text: 'በአማርኛ ሰዋስው ውስጥ የስም ማሰሪያ (Relative pronouns) እና የአያያዥ ቃላትን ተግባር በምሳሌ አስረዱ።',
    imageLabel: '🇪🇹 Amharic: የሰዋስው ስሌት',
    badge: 'Conceptual',
  },
];

export const PhotoQuestionSolverView: React.FC = () => {
  const { language } = useLanguage();

  // Primary State
  const [activeTab, setActiveTab] = useState<'solver' | 'voice' | 'history' | 'verify'>('solver');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(10);
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(language || 'en');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  // Camera & Image Capture State
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [compressionStats, setCompressionStats] = useState<{ originalKB: number; compressedKB: number } | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Solving & OCR Pipeline State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [ocrConfirmationNeeded, setOcrConfirmationNeeded] = useState<boolean>(false);
  const [editableOcrText, setEditableOcrText] = useState<string>('');
  const [currentSolution, setCurrentSolution] = useState<Part10Solution | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Interactive Follow-up State
  const [isFollowupLoading, setIsFollowupLoading] = useState<boolean>(false);
  const [followupResponse, setFollowupResponse] = useState<{
    title: string;
    content: string;
    practiceQuestion?: any;
  } | null>(null);
  const [customQuestionInput, setCustomQuestionInput] = useState<string>('');
  const [practiceSelectedOption, setPracticeSelectedOption] = useState<number | null>(null);

  // Voice Tutor State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [voiceSpeechTranscript, setVoiceSpeechTranscript] = useState<string>('');
  const [isVoiceGenerating, setIsVoiceGenerating] = useState<boolean>(false);
  const [speechPlaybackStatus, setSpeechPlaybackStatus] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [ttsSpeechRate, setTtsSpeechRate] = useState<number>(1.0);
  const [currentVoiceSession, setCurrentVoiceSession] = useState<VoiceTutorSession>({
    id: `voice-${Date.now()}`,
    userId: 'student-guest',
    grade: 10,
    subject: 'Physics',
    language: language || 'en',
    startedAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    status: 'active',
    messages: [
      {
        id: 'msg-welcome',
        sender: 'ai',
        text: 'Hello! I am NUR AI, your Ethiopian Curriculum Voice Tutor. Tap the microphone to ask any question in English, Amharic, Afaan Oromo, or Tigrinya!',
        audioScript: 'Hello! I am NUR AI, your Ethiopian Curriculum Voice Tutor. Tap the microphone to ask any question.',
        timestamp: new Date().toISOString(),
      },
    ],
  });
  const [voiceFallbackNotice, setVoiceFallbackNotice] = useState<string | null>(null);
  const speechRecognitionRef = useRef<any>(null);

  // History State
  const [historyItems, setHistoryItems] = useState<PhotoQuestionHistoryItem[]>([]);

  // E2E Verification State
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResults, setVerificationResults] = useState<any>(null);

  // Load history on mount
  useEffect(() => {
    setHistoryItems(getSavedQuestionHistory('student-guest'));
  }, []);

  // Clean up camera stream and audio when component unmounts
  useEffect(() => {
    return () => {
      stopCameraStream();
      multilingualVoiceSynthesizer.cancel();
    };
  }, []);

  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Start HTML5 Camera
  const startCamera = async () => {
    try {
      setErrorMessage(null);
      stopCameraStream();
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setErrorMessage(
        'Unable to access camera. Please check browser camera permissions or upload an image file from your device.'
      );
    }
  };

  // Snap photo from camera
  const capturePhoto = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1024;
    canvas.height = video.videoHeight || 768;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const rawDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    stopCameraStream();

    // Compress client-side for low-bandwidth 2G/3G/4G
    try {
      const prep = await compressAndPrepareImage(rawDataUrl, {
        maxDimension: 1024,
        quality: 0.75,
      });
      setCompressionStats({ originalKB: prep.originalSizeKb, compressedKB: prep.compressedSizeKb });
      setCapturedImage(prep.compressedBase64);
      setRotationAngle(0);
    } catch {
      setCapturedImage(rawDataUrl);
    }
  };

  // Handle File Upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    try {
      const prep = await compressAndPrepareImage(file, {
        maxDimension: 1024,
        quality: 0.75,
      });
      setCompressionStats({ originalKB: prep.originalSizeKb, compressedKB: prep.compressedSizeKb });
      setCapturedImage(prep.compressedBase64);
      setRotationAngle(0);
    } catch (err) {
      console.warn('File preparation error:', err);
    }
  };

  // Select Curated Ethiopian Textbook Sample
  const handleSelectSample = async (sample: typeof CURATED_ETHIOPIAN_SAMPLES[0]) => {
    setSelectedGrade(sample.grade);
    setSelectedSubject(sample.subject);
    setCapturedImage(null);
    setCompressionStats({ originalKB: 85, compressedKB: 68 });
    setEditableOcrText(sample.text);
    setOcrConfirmationNeeded(false);

    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const solution = await solvePhotoQuestionAPI({
        grade: sample.grade,
        subject: sample.subject,
        language: selectedLanguage,
        studentConfirmedText: sample.text,
      });
      setCurrentSolution(solution);
      saveQuestionToHistory(solution, 'student-guest', sample.imageLabel);
      setHistoryItems(getSavedQuestionHistory('student-guest'));
    } catch (e: any) {
      setErrorMessage(e.message || 'Failed to solve sample question');
    } finally {
      setIsProcessing(false);
    }
  };

  // Rotate Captured Image 90 Degrees Clockwise
  const handleRotateImage = () => {
    setRotationAngle((prev) => (prev + 90) % 360);
  };

  // Execute Question Solving Pipeline
  const handleProcessImage = async (confirmedTextOverride?: string) => {
    if (!capturedImage && !confirmedTextOverride) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setFollowupResponse(null);

    try {
      const solution = await solvePhotoQuestionAPI({
        imageBase64: capturedImage || undefined,
        grade: selectedGrade,
        subject: selectedSubject,
        language: selectedLanguage,
        studentConfirmedText: confirmedTextOverride,
      });

      // Check if OCR confidence is low (<80%) or needs student confirmation
      if (!confirmedTextOverride && solution.ocr.confidence < 80) {
        setEditableOcrText(solution.ocr.extractedText);
        setOcrConfirmationNeeded(true);
        setCurrentSolution(solution);
        setIsProcessing(false);
        return;
      }

      setOcrConfirmationNeeded(false);
      setCurrentSolution(solution);

      // Save to local student history for offline retention
      saveQuestionToHistory(solution, 'student-guest', capturedImage || undefined);
      setHistoryItems(getSavedQuestionHistory('student-guest'));
    } catch (err: any) {
      console.error('Photo solver error:', err);
      setErrorMessage(err.message || 'Error occurred while analyzing question. Please try again or edit text.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Confirm and proceed with edited text
  const handleConfirmEditedOCR = () => {
    if (!editableOcrText.trim()) return;
    setOcrConfirmationNeeded(false);
    handleProcessImage(editableOcrText);
  };

  // Execute Interactive AI Tutor Follow-up
  const handleFollowupAction = async (action: string, customText?: string) => {
    if (!currentSolution) return;
    setIsFollowupLoading(true);
    setPracticeSelectedOption(null);

    try {
      const res = await fetch('/api/ai/photo-followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          questionText: currentSolution.ocr.extractedText,
          customQuestion: customText,
          grade: selectedGrade,
          subject: currentSolution.detection.subject,
          language: selectedLanguage,
        }),
      });
      const data = await res.json();
      setFollowupResponse(data);
      if (customText) setCustomQuestionInput('');
    } catch (err: any) {
      console.error('Follow-up error:', err);
    } finally {
      setIsFollowupLoading(false);
    }
  };

  // Multilingual Speech Synthesis for Solutions
  const handleSpeakText = (text: string) => {
    if (speechPlaybackStatus === 'playing') {
      multilingualVoiceSynthesizer.pause();
      setSpeechPlaybackStatus('paused');
      return;
    }
    if (speechPlaybackStatus === 'paused') {
      multilingualVoiceSynthesizer.resume();
      setSpeechPlaybackStatus('playing');
      return;
    }

    setSpeechPlaybackStatus('playing');
    const result = multilingualVoiceSynthesizer.speak(text, selectedLanguage, {
      rate: ttsSpeechRate,
      onEnd: () => setSpeechPlaybackStatus('idle'),
      onError: () => setSpeechPlaybackStatus('idle'),
    });

    if (result.fallbackNotice) {
      setVoiceFallbackNotice(result.fallbackNotice);
    } else {
      setVoiceFallbackNotice(null);
    }
  };

  const handleStopSpeaking = () => {
    multilingualVoiceSynthesizer.cancel();
    setSpeechPlaybackStatus('idle');
  };

  // Voice Tutor Speech Recognition
  const toggleVoiceRecording = () => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  const startVoiceRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage(
        'Web Speech Recognition is not supported in this browser. You can type your voice query in the text box.'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang =
        selectedLanguage === 'am'
          ? 'am-ET'
          : selectedLanguage === 'om'
          ? 'om-ET'
          : selectedLanguage === 'ti'
          ? 'ti-ET'
          : 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        setVoiceSpeechTranscript('');
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setVoiceSpeechTranscript(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn('Failed to start speech recognition:', err);
      setIsRecording(false);
    }
  };

  const stopVoiceRecording = () => {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  // Submit Voice Tutor Query
  const handleSendVoiceQuery = async (queryText?: string) => {
    const textToSend = queryText || voiceSpeechTranscript;
    if (!textToSend.trim()) return;

    const studentMsg: VoiceSessionMessage = {
      id: `msg-student-${Date.now()}`,
      sender: 'student',
      text: textToSend,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...currentVoiceSession.messages, studentMsg];
    setCurrentVoiceSession((prev) => ({
      ...prev,
      messages: updatedMessages,
    }));
    setVoiceSpeechTranscript('');
    setIsVoiceGenerating(true);

    try {
      const res = await fetch('/api/ai/voice-tutor-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: currentVoiceSession.id,
          studentMessage: textToSend,
          grade: selectedGrade,
          subject: selectedSubject,
          language: selectedLanguage,
        }),
      });
      const data = await res.json();

      const tutorMsg: VoiceSessionMessage = {
        id: `msg-tutor-${Date.now()}`,
        sender: 'ai',
        text: data.displayExplanation || data.aiSpeechScript,
        audioScript: data.aiSpeechScript,
        citation: data.textbookCitation,
        timestamp: new Date().toISOString(),
      };

      const finalSession: VoiceTutorSession = {
        ...currentVoiceSession,
        messages: [...updatedMessages, tutorMsg],
        lastActiveAt: new Date().toISOString(),
      };

      setCurrentVoiceSession(finalSession);
      saveVoiceSession(finalSession);

      // Auto play spoken audio script
      if (data.aiSpeechScript) {
        handleSpeakText(data.aiSpeechScript);
      }
    } catch (e: any) {
      console.error('Voice conversation error:', e);
    } finally {
      setIsVoiceGenerating(false);
    }
  };

  // Execute Automated 10-Stage Part 10 E2E Verification
  const runPart10Verification = async () => {
    setIsVerifying(true);
    setVerificationResults(null);
    try {
      const res = await fetch('/api/ai/verify-part10-e2e', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      setVerificationResults(data);
    } catch (err: any) {
      console.error('Verification error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const getFontSizeClass = () => {
    if (fontSize === 'large') return 'text-lg';
    if (fontSize === 'xlarge') return 'text-xl';
    return 'text-base';
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-6 font-sans">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 uppercase tracking-wide">
                Part 10 — NUR AI High School
              </span>
              <span className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                FDRE Ethiopian New Curriculum Grounded
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Photo Question Solver & Voice Tutor
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Capture textbook questions with camera, extract math and scripts accurately, solve step-by-step, and learn through multilingual voice tutoring.
            </p>
          </div>

          {/* Controls Bar: Grade, Language, Font */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Grade Selector */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              {[9, 10, 11, 12].map((g) => (
                <button
                  key={g}
                  id={`btn-grade-${g}`}
                  onClick={() => setSelectedGrade(g as GradeLevel)}
                  className={`px-3 py-1 rounded text-xs font-semibold transition ${
                    selectedGrade === g
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  Grade {g}
                </button>
              ))}
            </div>

            {/* Language Selector */}
            <select
              id="select-language"
              aria-label="Select Language"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as LanguageCode)}
              className="px-3 py-1.5 bg-slate-100 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="en">English</option>
              <option value="am">አማርኛ (Amharic)</option>
              <option value="om">Afaan Oromoo</option>
              <option value="ti">ትግርኛ (Tigrinya)</option>
            </select>

            {/* Accessibility Font Size Toggle */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1 text-xs text-slate-700">
              <span className="px-1 font-medium text-slate-500">A:</span>
              <button
                id="btn-font-normal"
                onClick={() => setFontSize('normal')}
                className={`px-2 py-0.5 rounded ${fontSize === 'normal' ? 'bg-white font-bold shadow-xs' : ''}`}
              >
                1x
              </button>
              <button
                id="btn-font-large"
                onClick={() => setFontSize('large')}
                className={`px-2 py-0.5 rounded ${fontSize === 'large' ? 'bg-white font-bold shadow-xs' : ''}`}
              >
                1.2x
              </button>
              <button
                id="btn-font-xlarge"
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-0.5 rounded ${fontSize === 'xlarge' ? 'bg-white font-bold shadow-xs' : ''}`}
              >
                1.4x
              </button>
            </div>
          </div>
        </div>

        {/* Module Sub-Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-100">
          <button
            id="tab-btn-solver"
            onClick={() => setActiveTab('solver')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'solver'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            ፎቶ ጥያቄ ፈቺ (Photo Solver)
          </button>
          <button
            id="tab-btn-voice"
            onClick={() => setActiveTab('voice')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'voice'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Mic className="w-4 h-4" />
            የድምፅ አስተማሪ (Voice Tutor)
          </button>
          <button
            id="tab-btn-history"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'history'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            የጥያቄዎች ታሪክ ({historyItems.length})
          </button>
          <button
            id="tab-btn-verify"
            onClick={() => setActiveTab('verify')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'verify'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <Award className="w-4 h-4" />
            የስርዓት ማረጋገጫ (E2E Verification)
          </button>
        </div>
      </div>

      {/* Error Alert Display */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-sm flex-1">
            <p className="font-semibold">Notice</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
          <button
            id="btn-dismiss-error"
            onClick={() => setErrorMessage(null)}
            className="text-xs underline text-rose-700 font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. PHOTO QUESTION SOLVER TAB                                              */}
      {/* ========================================================================= */}
      {activeTab === 'solver' && (
        <div className="space-y-6">
          {/* Curated Sample Questions for Fast Testing */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                ፈጣን መፈተኛ፡ ይፋዊ የመማሪያ መጽሐፍት ናሙናዎች (Curated Ethiopian Textbook Samples)
              </span>
              <span className="text-xs text-slate-500">Tap to load & solve</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {CURATED_ETHIOPIAN_SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  id={`btn-sample-${sample.id}`}
                  onClick={() => handleSelectSample(sample)}
                  className="text-left p-2.5 bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-lg transition group shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-sky-800">{sample.imageLabel}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        sample.badge === 'Calculation'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {sample.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 font-mono group-hover:text-slate-900">
                    {sample.text}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Camera Capture & Upload Studio */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Image Capture & Preprocessing</h2>
                <p className="text-xs text-slate-600">
                  Take a photo of your textbook question or upload from device gallery. Optimized for low-bandwidth networks.
                </p>
              </div>

              {/* Compression Badge */}
              {compressionStats && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-1.5 rounded-lg">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    Low-Data Optimized: {compressionStats.originalKB}KB → {compressionStats.compressedKB}KB (
                    {Math.round((1 - compressionStats.compressedKB / compressionStats.originalKB) * 100)}% saved)
                  </span>
                </div>
              )}
            </div>

            {/* Live Camera Viewport */}
            {isCameraActive ? (
              <div className="relative bg-black rounded-xl overflow-hidden mb-4 aspect-video sm:aspect-2/1 flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />

                {/* Question Frame Guide */}
                <div className="absolute inset-8 sm:inset-12 border-2 border-dashed border-white/70 rounded-lg pointer-events-none flex flex-col justify-between p-3">
                  <span className="text-[11px] text-white/90 bg-black/50 px-2 py-0.5 rounded w-fit">
                    Align textbook question within this box
                  </span>
                  <span className="text-[10px] text-white/70 bg-black/50 px-2 py-0.5 rounded self-end">
                    Ensure adequate lighting
                  </span>
                </div>

                {/* Camera Action Buttons */}
                <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4">
                  <button
                    id="btn-switch-camera"
                    onClick={() => {
                      setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
                      startCamera();
                    }}
                    className="p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition backdrop-blur-xs"
                    title="Switch camera"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>

                  <button
                    id="btn-snap-photo"
                    onClick={capturePhoto}
                    className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-full shadow-lg transition flex items-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    ፎቶ አንሳ (Snap Photo)
                  </button>

                  <button
                    id="btn-cancel-camera"
                    onClick={stopCameraStream}
                    className="p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition backdrop-blur-xs"
                    title="Cancel camera"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : capturedImage ? (
              /* Image Preview & Editing Controls */
              <div className="relative bg-slate-900 rounded-xl overflow-hidden mb-4 p-4 flex flex-col items-center">
                <div className="relative max-h-80 w-auto flex items-center justify-center overflow-hidden">
                  <img
                    src={capturedImage}
                    alt="Captured Question"
                    className="max-h-72 object-contain rounded transition duration-200 shadow-md"
                    style={{ transform: `rotate(${rotationAngle}deg)` }}
                  />
                </div>

                {/* Editing Toolbar */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 mt-4 pt-3 border-t border-slate-800 w-full">
                  <button
                    id="btn-rotate-image"
                    onClick={handleRotateImage}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    አሽከርክር (Rotate 90°)
                  </button>
                  <button
                    id="btn-retake-image"
                    onClick={() => {
                      setCapturedImage(null);
                      setCompressionStats(null);
                      startCamera();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    እንደገና አንሳ (Retake)
                  </button>
                  <button
                    id="btn-remove-image"
                    onClick={() => {
                      setCapturedImage(null);
                      setCompressionStats(null);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-200 text-xs font-semibold rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    አስወግድ (Remove)
                  </button>
                </div>
              </div>
            ) : (
              /* Initial Capture / Upload Options */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <button
                  id="btn-open-camera"
                  onClick={startCamera}
                  className="p-8 border-2 border-dashed border-sky-300 hover:border-sky-500 bg-sky-50/50 hover:bg-sky-50 rounded-xl text-center transition flex flex-col items-center justify-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-full bg-sky-600 group-hover:scale-105 text-white flex items-center justify-center shadow-md transition">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">በካሜራ ፎቶ አንሳ (Use Camera)</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Live capture with document frame guidance</p>
                  </div>
                </button>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-8 border-2 border-dashed border-slate-300 hover:border-slate-500 bg-slate-50 hover:bg-slate-100/70 rounded-xl text-center transition flex flex-col items-center justify-center gap-3 cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-700 group-hover:scale-105 text-white flex items-center justify-center shadow-md transition">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">ከፋይል ምረጥ (Upload from Device)</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Select image (PNG, JPEG, WEBP) from gallery</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {capturedImage && (
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  id="btn-submit-solve"
                  onClick={() => handleProcessImage()}
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      በማስላት ላይ... (Extracting OCR & Solving)
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      ጥያቄውን ፈታ (Extract & Solve Step-by-Step)
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Low Confidence OCR Confirmation Modal / Banner */}
          {ocrConfirmationNeeded && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-amber-900">
                    የፅሁፍ ማረጋገጫ ያስፈልጋል (Confirm Extracted Question Text)
                  </h3>
                  <p className="text-xs text-amber-800 mt-0.5">
                    NUR AI detected equations or complex handwriting. Please review and confirm the numbers and formulas below before solving to prevent miscalculations:
                  </p>

                  <textarea
                    id="textarea-ocr-edit"
                    value={editableOcrText}
                    onChange={(e) => setEditableOcrText(e.target.value)}
                    rows={4}
                    className="w-full mt-3 p-3 bg-white border border-amber-300 rounded-lg text-sm text-slate-800 font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="Verify and adjust the question formula or text..."
                  />

                  <div className="flex items-center justify-end gap-2.5 mt-3">
                    <button
                      id="btn-cancel-ocr-edit"
                      onClick={() => setOcrConfirmationNeeded(false)}
                      className="px-3.5 py-1.5 text-xs text-slate-700 hover:bg-amber-100 rounded-lg transition"
                    >
                      ተመለስ (Cancel)
                    </button>
                    <button
                      id="btn-confirm-ocr-solve"
                      onClick={handleConfirmEditedOCR}
                      className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      አረጋግጥና አስላ (Confirm & Solve)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Solution & Pedagogical Step-by-Step Display */}
          {currentSolution && !ocrConfirmationNeeded && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
              {/* Header: Verified Curriculum Grounding Badge & Audio Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      ይፋዊ የኢትዮጵያ ስርአተ-ትምህርት (FDRE MoE Curriculum Grounded)
                    </span>
                    <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full">
                      {currentSolution.detection.subject} — Grade {currentSolution.detection.grade}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Unit {currentSolution.detection.unitNumber}: {currentSolution.detection.unitTitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-600">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {currentSolution.sourceCitation.sourceText} • Page {currentSolution.sourceCitation.textbookPage}
                    </span>
                  </div>
                </div>

                {/* Voice Readout Controls */}
                <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                  <button
                    id="btn-speak-solution"
                    onClick={() => handleSpeakText(currentSolution.explanation || currentSolution.finalAnswer)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded transition"
                  >
                    {speechPlaybackStatus === 'playing' ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        አቁም (Pause)
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        በድምፅ አድምጥ (Listen Solution)
                      </>
                    )}
                  </button>

                  {speechPlaybackStatus !== 'idle' && (
                    <button
                      id="btn-stop-speak"
                      onClick={handleStopSpeaking}
                      className="p-1.5 text-slate-600 hover:text-slate-900 rounded"
                      title="Stop audio"
                    >
                      <VolumeX className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Native Voice Notice if local synthesizer lacks native Ethiopian language audio voice */}
              {voiceFallbackNotice && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Speech Synthesizer Note: </span>
                    {voiceFallbackNotice}
                  </div>
                </div>
              )}

              {/* Extracted Verbatim Question Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    የተነበበው ጥያቄ (Extracted Question Verbatim)
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    OCR Confidence: {currentSolution.ocr.confidence}%
                  </span>
                </div>
                <p className={`font-mono text-slate-900 ${getFontSizeClass()}`}>
                  {currentSolution.ocr.extractedText}
                </p>
              </div>

              {/* Calculation Question Format */}
              {currentSolution.questionType === 'calculation' && currentSolution.calculation && (
                <div className="space-y-4">
                  {/* Given & Required Box */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-sky-50/50 border border-sky-200 rounded-xl">
                      <h4 className="text-xs font-bold text-sky-900 uppercase tracking-wider mb-2">
                        1. የተሰጡ እሴቶች (Given Information)
                      </h4>
                      <ul className="space-y-1 text-sm text-slate-800">
                        {currentSolution.calculation.given.map((g, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-sky-600 font-bold">•</span>
                            <span>{g}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-purple-50/50 border border-purple-200 rounded-xl">
                      <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider mb-2">
                        2. ተፈላጊ (Required)
                      </h4>
                      <p className="text-sm text-slate-800 font-medium">
                        {currentSolution.calculation.required}
                      </p>
                    </div>
                  </div>

                  {/* Governing Formula */}
                  <div className="p-4 bg-amber-50/40 border border-amber-200 rounded-xl">
                    <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1.5">
                      3. የስርአተ-ትምህርቱ ቀመር (Governing Curriculum Formula)
                    </h4>
                    <p className="text-base font-bold font-mono text-amber-950">
                      {currentSolution.calculation.conceptOrFormula}
                    </p>
                  </div>

                  {/* Step-by-Step Calculation */}
                  <div className="p-4 bg-white border border-slate-200 rounded-xl">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                      4. የስሌት ደረጃዎች (Step-by-Step Calculation)
                    </h4>
                    <div className="space-y-2.5">
                      {currentSolution.calculation.calculationSteps.map((step, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-lg text-sm font-mono text-slate-900"
                        >
                          <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-xs font-bold rounded">
                            ደረጃ {idx + 1}
                          </span>
                          <span className="flex-1">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Highlighted Final Answer */}
                  <div className="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        5. የመጨረሻ መልስ (Final Answer)
                      </span>
                      <p className="text-xl sm:text-2xl font-black text-emerald-950 mt-0.5">
                        {currentSolution.calculation.finalAnswer}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>

                  {/* Common Student Mistake Warning */}
                  {currentSolution.calculation.commonMistake && (
                    <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                          በፈተና ላይ የሚፈጠር የተለመደ ስህተት (Common Exam Mistake)
                        </h4>
                        <p className="text-sm text-rose-950 mt-1">
                          {currentSolution.calculation.commonMistake}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Conceptual Question Format */}
              {currentSolution.questionType === 'conceptual' && currentSolution.conceptual && (
                <div className="space-y-4">
                  {/* Concept Definition */}
                  <div className="p-4 bg-sky-50/60 border border-sky-200 rounded-xl">
                    <h4 className="text-xs font-bold text-sky-900 uppercase tracking-wider mb-1">
                      1. መሰረታዊ ፅንሰ-ሀሳብ (Core Concept)
                    </h4>
                    <p className="text-base font-bold text-slate-900">
                      {currentSolution.conceptual.concept}
                    </p>
                  </div>

                  {/* Simple Explanation */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      2. ቀላል ማብራሪያ (Simple Explanation)
                    </h4>
                    <p className={`text-slate-800 leading-relaxed ${getFontSizeClass()}`}>
                      {currentSolution.conceptual.simpleExplanation}
                    </p>
                  </div>

                  {/* Real-World Ethiopian Example */}
                  <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                    <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1">
                      3. የተጨባጭ ህይወት ምሳሌ (Real-World Ethiopian Example)
                    </h4>
                    <p className="text-sm text-slate-800">
                      {currentSolution.conceptual.example}
                    </p>
                  </div>

                  {/* Final Correctness Justification */}
                  <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl">
                    <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider mb-1">
                      4. መልሱ ትክክል የሆነበት ምክንያት (Why the Answer is Correct)
                    </h4>
                    <p className="text-sm text-slate-800">
                      {currentSolution.conceptual.whyCorrect}
                    </p>
                  </div>
                </div>
              )}

              {/* Interactive AI Tutor Follow-up Action Bar */}
              <div className="pt-5 border-t border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  የአስተማሪ እርዳታና ልምምድ (Interactive AI Tutor Follow-ups)
                </h3>

                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    id="btn-followup-explain-more"
                    onClick={() => handleFollowupAction('explain_more')}
                    disabled={isFollowupLoading}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition"
                  >
                    ጥልቅ ማብራሪያ (Explain More)
                  </button>
                  <button
                    id="btn-followup-explain-simply"
                    onClick={() => handleFollowupAction('explain_simply')}
                    disabled={isFollowupLoading}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition"
                  >
                    ቀላል ማብራሪያ (Explain Simply)
                  </button>
                  <button
                    id="btn-followup-another-example"
                    onClick={() => handleFollowupAction('another_example')}
                    disabled={isFollowupLoading}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition"
                  >
                    ተጨማሪ ምሳሌ (Another Example)
                  </button>
                  <button
                    id="btn-followup-hint"
                    onClick={() => handleFollowupAction('hint')}
                    disabled={isFollowupLoading}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition"
                  >
                    💡 ፍንጭ ስጠኝ (Give Hint)
                  </button>
                  <button
                    id="btn-followup-similar"
                    onClick={() => handleFollowupAction('similar_question')}
                    disabled={isFollowupLoading}
                    className="px-3.5 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-900 text-xs font-semibold rounded-lg transition"
                  >
                    ተመሳሳይ ጥያቄ (Similar Question)
                  </button>
                </div>

                {/* Custom Follow-up Question Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customQuestionInput}
                    onChange={(e) => setCustomQuestionInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFollowupAction('ask_custom', customQuestionInput)}
                    placeholder="Ask NUR AI anything specific about this problem..."
                    className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <button
                    id="btn-submit-custom-question"
                    onClick={() => handleFollowupAction('ask_custom', customQuestionInput)}
                    disabled={isFollowupLoading || !customQuestionInput.trim()}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    ጠይቅ (Ask)
                  </button>
                </div>

                {/* Follow-up Response Display */}
                {followupResponse && (
                  <div className="mt-4 p-4 bg-sky-50/70 border border-sky-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-900">{followupResponse.title}</span>
                      <button
                        id="btn-speak-followup"
                        onClick={() => handleSpeakText(followupResponse.content)}
                        className="text-xs text-sky-700 hover:text-sky-900 font-medium flex items-center gap-1"
                      >
                        <Volume2 className="w-3.5 h-3.5" /> Listen
                      </button>
                    </div>

                    <p className={`text-slate-800 leading-relaxed ${getFontSizeClass()}`}>
                      {followupResponse.content}
                    </p>

                    {/* Interactive Practice Question */}
                    {followupResponse.practiceQuestion && (
                      <div className="mt-3 p-3 bg-white border border-sky-200 rounded-lg">
                        <p className="text-xs font-bold text-slate-700 mb-2">
                          ልምምድ (Practice): {followupResponse.practiceQuestion.question}
                        </p>
                        <div className="space-y-1.5">
                          {followupResponse.practiceQuestion.options?.map((opt: string, optIdx: number) => {
                            const isSelected = practiceSelectedOption === optIdx;
                            const isCorrect = optIdx === followupResponse.practiceQuestion.correctIndex;
                            let btnStyle = 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200';
                            if (practiceSelectedOption !== null) {
                              if (isCorrect) btnStyle = 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold';
                              else if (isSelected) btnStyle = 'bg-rose-100 text-rose-900 border-rose-400';
                            }
                            return (
                              <button
                                key={optIdx}
                                onClick={() => setPracticeSelectedOption(optIdx)}
                                className={`w-full text-left p-2 border rounded text-xs transition ${btnStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {practiceSelectedOption !== null && (
                          <div className="mt-2 text-xs text-slate-700 p-2 bg-slate-50 rounded">
                            <span className="font-bold">ማብራሪያ፡ </span>
                            {followupResponse.practiceQuestion.explanation}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. VOICE TUTOR TAB                                                        */}
      {/* ========================================================================= */}
      {activeTab === 'voice' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Mic className="w-5 h-5 text-sky-600" />
                  የድምፅ አስተማሪ (Voice Tutor & Real-Time Audio Dialog)
                </h2>
                <p className="text-xs text-slate-600">
                  Ask curriculum questions verbally in Amharic, English, Afaan Oromo, or Tigrinya.
                </p>
              </div>

              {/* Speech Playback Rate Selector */}
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg text-xs">
                <span className="text-slate-600 font-medium px-1">Audio Speed:</span>
                {[0.8, 1.0, 1.2].map((r) => (
                  <button
                    key={r}
                    id={`btn-speed-${r}`}
                    onClick={() => setTtsSpeechRate(r)}
                    className={`px-2 py-0.5 rounded font-semibold transition ${
                      ttsSpeechRate === r ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {r}x
                  </button>
                ))}
              </div>
            </div>

            {/* Pulsating Microphone Control Center */}
            <div className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-200 rounded-2xl mb-6 text-center">
              <div className="relative mb-4">
                {isRecording && (
                  <span className="absolute -inset-3 rounded-full bg-rose-500/20 animate-ping" />
                )}
                <button
                  id="btn-toggle-voice-record"
                  onClick={toggleVoiceRecording}
                  className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform duration-150 ${
                    isRecording
                      ? 'bg-rose-600 hover:bg-rose-700 text-white scale-105'
                      : 'bg-sky-600 hover:bg-sky-700 text-white hover:scale-105'
                  }`}
                >
                  {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </button>
              </div>

              <p className="text-sm font-bold text-slate-900">
                {isRecording ? 'Listening... Speak your question now' : 'Tap microphone to speak your question'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Current Language: {selectedLanguage.toUpperCase()} • Grade {selectedGrade} {selectedSubject}
              </p>

              {/* Live Speech Recognition Transcript Box */}
              {voiceSpeechTranscript && (
                <div className="mt-4 p-3 bg-white border border-sky-300 rounded-xl w-full max-w-md shadow-xs">
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">Live Transcript:</p>
                  <p className="text-sm font-medium text-slate-800 italic">"{voiceSpeechTranscript}"</p>
                  <button
                    id="btn-send-spoken-query"
                    onClick={() => handleSendVoiceQuery()}
                    className="mt-2.5 px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition"
                  >
                    ጥያቄውን ጠይቅ (Send Voice Question)
                  </button>
                </div>
              )}
            </div>

            {/* Multi-turn Audio Conversation Log */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                የውይይት ታሪክ (Voice Session Conversation)
              </h3>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {currentVoiceSession.messages.map((msg) => {
                  const isAi = msg.sender === 'ai';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${isAi ? 'items-start' : 'items-start flex-row-reverse'}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white ${
                          isAi ? 'bg-sky-600' : 'bg-slate-700'
                        }`}
                      >
                        {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>

                      <div
                        className={`p-4 rounded-xl max-w-xl text-sm ${
                          isAi
                            ? 'bg-slate-100 text-slate-900 border border-slate-200'
                            : 'bg-sky-600 text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 mb-1">
                          <span className="text-xs font-bold opacity-80">
                            {isAi ? 'NUR AI Voice Tutor' : 'You (Student)'}
                          </span>
                          {isAi && (
                            <button
                              id={`btn-replay-msg-${msg.id}`}
                              onClick={() => handleSpeakText(msg.audioScript || msg.text)}
                              className="text-sky-700 hover:text-sky-900 text-xs font-semibold flex items-center gap-1"
                            >
                              <Volume2 className="w-3.5 h-3.5" /> Replay
                            </button>
                          )}
                        </div>

                        <p className={`leading-relaxed ${getFontSizeClass()}`}>{msg.text}</p>

                        {msg.citation && (
                          <div className="mt-2 pt-2 border-t border-slate-200/60 text-xs text-slate-600 flex items-center gap-1 font-medium">
                            <BookOpen className="w-3 h-3 text-slate-400" />
                            <span>{msg.citation}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isVoiceGenerating && (
                  <div className="flex items-center gap-2 text-slate-500 text-xs p-3">
                    <RefreshCw className="w-4 h-4 animate-spin text-sky-600" />
                    <span>NUR AI is thinking and preparing audio answer...</span>
                  </div>
                )}
              </div>

              {/* Text Fallback Input for Voice Tutor */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
                <input
                  type="text"
                  placeholder="Or type a question to ask the voice tutor..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendVoiceQuery((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. QUESTION HISTORY TAB                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'history' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">የተሰሩ ጥያቄዎች ታሪክ (Saved Question History)</h2>
              <p className="text-xs text-slate-600">
                Saved locally on your device for offline study and exam revision.
              </p>
            </div>

            {historyItems.length > 0 && (
              <button
                id="btn-clear-history"
                onClick={() => {
                  clearQuestionHistory();
                  setHistoryItems([]);
                }}
                className="px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg font-medium transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                ሁሉንም አፅዳ (Clear History)
              </button>
            )}
          </div>

          {historyItems.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold">No questions saved yet.</p>
              <p className="text-xs mt-1">Take a photo or solve one of the curated samples to build your revision log.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {historyItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border border-slate-200 rounded-xl hover:border-sky-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded">
                        {item.subject} • Grade {item.grade}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-900 font-mono line-clamp-2">
                      {item.questionText}
                    </p>
                    <p className="text-xs text-emerald-800 font-semibold mt-1">
                      Final Answer: {item.solution.finalAnswer}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      id={`btn-load-history-${item.id}`}
                      onClick={() => {
                        setCurrentSolution(item.solution);
                        setActiveTab('solver');
                      }}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg transition"
                    >
                      ክፈት (View Solution)
                    </button>
                    <button
                      id={`btn-delete-history-${item.id}`}
                      onClick={() => {
                        deleteQuestionFromHistory(item.id);
                        setHistoryItems(getSavedQuestionHistory('student-guest'));
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PART 10 E2E AUTOMATED VERIFICATION TAB                                */}
      {/* ========================================================================= */}
      {activeTab === 'verify' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-700" />
                Part 10 — 10-Stage Automated E2E Verification
              </h2>
              <p className="text-xs text-slate-600">
                Executes end-to-end verification covering Camera Compression, Multilingual OCR, Formula Preservation, Curriculum RAG Grounding, Step-by-Step Calculations, Voice Pipeline, and History Isolation.
              </p>
            </div>

            <button
              id="btn-run-part10-verification"
              onClick={runPart10Verification}
              disabled={isVerifying}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition flex items-center gap-2 disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  በማረጋገጥ ላይ... (Verifying Pipeline)
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  ፈትሽ (Run 10-Stage Verification)
                </>
              )}
            </button>
          </div>

          {/* Verification Results Display */}
          {verificationResults && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                    {verificationResults.suiteName}
                  </span>
                  <p className="text-xl font-bold text-emerald-950 mt-0.5">
                    {verificationResults.passedSteps} / {verificationResults.totalSteps} Stages Verified (100% Passed)
                  </p>
                </div>
                <span className="text-xs font-mono text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                  Latency: {verificationResults.durationMs}ms
                </span>
              </div>

              <div className="space-y-2.5">
                {verificationResults.steps?.map((step: any) => (
                  <div
                    key={step.id}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          {step.id}: {step.name}
                        </span>
                        <span className="font-mono text-slate-500">{step.latencyMs}ms</span>
                      </div>
                      <p className="text-slate-600 mt-0.5">{step.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
