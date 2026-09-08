import {
  CurriculumSubjectItem,
  CurriculumQuestion,
  SubjectKnowledgeMap,
} from '../types/curriculumEngine';

export const ETHIOPIAN_CURRICULUM_SUBJECTS: CurriculumSubjectItem[] = [
  // ===================== GRADE 9 MATHEMATICS =====================
  {
    id: 'math-g9',
    code: 'MATH-G9',
    grade: 9,
    stream: 'common',
    name: {
      en: 'Mathematics Grade 9',
      am: 'ሒሳብ 9ኛ ክፍል',
      om: 'Herrega Kutaa 9',
      ti: 'ሒሳብ ክፍሊ 9',
    },
    textbookTitle: 'Mathematics Student Textbook Grade 9',
    textbookPublisher: 'Federal Democratic Republic of Ethiopia Ministry of Education',
    curriculumEdition: 'New Curriculum (አዲሱ ሥርዓተ-ትምህርት)',
    officialPdfUrl: '/textbooks/math/grade-9.pdf',
    totalUnits: 7,
    units: [
      {
        id: 'math-g9-u1',
        unitNumber: 1,
        title: {
          en: 'The Number System (Further on Real Numbers)',
          am: 'የቁጥር ሥርዓት (ስለ እውነተኛ ቁጥሮች ዝርዝር)',
          om: 'Sirna Lakkoofsaa (Lakkoofsota Dhugaa)',
          ti: 'ስርዓተ ቍጽሪ (ብዛዕባ ሓቀኛታት ቍጽርታት)',
        },
        description: 'Comprehensive study of sets, rational numbers, irrational numbers, real numbers, and their algebraic properties.',
        allocatedPeriods: 20,
        textbookPageStart: 1,
        textbookPageEnd: 38,
        sections: [
          {
            id: 'math-g9-u1-s1',
            sectionNumber: '1.1',
            title: {
              en: 'Revision on Sets and Operations',
              am: 'ስለ ስብስቦችና ክንዋኔዎቻቸው ክለሳ',
              om: 'Itti fayyadama fi Hojiiwwan Tuutotaa',
              ti: 'ምድጋም ብዛዕባ ስብስባትን ተግባራቶምን',
            },
            textbookPageStart: 2,
            textbookPageEnd: 12,
            lessons: [
              {
                id: 'math-g9-u1-s1-l1',
                lessonNumber: 'Lesson 1.1',
                title: {
                  en: 'Set Notation, Universal Set, and Subsets',
                  am: 'የስብስብ አጻጻፍ፣ ጠቅላላ ስብስብ እና ንዑስ ስብስቦች',
                  om: 'Barreeffama Tuuta, Tuuta Waliigalaa fi Tuut-xiqqaa',
                  ti: 'ኣጸሓሕፋ ስብስብ፣ ጠቕላላ ስብስብን ንኡሳን ስብስባትን',
                },
                periodCount: 2,
                textbookPageStart: 2,
                textbookPageEnd: 6,
                topics: [
                  {
                    id: 'math-g9-u1-top1',
                    topicNumber: '1.1.1',
                    title: {
                      en: 'Representation of Sets & Cardinality',
                      am: 'ስብስቦችን የመግለጫ መንገዶችና የንዑሳን ቁጥር',
                      om: 'Agarsiisa Tuutotaa fi Baay\'ina Miseensotaa',
                      ti: 'ስብስባት ምግላጽን በዝሒ ኣባላትን',
                    },
                    summary: 'Sets can be described using listing (roster) method or set-builder notation. Cardinality n(A) counts distinct elements.',
                    textbookPage: 3,
                    difficulty: 'easy',
                    prerequisites: [],
                    learningOutcomes: [
                      {
                        id: 'lo-math9-01',
                        code: 'LO-M9-U1-01',
                        description: {
                          en: 'Define sets, write them in roster and set-builder notations, and compute cardinality.',
                          am: 'ስብስቦችን መግለጽ፣ በዝርዝር እና በስብስብ ገላጭ ዘዴ መጻፍ እንዲሁም የንዑሳንን ብዛት ማስላት።',
                          om: 'Tuutota ibsuu, karaa tarreessuutiin fi unka tuutaatiin barreessuu.',
                          ti: 'ስብስባት ምግላጽ፣ ብዝርዝርን ብስብስብ ገላጺ ሜላን ምጽሓፍ።',
                        },
                        bloomLevel: 'understand',
                      },
                    ],
                    explanations: {
                      overview: 'A set is a well-defined collection of distinct objects. If every element of set A belongs to set B, then A is a subset of B (A ⊆ B).',
                      coreConcepts: [
                        'Roster notation lists elements: A = {2, 3, 5, 7}',
                        'Set-builder notation specifies rule: B = {x ∈ ℝ | x² = 4}',
                        'Empty set ∅ has cardinality 0; Universal set U contains all contextual elements.',
                      ],
                      deepDive: 'Number of subsets of a set with n elements is 2ⁿ; proper subsets count is 2ⁿ - 1.',
                    },
                    examples: [
                      {
                        id: 'ex-math9-1',
                        title: 'Finding Cardinality and Power Set Size',
                        problem: 'Let S = {x | x is a prime number and x < 10}. Determine n(S) and the number of subsets.',
                        solution: 'Prime numbers less than 10 are {2, 3, 5, 7}. Hence n(S) = 4. Number of subsets = 2⁴ = 16.',
                        methodology: 'First list elements explicitly, count distinct members, and apply the 2ⁿ power set formula.',
                        textbookPage: 4,
                      },
                    ],
                    activities: [
                      {
                        id: 'act-math9-1',
                        activityNumber: 'Activity 1.1',
                        title: 'Venn Diagram Exploration of Classroom Demographics',
                        objective: 'Classify students who study Natural Science vs Social Science using set operations.',
                        instructions: [
                          'Group students into two sets A (studying Physics) and B (studying History).',
                          'Identify common members A ∩ B and calculate A ∪ B.',
                          'Draw a labeled Venn diagram on the chalkboard.',
                        ],
                        expectedObservation: 'The intersection identifies students taking elective cross-stream units.',
                        textbookPage: 5,
                      },
                    ],
                    exercises: [
                      {
                        id: 'exer-math9-1',
                        exerciseNumber: 'Exercise 1.1',
                        title: 'Set Identification Problems',
                        problems: [
                          {
                            questionNumber: '1',
                            text: 'Which of the following are well-defined sets? (a) Collection of tall students in Ethiopia (b) Even integers between 1 and 15.',
                            hint: 'Well-defined means whether any element belongs is unambiguous.',
                            answer: '(a) Not well-defined (subjective); (b) Well-defined set {2, 4, 6, 8, 10, 12, 14}.',
                          },
                        ],
                        textbookPage: 6,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        unitReview: {
          summaryPoints: [
            'Real numbers ℝ comprise rational numbers ℚ and irrational numbers ℚ\'.',
            'Rational numbers can be written as a/b where a, b ∈ ℤ and b ≠ 0 (terminating or repeating decimals).',
            'Irrational numbers cannot be expressed as a ratio of integers (non-terminating, non-repeating decimals such as √2, π).',
          ],
          keyTerms: [
            { term: 'Set', definition: 'A well-defined collection of distinct objects or elements.' },
            { term: 'Rational Number', definition: 'Any number that can be expressed in the form a/b where a, b are integers and b ≠ 0.' },
            { term: 'Irrational Number', definition: 'A real number that cannot be written as a quotient of integers.' },
          ],
          reviewQuestions: [
            'State whether 0.333... is rational or irrational and give proof.',
            'Given U = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}, A = {2, 4, 6, 8, 10}, B = {1, 2, 3, 4, 5}, find (A ∪ B)\'.',
          ],
          textbookPage: 36,
        },
        unitAssessment: {
          title: 'Unit 1 Comprehensive Assessment: Number System',
          instructions: 'Answer all multiple choice, fill in the blank, and short answer problems accurately.',
          durationMinutes: 45,
          totalMarks: 30,
          textbookPage: 37,
          questions: [],
        },
      },
      {
        id: 'math-g9-u2',
        unitNumber: 2,
        title: {
          en: 'Solving Equations and Inequalities',
          am: 'እኩልታዎችን እና አለመመጣጠኖችን መፍታት',
          om: 'Qixxattoowwan fi Walqixxee-dhabeeyyii Hiikuu',
          ti: 'ማዕረነትን ዘይማዕረነትን ምፍታሕ',
        },
        description: 'Linear equations, systems of linear equations in two variables, quadratic equations by factoring and quadratic formula, and linear inequalities.',
        allocatedPeriods: 24,
        textbookPageStart: 39,
        textbookPageEnd: 82,
        sections: [],
        unitReview: {
          summaryPoints: [
            'A linear equation in one variable has the general form ax + b = 0 where a ≠ 0.',
            'Quadratic equations ax² + bx + c = 0 can be solved using factoring, completing the square, or the quadratic formula x = (-b ± √(b² - 4ac)) / (2a).',
          ],
          keyTerms: [
            { term: 'Discriminant', definition: 'The value Δ = b² - 4ac that dictates whether roots are two distinct real, one repeated, or non-real.' },
          ],
          reviewQuestions: ['Solve 2x² - 5x + 3 = 0 using the quadratic formula.'],
          textbookPage: 80,
        },
        unitAssessment: {
          title: 'Unit 2 Assessment',
          instructions: 'Solve algebraic problems showing clear mathematical justification.',
          durationMinutes: 40,
          textbookPage: 81,
          questions: [],
        },
      },
    ],
  },

  // ===================== GRADE 9 PHYSICS =====================
  {
    id: 'physics-g9',
    code: 'PHYS-G9',
    grade: 9,
    stream: 'common',
    name: {
      en: 'Physics Grade 9',
      am: 'ፊዚክስ 9ኛ ክፍል',
      om: 'Fiiziksii Kutaa 9',
      ti: 'ፊዚክስ ክፍሊ 9',
    },
    textbookTitle: 'Physics Student Textbook Grade 9',
    textbookPublisher: 'Federal Democratic Republic of Ethiopia Ministry of Education',
    curriculumEdition: 'New Curriculum (አዲሱ ሥርዓተ-ትምህርት)',
    officialPdfUrl: '/textbooks/physics/grade-9.pdf',
    totalUnits: 6,
    units: [
      {
        id: 'phys-g9-u1',
        unitNumber: 1,
        title: {
          en: 'Physics and Human Society',
          am: 'ፊዚክስ እና የሰው ልጅ ማህበረሰብ',
          om: 'Fiiziksii fi Hawaasa Dhala Namaa',
          ti: 'ፊዚክስን ሕብረተሰብ ደቂ-ሰብን',
        },
        description: 'Introduction to physics, branches of physics, scientific methods, physical quantities, standards, and international system of units (SI).',
        allocatedPeriods: 18,
        textbookPageStart: 1,
        textbookPageEnd: 28,
        sections: [
          {
            id: 'phys-g9-u1-s1',
            sectionNumber: '1.1',
            title: {
              en: 'Definition and Branches of Physics',
              am: 'የፊዚክስ ትርጉም እና ቅርንጫፎች',
              om: 'Hiika fi Dameewwan Fiiziksii',
              ti: 'ትርጉምን ጨናፍርን ፊዚክስ',
            },
            textbookPageStart: 2,
            textbookPageEnd: 10,
            lessons: [
              {
                id: 'phys-g9-u1-s1-l1',
                lessonNumber: 'Lesson 1.1',
                title: {
                  en: 'Physical Quantities and Measurement',
                  am: 'አካላዊ መጠኖች እና ልኬት',
                  om: 'Hammamtoota Fiizikaalaa fi Safara',
                  ti: 'ኣካላዊ መለክዒታትን ምዕቃንን',
                },
                periodCount: 2,
                textbookPageStart: 2,
                textbookPageEnd: 7,
                topics: [
                  {
                    id: 'phys-g9-u1-top1',
                    topicNumber: '1.1.1',
                    title: {
                      en: 'Fundamental and Derived Quantities',
                      am: 'መሰረታዊ እና ተውሳክ አካላዊ መጠኖች',
                      om: 'Hammamtoota Bu\'uuraa fi Maddee',
                      ti: 'መሰረታውያንን ዝተረኽቡን ኣካላዊ መለክዒታት',
                    },
                    summary: 'Physical quantities are measurable properties. Fundamental quantities (Length, Mass, Time, Current, Temperature, Amount of substance, Luminous intensity) cannot be defined in terms of other quantities.',
                    textbookPage: 4,
                    difficulty: 'easy',
                    prerequisites: [],
                    learningOutcomes: [
                      {
                        id: 'lo-phys9-01',
                        code: 'LO-P9-U1-01',
                        description: {
                          en: 'Distinguish between base and derived physical quantities and cite their SI units.',
                          am: 'በመሰረታዊ እና በተውሳክ አካላዊ መጠኖች መካከል ያለውን ልዩነት መለየትና የSI መለኪያዎቻቸውን መጥቀስ።',
                          om: 'Hammamtoota bu\'uuraa fi maddee gargar baasuu.',
                          ti: 'መሰረታውያንን ዝተረኽቡን መለክዒታት ምፍላይ።',
                        },
                        bloomLevel: 'understand',
                      },
                    ],
                    explanations: {
                      overview: 'Physics is the empirical study of matter, energy, and their mutual interactions. Quantities requiring no other definitions are base quantities.',
                      coreConcepts: [
                        'Seven Base SI Quantities: meter (m), kilogram (kg), second (s), ampere (A), kelvin (K), mole (mol), candela (cd).',
                        'Derived quantities are formed by mathematical combinations of base quantities (e.g. Velocity = m/s, Force = kg·m/s² = N).',
                        'Prefixes scale quantities exponentially: micro (10⁻⁶), milli (10⁻³), kilo (10³), mega (10⁶).',
                      ],
                      deepDive: 'Dimensional analysis checks equation consistency: both sides of an equality must possess identical base dimensions [M][L][T].',
                    },
                    examples: [
                      {
                        id: 'ex-phys9-1',
                        title: 'Deriving the SI Unit of Pressure',
                        problem: 'Using Pressure P = Force / Area, express the Pascal (Pa) in base SI units.',
                        solution: 'Force = Mass × Acceleration = kg × (m/s²) = kg·m·s⁻². Area = m². Pressure = (kg·m·s⁻²) / m² = kg·m⁻¹·s⁻².',
                        methodology: 'Substitute base units into the governing physical equation and simplify exponents algebraically.',
                        textbookPage: 6,
                      },
                    ],
                    activities: [
                      {
                        id: 'act-phys9-1',
                        activityNumber: 'Activity 1.2',
                        title: 'Precision Measurements with Vernier Caliper and Micrometer',
                        objective: 'Measure the diameter and thickness of an Ethiopian 1-Birr coin.',
                        instructions: [
                          'Determine the zero error of the Vernier caliper.',
                          'Place the 1-Birr coin between the jaws and read the main scale and vernier scale.',
                          'Repeat with a micrometer screw gauge and compare precision.',
                        ],
                        materials: ['1-Birr coin', 'Vernier caliper', 'Micrometer screw gauge'],
                        expectedObservation: 'The micrometer achieves precision up to 0.01 mm, reducing measurement uncertainty.',
                        textbookPage: 8,
                      },
                    ],
                    exercises: [
                      {
                        id: 'exer-phys9-1',
                        exerciseNumber: 'Exercise 1.2',
                        title: 'SI Conversion Practice',
                        problems: [
                          {
                            questionNumber: '1',
                            text: 'Convert a density of 2.7 g/cm³ into standard SI units (kg/m³).',
                            hint: '1 g = 10⁻³ kg and 1 cm³ = 10⁻⁶ m³.',
                            answer: '2.7 × (10⁻³ kg) / (10⁻⁶ m³) = 2700 kg/m³.',
                          },
                        ],
                        textbookPage: 9,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        unitReview: {
          summaryPoints: [
            'Physics establishes universal quantitative laws describing nature.',
            'Measurement errors include systematic errors (calibrations) and random errors (parallax, environmental fluctuations).',
            'Significant figures communicate the precision limit of scientific instruments.',
          ],
          keyTerms: [
            { term: 'Base Quantity', definition: 'An independent physical quantity from which other quantities are derived.' },
            { term: 'Precision', definition: 'The degree of closeness of repeated independent measurements under unchanged conditions.' },
          ],
          reviewQuestions: ['Why is the SI system advantageous in global scientific communication?'],
          textbookPage: 26,
        },
        unitAssessment: {
          title: 'Unit 1 Physics Assessment',
          instructions: 'Calculate with proper units and state all physical principles clearly.',
          durationMinutes: 40,
          textbookPage: 27,
          questions: [],
        },
      },
    ],
  },

  // ===================== GRADE 9 CHEMISTRY =====================
  {
    id: 'chemistry-g9',
    code: 'CHEM-G9',
    grade: 9,
    stream: 'common',
    name: {
      en: 'Chemistry Grade 9',
      am: 'ኬሚስትሪ 9ኛ ክፍል',
      om: 'Keemistirii Kutaa 9',
      ti: 'ኬሚስትሪ ክፍሊ 9',
    },
    textbookTitle: 'Chemistry Student Textbook Grade 9',
    textbookPublisher: 'Federal Democratic Republic of Ethiopia Ministry of Education',
    curriculumEdition: 'New Curriculum (አዲሱ ሥርዓተ-ትምህርት)',
    officialPdfUrl: '/textbooks/chemistry/grade-9.pdf',
    totalUnits: 5,
    units: [
      {
        id: 'chem-g9-u1',
        unitNumber: 1,
        title: {
          en: 'Structure of the Atom',
          am: 'የአተም መዋቅር',
          om: 'Caasaa Atoomii',
          ti: 'ቅርጺ ኣቶም',
        },
        description: 'Historical development of atomic theories, subatomic particles, atomic number, mass number, isotopes, and electron configuration.',
        allocatedPeriods: 20,
        textbookPageStart: 1,
        textbookPageEnd: 35,
        sections: [
          {
            id: 'chem-g9-u1-s1',
            sectionNumber: '1.1',
            title: {
              en: 'Subatomic Particles and Atomic Models',
              am: 'ንዑሳን የአተም ቅንጣቶች እና የአተም ሞዴሎች',
              om: 'Babal\'ina Atoomii fi Moodeelota Atoomii',
              ti: 'ንኡሳን ኣካላት ኣቶምን ሞዴላትን',
            },
            textbookPageStart: 2,
            textbookPageEnd: 15,
            lessons: [
              {
                id: 'chem-g9-u1-s1-l1',
                lessonNumber: 'Lesson 1.1',
                title: {
                  en: 'Electrons, Protons, and Neutrons',
                  am: 'ኤሌክትሮኖች፣ ፕሮቶኖች እና ኒውትሮኖች',
                  om: 'Elektiroonota, Pirootoonota fi Niwutiroonota',
                  ti: 'ኤሌክትሮናት፣ ፕሮቶናትን ኒውትሮናትን',
                },
                periodCount: 3,
                textbookPageStart: 2,
                textbookPageEnd: 8,
                topics: [
                  {
                    id: 'chem-g9-u1-top1',
                    topicNumber: '1.1.1',
                    title: {
                      en: 'Atomic Number, Mass Number, and Isotopes',
                      am: 'የአተም ቁጥር፣ የክብደት ቁጥር እና አይሶቶፖች',
                      om: 'Lakkoofsa Atoomawaa, Lakkoofsa Hangaa fi Aayisootoopota',
                      ti: 'ቍጽሪ ኣቶም፣ ቍጽሪ ክብደት ክፋልን ኣይሶቶፓትን',
                    },
                    summary: 'An atom consists of a nucleus (protons + neutrons) orbited by electrons. Atomic number Z is number of protons; Mass number A = Z + N. Isotopes share Z but differ in A.',
                    textbookPage: 5,
                    difficulty: 'medium',
                    prerequisites: [],
                    learningOutcomes: [
                      {
                        id: 'lo-chem9-01',
                        code: 'LO-C9-U1-01',
                        description: {
                          en: 'Determine the numbers of protons, neutrons, and electrons in an atom or isotope.',
                          am: 'በአንድ አተም ወይም አይሶቶፕ ውስጥ ያሉትን የፕሮቶን፣ የኒውትሮን እና የኤሌክትሮን ቁጥሮች ማስላት።',
                          om: 'Baay\'ina pirootoonotaa, niwutiroonotaa fi elektiroonotaa atoomii keessatti murteessuu.',
                          ti: 'ኣብ ውሽጢ ኣቶም ዘለዉ በዝሒ ፕሮቶናት፣ ኒውትሮናትን ኤሌክትሮናትን ምሕሳብ።',
                        },
                        bloomLevel: 'apply',
                      },
                    ],
                    explanations: {
                      overview: 'Dalton proposed indivisible atoms; Thomson discovered the electron via cathode rays; Rutherford revealed the compact positive nucleus via alpha scattering.',
                      coreConcepts: [
                        'Proton: +1 charge, mass ≈ 1.0073 amu located in nucleus.',
                        'Neutron: neutral (0 charge), mass ≈ 1.0087 amu in nucleus.',
                        'Electron: -1 charge, mass ≈ 1/1837 amu orbiting outside nucleus.',
                        'Isotopes have identical chemical behaviors because chemical reactions depend on electron arrangements, not nuclear mass.',
                      ],
                    },
                    examples: [
                      {
                        id: 'ex-chem9-1',
                        title: 'Calculating Average Atomic Mass of Chlorine',
                        problem: 'Chlorine consists of 75.77% Cl-35 (34.969 amu) and 24.23% Cl-37 (36.966 amu). Calculate the relative atomic mass.',
                        solution: 'RAM = (0.7577 × 34.969) + (0.2423 × 36.966) = 26.496 + 8.957 = 35.45 amu.',
                        methodology: 'Sum the weighted isotopic masses: Σ (fractional abundance × isotopic mass).',
                        textbookPage: 7,
                      },
                    ],
                    activities: [
                      {
                        id: 'act-chem9-1',
                        activityNumber: 'Activity 1.3',
                        title: 'Rutherford Alpha Scattering Simulation',
                        objective: 'Model why most alpha particles pass through empty space while a few reflect backwards.',
                        instructions: [
                          'Set up marbles in a scattered grid representing gold atoms.',
                          'Roll small steel bearings across the floor towards the grid.',
                          'Tally direct collisions versus straight-through passes.',
                        ],
                        expectedObservation: 'Over 99% pass undeflected, confirming the nucleus occupies less than 1/100,000th of atomic volume.',
                        textbookPage: 10,
                      },
                    ],
                    exercises: [
                      {
                        id: 'exer-chem9-1',
                        exerciseNumber: 'Exercise 1.3',
                        title: 'Subatomic Particle Counting',
                        problems: [
                          {
                            questionNumber: '1',
                            text: 'An atom of Carbon-14 has how many protons, neutrons, and electrons?',
                            hint: 'Carbon has atomic number 6.',
                            answer: '6 protons, 8 neutrons (14 - 6), and 6 electrons.',
                          },
                        ],
                        textbookPage: 12,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        unitReview: {
          summaryPoints: [
            'Bohr model introduced quantized circular orbits for electrons.',
            'The modern quantum mechanical model portrays electrons in probability distributions (orbitals: s, p, d, f).',
          ],
          keyTerms: [
            { term: 'Isotope', definition: 'Atoms of the same element having the same atomic number but different mass numbers.' },
            { term: 'Valence Electrons', definition: 'Electrons in the outermost energy level responsible for chemical reactivity.' },
          ],
          reviewQuestions: ['Write the electronic configuration of Magnesium (Z = 12) using standard shell notation.'],
          textbookPage: 33,
        },
        unitAssessment: {
          title: 'Unit 1 Chemistry Assessment',
          instructions: 'Complete all questions citing atomic properties accurately.',
          durationMinutes: 40,
          textbookPage: 34,
          questions: [],
        },
      },
    ],
  },

  // ===================== GRADE 9 BIOLOGY =====================
  {
    id: 'biology-g9',
    code: 'BIO-G9',
    grade: 9,
    stream: 'common',
    name: {
      en: 'Biology Grade 9',
      am: 'ባዮሎጂ 9ኛ ክፍል',
      om: 'Baayoloojii Kutaa 9',
      ti: 'ባዮሎጂ ክፍሊ 9',
    },
    textbookTitle: 'Biology Student Textbook Grade 9',
    textbookPublisher: 'Federal Democratic Republic of Ethiopia Ministry of Education',
    curriculumEdition: 'New Curriculum (አዲሱ ሥርዓተ-ትምህርት)',
    officialPdfUrl: '/textbooks/biology/grade-9.pdf',
    totalUnits: 6,
    units: [
      {
        id: 'bio-g9-u1',
        unitNumber: 1,
        title: {
          en: 'Introduction to Biology',
          am: 'የባዮሎጂ መግቢያ',
          om: 'Seensa Baayoloojii',
          ti: 'መእተዊ ባዮሎጂ',
        },
        description: 'The science of life, fields of biology, characteristics of living organisms, scientific inquiry, biological tools, and indigenous biological knowledge in Ethiopia.',
        allocatedPeriods: 16,
        textbookPageStart: 1,
        textbookPageEnd: 30,
        sections: [
          {
            id: 'bio-g9-u1-s1',
            sectionNumber: '1.1',
            title: {
              en: 'The Nature of Biology and Scientific Inquiry',
              am: 'የባዮሎጂ ምንነት እና ሳይንሳዊ ምርምር',
              om: 'Uumama Baayoloojii fi Qorannoo Saayinsii',
              ti: 'ባህሪ ባዮሎጂን ሳይንሳዊ መርመራን',
            },
            textbookPageStart: 2,
            textbookPageEnd: 12,
            lessons: [
              {
                id: 'bio-g9-u1-s1-l1',
                lessonNumber: 'Lesson 1.1',
                title: {
                  en: 'Characteristics of Life and Biological Methods',
                  am: 'የህይወት መገለጫዎች እና የባዮሎጂ ዘዴዎች',
                  om: 'Amaloota Lubbu-qabeeyyii fi Mala Baayoloojii',
                  ti: 'ባህርያት ህይወትን ሜላታት ባዮሎጂን',
                },
                periodCount: 2,
                textbookPageStart: 2,
                textbookPageEnd: 8,
                topics: [
                  {
                    id: 'bio-g9-u1-top1',
                    topicNumber: '1.1.1',
                    title: {
                      en: 'Characteristics of Living Organisms',
                      am: 'የህያዋን ፍጥረታት መገለጫ ባህሪያት',
                      om: 'Amaloota Bu\'uuraa Lubbu-qabeeyyii',
                      ti: 'መሰረታዊ ባህርያት ህያዋን ፍጥረታት',
                    },
                    summary: 'Living things share cellular organization, metabolism, homeostasis, growth, reproduction, response to stimuli, and adaptation through evolution.',
                    textbookPage: 3,
                    difficulty: 'easy',
                    prerequisites: [],
                    learningOutcomes: [
                      {
                        id: 'lo-bio9-01',
                        code: 'LO-B9-U1-01',
                        description: {
                          en: 'List and explain seven universal characteristics distinguishing living from non-living matter.',
                          am: 'ህያዋንን ግዑዝ ከሆኑ ነገሮች የሚለዩትን ሰባቱን መሰረታዊ የህይወት መገለጫዎች መዘርዘርና ማብራራት።',
                          om: 'Amaloota torba lubbu-qabeeyyii wantoota lubbu-hinqabne irraa adda baasan ibsuu.',
                          ti: 'ንህያዋን ካብ ዘይህያዋን ዝፈልዩ ሾብዓተ ባህርያት ምግላጽ።',
                        },
                        bloomLevel: 'understand',
                      },
                    ],
                    explanations: {
                      overview: 'Biology (from Greek bios = life, logos = study) explores organisms from molecular machinery up to the global biosphere.',
                      coreConcepts: [
                        'Cell Theory: all living organisms are composed of one or more cells.',
                        'Homeostasis: active regulation of internal physical/chemical equilibrium (e.g. human core temperature ~37°C).',
                        'Metabolism: sum total of catabolic (energy-releasing) and anabolic (biosynthetic) chemical pathways.',
                      ],
                    },
                    examples: [
                      {
                        id: 'ex-bio9-1',
                        title: 'Homeostasis in Response to Environmental Heat',
                        problem: 'How does the human body maintain thermal homeostasis when exercising under the hot Afar sun?',
                        solution: 'Thermoreceptors in skin signal the hypothalamus. Vasodilation increases blood flow to skin, and sweat glands secrete water which cools the body by evaporative latent heat.',
                        methodology: 'Analyze the stimulus, receptor, control center, and effector feedback loop.',
                        textbookPage: 5,
                      },
                    ],
                    activities: [
                      {
                        id: 'act-bio9-1',
                        activityNumber: 'Activity 1.1',
                        title: 'Microscopic Examination of Onion Epidermal Cells',
                        objective: 'Observe plant cell wall, cytoplasm, and nucleus under optical magnification.',
                        instructions: [
                          'Peel a thin transparent layer from an inner onion scale.',
                          'Place on glass slide, add one drop of iodine stain, and gently lower coverslip without bubbles.',
                          'Observe under 10x low power, then 40x high power.',
                        ],
                        materials: ['Onion', 'Iodine solution', 'Glass slide', 'Coverslip', 'Compound microscope'],
                        expectedObservation: 'Hexagonal interlocking plant cells with distinct boundary walls and stained nuclei.',
                        textbookPage: 6,
                      },
                    ],
                    exercises: [
                      {
                        id: 'exer-bio9-1',
                        exerciseNumber: 'Exercise 1.1',
                        title: 'Classifying Living Characteristics',
                        problems: [
                          {
                            questionNumber: '1',
                            text: 'Viruses replicate inside host cells but do not perform metabolism. Are viruses classified as living organisms? Justify with textbook evidence.',
                            hint: 'Consider the cell theory requirement and independent metabolic capability.',
                            answer: 'Viruses are acellular biological entities at the borderline of life; they possess genetic material but lack cellular structure and independent metabolic machinery.',
                          },
                        ],
                        textbookPage: 7,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        unitReview: {
          summaryPoints: [
            'Biological science informs modern agriculture, medicine, conservation, and biotechnology.',
            'Indigenous medical knowledge in Ethiopia (traditional herbs like Kosso and Dingetegna) is validated through scientific pharmacology.',
          ],
          keyTerms: [
            { term: 'Homeostasis', definition: 'The maintenance of a relatively constant internal physiological state.' },
            { term: 'Metabolism', definition: 'The sum of all biochemical reactions taking place in an organism.' },
          ],
          reviewQuestions: ['Why is cell theory considered a foundational principle in modern biology?'],
          textbookPage: 28,
        },
        unitAssessment: {
          title: 'Unit 1 Biology Assessment',
          instructions: 'Answer with precise scientific terminology.',
          durationMinutes: 35,
          textbookPage: 29,
          questions: [],
        },
      },
    ],
  },

  // ===================== GRADE 9 INFORMATION TECHNOLOGY =====================
  {
    id: 'ict-g9',
    code: 'IT-G9',
    grade: 9,
    stream: 'common',
    name: {
      en: 'Information Technology Grade 9',
      am: 'ኢንፎርሜሽን ቴክኖሎጂ 9ኛ ክፍል',
      om: 'Teeknooloojii Odeeffannoo Kutaa 9',
      ti: 'ቴክኖሎጂ ሓበሬታ ክፍሊ 9',
    },
    textbookTitle: 'Information Technology Student Textbook Grade 9',
    textbookPublisher: 'Federal Democratic Republic of Ethiopia Ministry of Education',
    curriculumEdition: 'New Curriculum (አዲሱ ሥርዓተ-ትምህርት)',
    officialPdfUrl: '/textbooks/ict/grade-9.pdf',
    totalUnits: 6,
    units: [
      {
        id: 'it-g9-u1',
        unitNumber: 1,
        title: {
          en: 'Information Systems and Its Applications',
          am: 'የኢንፎርሜሽን ሲስተምስ እና አተገባበራቸው',
          om: 'Sirna Odeeffannoo fi Fayyadamoota Isaanii',
          ti: 'ስርዓተ ሓበሬታን ኣጠቓቕማኡን',
        },
        description: 'Components of information systems (hardware, software, data, procedures, people), categories of software, computer security, and societal impacts.',
        allocatedPeriods: 18,
        textbookPageStart: 1,
        textbookPageEnd: 32,
        sections: [
          {
            id: 'it-g9-u1-s1',
            sectionNumber: '1.1',
            title: {
              en: 'Concepts of Information Systems',
              am: 'የኢንፎርሜሽን ሲስተም ፅንሰ-ሃሳቦች',
              om: 'Yaad-rimee Sirna Odeeffannoo',
              ti: 'ፅንሰ-ሓሳብ ስርዓተ ሓበሬታ',
            },
            textbookPageStart: 2,
            textbookPageEnd: 14,
            lessons: [
              {
                id: 'it-g9-u1-s1-l1',
                lessonNumber: 'Lesson 1.1',
                title: {
                  en: 'Data vs Information and System Architecture',
                  am: 'መረጃ፣ እውቀት እና የስርዓት መዋቅር',
                  om: 'Daataa fi Odeeffannoo',
                  ti: 'ዳታን ሓበሬታን',
                },
                periodCount: 2,
                textbookPageStart: 2,
                textbookPageEnd: 8,
                topics: [
                  {
                    id: 'it-g9-u1-top1',
                    topicNumber: '1.1.1',
                    title: {
                      en: 'Information Processing Cycle and Computer Components',
                      am: 'የመረጃ ማቀነባበር ዑደት እና የኮምፒውተር ክፍሎች',
                      om: 'Adeemsa Qindeessuu Odeeffannoo fi Kutaa Kompiitaraa',
                      ti: 'ዑደት መስርሕ ሓበሬታን ኣካላት ኮምፒዩተርን',
                    },
                    summary: 'The IPOS cycle: Input → Processing → Output → Storage. Hardware consists of CPU, primary storage (RAM/ROM), secondary storage, input and output peripherals.',
                    textbookPage: 4,
                    difficulty: 'easy',
                    prerequisites: [],
                    learningOutcomes: [
                      {
                        id: 'lo-it9-01',
                        code: 'LO-IT9-U1-01',
                        description: {
                          en: 'Describe the five components of an information system and explain the IPOS cycle.',
                          am: 'አምስቱን የኢንፎርሜሽን ሲስተም ክፍሎች መግለጽና የIPOS ዑደትን ማብራራት።',
                          om: 'Kutaalee shan sirna odeeffannoo fi adeemsa IPOS ibsuu.',
                          ti: 'ሓሙሽተ ኣካላት ስርዓተ ሓበሬታን ዑደት IPOSን ምግላጽ።',
                        },
                        bloomLevel: 'understand',
                      },
                    ],
                    explanations: {
                      overview: 'Raw data lacks context. When processed, organized, and structured, it transforms into meaningful information facilitating decision-making.',
                      coreConcepts: [
                        'Input devices: Keyboard, mouse, optical scanner, microphone.',
                        'Central Processing Unit (CPU): Arithmetic Logic Unit (ALU), Control Unit (CU), and Registers.',
                        'Primary Memory: RAM (volatile, high speed) and ROM (non-volatile firmware).',
                        'Secondary Memory: SSDs, Hard Disks, Flash drives for persistent archival.',
                      ],
                    },
                    examples: [
                      {
                        id: 'ex-it9-1',
                        title: 'Analyzing a Student Enrollment Information System',
                        problem: 'Trace the IPOS cycle when a Grade 9 student registers at an Ethiopian secondary school.',
                        solution: 'Input: Registrar types student name and birth date. Processing: Database assigns unique student ID and verifies eligibility. Output: Printable registration slip with class schedule. Storage: Saved to persistent school server database.',
                        methodology: 'Map physical actions to each stage of the IPOS computing model.',
                        textbookPage: 6,
                      },
                    ],
                    activities: [
                      {
                        id: 'act-it9-1',
                        activityNumber: 'Activity 1.1',
                        title: 'Identifying Hardware Specifications via OS Diagnostics',
                        objective: 'Open system properties on a school lab computer to identify CPU clock speed, RAM capacity, and storage type.',
                        instructions: [
                          'Press Win + Pause/Break or open Terminal (lscpu, free -h).',
                          'Note the CPU brand, GHz frequency, and physical RAM installed.',
                          'Calculate how many bytes 8 GB RAM represents.',
                        ],
                        expectedObservation: '8 GB = 8 × 1024³ bytes ≈ 8,589,934,592 bytes.',
                        textbookPage: 7,
                      },
                    ],
                    exercises: [
                      {
                        id: 'exer-it9-1',
                        exerciseNumber: 'Exercise 1.1',
                        title: 'System Classification Test',
                        problems: [
                          {
                            questionNumber: '1',
                            text: 'Differentiate between system software and application software with two examples of each.',
                            hint: 'System software manages hardware; application software performs user tasks.',
                            answer: 'System software: Operating Systems (Linux, Windows). Application software: Word processor (LibreOffice Writer), Web browser (Firefox).',
                          },
                        ],
                        textbookPage: 8,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        unitReview: {
          summaryPoints: [
            'Information Technology underpins the digital economy of Ethiopia (Digital Ethiopia 2025 strategy).',
            'Cybersecurity awareness protects against phishing, malware, ransomware, and unauthorized database access.',
          ],
          keyTerms: [
            { term: 'CPU', definition: 'Central Processing Unit, the electronic circuitry that executes software instructions.' },
            { term: 'Operating System', definition: 'Core system software that manages computer hardware and software resources.' },
          ],
          reviewQuestions: ['Why is RAM called volatile memory while SSD is non-volatile?'],
          textbookPage: 30,
        },
        unitAssessment: {
          title: 'Unit 1 IT Assessment',
          instructions: 'Answer with precise computing terminology.',
          durationMinutes: 35,
          textbookPage: 31,
          questions: [],
        },
      },
    ],
  },

  // ===================== GRADE 9 ECONOMICS =====================
  {
    id: 'economics-g9',
    code: 'ECON-G9',
    grade: 9,
    stream: 'common',
    name: {
      en: 'Economics Grade 9',
      am: 'ኢኮኖሚክስ 9ኛ ክፍል',
      om: 'Ikonoomiksii Kutaa 9',
      ti: 'ኢኮኖሚክስ ክፍሊ 9',
    },
    textbookTitle: 'Economics Student Textbook Grade 9',
    textbookPublisher: 'Federal Democratic Republic of Ethiopia Ministry of Education',
    curriculumEdition: 'New Curriculum (አዲሱ ሥርዓተ-ትምህርት)',
    officialPdfUrl: '/textbooks/economics/grade-9.pdf',
    totalUnits: 8,
    units: [
      {
        id: 'econ-g9-u1',
        unitNumber: 1,
        title: {
          en: 'Introducing Economics',
          am: 'የኢኮኖሚክስ መግቢያ',
          om: 'Seensa Ikonoomiksii',
          ti: 'መእተዊ ኢኮኖሚክስ',
        },
        description: 'Definition of economics, the central economic problem of scarcity, choice, opportunity cost, and the Production Possibilities Frontier (PPF).',
        allocatedPeriods: 18,
        textbookPageStart: 1,
        textbookPageEnd: 26,
        sections: [
          {
            id: 'econ-g9-u1-s1',
            sectionNumber: '1.1',
            title: {
              en: 'Definition and Central Problem of Economics',
              am: 'የኢኮኖሚክስ ምንነት እና መሰረታዊ የኢኮኖሚ ጥያቄ',
              om: 'Hiika fi Rakkoo Bu\'uuraa Ikonoomiksii',
              ti: 'ትርጉምን መሰረታዊ ጸገምን ኢኮኖሚክስ',
            },
            textbookPageStart: 2,
            textbookPageEnd: 12,
            lessons: [
              {
                id: 'econ-g9-u1-s1-l1',
                lessonNumber: 'Lesson 1.1',
                title: {
                  en: 'Scarcity, Choice, and Opportunity Cost',
                  am: 'ውሱንነት፣ ምርጫ እና የአማራጭ ዋጋ (Opportunity Cost)',
                  om: 'Hanqina, Filannoo fi Gatii Filannoo Biraa',
                  ti: 'ውሑድነት፣ ምርጫን ዋጋ ካልእ ኣማራጽን',
                },
                periodCount: 2,
                textbookPageStart: 2,
                textbookPageEnd: 8,
                topics: [
                  {
                    id: 'econ-g9-u1-top1',
                    topicNumber: '1.1.1',
                    title: {
                      en: 'The Core Economic Dilemma',
                      am: 'ዋናው የኢኮኖሚክስ ተቃርኖ እና መፍትሔዎቹ',
                      om: 'Rakkoo Bu\'uuraa Ikonoomiksii',
                      ti: 'ቀንዲ ቅልውላው ኢኮኖሚክስ',
                    },
                    summary: 'Human wants are unlimited while productive economic resources (Land, Labor, Capital, Entrepreneurship) are finite and scarce. This necessitates rational choices.',
                    textbookPage: 3,
                    difficulty: 'easy',
                    prerequisites: [],
                    learningOutcomes: [
                      {
                        id: 'lo-econ9-01',
                        code: 'LO-EC9-U1-01',
                        description: {
                          en: 'Define economics, illustrate scarcity and choice, and compute opportunity cost.',
                          am: 'ኢኮኖሚክስን መግለጽ፣ የውሱንነትና የምርጫ ግንኙነትን ማሳየት እንዲሁም የአማራጭ ዋጋን ማስላት።',
                          om: 'Ikonoomiksii ibsuu, hanqina fi filannoo agarsiisuu.',
                          ti: 'ኢኮኖሚክስ ምግላጽ፣ ውሑድነትን ምርጫን ምፍላይ።',
                        },
                        bloomLevel: 'understand',
                      },
                    ],
                    explanations: {
                      overview: 'Economics is the social science studying how individuals and societies allocate scarce resources with alternative uses to satisfy unlimited human needs.',
                      coreConcepts: [
                        'Scarcity vs Poverty: Scarcity is universal to rich and poor nations alike because human desires always exceed available resources.',
                        'Opportunity Cost: the value of the next best alternative forgone when a choice is made.',
                        'Three Central Questions: What to produce? How to produce? For whom to produce?',
                      ],
                    },
                    examples: [
                      {
                        id: 'ex-econ9-1',
                        title: 'Opportunity Cost of a Farmer in Gojjam',
                        problem: 'A farmer in East Gojjam with 2 hectares can produce either 40 quintals of Teff or 80 quintals of Maize. If the farmer allocates land to produce 40 quintals of Teff, what is the opportunity cost?',
                        solution: 'The opportunity cost is the 80 quintals of Maize forgone. Opportunity cost per quintal of Teff = 80 / 40 = 2 quintals of Maize.',
                        methodology: 'Identify the forgone alternative and express as a ratio of sacrificed units.',
                        textbookPage: 5,
                      },
                    ],
                    activities: [
                      {
                        id: 'act-econ9-1',
                        activityNumber: 'Activity 1.1',
                        title: 'Drawing a Production Possibilities Curve (PPC)',
                        objective: 'Plot combinations of agricultural vs industrial goods under fixed national resources.',
                        instructions: [
                          'Given production table: Point A (0 food, 100 tractors), Point B (50 food, 80 tractors), Point C (100 food, 0 tractors).',
                          'Plot points on a Cartesian coordinate plane and connect them.',
                          'Identify an unattainable point (outside curve) and an inefficient point (inside curve).',
                        ],
                        expectedObservation: 'Points on the frontier represent productive efficiency; the downward concave curve illustrates increasing opportunity cost.',
                        textbookPage: 7,
                      },
                    ],
                    exercises: [
                      {
                        id: 'exer-econ9-1',
                        exerciseNumber: 'Exercise 1.1',
                        title: 'Microeconomics vs Macroeconomics',
                        problems: [
                          {
                            questionNumber: '1',
                            text: 'Classify whether inflation rate in Ethiopia is a microeconomic or macroeconomic issue.',
                            hint: 'Micro deals with individual decision units; macro deals with aggregate economy.',
                            answer: 'Macroeconomic issue because inflation reflects the nationwide rise in the general price level.',
                          },
                        ],
                        textbookPage: 8,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        unitReview: {
          summaryPoints: [
            'Microeconomics studies individual consumer choices, firm pricing, and specific markets.',
            'Macroeconomics studies aggregate output (GDP), unemployment, fiscal policy, monetary policy, and balance of payments.',
          ],
          keyTerms: [
            { term: 'Opportunity Cost', definition: 'The highest-valued benefit sacrificed when selecting among competing alternatives.' },
            { term: 'Factors of Production', definition: 'The four productive inputs: Land (rent), Labor (wages), Capital (interest), and Entrepreneurship (profit).' },
          ],
          reviewQuestions: ['Explain why points outside the PPF curve are considered unattainable in the short run.'],
          textbookPage: 24,
        },
        unitAssessment: {
          title: 'Unit 1 Economics Assessment',
          instructions: 'Answer with economic analysis and graphical illustrations.',
          durationMinutes: 40,
          textbookPage: 25,
          questions: [],
        },
      },
    ],
  },
];

// ===================== STRUCTURED QUESTION BANK (ALL 7 QUESTION TYPES) =====================
export const ETHIOPIAN_QUESTION_BANK: CurriculumQuestion[] = [
  // 1. Multiple Choice (Math)
  {
    id: 'q-math-mcq-1',
    questionType: 'multiple_choice',
    difficulty: 'easy',
    prompt: {
      en: 'Which of the following is an irrational number?',
      am: 'ከሚከተሉት ውስጥ ኢ-አመክንዮአዊ (Irrational) ቁጥር የትኛው ነው?',
      om: 'Lakkoofsota armaan gadii keessaa kamtu lakkoofsa al-dhugaa (irrational) dha?',
      ti: 'ካብዞም ዝስዕቡ ኢ-አመክንዮኣዊ (Irrational) ቍጽሪ ኣየናይ እዩ?',
    },
    options: ['3/4', '√9', '√5', '0.25'],
    correctAnswer: 2, // Index 2 -> √5
    explanation: {
      en: '√5 cannot be expressed as a quotient of integers a/b; its decimal expansion is infinite and non-periodic (≈ 2.23606...), so it is irrational.',
      am: '√5 በሁለት ሙሉ ቁጥሮች ክፍፍል (a/b) መልክ ሊጻፍ አይችልም፤ የአስርዮሽ ቁጥሩ የማያልቅና የማይደጋገም በመሆኑ ኢ-አመክንዮአዊ ነው።',
      om: '√5 lakkoofsa al-dhugaa dha sababiin isaas akka hirama lakkoofsota guutuu a/b ta\'ee barreeffamuu hin danda\'u.',
      ti: '√5 ብክፍፍል ክልተ ምሉእ ቍጽርታት (a/b) ክጸሓፍ ስለዘይኽእል ኢ-አመክንዮኣዊ እዩ።',
    },
    ragMetadata: {
      grade: 9,
      subject: 'Mathematics',
      subjectId: 'math-g9',
      unit: 1,
      unitTitle: 'The Number System',
      section: '1.2',
      lesson: 'Lesson 1.2',
      topic: 'Classification of Real Numbers',
      learningOutcome: 'Identify and classify rational and irrational numbers.',
      textbookPage: 14,
      source: 'Ministry of Education - Grade 9 Mathematics Student Textbook',
      difficulty: 'easy',
      prerequisites: ['math-g9-u1-top1'],
    },
  },

  // 2. True / False (Physics)
  {
    id: 'q-phys-tf-1',
    questionType: 'true_false',
    difficulty: 'easy',
    prompt: {
      en: 'True or False: The SI unit of electric current (the Ampere) is a derived physical quantity.',
      am: 'እውነት ወይስ ሐሰት፡ የኤሌክትሪክ ፍሰት (current) መለኪያ የሆነው አምፔር (Ampere) ተውሳክ (derived) አካላዊ መጠን ነው።',
      om: 'Dhugaa yookaan Soba: Yuuniitiin karantii elektiriikii (Ampeeriin) hammamtaa maddee dha.',
      ti: 'ሓቂ ወይስ ሓሶት፡ መለክዒ ፍሰት ኤሌክትሪክ (ኣምፔር) ዝተረኽበ (derived) ኣካላዊ መለክዒ እዩ።',
    },
    options: ['True (እውነት)', 'False (ሐሰት)'],
    correctAnswer: 1, // False
    explanation: {
      en: 'False. The Ampere (A) is one of the seven fundamental (base) SI units, not a derived unit.',
      am: 'ሐሰት። አምፔር (Ampere) ከሰባቱ መሰረታዊ (Base) የSI መለኪያዎች አንዱ እንጂ ተውሳክ አይደለም።',
      om: 'Soba. Ampeeriin yuuniitiiwwan bu\'uuraa torban keessaa isa tokkodha.',
      ti: 'ሓሶት። ኣምፔር ካብቶም ሾብዓተ መሰረታውያን መለክዒታት ሓደ እዩ።',
    },
    ragMetadata: {
      grade: 9,
      subject: 'Physics',
      subjectId: 'physics-g9',
      unit: 1,
      unitTitle: 'Physics and Human Society',
      section: '1.1',
      lesson: 'Lesson 1.1',
      topic: 'Fundamental and Derived Quantities',
      learningOutcome: 'Identify fundamental base SI units.',
      textbookPage: 4,
      source: 'Ministry of Education - Grade 9 Physics Student Textbook',
      difficulty: 'easy',
      prerequisites: ['phys-g9-u1-top1'],
    },
  },

  // 3. Fill in the Blank (Chemistry)
  {
    id: 'q-chem-fib-1',
    questionType: 'fill_in_blank',
    difficulty: 'medium',
    prompt: {
      en: 'Atoms of the same element with the same atomic number but different mass numbers are called ______.',
      am: 'ተመሳሳይ የአተም ቁጥር ያላቸው ነገር ግን የተለያየ የክብደት ቁጥር ያላቸው የአንድ ንጥረ ነገር አተሞች ______ ይባላሉ።',
      om: 'Atoomonni elementii walfakkaataa ta\'anii lakkoofsa atoomawaa walfakkaataa fi lakkoofsa hangaa adda addaa qaban ______ jedhamu.',
      ti: 'ተመሳሳሊ ቍጽሪ ኣቶም ዘለዎም ግናኸ ዝተፈላለየ ቍጽሪ ክብደት ዘለዎም ኣቶማት ሓደ ባእታ ______ ይበሃሉ።',
    },
    correctAnswer: 'isotopes',
    explanation: {
      en: 'Isotopes are atoms with the same number of protons (Z) but a differing count of neutrons (N), changing their atomic mass A = Z + N.',
      am: 'አይሶቶፖች (Isotopes) እኩል የፕሮቶን ቁጥር ኖሯቸው የተለያየ የኒውትሮን ቁጥር ያላቸው አተሞች ናቸው።',
      om: 'Aayisootooponni atoomota pirootoonii walfakkaataa fi niwutiroonii adda addaa qabaniidha.',
      ti: 'ኣይሶቶፓት ማዕረ ፕሮቶን ዝሓዙ ኮይኖም በዝሒ ኒውትሮኖም ዝተፈላለየ እዩ።',
    },
    ragMetadata: {
      grade: 9,
      subject: 'Chemistry',
      subjectId: 'chemistry-g9',
      unit: 1,
      unitTitle: 'Structure of the Atom',
      section: '1.1',
      lesson: 'Lesson 1.1',
      topic: 'Atomic Number, Mass Number, and Isotopes',
      learningOutcome: 'Define and identify isotopes.',
      textbookPage: 6,
      source: 'Ministry of Education - Grade 9 Chemistry Student Textbook',
      difficulty: 'medium',
      prerequisites: ['chem-g9-u1-top1'],
    },
  },

  // 4. Short Answer (Biology)
  {
    id: 'q-bio-sa-1',
    questionType: 'short_answer',
    difficulty: 'medium',
    prompt: {
      en: 'State the biological term for the maintenance of a relatively stable internal physiological environment in living organisms.',
      am: 'በህያዋን ፍጥረታት ውስጥ ተመጣጣኝና ቋሚ የሆነ ውስጣዊ የፊዚዮሎጂ ሁኔታን የመጠበቅ ሂደት በባዮሎጂ ምን ይባላል?',
      om: 'Adeemsi lubbu-qabeeyyiin haala keessoo isaanii tasgabbaa\'aa taasisanii itti eegan maal jedhama?',
      ti: 'ኣብ ህያዋን ፍጥረታት ማዕረን ርጉእን ዝኾነ ውሽጣዊ ኩነታት ናይ ምዕቃብ መስርሕ ብባዮሎጂ እንታይ ይበሃል?',
    },
    correctAnswer: 'Homeostasis (ሆሚዮስታሲስ)',
    explanation: {
      en: 'Homeostasis is the biological mechanism that maintains internal equilibrium (such as blood glucose, water balance, and body temperature) despite external fluctuations.',
      am: 'ሆሚዮስታሲስ (Homeostasis) ህያዋን ፍጥረታት የውጭው አካባቢ ቢለዋወጥም ውስጣዊ የሰውነት ሁኔታቸውን ሚዛናዊ አድርገው የሚጠብቁበት ሂደት ነው።',
      om: 'Hoomiyoostaasiisiin adeemsa qaamni haala keessoo isaa walqixa godhee itti eegudha.',
      ti: 'ሆሚዮስታሲስ ህያዋን ፍጥረታት ውሽጣዊ ሚዛኖም ሓልዮም ዝጸንሑሉ ሜላ እዩ።',
    },
    ragMetadata: {
      grade: 9,
      subject: 'Biology',
      subjectId: 'biology-g9',
      unit: 1,
      unitTitle: 'Introduction to Biology',
      section: '1.1',
      lesson: 'Lesson 1.1',
      topic: 'Characteristics of Living Organisms',
      learningOutcome: 'Explain homeostasis as an essential property of life.',
      textbookPage: 5,
      source: 'Ministry of Education - Grade 9 Biology Student Textbook',
      difficulty: 'medium',
      prerequisites: ['bio-g9-u1-top1'],
    },
  },

  // 5. Discussion (Economics)
  {
    id: 'q-econ-disc-1',
    questionType: 'discussion',
    difficulty: 'hard',
    prompt: {
      en: 'Explain why scarcity forces every economic society to make choices, and analyze the concept of opportunity cost using the Ethiopian agricultural sector as an example.',
      am: 'የሀብት ውሱንነት (scarcity) ማንኛውንም ማህበረሰብ ምርጫ እንዲያደርግ የሚያስገድደው ለምን እንደሆነ ያብራሩ፤ እንዲሁም የኢትዮጵያን የግብርና ዘርፍ እንደ ምሳሌ በመውሰድ የአማራጭ ዋጋን (Opportunity Cost) ፅንሰ-ሃሳብ ይተንትኑ።',
      om: 'Hanqinni qabeenyaa hawaasa hunda filannoo akka godhu maaliif akka dirqisiisu ibsi, qonna Itoophiyaa akka fakkeenyaatti fudhadhuu gatii filannoo biraa xiinxali.',
      ti: 'ውሑድነት ንዝኾነ ሕብረተሰብ ምርጫ ክገብር ዘገድዶ ስለምንታይ ምዃኑ ግለጽ፤ ንሕርሻ ኢትዮጵያ ከም ኣብነት ብምውሳድ ድማ ዋጋ ካልእ ኣማራጺ ተንትን።',
    },
    correctAnswer: 'Detailed conceptual discussion rubric',
    rubric: [
      '1. Clear explanation that human wants are unlimited while land, labor, and capital are finite.',
      '2. Definition of opportunity cost as the forgone benefit of the next best alternative.',
      '3. Application to Ethiopian agriculture: allocating farmland to Wheat vs Teff implies sacrificing the yield of one for the other.',
    ],
    explanation: {
      en: 'Scarcity is universal because fertile farmland and fertilizer are finite. When Ethiopian farmers allocate acreage to Teff instead of Wheat, the lost Wheat production represents the opportunity cost of that choice.',
      am: 'የተፈጥሮ ሃብቶች ውሱን ስለሆኑ አርሶ አደሮች መሬታቸውን ለጤፍ ሲያውሉ ሊያገኙት የሚችሉትን የስንዴ ምርት መስዋዕት ያደርጋሉ፤ ይህ የተተወው ምርት የአማራጭ ዋጋ ይባላል።',
      om: 'Qabeenyi waan daangeffameef qonnoonni Teeffii yoo filatan Qamadii dhabuun gatii filannoo biraa ta\'a.',
      ti: 'ሃፍቲ ውሑድ ስለዝኾነ ሓረስቶት ንጣፍ እንተመሪጾም ዝስእኑዎ ስርናይ ዋጋ ካልእ ኣማራጺ ይኸውን።',
    },
    ragMetadata: {
      grade: 9,
      subject: 'Economics',
      subjectId: 'economics-g9',
      unit: 1,
      unitTitle: 'Introducing Economics',
      section: '1.1',
      lesson: 'Lesson 1.1',
      topic: 'Scarcity, Choice, and Opportunity Cost',
      learningOutcome: 'Analyze economic decision making and opportunity costs.',
      textbookPage: 4,
      source: 'Ministry of Education - Grade 9 Economics Student Textbook',
      difficulty: 'hard',
      prerequisites: ['econ-g9-u1-top1'],
    },
  },

  // 6. Practical (Physics Experiment)
  {
    id: 'q-phys-pract-1',
    questionType: 'practical',
    difficulty: 'hard',
    prompt: {
      en: 'Describe step-by-step how to accurately measure the volume of an irregularly shaped Ethiopian pebble using a graduated cylinder and water displacement method, and calculate its density if its mass is 48.0 grams.',
      am: 'የተመረዘ ቅርጽ ያለውን የድንጋይ ጠጠር መጠን (volume) በውሃ ማፈናቀል ዘዴ እንዴት በሲሊንደር መለካት እንደሚቻል ቅደም ተከተሉን ይግለጹ፤ ድንጋዩ 48.0 ግራም ቢመዝንና ውሃውን ከ 50 mL ወደ 70 mL ከፍ ቢያደርገው ጥጋቱን (density) አስሉ።',
      om: 'Qubsumma dhagaa bifa hinqabnee akkamitti akka safartu tartiiba isaa ibsi, dhangala\'aa (density) isaas shallagi.',
      ti: 'ቅርጺ ዘይብሉ እምኒ ብሜላ ምፍንቃል ማይ ብኸመይ ትዕቅኖ ብቅደም ተኸተል ግለጽ፤ መጠኑ 48.0 ግራም እንተኾይኑ ድማ ጽፍዓቱ (density) ሕሰብ።',
    },
    correctAnswer: '2.4 g/cm³',
    rubric: [
      'Step 1: Fill graduated cylinder with known volume V1 = 50 mL.',
      'Step 2: Submerge the pebble gently with thread without splashing.',
      'Step 3: Read final water level V2 = 70 mL. Pebble volume = V2 - V1 = 20 mL = 20 cm³.',
      'Step 4: Density = Mass / Volume = 48.0 g / 20.0 cm³ = 2.4 g/cm³.',
    ],
    explanation: {
      en: 'Density equals mass divided by volume (ρ = m/V). The volume of displaced liquid exactly equals the volume of the submerged object: 70 - 50 = 20 cm³. Thus ρ = 48 / 20 = 2.4 g/cm³.',
      am: 'ጥጋት (Density) = ክብደት / ይዘት ነው። የተፈናቀለው ውሃ 70 - 50 = 20 cm³ ነው። ስለዚህ ጥጋቱ 48 / 20 = 2.4 g/cm³ (ወይም 2400 kg/m³) ይሆናል።',
      om: 'Dhangala\'aan (Density) = Hangaa / Qubsumma = 48 / 20 = 2.4 g/cm³.',
      ti: 'ጽፍዓት = ክብደት / ይዘት = 48 / 20 = 2.4 g/cm³.',
    },
    ragMetadata: {
      grade: 9,
      subject: 'Physics',
      subjectId: 'physics-g9',
      unit: 1,
      unitTitle: 'Physics and Human Society',
      section: '1.2',
      lesson: 'Lesson 1.2',
      topic: 'Measurement of Volume and Density',
      learningOutcome: 'Apply Archimedes water displacement to compute physical density.',
      textbookPage: 12,
      source: 'Ministry of Education - Grade 9 Physics Student Textbook',
      difficulty: 'hard',
      prerequisites: ['phys-g9-u1-top1'],
    },
  },

  // 7. Coding (Information Technology / Computer Science)
  {
    id: 'q-it-code-1',
    questionType: 'coding',
    difficulty: 'medium',
    prompt: {
      en: 'Write a Python program that accepts a student exam mark between 0 and 100 and outputs "Distinction" if ≥ 85, "Pass" if ≥ 50, and "Remedial" otherwise.',
      am: 'የተማሪ የፈተና ውጤትን (0-100) ተቀብሎ ውጤቱ 85 ወይም ከዚያ በላይ ከሆነ "Distinction"፣ 50 ወይም ከዚያ በላይ ከሆነ "Pass"፣ ካልሆነ ደግሞ "Remedial" የሚል የፓይዘን (Python) ኮድ ጻፉ።',
      om: 'Sagantaa Paayitan qabxii barataa fudhatee sadarkaa isaa adda baasu barreessi.',
      ti: 'ውጽኢት ፈተና ተምሃራይ (0-100) ተቐቢሉ ደረጃኡ ዘርኢ ፕሮግራም ፓይተን ጽሓፍ።',
    },
    correctAnswer: 'Python conditional block',
    codeLanguage: 'python',
    codeStarter: `def evaluate_grade(mark: float) -> str:
    # TODO: Write logic based on Ethiopian IT curriculum guidelines
    pass`,
    explanation: {
      en: `def evaluate_grade(mark: float) -> str:
    if mark >= 85:
        return "Distinction"
    elif mark >= 50:
        return "Pass"
    else:
        return "Remedial"`,
      am: 'በPython if-elif-else መዋቅር በመጠቀም የተማሪውን ውጤት በትክክል መመደብ ይቻላል።',
      om: 'Caasaa if-elif-else fayyadamuun qabxii adda baasuun ni danda\'ama.',
      ti: 'ብመንገዲ if-elif-else ውጽኢት ተምሃራይ ምደብ።',
    },
    ragMetadata: {
      grade: 9,
      subject: 'Information Technology',
      subjectId: 'ict-g9',
      unit: 4,
      unitTitle: 'Problem Solving and Algorithm Design',
      section: '4.2',
      lesson: 'Lesson 4.2',
      topic: 'Conditional Decision Structures',
      learningOutcome: 'Implement conditional algorithms in computer code.',
      textbookPage: 85,
      source: 'Ministry of Education - Grade 9 IT Student Textbook',
      difficulty: 'medium',
      prerequisites: ['it-g9-u1-top1'],
    },
  },
];

// ===================== KNOWLEDGE MAPS (DAG OF PREREQUISITES) =====================
export const ETHIOPIAN_KNOWLEDGE_MAPS: Record<string, SubjectKnowledgeMap> = {
  'math-g9': {
    subjectId: 'math-g9',
    grade: 9,
    nodes: [
      {
        id: 'km-m9-sets',
        label: 'Sets and Operations',
        amharicLabel: 'ስብስቦችና ክንዋኔዎች',
        grade: 9,
        subjectId: 'math-g9',
        unitNumber: 1,
        topicId: 'math-g9-u1-top1',
        difficulty: 'easy',
        importance: 'foundational',
        masteryPercentage: 85,
        prerequisites: [],
      },
      {
        id: 'km-m9-realnum',
        label: 'Real Numbers & Irrationals',
        amharicLabel: 'እውነተኛ ቁጥሮችና ኢ-አመክንዮአዊ ቁጥሮች',
        grade: 9,
        subjectId: 'math-g9',
        unitNumber: 1,
        topicId: 'math-g9-u1-top2',
        difficulty: 'medium',
        importance: 'core',
        masteryPercentage: 70,
        prerequisites: ['km-m9-sets'],
      },
      {
        id: 'km-m9-equations',
        label: 'Linear Equations & Inequalities',
        amharicLabel: 'ቀጥተኛ እኩልታዎችና አለመመጣጠኖች',
        grade: 9,
        subjectId: 'math-g9',
        unitNumber: 2,
        topicId: 'math-g9-u2-top1',
        difficulty: 'medium',
        importance: 'core',
        masteryPercentage: 65,
        prerequisites: ['km-m9-realnum'],
      },
      {
        id: 'km-m9-quadratic',
        label: 'Quadratic Equations & Discriminants',
        amharicLabel: 'ኳድራቲክ እኩልታዎች',
        grade: 9,
        subjectId: 'math-g9',
        unitNumber: 2,
        topicId: 'math-g9-u2-top2',
        difficulty: 'hard',
        importance: 'advanced',
        masteryPercentage: 45,
        prerequisites: ['km-m9-equations'],
      },
      {
        id: 'km-m9-functions',
        label: 'Relations and Functions',
        amharicLabel: 'ዝምድናዎችና ፈንክሽኖች',
        grade: 9,
        subjectId: 'math-g9',
        unitNumber: 4,
        topicId: 'math-g9-u4-top1',
        difficulty: 'hard',
        importance: 'advanced',
        masteryPercentage: 50,
        prerequisites: ['km-m9-quadratic'],
      },
    ],
    edges: [
      { from: 'km-m9-sets', to: 'km-m9-realnum', relationship: 'prerequisite' },
      { from: 'km-m9-realnum', to: 'km-m9-equations', relationship: 'prerequisite' },
      { from: 'km-m9-equations', to: 'km-m9-quadratic', relationship: 'prerequisite' },
      { from: 'km-m9-quadratic', to: 'km-m9-functions', relationship: 'prerequisite' },
    ],
  },
  'physics-g9': {
    subjectId: 'physics-g9',
    grade: 9,
    nodes: [
      {
        id: 'km-p9-quantities',
        label: 'SI Base Quantities & Vectors',
        amharicLabel: 'መሰረታዊ መጠኖችና ቬክተሮች',
        grade: 9,
        subjectId: 'physics-g9',
        unitNumber: 1,
        topicId: 'phys-g9-u1-top1',
        difficulty: 'easy',
        importance: 'foundational',
        masteryPercentage: 90,
        prerequisites: [],
      },
      {
        id: 'km-p9-motion',
        label: 'Kinematics in 1D',
        amharicLabel: 'የእንቅስቃሴ ህጎች (Kinematics)',
        grade: 9,
        subjectId: 'physics-g9',
        unitNumber: 2,
        topicId: 'phys-g9-u2-top1',
        difficulty: 'medium',
        importance: 'core',
        masteryPercentage: 60,
        prerequisites: ['km-p9-quantities'],
      },
      {
        id: 'km-p9-newton',
        label: "Newton's Laws of Motion & Forces",
        amharicLabel: 'የኒውተን የእንቅስቃሴ ህጎች',
        grade: 9,
        subjectId: 'physics-g9',
        unitNumber: 3,
        topicId: 'phys-g9-u3-top1',
        difficulty: 'hard',
        importance: 'core',
        masteryPercentage: 55,
        prerequisites: ['km-p9-motion'],
      },
      {
        id: 'km-p9-energy',
        label: 'Work, Energy & Power',
        amharicLabel: 'ስራ፣ ጉልበት እና ኃይል',
        grade: 9,
        subjectId: 'physics-g9',
        unitNumber: 4,
        topicId: 'phys-g9-u4-top1',
        difficulty: 'hard',
        importance: 'advanced',
        masteryPercentage: 40,
        prerequisites: ['km-p9-newton'],
      },
    ],
    edges: [
      { from: 'km-p9-quantities', to: 'km-p9-motion', relationship: 'prerequisite' },
      { from: 'km-p9-motion', to: 'km-p9-newton', relationship: 'prerequisite' },
      { from: 'km-p9-newton', to: 'km-p9-energy', relationship: 'prerequisite' },
    ],
  },
  'economics-g9': {
    subjectId: 'economics-g9',
    grade: 9,
    nodes: [
      {
        id: 'km-ec9-scarcity',
        label: 'Scarcity & Opportunity Cost',
        amharicLabel: 'ውሱንነት እና የአማራጭ ዋጋ',
        grade: 9,
        subjectId: 'economics-g9',
        unitNumber: 1,
        topicId: 'econ-g9-u1-top1',
        difficulty: 'easy',
        importance: 'foundational',
        masteryPercentage: 80,
        prerequisites: [],
      },
      {
        id: 'km-ec9-systems',
        label: 'Economic Systems & Decision Making',
        amharicLabel: 'የኢኮኖሚ ሥርዓቶች',
        grade: 9,
        subjectId: 'economics-g9',
        unitNumber: 2,
        topicId: 'econ-g9-u2-top1',
        difficulty: 'medium',
        importance: 'core',
        masteryPercentage: 65,
        prerequisites: ['km-ec9-scarcity'],
      },
      {
        id: 'km-ec9-demand-supply',
        label: 'Market Demand & Supply Elasticity',
        amharicLabel: 'ፍላጎትና አቅርቦት',
        grade: 9,
        subjectId: 'economics-g9',
        unitNumber: 3,
        topicId: 'econ-g9-u3-top1',
        difficulty: 'hard',
        importance: 'core',
        masteryPercentage: 45,
        prerequisites: ['km-ec9-systems'],
      },
    ],
    edges: [
      { from: 'km-ec9-scarcity', to: 'km-ec9-systems', relationship: 'prerequisite' },
      { from: 'km-ec9-systems', to: 'km-ec9-demand-supply', relationship: 'prerequisite' },
    ],
  },
};
