import {
  StudentGoalProfile,
  CareerProfile,
  TopicRealLifeConnection,
  CrossSubjectConnection,
  RealWorldProjectIdea,
  SkillProfile,
  CareerAlignmentGuidance,
  AlignmentLevel,
  PersonalizedPurposeCard,
} from '../types/careerLearning';
import {
  CAREER_PROFILES,
  CORE_SKILL_PROFILES,
  CROSS_SUBJECT_CONNECTIONS,
  REAL_WORLD_PROJECTS,
} from '../data/careerLearningData';

class CareerConnectionEngine {
  private static instance: CareerConnectionEngine;

  private constructor() {}

  public static getInstance(): CareerConnectionEngine {
    if (!CareerConnectionEngine.instance) {
      CareerConnectionEngine.instance = new CareerConnectionEngine();
    }
    return CareerConnectionEngine.instance;
  }

  /**
   * Retrieves all available career profiles
   */
  public getAllCareers(): CareerProfile[] {
    return CAREER_PROFILES;
  }

  /**
   * Finds a specific career by ID
   */
  public getCareerById(careerId: string): CareerProfile | undefined {
    return CAREER_PROFILES.find((c) => c.careerId === careerId);
  }

  /**
   * Retrieves all core 21st-century skill profiles
   */
  public getAllSkills(): SkillProfile[] {
    return CORE_SKILL_PROFILES;
  }

  /**
   * Retrieves cross-subject connections optionally filtered by primary subject
   */
  public getCrossSubjectConnections(subjectName?: string): CrossSubjectConnection[] {
    if (!subjectName) return CROSS_SUBJECT_CONNECTIONS;
    const clean = subjectName.toLowerCase();
    return CROSS_SUBJECT_CONNECTIONS.filter(
      (c) =>
        c.primarySubject.toLowerCase().includes(clean) ||
        c.connectedSubject.toLowerCase().includes(clean)
    );
  }

  /**
   * Retrieves all real-world project ideas filtered by grade or career
   */
  public getProjects(grade?: number, careerId?: string): RealWorldProjectIdea[] {
    let list = [...REAL_WORLD_PROJECTS];
    if (grade) {
      list = list.filter((p) => p.gradeLevel === grade);
    }
    if (careerId) {
      const career = this.getCareerById(careerId);
      if (career) {
        const coreSubjectIds = career.relatedSubjects.map((s) => s.subjectId);
        list = list.filter((p) => coreSubjectIds.includes(p.subjectId) || list.length < 3);
      }
    }
    return list;
  }

  /**
   * Generates a "Real-Life Connection" package for any topic.
   * Connects Ethiopian high school curriculum topics to real world, Ethiopian megaprojects, and careers.
   */
  public getTopicRealLifeConnection(
    subjectId: string,
    topicId: string,
    topicTitle: string,
    userGoalProfile?: StudentGoalProfile | null
  ): TopicRealLifeConnection {
    const cleanSub = subjectId.toLowerCase();
    const cleanTop = topicId.toLowerCase();

    // 1. Determine subject context
    let whatYouAreLearning = {
      en: `You are studying ${topicTitle}, exploring underlying mathematical or scientific laws and problem-solving structures.`,
      am: `ስለ ${topicTitle} ፅንሰ-ሀሳብ፣ መሰረታዊ ሳይንሳዊ ወይም ሂሳባዊ ህጎችና ችግር ፈቺ ስልተ-ቀመሮችን በመማር ላይ ነዎት::`,
    };

    let whereItIsUsed = [
      { en: 'Modern technology & infrastructure design', am: 'በዘመናዊ ቴክኖሎጂና በመሰረተ-ልማት ግንባታ ውስጥ' },
      { en: 'Data forecasting & financial decision-making', am: 'በመረጃ ትንበያና በፋይናንስ ውሳኔዎች ላይ' },
      { en: 'Industrial processing & laboratory testing', am: 'በፋብሪካ ምርቶችና በላብራቶሪ ምርመራዎች' },
    ];

    let whyItMatters = {
      en: 'Without this foundation, designing stable structures, writing efficient computer software, or formulating medicines would be impossible.',
      am: 'ይህ መሰረታዊ እውቀት ከሌለ አስተማማኝ ህንጻዎችን መገንባት፣ የኮምፒውተር ሶፍትዌር ማልማት ወይም ህይወት አድን መድሃኒቶችን መቅመም አይቻልም::',
    };

    let realLifeExample = {
      en: 'Used extensively in engineering diagnostics, optimizing industrial output, and predicting statistical outcomes under uncertainty.',
      am: 'በምህንድስና ስራዎች፣ የፋብሪካ ምርታማነትን በማሳደግና እርግጠኛ ባልሆኑ ሁኔታዎች ትክክለኛ ውሳኔ ለመስጠት ያገለግላል::',
    };

    let ethiopianContextExample = {
      en: 'Applied in Ethiopia’s national development: from managing power distribution from the Grand Ethiopian Renaissance Dam (GERD) to monitoring crop logistics at the Ethiopian Commodity Exchange (ECX).',
      am: 'በኢትዮጵያ ታላላቅ ፕሮጀክቶች ውስጥ ተግባራዊ ይሆናል፡ ከህዳሴው ግድብ የኤሌክትሪክ ስርጭት ጀምሮ በኢትዮጵያ ምርት ገበያ (ECX) የሰብል ግብይትን እስከ ማስተዳደር ድረስ ያገለግላል::',
    };

    let relatedCareers = ['software_engineer', 'civil_engineer', 'data_scientist'];
    let relatedSkills = ['problem_solving', 'logical_reasoning', 'data_analysis'];

    // Specialized tailoring based on subject
    if (cleanSub.includes('math')) {
      whatYouAreLearning = {
        en: `Understanding how ${topicTitle} models variable relations, functions, and numerical patterns.`,
        am: `ስለ ${topicTitle} ተለዋዋጮችን፣ ፈንክሽኖችንና የቁጥር ስርአተ-ንድፎችን እንዴት በሞዴል መግለጽ እንደሚቻል መረዳት::`,
      };
      whereItIsUsed = [
        { en: 'Business profit/loss algorithms and budget forecasting', am: 'የንግድ ትርፍና ኪሳራ ስሌትና የበጀት ትንበያ' },
        { en: 'Engineering structural calculations and road grading', am: 'የምህንድስና የመዋቅር ስሌትና የመንገድ ዝንባሌ' },
        { en: 'Computer programming loops and cryptographic security', am: 'የኮምፒውተር ፕሮግራሚንግና የሳይበር ደህንነት' },
        { en: 'Population demographic projections and epidemiology', am: 'የህዝብ ቁጥር እድገት ትንበያና የበሽታ ስርጭት ጥናት' },
      ];
      whyItMatters = {
        en: 'Mathematics is the universal language of science and economics; it allows us to quantify reality and make rational, evidence-based predictions.',
        am: 'ሂሳብ የሳይንስና የኢኮኖሚክስ አለም አቀፍ ቋንቋ ነው፤ አለማችንን በቁጥር እንድንረዳና ምክንያታዊ ትንበያ እንድናደርግ ያስችለናል::',
      };
      realLifeExample = {
        en: 'Telebirr calculating real-time micro-loan interest rates and transaction limits using mathematical relations and thresholds.',
        am: 'ቴሌብር የብድር ወለድንና የክፍያ ገደብን በሂሳብ ቀመሮች አማካኝነት በቅጽበት ማስላት::',
      };
      ethiopianContextExample = {
        en: 'Surveyors in the Addis Ababa Corridor Development utilizing trigonometry and coordinate geometry to align light rail and asphalt lanes.',
        am: 'በአዲስ አበባ የኮሪደር ልማት ውስጥ የመንገድና የባቡር ሀዲድ ማዕዘኖችን በትሪጎኖሜትሪና በጂኦሜትሪ ማስተካከል::',
      };
      relatedCareers = ['software_engineer', 'civil_engineer', 'data_scientist', 'economist', 'architect'];
      relatedSkills = ['problem_solving', 'logical_reasoning', 'financial_literacy'];
    } else if (cleanSub.includes('phys')) {
      whatYouAreLearning = {
        en: `Investigating the fundamental laws of energy, motion, forces, and matter governing ${topicTitle}.`,
        am: `ስለ ጉልበት፣ እንቅስቃሴ፣ ሀይሎችና የተፈጥሮ ህጎች በ${topicTitle} ውስጥ ያለውን መርህ መመርመር::`,
      };
      whereItIsUsed = [
        { en: 'Hydropower generation and transmission grids', am: 'የውሃ ኃይል ማመንጨትና የኤሌክትሪክ መስመሮች' },
        { en: 'Automotive braking distance and aircraft lift dynamics', am: 'የተሽከርካሪ ፍሬን እና የአውሮፕላን የበረራ ፊዚክስ' },
        { en: 'Solar photovoltaic mini-grids and wind turbine sizing', am: 'የፀሐይ ብርሃንና የንፋስ ኃይል ቴክኖሎጂ' },
        { en: 'Medical X-ray imaging and ultrasound diagnostics', am: 'የህክምና ኤክስሬይ (X-ray) እና አልትራሳውንድ' },
      ];
      whyItMatters = {
        en: 'Physics explains how everything in our physical universe moves, generates power, and interacts—forming the bedrock of all engineering.',
        am: 'ፊዚክስ በአለማችን ላይ ያሉ ነገሮች እንዴት እንደሚንቀሳቀሱና ኃይል እንደሚያመነጩ ያስረዳል፤ የምህንድስና ሁሉ መሰረት ነው::',
      };
      realLifeExample = {
        en: 'Ethiopian Electric Power converting the potential energy of water stored behind GERD into mechanical rotation and 5,000+ MW of electrical power.',
        am: 'የኢትዮጵያ ኤሌክትሪክ ኃይል በህዳሴው ግድብ የታመቀውን የውሃ ጉልበት ወደ ተርባይን መዞሪያነትና ወደ ከ5,000 ሜጋዋት በላይ ኤሌክትሪክ መቀየር::',
      };
      ethiopianContextExample = {
        en: 'Ethiopian Airlines flight dispatchers calculating vector wind shear and aircraft weight-and-balance on flights departing Bole Airport.',
        am: 'የኢትዮጵያ አየር መንገድ በቦሌ አየር ማረፊያ የበረራ ንፋስንና የአውሮፕላን ክብደት ሚዛንን በፊዚክስ ቬክተር ማስላት::',
      };
      relatedCareers = ['electrical_engineer', 'mechanical_engineer', 'pilot', 'civil_engineer'];
      relatedSkills = ['scientific_reasoning', 'problem_solving', 'critical_thinking'];
    } else if (cleanSub.includes('chem')) {
      whatYouAreLearning = {
        en: `Exploring atomic bonds, chemical reactivity, solutions, and molecular structures in ${topicTitle}.`,
        am: `ስለ አቶሞች ትስስር፣ ኬሚካላዊ ምላሾች፣ ውህዶችና ሞለኪውላዊ ቅርጾች በ${topicTitle} ውስጥ መረዳት::`,
      };
      whereItIsUsed = [
        { en: 'Pharmaceutical drug formulation and medical vaccines', am: 'የመድሃኒት ቅመማና የክትባት ማምረት ሂደት' },
        { en: 'Agricultural soil conditioning and nitrogen fertilizers', am: 'የአፈር ለምነት ማሻሻያና የናይትሮጅን ማዳበሪያ' },
        { en: 'Drinking water purification and municipal chlorination', am: 'የመጠጥ ውሃ ማጣራትና የክሎሪን ህክምና' },
        { en: 'Cement hydration and metallurgical manufacturing', am: 'የሲሚንቶ ማምረትና የብረታ-ብረት ኢንዱስትሪ' },
      ];
      whyItMatters = {
        en: 'Every substance we touch, ingest, or construct with is made of chemical bonds; understanding chemistry lets us synthesize life-saving products.',
        am: 'የምንመገበው ምግብ፣ የምንጠጣው መድሃኒትና የምንገነባው ህንጻ ሁሉ የኬሚካል ውህድ ውጤት ነው፤ ኬሚስትሪ ህይወት አድን ነገሮችን እንድንፈጥር ያስችለናል::',
      };
      realLifeExample = {
        en: 'Formulating antacids to neutralize excess hydrochloric acid ($HCl$) in human gastric ulcer management.',
        am: 'በጨጓራ ውስጥ የበዛን አሲድ ለማስታገስ በቤዝ (Base) ገለልተኛ የሚያደርግ መድሃኒት ማዘጋጀት::',
      };
      ethiopianContextExample = {
        en: 'Treating municipal water supplies at the Gefersa and Legedadi reservoirs to supply safe drinking water to millions in Addis Ababa.',
        am: 'በገፈርሳና ለገዳዲ ማጣሪያዎች የኬሚካል ውህዶችን በመጠቀም ለአዲስ አበባ ንጹህ የመጠጥ ውሃ ማቅረብ::',
      };
      relatedCareers = ['pharmacist', 'doctor', 'agricultural_scientist', 'environmental_scientist'];
      relatedSkills = ['scientific_reasoning', 'research', 'critical_thinking'];
    } else if (cleanSub.includes('bio')) {
      whatYouAreLearning = {
        en: `Investigating cellular processes, human physiological systems, and biological interactions in ${topicTitle}.`,
        am: `ስለ ህዋሳት አሰራር፣ የሰውነት አካላት እንቅስቃሴና የስነ-ህይወት መስተጋብር በ${topicTitle} ውስጥ መመርመር::`,
      };
      whereItIsUsed = [
        { en: 'Clinical diagnosis and disease pathology in hospitals', am: 'በሆስፒታል ውስጥ የህመም ምርመራና ህክምና' },
        { en: 'Crop genetics, cross-breeding, and disease-resistant seeds', am: 'የሰብል ጀነቲክስና በሽታን የሚቋቋሙ ምርጥ ዘሮች' },
        { en: 'Public health epidemiology and vaccination campaigns', am: 'የማህበረሰብ ጤና ጥበቃና የክትባት ዘመቻዎች' },
        { en: 'Endemic wildlife conservation and watershed forestry', am: 'የዱር አራዊትና የደን ጥበቃ ስራዎች' },
      ];
      whyItMatters = {
        en: 'Biology unlocks the mysteries of living organisms, providing the foundation for modern medicine, food security, and environmental survival.',
        am: 'ስነ-ህይወት ስለ ህያዋን ፍጥረታት አሰራር ጥልቅ እውቀት ይሰጣል፤ ለዘመናዊ ህክምና፣ ለምግብ ዋስትናና ለተፈጥሮ ጥበቃ መሰረት ነው::',
      };
      realLifeExample = {
        en: 'How white blood cell lymphocytes synthesize specific antibodies to neutralize viral antigens in the bloodstream.',
        am: 'ነጭ የደም ሴሎች በሰውነት ውስጥ የገቡ ቫይረሶችንና ባክቴሪያዎችን እንዴት እንደሚዋጉ ማወቅ::',
      };
      ethiopianContextExample = {
        en: 'Ethiopian Institute of Agricultural Research (EIAR) researchers breeding rust-resistant wheat and high-iron Teff varieties to prevent anemia.',
        am: 'በኢትዮጵያ ግብርና ምርምር ኢንስቲትዩት (EIAR) ከፍተኛ የብረት ንጥረ-ነገር ያለውን የጤፍ ዝርያ ማፍራት::',
      };
      relatedCareers = ['doctor', 'agricultural_scientist', 'pharmacist', 'environmental_scientist'];
      relatedSkills = ['scientific_reasoning', 'research', 'collaboration'];
    } else if (cleanSub.includes('econ')) {
      whatYouAreLearning = {
        en: `Analyzing resource allocation, fiscal mechanisms, markets, and monetary policies in ${topicTitle}.`,
        am: `ስለ ውስን ሃብት አጠቃቀም፣ የገበያ መርሆዎች፣ የዋጋ ተመንና የገንዘብ ፖሊሲዎች በ${topicTitle} ውስጥ መተንተን::`,
      };
      whereItIsUsed = [
        { en: 'National inflation management and foreign currency reserves', am: 'የዋጋ ግሽበትንና የውጭ ምንዛሪ ክምችትን ማስተዳደር' },
        { en: 'Commercial banking lending decisions and interest rates', am: 'የባንክ ብድርና የወለድ ተመን ውሳኔዎች' },
        { en: 'Agricultural export pricing (coffee, sesame, pulses)', am: 'የቡና፣ ሰሊጥና ጥራጥሬ የወጪ ንግድ ዋጋ' },
        { en: 'Small-enterprise budgeting and break-even revenue planning', am: 'የአነስተኛ ንግድ በጀትና የትርፍ ስሌት' },
      ];
      whyItMatters = {
        en: 'Economics provides the framework to manage scarcity, generate employment, alleviate poverty, and build a prosperous nation.',
        am: 'ኢኮኖሚክስ ውስን ሃብትን በአግባቡ በመጠቀም የስራ እድል ለመፍጠር፣ ድህነትን ለመቀነስና ሀገርን ለማበልጸግ ወሳኝ ነው::',
      };
      realLifeExample = {
        en: 'Understanding why rising fuel transport costs shift the supply curve upward, causing grocery prices to increase.',
        am: 'የነዳጅ ዋጋ መጨመር የትራንስፖርት ወጪን በማሳደግ በምግብ ዋጋ ላይ የሚያመጣውን የዋጋ ግሽበት በገበያ ህግ መረዳት::',
      };
      ethiopianContextExample = {
        en: 'The National Bank of Ethiopia establishing market-based foreign exchange policies to encourage export competitiveness and diaspora remittances.',
        am: 'የኢትዮጵያ ብሔራዊ ባንክ የወጪ ንግድን ለማበረታታትና የውጭ ምንዛሪን ለማረጋጋት ያወጣው የገበያ መርህ ፖሊሲ::',
      };
      relatedCareers = ['economist', 'entrepreneur', 'data_scientist', 'accountant'];
      relatedSkills = ['data_analysis', 'financial_literacy', 'critical_thinking'];
    }

    // Matching cross-subject connections
    const crossConns = this.getCrossSubjectConnections(
      cleanSub.includes('math')
        ? 'Mathematics'
        : cleanSub.includes('phys')
        ? 'Physics'
        : cleanSub.includes('chem')
        ? 'Chemistry'
        : cleanSub.includes('bio')
        ? 'Biology'
        : 'Economics'
    );

    // Matching project idea
    const projectIdea = REAL_WORLD_PROJECTS.find(
      (p) => p.subjectId === subjectId || p.subjectId.split('-')[0] === subjectId.split('-')[0]
    );

    return {
      topicId,
      subjectId,
      grade: 9,
      topicTitle: { en: topicTitle, am: topicTitle },
      whatYouAreLearning,
      whereItIsUsed,
      whyItMatters,
      realLifeExample,
      ethiopianContextExample,
      relatedCareers,
      relatedSkills,
      crossSubjectConnections: crossConns,
      projectIdea,
    };
  }

  /**
   * Generates a personalized "WHY THIS MATTERS TO YOUR GOAL" card
   * Educational guidance, NOT a deterministic career guarantee.
   */
  public getPersonalizedPurposeCard(
    subjectId: string,
    topicId: string,
    topicTitle: string,
    userGoals: StudentGoalProfile | null
  ): PersonalizedPurposeCard | null {
    if (!userGoals || !userGoals.primaryCareerGoals || userGoals.primaryCareerGoals.length === 0) {
      return null;
    }

    const primaryGoalId = userGoals.primaryCareerGoals[0];
    const career = this.getCareerById(primaryGoalId);
    if (!career) return null;

    const careerNameEn = career.careerName.en;
    const careerNameAm = career.careerName.am;
    const cleanSub = subjectId.toLowerCase();

    let headline = {
      en: `Why ${topicTitle} Matters for Aspiring ${careerNameEn}s`,
      am: `${topicTitle} የወደፊት ${careerNameAm} ለመሆን ለሚመኙ ተማሪዎች ያለው ጠቀሜታ`,
    };

    let explanation = {
      en: `This topic is directly foundational for your goal because professionals in ${careerNameEn} rely heavily on these exact mathematical and analytical principles in daily diagnosis, design, or decision-making.`,
      am: `ይህ ርዕስ ለወደፊት ግብዎ እጅግ አስፈላጊ ነው፤ ምክንያቱም በ${careerNameAm} ሙያ ውስጥ ያሉ ባለሙያዎች በስራቸው ውስጥ እነዚህን መሰረታዊ ስሌቶችና ሳይንሳዊ መርሆዎች በየቀኑ ይጠቀማሉ::`,
    };

    let actionableTip = {
      en: `Focus on mastering the underlying logic rather than memorizing formulas. Try applying this to a real-world project to solidify your skills!`,
      am: `ቀመሮችን በቃል ከመሸምደድ ይልቅ ውስጣዊ አመክንዮአቸውን ለመረዳት ይሞክሩ። እውቀትዎን ለማዳበር በተግባራዊ ፕሮጀክት ላይ ይለማመዱ!`,
    };

    // Specific pairings:
    if (primaryGoalId === 'doctor' && (cleanSub.includes('bio') || cleanSub.includes('chem'))) {
      explanation = {
        en: `As a future physician, you will evaluate patient organ function and prescribe biochemical therapies. Mastering ${topicTitle} builds the clinical intuition you will use in medical school.`,
        am: `እንደ ወደፊት ሀኪም፣ የታካሚዎችን የሰውነት አካላት ጤንነት በመመርመር ህክምናዎችን ያዛሉ:: ${topicTitle}ን ጠንቅቀው ማወቅ በህክምና ት/ቤት ውስጥ ለሚጠብቅዎት ትምህርት ጠንካራ መሰረት ይጥላል::`,
      };
      actionableTip = {
        en: 'Pay close attention to human organ homeostasis and how small chemical imbalances cause physiological symptoms.',
        am: 'የሰውነት ሚዛናዊነትና ጥቃቅን ኬሚካላዊ ለውጦች እንዴት ለህመም ምልክቶች እንደሚዳርጉ በትኩረት ያስተውሉ::',
      };
    } else if (primaryGoalId === 'software_engineer' && cleanSub.includes('math')) {
      explanation = {
        en: `Software algorithms and artificial intelligence are built directly on mathematical functions and discrete logic. Mastering ${topicTitle} empowers you to write clean, high-performance code.`,
        am: `የኮምፒውተር ስልተ-ቀመሮች (Algorithms) እና AI የተገነቡት በሂሳብ ፈንክሽኖችና አመክንዮ ላይ ነው:: ${topicTitle}ን መረዳት ፈጣንና ጥራት ያለው ሶፍትዌር እንድትጽፉ ያግዛችኋል::`,
      };
      actionableTip = {
        en: 'Try translating these mathematical steps into pseudo-code or an algorithmic flowchart.',
        am: 'እነዚህን የሂሳብ ደረጃዎች ወደ ኮምፒውተር ስልተ-ቀመር (Flowchart) ለመቀየር ይሞክሩ::',
      };
    } else if (primaryGoalId === 'civil_engineer' && (cleanSub.includes('phys') || cleanSub.includes('math'))) {
      explanation = {
        en: `Structural safety of bridges, roads, and dams depends on force equilibrium and precision vector analysis. Understanding ${topicTitle} ensures the structures you design remain stable for decades.`,
        am: `የድልድዮች፣ መንገዶችና ግድቦች ደህንነት የሚወሰነው በሀይሎች ሚዛንና ትክክለኛ የቬክተር ስሌት ላይ ነው:: ${topicTitle}ን መረዳት የነደፏቸው ህንጻዎች ለዘመናት ጸንተው እንዲቆሙ ያደርጋል::`,
      };
    } else if (primaryGoalId === 'economist' && (cleanSub.includes('econ') || cleanSub.includes('math'))) {
      explanation = {
        en: `Economic policymakers evaluate supply-demand shifts and inflation trade-offs using quantitative data. ${topicTitle} gives you the analytical tools to evaluate real national economic policies.`,
        am: `የኢኮኖሚ ፖሊሲ አውጪዎች የገበያ ለውጦችንና የዋጋ ግሽበትን በቁጥር ይመዝናሉ:: ${topicTitle} ሀገራዊ የኢኮኖሚ ውሳኔዎችን ለመተንተን የሚያስችል የአስተሳሰብ መሳሪያ ያስታጥቆታል::`,
      };
    }

    return {
      topicId,
      careerGoal: primaryGoalId,
      headline,
      explanation,
      actionableTip,
    };
  }

  /**
   * Calculates a non-deterministic Career Alignment Guidance score
   * IMPORTANT: Guidance only, never a career guarantee or diagnostic prophecy.
   */
  public calculateCareerAlignment(
    careerId: string,
    userGoals: StudentGoalProfile | null,
    progressMap: Record<string, any> = {},
    userSkills: Record<string, number> = {}
  ): CareerAlignmentGuidance {
    const career = this.getCareerById(careerId) || CAREER_PROFILES[0];

    // 1. Subject Affinity Component (0 - 40 pts)
    let subjectScore = 20; // default baseline
    if (userGoals) {
      const coreSubjectIds = career.relatedSubjects.map((s) => s.subjectId.toLowerCase());
      const enjoyedMatches = userGoals.enjoyedSubjects.filter((sub) =>
        coreSubjectIds.some((cs) => cs.includes(sub.toLowerCase()))
      );
      subjectScore = Math.min(40, 15 + enjoyedMatches.length * 12);
    }

    // 2. Topic Mastery Component (0 - 40 pts)
    let masteryScore = 20;
    const progressKeys = Object.keys(progressMap);
    if (progressKeys.length > 0) {
      let totalMastery = 0;
      let count = 0;
      for (const key of progressKeys) {
        const node = progressMap[key];
        if (typeof node?.masteryLevel === 'number') {
          totalMastery += node.masteryLevel;
          count++;
        }
      }
      if (count > 0) {
        const avg = totalMastery / count;
        masteryScore = Math.round((avg / 100) * 40);
      }
    }

    // 3. Skill Coverage Component (0 - 20 pts)
    let skillScore = 15;
    const requiredSkills = career.requiredSkills;
    if (userGoals?.targetSkills && userGoals.targetSkills.length > 0) {
      const matchSkills = userGoals.targetSkills.filter((s) => requiredSkills.includes(s));
      skillScore = Math.min(20, 10 + matchSkills.length * 4);
    }

    const totalScore = Math.min(100, Math.max(15, subjectScore + masteryScore + skillScore));

    let alignmentLevel: AlignmentLevel = 'Developing';
    if (totalScore >= 80) alignmentLevel = 'Strong';
    else if (totalScore >= 60) alignmentLevel = 'Good';
    else if (totalScore >= 40) alignmentLevel = 'Developing';
    else alignmentLevel = 'Low';

    const summaryGuidance = {
      en: `Your current learning engagement and subject selections are ${alignmentLevel.toLowerCase()}ly related to skills commonly applied in ${career.careerName.en}.`,
      am: `አሁን ያለው የመማር ተሳትፎዎና የመረጧቸው ትምህርቶች በ${career.careerName.am} ሙያ ውስጥ ከሚያስፈልጉ መሰረታዊ ክህሎቶች ጋር ${
        alignmentLevel === 'Strong'
          ? 'እጅግ ከፍተኛ'
          : alignmentLevel === 'Good'
          ? 'ጥሩ'
          : alignmentLevel === 'Developing'
          ? 'እያደገ ያለ'
          : 'መጠነኛ'
      } ዝምድና አላቸው::`,
    };

    const foundationalStrengths = career.relatedSubjects
      .filter((s) => s.importance === 'core')
      .map((s) => ({
        en: `Core foundation in ${s.subjectName.en}`,
        am: `በ${s.subjectName.am} ጠንካራ መሰረት መያዝ`,
      }));

    const recommendedFocusAreas = career.importantTopics.map((top) => ({
      subjectId: top.subjectId,
      topicId: top.topicId,
      reason: top.whyItMatters,
    }));

    return {
      careerId: career.careerId,
      careerName: career.careerName,
      alignmentLevel,
      alignmentScore: totalScore,
      summaryGuidance,
      foundationalStrengths,
      recommendedFocusAreas,
      basisDetails: {
        subjectAffinity: subjectScore,
        masteryPercentage: masteryScore,
        skillCoverage: skillScore,
      },
      disclaimer: {
        en: 'This alignment score is for educational guidance and motivation only. It does not guarantee admission or career outcomes.',
        am: 'ይህ የዝግጁነት መለኪያ ለትምህርታዊ መመሪያና ማበረታቻ ብቻ የቀረበ ነው፤ የማንኛውንም ዩኒቨርሲቲ ቅበላ ወይም የወደፊት ስራ ውጤት ዋስትና አይሰጥም::',
      },
    };
  }

  /**
   * Adaptive Learning Linkage: Connects weak topic diagnosis to student's career dream
   * Explains gently why mastering this prerequisite creates a solid foundation without pressure.
   */
  public generateAdaptiveCareerGuidance(
    weakTopicId: string,
    topicTitle: string,
    careerGoalId: string
  ): {
    encouragementTitle: { en: string; am: string };
    careerRelevanceExplanation: { en: string; am: string };
    recommendedStep: { en: string; am: string };
  } {
    const career = this.getCareerById(careerGoalId) || CAREER_PROFILES[0];

    return {
      encouragementTitle: {
        en: `Strengthening Your Foundation in ${topicTitle} for ${career.careerName.en}`,
        am: `ለወደፊት የ${career.careerName.am} ግብዎ በ${topicTitle} ጠንካራ መሰረት መገንባት`,
      },
      careerRelevanceExplanation: {
        en: `It is completely natural to encounter challenging topics. In ${career.careerName.en}, ${topicTitle} is a stepping stone. Strengthening your grasp on this concept now will make advanced topics much easier to understand.`,
        am: `አንዳንድ የትምህርት ርዕሶች ከበድ ሲሉ ማጋጠሙ የተለመደ ነው:: በ${career.careerName.am} ሙያ ውስጥ ${topicTitle} እንደ መሰላል የሚያገለግል ቁልፍ ርዕስ ነው:: ይህንን ርዕስ ዛሬ ደግመው ሲለማመዱ ወደፊት የሚመጡት የከፍተኛ ትምህርት ክፍሎች እጅግ ቀላል ይሆኑልዎታል::`,
      },
      recommendedStep: {
        en: `Review the step-by-step worked examples and try 3 scaffolded practice questions with hints.`,
        am: `የተሰሩ ምሳሌዎችን ደረጃ በደረጃ ይገምግሙና አጋዥ ፍንጮችን (Hints) በመጠቀም 3 የልምምድ ጥያቄዎችን ይሞክሩ::`,
      },
    };
  }

  /**
   * Generates AI Tutor System Prompt Context for "Why do I need this subject/topic?"
   */
  public buildAITutorCareerPromptContext(
    studentGrade: number,
    currentSubject: string,
    currentTopic: string,
    userGoals?: StudentGoalProfile | null
  ): string {
    const careerNames = userGoals?.primaryCareerGoals?.map((c) => this.getCareerById(c)?.careerName.en).filter(Boolean) || [];
    const problems = userGoals?.problemsToSolve || [];

    return `
[PURPOSE-DRIVEN LEARNING CONTEXT (PART 14)]
Student Grade Level: Grade ${studentGrade}
Current Subject: ${currentSubject}
Current Topic: ${currentTopic}
Student Stated Career Interests: ${careerNames.length > 0 ? careerNames.join(', ') : 'Open to Exploration'}
Problems the Student Cares to Solve: ${problems.length > 0 ? problems.join(', ') : 'Community development, technology & science'}

PEDAGOGICAL INSTRUCTIONS:
1. Explain WHY the student is learning this topic and WHERE it connects directly to real-life applications.
2. Ground explanations in tangible Ethiopian examples (e.g. GERD hydro energy, telebirr, Awash agriculture, Bole aviation, EPHI medicine, Teff nutrition, Ethiopian road corridors).
3. Connect the topic to the student's stated career goals where relevant, maintaining a supportive educational guidance tone (never make deterministic promises like "You will become a doctor").
4. Identify 1 practical 21st-century skill being developed (e.g. Problem Solving, Critical Thinking, Data Analysis).
5. Suggest an accessible real-world observation or micro-project suitable for a Grade ${studentGrade} student.
`.trim();
  }
}

export const careerConnectionEngine = CareerConnectionEngine.getInstance();
