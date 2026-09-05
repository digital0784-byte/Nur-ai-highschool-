import { SubjectTextbookCollection } from './textbooks_am';

export const textbooksDataEnglish: SubjectTextbookCollection = {
  math: {
    9: {
      subjectId: 'math',
      grade: 9,
      title: 'Mathematics Student Textbook - Grade 9',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'Grade 9 Mathematics Student Textbook: Number systems, linear equations, plane geometry, quadratic equations, and statistics.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: The Number System & Sets',
          summary: 'In-depth study of rational and irrational numbers, real numbers, and set operations with Venn diagrams.',
          sections: [
            {
              title: '1.1 Properties of Real Numbers',
              content: [
                'The set of Real Numbers (ℝ) consists of natural numbers (ℕ), integers (ℤ), rational numbers (ℚ), and irrational numbers (ℚ\').',
                'A rational number can be expressed in the form a/b where a and b are integers and b ≠ 0. Irrational numbers cannot be written as fractions (e.g., √2, √3, π).',
                'Key properties include Closure, Commutative, Associative, and Distributive properties of addition and multiplication.',
              ],
              keyTerms: [
                { term: 'Real Number (ℝ)', definition: 'Any number that can be represented on the continuous real number line.' },
                { term: 'Irrational Number', definition: 'A non-terminating, non-repeating decimal that cannot be expressed as a/b.' },
              ],
              workedExamples: [
                {
                  question: 'Example 1: Prove that 0.333... is a rational number by expressing it in the form a/b.',
                  solution: 'Let x = 0.333... Multiply both sides by 10: 10x = 3.333... Subtract x from 10x: 9x = 3 => x = 3/9 = 1/3. Hence, 1/3 is a rational number.',
                },
              ],
              exercises: [
                '1. Explain why √5 is irrational.',
                '2. Convert 0.252525... into a fraction in lowest terms.',
              ],
            },
            {
              title: '1.2 Sets and Set Operations',
              content: [
                'A set is a well-defined collection of distinct objects or elements.',
                'Fundamental set operations include Union (A ∪ B), Intersection (A ∩ B), Difference (A \\ B), and Complement (A\').',
              ],
              workedExamples: [
                {
                  question: 'Example 2: If A = {1, 2, 3, 4} and B = {3, 4, 5, 6}, find A ∩ B and A ∪ B.',
                  solution: 'A ∩ B = {3, 4} (common elements). A ∪ B = {1, 2, 3, 4, 5, 6} (combined elements).',
                },
              ],
            },
          ],
          unitReviewQuestions: [
            '1. State the fundamental differences between rational and irrational numbers.',
            '2. Using Venn diagrams, verify De Morgan\'s Laws: (A ∪ B)\' = A\' ∩ B\'.',
          ],
        },
        {
          unitNumber: 2,
          title: 'Unit 2: Linear Equations & Inequalities',
          summary: 'Solving single-variable and simultaneous two-variable linear equations and inequalities.',
          sections: [
            {
              title: '2.1 Linear Equations in One Variable',
              content: [
                'The standard form of a linear equation is ax + b = 0 where a ≠ 0.',
                'Equal operations (addition, subtraction, multiplication, non-zero division) preserve equality.',
              ],
              workedExamples: [
                {
                  question: 'Example: Solve 3(2x - 4) = 4x + 6.',
                  solution: 'Expand: 6x - 12 = 4x + 6 => 6x - 4x = 6 + 12 => 2x = 18 => x = 9. Solution set: {9}.',
                },
              ],
            },
          ],
          unitReviewQuestions: ['1. Solve 2x + 3y = 12 and x - y = 1 by elimination.'],
        },
        {
          unitNumber: 3,
          title: 'Unit 3: Quadratic Equations',
          summary: 'Solving quadratic equations using factoring, completing the square, and the quadratic formula.',
          sections: [
            {
              title: '3.1 The Quadratic Formula',
              content: [
                'Standard form: ax² + bx + c = 0 (a ≠ 0).',
                'Formula: x = (-b ± √(b² - 4ac)) / (2a).',
                'The discriminant D = b² - 4ac determines root nature: D > 0 (2 distinct real roots), D = 0 (1 repeated root), D < 0 (no real roots).',
              ],
              workedExamples: [
                {
                  question: 'Example: Solve 2x² - 5x + 2 = 0 using the quadratic formula.',
                  solution: 'a = 2, b = -5, c = 2. D = (-5)² - 4(2)(2) = 25 - 16 = 9. x = (5 ± 3) / 4 => x₁ = 2, x₂ = 1/2.',
                },
              ],
            },
          ],
          unitReviewQuestions: ['1. Solve x² - 6x + 8 = 0 by factoring and by completing the square.'],
        },
      ],
    },
    10: {
      subjectId: 'math',
      grade: 10,
      title: 'Mathematics Student Textbook - Grade 10',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'Polynomial functions, exponential & logarithmic functions, trigonometry, and coordinate geometry.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Polynomial Functions',
          summary: 'Polynomial division, Remainder Theorem, Factor Theorem, and finding real roots.',
          sections: [
            {
              title: '1.1 Factor and Remainder Theorems',
              content: [
                'When polynomial P(x) is divided by (x - c), remainder R = P(c) (Remainder Theorem).',
                'If P(c) = 0, then (x - c) is a factor of P(x) (Factor Theorem).',
              ],
              workedExamples: [
                {
                  question: 'Find the remainder when P(x) = x³ - 3x² + 4x - 2 is divided by (x - 1).',
                  solution: 'P(1) = 1³ - 3(1)² + 4(1) - 2 = 1 - 3 + 4 - 2 = 0. Remainder is 0, so (x - 1) is a factor.',
                },
              ],
            },
          ],
          unitReviewQuestions: ['1. Factorize completely: x³ - 6x² + 11x - 6.'],
        },
        {
          unitNumber: 2,
          title: 'Unit 2: Exponential & Logarithmic Functions',
          summary: 'Exponent laws, logarithm laws, solving exponential equations.',
          sections: [
            {
              title: '2.1 Laws of Logarithms',
              content: [
                'log_b(xy) = log_b(x) + log_b(y)',
                'log_b(x/y) = log_b(x) - log_b(y)',
                'log_b(x^k) = k · log_b(x)',
              ],
            },
          ],
          unitReviewQuestions: ['1. Solve log₂(x) + log₂(x - 2) = 3.'],
        },
      ],
    },
    11: {
      subjectId: 'math',
      grade: 11,
      title: 'Mathematics Student Textbook - Grade 11',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'Relations & functions, matrices and determinants, sequences & series, vectors in 2D and 3D.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Matrices and Determinants',
          summary: 'Matrix operations, inverses, determinants, and solving systems using Cramer\'s Rule.',
          sections: [
            {
              title: '1.1 Matrix Operations and Inverses',
              content: [
                'For 2x2 matrix A = [[a, b], [c, d]], det(A) = ad - bc.',
                'A⁻¹ = (1/det(A)) * [[d, -b], [-c, a]] where det(A) ≠ 0.',
              ],
            },
          ],
          unitReviewQuestions: ['1. Use Cramer\'s rule to solve 3x + 2y = 7 and x - 4y = -7.'],
        },
      ],
    },
    12: {
      subjectId: 'math',
      grade: 12,
      title: 'Mathematics Student Textbook - Grade 12 (Calculus & Analytical Geometry)',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'Limits and continuity, derivatives, applications of derivatives, and integral calculus for national exams.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Limits & Continuity',
          summary: 'Intuitive and algebraic limit definitions, one-sided limits, continuity of functions.',
          sections: [
            {
              title: '1.1 Computing Limits',
              content: [
                'lim_{x→c} f(x) = L means f(x) approaches L as x approaches c.',
                'Limit properties: Sum, Product, and Quotient rules apply when individual limits exist.',
              ],
            },
          ],
          unitReviewQuestions: ['1. Evaluate lim_{x→2} (x² - 4)/(x - 2).'],
        },
        {
          unitNumber: 2,
          title: 'Unit 2: Derivatives & Differentiation Techniques',
          summary: 'Rates of change, Power rule, Product rule, Quotient rule, and Chain rule.',
          sections: [
            {
              title: '2.1 Rules of Differentiation',
              content: [
                'Power Rule: d/dx(xⁿ) = n·xⁿ⁻¹',
                'Product Rule: (uv)\' = u\'v + uv\'',
                'Quotient Rule: (u/v)\' = (u\'v - uv\') / v²',
                'Chain Rule: d/dx(f(g(x))) = f\'(g(x)) · g\'(x)',
              ],
            },
          ],
          unitReviewQuestions: ['1. Find derivative of f(x) = (3x² - 5)⁴.'],
        },
      ],
    },
  },
  physics: {
    9: {
      subjectId: 'physics',
      grade: 9,
      title: 'Physics Student Textbook - Grade 9',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 6,
      description: 'Physics & measurement, vectors, 1D kinematics, Newton\'s laws of motion, work, energy & power.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Physics & Measurement',
          summary: 'Fundamental and derived physical quantities, SI units, scientific notation.',
          sections: [{ title: '1.1 SI Base Units', content: ['The 7 SI base units are meter (m), kilogram (kg), second (s), ampere (A), kelvin (K), mole (mol), and candela (cd).'] }],
        },
        {
          unitNumber: 2,
          title: 'Unit 2: Motion in One Dimension',
          summary: 'Distance, displacement, speed, velocity, and uniform acceleration.',
          sections: [{ title: '2.1 Kinematic Equations', content: ['v = u + at, s = ut + 0.5at², v² = u² + 2as'] }],
        },
      ],
    },
    10: {
      subjectId: 'physics',
      grade: 10,
      title: 'Physics Student Textbook - Grade 10',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'Electrostatics, electric current & DC circuits, magnetism, and wave motion.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Electrostatics & Coulomb\'s Law',
          summary: 'Electric charges, Coulomb\'s Law, electric field intensity, and potential difference.',
          sections: [{ title: '1.1 Coulomb\'s Law', content: ['F = k·|q₁q₂| / r², where k = 8.99 × 10⁹ N·m²/C².'] }],
        },
      ],
    },
    11: {
      subjectId: 'physics',
      grade: 11,
      title: 'Physics Student Textbook - Grade 11',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 6,
      description: '2D kinematics (Projectile motion), rotational dynamics, thermodynamics, fluid mechanics.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Projectile Motion & 2D Kinematics',
          summary: 'Trajectory, horizontal range (R), maximum height (H), and time of flight (T).',
          sections: [{ title: '1.1 Projectile Formulas', content: ['Range R = (u² sin(2θ))/g, Max Height H = (u² sin²θ)/(2g), Time of Flight T = (2u sinθ)/g.'] }],
        },
      ],
    },
    12: {
      subjectId: 'physics',
      grade: 12,
      title: 'Physics Student Textbook - Grade 12',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 6,
      description: 'Electromagnetic induction, AC circuits, atomic physics, quantum physics, and nuclear energy.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Electromagnetic Induction & Faraday\'s Law',
          summary: 'Magnetic flux, Faraday\'s law, Lenz\'s law, transformers and AC generators.',
          sections: [{ title: '1.1 Faraday\'s Law', content: ['Induced EMF ε = -N · (dΦ_B / dt); Transformer: V_p / V_s = N_p / N_s = I_s / I_p.'] }],
        },
      ],
    },
  },
  chemistry: {
    9: {
      subjectId: 'chemistry',
      grade: 9,
      title: 'Chemistry Student Textbook - Grade 9',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'Atomic structure, periodic table trends, chemical bonding, and types of chemical reactions.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Atomic Structure & The Periodic Table',
          summary: 'Subatomic particles, Bohr model, electron configuration using Aufbau Principle.',
          sections: [{ title: '1.1 Electron Configuration', content: ['Aufbau Principle: Electrons occupy lowest energy orbitals first (1s < 2s < 2p < 3s).'] }],
        },
      ],
    },
    10: {
      subjectId: 'chemistry',
      grade: 10,
      title: 'Chemistry Student Textbook - Grade 10',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'Acids, bases, salts, stoichiometry, and introductory organic hydrocarbons.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Acids, Bases & Salts',
          summary: 'Arrhenius & Brønsted-Lowry theories, pH scale, and neutralization reactions.',
          sections: [{ title: '1.1 The pH Scale', content: ['pH = -log[H⁺]; pH < 7 acidic, pH = 7 neutral, pH > 7 basic.'] }],
        },
      ],
    },
    11: {
      subjectId: 'chemistry',
      grade: 11,
      title: 'Chemistry Student Textbook - Grade 11',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 6,
      description: 'Chemical bonding (VSEPR & Hybridization), states of matter, chemical equilibrium.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Chemical Equilibrium & Le Chatelier\'s Principle',
          summary: 'Equilibrium constant (Kc, Kp), factors affecting chemical equilibrium position.',
          sections: [{ title: '1.1 Le Chatelier\'s Principle', content: ['If an external stress (concentration, temperature, pressure) is applied to a system at equilibrium, the system adjusts to counteract the change.'] }],
        },
      ],
    },
    12: {
      subjectId: 'chemistry',
      grade: 12,
      title: 'Chemistry Student Textbook - Grade 12',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 6,
      description: 'Electrochemistry (Galvanic & Electrolytic cells), industrial chemistry in Ethiopia, polymers.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Electrochemistry & Galvanic Cells',
          summary: 'Redox reactions, Standard Cell Potential E°_cell = E°_cathode - E°_anode, Nernst equation.',
          sections: [{ title: '1.1 Standard Cell Potential', content: ['E°_cell = E°_cathode - E°_anode (Spontaneous when E°_cell > 0).'] }],
        },
      ],
    },
  },
  biology: {
    9: {
      subjectId: 'biology',
      grade: 9,
      title: 'Biology Student Textbook - Grade 9',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'Cell biology, microscope use, human organ systems (digestive, respiratory, circulatory).',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Cell Structure and Function',
          summary: 'Plant vs. Animal cells, organelles (Mitochondria, Chloroplasts, Nucleus, Ribosomes).',
          sections: [{ title: '1.1 Organelles', content: ['Mitochondria are the powerhouses of the cell, generating ATP via cellular respiration.'] }],
        },
      ],
    },
    10: {
      subjectId: 'biology',
      grade: 10,
      title: 'Biology Student Textbook - Grade 10',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'Ecology, biodiversity conservation in Ethiopia, genetics foundations, human reproduction.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Ecology & Conservation in Ethiopia',
          summary: 'Food chains, trophic energy pyramids, endemic wildlife conservation (Walia Ibex, Ethiopian Wolf).',
          sections: [{ title: '1.1 Ecosystem Dynamics', content: ['Primary producers convert solar energy into biochemical energy via photosynthesis.'] }],
        },
      ],
    },
    11: {
      subjectId: 'biology',
      grade: 11,
      title: 'Biology Student Textbook - Grade 11',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'Biomolecules (Carbohydrates, Lipids, Proteins, Nucleic acids), enzyme kinetics, cellular respiration.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Biomolecules & Enzyme Kinetics',
          summary: 'Lock & Key vs Induced Fit models, activation energy, factors affecting enzyme rates.',
          sections: [{ title: '1.1 Enzymes', content: ['Enzymes are biological catalysts that lower activation energy without being consumed.'] }],
        },
      ],
    },
    12: {
      subjectId: 'biology',
      grade: 12,
      title: 'Biology Student Textbook - Grade 12',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'Molecular genetics (DNA Replication, Transcription, Translation), Mendelian genetics, biotechnology.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Molecular Genetics & DNA',
          summary: 'Double helix structure, base pairing rules (A-T, G-C), transcription and protein synthesis.',
          sections: [{ title: '1.1 DNA Structure', content: ['Adenine pairs with Thymine via 2 hydrogen bonds; Guanine pairs with Cytosine via 3 hydrogen bonds.'] }],
        },
      ],
    },
  },
  history: {
    9: {
      subjectId: 'history',
      grade: 9,
      title: 'History Student Textbook - Grade 9',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 6,
      description: 'Hominid evolution in East Africa, ancient civilizations (Axum, Punt, Lalibela), medieval Ethiopia.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Human Evolution & Ancient Ethiopian Civilizations',
          summary: 'Lucy (Dinknesh), Ardi, Axumite trade routes, coinage, and architectural stelae.',
          sections: [{ title: '1.1 Axumite Kingdom', content: ['Axum was a major global maritime and trading empire connecting the Red Sea, Mediterranean, and India.'] }],
        },
      ],
    },
    10: {
      subjectId: 'history',
      grade: 10,
      title: 'History Student Textbook - Grade 10',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: '19th century Ethiopia, resistance against colonial aggression, the Victory of Adwa (1896).',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: The Battle and Victory of Adwa (1896)',
          summary: 'Treaty of Wuchale Article XVII, unified national mobilization, global significance of black sovereignty.',
          sections: [{ title: '1.1 Battle of Adwa', content: ['Under Emperor Menelik II and Empress Taytu, Ethiopian forces decisively defeated the Italian colonial army.'] }],
        },
      ],
    },
    11: {
      subjectId: 'history',
      grade: 11,
      title: 'History Student Textbook - Grade 11',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'World Wars I & II, the Fascist Italian occupation (1936-1941), the Ethiopian patriotic resistance.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: The Fascist Occupation & Patriotic Resistance (1936-1941)',
          summary: 'The Black Lions, Yekatit 12 martyrs, guerrilla resistance in the countryside, liberation.',
          sections: [{ title: '1.1 Patriotic Movement', content: ['Ethiopian patriots (Arbegnoch) fought tenaciously across rural bastions until national liberation in 1941.'] }],
        },
      ],
    },
    12: {
      subjectId: 'history',
      grade: 12,
      title: 'History Student Textbook - Grade 12',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'Cold War dynamics, founding of OAU/AU in Addis Ababa, the 1974 Ethiopian Revolution.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Organization of African Unity (OAU/AU) & Pan-Africanism',
          summary: 'Addis Ababa as diplomatic capital of Africa, Emperor Haile Selassie I role, May 1963 Charter.',
          sections: [{ title: '1.1 Founding of OAU', content: ['In May 1963, 32 independent African heads of state signed the OAU Charter in Addis Ababa.'] }],
        },
      ],
    },
  },
  geography: {
    9: {
      subjectId: 'geography',
      grade: 9,
      title: 'Geography Student Textbook - Grade 9',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'Map reading, scale representation, landforms, weather and climate components.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Map Reading and Geospatial Basics',
          summary: 'Map types, scales (Graphic, Fractional, Ratio), contour lines and relief depiction.',
          sections: [{ title: '1.1 Map Scales', content: ['A map scale expresses the mathematical relationship between distance on a map and actual ground distance.'] }],
        },
      ],
    },
    10: {
      subjectId: 'geography',
      grade: 10,
      title: 'Geography Student Textbook - Grade 10',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'Physiography of Ethiopia and the Horn, highland massifs, Rift Valley, river drainage basins.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Physiographic Divisions of Ethiopia',
          summary: 'Western Highlands, Eastern Highlands, Great Rift Valley floor, and surrounding lowlands.',
          sections: [{ title: '1.1 The Rift Valley', content: ['The Ethiopian Rift Valley bisects the country diagonally from northeast to southwest.'] }],
        },
      ],
    },
    11: {
      subjectId: 'geography',
      grade: 11,
      title: 'Geography Student Textbook - Grade 11',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'Traditional climate zones of Ethiopia (Dega, Weyna Dega, Kolla, Bereha, Wurch), water resources and dams.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Agro-Climatic Zones of Ethiopia',
          summary: 'Influence of altitude on temperature and rainfall patterns, GERD and river drainage basins.',
          sections: [{ title: '1.1 Traditional Zones', content: ['Dega (2300-3300m), Weyna Dega (1500-2300m), Kolla (500-1500m), Bereha (<500m), Wurch (>3300m).'] }],
        },
      ],
    },
    12: {
      subjectId: 'geography',
      grade: 12,
      title: 'Geography Student Textbook - Grade 12',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'Demographics of Ethiopia, urbanization, economic sectors, sustainable natural resource management.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Population Dynamics & Urban Growth in Ethiopia',
          summary: 'Birth and death rates, youthful age structure, urban growth corridors, rural-urban migration.',
          sections: [{ title: '1.1 Demographic Profile', content: ['Ethiopia has an expansive population pyramid characterized by a large productive youthful demographic.'] }],
        },
      ],
    },
  },
  citizenship: {
    9: {
      subjectId: 'citizenship',
      grade: 9,
      title: 'Citizenship Education Student Textbook - Grade 9',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'Democracy, constitutionalism, human rights, rule of law, civic responsibilities.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Democracy and Constitutional Governance',
          summary: 'Principles of democracy, constitutional supremacy, citizen participation and accountability.',
          sections: [{ title: '1.1 Democratic Principles', content: ['Public participation, transparency, rule of law, and equity form the pillars of constitutional democracy.'] }],
        },
      ],
    },
    10: {
      subjectId: 'citizenship',
      grade: 10,
      title: 'Citizenship Education Student Textbook - Grade 10',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'Managing diversity, indigenous conflict resolution, peacebuilding and national cohesion.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Peacebuilding & Indigenous Dispute Resolution',
          summary: 'Traditional customary reconciliation mechanisms (Gadaa/Jaarsummaa, Shimgillna, Gurti, Gumaa).',
          sections: [{ title: '1.1 Indigenous Systems', content: ['Customary council elders play an indispensable role in maintaining sustainable community harmony.'] }],
        },
      ],
    },
    11: {
      subjectId: 'citizenship',
      grade: 11,
      title: 'Citizenship Education Student Textbook - Grade 11',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'Good governance, anti-corruption frameworks, equitable resource distribution, public ethics.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Good Governance & Public Integrity',
          summary: 'Institutional transparency, anti-corruption strategies, public trust and civic vigilance.',
          sections: [{ title: '1.1 Combating Corruption', content: ['Transparent and accountable administrative procedures are essential to curb corruption.'] }],
        },
      ],
    },
    12: {
      subjectId: 'citizenship',
      grade: 12,
      title: 'Citizenship Education Student Textbook - Grade 12',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'International relations, Ethiopian foreign policy, globalization, regional integration.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Foreign Policy & International Relations',
          summary: 'Mutual benefit, peaceful coexistence, regional cooperation across the Horn of Africa.',
          sections: [{ title: '1.1 Foreign Policy Principles', content: ['Ethiopia\'s foreign policy is rooted in sovereignty, mutual respect, and peaceful coexistence.'] }],
        },
      ],
    },
  },
  english: {
    9: {
      subjectId: 'english',
      grade: 9,
      title: 'English for Ethiopia Student Textbook - Grade 9',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 6,
      description: 'Reading comprehension, grammar (tenses, modal verbs), vocabulary development, essay writing.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Living in a Community',
          summary: 'Expressing habits, descriptive paragraphs, vocabulary in context.',
          sections: [{ title: '1.1 Present Simple and Continuous', content: ['Use Present Simple for habits and facts; Continuous for temporary actions.'] }],
        },
      ],
    },
    10: {
      subjectId: 'english',
      grade: 10,
      title: 'English for Ethiopia Student Textbook - Grade 10',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 6,
      description: 'Conditionals (1, 2, 3), passive voice, critical reading, and argumentative essays.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Environmental Conservation & Climate Action',
          summary: 'Conditionals and cause-effect language in environmental essays.',
          sections: [{ title: '1.1 Conditionals Type 2 & 3', content: ['Type 2: If + past simple, would + verb. Type 3: If + past perfect, would have + past participle.'] }],
        },
      ],
    },
    11: {
      subjectId: 'english',
      grade: 11,
      title: 'English for Ethiopia Student Textbook - Grade 11',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 6,
      description: 'Advanced vocabulary, discourse markers, formal reporting conventions.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Media Literacy and Critical Thinking',
          summary: 'Evaluating news credibility, detecting bias, formal discourse structures.',
          sections: [{ title: '1.1 Discourse Markers', content: ['Words like "furthermore", "nonetheless", and "consequently" enhance cohesion.'] }],
        },
      ],
    },
    12: {
      subjectId: 'english',
      grade: 12,
      title: 'English for Ethiopia Student Textbook - Grade 12',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 6,
      description: 'Academic reading, entrance exam grammar strategies, idioms and phrasal verbs.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Global Perspectives & Higher Education Readiness',
          summary: 'Synthesizing texts, advanced punctuation, error recognition for ESSLCE.',
          sections: [{ title: '1.1 Phrasal Verbs & Collocations', content: ['Mastering high-frequency academic collocations for college entrance exams.'] }],
        },
      ],
    },
  },
  it: {
    9: {
      subjectId: 'it',
      grade: 9,
      title: 'Information Technology Student Textbook - Grade 9',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'Computer fundamentals, hardware, software, internet basics, cyber hygiene.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Computer Systems & Hardware Architecture',
          summary: 'CPU, RAM, ROM, input/output peripherals, operating systems.',
          sections: [{ title: '1.1 System Architecture', content: ['The CPU (Central Processing Unit) executes instructions and coordinates hardware.'] }],
        },
      ],
    },
    10: {
      subjectId: 'it',
      grade: 10,
      title: 'Information Technology Student Textbook - Grade 10',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'Computer networks (LAN, WAN), web design fundamentals (HTML/CSS), database concepts.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Computer Networking Fundamentals',
          summary: 'IP addressing, routers, switches, internet protocols (TCP/IP, HTTP).',
          sections: [{ title: '1.1 Network Types', content: ['A LAN (Local Area Network) connects devices within a localized building or campus.'] }],
        },
      ],
    },
    11: {
      subjectId: 'it',
      grade: 11,
      title: 'Information Technology Student Textbook - Grade 11',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'Python programming, algorithms, flowcharts, data structures.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Introduction to Python Programming',
          summary: 'Variables, data types, conditional branching (if-else), and loops (for, while).',
          sections: [{ title: '1.1 Python Syntax', content: ['Python uses clean syntax and indentation to build efficient algorithmic logic.'] }],
        },
      ],
    },
    12: {
      subjectId: 'it',
      grade: 12,
      title: 'Information Technology Student Textbook - Grade 12',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'Artificial Intelligence (AI), data science, cloud computing, cybersecurity laws.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Artificial Intelligence & Machine Learning',
          summary: 'AI foundations, neural networks, predictive algorithms in national development.',
          sections: [{ title: '1.1 Machine Learning', content: ['Machine learning enables computers to discover patterns from empirical data.'] }],
        },
      ],
    },
  },
  agriculture: {
    9: {
      subjectId: 'agriculture',
      grade: 9,
      title: 'General Agriculture Student Textbook - Grade 9',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'Soil science, crop production, animal husbandry, water harvesting & irrigation.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Soil Fertility & Compost Preparation',
          summary: 'Organic compost making, soil acidity management, soil moisture retention.',
          sections: [{ title: '1.1 Organic Compost', content: ['Composting enhances microbial diversity and long-term soil structure.'] }],
        },
      ],
    },
    10: {
      subjectId: 'agriculture',
      grade: 10,
      title: 'General Agriculture Student Textbook - Grade 10',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'Horticulture, Integrated Pest Management (IPM), animal nutrition.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Integrated Pest Management (IPM)',
          summary: 'Ecological balance, biological pest control, crop rotation.',
          sections: [{ title: '1.1 IPM Principles', content: ['Combining biological predators and crop rotation minimizes synthetic pesticide use.'] }],
        },
      ],
    },
    11: {
      subjectId: 'agriculture',
      grade: 11,
      title: 'General Agriculture Student Textbook - Grade 11',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'Livestock management, dairy cattle, poultry farming, apiculture (beekeeping).',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Modern Beekeeping & Honey Production',
          summary: 'Frame beehives, colony management, honey extraction quality standards.',
          sections: [{ title: '1.1 Modern Hives', content: ['Movable frame hives allow sustainable honey harvesting without destroying colonies.'] }],
        },
      ],
    },
    12: {
      subjectId: 'agriculture',
      grade: 12,
      title: 'Agriculture & Agribusiness Student Textbook - Grade 12',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'Agribusiness, agricultural export commodities (Coffee, Sesame, Floriculture), agricultural policies.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Agri-entrepreneurship & Value Chain Addition',
          summary: 'Agricultural market linkages, post-harvest processing, export value chains.',
          sections: [{ title: '1.1 Agricultural Value Chains', content: ['Processing primary produce significantly multiplies farmers\' earnings and national GDP.'] }],
        },
      ],
    },
  },
  amharic: {
    9: {
      subjectId: 'amharic',
      grade: 9,
      title: 'Amharic Language & Literature Student Textbook - Grade 9',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'Foundations of literature, oral literature and folklore (proverbs, riddles, fables), grammar, and sentence structure.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Literature Foundations & Oral Tradition (Folklore)',
          summary: 'Oral genres, folk traditions, cultural preservation, and elements of storytelling.',
          sections: [
            {
              title: '1.1 Concept of Oral Literature & Genres',
              content: [
                'Oral literature is a vibrant cultural repository transmitted by word of mouth across generations.',
                'Major genres include fables, proverbs, traditional riddles, wedding chants, dirges, and heroic ballads.',
              ],
            },
          ],
        },
      ],
    },
    10: {
      subjectId: 'amharic',
      grade: 10,
      title: 'Amharic Language & Literature Student Textbook - Grade 10',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'Elements of fiction (theme, plot, characters, setting), drama and theatrical arts, essay composition, and stylistic devices.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Elements of Fiction and Dramatic Arts',
          summary: 'Characterization, plot progression, stage drama, and figurative language in prose.',
          sections: [
            {
              title: '1.1 Core Components of Fiction',
              content: [
                'Fiction explores human experiences through creative imagination, structured by plot, character development, conflict, and theme.',
                'Drama translates text into live performance through dialogue and action.',
              ],
            },
          ],
        },
      ],
    },
    11: {
      subjectId: 'amharic',
      grade: 11,
      title: 'Amharic Language & Literature Student Textbook - Grade 11',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'The art of "Wax and Gold" (Sem-na-Worq) poetics, classical verse structure, rhetorical devices, and allegorical interpretation.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Wax and Gold Poetics (Sem-na-Worq)',
          summary: 'Surface meaning (wax), hidden meaning (gold), pivot words (hibre-qal), and traditional philosophical verse.',
          sections: [
            {
              title: '1.1 Principles of Wax and Gold',
              content: [
                'Wax and Gold is an esteemed Ethiopian poetic and rhetorical tradition celebrating multi-layered semantic depth.',
                'The wax represents the apparent, overt literal meaning, while the gold reveals the profound, veiled inner truth.',
              ],
            },
          ],
        },
      ],
    },
    12: {
      subjectId: 'amharic',
      grade: 12,
      title: 'Amharic Language & Literature Student Textbook - Grade 12',
      curriculumBadge: 'FDRE Ministry of Education New Curriculum',
      totalUnits: 5,
      description: 'Literary criticism, academic research methodology, historical development of Ethiopian languages, and ESSLCE readiness.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Literary Criticism & Linguistic Research',
          summary: 'Critical theories, textual analysis, sociolinguistic dynamics, and national examination review.',
          sections: [
            {
              title: '1.1 Critical Analysis of Literary Works',
              content: [
                'Literary criticism systematically examines literary texts, their artistic merit, cultural context, and aesthetic resonance.',
              ],
            },
          ],
        },
      ],
    },
  },
};
