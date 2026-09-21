import React, { useEffect, useRef } from 'react';
import {
  LayoutGrid,
  X,
  Gauge,
  BookOpen,
  HelpCircle,
  Bell,
  Camera,
  Flame,
  GraduationCap,
  Compass,
  Map,
  WifiOff,
  Video,
  Library,
  CreditCard,
  ShieldCheck,
  Receipt,
  Users,
  Lock,
  MessageSquare,
  Sparkles,
  Award,
  Settings,
} from 'lucide-react';
import { ActiveTab, LanguageCode } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export interface LocalizedText {
  am: string;
  en: string;
  ti: string;
  om: string;
  ar: string;
  so: string;
}

export interface ModuleItem {
  id: string;
  numberTag: string; // e.g. '#1', '#2'
  titles: LocalizedText;
  subtitles?: LocalizedText;
  icon: React.ReactNode;
  tabKey: ActiveTab;
  superAdminOnly?: boolean;
  onCustomAction?: () => void;
  isSpecialBadge?: string;
}

export interface ModuleCategory {
  categoryNumber: string;
  titles: LocalizedText;
  categoryRange: string; // e.g. '(ክፍል 1-6)'
  accentColor: string; // e.g. text-rose-400 or text-amber-400
  icon: React.ReactNode;
  items: ModuleItem[];
}

interface SystemModulesDropdownDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isSuperAdmin: boolean;
  userEmail?: string | null;
  onOpenDirectPayment?: () => void;
  onOpenResearch?: () => void;
  onOpenSettings?: () => void;
}

export const SystemModulesDropdownDrawer: React.FC<SystemModulesDropdownDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  isSuperAdmin,
  userEmail,
  onOpenDirectPayment,
  onOpenResearch,
  onOpenSettings,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const { language, isRtl, t } = useLanguage();

  const getLocalized = (textObj: LocalizedText): string => {
    return textObj[language as LanguageCode] || textObj.am || textObj.en;
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories: ModuleCategory[] = [
    {
      categoryNumber: '1.',
      titles: {
        am: 'ዋና መማሪያ እና አስተዳደር',
        en: 'Core Learning & Administration',
        ti: 'ቀንዲ ትምህርትን ምምሕዳርን',
        om: 'Barnoota Ijoo fi Bulchiinsa',
        ar: 'التعلم الأساسي والإدارة',
        so: 'Waxbarashada Guud iyo Maamulka',
      },
      categoryRange: '(1-6)',
      accentColor: 'text-rose-400',
      icon: <ShieldCheck className="w-4 h-4 text-rose-400" />,
      items: [
        {
          id: 'dashboard',
          numberTag: '#1',
          titles: {
            am: 'ዳሽቦርድ',
            en: 'Dashboard',
            ti: 'ዳሽቦርድ',
            om: 'Daashboordii',
            ar: 'لوحة التحكم',
            so: 'Dashboard-ka',
          },
          subtitles: {
            am: 'የተማሪና አስተዳዳሪ ማዕከል',
            en: 'Student & Admin Overview',
            ti: 'ሓፈሻዊ ትሕዝቶ ተመሃራይ',
            om: 'Ilaalcha Barataa fi Bulchiinsaa',
            ar: 'نظرة عامة على الطالب والإدارة',
            so: 'Guudmar Ardayga iyo Maamulka',
          },
          icon: <Gauge className="w-4 h-4" />,
          tabKey: isSuperAdmin ? 'admin_dashboard' : 'student_app',
        },
        {
          id: 'textbooks',
          numberTag: '#2',
          titles: {
            am: 'የመማሪያ መጻሕፍትና ትምህርቶች',
            en: 'Textbooks & Lessons',
            ti: 'መጻሕፍቲ ትምህርትን ትምህርትታትን',
            om: 'Kitaabolee Barnootaa fi Barnoota',
            ar: 'الكتب المدرسية والدروس',
            so: 'Buugaagta iyo Casharrada',
          },
          subtitles: {
            am: 'የ9-12ኛ ክፍል ዲጂታል መጻሕፍት',
            en: 'Grade 9-12 Digital Textbooks',
            ti: 'ናይ 9-12 ክፍሊ ዲጂታል መጻሕፍቲ',
            om: 'Kitaabolee Dijitaalaa Kutaa 9-12',
            ar: 'كتب إلكترونية للصفوف 9-12',
            so: 'Buugaagta Dijitaalka ah Fasalka 9-12',
          },
          icon: <BookOpen className="w-4 h-4" />,
          tabKey: 'textbook',
        },
        {
          id: 'exams',
          numberTag: '#3',
          titles: {
            am: 'ፈተናዎች እና ምዘና',
            en: 'Exams & Quizzes',
            ti: 'ፈተናታትን ምዘናን',
            om: 'Qormaata fi Madaallii',
            ar: 'الامتحانات والاختبارات القصيرة',
            so: 'Imtixaanaadka iyo Kediska',
          },
          subtitles: {
            am: 'የቻፕተር ፈተናና የብቃት መለኪያ',
            en: 'Chapter Mastery & Assessment Engine',
            ti: 'ፈተነ ምዕራፍን መለክዒ ብቕዓትን',
            om: 'Qormaata Boqonnaa fi Madaallii',
            ar: 'اختبارات الفصول ومحرك التقييم',
            so: 'Imtixaanka Cutubyada iyo Qiimaynta',
          },
          icon: <Award className="w-4 h-4" />,
          tabKey: 'assessment_engine',
        },
        {
          id: 'notifications',
          numberTag: '#4',
          titles: {
            am: 'የማሳወቂያዎች ማዕከል',
            en: 'Notifications Hub',
            ti: 'ማእኸል መተሓሳሰቢታት',
            om: 'Wiirtuu Beeksisaa',
            ar: 'مركز التنبيهات والإشعارات',
            so: 'Xarunta Ogeysiisyada',
          },
          subtitles: {
            am: 'የትምህርትና የፈተና ጥቆማዎች',
            en: 'Study Reminders & Academic Alerts',
            ti: 'መተሓሳሰቢ ትምህርትን ፈተናን',
            om: 'Yaadachiisa Barnootaa fi Qormaataa',
            ar: 'تنبيهات المذاكرة والامتحانات',
            so: 'Xusuusinta Waxbarashada iyo Imtixaanka',
          },
          icon: <Bell className="w-4 h-4" />,
          tabKey: 'student_app',
        },
        {
          id: 'ai_tutor',
          numberTag: '#5',
          titles: {
            am: 'AI የድምፅና ፎቶ አስተማሪ',
            en: 'Voice & Photo AI Tutor',
            ti: 'AI መምህር ድምጽን ፎቶን',
            om: 'AI Barsiisaa Sagalee fi Suuraa',
            ar: 'معلم الذكاء الاصطناعي بالصوت والصورة',
            so: 'Macallinka AI ee Codka iyo Sawirka',
          },
          subtitles: {
            am: 'የፎቶ ጥያቄ ፈቺና የድምፅ መልስ',
            en: 'Camera Solver & Spoken Guidance',
            ti: 'ፈታሒ ሕቶ ብፎቶን ድምጽን',
            om: 'Furmaata Gaaffii Suuraa fi Sagalee',
            ar: 'حل المسائل بالصور والتوجيه الصوتي',
            so: 'Xallinta Su\'aalaha Sawirka iyo Codka',
          },
          icon: <Camera className="w-4 h-4" />,
          tabKey: 'photo_voice_tutor',
        },
        {
          id: 'gamification',
          numberTag: '#6',
          titles: {
            am: 'የብቃት ደረጃ እና ባጆች',
            en: 'Gamification & XP Levels',
            ti: 'ደረጃ ብቕዓትን ባጅታትን',
            om: 'Sadarkaa Dandeettii fi Baajii',
            ar: 'مستويات الكفاءة وشارات الإنجاز',
            so: 'Heerarka Xirfadda & Astaamaha',
          },
          subtitles: {
            am: 'ነጥቦች፣ ደረጃዎችና ማበረታቻ',
            en: 'Points, Streaks & Achievements',
            ti: 'ነጥብታት፣ ደረጃታትን ምትብባዕን',
            om: 'Qabxiiwwan, Sadarkaa fi Jajjabina',
            ar: 'النقاط وسلاسل الإنجاز والمكافآت',
            so: 'Dhibcaha, Heerarka iyo Abaalmarinnada',
          },
          icon: <Flame className="w-4 h-4" />,
          tabKey: 'gamification',
        },
      ],
    },
    {
      categoryNumber: '2.',
      titles: {
        am: 'የብሔራዊ ፈተና፤ ሙያ እና መጻሕፍት',
        en: 'National Exam, Careers & Learning Hub',
        ti: 'ሃገራዊ ፈተና፣ ሞያን መጻሕፍትን',
        om: 'Qormaata Biyyoolessaa, Hojii fi Kitaabolee',
        ar: 'الامتحانات الوطنية والمسارات والمراجع',
        so: 'Imtixaanka Qaranka, Shaqooyinka & Buugaagta',
      },
      categoryRange: '(7-12)',
      accentColor: 'text-amber-400',
      icon: <GraduationCap className="w-4 h-4 text-amber-400" />,
      items: [
        {
          id: 'entrance',
          numberTag: '#7',
          titles: {
            am: 'የ12ኛ ክፍል ማትሪክ ፈተና',
            en: 'Entrance Exam Hub (ESSLCE)',
            ti: 'ፈተና ማትሪክ 12 ክፍሊ (ESSLCE)',
            om: 'Qormaata Seensa Yuunivarsiitii (ESSLCE)',
            ar: 'امتحان القبول الجامعي (ESSLCE)',
            so: 'Imtixaanka Fasalka 12aad (ESSLCE)',
          },
          subtitles: {
            am: 'ያለፉት ዓመታት ጥያቄዎችና ማብራሪያ',
            en: 'Past National Exams & Solutions',
            ti: 'ዝሓለፉ ናይ ዓመታት ሕቶታትን መብርህን',
            om: 'Gaaffilee Waggoota Darbanii fi Ibsa',
            ar: 'نماذج الامتحانات السابقة مع الحلول',
            so: 'Su\'aalihii Sanadihii Hore iyo Xalka',
          },
          icon: <GraduationCap className="w-4 h-4" />,
          tabKey: 'entrance_prep',
        },
        {
          id: 'career',
          numberTag: '#8',
          titles: {
            am: 'የሙያ እና የገሃዱ ዓለም ትስስር',
            en: 'Career & Real Life',
            ti: 'ምትእስሳር ሞያን ገሃድ ዓለምን',
            om: 'Hojii fi Jireenya Qabatamaa',
            ar: 'المهن والواقع العملي',
            so: 'Shaqada iyo Nolosha Dhabta ah',
          },
          subtitles: {
            am: 'የወደፊት ዩኒቨርሲቲና የስራ መስኮች',
            en: 'Future Pathways & University Fields',
            ti: 'ናይ መጻኢ ዩኒቨርሲቲን ዓውደ-ስራሕን',
            om: 'Yuunivarsiitii Fuulduraa fi Dirree Hojii',
            ar: 'مسارات الجامعة ومجالات العمل',
            so: 'Jaamacadaha Mustaqbalka iyo Shaqooyinka',
          },
          icon: <Compass className="w-4 h-4" />,
          tabKey: 'career_pathways',
        },
        {
          id: 'knowledge_map',
          numberTag: '#9',
          titles: {
            am: 'የስርዓተ-ትምህርት ካርታ',
            en: 'Curriculum Knowledge Map',
            ti: 'ካርታ ስርዓተ-ትምህርቲ',
            om: 'Kaartaa Beekumsa Sirna Barnootaa',
            ar: 'خريطة المنهج المعرفية',
            so: 'Khariidadda Manhajka Aqoonta',
          },
          subtitles: {
            am: 'የትምህርት ርዕሶች ትስስርና ቅደም ተከተል',
            en: 'Concepts Dependency & Tree Flow',
            ti: 'ምትእስሳር ኣርእስታት ትምህርቲ',
            om: 'Walitti-hidhamiinsa Mata-dureewwanii',
            ar: 'ترابط المفاهيم وتسلسل المنهج',
            so: 'Xiriirka Mawduucyada iyo Qaab-dhismeedka',
          },
          icon: <Map className="w-4 h-4" />,
          tabKey: 'curriculum_engine',
        },
        {
          id: 'offline_sync',
          numberTag: '#10',
          titles: {
            am: 'ከመስመር ውጭ አጠቃቀም',
            en: 'Offline Sync Hub',
            ti: 'ኣጠቓቕማ ብዘይ ኢንተርኔት',
            om: 'Fayyadama Intarneetii Malee',
            ar: 'العمل دون اتصال بالإنترنت',
            so: 'Isticmaalka Khadka Ka Baxsan',
          },
          subtitles: {
            am: 'ያለ ኢንተርኔት መማርና ማስቀመጥ',
            en: 'Offline Lessons & Local Cache',
            ti: 'ብዘይ ኢንተርኔት ምምሃርን ምዕቃብን',
            om: 'Intarneetii malee barachuu fi olkaa\'uu',
            ar: 'التعلم والتخزين المحلي دون إنترنت',
            so: 'Waxbarasho iyo keydin internet la\'aan',
          },
          icon: <WifiOff className="w-4 h-4" />,
          tabKey: 'student_app',
        },
        {
          id: 'premium_learning_center',
          numberTag: '★',
          titles: {
            am: 'ፕሪሚየም የትምህርት ማዕከል (54 ETB)',
            en: 'Premium Learning Center (54 ETB)',
            ti: 'ፕሪሚየም ማእኸል ትምህርቲ (54 ETB)',
            om: 'Wiirtuu Barnootaa Addaa (54 ETB)',
            ar: 'مركز التعليم المتميز (54 ETB)',
            so: 'Xarunta Waxbarashada Gaarka ah (54 ETB)',
          },
          subtitles: {
            am: 'ቪዲዮዎች፣ 3D፣ ፈተናዎችና ላብራቶሪ',
            en: 'Videos, 3D Models, Exams & Labs',
            ti: 'ቪድዮታት፣ 3D ሞዴላት፣ ፈተናታትን ላብራቶሪን',
            om: 'Viidiyoo, Moodeela 3D, Qormaata fi Laabii',
            ar: 'فيديوهات، مجسمات 3D، واختبارات معملية',
            so: 'Fiidiyowyo, 3D, Imtixaanno iyo Shaybaar',
          },
          icon: <Sparkles className="w-4 h-4 text-amber-400" />,
          tabKey: 'premium_learning_center',
          isSpecialBadge: '54 ETB',
        },
        {
          id: 'video_learning',
          numberTag: '#11',
          titles: {
            am: 'ምስላዊ የቪዲዮ ትምህርቶች',
            en: 'Visual & Video Lessons',
            ti: 'ምስላዊ ትምህርትታት ቪድዮ',
            om: 'Barnoota Viidiyoo fi Fakkiidhaan',
            ar: 'الدروس المرئية والتفاعلية',
            so: 'Casharrada Muuqaalka & Fiidiyowga',
          },
          subtitles: {
            am: 'የተመረጡ የባለሙያ ቪዲዮዎች',
            en: 'Curated Expert Video Instruction',
            ti: 'ዝተመረጹ ናይ ክኢላታት ቪድዮታት',
            om: 'Viidiyoowwan Ogummaa Filataman',
            ar: 'شروحات بالفيديو من معلمين خبراء',
            so: 'Fiidiyowyo sharraxaad ah oo xul ah',
          },
          icon: <Video className="w-4 h-4" />,
          tabKey: 'video_learning',
        },
        {
          id: 'research',
          numberTag: '#12',
          titles: {
            am: 'የምርምርና አካዳሚክ ትንታኔ',
            en: 'Multi-Source Research & Library',
            ti: 'ምርምርን ኣካዳሚያዊ ትንተናን',
            om: 'Qorannoo fi Xiinxala Barnootaa',
            ar: 'الأبحاث والتحليلات الأكاديمية والمكتبة',
            so: 'Cilmi-baarista iyo Maktabadda Tacliinta',
          },
          subtitles: {
            am: 'አጋዥ መጻሕፍት፣ አክስትሪምና አልፋ',
            en: 'Extreme, Alpha, & Reference Guides',
            ti: 'ሓገዝቲ መጻሕፍቲ ኤክስትሪምን ኣልፋን',
            om: 'Kitaabolee Deeggarsa Extreme fi Alpha',
            ar: 'مراجع إكستريم وألفا وكتيبات التجارب',
            so: 'Buugaagta caawinta ee Extreme & Alpha',
          },
          icon: <Library className="w-4 h-4" />,
          tabKey: 'supplementary',
          onCustomAction: onOpenResearch,
        },
      ],
    },
    {
      categoryNumber: '3.',
      titles: {
        am: 'ቀጥታ ክፍያ እና ስርዓት ቁጥጥር',
        en: 'Payment, Security & Administration',
        ti: 'ክፍሊትን ድሕንነትን ቁጽጽር ስርዓትን',
        om: 'Kaffaltii, Nageenya fi Bulchiinsa Sirnaa',
        ar: 'الدفع المباشر والأمان وإدارة النظام',
        so: 'Lacag-bixinta, Amniga & Maamulka Nidaamka',
      },
      categoryRange: '(13-19)',
      accentColor: 'text-emerald-400',
      icon: <CreditCard className="w-4 h-4 text-emerald-400" />,
      items: [
        {
          id: 'direct_payment',
          numberTag: '#13',
          titles: {
            am: 'ቀጥታ ክፍያ (telebirr & CBE)',
            en: 'Direct Payment (telebirr & CBE)',
            ti: 'ቀጥታዊ ክፍሊት (telebirr & CBE)',
            om: 'Kaffaltii Kallattii (telebirr & CBE)',
            ar: 'الدفع المباشر (telebirr & CBE)',
            so: 'Lacag-bixinta Tooska ah (telebirr & CBE)',
          },
          subtitles: {
            am: 'Telebirr 0910097862 | CBE 1000382883776',
            en: 'Instant In-App Verification & Activation',
            ti: 'Telebirr 0910097862 | CBE 1000382883776',
            om: 'Telebirr 0910097862 | CBE 1000382883776',
            ar: 'تأكيد ودفع فوري عبر تيلي بير والبنك التجاري',
            so: 'Xaqiijinta tooska ah ee Telebirr & CBE',
          },
          icon: <CreditCard className="w-4 h-4" />,
          tabKey: 'subscription_payment',
          onCustomAction: onOpenDirectPayment,
          isSpecialBadge: 'LIVE',
        },
        {
          id: 'admin_dashboard',
          numberTag: '#14',
          titles: {
            am: 'ሱፐር አድሚን ዳሽቦርድ',
            en: 'Super Admin Dashboard',
            ti: 'ዳሽቦርድ ሱፐር ኣመሓዳሪ',
            om: 'Daashboordii Bulchiinsa Olaanaa',
            ar: 'لوحة تحكم الإدارة العليا',
            so: 'Dashboard-ka Maamulaha Sare',
          },
          subtitles: {
            am: 'የተማሪዎች ቁጥጥርና የሲስተም ስታትስቲክስ',
            en: 'System Health, Metrics & User Management',
            ti: 'ቁጽጽር ተመሃሮን ስታትስቲክስ ስርዓትን',
            om: 'Too\'annoo Barattootaa fi Istaatiistiksii',
            ar: 'إدارة المستخدمين ومؤشرات أداء النظام',
            so: 'Maamulka Isticmaaleyaasha iyo Xaaladda Nidaamka',
          },
          icon: <ShieldCheck className="w-4 h-4" />,
          tabKey: 'admin_dashboard',
          superAdminOnly: true,
        },
        {
          id: 'payment_audit',
          numberTag: '#15',
          titles: {
            am: 'የክፍያ ማረጋገጫዎች ኦዲት',
            en: 'Payment Verification & Audit',
            ti: 'ኦዲት ምርግጋጽ ክፍሊታት',
            om: 'To\'annoo Mirkaneessa Kaffaltii',
            ar: 'تدقيق وتأكيد عمليات الدفع',
            so: 'Xaqiijinta iyo Baaritaanka Lacag-bixinta',
          },
          subtitles: {
            am: 'የተማሪዎች ክፍያ ደረሰኝ ማጽደቂያ',
            en: 'Approve & Verify Student Slips',
            ti: 'መረጋገጺ ቅብሊት ክፍሊት ተመሃሮ ምጽዳቕ',
            om: 'Nagahee kaffaltii barattootaa mirkaneessuu',
            ar: 'مراجعة واعتماد إيصالات سداد الطلاب',
            so: 'Ansixinta risiidhada lacag-bixinta ardayda',
          },
          icon: <Receipt className="w-4 h-4" />,
          tabKey: isSuperAdmin ? 'admin_dashboard' : 'subscription_payment',
        },
        {
          id: 'students_classes',
          numberTag: '#16',
          titles: {
            am: 'የተማሪዎች እና ክፍሎች መረጃ',
            en: 'Students & Classes Hub',
            ti: 'ሓበሬታ ተመሃሮን ክፍልታትን',
            om: 'Odeeffannoo Barattootaa fi Kutaalee',
            ar: 'بيانات الطلاب والفصول الدراسية',
            so: 'Xogta Ardayda iyo Qeybaha Waxbarashada',
          },
          subtitles: {
            am: 'የተማሪዎች ዝርዝር፣ ውጤትና እድገት',
            en: 'Enrollment, Performance & Roster',
            ti: 'ዝርዝር ተመሃሮ፣ ውጽኢትን ዕቤትን',
            om: 'Tarree Barattootaa, Bu\'aa fi Guddina',
            ar: 'قوائم الطلاب والدرجات والتحصيل الدراسي',
            so: 'Liiska ardayda, buundooyinka iyo horumarka',
          },
          icon: <Users className="w-4 h-4" />,
          tabKey: isSuperAdmin ? 'admin_dashboard' : 'student_app',
        },
        {
          id: 'security_fortress',
          numberTag: '#17',
          titles: {
            am: 'የስርዓት ደህንነት እና ሪፖርቶች',
            en: 'Security Fortress & Logs',
            ti: 'ድሕንነት ስርዓትን ጸብጻባትን',
            om: 'Nageenya Sirnaa fi Gabaasaalee',
            ar: 'حصن أمان النظام وسجلات الدخول',
            so: 'Amniga Nidaamka iyo Diiwaanka Gelitaanka',
          },
          subtitles: {
            am: 'የመግቢያ ታሪክና የፍቃዶች ቁጥጥር',
            en: 'Audit Trails, RBAC & Protection',
            ti: 'ታሪኽ ምእታውን ቁጽጽር ፍቓዳትን',
            om: 'Seenaa Seensaa fi Too\'annoo Hayyamaa',
            ar: 'سجلات العمليات والصلاحيات والحماية',
            so: 'Diiwaanka galitaanka iyo xaqiijinta amniga',
          },
          icon: <Lock className="w-4 h-4" />,
          tabKey: 'security_fortress',
          superAdminOnly: true,
        },
        {
          id: 'feedback',
          numberTag: '#18',
          titles: {
            am: 'የስርዓት አስተያየት እና ድጋፍ',
            en: 'System Feedback & Help',
            ti: 'ርእይቶን ደገፍን ስርዓት',
            om: 'Yaada fi Deeggarsa Sirnichaa',
            ar: 'الملاحظات والدعم الفني',
            so: 'Fikradaha iyo Caawinta Nidaamka',
          },
          subtitles: {
            am: 'ጥያቄዎች፣ ጥቆማዎችና የቴክኒክ እገዛ',
            en: 'Questions, Suggestions & Helpdesk',
            ti: 'ሕቶታት፣ ርእይቶታትን ቴክኒካዊ ሓገዝን',
            om: 'Gaaffilee, Yaada fi Gargaarsa Teeknikaa',
            ar: 'الاستفسارات والاقتراحات والمساعدة الفنية',
            so: 'Su\'aalaha, talooyinka iyo caawinta farsamada',
          },
          icon: <MessageSquare className="w-4 h-4" />,
          tabKey: 'system_feedback',
        },
        {
          id: 'settings_hub',
          numberTag: '#19',
          titles: {
            am: 'የስርዓት ቅንብሮች እና ቋንቋ',
            en: 'Settings & Language Hub',
            ti: 'ቅጥዕታትን ቋንቋን ስርዓት',
            om: 'Qindaa\'inoota fi Afaan Sirnichaa',
            ar: 'إعدادات النظام واللغة والمظهر',
            so: 'Dejinta Nidaamka iyo Luqadda',
          },
          subtitles: {
            am: 'ገጽታ፣ የይለፍ ቃልና ቋንቋ መምረጫ',
            en: 'Theme, Password & Language Preferences',
            ti: 'ትርኢት፣ ቃል-ምስጢርን ምርጫ ቋንቋን',
            om: 'Bifa, Jecha Iccitii fi Filannoo Afaanii',
            ar: 'تغيير المظهر وكلمة المرور وتفضيلات اللغة',
            so: 'Muuqaalka, furaha sirta ah iyo dookha luqadda',
          },
          icon: <Settings className="w-4 h-4" />,
          tabKey: 'lesson',
          onCustomAction: () => {
            onClose();
            if (onOpenSettings) onOpenSettings();
          },
        },
      ],
    },
  ];

  const handleItemClick = (item: ModuleItem) => {
    if (item.onCustomAction) {
      item.onCustomAction();
    } else {
      onSelectTab(item.tabKey);
    }
    onClose();
  };

  const drawerTitle = {
    am: 'የሲስተም ክፍሎች',
    en: 'System Modules & Sides',
    ti: 'ክፍልታት ስርዓት',
    om: 'Kutaalee Sirnichaa',
    ar: 'أقسام ووحدات النظام',
    so: 'Qeybaha Nidaamka',
  };

  const drawerSub = {
    am: 'የኢትዮጵያ 2ኛ ደረጃ ትምህርት ሲስተም',
    en: 'Ethiopian High School Education System',
    ti: 'ናይ ኢትዮጵያ ካልኣይ ብርኪ ትምህርቲ ስርዓት',
    om: 'Sirna Barnootaa Sadarkaa Lammaffaa Itoophiyaa',
    ar: 'نظام التعليم الثانوي الإثيوبي',
    so: 'Nidaamka Waxbarashada Dugsiga Sare ee Itoobiya',
  };

  return (
    <div
      id="system-modules-modal-overlay"
      className="fixed inset-0 z-50 flex items-start justify-start bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modules-dropdown-title"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div
        ref={drawerRef}
        id="system-modules-drawer-panel"
        className="w-full max-w-sm sm:max-w-md h-full max-h-screen bg-[#0B132B] text-slate-100 flex flex-col shadow-2xl border-r border-slate-700/60 overflow-hidden animate-in slide-in-from-left duration-250"
      >
        {/* Drawer Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 bg-[#070D1F] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <LayoutGrid className="w-4 h-4" />
            </div>
            <div>
              <h2
                id="modules-dropdown-title"
                className="text-sm font-bold font-serif-ethiopic text-white flex items-center gap-1.5"
              >
                <span>{getLocalized(drawerTitle)}</span>
                <span className="text-[11px] text-rose-400 font-sans font-semibold">(30 MODULES)</span>
              </h2>
              <p className="text-[10.5px] text-slate-400 font-sans">
                {getLocalized(drawerSub)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label={t.closeBtn || 'ዝጋ'}
            className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-700/50 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Identity Banner */}
        <div className="px-4 py-2.5 bg-[#101A38] border-b border-slate-800/80 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 truncate">
            <div className="w-6 h-6 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center text-[10px] font-bold shrink-0">
              {isSuperAdmin ? 'SA' : 'ST'}
            </div>
            <div className="truncate">
              <span className="text-[10px] text-slate-400 block leading-tight">
                {t.userAccountId || 'የተጠቃሚ መለያ'}
              </span>
              <span className="font-semibold text-slate-200 text-[11px] truncate block font-mono">
                {userEmail || 'mejennur669@gmail.com'} {isSuperAdmin && '(Super Admin)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{language === 'ar' ? 'متصل' : language === 'en' ? 'Online' : 'መስመር ላይ'}</span>
          </div>
        </div>

        {/* Direct Payment Highlight Strip */}
        <div
          onClick={() => {
            if (onOpenDirectPayment) onOpenDirectPayment();
            else onSelectTab('subscription_payment');
            onClose();
          }}
          className="mx-3 my-2 p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/90 to-[#0F2A1E] border border-emerald-500/40 cursor-pointer hover:border-emerald-400 transition-all flex items-center justify-between shadow-xs shrink-0"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-white font-serif-ethiopic flex items-center gap-1.5">
                <span>{language === 'en' ? 'Direct Payment in System' : language === 'ar' ? 'الدفع المباشر في النظام' : 'ቀጥታ ክፍያ በሲስተሙ ውስጥ'}</span>
                <span className="text-[9px] bg-emerald-400 text-slate-950 px-1 rounded font-sans font-black">
                  LIVE
                </span>
              </div>
              <div className="text-[10px] text-emerald-300 font-mono truncate">
                Telebirr: 0910097862 | CBE: 1000382883776
              </div>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-300 underline font-serif-ethiopic shrink-0 ml-2">
            {language === 'en' ? 'Open' : language === 'ar' ? 'فتح' : 'ክፈት'}
          </span>
        </div>

        {/* Reliable Scrollable List of Categories & Modules */}
        <div
          id="system-modules-scroll-area"
          className="flex-1 h-0 min-h-0 overflow-y-auto overscroll-contain touch-pan-y p-3 space-y-4 text-xs font-serif-ethiopic custom-scrollbar"
        >
          {categories.map((category) => (
            <div key={category.categoryNumber} className="space-y-1.5">
              {/* Category Heading */}
              <div className="flex items-center gap-1.5 px-2 pt-1 pb-1 font-bold text-[11.5px] border-b border-slate-800/60">
                {category.icon}
                <span className={category.accentColor}>
                  {category.categoryNumber} {getLocalized(category.titles)}
                </span>
                <span className="text-slate-400 font-sans text-[10px] ml-1">
                  {category.categoryRange}
                </span>
              </div>

              {/* Items in Category */}
              <div className="space-y-1 pt-0.5">
                {category.items.map((item) => {
                  if (item.superAdminOnly && !isSuperAdmin) return null;

                  const isActive = activeTab === item.tabKey;
                  const itemTitle = getLocalized(item.titles);
                  const itemSubtitle = item.subtitles ? getLocalized(item.subtitles) : null;

                  return (
                    <button
                      key={item.id}
                      id={`module-btn-${item.id}`}
                      onClick={() => handleItemClick(item)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-all cursor-pointer text-left rtl:text-right ${
                        isActive
                          ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-900/30'
                          : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-200 border border-slate-800/40 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate min-w-0">
                        {/* Number Badge */}
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-black shrink-0 ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                          }`}
                        >
                          {item.numberTag}
                        </span>

                        {/* Icon */}
                        <span
                          className={`shrink-0 ${
                            isActive ? 'text-white' : 'text-slate-400'
                          }`}
                        >
                          {item.icon}
                        </span>

                        {/* Localized Titles */}
                        <div className="truncate min-w-0">
                          <span className="text-xs truncate block font-bold">
                            {itemTitle}
                          </span>
                          {itemSubtitle && (
                            <span
                              className={`text-[9.5px] truncate block ${
                                isActive ? 'text-rose-100' : 'text-slate-400'
                              }`}
                            >
                              {itemSubtitle}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Special Badge if any */}
                      {item.isSpecialBadge && (
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded font-bold font-serif-ethiopic shrink-0 ml-1">
                          {item.isSpecialBadge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Support Info */}
        <div className="p-3 border-t border-slate-800 bg-[#070D1F] text-[10.5px] text-slate-400 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>NUR AI High School Education System</span>
          </div>
          <span className="font-mono text-slate-300">0910097862</span>
        </div>
      </div>
    </div>
  );
};
