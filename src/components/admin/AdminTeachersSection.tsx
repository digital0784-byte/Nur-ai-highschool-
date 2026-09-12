import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  Plus,
  Mail,
  BookOpen,
  Award,
  Layers,
  Phone,
  Trash2,
} from 'lucide-react';
import { Grade } from '../../types';

interface TeacherItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  grades: Grade[];
  assignedClasses: string[];
  status: 'active' | 'on_leave';
}

export const AdminTeachersSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [teachers, setTeachers] = useState<TeacherItem[]>([
    {
      id: 'tch_1',
      name: 'መምህር አለማየሁ ታደሰ (Alemayehu Tadesse)',
      email: 'alemayehu.t@nur.edu.et',
      phone: '+251 91 123 4567',
      subjects: ['Biology', 'Chemistry'],
      grades: [9, 10],
      assignedClasses: ['Grade 9-A', 'Grade 10-A'],
      status: 'active',
    },
    {
      id: 'tch_2',
      name: 'መምህርት ትዕግስት በቀለ (Tigist Bekele)',
      email: 'tigist.b@nur.edu.et',
      phone: '+251 92 345 6789',
      subjects: ['Physics', 'Mathematics'],
      grades: [11, 12],
      assignedClasses: ['Grade 11-Natural', 'Grade 12-Candidate'],
      status: 'active',
    },
    {
      id: 'tch_3',
      name: 'መምህር ዮናስ ከበደ (Yonas Kebede)',
      email: 'yonas.k@nur.edu.et',
      phone: '+251 93 456 7890',
      subjects: ['English', 'History'],
      grades: [9, 10, 11, 12],
      assignedClasses: ['Grade 9-B', 'Grade 11-Social'],
      status: 'active',
    },
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Biology');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setTeachers((prev) => [
      ...prev,
      {
        id: 'tch_' + Date.now(),
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || '+251 90 000 0000',
        subjects: [subject],
        grades: [9, 10],
        assignedClasses: ['Grade 9-A'],
        status: 'active',
      },
    ]);
    setName('');
    setEmail('');
    setPhone('');
    setIsAddOpen(false);
  };

  const filtered = teachers.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h3 className="text-lg font-bold text-stone-900 font-serif-ethiopic flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-700" />
            <span>የመምህራን አስተዳደር (Teachers Management)</span>
          </h3>
          <p className="text-xs text-stone-500">
            Assigned subjects, secondary grade levels, class allocations, and contact records
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>አዲስ መምህር መዝግብ (Add Teacher)</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search teachers by name or email..."
          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-600"
        />
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((tch) => (
          <div
            key={tch.id}
            className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                  {tch.status}
                </span>
                <span className="text-[11px] text-stone-400 font-mono">{tch.id}</span>
              </div>

              <h4 className="text-base font-bold text-stone-900 font-serif-ethiopic">
                {tch.name}
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">{tch.email}</p>

              <div className="mt-3 space-y-1.5 text-xs text-stone-600">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>{tch.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-stone-400" />
                  <span className="font-semibold">{tch.subjects.join(', ')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-stone-400" />
                  <span>Grades: {tch.grades.join(', ')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-stone-400" />
                  <span className="text-indigo-800 font-semibold">{tch.assignedClasses.join(' & ')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 border border-stone-300 shadow-2xl space-y-4 text-xs">
            <h4 className="text-base font-bold text-stone-900 font-serif-ethiopic">
              አዲስ መምህር መመዝገብ (Register Teacher)
            </h4>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">ሙሉ ስም (Full Name):</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="መምህር ..."
                  className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">ኢሜይል (Email):</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@nur.edu.et"
                  className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">ስልክ ቁጥር (Phone):</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+251 9..."
                  className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">የትምህርት አይነት (Subject):</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
                >
                  <option value="Biology">Biology</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Physics">Physics</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="English">English</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                >
                  ሰርዝ (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-lg cursor-pointer"
                >
                  መዝግብ (Save)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
