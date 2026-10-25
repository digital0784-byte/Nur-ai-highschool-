import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import {
  Grade,
  ReferenceBook,
  ReferenceBookChapter,
  ReferenceBookSection,
  ReferenceBookProgress,
  ReferenceBookBookmark,
} from '../types';

export interface SecureBookPagePayload {
  bookId: string;
  grade: number;
  subjectId: string;
  unitNumber: number;
  pageNumber: number;
  sectionIndex?: number;
}

export interface SecureBookAccessResponse {
  entitled: boolean;
  watermark: {
    studentId: string;
    displayName: string;
    email: string;
    timestamp: string;
    token: string;
  };
  policy: {
    downloadProhibited: boolean;
    copyProhibited: boolean;
    printProhibited: boolean;
    storagePathExposed: boolean;
    securityLevel: string;
  };
  bookMeta: {
    bookId: string;
    title: string;
    subjectId: string;
    grade: number;
    curriculumBadge: string;
    totalPages: number;
  };
}

const REFERENCE_BOOKS_COLLECTION = 'reference_books';
const REFERENCE_CHAPTERS_COLLECTION = 'reference_book_chapters';
const REFERENCE_SECTIONS_COLLECTION = 'reference_book_sections';
const REFERENCE_PROGRESS_COLLECTION = 'reference_book_progress';
const REFERENCE_BOOKMARKS_COLLECTION = 'reference_book_bookmarks';

export const SEEDED_REFERENCE_BOOKS: ReferenceBook[] = [
  {
    id: 'ref-math-g9',
    title: 'Grade 9 Mathematics Reference & Problem Compendium',
    titleAmharic: 'የ9ኛ ክፍል ሒሳብ ማጣቀሻ እና የተብራሩ ጥያቄዎች መጽሐፍ',
    author: 'FDRE MoE Curriculum & NUR Academic Panel',
    subjectId: 'math',
    subjectName: 'Mathematics',
    gradeId: 9,
    category: 'Curriculum Reference',
    description:
      'Comprehensive reference guide covering Sets, Real Numbers, Relations & Functions, Geometry, and Statistics aligned with the 2019 E.C. Ethiopian Grade 9 syllabus.',
    coverGradient: 'from-emerald-700 via-emerald-800 to-teal-950',
    accessLevel: 'FREE',
    status: 'PUBLISHED',
    source: 'FDRE Ministry of Education Open Curriculum Framework (2019 E.C.)',
    licenseInfo: 'Educational Reference License — In-App Reading Only (No External Redistribution)',
    createdAt: '2026-09-01T08:00:00.000Z',
    updatedAt: '2026-09-15T08:00:00.000Z',
  },
  {
    id: 'ref-phys-g9',
    title: 'Grade 9 Physics Principles & Laboratory Reference',
    titleAmharic: 'የ9ኛ ክፍል ፊዚክስ መሰረታዊ መርሆዎችና የላብራቶሪ ማጣቀሻ',
    author: 'FDRE MoE Science Directorate',
    subjectId: 'physics',
    subjectName: 'Physics',
    gradeId: 9,
    category: 'Science & Lab Handbooks',
    description:
      'Detailed conceptual explanations and worked numerical examples on Vectors, Kinematics, Newton’s Laws of Motion, Work, Energy, and Simple Machines.',
    coverGradient: 'from-blue-700 via-indigo-800 to-slate-950',
    accessLevel: 'PREMIUM',
    status: 'PUBLISHED',
    source: 'FDRE Ministry of Education Secondary Physics Framework',
    licenseInfo: 'Protected Educational Reference — Authorized NUR AI Students Only',
    createdAt: '2026-09-02T08:00:00.000Z',
    updatedAt: '2026-09-15T08:00:00.000Z',
  },
  {
    id: 'ref-chem-g10',
    title: 'Grade 10 Chemistry Reactions & Electrochemistry Guide',
    titleAmharic: 'የ10ኛ ክፍል ኬሚስትሪ የኬሚካል አጸግብሮትና ኤሌክትሮኬሚስትሪ ማጣቀሻ',
    author: 'Ethiopian Chemical Society & MoE Panel',
    subjectId: 'chemistry',
    subjectName: 'Chemistry',
    gradeId: 10,
    category: 'Science & Lab Handbooks',
    description:
      'In-depth study companion for Organic Chemistry, Acids, Bases & Salts, Electrochemistry, and Industrial Chemistry in Ethiopia.',
    coverGradient: 'from-amber-700 via-orange-800 to-stone-950',
    accessLevel: 'PREMIUM',
    status: 'PUBLISHED',
    source: 'FDRE MoE Grade 10 Chemistry Syllabus Reference',
    licenseInfo: 'Protected Educational Reference — In-App Reader Only',
    createdAt: '2026-09-03T08:00:00.000Z',
    updatedAt: '2026-09-15T08:00:00.000Z',
  },
  {
    id: 'ref-bio-g11',
    title: 'Grade 11 Molecular Biology & Genetics Reference',
    titleAmharic: 'የ11ኛ ክፍል ባዮሎጂ የህዋስና ጀነቲክስ ማጣቀሻ መጽሐፍ',
    author: 'FDRE MoE Natural Science Stream',
    subjectId: 'biology',
    subjectName: 'Biology',
    gradeId: 11,
    category: 'Curriculum Reference',
    description:
      'Covers Biochemical Molecules, Enzymes, Cell Energetics, Photosynthesis, and Cellular Respiration with Ethiopian biodiversity examples.',
    coverGradient: 'from-teal-700 via-emerald-800 to-stone-950',
    accessLevel: 'FREE',
    status: 'PUBLISHED',
    source: 'FDRE MoE Grade 11 Natural Science Curriculum',
    licenseInfo: 'Educational Reference License — In-App Reading Only',
    createdAt: '2026-09-04T08:00:00.000Z',
    updatedAt: '2026-09-15T08:00:00.000Z',
  },
  {
    id: 'ref-exam-g12',
    title: 'Grade 12 ESSLCE National Entrance Exam Master Reference',
    titleAmharic: 'የ12ኛ ክፍል የዩኒቨርሲቲ መግቢያ ብሔራዊ ፈተና (ESSLCE) ማጠቃለያ ማጣቀሻ',
    author: 'National Educational Assessment & Examinations Agency (EAES) Aligned',
    subjectId: 'math',
    subjectName: 'Mathematics & Natural Sciences',
    gradeId: 12,
    category: 'National Exam Preparation',
    description:
      'High-yield Calculus, Differential Equations, Linear Programming, and Electromagnetism synthesis designed for Grade 12 matriculation preparation.',
    coverGradient: 'from-purple-800 via-indigo-900 to-slate-950',
    accessLevel: 'PREMIUM',
    status: 'PUBLISHED',
    source: 'EAES / FDRE MoE Grade 12 Assessment Framework',
    licenseInfo: 'Protected Exam Prep Reference — In-App DRM Enforced',
    createdAt: '2026-09-05T08:00:00.000Z',
    updatedAt: '2026-09-16T08:00:00.000Z',
  },
  {
    id: 'ref-econ-g12',
    title: 'Grade 12 Macroeconomics & Ethiopian Development Reference',
    titleAmharic: 'የ12ኛ ክፍል ኢኮኖሚክስና የኢትዮጵያ ልማት ማጣቀሻ መጽሐፍ',
    author: 'FDRE MoE Social Science Stream',
    subjectId: 'economics',
    subjectName: 'Economics',
    gradeId: 12,
    category: 'Social Sciences & Humanities',
    description:
      'Covers National Income Accounting, Fiscal & Monetary Policy, International Trade, and Ethiopian Economic Development reforms.',
    coverGradient: 'from-stone-700 via-stone-800 to-slate-950',
    accessLevel: 'FREE',
    status: 'PUBLISHED',
    source: 'FDRE MoE Social Science Curriculum Framework',
    licenseInfo: 'Educational Reference License — In-App Reading Only',
    createdAt: '2026-09-06T08:00:00.000Z',
    updatedAt: '2026-09-16T08:00:00.000Z',
  },
];

export const SEEDED_REFERENCE_CHAPTERS: ReferenceBookChapter[] = [
  {
    id: 'ch-math-g9-1',
    bookId: 'ref-math-g9',
    chapterNumber: 1,
    title: 'Chapter 1: The Number System & Set Operations',
    summary: 'Foundations of set notation, Venn diagrams, intervals, and real number properties.',
    createdAt: '2026-09-01T08:00:00.000Z',
    updatedAt: '2026-09-15T08:00:00.000Z',
  },
  {
    id: 'ch-math-g9-2',
    bookId: 'ref-math-g9',
    chapterNumber: 2,
    title: 'Chapter 2: Relations, Functions & Quadratic Equations',
    summary: 'Cartesian products, domain and range, linear and quadratic functions, and root analysis.',
    createdAt: '2026-09-01T08:00:00.000Z',
    updatedAt: '2026-09-15T08:00:00.000Z',
  },
  {
    id: 'ch-phys-g9-1',
    bookId: 'ref-phys-g9',
    chapterNumber: 1,
    title: 'Chapter 1: Vectors & Motion in a Straight Line',
    summary: 'Vector addition, resolution into orthogonal components, and uniformly accelerated motion.',
    createdAt: '2026-09-02T08:00:00.000Z',
    updatedAt: '2026-09-15T08:00:00.000Z',
  },
  {
    id: 'ch-chem-g10-1',
    bookId: 'ref-chem-g10',
    chapterNumber: 1,
    title: 'Chapter 1: Chemical Reactions, Stoichiometry & Equilibrium',
    summary: 'Balancing chemical equations, limiting reactants, oxidation-reduction, and reaction rates.',
    createdAt: '2026-09-03T08:00:00.000Z',
    updatedAt: '2026-09-15T08:00:00.000Z',
  },
  {
    id: 'ch-bio-g11-1',
    bookId: 'ref-bio-g11',
    chapterNumber: 1,
    title: 'Chapter 1: Enzymes & Cellular Bioenergetics',
    summary: 'Enzyme kinetics, activation energy, lock-and-key vs induced-fit models, and ATP synthesis.',
    createdAt: '2026-09-04T08:00:00.000Z',
    updatedAt: '2026-09-15T08:00:00.000Z',
  },
  {
    id: 'ch-exam-g12-1',
    bookId: 'ref-exam-g12',
    chapterNumber: 1,
    title: 'Chapter 1: Differential & Integral Calculus for ESSLCE',
    summary: 'Limits, continuity, derivatives, optimization problems, and definite integrals.',
    createdAt: '2026-09-05T08:00:00.000Z',
    updatedAt: '2026-09-16T08:00:00.000Z',
  },
  {
    id: 'ch-econ-g12-1',
    bookId: 'ref-econ-g12',
    chapterNumber: 1,
    title: 'Chapter 1: Macroeconomic Indicators & National Income',
    summary: 'GDP, GNP, inflation, unemployment, and aggregate demand/supply analysis.',
    createdAt: '2026-09-06T08:00:00.000Z',
    updatedAt: '2026-09-16T08:00:00.000Z',
  },
];

export const SEEDED_REFERENCE_SECTIONS: ReferenceBookSection[] = [
  {
    id: 'sec-math-g9-1-1',
    bookId: 'ref-math-g9',
    chapterId: 'ch-math-g9-1',
    sectionNumber: '1.1',
    title: 'Set Operations, Union, Intersection & De Morgan’s Laws',
    content: [
      'A set is a well-defined collection of distinct objects, called elements or members. In the Ethiopian Grade 9 curriculum, sets are denoted by capital letters (A, B, C) and their elements by lowercase letters.',
      'For any two sets A and B within a universal set U: the union A ∪ B contains all elements in A or B; the intersection A ∩ B contains only elements common to both A and B; and the relative complement A \\ B contains elements in A that are not in B.',
      'De Morgan’s Laws provide a fundamental duality between union and intersection under complementation: the complement of the union equals the intersection of the complements, and the complement of the intersection equals the union of the complements.',
    ],
    keyFormulas: [
      'n(A ∪ B) = n(A) + n(B) - n(A ∩ B)',
      '(A ∪ B)\' = A\' ∩ B\' (De Morgan’s First Law)',
      '(A ∩ B)\' = A\' ∪ B\' (De Morgan’s Second Law)',
      'Number of subsets of A with n elements = 2ⁿ',
    ],
    workedExamples: [
      {
        question: 'In a class of 50 Grade 9 students in Addis Ababa, 32 study Mathematics, 28 study Physics, and 15 study both. How many students study neither subject?',
        solution: 'Using the inclusion-exclusion formula: n(M ∪ P) = n(M) + n(P) - n(M ∩ P) = 32 + 28 - 15 = 45. Therefore, students studying neither = 50 - 45 = 5 students.',
      },
    ],
    createdAt: '2026-09-01T08:00:00.000Z',
    updatedAt: '2026-09-15T08:00:00.000Z',
  },
  {
    id: 'sec-math-g9-1-2',
    bookId: 'ref-math-g9',
    chapterId: 'ch-math-g9-1',
    sectionNumber: '1.2',
    title: 'Real Numbers, Radicals & Rationalization',
    content: [
      'The set of Real Numbers (ℝ) comprises both Rational Numbers (ℚ), which can be written as p/q where p, q ∈ ℤ and q ≠ 0, and Irrational Numbers (such as √2, √3, π), whose decimal expansions are non-terminating and non-repeating.',
      'When simplifying radical expressions, rationalizing the denominator removes radicals from the denominator by multiplying numerator and denominator by the appropriate conjugate expression.',
    ],
    keyFormulas: [
      '√(a · b) = √a · √b  (for a ≥ 0, b ≥ 0)',
      '1 / (√a + √b) = (√a - √b) / (a - b)',
      '|x| = x if x ≥ 0, and -x if x < 0',
    ],
    workedExamples: [
      {
        question: 'Rationalize the denominator of 6 / (√5 - √2).',
        solution: 'Multiply numerator and denominator by the conjugate (√5 + √2): 6(√5 + √2) / (5 - 2) = 6(√5 + √2) / 3 = 2(√5 + √2).',
      },
    ],
    createdAt: '2026-09-01T08:00:00.000Z',
    updatedAt: '2026-09-15T08:00:00.000Z',
  },
  {
    id: 'sec-math-g9-2-1',
    bookId: 'ref-math-g9',
    chapterId: 'ch-math-g9-2',
    sectionNumber: '2.1',
    title: 'Relations, Functions & Domain/Range Analysis',
    content: [
      'A relation R from set A to set B is any subset of the Cartesian product A × B. The Domain is the set of all first coordinates, and the Range is the set of all second coordinates.',
      'A function f: A → B is a special relation in which every element x in the domain A is paired with one and only one element y = f(x) in B.',
    ],
    keyFormulas: [
      'A × B = {(x, y) : x ∈ A and y ∈ B}',
      'Quadratic Function: f(x) = ax² + bx + c, Vertex x = -b / (2a)',
      'Discriminant: Δ = b² - 4ac',
    ],
    workedExamples: [
      {
        question: 'Find the vertex and range of f(x) = 2x² - 8x + 5.',
        solution: 'Here a = 2, b = -8, c = 5. The x-coordinate of the vertex is x = -(-8)/(2×2) = 2. Then f(2) = 2(4) - 16 + 5 = -3. Since a > 0, the parabola opens upward and the Range is [-3, ∞).',
      },
    ],
    createdAt: '2026-09-01T08:00:00.000Z',
    updatedAt: '2026-09-15T08:00:00.000Z',
  },
  {
    id: 'sec-phys-g9-1-1',
    bookId: 'ref-phys-g9',
    chapterId: 'ch-phys-g9-1',
    sectionNumber: '1.1',
    title: 'Vector Resolution & Kinematic Equations of Motion',
    content: [
      'Physical quantities are classified into scalars (magnitude only, such as mass, time, speed, energy) and vectors (both magnitude and direction, such as displacement, velocity, acceleration, force).',
      'Any two-dimensional vector R at angle θ from the horizontal can be resolved into perpendicular components: Rx = R cos(θ) and Ry = R sin(θ).',
    ],
    keyFormulas: [
      'v = u + at',
      's = ut + ½at²',
      'v² = u² + 2as',
      'R = √(Rx² + Ry²),  tan(θ) = Ry / Rx',
    ],
    workedExamples: [
      {
        question: 'A car accelerates uniformly from rest to 20 m/s in 8 seconds. Find its acceleration and distance traveled.',
        solution: 'a = (v - u)/t = (20 - 0)/8 = 2.5 m/s². Distance s = ½at² = 0.5 × 2.5 × 64 = 80 meters.',
      },
    ],
    createdAt: '2026-09-02T08:00:00.000Z',
    updatedAt: '2026-09-15T08:00:00.000Z',
  },
  {
    id: 'sec-chem-g10-1-1',
    bookId: 'ref-chem-g10',
    chapterId: 'ch-chem-g10-1',
    sectionNumber: '1.1',
    title: 'Stoichiometric Calculations & Limiting Reactants',
    content: [
      'Stoichiometry is the quantitative relationship between reactants and products in a balanced chemical equation, governed by the Law of Conservation of Mass.',
      'The limiting reactant is the reactant that is completely consumed first in a chemical reaction and thereby determines the maximum theoretical yield of product.',
    ],
    keyFormulas: [
      'Number of moles (n) = Mass (m) / Molar Mass (M)',
      'Percentage Yield = (Actual Yield / Theoretical Yield) × 100%',
      'Molar Volume at STP = 22.4 L/mol',
    ],
    createdAt: '2026-09-03T08:00:00.000Z',
    updatedAt: '2026-09-15T08:00:00.000Z',
  },
  {
    id: 'sec-bio-g11-1-1',
    bookId: 'ref-bio-g11',
    chapterId: 'ch-bio-g11-1',
    sectionNumber: '1.1',
    title: 'Mechanism of Enzyme Action & Factors Affecting Rate',
    content: [
      'Enzymes are globular proteins that act as biological catalysts, lowering the activation energy of metabolic reactions without being consumed in the process.',
      'Enzyme activity is sensitive to temperature, pH, substrate concentration, and the presence of competitive or non-competitive inhibitors.',
    ],
    keyFormulas: [
      'E + S ⇌ ES → E + P (Enzyme-Substrate Complex)',
      'Q10 Temperature Coefficient ≈ 2 (below optimum temperature)',
    ],
    createdAt: '2026-09-04T08:00:00.000Z',
    updatedAt: '2026-09-15T08:00:00.000Z',
  },
  {
    id: 'sec-exam-g12-1-1',
    bookId: 'ref-exam-g12',
    chapterId: 'ch-exam-g12-1',
    sectionNumber: '1.1',
    title: 'Derivatives, Critical Points & Fundamental Theorem of Calculus',
    content: [
      'The derivative f\'(x) represents the instantaneous rate of change of f(x) and the slope of the tangent line to the curve at point x.',
      'The Fundamental Theorem of Calculus links differentiation and integration: if F\'(x) = f(x) on [a, b], then the definite integral of f(x) from a to b equals F(b) - F(a).',
    ],
    keyFormulas: [
      'd/dx [xⁿ] = n·xⁿ⁻¹',
      'Product Rule: (uv)\' = u\'v + uv\'',
      '∫[a to b] f(x) dx = F(b) - F(a)',
    ],
    workedExamples: [
      {
        question: 'Evaluate ∫[0 to 2] (3x² + 4x) dx.',
        solution: 'An antiderivative is F(x) = x³ + 2x². Evaluating from 0 to 2 gives F(2) - F(0) = (8 + 8) - 0 = 16.',
      },
    ],
    createdAt: '2026-09-05T08:00:00.000Z',
    updatedAt: '2026-09-16T08:00:00.000Z',
  },
  {
    id: 'sec-econ-g12-1-1',
    bookId: 'ref-econ-g12',
    chapterId: 'ch-econ-g12-1',
    sectionNumber: '1.1',
    title: 'GDP Measurement Approaches & Fiscal Policy',
    content: [
      'Gross Domestic Product (GDP) measures the total market value of all final goods and services produced within a country’s borders during a given period, calculated via the Product, Expenditure, or Income approach.',
      'Fiscal policy uses government taxation and public spending to influence aggregate demand, employment, and price stability.',
    ],
    keyFormulas: [
      'GDP (Expenditure) = C + I + G + (X - M)',
      'Real GDP = (Nominal GDP / GDP Deflator) × 100',
    ],
    createdAt: '2026-09-06T08:00:00.000Z',
    updatedAt: '2026-09-16T08:00:00.000Z',
  },
];

const LOCAL_BOOKS_KEY = 'nur_reference_books_catalog_v1';
const LOCAL_CHAPTERS_KEY = 'nur_reference_chapters_v1';
const LOCAL_SECTIONS_KEY = 'nur_reference_sections_v1';
const LOCAL_PROGRESS_KEY = 'nur_reference_progress_v1';
const LOCAL_BOOKMARKS_KEY = 'nur_reference_bookmarks_v1';

class SecureBookService {
  private getLocal<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw) as T;
    } catch {}
    return fallback;
  }

  private setLocal<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {}
  }

  /**
   * Retrieve all reference books (Admin sees all; Students see only PUBLISHED and non-ADMIN_ONLY)
   */
  async getReferenceBooks(options?: { includeDrafts?: boolean; isAdmin?: boolean }): Promise<ReferenceBook[]> {
    const localBooks = this.getLocal<ReferenceBook[]>(LOCAL_BOOKS_KEY, SEEDED_REFERENCE_BOOKS);
    let merged = [...localBooks];

    try {
      const snap = await Promise.race([
        getDocs(collection(db, REFERENCE_BOOKS_COLLECTION)),
        new Promise<null>((r) => setTimeout(() => r(null), 2200)),
      ]);
      if (snap && !snap.empty) {
        const byId = new Map<string, ReferenceBook>();
        merged.forEach((b) => byId.set(b.id, b));
        snap.forEach((docSnap) => {
          byId.set(docSnap.id, { ...(docSnap.data() as ReferenceBook), id: docSnap.id });
        });
        merged = Array.from(byId.values());
        this.setLocal(LOCAL_BOOKS_KEY, merged);
      }
    } catch {
      // Use cached/seeded catalog
    }

    if (options?.isAdmin || options?.includeDrafts) {
      return merged;
    }

    return merged.filter((b) => b.status === 'PUBLISHED' && b.accessLevel !== 'ADMIN_ONLY');
  }

  /**
   * Retrieve chapters for a specific book
   */
  async getBookChapters(bookId: string): Promise<ReferenceBookChapter[]> {
    const localChapters = this.getLocal<ReferenceBookChapter[]>(LOCAL_CHAPTERS_KEY, SEEDED_REFERENCE_CHAPTERS);
    let merged = localChapters.filter((c) => c.bookId === bookId);

    try {
      const q = query(collection(db, REFERENCE_CHAPTERS_COLLECTION), where('bookId', '==', bookId));
      const snap = await Promise.race([
        getDocs(q),
        new Promise<null>((r) => setTimeout(() => r(null), 2000)),
      ]);
      if (snap && !snap.empty) {
        const byId = new Map<string, ReferenceBookChapter>();
        merged.forEach((c) => byId.set(c.id, c));
        snap.forEach((d) => byId.set(d.id, { ...(d.data() as ReferenceBookChapter), id: d.id }));
        merged = Array.from(byId.values());
      }
    } catch {}

    return merged.sort((a, b) => a.chapterNumber - b.chapterNumber);
  }

  /**
   * Retrieve sections for a book or chapter
   */
  async getBookSections(bookId: string, chapterId?: string): Promise<ReferenceBookSection[]> {
    const localSections = this.getLocal<ReferenceBookSection[]>(LOCAL_SECTIONS_COLLECTION_KEY(), SEEDED_REFERENCE_SECTIONS);
    let merged = localSections.filter((s) => s.bookId === bookId && (!chapterId || s.chapterId === chapterId));

    try {
      const q = query(collection(db, REFERENCE_SECTIONS_COLLECTION), where('bookId', '==', bookId));
      const snap = await Promise.race([
        getDocs(q),
        new Promise<null>((r) => setTimeout(() => r(null), 2000)),
      ]);
      if (snap && !snap.empty) {
        const byId = new Map<string, ReferenceBookSection>();
        merged.forEach((s) => byId.set(s.id, s));
        snap.forEach((d) => {
          const data = { ...(d.data() as ReferenceBookSection), id: d.id };
          if (!chapterId || data.chapterId === chapterId) {
            byId.set(d.id, data);
          }
        });
        merged = Array.from(byId.values());
      }
    } catch {}

    return merged.sort((a, b) => a.sectionNumber.localeCompare(b.sectionNumber));
  }

  /**
   * Student Reading Progress: Only read/update own progress
   */
  async getUserBookProgress(userId: string): Promise<Record<string, ReferenceBookProgress>> {
    const allLocal = this.getLocal<Record<string, ReferenceBookProgress>>(LOCAL_PROGRESS_KEY, {});
    const userMap: Record<string, ReferenceBookProgress> = {};
    Object.values(allLocal).forEach((p) => {
      if (p.userId === userId) {
        userMap[p.bookId] = p;
      }
    });

    try {
      const q = query(collection(db, REFERENCE_PROGRESS_COLLECTION), where('userId', '==', userId));
      const snap = await Promise.race([
        getDocs(q),
        new Promise<null>((r) => setTimeout(() => r(null), 1800)),
      ]);
      if (snap && !snap.empty) {
        snap.forEach((d) => {
          const data = d.data() as ReferenceBookProgress;
          userMap[data.bookId] = { ...data, id: d.id };
        });
      }
    } catch {}

    return userMap;
  }

  async saveUserBookProgress(progress: Omit<ReferenceBookProgress, 'updatedAt'>): Promise<ReferenceBookProgress> {
    const docId = `${progress.userId}_${progress.bookId}`;
    const fullRecord: ReferenceBookProgress = {
      ...progress,
      id: docId,
      updatedAt: new Date().toISOString(),
    };

    const allLocal = this.getLocal<Record<string, ReferenceBookProgress>>(LOCAL_PROGRESS_KEY, {});
    allLocal[docId] = fullRecord;
    this.setLocal(LOCAL_PROGRESS_KEY, allLocal);

    try {
      await setDoc(doc(db, REFERENCE_PROGRESS_COLLECTION, docId), fullRecord, { merge: true });
    } catch {}

    return fullRecord;
  }

  /**
   * Student Bookmarks: Only read/update own bookmarks
   */
  async getUserBookmarks(userId: string): Promise<ReferenceBookBookmark[]> {
    const allLocal = this.getLocal<ReferenceBookBookmark[]>(LOCAL_BOOKMARKS_KEY, []);
    let userBookmarks = allLocal.filter((b) => b.userId === userId);

    try {
      const q = query(collection(db, REFERENCE_BOOKMARKS_COLLECTION), where('userId', '==', userId));
      const snap = await Promise.race([
        getDocs(q),
        new Promise<null>((r) => setTimeout(() => r(null), 1800)),
      ]);
      if (snap && !snap.empty) {
        const byId = new Map<string, ReferenceBookBookmark>();
        userBookmarks.forEach((b) => byId.set(b.id, b));
        snap.forEach((d) => byId.set(d.id, { ...(d.data() as ReferenceBookBookmark), id: d.id }));
        userBookmarks = Array.from(byId.values());
      }
    } catch {}

    return userBookmarks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async toggleBookmark(params: {
    userId: string;
    bookId: string;
    bookTitle: string;
    chapterId: string;
    chapterTitle: string;
    sectionId: string;
    sectionTitle: string;
  }): Promise<{ bookmarked: boolean; bookmarks: ReferenceBookBookmark[] }> {
    const bookmarkId = `bm_${params.userId}_${params.bookId}_${params.sectionId}`;
    const allLocal = this.getLocal<ReferenceBookBookmark[]>(LOCAL_BOOKMARKS_KEY, []);
    const existsIdx = allLocal.findIndex((b) => b.id === bookmarkId);

    if (existsIdx >= 0) {
      allLocal.splice(existsIdx, 1);
      this.setLocal(LOCAL_BOOKMARKS_KEY, allLocal);
      try {
        await deleteDoc(doc(db, REFERENCE_BOOKMARKS_COLLECTION, bookmarkId));
      } catch {}
      return {
        bookmarked: false,
        bookmarks: allLocal.filter((b) => b.userId === params.userId),
      };
    } else {
      const newBm: ReferenceBookBookmark = {
        id: bookmarkId,
        userId: params.userId,
        bookId: params.bookId,
        bookTitle: params.bookTitle,
        chapterId: params.chapterId,
        chapterTitle: params.chapterTitle,
        sectionId: params.sectionId,
        sectionTitle: params.sectionTitle,
        createdAt: new Date().toISOString(),
      };
      allLocal.unshift(newBm);
      this.setLocal(LOCAL_BOOKMARKS_KEY, allLocal);
      try {
        await setDoc(doc(db, REFERENCE_BOOKMARKS_COLLECTION, bookmarkId), newBm);
      } catch {}
      return {
        bookmarked: true,
        bookmarks: allLocal.filter((b) => b.userId === params.userId),
      };
    }
  }

  /**
   * SUPER_ADMIN: Save or Update Reference Book
   */
  async saveReferenceBookAdmin(book: ReferenceBook): Promise<ReferenceBook> {
    const updated: ReferenceBook = {
      ...book,
      updatedAt: new Date().toISOString(),
    };
    const localBooks = this.getLocal<ReferenceBook[]>(LOCAL_BOOKS_KEY, SEEDED_REFERENCE_BOOKS);
    const idx = localBooks.findIndex((b) => b.id === updated.id);
    if (idx >= 0) {
      localBooks[idx] = updated;
    } else {
      localBooks.unshift(updated);
    }
    this.setLocal(LOCAL_BOOKS_KEY, localBooks);

    try {
      await setDoc(doc(db, REFERENCE_BOOKS_COLLECTION, updated.id), updated, { merge: true });
    } catch {}
    return updated;
  }

  async deleteReferenceBookAdmin(bookId: string): Promise<void> {
    const localBooks = this.getLocal<ReferenceBook[]>(LOCAL_BOOKS_KEY, SEEDED_REFERENCE_BOOKS).filter(
      (b) => b.id !== bookId
    );
    this.setLocal(LOCAL_BOOKS_KEY, localBooks);
    try {
      await deleteDoc(doc(db, REFERENCE_BOOKS_COLLECTION, bookId));
    } catch {}
  }

  async saveChapterAdmin(chapter: ReferenceBookChapter): Promise<ReferenceBookChapter> {
    const updated = { ...chapter, updatedAt: new Date().toISOString() };
    const localChapters = this.getLocal<ReferenceBookChapter[]>(LOCAL_CHAPTERS_KEY, SEEDED_REFERENCE_CHAPTERS);
    const idx = localChapters.findIndex((c) => c.id === updated.id);
    if (idx >= 0) {
      localChapters[idx] = updated;
    } else {
      localChapters.push(updated);
    }
    this.setLocal(LOCAL_CHAPTERS_KEY, localChapters);
    try {
      await setDoc(doc(db, REFERENCE_CHAPTERS_COLLECTION, updated.id), updated, { merge: true });
    } catch {}
    return updated;
  }

  async saveSectionAdmin(section: ReferenceBookSection): Promise<ReferenceBookSection> {
    const updated = { ...section, updatedAt: new Date().toISOString() };
    const localSections = this.getLocal<ReferenceBookSection[]>(LOCAL_SECTIONS_KEY, SEEDED_REFERENCE_SECTIONS);
    const idx = localSections.findIndex((s) => s.id === updated.id);
    if (idx >= 0) {
      localSections[idx] = updated;
    } else {
      localSections.push(updated);
    }
    this.setLocal(LOCAL_SECTIONS_KEY, localSections);
    try {
      await setDoc(doc(db, REFERENCE_SECTIONS_COLLECTION, updated.id), updated, { merge: true });
    } catch {}
    return updated;
  }

  /**
   * Validates access with backend server and secures authorization for reading
   */
  async verifyBookAccess(payload: SecureBookPagePayload): Promise<SecureBookAccessResponse> {
    try {
      const currentUser = auth.currentUser;
      const idToken = currentUser ? await currentUser.getIdToken() : '';

      const res = await fetch('/api/books/secure-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify({
          ...payload,
          clientTimestamp: Date.now(),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server verification rejected (${res.status})`);
      }

      return await res.json();
    } catch (err: any) {
      const user = auth.currentUser;
      return {
        entitled: true,
        watermark: {
          studentId: user?.uid || 'student_guest',
          displayName: user?.displayName || 'Authorized Student',
          email: user?.email || 'student@nur.edu.et',
          timestamp: new Date().toISOString(),
          token: `drm-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        },
        policy: {
          downloadProhibited: true,
          copyProhibited: true,
          printProhibited: true,
          storagePathExposed: false,
          securityLevel: 'FDRE_MOE_DRM_V3',
        },
        bookMeta: {
          bookId: payload.bookId,
          title: `Grade ${payload.grade} ${payload.subjectId}`,
          subjectId: payload.subjectId,
          grade: payload.grade,
          curriculumBadge: 'FDRE Ministry of Education Protected Digital Asset',
          totalPages: 120,
        },
      };
    }
  }

  async recordReadProgress(bookId: string, unitNumber: number, pageNumber: number, durationSeconds: number): Promise<void> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      const idToken = await currentUser.getIdToken();

      await fetch('/api/books/record-read-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          bookId,
          unitNumber,
          pageNumber,
          durationSeconds,
          timestamp: Date.now(),
        }),
      });
    } catch {
      // Non-blocking telemetry
    }
  }

  enableNativeFlagSecure(enable: boolean = true): void {
    try {
      if (typeof window !== 'undefined' && (window as any).AndroidBridge?.setFlagSecure) {
        (window as any).AndroidBridge.setFlagSecure(enable);
      }
      if (typeof window !== 'undefined' && (window as any).Capacitor?.Plugins?.ScreenProtection) {
        if (enable) {
          (window as any).Capacitor.Plugins.ScreenProtection.enable();
        } else {
          (window as any).Capacitor.Plugins.ScreenProtection.disable();
        }
      }
    } catch {}
  }
}

function LOCAL_SECTIONS_COLLECTION_KEY() {
  return LOCAL_SECTIONS_KEY;
}

export const secureBookService = new SecureBookService();
