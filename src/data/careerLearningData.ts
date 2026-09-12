import {
  CareerProfile,
  SkillProfile,
  CrossSubjectConnection,
  TopicRealLifeConnection,
  RealWorldProjectIdea,
} from '../types/careerLearning';

export const CORE_SKILL_PROFILES: SkillProfile[] = [
  {
    skillId: 'problem_solving',
    name: {
      en: 'Problem Solving',
      am: 'ችግር ፈቺነት (Problem Solving)',
      om: 'Rakkina Hiikuu',
      ti: 'ጸገም ፈታሕነት',
    },
    description: {
      en: 'Breaking down complex challenges into manageable steps, testing hypotheses, and implementing workable solutions.',
      am: 'ውስብስብ ፈተናዎችን ደረጃ በደረጃ በመተንተን፣ አማራጭ መላዎችን በመሞከርና ውጤታማ መፍትሄዎችን በተግባር ማዋል::',
    },
    category: 'cognitive',
    curriculumActivities: [
      {
        subjectId: 'math-g9',
        activityType: { en: 'Word Problem Modeling', am: 'የሂሳብ ቃላት ጥያቄዎችን በሞዴል መግለጽ' },
        example: { en: 'Translating business profit/loss scenarios into linear equations.', am: 'የንግድ ትርፍና ኪሳራን በመስመራዊ እኩልታዎች ቀምሮ መፍታት::' },
      },
      {
        subjectId: 'physics-g9',
        activityType: { en: 'Kinematic Calculations', am: 'የእንቅስቃሴና ፍጥነት ስሌቶች' },
        example: { en: 'Calculating vehicle braking distances under different road frictions.', am: 'የተሽከርካሪ ማቆሚያ ርቀትን በተለያዩ የመንገድ ሁኔታዎች ማስላት::' },
      },
    ],
    careersValuingSkill: ['software_engineer', 'civil_engineer', 'doctor', 'architect', 'entrepreneur'],
  },
  {
    skillId: 'critical_thinking',
    name: {
      en: 'Critical Thinking',
      am: 'ሂሳዊ አስተሳሰብ (Critical Thinking)',
      om: 'Yaada Qeequu',
      ti: 'ነቃፊ ኣተሓሳስባ',
    },
    description: {
      en: 'Objectively analyzing information, identifying biases, evaluating evidence, and forming sound judgments.',
      am: 'መረጃዎችን ሚዛናዊ በሆነ መልኩ መመርመር፣ አድሏዊነትን ማጣራት፣ መረጃን በማስረጃ መመዘንና ትክክለኛ ውሳኔ መስጠት::',
    },
    category: 'cognitive',
    curriculumActivities: [
      {
        subjectId: 'economics-g11',
        activityType: { en: 'Economic Policy Evaluation', am: 'የኢኮኖሚ ፖሊሲዎችን መገምገም' },
        example: { en: 'Assessing the impacts of currency devaluation on urban consumers vs export farmers.', am: 'የውጭ ምንዛሪ ተመን ለውጥ በገበሬውና በሸማቹ ላይ ያለውን ተጽዕኖ ማመዛዘን::' },
      },
      {
        subjectId: 'biology-g9',
        activityType: { en: 'Evaluating Medical Claims', am: 'የጤና መረጃዎችን ሳይንሳዊነት መመርመር' },
        example: { en: 'Distinguishing proven antibiotic treatments from unverified folk claims.', am: 'ሳይንሳዊ የህክምና መረጃን ካልተረጋገጡ አፈታሪኮች ለይቶ ማወቅ::' },
      },
    ],
    careersValuingSkill: ['doctor', 'economist', 'data_scientist', 'environmental_scientist', 'researcher'],
  },
  {
    skillId: 'logical_reasoning',
    name: {
      en: 'Logical Reasoning',
      am: 'ሎጂካዊ አስተውሎት (Logical Reasoning)',
      om: 'Yaada Sababaawaa',
      ti: 'ርትዓዊ ኣተሓሳስባ',
    },
    description: {
      en: 'Deductive and inductive reasoning, recognizing patterns, formal proofs, and algorithmic thought process.',
      am: 'ተከታታይ አመክንዮን መገንዘብ፣ ረቂቅ ስርዓተ-ንድፎችን ማወቅ፣ ማስረጃዎችን በቅደም-ተከተል ማቆራኘት::',
    },
    category: 'cognitive',
    curriculumActivities: [
      {
        subjectId: 'math-g9',
        activityType: { en: 'Set Theory & Proofs', am: 'የስብስብ ፅንሰ-ሀሳብና ማረጋገጫዎች' },
        example: { en: 'Proving De Morgan’s laws using truth tables and Venn diagrams.', am: 'የዲ ሞርጋን ህጎችን በቬን ዲያግራም ማረጋገጥ::' },
      },
    ],
    careersValuingSkill: ['software_engineer', 'data_scientist', 'accountant', 'pilot'],
  },
  {
    skillId: 'scientific_reasoning',
    name: {
      en: 'Scientific Reasoning',
      am: 'ሳይንሳዊ አመክንዮ (Scientific Reasoning)',
      om: 'Yaada Saayinsawaa',
      ti: 'ሳይንሳዊ መረዳእታ',
    },
    description: {
      en: 'Formulating empirical questions, controlling variables, interpreting laboratory observations, and drawing evidence-based conclusions.',
      am: 'ጥያቄዎችን በሳይንሳዊ ሙከራ መፈተሽ፣ ተለዋዋጮችን መቆጣጠርና በሙከራ ውጤት ላይ ተመስርቶ መደምደም::',
    },
    category: 'cognitive',
    curriculumActivities: [
      {
        subjectId: 'chemistry-g9',
        activityType: { en: 'Titration & pH Observation', am: 'የአሲድና ቤዝ ንጽጽር ሙከራዎች' },
        example: { en: 'Determining soil pH levels using litmus paper and natural plant indicators.', am: 'የአፈርን አሲዳማነት በተፈጥሯዊ አመልካቾች መለካት::' },
      },
    ],
    careersValuingSkill: ['pharmacist', 'agricultural_scientist', 'environmental_scientist', 'doctor'],
  },
  {
    skillId: 'data_analysis',
    name: {
      en: 'Data Analysis & Interpretation',
      am: 'የመረጃ ትንተና (Data Analysis)',
      om: 'Xiinxala Ragaa',
      ti: 'ትንተና ሓበሬታ',
    },
    description: {
      en: 'Extracting meaningful insights from numerical datasets, reading charts, calculating statistical variances, and forecasting trends.',
      am: 'ከቁጥራዊ መረጃዎች ውስጥ ጠቃሚ ሀሳቦችን ማውጣት፣ ግራፎችን ማንበብና የወደፊት አዝማሚያዎችን መተንበይ::',
    },
    category: 'technical',
    curriculumActivities: [
      {
        subjectId: 'math-g10',
        activityType: { en: 'Frequency Distributions & Measures', am: 'የስታቲስቲክስ ስሌቶችና ግራፎች' },
        example: { en: 'Plotting crop yield variances across different rainfall seasons in Ethiopia.', am: 'የኢትዮጵያ የዝናብ መጠንና የሰብል ምርታማነት ዝምድናን በግራፍ መተንተን::' },
      },
    ],
    careersValuingSkill: ['data_scientist', 'economist', 'agricultural_scientist', 'software_engineer'],
  },
  {
    skillId: 'digital_literacy',
    name: {
      en: 'Digital Literacy & Computing',
      am: 'የዲጂታልና ቴክኖሎጂ ዕውቀት (Digital Literacy)',
      om: 'Hubannoo Teeknooloojii',
      ti: 'ዲጂታል ንቕሓት',
    },
    description: {
      en: 'Understanding software algorithms, digital systems, cybersecurity principles, and leveraging digital tools to solve problems.',
      am: 'የኮምፒውተር ስልተ-ቀመሮችን መረዳት፣ ዲጂታል መተግበሪያዎችን ለስራና ትምህርት በብቃት መጠቀም::',
    },
    category: 'technical',
    curriculumActivities: [
      {
        subjectId: 'it-g9',
        activityType: { en: 'Spreadsheets & Algorithmic Steps', am: 'የስሌት ሰንጠረዥና ስልተ-ቀመሮች' },
        example: { en: 'Automating high school grade computation using formulas and logic loops.', am: 'የተማሪዎችን ውጤት በስሌት ሰንጠረዥ ቀመሮች በራስ-ሰር ማስላት::' },
      },
    ],
    careersValuingSkill: ['software_engineer', 'electrical_engineer', 'data_scientist', 'accountant'],
  },
  {
    skillId: 'financial_literacy',
    name: {
      en: 'Financial Literacy & Budgeting',
      am: 'የገንዘብና በጀት አያያዝ (Financial Literacy)',
      om: 'Hubannoo Faayinaansii',
      ti: 'ፋይናንሳዊ ንቕሓት',
    },
    description: {
      en: 'Budget planning, understanding interest rates, investment fundamentals, cash flows, and resource allocation.',
      am: 'የገቢና ወጪ በጀት እቅድ ማዘጋጀት፣ የወለድ ስሌትን መረዳት፣ ቁጠባና ኢንቨስትመንትን ማስተዳደር::',
    },
    category: 'practical',
    curriculumActivities: [
      {
        subjectId: 'economics-g9',
        activityType: { en: 'Household Budget Project', am: 'የቤተሰብ በጀት እቅድ' },
        example: { en: 'Designing a balanced family monthly budget incorporating emergency savings and inflation.', am: 'የዋጋ ግሽበትን ያገናዘበ ወርሃዊ የቤተሰብ በጀት ማዘጋጀት::' },
      },
    ],
    careersValuingSkill: ['economist', 'entrepreneur', 'accountant', 'civil_engineer'],
  },
  {
    skillId: 'communication',
    name: {
      en: 'Communication & Expression',
      am: 'የግንኙነትና ሐሳብ ገላጭነት (Communication)',
      om: 'Waliigalteefi Ibsa',
      ti: 'ርክብን ሓሳብ ምግላጽን',
    },
    description: {
      en: 'Articulating technical concepts clearly in written, oral, and visual formats to diverse audiences.',
      am: 'ውስብስብ የሳይንስና የሂሳብ ፅንሰ-ሀሳቦችን ለሌሎች ግልጽና አሳማኝ በሆነ መንገድ በንግግርና በጽሁፍ ማስረዳት::',
    },
    category: 'interpersonal',
    curriculumActivities: [
      {
        subjectId: 'english-g9',
        activityType: { en: 'Persuasive Speech & Reports', am: 'ሳይንሳዊ ዘገባዎችን ማቅረብ' },
        example: { en: 'Presenting a project proposal on school waste reduction to peers.', am: 'በት/ቤት የቆሻሻ አያያዝ ዙሪያ የተዘጋጀ ፕሮጀክት ለክፍል ጓደኞች ማብራራት::' },
      },
    ],
    careersValuingSkill: ['educator', 'doctor', 'entrepreneur', 'architect'],
  },
  {
    skillId: 'creativity',
    name: {
      en: 'Creativity & Innovation',
      am: 'ፈጠራና አዳዲስ ሃሳቦችን ማመንጨት (Creativity)',
      om: 'Kalaqaafi Kalaqinsa',
      ti: 'ምህዞን ምፍጣርን',
    },
    description: {
      en: 'Designing novel solutions, combining disparate ideas, and finding unconventional pathways around constraints.',
      am: 'ያሉ ውስንነቶችን ተሻግሮ አዳዲስና ቀላል መፍትሄዎችን መፍጠር፣ ጥበብና ሳይንስን ማቀናጀት::',
    },
    category: 'cognitive',
    curriculumActivities: [
      {
        subjectId: 'physics-g10',
        activityType: { en: 'Recycled Materials Model', am: 'ከተጣሉ እቃዎች ሞዴል መስራት' },
        example: { en: 'Constructing a solar water heating model using discarded plastic bottles and dark hoses.', am: 'ከተጣሉ ፕላስቲኮችና ቱቦዎች የፀሐይ ውሃ ማሞቂያ ሞዴል መስራት::' },
      },
    ],
    careersValuingSkill: ['architect', 'software_engineer', 'entrepreneur', 'mechanical_engineer'],
  },
  {
    skillId: 'collaboration',
    name: {
      en: 'Collaboration & Teamwork',
      am: 'የቡድን ስራና ትብብር (Collaboration)',
      om: 'Waliin Hojjechuu',
      ti: 'ናይ ሓባር ስራሕ',
    },
    description: {
      en: 'Coordinating with peers, respecting diverse perspectives, dividing duties, and delivering shared goals.',
      am: 'በቡድን ውስጥ ሃላፊነትን ተካፍሎ መስራት፣ የሌሎችን ሀሳብ ማክበርና ለጋራ ውጤት መትጋት::',
    },
    category: 'interpersonal',
    curriculumActivities: [
      {
        subjectId: 'biology-g10',
        activityType: { en: 'Group Ecological Survey', am: 'የቡድን አካባቢ ጥናት' },
        example: { en: 'Mapping local plant species with classmates and compiling a collective herbarium.', am: 'ከጓደኞች ጋር በመሆን የአካባቢ እፅዋት ዝርዝር ጥናት ማዘጋጀት::' },
      },
    ],
    careersValuingSkill: ['civil_engineer', 'doctor', 'software_engineer', 'educator'],
  },
];

export const CAREER_PROFILES: CareerProfile[] = [
  {
    careerId: 'doctor',
    careerName: {
      en: 'Medical Doctor / Physician',
      am: 'የህክምና ዶክተር / ሀኪም',
      om: 'Ogeessa Fayyaa / Doktoora',
      ti: 'ሓኪም / ናይ ሕክምና ዶክተር',
    },
    category: 'health',
    shortDescription: {
      en: 'Diagnoses illnesses, prescribes treatments, conducts surgical operations, and promotes public healthcare.',
      am: 'በሽታዎችን ይመረምራል፣ ያክማል፣ ቀዶ-ህክምና ያካሂዳል፣ የማህበረሰብ ጤናን ይጠብቃል::',
    },
    detailedOverview: {
      en: 'Physicians in Ethiopia play an indispensable role in patient diagnosis, surgical intervention, and preventive community healthcare in public hospitals and specialized clinics.',
      am: 'ሀኪሞች በኢትዮጵያ በሆስፒታሎችና ጤና ጣቢያዎች የታካሚዎችን ህመም በመመርመር፣ ህይወት አድን ቀዶ ህክምናዎችን በማካሄድና ተላላፊ በሽታዎችን በመከላከል ከፍተኛ ሀገራዊ አስተዋጽኦ ያበረክታሉ::',
    },
    iconName: 'Stethoscope',
    isHighGrowthInEthiopia: true,
    relatedSubjects: [
      {
        subjectId: 'biology-g9',
        subjectName: { en: 'Biology', am: 'ስነ-ህይወት (Biology)' },
        importance: 'core',
        rationale: {
          en: 'Foundation of cellular biology, human physiology, genetics, pathogens, and pharmacology.',
          am: 'ስለ ሰውነት አካል አሰራር፣ ህዋሳት፣ ጀነቲክስና በሽታ አምጪ ተህዋስያን ለመረዳት መሰረት ነው::',
        },
      },
      {
        subjectId: 'chemistry-g9',
        subjectName: { en: 'Chemistry', am: 'ኬሚስትሪ (Chemistry)' },
        importance: 'core',
        rationale: {
          en: 'Understanding drug interactions, biochemistry, acid-base equilibrium in blood, and metabolic reactions.',
          am: 'የመድሃኒት ቅመማን፣ በደም ውስጥ ያሉ ኬሚካላዊ ምላሾችንና የሰውነት ንጥረ-ነገሮችን ለመረዳት ወሳኝ ነው::',
        },
      },
      {
        subjectId: 'physics-g9',
        subjectName: { en: 'Physics', am: 'ፊዚክስ (Physics)' },
        importance: 'supporting',
        rationale: {
          en: 'Crucial for medical imaging (X-rays, MRI, Ultrasound), cardiovascular hemodynamics, and radiation therapy.',
          am: 'ለኤክስሬይ (X-ray)፣ አልትራሳውንድ፣ ኤምአርአይ (MRI) እና የደም ግፊት ህጎችን ለመረዳት ይረዳል::',
        },
      },
      {
        subjectId: 'english-g9',
        subjectName: { en: 'English', am: 'እንግሊዝኛ (English)' },
        importance: 'supporting',
        rationale: {
          en: 'Medical literature, clinical research, and university medical education are predominantly in English.',
          am: 'የህክምና ሳይንስ መጽሐፍት፣ ጥናቶችና የዩኒቨርሲቲ ትምህርት የሚሰጠው በእንግሊዝኛ ቋንቋ ነው::',
        },
      },
    ],
    importantTopics: [
      {
        subjectId: 'biology-g9',
        topicId: 'bio-g9-u2-cells',
        topicTitle: { en: 'Cell Biology & Enzymes', am: 'ህዋሳትና ኢንዛይሞች' },
        whyItMatters: {
          en: 'All diseases originate at the cellular level; enzymes drive every metabolic pathway in human organs.',
          am: 'ህመሞች ሁሉ የሚጀምሩት በህዋስ ደረጃ ነው፤ ኢንዛይሞችም የሰውነት ኬሚካላዊ እንቅስቃሴን ያፋጥናሉ::',
        },
        applicationExample: {
          en: 'Explains how sickle cell anemia alters erythrocyte structure and causes oxygen deficiency.',
          am: 'የቀይ ደም ሴል ቅርጽ መበላሸት እንዴት ወደ ኦክስጅን እጥረት እንደሚያመራ ያብራራል::',
        },
      },
      {
        subjectId: 'chemistry-g9',
        topicId: 'chem-g9-u3-acids-bases',
        topicTitle: { en: 'Acids, Bases & Buffers', am: 'አሲዶች፣ ቤዞችና ባፈሮች' },
        whyItMatters: {
          en: 'Human blood pH must remain strictly between 7.35 and 7.45; small shifts cause acidosis or alkalosis.',
          am: 'የሰው ልጅ የደም ፒኤች (pH) ከ 7.35 እስከ 7.45 መቆየት አለበት፤ መጠነኛ ለውጥ ለሞት ሊዳርግ ይችላል::',
        },
        applicationExample: {
          en: 'Prescribing intravenous bicarbonate to treat diabetic ketoacidosis in hospital emergency rooms.',
          am: 'በድንገተኛ ክፍል ውስጥ አሲዳማነቱ የጨመረን ደም በመድሃኒት ሚዛናዊ ማድረግ::',
        },
      },
    ],
    requiredSkills: ['critical_thinking', 'scientific_reasoning', 'problem_solving', 'communication', 'collaboration'],
    educationFields: [
      {
        degreeName: { en: 'Doctor of Medicine (MD)', am: 'የህክምና ዶክትሬት (MD)' },
        programType: 'Undergraduate Medical Degree',
        ethiopianUniversities: [
          'Addis Ababa University (Tikur Anbessa)',
          'Jimma University',
          'Hawassa University',
          'Gondar University',
          'Mekelle University',
          'Haramaya University',
        ],
        durationYears: 6,
      },
    ],
    possibleRoles: [
      { en: 'General Practitioner', am: 'አጠቃላይ ሀኪም' },
      { en: 'Surgeon', am: 'ቀዶ-ህክምና ስፔሻሊስት' },
      { en: 'Pediatrician', am: 'የህጻናት ሀኪም' },
      { en: 'Cardiologist', am: 'የልብ ህክምና ስፔሻሊስት' },
    ],
    ethiopianOpportunities: {
      en: 'High demand across regional referral hospitals, Ethiopian Public Health Institute (EPHI), and emerging specialized tertiary hospitals.',
      am: 'በኢትዮጵያ ሪፈራል ሆስፒታሎች፣ በህብረተሰብ ጤና ኢንስቲትዩት (EPHI) እና በግል የህክምና ማዕከላት ከፍተኛ ፍላጎት አለ::',
    },
  },
  {
    careerId: 'software_engineer',
    careerName: {
      en: 'Software Engineer / Developer',
      am: 'የሶፍትዌር መሃንዲስ / አልሚ',
      om: 'Injineera Sooftiweerii',
      ti: 'ኢንጅነር ሶፍትዌር',
    },
    category: 'technology',
    shortDescription: {
      en: 'Designs, builds, and maintains software applications, algorithms, web platforms, and mobile apps.',
      am: 'የኮምፒውተር መተግበሪያዎችን፣ ስልተ-ቀመሮችን፣ ድረ-ገጾችንና የሞባይል አፖችን ያዘጋጃል፣ ይገነባል::',
    },
    detailedOverview: {
      en: 'Software engineers build the digital infrastructure powering fintech (e.g. Telebirr, CBE Birr), e-governance, agricultural tech, and ed-tech platforms in Ethiopia.',
      am: 'የሶፍትዌር መሃንዲሶች የኢትዮጵያን ዲጂታል ኢኮኖሚ የሚደግፉ የዲጂታል ክፍያዎችን (ቴሌብር፣ ሲቢኢ ብር)፣ የግብርና ቴክኖሎጂንና የትምህርት መተግበሪያዎችን ይገነባሉ::',
    },
    iconName: 'Code',
    isHighGrowthInEthiopia: true,
    relatedSubjects: [
      {
        subjectId: 'math-g9',
        subjectName: { en: 'Mathematics', am: 'ሂሳብ (Mathematics)' },
        importance: 'core',
        rationale: {
          en: 'Algorithms, data structures, cryptography, coordinate graphics, and machine learning all rest on discrete math, algebra, and calculus.',
          am: 'ስልተ-ቀመሮች፣ የዳታ አደረጃጀት፣ ኢንክሪፕሽንና AI የተመሰረቱት በሂሳብ ፅንሰ-ሀሳብ ላይ ነው::',
        },
      },
      {
        subjectId: 'physics-g9',
        subjectName: { en: 'Physics', am: 'ፊዚክስ (Physics)' },
        importance: 'supporting',
        rationale: {
          en: 'Crucial for game engines, simulation systems, IoT sensor logic, and semiconductor understanding.',
          am: 'የጨዋታ ፊዚክስን ለመቅረጽ፣ ሴንሰሮችን ለመረዳትና የስርዓት ማስመሰያዎችን ለመስራት ይረዳል::',
        },
      },
      {
        subjectId: 'english-g9',
        subjectName: { en: 'English', am: 'እንግሊዝኛ (English)' },
        importance: 'core',
        rationale: {
          en: 'Programming languages, technical documentation, APIs, and global developer collaboration are conducted in English.',
          am: 'የፕሮግራሚንግ ቋንቋዎች፣ ዶክመንቴሽኖችና ዓለም አቀፍ የቴክኖሎጂ ስራዎች በእንግሊዝኛ ቋንቋ የተመሰረቱ ናቸው::',
        },
      },
    ],
    importantTopics: [
      {
        subjectId: 'math-g9',
        topicId: 'math-g9-u1-sets-functions',
        topicTitle: { en: 'Relations & Functions', am: 'ዝምድናዎችና ፈንክሽኖች' },
        whyItMatters: {
          en: 'Functions in programming directly mirror mathematical functions: a unique output for every defined input.',
          am: 'በኮዲንግ ውስጥ የምንጽፋቸው ፈንክሽኖች ከሂሳብ ፈንክሽን ጋር አንድ አይነት አመክንዮ አላቸው::',
        },
        applicationExample: {
          en: 'Building a currency conversion API mapping USD to ETB using functional composition.',
          am: 'የዶላርን ወደ ብር ምንዛሪ የሚያሰላ የሞባይል ባንኪንግ ፈንክሽን መጻፍ::',
        },
      },
      {
        subjectId: 'math-g10',
        topicId: 'math-g10-matrices',
        topicTitle: { en: 'Matrices & Linear Transformations', am: 'ማትሪክስና ትራንስፎርሜሽን' },
        whyItMatters: {
          en: 'Computer graphics, image processing, and neural network weights are computed as matrix multiplications.',
          am: 'የኮምፒውተር ግራፊክስ፣ ምስሎችና የሰው ሰራሽ አስተውሎት (AI) የሚሰሩት በማትሪክስ ስሌት ነው::',
        },
        applicationExample: {
          en: 'Rotating a 3D camera view inside a virtual architectural tour of Lalibela.',
          am: 'በ3D ግራፊክስ ውስጥ የካሜራ እይታን በማትሪክስ ማዞር::',
        },
      },
    ],
    requiredSkills: ['logical_reasoning', 'problem_solving', 'digital_literacy', 'creativity', 'research'],
    educationFields: [
      {
        degreeName: { en: 'B.Sc. in Software Engineering / Computer Science', am: 'የሶፍትዌር ምህንድስና ወይም ኮምፒውተር ሳይንስ ባችለር' },
        programType: 'Undergraduate Engineering/Technology Degree',
        ethiopianUniversities: [
          'Addis Ababa Science and Technology University (AASTU)',
          'Addis Ababa University (AAiT)',
          'Adama Science and Technology University (ASTU)',
          'Bahir Dar University (BiT)',
          'Jimma University (JIT)',
          'Hawassa University (IoT)',
        ],
        durationYears: 5,
      },
    ],
    possibleRoles: [
      { en: 'Full-Stack Web Developer', am: 'የዌብሳይትና ሲስተም አልሚ' },
      { en: 'Mobile App Developer', am: 'የሞባይል መተግበሪያ አልሚ' },
      { en: 'AI & Machine Learning Engineer', am: 'የሰው ሰራሽ አስተውሎት መሃንዲስ' },
      { en: 'Cybersecurity Specialist', am: 'የሳይበር ደህንነት ባለሙያ' },
    ],
    ethiopianOpportunities: {
      en: 'Booming tech ecosystem in Addis Ababa, fintech hubs, outsourcing firms, Ethiopian Artificial Intelligence Institute (EAII), and Information Network Security Administration (INSA).',
      am: 'በኢትዮጵያ አርቴፊሻል ኢንተለጀንስ ኢንስቲትዩት (EAII)፣ ኢንሳ (INSA)፣ ባንኮችና የግል ቴክኖሎጂ ድርጅቶች ውስጥ ሰፊ የስራ እድል::',
    },
  },
  {
    careerId: 'civil_engineer',
    careerName: {
      en: 'Civil & Structural Engineer',
      am: 'የሲቪልና ህንጻ መሃንዲስ',
      om: 'Injineera Siiviilii',
      ti: 'ኢንጅነር ሲቪል',
    },
    category: 'engineering',
    shortDescription: {
      en: 'Designs, constructs, and supervises infrastructure projects: roads, bridges, dams, airports, and high-rise buildings.',
      am: 'መንገዶችን፣ ድልድዮችን፣ ግድቦችንና ህንጻዎችን ይነድፋል፣ ግንባታቸውን ይቆጣጠራል::',
    },
    detailedOverview: {
      en: 'Civil engineers in Ethiopia are the master builders behind transformative national megaprojects like the Grand Ethiopian Renaissance Dam (GERD), expressway corridors, and urban light railways.',
      am: 'የሲቪል መሃንዲሶች እንደ ታላቁ የኢትዮጵያ ህዳሴ ግድብ (ታላቁ ግድብ)፣ የክፍያ መንገዶችና የከተማ ባቡር ያሉ ታላላቅ ሀገራዊ መሰረተ-ልማቶችን ይገነባሉ::',
    },
    iconName: 'Building',
    isHighGrowthInEthiopia: true,
    relatedSubjects: [
      {
        subjectId: 'physics-g9',
        subjectName: { en: 'Physics', am: 'ፊዚክስ (Physics)' },
        importance: 'core',
        rationale: {
          en: 'Statics, dynamics, stress/strain mechanics, fluid dynamics, and material strength are absolute prerequisites.',
          am: 'የቁሶች ጥንካሬ፣ ጫናና ክብደት መሸከም፣ የስበት ህጎች ለህንጻና ድልድይ ዲዛይን ወሳኝ ናቸው::',
        },
      },
      {
        subjectId: 'math-g9',
        subjectName: { en: 'Mathematics', am: 'ሂሳብ (Mathematics)' },
        importance: 'core',
        rationale: {
          en: 'Trigonometry, vectors, calculus, and geometry define structural load distributions and land surveying.',
          am: 'ትሪጎኖሜትሪ፣ ቬክተርና ጂኦሜትሪ የህንጻ ቅርፅና የክብደት ስርጭትን ለማስላት ያገለግላሉ::',
        },
      },
      {
        subjectId: 'chemistry-g9',
        subjectName: { en: 'Chemistry', am: 'ኬሚስትሪ (Chemistry)' },
        importance: 'supporting',
        rationale: {
          en: 'Hydration reactions in Portland cement, steel corrosion prevention, and asphalt polymer testing.',
          am: 'የሲሚንቶ ውህደት ኬሚስትሪ፣ የአፈር ጨዋማነትና የብረት ዝገትን ለመከላከል ይረዳል::',
        },
      },
    ],
    importantTopics: [
      {
        subjectId: 'physics-g9',
        topicId: 'phys-g9-forces-equilibrium',
        topicTitle: { en: 'Forces & Static Equilibrium', am: 'ሀይሎችና ሚዛናዊነት' },
        whyItMatters: {
          en: 'A bridge or skyscraper must remain in static equilibrium: total net forces and moments must equal zero.',
          am: 'ድልድዮችና ህንጻዎች ሳይናወጡ እንዲቆሙ የሀይሎች ድምር ዜሮ መሆን አለበት::',
        },
        applicationExample: {
          en: 'Calculating truss bridge tension and compression forces across the Blue Nile gorge.',
          am: 'በአባይ ወንዝ ላይ ለሚገነባ ድልድይ የብረት ማገዶችን ጫና ማስላት::',
        },
      },
    ],
    requiredSkills: ['problem_solving', 'collaboration', 'critical_thinking', 'creativity'],
    educationFields: [
      {
        degreeName: { en: 'B.Sc. in Civil Engineering', am: 'የሲቪል ምህንድስና ባችለር' },
        programType: 'Undergraduate Engineering Degree',
        ethiopianUniversities: [
          'Addis Ababa Institute of Technology (AAiT)',
          'Addis Ababa Science & Technology University (AASTU)',
          'Adama Science & Technology University (ASTU)',
          'Bahir Dar University (BiT)',
          'Hawassa University (IoT)',
          'Arba Minch University (Water Tech)',
        ],
        durationYears: 5,
      },
    ],
    possibleRoles: [
      { en: 'Structural Engineer', am: 'የመዋቅር ዲዛይን መሃንዲስ' },
      { en: 'Highway & Transportation Engineer', am: 'የመንገድና ትራንስፖርት መሃንዲስ' },
      { en: 'Water Resources & Hydraulic Engineer', am: 'የውሃና ግድብ መሃንዲስ' },
      { en: 'Geotechnical Engineer', am: 'የአፈርና መሬት ጥናት መሃንዲስ' },
    ],
    ethiopianOpportunities: {
      en: 'Ethiopian Roads Administration (ERA), Ethiopian Construction Works Corporation, Ministry of Water and Energy, private consulting firms.',
      am: 'በኢትዮጵያ መንገዶች ባለስልጣን፣ በግንባታ ስራዎች ኮርፖሬሽን፣ በውሃና ኢነርጂ ሚኒስቴር ሰፊ የስራ እድል::',
    },
  },
  {
    careerId: 'agricultural_scientist',
    careerName: {
      en: 'Agricultural Scientist / Agronomist',
      am: 'የግብርና ሳይንቲስት / አግሮኖሚስት',
      om: 'Saayintistii Qonnaa',
      ti: 'ሳይንቲስት ሕርሻ',
    },
    category: 'agriculture_environment',
    shortDescription: {
      en: 'Improves crop yield, breeds drought-resilient seeds, manages soil health, and optimizes sustainable food systems.',
      am: 'የሰብል ምርታማነትን ያሳድጋል፣ ድርቅን የሚቋቋሙ ዘሮችን ያዳቅላል፣ የአፈር ለምነትን ያሻሽላል::',
    },
    detailedOverview: {
      en: 'Agriculture forms the backbone of Ethiopia’s economy. Agronomists develop innovative farming methods, protect endemic crops like Teff and Enset, and ensure national food sovereignty.',
      am: 'ግብርና የኢትዮጵያ ኢኮኖሚ የጀርባ አጥንት ነው:: የግብርና ሳይንቲስቶች የጤፍና እንሰት ምርታማነትን በማሳደግ የምግብ ዋስትናን ያረጋግጣሉ::',
    },
    iconName: 'Sprout',
    isHighGrowthInEthiopia: true,
    relatedSubjects: [
      {
        subjectId: 'biology-g9',
        subjectName: { en: 'Biology', am: 'ስነ-ህይወት (Biology)' },
        importance: 'core',
        rationale: {
          en: 'Plant genetics, photosynthesis, soil microbiome, pest biology, and plant physiology.',
          am: 'የእፅዋት ጀነቲክስ፣ ፎቶሲንተሲስ፣ የአፈር ጥቃቅን ህዋሳትና የተባይ ቁጥጥርን ለመረዳት መሰረት ነው::',
        },
      },
      {
        subjectId: 'chemistry-g9',
        subjectName: { en: 'Chemistry', am: 'ኬሚስትሪ (Chemistry)' },
        importance: 'core',
        rationale: {
          en: 'Soil nutrients (NPK ratios), fertilizers, pesticide chemistry, and soil acidity neutralization.',
          am: 'የማዳበሪያ ንጥረ ነገሮች (ናይትሮጅን፣ ፎስፈረስ፣ ፖታሲየም) እና የአፈር አሲዳማነትን ለማከም ወሳኝ ነው::',
        },
      },
      {
        subjectId: 'economics-g9',
        subjectName: { en: 'Economics', am: 'ኢኮኖሚክስ (Economics)' },
        importance: 'supporting',
        rationale: {
          en: 'Agricultural markets, farm budgeting, commodity prices (coffee, sesame), and export logistics.',
          am: 'የቡናና ሰሊጥ የወጪ ንግድ ዋጋ፣ የገበሬዎች ገቢና የሰብል ግብይትን ለመተንተን ይጠቅማል::',
        },
      },
    ],
    importantTopics: [
      {
        subjectId: 'biology-g9',
        topicId: 'bio-g9-plant-genetics',
        topicTitle: { en: 'Plant Genetics & Selective Breeding', am: 'የእፅዋት ጀነቲክስና ምርጥ ዘር' },
        whyItMatters: {
          en: 'Cross-pollinating local indigenous crops produces climate-resilient strains capable of doubling harvest yields.',
          am: 'አየር ንብረት ለውጥንና ድርቅን የሚቋቋሙ ምርጥ የጤፍና ስንዴ ዘሮችን ለማፍራት ይረዳል::',
        },
        applicationExample: {
          en: 'Breeding rust-resistant wheat varieties at Debre Zeit Agricultural Research Center.',
          am: 'በደብረዘይት ግብርና ምርምር ማዕከል ዋግን የሚቋቋም የስንዴ ዝርያ ማፍራት::',
        },
      },
    ],
    requiredSkills: ['scientific_reasoning', 'research', 'problem_solving', 'data_analysis'],
    educationFields: [
      {
        degreeName: { en: 'B.Sc. in Plant Sciences / Agronomy / Agricultural Engineering', am: 'የዕፅዋት ሳይንስ ወይም የግብርና ምህንድስና ባችለር' },
        programType: 'Undergraduate Agricultural Degree',
        ethiopianUniversities: [
          'Haramaya University (Pioneer of Agricultural Science)',
          'Hawassa University',
          'Jimma University (College of Agriculture)',
          'Bahir Dar University',
          'Ambo University',
        ],
        durationYears: 4,
      },
    ],
    possibleRoles: [
      { en: 'Crop Geneticist', am: 'የሰብል ጀነቲክስ ተመራማሪ' },
      { en: 'Soil Scientist', am: 'የአፈር ሳይንቲስት' },
      { en: 'Irrigation & Agri-Tech Specialist', am: 'የመስኖና ግብርና ቴክኖሎጂ ባለሙያ' },
      { en: 'Agricultural Extension Lead', am: 'የግብርና ኤክስቴንሽን መሪ' },
    ],
    ethiopianOpportunities: {
      en: 'Ethiopian Institute of Agricultural Research (EIAR), Ministry of Agriculture, Agricultural Transformation Institute (ATI), international agronomy NGOs.',
      am: 'በኢትዮጵያ ግብርና ምርምር ኢንስቲትዩት (EIAR)፣ በግብርና ሚኒስቴር እና በግብርና ትራንስፎርሜሽን ኢንስቲትዩት (ATI) ሰፊ የስራ እድል::',
    },
  },
  {
    careerId: 'economist',
    careerName: {
      en: 'Economist / Financial Policy Analyst',
      am: 'ኢኮኖሚስት / የፋይናንስ ፖሊሲ ተንታኝ',
      om: 'Ogeessa Dinagdee',
      ti: 'ኢኮኖሚስት / ተንታኒ ፖሊሲ',
    },
    category: 'business_economics',
    shortDescription: {
      en: 'Analyzes market forces, inflation, international trade, poverty alleviation policies, and fiscal budget planning.',
      am: 'የገበያ እንቅስቃሴን፣ የዋጋ ግሽበትን፣ የውጭ ንግድ ሚዛንንና ሀገራዊ በጀትን ያጠናል፣ ይመክራል::',
    },
    detailedOverview: {
      en: 'Economists advise government agencies, commercial banks, and international institutions on sustainable industrialization, macro-stability, and poverty reduction across Ethiopia.',
      am: 'ኢኮኖሚስቶች የኢትዮጵያን ማክሮ-ኢኮኖሚ መረጋጋት፣ የኢንዱስትሪ ልማትና የህዝቡን ኑሮ ለማሻሻል የሚያስችሉ የፖሊሲ ምክረ-ሀሳቦችን ያመነጫሉ::',
    },
    iconName: 'TrendingUp',
    isHighGrowthInEthiopia: true,
    relatedSubjects: [
      {
        subjectId: 'economics-g9',
        subjectName: { en: 'Economics', am: 'ኢኮኖሚክስ (Economics)' },
        importance: 'core',
        rationale: {
          en: 'Microeconomics (consumer choice, elasticity) and macroeconomics (GDP, monetary policy, inflation).',
          am: 'የገበያ አቅርቦትና ፍላጎት፣ የዋጋ ግሽበት፣ የስራ አጥነትና የሀገራዊ ገቢ ስሌትን ለመረዳት መሰረት ነው::',
        },
      },
      {
        subjectId: 'math-g9',
        subjectName: { en: 'Mathematics', am: 'ሂሳብ (Mathematics)' },
        importance: 'core',
        rationale: {
          en: 'Statistics, probability, linear programming, and calculus form the foundation of econometrics.',
          am: 'ስታቲስቲክስና ካልኩለስ ውስብስብ የኢኮኖሚ አዝማሚያዎችን በሞዴል ለመተንበይ ወሳኝ ናቸው::',
        },
      },
    ],
    importantTopics: [
      {
        subjectId: 'economics-g11',
        topicId: 'econ-g11-macro-inflation',
        topicTitle: { en: 'Inflation & Monetary Policy', am: 'የዋጋ ግሽበትና የገንዘብ ፖሊሲ' },
        whyItMatters: {
          en: 'Unchecked inflation erodes household purchasing power; interest rates and money supply control equilibrium.',
          am: 'የዋጋ ግሽበት የዜጎችን የመግዛት አቅም ያዳክማል፤ የባንክ የወለድ ተመን የዋጋ ንረትን ለመቆጣጠር ይጠቅማል::',
        },
        applicationExample: {
          en: 'National Bank of Ethiopia setting reserve ratios to stabilize foreign currency reserves and combat inflation.',
          am: 'የኢትዮጵያ ብሔራዊ ባንክ የዋጋ ግሽበትን ለመግታት የወለድ ተመንን ማስተካከል::',
        },
      },
    ],
    requiredSkills: ['data_analysis', 'critical_thinking', 'financial_literacy', 'research'],
    educationFields: [
      {
        degreeName: { en: 'B.A. in Economics / Development Economics', am: 'የኢኮኖሚክስ ወይም የልማት ኢኮኖሚክስ ባችለር' },
        programType: 'Undergraduate Social Sciences Degree',
        ethiopianUniversities: [
          'Addis Ababa University (Department of Economics)',
          'Hawassa University',
          'Jimma University',
          'Mekelle University',
          'Bahir Dar University',
        ],
        durationYears: 4,
      },
    ],
    possibleRoles: [
      { en: 'Macroeconomic Analyst', am: 'የማክሮ ኢኮኖሚ ተንታኝ' },
      { en: 'Investment Banker', am: 'የኢንቨስትመንት ባንክ ባለሙያ' },
      { en: 'Policy Advisor', am: 'የመንግስት ፖሊሲ አማካሪ' },
      { en: 'Trade & Customs Specialist', am: 'የንግድና ጉምሩክ ስፔሻሊስት' },
    ],
    ethiopianOpportunities: {
      en: 'Ministry of Finance, Ministry of Planning and Development, National Bank of Ethiopia (NBE), Commercial Bank of Ethiopia (CBE), UNECA.',
      am: 'በገንዘብ ሚኒስቴር፣ በፕላንና ልማት ሚኒስቴር፣ በብሔራዊ ባንክና በተባበሩት መንግስታት የአፍሪካ ኢኮኖሚክ ኮሚሽን (UNECA) ሰፊ የስራ እድል::',
    },
  },
  {
    careerId: 'electrical_engineer',
    careerName: {
      en: 'Electrical & Power Systems Engineer',
      am: 'የኤሌክትሪካልና የኃይል ቴክኖሎጂ መሃንዲስ',
      om: 'Injineera Elektiriikii',
      ti: 'ኢንጅነር ኤሌክትሪክ',
    },
    category: 'engineering',
    shortDescription: {
      en: 'Designs power generation, high-voltage transmission lines, renewable energy grids, and electronic control circuits.',
      am: 'የኤሌክትሪክ ኃይል ማመንጫዎችን፣ የከፍተኛ ቮልቴጅ መስመሮችንና የፀሐይ ኃይል ቴክኖሎጂን ይገነባል::',
    },
    detailedOverview: {
      en: 'Electrical engineers spearhead Ethiopia’s clean energy revolution, transmitting 5,000+ MW of hydroelectricity from GERD, Gibe III, and solar mini-grids to industries and homes.',
      am: 'የኤሌክትሪካል መሃንዲሶች ከህዳሴው ግድብ፣ ጊቤ 3 እና ከፀሐይ ኃይል የሚመነጨውን ኤሌክትሪክ ለመላው ሀገሪቱ የሚያሰራጩ መረቦችን ይገነባሉ::',
    },
    iconName: 'Zap',
    isHighGrowthInEthiopia: true,
    relatedSubjects: [
      {
        subjectId: 'physics-g9',
        subjectName: { en: 'Physics', am: 'ፊዚክስ (Physics)' },
        importance: 'core',
        rationale: {
          en: 'Electromagnetism, circuit theory, Faraday’s induction law, Ohm’s law, and alternating currents.',
          am: 'የኤሌክትሮማግኔት ህግጋት፣ የፋራዳይ ማመንጨት ህግና የኤሌክትሪክ ሰርኪውት ስሌት ዋና መሰረት ነው::',
        },
      },
      {
        subjectId: 'math-g9',
        subjectName: { en: 'Mathematics', am: 'ሂሳብ (Mathematics)' },
        importance: 'core',
        rationale: {
          en: 'Differential equations, complex numbers, Fourier analysis, and trigonometry for AC phase analysis.',
          am: 'ኮምፕሌክስ ቁጥሮችና ትሪጎኖሜትሪ ተለዋዋጭ የኤሌክትሪክ ሞገዶችን (AC) ለመተንተን ያገለግላሉ::',
        },
      },
    ],
    importantTopics: [
      {
        subjectId: 'physics-g10',
        topicId: 'phys-g10-electromagnetism',
        topicTitle: { en: 'Electromagnetism & Transformers', am: 'ኤሌክትሮማግኔትና ትራንስፎርመር' },
        whyItMatters: {
          en: 'Step-up transformers raise voltage to 400kV to minimize $I^2R$ power loss during long-distance transmission.',
          am: 'ኤሌክትሪክ በረጅም ርቀት ሲጓጓዝ እንዳይባክን ቮልቴጁን በትራንስፎርመር ከፍ ማድረግ ያስፈልጋል::',
        },
        applicationExample: {
          en: 'Transmitting electricity from GERD to Addis Ababa and exporting surplus power to Kenya and Djibouti.',
          am: 'ከህዳሴ ግድብ ወደ አዲስ አበባ፣ ኬንያና ጅቡቲ የሚላከውን ከፍተኛ የኤሌክትሪክ መስመር መቆጣጠር::',
        },
      },
    ],
    requiredSkills: ['logical_reasoning', 'problem_solving', 'scientific_reasoning', 'critical_thinking'],
    educationFields: [
      {
        degreeName: { en: 'B.Sc. in Electrical and Computer Engineering', am: 'የኤሌክትሪካልና ኮምፒውተር ምህንድስና ባችለር' },
        programType: 'Undergraduate Engineering Degree',
        ethiopianUniversities: [
          'Addis Ababa Institute of Technology (AAiT)',
          'AASTU',
          'ASTU',
          'Hawassa University',
          'Bahir Dar University',
        ],
        durationYears: 5,
      },
    ],
    possibleRoles: [
      { en: 'Power Grid Systems Engineer', am: 'የኤሌክትሪክ መስመር መሃንዲስ' },
      { en: 'Renewable Energy Specialist', am: 'የታዳሽ ኃይል (ፀሐይ/ንፋስ) ባለሙያ' },
      { en: 'Telecommunications Engineer', am: 'የቴሌኮሙኒኬሽን መሃንዲስ' },
      { en: 'Automation & Control Engineer', am: 'የኢንዱስትሪ ቁጥጥር መሃንዲስ' },
    ],
    ethiopianOpportunities: {
      en: 'Ethiopian Electric Power (EEP), Ethiopian Electric Utility (EEU), Ethio Telecom, Safaricom Ethiopia, wind and solar power developments.',
      am: 'በኢትዮጵያ ኤሌክትሪክ ኃይል (EEP)፣ በኢትዮ ቴሌኮም፣ በሳፋሪኮም ኢትዮጵያና በግል ታዳሽ ኃይል አቅራቢዎች ሰፊ የስራ እድል::',
    },
  },
  {
    careerId: 'pharmacist',
    careerName: {
      en: 'Pharmacist / Pharmaceutical Chemist',
      am: 'የመድሃኒት ቅመማ ባለሙያ (ፋርማሲስት)',
      om: 'Ogeessa Qorichaa / Faarmaasistii',
      ti: 'ፋርማሲስት / ሰራሕ መድሃኒት',
    },
    category: 'health',
    shortDescription: {
      en: 'Compounds, formulates, tests, and dispenses therapeutic drugs and educates patients on safe drug administration.',
      am: 'መድሃኒቶችን ያዘጋጃል፣ ይመረምራል፣ ያከፋፍላል፣ ህመምተኞች መድሃኒትን በትክክል እንዲጠቀሙ ይመክራል::',
    },
    detailedOverview: {
      en: 'Pharmacists in Ethiopia drive local drug manufacturing in industrial parks (e.g., Kilinto Industrial Park) and ensure clinical safety across medical facilities.',
      am: 'የፋርማሲ ባለሙያዎች በኢትዮጵያ በኪሊንጦ የፋርማሲዩቲካል ፓርክ መድሃኒቶችን በሀገር ውስጥ በማምረትና በሆስፒታሎች ደህንነታቸውን በማረጋገጥ ይሰራሉ::',
    },
    iconName: 'Pill',
    isHighGrowthInEthiopia: true,
    relatedSubjects: [
      {
        subjectId: 'chemistry-g9',
        subjectName: { en: 'Chemistry', am: 'ኬሚስትሪ (Chemistry)' },
        importance: 'core',
        rationale: {
          en: 'Organic chemistry, molecular structures, solutions, stoichiometry, and chemical kinetics of drug degradation.',
          am: 'የኦርጋኒክ ኬሚስትሪ ውህዶች፣ የመድሃኒት ቅመማ ስሌትና የመበስበስ ጊዜን ለማወቅ መሰረት ነው::',
        },
      },
      {
        subjectId: 'biology-g9',
        subjectName: { en: 'Biology', am: 'ስነ-ህይወት (Biology)' },
        importance: 'core',
        rationale: {
          en: 'Physiology, microbial resistance, enzyme receptor binding, and human organ pathways.',
          am: 'መድሃኒቶች በሰውነት ህዋሳትና በአካላት ላይ የሚያሳድሩትን ተጽዕኖ ለመረዳት ያገለግላል::',
        },
      },
    ],
    importantTopics: [
      {
        subjectId: 'chemistry-g10',
        topicId: 'chem-g10-organic-chemistry',
        topicTitle: { en: 'Organic Chemistry & Functional Groups', am: 'ኦርጋኒክ ኬሚስትሪና ፈንክሽናል ግሩፖች' },
        whyItMatters: {
          en: 'Almost all synthetic drugs are organic molecules whose medicinal action depends on functional groups (esters, amines).',
          am: 'አብዛኞቹ መድሃኒቶች የኦርጋኒክ ኬሚካል ውህዶች ናቸው፤ አሰራራቸውም በኬሚካል ቅርፃቸው ይወሰናል::',
        },
        applicationExample: {
          en: 'Synthesizing acetylsalicylic acid (Aspirin) from salicylic acid via esterification.',
          am: 'የአስፕሪን መድሃኒትን በላብራቶሪ ውስጥ ከሳሊሲሊክ አሲድ ማዘጋጀት::',
        },
      },
    ],
    requiredSkills: ['scientific_reasoning', 'critical_thinking', 'communication', 'data_analysis'],
    educationFields: [
      {
        degreeName: { en: 'Bachelor of Pharmacy (B.Pharm)', am: 'የፋርማሲ ባችለር ድግሪ' },
        programType: 'Undergraduate Pharmacy Degree',
        ethiopianUniversities: [
          'Addis Ababa University (School of Pharmacy)',
          'Gondar University',
          'Jimma University',
          'Haramaya University',
          'Hawassa University',
        ],
        durationYears: 5,
      },
    ],
    possibleRoles: [
      { en: 'Clinical Pharmacist', am: 'የሆስፒታል ክሊኒካል ፋርማሲስት' },
      { en: 'Industrial Formulation Chemist', am: 'የፋብሪካ መድሃኒት አምራች ኬሚስት' },
      { en: 'Regulatory Affairs Inspector', am: 'የመድሃኒት ጥራት ተቆጣጣሪ' },
    ],
    ethiopianOpportunities: {
      en: 'Ethiopian Food and Drug Authority (EFDA), local manufacturing plants at Kilinto Industrial Park, Ethiopian Pharmaceuticals Supply Agency (EPSA).',
      am: 'በኢትዮጵያ ምግብና መድኃኒት ባለስልጣን (EFDA)፣ በኪሊንጦ ኢንዱስትሪ ፓርክና በፋርማሲዩቲካል አቅራቢ ኤጀንሲ ሰፊ የስራ እድል::',
    },
  },
  {
    careerId: 'architect',
    careerName: {
      en: 'Architect & Urban Designer',
      am: 'አርክቴክትና የከተማ ፕላን አውጪ',
      om: 'Arkiiteektii',
      ti: 'አርክቴክት',
    },
    category: 'engineering',
    shortDescription: {
      en: 'Plans, designs, and visualizes sustainable buildings, public spaces, and master plans balancing beauty and function.',
      am: 'ውበትና ጥንካሬን ያጣመሩ ህንጻዎችን፣ መናፈሻዎችንና የከተማ ፕላኖችን ይነድፋል::',
    },
    detailedOverview: {
      en: 'Architects shape the visual skyline and urban resilience of Ethiopian cities, integrating heritage aesthetics (such as Lalibela and Axum stone geometry) with modern sustainable engineering.',
      am: 'አርክቴክቶች የኢትዮጵያን ታሪካዊ ቅርስ (እንደ ላሊበላና አክሱም ጥበብ) ከዘመናዊ አረንጓዴ ዲዛይን ጋር በማጣመር ውብ ከተሞችን ይገነባሉ::',
    },
    iconName: 'Compass',
    isHighGrowthInEthiopia: true,
    relatedSubjects: [
      {
        subjectId: 'math-g9',
        subjectName: { en: 'Mathematics', am: 'ሂሳብ (Mathematics)' },
        importance: 'core',
        rationale: {
          en: 'Euclidean geometry, scale ratios, golden ratios, perspective projections, and area-volume calculations.',
          am: 'ጂኦሜትሪ፣ ስኬልና የቦታ ስሌት ህንጻዎች ውብና ሚዛናዊ ሆነው እንዲነደፉ መሰረት ናቸው::',
        },
      },
      {
        subjectId: 'physics-g9',
        subjectName: { en: 'Physics', am: 'ፊዚክስ (Physics)' },
        importance: 'supporting',
        rationale: {
          en: 'Natural ventilation aerodynamics, thermal insulation against sun heat, and acoustic reverberation.',
          am: 'የተፈጥሮ ንፋስና የፀሐይ ብርሃን ወደ ህንጻው በደንብ እንዲገባ የፊዚክስ ህጎች ይረዳሉ::',
        },
      },
    ],
    importantTopics: [
      {
        subjectId: 'math-g9',
        topicId: 'math-g9-geometry',
        topicTitle: { en: 'Geometric Proofs & 3D Solids', am: 'ጂኦሜትሪና 3D ቅርጾች' },
        whyItMatters: {
          en: 'Transforms 2D blueprints into structurally stable 3D living envelopes.',
          am: 'ባለ ሁለት ገጽ (2D) ፕላኖችን ወደ ባለ ሶስት ገጽ (3D) ውብ ህንጻዎች ለመቀየር ይረዳል::',
        },
        applicationExample: {
          en: 'Designing climate-adapted school buildings in Awash featuring natural convection cooling domes.',
          am: 'በአዋሽ ሙቀት ውስጥ ያለ አየር ማቀዝቀዣ በራሱ የሚቀዘቅዝ የትምህርት ቤት ህንጻ መንደፍ::',
        },
      },
    ],
    requiredSkills: ['creativity', 'problem_solving', 'logical_reasoning', 'communication'],
    educationFields: [
      {
        degreeName: { en: 'B.Sc. in Architecture', am: 'የአርክቴክቸር ባችለር' },
        programType: 'Professional Architecture Degree',
        ethiopianUniversities: [
          'EiABC (Addis Ababa University)',
          'AASTU',
          'BiT (Bahir Dar University)',
          'Hawassa University',
        ],
        durationYears: 5,
      },
    ],
    possibleRoles: [
      { en: 'Architectural Designer', am: 'የህንጻ አርክቴክት' },
      { en: 'Urban Planner', am: 'የከተማ ፕላን አውጪ' },
      { en: 'Landscape Architect', am: 'የአረንጓዴ መናፈሻ አርክቴክት' },
    ],
    ethiopianOpportunities: {
      en: 'Urban corridor development projects across Addis Ababa, regional capital master-planning bureaus, private design studios.',
      am: 'በአዲስ አበባ የኮሪደር ልማት ፕሮጀክቶች፣ በክልል ከተሞች ፕላን ቢሮዎችና በግል ዲዛይን ስቱዲዮዎች ሰፊ የስራ እድል::',
    },
  },
  {
    careerId: 'data_scientist',
    careerName: {
      en: 'Data Scientist & AI Specialist',
      am: 'የመረጃ ሳይንቲስትና የሰው-ሰራሽ አስተውሎት ባለሙያ',
      om: 'Ogeessa Saayinsii Ragaafi AI',
      ti: 'ሳይንቲስት ዳታን ኤአይን',
    },
    category: 'technology',
    shortDescription: {
      en: 'Uncovers patterns in big data using statistical learning, builds machine learning models, and guides executive decisions.',
      am: 'ትላልቅ መረጃዎችን በሂሳብና በስታቲስቲክስ ስልተ-ቀመሮች ይመረምራል፣ አርቴፊሻል ኢንተለጀንስ ሞዴሎችን ይገነባል::',
    },
    detailedOverview: {
      en: 'Data scientists in Ethiopia harness satellite data, health telemetry, and financial transactions to predict crop failures, detect banking fraud, and build local language NLP models (Amharic, Afaan Oromo, Tigrinya).',
      am: 'የዳታ ሳይንቲስቶች የሳተላይት መረጃን በመተንተን የድርቅ አደጋን ይተነብያሉ፣ የባንክ ማጭበርበሮችን ያጋልጣሉ፣ የአገርኛ ቋንቋዎችን በAI ያስተምራሉ::',
    },
    iconName: 'Database',
    isHighGrowthInEthiopia: true,
    relatedSubjects: [
      {
        subjectId: 'math-g9',
        subjectName: { en: 'Mathematics', am: 'ሂሳብ (Mathematics)' },
        importance: 'core',
        rationale: {
          en: 'Probability, bayesian inference, linear algebra, and multivariate calculus form the absolute foundation of machine learning.',
          am: 'ፕሮባቢሊቲ፣ ስታቲስቲክስና ሊኒየር አልጀብራ የማሽን ለርኒንግ ዋና መሰረቶች ናቸው::',
        },
      },
      {
        subjectId: 'economics-g9',
        subjectName: { en: 'Economics', am: 'ኢኮኖሚክስ (Economics)' },
        importance: 'supporting',
        rationale: {
          en: 'Formulating quantitative hypotheses and interpreting economic causalities in datasets.',
          am: 'የመረጃዎችን ትርጉም በኢኮኖሚና ማህበራዊ አውድ ለመረዳት ይረዳል::',
        },
      },
    ],
    importantTopics: [
      {
        subjectId: 'math-g10',
        topicId: 'math-g10-probability',
        topicTitle: { en: 'Probability & Expected Value', am: 'ፕሮባቢሊቲና ዕድል' },
        whyItMatters: {
          en: 'AI models output probabilities rather than absolute certainties; classifiers rely on Bayes theorem.',
          am: 'የሰው ሰራሽ አስተውሎት ሞዴሎች ውሳኔ የሚሰጡት በፕሮባቢሊቲ ስሌት ላይ ተመስርተው ነው::',
        },
        applicationExample: {
          en: 'Predicting malaria outbreak risks across woredas based on humidity and temperature readings.',
          am: 'የአየር ሁኔታንና እርጥበትን መዝግቦ የወባ ስርጭት ስጋትን በፕሮባቢሊቲ መተንበይ::',
        },
      },
    ],
    requiredSkills: ['data_analysis', 'logical_reasoning', 'problem_solving', 'digital_literacy'],
    educationFields: [
      {
        degreeName: { en: 'B.Sc. in Data Science / Computer Science / Statistics', am: 'የዳታ ሳይንስ ወይም ስታቲስቲክስ ባችለር' },
        programType: 'Undergraduate STEM Degree',
        ethiopianUniversities: [
          'Addis Ababa University',
          'AASTU',
          'ASTU',
          'Bahir Dar University',
        ],
        durationYears: 4,
      },
    ],
    possibleRoles: [
      { en: 'Machine Learning Engineer', am: 'የማሽን ለርኒንግ መሃንዲስ' },
      { en: 'Business Intelligence Analyst', am: 'የንግድ መረጃ ተንታኝ' },
      { en: 'NLP Language Model Researcher', am: 'የቋንቋ ቴክኖሎጂ ተመራማሪ' },
    ],
    ethiopianOpportunities: {
      en: 'Ethiopian Artificial Intelligence Institute (EAII), commercial banks, telecommunications, ride-hailing platforms, agricultural analytics.',
      am: 'በኢትዮጵያ አርቴፊሻል ኢንተለጀንስ ኢንስቲትዩት (EAII)፣ በባንኮች፣ በኢትዮ ቴሌኮምና በቴክኖሎጂ ድርጅቶች ሰፊ እድል::',
    },
  },
  {
    careerId: 'pilot',
    careerName: {
      en: 'Commercial Pilot / Aviation Flight Officer',
      am: 'የአውሮፕላን ፓይለት / የበረራ መኮንን',
      om: 'Paayileetii / Balaliisaa',
      ti: 'ፓይለት / መራሕ ነፋሪት',
    },
    category: 'aviation_transport',
    shortDescription: {
      en: 'Operates commercial passenger and cargo aircraft, navigates global airways, and ensures passenger flight safety.',
      am: 'የተሳፋሪና የጭነት አውሮፕላኖችን ያበራል፣ የአየር ክልልን በቴክኖሎጂ ይመራል፣ የበረራ ደህንነትን ያረጋግጣል::',
    },
    detailedOverview: {
      en: 'Ethiopian Airlines is the largest and most successful airline in Africa. Aviators operate modern fleets (Airbus A350, Boeing 787) connecting Africa with the globe.',
      am: 'የኢትዮጵያ አየር መንገድ በአፍሪካ ግዙፉና ቀዳሚው አየር መንገድ ነው:: ፓይለቶች ዘመናዊ አውሮፕላኖችን በማብረር ሀገራቸውን ከአለም ጋር ያገናኛሉ::',
    },
    iconName: 'Plane',
    isHighGrowthInEthiopia: true,
    relatedSubjects: [
      {
        subjectId: 'physics-g9',
        subjectName: { en: 'Physics', am: 'ፊዚክስ (Physics)' },
        importance: 'core',
        rationale: {
          en: 'Aerodynamics, Bernoulli’s principle of lift, atmospheric pressure, weight and balance, vectors.',
          am: 'የበርኑሊ የነፋስ መሸከም ህግ፣ የአየር ግፊት፣ የክብደት ሚዛንና ቬክተር አውሮፕላን በአየር ላይ እንዲበር መሰረቶች ናቸው::',
        },
      },
      {
        subjectId: 'math-g9',
        subjectName: { en: 'Mathematics', am: 'ሂሳብ (Mathematics)' },
        importance: 'core',
        rationale: {
          en: 'Navigation vectors, fuel burn rates, wind drift trigonometry, descent gradient geometry.',
          am: 'የነዳጅ ፍጆታ ስሌት፣ የንፋስ አቅጣጫ ትሪጎኖሜትሪና የበረራ ማረፊያ ማዕዘንን ለማስላት ያገለግላል::',
        },
      },
      {
        subjectId: 'english-g9',
        subjectName: { en: 'English', am: 'እንግሊዝኛ (English)' },
        importance: 'core',
        rationale: {
          en: 'Universal language of International Civil Aviation Organization (ICAO) air traffic communications.',
          am: 'ዓለም አቀፍ የአቪዬሽን ግንኙነትና የአየር ትራፊክ ቁጥጥር የሚካሄደው በእንግሊዝኛ ቋንቋ ብቻ ነው::',
        },
      },
    ],
    importantTopics: [
      {
        subjectId: 'physics-g9',
        topicId: 'phys-g9-vectors-navigation',
        topicTitle: { en: 'Vectors & Relative Velocity', am: 'ቬክተርና አንጻራዊ ፍጥነት' },
        whyItMatters: {
          en: 'An aircraft’s true ground track is the vector sum of heading airspeed and wind velocity.',
          am: 'የአውሮፕላን የመሬት ላይ ፍጥነትና አቅጣጫ የሚወሰነው በአውሮፕላኑና በንፋሱ ቬክተር ድምር ነው::',
        },
        applicationExample: {
          en: 'Correcting for a 40-knot crosswind when landing on Runway 07R at Bole International Airport.',
          am: 'በቦሌ ዓለም አቀፍ አውሮፕላን ማረፊያ በከባድ ንፋስ ወቅት አውሮፕላን በሰላም ለማሳረፍ ቬክተርን ማስተካከል::',
        },
      },
    ],
    requiredSkills: ['problem_solving', 'critical_thinking', 'communication', 'logical_reasoning'],
    educationFields: [
      {
        degreeName: { en: 'Commercial Pilot License (CPL) / B.Sc. in Aviation Sciences', am: 'የንግድ አውሮፕላን ፓይለት ፈቃድ / አቪዬሽን ሳይንስ' },
        programType: 'Professional Flight Training Academy',
        ethiopianUniversities: [
          'Ethiopian Airlines Aviation University (Bole, Addis Ababa)',
        ],
        durationYears: 2,
      },
    ],
    possibleRoles: [
      { en: 'First Officer (Co-pilot)', am: 'ረዳት ፓይለት' },
      { en: 'Captain (Pilot-in-Command)', am: 'ካፒቴን / ዋና ፓይለት' },
      { en: 'Flight Operations Instructor', am: 'የበረራ አስተማሪ' },
    ],
    ethiopianOpportunities: {
      en: 'Ethiopian Airlines Group, regional African routes, cargo and logistics expansion, charter operators.',
      am: 'በኢትዮጵያ አየር መንገድ ግሩፕ፣ በካርጎ ጭነት አገልግሎትና በአፍሪካ በረራዎች ላይ ሰፊ እድል::',
    },
  },
  {
    careerId: 'environmental_scientist',
    careerName: {
      en: 'Environmental Scientist / Climate Specialist',
      am: 'የአካባቢ ሳይንቲስት / የአየር ንብረት ባለሙያ',
      om: 'Saayintistii Naannoo',
      ti: 'ሳይንቲስት ከባቢ ኣየር',
    },
    category: 'agriculture_environment',
    shortDescription: {
      en: 'Studies ecosystems, monitors environmental contamination, manages watersheds, and champions reforestation.',
      am: 'ስነ-ምህዳርን ያጠናል፣ የውሃና አየር ብክለትን ይመረምራል፣ የተፈጥሮ ሃብትንና ደንን ይጠብቃል::',
    },
    detailedOverview: {
      en: 'Environmental scientists monitor the Green Legacy reforestation initiative, assess wetland health in Lake Tana and the Rift Valley lakes, and safeguard biodiversity in Simien and Bale mountains.',
      am: 'የአካባቢ ሳይንቲስቶች የአረንጓዴ አሻራ መርሃ-ግብርን ውጤታማነት ያጠናሉ፣ ጣና ሃይቅንና የስምሪት ደኖችን ከብክለትና ከእንቦጭ አረም ይጠብቃሉ::',
    },
    iconName: 'Leaf',
    isHighGrowthInEthiopia: true,
    relatedSubjects: [
      {
        subjectId: 'biology-g9',
        subjectName: { en: 'Biology', am: 'ስነ-ህይወት (Biology)' },
        importance: 'core',
        rationale: {
          en: 'Ecology, food webs, endemic biodiversity conservation, and ecosystem resilience.',
          am: 'ስለ ስነ-ምህዳር፣ የምግብ ሰንሰለትና የዱር አራዊትና እፅዋት ጥበቃ ለመረዳት ወሳኝ ነው::',
        },
      },
      {
        subjectId: 'chemistry-g9',
        subjectName: { en: 'Chemistry', am: 'ኬሚስትሪ (Chemistry)' },
        importance: 'core',
        rationale: {
          en: 'Water chemistry, greenhouse gas concentrations, heavy metal toxicology, and soil nutrient cycles.',
          am: 'የውሃ ብክለት ምርመራ፣ የካርቦን ልቀትና የከባባድ ማዕድናት መርዝነትን ለማጥናት ያገለግላል::',
        },
      },
      {
        subjectId: 'physics-g9',
        subjectName: { en: 'Physics', am: 'ፊዚክስ (Physics)' },
        importance: 'supporting',
        rationale: {
          en: 'Solar irradiance thermodynamics, hydrology flow dynamics, and atmospheric circulation.',
          am: 'የፀሐይ ሙቀትና የዝናብ ዑደት በከባቢ አየር ላይ ያለውን ለውጥ ለመለካት ይረዳል::',
        },
      },
    ],
    importantTopics: [
      {
        subjectId: 'biology-g9',
        topicId: 'bio-g9-ecology',
        topicTitle: { en: 'Ecosystems & Biogeochemical Cycles', am: 'ስነ-ምህዳርና የተፈጥሮ ንጥረ-ነገሮች ዑደት' },
        whyItMatters: {
          en: 'The carbon and nitrogen cycles regulate biosphere fertility; human disruptions induce climate volatility.',
          am: 'የካርቦንና ናይትሮጅን ዑደት ሚዛን ሲዛባ ድርቅና የአየር ንብረት መዛባት ይከሰታል::',
        },
        applicationExample: {
          en: 'Restoring native Acacia and Hagenia abyssinica (Kosso) forests to recharge groundwater aquifers in Tigray and Amhara.',
          am: 'የአፈር መሸርሸርን ለመከላከልና የከርሰ ምድር ውሃን ለመጠበቅ የሀገር በቀል ዛፎችን መትከል::',
        },
      },
    ],
    requiredSkills: ['scientific_reasoning', 'research', 'critical_thinking', 'collaboration'],
    educationFields: [
      {
        degreeName: { en: 'B.Sc. in Environmental Sciences / Natural Resource Management', am: 'የአካባቢ ጥበቃና የተፈጥሮ ሀብት አያያዝ ባችለር' },
        programType: 'Undergraduate Environmental Degree',
        ethiopianUniversities: [
          'Addis Ababa University',
          'Hawassa University (Wondo Genet College of Forestry)',
          'Bahir Dar University',
          'Mekelle University',
          'Arba Minch University',
        ],
        durationYears: 4,
      },
    ],
    possibleRoles: [
      { en: 'Environmental Impact Assessor', am: 'የአካባቢ ተጽዕኖ ገምጋሚ' },
      { en: 'Watershed & River Basin Manager', am: 'የተፋሰስና የውሃ ሃብት ስራ-አስኪያጅ' },
      { en: 'Climate Policy Specialist', am: 'የአየር ንብረት ፖሊሲ ባለሙያ' },
    ],
    ethiopianOpportunities: {
      en: 'Environmental Protection Authority (EPA), Ministry of Water and Energy, Ethiopian Forestry Development, UNEP liaison office.',
      am: 'በአካባቢ ጥበቃ ባለስልጣን (EPA)፣ በደን ልማት ኢንስቲትዩትና በአለም አቀፍ የአካባቢ ተቋማት ውስጥ ሰፊ እድል::',
    },
  },
  {
    careerId: 'entrepreneur',
    careerName: {
      en: 'Entrepreneur / Business Innovator',
      am: 'ስራ ፈጣሪ / የቢዝነስ ፈጣሪ',
      om: 'Abbaa Qabeenyaa / Hojii Uumaa',
      ti: 'ፈጣሪ ስራሕ / ነጋዳይ',
    },
    category: 'business_economics',
    shortDescription: {
      en: 'Identifies unmet market needs, organizes capital and teams, takes calculated risks, and scales commercial ventures.',
      am: 'ያልተፈቱ ችግሮችን ለይቶ አዳዲስ የንግድና አገልግሎት ድርጅቶችን ያቋቁማል፣ የስራ እድል ይፈጥራል::',
    },
    detailedOverview: {
      en: 'Entrepreneurs drive economic transformation in Ethiopia by creating startups across agro-processing, digital services, manufacturing, clean energy, and retail distribution.',
      am: 'ስራ ፈጣሪዎች በግብርና ምርቶች እሴት በመጨመር፣ በዲጂታል ንግድና በፋብሪካዎች የስራ እድል በመፍጠር የሀገርን ኢኮኖሚ ያነቃቃሉ::',
    },
    iconName: 'Briefcase',
    isHighGrowthInEthiopia: true,
    relatedSubjects: [
      {
        subjectId: 'economics-g9',
        subjectName: { en: 'Economics', am: 'ኢኮኖሚክስ (Economics)' },
        importance: 'core',
        rationale: {
          en: 'Market pricing, supply and demand dynamics, competitive advantage, and consumer behavior.',
          am: 'የገበያ ዋጋን፣ የአቅርቦትና ፍላጎት ህግንና የተፎካካሪዎችን አሰራር ለመረዳት ወሳኝ ነው::',
        },
      },
      {
        subjectId: 'math-g9',
        subjectName: { en: 'Mathematics', am: 'ሂሳብ (Mathematics)' },
        importance: 'core',
        rationale: {
          en: 'Financial accounting calculations, profit margin percentages, break-even analysis, and ROI.',
          am: 'የትርፍ ህዳግ፣ የኪሳራና ትርፍ መለያያ ነጥብ (Break-even) እና የካፒታል ስሌቶችን ለማስላት ይጠቅማል::',
        },
      },
    ],
    importantTopics: [
      {
        subjectId: 'economics-g9',
        topicId: 'econ-g9-supply-demand',
        topicTitle: { en: 'Supply, Demand & Price Equilibrium', am: 'አቅርቦት፣ ፍላጎትና የዋጋ ሚዛን' },
        whyItMatters: {
          en: 'A successful business launches where customer demand significantly exceeds market supply.',
          am: 'ስኬታማ ንግድ የሚጀመረው የህዝብ ፍላጎት በገበያው ውስጥ ካለው አቅርቦት በላይ በሆነበት መስክ ነው::',
        },
        applicationExample: {
          en: 'Founding an organic honey packaging brand sourcing directly from Tigray and Gojjam beekeepers.',
          am: 'ከጎጃምና ትግራይ ንብ አናቢዎች ጥራት ያለው ማር አምጥቶ በዘመናዊ መንገድ አሽጎ ለገበያ ማቅረብ::',
        },
      },
    ],
    requiredSkills: ['problem_solving', 'creativity', 'communication', 'financial_literacy', 'critical_thinking'],
    educationFields: [
      {
        degreeName: { en: 'B.A. in Management / Entrepreneurship / Marketing', am: 'የማኔጅመንት ወይም የስራ ፈጠራ ባችለር' },
        programType: 'Undergraduate Business Degree',
        ethiopianUniversities: [
          'Addis Ababa University (School of Commerce)',
          'Unity University',
          'Jimma University',
          'Hawassa University',
        ],
        durationYears: 4,
      },
    ],
    possibleRoles: [
      { en: 'Startup Founder / CEO', am: 'የድርጅት መስራችና ዋና ስራ አስኪያጅ' },
      { en: 'Agribusiness Enterprise Lead', am: 'የግብርና ንግድ ስራ-አስኪያጅ' },
      { en: 'E-commerce Operator', am: 'የዲጂታል ንግድ ስራ ፈጣሪ' },
    ],
    ethiopianOpportunities: {
      en: 'Vibrant startup ecosystem, Ministry of Innovation and Technology (MInT) incubation grants, industrial parks, youth revolving funds.',
      am: 'በኢኖቬሽንና ቴክኖሎጂ ሚኒስቴር (MInT)፣ በስራ ፈጠራ ኮሚሽንና በግል የንግድ ዘርፍ ሰፊ እድል::',
    },
  },
];

export const CROSS_SUBJECT_CONNECTIONS: CrossSubjectConnection[] = [
  {
    connectionId: 'math_physics_engineering',
    primarySubject: 'Mathematics',
    connectedSubject: 'Physics',
    combinedField: {
      en: 'Engineering & Structural Robotics',
      am: 'ምህንድስናና ሮቦቲክስ (Engineering & Robotics)',
      om: 'Injineriingii fi Roobootiksii',
      ti: 'ምህንድስናን ሮቦቲክስን',
    },
    synergyExplanation: {
      en: 'Mathematics provides the abstract formulas and equations, while Physics provides the physical laws of nature (forces, gravity, energy) that bring those formulas to reality.',
      am: 'ሂሳብ ቀመሮችንና ስሌቶችን ሲያቀርብ፣ ፊዚክስ ደግሞ በተፈጥሮ ውስጥ ያሉ የሀይል፣ የስበትና የጉልበት ህጎችን ያብራራል፤ ሁለቱ ሲቀናጁ ምህንድስና ይፈጠራል::',
    },
    realWorldExample: {
      en: 'Designing hydro-turbines for the Grand Ethiopian Renaissance Dam (GERD): Calculus optimizes water flow rates while Fluid Mechanics determines turbine blade torque.',
      am: 'ለህዳሴው ግድብ ተርባይኖችን መንደፍ፡ ካልኩለስ የውሃውን ፍጥነት ሲያሰላ የፊዚክስ ህግጋት የተርባይኑን የመዞር ጉልበት ይወስናሉ::',
    },
    ethiopianApplication: {
      en: 'Building railway tracks for the Ethio-Djibouti standard gauge electrified railway and Addis Ababa light rail transit.',
      am: 'የኢትዮ-ጅቡቲ የባቡር መስመርና የአዲስ አበባ ፈጣን ባቡር ሀዲድ ዲዛይን ስሌቶች::',
    },
    relatedCareers: ['civil_engineer', 'electrical_engineer', 'software_engineer', 'architect'],
  },
  {
    connectionId: 'bio_chem_medicine',
    primarySubject: 'Biology',
    connectedSubject: 'Chemistry',
    combinedField: {
      en: 'Biochemistry, Medicine & Pharmacology',
      am: 'ባዮኬሚስትሪ፣ ህክምናና መድሃኒት ቅመማ (Biochemistry & Medicine)',
      om: 'Baayookeemistiriifi Yaala',
      ti: 'ባዮኬሚስትሪን ሕክምናን',
    },
    synergyExplanation: {
      en: 'Biology describes living organisms and organs, while Chemistry explains the molecular interactions, acids, bases, and compounds that sustain those living systems.',
      am: 'ስነ-ህይወት (Biology) ስለ ህያዋን ፍጥረታት አካላት ሲያስተምር፣ ኬሚስትሪ (Chemistry) በነዚህ ህዋሳት ውስጥ የሚካሄዱ ሞለኪውላዊ ምላሾችን ያብራራል::',
    },
    realWorldExample: {
      en: 'Antimalarial drug Artemisinin: Biology studies the Plasmodium parasite life cycle while Chemistry isolates the active sesquiterpene lactone molecule to destroy it.',
      am: 'የወባ መድሃኒት ቅመማ፡ ባዮሎጂ የወባ ተህዋሲያንን ዑደት ሲያጠና፣ ኬሚስትሪ ተህዋሱን የሚገድለውን ኬሚካላዊ ቅመም ያዘጋጃል::',
    },
    ethiopianApplication: {
      en: 'Testing natural endemic medicinal plants at the Ethiopian Public Health Institute (EPHI) and local drug formulation at Kilinto Industrial Park.',
      am: 'በኢትዮጵያ የህብረተሰብ ጤና ኢንስቲትዩት (EPHI) የሀገር በቀል እፅዋትን ለህክምና መመርመር::',
    },
    relatedCareers: ['doctor', 'pharmacist', 'agricultural_scientist', 'environmental_scientist'],
  },
  {
    connectionId: 'math_econ_fintech',
    primarySubject: 'Mathematics',
    connectedSubject: 'Economics',
    combinedField: {
      en: 'Econometrics, Quantitative Finance & FinTech',
      am: 'ኢኮኖሜትሪክስና ዲጂታል ፋይናንስ (Econometrics & FinTech)',
      om: 'Ikonomeetiriiksiifi Faayinaansii',
      ti: 'ኢኮኖሜትሪክስን ፋይናንስን',
    },
    synergyExplanation: {
      en: 'Economics studies how societies allocate scarce resources, and Mathematics creates rigorous quantitative models to forecast demand, set prices, and measure risk.',
      am: 'ኢኮኖሚክስ ውስን ሃብትን በአግባቡ ማስተዳደርን ሲያስተምር፣ ሂሳብ ደግሞ የዋጋ አዝማሚያዎችንና የገንዘብ ስጋቶችን በቁጥር ለመተንበይ ይረዳል::',
    },
    realWorldExample: {
      en: 'Credit scoring algorithms in Telebirr Sanduq micro-loans: Statistical linear regressions evaluate repayment probability based on transaction histories.',
      am: 'በቴሌብር የብድር አገልግሎት ውስጥ አንድ ሰው ብድር መክፈል መቻሉን የሚያሰላ የሂሳብ ስልተ-ቀመር::',
    },
    ethiopianApplication: {
      en: 'Forecasting inflation trends at the National Bank of Ethiopia and calculating currency exchange clearing rates.',
      am: 'በኢትዮጵያ ብሔራዊ ባንክ የዋጋ ግሽበትን በስታቲስቲክስ መተንበይ::',
    },
    relatedCareers: ['economist', 'data_scientist', 'entrepreneur', 'software_engineer'],
  },
  {
    connectionId: 'bio_chem_agri_food',
    primarySubject: 'Biology',
    connectedSubject: 'Chemistry',
    combinedField: {
      en: 'Agricultural Science & Food Security',
      am: 'የግብርና ሳይንስና የምግብ ዋስትና (Agricultural Science)',
      om: 'Saayinsii Qonnaafi Nyaataa',
      ti: 'ሳይንስ ሕርሻን ምግቢ ውሕስነትን',
    },
    synergyExplanation: {
      en: 'Biology guides crop breeding and seed genetics, while Chemistry formulates fertilizers and balances soil pH for maximum photosynthetic yield.',
      am: 'ባዮሎጂ ምርጥ የሰብል ዝርያዎችን ለማዳቀል ሲረዳ፣ ኬሚስትሪ ደግሞ ተገቢውን ማዳበሪያና የአፈር ለምነት ለመጠበቅ ያገለግላል::',
    },
    realWorldExample: {
      en: 'Addressing soil acidity in western Oromia and Amhara: Chemistry determines lime ($CaCO_3$) dosage while Biology monitors beneficial root rhizobia bacteria.',
      am: 'የምዕራብ ኢትዮጵያን አሲዳማ አፈር በኖራ (Limestone) በማከም የጤፍና የበቆሎ ምርትን በእጥፍ ማሳደግ::',
    },
    ethiopianApplication: {
      en: 'Large-scale summer wheat irrigated farming in Awash, Omo, and Somali lowlands.',
      am: 'በአዋሽና ኦሞ ቆላማ ተፋሰሶች በበጋ መስኖ የሚካሄደው የስንዴ ምርት ሳይንሳዊ ክትትል::',
    },
    relatedCareers: ['agricultural_scientist', 'environmental_scientist', 'entrepreneur'],
  },
  {
    connectionId: 'physics_math_cs_ai',
    primarySubject: 'Physics',
    connectedSubject: 'Mathematics',
    combinedField: {
      en: 'Artificial Intelligence, Space & Satellite Technology',
      am: 'የህዋ ሳይንስ፣ ሳተላይትና AI (Space Tech & AI)',
      om: 'Saayinsii Hawaafi AI',
      ti: 'ሳይንስ ጠፈርን AIን',
    },
    synergyExplanation: {
      en: 'Physics models orbital mechanics and signal propagation; Mathematics provides the linear algebra; Computer Science executes the machine intelligence.',
      am: 'ፊዚክስ የሳተላይት ምህዋርንና የሞገድ ስርጭትን ሲያሰላ፣ ሂሳብና ኮምፒውተር ደግሞ ምስሎችን በAI ለመተርጎም ያገለግላሉ::',
    },
    realWorldExample: {
      en: 'Ethiopia’s ETRSS-1 remote sensing satellite: Physics tracks its 600km orbital path while AI algorithms process multispectral imagery for drought prediction.',
      am: 'የኢትዮጵያ የመጀመሪያዋ ሳተላይት (ETRSS-1)፡ ምህዋሯ በፊዚክስ የሚሰላ ሲሆን የሚላኩት ምስሎች በAI ተተንትነው የድርቅ አደጋን ያሳውቃሉ::',
    },
    ethiopianApplication: {
      en: 'Ethiopian Space Science and Geospatial Institute (SSGI) monitoring forest cover and flood zones along the Awash basin.',
      am: 'በኢትዮጵያ የህዋ ሳይንስና ጂኦስፓሻል ኢንስቲትዩት (SSGI) የደንና የውሃ ሃብትን ከህዋ ላይ መቆጣጠር::',
    },
    relatedCareers: ['software_engineer', 'data_scientist', 'pilot', 'electrical_engineer'],
  },
];

export const REAL_WORLD_PROJECTS: RealWorldProjectIdea[] = [
  {
    projectId: 'proj_math_electricity_bill',
    title: {
      en: 'Household Electrical Energy & Tariff Audit',
      am: 'የቤተሰብ የኤሌክትሪክ ፍጆታና የክፍያ ስሌት ኦዲት',
      om: 'Herrega Baasii Elektiriikii Manaa',
      ti: 'ናይ ገዛ ውሽጢ መብራህቲ ክፍሊት ስሌት',
    },
    gradeLevel: 9,
    subjectId: 'math-g9',
    topicId: 'math-g9-linear-equations',
    description: {
      en: 'Audit all electrical appliances in your home, calculate daily kilowatt-hours (kWh), apply Ethiopian Electric Utility (EEU) stepped tariffs, and design an energy conservation plan.',
      am: 'በቤትዎ ያሉትን የኤሌክትሪክ እቃዎች (አምፑል፣ ምጣድ፣ ፍሪጅ) ዋት መዝግቦ የቀንና የወር ፍጆታን በኪሎዋት-ሰዓት ማስላት፣ በኢትዮጵያ ኤሌክትሪክ አገልግሎት የታሪፍ ደረጃዎች መሰረት ሂሳቡን መስራትና ወጪን መቀነሻ ዘዴ ማዘጋጀት::',
    },
    materialsNeeded: [
      { en: 'Wattage labels on appliances (or estimates: LED bulb = 10W, Injera Mitad = 3500W, TV = 60W)', am: 'የእቃዎች ዋት (LED አምፑል = 10W፣ የኤሌክትሪክ ምጣድ = 3500W፣ ቴሌቪዥን = 60W)' },
      { en: 'Electricity billing meter or recent paper receipt from EEU', am: 'የኤሌክትሪክ ቆጣሪ ወይም የቅርብ ጊዜ የኤሌክትሪክ ደረሰኝ' },
      { en: 'Notebook or spreadsheet', am: 'ማስታወሻ ደብተር ወይም የሂሳብ ሰንጠረዥ' },
    ],
    expectedOutcome: {
      en: 'A completed mathematical consumption model identifying that baking with Injera Mitad accounts for ~60% of household power, with actionable suggestions to save 15-25% monthly.',
      am: 'የእንጀራ ምጣድ ከቤቱ አጠቃላይ ፍጆታ ከ60% በላይ እንደሚወስድ በተጨባጭ በሂሳብ ማረጋገጥና ወርሃዊ ወጪን ከ15-25% መቀነስ የሚያስችል እቅድ ማውጣት::',
    },
    skillsGained: ['problem_solving', 'financial_literacy', 'data_analysis'],
    ethiopianContextFocus: {
      en: 'Based on official Ethiopian Electric Utility (EEU) domestic tariff block rates (0-50 kWh, 51-100 kWh, etc.).',
      am: 'በኢትዮጵያ ኤሌክትሪክ አገልግሎት ትክክለኛ የተከፋፈሉ የታሪፍ ህጎች ላይ የተመሰረተ::',
    },
    difficulty: 'beginner',
  },
  {
    projectId: 'proj_phys_solar_sizing',
    title: {
      en: 'Design an Off-Grid Solar Power System for a Rural Clinic',
      am: 'ለገጠር ጤና ኬላ የፀሐይ ኃይል ማመንጫ ሲስተም መንደፍ',
      om: 'Diizaayinii Soolaarii Klinka Baadiyyaa',
      ti: 'ዲዛይን ሶላር ኃይሊ ንናይ ገጠር ክሊኒክ',
    },
    gradeLevel: 10,
    subjectId: 'physics-g10',
    topicId: 'phys-g10-electricity',
    description: {
      en: 'Calculate the total daily load for a rural clinic (vaccine refrigerator, 4 LED examination lights, microscope, and smartphone charging), determine solar panel wattage, battery capacity (Ah), and charge controller rating.',
      am: 'የመብራት አገልግሎት በሌለበት የገጠር ጤና ኬላ ውስጥ ለክትባት ማቀዝቀዣ፣ ለ4 አምፑሎች፣ ለማይክሮስኮፕ የሚያስፈልገውን የኤሌክትሪክ ኃይል በማስላት የሚመጥን የፀሐይ ፓነልና ባትሪ መጠንን መወሰን::',
    },
    materialsNeeded: [
      { en: 'Solar sizing worksheet', am: 'የሶላር ስሌት ፎርሙላ ሰንጠረዥ' },
      { en: 'Ethiopian average daily solar insolation data (~5.5 peak sun hours)', am: 'የኢትዮጵያ አማካይ የፀሐይ ብርሃን ሰዓት መረጃ (5.5 ሰዓት በቀን)' },
      { en: 'Calculator', am: 'ካልኩሌተር' },
    ],
    expectedOutcome: {
      en: 'A complete technical design specifying a 300W photovoltaic array and 150Ah deep-cycle solar battery ensuring 2 days of autonomy during rainy seasons.',
      am: 'በክረምት ወቅት እንኳን ለሁለት ቀናት ሳይቋረጥ ክትባቶችን ማቀዝቀዝ የሚያስችል የ300 ዋት ሶላርና 150Ah ባትሪ የቴክኒክ ዲዛይን ሰነድ ማዘጋጀት::',
    },
    skillsGained: ['scientific_reasoning', 'problem_solving', 'critical_thinking'],
    ethiopianContextFocus: {
      en: 'Directly supports rural healthcare electrification in off-grid communities across Afar, Somali, and Benishangul-Gumuz.',
      am: 'በአፋር፣ ሶማሌና ቤኒሻንጉል ጉሙዝ ያሉ የገጠር ጤና ጣቢያዎችን የኤሌክትሪክ ችግር ለመፍታት የሚያግዝ ተግባራዊ ፕሮጀክት::',
    },
    difficulty: 'intermediate',
  },
  {
    projectId: 'proj_chem_soil_ph',
    title: {
      en: 'Soil Acidity & Natural Agricultural Lime Testing',
      am: 'የአፈር አሲዳማነት ምርመራና የተፈጥሮ ኖራ ሕክምና',
      om: 'Qorannoo Asiidummaa Biyyoofi Nooraa',
      ti: 'ምርመራ ኣሲዳማነት ሓመድን ሕክምና ኖራን',
    },
    gradeLevel: 10,
    subjectId: 'chemistry-g10',
    topicId: 'chem-g10-acids-bases',
    description: {
      en: 'Collect soil samples from different areas (school yard, farm, garden), test acidity using natural red cabbage anthocyanin indicator, and demonstrate neutralization with agricultural limestone powder.',
      am: 'ከተለያዩ ቦታዎች (ከትምህርት ቤት ግቢ፣ ከእርሻ፣ ከጓሮ) የአፈር ናሙና በመውሰድ በተፈጥሯዊ የቀይ ጎመን ጭማቂ አመልካች አማካኝነት አሲዳማነቱን መለካትና በኖራ በማከም ገለልተኛ (Neutral) ማድረግ::',
    },
    materialsNeeded: [
      { en: 'Red cabbage boiled water extract (natural pH indicator: Red = Acid, Blue/Green = Neutral/Base)', am: 'የቀይ ጎመን የተቀቀለ ውሃ (ተፈጥሯዊ የፒኤች አመልካች)' },
      { en: 'Soil samples mixed with distilled/clean water', am: 'በውሃ የተበጠበጡ የአፈር ናሙናዎች' },
      { en: 'Agricultural lime ($CaCO_3$) or wood ash', am: 'የግብርና ኖራ ወይም የከሰል/የእንጨት አመድ' },
    ],
    expectedOutcome: {
      en: 'Understanding how acidic soil locks out essential plant phosphorus nutrients, and how neutral pH (6.0-7.0) restores soil microbial activity and enhances crop yields.',
      am: 'አሲዳማ አፈር የሰብልን ምግብ እንደሚከለክልና በኖራ በማከም ጤፍና ስንዴ በጥሩ ሁኔታ እንዲያድጉ ማድረግ እንደሚቻል በተግባር ማረጋገጥ::',
    },
    skillsGained: ['scientific_reasoning', 'research', 'critical_thinking'],
    ethiopianContextFocus: {
      en: 'Addresses real soil acidity affecting over 43% of cultivated highlands in Ethiopia.',
      am: 'በኢትዮጵያ ከ43% በላይ የሚሆነውን የደጋ እርሻ መሬት የሚያጠቃውን የአፈር አሲዳማነት ለመቅረፍ የሚጠቅም ሳይንሳዊ ዘዴ::',
    },
    difficulty: 'intermediate',
  },
  {
    projectId: 'proj_bio_nutritional_teff',
    title: {
      en: 'Community Nutritional Profiling: Teff, Chickpea & Enset',
      am: 'የማህበረሰብ የተመጣጠነ ምግብ ጥናት፡ ጤፍ፣ ሽምብራና እንሰት',
      om: 'Qorannoo Soorata Madaalawaa',
      ti: 'መጽናዕቲ መኣዛዊ ምግቢ፡ ጣፍ፣ ዓተርን እንሰትን',
    },
    gradeLevel: 9,
    subjectId: 'biology-g9',
    topicId: 'bio-g9-digestive-nutrition',
    description: {
      en: 'Analyze the macronutrient and micronutrient composition of indigenous Ethiopian staple foods (iron and gluten-free protein in Teff, carbohydrates in Kocho/Bullaa, plant protein in Shiro/Chickpeas), and design a balanced school meal.',
      am: 'የሀገር በቀል ምግቦችን (የጤፍ ብረትና ፕሮቲን፣ የቆጮ/ቡላ ካርቦሃይድሬት፣ የሽሮ አሚኖ አሲድ) ንጥረ-ነገር በመተንተን የተመጣጠነ የትምህርት ቤት የተማሪዎች ምገባ እቅድ ማዘጋጀት::',
    },
    materialsNeeded: [
      { en: 'Nutritional food tables of Ethiopian traditional foods (EPHI / FAO data)', am: 'የኢትዮጵያ ምግቦች ንጥረ-ነገር ሰንጠረዥ' },
      { en: 'Food diary record of typical high school student meals for 3 days', am: 'የ3 ቀናት የተለመደ የተማሪዎች የምግብ ማስታወሻ' },
    ],
    expectedOutcome: {
      en: 'Proving mathematically and biologically that combining Injera with Shiro and Gomen delivers a complete amino-acid protein and micronutrient profile superior to processed fast foods.',
      am: 'እንጀራ ከሽሮና ከጎመን ጋር ሲጣመር የተሟላ ፕሮቲንና ቫይታሚን እንደሚያስገኝ በሳይንሳዊ መረጃ ማረጋገጥ::',
    },
    skillsGained: ['data_analysis', 'scientific_reasoning', 'communication'],
    ethiopianContextFocus: {
      en: 'Combatting childhood anemia and malnutrition utilizing affordable, culturally rich Ethiopian agricultural crops.',
      am: 'በአነስተኛ ወጪ በሀገር በቀል ሰብሎች የደም ማነስንና የተመጣጠነ ምግብ እጥረትን ለመከላከል የሚረዳ::',
    },
    difficulty: 'beginner',
  },
  {
    projectId: 'proj_econ_agribusiness_budget',
    title: {
      en: 'Agribusiness Enterprise Break-Even & Cash Flow Analysis',
      am: 'የአነስተኛ ግብርና ንግድ የትርፍና ኪሳራ (Break-Even) በጀት',
      om: 'Herrega Daldala Qonnaa Baasii fi Bu’aa',
      ti: 'ናይ ንኡስ ሕርሻ ንግዲ በጀት ትርፍን ኪሳራን',
    },
    gradeLevel: 11,
    subjectId: 'economics-g11',
    topicId: 'econ-g11-business-revenue',
    description: {
      en: 'Formulate a business plan for an Ethiopian honey, coffee roasting, or poultry micro-enterprise. Calculate fixed costs, variable costs, unit selling price, and the exact break-even production quantity.',
      am: 'የማር፣ የቡና ማሸጊያ ወይም የዶሮ እርባታ ንግድ እቅድ በማዘጋጀት ቋሚ ወጪዎችን፣ ተለዋዋጭ ወጪዎችንና የመሸጫ ዋጋን በመወሰን ድርጅቱ ትርፍ ማግኘት የሚጀምርበትን ትክክለኛ የምርት መጠን ማስላት::',
    },
    materialsNeeded: [
      { en: 'Local market price survey data (feed, packaging, transport costs)', am: 'የአካባቢ ገበያ የግብአትና የሽያጭ ዋጋ መረጃ' },
      { en: 'Break-even formulas: $Q = \\frac{Fixed\\ Costs}{Price - Variable\\ Cost}$', am: 'የሂሳብና የኢኮኖሚክስ ቀመሮች' },
    ],
    expectedOutcome: {
      en: 'A professional 2-page investment pitch proving how an initial loan of 50,000 ETB can break even within 7 months while generating 18% net profit margin.',
      am: 'በ50,000 ብር መነሻ ካፒታል የተጀመረ ስራ በ7 ወራት ውስጥ ወጪውን ሸፍኖ ወደ ትርፍ እንዴት እንደሚሸጋገር የሚያሳይ የተሟላ የቢዝነስ እቅድ::',
    },
    skillsGained: ['financial_literacy', 'problem_solving', 'critical_thinking'],
    ethiopianContextFocus: {
      en: 'Aligned with youth entrepreneurship loan programs through the Commercial Bank of Ethiopia (CBE) and regional microfinance institutions.',
      am: 'ከኢትዮጵያ ንግድ ባንክና አነስተኛ ብድር ተቋማት የወጣቶች ስራ ፈጠራ ድጋፍ ጋር የሚጣጣም::',
    },
    difficulty: 'intermediate',
  },
];
