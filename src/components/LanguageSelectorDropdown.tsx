import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode } from '../types';

interface LanguageSelectorDropdownProps {
  theme?: 'parchment' | 'slate' | 'dark';
  className?: string;
  compactOnMobile?: boolean;
}

export const LanguageSelectorDropdown: React.FC<LanguageSelectorDropdownProps> = ({
  theme = 'parchment',
  className = '',
  compactOnMobile = true,
}) => {
  const { language, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectLanguage = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  // Determine styling based on theme
  const getButtonStyles = () => {
    switch (theme) {
      case 'dark':
        return 'bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-slate-700 focus:ring-emerald-500/30';
      case 'slate':
        return 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 shadow-2xs focus:ring-emerald-500/20';
      case 'parchment':
      default:
        return 'bg-white hover:bg-stone-50 text-[#1E1B18] border border-[#D5C9AC] shadow-xs focus:ring-amber-500/20';
    }
  };

  const getDropdownStyles = () => {
    switch (theme) {
      case 'dark':
        return 'bg-slate-900 border-slate-700 text-slate-100 shadow-xl';
      case 'slate':
        return 'bg-white border-slate-200 text-slate-900 shadow-xl';
      case 'parchment':
      default:
        return 'bg-[#FCF9F2] border-[#D5C9AC] text-[#1E1B18] shadow-lg';
    }
  };

  return (
    <div
      ref={containerRef}
      id="unified-header-language-selector"
      className={`relative inline-block text-left ${className}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        title={language === 'am' ? 'ቋንቋ ምረጥ / Change Language' : 'Change Language / ቋንቋ ምረጥ'}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none focus:outline-none focus:ring-2 active:scale-97 ${getButtonStyles()}`}
      >
        <Globe
          className={`w-3.5 h-3.5 shrink-0 ${
            theme === 'dark'
              ? 'text-emerald-400'
              : theme === 'slate'
              ? 'text-emerald-700'
              : 'text-emerald-800'
          }`}
        />
        <span className="px-1 py-0.2 rounded bg-emerald-100/70 text-emerald-900 font-black text-[10px] tracking-tight">
          {currentLang.flagOrLabel}
        </span>
        <span
          className={`font-serif-ethiopic text-xs font-bold ${
            compactOnMobile ? 'hidden sm:inline-block' : 'inline-block'
          }`}
        >
          {currentLang.nativeName}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-stone-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Language options"
          className={`absolute right-0 mt-1.5 w-52 rounded-2xl border p-1.5 z-50 transition-all transform origin-top-right focus:outline-none ${getDropdownStyles()}`}
        >
          <div className="px-2.5 py-1.5 border-b border-stone-200/60 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 font-serif-ethiopic block">
              {language === 'am' ? '🌐 ቋንቋ ምረጥ' : '🌐 Select Language'}
            </span>
          </div>

          <div className="space-y-0.5">
            {languages.map((l) => {
              const isSelected = language === l.code;
              return (
                <button
                  key={l.code}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectLanguage(l.code as LanguageCode)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : theme === 'dark'
                      ? 'text-slate-200 hover:bg-slate-800'
                      : 'text-[#2D2823] hover:bg-emerald-50/70 hover:text-emerald-900'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-6 h-5 rounded flex items-center justify-center text-[10.5px] font-black shrink-0 ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-stone-200/80 text-stone-700'
                      }`}
                    >
                      {l.flagOrLabel}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="truncate font-bold font-serif-ethiopic leading-tight">
                        {l.nativeName}
                      </span>
                      <span
                        className={`text-[10px] truncate leading-tight ${
                          isSelected ? 'text-white/80' : 'text-stone-500'
                        }`}
                      >
                        {l.name}
                      </span>
                    </div>
                  </div>

                  {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
