import React, { useState } from 'react';
import {
  FileText,
  Download,
  Edit3,
  Eye,
  RefreshCw,
  Plus,
  Trash2,
  Save,
  Copy,
  CheckSquare,
  Sparkles,
  ArrowLeft,
  Share2,
  Check,
  KeyRound,
  BookOpen,
  CheckCircle2,
  Award,
  ClipboardCheck,
} from 'lucide-react';
import { LKPDContent, LKPDFormData, LKPDTaskItem, LKPDQuestionItem, LKPDTeacherGuide } from '../types';
import { exportLKPDDocx } from '../utils/docxExport';

interface LKPDPreviewProps {
  content: LKPDContent;
  formData: LKPDFormData;
  onUpdateContent: (updated: LKPDContent) => void;
  onSaveDocument: () => void;
  onDuplicate: () => void;
  onOpenRegenerateModal: () => void;
  onBackToForm: () => void;
}

export const LKPDPreview: React.FC<LKPDPreviewProps> = ({
  content,
  formData,
  onUpdateContent,
  onSaveDocument,
  onDuplicate,
  onOpenRegenerateModal,
  onBackToForm,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [saveSuccessNotification, setSaveSuccessNotification] = useState(false);
  const [includeAnswerKey, setIncludeAnswerKey] = useState<boolean>(content.includeAnswerKey ?? true);
  const [activeTab, setActiveTab] = useState<'all' | 'student' | 'teacher'>('all');

  const handleTeacherGuideChange = (field: keyof LKPDTeacherGuide, val: string) => {
    const currentGuide = content.teacherGuide || {};
    onUpdateContent({
      ...content,
      teacherGuide: {
        ...currentGuide,
        [field]: val,
      },
    });
  };

  // Field update helpers
  const handleTextChange = (field: keyof LKPDContent, val: any) => {
    onUpdateContent({
      ...content,
      [field]: val,
    });
  };

  // Learning objective handlers
  const handleObjectiveChange = (index: number, val: string) => {
    const updated = [...content.learningObjectives];
    updated[index] = val;
    onUpdateContent({ ...content, learningObjectives: updated });
  };

  const handleAddObjective = () => {
    onUpdateContent({
      ...content,
      learningObjectives: [...content.learningObjectives, 'Peserta didik mampu...'],
    });
  };

  const handleRemoveObjective = (index: number) => {
    onUpdateContent({
      ...content,
      learningObjectives: content.learningObjectives.filter((_, i) => i !== index),
    });
  };

  // Instruction handlers
  const handleInstructionChange = (index: number, val: string) => {
    const updated = [...content.instructions];
    updated[index] = val;
    onUpdateContent({ ...content, instructions: updated });
  };

  const handleAddInstruction = () => {
    onUpdateContent({
      ...content,
      instructions: [...content.instructions, 'Petunjuk tambahan baru...'],
    });
  };

  const handleRemoveInstruction = (index: number) => {
    onUpdateContent({
      ...content,
      instructions: content.instructions.filter((_, i) => i !== index),
    });
  };

  // Tasks handlers
  const handleTaskChange = (index: number, updatedItem: Partial<LKPDTaskItem>) => {
    const updated = [...content.tasks];
    updated[index] = { ...updated[index], ...updatedItem };
    onUpdateContent({ ...content, tasks: updated });
  };

  const handleAddTask = () => {
    const newTask: LKPDTaskItem = {
      id: `task-${Date.now()}`,
      number: content.tasks.length + 1,
      type: 'Aktivitas Tambahan',
      prompt: 'Tuliskan instruksi atau pertanyaan aktivitas di sini...',
      expectedLines: 2,
    };
    onUpdateContent({
      ...content,
      tasks: [...content.tasks, newTask],
    });
  };

  const handleRemoveTask = (index: number) => {
    const filtered = content.tasks
      .filter((_, i) => i !== index)
      .map((t, idx) => ({ ...t, number: idx + 1 }));
    onUpdateContent({ ...content, tasks: filtered });
  };

  // Questions handlers
  const handleQuestionChange = (index: number, updatedItem: Partial<LKPDQuestionItem>) => {
    const updated = [...content.questions];
    updated[index] = { ...updated[index], ...updatedItem };
    onUpdateContent({ ...content, questions: updated });
  };

  const handleAddQuestion = () => {
    const newQ: LKPDQuestionItem = {
      id: `q-${Date.now()}`,
      number: content.questions.length + 1,
      question: 'Pertanyaan eksplorasi pemahaman baru...',
      hotLevel: 'HOTS',
    };
    onUpdateContent({
      ...content,
      questions: [...content.questions, newQ],
    });
  };

  const handleRemoveQuestion = (index: number) => {
    const filtered = content.questions
      .filter((_, i) => i !== index)
      .map((q, idx) => ({ ...q, number: idx + 1 }));
    onUpdateContent({ ...content, questions: filtered });
  };

  // Download Word docx
  const handleDownloadWord = async () => {
    setIsExporting(true);
    try {
      await exportLKPDDocx(content, { includeAnswerKey });
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat membuat file Word.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveClick = () => {
    onSaveDocument();
    setSaveSuccessNotification(true);
    setTimeout(() => setSaveSuccessNotification(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Control Action Header Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4 sticky top-20 z-30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToForm}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Kembali ke formulir"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 font-heading">
                  Hasil Pembuatan LKPD
                </h2>
                <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800">
                  Tersedia
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-100 text-blue-800">
                  <KeyRound className="w-3 h-3 text-blue-600" />
                  Kunci Jawaban Aktif
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {content.subject} &bull; {content.grade} &bull; {content.topic}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Toggle Edit / Preview */}
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isEditMode
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isEditMode ? <Eye className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              <span>{isEditMode ? 'Lihat Preview' : 'Edit Konten'}</span>
            </button>

            {/* Regenerate Button */}
            <button
              onClick={onOpenRegenerateModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
              title="Buat ulang bagian dengan arahan khusus"
            >
              <RefreshCw className="w-4 h-4 text-slate-600" />
              <span>Generate Ulang</span>
            </button>

            {/* Duplicate Button */}
            <button
              onClick={onDuplicate}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
              title="Duplikat untuk kelas atau materi lain"
            >
              <Copy className="w-4 h-4 text-slate-600" />
              <span>Duplikat</span>
            </button>

            {/* Save Document */}
            <button
              onClick={handleSaveClick}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all"
            >
              {saveSuccessNotification ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{saveSuccessNotification ? 'Tersimpan!' : 'Simpan'}</span>
            </button>

            {/* Download Word */}
            <button
              onClick={handleDownloadWord}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Mengunduh...' : 'Download Word (.docx)'}</span>
            </button>
          </div>
        </div>

        {/* SUB-BAR: VIEW FILTER & EXPORT OPTIONS */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          {/* Tabs */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua (LKPD &amp; Kunci Jawaban)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('student')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'student'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lembar Siswa
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('teacher')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'teacher'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-blue-600" />
              Kunci Jawaban Guru
            </button>
          </div>

          {/* Include Answer Key Toggle in Download */}
          <label className="flex items-center gap-2 cursor-pointer select-none bg-emerald-50/80 px-3 py-1.5 rounded-xl border border-emerald-200 text-emerald-950 font-medium hover:bg-emerald-100/60 transition-colors">
            <input
              type="checkbox"
              checked={includeAnswerKey}
              onChange={(e) => setIncludeAnswerKey(e.target.checked)}
              className="w-3.5 h-3.5 rounded-sm text-emerald-600 border-emerald-300 focus:ring-emerald-500"
            />
            <span className="font-semibold text-xs flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Sertakan Kunci Jawaban dalam File Word (.docx)
            </span>
          </label>
        </div>
      </div>

      {/* Document Sheet Layout (Formatted Paper style) */}
      <div className="bg-white rounded-2xl p-6 sm:p-10 lg:p-14 border border-slate-300 shadow-xl max-w-4xl mx-auto text-slate-900 font-serif leading-relaxed">
        {(activeTab === 'all' || activeTab === 'student') && (
          <div>
            {/* KOP / HEADER */}
        <div className="border-b-2 border-slate-900 pb-5 mb-6 text-center space-y-1">
          {isEditMode ? (
            <input
              type="text"
              value={content.schoolName}
              onChange={(e) => handleTextChange('schoolName', e.target.value)}
              className="w-full text-center text-lg font-bold uppercase border-b border-blue-400 pb-1"
            />
          ) : (
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-slate-900 font-heading">
              {content.schoolName || 'SEKOLAH DASAR'}
            </h1>
          )}

          {isEditMode ? (
            <input
              type="text"
              value={content.title}
              onChange={(e) => handleTextChange('title', e.target.value)}
              className="w-full text-center text-xl font-bold text-blue-800 border-b border-blue-400 pb-1"
            />
          ) : (
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-800 font-heading tracking-tight">
              {content.title || 'LEMBAR KERJA PESERTA DIDIK (LKPD)'}
            </h2>
          )}

          <p className="text-xs sm:text-sm text-slate-600 italic">
            Mata Pelajaran: {content.subject} | {content.grade} ({content.phase}) | Semester: {content.semester || '1'}
          </p>
        </div>

        {/* Identity Box */}
        <div className="border-2 border-blue-800 rounded-xl p-4 sm:p-5 bg-blue-50/40 mb-8 font-sans text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex">
                <span className="w-32 font-bold text-slate-700">Topik / Materi</span>
                <span className="font-semibold text-slate-900">: {content.topic}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-bold text-slate-700">Alokasi Waktu</span>
                <span className="text-slate-800">: {content.timeAllocation || '2 x 35 Menit'}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-bold text-slate-700">Karakter LKPD</span>
                <span className="text-slate-800">: {content.characterLkpd || 'Individu dan Kelompok'}</span>
              </div>
            </div>
            <div className="space-y-2 border-t md:border-t-0 md:border-l border-blue-200 pt-3 md:pt-0 md:pl-4">
              <div className="flex items-center">
                <span className="w-32 font-bold text-slate-700">Nama Siswa</span>
                <span className="text-slate-400">: .....................................................</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-bold text-slate-700">No. Absen / Kls</span>
                <span className="text-slate-400">: .....................................................</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-bold text-slate-700">Hari / Tanggal</span>
                <span className="text-slate-400">: .....................................................</span>
              </div>
            </div>
          </div>
        </div>

        {/* A. TUJUAN PEMBELAJARAN */}
        <section className="mb-8 font-sans">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
            <h3 className="text-base sm:text-lg font-bold text-blue-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold">
                A
              </span>
              <span>TUJUAN PEMBELAJARAN</span>
            </h3>
            {isEditMode && (
              <button
                onClick={handleAddObjective}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Tujuan
              </button>
            )}
          </div>

          <ol className="list-decimal list-inside space-y-1.5 text-sm sm:text-base text-slate-800 pl-2">
            {content.learningObjectives.map((obj, idx) => (
              <li key={idx} className="group">
                {isEditMode ? (
                  <div className="inline-flex items-center gap-2 w-11/12 ml-1">
                    <input
                      type="text"
                      value={obj}
                      onChange={(e) => handleObjectiveChange(idx, e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-slate-300 rounded-md"
                    />
                    <button
                      onClick={() => handleRemoveObjective(idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span>{obj}</span>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* B. PETUNJUK MENGERJAKAN */}
        <section className="mb-8 font-sans">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
            <h3 className="text-base sm:text-lg font-bold text-blue-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold">
                B
              </span>
              <span>PETUNJUK MENGERJAKAN</span>
            </h3>
            {isEditMode && (
              <button
                onClick={handleAddInstruction}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Petunjuk
              </button>
            )}
          </div>

          <ol className="list-decimal list-inside space-y-1.5 text-sm sm:text-base text-slate-800 pl-2">
            {content.instructions.map((inst, idx) => (
              <li key={idx}>
                {isEditMode ? (
                  <div className="inline-flex items-center gap-2 w-11/12 ml-1">
                    <input
                      type="text"
                      value={inst}
                      onChange={(e) => handleInstructionChange(idx, e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-slate-300 rounded-md"
                    />
                    <button
                      onClick={() => handleRemoveInstruction(idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span>{inst}</span>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* C. ALAT DAN BAHAN */}
        <section className="mb-8 font-sans">
          <div className="border-b border-slate-200 pb-2 mb-3">
            <h3 className="text-base sm:text-lg font-bold text-blue-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold">
                C
              </span>
              <span>ALAT DAN BAHAN</span>
            </h3>
          </div>

          <div className="flex flex-wrap gap-2 pl-2">
            {content.toolsAndMaterials.map((tool, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-3 py-1 rounded-lg text-xs sm:text-sm font-medium bg-slate-100 text-slate-700 border border-slate-200"
              >
                • {tool}
              </span>
            ))}
          </div>
        </section>

        {/* D. KEGIATAN PEMBELAJARAN (Langkah Apersepsi & Eksplorasi) */}
        <section className="mb-8 font-sans">
          <div className="border-b border-slate-200 pb-2 mb-3">
            <h3 className="text-base sm:text-lg font-bold text-blue-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold">
                D
              </span>
              <span>KEGIATAN PEMBELAJARAN</span>
            </h3>
          </div>

          <div className="space-y-4 pl-2">
            {content.learningSteps.map((step) => (
              <div key={step.step} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <p className="font-bold text-sm text-blue-800 mb-1">
                  Langkah {step.step}: {step.title}
                </p>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* E. TUGAS / AKTIVITAS */}
        <section className="mb-8 font-sans">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-4">
            <h3 className="text-base sm:text-lg font-bold text-blue-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold">
                E
              </span>
              <span>TUGAS DAN AKTIVITAS PESERTA DIDIK</span>
            </h3>
            {isEditMode && (
              <button
                onClick={handleAddTask}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Aktivitas
              </button>
            )}
          </div>

          <div className="space-y-6 pl-2">
            {content.tasks.map((task, idx) => (
              <div
                key={task.id || idx}
                className="border border-slate-200 rounded-xl p-4 bg-white hover:border-slate-300 transition-colors space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-xs font-bold">
                      Aktivitas {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      [{task.type}]
                    </span>
                  </div>

                  {isEditMode && (
                    <button
                      onClick={() => handleRemoveTask(idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Hapus aktivitas ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {isEditMode ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={task.prompt}
                      onChange={(e) => handleTaskChange(idx, { prompt: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg font-medium"
                    />
                    <input
                      type="text"
                      value={task.instruction || ''}
                      onChange={(e) => handleTaskChange(idx, { instruction: e.target.value })}
                      placeholder="Petunjuk pengerjaan..."
                      className="w-full px-3 py-1 text-xs border border-slate-200 rounded-lg text-slate-600"
                    />
                  </div>
                ) : (
                  <div>
                    <p className="text-sm sm:text-base font-semibold text-slate-900">
                      {task.prompt}
                    </p>
                    {task.instruction && (
                      <p className="text-xs sm:text-sm text-slate-500 italic mt-0.5">
                        Petunjuk: {task.instruction}
                      </p>
                    )}
                  </div>
                )}

                {/* Multiple choice options */}
                {task.choices && task.choices.length > 0 && (
                  <div className="space-y-1.5 pl-4 pt-1">
                    {task.choices.map((choice, cIdx) => (
                      <div key={cIdx} className="text-xs sm:text-sm text-slate-700">
                        {choice}
                      </div>
                    ))}
                  </div>
                )}

                {/* Matching Pairs Table */}
                {task.matchingPairs && task.matchingPairs.length > 0 && (
                  <div className="border border-slate-200 rounded-lg overflow-hidden my-2">
                    <table className="w-full text-xs sm:text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="p-2 text-left font-bold text-slate-700">Pernyataan A</th>
                          <th className="p-2 text-center font-bold text-slate-400">Hubungkan</th>
                          <th className="p-2 text-left font-bold text-slate-700">Pilihan Pasangan B</th>
                        </tr>
                      </thead>
                      <tbody>
                        {task.matchingPairs.map((p, pIdx) => (
                          <tr key={pIdx} className="border-b border-slate-100 last:border-b-0">
                            <td className="p-2.5">{p.left}</td>
                            <td className="p-2.5 text-center text-slate-300">••••</td>
                            <td className="p-2.5">{p.right}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Dotted Write-in Area for printed paper */}
                <div className="space-y-2 pt-2">
                  {Array.from({ length: task.expectedLines || 2 }).map((_, lIdx) => (
                    <div
                      key={lIdx}
                      className="border-b border-dotted border-slate-300 h-5"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* F. PERTANYAAN */}
        <section className="mb-8 font-sans">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-4">
            <h3 className="text-base sm:text-lg font-bold text-blue-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold">
                F
              </span>
              <span>PERTANYAAN PENDALAMAN (HOTS &amp; LITERASI)</span>
            </h3>
            {isEditMode && (
              <button
                onClick={handleAddQuestion}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Pertanyaan
              </button>
            )}
          </div>

          <div className="space-y-4 pl-2">
            {content.questions.map((q, idx) => (
              <div key={q.id || idx} className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-sm text-slate-800">{idx + 1}.</span>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => handleQuestionChange(idx, { question: e.target.value })}
                        className="w-full px-2 py-1 text-sm border border-slate-300 rounded-md font-medium"
                      />
                    ) : (
                      <span className="text-sm sm:text-base text-slate-800 font-medium">
                        {q.question}
                      </span>
                    )}
                    {q.hotLevel && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          q.hotLevel === 'HOTS'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {q.hotLevel}
                      </span>
                    )}
                  </div>

                  {isEditMode && (
                    <button
                      onClick={() => handleRemoveQuestion(idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="pl-5 space-y-2">
                  <div className="border-b border-dotted border-slate-300 h-6 flex items-center text-xs text-slate-400">
                    Jawab:
                  </div>
                  <div className="border-b border-dotted border-slate-300 h-6" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* G. KESIMPULAN */}
        <section className="mb-8 font-sans">
          <div className="border-b border-slate-200 pb-2 mb-3">
            <h3 className="text-base sm:text-lg font-bold text-blue-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold">
                G
              </span>
              <span>KESIMPULAN</span>
            </h3>
          </div>

          <div className="pl-2 space-y-2">
            <p className="text-sm text-slate-700">
              {content.conclusionPrompt ||
                'Berdasarkan seluruh aktivitas yang telah dilakukan, tuliskan kesimpulan yang kamu peroleh:'}
            </p>
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 min-h-16 space-y-3">
              <div className="border-b border-dotted border-slate-300 h-5" />
              <div className="border-b border-dotted border-slate-300 h-5" />
            </div>
          </div>
        </section>

        {/* H. REFLEKSI PESERTA DIDIK (Specific user format) */}
        <section className="mb-8 font-sans">
          <div className="border-b border-slate-200 pb-2 mb-3">
            <h3 className="text-base sm:text-lg font-bold text-blue-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold">
                H
              </span>
              <span>REFLEKSI PESERTA DIDIK</span>
            </h3>
          </div>

          <div className="border-2 border-blue-200 rounded-2xl p-5 bg-blue-50/50 space-y-4">
            <div>
              <p className="text-sm font-bold text-slate-800 mb-1">
                1. {content.studentReflection?.learnedPrompt || 'Hal yang saya pelajari hari ini:'}
              </p>
              <div className="border-b border-dotted border-slate-300 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 mb-1">
                2. {content.studentReflection?.likedPrompt || 'Hal yang paling saya sukai:'}
              </p>
              <div className="border-b border-dotted border-slate-300 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 mb-1">
                3. {content.studentReflection?.unclearPrompt || 'Hal yang masih belum saya pahami:'}
              </p>
              <div className="border-b border-dotted border-slate-300 h-6" />
            </div>
          </div>
        </section>

        {/* SIGNATURE SECTION */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 text-center text-xs sm:text-sm font-sans">
          <div>
            <p>Mengetahui,</p>
            <p className="font-semibold mt-0.5">Guru Kelas / Mata Pelajaran</p>
            <div className="h-16" />
            <p className="font-bold underline">
              ( {formData.teacherName || '...........................................'} )
            </p>
          </div>
          <div>
            <p>&nbsp;</p>
            <p className="font-semibold mt-0.5">Nama Peserta Didik</p>
            <div className="h-16" />
            <p className="font-bold underline">( ........................................... )</p>
          </div>
        </div>
      </div>
    )}

    {/* ========================================================= */}
    {/* KUNCI JAWABAN & PEDOMAN PENSKORAN (PEGANGAN GURU) SECTION */}
    {/* ========================================================= */}
    {(activeTab === 'all' || activeTab === 'teacher') && (
      <div className={`${activeTab === 'all' ? 'mt-14 pt-12 border-t-4 border-dashed border-blue-200' : ''} font-sans`}>
        {/* Page break marker banner */}
        {activeTab === 'all' && (
          <div className="mb-8 p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs text-blue-900 font-sans">
            <span className="flex items-center gap-2 font-bold">
              <KeyRound className="w-4 h-4 text-blue-600" />
              Halaman Pegangan Guru: Kunci Jawaban &amp; Pedoman Penskoran
            </span>
            <span className="text-[11px] bg-blue-100 text-blue-800 font-semibold px-2.5 py-0.5 rounded-full">
              Halaman Baru pada Word (.docx)
            </span>
          </div>
        )}

        {/* KOP KUNCI JAWABAN */}
        <div className="border-b-2 border-slate-900 pb-5 mb-6 text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-slate-900 font-heading">
            {content.schoolName || 'SEKOLAH DASAR'}
          </h2>
          <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider mb-1">
            Pegangan Guru
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-blue-900 font-heading">
            KUNCI JAWABAN &amp; PEDOMAN PENSKORAN
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            LEMBAR KERJA PESERTA DIDIK (LKPD) KURIKULUM MERDEKA
          </p>
          <p className="text-xs text-slate-500 italic mt-1">
            Mata Pelajaran: {content.subject} &bull; Kelas/Fase: {content.grade} ({content.phase}) &bull; Topik: {content.topic}
          </p>
        </div>

        {/* RINGKASAN PENSKORAN & CATATAN GURU */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm">
          <div className="space-y-2">
            <div>
              <span className="font-bold text-slate-700">Topik / Materi Pembelajaran:</span>
              <p className="text-slate-900 font-medium">{content.topic}</p>
            </div>
            <div>
              <span className="font-bold text-slate-700">Sistem Penilaian:</span>
              {isEditMode ? (
                <input
                  type="text"
                  value={content.teacherGuide?.scoringSummary || ''}
                  onChange={(e) => handleTeacherGuideChange('scoringSummary', e.target.value)}
                  placeholder="Total Skor Maksimal: 100 Poin..."
                  className="w-full mt-1 px-2.5 py-1 text-xs border border-slate-300 rounded-md"
                />
              ) : (
                <p className="text-slate-900">{content.teacherGuide?.scoringSummary || 'Total Skor Maksimal: 100 Poin'}</p>
              )}
            </div>
            <div>
              <span className="font-bold text-slate-700">Rumus Nilai Akhir:</span>
              {isEditMode ? (
                <input
                  type="text"
                  value={content.teacherGuide?.scoringFormula || ''}
                  onChange={(e) => handleTeacherGuideChange('scoringFormula', e.target.value)}
                  placeholder="Nilai = (Total Skor Perolehan / Total Skor Maksimal) x 100"
                  className="w-full mt-1 px-2.5 py-1 text-xs border border-slate-300 rounded-md font-mono"
                />
              ) : (
                <p className="font-mono text-blue-700 font-semibold">{content.teacherGuide?.scoringFormula || 'Nilai = (Total Skor Perolehan / Total Skor Maksimal) x 100'}</p>
              )}
            </div>
          </div>
          <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-200 pt-2 md:pt-0 md:pl-4">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <ClipboardCheck className="w-4 h-4 text-blue-600" />
              Catatan Asesmen Formatif Guru:
            </span>
            {isEditMode ? (
              <textarea
                rows={3}
                value={content.teacherGuide?.notesForTeacher || ''}
                onChange={(e) => handleTeacherGuideChange('notesForTeacher', e.target.value)}
                placeholder="Catatan pedoman guru..."
                className="w-full mt-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded-md"
              />
            ) : (
              <p className="text-slate-600 leading-relaxed text-xs">
                {content.teacherGuide?.notesForTeacher ||
                  'Kunci jawaban dan kriteria ini digunakan sebagai acuan memeriksa LKPD siswa. Berikan apresiasi skor penuh apabila nalar konsep siswa tepat meski menggunakan kosakata sendiri.'}
              </p>
            )}
          </div>
        </div>

        {/* BAGIAN I: KUNCI JAWABAN TUGAS DAN AKTIVITAS LKPD */}
        <section className="mb-8">
          <div className="border-b border-slate-200 pb-2 mb-4 flex items-center justify-between">
            <h4 className="text-base sm:text-lg font-bold text-blue-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold">
                I
              </span>
              <span>KUNCI JAWABAN TUGAS &amp; AKTIVITAS LKPD</span>
            </h4>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              {content.tasks.length} Butir Tugas
            </span>
          </div>

          <div className="space-y-4">
            {content.tasks.map((task, idx) => {
              let defaultAnswer = task.answerKey;
              if (!defaultAnswer) {
                if (task.choices && task.choices.length > 0) {
                  defaultAnswer = `Kunci Pilihan: ${task.choices[0] || 'A'}\nPembahasan: Merupakan konsep dasar yang relevan dengan ${content.topic}.`;
                } else if (task.matchingPairs && task.matchingPairs.length > 0) {
                  defaultAnswer = `Kunci Pasangan:\n` + task.matchingPairs.map((p, pIdx) => `${pIdx + 1}. ${p.left} -> ${p.right}`).join('\n');
                } else {
                  defaultAnswer = `Jawaban siswa memuat konsep inti mengenai materi ${content.topic} secara tepat dan sistematis.`;
                }
              }

              const defaultRubric = task.scoringRubric || 'Skor maksimal: 10 poin (Benar = 10, Sebagian = 5, Salah = 0)';

              return (
                <div key={task.id || idx} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                        {task.type}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {task.instruction || ''}
                      </span>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                      {task.scoringRubric?.includes('Skor') ? task.scoringRubric.split('(')[0].trim() : 'Skor: 10 Poin'}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-0.5">Soal / Instruksi Siswa:</p>
                    <p className="text-sm font-semibold text-slate-800">{task.prompt}</p>
                    {task.choices && task.choices.length > 0 && (
                      <div className="grid grid-cols-2 gap-1 mt-1.5 pl-2 text-xs text-slate-600">
                        {task.choices.map((c, cIdx) => (
                          <div key={cIdx}>• {c}</div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Box Kunci Jawaban */}
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Kunci Jawaban &amp; Pembahasan:
                    </div>
                    {isEditMode ? (
                      <textarea
                        rows={3}
                        value={task.answerKey ?? defaultAnswer}
                        onChange={(e) => handleTaskChange(idx, { answerKey: e.target.value })}
                        className="w-full px-2 py-1 text-xs border border-emerald-300 rounded-md font-sans bg-white"
                      />
                    ) : (
                      <div className="text-xs sm:text-sm text-emerald-950 font-medium whitespace-pre-line leading-relaxed">
                        {defaultAnswer}
                      </div>
                    )}
                  </div>

                  {/* Box Pedoman Penskoran */}
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-700">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <Award className="w-3.5 h-3.5 text-blue-600" />
                      Pedoman Penskoran:
                    </div>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={task.scoringRubric ?? defaultRubric}
                        onChange={(e) => handleTaskChange(idx, { scoringRubric: e.target.value })}
                        className="w-full sm:w-2/3 px-2 py-1 text-xs border border-slate-300 rounded-md bg-white"
                      />
                    ) : (
                      <span className="text-slate-600">{defaultRubric}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* BAGIAN II: KUNCI JAWABAN PERTANYAAN PENDALAMAN (HOTS) */}
        <section className="mb-8">
          <div className="border-b border-slate-200 pb-2 mb-4 flex items-center justify-between">
            <h4 className="text-base sm:text-lg font-bold text-blue-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold">
                II
              </span>
              <span>KUNCI JAWABAN PERTANYAAN PENDALAMAN (HOTS &amp; LITERASI)</span>
            </h4>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              {content.questions.length} Pertanyaan
            </span>
          </div>

          <div className="space-y-4">
            {content.questions.map((q, idx) => {
              const defaultQAnswer =
                q.answerKey ||
                `Peserta didik mampu menguraikan argumen berbasis fakta terkait materi ${content.topic} dan menunjukkan penalaran logis serta contoh kontekstual di lingkungan sekitarnya.`;

              return (
                <div key={q.id || idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-sm text-slate-800">{idx + 1}.</span>
                      <span className="text-sm font-semibold text-slate-900">{q.question}</span>
                    </div>
                    {q.hotLevel && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 shrink-0">
                        {q.hotLevel}
                      </span>
                    )}
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1">
                    <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Kunci Jawaban / Ekspektasi Jawaban Siswa:
                    </span>
                    {isEditMode ? (
                      <textarea
                        rows={2}
                        value={q.answerKey ?? defaultQAnswer}
                        onChange={(e) => handleQuestionChange(idx, { answerKey: e.target.value })}
                        className="w-full px-2 py-1 text-xs border border-emerald-300 rounded-md font-sans bg-white"
                      />
                    ) : (
                      <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
                        {defaultQAnswer}
                      </p>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-500 italic pl-1">
                    Kriteria Skor: Skor 10 (Analisis tepat dan mendalam), Skor 5 (Pemahaman cukup/singkat), Skor 0 (Salah/tidak menjawab).
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* BAGIAN III: CONTOH KESIMPULAN YANG DIHARAPKAN */}
        <section className="mb-8">
          <div className="border-b border-slate-200 pb-2 mb-4">
            <h4 className="text-base sm:text-lg font-bold text-blue-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold">
                III
              </span>
              <span>CONTOH KESIMPULAN PEMBELAJARAN YANG DIHARAPKAN</span>
            </h4>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <p className="text-xs text-slate-500 font-medium">
              Pertanyaan Pengarah Siswa: {content.conclusionPrompt || 'Tuliskan kesimpulan yang kamu peroleh:'}
            </p>
            <div className="p-3 rounded-lg bg-white border border-blue-200">
              <p className="text-xs font-bold text-blue-900 mb-1">Rekomendasi Kunci Kesimpulan Guru:</p>
              {isEditMode ? (
                <textarea
                  rows={2}
                  value={
                    content.teacherGuide?.expectedConclusion ||
                    `Peserta didik menyimpulkan bahwa penguasaan konsep ${content.topic} sangat penting dan dapat dipraktikkan secara aktif dalam kehidupan sehari-hari.`
                  }
                  onChange={(e) => handleTeacherGuideChange('expectedConclusion', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-blue-300 rounded-md font-sans"
                />
              ) : (
                <p className="text-xs sm:text-sm text-slate-800 font-medium italic">
                  "{content.teacherGuide?.expectedConclusion ||
                    `Peserta didik menyimpulkan bahwa penguasaan konsep ${content.topic} sangat penting dan dapat dipraktikkan secara aktif dalam kehidupan sehari-hari.`}"
                </p>
              )}
            </div>
          </div>
        </section>

        {/* BAGIAN IV: PANDUAN OBSERVASI REFLEKSI */}
        <section className="mb-8">
          <div className="border-b border-slate-200 pb-2 mb-4">
            <h4 className="text-base sm:text-lg font-bold text-blue-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold">
                IV
              </span>
              <span>PANDUAN PENILAIAN REFLEKSI DIRI SISWA</span>
            </h4>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs sm:text-sm text-slate-700">
            <p className="font-semibold text-slate-800">
              Refleksi dinilai secara kualitatif formatif guna merencanakan diferensiasi dan tindak lanjut:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>
                <strong className="text-slate-800">Poin 1 (Hal yang dipelajari):</strong> Mengidentifikasi pemahaman konsep kunci siswa setelah menyelesaikan seluruh aktivitas.
              </li>
              <li>
                <strong className="text-slate-800">Poin 2 (Hal yang paling disukai):</strong> Mengetahui preferensi modalitas belajar siswa (visual, kinestetik, kolaboratif).
              </li>
              <li>
                <strong className="text-slate-800">Poin 3 (Hal yang belum dipahami):</strong> Bahan evaluasi guru untuk materi pengulangan, scaffolding, atau penugasan terarah.
              </li>
            </ul>
          </div>
        </section>

        {/* TANDA TANGAN GURU & KEPALA SEKOLAH */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 text-center text-xs sm:text-sm font-sans">
          <div>
            <p>Mengetahui,</p>
            <p className="font-semibold mt-0.5">Kepala Sekolah</p>
            <div className="h-16" />
            <p className="font-bold underline">( ........................................... )</p>
          </div>
          <div>
            <p>&nbsp;</p>
            <p className="font-semibold mt-0.5">Guru Kelas / Mata Pelajaran</p>
            <div className="h-16" />
            <p className="font-bold underline">
              ( {formData.teacherName || content.teacherName || '...........................................'} )
            </p>
          </div>
        </div>
      </div>
    )}
  </div>
</div>
);
};
