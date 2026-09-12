import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  Settings,
  Trash2,
  ExternalLink,
  BookOpen,
  HelpCircle,
  Award,
  AlertTriangle,
  Sparkles,
  Megaphone,
  CheckCircle2,
  Clock,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationItem, NotificationType } from '../../types/notifications';
import { NotificationPreferencesModal } from './NotificationPreferencesModal';

export const NotificationBell: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    triggerDeepLink,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'assessment' | 'lesson' | 'ai' | 'system'>('all');
  const [isPrefsOpen, setIsPrefsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const filterNotifications = (items: NotificationItem[]) => {
    switch (activeFilter) {
      case 'unread':
        return items.filter((n) => !n.readAt);
      case 'assessment':
        return items.filter((n) =>
          ['new_quiz', 'new_exam', 'assignment', 'assignment_deadline', 'quiz_exam_result'].includes(n.type)
        );
      case 'lesson':
        return items.filter((n) => ['new_lesson', 'new_curriculum_content'].includes(n.type));
      case 'ai':
        return items.filter((n) => ['ai_recommendation', 'weak_topic_alert'].includes(n.type));
      case 'system':
        return items.filter((n) => ['system_announcement', 'admin_notification'].includes(n.type));
      case 'all':
      default:
        return items;
    }
  };

  const filteredList = filterNotifications(notifications);

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'new_lesson':
      case 'new_curriculum_content':
        return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case 'new_quiz':
      case 'assignment':
      case 'assignment_deadline':
        return <HelpCircle className="w-4 h-4 text-blue-400" />;
      case 'new_exam':
      case 'quiz_exam_result':
        return <Award className="w-4 h-4 text-amber-400" />;
      case 'ai_recommendation':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'weak_topic_alert':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'system_announcement':
      case 'admin_notification':
      default:
        return <Megaphone className="w-4 h-4 text-teal-400" />;
    }
  };

  const formatRelativeTime = (dateStr: string) => {
    try {
      const now = Date.now();
      const past = new Date(dateStr).getTime();
      const diffMinutes = Math.floor((now - past) / (1000 * 60));

      if (diffMinutes < 1) return 'አሁን / Just now';
      if (diffMinutes < 60) return `${diffMinutes} ደቂቃ በፊት / ${diffMinutes}m ago`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours} ሰዓት በፊት / ${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} ቀን በፊት / ${diffDays}d ago`;
    } catch {
      return '';
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell Button */}
      <button
        id="notification-bell-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        title="ማሳወቂያዎች (Notifications)"
        aria-label="Open notifications"
      >
        <Bell className="w-5 h-5" />

        {unreadCount > 0 && (
          <span
            id="notification-unread-badge"
            className="absolute -top-1 -right-1 flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-rose-500 text-white text-[11px] font-extrabold shadow-lg animate-pulse"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Drawer Dropdown */}
      {isOpen && (
        <div
          id="notification-drawer-dropdown"
          className="absolute right-0 mt-2 w-96 sm:w-[420px] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 text-slate-100"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/95 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">ማሳወቂያዎች</span>
              <span className="text-xs text-slate-400">({notifications.length})</span>
              {unreadCount > 0 && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {unreadCount} አዲስ
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-2.5 py-1 rounded-lg text-xs text-emerald-400 hover:bg-emerald-950/50 hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
                  title="ሁሉንም አንብብ"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>ሁሉንም አንብብ</span>
                </button>
              )}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsPrefsOpen(true);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="የማሳወቂያ ምርጫዎች"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-3 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              ሁሉም ({notifications.length})
            </button>
            <button
              onClick={() => setActiveFilter('unread')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === 'unread'
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              ያልተነበቡ ({unreadCount})
            </button>
            <button
              onClick={() => setActiveFilter('assessment')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === 'assessment'
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              ፈተናዎች
            </button>
            <button
              onClick={() => setActiveFilter('lesson')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === 'lesson'
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              ትምህርቶች
            </button>
            <button
              onClick={() => setActiveFilter('ai')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === 'ai'
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              AI ጥቆማ
            </button>
            <button
              onClick={() => setActiveFilter('system')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === 'system'
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              ማስታወቂያ
            </button>
          </div>

          {/* Notification Items List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-800/60">
            {filteredList.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500 mb-3">
                  <Bell className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-300">ምንም ማሳወቂያ የለም</p>
                <p className="text-xs text-slate-500 mt-1">አዳዲስ ትምህርቶችና ፈተናዎች ሲኖሩ እዚህ ይደርስዎታል</p>
              </div>
            ) : (
              filteredList.map((item) => {
                const isUnread = !item.readAt;
                return (
                  <div
                    key={item.id}
                    className={`p-3.5 transition-colors group flex items-start gap-3 hover:bg-slate-800/70 cursor-pointer ${
                      isUnread ? 'bg-emerald-950/15 border-l-2 border-emerald-500' : ''
                    }`}
                    onClick={() => triggerDeepLink(item.deepLink, item.id)}
                  >
                    {/* Icon */}
                    <div className="p-2 rounded-xl bg-slate-800 border border-slate-700/60 shrink-0 mt-0.5">
                      {getTypeIcon(item.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h5 className={`text-xs leading-snug truncate ${isUnread ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>
                          {item.title}
                        </h5>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        )}
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {item.body}
                      </p>

                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatRelativeTime(item.createdAt)}
                        </span>

                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => triggerDeepLink(item.deepLink, item.id)}
                            className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 transition-colors"
                          >
                            <span>ክፈት</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => deleteNotification(item.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-colors"
                            title="አጥፋ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="text-[11px] font-mono text-emerald-400">
              ● FCM Push Active
            </span>
            <button
              onClick={() => {
                setIsOpen(false);
                setIsPrefsOpen(true);
              }}
              className="text-xs font-semibold text-emerald-400 hover:underline cursor-pointer"
            >
              የማሳወቂያ ማስተካከያ (Settings) →
            </button>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      <NotificationPreferencesModal
        isOpen={isPrefsOpen}
        onClose={() => setIsPrefsOpen(false)}
      />
    </div>
  );
};
