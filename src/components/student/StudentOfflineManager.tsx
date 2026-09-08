import React, { useState, useEffect } from 'react';
import {
  Download,
  Wifi,
  WifiOff,
  RefreshCw,
  Trash2,
  HardDrive,
  Cpu,
  CheckCircle,
  Database,
  ArrowRight,
  BatteryCharging,
} from 'lucide-react';
import { OfflineCachedUnit } from '../../types/studentApp';
import { studentAppFirestore } from '../../services/studentAppFirestore';

interface StudentOfflineManagerProps {
  darkMode: boolean;
  lowDataMode: boolean;
  onToggleLowDataMode: (enabled: boolean) => void;
  onOpenCachedUnit: (cached: OfflineCachedUnit) => void;
}

export const StudentOfflineManager: React.FC<StudentOfflineManagerProps> = ({
  darkMode,
  lowDataMode,
  onToggleLowDataMode,
  onOpenCachedUnit,
}) => {
  const [cachedUnits, setCachedUnits] = useState<OfflineCachedUnit[]>([]);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  useEffect(() => {
    loadCachedUnits();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadCachedUnits = () => {
    setCachedUnits(studentAppFirestore.getCachedUnits());
  };

  const handleRemoveUnit = (unitId: string) => {
    studentAppFirestore.removeUnitOffline(unitId);
    loadCachedUnits();
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncSuccess(false);
    await studentAppFirestore.processOfflineQueue();
    setIsSyncing(false);
    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 3000);
  };

  const totalBytes = cachedUnits.reduce((acc, u) => acc + (u.sizeBytes || 0), 0);
  const totalKB = Math.round(totalBytes / 1024);

  const bgCard = darkMode ? 'bg-[#211F26] border-[#36343B]' : 'bg-white border-[#E6E0E9]';
  const textPrimary = darkMode ? 'text-[#E6E1E5]' : 'text-[#1D1B20]';
  const textSecondary = darkMode ? 'text-[#CAC4D0]' : 'text-[#49454F]';

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E0E9] dark:border-[#36343B]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase bg-[#EADDFF] text-[#21005D] dark:bg-[#4F378B] dark:text-[#EADDFF]">
            <HardDrive className="w-3.5 h-3.5" />
            <span>የኦፍላይንና ማከማቻ አስተዳዳሪ (Offline Learning & Storage)</span>
          </div>
          <h1 className={`text-xl sm:text-2xl font-black ${textPrimary} mt-1`}>
            ያለ ኢንተርኔት መማርና ዳታ ቆጣቢ ሁነታ
          </h1>
          <p className={`text-xs ${textSecondary}`}>
            የወረዱ ምዕራፎች፣ የማከማቻ መጠን እና አውቶማቲክ የሂደት ማመሳሰል (Auto-sync queue)።
          </p>
        </div>

        {/* Network Badge */}
        <div
          className={`px-4 py-2 rounded-2xl border text-xs font-black flex items-center gap-2 ${
            isOnline
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300'
              : 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300'
          }`}
        >
          {isOnline ? <Wifi className="w-4 h-4 text-emerald-600" /> : <WifiOff className="w-4 h-4 text-amber-600" />}
          <span>{isOnline ? 'መስመር ላይ (Online)' : 'ኦፍላይን ሁነታ (Offline)'}</span>
        </div>
      </div>

      {/* Low-End Device Mode Card */}
      <div className={`rounded-3xl p-6 border-[1.5px] shadow-xs space-y-4 ${bgCard}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`text-sm sm:text-base font-black ${textPrimary}`}>
                ዝቅተኛ ራም ላላቸው መሳሪያዎች ዳታ ቆጣቢ ሁነታ (Low-RAM Optimizer)
              </h3>
              <p className={`text-xs ${textSecondary}`}>
                የከባዱን ምስሎችና አኒሜሽኖችን በማጥፋት አነስተኛ ባትሪና ማከማቻ ይጠቀማል።
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={lowDataMode}
              onChange={(e) => onToggleLowDataMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6750A4]"></div>
          </label>
        </div>
      </div>

      {/* Storage & Auto Sync Card */}
      <div className={`rounded-3xl p-6 border-[1.5px] shadow-xs space-y-4 ${bgCard}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className={`text-sm sm:text-base font-black ${textPrimary}`}>
              የተያዘ የአካባቢ ማከማቻ (Local Device Cache)
            </h3>
            <p className={`text-xs ${textSecondary}`}>
              {cachedUnits.length} ምዕራፎች ወርደዋል • ድምር መጠን፡ {totalKB} KB
            </p>
          </div>

          <button
            onClick={handleManualSync}
            disabled={isSyncing || !isOnline}
            className="px-4 py-2.5 rounded-full text-xs font-black bg-[#6750A4] text-white hover:bg-[#523e85] transition-all flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'በማመሳሰል ላይ...' : 'ሂደትን አሁን አመሳስል (Sync Now)'}</span>
          </button>
        </div>

        {syncSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>ሁሉም የኦፍላይን ጥናት መረጃዎች በተሳካ ሁኔታ ወደ Firestore ተመሳስለዋል።</span>
          </div>
        )}
      </div>

      {/* Cached Units List */}
      <div className={`rounded-3xl p-6 border-[1.5px] shadow-xs space-y-4 ${bgCard}`}>
        <h3 className={`text-sm font-black uppercase tracking-wider ${textSecondary}`}>
          ያለ ኢንተርኔት ለመማር የወረዱ ምዕራፎች ({cachedUnits.length})
        </h3>

        {cachedUnits.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-500 space-y-1">
            <HardDrive className="w-8 h-8 mx-auto text-gray-400 opacity-60 mb-1" />
            <p className="font-bold">ምንም የወረደ ምዕራፍ የለም።</p>
            <p>ከየትምህርቱ ዝርዝር ውስጥ "አውርድ" የሚለውን በመጫን ያለ ኢንተርኔት ማጥናት ይችላሉ።</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cachedUnits.map((u) => (
              <div
                key={u.unitId}
                className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className={`font-bold ${textPrimary}`}>
                    ምዕራፍ {u.unitNumber}: {u.title}
                  </h4>
                  <span className="text-[11px] text-gray-500 block">
                    ክፍል {u.grade} • የወረደበት ቀን፡ {new Date(u.downloadedAt).toLocaleDateString()} • {Math.round(u.sizeBytes / 1024)} KB
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenCachedUnit(u)}
                    className="px-3 py-1.5 rounded-full font-bold bg-[#6750A4] text-white hover:bg-[#523e85] transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>ክፈት</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleRemoveUnit(u.unitId)}
                    className="p-1.5 rounded-full text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
