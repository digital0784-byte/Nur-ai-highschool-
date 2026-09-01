import { LanguageCode, Subject } from '../types';
import { curriculumAmharic } from './curriculum_am';
import { curriculumEnglish } from './curriculum_en';
import { curriculumTigrinya } from './curriculum_ti';
import { curriculumOromo } from './curriculum_om';
import { curriculumArabic } from './curriculum_ar';
import { curriculumSomali } from './curriculum_so';

export {
  curriculumAmharic,
  curriculumEnglish,
  curriculumTigrinya,
  curriculumOromo,
  curriculumArabic,
  curriculumSomali,
};

export const curriculumByLanguage: Record<LanguageCode, Subject[]> = {
  am: curriculumAmharic,
  en: curriculumEnglish,
  ti: curriculumTigrinya,
  om: curriculumOromo,
  ar: curriculumArabic,
  so: curriculumSomali,
};

export function getCurriculum(language: LanguageCode): Subject[] {
  return curriculumByLanguage[language] || curriculumAmharic;
}

// Default export for backwards compatibility
export const subjectsData: Subject[] = curriculumAmharic;
