import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Edit2,
  Save,
  ShieldCheck,
  AlertCircle,
  Building,
  Smartphone,
  Info,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { subscriptionService, SUPER_ADMIN_EMAIL } from '../../services/subscriptionService';
import { PaymentMethodConfig, PaymentMethodName } from '../../types/subscription';

export const AdminPaymentMethodsSection: React.FC = () => {
  const { user } = useAuth();
  const { isOwnerSuperAdmin } = useSubscription();

  const [methods, setMethods] = useState<PaymentMethodConfig[]>([]);
  const [editingMethodId, setEditingMethodId] = useState<PaymentMethodName | null>(null);

  // Edit draft states
  const [editAccountName, setEditAccountName] = useState<string>('');
  const [editAccountNumber, setEditAccountNumber] = useState<string>('');
  const [editInstructionsAm, setEditInstructionsAm] = useState<string>('');
  const [editInstructionsEn, setEditInstructionsEn] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const unsub = subscriptionService.subscribeToPaymentMethods((data) => {
      setMethods(data);
    });
    return () => unsub();
  }, []);

  const handleStartEdit = (m: PaymentMethodConfig) => {
    setEditingMethodId(m.id);
    setEditAccountName(m.accountName);
    setEditAccountNumber(m.accountNumber);
    setEditInstructionsAm(m.instructionsAm);
    setEditInstructionsEn(m.instructionsEn);
  };

  const handleToggleEnabled = async (m: PaymentMethodConfig) => {
    if (!isOwnerSuperAdmin) {
      setAlertMsg({ type: 'error', text: 'Unauthorized. Only Super Admin can toggle payment methods.' });
      return;
    }

    try {
      await subscriptionService.updatePaymentMethod(m.id, {
        enabled: !m.enabled,
      });
      setAlertMsg({
        type: 'success',
        text: `${m.name} is now ${!m.enabled ? 'Enabled' : 'Disabled'}.`,
      });
    } catch (err: any) {
      setAlertMsg({ type: 'error', text: `Failed to update: ${err.message}` });
    }
  };

  const handleSaveEdit = async (methodId: PaymentMethodName) => {
    if (!isOwnerSuperAdmin) {
      setAlertMsg({ type: 'error', text: 'Unauthorized. Only Super Admin can modify account settings.' });
      return;
    }

    setIsSaving(true);
    setAlertMsg(null);
    try {
      await subscriptionService.updatePaymentMethod(methodId, {
        accountName: editAccountName.trim(),
        accountNumber: editAccountNumber.trim(),
        instructionsAm: editInstructionsAm.trim(),
        instructionsEn: editInstructionsEn.trim(),
      });
      setEditingMethodId(null);
      setAlertMsg({
        type: 'success',
        text: 'የባንክ/ቴሌብር መረጃዎች በተሳካ ሁኔታ ተሻሽለዋል! (Payment instructions updated)',
      });
    } catch (err: any) {
      setAlertMsg({ type: 'error', text: `Error saving: ${err.message}` });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-700" />
              <span>Verified Ethiopian Gateways</span>
            </span>
            <span className="text-xs text-stone-500 font-mono">Telebirr, CBE, Dashen & BoA</span>
          </div>
          <h2 className="text-lg font-bold font-serif-ethiopic text-stone-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-700" />
            <span>የክፍያ ዘዴዎችና የባንክ ሂሳቦች ቅንብር (Payment Methods Management)</span>
          </h2>
          <p className="text-xs text-stone-500">
            Configure student payment receiving accounts, instructions in Amharic & English, and channel availability.
          </p>
        </div>

        <div className="bg-stone-100 px-3 py-2 rounded-xl text-right">
          <span className="text-[10px] text-stone-500 uppercase font-bold block">የደህንነት መመሪያ</span>
          <span className="text-xs font-bold text-stone-800">Never store secret API keys in client</span>
        </div>
      </div>

      {alertMsg && (
        <div
          className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
            alertMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {alertMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{alertMsg.text}</span>
        </div>
      )}

      {/* Grid of 4 Payment Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {methods.map((m) => {
          const isEditing = editingMethodId === m.id;
          return (
            <div
              key={m.id}
              className={`bg-white rounded-2xl border transition-all duration-200 shadow-2xs overflow-hidden ${
                m.enabled ? 'border-stone-200' : 'border-stone-200 opacity-70 bg-stone-50'
              }`}
            >
              {/* Card Header */}
              <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white border border-stone-200 flex items-center justify-center font-bold text-stone-800 shadow-xs">
                    {m.id === 'telebirr' ? (
                      <Smartphone className="w-4 h-4 text-teal-600" />
                    ) : (
                      <Building className="w-4 h-4 text-emerald-700" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-900">{m.name}</h3>
                    <span className="text-[10px] text-stone-500 uppercase font-mono">{m.id}</span>
                  </div>
                </div>

                {/* Enable/Disable Toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleEnabled(m)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      m.enabled
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {m.enabled ? 'Enabled' : 'Disabled'}
                  </button>

                  {!isEditing && (
                    <button
                      onClick={() => handleStartEdit(m)}
                      className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-stone-200 rounded-lg cursor-pointer"
                      title="Edit Account Details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3 text-xs">
                {isEditing ? (
                  <div className="space-y-3 animate-in fade-in">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">
                        የሂሳብ ባለቤት ስም (Account Holder Name):
                      </label>
                      <input
                        type="text"
                        value={editAccountName}
                        onChange={(e) => setEditAccountName(e.target.value)}
                        className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">
                        የሂሳብ ቁጥር / Till / Phone (Account / Till Number):
                      </label>
                      <input
                        type="text"
                        value={editAccountNumber}
                        onChange={(e) => setEditAccountNumber(e.target.value)}
                        className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">
                        የክፍያ መመሪያ በአማርኛ (Amharic Instructions):
                      </label>
                      <textarea
                        rows={2}
                        value={editInstructionsAm}
                        onChange={(e) => setEditInstructionsAm(e.target.value)}
                        className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-serif-ethiopic"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">
                        የክፍያ መመሪያ በእንግሊዝኛ (English Instructions):
                      </label>
                      <textarea
                        rows={2}
                        value={editInstructionsEn}
                        onChange={(e) => setEditInstructionsEn(e.target.value)}
                        className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingMethodId(null)}
                        className="px-3 py-1.5 bg-stone-100 text-stone-600 rounded-lg font-bold"
                      >
                        አቋርጥ (Cancel)
                      </button>
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleSaveEdit(m.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isSaving ? 'በማስቀመጥ ላይ...' : 'አስቀምጥ (Save)'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Account Name:</span>
                      <span className="font-bold text-stone-900">{m.accountName}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Account / Till:</span>
                      <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {m.accountNumber}
                      </span>
                    </div>

                    <div className="pt-1">
                      <span className="text-[11px] font-bold text-stone-500 block mb-0.5">መመሪያ (Amharic):</span>
                      <p className="text-stone-700 font-serif-ethiopic text-[11px] leading-relaxed">
                        {m.instructionsAm}
                      </p>
                    </div>

                    <div className="pt-1">
                      <span className="text-[11px] font-bold text-stone-500 block mb-0.5">Instructions (English):</span>
                      <p className="text-stone-600 text-[11px] leading-relaxed">
                        {m.instructionsEn}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
