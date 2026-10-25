import React, { useState, useEffect, useRef } from 'react';
import {
  Award,
  Flame,
  Clock,
  BookOpen,
  Settings,
  LogOut,
  ShieldCheck,
  Edit3,
  Globe,
  Check,
  X,
  Phone,
  CreditCard,
  Calendar,
  AlertCircle,
  Camera,
  Image as ImageIcon,
  Trash2,
  Eye,
  Lock,
  KeyRound,
  Bell,
  Shield,
  ArrowLeft,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LanguageCode, Grade, SubscriptionRecord, PaymentSubmission } from '../../types';
import {
  getStudentSubscription,
  getStudentPaymentHistory,
  GRADE_PRICING,
  PAYMENT_ACCOUNTS,
} from '../../services/subscriptionService';

interface StudentProfileViewProps {
  onOpenAdmin?: () => void;
  onBack?: () => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  onOpenAdmin,
  onBack,
}) => {
  const {
    profile,
    logout,
    updateUserProfile,
    uploadProfilePicture,
    removeProfilePicture,
    changePassword,
    resetPassword,
  } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [schoolName, setSchoolName] = useState(profile?.schoolName || '');
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber || '');
  const [grade, setGrade] = useState<Grade>(profile?.grade || 12);
  const [preferredLanguage, setPreferredLanguage] = useState<LanguageCode>(
    profile?.preferredLanguage || 'en'
  );
  const [saving, setSaving] = useState(false);
  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Profile picture state
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Password & Settings modals
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Notification & Privacy toggles
  const [notifications, setNotifications] = useState({
    studyReminders: profile?.notificationPreferences?.studyReminders ?? true,
    examAlerts: profile?.notificationPreferences?.examAlerts ?? true,
    paymentUpdates: profile?.notificationPreferences?.paymentUpdates ?? true,
    newContentAlerts: profile?.notificationPreferences?.newContentAlerts ?? true,
  });
  const [privacy, setPrivacy] = useState({
    showOnLeaderboard: profile?.privacySettings?.showOnLeaderboard ?? true,
    shareProgressWithTeachers:
      profile?.privacySettings?.shareProgressWithTeachers ?? true,
  });

  // Subscription & Payment History
  const [subscription, setSubscription] = useState<SubscriptionRecord | null>(null);
  const [payments, setPayments] = useState<PaymentSubmission[]>([]);

  useEffect(() => {
    if (profile?.uid) {
      getStudentSubscription(profile.uid).then(setSubscription);
      getStudentPaymentHistory(profile.uid).then(setPayments);
    }
  }, [profile?.uid]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const showNotice = (type: 'success' | 'error', message: string) => {
    setStatusBanner({ type, message });
    setTimeout(() => setStatusBanner(null), 5000);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateUserProfile({
        displayName,
        schoolName,
        phoneNumber,
        grade,
        preferredLanguage,
      });
      setIsEditing(false);
      showNotice('success', 'Profile updated successfully.');
    } catch (e: any) {
      showNotice('error', e?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      await uploadProfilePicture(file);
      showNotice('success', 'Profile picture updated and optimized.');
    } catch (err: any) {
      showNotice('error', err?.message || 'Failed to upload profile picture.');
    } finally {
      setUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleStartLiveCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
      });
      streamRef.current = stream;
      setShowCameraModal(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 100);
    } catch {
      // Fallback to native mobile camera file input if getUserMedia is unavailable
      cameraInputRef.current?.click();
    }
  };

  const handleStopLiveCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCameraModal(false);
  };

  const handleCapturePhoto = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const size = Math.min(video.videoWidth || 480, video.videoHeight || 480);
    canvas.width = 480;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sx = ((video.videoWidth || size) - size) / 2;
    const sy = ((video.videoHeight || size) - size) / 2;
    ctx.drawImage(video, sx, sy, size, size, 0, 0, 480, 480);

    handleStopLiveCamera();
    setUploadingPhoto(true);

    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          setUploadingPhoto(false);
          return;
        }
        const capturedFile = new File([blob], 'camera_profile.jpg', {
          type: 'image/jpeg',
        });
        try {
          await uploadProfilePicture(capturedFile);
          showNotice('success', 'Camera photo saved as profile picture.');
        } catch (err: any) {
          showNotice('error', err?.message || 'Failed to save camera photo.');
        } finally {
          setUploadingPhoto(false);
        }
      },
      'image/jpeg',
      0.85
    );
  };

  const handleRemovePhoto = async () => {
    setUploadingPhoto(true);
    try {
      await removeProfilePicture();
      showNotice('success', 'Profile picture removed.');
    } catch (err: any) {
      showNotice('error', err?.message || 'Failed to remove profile picture.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showNotice('error', 'New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showNotice('error', 'Passwords do not match.');
      return;
    }
    setChangingPassword(true);
    try {
      await changePassword(newPassword);
      setShowPasswordModal(false);
      setNewPassword('');
      setConfirmNewPassword('');
      showNotice('success', 'Password changed successfully.');
    } catch (err: any) {
      showNotice('error', err?.message || 'Failed to update password. Please re-login and try again.');
    } finally {
      setChangingPassword(false);
    }
  };

  const handlePasswordRecovery = async () => {
    const target = profile?.email || profile?.phoneNumber;
    if (!target) {
      showNotice('error', 'No email or phone registered on this account.');
      return;
    }
    try {
      await resetPassword(target);
      showNotice('success', 'Password recovery link sent to your registered account.');
    } catch (err: any) {
      showNotice('error', err?.message || 'Could not send password recovery email.');
    }
  };

  const handleToggleNotification = async (key: keyof typeof notifications) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    try {
      await updateUserProfile({ notificationPreferences: updated });
    } catch {
      // keep local state
    }
  };

  const handleTogglePrivacy = async (key: keyof typeof privacy) => {
    const updated = { ...privacy, [key]: !privacy[key] };
    setPrivacy(updated);
    try {
      await updateUserProfile({ privacySettings: updated });
    } catch {
      // keep local state
    }
  };

  const handleQuickLanguageChange = async (lang: LanguageCode) => {
    setPreferredLanguage(lang);
    try {
      await updateUserProfile({ preferredLanguage: lang });
      showNotice('success', 'Preferred language updated.');
    } catch {
      showNotice('error', 'Failed to update language.');
    }
  };

  const avatarSrc = profile?.photoURL || profile?.thumbnailURL;

  return (
    <div className="space-y-6 pb-8">
      {/* Top Back Navigation Header */}
      {onBack && (
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            Back to Dashboard
          </button>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Student Profile & Settings
          </span>
        </div>
      )}

      {/* Status Notification Banner */}
      {statusBanner && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between ${
            statusBanner.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2.5 text-xs font-bold">
            {statusBanner.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{statusBanner.message}</span>
          </div>
          <button onClick={() => setStatusBanner(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hidden File Inputs for Gallery & Camera */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelected}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="user"
        onChange={handleFileSelected}
        className="hidden"
      />

      {/* Profile Header & Picture Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar Box */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-3xl font-black text-slate-950 shadow-lg shadow-emerald-500/20 overflow-hidden border-2 border-emerald-500/40">
                {uploadingPhoto ? (
                  <Loader2 className="w-8 h-8 text-slate-950 animate-spin" />
                ) : avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={profile?.displayName || 'Student'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile?.displayName?.charAt(0).toUpperCase() || 'S'
                )}
              </div>
              {avatarSrc && (
                <button
                  onClick={() => setShowPhotoViewer(true)}
                  title="View Profile Picture"
                  className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 hover:text-white shadow-lg"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-white">
                  {profile?.displayName || 'Student'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                  Grade {profile?.grade || 12}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {profile?.schoolName || 'Ethiopian Secondary School'}
              </p>
              {profile?.phoneNumber && (
                <p className="text-xs text-emerald-400 font-mono mt-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {profile.phoneNumber}
                </p>
              )}
              <p className="text-[11px] text-slate-500 mt-0.5">{profile?.email}</p>

              {/* Profile Picture Action Bar */}
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <button
                  onClick={() => galleryInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition-colors disabled:opacity-50"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                  {avatarSrc ? 'Change from Gallery' : 'Add from Gallery'}
                </button>
                <button
                  onClick={handleStartLiveCamera}
                  disabled={uploadingPhoto}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition-colors disabled:opacity-50"
                >
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  Take Photo
                </button>
                {avatarSrc && (
                  <>
                    <button
                      onClick={() => setShowPhotoViewer(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-400" />
                      View
                    </button>
                    <button
                      onClick={handleRemovePhoto}
                      disabled={uploadingPhoto}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-bold text-rose-300 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="self-start p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <Edit3 className="w-4 h-4 text-emerald-400" />
              Edit Info
            </button>
          )}
        </div>

        {/* Edit Profile Form */}
        {isEditing && (
          <div className="mt-6 pt-6 border-t border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0911223344"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">
                  School Name
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">
                  Grade Level
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value) as Grade)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value={9}>Grade 9 (160 ETB/mo)</option>
                  <option value={10}>Grade 10 (180 ETB/mo)</option>
                  <option value={11}>Grade 11 (200 ETB/mo)</option>
                  <option value={12}>Grade 12 (200 ETB/mo)</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-400 mb-1 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" /> Preferred AI Tutor & Platform Language
                </label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value as LanguageCode)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="en">English</option>
                  <option value="am">አማርኛ (Amharic)</option>
                  <option value="om">Afaan Oromoo</option>
                  <option value="ti">ትግርኛ (Tigrinya)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 text-center">
            <Flame className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <p className="text-lg font-black text-white">5</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Day Streak</p>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 text-center">
            <Award className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <p className="text-lg font-black text-white">1,450</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Total XP</p>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 text-center">
            <Clock className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
            <p className="text-lg font-black text-white">18.5h</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Study Time</p>
          </div>
        </div>
      </div>

      {/* Subscription & Payment History Card (Read-Only Protected Status) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              Subscription & Billing
            </h3>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
              subscription?.status === 'ACTIVE'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : subscription?.status === 'PENDING'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            {subscription?.status || 'ACTIVE'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-950 border border-slate-800 rounded-2xl p-4">
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-500">Enrolled Grade</p>
            <p className="text-sm font-black text-white mt-0.5">
              Grade {subscription?.grade || profile?.grade || 12}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-500">Monthly Plan</p>
            <p className="text-sm font-black text-emerald-400 mt-0.5">
              {subscription?.amountEtb || GRADE_PRICING[profile?.grade || 12]} ETB / month
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-[10px] font-bold uppercase text-slate-500">Subscription Expiry</p>
            <p className="text-xs font-bold text-slate-300 mt-0.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              {subscription?.endDate
                ? new Date(subscription.endDate).toLocaleDateString()
                : 'Active Monthly Plan'}
            </p>
          </div>
        </div>

        {/* Payment History */}
        {payments.length > 0 ? (
          <div className="space-y-2 pt-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Payment History
            </p>
            {payments.slice(0, 5).map((p) => (
              <div
                key={p.id || p.paymentId}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs"
              >
                <div>
                  <p className="font-bold text-slate-200">
                    {PAYMENT_ACCOUNTS[p.paymentMethod]?.name || p.paymentMethod} •{' '}
                    <span className="font-mono text-emerald-400">{p.transactionReference}</span>
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {new Date(p.createdAt || p.submittedAt || Date.now()).toLocaleDateString()} • Grade {p.grade}
                  </p>
                  {p.rejectionReason && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {p.rejectionReason}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-black text-white">{p.amountEtb ?? p.amountETB} ETB</p>
                  <span
                    className={`text-[10px] font-bold uppercase ${
                      p.status === 'APPROVED'
                        ? 'text-emerald-400'
                        : p.status === 'PENDING'
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500">
            No manual payment transactions recorded yet.
          </p>
        )}
      </div>

      {/* Language Selection Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-black uppercase tracking-wider text-white">
            Language Preferences
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { code: 'en' as LanguageCode, label: 'English', sub: 'Default' },
            { code: 'am' as LanguageCode, label: 'አማርኛ', sub: 'Amharic' },
            { code: 'om' as LanguageCode, label: 'Afaan Oromoo', sub: 'Oromo' },
            { code: 'ti' as LanguageCode, label: 'ትግርኛ', sub: 'Tigrinya' },
          ].map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleQuickLanguageChange(lang.code)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                preferredLanguage === lang.code
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <p className="text-xs font-black">{lang.label}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{lang.sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Notification & Privacy Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              Notification Settings
            </h3>
          </div>
          <div className="space-y-3">
            {[
              {
                key: 'studyReminders' as const,
                label: 'Daily Study Plan Reminders',
                desc: 'Get notified for your daily lesson & streak goals',
              },
              {
                key: 'examAlerts' as const,
                label: 'National Exam Practice Alerts',
                desc: 'Timed mock exam schedules and weak topic alerts',
              },
              {
                key: 'paymentUpdates' as const,
                label: 'Subscription & Payment Alerts',
                desc: 'Updates when your payment is verified',
              },
              {
                key: 'newContentAlerts' as const,
                label: 'New Reference Books & Lessons',
                desc: 'Alerts when new books are published for your grade',
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800"
              >
                <div>
                  <p className="text-xs font-bold text-slate-200">{item.label}</p>
                  <p className="text-[10px] text-slate-500">{item.desc}</p>
                </div>
                <button
                  onClick={() => handleToggleNotification(item.key)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    notifications[item.key] ? 'bg-emerald-500' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      notifications[item.key] ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy & Security Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              Privacy & Account Security
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <p className="text-xs font-bold text-slate-200">Show on Grade Leaderboard</p>
                <p className="text-[10px] text-slate-500">
                  Display your name and XP rank among classmates
                </p>
              </div>
              <button
                onClick={() => handleTogglePrivacy('showOnLeaderboard')}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  privacy.showOnLeaderboard ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    privacy.showOnLeaderboard ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <p className="text-xs font-bold text-slate-200">Share Progress with Teachers</p>
                <p className="text-[10px] text-slate-500">
                  Allow school teachers to view your mastery analytics
                </p>
              </div>
              <button
                onClick={() => handleTogglePrivacy('shareProgressWithTeachers')}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  privacy.shareProgressWithTeachers ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    privacy.shareProgressWithTeachers ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-200">Change Password</p>
                  <p className="text-[10px] text-slate-500">Update your account password</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400">Update</span>
            </button>

            <button
              onClick={handlePasswordRecovery}
              className="w-full p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-3">
                <KeyRound className="w-4 h-4 text-cyan-400" />
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-200">Password Recovery</p>
                  <p className="text-[10px] text-slate-500">
                    Send recovery link to your registered email
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-cyan-400">Send Link</span>
            </button>
          </div>
        </div>
      </div>

      {/* Super Admin Portal Link & Logout */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden divide-y divide-slate-800">
        {profile?.role === 'SUPER_ADMIN' && onOpenAdmin && (
          <button
            onClick={onOpenAdmin}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-sm font-bold text-emerald-300">Super Admin Portal</p>
                <p className="text-xs text-slate-500">
                  Manage curriculum, reference books, payment methods & approvals
                </p>
              </div>
            </div>
          </button>
        )}

        <button
          onClick={() => logout()}
          className="w-full p-4 flex items-center justify-between hover:bg-rose-500/10 transition-colors text-left text-rose-400"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5" />
            <div>
              <p className="text-sm font-bold">Sign Out</p>
              <p className="text-xs text-rose-400/70">Log out of your student account</p>
            </div>
          </div>
        </button>
      </div>

      {/* Full-Screen Profile Picture Viewer Modal */}
      {showPhotoViewer && avatarSrc && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white">Student Profile Picture</h3>
              <button
                onClick={() => setShowPhotoViewer(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              <img
                src={avatarSrc}
                alt={profile?.displayName || 'Profile'}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setShowPhotoViewer(false);
                  galleryInputRef.current?.click();
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black"
              >
                Change Picture
              </button>
              <button
                onClick={() => {
                  setShowPhotoViewer(false);
                  handleRemovePhoto();
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Camera Capture Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" /> Take Profile Picture
              </h3>
              <button
                onClick={handleStopLiveCamera}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleStopLiveCamera}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleCapturePhoto}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5"
              >
                <Camera className="w-4 h-4" /> Capture & Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleChangePassword}
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" /> Change Password
              </h3>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">
                New Password (min. 6 characters)
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={changingPassword}
                className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black"
              >
                {changingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
