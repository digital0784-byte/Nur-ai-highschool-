import { Grade, LanguageCode, SubjectTextbook } from '../types';
import { textbooksDataAmharic, SubjectTextbookCollection } from './textbooks/textbooks_am';
import { textbooksDataEnglish } from './textbooks/textbooks_en';
import { textbooksDataOromo } from './textbooks/textbooks_om';
import { textbooksDataTigrinya } from './textbooks/textbooks_ti';
import { textbooksDataArabic } from './textbooks/textbooks_ar';
import { textbooksDataSomali } from './textbooks/textbooks_so';

export type { SubjectTextbookCollection };
export {
  textbooksDataAmharic,
  textbooksDataEnglish,
  textbooksDataOromo,
  textbooksDataTigrinya,
  textbooksDataArabic,
  textbooksDataSomali,
};

export const textbooksByLanguage: Record<LanguageCode, SubjectTextbookCollection> = {
  am: textbooksDataAmharic,
  en: textbooksDataEnglish,
  om: textbooksDataOromo,
  ti: textbooksDataTigrinya,
  ar: textbooksDataArabic,
  so: textbooksDataSomali,
};

export function normalizeSubjectId(subjectId: string): string {
  const s = subjectId ? subjectId.toLowerCase().trim() : '';
  if (s === 'civics' || s === 'citizenship') return 'citizenship';
  if (s === 'social' || s === 'social-studies' || s === 'history') return 'history';
  if (s === 'ict' || s === 'it' || s === 'information-technology') return 'it';
  if (s === 'amharic' || s === 'amh' || s === 'አማርኛ') return 'amharic';
  if (s === 'geography' || s === 'geo') return 'geography';
  if (s === 'agriculture' || s === 'agri') return 'agriculture';
  if (s === 'chemistry' || s === 'chem') return 'chemistry';
  if (s === 'physics' || s === 'phy') return 'physics';
  if (s === 'biology' || s === 'bio') return 'biology';
  if (s === 'math' || s === 'mathematics') return 'math';
  if (s === 'english' || s === 'eng') return 'english';
  if (s === 'economics' || s === 'econ') return 'economics';
  return s;
}

export const OFFICIAL_PDF_MAP: Record<string, Partial<Record<Grade, string>>> = {
  math: { 9: '/textbooks/math/grade-9.pdf', 10: '/textbooks/math/grade-10.pdf' },
  physics: { 9: '/textbooks/physics/grade-9.pdf', 10: '/textbooks/physics/grade-10.pdf' },
  chemistry: { 9: '/textbooks/chemistry/grade-9.pdf', 10: '/textbooks/chemistry/grade-10.pdf' },
  biology: { 9: '/textbooks/biology/grade-9.pdf', 10: '/textbooks/biology/grade-10.pdf' },
  amharic: { 9: '/textbooks/amharic/grade-9.pdf', 10: '/textbooks/amharic/grade-10.pdf' },
  geography: { 9: '/textbooks/geography/grade-9.pdf' },
  ict: { 9: '/textbooks/ict/grade-9.pdf', 10: '/textbooks/ict/grade-10.pdf' },
  it: { 9: '/textbooks/ict/grade-9.pdf', 10: '/textbooks/ict/grade-10.pdf' },
  economics: { 9: '/textbooks/economics/grade-9.pdf', 10: '/textbooks/economics/grade-10.pdf' },
  english: { 10: '/textbooks/english/grade-10.pdf' },
  citizenship: { 10: '/textbooks/citizenship/grade-10.pdf' },
  'social-studies': { 10: '/textbooks/social-studies/grade-10.pdf' },
  history: { 10: '/textbooks/social-studies/grade-10.pdf' },
};

export function withOfficialPdf(textbook: SubjectTextbook): SubjectTextbook {
  if (!textbook) return textbook;
  const normId = normalizeSubjectId(textbook.subjectId);
  const pdfUrl =
    (OFFICIAL_PDF_MAP[normId] && OFFICIAL_PDF_MAP[normId]![textbook.grade]) ||
    (OFFICIAL_PDF_MAP[textbook.subjectId] && OFFICIAL_PDF_MAP[textbook.subjectId]![textbook.grade]);
  return {
    ...textbook,
    officialPdfUrl: pdfUrl || textbook.officialPdfUrl,
  };
}

export function getTextbook(subjectId: string, grade: Grade, language: LanguageCode = 'am'): SubjectTextbook {
  // Normalize subjectId aliases (e.g., social-studies -> history, ict -> it, civics -> citizenship)
  const mappedId = normalizeSubjectId(subjectId);

  // Get textbook collection for the specified language, falling back to Amharic, then English
  const langCollection = textbooksByLanguage[language] || textbooksDataAmharic;
  let subjectGroup =
    langCollection[mappedId] ||
    langCollection[subjectId] ||
    (mappedId === 'history' ? langCollection['history'] || langCollection['social-studies'] : undefined) ||
    (mappedId === 'it' ? langCollection['it'] || langCollection['ict'] : undefined) ||
    (mappedId === 'amharic' ? langCollection['amharic'] : undefined);

  // If not found in current language, fallback to Amharic collection
  if (!subjectGroup && langCollection !== textbooksDataAmharic) {
    subjectGroup =
      textbooksDataAmharic[mappedId] ||
      textbooksDataAmharic[subjectId] ||
      (mappedId === 'history' ? textbooksDataAmharic['history'] || textbooksDataAmharic['social-studies'] : undefined) ||
      (mappedId === 'it' ? textbooksDataAmharic['it'] || textbooksDataAmharic['ict'] : undefined) ||
      (mappedId === 'amharic' ? textbooksDataAmharic['amharic'] : undefined);
  }

  // If still not found, fallback to English collection
  if (!subjectGroup && langCollection !== textbooksDataEnglish) {
    subjectGroup =
      textbooksDataEnglish[mappedId] ||
      textbooksDataEnglish[subjectId] ||
      (mappedId === 'history' ? textbooksDataEnglish['history'] || textbooksDataEnglish['social-studies'] : undefined) ||
      (mappedId === 'it' ? textbooksDataEnglish['it'] || textbooksDataEnglish['ict'] : undefined) ||
      (mappedId === 'amharic' ? textbooksDataEnglish['amharic'] : undefined);
  }

  if (subjectGroup && subjectGroup[grade]) {
    return withOfficialPdf(subjectGroup[grade]!);
  }

  // Fallback to Grade 9 if requested grade not found, or any grade present in subject
  if (subjectGroup) {
    const fallbackGrade = subjectGroup[9] || subjectGroup[10] || subjectGroup[11] || subjectGroup[12];
    if (fallbackGrade) return withOfficialPdf(fallbackGrade);
  }

  // Ultimate fallback to Math Grade 9 in the selected language or Amharic
  const fallback =
    (langCollection['math'] && langCollection['math'][9]) ||
    textbooksDataAmharic['math'][9]!;
  return withOfficialPdf(fallback);
}

export function getAllTextbooksForSubject(subjectId: string, language: LanguageCode = 'am'): SubjectTextbook[] {
  const mappedId = normalizeSubjectId(subjectId);

  const langCollection = textbooksByLanguage[language] || textbooksDataAmharic;
  let subjectGroup =
    langCollection[mappedId] ||
    langCollection[subjectId] ||
    (mappedId === 'history' ? langCollection['history'] || langCollection['social-studies'] : undefined) ||
    (mappedId === 'it' ? langCollection['it'] || langCollection['ict'] : undefined) ||
    (mappedId === 'amharic' ? langCollection['amharic'] : undefined);

  if (!subjectGroup && langCollection !== textbooksDataAmharic) {
    subjectGroup =
      textbooksDataAmharic[mappedId] ||
      textbooksDataAmharic[subjectId] ||
      (mappedId === 'history' ? textbooksDataAmharic['history'] || textbooksDataAmharic['social-studies'] : undefined) ||
      (mappedId === 'it' ? textbooksDataAmharic['it'] || textbooksDataAmharic['ict'] : undefined) ||
      (mappedId === 'amharic' ? textbooksDataAmharic['amharic'] : undefined);
  }

  if (!subjectGroup && langCollection !== textbooksDataEnglish) {
    subjectGroup =
      textbooksDataEnglish[mappedId] ||
      textbooksDataEnglish[subjectId] ||
      (mappedId === 'history' ? textbooksDataEnglish['history'] || textbooksDataEnglish['social-studies'] : undefined) ||
      (mappedId === 'it' ? textbooksDataEnglish['it'] || textbooksDataEnglish['ict'] : undefined) ||
      (mappedId === 'amharic' ? textbooksDataEnglish['amharic'] : undefined);
  }

  if (!subjectGroup) return [];
  const list: SubjectTextbook[] = [];
  ([9, 10, 11, 12] as Grade[]).forEach((g) => {
    if (subjectGroup[g]) {
      list.push(withOfficialPdf(subjectGroup[g]!));
    }
  });
  return list;
}
