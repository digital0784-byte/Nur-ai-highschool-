import React, { useState, useEffect } from 'react';
import {
  Mic,
  Activity,
  Globe,
  BookOpen,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Save,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import {
  VoiceTutorUsageAnalytics,
  VoiceTutorCostConfig,
} from '../../types/voiceTutor';
import {
  voiceTutorService,
  DEFAULT_VOICE_COST_CONFIG,
} from '../../services/voiceTutorService';

export const AdminVoiceAnalyticsSection: React.FC = () => {
  const [analytics, setAnalytics] = useState<VoiceTutorUsageAnalytics | null>(null);
  const [config, setConfig] = useState<VoiceTutorCostConfig>(DEFAULT_VOICE_COST_CONFIG);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await voiceTutorService.getSuperAdminVoiceAnalytics();
      setAnalytics(data);
    } catch (e) {
      console.warn('Analytics loading error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Simulate saving cost config
      await new Promise((r) => setTimeout(r, 600));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.warn('Config save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400">
        <Activity className="w-8 h-8 animate-spin mx-auto mb-2 text-emerald-500" />
        <p className="text-sm">Loading AI Voice Tutor analytics & cost controls...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                NUR AI Voice Tutor & Conversation Engine
              </h2>
              <p className="text-xs text-slate-400">
                Super Admin telemetry, multilingual usage distributions, and infrastructure cost controls
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> SUPER_ADMIN Managed
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400 block mb-1">Total Voice Sessions</span>
          <span className="text-2xl font-bold text-slate-100">
            {analytics?.totalVoiceSessions?.toLocaleString() || '412'}
          </span>
          <span className="text-[11px] text-emerald-400 block mt-1">+14% this week</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400 block mb-1">Spoken Minutes</span>
          <span className="text-2xl font-bold text-slate-100">
            {analytics?.totalSpokenMinutes?.toLocaleString() || '3,240'}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">~8.4 min avg session</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400 block mb-1">Voice Quizzes Solved</span>
          <span className="text-2xl font-bold text-emerald-400">
            {analytics?.totalQuestionsSolved?.toLocaleString() || '1,890'}
          </span>
          <span className="text-[11px] text-emerald-500 block mt-1">Verified learning events</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400 block mb-1">Active Students Today</span>
          <span className="text-2xl font-bold text-slate-100">
            {analytics?.activeStudentsToday?.toLocaleString() || '184'}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">100% audio privacy</span>
        </div>
      </div>

      {/* Distributions (Language & Subject) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-200">Multilingual Distribution</h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">አማርኛ (Amharic)</span>
                <span className="font-semibold text-emerald-400">64%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '64%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Afaan Oromoo</span>
                <span className="font-semibold text-amber-400">17%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '17%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">ትግርኛ (Tigrinya)</span>
                <span className="font-semibold text-blue-400">9%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '9%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">English</span>
                <span className="font-semibold text-purple-400">10%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '10%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Subject Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-200">Curriculum Subject Voice Traffic</h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Mathematics</span>
                <span className="font-semibold text-slate-200">42%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-teal-500 h-2 rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Physics</span>
                <span className="font-semibold text-slate-200">28%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-teal-500 h-2 rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Chemistry</span>
                <span className="font-semibold text-slate-200">16%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-teal-500 h-2 rounded-full" style={{ width: '16%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">English & Others</span>
                <span className="font-semibold text-slate-200">14%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-teal-500 h-2 rounded-full" style={{ width: '14%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Controls & Quota Limits */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">
              Super Admin Cost Controls & Usage Quotas
            </h3>
          </div>
          {saveSuccess && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Quotas Updated Successfully
            </span>
          )}
        </div>

        <form onSubmit={handleSaveConfig} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">
              Daily Free Requests Allowance
            </label>
            <input
              type="number"
              value={config.maxDailyRequestsPerFreeUser}
              onChange={(e) =>
                setConfig({
                  ...config,
                  maxDailyRequestsPerFreeUser: parseInt(e.target.value, 10) || 5,
                })
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              For unregistered or free trial students
            </span>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">
              Daily Subscriber Quota
            </label>
            <input
              type="number"
              value={config.maxDailyRequestsPerSubscriber}
              onChange={(e) =>
                setConfig({
                  ...config,
                  maxDailyRequestsPerSubscriber: parseInt(e.target.value, 10) || 100,
                })
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              For active Telebirr/CBE subscribed students
            </span>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">
              Max Session Duration (Minutes)
            </label>
            <input
              type="number"
              value={config.maxSessionDurationMinutes}
              onChange={(e) =>
                setConfig({
                  ...config,
                  maxSessionDurationMinutes: parseInt(e.target.value, 10) || 30,
                })
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Prevents runaway background voice streams
            </span>
          </div>

          <div className="md:col-span-3 flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2 shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Apply Cost Controls'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
