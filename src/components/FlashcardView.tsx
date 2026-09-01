import React, { useState, useEffect } from 'react';
import { Topic, Subject } from '../types';
import { ChevronLeft, ChevronRight, RotateCw, Check, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FlashcardViewProps {
  topic: Topic;
  subject: Subject;
}

export const FlashcardView: React.FC<FlashcardViewProps> = ({ topic, subject }) => {
  const { t, isRtl } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flip and index when topic changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [topic.id]);

  const cards = topic.flashcards;
  const currentCard = cards[currentIndex] || cards[0];

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 150);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((prev) => prev - 1), 150);
    }
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === 'ArrowRight') {
        if (isRtl) handlePrev();
        else handleNext();
      } else if (e.key === 'ArrowLeft') {
        if (isRtl) handleNext();
        else handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, cards.length, isRtl]);

  return (
    <div id="flashcard-view-container" className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      {/* Top Meta Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-[1.5px] border-[#38332D] pb-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5A5143]">
            {t.flashcardsSubtitle}
          </span>
          <h3 className="font-serif-ethiopic text-base sm:text-lg font-bold text-[#1E1B18]">
            {topic.title}
          </h3>
        </div>

        {/* Counter Badge */}
        <div
          id="flashcard-counter-badge"
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EDE6D4] border-[1.5px] border-[#38332D] text-xs font-mono font-bold text-[#1E1B18] self-start sm:self-auto"
        >
          <span>{t.cardLabel}</span>
          <span className="text-sm font-bold" style={{ color: subject.accentColor }}>
            {currentIndex + 1}
          </span>
          <span>{t.ofLabel}</span>
          <span>{cards.length}</span>
        </div>
      </div>

      {/* 3D Flashcard Presentation Container */}
      <div className="perspective-1000 w-full min-h-[280px] sm:min-h-[320px]">
        <div
          id={`flashcard-${currentCard.id}`}
          onClick={handleFlip}
          role="button"
          tabIndex={0}
          aria-label={isFlipped ? `${t.cardBackTag}: ${currentCard.back}` : `${t.cardFrontTag}: ${currentCard.front}`}
          className={`relative w-full h-full min-h-[280px] sm:min-h-[320px] cursor-pointer transition-transform duration-500 transform-style-preserve-3d select-none ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* FRONT SIDE (Question / Term) */}
          <div
            className="absolute inset-0 w-full h-full backface-hidden border-[2px] border-[#38332D] bg-[#FAF6EC] p-6 sm:p-8 flex flex-col justify-between shadow-sm"
            style={{
              borderTop: `6px solid ${subject.accentColor}`,
            }}
          >
            {/* Top Bar on Card Front */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A705E] bg-[#EFE8D6] px-2 py-0.5 border border-[#DCD3BE]">
                {t.cardFrontTag}
              </span>
              <span className="text-xs font-serif-ethiopic text-[#7A705E] flex items-center gap-1">
                <RotateCw className="w-3 h-3 animate-spin-slow" />
                {t.tapToFlipPrompt}
              </span>
            </div>

            {/* Front Content */}
            <div className="my-auto py-4 text-center">
              <p className="font-serif-ethiopic text-lg sm:text-2xl font-bold text-[#1E1B18] leading-relaxed">
                {currentCard.front}
              </p>
            </div>

            {/* Bottom prompt on Card Front */}
            <div className="pt-3 border-t border-[#38332D]/15 flex items-center justify-center gap-2 text-xs text-[#5A5143] font-medium">
              <RotateCw className="w-3.5 h-3.5 text-[#7A705E]" />
              <span>{t.tapToFlipPrompt}</span>
            </div>
          </div>

          {/* BACK SIDE (Answer / Definition) */}
          <div
            className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 border-[2px] border-[#38332D] bg-[#F7F2E2] p-6 sm:p-8 flex flex-col justify-between shadow-sm"
            style={{
              borderTop: `6px solid #15803D`, // green accent indicating answer/knowledge
            }}
          >
            {/* Top Bar on Card Back */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 border border-emerald-300 flex items-center gap-1">
                <Check className="w-3 h-3" />
                {t.cardBackTag}
              </span>
              <span className="text-xs text-[#7A705E] flex items-center gap-1">
                <RotateCw className="w-3 h-3" />
                {t.flipBackPrompt}
              </span>
            </div>

            {/* Back Content */}
            <div className="my-auto py-4 text-center">
              <p className="font-serif-ethiopic text-base sm:text-xl font-semibold text-[#1E1B18] leading-relaxed">
                {currentCard.back}
              </p>
            </div>

            {/* Bottom prompt on Card Back */}
            <div className="pt-3 border-t border-[#38332D]/15 flex items-center justify-center gap-2 text-xs text-[#5A5143] font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.nextCardPrompt}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls & Dot Indicators */}
      <div
        id="flashcard-controls"
        className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-[1.5px] border-[#38332D] bg-[#EFE8D6]"
      >
        {/* Previous Button */}
        <button
          id="flashcard-prev-btn"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex items-center gap-1 px-4 py-2 text-xs sm:text-sm font-bold border-[1.5px] border-[#38332D] transition-all cursor-pointer ${
            currentIndex === 0
              ? 'opacity-40 bg-[#DDD4BE] cursor-not-allowed text-[#7A705E]'
              : 'bg-[#FAF6EC] hover:bg-[#E5DCB9] text-[#1E1B18] active:translate-y-0.5'
          }`}
        >
          {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {t.prevCardBtn}
        </button>

        {/* Center Flip Trigger & Progress Dots */}
        <div className="flex flex-col items-center gap-2">
          <button
            id="flashcard-flip-btn"
            onClick={handleFlip}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold border border-[#38332D] bg-[#FAF6EC] hover:bg-[#EAE2CE] text-[#38332D] cursor-pointer"
          >
            <RotateCw className="w-3 h-3" />
            {isFlipped ? t.flipToQuestionBtn : t.flipCardBtn}
          </button>

          {/* Dots */}
          <div className="flex items-center gap-1.5" aria-label="flashcard navigation dots">
            {cards.map((c, i) => (
              <button
                key={c.id}
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentIndex(i);
                }}
                className={`w-2.5 h-2.5 rounded-full border border-[#38332D] transition-all cursor-pointer ${
                  i === currentIndex
                    ? 'w-6 bg-[#38332D]'
                    : 'bg-[#FAF6EC] hover:bg-[#DCD3BE]'
                }`}
                aria-label={`${t.cardLabel} ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Next Button */}
        <button
          id="flashcard-next-btn"
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className={`flex items-center gap-1 px-4 py-2 text-xs sm:text-sm font-bold border-[1.5px] border-[#38332D] transition-all cursor-pointer ${
            currentIndex === cards.length - 1
              ? 'opacity-40 bg-[#DDD4BE] cursor-not-allowed text-[#7A705E]'
              : 'bg-[#FAF6EC] hover:bg-[#E5DCB9] text-[#1E1B18] active:translate-y-0.5'
          }`}
        >
          {t.nextCardBtn}
          {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
