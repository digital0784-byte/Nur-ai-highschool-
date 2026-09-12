import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Calendar,
  Clock,
  PauseCircle,
  PlayCircle,
  ShieldCheck,
  ShieldAlert,
  BookOpen,
  RefreshCw,
  Lock,
} from 'lucide-react';
import { UserProfile, Grade } from '../../types';
import { adminFirestoreService } from '../../services/adminFirestore';
import { subscriptionService, SUPER_ADMIN_EMAIL } from '../../services/subscriptionService';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { Subscription, PaymentRecord } from '../../types/subscription';

interface AdminStudentsSectionProps {
  students: UserProfile[];
  onRefresh: () => void;
}

export const AdminStudentsSection: React.FC<AdminStudentsSectionProps> = ({
  students,
  onRefresh,
}) => {
  const { user } = useAuth();
  const { isOwnerSuperAdmin } = useSubscription();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<Grade | 'all'>('all');
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Student Profile Modal Details
  const [studentSubscription, setStudentSubscription] = useState<Subscription | null>(null);
  const [studentPayments, setStudentPayments] = useState<PaymentRecord[]>([]);
  const [loadingStudentDetails, setLoadingStudentDetails] = useState<boolean>(false);

  // Suspend / Reactivate state
  const [suspendingStudent, setSuspendingStudent] = useState<UserProfile | null>(null);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [isSubmittingSuspension, setIsSubmittingSuspension] = useState(false);
  const [actionAlert, setActionAlert] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New student form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newGrade, setNewGrade] = useState<Grade>(9);
  const [isSaving, setIsSaving] = useState(false);

  // Real-time map of user subscription statuses
  const [subscriptionsMap, setSubscriptionsMap] = useState<Record<string, Subscription>>({});

  useEffect(() => {
    const unsub = subscriptionService.subscribeToAllSubscriptions((subs) => {
      const map: Record<string, Subscription> = {};
      subs.forEach((s) => {
        if (s.userId) map[s.userId] = s;
      });
      setSubscriptionsMap(map);
    });
    return () => unsub();
  }, []);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.uid?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGrade = selectedGrade === 'all' || s.grade === selectedGrade;
      return matchesSearch && matchesGrade;
    });
  }, [students, searchTerm, selectedGrade]);

  // Load student profile deep details (subscription & payment history)
  const handleOpenStudentProfile = async (student: UserProfile) => {
    setSelectedStudent(student);
    setLoadingStudentDetails(true);
    try {
      const [sub, payments] = await Promise.all([
        subscriptionService.getStudentSubscription(student.uid),
        subscriptionService.getStudentPayments(student.uid),
      ]);
      setStudentSubscription(sub);
      setStudentPayments(payments);
    } catch (err) {
      console.warn('Error loading student deep profile:', err);
    } finally {
      setLoadingStudentDetails(false);
    }
  };

  const handleOpenSuspendModal = (student: UserProfile, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSuspendingStudent(student);
    setSuspensionReason('');
  };

  const handleConfirmSuspension = async () => {
    if (!suspendingStudent) return;
    if (!isOwnerSuperAdmin) {
      setActionAlert({
        type: 'error',
        text: `Unauthorized: Only Super Admin (${SUPER_ADMIN_EMAIL}) can suspend or reactivate accounts.`,
      });
      return;
    }

    const willSuspend = !suspendingStudent.isSuspended;
    setIsSubmittingSuspension(true);
    setActionAlert(null);

    try {
      await adminFirestoreService.toggleStudentSuspension(
        suspendingStudent.uid,
        willSuspend,
        suspensionReason.trim() || undefined,
        user ? { uid: user.uid, email: user.email || SUPER_ADMIN_EMAIL } : undefined
      );

      setActionAlert({
        type: 'success',
        text: `የተማሪው አካውንት በተሳካ ሁኔታ ${willSuspend ? 'ታግዷል (Suspended)' : 'ዳግም ነቅቷል (Reactivated)'}።`,
      });

      setSuspendingStudent(null);
      if (selectedStudent && selectedStudent.uid === suspendingStudent.uid) {
        setSelectedStudent({
          ...selectedStudent,
          isSuspended: willSuspend,
        });
      }
      onRefresh();
    } catch (err: any) {
      setActionAlert({ type: 'error', text: `Failed: ${err.message}` });
    } finally {
      setIsSubmittingSuspension(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;
    setIsSaving(true);
    try {
      const student: UserProfile = {
        uid: 'std_' + Date.now(),
        email: newEmail.trim(),
        displayName: newName.trim(),
        role: 'student',
        grade: newGrade,
        schoolName: 'NUR AI High School',
        isSuspended: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await adminFirestoreService.saveStudent(student);
      setIsAddModalOpen(false);
      setNewName('');
      setNewEmail('');
      onRefresh();
    } catch (e) {
      console.error('Error adding student:', e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-900">
              Student Directory & Access
            </span>
            <span className="text-xs text-stone-500 font-mono">Grades 9–12 Ethiopian Curriculum</span>
          </div>
          <h3 className="text-lg font-bold text-stone-900 font-serif-ethiopic flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-700" />
            <span>የተማሪዎች አስተዳደርና መቆጣጠሪያ (Student Management)</span>
          </h3>
          <p className="text-xs text-stone-500">
            Total {students.length} registered students. Manage subscriptions, view verified payments, and toggle account suspension.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>አዲስ ተማሪ መዝግብ (Add Student)</span>
        </button>
      </div>

      {actionAlert && (
        <div
          className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
            actionAlert.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {actionAlert.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{actionAlert.text}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, email, or UID..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        {/* Grade Filter Buttons */}
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs font-bold text-stone-500 mr-1 shrink-0">ክፍል (Grade):</span>
          {(['all', 9, 10, 11, 12] as const).map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedGrade === g
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              {g === 'all' ? 'All Grades' : `Grade ${g}`}
            </button>
          ))}
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-100/70 border-b border-stone-200 text-[11px] uppercase tracking-wider text-stone-600 font-bold">
              <tr>
                <th className="p-3.5">ተማሪ (Student Name & UID)</th>
                <th className="p-3.5">ኢሜይል (Email)</th>
                <th className="p-3.5">ክፍል (Grade)</th>
                <th className="p-3.5">ሳብስክሪፕሽን (Subscription)</th>
                <th className="p-3.5">የአካውንት ሁኔታ (Account)</th>
                <th className="p-3.5">የተመዘገበበት (Registration)</th>
                <th className="p-3.5">የመጨረሻ እንቅስቃሴ (Last Active)</th>
                <th className="p-3.5 text-right">ተግባራት (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-stone-400">
                    ምንም ተማሪ አልተገኘም (No students matching filter)
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std) => {
                  const sub = subscriptionsMap[std.uid];
                  const hasActiveSub =
                    sub &&
                    sub.status === 'ACTIVE' &&
                    new Date(sub.expiryDate).getTime() >= Date.now();

                  return (
                    <tr key={std.uid} className="hover:bg-stone-50/70 transition-colors">
                      {/* Name & UID */}
                      <td className="p-3.5 font-bold text-stone-900 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                          {std.displayName?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <div className="font-serif-ethiopic">{std.displayName}</div>
                          <div className="text-[10px] text-stone-400 font-mono truncate max-w-[120px]">
                            {std.uid}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="p-3.5 text-stone-600">{std.email}</td>

                      {/* Grade */}
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Grade {std.grade || 9}
                        </span>
                      </td>

                      {/* Subscription Status */}
                      <td className="p-3.5">
                        {hasActiveSub ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Active</span>
                          </span>
                        ) : sub && sub.status === 'PENDING' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Pending</span>
                          </span>
                        ) : sub && sub.status === 'SUSPENDED' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            <span>Suspended</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600 border border-stone-200">
                            <span>Inactive</span>
                          </span>
                        )}
                      </td>

                      {/* Account Status (Active vs Suspended) */}
                      <td className="p-3.5">
                        {std.isSuspended ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            <PauseCircle className="w-3 h-3 text-rose-600" />
                            <span>Suspended</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Active</span>
                          </span>
                        )}
                      </td>

                      {/* Registration Date */}
                      <td className="p-3.5 text-stone-500 text-[11px]">
                        {std.createdAt ? new Date(std.createdAt).toLocaleDateString() : 'Active'}
                      </td>

                      {/* Last Activity */}
                      <td className="p-3.5 text-stone-500 text-[11px]">
                        {std.updatedAt ? new Date(std.updatedAt).toLocaleDateString() : 'Recent'}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenStudentProfile(std)}
                          className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-stone-100 rounded-lg cursor-pointer transition-colors"
                          title="View Profile, Subscriptions & Payments"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleOpenSuspendModal(std, e)}
                          className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                            std.isSuspended
                              ? 'text-emerald-700 hover:bg-emerald-50'
                              : 'text-rose-600 hover:bg-rose-50'
                          }`}
                          title={std.isSuspended ? 'Reactivate Account' : 'Suspend Account'}
                        >
                          {std.isSuspended ? (
                            <PlayCircle className="w-4 h-4" />
                          ) : (
                            <PauseCircle className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* STUDENT PROFILE & FINANCIAL HISTORY MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 border border-stone-300 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base">
                  {selectedStudent.displayName?.charAt(0) || 'S'}
                </div>
                <div>
                  <h4 className="text-base font-bold text-stone-900 font-serif-ethiopic">
                    {selectedStudent.displayName}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-stone-500">
                    <span className="font-mono">{selectedStudent.uid}</span>
                    <span>•</span>
                    <span>Grade {selectedStudent.grade}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Privacy Compliance Banner */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs flex items-center gap-2 text-stone-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Privacy Protected:</strong> Super Admin access is restricted to academic and billing records. Private user authentication secrets are strictly hidden.
              </span>
            </div>

            {/* Profile Core Attributes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Email</span>
                <span className="font-bold text-stone-800 truncate block" title={selectedStudent.email}>
                  {selectedStudent.email}
                </span>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Account Status</span>
                <span
                  className={`font-bold ${
                    selectedStudent.isSuspended ? 'text-rose-700' : 'text-emerald-700'
                  }`}
                >
                  {selectedStudent.isSuspended ? 'Suspended' : 'Active'}
                </span>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Registered</span>
                <span className="font-bold text-stone-800">
                  {selectedStudent.createdAt
                    ? new Date(selectedStudent.createdAt).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Last Activity</span>
                <span className="font-bold text-stone-800">
                  {selectedStudent.updatedAt
                    ? new Date(selectedStudent.updatedAt).toLocaleDateString()
                    : 'Active'}
                </span>
              </div>
            </div>

            {/* Subscription Card */}
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <h5 className="font-bold text-stone-900 font-serif-ethiopic flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  <span>የሳብስክሪፕሽን ሁኔታ (Subscription Status)</span>
                </h5>
                {studentSubscription && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {studentSubscription.status}
                  </span>
                )}
              </div>

              {loadingStudentDetails ? (
                <div className="py-4 text-center text-xs text-stone-400">መረጃ በመጫን ላይ ነው...</div>
              ) : studentSubscription ? (
                <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-stone-500 block text-[11px]">ወርሃዊ ክፍያ፡</span>
                    <span className="font-bold text-stone-900">{studentSubscription.priceETB} ETB</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[11px]">የተጀመረበት፡</span>
                    <span className="text-stone-800">
                      {new Date(studentSubscription.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[11px]">የሚያበቃበት፡</span>
                    <span className="font-bold text-emerald-800">
                      {new Date(studentSubscription.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-stone-500 py-1">
                  ተማሪው ምንም ገቢር የሆነ ሳብስክሪፕሽን የለውም (No active subscription found)
                </p>
              )}
            </div>

            {/* Payment History for this student */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-stone-900 font-serif-ethiopic flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>የክፍያ ታሪክ (Payment History - {studentPayments.length} Records)</span>
              </h5>

              {loadingStudentDetails ? (
                <div className="py-4 text-center text-xs text-stone-400">ክፍያዎች በመጫን ላይ ናቸው...</div>
              ) : studentPayments.length === 0 ? (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-center text-xs text-stone-400">
                  ምንም የክፍያ ታሪክ አልተገኘም
                </div>
              ) : (
                <div className="border border-stone-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-stone-100 text-[10px] uppercase font-bold text-stone-600 border-b border-stone-200">
                      <tr>
                        <th className="p-2">Payment ID</th>
                        <th className="p-2">ቀን</th>
                        <th className="p-2">ዘዴ</th>
                        <th className="p-2">መለያ (Ref)</th>
                        <th className="p-2">መጠን</th>
                        <th className="p-2">ሁኔታ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {studentPayments.map((p) => (
                        <tr key={p.paymentId}>
                          <td className="p-2 font-mono text-[10px] text-stone-500">{p.paymentId}</td>
                          <td className="p-2 text-stone-600">
                            {new Date(p.submittedAt).toLocaleDateString()}
                          </td>
                          <td className="p-2 uppercase font-bold text-[10px]">{p.paymentMethod}</td>
                          <td className="p-2 font-mono text-stone-600">{p.transactionReference}</td>
                          <td className="p-2 font-bold text-stone-900">{p.amountETB} ETB</td>
                          <td className="p-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                p.status === 'APPROVED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : p.status === 'PENDING'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-stone-200">
              <button
                onClick={() => handleOpenSuspendModal(selectedStudent)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedStudent.isSuspended
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                }`}
              >
                {selectedStudent.isSuspended ? (
                  <>
                    <PlayCircle className="w-4 h-4" />
                    <span>አካውንቱን አንቃ (Reactivate Account)</span>
                  </>
                ) : (
                  <>
                    <PauseCircle className="w-4 h-4" />
                    <span>አካውንቱን አግድ (Suspend Account)</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                ዝጋ (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACCOUNT SUSPENSION CONFIRMATION MODAL */}
      {suspendingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 border border-stone-300 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h4 className="text-base font-bold text-stone-900 font-serif-ethiopic flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-emerald-700" />
                <span>
                  {suspendingStudent.isSuspended
                    ? 'የተማሪውን አካውንት ዳግም አንቃ (Reactivate)'
                    : 'የተማሪውን አካውንት አግድ (Suspend Account)'}
                </span>
              </h4>
              <button
                onClick={() => setSuspendingStudent(null)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-2 text-stone-600">
              <p>
                ተማሪ፡ <strong className="text-stone-900">{suspendingStudent.displayName}</strong>
              </p>
              <p>
                ኢሜይል፡ <strong>{suspendingStudent.email}</strong>
              </p>
              <p className="text-stone-500">
                ይህ እርምጃ የተማሪውን መማሪያ በር ይቆልፋል/ይከፍታል። እርምጃው በስርዓቱ ኦዲት መዝገብ ላይ ይመዘገባል።
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">ምክንያት (Reason):</label>
              <input
                type="text"
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                placeholder="e.g. Terms of service violation, or manual verification completed"
                className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSuspendingStudent(null)}
                className="px-3 py-1.5 bg-stone-100 text-stone-600 rounded-lg text-xs font-bold cursor-pointer"
              >
                አቋርጥ (Cancel)
              </button>
              <button
                type="button"
                disabled={isSubmittingSuspension}
                onClick={handleConfirmSuspension}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all cursor-pointer ${
                  suspendingStudent.isSuspended
                    ? 'bg-emerald-700 hover:bg-emerald-800'
                    : 'bg-rose-700 hover:bg-rose-800'
                }`}
              >
                {isSubmittingSuspension
                  ? 'በማከናወን ላይ...'
                  : suspendingStudent.isSuspended
                  ? 'አንቃ (Reactivate)'
                  : 'አግድ (Suspend)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 border border-stone-300 shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-stone-900 font-serif-ethiopic">
              አዲስ ተማሪ ይመዝግቡ (Register New Student)
            </h4>
            <form onSubmit={handleAddStudent} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">ሙሉ ስም (Full Name):</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. ሰለሞን ታደሰ"
                  className="w-full text-xs p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">ኢሜይል (Email):</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="student@nur.edu.et"
                  className="w-full text-xs p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">ክፍል (Grade Level):</label>
                <select
                  value={newGrade}
                  onChange={(e) => setNewGrade(parseInt(e.target.value) as Grade)}
                  className="w-full text-xs p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  <option value={9}>Grade 9 (9ኛ ክፍል)</option>
                  <option value={10}>Grade 10 (10ኛ ክፍል)</option>
                  <option value={11}>Grade 11 (11ኛ ክፍል)</option>
                  <option value={12}>Grade 12 (12ኛ ክፍል)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 bg-stone-100 text-stone-600 rounded-lg text-xs font-bold cursor-pointer"
                >
                  አቋርጥ (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  {isSaving ? 'በመመዝገብ ላይ...' : 'መዝግብ (Register)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
