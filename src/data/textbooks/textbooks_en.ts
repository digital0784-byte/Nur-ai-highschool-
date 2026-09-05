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
      curriculumBadge: 'FDRE Ministry of Education New Curriculum (168 Pages)',
      totalUnits: 6,
      description: 'Grade 11 Information Technology New Curriculum (168 Pages) - 6 Units: Information Systems & Applications, Emerging Technologies (AI, AR/VR, Big Data, IoT, Cloud), Database Management (Relational Model & SQL), Web Development (HTML5 & CSS), Hardware Troubleshooting & Preventive Maintenance, and Fundamentals of Programming in Python.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Information Systems and Its Applications (pp. 1–28)',
          summary: 'Basics of Information Systems, the DIKW hierarchy, components (Hardware, Software, Data, People, Procedures), classification (TPS, MIS, DSS, ESS), e-services (E-Government, E-Banking, E-Learning), IT entrepreneurship, and bridging the Ethiopian digital divide.',
          sections: [
            {
              title: '1.1 Basics of Information Systems & DIKW Hierarchy',
              content: [
                'Data consists of raw, unprocessed facts, numbers, and symbols lacking context.',
                'Information is processed data that has been organized with structure and meaning.',
                'Knowledge represents actionable information combined with understanding, experience, and rules.',
                'Wisdom represents the ethical evaluation and strategic foresight to make sound decisions based on knowledge.',
              ],
              keyTerms: [
                { term: 'Data', definition: 'Raw, unorganized facts and figures lacking context.' },
                { term: 'Information', definition: 'Data structured with relevance, context, and purpose.' },
                { term: 'Knowledge', definition: 'Information synthesized with experience and contextual understanding.' },
                { term: 'Wisdom', definition: 'The capacity to make sound, ethical, and forward-looking judgments.' },
              ],
              workedExamples: [
                {
                  question: 'Example 1: Trace the DIKW hierarchy for weather readings in the Awash agricultural basin.',
                  solution: 'Data: 35mm rain, 28°C. Information: Awash received 35mm rainfall in 24 hours. Knowledge: Teff seedlings require planting within 48 hours under these moisture levels. Wisdom: Activate regional irrigation reserves early to protect against the forecasted seasonal dry spell.',
                },
              ],
              exercises: ['1. Explain the differences between Data and Information with two examples.', '2. Describe how Knowledge transforms into Wisdom.'],
            },
            {
              title: '1.2 Components & Classification of Information Systems',
              content: [
                'The five core components of an Information System are Hardware, Software, Data, People, and Procedures.',
                'Transaction Processing Systems (TPS) handle operational routine transactions (e.g., POS checkout, telebirr payments).',
                'Management Information Systems (MIS) provide scheduled summary reports for tactical managers.',
                'Decision Support Systems (DSS) use analytical models to assist in semi-structured decision-making.',
                'Executive Support Systems (ESS) support strategic, non-routine corporate decision-making for senior leadership.',
              ],
              keyTerms: [
                { term: 'TPS', definition: 'Transaction Processing System tracking daily routine operational business transactions.' },
                { term: 'DSS', definition: 'Decision Support System combining data and analytical models to support complex decisions.' },
                { term: 'Procedures', definition: 'Documented operational policies and rules governing system use and security.' },
              ],
              exercises: ['1. List the five components of an IS.', '2. Compare TPS and DSS by primary users and decision scope.'],
            },
            {
              title: '1.3 E-Services, Entrepreneurship & The Digital Divide',
              content: [
                'E-Government delivers transparent public administrative services online (e.g., e-tax, digital ID Fayda, passport portals).',
                'Digital banking and mobile money (telebirr, CBE Birr) drive financial inclusion across urban and rural communities.',
                'IT lowers startup barriers for entrepreneurs through e-commerce, global market reach, and digital freelancing.',
                'The Digital Divide represents the socio-economic gap in ICT access, infrastructure, and digital literacy.',
              ],
              keyTerms: [
                { term: 'Digital Divide', definition: 'The gap between individuals and communities who have access to modern ICT and those who do not.' },
                { term: 'E-Government', definition: 'The use of digital technologies to provide public services to citizens and businesses.' },
              ],
              exercises: ['1. What is the goal of Ethiopia\'s Digital 2025 Strategy?', '2. Propose two strategies to bridge the digital divide in rural schools.'],
            },
          ],
          unitReviewQuestions: [
            '1. Differentiate between Data, Information, Knowledge, and Wisdom.',
            '2. Explain how the five components of an information system interact in a national hospital.',
            '3. Contrast operational-level TPS with executive-level ESS.',
            '4. Discuss the socio-economic benefits and challenges of mobile money in Ethiopia.',
          ],
        },
        {
          unitNumber: 2,
          title: 'Unit 2: Emerging Technologies (pp. 29–54)',
          summary: 'The Fourth Industrial Revolution (4IR), Artificial Intelligence (AI) and Machine Learning, Augmented Reality (AR) vs. Virtual Reality (VR), Data Science and the 5 Vs of Big Data, Internet of Things (IoT), and Cloud Computing architecture (IaaS, PaaS, SaaS).',
          sections: [
            {
              title: '2.1 Artificial Intelligence & Machine Learning',
              content: [
                'Artificial Intelligence (AI) simulates human cognitive abilities such as learning, pattern recognition, and problem-solving.',
                'Machine Learning (ML) enables algorithms to learn patterns from empirical data without being explicitly programmed.',
                'Narrow AI performs dedicated single tasks (e.g., speech recognition, disease detection in coffee plants), whereas General AI (AGI) aims to match human multi-domain intellect.',
                'Computer Vision processes visual inputs, while Natural Language Processing (NLP) interprets human languages.',
              ],
              keyTerms: [
                { term: 'Artificial Intelligence', definition: 'Computer systems designed to perform tasks requiring human-like intelligence.' },
                { term: 'Machine Learning', definition: 'A branch of AI that learns patterns from data to make autonomous predictions.' },
              ],
              workedExamples: [
                {
                  question: 'Example: How does an AI smartphone camera diagnose plant diseases?',
                  solution: 'The camera captures a leaf image, computer vision extracts visual features (discoloration, spots), and a trained convolutional neural network classifies the symptom against a database of coffee leaf rust.',
                },
              ],
              exercises: ['1. Distinguish between Narrow AI and General AI.', '2. What is the role of training data in Machine Learning?'],
            },
            {
              title: '2.2 AR, VR, Big Data & IoT',
              content: [
                'Virtual Reality (VR) immerses the user in a 100% digital simulated environment using headsets.',
                'Augmented Reality (AR) overlays computer-generated digital imagery, sounds, and text onto the physical real world.',
                'Big Data is defined by the 5 Vs: Volume (size), Velocity (speed), Variety (formats), Veracity (accuracy/trust), and Value (actionable business insight).',
                'The Internet of Things (IoT) connects everyday physical devices embedded with sensors and actuators to share data over networks.',
              ],
              keyTerms: [
                { term: 'VR (Virtual Reality)', definition: 'A fully immersive digital simulation isolating the user from the physical environment.' },
                { term: 'AR (Augmented Reality)', definition: 'An interactive view where digital computer graphics overlay physical reality.' },
                { term: 'IoT', definition: 'A network of physical devices with sensors and connectivity exchanging data autonomously.' },
              ],
              exercises: ['1. Compare AR and VR in medical training.', '2. List and explain the 5 Vs of Big Data.'],
            },
            {
              title: '2.3 Cloud Computing Architecture',
              content: [
                'Cloud computing delivers on-demand computing services (servers, storage, databases, networking) over the internet.',
                'Infrastructure as a Service (IaaS) provides virtualized computing and raw storage infrastructure.',
                'Platform as a Service (PaaS) provides development runtimes, APIs, and hosting environments.',
                'Software as a Service (SaaS) delivers complete end-user applications over the web (e.g., Google Workspace, Microsoft 365).',
              ],
              keyTerms: [
                { term: 'Cloud Computing', definition: 'On-demand delivery of IT resources over the internet with pay-as-you-go pricing.' },
                { term: 'SaaS', definition: 'Software applications hosted centrally and accessible through web browsers.' },
              ],
              exercises: ['1. Classify Google Drive into IaaS, PaaS, or SaaS.', '2. Contrast Public and Private cloud deployments.'],
            },
          ],
          unitReviewQuestions: [
            '1. Explain the role of Emerging Technologies in driving the Fourth Industrial Revolution.',
            '2. Compare Augmented Reality and Virtual Reality with practical educational use cases.',
            '3. Explain how IoT sensors and Big Data analytics can optimize Ethiopian agriculture.',
            '4. Differentiate between IaaS, PaaS, and SaaS cloud service models.',
          ],
        },
        {
          unitNumber: 3,
          title: 'Unit 3: Database Management (pp. 55–84)',
          summary: 'File-based systems vs. DBMS, Relational Database model, Entity-Relationship (ER) modeling, Primary/Foreign keys, integrity constraints (Entity, Referential, Domain), and Structured Query Language (SQL DDL and DML operations).',
          sections: [
            {
              title: '3.1 Database Concepts & Entity-Relationship Modeling',
              content: [
                'A Database is an organized collection of structured, logically related data.',
                'A Database Management System (DBMS) eliminates data redundancy, prevents data inconsistency, and enforces security.',
                'An Entity is a distinguishable real-world person, place, or concept.',
                'Attributes describe properties of entities; relationships represent associations between entities.',
                'Cardinality ratios define structural constraints: One-to-One (1:1), One-to-Many (1:N), and Many-to-Many (M:N).',
              ],
              keyTerms: [
                { term: 'Database', definition: 'An organized, persistent collection of logically related data.' },
                { term: 'DBMS', definition: 'Software enabling users to define, create, maintain, and query databases.' },
                { term: 'Entity', definition: 'A distinct real-world object or concept about which data is maintained.' },
              ],
              workedExamples: [
                {
                  question: 'Example: Determine the cardinality between SCHOOL and PRINCIPAL, and between STUDENT and COURSE.',
                  solution: 'SCHOOL to PRINCIPAL is One-to-One (1:1), as a school has one principal and a principal leads one school. STUDENT to COURSE is Many-to-Many (M:N), since a student enrolls in multiple courses and a course has many students.',
                },
              ],
              exercises: ['1. List three disadvantages of file-based storage systems.', '2. Draw an ER diagram for a library with BOOK, BORROWER, and LOAN.'],
            },
            {
              title: '3.2 Relational Model, Keys & Integrity Rules',
              content: [
                'In the relational model, data is organized into tables (relations) of rows (tuples) and columns (attributes).',
                'A Primary Key uniquely identifies each tuple in a table and cannot contain NULL values (Entity Integrity).',
                'A Foreign Key links a record to the primary key of another table, ensuring Referential Integrity.',
                'Domain Integrity requires that all column values conform to defined data types, formats, and ranges.',
              ],
              keyTerms: [
                { term: 'Primary Key', definition: 'A column or combination of columns that uniquely identifies each record in a table.' },
                { term: 'Foreign Key', definition: 'A column referencing the primary key of another table to maintain relational integrity.' },
                { term: 'Entity Integrity', definition: 'The rule requiring that primary keys must be unique and cannot contain NULL values.' },
              ],
              exercises: ['1. Explain the purpose of a Foreign Key.', '2. What happens when Referential Integrity is violated?'],
            },
            {
              title: '3.3 Structured Query Language (SQL)',
              content: [
                'Data Definition Language (DDL) commands define table schemas: CREATE TABLE, ALTER TABLE, DROP TABLE.',
                'Data Manipulation Language (DML) manages table records: INSERT INTO, SELECT, UPDATE, DELETE.',
                'The SELECT command retrieves data using WHERE clauses, ORDER BY sorting, and GROUP BY aggregation.',
                'Aggregate functions perform statistical calculations: COUNT(), SUM(), AVG(), MIN(), MAX().',
              ],
              keyTerms: [
                { term: 'SQL', definition: 'Structured Query Language; standard declarative language used to manage relational databases.' },
                { term: 'DDL', definition: 'Data Definition Language commands used to define database structures.' },
                { term: 'DML', definition: 'Data Manipulation Language commands used to insert, modify, and query records.' },
              ],
              workedExamples: [
                {
                  question: 'Example: Write the SQL query to find all students in Grade 11 who scored above 80.',
                  solution: 'SELECT StudentID, FullName, Score FROM Students WHERE Grade = 11 AND Score > 80 ORDER BY Score DESC;',
                },
              ],
              exercises: ['1. Write SQL to create a Teacher table with ID, Name, and Subject.', '2. Write SQL to count total registered students.'],
            },
          ],
          unitReviewQuestions: [
            '1. Compare file processing systems with Relational Database Management Systems.',
            '2. Explain the difference between Candidate Keys, Primary Keys, and Alternate Keys.',
            '3. State and explain the three fundamental database integrity constraints.',
            '4. Write the SQL DML statements to insert a record, update an address, and delete an inactive record.',
          ],
        },
        {
          unitNumber: 4,
          title: 'Unit 4: Web Development (pp. 85–114)',
          summary: 'Foundations of the World Wide Web, client-server architecture, HTTP/HTTPS, HTML document hierarchy, text formatting, hyperlinks, images, multimedia, tables, forms, and introductory CSS styling.',
          sections: [
            {
              title: '4.1 Foundations of the Web & HTML Structure',
              content: [
                'The World Wide Web relies on client-server architecture: browsers request resources over HTTP/HTTPS from web servers.',
                'Domain Name System (DNS) translates user-friendly domain names (e.g., www.edu.et) into numeric IP addresses.',
                'HTML (HyperText Markup Language) structures web content using semantic tags: <!DOCTYPE html>, <html>, <head>, <title>, <body>.',
                'Headings are defined using <h1> to <h6>; text paragraphs are wrapped in <p> tags.',
              ],
              keyTerms: [
                { term: 'HTML', definition: 'Standard markup language used for structuring web pages.' },
                { term: 'DNS', definition: 'Domain Name System; internet directory translating domain names to IP addresses.' },
                { term: 'HTTP/HTTPS', definition: 'Hypertext Transfer Protocol (Secure); protocol used for transmitting web resources.' },
              ],
              exercises: ['1. What is the role of a web browser?', '2. Write the standard HTML5 skeleton code.'],
            },
            {
              title: '4.2 Hyperlinks, Lists, Tables & Forms',
              content: [
                'Hyperlinks are created using the anchor tag: <a href="URL">link text</a>, supporting internal and external navigation.',
                'Images are embedded using <img src="image.jpg" alt="description"> with required alt accessibility attributes.',
                'Ordered lists (<ol>) create numbered items; unordered lists (<ul>) create bullet points.',
                'Tables use <table>, <tr> (rows), <th> (headers), and <td> (data cells) with colspan and rowspan formatting.',
                'HTML forms collect user input via <form>, <input> (text, password, radio, checkbox), <select>, and <button type="submit">.',
              ],
              keyTerms: [
                { term: 'Hyperlink', definition: 'An HTML reference link directing users to another document or section.' },
                { term: 'Form', definition: 'An interactive HTML container used to collect and submit user data to a server.' },
              ],
              workedExamples: [
                {
                  question: 'Example: Write an HTML form collecting a student\'s Name and Grade.',
                  solution: '<form action="/submit" method="post">\n  <label for="name">Name:</label>\n  <input type="text" id="name" name="name" required><br>\n  <label for="grade">Grade:</label>\n  <input type="number" id="grade" name="grade" min="9" max="12"><br>\n  <button type="submit">Submit</button>\n</form>',
                },
              ],
              exercises: ['1. Write HTML code for a 3-row, 3-column table.', '2. Differentiate between GET and POST form methods.'],
            },
            {
              title: '4.3 Introduction to Cascading Style Sheets (CSS)',
              content: [
                'CSS (Cascading Style Sheets) controls the visual presentation, styling, and layout of HTML web pages.',
                'CSS can be applied via three methods: Inline (style attribute), Internal (<style> in head), and External (<link rel="stylesheet">).',
                'The CSS Box Model consists of Margins (outer space), Borders, Padding (interior space), and Content.',
                'Selectors target elements by tag name (p), class (.highlight), or unique identifier (#header).',
              ],
              keyTerms: [
                { term: 'CSS', definition: 'Style sheet language specifying fonts, colors, spacing, and layouts for HTML documents.' },
                { term: 'Box Model', definition: 'Design model defining the spacing around an HTML element: Margin, Border, Padding, Content.' },
              ],
              exercises: ['1. Describe the four components of the CSS Box Model.', '2. Why is External CSS preferred in professional websites?'],
            },
          ],
          unitReviewQuestions: [
            '1. Describe the complete client-server lifecycle when opening a web page.',
            '2. Explain the purpose of HTML semantic tags and their importance for accessibility.',
            '3. Write the HTML code for a student registration form containing text, radio, dropdown, and submit elements.',
            '4. Contrast Inline, Internal, and External CSS styling methods with respect to maintainability.',
          ],
        },
        {
          unitNumber: 5,
          title: 'Unit 5: Hardware Troubleshooting and Maintenance (pp. 115–138)',
          summary: 'Laboratory safety precautions, Electrostatic Discharge (ESD) prevention, preventive maintenance routines, 6-step systematic troubleshooting methodology, common computer hardware faults (POST beep codes, RAM, power supply, overheating, BSOD), and disk maintenance utilities.',
          sections: [
            {
              title: '5.1 Safety Precautions & Preventive Maintenance',
              content: [
                'Electrostatic Discharge (ESD) is the rapid transfer of static charge that can destroy microprocessors and memory chips.',
                'Technicians must wear antistatic wrist straps, use grounding mats, and unplug power cords before servicing computers.',
                'Never open or service a computer Power Supply Unit (PSU) or CRT monitor due to dangerous high-voltage capacitors.',
                'Routine preventive maintenance includes cleaning dust from fans and heat sinks, organizing cables, and inspecting thermal paste.',
              ],
              keyTerms: [
                { term: 'ESD', definition: 'Electrostatic Discharge; static electricity that damages sensitive silicon computer components.' },
                { term: 'Preventive Maintenance', definition: 'Scheduled inspection and cleaning to extend hardware life and prevent breakdowns.' },
              ],
              exercises: ['1. What precautions prevent ESD damage?', '2. Why must technicians never open a power supply unit?'],
            },
            {
              title: '5.2 Systematic Troubleshooting Methodology',
              content: [
                'Professional troubleshooting follows 6 systematic steps:',
                'Step 1: Identify the problem (gather information from users and observe symptoms).',
                'Step 2: Establish a theory of probable cause (test simple theories first).',
                'Step 3: Test the theory to determine the exact cause.',
                'Step 4: Establish a plan of action and implement the corrective solution.',
                'Step 5: Verify full system functionality and implement preventive measures.',
                'Step 6: Document findings, actions taken, and outcomes for future reference.',
              ],
              keyTerms: [
                { term: 'Troubleshooting', definition: 'A systematic method for locating and resolving computer hardware and software faults.' },
                { term: 'POST', definition: 'Power-On Self-Test; hardware diagnostic test run by BIOS/UEFI firmware upon powering on.' },
              ],
              workedExamples: [
                {
                  question: 'Example: A desktop turns on, cooling fans spin, but the screen is black and emits repeating beep codes.',
                  solution: '1. Diagnose symptom: POST beeps indicate RAM or display card initialization failure. 2. Action: Unplug power, ground yourself, remove and clean RAM contacts with an eraser, reseat RAM securely into slot until clips snap in. 3. Restart to verify display.',
                },
              ],
              exercises: ['1. List the 6 steps of computer troubleshooting.', '2. What do continuous BIOS beep codes indicate during startup?'],
            },
            {
              title: '5.3 Diagnosing Common Faults & Disk Utilities',
              content: [
                'Overheating causes sudden unexpected shutdowns; caused by dried thermal paste or dust-clogged CPU heat sink fans.',
                'RAM failures often cause random Blue Screen of Death (BSOD) crashes or memory parity error screens.',
                'Software maintenance tools include Disk Cleanup (removes temporary files) and Defragmentation (reorders fragmented hard disk sectors).',
              ],
              keyTerms: [
                { term: 'BSOD', definition: 'Blue Screen of Death; critical Windows stop error caused by hardware faults or corrupted drivers.' },
                { term: 'Defragmentation', definition: 'Rearranging fragmented file data on magnetic hard drives for faster read/write speeds.' },
              ],
              exercises: ['1. What are common symptoms of an overheating processor?', '2. When should Disk Cleanup and Defragmentation be executed?'],
            },
          ],
          unitReviewQuestions: [
            '1. Why is an antistatic wrist strap mandatory when handling RAM modules or motherboards?',
            '2. Detail all 6 steps of the standard diagnostic troubleshooting methodology.',
            '3. Explain the meaning and diagnostic purpose of the Power-On Self-Test (POST).',
            '4. Describe three hardware symptoms indicating that a computer power supply is failing.',
          ],
        },
        {
          unitNumber: 6,
          title: 'Unit 6: Fundamentals of Programming (pp. 139–168)',
          summary: 'Algorithm design, standard flowchart symbols, language translators (assemblers, compilers, interpreters), Python environment setup, identifiers, dynamic data types, arithmetic/logical operators, input/output, conditional branching (if, elif, else), iteration loops (while, for with range), and custom functions.',
          sections: [
            {
              title: '6.1 Algorithms, Flowcharts & Translators',
              content: [
                'An algorithm is a finite, step-by-step sequence of unambiguous instructions designed to solve a specific problem.',
                'Flowcharts visually represent algorithms using standard ISO symbols: Oval (Start/End), Parallelogram (Input/Output), Rectangle (Process), Diamond (Decision).',
                'Language translators convert high-level code to machine binary: Compilers translate the entire source program before execution; Interpreters translate and execute line-by-line.',
                'Python is an interpreted, high-level, dynamically-typed language known for clean syntax and readability.',
              ],
              keyTerms: [
                { term: 'Algorithm', definition: 'A step-by-step procedure of well-defined instructions to solve a problem.' },
                { term: 'Flowchart', definition: 'A graphical diagram representing the logical flow of an algorithm.' },
                { term: 'Compiler', definition: 'A translator converting an entire program into machine language before execution.' },
                { term: 'Interpreter', definition: 'A translator that analyzes and executes code line-by-line at runtime.' },
              ],
              workedExamples: [
                {
                  question: 'Example: Write pseudocode to determine if a student has passed (mark >= 50) or failed.',
                  solution: '1. START\n2. INPUT mark\n3. IF mark >= 50 THEN\n     PRINT "Passed"\n   ELSE\n     PRINT "Failed"\n4. END',
                },
              ],
              exercises: ['1. Draw the 4 basic flowchart symbols and state their functions.', '2. Compare compilers and interpreters.'],
            },
            {
              title: '6.2 Python Variables, Data Types & Operators',
              content: [
                'Variables are named memory locations holding values; variable names must start with a letter or underscore.',
                'Fundamental Python data types: int (whole numbers), float (decimals), str (text in quotes), and bool (True/False).',
                'The type() function checks data types; type casting functions include int(), float(), and str().',
                'Arithmetic operators include addition (+), subtraction (-), multiplication (*), division (/), floor division (//), modulus (%), and exponentiation (**).',
                'The input() function returns user input as a string; use type casting for numeric calculations.',
              ],
              keyTerms: [
                { term: 'Variable', definition: 'A named memory container whose value can change during program execution.' },
                { term: 'Type Casting', definition: 'Explicitly converting a value from one data type to another (e.g., int("25")).' },
              ],
              exercises: ['1. Why does age = input("Enter age: ") require int() casting for math?', '2. Evaluate: 17 // 3 and 17 % 3.'],
            },
            {
              title: '6.3 Control Structures: Conditionals, Loops & Functions',
              content: [
                'Python uses mandatory indentation (4 spaces) to define code blocks instead of curly brackets.',
                'Conditional statements: if condition:, elif condition:, and else: for multi-way branching.',
                'Comparison operators: ==, !=, >, <, >=, <=; Logical operators: and, or, not.',
                'The while loop repeats statements as long as a condition evaluates to True.',
                'The for loop iterates over sequences, commonly using range(start, stop, step).',
                'Functions are defined using the def keyword with parameters and return statements for code reusability.',
              ],
              keyTerms: [
                { term: 'Indentation', definition: 'Leading whitespace used in Python to delimit blocks of code.' },
                { term: 'Iteration', definition: 'Repetitive execution of a block of instructions via while or for loops.' },
                { term: 'Function', definition: 'A named, reusable block of code that performs a specific task and optionally returns a result.' },
              ],
              workedExamples: [
                {
                  question: 'Example: Write a Python function that returns the square of a number and test it in a loop for numbers 1 to 5.',
                  solution: 'def square(n):\n    return n * n\n\nfor i in range(1, 6):\n    print(f"The square of {i} is {square(i)}")',
                },
              ],
              exercises: ['1. Write a Python script to print even numbers between 2 and 20.', '2. Write a function to calculate the average of three numbers.'],
            },
          ],
          unitReviewQuestions: [
            '1. Explain the characteristics of an effective algorithm (finiteness, definiteness, input, output, effectiveness).',
            '2. Why is indentation strictly enforced in Python syntax, and what occurs if indentation is inconsistent?',
            '3. Write a Python program that prompts a user for their score and prints "Distinction" (>=85), "Pass" (>=50), or "Fail".',
            '4. Write a Python program using a while loop that calculates the sum of all integers from 1 to 100.',
          ],
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
