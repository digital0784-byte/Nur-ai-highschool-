import { Grade, SubjectTextbook } from '../../types';

export interface SubjectTextbookCollection {
  [subjectId: string]: {
    [grade in Grade]?: SubjectTextbook;
  };
}

export const textbooksDataAmharic: SubjectTextbookCollection = {
  math: {
    9: {
      subjectId: 'math',
      grade: 9,
      title: 'የሂሳብ ትምህርት የተማሪ መጽሐፍ (Mathematics Student Textbook)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'የክፍል 9 የሂሳብ መማሪያ መጽሐፍ፡ የቁጥሮች ስርዓት፣ መስመራዊ እኩልታዎች፣ የጠለል ጂኦሜትሪ፣ የሁለተኛ ዲግሪ እኩልታዎች እና ስታትስቲክስ።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ የቁጥሮች ስርዓት እና ስብስቦች (The Number System & Sets)',
          summary: 'ስለ ሬሽናል እና ኢ-ሬሽናል ቁጥሮች፣ ሪል ቁጥሮች እና የስብስብ ስሌቶች ጥልቅ ማብራሪያ።',
          sections: [
            {
              title: '1.1 የሪል ቁጥሮች ባህሪያት (Properties of Real Numbers)',
              content: [
                'የሪል ቁጥሮች ስብስብ (Real Numbers ℝ) የተፈጥሮ ቁጥሮች (ℕ)፣ ሙሉ ቁጥሮች (ℤ)፣ ሬሽናል ቁጥሮች (ℚ) እና ኢ-ሬሽናል ቁጥሮችን (ℚ\') ያጠቃልላል።',
                'ሬሽናል ቁጥር ማለት በማናቸውም a/b ቅርፅ የሚገለጽ ሲሆን a እና b ሙሉ ቁጥሮች ሆነው b ≠ 0 ነው። ኢ-ሬሽናል ቁጥሮች በክፍልፋይ የማይገለጹ ናቸው (ለምሳሌ √2, √3, π)።',
                'የሪል ቁጥሮች የመደመር እና የማባዛት ባህሪያት፡ የዝግነት (Closure)፣ የቅያሪ (Commutative)፣ የተጣማሪ (Associative) እና የስርጭት (Distributive) ህጎች ናቸው።',
              ],
              keyTerms: [
                { term: 'ሪል ቁጥር (Real Number)', definition: 'በቁጥር መስመር ላይ ሊቀመጥ የሚችል ማንኛውም ሬሽናል ወይም ኢ-ሬሽናል ቁጥር ነው።' },
                { term: 'ኢ-ሬሽናል ቁጥር (Irrational Number)', definition: 'በ a/b ክፍልፋይ ቅርፅ የማይገለጽና የማያልቅ የማይደጋገም አስርዮሽ ቁጥር ነው።' },
              ],
              workedExamples: [
                {
                  question: 'ምሳሌ 1፡ 0.333... ሬሽናል ቁጥር መሆኑን በ a/b ቅርፅ በማስቀመጥ አረጋግጥ።',
                  solution: 'x = 0.333... ይሁን። በሁለቱም በኩል በ10 ስናባዛ፡ 10x = 3.333... ይሆናል። ከዚህ ላይ x = 0.333... ስንቀንስ፡ 9x = 3 => x = 3/9 = 1/3። ስለዚህ 1/3 የሬሽናል ቁጥር ቅርፅ ነው።',
                },
              ],
              exercises: [
                '1. √5 ኢ-ሬሽናል መሆኑን አብራራ።',
                '2. 0.252525... ወደ ክፍልፋይ ለውጥ።',
              ],
            },
            {
              title: '1.2 ስብስቦች እና የስብስብ ስሌቶች (Sets and Set Operations)',
              content: [
                'ስብስብ ማለት በግልጽ የተገለጹ አካላት ጥርቅም ነው።',
                'ዋና ዋና የስብስብ ስሌቶች፡ ህብረት (Union A ∪ B)፣ መቆራረጥ (Intersection A ∩ B)፣ ልዩነት (Difference A \\ B) እና ማሟያ (Complement A\') ናቸው።',
              ],
              workedExamples: [
                {
                  question: 'ምሳሌ 2፡ A = {1, 2, 3, 4} እና B = {3, 4, 5, 6} ቢሆኑ A ∩ B እና A ∪ B ፈልግ።',
                  solution: 'A ∩ B = {3, 4} (የጋራ አባላት)። A ∪ B = {1, 2, 3, 4, 5, 6} (የሁለቱም ስብስቦች አባላት ጥምር)።',
                },
              ],
            },
          ],
          unitReviewQuestions: [
            '1. በሪል ቁጥሮች እና በኢ-ሬሽናል ቁጥሮች መካከል ያለውን ልዩነት አብራራ።',
            '2. የቬን ዲያግራም (Venn Diagram) በመጠቀም A ∪ (B ∩ C) = (A ∪ B) ∩ (A ∪ C) መሆኑን አሳይ።',
          ],
        },
        {
          unitNumber: 2,
          title: 'ምዕራፍ 2፡ መስመራዊ እኩልታዎች እና አለመመጣጠኖች (Linear Equations & Inequalities)',
          summary: 'አንድ እና ሁለት ተለዋዋጭ ያላቸውን መስመራዊ እኩልታዎች እና አለመመጣጠኖች መፍታት።',
          sections: [
            {
              title: '2.1 ባለ አንድ ተለዋዋጭ መስመራዊ እኩልታዎች',
              content: [
                'አጠቃላይ የመስመራዊ እኩልታ ቅርፅ ax + b = 0 ሲሆን a ≠ 0 ነው።',
                'እኩልታዎችን ለመፍታት በሁለቱም በኩል እኩል ቁጥር መደመር፣ መቀነስ፣ ማባዛት ወይም ማካፈል (ከዜሮ ውጪ) ይቻላል።',
              ],
              workedExamples: [
                {
                  question: 'ምሳሌ፡ 3(2x - 4) = 4x + 6 እኩልታን ፈታ።',
                  solution: 'ቅንፉን ስናስፋፋ፡ 6x - 12 = 4x + 6 => 6x - 4x = 6 + 12 => 2x = 18 => x = 9። የመፍትሄ ስብስብ {9} ነው።',
                },
              ],
            },
            {
              title: '2.2 ባለ ሁለት ተለዋዋጭ የመስመራዊ እኩልታዎች ጥንድ',
              content: [
                'ሁለት መስመራዊ እኩልታዎችን ለመፍታት የምንጠቀምባቸው መንገዶች፡ የመተካት ዘዴ (Substitution)፣ የማጥፋት ዘዴ (Elimination) እና የግራፍ ዘዴ (Graphical method) ናቸው።',
              ],
            },
          ],
          unitReviewQuestions: [
            '1. 2x + 3y = 12 እና x - y = 1 እኩልታዎችን በማጥፋት ዘዴ ፈታ።',
          ],
        },
        {
          unitNumber: 3,
          title: 'ምዕራፍ 3፡ የሁለተኛ ዲግሪ እኩልታዎች (Quadratic Equations)',
          summary: 'የሁለተኛ ዲግሪ እኩልታዎችን በፋክተራይዜሽን፣ ሙሉ ስኩዌር በማድረግ እና በቀመር መፍታት።',
          sections: [
            {
              title: '3.1 የኳድራቲክ ፎርሙላ (Quadratic Formula)',
              content: [
                'አጠቃላይ ቅርፅ፡ ax² + bx + c = 0 (a ≠ 0)።',
                'የመፍትሄ ቀመር፡ x = (-b ± √(b² - 4ac)) / (2a) ነው።',
                'ዲስክሪሚናንት (Discriminant) D = b² - 4ac የመፍትሄዎችን አይነት ይወስናል፡ D > 0 ከሆነ 2 የተለያዩ ሪል መፍትሄዎች፣ D = 0 ከሆነ 1 ድርብ መፍትሄ፣ D < 0 ከሆነ ሪል መፍትሄ የለውም።',
              ],
              workedExamples: [
                {
                  question: 'ምሳሌ፡ 2x² - 5x + 2 = 0 እኩልታን በኳድራቲክ ፎርሙላ ፈታ።',
                  solution: 'a = 2, b = -5, c = 2። D = (-5)² - 4(2)(2) = 25 - 16 = 9። x = (5 ± √9) / 4 = (5 ± 3) / 4። x₁ = 8/4 = 2, x₂ = 2/4 = 1/2።',
                },
              ],
            },
          ],
          unitReviewQuestions: [
            '1. x² - 6x + 8 = 0 እኩልታን በ3ቱ መንገዶች ፈታ።',
          ],
        },
      ],
    },
    10: {
      subjectId: 'math',
      grade: 10,
      title: 'የሂሳብ ትምህርት የተማሪ መጽሐፍ - ክፍል 10 (Grade 10 Mathematics)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'ፖሊኖሚያል ፈንክሽኖች፣ ኤክስፖኔንሻል እና ሎጋሪዝሚክ ፈንክሽኖች፣ ትሪጎኖሜትሪ እና የክብ ጂኦሜትሪ።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ ፖሊኖሚያል ፈንክሽኖች (Polynomial Functions)',
          summary: 'የፖሊኖሚያል ማካፈል፣ የሪሜይንደር እና የፋክተር ቴዎረም እንዲሁም ዜሮዎችን ማግኘት።',
          sections: [
            {
              title: '1.1 የፋክተር እና ሪሜይንደር ቴዎረም (Factor & Remainder Theorems)',
              content: [
                'ፖሊኖሚያል P(x) ለ (x - c) ሲካፈል የሚቀረው ቀሪ R = P(c) ነው። ይህ ሪሜይንደር ቴዎረም ይባላል።',
                'P(c) = 0 ከሆነ (x - c) የ P(x) ፋክተር ነው (Factor Theorem)።',
              ],
              workedExamples: [
                {
                  question: 'P(x) = x³ - 3x² + 4x - 2 ለ (x - 1) ሲካፈል ቀሪውን ፈልግ።',
                  solution: 'P(1) = 1³ - 3(1)² + 4(1) - 2 = 1 - 3 + 4 - 2 = 0። ቀሪው 0 ስለሆነ (x - 1) ፋክተር ነው።',
                },
              ],
            },
          ],
          unitReviewQuestions: ['1. x³ - 6x² + 11x - 6 = 0 እኩልታን ሙሉ በሙሉ ፋክተራይዝ አድርግ።'],
        },
        {
          unitNumber: 2,
          title: 'ምዕራፍ 2፡ ኤክስፖኔንሻል እና ሎጋሪዝሚክ ፈንክሽኖች',
          summary: 'የኤክስፖነንት ህጎች፣ የሎጋሪዝም ባህሪያት እና እኩልታዎችን መፍታት።',
          sections: [
            {
              title: '2.1 የሎጋሪዝም ህጎች',
              content: [
                'log_b(xy) = log_b(x) + log_b(y)',
                'log_b(x/y) = log_b(x) - log_b(y)',
                'log_b(x^k) = k · log_b(x)',
              ],
            },
          ],
          unitReviewQuestions: ['1. log₂(x) + log₂(x - 2) = 3 እኩልታን ፈታ።'],
        },
      ],
    },
    11: {
      subjectId: 'math',
      grade: 11,
      title: 'የሂሳብ ትምህርት የተማሪ መጽሐፍ - ክፍል 11 (Grade 11 Mathematics)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'ሪሌሽኖች እና ፈንክሽኖች፣ ማትሪክሶች እና ዲተርሚናንቶች፣ ሲኩዌንስ እና ሲሪስ፣ ቬክተሮች።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ ማትሪክስ እና ዲተርሚናንት (Matrices and Determinants)',
          summary: 'የማትሪክስ አይነቶች፣ የማትሪክስ ማባዛት፣ ኢንቨርስ እና የክሬመር ህግ (Cramer\'s Rule)።',
          sections: [
            {
              title: '1.1 የማትሪክስ ስሌቶች እና ኢንቨርስ',
              content: [
                '2x2 ማትሪክስ A = [[a, b], [c, d]] ዲተርሚናንት det(A) = ad - bc ነው።',
                'A⁻¹ = (1/det(A)) * [[d, -b], [-c, a]] (det(A) ≠ 0 ሲሆን ብቻ)።',
              ],
            },
          ],
          unitReviewQuestions: ['1. የክሬመር ህግን በመጠቀም 3x + 2y = 7 እና x - 4y = -7 እኩልታዎችን ፈታ።'],
        },
      ],
    },
    12: {
      subjectId: 'math',
      grade: 12,
      title: 'የሂሳብ ትምህርት የተማሪ መጽሐፍ - ክፍል 12 (Grade 12 Mathematics & Calculus)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'ሊሚት እና ኮንቲኒዊቲ፣ ዴሪቬቲቭ (ዲፈረንሽየሽን)፣ የዴሪቬቲቭ አተገባበር እና ኢንቴግራል ካልኩለስ።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ ሊሚት እና ኮንቲኒዊቲ (Limits & Continuity)',
          summary: 'የፈንክሽን ሊሚት ጽንሰ-ሀሳብ፣ የአልጀብራ ሊሚቶች እና ቀጣይነት (Continuity)።',
          sections: [
            {
              title: '1.1 የሊሚት ስሌቶች',
              content: [
                'lim_{x→c} f(x) = L ማለት x ወደ c ሲጠጋ የፈንክሽኑ ዋጋ f(x) ወደ L ይጠጋል ማለት ነው።',
                'የሊሚት ህጎች፡ የመደመር፣ የማባዛት እና የማካፈል ህጎችን ያካትታል።',
              ],
            },
          ],
          unitReviewQuestions: ['1. lim_{x→2} (x² - 4)/(x - 2) ዋጋ ፈልግ።'],
        },
        {
          unitNumber: 2,
          title: 'ምዕራፍ 2፡ ዴሪቬቲቭ እና ዲፈረንሽየሽን (Derivatives)',
          summary: 'የለውጥ ፍጥነት፣ የዴሪቬቲቭ ቀመሮች (Power rule, Product rule, Quotient rule, Chain rule)።',
          sections: [
            {
              title: '2.1 የዴሪቬቲቭ ህጎች',
              content: [
                'Power Rule: d/dx(xⁿ) = n·xⁿ⁻¹',
                'Product Rule: (uv)\' = u\'v + uv\'',
                'Quotient Rule: (u/v)\' = (u\'v - uv\') / v²',
                'Chain Rule: d/dx(f(g(x))) = f\'(g(x)) · g\'(x)',
              ],
            },
          ],
          unitReviewQuestions: ['1. f(x) = (3x² - 5)⁴ ዴሪቬቲቭ ፈልግ።'],
        },
      ],
    },
  },
  physics: {
    9: {
      subjectId: 'physics',
      grade: 9,
      title: 'የፊዚክስ ትምህርት የተማሪ መጽሐፍ (Physics Student Textbook)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 6,
      description: 'ፊዚክስ እና ልኬት፣ ቬክተሮች፣ ባለአንድ አቅጣጫ እንቅስቃሴ፣ የኒውተን የእንቅስቃሴ ህጎች፣ ስራ፣ ጉልበት እና ሃይል፣ ቀላል ማሽኖች።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ ፊዚክስ እና የፊዚካል መጠኖች ልኬት (Physics & Measurement)',
          summary: 'መሰረታዊ እና ተወላጅ የፊዚክስ መጠኖች፣ የSI መለኪያ አሃዶች እና የሳይንሳዊ አፃፃፍ ስርዓት።',
          sections: [
            {
              title: '1.1 የSI መለኪያ አሃዶች (SI Units)',
              content: [
                '7ቱ መሰረታዊ የSI መለኪያዎች፡ ርዝመት (m)፣ ክብደት (kg)፣ ጊዜ (s)፣ የኤሌክትሪክ ጅረት (A)፣ የሙቀት መጠን (K)፣ የቁስ መጠን (mol) እና የብርሃን ጥንካሬ (cd) ናቸው።',
              ],
            },
          ],
        },
        {
          unitNumber: 2,
          title: 'ምዕራፍ 2፡ ባለአንድ አቅጣጫ እንቅስቃሴ (Motion in One Dimension)',
          summary: 'ርቀት፣ መፈናቀል፣ ፍጥነት (Speed & Velocity) እና ፍጥንጥነት (Acceleration)።',
          sections: [
            {
              title: '2.1 የእንቅስቃሴ ቀመሮች (Kinematic Equations)',
              content: [
                'v = u + at',
                's = ut + (1/2)at²',
                'v² = u² + 2as',
              ],
            },
          ],
        },
      ],
    },
    10: {
      subjectId: 'physics',
      grade: 10,
      title: 'የፊዚክስ ትምህርት የተማሪ መጽሐፍ - ክፍል 10 (Grade 10 Physics)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'ኤሌክትሮስታቲክስ፣ የኤሌክትሪክ ጅረት እና ወረዳዎች፣ ማግኔቲዝም፣ ኤሌክትሮማግኔቲክ ኢንዳክሽን እና ሞገዶች።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ ኤሌክትሮስታቲክስ እና የኩሎምብ ህግ (Electrostatics)',
          summary: 'የኤሌክትሪክ ቻርጅ ባህሪያት፣ የኩሎምብ ህግ (Coulomb\'s Law) እና የኤሌክትሪክ መስክ (Electric Field)።',
          sections: [
            {
              title: '1.1 የኩሎምብ ህግ',
              content: [
                'በሁለት ቻርጆች መካከል ያለው ሃይል F = k · (|q₁q₂|) / r² ሲሆን k = 8.99 × 10⁹ N·m²/C² ነው።',
              ],
            },
          ],
        },
      ],
    },
    11: {
      subjectId: 'physics',
      grade: 11,
      title: 'የፊዚክስ ትምህርት የተማሪ መጽሐፍ - ክፍል 11 (Grade 11 Physics)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 6,
      description: 'የቬክተር ስሌቶች፣ ባለሁለት አቅጣጫ እንቅስቃሴ (Projectile motion)፣ የኒውተን ህጎች አተገባበር፣ ሰርኩላር ሞሽን፣ ቴርሞዳይናሚክስ።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ ፕሮጀክታይል ሞሽን (Projectile Motion)',
          summary: 'ባለሁለት አቅጣጫ እንቅስቃሴ፣ ከፍተኛ ከፍታ (H_max)፣ የበረራ ጊዜ (T) እና አግድም ርቀት (Range R)።',
          sections: [
            {
              title: '1.1 የፕሮጀክታይል ቀመሮች',
              content: [
                'Range R = (u² · sin(2θ)) / g',
                'Max Height H = (u² · sin²(θ)) / (2g)',
                'Time of Flight T = (2u · sin(θ)) / g',
              ],
            },
          ],
        },
      ],
    },
    12: {
      subjectId: 'physics',
      grade: 12,
      title: 'የፊዚክስ ትምህርት የተማሪ መጽሐፍ - ክፍል 12 (Grade 12 Physics & Electromagnetism)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 6,
      description: 'ኤሌክትሮማግኔቲዝም፣ የፋራዳይ ህግ፣ ተለዋዋጭ ጅረት (AC Circuits)፣ አቶሚክ ፊዚክስ እና የኳንተም መሰረቶች።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ የፋራዳይ ህግ እና ማግኔቲክ ፍለክስ (Faraday\'s Law of Induction)',
          summary: 'ኤሌክትሮማግኔቲክ ኢንዳክሽን፣ የሌንዝ ህግ (Lenz\'s Law)፣ ትራንስፎርመር እና የሃይል ማመንጫዎች።',
          sections: [
            {
              title: '1.1 የፋራዳይ ህግ ቀመር',
              content: [
                'Induced EMF ε = -N · (dΦ_B / dt)',
                'ትራንስፎርመር ቀመር: V_p / V_s = N_p / N_s = I_s / I_p',
              ],
            },
          ],
        },
      ],
    },
  },
  chemistry: {
    9: {
      subjectId: 'chemistry',
      grade: 9,
      title: 'የኬሚስትሪ ትምህርት የተማሪ መጽሐፍ (Chemistry Student Textbook)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'የኬሚስትሪ መዋቅር፣ የአቶም አወቃቀር፣ የፔሪዮዲክ ቴብል፣ ኬሚካላዊ ቦንዲንግ እና የኬሚካል ምላሾች።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ የአቶም አወቃቀር እና ፔሪዮዲክ ቴብል (Atomic Structure)',
          summary: 'ፕሮቶን፣ ኒውትሮን እና ኤሌክትሮን፣ የቦህር ሞዴል እና የኤሌክትሮን ኮንፊገሬሽን።',
          sections: [
            {
              title: '1.1 የኤሌክትሮን ኮንፊገሬሽን',
              content: [
                'አውፍባው ፕሪንሲፕል (Aufbau Principle)፡ ኤሌክትሮኖች ዝቅተኛ የሃይል ደረጃ ያላቸውን ኦርቢታሎች አስቀድመው ይሞላሉ።',
              ],
            },
          ],
        },
      ],
    },
    10: {
      subjectId: 'chemistry',
      grade: 10,
      title: 'የኬሚስትሪ ትምህርት የተማሪ መጽሐፍ - ክፍል 10 (Grade 10 Chemistry)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'ኬሚካላዊ ሪአክሽኖች እና ስቶይኪዮሜትሪ፣ አሲድ እና ቤዝ፣ ኦርጋኒክ ኬሚስትሪ (ሃይድሮካርቦኖች)።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ አሲድ፣ ቤዝ እና ጨው (Acids, Bases & Salts)',
          summary: 'የአርሄኒየስ እና ብሮንስተድ-ላውሪ ቲዎሪ፣ pH ስኬል እና የገለልተኝነት ምላሽ (Neutralization)።',
          sections: [
            {
              title: '1.1 የ pH ስኬል',
              content: ['pH = -log[H⁺]፣ pH < 7 አሲዳማ፣ pH = 7 ገለልተኛ፣ pH > 7 ቤዛዊ ነው።'],
            },
          ],
        },
      ],
    },
    11: {
      subjectId: 'chemistry',
      grade: 11,
      title: 'የኬሚስትሪ ትምህርት የተማሪ መጽሐፍ - ክፍል 11 (Grade 11 Chemistry)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 6,
      description: 'አቶሚክ ኳንተም ቁጥሮች፣ ኬሚካላዊ ትስስር (VSEPR theory & Hybridization)፣ ጋዞች፣ ፈሳሾች እና ጠጣሮች፣ ኬሚካላዊ ኢኩሊብሪየም።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ ኬሚካላዊ ኢኩሊብሪየም (Chemical Equilibrium)',
          summary: 'የኢኩሊብሪየም ኮንስታንት Kc/Kp፣ የሌ ሻቴሊየር መርህ (Le Chatelier\'s Principle)።',
          sections: [
            {
              title: '1.1 የሌ ሻቴሊየር መርህ',
              content: ['በኢኩሊብሪየም ላይ ያለ ስርዓት ጫና፣ ሙቀት ወይም መጠን ሲቀየር ስርዓቱ ለውጡን ወደሚቀንስበት አቅጣጫ ያዘነብላል።'],
            },
          ],
        },
      ],
    },
    12: {
      subjectId: 'chemistry',
      grade: 12,
      title: 'የኬሚስትሪ ትምህርት የተማሪ መጽሐፍ - ክፍል 12 (Grade 12 Chemistry & Electrochemistry)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 6,
      description: 'ኤሌክትሮኬሚስትሪ (ጋልቫኒክ እና ኤሌክትሮላይቲክ ሴሎች)፣ የኢንዱስትሪ ኬሚስትሪ በኢትዮጵያ፣ ፖሊመሮች።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ ኤሌክትሮኬሚስትሪ እና የጋልቫኒክ ሴሎች (Electrochemistry)',
          summary: 'የሪዶክስ ምላሾች፣ የጋልቫኒክ ሴል ቮልቴጅ E°_cell = E°_cathode - E°_anode፣ የነርንስት እኩልታ (Nernst Equation)።',
          sections: [
            {
              title: '1.1 የስታንዳርድ ሴል ፖቴንሻል',
              content: ['E°_cell = E°_cathode - E°_anode (E° > 0 ሲሆን ምላሹ በራሱ ይከናወናል Spontaneous)።'],
            },
          ],
        },
      ],
    },
  },
  biology: {
    9: {
      subjectId: 'biology',
      grade: 9,
      title: 'የባዮሎጂ ትምህርት የተማሪ መጽሐፍ (Biology Student Textbook)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'ባዮሎጂ እና ቴክኖሎጂ፣ የህዋስ (Cell) አወቃቀር፣ የሰው ልጅ የምግብ መፈጨት እና የመተንፈሻ አካላት ስርዓት።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ የህዋስ አወቃቀር እና ተግባር (Cell Biology)',
          summary: 'የእፅዋት እና የእንስሳት ህዋሳት ንጽጽር፣ ኦርጋኔሎች (ሚቶኮንድሪያ፣ ክሎሮፕላስት፣ ኒውክሊየስ)።',
          sections: [{ title: '1.1 የህዋስ ክፍሎች', content: ['ሚቶኮንድሪያ የህዋሱ የሃይል ማመንጫ (Powerhouse of the cell) ነው።'] }],
        },
      ],
    },
    10: {
      subjectId: 'biology',
      grade: 10,
      title: 'የባዮሎጂ ትምህርት የተማሪ መጽሐፍ - ክፍል 10 (Grade 10 Biology)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'ኢኮሎጂ እና ስነ-ምህዳር፣ የዘረመል (Genetics) መሰረቶች፣ የሰው ልጅ የመራቢያ ስርዓት።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ ስነ-ምህዳር እና ጥበቃ (Ecology & Conservation)',
          summary: 'የምግብ ሰንሰለት (Food Chain)፣ የምግብ ድር (Food Web) እና የኢትዮጵያ የተፈጥሮ ሃብቶች ጥበቃ።',
          sections: [{ title: '1.1 የስነ-ምህዳር መስተጋብር', content: ['አምራቾች (Producers) የፀሐይ ብርሃንን በመጠቀም ፎቶሲንተሲስ ያከናውናሉ።'] }],
        },
      ],
    },
    11: {
      subjectId: 'biology',
      grade: 11,
      title: 'የባዮሎጂ ትምህርት የተማሪ መጽሐፍ - ክፍል 11 (Grade 11 Biology)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'ባዮሞለኪውሎች (ካርቦሃይድሬት፣ ፕሮቲን፣ ቅባት፣ ኒውክሊክ አሲድ)፣ ኢንዛይሞች፣ ሴሉላር ሬስፒሬሽን።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ ባዮሞለኪውሎች እና ኢንዛይሞች (Biomolecules & Enzymes)',
          summary: 'የኢንዛይም አሰራር መርህ (Lock and Key & Induced Fit)፣ የሙቀት መጠን እና pH በኢንዛይም ላይ ያላቸው ተፅዕኖ።',
          sections: [{ title: '1.1 ኢንዛይሞች', content: ['ኢንዛይሞች የኬሚካላዊ ምላሾችን የማስነሻ ሃይል (Activation Energy) ይቀንሳሉ።'] }],
        },
      ],
    },
    12: {
      subjectId: 'biology',
      grade: 12,
      title: 'የባዮሎጂ ትምህርት የተማሪ መጽሐፍ - ክፍል 12 (Grade 12 Biology & Molecular Genetics)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'ሞለኪውላር ጄኔቲክስ (DNA Replication, Transcription, Translation)፣ የሜንደል የዘረመል ህጎች፣ ባዮቴክኖሎጂ።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ ሞለኪውላር ጄኔቲክስ እና DNA (Molecular Genetics)',
          summary: 'የዲ ኤን ኤ ባለሁለት ሰንሰለት (Double Helix) አወቃቀር፣ የጄኔቲክ ኮድ እና ፕሮቲን ውህደት።',
          sections: [{ title: '1.1 የ DNA አወቃቀር', content: ['አድኒን (A) ከታይሚን (T) ጋር፣ ጉዋኒን (G) ከሳይቶሲን (C) ጋር በሃይድሮጅን ቦንድ ይያያዛሉ።'] }],
        },
      ],
    },
  },
  history: {
    9: {
      subjectId: 'history',
      grade: 9,
      title: 'የታሪክ ትምህርት የተማሪ መጽሐፍ (History Student Textbook)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 6,
      description: 'የሰው ልጅ አመጣጥ በምስራቅ አፍሪካ፣ ጥንታዊ ስልጣኔዎች (አክሱም፣ ፑንት፣ ላሊበላ)፣ የመካከለኛው ዘመን ኢትዮጵያ።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ የሰው ልጅ አመጣጥ እና የጥንት ስልጣኔዎች (Human Evolution & Ancient States)',
          summary: 'ሉሲ (ድንቅነሽ) እና ሌሎች ቅሪተ-አካላት፣ የአክሱም ስልጣኔ ንግድ፣ ሳንቲሞች እና ሀውልቶች።',
          sections: [{ title: '1.1 የአክሱም ስልጣኔ', content: ['አክሱም በቀይ ባህር ንግድ መስመር ላይ ትልቅ አለም አቀፍ የንግድ ማዕከል ነበረች።'] }],
        },
      ],
    },
    10: {
      subjectId: 'history',
      grade: 10,
      title: 'የታሪክ ትምህርት የተማሪ መጽሐፍ - ክፍል 10 (Grade 10 History)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'የ19ኛው ክፍለ ዘመን የኢትዮጵያ ታሪክ፣ የቅኝ ግዛት ወረራዎችን መመከት፣ የአድዋ ድል እና የዘመናዊት ኢትዮጵያ ግንባታ።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ የአድዋ ድል እና ታሪካዊ ፋይዳው (The Victory of Adwa)',
          summary: 'የ1896ቱ የአድዋ ድል፣ የውጫሌ ውል አንቀጽ 17፣ የመላው ጥቁር ህዝቦች የነጻነት ተምሳሌት።',
          sections: [{ title: '1.1 የአድዋ ጦርነት', content: ['በዳግማዊ አፄ ምኒሊክ እና እቴጌ ጣይቱ መሪነት መላው የኢትዮጵያ ህዝብ ጣሊያንን ድል አድርጓል።'] }],
        },
      ],
    },
    11: {
      subjectId: 'history',
      grade: 11,
      title: 'የታሪክ ትምህርት የተማሪ መጽሐፍ - ክፍል 11 (Grade 11 History)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'የመጀመሪያው እና የሁለተኛው የአለም ጦርነት፣ የፋሺስት ጣሊያን ወረራ (1936-1941) እና የአርበኞች ተጋድሎ።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ የፋሺስት ጣሊያን ወረራ እና የአርበኞች ትግል (1936-1941)',
          summary: 'የ5 ዓመታት የፋሺስት ወረራ፣ ጥቁር አንበሳ፣ የካቲት 12 ሰማዕታት እና የአርበኞች የነጻነት ተጋድሎ።',
          sections: [{ title: '1.1 የአርበኝነት ትግል', content: ['የኢትዮጵያ አርበኞች በየዱር ገደሉ ተሰማርተው ወራሪውን ኃይል ያለ እረፍት ተዋግተዋል።'] }],
        },
      ],
    },
    12: {
      subjectId: 'history',
      grade: 12,
      title: 'የታሪክ ትምህርት የተማሪ መጽሐፍ - ክፍል 12 (Grade 12 History)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'የቀዝቃዛው ጦርነት (Cold War)፣ የአፍሪካ አንድነት ድርጅት (OAU/AU) ምስረታ በአዲስ አበባ፣ የ1966ቱ የኢትዮጵያ አብዮት።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ የአፍሪካ አንድነት ድርጅት (OAU/AU) እና የኢትዮጵያ ዲፕሎማሲ',
          summary: 'አዲስ አበባ የአፍሪካ መዲና መሆኗ፣ የቀዳማዊ ኃይለሥላሴ ሚና እና የአፍሪካ ህብረት ጉባኤዎች።',
          sections: [{ title: '1.1 የ OAU ምስረታ (1963)', content: ['በግንቦት 1963 በ32 የአፍሪካ ሀገራት መሪዎች የተፈረመው ቻርተር አዲስ አበባን የዲፕሎማሲ ማዕከል አደረጋት።'] }],
        },
      ],
    },
  },
  geography: {
    9: {
      subjectId: 'geography',
      grade: 9,
      title: 'የጂኦግራፊ ትምህርት የተማሪ መጽሐፍ (Geography Student Textbook)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'የካርታ ንባብ እና ስኬል፣ የመሬት ቅርጾች (Landforms)፣ የአየር ንብረት እና የአየር ሁኔታ።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ የካርታ ንባብ እና ጂኦስፓሻል ሳይንስ (Map Reading)',
          summary: 'የካርታ አይነቶች፣ ስኬል (Large scale vs Small scale)፣ ኮንቱር መስመሮች (Contour lines)።',
          sections: [{ title: '1.1 የካርታ ስኬል', content: ['ስኬል በካርታው እና በመሬት ላይ ባለው ትክክለኛ ርቀት መካከል ያለውን ጥምርታ ያሳያል።'] }],
        },
      ],
    },
    10: {
      subjectId: 'geography',
      grade: 10,
      title: 'የጂኦግራፊ ትምህርት የተማሪ መጽሐፍ - ክፍል 10 (Grade 10 Geography)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'የኢትዮጵያ እና የቀንድ አፍሪካ ጂኦግራፊ፣ የመልክአ ምድር አቀማመጥ፣ የተፋሰሶች እና ወንዞች ስርጭት።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ የኢትዮጵያ የመልክአ ምድር ክፍፍል (Physiography of Ethiopia)',
          summary: 'የምዕራቡ ደጋማ ክፍል፣ የምስራቁ ደጋማ ክፍል፣ የስምጥ ሸለቆ (Rift Valley) እና ዝቅተኛ ቆላማ አካባቢዎች።',
          sections: [{ title: '1.1 የስምጥ ሸለቆ ባህሪያት', content: ['የኢትዮጵያ ስምጥ ሸለቆ ሀገሪቱን በሰያፍ ከሰሜን ምስራቅ ወደ ደቡብ ምዕራብ ይከፍላል።'] }],
        },
      ],
    },
    11: {
      subjectId: 'geography',
      grade: 11,
      title: 'የጂኦግራፊ ትምህርት የተማሪ መጽሐፍ - ክፍል 11 (Grade 11 Geography)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'የኢትዮጵያ የአየር ንብረት ዞኖች (ደጋ፣ ወይናደጋ፣ ቆላ፣ በረሃ፣ ውርጭ)፣ የውሃ ሃብቶች እና ግድቦች።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ የኢትዮጵያ የአየር ንብረት ዞኖች (Climate Zones of Ethiopia)',
          summary: 'ከፍታ (Altitude) በአየር ንብረት ላይ ያለው ወሳኝ ሚና፣ የዝናብ ስርጭት እና ወቅታዊ የንፋስ አቅጣጫዎች።',
          sections: [{ title: '1.1 ባህላዊ የአየር ንብረት ክፍፍል', content: ['ደጋ (2300-3300m)፣ ወይናደጋ (1500-2300m)፣ ቆላ (500-1500m)፣ በረሃ (<500m) እና ውርጭ (>3300m) ናቸው።'] }],
        },
      ],
    },
    12: {
      subjectId: 'geography',
      grade: 12,
      title: 'የጂኦግራፊ ትምህርት የተማሪ መጽሐፍ - ክፍል 12 (Grade 12 Geography)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'የኢትዮጵያ የህዝብ ቁጥር እድገት እና ስነ-ህዝብ (Demography)፣ የከተሞች እድገት፣ የኢኮኖሚ እንቅስቃሴዎች።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ የኢትዮጵያ ስነ-ህዝብ እና የከተሞች እድገት (Population & Urbanization)',
          summary: 'የወሊድ እና የሞት ምጣኔ፣ የስራ አጥ ቁጥር ቅነሳ፣ የከተሞች መስፋፋት እና የዘላቂ ልማት እቅዶች።',
          sections: [{ title: '1.1 የስነ-ህዝብ ፒራሚድ', content: ['የኢትዮጵያ ስነ-ህዝብ ፒራሚድ ሰፊ መሰረት ያለው ሲሆን አብዛኛው ህዝብ ወጣት እና አምራች መሆኑን ያሳያል።'] }],
        },
      ],
    },
  },
  citizenship: {
    9: {
      subjectId: 'citizenship',
      grade: 9,
      title: 'የዜግነት ትምህርት የተማሪ መጽሐፍ (Citizenship Education)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'ዴሞክራሲ እና ህገ-መንግስታዊነት፣ የሰብዓዊ መብቶች፣ የህግ የበላይነት፣ የዜጎች ሀገራዊ ግዴታዎች።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ ዴሞክራሲያዊ ስርዓት እና ህገ-መንግስት (Democracy & Constitution)',
          summary: 'የዴሞክራሲ መሰረታዊ መርሆዎች፣ የህገ-መንግስት የበላይነት እና የህዝቦች ተሳትፎ።',
          sections: [{ title: '1.1 የዴሞክራሲ መርሆዎች', content: ['ህዝባዊ ተሳትፎ፣ ግልጸኝነት፣ ተጠያቂነት እና ፍትሃዊነት የዴሞክራሲ አምዶች ናቸው።'] }],
        },
      ],
    },
    10: {
      subjectId: 'citizenship',
      grade: 10,
      title: 'የዜግነት ትምህርት የተማሪ መጽሐፍ - ክፍል 10 (Grade 10 Citizenship)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'ብዝሃነትን ማስተናገድ፣ ሰላም ግንባታ እና ግጭት አፈታት፣ ሀገራዊ አንድነት።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ ሰላም ግንባታ እና ባህላዊ የግጭት አፈታት (Peacebuilding)',
          summary: 'የሽምግልና እና የባህላዊ የዕርቅ ስነ-ስርዓቶች (እንደ ገርባ፣ ጃርሱማ፣ ሺምግልና) ማህበረሰባዊ ሚና።',
          sections: [{ title: '1.1 ባህላዊ የግጭት አፈታት', content: ['የሀገር ሽማግሌዎች የዕርቅ ተቋማት ዘላቂ ማህበራዊ ሰላምን ለማረጋገጥ ቁልፍ ናቸው።'] }],
        },
      ],
    },
    11: {
      subjectId: 'citizenship',
      grade: 11,
      title: 'የዜግነት ትምህርት የተማሪ መጽሐፍ - ክፍል 11 (Grade 11 Citizenship)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'መልካም አስተዳደር (Good Governance)፣ ሙስናን መዋጋት፣ ፍትሃዊ የሀብት ክፍፍል እና ዘላቂ ልማት።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ መልካም አስተዳደር እና የህዝብ አገልግሎት',
          summary: 'ተቋማዊ ብቃት፣ የህዝብ አመኔታ፣ ሙስናን የመከላከል ስትራቴጂዎች።',
          sections: [{ title: '1.1 ሙስናን መዋጋት', content: ['ግልጽ እና ተጠያቂ የሆነ የአሰራር ስርዓት ሙስናን ለመግታት ቀዳሚው መንገድ ነው።'] }],
        },
      ],
    },
    12: {
      subjectId: 'citizenship',
      grade: 12,
      title: 'የዜግነት ትምህርት የተማሪ መጽሐፍ - ክፍል 12 (Grade 12 Citizenship)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'አለም አቀፍ ግንኙነቶች፣ የኢትዮጵያ የውጭ ጉዳይ ፖሊሲ፣ ግሎባላይዜሽን እና ሀገራዊ ሉዓላዊነት።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ የኢትዮጵያ የውጭ ግንኙነት እና ዲፕሎማሲ',
          summary: 'የጋራ ጥቅም፣ የሰላማዊ አብሮ መኖር መርሆዎች እና የቀጣናዊ ትስስር ግንባታ።',
          sections: [{ title: '1.1 የውጭ ፖሊሲ መርሆዎች', content: ['የኢትዮጵያ የውጭ ፖሊሲ በጋራ ጥቅም እና በሀገራዊ ክብር ላይ የተመሰረተ ነው።'] }],
        },
      ],
    },
  },
  english: {
    9: {
      subjectId: 'english',
      grade: 9,
      title: 'English for Ethiopia Student Textbook - Grade 9',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 6,
      description: 'Reading comprehension, grammar (tenses, modal verbs), vocabulary development, essay writing.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Living in a Community',
          summary: 'Expressing present and past habits, descriptive paragraph writing, vocabulary in context.',
          sections: [{ title: '1.1 Present Simple and Continuous', content: ['Use Present Simple for facts and habits; Present Continuous for actions happening now.'] }],
        },
      ],
    },
    10: {
      subjectId: 'english',
      grade: 10,
      title: 'English for Ethiopia Student Textbook - Grade 10',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 6,
      description: 'Conditional sentences (Types 1, 2, 3), passive voice, critical reading, argumentative essays.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Environmental Conservation & Climate Action',
          summary: 'Conditionals and cause-effect language in academic essays.',
          sections: [{ title: '1.1 Conditionals Type 2 & 3', content: ['Type 2: If + past simple, would + base verb (unreal present). Type 3: If + past perfect, would have + past participle (unreal past).'] }],
        },
      ],
    },
    11: {
      subjectId: 'english',
      grade: 11,
      title: 'English for Ethiopia Student Textbook - Grade 11',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 6,
      description: 'Advanced vocabulary, discourse markers, report writing, literary analysis of poetry and prose.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Media Literacy and Critical Thinking',
          summary: 'Evaluating news credibility, identifying bias, formal reporting conventions.',
          sections: [{ title: '1.1 Discourse Markers', content: ['Markers such as "furthermore", "nonetheless", and "consequently" establish logical relationships between ideas.'] }],
        },
      ],
    },
    12: {
      subjectId: 'english',
      grade: 12,
      title: 'English for Ethiopia Student Textbook - Grade 12 (ESSLCE English Preparation)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 6,
      description: 'Academic reading, national exam grammar strategies, idioms and phrasal verbs, college essay writing.',
      units: [
        {
          unitNumber: 1,
          title: 'Unit 1: Global Perspectives & Higher Education Readiness',
          summary: 'Synthesizing multiple texts, advanced punctuation, error recognition for entrance examinations.',
          sections: [{ title: '1.1 Phrasal Verbs & Collocations', content: ['Mastering high-frequency academic collocations and context clues for entrance exams.'] }],
        },
      ],
    },
  },
  it: {
    9: {
      subjectId: 'it',
      grade: 9,
      title: 'ኢንፎርሜሽን ቴክኖሎጂ የተማሪ መጽሐፍ (Information Technology)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'የኮምፒውተር መሰረታዊ አካላት (Hardware/Software)፣ የኢንተርኔት አጠቃቀም፣ የሳይበር ደህንነት።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ የኮምፒውተር ስርዓት እና ሃርድዌር (Computer Systems)',
          summary: 'CPU, RAM, ROM, የግብዓት እና የውጤት መሳሪያዎች፣ ኦፕሬቲንግ ሲስተም።',
          sections: [{ title: '1.1 የኮምፒውተር ክፍሎች', content: ['CPU (Central Processing Unit) የኮምፒውተሩ አእምሮ ነው።'] }],
        },
      ],
    },
    10: {
      subjectId: 'it',
      grade: 10,
      title: 'ኢንፎርሜሽን ቴክኖሎጂ የተማሪ መጽሐፍ - ክፍል 10 (Grade 10 IT)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'የኮምፒውተር ኔትወርክ (LAN, WAN)፣ ዌብሳይት ዲዛይን (HTML/CSS)፣ ዳታቤዝ መሰረቶች።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ የኮምፒውተር ኔትወርኪንግ (Computer Networking)',
          summary: 'IP አድራሻ፣ ራውተሮች፣ ስዊቾች እና የኢንተርኔት ፕሮቶኮሎች (TCP/IP, HTTP)።',
          sections: [{ title: '1.1 የኔትወርክ አይነቶች', content: ['LAN (Local Area Network) በአንድ ህንፃ ወይም ክፍል ውስጥ መሳሪያዎችን ያገናኛል።'] }],
        },
      ],
    },
    11: {
      subjectId: 'it',
      grade: 11,
      title: 'ኢንፎርሜሽን ቴክኖሎጂ የተማሪ መጽሐፍ - ክፍል 11 (Grade 11 IT & Programming)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'የፕሮግራሚንግ መሰረቶች (Python)፣ አልጎሪዝም እና ፍሎውቻርት፣ ዳታ ስትራክቸር።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ የፓይዘን ፕሮግራሚንግ መሰረቶች (Python Programming)',
          summary: 'ተለዋዋጮች (Variables)፣ የውሳኔ መዋቅሮች (if-else) እና ድግግሞሾች (Loops)።',
          sections: [{ title: '1.1 የፓይዘን ሲንታክስ', content: ['ፓይዘን ቀላል እና ግልጽ የሆነ ሲንታክስ ያለው ታዋቂ የፕሮግራሚንግ ቋንቋ ነው።'] }],
        },
      ],
    },
    12: {
      subjectId: 'it',
      grade: 12,
      title: 'ኢንፎርሜሽን ቴክኖሎጂ የተማሪ መጽሐፍ - ክፍል 12 (Grade 12 IT, AI & Databases)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'አርቴፊሻል ኢንተለጀንስ (AI)፣ ዳታ ሳይንስ፣ የደመና ኮምፒውቲንግ (Cloud Computing) እና የሳይበር ህግጋት።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ አርቴፊሻል ኢንተለጀንስ እና ማሽን ለርኒንግ (AI & Machine Learning)',
          summary: 'የ AI መሰረቶች፣ ኒውራል ኔትወርኮች እና በኢትዮጵያ ኢኮኖሚ ውስጥ ያላቸው ተስፋ።',
          sections: [{ title: '1.1 የ AI አይነቶች', content: ['ማሽን ለርኒንግ ኮምፒውተሮች ከዳታ በመማር ውሳኔዎችን እንዲሰጡ ያስችላል።'] }],
        },
      ],
    },
  },
  agriculture: {
    9: {
      subjectId: 'agriculture',
      grade: 9,
      title: 'የግብርና ትምህርት የተማሪ መጽሐፍ (General Agriculture)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'የአፈር ሳይንስ እና ለምነት፣ የሰብል ልማት፣ የቤት እንስሳት እርባታ፣ የውሃ አጠቃቀም እና መስኖ።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ የአፈር ለምነት እና የተፈጥሮ ማዳበሪያ ዝግጅት',
          summary: 'ኮምፖስት ዝግጅት፣ የአፈር አሲዳማነት ህክምና እና የውሃ እቀባ ዘዴዎች።',
          sections: [{ title: '1.1 የኮምፖስት ዝግጅት', content: ['የተፈጥሮ ኮምፖስት የአፈርን መዋቅር እና ለምነት በዘላቂነት ያሻሽላል።'] }],
        },
      ],
    },
    10: {
      subjectId: 'agriculture',
      grade: 10,
      title: 'የግብርና ትምህርት የተማሪ መጽሐፍ - ክፍል 10 (Grade 10 Agriculture)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'የአትክልትና ፍራፍሬ ልማት (Horticulture)፣ የተባይ መከላከያ ዘዴዎች (IPM)፣ የእንስሳት አመጋገብ።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ የተቀናጀ የተባይ መከላከያ ዘዴዎች (Integrated Pest Management)',
          summary: 'ተፈጥሯዊ እና ኬሚካላዊ የተባይ መከላከያ መንገዶች ሚዛናዊ አተገባበር።',
          sections: [{ title: '1.1 የ IPM መርሆዎች', content: ['ተፈጥሯዊ ጠላቶችን እና የሰብል ፈረቃን በመጠቀም ተባዮችን መቆጣጠር ይቻላል።'] }],
        },
      ],
    },
    11: {
      subjectId: 'agriculture',
      grade: 11,
      title: 'የግብርና ትምህርት የተማሪ መጽሐፍ - ክፍል 11 (Grade 11 Agriculture)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'ዘመናዊ የእንስሳት እርባታ (የወተት ላሞች፣ የዶሮ እርባታ፣ ንብ እርባታ)፣ የእንስሳት ጤና አጠባበቅ።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ ዘመናዊ የንብ እርባታ እና የማር ምርት',
          summary: 'ዘመናዊ የንብ ቀፎዎች (Frame Hives)፣ የማር አያያዝ እና ጥራት ቁጥጥር።',
          sections: [{ title: '1.1 የንብ ቀፎ አይነቶች', content: ['የፍሬም ቀፎዎች ከፍተኛ ጥራት ያለው ንጹህ ማር በብዛት ለማምረት ያስችላሉ።'] }],
        },
      ],
    },
    12: {
      subjectId: 'agriculture',
      grade: 12,
      title: 'የግብርና ትምህርት የተማሪ መጽሐፍ - ክፍል 12 (Grade 12 Agriculture & Agribusiness)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'አግሪቢዝነስ እና የግብርና ግብይት፣ የኤክስፖርት ሰብሎች (ቡና፣ ሰሊጥ፣ አበቦች)፣ የግብርና ፖሊሲ።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ አግሪቢዝነስ እና የግብርና ስራ ፈጠራ (Agri-entrepreneurship)',
          summary: 'የግብርና ምርቶች የገበያ ትስስር፣ የእሴት ሰንሰለት (Value Chain) እና የንግድ እቅድ ዝግጅት።',
          sections: [{ title: '1.1 የግብርና እሴት ሰንሰለት', content: ['ምርትን በማቀነባበር ከፍተኛ ገቢ ማግኘት ይቻላል።'] }],
        },
      ],
    },
  },
};
