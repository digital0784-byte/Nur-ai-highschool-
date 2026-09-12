import React, { useState } from 'react';
import {
  MessageSquare,
  Star,
  Send,
  CheckCircle2,
  AlertTriangle,
  X,
  HelpCircle,
  Lightbulb,
  Cpu,
  CreditCard,
  BookOpen,
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { useAuth } from '../../context/AuthContext';
import { FeedbackCategory } from '../../types/subscription';

interface SystemFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemFeedbackModal: React.FC<SystemFeedbackModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, userProfile, openAuthModal } = useAuth();
  const { submitFeedback } = useSubscription();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [category, setCategory] = useState<FeedbackCategory>('general');
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories: { id: FeedbackCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: 'አጠቃላይ አስተያዬት (General)', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { id: 'learning_experience', label: 'የትምህርት ይዘት (Curriculum)', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'payment_process', label: 'የክፍያና ሳብስክሪፕሽን (Payment)', icon: <CreditCard className="w-3.5 h-3.5" /> },
    { id: 'technical_issue', label: 'ቴክኒካል ችግር / Bug', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'feature_request', label: 'አዲስ ሃሳብና ጥቆማ (Ideas)', icon: <Lightbulb className="w-3.5 h-3.5" /> },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!user) {
      openAuthModal('login');
      return;
    }

    if (!comment.trim()) {
      setErrorMsg('እባክዎ አስተያየትዎን ይጻፉ (Please enter your comments)');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitFeedback({
        rating,
        category,
        comment: comment.trim(),
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setComment('');
        onClose();
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || 'አስተያየት ማስገባት አልተቻለም');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF6EC] border-[2px] border-[#38332D] max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl p-5 sm:p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#38332D]/30 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#38332D] text-[#FAF6EC] flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base font-serif-ethiopic text-[#1E1B18]">
                ስለ ሲስተሙ አስተያዬት መስጫ
              </h3>
              <p className="text-[11px] text-stone-500">
                የኑር AI አጠቃቀምዎን ለማሻሻል አስተያዬትዎን ያጋሩን
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-stone-200 text-stone-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-base font-serif-ethiopic text-stone-900">
              አስተያዬትዎ በተሳካ ሁኔታ ደርሶናል!
            </h4>
            <p className="text-xs text-stone-600 font-serif-ethiopic max-w-xs mx-auto">
              ለሰጡን ጠቃሚ ግብረ-መልስ ከልብ እናመሰግናለን። የኑር AI አስተዳዳሪዎች አስተያዬትዎን ተመልክተው እርምጃ ይወስዳሉ።
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-300 text-rose-900 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Rating Stars */}
            <div>
              <label className="block font-bold text-stone-800 mb-1.5 font-serif-ethiopic">
                አጠቃላይ ደረጃ ይስጡ (Rating):
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 text-stone-300 hover:text-amber-500 cursor-pointer transition-colors"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating !== null ? star <= hoverRating : star <= rating)
                          ? 'text-amber-500 fill-amber-400'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 font-bold text-stone-700">
                  {rating === 5 && '🌟 እጅግ በጣም ምርጥ'}
                  {rating === 4 && '👍 በጣም ጥሩ'}
                  {rating === 3 && '👌 መካከለኛ'}
                  {rating === 2 && '👎 ማሻሻያ ያስፈልገዋል'}
                  {rating === 1 && '⚠️ ደካማ'}
                </span>
              </div>
            </div>

            {/* Category Select */}
            <div>
              <label className="block font-bold text-stone-800 mb-1.5 font-serif-ethiopic">
                የአስተያየት ዘርፍ (Category):
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {categories.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-2 rounded-lg border text-left flex items-center gap-1.5 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#2E6B4A] bg-[#EAF3ED] font-bold text-[#2E6B4A]'
                          : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {cat.icon}
                      <span className="truncate">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comments textarea */}
            <div>
              <label className="block font-bold text-stone-800 mb-1 font-serif-ethiopic">
                አስተያየትዎን፣ ያጋጠመዎትን ችግር ወይም ጥቆማዎን በዝርዝር ይጻፉ፡ *
              </label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="ለምሳሌ፡ የ 10ኛ ክፍል ፊዚክስ ማብራሪያው በጣም ግልጽ ነው ነገር ግን ተጨማሪ ጥያቄዎች ቢኖሩት... ወይም የቴሌብር ክፍያ ማረጋገጫ ጋር በተያያዘ..."
                className="w-full p-3 bg-white border border-[#38332D]/40 rounded-xl focus:outline-none focus:border-[#2E6B4A] text-xs font-serif-ethiopic"
              />
            </div>

            {/* Submit button */}
            <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#38332D]/20">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-stone-600 hover:bg-stone-200 rounded-lg font-semibold cursor-pointer"
              >
                ዝጋ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-[#2E6B4A] hover:bg-[#235338] text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'በመላክ ላይ...' : 'አስተያዬት ላክ (Submit)'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
