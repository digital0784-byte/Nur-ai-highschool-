/**
 * NUR AI HIGH SCHOOL - GRADE 11 INFORMATION TECHNOLOGY MASTER CURRICULUM
 * Source: Federal Democratic Republic of Ethiopia Ministry of Education (FDRE MoE)
 * Grade 11 Information Technology Student Textbook (168 pages, 2023)
 * Authors: Temtim Assefa Desta (PhD) & Miftah Hassen Jemal
 * 
 * Hierarchy:
 * Grade 11 -> Information Technology -> Unit (1-6) -> Section -> Lesson -> Topic -> Learning Outcome ->
 * Explanation -> Example -> Activity -> Practical Exercise -> Key Concept -> Key Terms -> Review -> Assessment
 */

export interface CurriculumTopicItem {
  id: string;
  topicNumber: string;
  topicTitle: string;
  learningOutcome: string;
  originalMeaning: string;
  studentExplanation: string;
  textbookPage: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prerequisites: string[];
  knowledgeMapRelation: {
    dependsOn: string[];
    leadsTo: string[];
    conceptGroup: string;
  };
  workedExample?: {
    problem: string;
    solution: string;
    explanation: string;
  };
  activity: {
    number: string;
    prompt: string;
    deliverable: string;
  };
  practicalExercise?: {
    title: string;
    equipmentOrSoftware: string;
    steps: string[];
    expectedOutcome: string;
  };
  keyConcepts: string[];
  keyTerms: {
    term: string;
    definition: string;
    translations: {
      am: string;
      om: string;
      ti: string;
    };
  }[];
}

export interface CurriculumSectionItem {
  sectionNumber: string;
  title: string;
  textbookPages: string;
  learningOutcomes: string[];
  topics: CurriculumTopicItem[];
}

export interface QuestionBankItem {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'short_answer' | 'discussion' | 'practical' | 'coding';
  question: string;
  options?: [string, string, string, string];
  correctAnswer: string | number;
  explanation: string;
  textbookPage: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  skill: string;
  starterCode?: string;
  testCase?: string;
}

export interface CurriculumUnitItem {
  unitNumber: number;
  unitTitle: string;
  pageRange: string;
  summary: string;
  learningOutcomes: string[];
  sections: CurriculumSectionItem[];
  questionBank: QuestionBankItem[];
  unitReviewQuestions: string[];
  unitAssessment: {
    title: string;
    totalMarks: number;
    instructions: string;
    questions: QuestionBankItem[];
  };
}

export interface Grade11ITCourse {
  grade: 11;
  subject: 'Information Technology';
  subjectAmharic: 'ኢንፎርሜሽን ቴክኖሎጂ';
  subjectOromo: 'Teeknoolojii Odeeffannoo';
  subjectTigrinya: 'ኢንፎርሜሽን ቴክኖሎጂ';
  curriculumBadge: 'FDRE MoE New Curriculum (168 Pages)';
  totalPages: 168;
  totalUnits: 6;
  units: CurriculumUnitItem[];
}

export const grade11ITCurriculum: Grade11ITCourse = {
  grade: 11,
  subject: 'Information Technology',
  subjectAmharic: 'ኢንፎርሜሽን ቴክኖሎጂ',
  subjectOromo: 'Teeknoolojii Odeeffannoo',
  subjectTigrinya: 'ኢንፎርሜሽን ቴክኖሎጂ',
  curriculumBadge: 'FDRE MoE New Curriculum (168 Pages)',
  totalPages: 168,
  totalUnits: 6,
  units: [
    // ----------------------------------------------------
    // UNIT 1: Information Systems and Its Applications (pp. 1-28)
    // ----------------------------------------------------
    {
      unitNumber: 1,
      unitTitle: 'Unit 1: Information Systems and Its Applications',
      pageRange: 'pp. 1–28',
      summary: 'Foundations of information systems, DIKW hierarchy, components of IS (hardware, software, data, people, procedures), major categories (TPS, MIS, DSS, ESS), applications in e-government, e-banking, e-learning, healthcare and agriculture, IT entrepreneurship, and societal impact including the digital divide.',
      learningOutcomes: [
        'Differentiate between data, information, knowledge, and wisdom (DIKW pyramid).',
        'Identify and explain the five core components of an Information System.',
        'Classify information systems into TPS, MIS, DSS, and Executive Support Systems.',
        'Analyze practical IS applications in e-government, digital banking (telebirr, CBE Birr), and e-learning.',
        'Evaluate the role of ICT in entrepreneurship, job creation, and bridging the Ethiopian digital divide.'
      ],
      sections: [
        {
          sectionNumber: '1.1',
          title: 'Basics of Information Systems & DIKW Hierarchy',
          textbookPages: 'pp. 1–7',
          learningOutcomes: ['Define data, information, knowledge, and wisdom with Ethiopian context examples.'],
          topics: [
            {
              id: 'it11-u1-t1',
              topicNumber: '1.1.1',
              topicTitle: 'The DIKW Hierarchy (Data, Information, Knowledge, Wisdom)',
              learningOutcome: 'Distinguish raw data from actionable wisdom in decision-making.',
              originalMeaning: 'Data represents raw, unorganized facts and symbols. Information is processed data that possesses context and meaning. Knowledge is information applied through experience and understanding. Wisdom is the sound evaluation and ethical application of knowledge for future judgment.',
              studentExplanation: 'Think of data as raw numbers (e.g., 28°C, 35mm rain in Awash). Information turns this into "Awash has experienced 35mm rainfall with warm temperature." Knowledge understands that "Teff crops require planting within 3 days under these conditions." Wisdom decides "Deploy irrigation early to prevent crop failure during forecasted dry spells."',
              textbookPage: 3,
              difficulty: 'Beginner',
              prerequisites: ['Basic Computer Literacy'],
              knowledgeMapRelation: {
                dependsOn: [],
                leadsTo: ['it11-u1-t2', 'it11-u3-t1'],
                conceptGroup: 'Information Foundations'
              },
              workedExample: {
                problem: 'A clinic in Hawassa records patient ages: 12, 14, 11, 13. How does this progress through the DIKW pyramid?',
                solution: 'Data: 12, 14, 11, 13 (raw numbers). Information: Average patient age is 12.5 years presenting with seasonal flu. Knowledge: Children under 15 in Hawassa during rainy season are susceptible to respiratory infection. Wisdom: Launching a preventative pediatric vaccination campaign in schools before the rainy season begins.',
                explanation: 'Progressing from symbols to contextual meaning, practical understanding, and visionary foresight.'
              },
              activity: {
                number: 'Activity 1.1',
                prompt: 'Identify three raw data inputs collected in your school and explain how they transform into information and knowledge.',
                deliverable: 'A tabular DIKW map describing student attendance, exam scores, and library book loans.'
              },
              keyConcepts: ['Data as raw symbols', 'Information requires context', 'Knowledge is actionable insight', 'Wisdom provides ethical foresight'],
              keyTerms: [
                {
                  term: 'Data',
                  definition: 'Raw, unformatted facts, figures, and symbols lacking contextual meaning.',
                  translations: { am: 'ዳታ (ጥሬ መረጃ)', om: 'Deetaa', ti: 'ዳታ (ጥረ መረዳእታ)' }
                },
                {
                  term: 'Information',
                  definition: 'Processed, structured, or formatted data that possesses relevance and purpose.',
                  translations: { am: 'መረጃ', om: 'Odeeffannoo', ti: 'ሓበሬታ' }
                },
                {
                  term: 'Knowledge',
                  definition: 'Information combined with contextual experience, understanding, and actionable rules.',
                  translations: { am: 'ዕውቀት', om: 'Beekumsa', ti: 'ፍልጠት' }
                },
                {
                  term: 'Wisdom',
                  definition: 'The ability to make sound, ethical, and forward-looking decisions based on synthesized knowledge.',
                  translations: { am: 'ጥበብ', om: 'Ogummaa / Ogeessummaa', ti: 'ጥበብ' }
                }
              ]
            }
          ]
        },
        {
          sectionNumber: '1.2',
          title: 'Components and Types of Information Systems',
          textbookPages: 'pp. 8–18',
          learningOutcomes: ['Examine the 5 components of an IS and classify systems by organizational levels.'],
          topics: [
            {
              id: 'it11-u1-t2',
              topicNumber: '1.2.1',
              topicTitle: 'Five Components of Information Systems',
              learningOutcome: 'Explain how hardware, software, data, people, and procedures interact.',
              originalMeaning: 'An information system is an integrated set of components for collecting, storing, and processing data. Hardware provides physical devices; Software provides instructions; Data constitutes the raw resource; People are users and technical staff; Procedures are operating guidelines and policies.',
              studentExplanation: 'A system cannot work with just computers. If an Ethiopian bank buys modern servers (hardware) and runs banking software, it still fails without accurate account records (data), trained tellers and customers (people), and strict fraud verification protocols (procedures).',
              textbookPage: 9,
              difficulty: 'Intermediate',
              prerequisites: ['it11-u1-t1'],
              knowledgeMapRelation: {
                dependsOn: ['it11-u1-t1'],
                leadsTo: ['it11-u1-t3', 'it11-u3-t1'],
                conceptGroup: 'System Architecture'
              },
              activity: {
                number: 'Activity 1.2',
                prompt: 'Map the five components for a national passport issuance office (INVEA) in Addis Ababa.',
                deliverable: 'Detailed component diagram showing biometric scanners (hardware), registration app (software), citizen records (data), officers/citizens (people), and verification rules (procedures).'
              },
              keyConcepts: ['Socio-technical nature of IS', 'Hardware and software dependence on human procedures', 'Data security protocols'],
              keyTerms: [
                {
                  term: 'Information System (IS)',
                  definition: 'An organized combination of hardware, software, infrastructure, data, people, and procedures that collect, store, and process data.',
                  translations: { am: 'የኢንፎርሜሽን ስርዓት', om: 'Sirna Odeeffannoo', ti: 'ስርዓተ ሓበሬታ' }
                },
                {
                  term: 'Procedures',
                  definition: 'Documented rules, policies, and operational steps governing system usage and security.',
                  translations: { am: 'የአሰራር ደንቦች / ሂደቶች', om: 'Hojmaata / Qajeelfamoota', ti: 'መምርሒታትን ኣሰራርሓን' }
                }
              ]
            },
            {
              id: 'it11-u1-t3',
              topicNumber: '1.2.2',
              topicTitle: 'Organizational Classification: TPS, MIS, DSS, and ESS',
              learningOutcome: 'Categorize IS types across operational, tactical, and strategic management tiers.',
              originalMeaning: 'Transaction Processing Systems (TPS) record daily routine business transactions at operational level. Management Information Systems (MIS) provide routine summary reports for middle managers. Decision Support Systems (DSS) use analytical models for semi-structured decisions. Executive Support Systems (ESS) assist senior executives with strategic decisions using external and internal intelligence.',
              studentExplanation: 'When you buy airtime via telebirr, a TPS processes the transaction instantly. The regional manager views weekly transaction volume on an MIS dashboard. An analyst runs a DSS simulation to forecast network traffic during New Year celebrations. The CEO uses an ESS to decide national infrastructure expansion.',
              textbookPage: 14,
              difficulty: 'Intermediate',
              prerequisites: ['it11-u1-t2'],
              knowledgeMapRelation: {
                dependsOn: ['it11-u1-t2'],
                leadsTo: ['it11-u2-t1'],
                conceptGroup: 'Organizational IS'
              },
              activity: {
                number: 'Activity 1.3',
                prompt: 'Compare TPS and DSS based on input, output, primary users, and decision complexity.',
                deliverable: 'Comparative evaluation matrix highlighting differences between routine transactions and predictive simulations.'
              },
              keyConcepts: ['Operational vs tactical vs strategic tiers', 'Structured vs unstructured decisions', 'Predictive modeling'],
              keyTerms: [
                {
                  term: 'Transaction Processing System (TPS)',
                  definition: 'An operational system that tracks and logs the daily routine transactions necessary to conduct business.',
                  translations: { am: 'የትራንዛክሽን ማስተናገጃ ስርዓት', om: 'Sirna Adeemsa Daldalaa', ti: 'ስርዓተ መስርሒ ትራንዛክሽን' }
                },
                {
                  term: 'Decision Support System (DSS)',
                  definition: 'An interactive analytical system that combines data and sophisticated models to assist in semi-structured decision-making.',
                  translations: { am: 'የውሳኔ ድጋፍ ሰጪ ስርዓት', om: 'Sirna Murtii Deeggaru', ti: 'ስርዓተ ደጋፊ ውሳነ' }
                }
              ]
            }
          ]
        },
        {
          sectionNumber: '1.3',
          title: 'Applications of IS, Entrepreneurship, and Digital Divide',
          textbookPages: 'pp. 19–28',
          learningOutcomes: ['Evaluate real-world digital applications in Ethiopia and formulate digital divide solutions.'],
          topics: [
            {
              id: 'it11-u1-t4',
              topicNumber: '1.3.1',
              topicTitle: 'Digital Transformation & E-Services in Ethiopia',
              learningOutcome: 'Analyze national initiatives in e-government, mobile banking, and digital health.',
              originalMeaning: 'Information systems power modern national development through e-government (transparent public services), e-banking (cashless financial inclusion), e-learning (remote educational equity), and telemedicine (specialized clinical care in rural clinics).',
              studentExplanation: 'Initiatives like Ethiopia’s "Digital Ethiopia 2025" strategy, digital national ID (Fayda), mobile money platforms (telebirr, CBE Birr), and online tax filing reduce bureaucracy, cut travel expenses, and expand access.',
              textbookPage: 21,
              difficulty: 'Beginner',
              prerequisites: ['it11-u1-t3'],
              knowledgeMapRelation: {
                dependsOn: ['it11-u1-t3'],
                leadsTo: ['it11-u2-t1'],
                conceptGroup: 'Digital Transformation'
              },
              activity: {
                number: 'Activity 1.4',
                prompt: 'Interview a local merchant on how digital payment systems (QR codes/telebirr) impacted their daily cash flow.',
                deliverable: 'A written 1-page case study discussing convenience, security, transaction fees, and internet connectivity challenges.'
              },
              keyConcepts: ['Financial inclusion via FinTech', 'E-Government service portals', 'Digital Ethiopia 2025 roadmap'],
              keyTerms: [
                {
                  term: 'E-Government',
                  definition: 'The use of information technologies by government agencies to deliver services, exchange information, and engage citizens.',
                  translations: { am: 'ኤሌክትሮኒክ መንግስት', om: 'Mootummaa Elektirooniksii', ti: 'ኤሌክትሮኒካዊ መንግስቲ' }
                },
                {
                  term: 'Digital Divide',
                  definition: 'The economic, educational, and social gap between demographics and regions that have access to modern ICT and those that do not.',
                  translations: { am: 'የዲጂታል ልዩነት / ክፍተት', om: 'Garaagarummaa Diijitaalaa', ti: 'ዲጂታላዊ ፍልልይ' }
                }
              ]
            }
          ]
        }
      ],
      questionBank: [
        {
          id: 'it11-q-u1-01',
          type: 'multiple_choice',
          question: 'In the DIKW pyramid, which tier represents processed data placed in contextual meaning?',
          options: ['Data', 'Information', 'Knowledge', 'Wisdom'],
          correctAnswer: 1,
          explanation: 'Information is defined as processed data that has been structured with context and meaning (Textbook p. 3).',
          textbookPage: 3,
          difficulty: 'Easy',
          skill: 'Conceptual Understanding'
        },
        {
          id: 'it11-q-u1-02',
          type: 'true_false',
          question: 'True or False: A Transaction Processing System (TPS) is primarily used by executive board members to formulate long-term 10-year corporate strategies.',
          correctAnswer: 'False',
          explanation: 'False. TPS operates at the operational level for routine daily transactions; Executive Support Systems (ESS) are used for strategic planning (Textbook p. 14).',
          textbookPage: 14,
          difficulty: 'Easy',
          skill: 'Classification'
        },
        {
          id: 'it11-q-u1-03',
          type: 'fill_blank',
          question: 'The five fundamental components of an information system are Hardware, Software, Data, People, and ________.',
          correctAnswer: 'Procedures',
          explanation: 'The five interconnected components are Hardware, Software, Data, People, and Procedures (Textbook p. 9).',
          textbookPage: 9,
          difficulty: 'Medium',
          skill: 'Recall & Synthesis'
        }
      ],
      unitReviewQuestions: [
        '1. Explain the differences between Data, Information, Knowledge, and Wisdom with two original agricultural examples.',
        '2. Describe how the five components of an information system interact in a university student registration office.',
        '3. Contrast Transaction Processing Systems (TPS) and Decision Support Systems (DSS).',
        '4. Discuss three critical barriers contributing to the digital divide in rural Ethiopian communities and propose actionable solutions.'
      ],
      unitAssessment: {
        title: 'Unit 1 Mastery Examination',
        totalMarks: 25,
        instructions: 'Answer all multiple choice, short explanation, and case analysis questions.',
        questions: [
          {
            id: 'it11-exam-u1-01',
            type: 'multiple_choice',
            question: 'Which of the following is an example of an operational-level information system?',
            options: ['Point of Sale (POS) scanner system', 'Predictive weather climate simulation', 'Annual corporate financial forecasting tool', 'Executive market trend analyzer'],
            correctAnswer: 0,
            explanation: 'POS systems record individual transactions in real-time at the operational tier (Textbook p. 14).',
            textbookPage: 14,
            difficulty: 'Medium',
            skill: 'Application'
          }
        ]
      }
    },

    // ----------------------------------------------------
    // UNIT 2: Emerging Technologies (pp. 29-54)
    // ----------------------------------------------------
    {
      unitNumber: 2,
      unitTitle: 'Unit 2: Emerging Technologies',
      pageRange: 'pp. 29–54',
      summary: 'Comprehensive exploration of the Fourth Industrial Revolution (4IR): Artificial Intelligence & Machine Learning, Augmented & Virtual Reality (AR/VR), Big Data Science (5 Vs), Internet of Things (IoT), and Cloud Computing architecture (IaaS, PaaS, SaaS).',
      learningOutcomes: [
        'Define emerging technologies and identify drivers of the Fourth Industrial Revolution.',
        'Contrast Artificial Intelligence, Machine Learning, and Deep Learning.',
        'Differentiate between Augmented Reality (AR) and Virtual Reality (VR).',
        'Explain the 5 Vs of Big Data and stages of data analytics.',
        'Diagram an IoT architecture and describe Cloud Computing service and deployment models.'
      ],
      sections: [
        {
          sectionNumber: '2.1',
          title: 'Artificial Intelligence and Machine Learning',
          textbookPages: 'pp. 29–36',
          learningOutcomes: ['Understand AI paradigms, branches, and computer vision / NLP applications.'],
          topics: [
            {
              id: 'it11-u2-t1',
              topicNumber: '2.1.1',
              topicTitle: 'Foundations of Artificial Intelligence (AI) and Machine Learning',
              learningOutcome: 'Distinguish Narrow AI from General AI and explain supervised learning.',
              originalMeaning: 'Artificial Intelligence is the simulation of human intelligence processes by computer systems, including learning, reasoning, and self-correction. Machine Learning (ML) is a subset of AI where systems learn from data patterns without explicit rule-based programming.',
              studentExplanation: 'Traditional programs follow rigid rules ("if temperature > 38, alert doctor"). AI and ML inspect thousands of past medical records, discover subtle correlations, and learn to diagnose diseases from X-ray scans or predict crop pests on Ethiopian coffee plants.',
              textbookPage: 31,
              difficulty: 'Intermediate',
              prerequisites: ['it11-u1-t1'],
              knowledgeMapRelation: {
                dependsOn: ['it11-u1-t1'],
                leadsTo: ['it11-u2-t3', 'it11-u6-t1'],
                conceptGroup: 'Emerging Intelligence'
              },
              workedExample: {
                problem: 'How does an automated coffee plant disease detection app use Machine Learning?',
                solution: '1. Training Data: Thousands of labeled photos of healthy vs coffee rust leaves. 2. Feature Extraction: Computer vision detects color discoloration and leaf lesions. 3. Model Training: Neural network adjusts weights. 4. Prediction: A farmer snaps a photo; the model predicts "Coffee Berry Disease with 94% confidence".',
                explanation: 'Computer vision and neural networks analyze pixel patterns rather than relying on manual measurements.'
              },
              activity: {
                number: 'Activity 2.1',
                prompt: 'Identify three daily applications of AI in your mobile phone (e.g., voice assistant, auto-correct, face unlock) and identify which branch of AI they utilize.',
                deliverable: 'Classification report mapping features to Natural Language Processing (NLP) or Computer Vision.'
              },
              keyConcepts: ['Narrow AI vs Artificial General Intelligence (AGI)', 'Supervised vs Unsupervised Learning', 'Computer Vision and NLP'],
              keyTerms: [
                {
                  term: 'Artificial Intelligence (AI)',
                  definition: 'Computer systems capable of performing tasks that traditionally require human cognitive intelligence.',
                  translations: { am: 'ሰው ሰራሽ አስተውሎት (AI)', om: 'Sammuu Namtolchee (AI)', ti: 'ሰብ ስራሕ ብልሒ (AI)' }
                },
                {
                  term: 'Machine Learning (ML)',
                  definition: 'A branch of AI focused on building applications that learn from data and improve accuracy over time without being programmed.',
                  translations: { am: 'ማሽን ለርኒንግ (የማሽን ትምህርት)', om: 'Barumsa Maashinii', ti: 'ማሽን ምምሃር' }
                }
              ]
            }
          ]
        },
        {
          sectionNumber: '2.2',
          title: 'AR, VR, Big Data Science, and IoT',
          textbookPages: 'pp. 37–46',
          learningOutcomes: ['Distinguish AR from VR, define 5 Vs of Big Data, and diagram IoT components.'],
          topics: [
            {
              id: 'it11-u2-t2',
              topicNumber: '2.2.1',
              topicTitle: 'Augmented Reality (AR) vs. Virtual Reality (VR)',
              learningOutcome: 'Compare immersion levels and real-world blending in AR and VR.',
              originalMeaning: 'Virtual Reality (VR) immerses the user completely in an artificial digital environment using head-mounted displays. Augmented Reality (AR) overlays computer-generated digital graphics, audio, or text onto the real-world physical view.',
              studentExplanation: 'In VR, wearing a headset makes you feel like you are walking inside an Ethiopian historical castle in Gondar while sitting in your classroom. In AR, you point your phone camera at an engine or textbook diagram, and 3D animated labels appear overlaid directly on the physical object.',
              textbookPage: 38,
              difficulty: 'Beginner',
              prerequisites: [],
              knowledgeMapRelation: {
                dependsOn: [],
                leadsTo: [],
                conceptGroup: 'Immersive Tech'
              },
              activity: {
                number: 'Activity 2.2',
                prompt: 'Design an AR learning tool for biology students studying the human circulatory system.',
                deliverable: 'Storyboard illustrating how students view a beating 3D heart superimposed on their lab desk.'
              },
              keyConcepts: ['Total immersion vs digital overlay', 'Sensors and spatial tracking', 'Simulation safety in training'],
              keyTerms: [
                {
                  term: 'Virtual Reality (VR)',
                  definition: 'A simulated experience that isolates the user from the physical world into an entirely digital environment.',
                  translations: { am: 'ምናባዊ እውነታ (VR)', om: 'Dhugaa Fakkeeffamaa (VR)', ti: 'ሓሳባዊ ሓቂ (VR)' }
                },
                {
                  term: 'Augmented Reality (AR)',
                  definition: 'An interactive experience where digital objects and information overlay the real-world view.',
                  translations: { am: 'የጎለበተ እውነታ (AR)', om: 'Dhugaa Babal’ate (AR)', ti: 'ዝማዕበለ ሓቂ (AR)' }
                }
              ]
            },
            {
              id: 'it11-u2-t3',
              topicNumber: '2.2.2',
              topicTitle: 'Big Data (The 5 Vs) and Internet of Things (IoT)',
              learningOutcome: 'Analyze the 5 Vs of Big Data and explain sensor-actuator IoT ecosystems.',
              originalMeaning: 'Big Data refers to vast, complex data sets characterized by Volume (sheer size), Velocity (speed of generation), Variety (formats), Veracity (trustworthiness), and Value (actionable business insight). IoT is a network of physical objects embedded with sensors, software, and connectivity to exchange data autonomously.',
              studentExplanation: 'Smart irrigation in the Rift Valley: Soil moisture sensors (IoT) continuously transmit data via cellular networks. Big Data analytics processes weather forecasts and soil history. If moisture drops below 20%, an automated actuator turns on the water pump without human intervention.',
              textbookPage: 42,
              difficulty: 'Intermediate',
              prerequisites: ['it11-u1-t1'],
              knowledgeMapRelation: {
                dependsOn: ['it11-u1-t1'],
                leadsTo: ['it11-u2-t4'],
                conceptGroup: 'Data & Connected Systems'
              },
              activity: {
                number: 'Activity 2.3',
                prompt: 'Identify the 5 Vs for Ethiopian Airlines flight tracking and passenger reservation systems.',
                deliverable: 'Analytical brief detailing terabytes of sensor logs (Volume), real-time radar ping speeds (Velocity), mixed audio/video/text (Variety), sensor accuracy checks (Veracity), and fuel optimization (Value).'
              },
              keyConcepts: ['5 Vs of Big Data', 'Sensors and Actuators in IoT', 'Autonomous machine-to-machine communication'],
              keyTerms: [
                {
                  term: 'Big Data',
                  definition: 'Extremely large and diverse data sets that require advanced computational tools for processing and insight extraction.',
                  translations: { am: 'ግዙፍ ዳታ (ቢግ ዳታ)', om: 'Deetaa Guddaa', ti: 'ዓብዪ ዳታ' }
                },
                {
                  term: 'Internet of Things (IoT)',
                  definition: 'A global network of physical devices equipped with sensors and network connectivity that share data autonomously.',
                  translations: { am: 'የእቃዎች በይነመረብ (IoT)', om: 'Waliingahi Meeshaalee (IoT)', ti: 'መርበብ ኣቑሑት (IoT)' }
                }
              ]
            }
          ]
        },
        {
          sectionNumber: '2.3',
          title: 'Cloud Computing Architecture & Models',
          textbookPages: 'pp. 47–54',
          learningOutcomes: ['Distinguish IaaS, PaaS, SaaS, and cloud deployment strategies.'],
          topics: [
            {
              id: 'it11-u2-t4',
              topicNumber: '2.3.1',
              topicTitle: 'Cloud Service Models: IaaS, PaaS, and SaaS',
              learningOutcome: 'Differentiate between Infrastructure, Platform, and Software as a Service.',
              originalMeaning: 'Cloud computing provides on-demand delivery of computing services over the internet with pay-as-you-go pricing. Infrastructure as a Service (IaaS) provides virtualized hardware (servers, storage). Platform as a Service (PaaS) provides development tools and runtime environments. Software as a Service (SaaS) delivers complete end-user applications.',
              studentExplanation: 'Think of transportation: IaaS is leasing an empty bus (you supply fuel, driver, route). PaaS is renting a taxi (driver and vehicle provided, you choose the destination). SaaS is taking a scheduled public bus (you just ride with other passengers).',
              textbookPage: 49,
              difficulty: 'Intermediate',
              prerequisites: [],
              knowledgeMapRelation: {
                dependsOn: [],
                leadsTo: ['it11-u4-t1'],
                conceptGroup: 'Cloud Architecture'
              },
              activity: {
                number: 'Activity 2.4',
                prompt: 'Classify Google Docs, Amazon EC2, Microsoft Windows Azure, and Gmail into IaaS, PaaS, or SaaS.',
                deliverable: 'Categorized classification table with architectural justification.'
              },
              keyConcepts: ['On-demand resource scaling', 'Public vs Private vs Hybrid Clouds', 'SaaS vs PaaS vs IaaS responsibility matrix'],
              keyTerms: [
                {
                  term: 'Cloud Computing',
                  definition: 'The delivery of computing services including servers, storage, databases, networking, and software over the internet.',
                  translations: { am: 'የደመና ኮምፒውቲንግ', om: 'Kompawutara Duumessaa', ti: 'ክላውድ ኮምፒውቲንግ' }
                },
                {
                  term: 'Software as a Service (SaaS)',
                  definition: 'A cloud model delivering ready-to-use software applications accessed over the web by end users.',
                  translations: { am: 'ሶፍትዌር እንደ አገልግሎት (SaaS)', om: 'Sooftiweerii akka Tajaajilaatti', ti: 'ሶፍትዌር ከም ኣገልግሎት' }
                }
              ]
            }
          ]
        }
      ],
      questionBank: [
        {
          id: 'it11-q-u2-01',
          type: 'multiple_choice',
          question: 'Which dimension of Big Data refers to the trustworthiness, accuracy, and reliability of the collected data?',
          options: ['Volume', 'Velocity', 'Veracity', 'Variety'],
          correctAnswer: 2,
          explanation: 'Veracity relates specifically to the quality, integrity, and trustworthiness of the data (Textbook p. 43).',
          textbookPage: 43,
          difficulty: 'Easy',
          skill: 'Conceptual Recall'
        },
        {
          id: 'it11-q-u2-02',
          type: 'multiple_choice',
          question: 'Which cloud service model provides virtualized servers, storage, and networking hardware for developers to configure from scratch?',
          options: ['SaaS', 'PaaS', 'IaaS', 'DaaS'],
          correctAnswer: 2,
          explanation: 'IaaS (Infrastructure as a Service) delivers fundamental compute and storage hardware infrastructure (Textbook p. 49).',
          textbookPage: 49,
          difficulty: 'Medium',
          skill: 'Analysis'
        }
      ],
      unitReviewQuestions: [
        '1. Explain the differences between Narrow AI and Artificial General Intelligence (AGI).',
        '2. Provide two practical applications where Augmented Reality is preferred over Virtual Reality in medical education.',
        '3. Describe each of the 5 Vs of Big Data with an example from a telecommunications provider.',
        '4. Contrast Public, Private, and Hybrid cloud deployment models.'
      ],
      unitAssessment: {
        title: 'Unit 2 Examination: Emerging Technologies',
        totalMarks: 25,
        instructions: 'Evaluate statements and apply cloud and AI models to technical scenarios.',
        questions: [
          {
            id: 'it11-exam-u2-01',
            type: 'true_false',
            question: 'True or False: In Augmented Reality (AR), the user’s physical environment is completely replaced with a 100% digital simulated environment.',
            correctAnswer: 'False',
            explanation: 'False. That describes Virtual Reality (VR). AR overlays digital content onto the real physical world (Textbook p. 38).',
            textbookPage: 38,
            difficulty: 'Easy',
            skill: 'Conceptual Accuracy'
          }
        ]
      }
    },

    // ----------------------------------------------------
    // UNIT 3: Database Management (pp. 55-84)
    // ----------------------------------------------------
    {
      unitNumber: 3,
      unitTitle: 'Unit 3: Database Management',
      pageRange: 'pp. 55–84',
      summary: 'Principles of Database Management Systems (DBMS), Relational Model, Entity-Relationship (ER) modeling, keys (Primary, Candidate, Foreign), integrity constraints, and Structured Query Language (SQL DDL and DML operations).',
      learningOutcomes: [
        'Differentiate file-based systems from modern Database Management Systems.',
        'Design Entity-Relationship Diagrams (ERDs) with entities, attributes, and relationships.',
        'Identify Primary, Foreign, Candidate, and Alternate keys in relational schemas.',
        'Enforce Entity, Referential, and Domain integrity rules.',
        'Write SQL commands: CREATE TABLE, INSERT INTO, SELECT, UPDATE, DELETE, and aggregate functions.'
      ],
      sections: [
        {
          sectionNumber: '3.1',
          title: 'Database Fundamentals & ER Modeling',
          textbookPages: 'pp. 55–66',
          learningOutcomes: ['Design conceptual ER diagrams using Crow’s Foot / Chen notation.'],
          topics: [
            {
              id: 'it11-u3-t1',
              topicNumber: '3.1.1',
              topicTitle: 'File Processing Systems vs. Relational DBMS',
              learningOutcome: 'Analyze limitations of file-based storage including data redundancy and inconsistency.',
              originalMeaning: 'Traditional file processing systems suffer from data redundancy (duplicate files), data inconsistency, difficult access, data isolation, integrity problems, and atomicity issues. A DBMS centralizes data, enforces constraints, and ensures ACID properties.',
              studentExplanation: 'If a student changes their phone number in a high school using paper folders, the registrar updates their copy, but the library and clinic still hold old records. A centralized relational database updates the single student record once, instantly reflecting across all school departments.',
              textbookPage: 57,
              difficulty: 'Beginner',
              prerequisites: ['it11-u1-t1'],
              knowledgeMapRelation: {
                dependsOn: ['it11-u1-t1'],
                leadsTo: ['it11-u3-t2'],
                conceptGroup: 'Database Foundations'
              },
              activity: {
                number: 'Activity 3.1',
                prompt: 'List three critical data problems experienced when managing an Ethiopian kebele residence record on paper spreadsheets.',
                deliverable: 'Problem analysis describing duplicate kebele IDs, conflicting marital status, and physical fire/loss vulnerabilities.'
              },
              keyConcepts: ['Data redundancy and inconsistency', 'Centralized control', 'ACID transaction properties'],
              keyTerms: [
                {
                  term: 'Database',
                  definition: 'An organized, persistent collection of logically related data structured for efficient retrieval and updates.',
                  translations: { am: 'ዳታቤዝ (የመረጃ ቋት)', om: 'Kuusaa Deetaa', ti: 'መዝገበ-ዳታ' }
                },
                {
                  term: 'DBMS',
                  definition: 'Software system that enables users to define, create, maintain, and control access to the database.',
                  translations: { am: 'የዳታቤዝ አስተዳደር ስርዓት (DBMS)', om: 'Sirna Bulchiinsa Kuusaa Deetaa', ti: 'ስርዓተ ምሕደራ መዝገበ-ዳታ' }
                }
              ]
            },
            {
              id: 'it11-u3-t2',
              topicNumber: '3.1.2',
              topicTitle: 'Entity-Relationship (ER) Modeling & Cardinality',
              learningOutcome: 'Construct ER diagrams representing entities, attributes, and relationships (1:1, 1:N, M:N).',
              originalMeaning: 'An Entity is a real-world object distinguishable from other objects. Attributes are properties describing the entity. Relationships represent associations between entities with specific cardinality ratios: One-to-One, One-to-Many, and Many-to-Many.',
              studentExplanation: 'In a school database: STUDENT and COURSE are entities. A student has attributes (StudentID, Name, DOB). A department has many teachers (1:N). A student enrolls in many courses, and a course has many students (M:N).',
              textbookPage: 63,
              difficulty: 'Intermediate',
              prerequisites: ['it11-u3-t1'],
              knowledgeMapRelation: {
                dependsOn: ['it11-u3-t1'],
                leadsTo: ['it11-u3-t3'],
                conceptGroup: 'Data Modeling'
              },
              workedExample: {
                problem: 'Draw the cardinality between TEACHER and CLASSROOM in a standard high school schedule.',
                solution: 'Assuming one teacher instructs one section at any given period: 1:1 during that period. Over an entire school week, one teacher teaches multiple sections (1:N).',
                explanation: 'Cardinality depends on business rules and temporal scope.'
              },
              activity: {
                number: 'Activity 3.2',
                prompt: 'Draw an ER diagram for a hospital clinic connecting PATIENT, DOCTOR, and PRESCRIPTION.',
                deliverable: 'ER diagram with rectangles (entities), ovals (attributes), diamonds (relationships), and cardinality ratios.'
              },
              keyConcepts: ['Entity vs Attribute', 'Derived and multi-valued attributes', 'Cardinality constraints (1:1, 1:N, M:N)'],
              keyTerms: [
                {
                  term: 'Entity',
                  definition: 'A distinct real-world object, person, place, or concept about which data is stored.',
                  translations: { am: 'ህላዌ (Entity)', om: 'Qaama / Entity', ti: 'ህላወ (Entity)' }
                },
                {
                  term: 'Primary Key',
                  definition: 'A candidate key chosen by the database designer to uniquely identify individual tuples in a relation.',
                  translations: { am: 'ዋና ቁልፍ (Primary Key)', om: 'Furtuu Guddaa', ti: 'ቀንዲ መፍትሕ' }
                }
              ]
            }
          ]
        },
        {
          sectionNumber: '3.2',
          title: 'Relational Model & Structured Query Language (SQL)',
          textbookPages: 'pp. 67–84',
          learningOutcomes: ['Write standard SQL queries for schema definition and data manipulation.'],
          topics: [
            {
              id: 'it11-u3-t3',
              topicNumber: '3.2.1',
              topicTitle: 'Keys and Integrity Constraints',
              learningOutcome: 'Enforce Entity Integrity, Referential Integrity, and Domain Integrity.',
              originalMeaning: 'Entity Integrity mandates that primary key attributes cannot contain NULL values. Referential Integrity ensures that foreign key values must match an existing primary key in the referenced relation or be NULL. Domain Integrity requires column values to adhere to defined data types and ranges.',
              studentExplanation: 'You cannot register a student without a StudentID (Entity Integrity). You cannot assign a student to a DepartmentID that does not exist in the Department table (Referential Integrity). A student’s age cannot be "Blue" or -5 (Domain Integrity).',
              textbookPage: 70,
              difficulty: 'Intermediate',
              prerequisites: ['it11-u3-t2'],
              knowledgeMapRelation: {
                dependsOn: ['it11-u3-t2'],
                leadsTo: ['it11-u3-t4'],
                conceptGroup: 'Relational Integrity'
              },
              activity: {
                number: 'Activity 3.3',
                prompt: 'Identify the primary key and foreign key in an Orders table containing: OrderID, CustomerID, OrderDate, TotalAmount.',
                deliverable: 'Key identification report confirming OrderID as Primary Key and CustomerID referencing Customers table as Foreign Key.'
              },
              keyConcepts: ['Entity integrity prevents null IDs', 'Foreign key guarantees parent record existence', 'Check constraints'],
              keyTerms: [
                {
                  term: 'Foreign Key',
                  definition: 'An attribute in one table that provides a link to the primary key in another table, enforcing referential integrity.',
                  translations: { am: 'የውጭ ቁልፍ (Foreign Key)', om: 'Furtuu Alaa', ti: 'ናይ ደገ መፍትሕ' }
                }
              ]
            },
            {
              id: 'it11-u3-t4',
              topicNumber: '3.2.2',
              topicTitle: 'SQL DDL and DML Queries',
              learningOutcome: 'Execute CREATE TABLE, INSERT, SELECT, UPDATE, DELETE, and aggregate functions.',
              originalMeaning: 'Data Definition Language (DDL) creates and modifies schema structures. Data Manipulation Language (DML) manages data instances. Aggregate functions (COUNT, SUM, AVG, MIN, MAX) perform calculations over multi-row data sets.',
              studentExplanation: 'SQL is the universal language for talking to relational databases. CREATE TABLE sets up the blueprint, INSERT adds rows, and SELECT retrieves filtered answers.',
              textbookPage: 76,
              difficulty: 'Advanced',
              prerequisites: ['it11-u3-t3'],
              knowledgeMapRelation: {
                dependsOn: ['it11-u3-t3'],
                leadsTo: ['it11-u4-t1'],
                conceptGroup: 'SQL Querying'
              },
              activity: {
                number: 'Activity 3.4',
                prompt: 'Work in pairs to write SQL statements that create a "Teachers" table with TeacherID, Name, Subject, and Experience, then insert 3 records.',
                deliverable: 'Written SQL script verified using syntax checklist.'
              },
              practicalExercise: {
                title: 'Lab 3.1: Creating and Querying a Student Table in MySQL',
                equipmentOrSoftware: 'MySQL Workbench or SQLite CLI',
                steps: [
                  '1. Type: CREATE TABLE Students (StudentID INT PRIMARY KEY, FullName VARCHAR(50), Grade INT, City VARCHAR(30));',
                  '2. Insert three records: INSERT INTO Students VALUES (101, "Abebe Bekele", 11, "Addis Ababa");',
                  '3. Query with filter: SELECT FullName FROM Students WHERE Grade = 11 AND City = "Addis Ababa";',
                  '4. Compute count: SELECT COUNT(*) FROM Students;'
                ],
                expectedOutcome: 'Successful table generation, record population, and filtered data output.'
              },
              keyConcepts: ['DDL vs DML statements', 'WHERE clause filtering', 'ORDER BY and GROUP BY aggregation'],
              keyTerms: [
                {
                  term: 'SQL (Structured Query Language)',
                  definition: 'The standard declarative computer language used to manage and query relational databases.',
                  translations: { am: 'ኤስ.ኪው.ኤል (SQL)', om: 'Afaan Gaaffii Caaseffamaa (SQL)', ti: 'ኤስ.ኪው.ኤል (SQL)' }
                }
              ]
            }
          ]
        }
      ],
      questionBank: [
        {
          id: 'it11-q-u3-01',
          type: 'multiple_choice',
          question: 'Which integrity rule states that no component of a Primary Key may be NULL?',
          options: ['Referential Integrity', 'Entity Integrity', 'Domain Integrity', 'Operational Integrity'],
          correctAnswer: 1,
          explanation: 'Entity Integrity dictates that a primary key must have unique, non-null values for every tuple (Textbook p. 70).',
          textbookPage: 70,
          difficulty: 'Medium',
          skill: 'Integrity Rules'
        },
        {
          id: 'it11-q-u3-02',
          type: 'multiple_choice',
          question: 'Which SQL command is used to change existing data in a table?',
          options: ['MODIFY', 'UPDATE', 'ALTER TABLE', 'CHANGE'],
          correctAnswer: 1,
          explanation: 'The UPDATE command is the DML statement used to modify existing row values in a table (Textbook p. 79).',
          textbookPage: 79,
          difficulty: 'Easy',
          skill: 'SQL Syntax'
        }
      ],
      unitReviewQuestions: [
        '1. Discuss three critical advantages of a DBMS over traditional file processing systems.',
        '2. Explain the role of an Entity-Relationship (ER) diagram in database development.',
        '3. Describe the distinction between Candidate Keys, Primary Keys, and Foreign Keys.',
        '4. Write the SQL query to find all students in Grade 11 who scored greater than 85, sorted alphabetically by name.'
      ],
      unitAssessment: {
        title: 'Unit 3 Practical Database Assessment',
        totalMarks: 30,
        instructions: 'Write the complete SQL statements for table creation, integrity enforcement, and queries.',
        questions: [
          {
            id: 'it11-exam-u3-01',
            type: 'coding',
            question: 'Write a valid SQL statement to create an Employee table with EmpID (Primary Key), Name (text), and Salary (decimal).',
            correctAnswer: 'CREATE TABLE Employee (EmpID INT PRIMARY KEY, Name VARCHAR(50), Salary DECIMAL(10,2));',
            explanation: 'Standard DDL syntax defining field data types and primary key constraint.',
            textbookPage: 77,
            difficulty: 'Medium',
            skill: 'SQL DDL'
          }
        ]
      }
    },

    // ----------------------------------------------------
    // UNIT 4: Web Development (pp. 85-114)
    // ----------------------------------------------------
    {
      unitNumber: 4,
      unitTitle: 'Unit 4: Web Development',
      pageRange: 'pp. 85–114',
      summary: 'Foundations of the World Wide Web, web architecture, design principles, HTML document structure, text formatting, hyperlinks, images, multimedia, tables, forms, and introductory CSS styling.',
      learningOutcomes: [
        'Understand client-server architecture, HTTP/HTTPS, DNS, and web standards.',
        'Apply website planning and usability principles (wireframing, navigation).',
        'Create valid HTML documents using semantic tags, headings, paragraphs, and lists.',
        'Embed hyperlinks, images, audio, and video.',
        'Design responsive HTML tables, user input forms, and apply CSS styling.'
      ],
      sections: [
        {
          sectionNumber: '4.1',
          title: 'Foundations of Web & HTML Basics',
          textbookPages: 'pp. 85–98',
          learningOutcomes: ['Understand web protocols and structure valid HTML5 pages.'],
          topics: [
            {
              id: 'it11-u4-t1',
              topicNumber: '4.1.1',
              topicTitle: 'How the Web Works & HTML Structure',
              learningOutcome: 'Diagram client-server interaction and write the skeleton of an HTML5 document.',
              originalMeaning: 'The Web operates on a client-server architecture where web browsers request pages over HTTP/HTTPS from remote web servers. DNS resolves domain names to IP addresses. HTML (HyperText Markup Language) is the standard markup language describing webpage structure.',
              studentExplanation: 'When you type www.moe.gov.et in your browser, DNS looks up the server IP, HTTP fetches the files, and your browser parses the HTML code to render text, images, and buttons.',
              textbookPage: 88,
              difficulty: 'Beginner',
              prerequisites: ['it11-u1-t1'],
              knowledgeMapRelation: {
                dependsOn: ['it11-u1-t1'],
                leadsTo: ['it11-u4-t2'],
                conceptGroup: 'Web Fundamentals'
              },
              workedExample: {
                problem: 'Write a basic valid HTML5 document structure with a title "My School".',
                solution: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My School</title>\n</head>\n<body>\n  <h1>Welcome to Grade 11</h1>\n  <p>Learning web design.</p>\n</body>\n</html>',
                explanation: 'A document must have DOCTYPE, html, head with title, and body containing rendered content.'
              },
              activity: {
                number: 'Activity 4.1',
                prompt: 'Open a web browser, right-click on any webpage, select "View Page Source", and locate the <!DOCTYPE html>, <head>, and <body> tags.',
                deliverable: 'Screenshots and a 3-sentence summary of the discovered tags.'
              },
              keyConcepts: ['Client-server model', 'DNS translation', 'Semantic HTML5 hierarchy'],
              keyTerms: [
                {
                  term: 'HTML',
                  definition: 'HyperText Markup Language used for structuring content on the World Wide Web.',
                  translations: { am: 'ኤች.ቲ.ኤም.ኤል (HTML)', om: 'Afaan Mallattoo Barreeffama Ol’aanaa (HTML)', ti: 'ኤች.ቲ.ኤም.ኤል (HTML)' }
                },
                {
                  term: 'URL',
                  definition: 'Uniform Resource Locator; the global address used to locate resources on the internet.',
                  translations: { am: 'ዩ.አር.ኤል (የድር አድራሻ)', om: 'Teessoo Qabeenya Waloomaa (URL)', ti: 'ናይ መርበብ ሓበሬታ ኣድራሻ' }
                }
              ]
            }
          ]
        },
        {
          sectionNumber: '4.2',
          title: 'Lists, Tables, Forms, and Introductory CSS',
          textbookPages: 'pp. 99–114',
          learningOutcomes: ['Construct functional forms with input validation and style with CSS.'],
          topics: [
            {
              id: 'it11-u4-t2',
              topicNumber: '4.2.1',
              topicTitle: 'HTML Forms and Input Elements',
              learningOutcome: 'Create user input forms with text, password, radio buttons, checkboxes, and submit buttons.',
              originalMeaning: 'HTML forms collect user input to be processed by a web server. The <form> element wraps inputs such as <input type="text">, <input type="password">, <input type="radio">, <input type="checkbox">, <select>, and <button type="submit">.',
              studentExplanation: 'When you log in to an educational portal or register for university entrance exams, you type your data into an HTML form. The form packages your inputs and securely sends them to the server.',
              textbookPage: 104,
              difficulty: 'Intermediate',
              prerequisites: ['it11-u4-t1'],
              knowledgeMapRelation: {
                dependsOn: ['it11-u4-t1'],
                leadsTo: ['it11-u4-t3'],
                conceptGroup: 'Web Interactivity'
              },
              activity: {
                number: 'Activity 4.3',
                prompt: 'Design a student club registration form on paper, identifying which HTML input types (text, radio, checkbox, submit) match each requested field.',
                deliverable: 'Sketched form design and corresponding HTML input tags mapped in notebook.'
              },
              practicalExercise: {
                title: 'Lab 4.1: Building a Student Registration Form in HTML',
                equipmentOrSoftware: 'Text editor (VS Code / Notepad) and Web Browser',
                steps: [
                  '1. Create a file named registration.html.',
                  '2. Add a <form action="#" method="post"> container.',
                  '3. Add input fields for Full Name, Email, Age (type="number"), and Gender (radio buttons).',
                  '4. Add a <select> dropdown for Grade (9, 10, 11, 12).',
                  '5. Add a Submit button: <button type="submit">Register Student</button>.',
                  '6. Open registration.html in your browser and test entering sample data.'
                ],
                expectedOutcome: 'A rendered interactive web form capable of collecting student details.'
              },
              keyConcepts: ['Form action and method (GET vs POST)', 'Label association using for and id', 'Required field validation'],
              keyTerms: [
                {
                  term: 'Form Element',
                  definition: 'An interactive HTML container used to collect and submit user data to a remote web server.',
                  translations: { am: 'የቅጽ አካል (Form Element)', om: 'Qabiyyee Foormii', ti: 'ኣካል ፎርም' }
                }
              ]
            },
            {
              id: 'it11-u4-t3',
              topicNumber: '4.2.2',
              topicTitle: 'Introduction to Cascading Style Sheets (CSS)',
              learningOutcome: 'Apply inline, internal, and external CSS to customize colors, fonts, margins, and borders.',
              originalMeaning: 'CSS describes how HTML elements should be presented on screen. The CSS box model consists of Margins, Borders, Padding, and the actual Content area.',
              studentExplanation: 'If HTML is the concrete and brick skeleton of a building, CSS is the paint, tile work, window styling, and architectural decoration that makes it attractive and welcoming.',
              textbookPage: 109,
              difficulty: 'Intermediate',
              prerequisites: ['it11-u4-t2'],
              knowledgeMapRelation: {
                dependsOn: ['it11-u4-t2'],
                leadsTo: ['it11-u6-t1'],
                conceptGroup: 'Styling & Design'
              },
              workedExample: {
                problem: 'Write CSS to set page background to light gray (#f4f4f4) and all h1 headings to navy blue.',
                solution: 'body { background-color: #f4f4f4; font-family: Arial, sans-serif; }\nh1 { color: #002b66; text-align: center; }',
                explanation: 'Selectors target HTML tags, followed by declaration blocks with properties and values.'
              },
              activity: {
                number: 'Activity 4.2',
                prompt: 'Apply the CSS box model to design a styled notification card with 15px padding, 2px solid green border, and 20px margin.',
                deliverable: 'A complete index.html and style.css project file.'
              },
              keyConcepts: ['CSS Selectors and Specificity', 'The Box Model (Margin, Border, Padding, Content)', 'Inline vs Internal vs External CSS'],
              keyTerms: [
                {
                  term: 'CSS',
                  definition: 'Cascading Style Sheets; a style sheet language used for describing the visual formatting of a document written in HTML.',
                  translations: { am: 'ሲ.ኤስ.ኤስ (CSS)', om: 'Afaan Haala Barreeffamaa (CSS)', ti: 'ሲ.ኤስ.ኤስ (CSS)' }
                },
                {
                  term: 'Box Model',
                  definition: 'A fundamental CSS design model defining the space around an element, consisting of content, padding, border, and margin.',
                  translations: { am: 'የቦክስ ሞዴል (Box Model)', om: 'Moodeela Saanduqaa', ti: 'ሞዴል ሳንዱቕ' }
                }
              ]
            }
          ]
        }
      ],
      questionBank: [
        {
          id: 'it11-q-u4-01',
          type: 'multiple_choice',
          question: 'Which HTML tag is used to create a numbered (ordered) list?',
          options: ['<ul>', '<ol>', '<li>', '<dl>'],
          correctAnswer: 1,
          explanation: '<ol> defines an ordered (numbered) list, while <ul> defines an unordered (bulleted) list (Textbook p. 95).',
          textbookPage: 95,
          difficulty: 'Easy',
          skill: 'HTML Tags'
        },
        {
          id: 'it11-q-u4-02',
          type: 'multiple_choice',
          question: 'In the CSS Box Model, what is the transparent space immediately between the element content and its border called?',
          options: ['Margin', 'Padding', 'Outline', 'Gutter'],
          correctAnswer: 1,
          explanation: 'Padding is the interior clearance space directly surrounding the content inside the border (Textbook p. 111).',
          textbookPage: 111,
          difficulty: 'Medium',
          skill: 'CSS Box Model'
        }
      ],
      unitReviewQuestions: [
        '1. Differentiate between HTML tags, elements, and attributes with two syntax examples.',
        '2. Explain the difference between absolute and relative file paths when embedding images with <img src="...">.',
        '3. Compare the three methods of linking CSS to an HTML document: Inline, Internal, and External.',
        '4. Describe the purpose of the action and method attributes in an HTML <form> element.'
      ],
      unitAssessment: {
        title: 'Unit 4 Web Development Project Assessment',
        totalMarks: 30,
        instructions: 'Build a two-page website for an Ethiopian youth science club with valid HTML5 and external CSS.',
        questions: [
          {
            id: 'it11-exam-u4-01',
            type: 'coding',
            question: 'Write an HTML snippet linking an external stylesheet named style.css inside the <head> block.',
            correctAnswer: '<link rel="stylesheet" href="style.css">',
            explanation: 'Standard syntax for linking external stylesheets.',
            textbookPage: 109,
            difficulty: 'Easy',
            skill: 'HTML Syntax'
          }
        ]
      }
    },

    // ----------------------------------------------------
    // UNIT 5: Hardware Troubleshooting and Maintenance (pp. 115-138)
    // ----------------------------------------------------
    {
      unitNumber: 5,
      unitTitle: 'Unit 5: Hardware Troubleshooting and Preventive Maintenance',
      pageRange: 'pp. 115–138',
      summary: 'Laboratory safety, Electrostatic Discharge (ESD) prevention, preventive maintenance schedules, structured diagnostic troubleshooting methodology, common hardware faults (RAM, power supply, overheating, display), and disk maintenance utilities.',
      learningOutcomes: [
        'Apply laboratory electrical safety and ESD prevention procedures.',
        'Execute preventive maintenance routines for monitors, keyboards, cooling fans, and system units.',
        'Follow the 6-step systematic troubleshooting diagnostic methodology.',
        'Diagnose computer failure symptoms (beep codes, BSOD, blank screen, thermal throttling).',
        'Use diagnostic tools and operating system maintenance utilities (defrag, disk cleanup).'
      ],
      sections: [
        {
          sectionNumber: '5.1',
          title: 'Safety Precautions, Tools, and Preventive Maintenance',
          textbookPages: 'pp. 115–124',
          learningOutcomes: ['Practice laboratory safety and prevent ESD damage to sensitive silicon chips.'],
          topics: [
            {
              id: 'it11-u5-t1',
              topicNumber: '5.1.1',
              topicTitle: 'Electrical Safety and Electrostatic Discharge (ESD) Prevention',
              learningOutcome: 'Use antistatic wrist straps and follow high-voltage safety rules.',
              originalMeaning: 'Electrostatic Discharge (ESD) is the sudden flow of static electricity between two objects caused by contact. A static shock imperceptible to humans (less than 3,000 volts) can instantly destroy sensitive computer microchips. Technicians must use antistatic mats, wrist straps, and unplug power cords before servicing.',
              studentExplanation: 'When you walk on carpet and touch a metal doorknob, you feel a tiny spark. If you touch a computer motherboard or RAM chip with that same static charge, you can permanently melt its microscopic silicon pathways.',
              textbookPage: 117,
              difficulty: 'Beginner',
              prerequisites: [],
              knowledgeMapRelation: {
                dependsOn: [],
                leadsTo: ['it11-u5-t2'],
                conceptGroup: 'Hardware Safety'
              },
              activity: {
                number: 'Activity 5.1',
                prompt: 'Inspect your school computer lab and identify three safety hazards (e.g., loose cables, lack of surge protectors, dust build-up).',
                deliverable: 'A safety audit checklist with corrective recommendations.'
              },
              keyConcepts: ['ESD voltage thresholds', 'Antistatic grounding equipment', 'High-voltage power supply hazards (never open a PSU)'],
              keyTerms: [
                {
                  term: 'ESD (Electrostatic Discharge)',
                  definition: 'The rapid discharge of static electricity that can damage microprocessors, memory modules, and circuitry.',
                  translations: { am: 'ኤሌክትሮስታቲክ ፈሳሽ (ESD)', om: 'Dhangala’aa Elektirooniksii', ti: 'ኤሌክትሮስታቲክ ፈሳሲ (ESD)' }
                },
                {
                  term: 'Preventive Maintenance',
                  definition: 'Regular, scheduled servicing of computer hardware and software to prevent unexpected breakdowns and extend operational lifespan.',
                  translations: { am: 'ቅድመ-መከላከል ጥገና', om: 'Suphaa Ittisaa', ti: 'ቅድመ-ምክልኻል ጽገና' }
                }
              ]
            }
          ]
        },
        {
          sectionNumber: '5.2',
          title: 'Systematic Troubleshooting & Hardware Diagnostics',
          textbookPages: 'pp. 125–138',
          learningOutcomes: ['Apply the step-by-step diagnostic model to isolate hardware faults.'],
          topics: [
            {
              id: 'it11-u5-t2',
              topicNumber: '5.2.1',
              topicTitle: 'The 6-Step Systematic Troubleshooting Process',
              learningOutcome: 'Identify problem, establish cause, test theory, implement fix, verify, and document.',
              originalMeaning: 'Professional troubleshooting requires a structured method: 1. Identify the problem (ask user, check logs); 2. Establish a theory of probable cause; 3. Test the theory to determine cause; 4. Establish a plan of action and implement the solution; 5. Verify full system functionality and implement preventive measures; 6. Document findings, actions, and outcomes.',
              studentExplanation: 'Never guess randomly and swap expensive parts. If a computer won’t turn on, first check simple things: Is the wall outlet powered? Is the cable plugged in? Then test the power switch, then the power supply.',
              textbookPage: 126,
              difficulty: 'Intermediate',
              prerequisites: ['it11-u5-t1'],
              knowledgeMapRelation: {
                dependsOn: ['it11-u5-t1'],
                leadsTo: ['it11-u5-t3'],
                conceptGroup: 'Diagnostic Methodology'
              },
              workedExample: {
                problem: 'A lab desktop powers on with fans spinning loudly, but the monitor displays "No Signal" accompanied by 1 continuous long beep and 2 short beeps.',
                solution: '1. Interpret BIOS beep code: Continuous/patterned beeps on POST indicate a memory (RAM) or display adapter initialization fault. 2. Action: Disconnect power, wear antistatic wrist strap, reseat the RAM sticks in their slots or clean golden contacts with an eraser. 3. Power on and verify display.',
                explanation: 'POST (Power-On Self-Test) beeps identify motherboard component failures before the video screen initializes.'
              },
              activity: {
                number: 'Activity 5.2',
                prompt: 'Document a troubleshooting ticket for a computer that turns off abruptly after 15 minutes of video editing.',
                deliverable: 'Diagnostic report identifying CPU overheating, dry thermal paste, or a clogged cooling fan as the probable cause.'
              },
              keyConcepts: ['POST and BIOS Beep Codes', 'Thermal paste and CPU heat sink maintenance', 'Documentation in IT helpdesks'],
              keyTerms: [
                {
                  term: 'Troubleshooting',
                  definition: 'A systematic approach to diagnosing and locating the root cause of a fault in a computer system and resolving it.',
                  translations: { am: 'ችግር ፈቺ ጥገና (ትረብልሹቲንግ)', om: 'Rakkoo Adda Baasuu fi Suphuu', ti: 'ፍታሕ ጸገማት (ትረብልሹቲንግ)' }
                },
                {
                  term: 'POST (Power-On Self-Test)',
                  definition: 'A diagnostic testing sequence executed by a computer\'s BIOS or UEFI firmware immediately after power-up.',
                  translations: { am: 'የመጀመሪያ ራስ-ምርመራ (POST)', om: 'Qorannoo Ofiisaa Jalqabaa', ti: 'ናይ መጀመርታ ርእሰ-ምርመራ' }
                }
              ]
            }
          ]
        }
      ],
      questionBank: [
        {
          id: 'it11-q-u5-01',
          type: 'multiple_choice',
          question: 'What is the very first step in the 6-step professional computer troubleshooting process?',
          options: ['Establish a plan of action', 'Test the theory to determine cause', 'Identify the problem', 'Document findings and outcomes'],
          correctAnswer: 2,
          explanation: 'Step 1 is always to identify the problem through user questioning and symptom observation (Textbook p. 126).',
          textbookPage: 126,
          difficulty: 'Easy',
          skill: 'Troubleshooting Steps'
        },
        {
          id: 'it11-q-u5-02',
          type: 'multiple_choice',
          question: 'Which tool should a computer technician wear to safely dissipate static electricity when replacing RAM?',
          options: ['Rubber gloves', 'Antistatic wrist strap', 'Magnetic ring', 'Woolen armband'],
          correctAnswer: 1,
          explanation: 'An antistatic wrist strap safely grounds the technician and protects circuits from ESD (Textbook p. 118).',
          textbookPage: 118,
          difficulty: 'Easy',
          skill: 'Safety Tools'
        }
      ],
      unitReviewQuestions: [
        '1. Explain why a technician should never open or attempt to service the interior of a computer Power Supply Unit (PSU).',
        '2. List the 6 steps of the systematic hardware troubleshooting process in chronological order.',
        '3. What does a repeating sequence of BIOS beep codes upon system startup indicate?',
        '4. Describe three routine preventive maintenance tasks that prolong the operational lifespan of high school computer lab equipment.'
      ],
      unitAssessment: {
        title: 'Unit 5 Practical Hardware Maintenance Assessment',
        totalMarks: 25,
        instructions: 'Diagnose real-world laboratory hardware fault scenarios and specify corrective actions.',
        questions: [
          {
            id: 'it11-exam-u5-01',
            type: 'short_answer',
            question: 'What is the common symptom of a CPU experiencing severe overheating due to dust in the heat sink?',
            correctAnswer: 'Sudden automatic shutdown or rebooting under load, accompanied by loud spinning fan noise.',
            explanation: 'Motherboard thermal sensors trigger protective emergency shutdowns to prevent permanent CPU damage (Textbook p. 131).',
            textbookPage: 131,
            difficulty: 'Medium',
            skill: 'Diagnosis'
          }
        ]
      }
    },

    // ----------------------------------------------------
    // UNIT 6: Fundamentals of Programming (pp. 139-168)
    // ----------------------------------------------------
    {
      unitNumber: 6,
      unitTitle: 'Unit 6: Fundamentals of Programming',
      pageRange: 'pp. 139–168',
      summary: 'Algorithm design, flowcharts, pseudocode, language translators (assemblers, compilers, interpreters), Python environment setup, variables, identifiers, data types, arithmetic/logical operators, input/output functions, decision control (if, elif, else), iteration (for, while loops), and modular functions.',
      learningOutcomes: [
        'Design algorithmic solutions using pseudocode and standard ISO flowchart symbols.',
        'Contrast compiled and interpreted programming languages.',
        'Write, run, and debug Python scripts using IDLE and standard command terminals.',
        'Use variables, dynamic data types (int, float, str, bool), and arithmetic operators.',
        'Implement conditional branch logic (if-elif-else) and iteration loops (while, for with range()).',
        'Define custom reusable functions with parameters and return statements.'
      ],
      sections: [
        {
          sectionNumber: '6.1',
          title: 'Algorithms, Flowcharts, and Language Translators',
          textbookPages: 'pp. 139–147',
          learningOutcomes: ['Design algorithms and standard flowcharts before writing source code.'],
          topics: [
            {
              id: 'it11-u6-t1',
              topicNumber: '6.1.1',
              topicTitle: 'Algorithms, Flowchart Symbols, and Translators',
              learningOutcome: 'Convert problem statements into pseudocode and standard flowcharts.',
              originalMeaning: 'An algorithm is a finite sequence of unambiguous, well-defined computer-implementable instructions to solve a problem. Flowcharts visually depict algorithms using standardized symbols: Oval (Start/End), Parallelogram (Input/Output), Rectangle (Process), Diamond (Decision). Translators convert high-level code to machine code: Compilers translate entire programs before execution; Interpreters translate line-by-line during runtime.',
              studentExplanation: 'Before building a house, an architect draws blueprints. An algorithm is the logic blueprint of your software. Python is an interpreted language, executing your instructions line-by-line.',
              textbookPage: 141,
              difficulty: 'Beginner',
              prerequisites: [],
              knowledgeMapRelation: {
                dependsOn: [],
                leadsTo: ['it11-u6-t2'],
                conceptGroup: 'Computational Thinking'
              },
              workedExample: {
                problem: 'Write pseudocode to find the largest of two numbers A and B entered by a user.',
                solution: '1. START\n2. INPUT A, B\n3. IF A > B THEN\n     PRINT "A is largest"\n   ELSE IF B > A THEN\n     PRINT "B is largest"\n   ELSE\n     PRINT "Both numbers are equal"\n4. END',
                explanation: 'A clear sequential algorithmic procedure handling all conditional branch cases.'
              },
              activity: {
                number: 'Activity 6.1',
                prompt: 'Draw a flowchart for an ATM machine checking if a requested withdrawal amount is less than or equal to the account balance.',
                deliverable: 'Flowchart diagram using ovals, parallelograms, rectangles, and a decision diamond.'
              },
              keyConcepts: ['Finiteness and definiteness of algorithms', 'Flowchart geometric symbols', 'Compiler vs Interpreter execution model'],
              keyTerms: [
                {
                  term: 'Algorithm',
                  definition: 'A step-by-step procedure or mathematical set of instructions designed to solve a specific problem.',
                  translations: { am: 'አልጎሪዝም (ደረጃ በደረጃ የስራ ቅደም-ተከተል)', om: 'Algoorizimii', ti: 'ኣልጎሪዝም' }
                },
                {
                  term: 'Interpreter',
                  definition: 'A language translator that executes instructions directly line-by-line without compiling into machine code first.',
                  translations: { am: 'ተርጓሚ (ኢንተርፕሪተር)', om: 'Hiikaa (Interpreter)', ti: 'ተርጋሚ' }
                }
              ]
            }
          ]
        },
        {
          sectionNumber: '6.2',
          title: 'Python Syntax, Variables, Operators, and I/O',
          textbookPages: 'pp. 148–156',
          learningOutcomes: ['Write interactive Python programs handling user input and arithmetic calculations.'],
          topics: [
            {
              id: 'it11-u6-t2',
              topicNumber: '6.2.1',
              topicTitle: 'Variables, Data Types, and Type Conversion in Python',
              learningOutcome: 'Declare variables, cast data types (int(), float()), and format output.',
              originalMeaning: 'Python is a dynamically typed language. Identifiers must begin with a letter or underscore. Fundamental data types include int (whole numbers), float (decimals), str (text enclosed in quotes), and bool (True or False). The input() function returns text that must be explicitly cast to numeric types for math.',
              studentExplanation: 'If you ask a user for their age: age = input("Enter age: "), Python stores "17" as text. If you try age + 1, Python produces an error. You must convert it: age = int(input("Enter age: ")).',
              textbookPage: 151,
              difficulty: 'Beginner',
              prerequisites: ['it11-u6-t1'],
              knowledgeMapRelation: {
                dependsOn: ['it11-u6-t1'],
                leadsTo: ['it11-u6-t3'],
                conceptGroup: 'Python Fundamentals'
              },
              activity: {
                number: 'Activity 6.2',
                prompt: 'Determine the expected data type (int, float, str, or bool) for the following: Number of students in Grade 11, Price of 1kg Teff in Birr, Student national exam registration code, and Whether school is in session today.',
                deliverable: 'A written table with the data item, value example, and Python data type.'
              },
              practicalExercise: {
                title: 'Lab 6.1: Currency Converter Script in Python',
                equipmentOrSoftware: 'Python 3 IDLE or VS Code',
                steps: [
                  '1. Open IDLE and create a new script file named converter.py.',
                  '2. Write code: usd_amount = float(input("Enter amount in USD: "))',
                  '3. Set exchange rate: rate = 120.50',
                  '4. Compute: etb_amount = usd_amount * rate',
                  '5. Output: print(f"{usd_amount} USD is equal to {etb_amount:.2f} Ethiopian Birr (ETB)")',
                  '6. Run the script and test with input 50.'
                ],
                expectedOutcome: 'Accurate currency conversion calculated and displayed with formatted decimal output.'
              },
              keyConcepts: ['Dynamic typing', 'Explicit type casting int() / float()', 'String formatting with f-strings'],
              keyTerms: [
                {
                  term: 'Variable',
                  definition: 'A named storage location in computer memory that holds a data value which can change during program execution.',
                  translations: { am: 'ተለዋዋጭ (Variable)', om: 'Jijjiiramaa (Variable)', ti: 'ተለዋዋጢ' }
                }
              ]
            }
          ]
        },
        {
          sectionNumber: '6.3',
          title: 'Control Structures: Conditionals and Loops in Python',
          textbookPages: 'pp. 157–168',
          learningOutcomes: ['Build branching decisions and iterative loops with Python.'],
          topics: [
            {
              id: 'it11-u6-t3',
              topicNumber: '6.3.1',
              topicTitle: 'Conditional Statements: if, elif, else',
              learningOutcome: 'Construct multi-branch decision structures using comparison and logical operators.',
              originalMeaning: 'Conditional statements control program flow based on boolean expressions. Python uses mandatory 4-space indentation to define code blocks instead of curly braces. Multi-way branching is handled with if, elif, and else.',
              studentExplanation: 'Indentations matter in Python. If your code is indented underneath an if condition, it only executes when that condition evaluates to True.',
              textbookPage: 159,
              difficulty: 'Intermediate',
              prerequisites: ['it11-u6-t2'],
              knowledgeMapRelation: {
                dependsOn: ['it11-u6-t2'],
                leadsTo: ['it11-u6-t4'],
                conceptGroup: 'Control Flow'
              },
              workedExample: {
                problem: 'Write a Python program to assign a letter grade based on an exam mark (>=90: A, >=80: B, >=70: C, Else: F).',
                solution: 'mark = float(input("Enter student mark (0-100): "))\nif mark >= 90:\n    print("Grade: A")\nelif mark >= 80:\n    print("Grade: B")\nelif mark >= 70:\n    print("Grade: C")\nelse:\n    print("Grade: F")',
                explanation: 'Sequential elif statements evaluate until the first matching condition evaluates to True.'
              },
              activity: {
                number: 'Activity 6.2',
                prompt: 'Write a Python program that checks if an entered integer is positive, negative, or zero, and even or odd.',
                deliverable: 'A Python script demonstrating nested if statements.'
              },
              keyConcepts: ['Indentation syntax in Python', 'Comparison operators (==, !=, >, <, >=, <=)', 'Logical operators (and, or, not)'],
              keyTerms: [
                {
                  term: 'Indentation',
                  definition: 'Spaces at the beginning of a code line used in Python to delimit blocks of code.',
                  translations: { am: 'ኢንደንቴሽን (የመስመር ክፍተት)', om: 'Siqsuu / Indentation', ti: 'ናይ መስመር ክፍተት' }
                }
              ]
            },
            {
              id: 'it11-u6-t4',
              topicNumber: '6.3.2',
              topicTitle: 'Iteration Loops: for and while',
              learningOutcome: 'Automate repetitive tasks using while condition loops and for loops with range().',
              originalMeaning: 'Loops execute a block of statements repeatedly. A while loop repeats as long as a condition remains True. A for loop iterates over a sequence (such as numbers generated by range(start, stop, step)). Loop control statements include break (terminates loop) and continue (skips to next iteration).',
              studentExplanation: 'To print numbers 1 to 100, do not write 100 print statements. A for loop with range(1, 101) completes the task in two lines.',
              textbookPage: 164,
              difficulty: 'Advanced',
              prerequisites: ['it11-u6-t3'],
              knowledgeMapRelation: {
                dependsOn: ['it11-u6-t3'],
                leadsTo: [],
                conceptGroup: 'Iteration & Automation'
              },
              activity: {
                number: 'Activity 6.4',
                prompt: 'Compare a while loop and a for loop: when would you use a while loop instead of a for loop with range()? Write one real-life scenario for each.',
                deliverable: 'A comparative explanation with pseudocode examples.'
              },
              practicalExercise: {
                title: 'Lab 6.2: Multiplication Table Generator in Python',
                equipmentOrSoftware: 'Python 3 IDLE',
                steps: [
                  '1. Create a script named mult_table.py.',
                  '2. Prompt user: num = int(input("Enter an integer: "))',
                  '3. Use a for loop: for i in range(1, 13):',
                  '4. Print formatted multiplication: print(f"{num} x {i} = {num * i}")',
                  '5. Run script and enter 7 to verify the table of 7 up to 7x12.'
                ],
                expectedOutcome: 'Automated 12-line multiplication table printed to console.'
              },
              keyConcepts: ['Condition-controlled vs count-controlled loops', 'The range() function parameters', 'Avoiding infinite while loops'],
              keyTerms: [
                {
                  term: 'Loop (Iteration)',
                  definition: 'A control structure that repeats a sequence of instructions until a specified condition is satisfied.',
                  translations: { am: 'ዙር / ድግግሞሽ (Loop)', om: 'Marsaa (Loop)', ti: 'ድግግሞሽ (Loop)' }
                }
              ]
            }
          ]
        }
      ],
      questionBank: [
        {
          id: 'it11-q-u6-01',
          type: 'multiple_choice',
          question: 'What is the output of the Python expression: print(type(15.5))?',
          options: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'double'>"],
          correctAnswer: 1,
          explanation: 'Numbers with fractional decimal points in Python belong to the float data type (Textbook p. 151).',
          textbookPage: 151,
          difficulty: 'Easy',
          skill: 'Python Types'
        },
        {
          id: 'it11-q-u6-02',
          type: 'coding',
          question: 'Write a Python program that uses a while loop to print even numbers from 2 to 10 inclusive.',
          correctAnswer: 'n = 2\nwhile n <= 10:\n    print(n)\n    n += 2',
          explanation: 'Initializes n at 2, checks condition n <= 10, prints n, and increments by 2 each iteration.',
          textbookPage: 163,
          difficulty: 'Medium',
          skill: 'Loop Construction'
        }
      ],
      unitReviewQuestions: [
        '1. Differentiate between a compiler and an interpreter with respect to execution speed and error reporting.',
        '2. Draw the 4 standard flowchart symbols and state their precise geometric meanings.',
        '3. Explain why Python requires proper indentation and what error occurs if indentation is inconsistent.',
        '4. Write a Python script to calculate the sum and average of 5 marks entered by a teacher.'
      ],
      unitAssessment: {
        title: 'Unit 6 Capstone Programming Examination',
        totalMarks: 35,
        instructions: 'Solve algorithmic design problems and write syntactically correct Python code.',
        questions: [
          {
            id: 'it11-exam-u6-01',
            type: 'coding',
            question: 'Write a Python function named calculate_area(length, width) that returns the area of a rectangle.',
            correctAnswer: 'def calculate_area(length, width):\n    return length * width',
            explanation: 'Uses standard def keyword, parameter list, and return statement.',
            textbookPage: 167,
            difficulty: 'Medium',
            skill: 'Function Definition'
          }
        ]
      }
    }
  ]
};

/**
 * NUR AI 14 CORE FEATURES IMPLEMENTATION ENGINE & METADATA
 */
export const nurAIFeaturesGrade11IT = [
  {
    id: 'ai-tutor',
    name: 'AI Personal Tutor',
    description: 'Conversational 1-on-1 AI tutor strictly grounded in the Grade 11 IT textbook.',
    multilingualGreeting: {
      en: 'Hello! I am your NUR AI IT Tutor for Grade 11. Which unit or topic would you like to master today?',
      am: 'ሰላም! እኔ የ11ኛ ክፍል የኢንፎርሜሽን ቴክኖሎጂ AI የግል አስተማሪህ ነኝ። ዛሬ የትኛውን ምዕራፍ ማጥናት ትፈልጋለህ?',
      om: 'Akkam! Ani barsiisaa AI barnoota Saayinsii Kompiwitaraa kutaa 11ti. Har\'a mata-duree kam barachuu barbaadda?',
      ti: 'ሰላም! ኣነ ናይ 11 ክፍሊ ናይ ኢንፎርሜሽን ቴክኖሎጂ AI መምህርካ እየ። ሎሚ ኣየናይ ምዕራፍ ክትመሃር ትደሊ?'
    },
    systemPrompt: `You are the NUR AI High School IT Tutor for Ethiopian Grade 11 students. 
Strictly use the Grade 11 Information Technology Student Textbook (168 pages, 2023 FDRE MoE) as your primary knowledge source. 
Always provide the exact textbook page and chapter reference. 
If a user asks about topics outside this curriculum (e.g. quantum cryptography, high-frequency trading), politely state:
"This information is not covered in your Grade 11 Information Technology textbook."`
  },
  {
    id: 'ask-textbook',
    name: 'Ask the Textbook',
    description: 'Semantic citation search that locates exact paragraph and page citations for any curriculum query.'
  },
  {
    id: 'ai-explanation',
    name: 'AI Explanation Generator',
    description: 'Breaks down complex computing concepts (e.g. 5 Vs of Big Data, ERD Cardinality, SQL Joins) into simple real-world analogies.'
  },
  {
    id: 'ai-quiz-generator',
    name: 'AI Quiz Generator',
    description: 'Dynamically generates 5-to-10 question formative quizzes filtered by unit, difficulty, and skill.'
  },
  {
    id: 'exam-generator',
    name: 'National Exam Generator',
    description: 'Generates mock matriculation and semester exams conforming strictly to the Ethiopian MoE blueprint.'
  },
  {
    id: 'practical-assistant',
    name: 'Practical Exercise Assistant',
    description: 'Step-by-step guidance for computer laboratory exercises (MySQL, HTML/CSS, PC assembly, thermal paste application).'
  },
  {
    id: 'coding-tutor',
    name: 'Python Coding Tutor',
    description: 'Interactive Python code reviewer that pinpoints syntax errors, indentation mistakes, and logic bugs with hints.'
  },
  {
    id: 'photo-solver',
    name: 'Photo Question Solver',
    description: 'OCR & multimodal analysis to parse textbook diagram photos, flowcharts, or printed exam questions.'
  },
  {
    id: 'voice-tutor',
    name: 'Voice Tutor',
    description: 'Speech-to-text and text-to-speech audio tutoring in English, Amharic, Afaan Oromo, and Tigrinya.'
  },
  {
    id: 'knowledge-map',
    name: 'Interactive Knowledge Map',
    description: 'Visual graph showing competency pathways (e.g. Data -> Information -> Databases -> SQL -> Python File I/O).'
  },
  {
    id: 'adaptive-learning',
    name: 'Adaptive Learning Engine',
    description: 'Calibrates question difficulty (Beginner to Advanced) in real-time based on student response accuracy.'
  },
  {
    id: 'weak-topic-detector',
    name: 'Weak-Topic Detection',
    description: 'Analyzes quiz and exam mistakes to highlight specific sub-topics requiring targeted revision.'
  },
  {
    id: 'progress-tracking',
    name: 'Progress & Competency Tracking',
    description: 'Quantifies unit completion percentage, coding lab submissions, and mastery levels.'
  },
  {
    id: 'offline-learning',
    name: 'Offline Learning & PWA Storage',
    description: 'Enables complete offline operation via indexed client-side cache and Firestore offline persistence.'
  }
];

/**
 * FIRESTORE-READY EXPORT SCHEMAS (For Flutter + Node.js + AI/RAG)
 */
export const firestoreSchemaBlueprint = {
  collections: {
    courses: {
      documentId: 'grade11_information_technology',
      fields: {
        grade: 11,
        subject: 'Information Technology',
        totalUnits: 6,
        totalPages: 168,
        authors: ['Temtim Assefa Desta (PhD)', 'Miftah Hassen Jemal'],
        publisher: 'FDRE Ministry of Education (2023)'
      },
      subcollections: {
        units: 'Contains unit documents unit_1 to unit_6 with sections, topics, and objectives.',
        rag_chunks: 'Contains vector-ready text passages with metadata (grade, subject, unit, page, keywords).',
        question_bank: 'Standardized queryable assessment items with types and difficulty tags.',
        student_progress: 'Tracks individual student mastery, quiz scores, and weak-topic flags.'
      }
    }
  }
};
