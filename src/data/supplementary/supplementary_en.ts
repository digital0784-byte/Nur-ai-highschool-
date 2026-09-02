import { SupplementaryBook } from '../../types';

export const supplementaryBooksEnglish: SupplementaryBook[] = [
  {
    id: 'supp-math-extreme-11-12',
    title: 'Extreme Series: Advanced Mathematics (Grades 11-12)',
    amharicTitle: 'Extreme Series: Advanced Mathematics & National Exam Prep',
    authorOrSeries: 'Extreme Educational Series',
    category: 'extreme',
    categoryLabel: 'Extreme Series',
    subjectId: 'math',
    grades: [11, 12],
    badge: 'Top Pick for ESSLCE',
    description: 'Grades 11 & 12 math formulas, speed calculation shortcuts, and comprehensive 10-year ESSLCE entrance exam solutions.',
    highlights: [
      'Over 800+ fully worked national exam questions with explanations',
      'Calculus shortcuts for Limits, Derivatives, and Integrals',
      'Rapid matrix inversion and Cramer\'s Rule computation methods',
      'Exam time-management strategies and error prevention tips',
    ],
    chapters: [
      {
        chapterNumber: 1,
        title: 'Matrices, Determinants and Systems of Linear Equations',
        summary: 'Matrix algebra, 2x2 and 3x3 determinants, matrix adjoints, inverses, and Cramer\'s Rule.',
        keyFormulasAndRules: [
          'det([[a, b], [c, d]]) = ad - bc',
          'A⁻¹ = (1 / det(A)) * adj(A)',
          'Cramer\'s Rule: x_i = det(A_i) / det(A)',
          'det(AB) = det(A) * det(B)',
          'det(kA) = kⁿ * det(A) (for n x n matrix)',
        ],
        sampleExamProblems: [
          {
            problem: 'For a 2x2 matrix A with det(A) = 5, find det(3A).',
            solution: 'det(kA) = k² * det(A) for a 2x2 matrix. Therefore, det(3A) = 3² * 5 = 9 * 5 = 45.',
            tip: 'Remember to raise the scalar factor to the power of the matrix dimension (k² for 2x2, k³ for 3x3)!',
          },
        ],
        fullContent: [
          'A matrix is a rectangular array of numbers arranged in rows and columns.',
          'An invertible matrix must have a non-zero determinant (det(A) ≠ 0).',
          'Cramer\'s Rule provides an explicit formula for solving linear systems.',
        ],
      },
      {
        chapterNumber: 2,
        title: 'Limits, Continuity and Differential Calculus Master',
        summary: 'Indeterminate forms (0/0), L\'Hôpital\'s Rule, and essential differentiation shortcuts.',
        keyFormulasAndRules: [
          'L\'Hôpital\'s Rule: lim_{x→c} f(x)/g(x) = lim_{x→c} f\'(x)/g\'(x) for 0/0 or ∞/∞',
          'lim_{x→0} (sin x)/x = 1',
          'lim_{x→0} (1 - cos x)/x = 0',
          'Power Rule: d/dx(xⁿ) = n*xⁿ⁻¹',
          'Product Rule: (uv)\' = u\'v + uv\'',
          'Quotient Rule: (u/v)\' = (u\'v - uv\') / v²',
          'Chain Rule: d/dx(f(g(x))) = f\'(g(x)) * g\'(x)',
        ],
        sampleExamProblems: [
          {
            problem: 'Evaluate lim_{x→0} (sin(5x)) / (3x).',
            solution: 'Using the standard limit: lim_{x→0} (sin(5x) / 5x) * (5/3) = 1 * (5/3) = 5/3. Or by L\'Hôpital: lim_{x→0} (5cos(5x)) / 3 = 5(1)/3 = 5/3.',
            tip: 'Direct shortcut: lim_{x→0} sin(ax)/bx = a/b.',
          },
        ],
        fullContent: [
          'Calculus limits frequently appear on national examinations; recognize indeterminate forms quickly and apply L\'Hôpital\'s rule when suitable.',
        ],
      },
    ],
  },
  {
    id: 'supp-physics-extreme-11-12',
    title: 'Extreme Series: Physics for College Entrance',
    amharicTitle: 'Extreme Series: Physics Entrance Companion',
    authorOrSeries: 'Extreme Educational Series',
    category: 'extreme',
    categoryLabel: 'Extreme Series',
    subjectId: 'physics',
    grades: [11, 12],
    badge: 'Formulas & Rapid Solutions',
    description: 'Consolidated formulas for kinematics, electromagnetism, circuits, and thermodynamics with entrance exam problems.',
    highlights: [
      'Projectile and circular motion formula mastery',
      'Electrostatics and Kirchhoff\'s circuit laws',
      'Electromagnetic induction and Faraday\'s law',
      '100+ worked problems from previous national exams',
    ],
    chapters: [
      {
        chapterNumber: 1,
        title: 'Two-Dimensional Kinematics & Projectile Motion',
        summary: 'Horizontal and vertical components of projectile flight, range, maximum height, and complementary angles.',
        keyFormulasAndRules: [
          'Time of flight: T = (2 * v₀ * sin θ) / g',
          'Maximum height: H = (v₀² * sin² θ) / (2g)',
          'Horizontal range: R = (v₀² * sin(2θ)) / g',
          'Maximum range occurs at θ = 45° where R_max = v₀² / g',
          'Complementary launch angles (θ and 90°-θ) yield equal horizontal ranges',
        ],
        sampleExamProblems: [
          {
            problem: 'A ball is launched at 20 m/s at an angle of 30° to the horizontal. Find its maximum height H. (Take g = 10 m/s²)',
            solution: 'H = (v₀² * sin² θ) / (2g) = (20² * sin²(30°)) / (2 * 10) = (400 * 0.25) / 20 = 100 / 20 = 5 meters.',
            tip: 'Recall sin(30°) = 0.5, so sin²(30°) = 0.25.',
          },
        ],
        fullContent: [
          'Projectile motion combines independent horizontal motion at constant velocity and vertical motion under constant gravitational acceleration.',
        ],
      },
    ],
  },
  {
    id: 'supp-chem-extreme-11-12',
    title: 'Extreme Series: General & Physical Chemistry',
    amharicTitle: 'Extreme Series: Chemistry Exam Companion',
    authorOrSeries: 'Extreme Educational Series',
    category: 'extreme',
    categoryLabel: 'Extreme Series',
    subjectId: 'chemistry',
    grades: [11, 12],
    badge: 'Equilibrium & Redox Calculations',
    description: 'Summary of chemical equilibrium, thermochemistry, electrochemistry, and organic reaction mechanisms.',
    highlights: [
      'Le Chatelier\'s Principle and Kc/Kp calculations',
      'Galvanic cell potentials and Nernst equation',
      'Acid-base pH calculations and buffer solutions',
      'IUPAC organic nomenclature and functional group reactions',
    ],
    chapters: [
      {
        chapterNumber: 1,
        title: 'Chemical Equilibrium and Le Chatelier\'s Principle',
        summary: 'Equilibrium constant expressions, effect of temperature, pressure, and concentration changes.',
        keyFormulasAndRules: [
          'Kc = [C]^c [D]^d / ([A]^a [B]^b) for aA + bB ⇌ cC + dD',
          'Kp = Kc * (RT)^(Δn) where Δn = (c+d) - (a+b)',
          'If Q < K, reaction shifts forward (to the right)',
          'If Q > K, reaction shifts in reverse (to the left)',
        ],
        sampleExamProblems: [
          {
            problem: 'For the exothermic reaction N₂(g) + 3H₂(g) ⇌ 2NH₃(g) + Heat, what happens to the equilibrium yield of NH₃ if temperature increases?',
            solution: 'Because the reaction is exothermic, heat acts as a product. Increasing temperature shifts equilibrium in reverse (left), decreasing NH₃ yield.',
            tip: 'For exothermic reactions, heating decreases Kc and shifts equilibrium left.',
          },
        ],
        fullContent: [
          'Le Chatelier\'s Principle states that when an external disturbance is applied to a dynamic equilibrium, the system adjusts to counteract the change.',
        ],
      },
    ],
  },
  {
    id: 'supp-biology-extreme-11-12',
    title: 'Extreme Series: Comprehensive Biology (Grades 11-12)',
    amharicTitle: 'Extreme Series: Molecular Biology & Genetics',
    authorOrSeries: 'Extreme Educational Series',
    category: 'extreme',
    categoryLabel: 'Extreme Series',
    subjectId: 'biology',
    grades: [11, 12],
    badge: 'Diagrams & Genetic Tables',
    description: 'Molecular genetics (DNA replication, transcription, translation), Mendelian inheritance, and biodiversity conservation.',
    highlights: [
      'DNA vs. RNA comparative tables and universal genetic code',
      'Cellular respiration ATP balance sheet (Glycolysis, Krebs, ETC)',
      'Mendelian monohybrid and dihybrid cross ratios',
      'Endemic wildlife and national parks of Ethiopia',
    ],
    chapters: [
      {
        chapterNumber: 1,
        title: 'Molecular Genetics: DNA Structure & Protein Synthesis',
        summary: 'DNA double helix, Chargaff\'s base pairing rules, transcription, and translation.',
        keyFormulasAndRules: [
          'Chargaff\'s Rule: %A = %T and %G = %C',
          'A pairs with T via 2 hydrogen bonds; G pairs with C via 3 hydrogen bonds',
          'Start Codon: AUG (Methionine)',
          'Stop Codons: UAA, UAG, UGA',
        ],
        sampleExamProblems: [
          {
            problem: 'If a double-stranded DNA sample contains 28% Adenine (A), calculate the percentage of Cytosine (C).',
            solution: 'By Chargaff\'s Rule, %T = %A = 28%. Total A+T = 56%. Remaining G+C = 100% - 56% = 44%. Since %G = %C, Cytosine = 44% / 2 = 22%.',
            tip: 'Quick check: %A + %T + %G + %C = 100%.',
          },
        ],
        fullContent: [
          'DNA stores hereditary genetic instructions using four nitrogenous bases: Adenine, Thymine, Cytosine, and Guanine.',
        ],
      },
    ],
  },
  {
    id: 'supp-national-exam-past-papers',
    title: 'ESSLCE National Exam Solved Past Papers (2010 - 2024)',
    amharicTitle: 'Ethiopian University Entrance Examination Past Papers Archive',
    authorOrSeries: 'FDRE EAES National Assessment Archive',
    category: 'national_exam',
    categoryLabel: 'National Exam Archive',
    subjectId: 'all',
    grades: [12],
    badge: '15 Years of Solved Exams',
    description: 'Comprehensive 15-year archive of Grade 12 ESSLCE national exam papers with step-by-step verified answer keys.',
    highlights: [
      'Mathematics, Physics, Chemistry, Biology, and English exam papers',
      'Question topic frequency and high-yield scoring guides',
      'Common student pitfalls and trick identification',
      'Subject-specific time allocation charts for exam hall success',
    ],
    chapters: [
      {
        chapterNumber: 1,
        title: 'Mathematics National Exam Frequent Questions & Methods',
        summary: 'High-frequency exam questions across Calculus, Matrices, Vectors, and Trigonometry.',
        keyFormulasAndRules: [
          'Calculus optimization: set f\'(x) = 0 to identify critical points',
          'Second Derivative Test: f\'\'(x) > 0 implies local minimum; f\'\'(x) < 0 implies local maximum',
        ],
        sampleExamProblems: [
          {
            problem: 'Find the local maximum value of f(x) = 2x³ - 9x² + 12x + 1.',
            solution: 'f\'(x) = 6x² - 18x + 12 = 0 => 6(x - 1)(x - 2) = 0 => x = 1, x = 2. f\'\'(x) = 12x - 18. At x = 1, f\'\'(1) = -6 < 0 (Maximum). Value f(1) = 2(1)³ - 9(1)² + 12(1) + 1 = 6.',
            tip: 'Check whether the problem asks for the coordinate x or the maximum value f(x)!',
          },
        ],
        fullContent: ['Calculus optimization questions appear consistently every year on the national university entrance exam.'],
      },
    ],
  },
  {
    id: 'supp-alpha-formula-handbook',
    title: 'Alpha High School Complete Formula Matrix',
    amharicTitle: 'Alpha High School Quick Reference Formula Matrix',
    authorOrSeries: 'Alpha Science Publications',
    category: 'formula_handbook',
    categoryLabel: 'Formula Matrix',
    subjectId: 'all',
    grades: [9, 10, 11, 12],
    badge: 'All Formulas in One Guide',
    description: 'Essential formula matrix covering Mathematics, Physics, and Chemistry for Grades 9-12.',
    highlights: [
      'Geometry, algebra, and trigonometry formula tables',
      'Physics SI units, universal constants, and kinematic formulas',
      'Chemistry gas laws, molarity equations, and thermodynamics constants',
    ],
    chapters: [
      {
        chapterNumber: 1,
        title: 'Universal Constants and Master Formula Reference',
        summary: 'Essential physical constants and standard mathematical formulas for revision.',
        keyFormulasAndRules: [
          'Gravitational acceleration g ≈ 9.8 m/s² (or 10 m/s² for national exams)',
          'Coulomb\'s constant k = 8.99 × 10⁹ N·m²/C²',
          'Planck\'s constant h = 6.626 × 10⁻³⁴ J·s',
          'Avogadro\'s number N_A = 6.022 × 10²³ mol⁻¹',
          'Universal gas constant R = 8.314 J/(mol·K) = 0.0821 L·atm/(mol·K)',
        ],
        sampleExamProblems: [],
        fullContent: ['This consolidated formula guide allows swift revision before midterm and national entrance examinations.'],
      },
    ],
  },
];
