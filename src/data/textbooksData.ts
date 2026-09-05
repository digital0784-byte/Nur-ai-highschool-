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
  if (s === 'amharic' || s === 'amh') return 'amharic';
  if (s === 'geography' || s === 'geo') return 'geography';
  if (s === 'agriculture' || s === 'agri') return 'agriculture';
  if (s === 'chemistry' || s === 'chem') return 'chemistry';
  if (s === 'physics' || s === 'phy') return 'physics';
  if (s === 'biology' || s === 'bio') return 'biology';
  if (s === 'math' || s === 'mathematics') return 'math';
  if (s === 'english' || s === 'eng') return 'english';
  return s;
}

export function getTextbook(subjectId: string, grade: Grade, language: LanguageCode = 'am'): SubjectTextbook {
  // Normalize subjectId aliases (e.g., social-studies -> history, ict -> it, civics -> citizenship)
  const mappedId = normalizeSubjectId(subjectId);

  // Get textbook collection for the specified language, falling back to Amharic, then English
  const langCollection = textbooksByLanguage[language] || textbooksDataAmharic;
  let subjectGroup =
    langCollection[mappedId] ||
    langCollection[subjectId] ||
    (mappedId === 'history' ? langCollection['social-studies'] : undefined) ||
    (mappedId === 'it' ? langCollection['ict'] : undefined);

  // If not found in current language, fallback to Amharic collection
  if (!subjectGroup && langCollection !== textbooksDataAmharic) {
    subjectGroup =
      textbooksDataAmharic[mappedId] ||
      textbooksDataAmharic[subjectId] ||
      (mappedId === 'history' ? textbooksDataAmharic['social-studies'] : undefined) ||
      (mappedId === 'it' ? textbooksDataAmharic['ict'] : undefined);
  }

  // If still not found, fallback to English collection
  if (!subjectGroup && langCollection !== textbooksDataEnglish) {
    subjectGroup =
      textbooksDataEnglish[mappedId] ||
      textbooksDataEnglish[subjectId] ||
      (mappedId === 'history' ? textbooksDataEnglish['social-studies'] : undefined) ||
      (mappedId === 'it' ? textbooksDataEnglish['ict'] : undefined);
  }

  if (subjectGroup && subjectGroup[grade]) {
    return subjectGroup[grade]!;
  }

  // Fallback to Grade 9 if requested grade not found, or any grade present in subject
  if (subjectGroup) {
    const fallbackGrade = subjectGroup[9] || subjectGroup[10] || subjectGroup[11] || subjectGroup[12];
    if (fallbackGrade) return fallbackGrade;
  }

  // Ultimate fallback to Math Grade 9 in the selected language or Amharic
  return (
    (langCollection['math'] && langCollection['math'][9]) ||
    textbooksDataAmharic['math'][9]!
  );
}

export function getAllTextbooksForSubject(subjectId: string, language: LanguageCode = 'am'): SubjectTextbook[] {
  const mappedId = normalizeSubjectId(subjectId);

  const langCollection = textbooksByLanguage[language] || textbooksDataAmharic;
  let subjectGroup =
    langCollection[mappedId] ||
    langCollection[subjectId] ||
    (mappedId === 'history' ? langCollection['social-studies'] : undefined) ||
    (mappedId === 'it' ? langCollection['ict'] : undefined);

  if (!subjectGroup && langCollection !== textbooksDataAmharic) {
    subjectGroup =
      textbooksDataAmharic[mappedId] ||
      textbooksDataAmharic[subjectId] ||
      (mappedId === 'history' ? textbooksDataAmharic['social-studies'] : undefined) ||
      (mappedId === 'it' ? textbooksDataAmharic['ict'] : undefined);
  }

  if (!subjectGroup && langCollection !== textbooksDataEnglish) {
    subjectGroup =
      textbooksDataEnglish[mappedId] ||
      textbooksDataEnglish[subjectId] ||
      (mappedId === 'history' ? textbooksDataEnglish['social-studies'] : undefined) ||
      (mappedId === 'it' ? textbooksDataEnglish['ict'] : undefined);
  }

  if (!subjectGroup) return [];
  const list: SubjectTextbook[] = [];
  ([9, 10, 11, 12] as Grade[]).forEach((g) => {
    if (subjectGroup[g]) {
      list.push(subjectGroup[g]!);
    }
  });
  return list;
}
