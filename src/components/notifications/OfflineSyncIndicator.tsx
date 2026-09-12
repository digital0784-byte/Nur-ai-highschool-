import React, { useState } from 'react';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  HardDrive,
  Sliders,
  ChevronDown,
} from 'lucide-react';
import { useOfflineSync } from '../../context/OfflineSyncContext';
import { useLanguage } from '../../context/LanguageContext';

interface OfflineSyncIndicatorProps {
  onOpenOfflineManager?: () => void;
  compact?: boolean;
}

export const OfflineSyncIndicator: React.FC<OfflineSyncIndicatorProps> = ({
  onOpenOfflineManager,
  compact = false,
}) => {
  const {
    isOnline,
    isSimulatedOffline,
    syncStatus,
    pendingCount,
    lastSyncedAt,
    storageQuota,
    toggleSimulatedOffline,
    syncNow,
  } = useOfflineSync();
  const { language } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSyncingLocal, setIsSyncingLocal] = useState(false);

  const handleSyncClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSyncingLocal(true);
    await syncNow();
    setIsSyncingLocal(false);
  };

  const getStatusDisplay = () => {
    if (!isOnline) {
      return {
        label: isSimulatedOffline
          ? language === 'am'
            ? 'ኦፍላይን ፈተሻ (Simulated)'
            : 'Simulated Offline'
          : language === 'am'
          ? 'ኦፍላይን (Offline)'
          : 'Offline',
        color: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-700',
        dot: 'bg-amber-500',
        icon: <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
      };
    }
    if (syncStatus === 'syncing' || isSyncingLocal) {
      return {
        label: language === 'am' ? 'በማመሳሰል ላይ...' : 'Syncing...',
        color: 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-200 dark:border-indigo-700',
        dot: 'bg-indigo-500 animate-pulse',
        icon: <RefreshCw className="w-3.5 h-3.5 text-indigo-600 animate-spin dark:text-indigo-400" />,
      };
    }
    if (syncStatus === 'sync_failed') {
      return {
        label: language === 'am' ? 'ማመሳሰል አልተሳካም' : 'Sync Failed',
        color: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-700',
        dot: 'bg-rose-500',
        icon: <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />,
      };
    }
    if (pendingCount > 0) {
      return {
        label: language === 'am' ? `${pendingCount} የሚመሳሰሉ` : `${pendingCount} Pending`,
        color: 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950 dark:text-sky-200 dark:border-sky-700',
        dot: 'bg-sky-500',
        icon: <RefreshCw className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />,
      };
    }
    return {
      label: language === 'am' ? 'የተመሳሰለ (Synced)' : 'Online & Synced',
      color: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-700',
      dot: 'bg-emerald-500',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
    };
  };

  const status = getStatusDisplay();

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full border text-xs font-bold transition-all hover:shadow-xs cursor-pointer ${status.color}`}
        title="Network & Offline Sync Status"
      >
        <span className={`w-2 h-2 rounded-full ${status.dot}`} />
        {status.icon}
        {!compact && <span>{status.label}</span>}
        {pendingCount > 0 && (
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-500 text-white">
            {pendingCount}
          </span>
        )}
        <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div
          className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-[#211F26] border border-gray-200 dark:border-[#36343B] shadow-xl z-50 p-3 text-xs space-y-3"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
            <div className="font-black text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-[#6750A4]" />
              <span>የኦፍላይንና ማመሳሰል ሁኔታ</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>

          {/* Sync Stats */}
          <div className="space-y-1.5 text-gray-600 dark:text-gray-300">
            <div className="flex items-center justify-between">
              <span>ያልተመሳሰሉ (Pending):</span>
              <span className="font-black text-amber-600">{pendingCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>የወረዱ ትምህርቶች (Cached):</span>
              <span className="font-black">{storageQuota.cachedLessonsCount + storageQuota.cachedUnitsCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>የተያዘ ማከማቻ (Storage):</span>
              <span className="font-black">{Math.round(storageQuota.usedBytes / 1024)} KB / 50 MB</span>
            </div>
            {lastSyncedAt && (
              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <span>የመጨረሻ ማመሳሰል:</span>
                <span>{new Date(lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={handleSyncClick}
                disabled={!isOnline || isSyncingLocal}
                className="flex-1 px-3 py-1.5 rounded-xl font-bold bg-[#6750A4] text-white hover:bg-[#523e85] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingLocal ? 'animate-spin' : ''}`} />
                <span>አሁን አመሳስል (Sync)</span>
              </button>

              <button
                onClick={() => {
                  toggleSimulatedOffline();
                }}
                className={`px-3 py-1.5 rounded-xl font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                  isSimulatedOffline
                    ? 'bg-amber-500 text-white border-amber-600'
                    : 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-200'
                }`}
                title="Toggle simulated offline mode for testing"
              >
                {isSimulatedOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
                <span>{isSimulatedOffline ? 'ኦፍላይን ይጥፋ' : 'ኦፍላይን ሞክር'}</span>
              </button>
            </div>

            {onOpenOfflineManager && (
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  onOpenOfflineManager();
                }}
                className="w-full py-1.5 text-center text-xs font-bold text-[#6750A4] dark:text-[#D0BCFF] hover:underline cursor-pointer flex items-center justify-center gap-1"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>የሙሉ ማከማቻና ኦፍላይን አስተዳዳሪ</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
