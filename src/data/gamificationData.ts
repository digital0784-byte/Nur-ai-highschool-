import { LearningLevel, BadgeItem, DailyGoal, SupportedLanguage } from '../types/gamification';

export const LEARNING_LEVELS: LearningLevel[] = [
  {
    level: 1,
    title: {
      en: 'Novice Scholar',
      am: 'ጀማሪ ምሁር',
      om: 'Barataa Jalqabaa',
      ti: 'ጀማሪ ተመራማሪ',
    },
    minXp: 0,
    maxXp: 200,
    badgeIcon: 'BookOpen',
    perk: {
      en: 'Unlocks study schedule & daily learning tracker',
      am: 'የትምህርት ፕሮግራም እና የዕለት መከታተያ ይከፍታል',
      om: 'Sagantaa barnootaa fi hordoffii guyyaa bana',
      ti: 'መርሓ ግብሪ ትምህርትን ናይ መዓልቲ ተኸታታልን ይኸፍት',
    },
    description: {
      en: 'Welcome to your learning journey! Every step builds knowledge.',
      am: 'እንኳን ወደ የመማር ጉዞዎ በደህና መጡ! እያንዳንዱ እርምጃ እውቀት ይገነባል።',
      om: 'Gara imala barnootaatti baga nagaan dhuftan! Tarkaanfiin hundi beekumsa ijaara.',
      ti: 'ናብ ናይ ምምሃር ጉዕዞኹም ብደሓን መጻእኹም! ነፍሲ ወከፍ ስጉምቲ ፍልጠት ይሃንጽ።',
    },
  },
  {
    level: 2,
    title: {
      en: 'Inquisitive Learner',
      am: 'ፈላጊ ተማሪ',
      om: 'Barataa Gaafataa',
      ti: 'መርማሪ ተምሃራይ',
    },
    minXp: 200,
    maxXp: 500,
    badgeIcon: 'Compass',
    perk: {
      en: 'Unlocks custom flashcard decks and visual problem notes',
      am: 'ብጁ የፍላሽካርድ ጥቅሎችን እና ምስላዊ ማስታወሻዎችን ይከፍታል',
      om: 'Kaardii yaadannoo fi yaadannoo suuraa bana',
      ti: 'ፍላሽካርድን ስእላዊ መተሓሳሰቢታትን ይኸፍት',
    },
    description: {
      en: 'You ask great questions and review textbook chapters consistently.',
      am: 'ጥሩ ጥያቄዎችን ይጠይቃሉ እና የመማሪያ መጽሐፍ ምዕራፎችን በቋሚነት ይገመግማሉ።',
      om: 'Gaaffii gaarii gaafattu fi boqonnaa kitaabaa yeroo hunda ni irra deebitu.',
      ti: 'ጽቡቕ ሕቶታት ትሓቱ፤ ምዕራፋት መጽሓፍ ድማ ብቐጻሊ ትድግሙ።',
    },
  },
  {
    level: 3,
    title: {
      en: 'Knowledge Seeker',
      am: 'የእውቀት ፈላጊ',
      om: 'Barbaadaa Beekumsaa',
      ti: 'ደላይ ፍልጠት',
    },
    minXp: 500,
    maxXp: 950,
    badgeIcon: 'Sparkles',
    perk: {
      en: 'Unlocks AI personal study companion hints & step-by-step reasoning',
      am: 'የ AI የግል አጋዥ ፍንጮችን እና ደረጃ በደረጃ ማብራሪያዎችን ይከፍታል',
      om: 'Gargaarsa AI fi ibsa bal\'aa bana',
      ti: 'ናይ AI ሓጋዚ ሓሳባትን ዝርዝር መብርህን ይኸፍት',
    },
    description: {
      en: 'Deepening foundational concepts across Sciences and Humanities.',
      am: 'በተፈጥሮ እና በማህበራዊ ሳይንስ ውስጥ መሰረታዊ ፅንሰ-ሀሳቦችን ማጥለቅ።',
      om: 'Saayinsii uumamaa fi hawaasaa keessatti yaada bu\'uuraa gabbisuu.',
      ti: 'ኣብ ተፈጥሮኣውን ማሕበራውን ሳይንስ መሰረታዊ ኣምራት ምዕሟቕ።',
    },
  },
  {
    level: 4,
    title: {
      en: 'Concept Builder',
      am: 'ጽንሰ-ሀሳብ ገኝ',
      om: 'Ijaaraa Yaadaa',
      ti: 'ህንጸት ኣምር',
    },
    minXp: 950,
    maxXp: 1550,
    badgeIcon: 'Layers',
    perk: {
      en: 'Unlocks Multi-Unit synthesis exercises & adaptive practice challenges',
      am: 'ባለብዙ ምዕራፍ ልምምዶችን እና ተለዋዋጭ የተግዳሮት ጥያቄዎችን ይከፍታል',
      om: 'Shaakala boqonnaa adda addaa fi qormaata dabalataa bana',
      ti: 'ብዙሕ ምዕራፋት ዝሓቖፈ ልምምዳትን ብድሆታትን ይኸፍት',
    },
    description: {
      en: 'Connecting prerequisites to complex national exam problem sets.',
      am: 'ቅድመ-ሁኔታዎችን ከሀገር አቀፍ የፈተና ጥያቄዎች ጋር ማስተሳሰር።',
      om: 'Beekumsa duraa qormaata bioolessaa waliin walqabsiisuu.',
      ti: 'ቅድመ-ፍልጠት ምስ ሃገራዊ ናይ ፈተና ሕቶታት ምትእስሳር።',
    },
  },
  {
    level: 5,
    title: {
      en: 'Insight Pioneer',
      am: 'ጥልቅ አሳቢ አቅኚ',
      om: 'Qorataa Hubannoo',
      ti: 'መሃዚ ርድኢት',
    },
    minXp: 1550,
    maxXp: 2300,
    badgeIcon: 'Zap',
    perk: {
      en: 'Unlocks National Exam Model Papers & Detailed Scoring Diagnostics',
      am: 'የሀገር አቀፍ ሞዴል ፈተናዎችን እና ዝርዝር የውጤት ትንታኔዎችን ይከፍታል',
      om: 'Qormaata moodeela biyyoolessaa fi xiinxala qabxii bana',
      ti: 'ሃገራዊ ሞዴል ፈተናታትን ዝርዝር ትንተና ውጽኢትን ይኸፍት',
    },
    description: {
      en: 'Demonstrating steady mastery and rigorous conceptual clarity.',
      am: 'የተረጋጋ ክህሎት እና ጥልቅ የፅንሰ-ሀሳብ ግልፅነትን ያሳያል።',
      om: 'Ogummaa cimaa fi iftoomina yaadaa agarsiisuu.',
      ti: 'ጽኑዕ ብቕዓትን ንጹር ናይ ርድኢት ዓቕምን ምርኣይ።',
    },
  },
  {
    level: 6,
    title: {
      en: 'Academic Explorer',
      am: 'አካዳሚክ አሳሽ',
      om: "Sakatta'aa Barnootaa",
      ti: 'ተመራማሪ ትምህርቲ',
    },
    minXp: 2300,
    maxXp: 3250,
    badgeIcon: 'Award',
    perk: {
      en: 'Unlocks Ethiopian Curriculum Cross-Disciplinary Knowledge Map analysis',
      am: 'የኢትዮጵያ ስርዓተ-ትምህርት አቋራጭ የእውቀት ካርታ ትንታኔን ይከፍታል',
      om: 'Xiinxala maappii beekumsa sirna barnootaa Itoophiyaa bana',
      ti: 'ናይ ኢትዮጵያ ስርዓተ-ትምህርቲ ሰፊሕ ናይ ፍልጠት ካርታ ትንተና ይኸፍት',
    },
    description: {
      en: 'Exploring intricate problem-solving across multiple subject streams.',
      am: 'በተለያዩ የትምህርት ዘርፎች ላይ ውስብስብ ችግር ፈቺነትን ማሰስ።',
      om: 'Gosa barnootaa adda addaa keessatti furmaata rakkoo barbaaduu.',
      ti: 'ኣብ ዝተፈላለዩ ዓውድታት ትምህርቲ ዝተሓላለኹ ጸገማት ምፍታሕ።',
    },
  },
  {
    level: 7,
    title: {
      en: 'Mastery Sage',
      am: 'የክህሎት ጠቢብ',
      om: 'Ogeessa Ogummaa',
      ti: 'ሊቅ ብቕዓት',
    },
    minXp: 3250,
    maxXp: 4400,
    badgeIcon: 'ShieldCheck',
    perk: {
      en: 'Peer-helper status badge & advanced laboratory simulation modules',
      am: 'የተማሪ አጋዥ ባጅ እና የላቁ የላብራቶሪ ማስመሰያ ሞጁሎች',
      om: 'Mallattoo gargaaraa barattootaa fi shaakala laaboraatorii olaanaa',
      ti: 'ናይ ተምሃሮ ሓጋዚ ምልክትን ዝለዓሉ ናይ ላቦራቶሪ ሞጁላትን',
    },
    description: {
      en: 'You have mastered significant portions of high school curriculum curricula.',
      am: 'ከፍተኛ የሁለተኛ ደረጃ ስርዓተ-ትምህርት ክፍሎችን በሚገባ ተቆጣጥረዋል።',
      om: 'Kutaa guddaa sirna barnootaa sadarkaa 2ffaa gonfatteetta.',
      ti: 'ኣብ ካልኣይ ብርኪ ትምህርቲ ሰፊሕ ዓቕሚ ኣጥረይኩም።',
    },
  },
  {
    level: 8,
    title: {
      en: 'Horizon Voyager',
      am: 'አድማስ አላሚ',
      om: 'Daawwataa Samii',
      ti: 'ፈላሲ ራእይ',
    },
    minXp: 4400,
    maxXp: 5800,
    badgeIcon: 'Flame',
    perk: {
      en: 'University entrance readiness analytics & subject scholarship badges',
      am: 'የዩኒቨርሲቲ መግቢያ ዝግጁነት ትንታኔ እና የትምህርት ውጤታማነት ባጆች',
      om: 'Xiinxala qophii seensa yuunivarsiitii fi beekamtii barnootaa',
      ti: 'ናይ ዩኒቨርሲቲ ምድላው ትንተናን ናይ ብቕዓት ሽልማትን',
    },
    description: {
      en: 'Reaching beyond standard expectations with relentless consistency.',
      am: 'ሳይሰለቹ በቋሚነት በመማር ከተለመደው በላይ ልህቀት ማሳየት።',
      om: 'Walirraa hin cinneen barachuudhaan eegamuu olitti milkaa\'uu.',
      ti: 'ብዘይዕረፍቲ ብምምሃር ካብ ትጽቢት ንላዕሊ ብልሒ ምርኣይ።',
    },
  },
  {
    level: 9,
    title: {
      en: 'Wisdom Beacon',
      am: 'የጥበብ ፋና',
      om: 'Faana Beekumsaa',
      ti: 'ፋና ጥበብ',
    },
    minXp: 5800,
    maxXp: 7500,
    badgeIcon: 'Sun',
    perk: {
      en: 'Honor roll recognition & Master of Secondary Curriculum distinction',
      am: 'የክብር ሰሌዳ እውቅና እና የሁለተኛ ደረጃ ስርዓተ-ትምህርት የበላይነት ማረጋገጫ',
      om: 'Beekamtii kabajaa fi waraqaa qulqullina barnootaa sadarkaa 2ffaa',
      ti: 'ናይ ክብሪ ሰሌዳ ኣፍልጦን ናይ ካልኣይ ብርኪ ትምህርቲ ሊቕነትን',
    },
    description: {
      en: 'Exemplifying true perseverance, intellectual curiosity, and academic honor.',
      am: 'እውነተኛ ፅናትን፣ የእውቀት ጥማትን እና የአካዳሚክ ክብርን በተግባር ያሳየ።',
      om: 'Cimina dhugaa, fedhii beekumsaa fi kabaja barnootaa kan agarsiise.',
      ti: 'ናይ ሓቂ ጽንዓት፣ ናይ ፍልጠት ሃንቀውታን ናይ ትምህርቲ ክብረትን ዘንጸባረቐ።',
    },
  },
  {
    level: 10,
    title: {
      en: 'Grand Luminary',
      am: 'ታላቁ ብርሃን',
      om: 'Ifa Guddaa',
      ti: 'ዓብዪ ብርሃን',
    },
    minXp: 7500,
    maxXp: 10000,
    badgeIcon: 'Crown',
    perk: {
      en: 'All modules unlocked, Golden Scholar status, permanent platform hallmark',
      am: 'ሁሉም ሞጁሎች ተከፍተዋል፤ የወርቅ ተማሪ ማዕረግ እና ዘላቂ የክብር ምልክት',
      om: 'Gosti hunduu banameera, sadarkaa warqee fi mallattoo kabajaa',
      ti: 'ኩሉ ተኸፊቱ፤ ናይ ወርቂ ተምሃራይ መዓርግን ቀዋሚ ናይ ክብሪ ምልክትን',
    },
    description: {
      en: 'The pinnacle of high school study devotion. A guiding light to all learners.',
      am: 'የሁለተኛ ደረጃ ትምህርት ትጋት ከፍተኛ ጫፍ። ለሁሉም ተማሪዎች መሪ ብርሃን።',
      om: 'Fiixee kutannoo barnoota sadarkaa 2ffaa. Ifa barattoota hundaa.',
      ti: 'ጫፍ ናይ ካልኣይ ብርኪ ትግሃት። ንኹሎም ተምሃሮ መሪሕ ብርሃን።',
    },
  },
];

export const BADGES_CATALOG: BadgeItem[] = [
  {
    id: 'first_lesson',
    code: 'BADGE_FIRST_LESSON',
    title: {
      en: 'First Lesson',
      am: 'የመጀመሪያ ትምህርት',
      om: 'Barnoota Jalqabaa',
      ti: 'ቀዳማይ ትምህርቲ',
    },
    description: {
      en: 'Completed your first interactive textbook lesson in the Ethiopian curriculum.',
      am: 'በኢትዮጵያ ስርዓተ-ትምህርት ውስጥ የመጀመሪያውን መስተጋብራዊ ትምህርት አጠናቋል።',
      om: 'Barnoota kitaabaa jalqabaa sirna barnootaa Itoophiyaa keessatti xumurte.',
      ti: 'ኣብ ናይ ኢትዮጵያ ስርዓተ-ትምህርቲ ቀዳማይ መስተጋብራዊ ትምህርቲ ወዲእኩም።',
    },
    category: 'starter',
    xpBonus: 50,
    iconName: 'BookOpen',
    colorHex: '#2563EB',
    requiredMetric: {
      type: 'first_lesson',
      targetCount: 1,
    },
  },
  {
    id: 'first_quiz',
    code: 'BADGE_FIRST_QUIZ',
    title: {
      en: 'First Quiz',
      am: 'የመጀመሪያ ፈተና',
      om: 'Qormaata Jalqabaa',
      ti: 'ቀዳማይ ፈተና',
    },
    description: {
      en: 'Successfully submitted and passed your very first topic quiz.',
      am: 'የመጀመሪያውን የትምህርት ርዕስ ፈተና በተሳካ ሁኔታ ወስደው አለፉ።',
      om: 'Qormaata mata duree jalqabaa milkaa\'inaan xumurteetta.',
      ti: 'ቀዳማይ ናይ ርእሲ ፈተና ብዓወት ሓሊፍኩም።',
    },
    category: 'quiz',
    xpBonus: 75,
    iconName: 'Award',
    colorHex: '#059669',
    requiredMetric: {
      type: 'first_quiz',
      targetCount: 1,
    },
  },
  {
    id: 'quiz_master',
    code: 'BADGE_QUIZ_MASTER',
    title: {
      en: 'Quiz Master',
      am: 'የፈተና ጌታ',
      om: "Mo'ataa Qormaataa",
      ti: 'ዋዕሮ ፈተና',
    },
    description: {
      en: 'Achieved an exemplary 90%+ score on 5 curriculum unit quizzes.',
      am: 'በ 5 የትምህርት ምዕራፍ ፈተናዎች ላይ 90%+ የላቀ ውጤት አስመዝግቧል።',
      om: 'Qormaata boqonnaa 5 irratti qabxii olaanaa 90%+ galmeessifte.',
      ti: 'ኣብ 5 ናይ ምዕራፍ ፈተናታት 90%+ ዝለዓለ ውጽኢት ኣመዝጊብኩም።',
    },
    category: 'quiz',
    xpBonus: 200,
    iconName: 'Crown',
    colorHex: '#D97706',
    requiredMetric: {
      type: 'quiz_master',
      targetCount: 5,
    },
  },
  {
    id: 'streak_7',
    code: 'BADGE_STREAK_7',
    title: {
      en: '7-Day Learning Streak',
      am: 'የ7 ቀናት ተከታታይ ትምህርት',
      om: 'Turtii Barnootaa Guyyaa 7',
      ti: 'ናይ 7 መዓልታት ቀጻልነት ትምህርቲ',
    },
    description: {
      en: 'Studied for 7 consecutive days without interruption. Consistency is power!',
      am: 'ያለማቋረጥ ለ7 ተከታታይ ቀናት ተምረዋል። ቋሚነት ኃይል ነው!',
      om: 'Guyyoota 7 walitti aansuudhaan baratte. Ciminni humna!',
      ti: 'ን7 ተኸታተልቲ መዓልታት ብዘይ ምቁራጽ ተማሂርኩም። ቀጻልነት ሓይሊ እዩ!',
    },
    category: 'streak',
    xpBonus: 150,
    iconName: 'Flame',
    colorHex: '#EA580C',
    requiredMetric: {
      type: 'streak_7',
      targetCount: 7,
    },
  },
  {
    id: 'streak_30',
    code: 'BADGE_STREAK_30',
    title: {
      en: '30-Day Learning Streak',
      am: 'የ30 ቀናት ተከታታይ ትምህርት',
      om: 'Turtii Barnootaa Guyyaa 30',
      ti: 'ናይ 30 መዓልታት ቀጻልነት ትምህርቲ',
    },
    description: {
      en: 'Maintained unbroken learning for a full month. An extraordinary discipline.',
      am: 'ለሙሉ አንድ ወር ተከታታይ የመማር ልምድን አስጠብቀዋል። ታላቅ ስነ-ስርዓት!',
      om: 'Ji\'a guutuu barachuu itti fufte. Naamusa addaa!',
      ti: 'ንሓደ ምሉእ ወርሒ ምምሃርኩም ኣይቋረጽኩምን። ፍሉይ ስነ-ስርዓት!',
    },
    category: 'streak',
    xpBonus: 500,
    iconName: 'Sun',
    colorHex: '#DC2626',
    requiredMetric: {
      type: 'streak_30',
      targetCount: 30,
    },
  },
  {
    id: 'subject_explorer',
    code: 'BADGE_SUBJECT_EXPLORER',
    title: {
      en: 'Subject Explorer',
      am: 'የትምህርት አሳሽ',
      om: "Sakatta'aa Barnootaa",
      ti: 'ፈታሺ ዓይነተ ትምህርቲ',
    },
    description: {
      en: 'Completed at least one lesson across 4 different Ethiopian high school subjects.',
      am: 'በ 4 የተለያዩ የሁለተኛ ደረጃ ትምህርቶች ቢያንስ አንድ ትምህርት አጠናቋል።',
      om: 'Gosa barnootaa 4 adda addaa keessatti yoo xiqqaate barnoota tokko xumurte.',
      ti: 'ኣብ 4 ዝተፈላለዩ ዓይነታት ትምህርቲ ቢያንስ ሓደ ትምህርቲ ወዲእኩም።',
    },
    category: 'subject',
    xpBonus: 120,
    iconName: 'Compass',
    colorHex: '#7C3AED',
    requiredMetric: {
      type: 'subject_explorer',
      targetCount: 4,
    },
  },
  {
    id: 'topic_master',
    code: 'BADGE_TOPIC_MASTER',
    title: {
      en: 'Topic Master',
      am: 'የርዕስ ጠቢብ',
      om: 'Ogeessa Mata Duree',
      ti: 'ዋና ርእሲ',
    },
    description: {
      en: 'Reached 100% mastery in reading, practice, and assessment on 3 key topics.',
      am: 'በ 3 ቁልፍ ርዕሶች ላይ በንባብ፣ በልምምድ እና በፈተና 100% ሙሉ ክህሎት ደርሷል።',
      om: 'Mata duree 3 irratti dubbisuu, shaakala fi qormaata 100% xumurte.',
      ti: 'ኣብ 3 ዓበይቲ ኣርእስቲ ብንባብ፣ ልምምድን ፈተናን 100% ምሉእ ብቕዓት በጺሕኩም።',
    },
    category: 'mastery',
    xpBonus: 180,
    iconName: 'Sparkles',
    colorHex: '#0891B2',
    requiredMetric: {
      type: 'topic_master',
      targetCount: 3,
    },
  },
  {
    id: 'improvement_champion',
    code: 'BADGE_IMPROVEMENT_CHAMPION',
    title: {
      en: 'Improvement Champion',
      am: 'የእድገት ሻምፒዮን',
      om: "Shaampiyoonaa Fooyya'iinsaa",
      ti: 'ሻምፕዮን ምምሕያሽ',
    },
    description: {
      en: 'Retook a previously challenging quiz and raised score by 15% or more.',
      am: 'ቀደም ሲል አስቸጋሪ የነበረን ፈተና በድጋሚ ወስደው ውጤታቸውን በ 15%+ አሻሽለዋል።',
      om: 'Qormaata duraan rakkisaa ture irra deebitee qabxii kee 15%+ fooyyessite.',
      ti: 'ቅድሚ ሕጂ በዳሂ ዝነበረ ፈተና ደጊምኩም ብምውሳድ ውጽኢትኩም ብ15%+ ኣመሓይሽኩም።',
    },
    category: 'mastery',
    xpBonus: 150,
    iconName: 'TrendingUp',
    colorHex: '#10B981',
    requiredMetric: {
      type: 'improvement_champion',
      targetCount: 1,
    },
  },
  {
    id: 'problem_solver',
    code: 'BADGE_PROBLEM_SOLVER',
    title: {
      en: 'Problem Solver',
      am: 'ችግር ፈቺ',
      om: 'Furaa Rakkoo',
      ti: 'ፈታሒ ጸገም',
    },
    description: {
      en: 'Solved 20 end-of-lesson practice questions or step-by-step math/science problems.',
      am: '20 የትምህርት መጨረሻ የልምምድ ጥያቄዎችን ወይም የሂሳብ/ሳይንስ ችግሮችን ፈቷል።',
      om: 'Gaaffilee shaakalaa 20 ykn herregaa/saayinsii furteetta.',
      ti: '20 ናይ መወዳእታ ትምህርቲ ናይ ልምምድ ሕቶታት ወይ ናይ ሒሳብ/ሳይንስ ጸገማት ፈቲሕኩም።',
    },
    category: 'starter',
    xpBonus: 100,
    iconName: 'CheckCircle2',
    colorHex: '#6366F1',
    requiredMetric: {
      type: 'problem_solver',
      targetCount: 20,
    },
  },
  {
    id: 'consistent_learner',
    code: 'BADGE_CONSISTENT_LEARNER',
    title: {
      en: 'Consistent Learner',
      am: 'ቋሚ ተማሪ',
      om: 'Barataa Cimaa',
      ti: 'ቀጻሊ ተምሃራይ',
    },
    description: {
      en: 'Completed 10 daily goals recommended by the adaptive learning engine.',
      am: 'በተለዋዋጭ የመማሪያ ሞተሩ የተጠቆሙትን 10 የቀን ግቦች አጠናቋል።',
      om: 'Galma guyyaa 10 sirna barnootaatiin gorfaman xumurteetta.',
      ti: 'ብተዓጻጻፊ ናይ ምምሃር ሞተር ዝተሓበሩ 10 ናይ መዓልቲ ሸቶታት ወዲእኩም።',
    },
    category: 'consistency',
    xpBonus: 250,
    iconName: 'Target',
    colorHex: '#F59E0B',
    requiredMetric: {
      type: 'consistent_learner',
      targetCount: 10,
    },
  },
];

export function getLevelForXp(xp: number): LearningLevel {
  for (let i = LEARNING_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEARNING_LEVELS[i].minXp) {
      return LEARNING_LEVELS[i];
    }
  }
  return LEARNING_LEVELS[0];
}

export function calculateLevelProgress(xp: number): {
  currentLevel: LearningLevel;
  nextLevel: LearningLevel | null;
  xpInCurrentLevel: number;
  xpNeededForNextLevel: number;
  percentage: number;
} {
  const current = getLevelForXp(xp);
  const next =
    LEARNING_LEVELS.find((lvl) => lvl.level === current.level + 1) || null;

  if (!next) {
    return {
      currentLevel: current,
      nextLevel: null,
      xpInCurrentLevel: xp - current.minXp,
      xpNeededForNextLevel: 0,
      percentage: 100,
    };
  }

  const span = next.minXp - current.minXp;
  const inLevel = Math.max(0, xp - current.minXp);
  const pct = Math.min(100, Math.round((inLevel / span) * 100));

  return {
    currentLevel: current,
    nextLevel: next,
    xpInCurrentLevel: inLevel,
    xpNeededForNextLevel: next.minXp - xp,
    percentage: pct,
  };
}

export const DEFAULT_DAILY_GOALS: Array<Omit<DailyGoal, 'id' | 'userId' | 'date' | 'completedAt'>> = [
  {
    type: 'complete_lesson',
    title: {
      en: 'Complete One Lesson',
      am: 'አንድ ትምህርት ያጠናቅቁ',
      om: 'Barnoota Tokko Xumuri',
      ti: 'ሓደ ትምህርቲ ወድኡ',
    },
    description: {
      en: 'Read through textbook sections and key points for today.',
      am: 'የዛሬውን የመማሪያ መጽሐፍ ክፍሎች እና ዋና ነጥቦች ያንብቡ።',
      om: 'Kutaa kitaabaa fi qabxiilee ijoo guyyaa har\'aa dubbisi.',
      ti: 'ናይ ሎሚ ናይ መጽሓፍ ክፍልታትን ዓበይቲ ነጥብታትን ኣንብቡ።',
    },
    targetCount: 1,
    currentCount: 0,
    isCompleted: false,
    xpReward: 50,
  },
  {
    type: 'practice_questions',
    title: {
      en: 'Practice 3 Questions',
      am: '3 የልምምድ ጥያቄዎችን ይስሩ',
      om: 'Gaaffilee 3 Shaakali',
      ti: '3 ሕቶታት ተለማመዱ',
    },
    description: {
      en: 'Solve step-by-step practice exercises with hints.',
      am: 'ፍንጮችን በመጠቀም ደረጃ በደረጃ የልምምድ ጥያቄዎችን ይፍቱ።',
      om: 'Gargaarsa fayyadamuun gaaffilee shaakalaa furi.',
      ti: 'ሓሳባት ብምጥቃም ደረጃ ብደረጃ ናይ ልምምድ ሕቶታት ፍትሑ።',
    },
    targetCount: 3,
    currentCount: 0,
    isCompleted: false,
    xpReward: 40,
  },
  {
    type: 'review_weak_topic',
    title: {
      en: 'Review a Weak Topic',
      am: 'ደካማ ርዕስን ይገምግሙ',
      om: 'Mata Duree Cimaa Hin Taane Irra Deebi\'i',
      ti: 'ድኹም ርእሲ ደጊምኩም ርኣዩ',
    },
    description: {
      en: 'Reinforce topics diagnosed by adaptive AI as needing revision.',
      am: 'በአዳፕቲቭ AI ክለሳ የሚያስፈልጋቸው ተብለው የተለዩ ርዕሶችን ያጠናክሩ።',
      om: 'Mata duree AI\'n akka irra deebitu gorse jabeessi.',
      ti: 'ብኣዳፕቲቭ AI ምድጋም ዘድልዮም ዝተባህሉ ኣርእስቲ ኣበርትዑ።',
    },
    targetCount: 1,
    currentCount: 0,
    isCompleted: false,
    xpReward: 45,
  },
  {
    type: 'take_quiz',
    title: {
      en: 'Take a Topic Quiz',
      am: 'የትምህርት ርዕስ ፈተና ይውሰዱ',
      om: 'Qormaata Mata Duree Fudhadhu',
      ti: 'ናይ ርእሲ ፈተና ውሰዱ',
    },
    description: {
      en: 'Check your concept mastery with 4 rapid quiz questions.',
      am: 'በ 4 ፈጣን ጥያቄዎች የመረዳት አቅምዎን ይፈትሹ።',
      om: 'Gaaffilee 4\'n hubannoo kee mirkaneessi.',
      ti: 'ብ4 ቅልጡፋት ሕቶታት ናይ ርድኢት ዓቕምኹም መርምሩ።',
    },
    targetCount: 1,
    currentCount: 0,
    isCompleted: false,
    xpReward: 60,
  },
];
