import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  Play,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Sparkles,
  Zap,
  CheckCircle,
  ExternalLink,
  Crown,
  Eye,
  Settings,
  Flame,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { premiumContentService } from '../../services/premiumContentService';
import { AccessVerificationResponse, WatermarkData } from '../../types/premiumSecurity';

interface ProtectedMediaShieldProps {
  contentId: string;
  title: string;
  overview?: string;
  contentType: 'video' | 'animation_2d' | 'animation_3d';
  mediaUrl: string;
  thumbnailUrl?: string;
  duration?: string;
  instructor?: string;
  curriculumBadge?: string;
  onOpenSubscriptionModal?: () => void;
  children?: React.ReactNode; // For interactive 2D/3D Canvas/Plotly engines
}

export const ProtectedMediaShield: React.FC<ProtectedMediaShieldProps> = ({
  contentId,
  title,
  overview,
  contentType,
  mediaUrl,
  thumbnailUrl,
  duration,
  instructor,
  curriculumBadge,
  onOpenSubscriptionModal,
  children,
}) => {
  const { user, openAuthModal } = useAuth();
  const { isOwnerSuperAdmin, hasLearningAccess, entitlement } = useSubscription();

  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [accessState, setAccessState] = useState<AccessVerificationResponse | null>(null);
  const [watermark, setWatermark] = useState<WatermarkData | null>(null);
  const [watermarkPos, setWatermarkPos] = useState<{ top: string; left: string }>({
    top: '20%',
    left: '25%',
  });

  // Periodically randomize watermark position to prevent screen recording and crop evasion
  useEffect(() => {
    const interval = setInterval(() => {
      const top = `${15 + Math.floor(Math.random() * 65)}%`;
      const left = `${10 + Math.floor(Math.random() * 60)}%`;
      setWatermarkPos({ top, left });
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Server-Side Access Verification (Zero-Trust)
  useEffect(() => {
    let isMounted = true;
    setIsVerifying(true);

    premiumContentService
      .verifyContentAccess(contentId, contentType)
      .then((res) => {
        if (!isMounted) return;
        setAccessState(res);
        if (res.entitled && res.watermark) {
          setWatermark(res.watermark);
        } else if (isOwnerSuperAdmin) {
          // Fallback for Super Admin in development mode
          setWatermark({
            studentId: user?.uid || 'super_admin',
            maskedEmail: user?.email || 'mejennur669@gmail.com',
            text: `NUR AI • Super Admin • ${new Date().toLocaleDateString()}`,
            timestamp: new Date().toISOString(),
          });
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setAccessState({
          entitled: isOwnerSuperAdmin,
          reason: 'SERVER_ERROR',
          message: 'የይዘት ማረጋገጫ አልተሳካም (Verification failed).',
        });
      })
      .finally(() => {
        if (isMounted) setIsVerifying(false);
      });

    return () => {
      isMounted = false;
    };
  }, [contentId, contentType, user, isOwnerSuperAdmin, hasLearningAccess, entitlement]);

  // If user is Super Admin, or server explicitly verified access
  const isAuthorized = isOwnerSuperAdmin || (accessState?.entitled === true);

  // Prevent right-click and shortcuts on video container
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div
      id={`protected-media-${contentId}`}
      onContextMenu={handleContextMenu}
      className="relative rounded-2xl overflow-hidden border-[2px] border-[#38332D] shadow-[4px_4px_0px_0px_#38332D] bg-[#1E1B18] select-none"
    >
      {/* Verifying Loader State */}
      {isVerifying ? (
        <div className="aspect-video w-full flex flex-col items-center justify-center bg-[#1E1B18] text-stone-300 p-6 text-center">
          <Loader2 className="w-9 h-9 animate-spin text-amber-400 mb-3" />
          <p className="text-xs sm:text-sm font-bold font-serif-ethiopic text-stone-200">
            የይዘት ፈቃድዎን በማረጋገጥ ላይ (Verifying Content Entitlement)...
          </p>
          <span className="text-[11px] text-stone-400 mt-1">Zero-Trust Server Authorization</span>
        </div>
      ) : !isAuthorized ? (
        /* ==================================================================== */
        /* PAYWALL GATEWAY (PARTS 2, 3, 4, 5, 6)                                */
        /* ==================================================================== */
        <div className="relative aspect-video w-full flex items-center justify-center overflow-hidden">
          {/* Blurred Background Preview */}
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover filter blur-md brightness-35 scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#231F1B] via-[#1A1715] to-[#0D0B0A]" />
          )}

          {/* Paywall Container */}
          <div className="relative z-10 max-w-lg mx-4 p-5 sm:p-7 rounded-2xl bg-[#FAF6EC]/95 border-[2px] border-[#38332D] shadow-2xl text-center text-[#1E1B18] backdrop-blur-xs space-y-3.5">
            {/* Top Amber Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-stone-950 font-black text-[11px] uppercase tracking-wider shadow-xs border border-amber-600">
              <Crown className="w-3.5 h-3.5" />
              <span>ፕሪሚየም ይዘት (PREMIUM ONLY)</span>
            </div>

            {/* Title & Teaser */}
            <div>
              <h3 className="font-serif-ethiopic font-bold text-base sm:text-lg text-[#1E1B18] line-clamp-2">
                {title}
              </h3>
              {overview && (
                <p className="text-xs text-[#5A5143] font-serif-ethiopic mt-1 line-clamp-2 leading-relaxed">
                  {overview}
                </p>
              )}
            </div>

            {/* Premium Benefits Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left bg-[#EDE6D4]/80 p-3 rounded-xl border border-[#38332D]/30 text-xs font-serif-ethiopic text-[#38332D]">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>ሙሉ ጥራት ያለው የቪዲዮ ትምህርት</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>2D/3D ምስላዊ ማስመሰያ (Simulation)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>የብሔራዊ ፈተና ጥያቄዎች አፈታት</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>ያልተገደበ የAI አስረጅና ማስታወሻ</span>
              </div>
            </div>

            {/* Reason Message */}
            {accessState?.message && (
              <p className="text-xs text-amber-900 font-serif-ethiopic bg-amber-50 p-2 rounded-lg border border-amber-200">
                {accessState.message}
              </p>
            )}

            {/* Action Buttons */}
            <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-2">
              {!user ? (
                <button
                  onClick={() => openAuthModal('login')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#2E6B4A] hover:bg-[#235338] text-white font-bold font-serif-ethiopic text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>ይግቡና ይመልከቱ (Sign In to Access)</span>
                </button>
              ) : (
                <button
                  onClick={onOpenSubscriptionModal}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-stone-950 font-black font-serif-ethiopic text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-600"
                >
                  <Flame className="w-4 h-4 fill-current text-stone-950" />
                  <span>ፕሪሚየም ይክፈቱ (Unlock with Premium)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ==================================================================== */
        /* AUTHORIZED SECURE PLAYER WITH WATERMARK (PARTS 8, 9, 10)             */
        /* ==================================================================== */
        <div className="relative w-full aspect-video flex items-center justify-center bg-black overflow-hidden group">
          {/* Active Player Layer */}
          {children ? (
            /* Interactive Simulation/Canvas Mode */
            <div className="w-full h-full">{children}</div>
          ) : mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be') ? (
            <iframe
              src={mediaUrl}
              title={title}
              className="w-full h-full border-0 pointer-events-auto"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={mediaUrl}
              controls
              controlsList="nodownload noplaybackrate"
              disablePictureInPicture
              playsInline
              className="w-full h-full object-contain pointer-events-auto"
            />
          )}

          {/* DYNAMIC WATERMARK OVERLAY (PART 9) */}
          {watermark && (
            <div
              style={{ top: watermarkPos.top, left: watermarkPos.left }}
              className="absolute z-30 pointer-events-none transition-all duration-1000 ease-in-out select-none transform -rotate-12 bg-black/45 border border-white/20 px-3 py-1 rounded-md backdrop-blur-2xs shadow-lg"
            >
              <div className="text-[10px] sm:text-xs font-mono font-bold text-white/70 tracking-widest leading-none">
                {watermark.text}
              </div>
              <div className="text-[8px] font-mono text-amber-300/60 mt-0.5">
                Protected Stream • DRM ID: {watermark.studentId.slice(0, 8)}
              </div>
            </div>
          )}

          {/* Super Admin Universal Access Floating Badge */}
          {isOwnerSuperAdmin && (
            <div className="absolute top-3 left-3 z-30 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold backdrop-blur-xs shadow-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Super Admin Master Entitlement Active</span>
            </div>
          )}

          {/* Anti-Recording Guard Strip */}
          <div className="absolute bottom-2 right-3 z-30 pointer-events-none text-[9px] font-mono text-stone-400/50">
            NUR AI Protected • Copying Prohibited
          </div>
        </div>
      )}
    </div>
  );
};
