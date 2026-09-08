import React, { useState } from 'react';
import { X, Upload, CheckCircle, FileText, BookPlus, AlertCircle, RefreshCw } from 'lucide-react';
import { GradeLevel, TextbookImportPayload } from '../types/curriculumEngine';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: () => void;
  language?: string;
}

export const TextbookIngestionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onImportSuccess,
  language = 'am',
}) => {
  const [grade, setGrade] = useState<GradeLevel>(9);
  const [subjectId, setSubjectId] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [publisher, setPublisher] = useState('Ministry of Education Ethiopia');
  const [edition, setEdition] = useState('New Curriculum (አዲሱ ሥርዓተ-ትምህርት)');
  const [jsonInput, setJsonInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoadSampleTemplate = () => {
    const template: TextbookImportPayload = {
      grade: 9,
      subjectId: 'geo-g9',
      subjectName: 'Geography Grade 9',
      publisher: 'Federal Democratic Republic of Ethiopia Ministry of Education',
      edition: 'New Curriculum (አዲሱ ሥርዓተ-ትምህርት)',
      units: [
        {
          id: 'geo-g9-u1',
          unitNumber: 1,
          title: {
            en: 'Geological Structure and Relief of Ethiopia and the Horn',
            am: 'የኢትዮጵያና የአፍሪካ ቀንድ ጂኦሎጂካል አቀማመጥና መልክዓ-ምድር',
          },
          description: 'Geological history, plate tectonics, Ethiopian rift valley, and topographic regions.',
          textbookPageStart: 1,
          textbookPageEnd: 32,
          sections: [
            {
              id: 'geo-g9-u1-s1',
              sectionNumber: '1.1',
              title: {
                en: 'Geological Eras and Ethiopian Rock Formations',
                am: 'የጂኦሎጂ ዘመናት እና የኢትዮጵያ ዓለቶች አፈጣጠር',
              },
              textbookPageStart: 2,
              textbookPageEnd: 15,
              lessons: [
                {
                  id: 'geo-g9-u1-s1-l1',
                  lessonNumber: 'Lesson 1.1',
                  title: {
                    en: 'Precambrian, Paleozoic, Mesozoic, and Cenozoic Eras',
                    am: 'የፕሪካምብሪያን፣ ፓሊዮዞይክ፣ ሜሶዞይክ እና ሴኖዞይክ ዘመናት',
                  },
                  periodCount: 2,
                  textbookPageStart: 2,
                  textbookPageEnd: 8,
                  topics: [
                    {
                      id: 'geo-g9-u1-top1',
                      topicNumber: '1.1.1',
                      title: {
                        en: 'Precambrian Basement Complex in Ethiopia',
                        am: 'የፕሪካምብሪያን ጥንታዊ ዓለቶች ስርጭት በኢትዮጵያ',
                      },
                      summary: 'Precambrian rocks are the oldest basement rocks covering parts of Tigray, Wollega, Sidama, and Hararghe rich in metallic minerals.',
                      textbookPage: 4,
                      difficulty: 'medium',
                      prerequisites: [],
                      learningOutcomes: [
                        {
                          id: 'lo-geo9-01',
                          code: 'LO-G9-U1-01',
                          description: {
                            en: 'Identify the distribution and economic importance of Precambrian rocks in Ethiopia.',
                            am: 'በኢትዮጵያ ውስጥ የፕሪካምብሪያን ዓለቶች ስርጭትና ኢኮኖሚያዊ ጠቀሜታቸውን መለየት።',
                          },
                          bloomLevel: 'understand',
                        },
                      ],
                      explanations: {
                        overview: 'Precambrian rocks form the crystalline basement of Ethiopia and contain gold and platinum reserves.',
                        coreConcepts: ['Cover about 25% of Ethiopian land surface', 'Host vital minerals like Shakiso gold'],
                      },
                      examples: [],
                      activities: [],
                      exercises: [],
                    },
                  ],
                },
              ],
            },
          ],
          unitReview: {
            summaryPoints: ['Ethiopia has diverse geological structures shaped by Mesozoic marine transgressions and Cenozoic rifting.'],
            keyTerms: [{ term: 'Rift Valley', definition: 'A lowland region formed where tectonic plates diverge.' }],
            reviewQuestions: ['Explain the economic significance of Mesozoic sedimentary rocks in Ethiopia.'],
            textbookPage: 30,
          },
          unitAssessment: {
            title: 'Unit 1 Geography Assessment',
            instructions: 'Analyze geological formations accurately.',
            textbookPage: 31,
            questions: [],
          },
        },
      ],
    };

    setGrade(9);
    setSubjectId('geo-g9');
    setSubjectName('Geography Grade 9');
    setJsonInput(JSON.stringify(template, null, 2));
    setError(null);
  };

  const handleImport = async () => {
    setError(null);
    setResult(null);
    setIsSubmitting(true);

    try {
      if (!jsonInput.trim()) {
        throw new Error('Please provide textbook JSON definition or load the official template.');
      }

      const parsed: TextbookImportPayload = JSON.parse(jsonInput);
      parsed.grade = grade;
      parsed.subjectId = subjectId || parsed.subjectId || `sub-${Date.now()}`;
      parsed.subjectName = subjectName || parsed.subjectName || 'New Subject';
      parsed.publisher = publisher;
      parsed.edition = edition;

      const res = await fetch('/api/curriculum/import-textbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to import textbook');
      }

      const data = await res.json();
      setResult(data);
      if (onImportSuccess) onImportSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred while parsing or importing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <BookPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                {language === 'am' ? 'አዲስ የኢትዮጵያ መማሪያ መጽሐፍ መዝግብ (Textbook Importer)' : 'Import Ethiopian Curriculum Textbook'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'am'
                  ? 'ያለ ምንም ኮድ ለውጥ አዲስ የ9-12ኛ ክፍል መማሪያ መጽሐፍትን ወደ ስርዓተ-ትምህርት ኢንጅኑ የማስገቢያ መሳሪያ'
                  : 'Add new Ethiopian Grade 9-12 textbooks without modifying core application code'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Metadata inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'am' ? 'የትምህርት ደረጃ (Grade)' : 'Grade Level'}
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(parseInt(e.target.value, 10) as GradeLevel)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-indigo-500"
              >
                <option value={9}>Grade 9 (9ኛ ክፍል)</option>
                <option value={10}>Grade 10 (10ኛ ክፍል)</option>
                <option value={11}>Grade 11 (11ኛ ክፍል)</option>
                <option value={12}>Grade 12 (12ኛ ክፍል)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'am' ? 'የትምህርት ስም (Subject Name)' : 'Subject Name'}
              </label>
              <input
                type="text"
                placeholder="e.g. Geography Grade 9"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-slate-700">
              {language === 'am' ? 'የመማሪያ መጽሐፍ የይዘት ውቅር (JSON Schema)' : 'Textbook Hierarchy JSON'}
            </span>
            <button
              type="button"
              onClick={handleLoadSampleTemplate}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              {language === 'am' ? 'የሞዴል ቅጽ አስገባ (Load Sample Template)' : 'Load Sample Template'}
            </button>
          </div>

          <textarea
            rows={10}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder={`{\n  "grade": 9,\n  "subjectId": "math-g9",\n  "units": [...]\n}`}
            className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 bg-slate-900 text-slate-100 focus:outline-hidden focus:border-indigo-500"
          ></textarea>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                {language === 'am' ? 'መጽሐፉ በተሳካ ሁኔታ ተመዝግቧል!' : 'Textbook Successfully Processed!'}
              </div>
              <p>Subject ID: {result.subjectId}</p>
              <p>Total Units Processed: {result.totalUnits}</p>
              <p>Total Topics Indexed: {result.totalTopics}</p>
              <p>Total RAG Chunks Generated: {result.indexedChunks}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl transition-colors"
          >
            {language === 'am' ? 'ዝጋ' : 'Cancel'}
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleImport}
            className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                {language === 'am' ? 'በማቀናበር ላይ...' : 'Processing Textbook...'}
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                {language === 'am' ? 'መጽሐፉን ወደ ኢንጅን አስገባ' : 'Import to Engine'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
