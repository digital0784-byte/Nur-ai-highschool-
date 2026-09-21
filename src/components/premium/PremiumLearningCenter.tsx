import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Lock,
  Play,
  Sparkles,
  Shield,
  ShieldCheck,
  Video,
  Box,
  FileText,
  FlaskConical,
  Headphones,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Zap,
  BarChart3,
  Volume2,
  Filter,
  Eye,
  RotateCcw,
  Check,
  Flame,
  ArrowRight,
  TrendingUp,
  BookOpen,
} from 'lucide-react';
import { Grade, SubjectStream } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { ProtectedMediaShield } from './ProtectedMediaShield';

export type PremiumSectionId =
  | 'video_library'
  | 'animations'
  | 'exam_engine'
  | 'science_lab'
  | 'audio_hub'
  | 'ai_study_plan';

interface PremiumLearningCenterProps {
  onNavigateToPayment: () => void;
  selectedGrade?: Grade;
  onGradeChange?: (grade: Grade) => void;
}

// Model data for Premium Video Lessons
interface PremiumVideoItem {
  id: string;
  title: string;
  subject: string;
  grade: Grade;
  unit: string;
  duration: string;
  instructor: string;
  thumbnail: string;
  overview: string;
  topics: string[];
}

const PREMIUM_VIDEOS: PremiumVideoItem[] = [
  {
    id: 'vid_m9_ch1_relations',
    title: 'Grade 9 Mathematics: Relations and Functions Complete Breakdown',
    subject: 'Mathematics',
    grade: 9,
    unit: 'Unit 1: Relations and Functions',
    duration: '28:45',
    instructor: 'Teacher Tadesse (Senior Math Lead)',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80',
    overview: 'In-depth video covering Cartesian products, domain, range, inverse relations, and solved Ethiopian national exam problems.',
    topics: ['Cartesian Product', 'Domain & Range', 'Functional Inverses', 'Exam Problem Solving'],
  },
  {
    id: 'vid_p9_ch2_kinematics',
    title: 'Grade 9 Physics: Motion in One Dimension & Acceleration Vectors',
    subject: 'Physics',
    grade: 9,
    unit: 'Unit 2: Kinematics',
    duration: '32:10',
    instructor: 'Dr. Rahel (PhD Physics)',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&q=80',
    overview: 'Detailed derivation of rectilinear motion equations (v = u + at, s = ut + 0.5at²) with real Ethiopian transportation examples.',
    topics: ['Displacement vs Distance', 'Velocity Graphs', 'Acceleration Vectors', 'Free Fall'],
  },
  {
    id: 'vid_c10_ch3_chemical_reactions',
    title: 'Grade 10 Chemistry: Chemical Reactions & Stoichiometry Balancing',
    subject: 'Chemistry',
    grade: 10,
    unit: 'Unit 3: Chemical Reactions',
    duration: '35:20',
    instructor: 'Teacher Aster (Chemistry Specialist)',
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80',
    overview: 'Master balancing redox reactions, mole-mass conversions, and limiting reagent calculations with step-by-step proof.',
    topics: ['Mole Concept', 'Stoichiometric Coefficients', 'Limiting Reagent', 'Percent Yield'],
  },
  {
    id: 'vid_b11_ch2_cellular_energetics',
    title: 'Grade 11 Biology: Cellular Respiration & ATP Synthase Mechanism',
    subject: 'Biology',
    grade: 11,
    unit: 'Unit 2: Cellular Energetics',
    duration: '40:15',
    instructor: 'Dr. Samuel (Biology Dept Head)',
    thumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600&q=80',
    overview: 'Comprehensive deep dive into Glycolysis, the Krebs cycle, mitochondrial electron transport chain, and chemiosmosis.',
    topics: ['Glycolysis', 'Krebs Cycle', 'Mitochondrial ETC', 'Chemiosmotic Coupling'],
  },
  {
    id: 'vid_p12_ch4_electromagnetism',
    title: 'Grade 12 Physics: Faraday Law, Lenz Law & AC Alternator Motors',
    subject: 'Physics',
    grade: 12,
    unit: 'Unit 4: Electromagnetism',
    duration: '38:00',
    instructor: 'Teacher Berhanu (National Physics Assessor)',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
    overview: 'Essential preparatory lesson for ESSLCE university entrance exam covering magnetic flux, induced EMF, and AC circuits.',
    topics: ['Magnetic Flux', 'Faraday Law of Induction', 'Lenz Law', 'AC Transformers'],
  },
  {
    id: 'vid_m12_ch3_integral_calculus',
    title: 'Grade 12 Mathematics: Fundamental Theorem of Calculus & Area Integration',
    subject: 'Mathematics',
    grade: 12,
    unit: 'Unit 3: Integral Calculus',
    duration: '45:30',
    instructor: 'Teacher Tadesse (Senior Math Lead)',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&q=80',
    overview: 'Definite integrals, area between curves, substitution rule, and integration by parts with previous entrance exam questions.',
    topics: ['Riemann Sums', 'Definite Integrals', 'Substitution Method', 'Integration by Parts'],
  },
];

// Model data for 2D & 3D Interactive Animations
interface PremiumAnimationItem {
  id: string;
  title: string;
  type: '2D' | '3D';
  subject: string;
  grade: Grade;
  unit: string;
  description: string;
  interactiveFeatures: string[];
}

const PREMIUM_ANIMATIONS: PremiumAnimationItem[] = [
  {
    id: 'anim2d_chem_g10_periodic',
    title: 'Interactive 2D Periodic Trends & Electron Configurations',
    type: '2D',
    subject: 'Chemistry',
    grade: 10,
    unit: 'Unit 2: Periodic Table',
    description: 'Dynamic 2D canvas displaying periodic trends: electronegativity, atomic radius, ionization energy, and Bohr atomic orbital shells.',
    interactiveFeatures: ['Interactive element selector', 'Electron shell filling toggle', 'Periodic gradient overlay', 'Real-time trend graph'],
  },
  {
    id: 'anim3d_bio_g11_mitosis',
    title: '3D High-Fidelity Cellular Division (Mitosis & Meiosis Simulation)',
    type: '3D',
    subject: 'Biology',
    grade: 11,
    unit: 'Unit 3: Cell Reproduction',
    description: 'WebGL 3D biological visualizer rendering prophase, metaphase, anaphase, telophase, and spindle fiber attachments with 360-degree rotation.',
    interactiveFeatures: ['360° Rotatable camera', 'Phase-by-phase scrubber', 'Chromosome zoom inspection', 'Crossing-over highlighter'],
  },
  {
    id: 'anim3d_phys_g12_circuits',
    title: '3D Electromagnetic Induction & Alternating Current Flux Visualizer',
    type: '3D',
    subject: 'Physics',
    grade: 12,
    unit: 'Unit 4: Electromagnetism',
    description: 'Interactive 3D laboratory rendering magnetic flux lines passing through rotating wire coils, induced voltage vectors, and sine wave generation.',
    interactiveFeatures: ['Coil rotation speed control', 'Magnetic field strength slider', 'Oscilloscope waveform display', 'Lenz law opposition vector'],
  },
  {
    id: 'anim2d_math_g11_trig',
    title: '2D Unit Circle Trigonometry & Function Generator',
    type: '2D',
    subject: 'Mathematics',
    grade: 11,
    unit: 'Unit 4: Trigonometric Functions',
    description: 'Interactive unit circle showing angle theta, sin/cos/tan projections, and synchronized Cartesian wave plotting in real time.',
    interactiveFeatures: ['Rotatable radius arm', 'Radian & degree switcher', 'Exact radical values display', 'Dynamic wave traces'],
  },
];

// Model data for Final Exam Preparation Engine
interface ExamQuestionItem {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  yearReference: string;
}

interface ExamSet {
  id: string;
  title: string;
  subject: string;
  grade: Grade;
  durationMinutes: number;
  questionsCount: number;
  type: 'chapter_bank' | 'mock_exam' | 'practice_test';
  questions: ExamQuestionItem[];
}

const EXAM_SETS: ExamSet[] = [
  {
    id: 'exam_m12_mock_2025',
    title: 'ESSLCE National Mock Exam: Grade 12 Mathematics (Natural & Social)',
    subject: 'Mathematics',
    grade: 12,
    durationMinutes: 60,
    questionsCount: 4,
    type: 'mock_exam',
    questions: [
      {
        id: 'q1',
        question: 'What is the limit of (sin(3x)) / x as x approaches 0?',
        options: ['0', '1', '3', 'Undefined'],
        correctAnswer: 2,
        explanation: 'Using standard trigonometric limit rule: lim(x->0) [sin(kx)/x] = k. Here k = 3, so the limit is 3.',
        yearReference: 'MoE ESSLCE 2023 Paper I',
      },
      {
        id: 'q2',
        question: 'If f(x) = ln(x² + 1), what is f’(1)?',
        options: ['1', '2', '0.5', '1.5'],
        correctAnswer: 0,
        explanation: 'By chain rule, f’(x) = (2x)/(x² + 1). Evaluating at x = 1: f’(1) = 2(1)/(1 + 1) = 2/2 = 1.',
        yearReference: 'MoE ESSLCE 2022 Paper II',
      },
      {
        id: 'q3',
        question: 'What is the integral of e^(2x) dx from 0 to 1?',
        options: ['(e² - 1) / 2', 'e² - 1', '2(e² - 1)', '(e² + 1) / 2'],
        correctAnswer: 0,
        explanation: 'Antiderivative is (1/2)e^(2x). Evaluated between 0 and 1: (1/2)(e² - e⁰) = (e² - 1)/2.',
        yearReference: 'MoE ESSLCE 2024 Model',
      },
      {
        id: 'q4',
        question: 'Which of the following matrices is singular (non-invertible)?',
        options: [
          'Matrix [[1, 2], [3, 4]]',
          'Matrix [[2, 4], [3, 6]]',
          'Matrix [[1, 0], [0, 1]]',
          'Matrix [[5, 1], [2, 1]]',
        ],
        correctAnswer: 1,
        explanation: 'A matrix is singular if its determinant is zero. Det([[2, 4], [3, 6]]) = (2*6) - (4*3) = 12 - 12 = 0.',
        yearReference: 'MoE ESSLCE 2021 Paper',
      },
    ],
  },
  {
    id: 'exam_p12_chapter_flux',
    title: 'Chapter Practice Test: Grade 12 Physics Electromagnetism',
    subject: 'Physics',
    grade: 12,
    durationMinutes: 30,
    questionsCount: 3,
    type: 'chapter_bank',
    questions: [
      {
        id: 'pq1',
        question: 'According to Faraday’s Law of Electromagnetic Induction, the induced electromotive force (EMF) is proportional to:',
        options: [
          'The magnitude of the magnetic field alone',
          'The rate of change of magnetic flux linkage',
          'The total resistance of the circuit',
          'The surface area alone without respect to time',
        ],
        correctAnswer: 1,
        explanation: 'Faraday’s law explicitly states EMF = -N(dΦ/dt), meaning it is proportional to the time rate of change of magnetic flux.',
        yearReference: 'MoE Physics National Bank',
      },
      {
        id: 'pq2',
        question: 'What principle does Lenz’s Law primarily conserve?',
        options: ['Conservation of Electric Charge', 'Conservation of Momentum', 'Conservation of Energy', 'Conservation of Mass'],
        correctAnswer: 2,
        explanation: 'Lenz’s law is a consequence of the law of conservation of energy. Mechanical work done against the magnetic opposition is converted into electrical energy.',
        yearReference: 'MoE Physics Entrance 2022',
      },
      {
        id: 'pq3',
        question: 'An alternating current has an RMS voltage of 220 V. What is its peak (maximum) voltage?',
        options: ['220 V', '311 V', '155 V', '440 V'],
        correctAnswer: 1,
        explanation: 'Peak Voltage V_peak = V_rms * sqrt(2) = 220 * 1.414 ≈ 311.13 V.',
        yearReference: 'Ethiopian Electric Agency Standard',
      },
    ],
  },
];

// Model data for Virtual Science Laboratory
interface VirtualLabItem {
  id: string;
  title: string;
  subject: string;
  grade: Grade;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationEstimate: string;
  materials: string[];
  steps: string[];
  simulationType: 'titration' | 'projectile' | 'microscope' | 'circuit';
}

const VIRTUAL_LABS: VirtualLabItem[] = [
  {
    id: 'lab_chem_titration',
    title: 'Virtual Chemistry Lab: Acid-Base Titration (HCl + NaOH)',
    subject: 'Chemistry',
    grade: 10,
    difficulty: 'Intermediate',
    durationEstimate: '20 mins',
    materials: ['Burette (0.1M NaOH)', 'Conical Flask (25mL unknown HCl)', 'Phenolphthalein Indicator', 'Magnetic Stirrer', 'Digital pH Meter'],
    steps: [
      'Fill the burette with standard sodium hydroxide (NaOH) solution up to 0.00 mL.',
      'Pipette 25.0 mL of hydrochloric acid (HCl) into the conical flask and add 3 drops of phenolphthalein indicator.',
      'Turn on the magnetic stirrer at medium speed to homogenize the acid-indicator solution.',
      'Gradually open the burette stopcock, dispensing NaOH drop-by-drop until the persistent light pink endpoint is observed.',
      'Record the final burette volume and calculate the molarity of the unknown HCl using M1V1 = M2V2.',
    ],
    simulationType: 'titration',
  },
  {
    id: 'lab_phys_projectile',
    title: 'Virtual Physics Lab: 2D Projectile Range & Launch Angle Optimization',
    subject: 'Physics',
    grade: 9,
    difficulty: 'Beginner',
    durationEstimate: '15 mins',
    materials: ['Digital Spring Cannon', 'High-Speed Stroboscope Sensor', 'Steel Sphere (0.05 kg)', 'Horizontal Measuring Track'],
    steps: [
      'Place the cannon on a level horizontal surface (initial height h = 0 m).',
      'Set initial launch velocity v0 to 20 m/s.',
      'Vary the launch angle from 15° to 75° in 15° increments.',
      'Measure and record the horizontal range R for each angle trial.',
      'Verify that maximum range is achieved at θ = 45° where sin(2θ) = 1.',
    ],
    simulationType: 'projectile',
  },
  {
    id: 'lab_bio_microscope',
    title: 'Virtual Biology Lab: Onion Allium Cepa Epidermal Cell Staining',
    subject: 'Biology',
    grade: 9,
    difficulty: 'Beginner',
    durationEstimate: '15 mins',
    materials: ['Compound Light Microscope (100x-400x)', 'Glass Slides & Coverslips', 'Iodine / Lugol Solution', 'Onion Epidermal Peel'],
    steps: [
      'Peel a transparent epidermal membrane from the concave surface of an onion bulb.',
      'Mount the tissue flat on a clean glass slide without creases.',
      'Add one drop of Lugols iodine stain to accentuate cell walls and nuclei.',
      'Carefully lower the coverslip at a 45-degree angle to avoid trapping air bubbles.',
      'Focus under 10x objective, then transition to 40x high-power to count cells and identify cellulose cell walls.',
    ],
    simulationType: 'microscope',
  },
];

// Model data for Weekly Audio Revision Hub
interface WeeklyAudioItem {
  id: string;
  title: string;
  subject: string;
  grade: Grade;
  weekLabel: string;
  duration: string;
  audioUrl: string;
  summary: string;
  keyTakeaways: string[];
  spokenTips: string;
}

const WEEKLY_AUDIOS: WeeklyAudioItem[] = [
  {
    id: 'audio_w1_math_functions',
    title: 'Week 1 Math Revision: Functions, Inverses & National Exam Shortcuts',
    subject: 'Mathematics',
    grade: 9,
    weekLabel: 'Week 1 Revision',
    duration: '14:20',
    audioUrl: 'https://example.com/audio/math_w1.mp3',
    summary: 'Spoken breakdown of horizontal line tests, domain constraints for rational and radical functions, and quick-check elimination strategies.',
    keyTakeaways: [
      'A relation is a function if every element of domain maps to exactly one range element.',
      'To find inverse f^(-1)(x), swap x and y, then solve for y.',
      'Watch out for denominator zero and negative radicands in domain calculations.',
    ],
    spokenTips: 'Exam tip: On multiple choice questions, substitute simple numbers like x = 0 or x = 1 to eliminate at least two bogus choices immediately.',
  },
  {
    id: 'audio_w2_phys_kinematics',
    title: 'Week 2 Physics Audio: Motion Vectors & Velocity-Time Graph Traps',
    subject: 'Physics',
    grade: 9,
    weekLabel: 'Week 2 Revision',
    duration: '16:45',
    audioUrl: 'https://example.com/audio/phys_w2.mp3',
    summary: 'Audio explanation of slope interpretation (acceleration) vs area under curve (displacement), plus uniform circular motion tips.',
    keyTakeaways: [
      'Area under v-t graph represents net displacement, NOT total distance if velocity crosses negative axis.',
      'Slope of displacement-time graph is instantaneous velocity.',
      'In free fall near Earth, acceleration is always -9.8 m/s² downwards regardless of upward or downward velocity.',
    ],
    spokenTips: 'Exam tip: Always check units before computing! If velocity is in km/h, multiply by 5/18 to convert to m/s before plugging into kinematic formulas.',
  },
  {
    id: 'audio_w3_chem_bonding',
    title: 'Week 3 Chemistry Audio: Ionic vs Covalent Bonding & Lewis Structures',
    subject: 'Chemistry',
    grade: 10,
    weekLabel: 'Week 3 Revision',
    duration: '18:10',
    audioUrl: 'https://example.com/audio/chem_w3.mp3',
    summary: 'Comprehensive audio masterclass covering octet exceptions, electronegativity differences, and polar vs non-polar molecular geometry.',
    keyTakeaways: [
      'Electronegativity difference > 1.7 generally results in ionic bonds; < 0.4 yields non-polar covalent.',
      'Elements in period 3 and below (like P and S) can expand their octets.',
      'Hydrogen bonds occur only when H is bonded to highly electronegative F, O, or N.',
    ],
    spokenTips: 'Exam tip: Remember VSEPR shape naming! Water (H2O) has 4 electron pairs but only 2 bonding pairs, making its geometry Bent (104.5°), not linear.',
  },
];

export const PremiumLearningCenter: React.FC<PremiumLearningCenterProps> = ({
  onNavigateToPayment,
  selectedGrade: propGrade = 9,
  onGradeChange,
}) => {
  const { user, userProfile } = useAuth();
  const { isOwnerSuperAdmin, hasLearningAccess } = useSubscription();

  // Active section inside Premium Learning Center
  const [activeSection, setActiveSection] = useState<PremiumSectionId>('video_library');
  const [gradeFilter, setGradeFilter] = useState<Grade>(propGrade);
  const [subjectFilter, setSubjectFilter] = useState<string>('All');

  // Video playback modal / protected shield state
  const [selectedVideo, setSelectedVideo] = useState<PremiumVideoItem | null>(null);

  // 2D/3D Animation viewer state
  const [selectedAnimation, setSelectedAnimation] = useState<PremiumAnimationItem | null>(PREMIUM_ANIMATIONS[0]);
  const [animPlaying, setAnimPlaying] = useState<boolean>(true);
  const [animProgress, setAnimProgress] = useState<number>(35);
  const [animSpeed, setAnimSpeed] = useState<number>(1);

  // Final Exam Engine State
  const [activeExamSet, setActiveExamSet] = useState<ExamSet>(EXAM_SETS[0]);
  const [examAnswers, setExamAnswers] = useState<Record<string, number>>({});
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [examTimeRemaining, setExamTimeRemaining] = useState<number>(3600);
  const [isExamTimerRunning, setIsExamTimerRunning] = useState<boolean>(true);

  // Virtual Lab State
  const [activeLab, setActiveLab] = useState<VirtualLabItem>(VIRTUAL_LABS[0]);
  const [labCurrentStep, setLabCurrentStep] = useState<number>(0);
  const [labBuretteVolume, setLabBuretteVolume] = useState<number>(0);
  const [labColorState, setLabColorState] = useState<'clear' | 'light_pink' | 'deep_magenta'>('clear');

  // Weekly Audio Player State
  const [activeAudio, setActiveAudio] = useState<WeeklyAudioItem>(WEEKLY_AUDIOS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(45);
  const [playbackRate, setPlaybackRate] = useState<number>(1);

  // Anti-theft warning state for screenshot/recording attempts
  const [securityNotice, setSecurityNotice] = useState<string | null>(null);

  // Sync grade filter if parent passes grade
  useEffect(() => {
    setGradeFilter(propGrade);
  }, [propGrade]);

  // Exam Countdown Timer
  useEffect(() => {
    if (!isExamTimerRunning || examSubmitted) return;
    const timer = setInterval(() => {
      setExamTimeRemaining((prev) => {
        if (prev <= 1) {
          setExamSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isExamTimerRunning, examSubmitted]);

  // Handle Lab Titration Slider
  useEffect(() => {
    if (labBuretteVolume < 23.5) {
      setLabColorState('clear');
    } else if (labBuretteVolume >= 23.5 && labBuretteVolume <= 24.8) {
      setLabColorState('light_pink'); // Perfect endpoint
    } else {
      setLabColorState('deep_magenta'); // Overshot endpoint
    }
  }, [labBuretteVolume]);

  // Anti-theft protections: Disable right-click & alert on copy/screen capture keys
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setSecurityNotice('🔒 Content Protection: Right-click is disabled to protect proprietary NUR AI curriculum assets.');
      setTimeout(() => setSecurityNotice(null), 4000);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === 'PrintScreen') ||
        (e.ctrlKey && e.key === 'c' && window.getSelection()?.toString().length! > 20) ||
        (e.ctrlKey && e.key === 's')
      ) {
        e.preventDefault();
        setSecurityNotice('🔒 NUR AI Anti-Theft Guard: Content saving & capture shortcuts are prohibited on Premium assets.');
        setTimeout(() => setSecurityNotice(null), 4000);
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Filtered lists
  const filteredVideos = useMemo(() => {
    return PREMIUM_VIDEOS.filter((v) => {
      const matchGrade = gradeFilter ? v.grade === gradeFilter : true;
      const matchSubject = subjectFilter !== 'All' ? v.subject === subjectFilter : true;
      return matchGrade && matchSubject;
    });
  }, [gradeFilter, subjectFilter]);

  const filteredAnimations = useMemo(() => {
    return PREMIUM_ANIMATIONS.filter((a) => {
      const matchGrade = gradeFilter ? a.grade === gradeFilter : true;
      const matchSubject = subjectFilter !== 'All' ? a.subject === subjectFilter : true;
      return matchGrade && matchSubject;
    });
  }, [gradeFilter, subjectFilter]);

  // Score calculation for Exam Engine
  const examScore = useMemo(() => {
    let correct = 0;
    activeExamSet.questions.forEach((q) => {
      if (examAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: activeExamSet.questions.length,
      percentage: Math.round((correct / activeExamSet.questions.length) * 100),
    };
  }, [activeExamSet, examAnswers]);

  // Watermark string
  const studentWatermark = useMemo(() => {
    const phone = (userProfile as any)?.phone || (userProfile as any)?.phoneNumber || '091****7862';
    const id = userProfile?.uid?.slice(0, 8) || 'NUR-STD';
    return `${id} • ${phone} • ${new Date().toLocaleDateString()}`;
  }, [userProfile]);

  // ---------------------------------------------------------------------------
  // REQUIREMENT 4: NON-PREMIUM STUDENT EXPERIENCE GATEWAY
  // ---------------------------------------------------------------------------
  if (!hasLearningAccess && !isOwnerSuperAdmin) {
    return (
      <div id="premium-learning-center-paywall" className="max-w-4xl mx-auto my-8 px-4">
        {/* Anti-Slop Premium Card */}
        <div className="bg-[#FAF6EC] border-[2px] border-[#38332D] rounded-2xl p-6 sm:p-10 shadow-[6px_6px_0px_0px_#38332D] text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#38332D] text-amber-400 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black rounded-full uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              <span>🔒 Premium Content</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-ethiopic text-[#1E1B18]">
              NUR AI Premium Learning Center
            </h2>
            <p className="text-sm font-semibold text-stone-700 font-serif-ethiopic">
              This content is available to NUR AI Premium members.
            </p>
            <div className="pt-2">
              <span className="text-xl sm:text-2xl font-black text-[#2E6B4A] font-sans">
                Premium: 54 ETB/month
              </span>
            </div>
            <p className="text-xs text-stone-500 font-serif-ethiopic pt-1">
              በወር 54 ብር ብቻ በመክፈል ቪዲዮዎችን፣ 2D/3D አኒሜሽኖችን፣ የፈተና ጥያቄዎችን፣ የላብራቶሪ ማስመሰያዎችን እና ሳምንታዊ የድምፅ ትምህርቶችን ያግኙ።
            </p>
          </div>

          {/* 6 Premium Modules Feature Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-left pt-2">
            {[
              { icon: Video, title: 'Video Lessons Library', desc: 'All official Grade 9-12 high school lessons' },
              { icon: Box, title: '2D & 3D Animations', desc: 'Interactive visual science & math simulations' },
              { icon: FileText, title: 'Final Exam Preparation', desc: 'Question banks, practice tests & mock exams' },
              { icon: FlaskConical, title: 'Virtual Science Lab', desc: 'Interactive step-by-step chemistry & physics labs' },
              { icon: Headphones, title: 'Weekly Audio Revision', desc: 'Summary podcasts & spoken national exam tips' },
              { icon: Calendar, title: 'Personalized AI Plan', desc: 'Adaptive revision schedule & readiness score' },
            ].map((m, idx) => {
              const Icon = m.icon;
              return (
                <div
                  key={idx}
                  className="p-3.5 bg-white rounded-xl border border-stone-300 flex items-start gap-3 shadow-2xs"
                >
                  <div className="p-2 bg-amber-50 rounded-lg text-amber-800 shrink-0 border border-amber-200">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1E1B18] font-serif-ethiopic">{m.title}</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">{m.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Button: Upgrade to Premium */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onNavigateToPayment}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#F59E0B] hover:bg-[#D97706] text-stone-950 font-black text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 border border-amber-600"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>Upgrade to Premium</span>
            </button>
          </div>

          <div className="text-[11px] text-stone-500 flex items-center justify-center gap-1.5 font-serif-ethiopic">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official Ethiopian High School Curriculum Support • Telebirr & CBE Birr (54 ETB)</span>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // FULL PREMIUM LEARNING CENTER INTERFACE (AUTHORIZED STUDENTS & SUPER ADMIN)
  // ---------------------------------------------------------------------------
  return (
    <div id="premium-learning-center" className="max-w-6xl mx-auto space-y-6 pb-16 select-none">
      {/* Anti-Theft Security Floating Notice */}
      {securityNotice && (
        <div className="fixed top-20 right-6 z-50 p-4 bg-[#38332D] text-amber-300 border-2 border-amber-500 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in max-w-md text-xs font-serif-ethiopic">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <span>{securityNotice}</span>
        </div>
      )}

      {/* Top Premium Hub Header & Watermark Notice */}
      <div className="bg-[#38332D] text-[#FAF6EC] p-5 sm:p-7 rounded-2xl shadow-md border border-[#4A4237] relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 text-xs font-bold rounded-full mb-2.5 border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NUR AI Premium Learning Center • 54 ETB/month</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif-ethiopic text-white">
              የኑር AI ፕሪሚየም የትምህርት ማዕከል (Premium Learning Center)
            </h1>
            <p className="text-xs sm:text-sm text-[#D8CEBC] mt-1 font-serif-ethiopic max-w-2xl">
              ይፋዊ ቪዲዮዎች፣ 2D/3D ምስላዊ አኒሜሽኖች፣ የፈተና ጥያቄዎች ባንክ፣ የሳይንስ ላብራቶሪ ማስመሰያ እና ሳምንታዊ የድምፅ ማጠቃለያዎች።
            </p>
          </div>

          {/* Security & Watermark Shield Badge */}
          <div className="bg-[#2A2622] p-3 rounded-xl border border-stone-700 text-right shrink-0">
            <div className="flex items-center justify-end gap-1.5 text-xs text-amber-400 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Protected Content Shield Active</span>
            </div>
            <div className="text-[10px] text-stone-400 font-mono mt-1">
              Watermark: {studentWatermark}
            </div>
            <div className="text-[10px] text-stone-500 mt-0.5">
              30-Min Expiring Stream Tokens • Anti-Theft Guard
            </div>
          </div>
        </div>
      </div>

      {/* Grade & Filter Bar */}
      <div className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        {/* Grade Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-700 font-serif-ethiopic flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>ክፍል (Grade):</span>
          </span>
          {([9, 10, 11, 12] as Grade[]).map((g) => (
            <button
              key={g}
              onClick={() => {
                setGradeFilter(g);
                if (onGradeChange) onGradeChange(g);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                gradeFilter === g
                  ? 'bg-[#2E6B4A] text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-100'
              }`}
            >
              ክፍል {g}
            </button>
          ))}
        </div>

        {/* Subject Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-700 font-serif-ethiopic">የትምህርት አይነት:</span>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="text-xs font-bold p-1.5 bg-white border border-stone-300 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#2E6B4A]"
          >
            <option value="All">ሁሉም ትምህርቶች (All Subjects)</option>
            <option value="Mathematics">Mathematics (ሂሳብ)</option>
            <option value="Physics">Physics (ፊዚክስ)</option>
            <option value="Chemistry">Chemistry (ኬሚስትሪ)</option>
            <option value="Biology">Biology (ባዮሎጂ)</option>
          </select>
        </div>
      </div>

      {/* 6 SECTION TABS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {[
          { id: 'video_library', icon: Video, label: '1. Video Lessons', sub: 'ይፋዊ ቪዲዮዎች' },
          { id: 'animations', icon: Box, label: '2. 2D & 3D Sims', sub: 'ምስላዊ አኒሜሽን' },
          { id: 'exam_engine', icon: FileText, label: '3. Final Exam', sub: 'የፈተና ሞተር' },
          { id: 'science_lab', icon: FlaskConical, label: '4. Virtual Lab', sub: 'የሳይንስ ላብ' },
          { id: 'audio_hub', icon: Headphones, label: '5. Audio Hub', sub: 'ሳምንታዊ ድምፅ' },
          { id: 'ai_study_plan', icon: Calendar, label: '6. AI Study Plan', sub: 'የግል እቅድ' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as PremiumSectionId)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                isActive
                  ? 'bg-[#FAF6EC] border-[2px] border-[#38332D] shadow-[3px_3px_0px_0px_#38332D] text-[#1E1B18]'
                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#2E6B4A]' : 'text-stone-400'}`} />
                {isActive && <span className="w-2 h-2 rounded-full bg-[#2E6B4A]" />}
              </div>
              <div>
                <div className="text-xs font-bold font-serif-ethiopic leading-tight">{tab.label}</div>
                <div className="text-[10px] text-stone-500 font-serif-ethiopic">{tab.sub}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ===================================================================== */}
      {/* SECTION 1: VIDEO LESSONS LIBRARY                                      */}
      {/* ===================================================================== */}
      {activeSection === 'video_library' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold font-serif-ethiopic text-[#1E1B18] flex items-center gap-2">
              <Video className="w-5 h-5 text-[#2E6B4A]" />
              <span>የቪዲዮ ትምህርቶች ቤተ-መጽሐፍት (Official Video Lessons Library)</span>
            </h2>
            <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
              {filteredVideos.length} ቪዲዮዎች ይገኛሉ
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-xl border border-stone-300 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-video bg-stone-900 group cursor-pointer" onClick={() => setSelectedVideo(video)}>
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                    {video.duration}
                  </span>
                  <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    ክፍል {video.grade}
                  </span>
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-[#2E6B4A] uppercase tracking-wider">
                      {video.subject} • {video.unit}
                    </div>
                    <h3 className="text-sm font-bold font-serif-ethiopic text-[#1E1B18] mt-1 line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                      {video.overview}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-600 font-serif-ethiopic">{video.instructor}</span>
                    <button
                      onClick={() => setSelectedVideo(video)}
                      className="px-3 py-1.5 bg-[#2E6B4A] hover:bg-[#235338] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>ይመልከቱ</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal Player with ProtectedMediaShield for Video Lessons */}
          {selectedVideo && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
              <div className="bg-[#FAF6EC] rounded-2xl border-[2px] border-[#38332D] max-w-4xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 space-y-4 shadow-2xl relative">
                <div className="flex items-center justify-between border-b border-stone-300 pb-3">
                  <div>
                    <span className="text-xs font-bold text-[#2E6B4A] uppercase">
                      {selectedVideo.subject} • ክፍል {selectedVideo.grade}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold font-serif-ethiopic text-[#1E1B18]">
                      {selectedVideo.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="px-3 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    ✕ ዝጋ (Close)
                  </button>
                </div>

                {/* Shield Protected Media */}
                <div className="rounded-xl overflow-hidden shadow-lg border border-stone-800">
                  <ProtectedMediaShield
                    contentId={selectedVideo.id}
                    contentType="video"
                    title={selectedVideo.title}
                    mediaUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                    thumbnailUrl={selectedVideo.thumbnail}
                    overview={selectedVideo.overview}
                    duration={selectedVideo.duration}
                    instructor={selectedVideo.instructor}
                    onOpenSubscriptionModal={onNavigateToPayment}
                  />
                </div>

                {/* Video Info Breakdown */}
                <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-600">
                    <span>አስተማሪ፡ <strong>{selectedVideo.instructor}</strong></span>
                    <span>ርዝማኔ፡ <strong>{selectedVideo.duration}</strong></span>
                  </div>
                  <div className="text-xs text-stone-700 leading-relaxed font-serif-ethiopic">
                    {selectedVideo.overview}
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {selectedVideo.topics.map((t, idx) => (
                      <span key={idx} className="text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* SECTION 2: 2D & 3D INTERACTIVE ANIMATIONS                             */}
      {/* ===================================================================== */}
      {activeSection === 'animations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold font-serif-ethiopic text-[#1E1B18] flex items-center gap-2">
              <Box className="w-5 h-5 text-[#2E6B4A]" />
              <span>2D እና 3D ትምህርታዊ ምስላዊ ማስመሰያዎች (Interactive Simulations)</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column: Animation Selection List */}
            <div className="lg:col-span-4 space-y-3">
              <div className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                የማስመሰያ ዝርዝር (Simulations)
              </div>
              {filteredAnimations.map((anim) => {
                const isSelected = selectedAnimation?.id === anim.id;
                return (
                  <button
                    key={anim.id}
                    onClick={() => setSelectedAnimation(anim)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FAF6EC] border-[2px] border-[#38332D] shadow-xs'
                        : 'bg-white border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                        anim.type === '3D' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {anim.type} Simulation
                      </span>
                      <span className="text-xs font-bold text-stone-500">ክፍል {anim.grade}</span>
                    </div>
                    <h4 className="text-xs font-bold font-serif-ethiopic text-[#1E1B18] mt-2 line-clamp-2">
                      {anim.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-1 line-clamp-1">{anim.unit}</p>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Active Interactive Canvas Sandbox */}
            <div className="lg:col-span-8 bg-[#FAF6EC] border-[2px] border-[#38332D] rounded-2xl p-5 shadow-xs space-y-4">
              {selectedAnimation ? (
                <>
                  <div className="flex items-center justify-between border-b border-stone-300 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#2E6B4A]">{selectedAnimation.subject}</span>
                        <span className="text-[10px] bg-[#38332D] text-white px-1.5 py-0.5 rounded font-bold">
                          {selectedAnimation.type} WebGL Simulation
                        </span>
                      </div>
                      <h3 className="text-base font-bold font-serif-ethiopic text-[#1E1B18] mt-1">
                        {selectedAnimation.title}
                      </h3>
                    </div>

                    <div className="text-xs text-stone-500 font-mono">
                      Token: Valid (30 min)
                    </div>
                  </div>

                  {/* Interactive Simulation Sandbox Viewer */}
                  <div className="relative aspect-video bg-gradient-to-br from-stone-900 via-slate-900 to-black rounded-xl overflow-hidden border border-stone-700 flex flex-col justify-between p-4 text-white">
                    {/* Dynamic Student Watermark Overlay */}
                    <div className="absolute top-2 right-2 pointer-events-none text-[9px] font-mono text-white/30 select-none">
                      {studentWatermark}
                    </div>

                    {/* Simulation Visual Representation */}
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center space-y-3">
                        <div className="relative w-28 h-28 mx-auto">
                          <div className={`absolute inset-0 rounded-full border-4 border-amber-400/40 ${
                            animPlaying ? 'animate-spin' : ''
                          }`} />
                          <div className="absolute inset-4 rounded-full border-2 border-dashed border-emerald-400/60" />
                          <div className="absolute inset-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-300 font-black text-xs">
                            {selectedAnimation.type}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-amber-300 font-serif-ethiopic">
                            {selectedAnimation.title}
                          </div>
                          <p className="text-xs text-stone-300 max-w-md mx-auto mt-1">
                            {selectedAnimation.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Simulation Controls Bar */}
                    <div className="bg-black/60 backdrop-blur-xs p-3 rounded-lg flex items-center justify-between gap-4 text-xs">
                      <button
                        onClick={() => setAnimPlaying(!animPlaying)}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-md font-bold cursor-pointer flex items-center gap-1"
                      >
                        {animPlaying ? 'Pause (አቁም)' : 'Play (አጫውት)'}
                      </button>

                      <div className="flex-1 flex items-center gap-2">
                        <span className="text-[10px] text-stone-400">Scrubber:</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={animProgress}
                          onChange={(e) => setAnimProgress(Number(e.target.value))}
                          className="flex-1 accent-amber-400 cursor-pointer"
                        />
                        <span className="text-[10px] font-mono">{animProgress}%</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-stone-400">Speed:</span>
                        {[0.5, 1, 1.5, 2].map((s) => (
                          <button
                            key={s}
                            onClick={() => setAnimSpeed(s)}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              animSpeed === s ? 'bg-white text-black' : 'text-stone-300 hover:bg-stone-800'
                            }`}
                          >
                            {s}x
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Features Checklist */}
                  <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-2">
                    <div className="text-xs font-bold text-stone-700">የዚህ ማስመሰያ ልዩ ችሎታዎች (Interactive Features):</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {selectedAnimation.interactiveFeatures.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-stone-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6B4A]" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-10 text-center text-stone-500 text-xs">
                  እባክዎ ከግራ በኩል የሚፈልጉትን ማስመሰያ ይምረጡ።
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SECTION 3: FINAL EXAM PREPARATION ENGINE                              */}
      {/* ===================================================================== */}
      {activeSection === 'exam_engine' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold font-serif-ethiopic text-[#1E1B18] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#2E6B4A]" />
              <span>የመጨረሻ እና የብሔራዊ ፈተናዎች ዝግጅት ሞተር (Final Exam Preparation Engine)</span>
            </h2>

            {/* Live Exam Timer */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FAF6EC] border border-[#38332D] rounded-xl text-xs font-mono font-bold text-[#1E1B18]">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>
                {Math.floor(examTimeRemaining / 60)}:
                {(examTimeRemaining % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Exam Set Selector */}
          <div className="flex flex-wrap gap-2">
            {EXAM_SETS.map((set) => (
              <button
                key={set.id}
                onClick={() => {
                  setActiveExamSet(set);
                  setExamAnswers({});
                  setExamSubmitted(false);
                  setExamTimeRemaining(set.durationMinutes * 60);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  activeExamSet.id === set.id
                    ? 'bg-[#2E6B4A] text-white border-[#2E6B4A] shadow-xs'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                }`}
              >
                {set.title} ({set.questionsCount} Questions)
              </button>
            ))}
          </div>

          {/* Exam Questions Container */}
          <div className="bg-[#FAF6EC] border-[2px] border-[#38332D] rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-stone-300 pb-3">
              <div>
                <span className="text-[11px] font-bold text-[#2E6B4A] uppercase">
                  {activeExamSet.subject} • ክፍል {activeExamSet.grade} • {activeExamSet.type.replace('_', ' ').toUpperCase()}
                </span>
                <h3 className="text-base font-bold font-serif-ethiopic text-[#1E1B18]">
                  {activeExamSet.title}
                </h3>
              </div>

              {examSubmitted && (
                <div className="text-right">
                  <div className="text-xs font-bold text-stone-600">ውጤት (Score)</div>
                  <div className={`text-lg font-black ${examScore.percentage >= 75 ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {examScore.correct} / {examScore.total} ({examScore.percentage}%)
                  </div>
                </div>
              )}
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {activeExamSet.questions.map((q, qIndex) => {
                const selected = examAnswers[q.id];
                const isCorrect = selected === q.correctAnswer;
                return (
                  <div
                    key={q.id}
                    className="p-4 sm:p-5 bg-white rounded-xl border border-stone-300 space-y-3 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-[#38332D] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {qIndex + 1}
                        </span>
                        <h4 className="text-sm font-bold text-[#1E1B18] font-serif-ethiopic leading-relaxed">
                          {q.question}
                        </h4>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono shrink-0">
                        {q.yearReference}
                      </span>
                    </div>

                    {/* 4 Multiple Choice Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = selected === optIdx;
                        let optionStyle = 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-800';

                        if (isChosen) {
                          optionStyle = 'bg-amber-100 border-amber-400 text-amber-950 ring-1 ring-amber-400 font-bold';
                        }

                        if (examSubmitted) {
                          if (optIdx === q.correctAnswer) {
                            optionStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                          } else if (isChosen && !isCorrect) {
                            optionStyle = 'bg-rose-100 border-rose-400 text-rose-950 font-bold';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={examSubmitted}
                            onClick={() => setExamAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                            className={`p-3 rounded-lg border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${optionStyle}`}
                          >
                            <span>
                              <strong className="mr-2 font-mono">
                                {String.fromCharCode(65 + optIdx)}.
                              </strong>
                              {opt}
                            </span>
                            {examSubmitted && optIdx === q.correctAnswer && (
                              <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation Box when submitted */}
                    {examSubmitted && (
                      <div className="p-3 bg-[#FAF6EC] border border-[#D5C9AC] rounded-lg text-xs space-y-1">
                        <div className="font-bold text-stone-900 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#2E6B4A]" />
                          <span>የመልስ ማብራሪያ (Answer Explanation):</span>
                        </div>
                        <p className="text-stone-700 leading-relaxed font-serif-ethiopic">
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Exam Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-300">
              <span className="text-xs text-stone-500">
                የተመለሱ ጥያቄዎች፡ {Object.keys(examAnswers).length} ከ {activeExamSet.questions.length}
              </span>

              {!examSubmitted ? (
                <button
                  onClick={() => setExamSubmitted(true)}
                  className="px-6 py-2.5 bg-[#2E6B4A] hover:bg-[#235338] text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ፈተናውን ጨርስና ውጤት እይ (Submit Exam)</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setExamAnswers({});
                    setExamSubmitted(false);
                    setExamTimeRemaining(activeExamSet.durationMinutes * 60);
                  }}
                  className="px-5 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>እንደገና ፈትን (Retake)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SECTION 4: VIRTUAL SCIENCE LABORATORY                                 */}
      {/* ===================================================================== */}
      {activeSection === 'science_lab' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold font-serif-ethiopic text-[#1E1B18] flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-[#2E6B4A]" />
              <span>የሳይንስ ቨርቹዋል ላብራቶሪ (Virtual Science Laboratory)</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Lab selector */}
            <div className="lg:col-span-4 space-y-3">
              <div className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                የላብራቶሪ ሙከራዎች (Lab Experiments)
              </div>
              {VIRTUAL_LABS.map((lab) => {
                const isSelected = activeLab.id === lab.id;
                return (
                  <button
                    key={lab.id}
                    onClick={() => {
                      setActiveLab(lab);
                      setLabCurrentStep(0);
                      setLabBuretteVolume(0);
                    }}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FAF6EC] border-[2px] border-[#38332D] shadow-xs'
                        : 'bg-white border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase">
                        {lab.subject} Lab
                      </span>
                      <span className="text-xs font-bold text-stone-500">ክፍል {lab.grade}</span>
                    </div>
                    <h4 className="text-xs font-bold font-serif-ethiopic text-[#1E1B18] mt-2 line-clamp-2">
                      {lab.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-1">ግምት፡ {lab.durationEstimate}</p>
                  </button>
                );
              })}
            </div>

            {/* Interactive Lab Apparatus & Step-by-Step Workspace */}
            <div className="lg:col-span-8 bg-[#FAF6EC] border-[2px] border-[#38332D] rounded-2xl p-5 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-stone-300 pb-3">
                <div>
                  <span className="text-xs font-bold text-[#2E6B4A] uppercase">
                    {activeLab.subject} • ደረጃ፡ {activeLab.difficulty}
                  </span>
                  <h3 className="text-base font-bold font-serif-ethiopic text-[#1E1B18] mt-0.5">
                    {activeLab.title}
                  </h3>
                </div>
                <span className="text-xs font-bold text-stone-600 font-serif-ethiopic">
                  ደረጃ {labCurrentStep + 1} ከ {activeLab.steps.length}
                </span>
              </div>

              {/* Lab Interactive Workbench Apparatus */}
              <div className="bg-white rounded-xl border border-stone-300 p-5 space-y-4 shadow-2xs">
                {activeLab.simulationType === 'titration' ? (
                  <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
                    {/* Simulated Flask Apparatus */}
                    <div className="text-center space-y-2">
                      <div className="relative w-32 h-44 mx-auto flex flex-col items-center justify-end">
                        {/* Burette Tip */}
                        <div className="w-3 h-16 bg-slate-200 border-x border-slate-400 rounded-t-sm relative">
                          <div
                            className="absolute bottom-0 inset-x-0 bg-blue-300/60"
                            style={{ height: `${Math.max(0, 100 - labBuretteVolume * 3.5)}%` }}
                          />
                        </div>
                        {/* Stopcock Knob */}
                        <div className="w-8 h-2 bg-stone-700 rounded-sm my-0.5" />
                        {/* Conical Flask */}
                        <div
                          className={`w-28 h-24 border-2 border-stone-500 rounded-b-2xl transition-colors duration-500 flex items-end justify-center pb-2 ${
                            labColorState === 'clear'
                              ? 'bg-blue-50/40'
                              : labColorState === 'light_pink'
                              ? 'bg-pink-300/80 shadow-[0_0_15px_rgba(244,114,182,0.5)]'
                              : 'bg-fuchsia-600/90'
                          }`}
                        >
                          <span className="text-[10px] font-mono font-bold text-stone-800 bg-white/80 px-1.5 py-0.5 rounded">
                            {labBuretteVolume.toFixed(1)} mL NaOH
                          </span>
                        </div>
                      </div>
                      <div className="text-xs font-bold font-serif-ethiopic text-stone-800">
                        የፍላስክ ሁኔታ፡{' '}
                        {labColorState === 'clear' && <span className="text-blue-700">አሲዳማ (pH &lt; 7)</span>}
                        {labColorState === 'light_pink' && (
                          <span className="text-emerald-700 font-black">ትክክለኛ የመጨረሻ ነጥብ (Neutralized!)</span>
                        )}
                        {labColorState === 'deep_magenta' && (
                          <span className="text-rose-700 font-bold">ቤዝ በዝቷል (Overshot Endpoint)</span>
                        )}
                      </div>
                    </div>

                    {/* Interactive Burette Valve Slider */}
                    <div className="flex-1 max-w-xs space-y-3 bg-[#FAF6EC] p-4 rounded-xl border border-stone-300">
                      <div className="text-xs font-bold text-stone-800">
                        የቡሬት መቆጣጠሪያ ቫልቭ (Burette Dispenser)
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-stone-600">
                          <span>የተጨመረ NaOH መጠን:</span>
                          <span className="font-mono font-bold">{labBuretteVolume.toFixed(1)} mL</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="30"
                          step="0.1"
                          value={labBuretteVolume}
                          onChange={(e) => setLabBuretteVolume(parseFloat(e.target.value))}
                          className="w-full accent-[#2E6B4A] cursor-pointer"
                        />
                      </div>
                      <div className="text-[11px] text-stone-500 font-serif-ethiopic leading-snug">
                        💡 ፍንጭ፡ የፈሳሹ ቀለም ወደ ቀለል ያለ ሮዝ (Light Pink) እስኪቀየር ድረስ ቀስ ብለው ጠብታዎችን ይጨምሩ።
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center space-y-2">
                    <FlaskConical className="w-12 h-12 text-[#2E6B4A] mx-auto animate-bounce" />
                    <div className="text-sm font-bold text-stone-800 font-serif-ethiopic">
                      {activeLab.title} Apparatus Ready
                    </div>
                    <p className="text-xs text-stone-500 max-w-md mx-auto">
                      የዚህ ሙከራ መመሪያዎች ከታች ተዘርዝረዋል። ደረጃ በደረጃ በመከተል ምልከታዎን ይመዝግቡ።
                    </p>
                  </div>
                )}
              </div>

              {/* Lab Step-by-Step Procedure */}
              <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                    የሙከራ ቅደም ተከተል (Step {labCurrentStep + 1} of {activeLab.steps.length})
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <button
                      disabled={labCurrentStep === 0}
                      onClick={() => setLabCurrentStep((p) => Math.max(0, p - 1))}
                      className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 disabled:opacity-40 rounded text-xs font-bold cursor-pointer"
                    >
                      ቀዳሚ
                    </button>
                    <button
                      disabled={labCurrentStep === activeLab.steps.length - 1}
                      onClick={() => setLabCurrentStep((p) => Math.min(activeLab.steps.length - 1, p + 1))}
                      className="px-2.5 py-1 bg-[#2E6B4A] hover:bg-[#235338] disabled:opacity-40 text-white rounded text-xs font-bold cursor-pointer"
                    >
                      ቀጣይ
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-xs font-serif-ethiopic text-stone-800 leading-relaxed">
                  <strong>ደረጃ {labCurrentStep + 1}:</strong> {activeLab.steps[labCurrentStep]}
                </div>

                {/* Materials list */}
                <div className="pt-2 border-t border-stone-100">
                  <div className="text-[11px] font-bold text-stone-500 mb-1">አስፈላጊ እቃዎች (Materials Needed):</div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeLab.materials.map((m, idx) => (
                      <span key={idx} className="text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200">
                        🧪 {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SECTION 5: WEEKLY AUDIO REVISION HUB                                  */}
      {/* ===================================================================== */}
      {activeSection === 'audio_hub' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold font-serif-ethiopic text-[#1E1B18] flex items-center gap-2">
              <Headphones className="w-5 h-5 text-[#2E6B4A]" />
              <span>ሳምንታዊ የድምፅ ክለሳና ፈተና ጠቋሚ (Weekly Audio Revision Hub)</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Audio Episodes List */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                የድምፅ ክፍሎች (Audio Episodes)
              </div>
              {WEEKLY_AUDIOS.map((item) => {
                const isCurrent = activeAudio.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveAudio(item);
                      setIsPlayingAudio(true);
                    }}
                    className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#FAF6EC] border-[2px] border-[#38332D] shadow-xs'
                        : 'bg-white border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded uppercase">
                        {item.weekLabel}
                      </span>
                      <span className="text-xs font-bold text-stone-500 font-mono">{item.duration}</span>
                    </div>
                    <h4 className="text-xs font-bold font-serif-ethiopic text-[#1E1B18] mt-2 line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">{item.summary}</p>
                  </button>
                );
              })}
            </div>

            {/* Active Audio Player & Transcript Panel */}
            <div className="lg:col-span-7 bg-[#FAF6EC] border-[2px] border-[#38332D] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-stone-300 pb-3">
                <div>
                  <span className="text-xs font-bold text-[#2E6B4A] uppercase">
                    {activeAudio.subject} • {activeAudio.weekLabel}
                  </span>
                  <h3 className="text-base font-bold font-serif-ethiopic text-[#1E1B18] mt-0.5">
                    {activeAudio.title}
                  </h3>
                </div>
                <Volume2 className="w-5 h-5 text-amber-600" />
              </div>

              {/* Audio Controls Bar */}
              <div className="bg-[#38332D] text-white p-4 rounded-xl space-y-3 shadow-md">
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="w-10 h-10 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 flex items-center justify-center font-bold shadow cursor-pointer transition-transform active:scale-95"
                  >
                    {isPlayingAudio ? '❚❚' : '▶'}
                  </button>
                  <div className="flex-1 space-y-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={audioProgress}
                      onChange={(e) => setAudioProgress(Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                      <span>06:20</span>
                      <span>{activeAudio.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 1.25, 1.5].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => setPlaybackRate(rate)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          playbackRate === rate ? 'bg-amber-400 text-stone-950' : 'text-stone-300 hover:bg-stone-700'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Key Takeaways & Exam Tips Box */}
              <div className="bg-white rounded-xl border border-stone-300 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1E1B18]">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span>ዋና ዋና ቁልፍ ነጥቦች (Core Concepts):</span>
                </div>
                <div className="space-y-1.5 text-xs text-stone-700 font-serif-ethiopic">
                  {activeAudio.keyTakeaways.map((takeaway, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                      <span>{takeaway}</span>
                    </div>
                  ))}
                </div>

                {/* Spoken Exam Tips */}
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs space-y-1 mt-2">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>የአስተማሪው የፈተና ምክር (Spoken Exam Tip):</span>
                  </div>
                  <p className="text-amber-800 font-serif-ethiopic leading-relaxed">
                    {activeAudio.spokenTips}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SECTION 6: PERSONALIZED AI STUDY PLAN                                 */}
      {/* ===================================================================== */}
      {activeSection === 'ai_study_plan' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold font-serif-ethiopic text-[#1E1B18] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#2E6B4A]" />
              <span>የግል AI የጥናት እቅድና ዝግጁነት መለኪያ (Personalized AI Study Plan)</span>
            </h2>
          </div>

          {/* Top Metrics Row: Exam Readiness Score & Target */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-300 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                የፈተና ዝግጁነት ውጤት (Readiness Score)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#2E6B4A]">78%</span>
                <span className="text-xs text-emerald-700 font-bold flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> +6% this week
                </span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-2">
                <div className="bg-[#2E6B4A] h-2 rounded-full" style={{ width: '78%' }} />
              </div>
              <p className="text-[11px] text-stone-500 font-serif-ethiopic">
                የታለመው ውጤት፡ 85%+ (Target University Entrance Score)
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-300 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                ትኩረት የሚሹ ምዕራፎች (Weak Focus Areas)
              </span>
              <div className="space-y-1 pt-1">
                <div className="text-xs font-bold text-rose-800 bg-rose-50 px-2 py-1 rounded border border-rose-200 flex items-center justify-between">
                  <span>Physics: Electromagnetism (Unit 4)</span>
                  <span className="font-mono">54% Acc</span>
                </div>
                <div className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded border border-amber-200 flex items-center justify-between">
                  <span>Math: Integral Calculus (Unit 3)</span>
                  <span className="font-mono">68% Acc</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-300 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                የሳምንቱ የታቀደ የጥናት ጊዜ (Weekly Goal)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#1E1B18]">8.5</span>
                <span className="text-xs text-stone-500">/ 12 ሰዓት (Hours)</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '70%' }} />
              </div>
              <p className="text-[11px] text-stone-500 font-serif-ethiopic">
                በቀን 1.5 ሰዓት ጥናት የታቀደውን ግብ ያሳካል
              </p>
            </div>
          </div>

          {/* Smart Video Recommendations Row */}
          <div className="bg-[#FAF6EC] border-[2px] border-[#38332D] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2E6B4A]" />
                <h3 className="text-sm font-bold font-serif-ethiopic text-[#1E1B18]">
                  ለእርስዎ የተመረጡ የቪዲዮ ትምህርቶች (Smart AI Video Recommendations)
                </h3>
              </div>
              <span className="text-[11px] text-stone-500">በቅርብ የፈተና ውጤትዎ መሰረት</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PREMIUM_VIDEOS.slice(1, 3).map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => {
                    setSelectedVideo(vid);
                    setActiveSection('video_library');
                  }}
                  className="p-3 bg-white rounded-xl border border-stone-300 flex items-center gap-3 cursor-pointer hover:border-[#2E6B4A] transition-colors"
                >
                  <img src={vid.thumbnail} alt={vid.title} className="w-20 h-14 object-cover rounded-lg shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-[#2E6B4A]">{vid.subject} • {vid.duration}</span>
                    <h4 className="text-xs font-bold text-[#1E1B18] truncate mt-0.5">{vid.title}</h4>
                    <p className="text-[11px] text-stone-500 truncate">{vid.overview}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Personalized Weekly Revision Schedule */}
          <div className="bg-white rounded-2xl border border-stone-300 p-5 space-y-3 shadow-2xs">
            <h3 className="text-sm font-bold font-serif-ethiopic text-[#1E1B18] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#2E6B4A]" />
              <span>ሳምንታዊ የተደራጀ የክለሳ ፕሮግራም (Personalized Revision Schedule)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-1">
              {[
                { day: 'ሰኞ (Mon)', subject: 'Mathematics', topic: 'Relations & Inverse Mappings', time: '1 ሰዓት', status: 'completed' },
                { day: 'ማክሰኞ (Tue)', subject: 'Physics', topic: 'Electromagnetic Induction 3D', time: '1.5 ሰዓት', status: 'completed' },
                { day: 'ረቡዕ (Wed)', subject: 'Chemistry', topic: 'Titration Virtual Lab', time: '1 ሰዓት', status: 'today' },
                { day: 'ሐሙስ (Thu)', subject: 'Biology', topic: 'Mitosis 3D Simulation', time: '1 ሰዓት', status: 'upcoming' },
                { day: 'አርብ (Fri)', subject: 'Exam Mock', topic: 'ESSLCE National Exam Prep', time: '2 ሰዓት', status: 'upcoming' },
              ].map((slot, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border space-y-1.5 ${
                    slot.status === 'today'
                      ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300 shadow-xs'
                      : slot.status === 'completed'
                      ? 'bg-emerald-50/60 border-emerald-300'
                      : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className={slot.status === 'today' ? 'text-amber-900 font-black' : 'text-stone-700'}>
                      {slot.day}
                    </span>
                    {slot.status === 'completed' && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                    {slot.status === 'today' && (
                      <span className="text-[9px] bg-amber-400 text-stone-950 px-1 rounded font-black">
                        TODAY
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-[#1E1B18] font-serif-ethiopic">{slot.subject}</div>
                  <div className="text-[10px] text-stone-600 line-clamp-1">{slot.topic}</div>
                  <div className="text-[10px] font-mono text-stone-500">{slot.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
