import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Star,
  Plus,
  CheckCircle2,
  Clock,
  Send,
  User,
  ShieldCheck,
  Filter,
  Sparkles,
  HelpCircle,
  ThumbsUp,
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { useAuth } from '../../context/AuthContext';
import { SystemFeedback, FeedbackCategory } from '../../types/subscription';
import { subscriptionService } from '../../services/subscriptionService';
import { SystemFeedbackModal } from './SystemFeedbackModal';

export const SystemFeedbackView: React.FC = () => {
  const { user, userProfile } = useAuth();
  const { isOwnerSuperAdmin } = useSubscription();

  const [feedbacks, setFeedbacks] = useState<SystemFeedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [adminResponseInput, setAdminResponseInput] = useState<{ [feedbackId: string]: string }>({});
  const [respondingId, setRespondingId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscriptionService.subscribeToFeedbacks((data) => {
      setFeedbacks(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filteredFeedbacks = feedbacks.filter((f) => {
    if (selectedCategory !== 'all' && f.category !== selectedCategory) return false;
    return true;
  });

  const handleAdminRespond = async (feedbackId: string) => {
    const responseText = adminResponseInput[feedbackId];
    if (!responseText?.trim()) return;

    setRespondingId(feedbackId);
    try {
      await subscriptionService.respondToFeedback(
        feedbackId,
        responseText.trim(),
        'ADDRESSED'
      );
      setAdminResponseInput({ ...adminResponseInput, [feedbackId]: '' });
    } catch (err) {
      alert('Error saving response');
    } finally {
      setRespondingId(null);
    }
  };

  return (
    <div id="system-feedback-view" className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-[#38332D] text-[#FAF6EC] p-5 sm:p-7 rounded-2xl shadow-md border border-[#4A4237] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 text-amber-300 text-xs font-bold rounded-full mb-2 border border-amber-400/30">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>የተጠቃሚዎች አስተያዬት መስጫ ማዕከል</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-ethiopic text-white">
            ስለ ኑር AI ሲስተም አስተያዬትና ግብረ-መልስ
          </h2>
          <p className="text-xs sm:text-sm text-[#D8CEBC] mt-1 font-serif-ethiopic max-w-xl">
            ተጠቃሚዎች ስለ ስርዓቱ፣ ስለ ትምህርት ይዘቱ እና ስለ ክፍያ ሂደቱ የሚያጋሯቸው አስተያየቶችና ጥቆማዎች።
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-[#2E6B4A] hover:bg-[#24543a] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>አስተያዬት ስጥ (Give Feedback)</span>
        </button>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-[#38332D] text-white'
              : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
          }`}
        >
          ሁሉም ({feedbacks.length})
        </button>
        <button
          onClick={() => setSelectedCategory('general')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            selectedCategory === 'general'
              ? 'bg-[#38332D] text-white'
              : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
          }`}
        >
          አጠቃላይ
        </button>
        <button
          onClick={() => setSelectedCategory('learning_experience')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            selectedCategory === 'learning_experience'
              ? 'bg-[#38332D] text-white'
              : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
          }`}
        >
          የትምህርት ጥራት
        </button>
        <button
          onClick={() => setSelectedCategory('payment_process')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            selectedCategory === 'payment_process'
              ? 'bg-[#38332D] text-white'
              : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
          }`}
        >
          የክፍያ ሂደት
        </button>
        <button
          onClick={() => setSelectedCategory('technical_issue')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            selectedCategory === 'technical_issue'
              ? 'bg-[#38332D] text-white'
              : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
          }`}
        >
          ቴክኒካል ጉዳይ
        </button>
      </div>

      {/* Feedbacks List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 text-stone-500">
            <div className="w-8 h-8 border-2 border-stone-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span className="text-xs">አስተያየቶችን በመጫን ላይ...</span>
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="bg-[#FAF6EC] border border-[#38332D]/30 rounded-2xl p-10 text-center space-y-3">
            <MessageSquare className="w-10 h-10 text-stone-400 mx-auto" />
            <h3 className="font-bold text-sm text-stone-800 font-serif-ethiopic">
              እስካሁን ምንም አስተያየት አልተሰጠም
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              እርስዎ የመጀመሪያው አስተያየት ሰጪ ይሁኑ! ስለ ስርዓቱ ያሎትን አስተያየት ከላይ ባለው ቁልፍ ያጋሩን።
            </p>
          </div>
        ) : (
          filteredFeedbacks.map((item) => (
            <div
              key={item.id}
              className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl p-4 sm:p-5 shadow-xs space-y-3"
            >
              {/* User Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#EAE2CE] border border-[#38332D]/40 text-stone-800 flex items-center justify-center font-bold text-xs">
                    {item.userName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-stone-900 font-serif-ethiopic">
                        {item.userName}
                      </span>
                      {item.grade && (
                        <span className="px-2 py-0.5 bg-stone-200 text-stone-700 text-[10px] font-bold rounded">
                          ክፍል {item.grade}
                        </span>
                      )}
                      {item.userRole === 'teacher' && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
                          መምህር
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-500">
                      {new Date(item.createdAt).toLocaleDateString('am-ET')}
                    </span>
                  </div>
                </div>

                {/* Stars Rating */}
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= item.rating
                          ? 'text-amber-500 fill-amber-400'
                          : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Feedback Text */}
              <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-serif-ethiopic bg-white/70 p-3 rounded-lg border border-stone-200">
                {item.comment}
              </p>

              {/* Admin Response if exists */}
              {item.adminResponse && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>የኑር AI አስተዳዳሪ ምላሽ፡</span>
                  </div>
                  <p className="text-xs text-emerald-800 font-serif-ethiopic leading-relaxed">
                    {item.adminResponse}
                  </p>
                </div>
              )}

              {/* Super Admin Reply Box (Only for Super Admin) */}
              {isOwnerSuperAdmin && !item.adminResponse && (
                <div className="pt-2 border-t border-stone-200 space-y-2">
                  <span className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>የአስተዳዳሪ ምላሽ ጻፍ (SUPER_ADMIN Response):</span>
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ለዚህ አስተያየት ምላሽ ይጻፉ..."
                      value={adminResponseInput[item.id] || ''}
                      onChange={(e) =>
                        setAdminResponseInput({
                          ...adminResponseInput,
                          [item.id]: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500"
                    />
                    <button
                      type="button"
                      disabled={respondingId === item.id}
                      onClick={() => handleAdminRespond(item.id)}
                      className="px-3 py-1.5 bg-[#2E6B4A] hover:bg-[#235338] text-white text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>መልስ</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Feedback Modal */}
      <SystemFeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
