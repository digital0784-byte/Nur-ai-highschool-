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

export function getTextbook(subjectId: string, grade: Grade, language: LanguageCode = 'am'): SubjectTextbook {
  // Normalize subjectId aliases
  let mappedId = subjectId;
  if (subjectId === 'civics') mappedId = 'citizenship';
  if (subjectId === 'social') mappedId = 'history';

  // Get textbook collection for the specified language, falling back to Amharic, then English
  const langCollection = textbooksByLanguage[language] || textbooksDataAmharic;
  let subjectGroup = langCollection[mappedId] || langCollection[subjectId];

  // If not found in current language, fallback to Amharic collection
  if (!subjectGroup && langCollection !== textbooksDataAmharic) {
    subjectGroup = textbooksDataAmharic[mappedId] || textbooksDataAmharic[subjectId];
  }

  // If still not found, fallback to English collection
  if (!subjectGroup && langCollection !== textbooksDataEnglish) {
    subjectGroup = textbooksDataEnglish[mappedId] || textbooksDataEnglish[subjectId];
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
  let mappedId = subjectId;
  if (subjectId === 'civics') mappedId = 'citizenship';
  if (subjectId === 'social') mappedId = 'history';

  const langCollection = textbooksByLanguage[language] || textbooksDataAmharic;
  let subjectGroup = langCollection[mappedId] || langCollection[subjectId];

  if (!subjectGroup && langCollection !== textbooksDataAmharic) {
    subjectGroup = textbooksDataAmharic[mappedId] || textbooksDataAmharic[subjectId];
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
