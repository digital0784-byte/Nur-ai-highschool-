import React, { useState } from 'react';
import {
  Users,
  Search,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  Bell,
  GraduationCap,
} from 'lucide-react';

interface ParentItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  studentName: string;
  studentGrade: number;
  lastNotified: string;
}

export const AdminParentsSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [parents, setParents] = useState<ParentItem[]>([
    {
      id: 'par_1',
      name: 'አቶ ቢቂላ ገዳ (Bikila Geda)',
      email: 'bikila.g@gmail.com',
      phone: '+251 91 222 3344',
      studentName: 'አበበ ቢቂላ (Abebe Bikila)',
      studentGrade: 9,
      lastNotified: '2025-02-28 (Quiz score report)',
    },
    {
      id: 'par_2',
      name: 'ወ/ሮ ዘውዲቱ በቀለ (Zewditu Bekele)',
      email: 'zewditu.b@gmail.com',
      phone: '+251 92 333 4455',
      studentName: 'ጥሩነሽ ዲባባ (Tirunesh Dibaba)',
      studentGrade: 10,
      lastNotified: '2025-02-27 (Progress update)',
    },
    {
      id: 'par_3',
      name: 'አቶ ገብረስላሴ ዘውዴ (Gebrselassie Zewde)',
      email: 'gebrselassie.z@gmail.com',
      phone: '+251 94 444 5566',
      studentName: 'ኃይሌ ገብረስላሴ (Haile Gebrselassie)',
      studentGrade: 11,
      lastNotified: '2025-02-26 (Honor roll award)',
    },
  ]);

  const [notificationSent, setNotificationSent] = useState<string | null>(null);

  const handleSendSMS = (parentId: string, parentName: string) => {
    setNotificationSent(parentName);
    setTimeout(() => setNotificationSent(null), 3000);
  };

  const filtered = parents.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h3 className="text-lg font-bold text-stone-900 font-serif-ethiopic flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-700" />
            <span>የወላጆች ፖርታል እና ግንኙነት (Parents Management & Notifications)</span>
          </h3>
          <p className="text-xs text-stone-500">
            Connected parent contacts, linked student progress, and automated SMS / academic notices
          </p>
        </div>

        {notificationSent && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>የተማሪ ውጤት ማሳወቂያ ለ {notificationSent} ተልኳል! (SMS Dispatched)</span>
          </div>
        )}
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by parent name, student name, or phone number..."
          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((par) => (
          <div
            key={par.id}
            className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                  Grade {par.studentGrade} Parent
                </span>
                <span className="text-[11px] text-stone-400 font-mono">{par.id}</span>
              </div>

              <h4 className="text-base font-bold text-stone-900 font-serif-ethiopic">
                {par.name}
              </h4>

              <div className="mt-3 space-y-1.5 text-xs text-stone-600">
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
                  <span>ተማሪ: <strong className="text-stone-800">{par.studentName}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>{par.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  <span>{par.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                  <Bell className="w-3 h-3 text-stone-400" />
                  <span>የመጨረሻ ማሳወቂያ: {par.lastNotified}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={() => handleSendSMS(par.id, par.name)}
                className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-900 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>የውጤት ሪፖርት ላክ (Send SMS Alert)</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
