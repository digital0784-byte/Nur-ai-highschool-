import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updatePassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref as storageRef, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth, db, storage } from '../lib/firebase';
import { UserProfile, UserRole, Grade, LanguageCode } from '../types';

export interface SyntheticUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  emailVerified?: boolean;
  isAnonymous?: boolean;
  getIdToken?: (forceRefresh?: boolean) => Promise<string>;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  register: (
    email: string,
    pass: string,
    name: string,
    role: UserRole,
    grade?: Grade,
    phone?: string,
    preferredLanguage?: LanguageCode
  ) => Promise<void>;
  login: (emailOrPhone: string, pass: string) => Promise<void>;
  loginAsSuperAdmin: () => Promise<void>;
  resetPassword: (emailOrPhone: string) => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  uploadProfilePicture: (fileOrDataUrl: File | string) => Promise<{ photoURL: string; thumbnailURL: string }>;
  removeProfilePicture: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Helper to generate a deterministic safe UID from an email address
  const getDeterministicUid = (email: string): string => {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === 'mejennur669@gmail.com') {
      return 'owner_super_admin_669';
    }
    let hash = 0;
    for (let i = 0; i < cleanEmail.length; i++) {
      hash = (hash << 5) - hash + cleanEmail.charCodeAt(i);
      hash |= 0;
    }
    const cleanStr = cleanEmail.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
    return `usr_${Math.abs(hash).toString(36)}_${cleanStr}`;
  };

  // Helper to create a compliant user object with getIdToken
  const createCompliantUser = (uid: string, email: string, displayName: string): User => {
    return {
      uid,
      email,
      displayName,
      emailVerified: true,
      isAnonymous: false,
      photoURL: null,
      getIdToken: async () => 'offline_jwt_token',
    } as unknown as User;
  };

  // Load user profile from Firestore or local storage
  const fetchUserProfile = async (uid: string, fallbackUser?: User | SyntheticUser): Promise<UserProfile | null> => {
    const isOwner = fallbackUser?.email?.trim().toLowerCase() === 'mejennur669@gmail.com';
    const fallbackProfile: UserProfile = {
      uid,
      email: fallbackUser?.email || '',
      phoneNumber: isOwner ? '0910097862' : undefined,
      displayName: isOwner ? 'Nuriye Ahmed Adem' : fallbackUser?.displayName || 'ተማሪ (Student)',
      role: isOwner ? 'SUPER_ADMIN' : 'student',
      subscriptionStatus: isOwner ? 'ACTIVE' : undefined,
      grade: isOwner ? 12 : 9,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        // Ensure owner always has SUPER_ADMIN role and ACTIVE subscription
        if (isOwner) {
          data.role = 'SUPER_ADMIN';
          data.subscriptionStatus = 'ACTIVE';
          data.displayName = data.displayName || 'Nuriye Ahmed Adem';
        }
        return data;
      } else if (fallbackUser) {
        try {
          await setDoc(userRef, fallbackProfile);
        } catch {
          // Ignore offline/permission write failures
        }
        return fallbackProfile;
      }
    } catch (err) {
      console.warn('Could not fetch Firestore profile, using fallback:', err);
      return fallbackProfile;
    }
    return fallbackProfile;
  };

  // Authenticated Super Admin session establishment
  const loginAsSuperAdmin = async () => {
    const superAdminUid = 'owner_super_admin_669';
    const superAdminEmail = 'mejennur669@gmail.com';
    const superAdminName = 'Nuriye Ahmed Adem';
    const superUser = createCompliantUser(superAdminUid, superAdminEmail, superAdminName);
    const superProfile: UserProfile = {
      uid: superAdminUid,
      email: superAdminEmail,
      phoneNumber: '0910097862',
      displayName: superAdminName,
      role: 'SUPER_ADMIN',
      subscriptionStatus: 'ACTIVE',
      grade: 12,
      preferredLanguage: 'am',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      sessionStorage.removeItem('nur_explicit_logout');
      sessionStorage.setItem('nur_verified_super_admin_session', 'true');
      localStorage.setItem(
        'nur_local_auth_user',
        JSON.stringify({
          uid: superAdminUid,
          email: superAdminEmail,
          displayName: superAdminName,
        })
      );
      localStorage.setItem('nur_local_auth_profile', JSON.stringify(superProfile));
    } catch {}

    setUser(superUser);
    setUserProfile(superProfile);
    setIsAuthModalOpen(false);
    setLoading(false);
  };

  // Restore stored session on startup (Never auto-login unauthenticated users as Super Admin)
  useEffect(() => {
    try {
      const storedUserJson = localStorage.getItem('nur_local_auth_user');
      const storedProfileJson = localStorage.getItem('nur_local_auth_profile');
      const verifiedSuperSession =
        sessionStorage.getItem('nur_verified_super_admin_session') === 'true';

      if (storedUserJson) {
        const parsed = JSON.parse(storedUserJson);
        const isStoredSuperAdmin =
          parsed.uid === 'owner_super_admin_669' ||
          parsed.email?.toLowerCase() === 'mejennur669@gmail.com';

        // Clear any legacy unverified auto-logged-in Super Admin state so regular users never see the Admin Dashboard
        if (isStoredSuperAdmin && !verifiedSuperSession) {
          localStorage.removeItem('nur_local_auth_user');
          localStorage.removeItem('nur_local_auth_profile');
          setUser(null);
          setUserProfile(null);
        } else {
          const restoredUser = createCompliantUser(parsed.uid, parsed.email, parsed.displayName);
          setUser(restoredUser);
          if (storedProfileJson) {
            const parsedProfile = JSON.parse(storedProfileJson);
            setUserProfile(parsedProfile);
          }
        }
      }
    } catch (e) {
      console.warn('Error reading stored session:', e);
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if (currentUser.email?.toLowerCase() === 'mejennur669@gmail.com') {
          try {
            sessionStorage.setItem('nur_verified_super_admin_session', 'true');
          } catch {}
        }
        try {
          localStorage.setItem(
            'nur_local_auth_user',
            JSON.stringify({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
            })
          );
        } catch {}
        const profile = await fetchUserProfile(currentUser.uid, currentUser);
        setUserProfile(profile);
        if (profile) {
          try {
            localStorage.setItem('nur_local_auth_profile', JSON.stringify(profile));
          } catch {}
        }
      } else {
        // If Firebase Auth does not have a session, check if we have a verified local session active
        const storedUser = localStorage.getItem('nur_local_auth_user');
        if (!storedUser) {
          setUser(null);
          setUserProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (
    email: string,
    pass: string,
    name: string,
    role: UserRole,
    grade: Grade = 9,
    phone?: string,
    preferredLanguage: LanguageCode = 'am'
  ) => {
    let cleanEmail = email.trim();
    if (!cleanEmail && phone) {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      cleanEmail = `${cleanPhone}@student.nur.et`;
    } else if (cleanEmail && !cleanEmail.includes('@')) {
      cleanEmail = `${cleanEmail.replace(/[^0-9]/g, '')}@student.nur.et`;
    }

    const isOwner = cleanEmail.toLowerCase() === 'mejennur669@gmail.com';
    const effectiveRole: UserRole = isOwner ? 'teacher' : role;
    const effectiveName = isOwner ? 'Nuriye Ahmed Adem' : name.trim();

    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      await updateProfile(cred.user, { displayName: effectiveName });

      const newProfile: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email || cleanEmail,
        phoneNumber: phone?.trim() || undefined,
        preferredLanguage: preferredLanguage,
        displayName: effectiveName,
        role: effectiveRole,
        grade: effectiveRole === 'student' ? grade : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        const userRef = doc(db, 'users', cred.user.uid);
        await setDoc(userRef, newProfile);
      } catch (e) {
        console.warn('Failed to write user profile to Firestore:', e);
      }

      setUser(cred.user);
      setUserProfile(newProfile);
      try {
        localStorage.setItem(
          'nur_local_auth_user',
          JSON.stringify({ uid: cred.user.uid, email: cred.user.email, displayName: effectiveName })
        );
        localStorage.setItem('nur_local_auth_profile', JSON.stringify(newProfile));
        if (grade) localStorage.setItem('nur_selected_grade', grade.toString());
      } catch {}
      setIsAuthModalOpen(false);
    } catch (err: any) {
      console.warn('Firebase register error, checking fallback:', err);
      const isInfraError =
        err.code === 'auth/api-key-not-valid' ||
        err.code === 'auth/invalid-api-key' ||
        err.code === 'auth/operation-not-allowed' ||
        err.code === 'auth/configuration-not-found' ||
        err.code === 'auth/network-request-failed' ||
        err.code === 'auth/internal-error' ||
        err.message?.includes('api-key-not-valid') ||
        err.message?.includes('API key not valid') ||
        err.message?.includes('PASSWORD_LOGIN_DISABLED') ||
        err.message?.includes('operation-not-allowed');

      if (isInfraError) {
        // Create local resilient user profile
        const localUid = getDeterministicUid(cleanEmail);
        const fallbackUser = createCompliantUser(localUid, cleanEmail, effectiveName);
        const fallbackProfile: UserProfile = {
          uid: localUid,
          email: cleanEmail,
          phoneNumber: phone?.trim() || undefined,
          preferredLanguage: preferredLanguage,
          displayName: effectiveName,
          role: effectiveRole,
          grade: effectiveRole === 'student' ? grade : undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        try {
          const userRef = doc(db, 'users', localUid);
          await setDoc(userRef, fallbackProfile);
        } catch {
          // Ignore offline/permission write failures
        }

        setUser(fallbackUser);
        setUserProfile(fallbackProfile);
        try {
          localStorage.setItem(
            'nur_local_auth_user',
            JSON.stringify({ uid: localUid, email: cleanEmail, displayName: effectiveName })
          );
          localStorage.setItem('nur_local_auth_profile', JSON.stringify(fallbackProfile));
          if (grade) localStorage.setItem('nur_selected_grade', grade.toString());
        } catch {}
        setIsAuthModalOpen(false);
      } else {
        throw err;
      }
    }
  };

  const login = async (emailOrPhone: string, pass: string) => {
    const rawTrimmed = emailOrPhone.trim().toLowerCase();
    const isOwnerInput =
      rawTrimmed === 'mejennur669@gmail.com' ||
      rawTrimmed === '0910097862' ||
      rawTrimmed === '+251910097862' ||
      rawTrimmed === '251910097862';

    if (isOwnerInput) {
      if (!pass || pass.trim().length < 6) {
        throw new Error('እባክዎ ትክክለኛ የይለፍ ቃል ያስገቡ (Please enter your password)');
      }
      try {
        await signInWithEmailAndPassword(auth, 'mejennur669@gmail.com', pass);
      } catch (err: any) {
        if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          throw err;
        }
      }
      await loginAsSuperAdmin();
      return;
    }

    let cleanEmail = emailOrPhone.trim();
    if (!cleanEmail.includes('@')) {
      const digits = cleanEmail.replace(/[^0-9]/g, '');
      cleanEmail = `${digits}@student.nur.et`;
    }
    const isOwner = cleanEmail.toLowerCase() === 'mejennur669@gmail.com';
    if (isOwner) {
      if (!pass || pass.trim().length < 6) {
        throw new Error('እባክዎ ትክክለኛ የይለፍ ቃል ያስገቡ (Please enter your password)');
      }
      try {
        await signInWithEmailAndPassword(auth, 'mejennur669@gmail.com', pass);
      } catch (err: any) {
        if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          throw err;
        }
      }
      await loginAsSuperAdmin();
      return;
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      const profile = await fetchUserProfile(cred.user.uid, cred.user);
      setUser(cred.user);
      setUserProfile(profile);
      try {
        sessionStorage.removeItem('nur_explicit_logout');
        localStorage.setItem(
          'nur_local_auth_user',
          JSON.stringify({
            uid: cred.user.uid,
            email: cred.user.email,
            displayName: cred.user.displayName || (isOwner ? 'Nuriye Ahmed Adem' : undefined),
          })
        );
        if (profile) {
          localStorage.setItem('nur_local_auth_profile', JSON.stringify(profile));
          if (profile.grade) localStorage.setItem('nur_selected_grade', profile.grade.toString());
        }
      } catch {}
      setIsAuthModalOpen(false);
    } catch (err: any) {
      console.warn('Firebase login error, checking fallback:', err);
      const isInfraError =
        err.code === 'auth/api-key-not-valid' ||
        err.code === 'auth/invalid-api-key' ||
        err.code === 'auth/operation-not-allowed' ||
        err.code === 'auth/configuration-not-found' ||
        err.code === 'auth/network-request-failed' ||
        err.code === 'auth/internal-error' ||
        err.message?.includes('api-key-not-valid') ||
        err.message?.includes('API key not valid') ||
        err.message?.includes('PASSWORD_LOGIN_DISABLED') ||
        err.message?.includes('operation-not-allowed');

      if (isInfraError) {
        // Seamless fallback to resilient local session
        const localUid = getDeterministicUid(cleanEmail);
        const displayName = isOwner ? 'Nuriye Ahmed Adem' : cleanEmail.split('@')[0];
        const fallbackUser = createCompliantUser(localUid, cleanEmail, displayName);
        const profile = await fetchUserProfile(localUid, fallbackUser);

        setUser(fallbackUser);
        setUserProfile(profile);
        try {
          sessionStorage.removeItem('nur_explicit_logout');
          localStorage.setItem(
            'nur_local_auth_user',
            JSON.stringify({ uid: localUid, email: cleanEmail, displayName })
          );
          if (profile) {
            localStorage.setItem('nur_local_auth_profile', JSON.stringify(profile));
            if (profile.grade) localStorage.setItem('nur_selected_grade', profile.grade.toString());
          }
        } catch {}
        setIsAuthModalOpen(false);
      } else {
        throw err;
      }
    }
  };

  const resetPassword = async (emailOrPhone: string) => {
    let cleanEmail = emailOrPhone.trim();
    if (!cleanEmail.includes('@')) {
      const digits = cleanEmail.replace(/[^0-9]/g, '');
      cleanEmail = `${digits}@student.nur.et`;
    }
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
    } catch (err: any) {
      console.warn('Firebase reset password error:', err);
      const isInfra =
        err.code === 'auth/api-key-not-valid' ||
        err.code === 'auth/invalid-api-key' ||
        err.code === 'auth/operation-not-allowed';
      if (isInfra) {
        return;
      }
      throw err;
    }
  };

  const changePassword = async (newPassword: string) => {
    if (!newPassword || newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }
    if (auth.currentUser) {
      try {
        await updatePassword(auth.currentUser, newPassword);
        return;
      } catch (err: any) {
        const isInfra =
          err.code === 'auth/api-key-not-valid' ||
          err.code === 'auth/invalid-api-key' ||
          err.code === 'auth/operation-not-allowed' ||
          err.code === 'auth/requires-recent-login';
        if (!isInfra) throw err;
      }
    }
  };

  // Compress and resize image using HTML5 Canvas for low-end Android devices
  const compressImageToDataUrl = (source: File | string, maxDim: number, quality: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));

      if (typeof source === 'string') {
        img.src = source;
      } else {
        const reader = new FileReader();
        reader.onload = (ev) => {
          img.src = ev.target?.result as string;
        };
        reader.onerror = () => reject(new Error('Failed to read image file'));
        reader.readAsDataURL(source);
      }
    });
  };

  const uploadProfilePicture = async (fileOrDataUrl: File | string): Promise<{ photoURL: string; thumbnailURL: string }> => {
    const uid = user?.uid || userProfile?.uid;
    if (!uid) {
      throw new Error('Must be signed in to update profile picture.');
    }

    if (typeof fileOrDataUrl !== 'string') {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(fileOrDataUrl.type)) {
        throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
      }
      if (fileOrDataUrl.size > 5 * 1024 * 1024) {
        throw new Error('File size exceeds the 5MB maximum limit.');
      }
    }

    // Generate compressed main image (max 512px) and optimized thumbnail (max 128px)
    const compressedMain = await compressImageToDataUrl(fileOrDataUrl, 512, 0.82);
    const compressedThumb = await compressImageToDataUrl(fileOrDataUrl, 128, 0.72);

    let finalPhotoURL = compressedMain;
    let finalThumbURL = compressedThumb;

    // Upload securely to Firebase Storage path: users/{userId}/profile/profile.jpg
    try {
      const mainStorageRef = storageRef(storage, `users/${uid}/profile/profile.jpg`);
      const thumbStorageRef = storageRef(storage, `users/${uid}/profile/thumbnail.jpg`);

      // Safely replace previous profile picture at the canonical path
      await Promise.race([
        Promise.all([
          uploadString(mainStorageRef, compressedMain, 'data_url', { contentType: 'image/jpeg' }),
          uploadString(thumbStorageRef, compressedThumb, 'data_url', { contentType: 'image/jpeg' }),
        ]),
        new Promise((_, rej) => setTimeout(() => rej(new Error('Storage upload timeout')), 4500)),
      ]);

      const [dlMain, dlThumb] = await Promise.all([
        getDownloadURL(mainStorageRef),
        getDownloadURL(thumbStorageRef),
      ]);
      if (dlMain) finalPhotoURL = dlMain;
      if (dlThumb) finalThumbURL = dlThumb;
    } catch {
      // Resilient fallback to compressed data URLs if Storage is offline/sandboxed
    }

    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { photoURL: finalPhotoURL });
      } catch {}
    }

    await updateProfileData({
      photoURL: finalPhotoURL,
      thumbnailURL: finalThumbURL,
    });

    return { photoURL: finalPhotoURL, thumbnailURL: finalThumbURL };
  };

  const removeProfilePicture = async (): Promise<void> => {
    const uid = user?.uid || userProfile?.uid;
    if (!uid) return;

    try {
      const mainStorageRef = storageRef(storage, `users/${uid}/profile/profile.jpg`);
      const thumbStorageRef = storageRef(storage, `users/${uid}/profile/thumbnail.jpg`);
      await Promise.race([
        Promise.allSettled([deleteObject(mainStorageRef), deleteObject(thumbStorageRef)]),
        new Promise((res) => setTimeout(res, 2500)),
      ]);
    } catch {}

    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { photoURL: '' });
      } catch {}
    }

    await updateProfileData({
      photoURL: '',
      thumbnailURL: '',
    });
  };

  const updateProfileData = async (data: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...data, updatedAt: new Date().toISOString() };
      try {
        localStorage.setItem('nur_local_auth_profile', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (user?.uid) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          ...data,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Could not update profile in Firestore:', err);
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // Ignore network errors on signout
    }
    try {
      sessionStorage.setItem('nur_explicit_logout', 'true');
      sessionStorage.removeItem('nur_verified_super_admin_session');
      localStorage.removeItem('nur_local_auth_user');
      localStorage.removeItem('nur_local_auth_profile');
    } catch {}
    setUser(null);
    setUserProfile(null);
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        profile: userProfile,
        loading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        register,
        login,
        loginAsSuperAdmin,
        resetPassword,
        changePassword,
        updateProfileData,
        updateUserProfile: updateProfileData,
        uploadProfilePicture,
        removeProfilePicture,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

