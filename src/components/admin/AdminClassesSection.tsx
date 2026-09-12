import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Users,
  GraduationCap,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  Trash2,
  UserPlus,
} from 'lucide-react';
import { ClassGroup } from '../../types/adminDashboard';
import { Grade } from '../../types';
import { adminFirestoreService } from '../../services/adminFirestore';

interface AdminClassesSectionProps {
  classes: ClassGroup[];
  onRefresh: () => void;
}

export const AdminClassesSection: React.FC<AdminClassesSectionProps> = ({
  classes,
  onRefresh,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassGroup | null>(null);

  // New class state
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<Grade>(9);
  const [section, setSection] = useState('A');
  const [teacherName, setTeacherName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [schedule, setSchedule] = useState('Mon-Fri 8:30 AM - 3:00 PM');
  const [isSaving, setIsSaving] = useState(false);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      const newClass: ClassGroup = {
        id: `cls_gr${grade}_${section.toLowerCase()}_${Date.now()}`,
        name: name.trim(),
        grade,
        section,
        academicYear: '2017 E.C. (2024/2025)',
        teacherId: 'tchr_' + Date.now(),
        teacherName: teacherName.trim() || 'መምህር አለሙ ታደሰ',
        studentUids: [],
        roomNumber: roomNumber.trim() || 'Block 2, Room 104',
        schedule,
        createdAt: new Date().toISOString(),
      };
      await adminFirestoreService.saveClass(newClass);
      setIsAddOpen(false);
      setName('');
      onRefresh();
    } catch (err) {
      console.error('Error saving class:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClass = async (classId: string) => {
    if (!confirm('Are you sure you want to remove this class section?')) return;
    await adminFirestoreService.deleteClass(classId);
    onRefresh();
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h3 className="text-lg font-bold text-stone-900 font-serif-ethiopic flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-700" />
            <span>ክፍሎች እና ሴክሽኖች (Classes & Sections Management)</span>
          </h3>
          <p className="text-xs text-stone-500">
            Organize secondary students into class cohorts, assign homeroom teachers, and schedule periods
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2E6B4A] hover:bg-[#235338] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>አዲስ ክፍል ፍጠር (Create Class)</span>
        </button>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  Grade {cls.grade} • Section {cls.section}
                </span>
                <span className="text-[10px] text-stone-400">{cls.academicYear}</span>
              </div>

              <h4 className="text-base font-bold text-stone-900 font-serif-ethiopic">
                {cls.name}
              </h4>

              <div className="mt-3 space-y-1.5 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-stone-400" />
                  <span className="font-semibold">{cls.teacherName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{cls.roomNumber || 'Block 2, Room 102'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>{cls.schedule || '8:30 AM - 3:00 PM'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-stone-400" />
                  <span>{cls.studentUids?.length || 24} Enrolled Students</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedClass(cls)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer flex items-center gap-1"
              >
                <Users className="w-3.5 h-3.5" />
                <span>የተማሪዎች ዝርዝር (Roster)</span>
              </button>

              <button
                onClick={() => handleDeleteClass(cls.id)}
                className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                title="Delete Class"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Class Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 border border-stone-300 shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-stone-900 font-serif-ethiopic">
              አዲስ ክፍል መመዝገብ (Create Class Section)
            </h4>
            <form onSubmit={handleCreateClass} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">የክፍል ስም (Class Name):</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Grade 9 - ክፍል A (Natural)"
                  className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">ደረጃ (Grade):</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(parseInt(e.target.value) as Grade)}
                    className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  >
                    <option value={9}>Grade 9</option>
                    <option value={10}>Grade 10</option>
                    <option value={11}>Grade 11</option>
                    <option value={12}>Grade 12</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">ሴክሽን (Section):</label>
                  <input
                    type="text"
                    required
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    placeholder="A, B, Nat-1, Soc-1"
                    className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">የክፍል ኃላፊ መምህር (Homeroom Teacher):</label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="መምህር አለማየሁ ታደሰ"
                  className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">ክፍል ቁጥር (Room Number):</label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="Block 2, Room 104"
                  className="w-full p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
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
                  disabled={isSaving}
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg cursor-pointer transition-colors"
                >
                  {isSaving ? 'በመፍጠር ላይ...' : 'ፍጠር (Save Class)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Class Roster Modal */}
      {selectedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-stone-300 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h4 className="text-base font-bold text-stone-900 font-serif-ethiopic">
                  {selectedClass.name} - የተማሪዎች ስም ዝርዝር (Class Roster)
                </h4>
                <p className="text-xs text-stone-500">
                  Lead Teacher: {selectedClass.teacherName} • {selectedClass.roomNumber}
                </p>
              </div>
              <button
                onClick={() => setSelectedClass(null)}
                className="text-stone-400 hover:text-stone-600 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs max-h-60 overflow-y-auto pr-1">
              {[
                { name: 'አበበ ቢቂላ (Abebe Bikila)', email: 'abebe.b@nur.edu.et', mastery: '82%' },
                { name: 'ጥሩነሽ ዲባባ (Tirunesh Dibaba)', email: 'tirunesh.d@nur.edu.et', mastery: '76%' },
                { name: 'ኃይሌ ገብረስላሴ (Haile Gebrselassie)', email: 'haile.g@nur.edu.et', mastery: '91%' },
                { name: 'ደራርቱ ቱሉ (Derartu Tulu)', email: 'derartu.t@nur.edu.et', mastery: '68%' },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                  <div>
                    <div className="font-bold text-stone-800 font-serif-ethiopic">{s.name}</div>
                    <div className="text-[10px] text-stone-400">{s.email}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Mastery {s.mastery}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedClass(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                ዝጋ (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
