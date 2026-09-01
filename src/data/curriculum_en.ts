import { Subject } from '../types';

export const curriculumEnglish: Subject[] = [
  // 1. Mathematics
  {
    id: 'math',
    name: 'Mathematics',
    subName: 'Math (Grade 9-12)',
    accentColor: '#1D4ED8',
    accentLight: '#EFF6FF',
    accentBorder: '#2563EB',
    accentBadge: '#1E40AF',
    topics: [
      {
        id: 'math-9-10',
        title: 'Quadratic Equations',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'Methods of Solving Second-Degree Quadratic Equations',
        lessonContent: [
          'A quadratic equation is any single-variable polynomial equation written in standard form as ax² + bx + c = 0, where a, b, and c are real constants and a ≠ 0. The highest exponent of the unknown variable is 2.',
          'There are three primary algebraic methods for solving quadratic equations: factorization, completing the square, and the universal quadratic formula: x = (-b ± √(b² - 4ac)) / (2a).',
          'The expression inside the square root, (b² - 4ac), is called the discriminant (D). If D > 0, there are two distinct real roots; if D = 0, there is exactly one repeated real root; and if D < 0, there are no real roots (two complex conjugate roots).'
        ],
        keyPoints: [
          'Standard Form: ax² + bx + c = 0 (a ≠ 0)',
          'Quadratic Formula: x = (-b ± √(b² - 4ac)) / 2a',
          'Discriminant D = b² - 4ac determines the nature of the roots'
        ],
        flashcards: [
          {
            id: 'm1-fc1',
            front: 'What is a Quadratic Equation?',
            back: 'A polynomial equation of degree 2, standard form: ax² + bx + c = 0.'
          },
          {
            id: 'm1-fc2',
            front: 'What is the Discriminant (D)?',
            back: 'D = b² - 4ac, which determines the number and type of roots.'
          },
          {
            id: 'm1-fc3',
            front: 'What happens when D < 0?',
            back: 'The equation has no real solutions (two complex solutions).'
          },
          {
            id: 'm1-fc4',
            front: 'What is the Quadratic Formula?',
            back: 'x = (-b ± √(b² - 4ac)) / (2a)'
          }
        ],
        quizQuestions: [
          {
            id: 'm1-q1',
            question: 'If b² - 4ac = 0 in ax² + bx + c = 0, how many real roots exist?',
            options: ['No real roots', 'Exactly one real root', 'Two distinct real roots', 'Infinite roots'],
            correctIndex: 1,
            explanation: 'When the discriminant is zero, the equation yields exactly one repeated real root.'
          },
          {
            id: 'm1-q2',
            question: 'What are the roots of the equation x² - 5x + 6 = 0?',
            options: ['x = 2 and x = 3', 'x = -2 and x = -3', 'x = 1 and x = 6', 'x = -1 and x = 5'],
            correctIndex: 0,
            explanation: 'Factoring into (x - 2)(x - 3) = 0 gives solutions x = 2 and x = 3.'
          },
          {
            id: 'm1-q3',
            question: 'What geometric shape represents the graph of a quadratic function?',
            options: ['Straight line', 'Parabola', 'Hyperbola', 'Circle'],
            correctIndex: 1,
            explanation: 'The graph of any second-degree polynomial f(x) = ax² + bx + c is a parabola.'
          },
          {
            id: 'm1-q4',
            question: 'For the equation 2x² + 4x - 6 = 0, what are the values of a, b, and c?',
            options: ['a=2, b=4, c=-6', 'a=4, b=2, c=6', 'a=2, b=-4, c=6', 'a=1, b=2, c=-3'],
            correctIndex: 0,
            explanation: 'Comparing with standard form ax² + bx + c = 0 gives a=2, b=4, c=-6.'
          }
        ]
      },
      {
        id: 'math-11-12',
        title: 'Calculus & Concepts of Derivatives',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'Instantaneous Rate of Change and Derivative Fundamentals',
        lessonContent: [
          'Calculus is the mathematical study of continuous change. The derivative measures the instantaneous rate of change of a function with respect to its independent variable, representing geometrically the slope of the tangent line at any point.',
          'Formally defined through limits: f\'(x) = lim(h→0) [f(x+h) - f(x)] / h. This concept allows analysis of extrema (local maxima and minima), concavity, and optimization across physics, biology, and economics.',
          'Essential differentiation rules include the Power Rule d/dx(xⁿ) = n·xⁿ⁻¹, the Product Rule, Quotient Rule, and Chain Rule for composite functions.'
        ],
        keyPoints: [
          'Power Rule: d/dx(xⁿ) = n · xⁿ⁻¹',
          'Geometric Meaning: Slope of the tangent line to the curve',
          'The derivative of any constant value is always 0'
        ],
        flashcards: [
          {
            id: 'm2-fc1',
            front: 'What does the derivative represent geometrically?',
            back: 'The slope of the tangent line to the function graph at that point.'
          },
          {
            id: 'm2-fc2',
            front: 'What is the derivative of f(x) = x⁴?',
            back: 'f\'(x) = 4x³ (using the Power Rule).'
          },
          {
            id: 'm2-fc3',
            front: 'What is the derivative of a constant c (e.g., f(x) = 15)?',
            back: 'Always 0 (zero), because constants do not change.'
          },
          {
            id: 'm2-fc4',
            front: 'When do we use the Chain Rule in calculus?',
            back: 'When differentiating composite functions f(g(x)).'
          }
        ],
        quizQuestions: [
          {
            id: 'm2-q1',
            question: 'What is the derivative f\'(x) of f(x) = 3x² + 5x - 7?',
            options: ['6x + 5', '3x + 5', '6x - 7', '6x² + 5'],
            correctIndex: 0,
            explanation: 'Differentiating term by term: d/dx(3x²) = 6x, d/dx(5x) = 5, d/dx(-7) = 0.'
          },
          {
            id: 'm2-q2',
            question: 'When f\'(x) = 0 at a point on a curve, the tangent line is:',
            options: ['Horizontal', 'Vertical', 'Slanted at 45 degrees', 'Non-existent'],
            correctIndex: 0,
            explanation: 'A slope of zero corresponds to a horizontal tangent, indicating stationary/critical points.'
          },
          {
            id: 'm2-q3',
            question: 'What is the derivative of f(x) = sin(x)?',
            options: ['cos(x)', '-cos(x)', '-sin(x)', 'sec²(x)'],
            correctIndex: 0,
            explanation: 'The standard derivative of sin(x) with respect to x is cos(x).'
          },
          {
            id: 'm2-q4',
            question: 'How is instantaneous velocity obtained from a position function s(t)?',
            options: ['By taking the first derivative v(t) = ds/dt', 'By multiplying distance by time', 'By dividing acceleration by mass', 'By finding the square root of time'],
            correctIndex: 0,
            explanation: 'Instantaneous velocity is the time derivative of position: v(t) = ds/dt.'
          }
        ]
      }
    ]
  },

  // 2. Physics
  {
    id: 'physics',
    name: 'Physics',
    subName: 'Physics (Grade 9-12)',
    accentColor: '#7C3AED',
    accentLight: '#F5F3FF',
    accentBorder: '#8B5CF6',
    accentBadge: '#6D28D9',
    topics: [
      {
        id: 'phys-9-10',
        title: 'Newton\'s Laws of Motion',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'Principles of Force, Mass, and Dynamic Motion',
        lessonContent: [
          'Sir Isaac Newton formulated three fundamental laws of motion that constitute the core framework of classical mechanics.',
          'The First Law (Inertia) states that an object remains at rest or moves at a constant velocity unless acted upon by a net external force. The Second Law demonstrates that acceleration is directly proportional to net force and inversely proportional to mass (F = ma).',
          'The Third Law asserts that for every action force, there is an equal and opposite reaction force acting simultaneously on a different body.'
        ],
        keyPoints: [
          '1st Law: Inertia — resistance to changes in state of motion',
          '2nd Law: F = m · a (Force = mass × acceleration)',
          '3rd Law: Action-Reaction pairs on interacting bodies'
        ],
        flashcards: [
          {
            id: 'p1-fc1',
            front: 'What is Newton\'s First Law commonly called?',
            back: 'The Law of Inertia.'
          },
          {
            id: 'p1-fc2',
            front: 'What is the formula for Newton\'s Second Law?',
            back: 'F = m · a (Net Force = mass × acceleration).'
          },
          {
            id: 'p1-fc3',
            front: 'What is the SI unit of Force?',
            back: 'Newton (N), equivalent to kg·m/s².'
          },
          {
            id: 'p1-fc4',
            front: 'Give an example of Newton\'s Third Law.',
            back: 'A swimmer pushes water backward, and the water pushes the swimmer forward.'
          }
        ],
        quizQuestions: [
          {
            id: 'p1-q1',
            question: 'What acceleration is produced by a 50 N force acting on a 10 kg object?',
            options: ['5 m/s²', '500 m/s²', '0.2 m/s²', '40 m/s²'],
            correctIndex: 0,
            explanation: 'a = F / m = 50 N / 10 kg = 5 m/s².'
          },
          {
            id: 'p1-q2',
            question: 'Why do passengers lurch forward when a bus suddenly brakes?',
            options: ['Due to inertia of motion', 'Due to gravity increase', 'Due to reduced friction', 'Due to air pressure'],
            correctIndex: 0,
            explanation: 'Inertia causes the passengers\' bodies to maintain their forward state of motion.'
          },
          {
            id: 'p1-q3',
            question: 'Action and reaction force pairs always act on:',
            options: ['Two different interacting objects', 'The same object', 'Opposite directions at different times', 'Objects in vacuum only'],
            correctIndex: 0,
            explanation: 'Action and reaction forces act simultaneously on two distinct objects.'
          },
          {
            id: 'p1-q4',
            question: 'If an object moves at a constant velocity in a straight line, what is the net force?',
            options: ['0 N (Zero)', 'Equal to its mass', 'Equal to its speed', 'Infinite'],
            correctIndex: 0,
            explanation: 'Constant velocity implies acceleration a = 0; hence F_net = m(0) = 0 N.'
          }
        ]
      },
      {
        id: 'phys-11-12',
        title: 'Electromagnetism & Waves',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'Electromagnetic Induction and Wave Mechanics',
        lessonContent: [
          'Electromagnetism explores the interrelation between moving electric charges and magnetic fields. A moving charge generates a magnetic field around its trajectory.',
          'Faraday\'s Law of Electromagnetic Induction states that the induced electromotive force (EMF) in a closed loop is proportional to the rate of change of magnetic flux. Lenz\'s Law gives the direction: the induced current opposes the flux change causing it.',
          'Electromagnetic waves consist of oscillating perpendicular electric and magnetic fields that propagate through vacuum at the speed of light (c ≈ 3 × 10⁸ m/s). The universal wave relationship is v = f · λ.'
        ],
        keyPoints: [
          'Faraday\'s Law: EMF = -N(ΔΦ/Δt)',
          'Wave Equation: v = f · λ (Speed = frequency × wavelength)',
          'Electromagnetic waves do not require a physical medium'
        ],
        flashcards: [
          {
            id: 'p2-fc1',
            front: 'What does Faraday\'s Law of Induction state?',
            back: 'A changing magnetic flux induces an electromotive force (voltage) in a conductor.'
          },
          {
            id: 'p2-fc2',
            front: 'What is the speed of light in vacuum?',
            back: 'Approximately 3.0 × 10⁸ m/s (300,000 km/s).'
          },
          {
            id: 'p2-fc3',
            front: 'What is the SI unit of frequency?',
            back: 'Hertz (Hz), equivalent to cycles per second (1/s).'
          },
          {
            id: 'p2-fc4',
            front: 'What principle powers an electrical generator?',
            back: 'Electromagnetic induction (converting mechanical work into electrical energy).'
          }
        ],
        quizQuestions: [
          {
            id: 'p2-q1',
            question: 'What is the speed of a wave with wavelength 2 m and frequency 150 Hz?',
            options: ['300 m/s', '75 m/s', '152 m/s', '0.013 m/s'],
            correctIndex: 0,
            explanation: 'v = f · λ = 150 Hz × 2 m = 300 m/s.'
          },
          {
            id: 'p2-q2',
            question: 'What is the primary function of a transformer?',
            options: ['To step up or step down AC voltage', 'To convert AC to DC', 'To eliminate magnetic flux', 'To store electric charge'],
            correctIndex: 0,
            explanation: 'Transformers alter alternating current voltage levels via electromagnetic induction.'
          },
          {
            id: 'p2-q3',
            question: 'Which of the following is a mechanical wave requiring a material medium?',
            options: ['Sound wave', 'Radio wave', 'X-ray', 'Gamma ray'],
            correctIndex: 0,
            explanation: 'Sound waves are mechanical longitudinal waves requiring physical media to propagate.'
          },
          {
            id: 'p2-q4',
            question: 'Lenz\'s Law is a direct consequence of which conservation law?',
            options: ['Conservation of Energy', 'Conservation of Mass', 'Conservation of Momentum', 'Conservation of Charge'],
            correctIndex: 0,
            explanation: 'Lenz\'s Law ensures the induced current does not violate energy conservation.'
          }
        ]
      }
    ]
  },

  // 3. Chemistry
  {
    id: 'chemistry',
    name: 'Chemistry',
    subName: 'Chemistry (Grade 9-12)',
    accentColor: '#C2410C',
    accentLight: '#FFF7ED',
    accentBorder: '#EA580C',
    accentBadge: '#9A3412',
    topics: [
      {
        id: 'chem-9-10',
        title: 'Atomic Structure & Chemical Bonding',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'Subatomic Particles and Bonding Mechanisms',
        lessonContent: [
          'An atom is the fundamental building block of matter, consisting of a dense nucleus with protons (+ charge) and neutrons (neutral), orbited by electrons (- charge) in energy shells.',
          'Atoms form chemical bonds to attain stable octet configurations (8 valence electrons). Ionic bonds form via electron transfer between metals and non-metals; covalent bonds form via electron sharing between non-metals; metallic bonds exist in pure metals.',
          'The Periodic Table organizes elements by increasing atomic number into groups (valence electrons) and periods (energy shells).'
        ],
        keyPoints: [
          'Atomic Number (Z) = Number of protons',
          'Mass Number (A) = Protons + Neutrons',
          'Ionic (electron transfer) vs. Covalent (electron sharing)'
        ],
        flashcards: [
          {
            id: 'c1-fc1',
            front: 'What are Isotopes?',
            back: 'Atoms of the same element with identical atomic numbers but different neutron numbers.'
          },
          {
            id: 'c1-fc2',
            front: 'What characterizes a Covalent Bond?',
            back: 'A chemical bond formed when atoms share pairs of valence electrons.'
          },
          {
            id: 'c1-fc3',
            front: 'Which subatomic particle carries a negative charge?',
            back: 'The electron.'
          },
          {
            id: 'c1-fc4',
            front: 'What type of bond is found in sodium chloride (NaCl)?',
            back: 'Ionic bond (between Na⁺ and Cl⁻ ions).'
          }
        ],
        quizQuestions: [
          {
            id: 'c1-q1',
            question: 'What is the mass number of an atom with 11 protons and 12 neutrons?',
            options: ['23', '11', '12', '1'],
            correctIndex: 0,
            explanation: 'Mass number A = protons (11) + neutrons (12) = 23 (Sodium).'
          },
          {
            id: 'c1-q2',
            question: 'What type of bonding exists between Hydrogen and Oxygen in H₂O?',
            options: ['Polar covalent bond', 'Ionic bond', 'Metallic bond', 'Nuclear bond'],
            correctIndex: 0,
            explanation: 'Water molecules share electrons between non-metal atoms with electronegativity differences.'
          },
          {
            id: 'c1-q3',
            question: 'According to the Octet Rule, main group atoms seek to have how many valence electrons?',
            options: ['8', '2', '6', '10'],
            correctIndex: 0,
            explanation: 'Atoms bond to achieve a stable noble-gas configuration of 8 valence electrons.'
          },
          {
            id: 'c1-q4',
            question: 'What are Group 1 elements on the periodic table called?',
            options: ['Alkali metals', 'Halogens', 'Noble gases', 'Alkaline earth metals'],
            correctIndex: 0,
            explanation: 'Group 1 elements (Li, Na, K, Rb, Cs, Fr) are known as the alkali metals.'
          }
        ]
      },
      {
        id: 'chem-11-12',
        title: 'Chemical Equilibrium & Thermodynamics',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'Reaction Kinetics, Dynamic Balance, and Free Energy',
        lessonContent: [
          'Chemical equilibrium is reached in a closed system when forward and reverse reaction rates become equal, keeping reactant and product concentrations constant over time.',
          'Le Chatelier\'s Principle dictates that when an external stress (change in temperature, pressure, or concentration) is applied to an equilibrium system, the position shifts to counteract the imposed change.',
          'Chemical thermodynamics governs reaction feasibility via enthalpy (ΔH), entropy (ΔS), and Gibbs Free Energy (ΔG = ΔH - TΔS). A negative ΔG indicates a spontaneous process.'
        ],
        keyPoints: [
          'Le Chatelier: System opposes external perturbations',
          'Equilibrium Constant Keq = [Products] / [Reactants]',
          'ΔG < 0 defines spontaneous processes'
        ],
        flashcards: [
          {
            id: 'c2-fc1',
            front: 'What does Le Chatelier\'s Principle state?',
            back: 'A system at equilibrium responds to stress in a direction that relieves the stress.'
          },
          {
            id: 'c2-fc2',
            front: 'What is Entropy (S)?',
            back: 'A thermodynamic measure of the disorder or randomness in a system.'
          },
          {
            id: 'c2-fc3',
            front: 'What is the sign of ΔH for an exothermic reaction?',
            back: 'Negative (ΔH < 0), because heat is released to surroundings.'
          },
          {
            id: 'c2-fc4',
            front: 'What is the Gibbs Free Energy equation?',
            back: 'ΔG = ΔH - TΔS'
          }
        ],
        quizQuestions: [
          {
            id: 'c2-q1',
            question: 'A chemical reaction is thermodynamically spontaneous when ΔG is:',
            options: ['Negative (ΔG < 0)', 'Positive (ΔG > 0)', 'Zero', 'Undefined'],
            correctIndex: 0,
            explanation: 'When ΔG < 0, the reaction can occur spontaneously under specified conditions.'
          },
          {
            id: 'c2-q2',
            question: 'For N₂(g) + 3H₂(g) ⇌ 2NH₃(g), increasing pressure shifts equilibrium:',
            options: ['To the right (towards NH₃)', 'To the left (towards N₂ and H₂)', 'No change', 'Reaction stops'],
            correctIndex: 0,
            explanation: 'Higher pressure favors the side with fewer gas moles (4 moles on left vs 2 on right).'
          },
          {
            id: 'c2-q3',
            question: 'How does a catalyst affect a chemical reaction at equilibrium?',
            options: ['Lowers activation energy and speeds both directions equally', 'Changes the value of Keq', 'Increases product yield', 'Alters ΔH'],
            correctIndex: 0,
            explanation: 'A catalyst increases reaction rate by lowering activation energy without shifting equilibrium.'
          },
          {
            id: 'c2-q4',
            question: 'What is the sign of entropy change (ΔS) when liquid water freezes into ice?',
            options: ['Negative (ΔS < 0)', 'Positive (ΔS > 0)', 'Zero', 'Infinite'],
            correctIndex: 0,
            explanation: 'Transitioning from liquid to organized solid crystal decreases system disorder (ΔS < 0).'
          }
        ]
      }
    ]
  },

  // 4. Biology
  {
    id: 'biology',
    name: 'Biology',
    subName: 'Life Sciences (Grade 9-12)',
    accentColor: '#15803D',
    accentLight: '#F0FDF4',
    accentBorder: '#16A34A',
    accentBadge: '#166534',
    topics: [
      {
        id: 'bio-9-10',
        title: 'Cell Structure & Function',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'The Basic Unit of Life and Cellular Organelles',
        lessonContent: [
          'The cell is the basic structural and functional unit of all living organisms. Cell Theory states that all living things are composed of cells, the cell is the basic unit of life, and all cells arise from pre-existing cells.',
          'Cells are classified into Prokaryotes (lacking membrane-bound nuclei, such as bacteria) and Eukaryotes (possessing true nuclei and organelles, including plant and animal cells).',
          'Key organelles include mitochondria (cellular respiration and ATP production), chloroplasts (photosynthesis in plants), ribosomes (protein synthesis), and the nucleus (DNA storage).'
        ],
        keyPoints: [
          'Cell Theory: All life is cellular; cells arise from division',
          'Mitochondria: Powerhouse generating cellular energy (ATP)',
          'Plant cells have rigid cellulose walls and chloroplasts'
        ],
        flashcards: [
          {
            id: 'b1-fc1',
            front: 'Which organelle is called the "Powerhouse of the Cell"?',
            back: 'The Mitochondrion (produces ATP via cellular respiration).'
          },
          {
            id: 'b1-fc2',
            front: 'Name two structures found in plant cells but not animal cells.',
            back: 'Cell wall and Chloroplasts (also large central vacuole).'
          },
          {
            id: 'b1-fc3',
            front: 'How do prokaryotic cells differ from eukaryotic cells?',
            back: 'Prokaryotes lack a membrane-enclosed nucleus and organelles.'
          },
          {
            id: 'b1-fc4',
            front: 'What is the primary function of ribosomes?',
            back: 'Protein synthesis (translating mRNA into polypeptide chains).'
          }
        ],
        quizQuestions: [
          {
            id: 'b1-q1',
            question: 'Photosynthesis in green plants takes place inside which organelle?',
            options: ['Chloroplast', 'Mitochondria', 'Golgi apparatus', 'Lysosome'],
            correctIndex: 0,
            explanation: 'Chloroplasts capture light energy to synthesize glucose and oxygen.'
          },
          {
            id: 'b1-q2',
            question: 'Which cellular structure contains the genetic material (DNA) in eukaryotes?',
            options: ['Nucleus', 'Cytoplasm', 'Vacuole', 'Plasma membrane'],
            correctIndex: 0,
            explanation: 'The nucleus houses eukaryotic chromosomes and directs cell metabolism.'
          },
          {
            id: 'b1-q3',
            question: 'Which of the following organisms is prokaryotic?',
            options: ['Bacterium (E. coli)', 'Yeast fungus', 'Human red blood cell', 'Amoeba'],
            correctIndex: 0,
            explanation: 'Bacteria are classic prokaryotic organisms without membrane-bound nuclei.'
          },
          {
            id: 'b1-q4',
            question: 'What is the major structural polysaccharide in plant cell walls?',
            options: ['Cellulose', 'Glycogen', 'Cholesterol', 'Keratin'],
            correctIndex: 0,
            explanation: 'Plant cell walls derive rigidity from structural cellulose microfibrils.'
          }
        ]
      },
      {
        id: 'bio-11-12',
        title: 'Genetics & Molecular Biology of DNA',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'Patterns of Inheritance and the Central Dogma',
        lessonContent: [
          'Genetics investigates heredity and variation across generations. Gregor Mendel established the foundational laws of segregation and independent assortment through pea plant hybridization.',
          'DNA (Deoxyribonucleic Acid) carries genetic blueprints in a double-helix structure. Its four nitrogenous bases pair specifically: Adenine (A) with Thymine (T), and Guanine (G) with Cytosine (C).',
          'Protein synthesis follows the Central Dogma: Transcription converts DNA into mRNA in the nucleus, and Translation converts mRNA into amino acid sequences on ribosomes.'
        ],
        keyPoints: [
          'Base-Pairing: A pairs with T, G pairs with C',
          'Central Dogma: DNA → mRNA (Transcription) → Protein (Translation)',
          'Mendelian Genetics: Dominant and recessive allele segregation'
        ],
        flashcards: [
          {
            id: 'b2-fc1',
            front: 'Which base pairs with Adenine (A) in DNA?',
            back: 'Thymine (T) (forming 2 hydrogen bonds).'
          },
          {
            id: 'b2-fc2',
            front: 'What is Transcription?',
            back: 'The synthesis of mRNA from a DNA template strand.'
          },
          {
            id: 'b2-fc3',
            front: 'Who is recognized as the Father of Genetics?',
            back: 'Gregor Mendel.'
          },
          {
            id: 'b2-fc4',
            front: 'How many nucleotide bases comprise a single codon?',
            back: '3 bases (triplet code for one specific amino acid).'
          }
        ],
        quizQuestions: [
          {
            id: 'b2-q1',
            question: 'Which nitrogenous base replaces Thymine (T) in RNA molecules?',
            options: ['Uracil (U)', 'Adenine (A)', 'Cytosine (C)', 'Guanine (G)'],
            correctIndex: 0,
            explanation: 'RNA contains Uracil (U) which pairs with Adenine instead of Thymine.'
          },
          {
            id: 'b2-q2',
            question: 'In a monohybrid cross of two heterozygotes (Aa × Aa), what is the probability of recessive offspring (aa)?',
            options: ['25% (1/4)', '50% (1/2)', '75% (3/4)', '100%'],
            correctIndex: 0,
            explanation: 'Punnett square shows genotypic ratio 1 AA : 2 Aa : 1 aa (25% aa).'
          },
          {
            id: 'b2-q3',
            question: 'Who deduced the double-helix structure of DNA in 1953?',
            options: ['James Watson and Francis Crick', 'Charles Darwin and Alfred Wallace', 'Gregor Mendel and Thomas Morgan', 'Louis Pasteur and Robert Koch'],
            correctIndex: 0,
            explanation: 'Watson and Crick modeled the double helix using Rosalind Franklin\'s X-ray crystallography data.'
          },
          {
            id: 'b2-q4',
            question: 'What is a Genetic Mutation?',
            options: ['A permanent change in the nucleotide sequence of DNA', 'Normal cell replication', 'Osmotic water loss', 'Enzymatic protein digestion'],
            correctIndex: 0,
            explanation: 'Mutations are hereditary changes in the genetic code resulting from errors or mutagens.'
          }
        ]
      }
    ]
  },

  // 5. English Language
  {
    id: 'english',
    name: 'English',
    subName: 'English (Grade 9-12)',
    accentColor: '#0D9488',
    accentLight: '#F0FDFA',
    accentBorder: '#14B8A6',
    accentBadge: '#115E59',
    topics: [
      {
        id: 'eng-9-10',
        title: 'Active & Passive Voice and Verb Tenses',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'Mastering Voice and Grammatical Precision',
        lessonContent: [
          'In English grammar, voice indicates whether the subject of a sentence performs or receives the action. In active voice, the subject acts: "The researcher conducted the experiment." In passive voice, the subject is acted upon: "The experiment was conducted by the researcher."',
          'The passive voice is constructed with an appropriate form of the auxiliary verb "to be" plus the past participle (V3) of the main verb. It is favored in scientific literature where the action and results take precedence over the agent.',
          'Understanding verb tenses ensures clarity across sequential timeframes, including simple past, past continuous, and present perfect aspects.'
        ],
        keyPoints: [
          'Active: Subject acts (e.g., The team won the match)',
          'Passive: Subject receives action (e.g., The match was won by the team)',
          'Formula: Form of "to be" + Past Participle (V3)'
        ],
        flashcards: [
          {
            id: 'e1-fc1',
            front: 'Convert to passive: "The chef prepared the dinner."',
            back: '"The dinner was prepared by the chef."'
          },
          {
            id: 'e1-fc2',
            front: 'When is passive voice especially preferred?',
            back: 'In scientific/objective writing or when the actor is unknown/unimportant.'
          },
          {
            id: 'e1-fc3',
            front: 'What is the past participle of "choose"?',
            back: '"Chosen" (choose - chose - chosen).'
          },
          {
            id: 'e1-fc4',
            front: 'Convert to passive: "They are repairing the bridge."',
            back: '"The bridge is being repaired."'
          }
        ],
        quizQuestions: [
          {
            id: 'e1-q1',
            question: 'Which sentence is written in the passive voice?',
            options: [
              'The national examination was administered across all regions.',
              'Students prepared diligently for the examination.',
              'The teacher distributed the examination papers.',
              'Everyone completed the exam on time.'
            ],
            correctIndex: 0,
            explanation: '"Was administered" uses "be + V3", emphasizing the recipient.'
          },
          {
            id: 'e1-q2',
            question: 'Complete: "By the time the bell rang, all students _______ their papers."',
            options: ['had submitted', 'has submitted', 'submit', 'was submitting'],
            correctIndex: 0,
            explanation: 'Past Perfect ("had submitted") represents an action completed before another past event.'
          },
          {
            id: 'e1-q3',
            question: 'What is the correct passive form of "Albert Einstein discovered the law"?',
            options: [
              'The law was discovered by Albert Einstein.',
              'The law is discovered by Albert Einstein.',
              'The law had discovered by Albert Einstein.',
              'Albert Einstein was discovered by the law.'
            ],
            correctIndex: 0,
            explanation: 'Past simple passive requires "was discovered".'
          },
          {
            id: 'e1-q4',
            question: 'Which sentence correctly utilizes the Present Perfect tense?',
            options: [
              'She has resided in this city for six years.',
              'She resided in this city since six years.',
              'She has live in this city yesterday.',
              'She is residing in this city last year.'
            ],
            correctIndex: 0,
            explanation: '"Has resided" with "for six years" correctly denotes continuing duration.'
          }
        ]
      },
      {
        id: 'eng-11-12',
        title: 'Conditionals & Discourse Markers',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'Complex Hypothetical Structures and Academic Cohesion',
        lessonContent: [
          'Conditional sentences express hypothetical scenarios and their logical consequences. The Third Conditional expresses unreal past situations: "If + had + past participle, would have + past participle" (e.g., "If we had left earlier, we would have caught the flight").',
          'Inverted conditional clauses provide stylistic variety in formal prose: "Had we known the risk, we would have taken precautions."',
          'Discourse markers (such as "furthermore," "consequently," "on the contrary," and "nevertheless") provide cohesion and logical signposting across argumentative paragraphs.'
        ],
        keyPoints: [
          '3rd Conditional: If + had + V3, would have + V3 (unreal past)',
          'Inversion: "Had I known..." replaces "If I had known..."',
          'Discourse markers structure contrast, addition, and causation'
        ],
        flashcards: [
          {
            id: 'e2-fc1',
            front: 'What does the Third Conditional describe?',
            back: 'Hypothetical past situations that did not occur and their imaginary outcomes.'
          },
          {
            id: 'e2-fc2',
            front: 'Complete: "If she _______ the deadline, she would have received credit."',
            back: '"had met" (Past Perfect in third conditional if-clause).'
          },
          {
            id: 'e2-fc3',
            front: 'Give an example of a discourse marker showing concession/contrast.',
            back: '"Nevertheless", "Nonetheless", or "However".'
          },
          {
            id: 'e2-fc4',
            front: 'What is the inverted form of "If you had informed us"?',
            back: '"Had you informed us..."'
          }
        ],
        quizQuestions: [
          {
            id: 'e2-q1',
            question: '"If the team _______ the initial guidelines, the error would not have occurred."',
            options: ['had followed', 'followed', 'have followed', 'would follow'],
            correctIndex: 0,
            explanation: 'The third conditional requires "had followed" in the conditional clause.'
          },
          {
            id: 'e2-q2',
            question: 'Which discourse marker indicates a consequential result?',
            options: ['Consequently', 'However', 'Whereas', 'Nonetheless'],
            correctIndex: 0,
            explanation: '"Consequently" establishes direct cause-and-effect relationship.'
          },
          {
            id: 'e2-q3',
            question: '"If the laboratory confirms the findings tomorrow, we _______ the publication."',
            options: ['will proceed with', 'would proceed with', 'would have proceeded with', 'proceeded with'],
            correctIndex: 0,
            explanation: 'First conditional (real future condition) pairs simple present with "will + verb".'
          },
          {
            id: 'e2-q4',
            question: 'Select the sentence with accurate academic cohesion:',
            options: [
              'The dataset was limited; nevertheless, the researchers derived statistically valid conclusions.',
              'The dataset was limited; because, researchers derived conclusions.',
              'The dataset was limited; although, conclusions were found.',
              'The dataset was limited; therefore, it was very comprehensive.'
            ],
            correctIndex: 0,
            explanation: '"Nevertheless" accurately introduces contrast between dataset limits and successful findings.'
          }
        ]
      }
    ]
  },

  // 6. Literature & National Languages
  {
    id: 'amharic',
    name: 'Literature & Languages',
    subName: 'Ethiopian Literature',
    accentColor: '#D97706',
    accentLight: '#FFFBEB',
    accentBorder: '#F59E0B',
    accentBadge: '#B45309',
    topics: [
      {
        id: 'amh-9-10',
        title: 'Literary Forms & Oral Traditions',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'Structure of Oral and Written Literary Arts',
        lessonContent: [
          'Literature is an artistic medium capturing human philosophy, emotion, and societal reality through elevated language. It divides into Oral Literature (transmitted verbally across generations) and Written Literature.',
          'Oral literary traditions include proverbs, riddles, heroic chants (Qerereto and Fukera), wedding ballads, and dirges, embodying cultural heritage and collective memory.',
          'Written prose includes narrative fiction, drama, and poetry. Core elements of narrative include plot, characterization, theme, setting, and dramatic conflict.'
        ],
        keyPoints: [
          'Oral Literature: Living cultural heritage transmitted verbally',
          'Narrative elements: Theme, Plot, Character, Setting, Conflict',
          'Poetry elements: Meter, Rhyme, Stanza, and Rhythm'
        ],
        flashcards: [
          {
            id: 'a1-fc1',
            front: 'What is Oral Literature?',
            back: 'Artistic expressions passed down orally from generation to generation.'
          },
          {
            id: 'a1-fc2',
            front: 'What is the sequence of events in a narrative called?',
            back: 'The Plot.'
          },
          {
            id: 'a1-fc3',
            front: 'What defines theatrical drama?',
            back: 'Literature composed for live performance by actors through dialogue and action.'
          },
          {
            id: 'a1-fc4',
            front: 'Give examples of oral literary forms.',
            back: 'Proverbs, folk tales, riddles, battle chants, and laments.'
          }
        ],
        quizQuestions: [
          {
            id: 'a1-q1',
            question: 'What term describes the central underlying idea of a literary work?',
            options: ['Theme', 'Plot', 'Setting', 'Dialogue'],
            correctIndex: 0,
            explanation: 'Theme represents the overarching philosophical concept conveyed by the author.'
          },
          {
            id: 'a1-q2',
            question: 'Which of the following is an example of written literature rather than oral folklore?',
            options: ['A full-length published Novel', 'Folk tales', 'Traditional proverbs', 'Warrior battle chants'],
            correctIndex: 0,
            explanation: 'A novel is a written literary genre created through textual publication.'
          },
          {
            id: 'a1-q3',
            question: 'What literary component defines the specific time and geographic location of a story?',
            options: ['Setting', 'Conflict', 'Climax', 'Protagonist'],
            correctIndex: 0,
            explanation: 'Setting establishes the physical environment and historical period.'
          },
          {
            id: 'a1-q4',
            question: 'A single line of verse in poetry is known as:',
            options: ['Verse / Line', 'Paragraph', 'Act', 'Prologue'],
            correctIndex: 0,
            explanation: 'A single line in poetic composition is termed a verse or poetic line.'
          }
        ]
      },
      {
        id: 'amh-11-12',
        title: 'Wax and Gold Poetics & Rhetoric',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'Dual-Layer Meaning and Classical Poetic Rhetoric',
        lessonContent: [
          'Wax and Gold (Sem-ena-Worq) is a classical poetic tradition characterized by multi-layered semantic ambiguity. The "Wax" is the overt, surface meaning readily apparent to the listener; the "Gold" is the hidden, esoteric truth concealed underneath.',
          'The transition between layers relies on a pivotal pun or double entendre (Hibire-Qal). This rhetoric allows subtle social critique, theological reflection, and political satire.',
          'Cultivated within traditional Ethiopian scholarly institutions (Qine Bet), this tradition represents one of Africa\'s most sophisticated indigenous rhetorical frameworks.'
        ],
        keyPoints: [
          'Wax (Sem): The apparent, superficial meaning',
          'Gold (Worq): The hidden, profound philosophical meaning',
          'Hibire-Qal: The pivotal word connecting both layers'
        ],
        flashcards: [
          {
            id: 'a2-fc1',
            front: 'What does the "Wax" represent in Wax and Gold?',
            back: 'The apparent, surface-level literal meaning.'
          },
          {
            id: 'a2-fc2',
            front: 'What does the "Gold" represent?',
            back: 'The secret, intended, deeper underlying message.'
          },
          {
            id: 'a2-fc3',
            front: 'What is the "Hibire-Qal" in Qine poetics?',
            back: 'The pivot word carrying dual semantic meanings connecting wax to gold.'
          },
          {
            id: 'a2-fc4',
            front: 'Why is Wax and Gold significant in rhetoric?',
            back: 'It enables nuanced critique, philosophical depth, and poetic mastery.'
          }
        ],
        quizQuestions: [
          {
            id: 'a2-q1',
            question: 'What is the pivotal word linking the superficial and deep meanings in Wax and Gold poetics?',
            options: ['Hibire-Qal (Pivot Word)', 'Rhyme marker', 'Verse ending', 'Antithesis'],
            correctIndex: 0,
            explanation: 'Hibire-Qal is the essential homophonic or polysemous word carrying both senses.'
          },
          {
            id: 'a2-q2',
            question: 'The literal, obvious meaning in traditional poetics is termed:',
            options: ['The Wax (Sem)', 'The Gold (Worq)', 'The Verse', 'The Meter'],
            correctIndex: 0,
            explanation: 'The Wax encases the precious Gold beneath an apparent surface.'
          },
          {
            id: 'a2-q3',
            question: 'Where has classical Qine poetry historically been taught and refined?',
            options: ['Traditional schools of rhetoric and poetics (Qine Bet)', 'Modern trade schools', 'Foreign academies', 'Maritime ports'],
            correctIndex: 0,
            explanation: 'Qine schools preserved and cultivated complex verse compositions for centuries.'
          },
          {
            id: 'a2-q4',
            question: 'What is a primary aesthetic and social benefit of Wax and Gold?',
            options: ['Expressing complex critique with elegance and intellectual subtlety', 'Reducing word count', 'Removing all metaphors', 'Amplifying volume'],
            correctIndex: 0,
            explanation: 'It permits sophisticated socio-political and philosophical commentary through indirect art.'
          }
        ]
      }
    ]
  },

  // 7. History & Social Studies
  {
    id: 'social-studies',
    name: 'History & Social Studies',
    subName: 'History (Grade 9-12)',
    accentColor: '#B91C1C',
    accentLight: '#FEF2F2',
    accentBorder: '#DC2626',
    accentBadge: '#991B1B',
    topics: [
      {
        id: 'soc-9-10',
        title: 'Ancient Civilizations & Trade Networks',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'The Aksumite Empire, Technology, and Maritime Commerce',
        lessonContent: [
          'The Aksumite civilization flourished in the Horn of Africa as one of the major powers of the ancient world between the 1st and 8th centuries CE alongside Rome, Persia, and China.',
          'Through the Red Sea port of Adulis, Aksum engaged in extensive global trade with the Mediterranean, Arabia, and India, exporting ivory, gold, frankincense, and obsidian.',
          'Aksum minted its own coinage in gold, silver, and bronze—the first sub-Saharan civilization to do so—and engineered monolithic stelae without mortar, demonstrating advanced metallurgy and civil engineering.'
        ],
        keyPoints: [
          'Port of Adulis: International hub on the Red Sea trade route',
          'Monetary Innovation: Aksum minted distinct gold and silver coinage',
          'Architecture: Towering monolithic granite stelae'
        ],
        flashcards: [
          {
            id: 's1-fc1',
            front: 'What was Aksum\'s primary international port city?',
            back: 'Adulis, located on the Red Sea coast.'
          },
          {
            id: 's1-fc2',
            front: 'Who was the first Aksumite monarch to mint coins?',
            back: 'King Endubis (late 3rd century CE).'
          },
          {
            id: 's1-fc3',
            front: 'What were Aksum\'s major export commodities?',
            back: 'Gold, ivory, frankincense, myrrh, and live animals.'
          },
          {
            id: 's1-fc4',
            front: 'What contributed to Aksum\'s decline in trade?',
            back: 'Loss of Red Sea naval routes and shift in regional trade hubs.'
          }
        ],
        quizQuestions: [
          {
            id: 's1-q1',
            question: 'When did the Aksumite Empire begin minting its own currency?',
            options: ['Late 3rd Century CE', '10th Century CE', '1st Century BCE', '16th Century CE'],
            correctIndex: 0,
            explanation: 'King Endubis initiated Aksumite coinage around the late 3rd century CE.'
          },
          {
            id: 's1-q2',
            question: 'With which ancient empire did Aksum NOT conduct direct maritime trade?',
            options: ['Inca Empire of the Andes', 'Roman Empire', 'Byzantine Empire', 'Ancient India'],
            correctIndex: 0,
            explanation: 'The Inca Empire was in South America and had no contact with Afro-Eurasian trade routes.'
          },
          {
            id: 's1-q3',
            question: 'Aksum\'s monumental obelisks are carved from what type of stone?',
            options: ['Single blocks of solid granite (Monolithic)', 'Baked clay bricks', 'Compressed limestone', 'Pounded earth'],
            correctIndex: 0,
            explanation: 'The stelae are celebrated monolithic monuments carved out of single granite boulders.'
          },
          {
            id: 's1-q4',
            question: 'Under which king did Christianity become the state religion of Aksum?',
            options: ['King Ezana (mid-4th century CE)', 'King Kaleb', 'King Gebre Mesqel', 'King Endubis'],
            correctIndex: 0,
            explanation: 'King Ezana declared Christianity the official state religion in the 4th century.'
          }
        ]
      },
      {
        id: 'soc-11-12',
        title: 'Modern History & The Battle of Adwa',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'Sovereignty, Anti-Colonial Resistance, and Victory at Adwa',
        lessonContent: [
          'The Battle of Adwa (March 1, 1896 / Yekatit 23, 1888 E.C.) represents a landmark victory where Ethiopian forces decisively defeated an invading Italian colonial army, preserving national independence.',
          'Tensions originated from Article 17 of the 1889 Treaty of Wuchale, which contained discrepant clauses: the Italian version made Ethiopia an Italian protectorate, while the Amharic text preserved autonomous diplomacy.',
          'Emperor Menelik II and Empress Taytu Betul mobilized over 100,000 troops across regional lines, outmaneuvering General Baratieri\'s army and securing international recognition of Ethiopian sovereignty.'
        ],
        keyPoints: [
          'Date of Victory: March 1, 1896 (Yekatit 23, 1888 E.C.)',
          'Treaty of Wuchale Article 17 was the diplomatic spark',
          'Global Impact: Became a beacon of Pan-African anti-colonial struggle'
        ],
        flashcards: [
          {
            id: 's2-fc1',
            front: 'When did the historic Battle of Adwa take place?',
            back: 'March 1, 1896 (Yekatit 23, 1888 Ethiopian Calendar).'
          },
          {
            id: 's2-fc2',
            front: 'What caused the diplomatic breakdown leading to war?',
            back: 'The conflicting versions of Article 17 in the Treaty of Wuchale.'
          },
          {
            id: 's2-fc3',
            front: 'Who commanded the Italian colonial invasion force at Adwa?',
            back: 'General Oreste Baratieri.'
          },
          {
            id: 's2-fc4',
            front: 'What was the global significance of the Battle of Adwa?',
            back: 'It proved African resistance could defeat colonial powers, inspiring Pan-Africanism.'
          }
        ],
        quizQuestions: [
          {
            id: 's2-q1',
            question: 'In what year was the Treaty of Wuchale originally signed?',
            options: ['1889 (1881 E.C.)', '1896', '1875', '1905'],
            correctIndex: 0,
            explanation: 'The Treaty of Wuchale was signed in May 1889.'
          },
          {
            id: 's2-q2',
            question: 'Which leader played a decisive role in cutting off Italian water supplies at the Siege of Mekelle?',
            options: ['Empress Taytu Betul', 'Queen Zewditu', 'Empress Menen', 'Queen Eleni'],
            correctIndex: 0,
            explanation: 'Empress Taytu devised the crucial tactical siege of the Mekelle water source.'
          },
          {
            id: 's2-q3',
            question: 'Which treaty formally repealed the Treaty of Wuchale and recognized Ethiopian independence?',
            options: ['Treaty of Addis Ababa (October 1896)', 'Treaty of London', 'Treaty of Rome', 'Treaty of Paris'],
            correctIndex: 0,
            explanation: 'The 1896 Treaty of Addis Ababa annulled Wuchale and affirmed Ethiopian sovereignty.'
          },
          {
            id: 's2-q4',
            question: 'What was the broader international impact of the victory at Adwa?',
            options: [
              'It shattered the myth of European invincibility and fueled Pan-African movements',
              'It accelerated European colonization of Ethiopia',
              'It eliminated all international trade in the Horn of Africa',
              'It abolished naval seafaring in the Red Sea'
            ],
            correctIndex: 0,
            explanation: 'Adwa became an enduring international beacon of anti-colonial resistance and African dignity.'
          }
        ]
      }
    ]
  },

  // 8. Information and Communication Technology (ICT)
  {
    id: 'ict',
    name: 'ICT',
    subName: 'Computer Science & ICT',
    accentColor: '#475569',
    accentLight: '#F8FAFC',
    accentBorder: '#64748B',
    accentBadge: '#334155',
    topics: [
      {
        id: 'ict-9-10',
        title: 'Computer Hardware, Software & Networks',
        gradeTier: '9-10',
        applicableGrades: [9, 10],
        lessonTitle: 'System Architecture, Memory, and Networking Fundamentals',
        lessonContent: [
          'A computer system consists of Hardware (physical components: CPU, RAM, Storage, Input/Output devices) and Software (programs and operating instructions directing operations).',
          'The Central Processing Unit (CPU) executes instruction cycles. RAM provides volatile, high-speed working memory that resets on power-off, whereas SSDs and Hard Drives provide persistent non-volatile storage.',
          'Computer networks enable communication and resource sharing. Networks are classified geographically into LAN (Local Area Network covering a school or home) and WAN (Wide Area Network spanning nations, such as the Internet).'
        ],
        keyPoints: [
          'CPU: Central Processing Unit — system brain executing instructions',
          'RAM (Volatile working memory) vs. Storage (Non-volatile retention)',
          'LAN (Local Network) vs. WAN (Wide Area Network / Internet)'
        ],
        flashcards: [
          {
            id: 'i1-fc1',
            front: 'What is often termed the "Brain" of the computer?',
            back: 'CPU (Central Processing Unit).'
          },
          {
            id: 'i1-fc2',
            front: 'What is the main difference between RAM and ROM?',
            back: 'RAM is volatile temporary memory; ROM is non-volatile permanent storage.'
          },
          {
            id: 'i1-fc3',
            front: 'What does the acronym LAN stand for?',
            back: 'Local Area Network.'
          },
          {
            id: 'i1-fc4',
            front: 'Give examples of popular Operating Systems.',
            back: 'Windows, Linux, macOS, Android, and iOS.'
          }
        ],
        quizQuestions: [
          {
            id: 'i1-q1',
            question: 'Which of the following devices is purely an Input Device?',
            options: ['Keyboard and Mouse', 'Monitor screen', 'Inkjet printer', 'Audio speaker'],
            correctIndex: 0,
            explanation: 'Keyboards and mice input user instructions into the computer system.'
          },
          {
            id: 'i1-q2',
            question: '1 Gigabyte (1 GB) is equivalent to how many Megabytes (MB)?',
            options: ['1,024 MB', '100 MB', '1,000,000 MB', '10 MB'],
            correctIndex: 0,
            explanation: 'In binary computer architecture, 1 GB = 1024 MB.'
          },
          {
            id: 'i1-q3',
            question: 'Which software application is used to navigate and view World Wide Web pages?',
            options: ['Web Browser', 'Operating System kernel', 'Spreadsheet compiler', 'Disk defragmenter'],
            correctIndex: 0,
            explanation: 'Web browsers (Chrome, Firefox, Edge) retrieve and render HTML documents.'
          },
          {
            id: 'i1-q4',
            question: 'What is the primary role of an IP Address?',
            options: ['Uniquely identifying a device connected to a network', 'Increasing hardware clock speed', 'Cleaning registry cache', 'Calibrating screen colors'],
            correctIndex: 0,
            explanation: 'An IP address provides an addressable identifier for network routing.'
          }
        ]
      },
      {
        id: 'ict-11-12',
        title: 'Relational Databases & Cybersecurity',
        gradeTier: '11-12',
        applicableGrades: [11, 12],
        lessonTitle: 'Database Design, SQL Queries, and Digital Defense',
        lessonContent: [
          'A Database is an organized collection of structured data for efficient storage, retrieval, and modification. Relational Database Management Systems (RDBMS) structure data into tables of rows (records) and columns (attributes).',
          'Structured Query Language (SQL) manages data using core operations: SELECT (query), INSERT (add), UPDATE (modify), and DELETE (remove). A Primary Key uniquely identifies each row record.',
          'Cybersecurity protects systems, networks, and data from digital attacks (Malware, Phishing, Ransomware). Defenses revolve around the CIA Triad: Confidentiality, Integrity, and Availability.'
        ],
        keyPoints: [
          'SQL Commands: SELECT, INSERT INTO, UPDATE, DELETE',
          'Primary Key: Unique identifier for each table record',
          'CIA Triad: Confidentiality, Integrity, and Availability'
        ],
        flashcards: [
          {
            id: 'i2-fc1',
            front: 'What is a Primary Key in relational database design?',
            back: 'A column or set of columns uniquely identifying each table record.'
          },
          {
            id: 'i2-fc2',
            front: 'What is a Phishing attack?',
            back: 'A deceptive message tricking users into revealing passwords or sensitive data.'
          },
          {
            id: 'i2-fc3',
            front: 'Which SQL command retrieves data from a database?',
            back: 'The SELECT command (e.g. SELECT * FROM Students;).'
          },
          {
            id: 'i2-fc4',
            front: 'What is Encryption?',
            back: 'Encoding data so only authorized parties possessing a key can read it.'
          }
        ],
        quizQuestions: [
          {
            id: 'i2-q1',
            question: 'Which SQL statement is used to insert new records into a table?',
            options: ['INSERT INTO', 'SELECT', 'UPDATE', 'ADD RECORD'],
            correctIndex: 0,
            explanation: 'INSERT INTO adds new data rows to specified tables.'
          },
          {
            id: 'i2-q2',
            question: 'What does the CIA Triad represent in information security?',
            options: [
              'Confidentiality, Integrity, Availability',
              'Computer, Internet, Access',
              'Code, Information, Authentication',
              'Control, Input, Automation'
            ],
            correctIndex: 0,
            explanation: 'The CIA Triad forms the foundational model for security policy.'
          },
          {
            id: 'i2-q3',
            question: 'What is the security advantage of Two-Factor Authentication (2FA)?',
            options: [
              'Requires a second verification step, keeping accounts secure even if passwords leak',
              'Increases download bandwidth',
              'Reduces battery consumption',
              'Removes the need for passwords'
            ],
            correctIndex: 0,
            explanation: '2FA enforces dual-step authentication, blocking unauthorized password use.'
          },
          {
            id: 'i2-q4',
            question: 'What is the primary function of a network Firewall?',
            options: [
              'Filtering and inspecting incoming/outgoing network traffic to block unauthorized access',
              'Cooling down server processors',
              'Formatting corrupted hard drives',
              'Regulating power supply voltage'
            ],
            correctIndex: 0,
            explanation: 'Firewalls enforce security boundaries by inspecting packets against defined rules.'
          }
        ]
      }
    ]
  }
];
