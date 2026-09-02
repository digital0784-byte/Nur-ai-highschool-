import { LanguageCode, SupplementaryBook } from '../types';
import { supplementaryBooksAmharic } from './supplementary/supplementary_am';
import { supplementaryBooksEnglish } from './supplementary/supplementary_en';
import { supplementaryBooksOromo } from './supplementary/supplementary_om';
import { supplementaryBooksTigrinya } from './supplementary/supplementary_ti';
import { supplementaryBooksArabic } from './supplementary/supplementary_ar';
import { supplementaryBooksSomali } from './supplementary/supplementary_so';

export {
  supplementaryBooksAmharic,
  supplementaryBooksEnglish,
  supplementaryBooksOromo,
  supplementaryBooksTigrinya,
  supplementaryBooksArabic,
  supplementaryBooksSomali,
};

export const supplementaryBooksByLanguage: Record<LanguageCode, SupplementaryBook[]> = {
  am: supplementaryBooksAmharic,
  en: supplementaryBooksEnglish,
  om: supplementaryBooksOromo,
  ti: supplementaryBooksTigrinya,
  ar: supplementaryBooksArabic,
  so: supplementaryBooksSomali,
};

// Default export for backwards compatibility
export const supplementaryBooksData: SupplementaryBook[] = supplementaryBooksAmharic;

export function getSupplementaryBooks(language: LanguageCode = 'am'): SupplementaryBook[] {
  return supplementaryBooksByLanguage[language] || supplementaryBooksAmharic;
}
