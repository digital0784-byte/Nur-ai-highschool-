import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Building2,
  HelpCircle,
  Copy,
  Check,
  ChevronDown,
  Layers,
  Award,
  Zap,
  Globe,
  Lock,
  WifiOff,
  Flame,
  UserCheck,
  Phone,
  Mail,
  PlayCircle,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { Grade, LanguageCode } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { DEVELOPER_INFO } from '../../services/subscriptionService';
import heroImage from '../../assets/images/ethiopian_students_hero_1790246053876.jpg';

interface PublicMarketingLandingPageProps {
  onStartLearning: () => void;
  onRegister: () => void;
  onLogin: () => void;
  onSelectGrade: (grade: Grade) => void;
  onExploreDemo?: () => void;
}

export const PublicMarketingLandingPage: React.FC<PublicMarketingLandingPageProps> = ({
  onStartLearning,
  onRegister,
  onLogin,
  onSelectGrade,
  onExploreDemo,
}) => {
  const { language, setLanguage, languages } = useLanguage();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedGradeTab, setSelectedGradeTab] = useState<number>(9);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Grade cards list matching the exact 6-card grid layout in the user screenshot
  const gradeCards = [
    {
      gradeNum: 7,
      targetGrade: 9 as Grade,
      titleAm: '7ኛ ክፍል',
      titleEn: 'Grade 7',
      stage: 'Middle School',
      desc: 'የመካከለኛ ደረጃ መሰረታዊ የትምህርት ዝግጅት',
      price: 160,
    },
    {
      gradeNum: 8,
      targetGrade: 9 as Grade,
      titleAm: '8ኛ ክፍል',
      titleEn: 'Grade 8',
      stage: 'Ministry Exam Prep',
      desc: 'የ8ኛ ክፍል የሚኒስቴር ፈተና ክለሳና መሰረት',
      price: 160,
    },
    {
      gradeNum: 9,
      targetGrade: 9 as Grade,
      titleAm: '9ኛ ክፍል',
      titleEn: 'Grade 9',
      stage: 'Secondary',
      desc: 'አዲሱ የሁለተኛ ደረጃ ካሪኩለም',
      price: 160,
    },
    {
      gradeNum: 10,
      targetGrade: 10 as Grade,
      titleAm: '10ኛ ክፍል',
      titleEn: 'Grade 10',
      stage: 'EGSECE Exam',
      desc: 'የ10ኛ ክፍል አዲስ ስርዓተ-ትምህርትና ክልላዊ ፈተና',
      price: 180,
    },
    {
      gradeNum: 11,
      targetGrade: 11 as Grade,
      titleAm: '11ኛ ክፍል',
      titleEn: 'Grade 11',
      stage: 'Preparatory',
      desc: 'የተፈጥሮና ማህበራዊ ሳይንስ ዘርፎች (Streams)',
      price: 200,
    },
    {
      gradeNum: 12,
      targetGrade: 12 as Grade,
      titleAm: '12ኛ ክፍል',
      titleEn: 'Grade 12',
      stage: 'ESSLCE National Exam',
      desc: 'የዩኒቨርሲቲ መግቢያ ፈተና ዝግጅት ሞተር',
      price: 200,
    },
  ];

  // Grade plans according to official pricing
  const gradePlans = [
    {
      grade: 9 as Grade,
      titleAm: '9ኛ ክፍል',
      titleEn: 'Grade 9',
      price: 160,
      descriptionAm: 'ለአዲሱ 2018/2019 ዓ.ም ካሪኩለም የተዘጋጀ ሙሉ የ9ኛ ክፍል ትምህርት',
      descriptionEn: 'Complete Ethiopian curriculum for Grade 9 with textbook reader',
      badgeAm: 'መሰረታዊ ዝግጅት',
      features: [
        'የኢ.ፌ.ዲ.ሪ አዲሱ የመማሪያ መጽሐፍት',
        'የሶቅራጥሳዊ AI የግል አስተማሪ',
        'የምዕራፍ ፈተናዎችና የቤት ስራዎች',
        'ኢንተርኔት በማይኖርበት ጊዜ ማጥናት (Offline)',
      ],
    },
    {
      grade: 10 as Grade,
      titleAm: '10ኛ ክፍል',
      titleEn: 'Grade 10',
      price: 180,
      descriptionAm: 'የ10ኛ ክፍል አዲስ ስርዓተ-ትምህርት እና የክልል ፈተና ማለፊያ ስልጠና',
      descriptionEn: 'Grade 10 complete subjects and regional assessment preparation',
      badgeAm: 'ፈተና ተኮር',
      features: [
        'የ10ኛ ክፍል ሙሉ ይፋዊ መጽሐፍት',
        'የክልላዊ ፈተና የክለሳ ጥያቄዎች',
        'የደከሙባቸውን ርዕሶች የሚለይ AI',
        'ደረጃ በደረጃ ፍንጭ የሚሰጡ ልምምዶች',
      ],
    },
    {
      grade: 11 as Grade,
      titleAm: '11ኛ ክፍል',
      titleEn: 'Grade 11',
      price: 200,
      descriptionAm: 'የተፈጥሮና ማህበራዊ ሳይንስ ሙሉ የመማሪያና የላብራቶሪ ዝግጅት',
      descriptionEn: 'Natural & Social science streams with specialized modules',
      badgeAm: 'ሳይንስና ማህበራዊ',
      features: [
        'የተፈጥሮና ማህበራዊ ሳይንስ ዘርፎች (Streams)',
        'ምናባዊ የላብራቶሪ ማስመሰያዎች',
        'የዩኒቨርሲቲ ሙያ ምርጫ መመሪያ',
        'የግል የጥናት ሰዓት ሰሌዳ እና ማሳሰቢያ',
      ],
    },
    {
      grade: 12 as Grade,
      titleAm: '12ኛ ክፍል',
      titleEn: 'Grade 12',
      price: 200,
      descriptionAm: 'የዩኒቨርሲቲ መግቢያ ፈተና (Entrance Exam Prep) ልዩ ዝግጅት',
      descriptionEn: 'National University Entrance Exam Mastery Engine',
      badgeAm: 'የመግቢያ ፈተና',
      features: [
        'የዩኒቨርሲቲ መግቢያ ፈተና ዝግጅት ሞተር',
        'ያለፉት ዓመታት ጥያቄዎች ከነማብራሪያቸው',
        'የውጤት ትንበያና የደካማ ርዕሶች ማጠናከሪያ',
        'የጊዜ አጠቃቀም መቆጣጠሪያ (Timed Exams)',
      ],
    },
  ];

  // Verified Payment Methods
  const paymentMethods = [
    {
      id: 'telebirr',
      nameAm: 'ቴሌብር (Telebirr)',
      nameEn: 'Telebirr',
      accountName: DEVELOPER_INFO.name,
      accountNumber: '0910097862',
      code: '*127# ወይም Telebirr App',
      tag: 'ቀጥታና ፈጣን',
    },
    {
      id: 'cbebirr',
      nameAm: 'ሲቢኢ ብር (CBE Birr)',
      nameEn: 'CBE Birr',
      accountName: DEVELOPER_INFO.name,
      accountNumber: '0910097862',
      code: '*847# ወይም CBE Birr App',
      tag: 'ምቹ የሞባይል ክፍያ',
    },
    {
      id: 'cbe',
      nameAm: 'የኢትዮጵያ ንግድ ባንክ (CBE Transfer)',
      nameEn: 'Commercial Bank of Ethiopia',
      accountName: DEVELOPER_INFO.name,
      accountNumber: '1000382883776',
      code: 'CBE Mobile Banking / ቅርንጫፍ',
      tag: 'ቀጥታ የባንክ ዝውውር',
    },
  ];

  // Platform Pillars
  const platformPillars = [
    {
      icon: Sparkles,
      iconColor: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
      title: 'የሶቅራጥሳዊ AI የግል አስተማሪ (Socratic Tutor)',
      desc: 'መልስ በቀጥታ ከመስጠት ይልቅ ተማሪው በማሰብና በመመራመር እንዲደርስበት ጥያቄዎችንና ፍንጮችን የሚያቀርብ ዘመናዊ የትምህርት AI።',
    },
    {
      icon: BookOpen,
      iconColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
      title: 'ይፋዊ የመማሪያ መጻሕፍት (DRM Reader)',
      desc: 'ከ9ኛ እስከ 12ኛ ክፍል ያሉ የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር ሙሉ መጻሕፍት በመተግበሪያው ውስጥ በደህንነት የተጠበቁ ሆነው ይቀርባሉ።',
    },
    {
      icon: Award,
      iconColor: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
      title: 'የዩኒቨርሲቲ መግቢያ ፈተና ሞተር (Entrance Prep)',
      desc: 'ያለፉት ዓመታት ጥያቄዎች፣ የጊዜ አጠቃቀም ልምምዶች፣ ሞዴል ፈተናዎች እና የደከሙባቸውን ርዕሶች የሚለይ ስማርት ትንታኔ።',
    },
    {
      icon: WifiOff,
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/20',
      title: 'ከመስመር ውጭ ማጥናት (Offline Sync)',
      desc: 'የኢንተርኔት መቆራረጥ በሚያጋጥምበት ወቅት ያጠኗቸው ምዕራፎች በስልክዎ ስለሚቀመጡ ያለ ኢንተርኔት ንባብዎን ማስቀጠል ይችላሉ።',
    },
    {
      icon: Layers,
      iconColor: 'text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/20',
      title: 'የተማሪው የዕውቀት ካርታ (Knowledge Map)',
      desc: 'ተማሪው የተካነባቸውን (Mastered) እና ድጋፍ የሚሹ ደካማ ርዕሶችን በመለየት ግላዊ የክለሳ ጥያቄዎችን ያቀርባል።',
    },
    {
      icon: ShieldCheck,
      iconColor: 'text-stone-300',
      bgColor: 'bg-stone-500/10 border-stone-500/20',
      title: 'ዜሮ-ትረስት የደህንነት ስርዓት (Zero Trust)',
      desc: 'የተማሪዎች ውሂብና የክፍያ ታሪክ በከፍተኛ ጥበቃ የተያዘ ሲሆን ብቸኛው ሱፐር አድሚን ብቻ ውሳኔዎችን ያጸድቃል።',
    },
  ];

  // Frequently Asked Questions
  const faqs = [
    {
      qAm: 'ክፍያ እንዴት እፈጽማለሁ? ምዝገባው እንዴት ነው የሚሰራው?',
      aAm: 'በቴሌብር (0910097862) ወይም በኢትዮጵያ ንግድ ባንክ (1000382883776) የክፍልዎን ክፍያ ይላኩ። ከዚያ በመተግበሪያው ላይ ተመዝግበው የትራንዛክሽን ቁጥርዎን (FT Number) ያስገቡ። ዋናው አስተዳዳሪ (Super Admin: መጀን ኑር) ክፍያዎን በጥቂት ደቂቃዎች ውስጥ ሲያረጋግጥ ሙሉ ትምህርቶች ወዲያውኑ ይከፈቱልዎታል።',
    },
    {
      qAm: 'ክፍያዬ እስኪጸድቅ ድረስ ምን ያህል ጊዜ ይወስዳል?',
      aAm: 'ዋናው አስተዳዳሪ የክፍያ ማረጋገጫውን በቀጥታ በዳሽቦርዱ ስለሚከታተል ክፍያዎ በደቂቃዎች ውስጥ ይጸድቃል። ክፍያው በሂደት ላይ እያለ (PENDING) ሁኔታውን መከታተል ይችላሉ።',
    },
    {
      qAm: 'የኑር AI የግል አስተማሪ (AI Tutor) ከሌሎች ምን ይለየዋል?',
      aAm: 'የኑር AI አስተማሪ በኢትዮጵያ አዲሱ ስርዓተ-ትምህርት መጽሐፍት ላይ በጥብቅ የተመሰረተ ነው። መልሶችን በቀጥታ ሰጥቶ የተማሪውን አስተሳሰብ ከማድከም ይልቅ በሶቅራጥሳዊ ጥያቄዎችና ፍንጮች ተማሪው ራሱ መልሱ ላይ እንዲደርስ ያግዛል።',
    },
    {
      qAm: 'ኢንተርኔት በማይኖርበት ጊዜ (Offline) መጠቀም ይቻላል?',
      aAm: 'አዎ! አንዴ የተከፈቱ ምዕራፎች፣ መጽሐፍትና የክለሳ ጥያቄዎች በመሳሪያዎ (IndexedDB) ስለሚቀመጡ ኢንተርኔት በሌለበት ጊዜም ያለምንም መቆራረጥ መማር ይችላሉ።',
    },
    {
      qAm: 'ክፍያዬ በሆነ ምክንያት ተቀባይነት ባያገኝ (Rejected) ምን አደርጋለሁ?',
      aAm: 'ክፍያዎ ውድቅ የተደረገበት ምክንያት በግልጽ ይጻፍልዎታል (ለምሳሌ፦ የተሳሳተ የትራንዛክሽን ቁጥር)። "መረጃውን አስተካክለው በድጋሚ ይላኩ" የሚለውን ቁልፍ በመጫን ትክክለኛውን ኮድ በድጋሚ መላክ ይችላሉ።',
    },
  ];

  return (
    <div className="min-h-screen bg-[#141210] text-stone-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. TOP ANNOUNCEMENT & CONTACT BAR */}
      <div className="bg-[#1C1916] text-stone-300 text-xs py-2 px-3 sm:px-6 border-b border-stone-800">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-serif-ethiopic text-[11px] sm:text-xs">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-amber-400 font-bold">ኢ.ፌ.ዲ.ሪ አዲሱ ሥርዓተ-ትምህርት (2018/2019 ዓ.ም)</span>
            <span className="text-stone-600 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-stone-400">ከ7ኛ - 12ኛ ክፍል ሙሉ ዝግጅት</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="text-stone-400">ዋና አስተዳዳሪ (Admin):</span>
            <a href="tel:0910097862" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
              📞 0910097862
            </a>
            <span className="text-stone-700">|</span>
            <a href="mailto:mejennur669@gmail.com" className="text-stone-400 hover:text-white transition-colors hidden md:inline">
              ✉️ mejennur669@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-[#141210]/95 backdrop-blur-md border-b border-stone-800">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between gap-3">
          {/* Logo & Identity */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-emerald-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black font-serif-ethiopic tracking-tight text-stone-100">
                  ኑር AI
                </span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 font-bold border border-emerald-800/50">
                  High School Tutor
                </span>
              </div>
            </div>
          </div>

          {/* Language Switcher & Action Buttons */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="text-xs font-bold bg-[#201C18] text-stone-300 border border-stone-700 rounded-lg px-2 py-1.5 cursor-pointer focus:outline-none focus:border-amber-500"
                aria-label="ቋንቋ ይምረጡ"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flagOrLabel} {l.nativeName}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onLogin}
              className="px-3 py-1.5 text-xs font-bold text-stone-300 hover:text-white bg-[#201C18] hover:bg-[#2A241F] border border-stone-700 rounded-xl transition-all cursor-pointer flex items-center gap-1"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-400" />
              <span>ይግቡ</span>
            </button>

            <button
              onClick={onRegister}
              className="px-3 sm:px-4 py-1.5 text-xs font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ይመዝገቡ</span>
              <span className="sm:hidden">ተመዝገብ</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION (EXACT MOBILE LAYOUT FROM USER SCREENSHOT) */}
      <section className="pt-6 pb-4 px-3 sm:px-6 max-w-4xl mx-auto">
        {/* Bilingual Subtitle / Value Proposition */}
        <p className="text-xs sm:text-sm text-stone-400 leading-relaxed text-left max-w-2xl">
          Bilingual step-by-step problem solver, verified Ethiopian secondary curriculum (Grades 7–12), ESSLCE & EGSECE
          past exams, and your personalized 24/7 AI study companion in Amharic & English.
        </p>

        {/* Action Buttons: Yellow "Start Learning →" & Dark "▶ Interactive Demo" */}
        <div className="flex items-center gap-3 pt-4">
          <button
            onClick={onStartLearning}
            className="flex-1 sm:flex-initial px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {onExploreDemo && (
            <button
              onClick={onExploreDemo}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-[#201C18] hover:bg-[#29241F] text-stone-200 border border-stone-700/80 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <PlayCircle className="w-4 h-4 text-emerald-400" />
              <span>Interactive Demo</span>
            </button>
          )}
        </div>

        {/* Hero Image Card with Pill Overlay */}
        <div className="mt-5 rounded-2xl sm:rounded-3xl border border-stone-800 bg-[#1B1815] overflow-hidden shadow-2xl relative">
          <img
            src={heroImage}
            alt="Ethiopian students studying with tablets and books at golden hour"
            className="w-full h-56 sm:h-80 md:h-96 object-cover object-center"
            loading="eager"
          />

          {/* Floating Pill on bottom of image */}
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-950/85 backdrop-blur-md border border-stone-700/60 text-[11px] sm:text-xs text-stone-200 font-medium shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Verified for 2026/2018 E.C. Ethiopian National Curriculum</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SELECT YOUR GRADE SECTION (EXACT 6-CARD GRID AS IN SCREENSHOT) */}
      <section className="py-6 px-3 sm:px-6 max-w-4xl mx-auto">
        <div className="text-left space-y-1 mb-4">
          <h2 className="text-base sm:text-lg font-black text-stone-100 font-serif-ethiopic">
            የትምህርት ደረጃዎን ይምረጡ (Select Your Grade)
          </h2>
          <p className="text-xs text-stone-400">
            Tailored curriculum units and exam prep for every academic stage
          </p>
        </div>

        {/* 6-Card Grid: 7, 8, 9, 10, 11, 12 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
          {gradeCards.map((card) => {
            const isSelected = selectedGradeTab === card.gradeNum;
            return (
              <button
                key={card.gradeNum}
                onClick={() => {
                  setSelectedGradeTab(card.gradeNum);
                  onSelectGrade(card.targetGrade);
                }}
                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'bg-[#26211C] border-amber-500/80 shadow-md ring-1 ring-amber-500/50'
                    : 'bg-[#1C1815] border-stone-800 hover:border-stone-700'
                }`}
              >
                <div>
                  <div className="text-sm sm:text-base font-black text-amber-400 font-serif-ethiopic">
                    {card.titleAm}
                  </div>
                  <div className="text-xs text-stone-300 font-semibold">{card.titleEn}</div>
                  <div className="text-[11px] text-stone-500 mt-0.5">{card.stage}</div>
                </div>

                <div className="pt-2 border-t border-stone-800/60 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    {card.price} ETB <span className="text-stone-500 font-normal">/ወር</span>
                  </span>
                  <span className="text-[10px] text-stone-400 flex items-center gap-0.5 group-hover:text-amber-300">
                    ይምረጡ →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. PLATFORM PILLARS (የኑር AI ቁልፍ አገልግሎቶች) */}
      <section className="py-6 px-3 sm:px-6 max-w-4xl mx-auto border-t border-stone-800/60">
        <div className="text-left space-y-1 mb-5">
          <h2 className="text-base sm:text-lg font-black text-stone-100 font-serif-ethiopic">
            የኑር AI ቁልፍ አገልግሎቶች (Platform Pillars)
          </h2>
          <p className="text-xs text-stone-400">
            Advanced Ethiopian-curriculum learning engines built for high academic performance
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-left">
          {platformPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-[#1C1815] border border-stone-800 rounded-2xl p-4 space-y-2 hover:border-stone-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl ${pillar.bgColor} border flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4 h-4 ${pillar.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-stone-200 font-serif-ethiopic">
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed pl-0.5">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. PRICING PLANS DETAIL */}
      <section id="pricing-section" className="py-8 px-3 sm:px-6 max-w-4xl mx-auto border-t border-stone-800/60">
        <div className="text-center space-y-2 mb-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            ግልጽ ወርሃዊ ተመን (Monthly Pricing)
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-stone-100 font-serif-ethiopic">
            የክፍል ደረጃዎች እና ዋጋዎች
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {gradePlans.map((plan) => (
            <div
              key={plan.grade}
              className="bg-[#1C1815] border border-stone-800 rounded-2xl p-4 flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#2A241F] text-amber-400 border border-stone-700">
                    {plan.badgeAm}
                  </span>
                  <span className="text-[10px] font-mono text-stone-500">30 ቀናት</span>
                </div>
                <h3 className="text-base font-bold text-stone-100 font-serif-ethiopic">
                  {plan.titleAm}
                </h3>
                <p className="text-xs text-stone-400 mt-1 mb-3 min-h-[32px]">
                  {plan.descriptionAm}
                </p>

                <div className="p-2.5 rounded-xl bg-[#141210] border border-stone-800 text-center mb-3">
                  <span className="text-2xl font-black text-emerald-400">{plan.price}</span>
                  <span className="text-xs text-stone-400 font-bold ml-1">ETB</span>
                  <span className="text-[10px] text-stone-500 ml-1">/ወር</span>
                </div>

                <div className="space-y-1.5 text-xs text-stone-300">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px]">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onSelectGrade(plan.grade)}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>የ{plan.grade}ኛ ክፍልን ምረጥ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 7. VERIFIED PAYMENT METHODS (TELEBIRR & CBE) */}
      <section id="payment-methods-section" className="py-8 px-3 sm:px-6 max-w-4xl mx-auto border-t border-stone-800/60">
        <div className="text-center space-y-2 mb-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            የተረጋገጡ የክፍያ አማራጮች
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-stone-100 font-serif-ethiopic">
            በቴሌብር ወይም በኢትዮጵያ ንግድ ባንክ በቀላሉ ይክፈሉ
          </h2>
          <p className="text-xs text-stone-400 max-w-xl mx-auto">
            ክፍያዎን ከፈጸሙ በኋላ በመተግበሪያው ላይ ተመዝግበው የትራንዛክሽን ቁጥርዎን (FT Number) ያስገቡ። ዋናው አስተዳዳሪ ወዲያውኑ ያረጋግጥልዎታል።
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="bg-[#1C1815] border border-stone-800 rounded-2xl p-4 space-y-3 text-left"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                  {method.tag}
                </span>
                <span className="text-[10px] text-stone-500 font-mono">የተረጋገጠ</span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-stone-100 font-serif-ethiopic">
                  {method.nameAm}
                </h4>
                <p className="text-[11px] text-stone-400">{method.code}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#141210] border border-stone-800 space-y-1">
                <div className="text-[10px] text-stone-500">የሂሳብ ስም (Account Name):</div>
                <div className="font-bold text-xs text-stone-200 font-mono">{method.accountName}</div>

                <div className="text-[10px] text-stone-500 pt-1">የስልክ / ሂሳብ ቁጥር:</div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-amber-400">{method.accountNumber}</span>
                  <button
                    onClick={() => copyToClipboard(method.accountNumber, method.id)}
                    className="px-2 py-1 bg-[#2A241F] hover:bg-[#38312B] text-stone-200 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === method.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>ተቀድቷል!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>ኮፒ</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 4-Step Verification Timeline */}
        <div className="mt-6 bg-[#1B1815] border border-stone-800 rounded-2xl p-4 sm:p-5">
          <h3 className="text-xs sm:text-sm font-bold text-stone-200 font-serif-ethiopic mb-3 text-center">
            የክፍያና ማረጋገጫ ሂደት በ4 ቀላል ደረጃዎች
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-left text-xs">
            <div className="p-2.5 rounded-xl bg-[#141210] border border-stone-800">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px] flex items-center justify-center mb-1.5">
                1
              </span>
              <div className="font-bold text-stone-200">1. ይክፈሉ</div>
              <p className="text-[11px] text-stone-400 mt-0.5">በቴሌብር ወይም በንግድ ባንክ ክፍያውን ይላኩ</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#141210] border border-stone-800">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px] flex items-center justify-center mb-1.5">
                2
              </span>
              <div className="font-bold text-stone-200">2. ይመዝገቡ</div>
              <p className="text-[11px] text-stone-400 mt-0.5">በመተግበሪያው ተመዝግበው የትራንዛክሽን ቁጥር (FT) ያስገቡ</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#141210] border border-amber-500/30">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px] flex items-center justify-center mb-1.5">
                3
              </span>
              <div className="font-bold text-amber-300">3. በሂደት ላይ</div>
              <p className="text-[11px] text-stone-400 mt-0.5">አስተዳዳሪው በደቂቃዎች ውስጥ ያረጋግጣል</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#141210] border border-emerald-500/30">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-stone-950 font-bold text-[10px] flex items-center justify-center mb-1.5">
                4
              </span>
              <div className="font-bold text-emerald-400">4. ሙሉ ፈቃድ</div>
              <p className="text-[11px] text-stone-400 mt-0.5">የ30 ቀናት ሙሉ ትምህርት ወዲያው ይከፈታል</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-8 px-3 sm:px-6 max-w-4xl mx-auto border-t border-stone-800/60">
        <div className="text-center space-y-2 mb-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            ጥያቄዎችና መልሶች (FAQ)
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-stone-100 font-serif-ethiopic">
            ተደጋግመው የሚጠየቁ ጥያቄዎች
          </h2>
        </div>

        <div className="space-y-2.5 text-left">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-[#1C1815] border border-stone-800 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-3.5 flex items-center justify-between gap-3 text-left font-bold text-xs sm:text-sm text-stone-200 cursor-pointer hover:bg-[#25201C] transition-colors"
                >
                  <span className="font-serif-ethiopic">{faq.qAm}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 transition-transform ${isOpen ? 'rotate-180 text-amber-400' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="p-3.5 pt-0 text-xs text-stone-400 leading-relaxed border-t border-stone-800/60">
                    <p>{faq.aAm}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-[#100E0C] text-stone-400 py-10 px-3 sm:px-6 border-t border-stone-800">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left text-xs">
            <div className="space-y-2 md:col-span-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-stone-100 font-serif-ethiopic">ኑር AI</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800/40">
                  NUR AI Tutor
                </span>
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                የኢትዮጵያ የሁለተኛ ደረጃ (7-12 ክፍል) ተማሪዎች መስተጋብራዊ የትምህርት፣ የላብራቶሪ ማስመሰያና የዩኒቨርሲቲ መግቢያ ፈተና ዝግጅት መተግበሪያ።
              </p>
              <div className="text-[10px] font-mono text-stone-500 pt-1">
                © {new Date().getFullYear()} NUR AI. All Rights Reserved.
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <h4 className="font-bold text-stone-200 uppercase tracking-wider text-[11px]">ፈጣን አገናኞች</h4>
              <ul className="space-y-1 text-stone-400 text-[11px]">
                <li>
                  <button onClick={onStartLearning} className="hover:text-amber-400 transition-colors cursor-pointer">
                    መማር ጀምር (Start Learning)
                  </button>
                </li>
                <li>
                  <button onClick={onRegister} className="hover:text-amber-400 transition-colors cursor-pointer">
                    አዲስ ምዝገባ (Register)
                  </button>
                </li>
                <li>
                  <button onClick={onLogin} className="hover:text-amber-400 transition-colors cursor-pointer">
                    የተማሪ መግቢያ (Student Login)
                  </button>
                </li>
                {onExploreDemo && (
                  <li>
                    <button onClick={onExploreDemo} className="hover:text-amber-400 transition-colors cursor-pointer">
                      ነጻ ማሳያ (Interactive Demo)
                    </button>
                  </li>
                )}
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Super Admin Info</span>
              </h4>
              <div className="p-2.5 rounded-xl bg-[#181512] border border-stone-800 space-y-1 text-[11px] font-mono">
                <div className="text-stone-200 font-bold">{DEVELOPER_INFO.name}</div>
                <div className="text-emerald-400">📞 {DEVELOPER_INFO.phone}</div>
                <div className="text-stone-400">✉️ {DEVELOPER_INFO.email}</div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* 10. STICKY MOBILE BOTTOM BAR */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#161412]/95 backdrop-blur-md border-t border-stone-800 p-2.5 flex items-center justify-between gap-2 shadow-2xl">
        <button
          onClick={onLogin}
          className="flex-1 py-2 rounded-xl bg-[#25201C] text-stone-200 font-bold text-xs border border-stone-700 cursor-pointer"
        >
          ይግቡ (Login)
        </button>
        <button
          onClick={onStartLearning}
          className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs cursor-pointer flex items-center justify-center gap-1 shadow-md"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>መማር ጀምር</span>
        </button>
      </div>
    </div>
  );
};
