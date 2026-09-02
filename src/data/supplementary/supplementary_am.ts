import { SupplementaryBook } from '../../types';

export const supplementaryBooksAmharic: SupplementaryBook[] = [
  {
    id: 'supp-math-extreme-11-12',
    title: 'Extreme Series: Advanced Mathematics (Grades 11-12)',
    amharicTitle: 'ኤክስትሪም ተከታታይ፡ የከፍተኛ ሂሳብ ማጠቃለያና የፈተና ዝግጅት (ክፍል 11-12)',
    authorOrSeries: 'Extreme Educational Series',
    category: 'extreme',
    categoryLabel: 'Extreme Series',
    subjectId: 'math',
    grades: [11, 12],
    badge: 'ለ ESSLCE ከፍተኛ ተመራጭ',
    description: 'የ11ኛ እና 12ኛ ክፍል የሂሳብ ቀመሮች፣ አቋራጭ ስሌቶች (Tricks & Shortcuts)፣ እና ያለፉት 10 ዓመታት የዩኒቨርሲቲ መግቢያ ፈተና (ESSLCE) የተሟላ ትንታኔ።',
    highlights: [
      'ከ 800+ በላይ የተሰሩ የፈተና ጥያቄዎች በዝርዝር ማብራሪያ',
      'የካልኩለስ (Limits, Derivatives, Integrals) አቋራጭ ቀመሮች',
      'የማትሪክስ እና ቬክተር ፈጣን ስሌት መንገዶች',
      'የጊዜ አጠቃቀም ስልቶች ለብሔራዊ ፈተና',
    ],
    chapters: [
      {
        chapterNumber: 1,
        title: 'ማትሪክስ፣ ዲተርሚናንት እና የመስመራዊ እኩልታዎች ስርዓት',
        summary: 'የማትሪክስ አይነቶች፣ ስሌቶች፣ የ 2x2 እና 3x3 ዲተርሚናንቶች፣ አድጆይንት፣ ኢንቨርስ እና የክሬመር ህግ (Cramer\'s Rule)።',
        keyFormulasAndRules: [
          'det([[a, b], [c, d]]) = ad - bc',
          'A⁻¹ = (1 / det(A)) * adj(A)',
          'Cramer\'s Rule: x_i = det(A_i) / det(A)',
          'det(AB) = det(A) * det(B)',
          'det(kA) = kⁿ * det(A) (ለ n x n ማትሪክስ)',
        ],
        sampleExamProblems: [
          {
            problem: 'ለ 2x2 ማትሪክስ A ዲተርሚናንቱ det(A) = 5 ቢሆን det(3A) ስንት ይሆናል?',
            solution: 'det(kA) = k² * det(A) ለ 2x2 ማትሪክስ። ስለዚህ det(3A) = 3² * 5 = 9 * 5 = 45።',
            tip: 'ብዙ ተማሪዎች k ን ማባዛት ብቻ ያስባሉ፤ ነገር ግን ለ 2x2 ማትሪክስ k²፣ ለ 3x3 ማትሪክስ k³ መሆኑን አስታውስ!',
          },
        ],
        fullContent: [
          'ማትሪክስ በረድፍ እና በዓምድ የተደረደሩ ቁጥሮች ሰንጠረዥ ነው።',
          'ኢንቨርስ ያለው ማትሪክስ (Invertible matrix) ዲተርሚናንቱ ከዜሮ የተለየ (det(A) ≠ 0) መሆን አለበት።',
          'የክሬመር ህግ የጋራ መፍትሄዎችን በቀላሉ ለማግኘት የሚያስችል ቀልጣፋ መንገድ ነው።',
        ],
      },
      {
        chapterNumber: 2,
        title: 'ሊሚት፣ ኮንቲኒዊቲ እና የዴሪቬቲቭ መሰረቶች (Calculus Master)',
        summary: 'የ 0/0 አሻሚ ቅርጾች (Indeterminate forms)፣ L\'Hôpital\'s Rule፣ እና የዲፈረንሽየሽን ፈጣን ቀመሮች።',
        keyFormulasAndRules: [
          'L\'Hôpital\'s Rule: lim_{x→c} f(x)/g(x) = lim_{x→c} f\'(x)/g\'(x) (0/0 ወይም ∞/∞ ሲሆን)',
          'lim_{x→0} (sin x)/x = 1',
          'lim_{x→0} (1 - cos x)/x = 0',
          'Power Rule: d/dx(xⁿ) = n*xⁿ⁻¹',
          'Product Rule: (uv)\' = u\'v + uv\'',
          'Quotient Rule: (u/v)\' = (u\'v - uv\') / v²',
          'Chain Rule: d/dx(f(g(x))) = f\'(g(x)) * g\'(x)',
        ],
        sampleExamProblems: [
          {
            problem: 'lim_{x→0} (sin(5x)) / (3x) ዋጋ ስንት ነው?',
            solution: 'lim_{x→0} (sin(5x) / 5x) * (5/3) = 1 * (5/3) = 5/3። ወይም በ L\'Hôpital: lim_{x→0} (5cos(5x)) / 3 = 5(1)/3 = 5/3።',
            tip: 'ለፈተና lim_{x→0} sin(ax)/bx = a/b የሚለውን አቋራጭ ህግ በቀጥታ ተጠቀም!',
          },
        ],
        fullContent: [
          'የካልኩለስ ሊሚት ጥያቄዎች በብሔራዊ ፈተና ላይ በብዛት የሚቀርቡ ሲሆን የ 0/0 ቅርፅ ሲያጋጥምህ ቀጥታ በ L\'Hôpital ማቃለል ትችላለህ።',
        ],
      },
    ],
  },
  {
    id: 'supp-physics-extreme-11-12',
    title: 'Extreme Series: Physics for College Entrance',
    amharicTitle: 'ኤክስትሪም ፊዚክስ፡ የዩኒቨርሲቲ መግቢያ ፈተና አጋዥ (ክፍል 11-12)',
    authorOrSeries: 'Extreme Educational Series',
    category: 'extreme',
    categoryLabel: 'Extreme Series',
    subjectId: 'physics',
    grades: [11, 12],
    badge: 'ቀመሮችና ፈጣን መፍትሄዎች',
    description: 'ሁሉንም የ11ኛ እና 12ኛ ክፍል የፊዚክስ ቀመሮች በአንድ ላይ የያዘ፣ ለእንቅስቃሴ፣ ኤሌክትሪክ፣ ማግኔቲዝም እና ቴርሞዳይናሚክስ አቋራጭ ማብራሪያ።',
    highlights: [
      'የፕሮጀክታይል እና ሰርኩላር እንቅስቃሴ አቋራጭ ቀመሮች',
      'የኤሌክትሮስታቲክስ እና ሰርኪዩት ህጎች (Kirchhoff\'s Rules)',
      'የኤሌክትሮማግኔቲክ ኢንዳክሽን እና ፋራዳይ ህግ',
      'ያለፉት ዓመታት 100+ የብሔራዊ ፈተና ጥያቄዎች ማብራሪያ',
    ],
    chapters: [
      {
        chapterNumber: 1,
        title: 'ባለሁለት አቅጣጫ እንቅስቃሴ እና ፕሮጀክታይል ሞሽን (Projectile Motion)',
        summary: 'የፕሮጀክታይል አግድም እና ሽቅብ ክፍሎች፣ የበረራ ጊዜ፣ ከፍተኛ ከፍታ እና አግድም ርቀት።',
        keyFormulasAndRules: [
          'Time of flight: T = (2 * v₀ * sin θ) / g',
          'Maximum height: H = (v₀² * sin² θ) / (2g)',
          'Horizontal range: R = (v₀² * sin(2θ)) / g',
          'Max range የሚገኘው በ θ = 45° ሲሆን R_max = v₀² / g ነው',
          'ተጨማሪ ማዕዘኖች (Complementary angles θ እና 90°-θ) እኩል Range አላቸው',
        ],
        sampleExamProblems: [
          {
            problem: 'አንድ ኳስ በ 20 m/s ፍጥነት በ 30° ማዕዘን ተወረወረ። ኳሱ የሚደርስበት ከፍተኛ ከፍታ (H) ስንት ነው? (g = 10 m/s²)',
            solution: 'H = (v₀² * sin² θ) / (2g) = (20² * sin²(30°)) / (2 * 10) = (400 * (1/2)²) / 20 = (400 * 1/4) / 20 = 100 / 20 = 5 ሜትር።',
            tip: 'sin(30°) = 0.5 ሲሆን ስኩዌር ሲደረግ 0.25 መሆኑን አትርሳ።',
          },
        ],
        fullContent: [
          'ፕሮጀክታይል ሞሽን አግድም (Horizontal - ቋሚ ፍጥነት) እና ሽቅብ (Vertical - በስበት የሚመራ ፍጥንጥነት) እንቅስቃሴዎች ጥምረት ነው።',
        ],
      },
    ],
  },
  {
    id: 'supp-chem-extreme-11-12',
    title: 'Extreme Series: General & Physical Chemistry',
    amharicTitle: 'ኤክስትሪም ኬሚስትሪ፡ የከፍተኛ ኬሚስትሪ አጋዥ መጽሐፍ',
    authorOrSeries: 'Extreme Educational Series',
    category: 'extreme',
    categoryLabel: 'Extreme Series',
    subjectId: 'chemistry',
    grades: [11, 12],
    badge: 'የኢኩሊብሪየም እና ሪዶክስ ስሌቶች',
    description: 'የኬሚካል ኢኩሊብሪየም፣ ቴርሞኬሚስትሪ፣ ኤሌክትሮኬሚስትሪ እና ኦርጋኒክ ኬሚስትሪ ምላሾች ማጠቃለያ።',
    highlights: [
      'የሌ ሻቴሊየር መርህ እና Kc/Kp ስሌቶች',
      'የጋልቫኒክ ሴል ቮልቴጅ እና ኤሌክትሮላይሲስ ቀመሮች',
      'የአሲድ-ቤዝ pH ስሌት እና ባፈር ሶሉሽን',
      'የኦርጋኒክ ውህዶች ስያሜ (IUPAC Naming Rules)',
    ],
    chapters: [
      {
        chapterNumber: 1,
        title: 'ኬሚካላዊ ኢኩሊብሪየም እና የሌ ሻቴሊየር መርህ',
        summary: 'የኢኩሊብሪየም ኮንስታንት Kc/Kp፣ የሙቀት፣ የጫና እና የኮንሰንትሬሽን ለውጥ በኢኩሊብሪየም ላይ የሚያመጣው ተፅዕኖ።',
        keyFormulasAndRules: [
          'Kc = [C]^c [D]^d / ([A]^a [B]^b) ለ aA + bB ⇌ cC + dD',
          'Kp = Kc * (RT)^(Δn) ሲሆን Δn = (c+d) - (a+b)',
          'Q < K ከሆነ ምላሹ ወደ ቀኝ (Forward) ያዘነብላል',
          'Q > K ከሆነ ምላሹ ወደ ግራ (Reverse) ያዘነብላል',
        ],
        sampleExamProblems: [
          {
            problem: 'N₂(g) + 3H₂(g) ⇌ 2NH₃(g) + ሙቀት (Exothermic) በሆነ ምላሽ ላይ ሙቀት ቢጨመር የ NH₃ ምርት ምን ይሆናል?',
            solution: 'ምላሹ ኤክሶተርሚክ ስለሆነ ሙቀት እንደ ምርት ይቆጠራል። ሙቀት ስንጨምር ስርዓቱ ወደ ግራ (Reverse) ስለሚያዘነብል የ NH₃ መጠን ይቀንሳል።',
            tip: 'ለኤክሶተርሚክ ምላሽ ሙቀት መጨመር Kc ን ይቀንሰዋል፤ ወደ ግራ ያዘነብላል።',
          },
        ],
        fullContent: [
          'የሌ ሻቴሊየር መርህ በኢኩሊብሪየም ላይ ያለ ስርዓት በውጭ ጫና፣ ሙቀት ወይም መጠን ሲረበሽ ስርዓቱ ለውጡን ወደሚያጠፋበት አቅጣጫ ይሸጋገራል።',
        ],
      },
    ],
  },
  {
    id: 'supp-biology-extreme-11-12',
    title: 'Extreme Series: Comprehensive Biology (Grades 11-12)',
    amharicTitle: 'ኤክስትሪም ባዮሎጂ፡ የሞለኪውላር ባዮሎጂ እና ጄኔቲክስ ማጠቃለያ',
    authorOrSeries: 'Extreme Educational Series',
    category: 'extreme',
    categoryLabel: 'Extreme Series',
    subjectId: 'biology',
    grades: [11, 12],
    badge: 'ስዕላዊ መግለጫዎች እና ዲያግራሞች',
    description: 'የሞለኪውላር ጄኔቲክስ (DNA replication, Protein synthesis)፣ የሜንደል የዘረመል ህጎች፣ ኢንዛይሞች እና የስነ-ምህዳር ጥበቃ።',
    highlights: [
      'የ DNA እና RNA ዝርዝር ንጽጽር እና የጄኔቲክ ኮድ ሰንጠረዥ',
      'የሴሉላር ሬስፒሬሽን (Glycolysis, Krebs Cycle, ETC) የ ATP ሂሳብ',
      'የሜንደል ሞኖሃይብሪድ እና ዳይሃይብሪድ ክሮስ ሬሾዎች',
      'የኢትዮጵያ ብርቅዬ የዱር እንስሳት እና የተከለሉ ፓርኮች',
    ],
    chapters: [
      {
        chapterNumber: 1,
        title: 'ሞለኪውላር ጄኔቲክስ፡ የ DNA አወቃቀር እና ፕሮቲን ውህደት',
        summary: 'የዲ ኤን ኤ ባለሁለት ሰንሰለት (Double Helix)፣ ኑክሊዮታይዶች፣ ትራንስክሪፕሽን እና ትራንስሌሽን።',
        keyFormulasAndRules: [
          'Chargaff\'s Rule: %A = %T እና %G = %C',
          'A ከ T ጋር በ 2 ሃይድሮጅን ቦንድ፣ G ከ C ጋር በ 3 ሃይድሮጅን ቦንድ ይያያዛሉ',
          'የመጀመሪያ ኮዶን (Start Codon): AUG (Methionine)',
          'የማቆሚያ ኮዶኖች (Stop Codons): UAA, UAG, UGA',
        ],
        sampleExamProblems: [
          {
            problem: 'አንድ የ DNA ሞለኪውል 28% አድኒን (A) ቢኖረው የሳይቶሲን (C) ፐርሰንት ስንት ይሆናል?',
            solution: 'Chargaff\'s Rule: %A = %T = 28%። የ A+T ድምር = 28% + 28% = 56%። የቀረው የ G+C መጠን = 100% - 56% = 44%። %G = %C ስለሆነ %C = 44% / 2 = 22% ይሆናል።',
            tip: '%A + %T + %G + %C = 100% መሆኑን በመጠቀም በፍጥነት አስላ።',
          },
        ],
        fullContent: [
          'ዲ ኤን ኤ የዘረመል መረጃን የሚይዝ ሲሆን በውስጡ ያሉት አራቱ ናይትሮጅናስ ቤዞች A, T, C, G ናቸው።',
        ],
      },
    ],
  },
  {
    id: 'supp-national-exam-past-papers',
    title: 'ESSLCE National Exam Solved Past Papers (2010 - 2024)',
    amharicTitle: 'የኢትዮጵያ ዩኒቨርሲቲ መግቢያ ብሔራዊ ፈተና ያለፉት ዓመታት ጥያቄዎችና መልሶች',
    authorOrSeries: 'FDRE Educational Assessment and Examinations Agency (EAES) Archive',
    category: 'national_exam',
    categoryLabel: 'National Exam Archive',
    subjectId: 'all',
    grades: [12],
    badge: 'የ 15 ዓመታት ፈተናዎች',
    description: 'ከ 2010 እስከ 2024 ዓ.ም የተሰጡ የ ESSLCE የ 12ኛ ክፍል ብሔራዊ ፈተና ጥያቄዎች ከነሙሉ ስቴፕ-ባይ-ስቴፕ ማብራሪያቸው ጋር።',
    highlights: [
      'የሂሳብ፣ ፊዚክስ፣ ኬሚስትሪ፣ ባዮሎጂ እና እንግሊዝኛ ፈተናዎች',
      'የጥያቄዎች ድግግሞሽ እና ከፍተኛ ክብደት ያላቸው ርዕሶች ትንታኔ',
      'የስህተት መከላከያ ምክሮች (Common Student Pitfalls)',
      'የጊዜ አጠቃቀም ሰንጠረዥ ለእያንዳንዱ የትምህርት አይነት',
    ],
    chapters: [
      {
        chapterNumber: 1,
        title: 'የሂሳብ ብሔራዊ ፈተና ተደጋጋሚ ጥያቄዎች እና አሰራራቸው',
        summary: 'በካልኩለስ፣ ማትሪክስ፣ ቬክተር እና ትሪጎኖሜትሪ ዙሪያ የሚወጡ ወሳኝ ጥያቄዎች።',
        keyFormulasAndRules: [
          'የካልኩለስ ከፍተኛ እና ዝቅተኛ ነጥቦች: f\'(x) = 0 በማድረግ ወሳኝ ቁጥሮችን ፈልግ',
          'ሁለተኛ ዴሪቬቲቭ ፈተና: f\'\'(x) > 0 ከሆነ Minimum፣ f\'\'(x) < 0 ከሆነ Maximum',
        ],
        sampleExamProblems: [
          {
            problem: 'f(x) = 2x³ - 9x² + 12x + 1 የፈንክሽኑ ሎካል ማክሲመም ዋጋ ስንት ነው?',
            solution: 'f\'(x) = 6x² - 18x + 12 = 0 => 6(x² - 3x + 2) = 0 => 6(x - 1)(x - 2) = 0 => x = 1 ወይም x = 2። f\'\'(x) = 12x - 18። f\'\'(1) = 12(1) - 18 = -6 < 0 (Maximum at x = 1)። f(1) = 2(1)³ - 9(1)² + 12(1) + 1 = 2 - 9 + 12 + 1 = 6።',
            tip: 'ጥያቄው "የ x ዋጋ" ወይስ "የፈንክሽኑ ማክሲመም ዋጋ f(x)" እንደሚፈልግ በጥንቃቄ አንብብ!',
          },
        ],
        fullContent: ['በየዓመቱ በብሔራዊ ፈተና ላይ የሚወጡትን የካልኩለስ ማክሲመም/ሚኒመም ጥያቄዎች በዚህ መንገድ በቀላሉ መስራት ይቻላል።'],
      },
    ],
  },
  {
    id: 'supp-alpha-formula-handbook',
    title: 'Alpha High School Complete Formula Matrix',
    amharicTitle: 'አልፋ የሁለተኛ ደረጃ ትምህርት ቤት የፈጣን ቀመሮች መመሪያ',
    authorOrSeries: 'Alpha Science Publications',
    category: 'formula_handbook',
    categoryLabel: 'Formula Matrix',
    subjectId: 'all',
    grades: [9, 10, 11, 12],
    badge: 'ሁሉም ቀመሮች በአንድ ላይ',
    description: 'ለ 9ኛ፣ 10ኛ፣ 11ኛ እና 12ኛ ክፍል ተማሪዎች የተዘጋጀ የሂሳብ፣ ፊዚክስ እና ኬሚስትሪ አጠቃላይ የቀመር ሰሌዳ።',
    highlights: [
      'የጂኦሜትሪ፣ አልጀብራ እና ትሪጎኖሜትሪ ቀመሮች',
      'የፊዚክስ መለኪያ አሃዶች፣ ቋሚ ቁጥሮች (Constants) እና ቀመሮች',
      'የኬሚስትሪ ሞላሪቲ፣ ጋዝ ሎውስ እና ቴርሞዳይናሚክስ ቀመሮች',
    ],
    chapters: [
      {
        chapterNumber: 1,
        title: 'የሂሳብ እና ፊዚክስ ወሳኝ ቋሚ ቁጥሮች እና ቀመሮች ሰንጠረዥ',
        summary: 'ለፈተና ክፍል የሚያስፈልጉ መሰረታዊ ቋሚ ቁጥሮች እና የቀመር ማጠቃለያ።',
        keyFormulasAndRules: [
          'የስበት ፍጥንጥነት g ≈ 9.8 m/s² (ወይም በፈተና 10 m/s²)',
          'የኩሎምብ ቋሚ k = 8.99 × 10⁹ N·m²/C²',
          'ፕላንክ ቋሚ h = 6.626 × 10⁻³⁴ J·s',
          'አቮጋድሮ ቁጥር N_A = 6.022 × 10²³ mol⁻¹',
          'ሁለንተናዊ የጋዝ ቋሚ R = 8.314 J/(mol·K) = 0.0821 L·atm/(mol·K)',
        ],
        sampleExamProblems: [],
        fullContent: ['ይህ የቀመር ሰሌዳ ለፈተና ዝግጅት እና ክለሳ ከፍተኛ ጠቀሜታ አለው።'],
      },
    ],
  },
];
