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
      title: 'ኢንፎርሜሽን ቴክኖሎጂ የተማሪ መጽሐፍ - ክፍል 11 (Grade 11 IT New Curriculum - 168 ገጾች)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት (168 ገጾች)',
      totalUnits: 6,
      description: 'የክፍል 11 ኢንፎርሜሽን ቴክኖሎጂ አዲሱ ስርዓተ-ትምህርት (168 ገጾች) ሙሉ 6 ምዕራፎች፡ የኢንፎርሜሽን ስርዓትና መተግበሪያዎቹ፣ አዳዲስ ቴክኖሎጂዎች (AI፣ AR/VR፣ Big Data፣ IoT፣ Cloud)፣ የዳታቤዝ አስተዳደር እና SQL፣ የዌብ ሳይት አልሚነት (HTML5 & CSS)፣ የሃርድዌር ብልሽት ፍተሻና መከላከል ጥገና፣ እና የፓይዘን ፕሮግራሚንግ መሰረቶች።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ የኢንፎርሜሽን ስርዓት እና መተግበሪያዎቹ (ገጽ 1–28)',
          summary: 'የኢንፎርሜሽን ስርዓት መሰረቶች፣ የDIKW ተዋረድ (ዳታ፣ መረጃ፣ ዕውቀት፣ ጥበብ)፣ የIS 5 ክፍሎች (ሃርድዌር፣ ሶፍትዌር፣ ዳታ፣ ሰዎች፣ አሰራሮች)፣ የስርዓቱ አይነቶች (TPS፣ MIS፣ DSS፣ ESS)፣ ኢ-አገልግሎቶች እና የዲጂታል ክፍተት።',
          sections: [
            {
              title: '1.1 የኢንፎርሜሽን ስርዓት መሰረቶች እና የDIKW ተዋረድ',
              content: [
                'ዳታ (Data)፡ ያልተሰናዱ፣ ትርጉም ያልተሰጣቸው ጥሬ እውነታዎች እና ምልክቶች ናቸው።',
                'መረጃ (Information)፡ የተቀናበረ፣ ትርጉም እና አውድ የተሰጠው ዳታ ነው።',
                'ዕውቀት (Knowledge)፡ መረጃ ከተሞክሮ እና ከተግባራዊ ግንዛቤ ጋር ተዳምሮ ሲሰራበት ነው።',
                'ጥበብ (Wisdom)፡ በዕውቀት ላይ ተመስርቶ ትክክለኛ፣ ስነ-ምግባራዊ እና የረጅም ጊዜ ውሳኔ የመወሰን ችሎታ ነው።',
              ],
              keyTerms: [
                { term: 'ዳታ (Data)', definition: 'ያልተሰናዱ እና አውድ የሌላቸው ጥሬ እውነታዎች እና ቁጥሮች።' },
                { term: 'መረጃ (Information)', definition: 'ትርጉም እና አላማ እንዲኖረው የተደራጀ ዳታ።' },
                { term: 'ዕውቀት (Knowledge)', definition: 'ተግባራዊ ግንዛቤ እና ተሞክሮ የታከለበት መረጃ።' },
                { term: 'ጥበብ (Wisdom)', definition: 'በዕውቀት ላይ ተመስርቶ ስነ-ምግባራዊ እና አስተዋይ ውሳኔ የማድረግ አቅም።' },
              ],
              workedExamples: [
                {
                  question: 'ምሳሌ፡ በአዋሽ ተፋሰስ የሚመዘገብ የአየር ሁኔታ በDIKW ተዋረድ እንዴት ይተነተናል?',
                  solution: 'ዳታ፡ 35 ሚሜ ዝናብ፣ 28°ሴ የሙቀት መጠን። መረጃ፡ በአዋሽ አካባቢ በ24 ሰዓት ውስጥ 35 ሚሜ ዝናብ ዘንቧል። ዕውቀት፡ የጤፍ ቡቃያ በዚህ እርጥበት በ48 ሰዓታት ውስጥ መዘራት አለበት። ጥበብ፡ ድርቅ ከመከሰቱ በፊት የክልሉን የውሃ ማጠራቀሚያ ቀድሞ ማዘጋጀት።',
                },
              ],
              exercises: ['1. በዳታ እና በመረጃ መካከል ያለውን ልዩነት በሁለት ምሳሌዎች አስረዳ።', '2. ዕውቀት ወደ ጥበብ እንዴት እንደሚሸጋገር አብራራ።'],
            },
            {
              title: '1.2 የኢንፎርሜሽን ስርዓት አካላት እና ምደባዎች',
              content: [
                'አምስቱ የኢንፎርሜሽን ስርዓት ወሳኝ አካላት፡ ሃርድዌር፣ ሶፍትዌር፣ ዳታ፣ ሰዎች እና የአሰራር ደንቦች (Procedures) ናቸው።',
                'የትራንዛክሽን ማስተናገጃ ስርዓት (TPS)፡ የቀን ተቀን መደበኛ የንግድ ሂደቶችን ይመዘግባል (ለምሳሌ፡ የቴሌብር ክፍያ)።',
                'የማኔጅመንት ኢንፎርሜሽን ስርዓት (MIS)፡ ለመካከለኛ ስራ አስኪያጆች መደበኛ ማጠቃለያ ሪፖርቶችን ያቀርባል።',
                'የውሳኔ ድጋፍ ሰጪ ስርዓት (DSS)፡ ውስብስብ እና ከፊል-የተዋቀሩ ውሳኔዎችን ለመወሰን ትንተናዊ ሞዴሎችን ይጠቀማል።',
                'የከፍተኛ አመራር ድጋፍ ስርዓት (ESS)፡ ለከፍተኛ አመራሮች ስትራቴጂካዊ የረጅም ጊዜ ውሳኔዎችን ለማሳለፍ ይረዳል።',
              ],
              keyTerms: [
                { term: 'TPS', definition: 'የቀን ተቀን መደበኛ ስራዎችን የሚያከናውን እና የሚመዘግብ የኮምፒውተር ስርዓት።' },
                { term: 'DSS', definition: 'መረጃዎችን እና የትንተና ሞዴሎችን በማጣመር ውሳኔ ለመስጠት የሚረዳ ስርዓት።' },
              ],
              exercises: ['1. አምስቱን የኢንፎርሜሽን ስርዓት አካላት ዘርዝር።', '2. TPS እና DSSን በተጠቃሚዎቻቸው እና በውሳኔ ደረጃቸው አወዳድር።'],
            },
            {
              title: '1.3 ኢ-አገልግሎቶች፣ ኢንተርፕረነርሺፕ እና የዲጂታል ክፍተት',
              content: [
                'ኤሌክትሮኒክ መንግስት (E-Government)፡ መንግስታዊ አገልግሎቶችን በበይነመረብ በግልጽነት ለማቅረብ ያስችላል (ለምሳሌ፡ የፋይዳ ዲጂታል መታወቂያ፣ የግብር ከፋይ ፖርታል)።',
                'የዲጂታል ክፍተት (Digital Divide)፡ ቴክኖሎጂን መጠቀም በሚችሉ እና በማይችሉ ማህበረሰቦች መካከል ያለውን የኢኮኖሚ እና የመሰረተ ልማት ልዩነት ያመለክታል።',
                'የኢትዮጵያ ዲጂታል 2025 ስትራቴጂ የዲጂታል ኢኮኖሚን ለማስፋፋት እና የፋይናንስ ተደራሽነትን ለማረጋገጥ ይሰራል።',
              ],
              keyTerms: [
                { term: 'የዲጂታል ክፍተት (Digital Divide)', definition: 'በቴክኖሎጂ ተጠቃሚዎች እና ባልተጠቃሚዎች መካከል ያለው የማህበራዊና ኢኮኖሚያዊ ክፍተት።' },
                { term: 'ኤሌክትሮኒክ መንግስት (E-Government)', definition: 'የመንግስት አገልግሎቶችን በዲጂታል ቴክኖሎጂ ለዜጎች ማድረስ።' },
              ],
              exercises: ['1. የኢትዮጵያ ዲጂታል 2025 ስትራቴጂ ዋና ዓላማ ምንድን ነው?', '2. በገጠር ትምህርት ቤቶች የዲጂታል ክፍተትን ለማጥበብ ሁለት መፍትሄዎችን አቅርብ።'],
            },
          ],
          unitReviewQuestions: [
            '1. በዳታ፣ በመረጃ፣ በዕውቀት እና በጥበብ መካከል ያለውን ልዩነት አብራራ።',
            '2. አምስቱ የኢንፎርሜሽን ስርዓት አካላት በሆስፒታል ውስጥ እንዴት እንደሚተባበሩ ግለጽ።',
            '3. የTPS እና የESS ስርዓቶችን ንፅፅር አድርግ።',
            '4. በኢትዮጵያ ውስጥ የሞባይል ባንኪንግ የሚያስገኛቸውን ጥቅሞች እና ተግዳሮቶች ተወያዩበት።',
          ],
        },
        {
          unitNumber: 2,
          title: 'ምዕራፍ 2፡ አዳዲስ ቴክኖሎጂዎች (Emerging Technologies - ገጽ 29–54)',
          summary: 'አራተኛው የኢንዱስትሪ አብዮት (4IR)፣ ሰው ሰራሽ አስተውሎት (AI) እና ማሽን ለርኒንግ፣ ምናባዊ እውነታ (VR) እና የጎለበተ እውነታ (AR)፣ ግዙፍ ዳታ (5 Vs of Big Data)፣ የእቃዎች በይነመረብ (IoT) እና የደመና ኮምፒውቲንግ (IaaS፣ PaaS፣ SaaS)።',
          sections: [
            {
              title: '2.1 ሰው ሰራሽ አስተውሎት (AI) እና ማሽን ለርኒንግ',
              content: [
                'ሰው ሰራሽ አስተውሎት (AI)፡ የሰውን ልጅ የማሰብ፣ የመማር እና ችግር የመፍታት ችሎታ በኮምፒውተር መተግበር ነው።',
                'ማሽን ለርኒንግ (Machine Learning)፡ ኮምፒውተሮች በቀጥታ ፕሮግራም ሳይደረጉ ከቀረበላቸው ዳታ ተምረው ራሳቸውን እንዲያሻሽሉ የሚያደርግ የAI ዘርፍ ነው።',
                'Narrow AI ለአንድ ወጥ ተግባር ብቻ የሚውል ሲሆን (ለምሳሌ የፊት ለይቶ ማወቅ ወይም የቡና ተክል በሽታን መለየት)፣ AGI ግን እንደ ሰው ሙሉ አእምሮአዊ ብቃትን ያለመ ነው።',
              ],
              keyTerms: [
                { term: 'ሰው ሰራሽ አስተውሎት (AI)', definition: 'የሰውን አስተውሎት የሚመስሉ ተግባራትን ለማከናወን የተሰሩ የኮምፒውተር ስርዓቶች።' },
                { term: 'ማሽን ለርኒንግ (ML)', definition: 'ኮምፒውተሮች ከዳታ ተነስተው ትንበያ እንዲሰጡ የሚያስችል የAI ቅርንጫፍ።' },
              ],
              exercises: ['1. በጠባብ AI (Narrow AI) እና በጠቅላላ AI (AGI) መካከል ያለውን ልዩነት ግለጽ።', '2. የማሽን ለርኒንግ ሞዴል ትክክለኛ እንዲሆን የዳታ ሚና ምንድን ነው?'],
            },
            {
              title: '2.2 AR፣ VR፣ ግዙፍ ዳታ (Big Data) እና IoT',
              content: [
                'ምናባዊ እውነታ (VR)፡ ተጠቃሚውን ሙሉ በሙሉ ከአካላዊው ዓለም ነጥሎ ወደ ዲጂታል አስመሳይ ዓለም የሚያስገባ ቴክኖሎጂ ነው።',
                'የጎለበተ እውነታ (AR)፡ በእውነተኛው አካላዊ ዓለም ላይ ዲጂታል ምስሎችንና መረጃዎችን ደርቦ የሚያሳይ ቴክኖሎጂ ነው።',
                'ግዙፍ ዳታ በአምስቱ Vዎች ይገለጻል፡ Volume (መጠን)፣ Velocity (ፍጥነት)፣ Variety (የተለያዩ አይነቶች)፣ Veracity (ትክክለኛነት) እና Value (ዋጋ)።',
                'የእቃዎች በይነመረብ (IoT)፡ ሴንሰሮች የተገጠመላቸው ቁሳቁሶች ያለ ሰው ጣልቃገብነት መረጃ የሚለዋወጡበት መረብ ነው።',
              ],
              keyTerms: [
                { term: 'ምናባዊ እውነታ (VR)', definition: 'ተጠቃሚውን በልዩ መነጽር ወደ ሙሉ ዲጂታል ዓለም የሚያስገባ ቴክኖሎጂ።' },
                { term: 'የጎለበተ እውነታ (AR)', definition: 'በገሃዱ ዓለም ላይ ዲጂታል መረጃን ደርቦ የሚያሳይ ስርዓት።' },
                { term: 'የእቃዎች በይነመረብ (IoT)', definition: 'ሴንሰር እና የበይነመረብ ግንኙነት ያላቸው የእለት ተእለት እቃዎች መረብ።' },
              ],
              exercises: ['1. AR እና VRን በህክምና ትምህርት ውስጥ በማነጻጸር አስረዳ።', '2. አምስቱን የBig Data መገለጫዎች (5 Vs) ዘርዝር።'],
            },
            {
              title: '2.3 የደመና ኮምፒውቲንግ (Cloud Computing) ስነ-ህንፃ',
              content: [
                'የደመና ኮምፒውቲንግ፡ የኮምፒውተር ግብአቶችን (ሰርቨሮች፣ ዳታቤዞች፣ ሶፍትዌሮች) በበይነመረብ አማካኝነት በጥያቄ መሰረት ማቅረብ ነው።',
                'IaaS (መሰረተ-ልማት እንደ አገልግሎት)፡ ምናባዊ ሰርቨሮችን እና ማከማቻዎችን ያቀርባል።',
                'PaaS (ፕላትፎርም እንደ አገልግሎት)፡ ሶፍትዌር ለማልማት የሚያስፈልጉ መሳሪያዎችን ያቀርባል።',
                'SaaS (ሶፍትዌር እንደ አገልግሎት)፡ ዝግጁ የሆኑ መተግበሪያዎችን በዌብ ብሮውዘር በኩል ለተጠቃሚዎች ያቀርባል (ለምሳሌ፡ Google Drive)።',
              ],
              keyTerms: [
                { term: 'የደመና ኮምፒውቲንግ', definition: 'የኮምፒውተር ግብአቶችን በበይነመረብ በኩል እንደ ፍላጎት ማግኘት።' },
                { term: 'SaaS', definition: 'ሶፍትዌር በደመና ላይ ተጭኖ ለተጠቃሚዎች በድረ-ገጽ የሚሰጥበት ሞዴል።' },
              ],
              exercises: ['1. Google Driveን ከIaaS፣ PaaS ወይም SaaS የትኛው ውስጥ ይመደባል?', '2. የህዝብ (Public) እና የግል (Private) ደመና ልዩነት ምንድን ነው?'],
            },
          ],
          unitReviewQuestions: [
            '1. አዳዲስ ቴክኖሎጂዎች ለአራተኛው የኢንዱስትሪ አብዮት ያላቸውን ፋይዳ አብራራ።',
            '2. የAR እና የVR ልዩነቶችን ከነምሳሌዎቻቸው ግለጽ።',
            '3. የIoT ሴንሰሮች በኢትዮጵያ ግብርና ውስጥ እንዴት ምርታማነትን እንደሚጨምሩ አብራራ።',
            '4. በIaaS፣ PaaS እና SaaS መካከል ያለውን የሃላፊነት ልዩነት በሰንጠረዥ አሳይ።',
          ],
        },
        {
          unitNumber: 3,
          title: 'ምዕራፍ 3፡ የዳታቤዝ አስተዳደር (Database Management - ገጽ 55–84)',
          summary: 'የፋይል ስርዓት እና የዳታቤዝ ልዩነት፣ ሪሌሽናል ዳታቤዝ ሞዴል፣ የህላዌ-ግንኙነት (ER) ዲዛይን፣ ዋና እና የውጭ ቁልፎች (Primary & Foreign Keys)፣ የኢንተግሪቲ ህጎች እና የSQL ትዕዛዛት (DDL & DML)።',
          sections: [
            {
              title: '3.1 የዳታቤዝ መሰረቶች እና የህላዌ-ግንኙነት (ER) ሞዴል',
              content: [
                'ዳታቤዝ (Database)፡ በስርዓት የተደራጀ፣ ተዛማጅነት ያለው የዳታ ስብስብ ነው።',
                'DBMS፡ ዳታቤዝን ለመፍጠር፣ ለማስተዳደር እና መረጃዎችን በፍጥነት ለማውጣት የሚያገለግል ሶፍትዌር ነው።',
                'ህላዌ (Entity)፡ መረጃ የሚሰበሰብለት ማንኛውም ነገር፣ ሰው ወይም ጽንሰ-ሀሳብ ነው (ለምሳሌ፡ ተማሪ፣ መምህር)።',
                'ባህርያት (Attributes)፡ የህላዌውን ገጽታዎች የሚገልጹ ናቸው (ለምሳሌ፡ የተማሪ ስም፣ እድሜ)።',
                'የግንኙነት ምጥጥን (Cardinality)፡ 1:1፣ 1:N (አንድ ለአያሌ) እና M:N (አያሌ ለአያሌ) ናቸው።',
              ],
              keyTerms: [
                { term: 'ዳታቤዝ', definition: 'በስርዓት የተደራጀ እና እርስ በርሱ የተሳሰረ የዳታ ስብስብ።' },
                { term: 'DBMS', definition: 'ዳታቤዝን ለማስተዳደር እና ለመቆጣጠር የሚያገለግል ሶፍትዌር።' },
                { term: 'ህላዌ (Entity)', definition: 'በእውነተኛው ዓለም ያለ እና ዳታ የሚሰበሰብለት አካል።' },
              ],
              exercises: ['1. የፋይል ስርዓት ድክመቶችን ዘርዝር።', '2. ለትምህርት ቤት ቤተ-መጽሐፍት የER ዲያግራም አዘጋጅ።'],
            },
            {
              title: '3.2 የሪሌሽናል ሞዴል ቁልፎች እና የደህንነት ህጎች (Integrity)',
              content: [
                'ዋና ቁልፍ (Primary Key)፡ በሰንጠረዥ ውስጥ እያንዳንዱን ረድፍ (Row) ለይቶ የሚያሳውቅ ሲሆን NULL (ባዶ) መሆን አይችልም (Entity Integrity)።',
                'የውጭ ቁልፍ (Foreign Key)፡ አንዱን ሰንጠረዥ ከሌላ ሰንጠረዥ ዋና ቁልፍ ጋር በማስተሳሰር ግንኙነት የሚፈጥር ቁልፍ ነው (Referential Integrity)።',
                'Domain Integrity፡ በአንድ አምድ ውስጥ የሚገቡ ዳታዎች የተፈቀደውን አይነትና ክልል ብቻ እንዲከተሉ ያረጋግጣል።',
              ],
              keyTerms: [
                { term: 'ዋና ቁልፍ (Primary Key)', definition: 'በሰንጠረዥ ውስጥ እያንዳንዱን መረጃ ለይቶ የሚያውቅ ልዩ ቁልፍ።' },
                { term: 'የውጭ ቁልፍ (Foreign Key)', definition: 'የሁለት ሰንጠረዦችን ግንኙነት የሚጠብቅ ተዛማጅ ቁልፍ።' },
              ],
              exercises: ['1. የውጭ ቁልፍ ጥቅም ምንድን ነው?', '2. Entity Integrity ሲጣስ ምን ችግር ይፈጠራል?'],
            },
            {
              title: '3.3 የSQL ቋንቋ ትዕዛዛት (DDL እና DML)',
              content: [
                'DDL (Data Definition Language)፡ የሰንጠረዥ መዋቅር ለመፍጠር ያገለግላል (CREATE TABLE፣ ALTER TABLE፣ DROP TABLE)።',
                'DML (Data Manipulation Language)፡ በሰንጠረዥ ውስጥ ዳታ ለመጨመር፣ ለመቀየር እና ለማውጣት ይጠቅማል (INSERT INTO፣ SELECT፣ UPDATE፣ DELETE)።',
                'የSELECT ትዕዛዝ ከWHERE መስፈርት፣ ከORDER BY ቅደም ተከተል እና ከስብስብ ፈንክሽኖች (COUNT, AVG) ጋር በጥምረት ይሰራል።',
              ],
              keyTerms: [
                { term: 'SQL', definition: 'ሪሌሽናል ዳታቤዞችን ለማዘዝ እና ለመጠየቅ የሚያገለግል አለም አቀፍ የኮምፒውተር ቋንቋ።' },
                { term: 'SELECT', definition: 'ከዳታቤዝ ውስጥ የተፈለጉ መረጃዎችን አጣርቶ ለማውጣት የሚያገለግል የDML ትዕዛዝ።' },
              ],
              exercises: ['1. የStudent ሰንጠረዥ የሚፈጥር የSQL DDL ኮድ ጻፍ።', '2. ውጤታቸው ከ80 በላይ የሆኑ ተማሪዎችን የሚያወጣ የSELECT ጥያቄ ጻፍ።'],
            },
          ],
          unitReviewQuestions: [
            '1. በባህላዊ የፋይል አያያዝ እና በዘመናዊ DBMS መካከል ያለውን ልዩነት አስረዳ።',
            '2. ዋና ቁልፍ እና የውጭ ቁልፍ ያላቸውን ሚና አብራራ።',
            '3. ሦስቱን የዳታቤዝ ደህንነት ህጎች (Entity, Referential, Domain) ዘርዝር።',
            '4. በSQL አዲስ መረጃ የሚያስገባ እና ነባር መረጃን የሚያሻሽል ትዕዛዝ ጻፍ።',
          ],
        },
        {
          unitNumber: 4,
          title: 'ምዕራፍ 4፡ የዌብ ሳይት አልሚነት (Web Development - ገጽ 85–114)',
          summary: 'የድረ-ገጽ አሰራር መሰረቶች፣ Client-Server ግንኙነት፣ የHTML5 ሰነድ መዋቅር፣ ጽሑፍ ማስተካከያ፣ ሊንኮች፣ ምስሎች፣ ሰንጠረዦች፣ ቅጾች (Forms) እና የCSS ቅጥ አሰጣጥ መሰረቶች።',
          sections: [
            {
              title: '4.1 የድረ-ገጽ መሰረቶች እና የHTML5 መዋቅር',
              content: [
                'ድረ-ገጽ የሚሰራው በClient-Server ሞዴል ነው፡ ብሮውዘር በHTTP/HTTPS ፕሮቶኮል ሰነዶችን ከሰርቨር ይጠይቃል።',
                'DNS (Domain Name System) የሰዎችን የድረ-ገጽ ስም ወደ ኮምፒውተር IP አድራሻ ይተረጉማል።',
                'HTML የድረ-ገጾች መዋቅር አጽም ሲሆን በታጎች (Tags) አማካኝነት ይዘጋጃል፡ <!DOCTYPE html>፣ <html>፣ <head>፣ <body>።',
                'የርዕስ ታጎች ከ<h1> እስከ <h6> ሲሆኑ አንቀጾች በ<p> ታግ ውስጥ ይቀመጣሉ።',
              ],
              keyTerms: [
                { term: 'HTML', definition: 'የድረ-ገጾችን ይዘትና መዋቅር ለመገንባት የሚያገለግል የማርክአፕ ቋንቋ።' },
                { term: 'DNS', definition: 'የድረ-ገጽ አድራሻዎችን ወደ ቁጥር አይፒ አድራሻ የሚቀይር ስርዓት።' },
              ],
              exercises: ['1. የድረ-ገጽ ብሮውዘር ስራ ምንድን ነው?', '2. ትክክለኛ የHTML5 መሰረታዊ አጽም ኮድ ጻፍ።'],
            },
            {
              title: '4.2 ሊንኮች፣ ዝርዝሮች፣ ሰንጠረዦች እና ቅጾች (Forms)',
              content: [
                'ሊንኮች በ<a> ታግ አማካኝነት <a href="ዩአርኤል">ሊንክ</a> በሚል ይዘጋጃሉ።',
                'ምስሎች በ<img src="ስም.jpg" alt="መግለጫ"> ታግ ወደ ድረ-ገጽ ይገባሉ።',
                'የተጠቃሚ መረጃዎችን ለመቀበል የ<form> አካል ጥቅም ላይ ይውላል፤ <input type="text">፣ <input type="password"> እና Submit አዝራርን ያካትታል።',
              ],
              keyTerms: [
                { term: 'ሃይፐርሊንክ (Hyperlink)', definition: 'ተጠቃሚውን ከአንድ ድረ-ገጽ ወደ ሌላ ገጽ የሚያገናኝ ማያያዣ።' },
                { term: 'ፎርም (Form)', definition: 'የተጠቃሚን መረጃ ተቀብሎ ወደ ሰርቨር የሚልክ የHTML አካል።' },
              ],
              exercises: ['1. የተማሪ ምዝገባ ቅጽ የሚሰራ የHTML ኮድ ጻፍ።', '2. በGET እና በPOST ዘዴዎች መካከል ያለው ልዩነት ምንድን ነው?'],
            },
            {
              title: '4.3 የCSS (Cascading Style Sheets) ማስተዋወቂያ',
              content: [
                'CSS የHTML ሰነዶችን ውበት፣ ቀለም፣ ቅርጸ-ቁምፊ እና አቀማመጥ ለመቆጣጠር ያገለግላል።',
                'CSS በሦስት መንገድ ይሰራል፡ Inline (በመስመር ላይ)፣ Internal (በሰነዱ ራስጌ ላይ) እና External (በተለየ የ.css ፋይል)።',
                'የቦክስ ሞዴል (Box Model) አራት ክፍሎች አሉት፡ Content (ይዘት)፣ Padding (የውስጥ ክፍተት)፣ Border (ድንበር) እና Margin (የውጭ ክፍተት)።',
              ],
              keyTerms: [
                { term: 'CSS', definition: 'የድረ-ገጽ ገጾችን ውበት እና ዲዛይን ለመወሰን የሚያገለግል የስታይል ቋንቋ።' },
                { term: 'Box Model', definition: 'በአንድ ኤለመንት ዙሪያ ያሉ ክፍተቶችን (Margin, Border, Padding) የሚወስን ሞዴል።' },
              ],
              exercises: ['1. አራቱን የCSS Box Model ክፍሎች ግለጽ።', '2. ለምን External CSS ይመረጣል?'],
            },
          ],
          unitReviewQuestions: [
            '1. አንድ ድረ-ገጽ ሲከፈት በClient እና Server መካከል ያለውን ሂደት አብራራ።',
            '2. የተማሪዎችን ስም፣ ጾታ እና ክፍል የሚቀበል የHTML ፎርም ኮድ ጻፍ።',
            '3. Inline፣ Internal እና External CSSን አወዳድር።',
            '4. የCSS Box Model በድረ-ገጽ ዲዛይን ላይ ያለውን ጠቀሜታ አብራራ።',
          ],
        },
        {
          unitNumber: 5,
          title: 'ምዕራፍ 5፡ የሃርድዌር ብልሽት ፍተሻ እና ቅድመ-መከላከል ጥገና (ገጽ 115–138)',
          summary: 'የላብራቶሪ ደህንነት ጥንቃቄዎች፣ የኤሌክትሮስታቲክ ፈሳሽ (ESD) መከላከያ፣ ቅድመ-መከላከል የጥገና መርሃ-ግብሮች፣ 6ቱ የስርዓት ብልሽት ፍተሻ ደረጃዎች (Troubleshooting Steps)፣ የተለመዱ የኮምፒውተር ብልሽቶች (Beep Codes፣ RAM፣ Overheating፣ BSOD) እና የዲስክ ጥገና መሳሪያዎች።',
          sections: [
            {
              title: '5.1 የደህንነት ጥንቃቄዎች እና ቅድመ-መከላከል ጥገና',
              content: [
                'ኤሌክትሮስታቲክ ፈሳሽ (ESD)፡ በማይክሮቺፖች እና በማስታወሻ ካርዶች (RAM) ላይ ዘላቂ ጉዳት የሚያደርስ የማይንቀሳቀስ የኤሌክትሪክ ፍሰት ነው።',
                'ቴክኒሻኖች ኮምፒውተር ሲጠግኑ የESD የእጅ አንጓ ማሰሪያ (Antistatic Wrist Strap) ማድረግ እና የኤሌክትሪክ ገመድ መንቀል አለባቸው።',
                'የኮምፒውተር የሃይል ማከፋፈያ ሳጥን (Power Supply Unit - PSU) ውስጥ ከፍተኛ ቮልቴጅ ስላለ በጭራሽ መከፈት የለበትም።',
                'ቅድመ-መከላከል ጥገና አቧራን ማጽዳት፣ የአየር ማራገቢያዎችን መፈተሽ እና ኬብሎችን ማደራጀትን ያካትታል።',
              ],
              keyTerms: [
                { term: 'ESD', definition: 'የኮምፒውተር ስስ ቺፖችን የሚያቃጥል የማይታይ የኤሌክትሮስታቲክ ፍሰት።' },
                { term: 'ቅድመ-መከላከል ጥገና', definition: 'ብልሽት እንዳይከሰት አስቀድሞ የሚደረግ መደበኛ የጽዳት እና ፍተሻ ስራ።' },
              ],
              exercises: ['1. የESD አደጋን እንዴት መከላከል ይቻላል?', '2. የሃይል ማከፋፈያ (PSU) ለምን መከፈት የለበትም?'],
            },
            {
              title: '5.2 ስልታዊ የብልሽት ፍተሻ ዘዴ (6 Troubleshooting Steps)',
              content: [
                'ደረጃ 1፡ ችግሩን መለየት (ከተጠቃሚው መጠየቅ እና ምልክቶችን ማየት)።',
                'ደረጃ 2፡ ሊከሰት የሚችል መላ ምት ማመንጨት (ቀላሉን ምክንያት አስቀድሞ መፈተሽ)።',
                'ደረጃ 3፡ መላ ምቱን በተግባር መሞከር እና ትክክለኛውን ምክንያት ማረጋገጥ።',
                'ደረጃ 4፡ የእርምጃ እቅድ ማውጣት እና መፍትሄውን መተግበር።',
                'ደረጃ 5፡ ስርዓቱ ሙሉ በሙሉ መስራቱን ማረጋገጥ እና መከላከያ መተግበር።',
                'ደረጃ 6፡ የተገኙ ግኝቶችን፣ የተወሰዱ እርምጃዎችን እና ውጤቶችን በሰነድ መመዝገብ።',
              ],
              keyTerms: [
                { term: 'ትረብልሹቲንግ (Troubleshooting)', definition: 'የኮምፒውተር ብልሽትን በስልት የመመርመር እና የመፍታት ሂደት።' },
                { term: 'POST (Power-On Self-Test)', definition: 'ኮምፒውተር ሲበራ ሃርድዌሮች መስራታቸውን የሚያረጋግጥ የBIOS የመጀመሪያ ፍተሻ።' },
              ],
              workedExamples: [
                {
                  question: 'ምሳሌ፡ ኮምፒውተር ሲበራ ማራገቢያው ይሽከረከራል፤ ስክሪኑ ጥቁር ሆኖ የጩኸት ድምጽ (Beep code) ያሰማል። መፍትሄው ምንድን ነው?',
                  solution: 'ምልክቱ የRAM ማስታወሻ መላላት ወይም መቆሸሽን ያሳያል። የኮምፒውተሩን ሃይል ማጥፋት፣ የESD ማሰሪያ ማድረግ፣ የRAM ቺፖችን አውጥቶ ማጽዳት እና መልሶ በትክክል ማስቀመጥ።',
                },
              ],
              exercises: ['1. ስድስቱን የትረብልሹቲንግ ደረጃዎች በቅደም ተከተል ዘርዝር።', '2. ተደጋጋሚ የBeep ድምጽ ምንን ያመለክታል?'],
            },
            {
              title: '5.3 የተለመዱ የሃርድዌር ብልሽቶች እና የዲስክ መሳሪያዎች',
              content: [
                'ከመጠን በላይ ማሞቅ (Overheating)፡ ኮምፒውተር ድንገት እንዲጠፋ ያደርጋል፤ ምክንያቱ የደረቀ የሙቀት ማስተላለፊያ ቅባት (Thermal Paste) ወይም የአቧራ መከማቸት ነው።',
                'የዲስክ ማጽጃ (Disk Cleanup) ጊዜያዊ ፋይሎችን ሲያጠፋ፣ Defragmentation በሃርድ ዲስክ ላይ የተበታተኑ ፋይሎችን በማስተካከል ፍጥነትን ይጨምራል።',
              ],
              keyTerms: [
                { term: 'BSOD (Blue Screen of Death)', definition: 'በዊንዶውስ ውስጥ በሃርድዌር ወይም በድራይቨር ችግር ምክንያት የሚመጣ ወሳኝ የስርዓት መቆም ስህተት።' },
                { term: 'Defragmentation', definition: 'የሃርድ ዲስክ ፋይሎችን በተከታታይ ቦታ በማስቀመጥ ፍጥነትን የማሳደግ ተግባር።' },
              ],
              exercises: ['1. ፕሮሰሰር ሲሞቅ የሚታዩ ምልክቶች ምንድን ናቸው?', '2. Disk Cleanup መቼ ጥቅም ላይ ይውላል?'],
            },
          ],
          unitReviewQuestions: [
            '1. ቴክኒሻን የኮምፒውተር ማዘርቦርድ ሲነካ የESD ማሰሪያ ለምን ያስፈልገዋል?',
            '2. 6ቱን የስርዓት ብልሽት መፍቻ ደረጃዎች ዘርዝር።',
            '3. የPOST ምርመራ እና የBeep ኮዶች ጥቅም ምንድን ነው?',
            '4. የኮምፒውተር ሃይል ሰጪ (Power Supply) ማነስ ወይም መበላሸት ምልክቶች ምን ምን ናቸው?',
          ],
        },
        {
          unitNumber: 6,
          title: 'ምዕራፍ 6፡ የፕሮግራሚንግ መሰረቶች (Fundamentals of Programming - ገጽ 139–168)',
          summary: 'አልጎሪዝም ዲዛይን፣ የፍሎውቻርት ምልክቶች፣ የቋንቋ ተርጓሚዎች (Compilers vs Interpreters)፣ የፓይዘን አገባብ (Syntax)፣ ተለዋዋጮች (Variables)፣ የዳታ አይነቶች፣ የውሳኔ አወቃቀሮች (if፣ elif፣ else)፣ ድግግሞሾች (Loops) እና ፈንክሽኖች።',
          sections: [
            {
              title: '6.1 አልጎሪዝም፣ ፍሎውቻርት እና ተርጓሚዎች',
              content: [
                'አልጎሪዝም (Algorithm)፡ አንድን ችግር ለመፍታት በቅደም ተከተል የተቀመጠ ግልጽ እና ውሱን መመሪያ ነው።',
                'ፍሎውቻርት (Flowchart)፡ አልጎሪዝምን በስዕላዊ ምልክቶች የሚያሳይ ዲያግራም ነው (ኦቫል ለመነሻ/መድረሻ፣ ሬክታንግል ለሂደት፣ ዳይመንድ ለውሳኔ)።',
                'ተርጓሚዎች (Translators)፡ ከፍተኛ የፕሮግራሚንግ ቋንቋን ወደ ማሽን ቋንቋ (0 እና 1) ይቀይራሉ፤ ኮምፓይለር ሙሉ ኮዱን በአንድ ጊዜ ሲተረጉም፣ ኢንተርፕሪተር በመስመር በመስመር ይተረጉማል።',
                'ፓይዘን ኢንተርፕሪትድ፣ ከፍተኛ እና ቀላል አገባብ ያለው የፕሮግራሚንግ ቋንቋ ነው።',
              ],
              keyTerms: [
                { term: 'አልጎሪዝም', definition: 'አንድን ተግባር ለማከናወን የተቀመጡ ተከታታይ እና ውሱን የስራ ቅደም-ተከተሎች።' },
                { term: 'ፍሎውቻርት', definition: 'የአልጎሪዝምን ፍሰት በስዕላዊ ምልክቶች የሚያሳይ ገላጭ ካርታ።' },
                { term: 'ኢንተርፕሪተር', definition: 'የኮምፒውተር ኮድን በመስመር በመስመር እየተረጎመ የሚያስኬድ ሶፍትዌር።' },
              ],
              workedExamples: [
                {
                  question: 'ምሳሌ፡ ተማሪ ማለፉን (ውጤት >= 50) ወይም መውደቁን የሚፈትሽ አልጎሪዝም በሱዶኮድ ጻፍ።',
                  solution: '1. ጀምር\n2. ውጤት ተቀበል\n3. ውጤት >= 50 ከሆነ "አልፏል" አሳይ፣ አለበለዚያ "ወድቋል" አሳይ\n4. ጨርስ',
                },
              ],
              exercises: ['1. 4ቱን መሰረታዊ የፍሎውቻርት ምልክቶች ሳልና ትርጉማቸውን ጻፍ።', '2. በኮምፓይለር እና በኢንተርፕሪተር መካከል ያለውን ልዩነት አብራራ።'],
            },
            {
              title: '6.2 የፓይዘን ተለዋዋጮች፣ የዳታ አይነቶች እና ኦፕሬተሮች',
              content: [
                'ተለዋዋጭ (Variable)፡ ዳታን በኮምፒውተር ሚሞሪ ውስጥ ይዞ የሚያስቀምጥ የተሰየመ ቦታ ነው።',
                'መሰረታዊ የዳታ አይነቶች፡ int (ሙሉ ቁጥር)፣ float (ነጥብ ያለው ቁጥር)፣ str (ጽሑፍ) እና bool (True/False) ናቸው።',
                'የinput() ፈንክሽን ከተጠቃሚ ዳታን እንደ ጽሁፍ (str) ስለሚቀበል ለሂሳብ ስሌት በint() ወይም በfloat() መቀየር አለበት።',
                'የሂሳብ ኦፕሬተሮች፡ መደመር (+), መቀነስ (-), ማባዛት (*), ማካፈል (/), የሙሉ ቁጥር ማካፈል (//) እና ቀሪ ማውጫ (%) ናቸው።',
              ],
              keyTerms: [
                { term: 'ተለዋዋጭ (Variable)', definition: 'በፕሮግራም እንቅስቃሴ ወቅት የሚቀያየር እሴት የሚቀመጥበት የሚሞሪ ስም።' },
                { term: 'ታይፕ ካስቲንግ', definition: 'አንድን የዳታ አይነት ወደ ሌላ የዳታ አይነት የመቀየር ሂደት (ለምሳሌ፡ int("50"))።' },
              ],
              exercises: ['1. age = input("እድሜዎን ያስገቡ: ") ለምን int() ያስፈልገዋል?', '2. የ19 // 4 እና 19 % 4 ውጤት ምን ይሆናል?'],
            },
            {
              title: '6.3 የቁጥጥር አወቃቀሮች፡ ውሳኔዎች (if-else)፣ ድግግሞሾች እና ፈንክሽኖች',
              content: [
                'ፓይዘን የኮድ ክፍሎችን ለመለየት በመስመር መጀመሪያ ላይ የሚተው ክፍተትን (Indentation - 4 ስፔስ) በግዴታነት ይጠቀማል።',
                'የውሳኔ አወቃቀሮች፡ if ሁኔታ:, elif ሁኔታ:, else: ውስብስብ ውሳኔዎችን ለመወሰን ያገለግላሉ።',
                'የwhile ሉፕ ሁኔታው እውነት እስከሆነ ድረስ ሲደጋገም፣ የfor ሉፕ በrange() አማካኝነት በተወሰነ ቁጥር ድግግሞሽን ይሰራል',
                'ፈንክሽኖች (Functions) ተደጋጋሚ ስራዎችን ለመስራት በdef ቁልፍ ቃል ይዘጋጃሉ፤ ግብአት ተቀብለው በreturn መልስ ይሰጣሉ።',
              ],
              keyTerms: [
                { term: 'ኢንደንቴሽን (Indentation)', definition: 'በፓይዘን የኮድ ክፍሎችን ለመለየት በመስመሩ መጀመሪያ የሚተው የክፍተት መጠን።' },
                { term: 'ድግግሞሽ (Loop)', definition: 'አንድን የኮድ ክፍል ደጋግሞ ለማስኬድ የሚያስችል የፕሮግራም አወቃቀር።' },
                { term: 'ፈንክሽን (Function)', definition: 'የተወሰነ ስራን ለመስራት ተሰይሞ የተዘጋጀ እና ተደጋግሞ የሚጠራ የኮድ ስብስብ።' },
              ],
              workedExamples: [
                {
                  question: 'ምሳሌ፡ ከ1 እስከ 5 ያሉ ቁጥሮችን ስኩዌር (እጥፍ) የሚያወጣ የፓይዘን ኮድ በfor ሉፕ ጻፍ።',
                  solution: 'for i in range(1, 6):\n    print(f"{i} ስኩዌር = {i * i}")',
                },
              ],
              exercises: ['1. ከ2 እስከ 20 ያሉ ተከታታይ ሙሉ ቁጥሮችን የሚያወጣ የፓይዘን ስክሪፕት ጻፍ።', '2. የሦስት ቁጥሮችን አማካይ የሚያሰላ ፈንክሽን ስራ።'],
            },
          ],
          unitReviewQuestions: [
            '1. የአንድ ጥሩ አልጎሪዝም መገለጫዎችን (ውሱንነት፣ ግልጽነት፣ ግብአት፣ ውጤት) አስረዳ።',
            '2. በፓይዘን ውስጥ ኢንደንቴሽን ያልተስተካከለ ከሆነ ምን አይነት ስህተት ይፈጠራል?',
            '3. የተማሪ ውጤትን ተቀብሎ ከ85 በላይ ከሆነ "በጣም ከፍተኛ"፣ ከ50 በላይ ከሆነ "አልፏል"፣ አለበለዚያ "ወድቋል" የሚል ፕሮግራም በif-elif-else ጻፍ።',
            '4. በwhile ሉፕ በመጠቀም ከ1 እስከ 100 ያሉ ቁጥሮች ድምርን የሚያሰላ ኮድ ጻፍ።',
          ],
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
  amharic: {
    9: {
      subjectId: 'amharic',
      grade: 9,
      title: 'የአማርኛ ቋንቋ እና ስነ-ጽሑፍ የተማሪ መጽሐፍ - 9ኛ ክፍል',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 9,
      description: 'የ9ኛ ክፍል ሙሉ የአማርኛ ቋንቋና ስነ-ጽሑፍ መማሪያ መጽሐፍ - 9 ምዕራፎች፡ ቋንቋ፣ ግብር፣ ማዕድን ማውጣት፣ ልቦለድ፣ ቃላዊ ስነፅሑፍ፣ ግጥም፣ ኮቪድ-19፣ ተውኔት፣ ማህበራዊ መገናኛ ብዙኃን እና ተግባቦት።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ ቋንቋ (Language) - ገጽ 1-20',
          summary: 'የቋንቋ ምንነት፣ ሰብዓዊነት፣ ዘፈቀዳዊነት፣ ሥርዓታዊነት፣ ረቂቅነትና ምሉዕነት፤ ነጠላና ውስብስብ ዓረፍተ ነገሮች፣ የዓረፍተ ነገር ስልቶች (ሐተታዊ፣ መጠይቃዊ፣ ትዕዛዛዊ)።',
          sections: [
            {
              title: '1.1 የቋንቋ ምንነት እና መሠረታዊ ባህርያት',
              content: [
                'ቋንቋ የሰው ልጆች በስርዓት የተሰደሩ ድምጾችን በመጠቀም መልዕክት የሚለዋወጡበት ሰብዓዊ መሳሪያ ነው።',
                'መሠረታዊ ባህርያቱ፡ ሰብዓዊነት፣ ዘፈቀዳዊነት (በድምጽና በሚወክለው አካል መካከል የተፈጥሮ አስገዳጅ ግንኙነት አለመኖር)፣ ሥርዓታዊነት፣ ረቂቅነት እና ምሉዕነት ናቸው።',
              ],
              keyTerms: [
                { term: 'ዘፈቀዳዊነት', definition: 'በቃላት እና በሚወክሉት ነገር መካከል ተፈጥሯዊ አስገዳጅ ቁርኝት አለመኖር።' },
                { term: 'ምሉዕነት', definition: 'ማንኛውም ቋንቋ የተናጋሪውን ማህበረሰብ ባህል ሙሉ በሙሉ የመግለጽ አቅም ያለው መሆኑ።' },
              ],
              workedExamples: [
                {
                  question: 'ጥያቄ፡ "ውሻ" የሚለው ቃል ለምን ውሻ ተባለ ለሚለው ተፈጥሯዊ አስገዳጅ ምክንያት አለ?',
                  solution: 'ምንም አይነት የተፈጥሮ አስገዳጅ ምክንያት የለም፤ በማህበረሰቡ ስምምነት የተሰየመ የዘፈቀደ ስያሜ ነው።',
                },
              ],
              exercises: ['1. አምስቱን የቋንቋ መሠረታዊ ባህርያት ዘርዝሩ።', '2. ቋንቋ ሰብዓዊ ነው ሲባል ምን ማለት ነው?'],
            },
            {
              title: '1.2 የዓረፍተ ነገር ዓይነቶች እና ስልቶች',
              content: [
                'ነጠላ ዓረፍተ ነገር አንድ ግስ ብቻ የያዘ ሲሆን፣ ውስብስብ ዓረፍተ ነገር ከአንድ በላይ ግሶችን ወይም ጥገኛ ሀረጎችን ያካትታል።',
                'ስልቶች፡ ሐተታዊ (አወንታዊና አሉታዊ)፣ መጠይቃዊ (ለማወቅ ወይም ለማረጋገጥ) እና ትዕዛዛዊ (ቀጥተኛና ኢቀጥተኛ) ናቸው።',
              ],
              keyTerms: [
                { term: 'ነጠላ ዓረፍተ ነገር', definition: 'አንድ ማሰሪያ ግስ ብቻ የያዘ ዓረፍተ ነገር።' },
                { term: 'ውስብስብ ዓረፍተ ነገር', definition: 'ከአንድ በላይ ግሶችን ወይም ጥገኛ ዓረፍተ ነገሮችን የያዘ።' },
              ],
              exercises: ['1. ሦስት ነጠላ እና ሦስት ውስብስብ ዓረፍተ ነገሮችን ጻፉ።'],
            },
          ],
          unitReviewQuestions: ['1. የቋንቋን ምንነትና ተግባራት አብራሩ።', '2. የዓረፍተ ነገር ዓይነቶችን በምሳሌ አስረዱ።'],
        },
        {
          unitNumber: 2,
          title: 'ምዕራፍ 2፡ ግብር (Taxation) - ገጽ 21-40',
          summary: 'የግብር ታሪክና ፋይዳ፣ ቀጥተኛና ቀጥታ ያልሆኑ ግብሮች፣ የግብር ከፋይ ደረጃዎች (ደረጃ ሀ፣ ለ፣ ሐ)፣ የግስ የጊዜ ዓይነቶች (የአሁን፣ የዋህ፣ የቅርብና የሩቅ ሃላፊ፣ የትንቢት ጊዜ)።',
          sections: [
            {
              title: '2.1 ግብር እና ዓይነቶቹ',
              content: [
                'ግብር መንግስት የልማትና የማህበራዊ አገልግሎቶችን ለማከናወን ከዜጎች የሚሰበስበው ህጋዊና አስገዳጅ መዋጮ ነው።',
                'ቀጥተኛ ግብር (የደመወዝ፣ የንግድ ትርፍ፣ የቤት ኪራይ) እና ቀጥታ ያልሆነ ግብር (ኤክሳይዝ፣ ተርን ኦቨር፣ ተጨማሪ እሴት ታክስ/VAT) ናቸው።',
                'ደረጃ "ሀ" ዓመታዊ ገቢያቸው 500,000 ብር እና ከዚያ በላይ የሆኑ ግብር ከፋዮች ናቸው።',
              ],
              keyTerms: [
                { term: 'ቀጥተኛ ግብር', definition: 'ከገቢው ባለቤት በቀጥታ የሚከፈል ግብር።' },
                { term: 'ተጨማሪ እሴት ታክስ (VAT)', definition: 'በምርትና አገልግሎት እሴት ላይ የሚጣል ቀጥታ ያልሆነ ታክስ።' },
              ],
              exercises: ['1. የደረጃ "ሀ"፣ "ለ" እና "ሐ" ግብር ከፋዮችን የገቢ መጠን ግለጹ።'],
            },
            {
              title: '2.2 የግስ የጊዜ ዓይነቶች (Tenses)',
              content: [
                'የአሁን ጊዜ ("እየ-" እና "ነው")፣ የዋህ ሃላፊ (ጊዜ ያልተወሰነ ድርጊት)፣ የቅርብ ሃላፊ ("-ኣል" ረዳት ግስ)፣ የሩቅ ሃላፊ ("ነበር") እና የትንቢት ጊዜ (ወደፊት የሚፈጸም) ናቸው።',
              ],
              keyTerms: [
                { term: 'የቅርብ ሃላፊ', definition: 'በቅርብ ጊዜ የተፈጸመ ድርጊትን የሚያሳይ የግስ ቅርጽ (ምሳሌ፡ ወስዷል)።' },
              ],
              exercises: ['1. "ተማሪው መጽሐፍ ያነባል" የሚለውን ወደ አሁንና ወደ ቅርብ ሃላፊ ጊዜ ለውጡ።'],
            },
          ],
          unitReviewQuestions: ['1. የግብርን ጠቀሜታ ዘርዝሩ።', '2. አምስቱን የግስ የጊዜ ዓይነቶች በምሳሌ አብራሩ።'],
        },
        {
          unitNumber: 3,
          title: 'ምዕራፍ 3፡ ማዕድን ማውጣት (Mining) - ገጽ 41-56',
          summary: 'የኢትዮጵያ ማዕድናት (ወርቅ፣ ኦፓል፣ ኢመራልድ፣ ታንታለም፣ ሳፋየር፣ የድንጋይ ከሰል)፤ 13ቱ የአማርኛ ሥርዓተ ነጥቦች እና አጠቃቀማቸው።',
          sections: [
            {
              title: '3.1 የኢትዮጵያ የከበሩና የኢንዱስትሪ ማዕድናት',
              content: [
                'ወርቅ (በኦሮሚያ፣ ትግራይ፣ ጋምቤላ)፣ ኦፓል (በደቡብ ወሎ ወገል ጤና)፣ ኢመራልድ (በጉጂ ዞን ሰባቦሩ)፣ ታንታለም (ለኤሌክትሮኒክስና ስልኮች) እና የድንጋይ ከሰል (ለሃይልና ለሲሚንቶ) ይገኛሉ።',
              ],
              keyTerms: [
                { term: 'ኦፓል', definition: 'ብርሃን አንጸባራቂ የከበረ ድንጋይ፤ በደቡብ ወሎ ወገል ጤና በስፋት የሚገኝ።' },
                { term: 'ታንታለም', definition: 'ለሞባይልና ለኮምፒውተር ኢንዱስትሪ ወሳኝ የሆነ ሰማያዊ ግራጫ ብረት።' },
              ],
              exercises: ['1. ታንታለም ለምን አገልግሎት ይውላል?', '2. በኢትዮጵያ ኦፓል የት አካባቢ በስፋት ተገኘ?'],
            },
            {
              title: '3.2 13ቱ የአማርኛ ሥርዓተ ነጥቦች',
              content: [
                'አንድ ነጥብ (.)፣ ሁለት ነጥብ (፡)፣ ሦስት ነጥብ (...)፣ ሁለት ነጥብ ከሰረዝ (፡-)፣ አራት ነጥብ (፡፡)፣ የጥያቄ ምልክት (?)፣ ትዕምርተ-አንክሮ (!)፣ ትዕምርተ-ጥቅስ (" ")፣ ነጠላ ትዕምርተ-ጥቅስ (‹ ›)፣ ሙሉ ሰረዝ (–)፣ ነጠላ ሰረዝ (፣)፣ ድርብ ሰረዝ (፤) እና ቅንፍ ( ) ናቸው።',
              ],
              keyTerms: [
                { term: 'ድርብ ሰረዝ (፤)', definition: 'ሁለት ተዛማጅ ሙሉ ሀሳቦችን ለማገናኘት የሚያገለግል ሥርዓተ ነጥብ።' },
                { term: 'ቅንፍ ( )', definition: 'በዓረፍተ ነገር ውስጥ ተጨማሪ ማብራሪያ ለመስጠት የሚያገለግል ምልክት።' },
              ],
              exercises: ['1. የቅንፍና የድርብ ሰረዝን ልዩነት በምሳሌ አስረዱ።'],
            },
          ],
          unitReviewQuestions: ['1. ሦስት ማዕድናትንና መገኛቸውን ጥቀሱ።', '2. የአማርኛ ሥርዓተ ነጥቦችን ተግባር ግለጹ።'],
        },
        {
          unitNumber: 4,
          title: 'ምዕራፍ 4፡ ልቦለድ (Fiction) - ገጽ 57-72',
          summary: 'የአጭር ልቦለድ መለያ ባህርያት (ነጠላ ውጤት፣ ጥድፊያ፣ ቁጥብነት)፤ ሰባቱ የልቦለድ አላባውያን (ታሪክ፣ ገጸባህሪያት፣ መቼት፣ ግጭት፣ ትልም፣ ጭብጥ፣ አንጻር)፤ አምስቱ የሀረግ ዓይነቶች።',
          sections: [
            {
              title: '4.1 የአጭር ልቦለድ ባህርያትና አላባውያን',
              content: [
                'ባህርያት፡ ነጠላ ውጤት (Single Effect)፣ ጥድፊያ (Compression) እና ቁጥብነት (Economy) ናቸው።',
                'ሰባቱ አላባውያን፡ ታሪክ፣ ገጸባህሪያት፣ መቼት (ቦታና ጊዜ)፣ ግጭት፣ ትልም/ሴራ (የምክንያትና ውጤት ቅደም ተከተል)፣ ጭብጥ (ማዕከላዊ ቁምነገር) እና አንጻር ናቸው።',
              ],
              keyTerms: [
                { term: 'ነጠላ ውጤት', definition: 'ሁሉም የልቦለዱ አላባውያን ወደ አንድ የትኩረት ማዕከል የሚፈሱበት ባህሪ።' },
                { term: 'ትልም (Plot)', definition: 'በምክንያትና ውጤት የተሰናሰሉ ድርጊቶች ቅደም ተከተል።' },
              ],
              exercises: ['1. የአጭር ልቦለድ ሦስቱን ባህርያት ዘርዝሩ።', '2. ትልም እና ታሪክ ያላቸውን ልዩነት አብራሩ።'],
            },
            {
              title: '4.2 አምስቱ የሀረግ ዓይነቶች (Phrase Types)',
              content: [
                'ስማዊ ሀረግ (መሪው ስም የሆነ)፣ ግሳዊ ሀረግ (መሪው ግስ የሆነ)፣ ቅጽላዊ ሀረግ (መሪው ቅጽል የሆነ)፣ ተውሳከ ግሳዊ ሀረግ (መሪው ተውሳከ ግስ የሆነ) እና መስተዋድዳዊ ሀረግ (መሪው መስተዋድድ የሆነ) ናቸው።',
              ],
              keyTerms: [
                { term: 'መስተዋድዳዊ ሀረግ', definition: 'መሪ ቃሉ መስተዋድድ የሆነ ሀረግ (ምሳሌ፡ "በመኪና")።' },
              ],
              exercises: ['1. ለእያንዳንዱ የሀረግ አይነት ሁለት ሁለት ምሳሌዎችን ጻፉ።'],
            },
          ],
          unitReviewQuestions: ['1. ሰባቱን የልቦለድ አላባውያን ዘርዝሩ።', '2. የሀረግ ዓይነቶችን በምሳሌ አስረዱ።'],
        },
        {
          unitNumber: 5,
          title: 'ምዕራፍ 5፡ ቃላዊ ስነፅሑፍ (Oral Literature) - ገጽ 73-87',
          summary: 'የስነቃል ጽንሰ-ሀሳብና 5ቱ ባህርያት (ቃላዊነት፣ ቡድናዊነት፣ ተከዋኝነት፣ ዕውዳዊነት፣ ተለዋዋጭነት)፤ እንቆቅልሽ፣ ተረት፣ ምሳሌያዊ ንግግሮችና ቃላዊ ግጥሞች።',
          sections: [
            {
              title: '5.1 የስነቃል ምንነትና አምስቱ መሠረታዊ ባህርያት',
              content: [
                'ስነቃል ከአንደበት ወደ ጆሮ በቃል የሚተላለፍ የህዝብ ባህላዊ ቅርስ ነው።',
                'ባህርያቱ፡ ቃላዊነት፣ ቡድናዊነት (የጋራ ሀብት፣ ደራሲው አይታወቅም)፣ ተከዋኝነት (በአካል በድምጽና በእንቅስቃሴ መቅረብ)፣ ዕውዳዊነት (ከማህበራዊ ሁነት ጋር መቆራኘት) እና ተለዋዋጭነት (በየጊዜው አዳዲስ ፈጠራዎች መታከል) ናቸው።',
              ],
              keyTerms: [
                { term: 'ስነቃል', definition: 'በመነገር፣ በመተረት ወይም በመዜም በቃል የሚተላለፍ የስነ-ጽሁፍ ዘርፍ።' },
                { term: 'ተከዋኝነት', definition: 'ስነቃል በተግባርና በድምጽ አከዋወን በቀጥታ ለተመልካች የሚቀርብ መሆኑ።' },
              ],
              exercises: ['1. የስነቃል ደራሲ ለምን አይታወቅም?', '2. አምስቱን የስነቃል ባህርያት አብራሩ።'],
            },
            {
              title: '5.2 እንቆቅልሽ እና ምሳሌያዊ ንግግሮች',
              content: [
                'እንቆቅልሽ የአእምሮ ንቃትን የሚያዳብር የጥያቄና መልስ ጨዋታ ሲሆን፣ ምሳሌያዊ ንግግሮች ጥልቅ የህይወት ፍልስፍናን በአጭር ቋንቋ ያስተላልፋሉ።',
              ],
              keyTerms: [
                { term: 'እንቆቅልሽ', definition: 'የማስተዋልና የፈጣን አስተሳሰብ ቃላዊ ጨዋታ።' },
              ],
              exercises: ['1. ሦስት እንቆቅልሾችን ከመልሶቻቸው ጋር ጻፉ።'],
            },
          ],
          unitReviewQuestions: ['1. የስነቃል ባህርያትን አብራሩ።', '2. ምሳሌያዊ ንግግሮች ለማህበረሰብ የሚሰጡትን ጠቀሜታ ግለጹ።'],
        },
        {
          unitNumber: 6,
          title: 'ምዕራፍ 6፡ ግጥም (Poetry) - ገጽ 88-103',
          summary: 'የግጥም ምንነትና ባህርያት (ተጨባጭነት፣ እምቅነት፣ ቁጥብነት፣ ምናባዊነት፣ ሙዚቃዊነት)፤ የስንኝ ምጣኔ ቤቶች (ቡሄ በሉ፣ ሰንጎ መገን፣ የወል ቤት)፤ ዘይቤዎች (ሰውኛ፣ አነጻጻሪ፣ ተለዋጭ)።',
          sections: [
            {
              title: '6.1 የግጥም ባህርያትና የስንኝ ምጣኔ ስልቶች',
              content: [
                'ግጥም የደራሲውን ውስጣዊ ስሜትና ውበት በምስል ከሳች ቃላት አምቆ የሚገልጽ ጥበብ ነው።',
                'የስንኝ ምጣኔ ቤቶች፡ ቡሄ በሉ ቤት (በሀረግ ከ1 እስከ 4 ቀለማት)፣ ሰንጎ መገን ቤት (በሀረግ 5 ቀለማት) እና የወል ቤት (በሀረግ 6 ቀለማት) ናቸው።',
              ],
              keyTerms: [
                { term: 'ስንኝ', definition: 'የግጥም አንድ ነጠላ መስመር።' },
                { term: 'የወል ቤት', definition: 'በሀረግ ስድስት ቀለማት ያሉት የአማርኛ ግጥም ምጣኔ።' },
              ],
              exercises: ['1. የወል ቤት እና ቡሄ በሉ ቤት በምን ይለያያሉ?', '2. የግጥም አምስቱን ባህርያት ጥቀሱ።'],
            },
          ],
          unitReviewQuestions: ['1. የግጥም ምጣኔ ቤቶችን በምሳሌ አስረዱ።', '2. በግጥም ውስጥ ዘይቤያዊ አገላለጾች ምን ሚና አላቸው?'],
        },
        {
          unitNumber: 7,
          title: 'ምዕራፍ 7፡ ኮቪድ -19 (ኮሮና) - ገጽ 104-119',
          summary: 'የወረርሽኞች ታሪክ (የ1911 የህዳር በሽታ፣ ኳራንቲን፣ ትሬሲንግ)፤ የቃላት ንበት (ማጥበቅና ማላላት)፤ ቅጥያዎች (ቅድመ ዐምድ፣ ውስጠ ዐምድ፣ ድህረ ዐምድ)።',
          sections: [
            {
              title: '7.1 የወረርሽኞች ታሪክ እና መከላከያ ስልቶች',
              content: [
                'በኢትዮጵያ በ1911 ዓ.ም "የህዳር በሽታ" (የስፓኒሽ ፍሉ) እስከ 50 ሺህ ሰዎችን ገድሏል።',
                'ኳራንቲን (Quarantine - ለይቶ ማቆየት) እና ትሬሲንግ (Tracing - የተገናኙ ሰዎችን መፈለግ) ወረርሽኝን ለመግታት ያገለግላሉ።',
              ],
              keyTerms: [
                { term: 'ኳራንቲን', definition: 'ተላላፊ በሽታ ያለባቸውን ወይም የተጠረጠሩትን ለይቶ የማቆየትና የማከም ስልት።' },
              ],
              exercises: ['1. "ህዳር ሲታጠን" የሚለው ባህላዊ አሰራር እንዴት ተጀመረ?'],
            },
            {
              title: '7.2 ቅጥያዎች (Affixes) እና የቃላት ንበት',
              content: [
                'ቅድመ ዐምድ (ከቃሉ መጀመሪያ)፣ ውስጠ ዐምድ (በቃሉ መካከል ለምሳሌ፡ "ሰፋፊ"፣ "ነጫጭ") እና ድህረ ዐምድ (በቃሉ መጨረሻ) ቅጥያዎች ይባላሉ።',
                'የቃላት ንበት፡ ቃላት ጠብቀውና ላልተው ሲነበቡ ትርጉማቸው ይለወጣል (ምሳሌ፡ "አያት" ጠብቆ ሲነበብ የቤተሰብ አባል፣ ላልቶ ሲነበብ ተመለከታት)።',
              ],
              keyTerms: [
                { term: 'ውስጠ ዐምድ ቅጥያ', definition: 'በቃሉ ሆሄያት መካከል የሚገባ ጥገኛ ምዕላድ።' },
              ],
              exercises: ['1. ቅድመ፣ ውስጠ እና ድህረ ዐምድ ቅጥያዎችን በምሳሌ አሳዩ።'],
            },
          ],
          unitReviewQuestions: ['1. ሦስቱን የቅጥያ ዓይነቶች በምሳሌ አብራሩ።', '2. የቃላት ማጥበቅና ማላላት በፍች ላይ የሚያመጣውን ለውጥ አብራሩ።'],
        },
        {
          unitNumber: 8,
          title: 'ምዕራፍ 8፡ ተውኔት (Play/Drama) - ገጽ 120-145',
          summary: 'የተውኔት ምንነትና አላባውያን፤ የመድረክ ባለሙያዎች (ጸሐፌ ተውኔት፣ መራሄ ተውኔት፣ ተዋንያን)፤ የተውኔት ዓይነቶች (ኮሜዲ፣ ትራጄዲ፣ ትራጂ-ኮሜዲ)፤ "ዘለለኝ" ተውኔት ትንታኔ።',
          sections: [
            {
              title: '8.1 የተውኔት ምንነት፣ አላባውያን እና ዓይነቶች',
              content: [
                'ተውኔት በመድረክ ላይ በተዋንያን እንቅስቃሴና ቃለ ምልልስ ለተመልካች የሚቀርብ የስነ-ጽሁፍ ዘርፍ ነው።',
                'ዓይነቶች፡ ኮሜዲ (አስቂኝና መጨረሻው በደስታ የሚደመደም)፣ ትራጄዲ (አሳዛኝና በሞት/ውድቀት የሚጠናቀቅ) እና ትራጂ-ኮሜዲ (ቅይጥ) ናቸው።',
                '"ዘለለኝ" በተባለው ኮሜዲ ውስጥ ሌባው ራሱን "ወንዳፍራሽ" ብሎ ሲያታልል በመጨረሻ በፖሊስ እጅ ተይዟል።',
              ],
              keyTerms: [
                { term: 'መራሄ ተውኔት', definition: 'ተውኔቱ ለመድረክ እንዲበቃ ተዋንያንን የሚመራና የሚያሰለጥን ዳይሬክተር።' },
                { term: 'ኮሜዲ', definition: 'የሚያስቅና የሚያዝናና፣ መጨረሻው በደስታ የሚጠናቀቅ ተውኔት።' },
              ],
              exercises: ['1. የተውኔት ሦስቱን ዓይነቶች ግለጹ።', '2. "ዘለለኝ" ለምን አይነት ተውኔት ምሳሌ ይሆናል?'],
            },
          ],
          unitReviewQuestions: ['1. ተውኔት ከሌሎች የስነ-ጽሁፍ ዘርፎች በምን ይለያል?', '2. የመድረክ ባለሙያዎችን ተግባር ዘርዝሩ።'],
        },
        {
          unitNumber: 9,
          title: 'ምዕራፍ 9፡ ማህበራዊ መገናኛ ብዙኃን እና ተግባቦት - ገጽ 146-159',
          summary: 'መገናኛ ብዙኃን (የህትመት እና የኤሌክትሮኒክስ)፤ የጋዜጠኝነት ታሪክና ቃለ ምልልስ፤ ማስታወቂያ፤ ጥገኛ ሀረጎች እና የማነጻጸሪያ ሀረጎች ("እንደ...")።',
          sections: [
            {
              title: '9.1 መገናኛ ብዙኃን፣ ጋዜጠኝነት እና ማስታወቂያ',
              content: [
                'መገናኛ ብዙኃን በህትመት (ጋዜጣ፣ መጽሔት) እና ኤሌክትሮኒክስ (ሬዲዮ፣ ቴሌቪዥን፣ ኢንተርኔት፣ ማህበራዊ ሚዲያ) ይከፈላሉ።',
                'ዮሀን ጉተንበርግ በ1450ዎቹ ማተሚያ መሳሪያን ከፈለሰፈ በኋላ ዘመናዊ ጋዜጠኝነት ተስፋፍቷል።',
                'ቃለ ምልልስ መረጃን ለማግኘት የሚደረግ የታቀደ የጥያቄና መልስ ተግባቦት ነው።',
              ],
              keyTerms: [
                { term: 'መገናኛ ብዙኃን', definition: 'መረጃዎችን ለህብረተሰቡ በስፋት ለማድረስ የሚያስችሉ መሳሪያዎች።' },
                { term: 'ቃለ ምልልስ', definition: 'መረጃና ዕውቀትን ለመለዋወጥ የሚደረግ የታቀደ ውይይት።' },
              ],
              exercises: ['1. በህትመትና በኤሌክትሮኒክስ መገናኛ ብዙኃን መካከል ያለውን ልዩነት ጥቀሱ።'],
            },
            {
              title: '9.2 ጥገኛ ሀረጎች እና የማነጻጸሪያ ሀረጎች',
              content: [
                'ጥገኛ ሀረጎች በራሳቸው ሙሉ ሀሳብ የማይሰጡና ከዋናው ግስ ጋር ተጣምረው የሚሄዱ ናቸው።',
                'የማነጻጸሪያ ሀረጎች ሁለት ነገሮችን ለማወዳደር "እንደ-" የሚለውን መስተዋድድ በመጠቀም ይመሰረታሉ (ምሳሌ፡ "እንደአባቷ ታታሪ ነች")።',
              ],
              keyTerms: [
                { term: 'አነጻጻሪ ሀረግ', definition: 'ሁለት ነገሮችን በማነጻጸር መመሳሰልን ወይም ልዩነትን የሚያሳይ ሀረግ።' },
              ],
              exercises: ['1. ሦስት የማነጻጸሪያ ሀረጎችን በዓረፍተ ነገር ውስጥ ተጠቀሙባቸው።'],
            },
          ],
          unitReviewQuestions: ['1. መገናኛ ብዙኃን ለማህበረሰብ ያላቸውን ሚና አብራሩ።', '2. የማነጻጸሪያ ሀረጎችን ተግባር ግለጹ።'],
        },
      ],
    },
    10: {
      subjectId: 'amharic',
      grade: 10,
      title: 'የአማርኛ ቋንቋ እና ስነ-ጽሁፍ የተማሪ መጽሐፍ - ክፍል 10 (Grade 10 Amharic)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'የልቦለድ አላባውያን (ጭብጥ፣ ሴራ፣ ገፀ-ባህሪ፣ መቼት)፣ የተውኔት ጥበብ፣ የድርሰት አፃፃፍ ስልቶች እና የቋንቋ ዘይቤዎች።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ የልቦለድ አላባውያን እና የተውኔት ጥበብ (Fiction & Drama)',
          summary: 'የገፀ-ባህሪ አሳሳል፣ የግጭት አይነቶች፣ የመድረክ ተውኔት እና የስነ-ጽሁፍ ዘይቤዎች ጥናት።',
          sections: [
            {
              title: '1.1 የልቦለድ መሰረታዊ አላባውያን',
              content: [
                'ልቦለድ በደራሲው ምናብ ተፈጥሮ የሚቀርብ የስነ-ጽሁፍ ዘርፍ ሲሆን ሴራ፣ ገፀ-ባህሪ፣ መቼት፣ ጭብጥ እና ግጭትን ያካትታል።',
                'ተውኔት በመድረክ ላይ በተዋናዮች ድርጊት እና ንግግር አማካኝነት ለተመልካች የሚቀርብ ህያው ጥበብ ነው።',
              ],
            },
          ],
        },
      ],
    },
    11: {
      subjectId: 'amharic',
      grade: 11,
      title: 'የአማርኛ ቋንቋ እና ስነ-ጽሁፍ የተማሪ መጽሐፍ - ክፍል 11 (Grade 11 Amharic)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'የቅኔ እና የሰምና ወርቅ ጥበብ፣ የስነ-ግጥም ህጎች (ቤት፣ ምት፣ ስንኝ)፣ የጥልቅ ንግግር እና የምስጢር ፍቺ ስልቶች።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ የቅኔ እና የሰምና ወርቅ ጥበብ (Wax and Gold Poetics)',
          summary: 'ሰምና ወርቅ፣ ህብረ-ቃል፣ የቅኔ ቤቶች እና የኢትዮጵያ ስነ-ጽሁፋዊ ፍልስፍና።',
          sections: [
            {
              title: '1.1 የሰምና ወርቅ ጽንሰ-ሀሳብ',
              content: [
                'ሰምና ወርቅ የቋንቋን ባለሁለት ገጽታ ውበት የሚገልጽ የኢትዮጵያ አንጋፋ የስነ-ግጥምና የንግግር ጥበብ ነው።',
                'ሰም ላይ ላዩን የሚታየው ቀጥተኛ ትርጉም ሲሆን፣ ወርቁ ደግሞ ውስጠ-ወይራ የሆነው ጥልቅና የተሰወረው እውነተኛ ፍቺ ነው።',
                'ህብረ-ቃል ሁለቱንም ትርጉሞች የሚያገናኘው ቁልፍ ድልድይ ነው።',
              ],
            },
          ],
        },
      ],
    },
    12: {
      subjectId: 'amharic',
      grade: 12,
      title: 'የአማርኛ ቋንቋ እና ስነ-ጽሁፍ የተማሪ መጽሐፍ - ክፍል 12 (Grade 12 Amharic & Literature)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 5,
      description: 'የስነ-ጽሁፍ ሂስ (Literary Criticism)፣ የቋንቋ ጥናትና ምርምር ስልቶች፣ የአማርኛ ቋንቋ ታሪካዊ እድገት እና ለ ESSLCE ዝግጅት።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ የስነ-ጽሁፍ ሂስ እና የቋንቋ ምርምር (Literary Criticism & Research)',
          summary: 'የስነ-ጽሁፍ ንድፈ-ሀሳቦች፣ ስነ-ጽሁፍን በሂሳዊ አይን መመርመር እና የምርምር ጽሁፍ አዘገጃጀት።',
          sections: [
            {
              title: '1.1 የስነ-ጽሁፍ ሂስ መሰረታዊ መርሆዎች',
              content: [
                'የስነ-ጽሁፍ ሂስ የአንድን ስራ ጥንካሬ፣ ድክመት፣ ጭብጥ እና የኪነ-ጥበብ ደረጃ በጥልቀት የመመርመር ሂደት ነው።',
                'ተቺው የደራሲውን ማህበራዊ፣ ታሪካዊ እና ስነ-ልቦናዊ አውዶች ያገናዝባል።',
              ],
            },
          ],
        },
      ],
    },
  },
  economics: {
    9: {
      subjectId: 'economics',
      grade: 9,
      title: 'የኢኮኖሚክስ ትምህርት የተማሪ መጽሐፍ - ክፍል 9 (Grade 9 Economics Student Textbook)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 8,
      description: 'የክፍል 9 የኢኮኖሚክስ መማሪያ መጽሐፍ፡ የኢኮኖሚክስ መግቢያ፣ መሰረታዊ የኢኮኖሚ ችግሮች፣ ሀብቶችና ገበያዎች፣ ፍላጎትና አቅርቦት፣ ምርትና ወጪ፣ ገንዘብና ባንክ፣ ማክሮ-ኢኮኖሚክስ እና ስራ ፈጠራ።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ የኢኮኖሚክስ መግቢያ (Introducing Economics)',
          summary: 'ስለ ኢኮኖሚክስ ምንነት፣ የእጥረት (Scarcity) ባህሪ፣ ምርጫ እና የዕድል ወጪ (Opportunity Cost) እንዲሁም የማይክሮና ማክሮ ኢኮኖሚክስ ልዩነት ጥልቅ ማብራሪያ።',
          sections: [
            {
              title: '1.1 የኢኮኖሚክስ ምንነት እና ትርጉም (Meaning and Definition of Economics)',
              content: [
                'ኢኮኖሚክስ ማህበረሰቦች ውስን የሆኑ ሀብቶችን በመጠቀም ያልተገደቡ ፍላጎቶቻቸውን እንዴት እንደሚያሟሉ የሚያጠና ማህበራዊ ሳይንስ ነው።',
                'የሰው ልጅ ፍላጎት (Human Wants) ማለቂያ የሌለው ሲሆን፣ ፍላጎትን ለማርካት የሚያስፈልጉት ሀብቶች (Resources) ግን ውስን ናቸው። ይህ ልዩነት እጥረት (Scarcity) ይባላል።',
              ],
              keyTerms: [
                { term: 'እጥረት (Scarcity)', definition: 'ያልተገደበ የሰው ልጅ ፍላጎት እና ውስን የሆኑ ሀብቶች አለመመጣጠን።' },
                { term: 'ኢኮኖሚክስ (Economics)', definition: 'ስለ ሀብት አመራረት፣ ስርጭት እና ፍጆታ የሚያጠና ማህበራዊ ሳይንስ።' },
              ],
            },
            {
              title: '1.2 ምርጫ እና የዕድል ወጪ (Choice and Opportunity Cost)',
              content: [
                'ሀብት ውስን ስለሆነ ሁልጊዜ ምርጫ (Choice) ማድረግ ግዴታ ነው።',
                'የዕድል ወጪ (Opportunity Cost) ማለት አንድን አማራጭ ስንመርጥ የምንተወው ቀጣዩ ምርጥ አማራጭ ዋጋ ወይም ጥቅም ነው።',
              ],
              workedExamples: [
                {
                  question: 'ምሳሌ 1፡ አንድ ተማሪ ለፈተና ማጥናት ወይም ሲኒማ መሄድ ይችላል። ማጥናትን ከመረጠ የዕድል ወጪው ምንድን ነው?',
                  solution: 'የዕድል ወጪው ሲኒማ በመሄድ የሚያገኘው መዝናናትና እርካታ ነው።',
                },
              ],
            },
          ],
          unitReviewQuestions: [
            '1. ኢኮኖሚክስ ለምን ማህበራዊ ሳይንስ ተባለ?',
            '2. በእጥረት (Scarcity) እና በድህነት (Poverty) መካከል ያለው ልዩነት ምንድን ነው?',
          ],
        },
        {
          unitNumber: 2,
          title: 'ምዕራፍ 2፡ መሰረታዊ የኢኮኖሚ ችግሮች እና የኢኮኖሚ ስርዓቶች (The Basic Economic Problems & Economic Systems)',
          summary: 'ምን ይመረት? እንዴት ይመረት? ለማን ይመረት? ባህላዊ፣ ትእዛዛዊ፣ የገበያ እና ቅይጥ የኢኮኖሚ ስርዓቶች።',
          sections: [
            {
              title: '2.1 ሶስቱ መሰረታዊ የኢኮኖሚ ጥያቄዎች (Three Fundamental Economic Questions)',
              content: [
                '1. ምን አይነት ምርት እና ምን ያህል ይመረት? (What to produce?)',
                '2. እንዴት ይመረት? (How to produce? - ጉልበት ተኮር ወይስ ቴክኖሎጂ/ማሽን ተኮር)',
                '3. ለማን ይመረት? (For whom to produce? - የምርት ስርጭትና ክፍፍል)',
              ],
            },
            {
              title: '2.2 የኢኮኖሚ ስርዓቶች አይነቶች (Types of Economic Systems)',
              content: [
                'ባህላዊ የኢኮኖሚ ስርዓት (Traditional Economy)፡ በልማድና በባህል የሚመራ።',
                'ትዕዛዛዊ የኢኮኖሚ ስርዓት (Command Economy)፡ መንግስት ሁሉንም ሀብት የሚቆጣጠርበት።',
                'ነጻ የገበያ ስርዓት (Market Economy)፡ በዋጋ እና በግል ውድድር የሚመራ።',
                'ቅይጥ የኢኮኖሚ ስርዓት (Mixed Economy)፡ የግል ዘርፍና የመንግስት ሚና የተጣመረበት (እንደ ኢትዮጵያ ኢኮኖሚ)።',
              ],
            },
          ],
          unitReviewQuestions: [
            '1. አራቱን የኢኮኖሚ ስርዓቶች በባህሪያቸው አወዳድር።',
            '2. በኢትዮጵያ ያለው የኢኮኖሚ ስርዓት የትኛው ነው? አስረዳ።',
          ],
        },
        {
          unitNumber: 3,
          title: 'ምዕራፍ 3፡ የኢኮኖሚ ሀብቶች እና ገበያዎች (Economic Resources and Markets)',
          summary: 'አራቱ የምርት ግብአቶች (መሬት፣ ጉልበት፣ ካፒታል እና ስራ ፈጠራ)፣ ገበያ እና የዋጋ አወሳሰን።',
          sections: [
            {
              title: '3.1 የምርት ግብአቶች (Factors of Production)',
              content: [
                'መሬት (Land)፡ የተፈጥሮ ሀብቶች (ገቢው፡ ኪራይ/Rent)።',
                'ጉልበት (Labour)፡ የአእምሮና የአካል ጥረት (ገቢው፡ ደመወዝ/Wages)።',
                'ካፒታል (Capital)፡ ማሽኖች፣ ህንጻዎችና መሳሪያዎች (ገቢው፡ ወለድ/Interest)።',
                'ስራ ፈጠራ (Entrepreneurship)፡ አደጋን ተጋፍጦ ድርጅት መምራት (ገቢው፡ ትርፍ/Profit)።',
              ],
            },
            {
              title: '3.2 የገበያ ምንነት እና አወቃቀር (The Concept of Markets)',
              content: [
                'ገበያ ማለት ገዢዎችና ሻጮች ተገናኝተው የሸቀጥ ወይም አገልግሎት ልውውጥ የሚያደርጉበት ማንኛውም አሰራር ነው።',
              ],
            },
          ],
        },
        {
          unitNumber: 4,
          title: 'ምዕራፍ 4፡ የፍላጎት እና አቅርቦት መግቢያ (Introduction to Demand and Supply)',
          summary: 'የፍላጎት ህግ፣ የአቅርቦት ህግ፣ የገበያ ሚዛን (Market Equilibrium) እና የዋጋ መወሰን።',
          sections: [
            {
              title: '4.1 የፍላጎት ፅንሰ-ሀሳብ እና የፍላጎት ህግ (Law of Demand)',
              content: [
                'ፍላጎት (Demand) ማለት ሸማቾች በተወሰነ ዋጋና ጊዜ የመግዛት ፍላጎትና አቅም ሲኖራቸው ነው።',
                'የፍላጎት ህግ፡ የሸቀጡ ዋጋ ሲጨምር የሚፈለገው መጠን ይቀንሳል፤ ዋጋ ሲቀንስ ይጨምራል።',
              ],
            },
            {
              title: '4.2 የአቅርቦት ፅንሰ-ሀሳብ እና የአቅርቦት ህግ (Law of Supply)',
              content: [
                'አቅርቦት (Supply) አምራቾች በተወሰነ ዋጋ ወደ ገበያ ለማቅረብ ያላቸው ዝግጁነት ነው።',
                'የአቅርቦት ህግ፡ ዋጋ ሲጨምር የሚቀርበው ምርት መጠን ይጨምራል፤ ዋጋ ሲቀንስ ይቀንሳል።',
              ],
            },
            {
              title: '4.3 የገበያ ሚዛን (Market Equilibrium)',
              content: [
                'የገበያ ሚዛን ማለት የፍላጎት መጠን ከአቅርቦት መጠን ጋር እኩል የሚሆንበት ነጥብ ነው።',
              ],
            },
          ],
        },
        {
          unitNumber: 5,
          title: 'ምዕራፍ 5፡ የምርት እና ወጪ ፅንሰ-ሀሳብ (Introduction to Production and Cost)',
          summary: 'የምርት ሂደት፣ ቋሚ ወጪ፣ ተለዋዋጭ ወጪ እና ጠቅላላ ወጪ ትንተና።',
          sections: [
            {
              title: '5.1 የምርት ሂደት (Production Function)',
              content: [
                'ምርት ማለት ጥሬ እቃዎችን ወደ ተጠናቀቁ ሸቀጦች እና አገልግሎቶች የመቀየር ሂደት ነው።',
                'አጭር ጊዜ (Short run) እና ረጅም ጊዜ (Long run) የምርት ሁኔታዎች።',
              ],
            },
            {
              title: '5.2 የወጪ አይነቶች (Cost Concepts: FC, VC, TC)',
              content: [
                'ቋሚ ወጪ (Fixed Cost - FC)፡ ምርት ቢመረትም ባይመረትም የማይለወጥ ወጪ (ለምሳሌ የፋብሪካ ኪራይ)።',
                'ተለዋዋጭ ወጪ (Variable Cost - VC)፡ ከምርት መጠን ጋር አብሮ የሚጨምር ወይም የሚቀንስ ወጪ (ለምሳሌ የጥሬ እቃ ወጪ)።',
                'ጠቅላላ ወጪ (Total Cost - TC) = ቋሚ ወጪ (FC) + ተለዋዋጭ ወጪ (VC)።',
              ],
            },
          ],
        },
        {
          unitNumber: 6,
          title: 'ምዕራፍ 6፡ የገንዘብ እና የባንክ አገልግሎት (Introduction to Money and Banking)',
          summary: 'የሸቀጥ-በሸቀጥ ልውውጥ (Barter) ችግሮች፣ የገንዘብ ተግባራት እና በኢትዮጵያ የባንክ ስርዓት።',
          sections: [
            {
              title: '6.1 የገንዘብ አመጣጥ እና ተግባራት (Functions of Money)',
              content: [
                'የገንዘብ 4 ዋና ተግባራት፡ የመገበያያ ዋጋ መለኪያ (Medium of Exchange)፣ የዋጋ መለኪያ (Unit of Account)፣ የሀብት ማከማቻ (Store of Value) እና የዘገየ ክፍያ መስፈርት (Standard of Deferred Payment)።',
              ],
            },
            {
              title: '6.2 የባንክ ስርዓት በኢትዮጵያ (Banking in Ethiopia)',
              content: [
                'የኢትዮጵያ ብሔራዊ ባንክ (NBE)፡ ማዕከላዊ ባንክ ሲሆን የገንዘብ ፖሊሲ ያወጣል፣ የባንኮችን ስራ ይቆጣጠራል።',
                'የንግድ ባንኮች (Commercial Banks)፡ የተቀማጭ ገንዘብ መቀበል እና ብድር መስጠት።',
              ],
            },
          ],
        },
        {
          unitNumber: 7,
          title: 'ምዕራፍ 7፡ የማክሮ-ኢኮኖሚክስ መግቢያ (Introduction to Macroeconomics)',
          summary: 'ጠቅላላ የሀገር ውስጥ ምርት (GDP)፣ የዋጋ ግሽበት (Inflation)፣ የስራ አጥነት እና የኢኮኖሚ እድገት።',
          sections: [
            {
              title: '7.1 ጠቅላላ የሀገር ውስጥ ምርት (Gross Domestic Product - GDP)',
              content: [
                'GDP ማለት በአንድ ሀገር ውስጥ በአንድ አመት ውስጥ የተመረቱ የመጨረሻ እቃዎችና አገልግሎቶች የገበያ ዋጋ ድምር ነው።',
              ],
            },
            {
              title: '7.2 የዋጋ ግሽበት እና ስራ አጥነት (Inflation and Unemployment)',
              content: [
                'የዋጋ ግሽበት አጠቃላይ የዋጋ ደረጃ በተከታታይ መጨመር ነው።',
                'የስራ አጥነት አይነቶች፡ ጊዜያዊ (Frictional)፣ መዋቅራዊ (Structural) እና ወቅታዊ (Seasonal)።',
              ],
            },
          ],
        },
        {
          unitNumber: 8,
          title: 'ምዕራፍ 8፡ መሰረታዊ የስራ ፈጠራ ክህሎት (Basic Entrepreneurship)',
          summary: 'የስራ ፈጣሪነት ባህሪያት፣ የንግድ እቅድ ዝግጅት (Business Plan)፣ አደጋን መጋፈጥ እና አነስተኛ ኢንተርፕራይዞች።',
          sections: [
            {
              title: '8.1 የስራ ፈጣሪነት ምንነት (Nature of Entrepreneurship)',
              content: [
                'ስራ ፈጣሪ አዳዲስ ሀሳቦችን ወደ ተግባራዊ የንግድ ስራ በመቀየር ማህበረሰባዊ ችግሮችን የሚፈታና እሴት የሚፈጥር ሰው ነው።',
              ],
            },
            {
              title: '8.2 የንግድ እቅድ ዝግጅት (Business Plan)',
              content: [
                'የንግድ እቅድ የድርጅቱን ግብ፣ የገበያ ጥናት፣ የፋይናንስ እቅድ እና የአሰራር ስልት በዝርዝር የሚያሳይ ሰነድ ነው።',
              ],
            },
          ],
        },
      ],
    },
    11: {
      subjectId: 'economics',
      grade: 11,
      title: 'የኢኮኖሚክስ ትምህርት የተማሪ መጽሐፍ - ክፍል 11 (Grade 11 Economics Student Textbook)',
      curriculumBadge: 'የኢ.ፌ.ዲ.ሪ ትምህርት ሚኒስቴር አዲሱ ስርዓተ-ትምህርት',
      totalUnits: 6,
      description: 'የክፍል 11 የማክሮ-ኢኮኖሚክስ እና የላቀ ማይክሮ-ኢኮኖሚክስ ጽንሰ-ሀሳቦች፣ የሸማቾች ባህሪ፣ እና የገበያ መዋቅር።',
      units: [
        {
          unitNumber: 1,
          title: 'ምዕራፍ 1፡ የሸማቾች ባህሪ ንድፈ-ሀሳብ (Theory of Consumer Behaviour)',
          summary: 'የጠቃሚነት (Utility) ፅንሰ-ሀሳብ፣ ካርዲናል እና ኦርዲናል አቀራረቦች፣ የኢንዲፈረንስ ከርቭ ትንተና።',
          sections: [
            {
              title: '1.1 የጠቃሚነት ፅንሰ-ሀሳብ (The Concept of Utility)',
              content: [
                'ሸማቾች ሸቀጦችንና አገልግሎቶችን ሲጠቀሙ የሚያገኙት እርካታ ጠቃሚነት (Utility) ይባላል።',
                'የጠርዝ ጠቃሚነት መቀነስ ህግ (Law of Diminishing Marginal Utility)።',
              ],
            },
          ],
        },
      ],
    },
  },
};
