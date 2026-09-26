import React, { useState, useMemo } from 'react';
import {
  FileText,
  Sparkles,
  AlertCircle,
  Check,
  ChevronDown,
  ChevronUp,
  Wand2,
  HelpCircle,
  Layers,
  BookOpen,
  School,
  Clock,
  User,
  Info,
  Plus,
  Minus,
  ListOrdered,
  Sliders,
  CheckSquare,
  KeyRound,
} from 'lucide-react';
import { LKPDFormData, LKPDContent } from '../types';
import {
  SD_SUBJECTS,
  ACTIVITY_TYPES_LIST,
  PANCASILA_PROFILES,
  LEARNING_MODELS,
} from '../data/curriculumData';
import { ColumnExamplesModal } from './ColumnExamplesModal';
import { FieldExampleBadge } from './FieldExampleBadge';
import { TopicSuggester } from './TopicSuggester';
import { PresetSubjectExample } from '../data/columnExamplesData';
import { getDynamicLkpdExamples } from '../utils/dynamicExamples';

interface LKPDGeneratorProps {
  initialData?: Partial<LKPDFormData>;
  onGenerateSuccess: (content: LKPDContent, formData: LKPDFormData) => void;
  onOpenGuide: () => void;
}

export const LKPDGenerator: React.FC<LKPDGeneratorProps> = ({
  initialData,
  onGenerateSuccess,
  onOpenGuide,
}) => {
  const [formData, setFormData] = useState<LKPDFormData>({
    schoolName: initialData?.schoolName || 'SD Negeri Merdeka 01',
    teacherName: initialData?.teacherName || 'Guru Kelas',
    grade: initialData?.grade || '4',
    phase: initialData?.phase || 'Fase B',
    subject: initialData?.subject || 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    semester: initialData?.semester || '1',
    topic: initialData?.topic || '',
    timeAllocation: initialData?.timeAllocation || '2 x 35 Menit',
    cp: initialData?.cp || '',
    tp: initialData?.tp || '',
    indicators: initialData?.indicators || '',
    model: initialData?.model || 'Problem Based Learning (PBL)',
    characterProfiles: initialData?.characterProfiles || [
      'Bernalar Kritis',
      'Gotong Royong',
      'Mandiri',
    ],
    learningSources: initialData?.learningSources || 'Buku Siswa Kemdikbudristek, Lingkungan Sekitar',
    toolsAndMaterials: initialData?.toolsAndMaterials || 'Alat tulis, LKPD, media konkrit/kartu gambar',
    activityTypes: initialData?.activityTypes || ['Mengamati', 'Isian', 'Pilihan ganda', 'HOTS'],
    activityCount: initialData?.activityCount || 8,
    activityCountsByType: initialData?.activityCountsByType || {
      'Mengamati': 2,
      'Isian': 2,
      'Pilihan ganda': 2,
      'HOTS': 2,
    },
    difficulty: initialData?.difficulty || 'Campuran',
    characterLkpd: initialData?.characterLkpd || 'Individu dan kelompok',
    includeAnswerKey: initialData?.includeAnswerKey ?? true,
  });

  const [customSubject, setCustomSubject] = useState('');
  const [isCustomSubject, setIsCustomSubject] = useState(false);
  const [isSuggestingCpTp, setIsSuggestingCpTp] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isExamplesModalOpen, setIsExamplesModalOpen] = useState(false);

  const activeSubject = isCustomSubject ? customSubject.trim() : formData.subject;

  // Dynamically compute examples tailored to current user inputs
  const dynamicExamples = useMemo(() => {
    return getDynamicLkpdExamples({
      ...formData,
      subject: activeSubject || formData.subject,
    });
  }, [formData, activeSubject]);

  const currentContextHint = `${activeSubject || 'Mata Pelajaran'} • Kelas ${formData.grade}${
    formData.topic.trim() ? ` • ${formData.topic.trim()}` : ''
  }`;

  // Apply complete preset from examples catalog
  const handleApplyPreset = (preset: PresetSubjectExample) => {
    setIsCustomSubject(false);
    setFormData((prev) => ({
      ...prev,
      grade: preset.grade,
      phase: preset.phase,
      subject: preset.subject,
      topic: preset.topic,
      timeAllocation: preset.timeAllocation,
      cp: preset.cpExample,
      tp: preset.tpExample,
      indicators: preset.indicatorsExample,
      model: preset.modelExample,
      characterProfiles: preset.profilesExample,
      learningSources: preset.sourcesExample,
      toolsAndMaterials: preset.toolsExample,
    }));
  };

  // Apply single field from examples catalog
  const handleApplySingleField = (fieldKey: string, value: string) => {
    if (fieldKey === 'schoolName') setFormData((p) => ({ ...p, schoolName: value }));
    else if (fieldKey === 'teacherName') setFormData((p) => ({ ...p, teacherName: value }));
    else if (fieldKey === 'topic') setFormData((p) => ({ ...p, topic: value }));
    else if (fieldKey === 'cp') setFormData((p) => ({ ...p, cp: value }));
    else if (fieldKey === 'tp') setFormData((p) => ({ ...p, tp: value }));
    else if (fieldKey === 'indicators') setFormData((p) => ({ ...p, indicators: value }));
    else if (fieldKey === 'learningSources') setFormData((p) => ({ ...p, learningSources: value }));
    else if (fieldKey === 'toolsAndMaterials') setFormData((p) => ({ ...p, toolsAndMaterials: value }));
  };

  // Auto sync Fase when Grade changes
  const handleGradeChange = (newGrade: string) => {
    let autoPhase = 'Fase A';
    if (['1', '2'].includes(newGrade)) autoPhase = 'Fase A';
    else if (['3', '4'].includes(newGrade)) autoPhase = 'Fase B';
    else if (['5', '6'].includes(newGrade)) autoPhase = 'Fase C';

    setFormData((prev) => ({
      ...prev,
      grade: newGrade,
      phase: autoPhase,
    }));
  };

  const toggleActivityType = (type: string) => {
    setFormData((prev) => {
      const current = prev.activityTypes || [];
      const exists = current.includes(type);
      if (exists) {
        // keep at least 1
        if (current.length <= 1) return prev;
        const nextTypes = current.filter((t) => t !== type);
        const nextCounts = { ...(prev.activityCountsByType || {}) };
        delete nextCounts[type];
        const newTotal = nextTypes.reduce((sum, t) => sum + (nextCounts[t] || 2), 0);
        return {
          ...prev,
          activityTypes: nextTypes,
          activityCountsByType: nextCounts,
          activityCount: Math.min(30, Math.max(1, newTotal)),
        };
      } else {
        const nextTypes = [...current, type];
        const nextCounts = {
          ...(prev.activityCountsByType || {}),
          [type]: prev.activityCountsByType?.[type] || 2,
        };
        const newTotal = nextTypes.reduce((sum, t) => sum + (nextCounts[t] || 2), 0);
        return {
          ...prev,
          activityTypes: nextTypes,
          activityCountsByType: nextCounts,
          activityCount: Math.min(30, Math.max(1, newTotal)),
        };
      }
    });
  };

  const handleActivityCountChange = (actType: string, newCount: number) => {
    const safeCount = Math.max(1, Math.min(30, Number(newCount) || 1));
    setFormData((prev) => {
      const updated = {
        ...(prev.activityCountsByType || {}),
        [actType]: safeCount,
      };
      const total = (prev.activityTypes || []).reduce(
        (sum, t) => sum + (t === actType ? safeCount : (updated[t] || 2)),
        0
      );
      return {
        ...prev,
        activityCountsByType: updated,
        activityCount: Math.min(30, Math.max(1, total)),
      };
    });
  };

  const applyActivityTotalPreset = (targetTotal: number) => {
    setFormData((prev) => {
      const types = prev.activityTypes || ['Pilihan ganda'];
      const count = types.length;
      if (count === 0) return prev;
      const base = Math.floor(targetTotal / count);
      const remainder = targetTotal % count;
      const newCounts: Record<string, number> = {};
      types.forEach((t, index) => {
        newCounts[t] = Math.max(1, base + (index < remainder ? 1 : 0));
      });
      return {
        ...prev,
        activityCountsByType: newCounts,
        activityCount: targetTotal,
      };
    });
  };

  const handleTotalActivityCountChange = (newTotal: number) => {
    const safeTotal = Math.max(1, Math.min(30, Number(newTotal) || 1));
    applyActivityTotalPreset(safeTotal);
  };

  const toggleProfile = (profile: string) => {
    setFormData((prev) => {
      const current = prev.characterProfiles || [];
      const exists = current.includes(profile);
      if (exists) {
        return {
          ...prev,
          characterProfiles: current.filter((p) => p !== profile),
        };
      } else {
        return {
          ...prev,
          characterProfiles: [...current, profile],
        };
      }
    });
  };

  // Auto suggest CP & TP with AI
  const handleAutoSuggestCpTp = async () => {
    const activeSubject = isCustomSubject ? customSubject : formData.subject;
    if (!formData.grade || !activeSubject || !formData.topic.trim()) {
      setValidationError('Isi Kelas, Mata Pelajaran, dan Topik terlebih dahulu untuk meminta rekomendasi CP & TP.');
      return;
    }
    setValidationError(null);
    setIsSuggestingCpTp(true);

    try {
      const res = await fetch('/api/auto-suggest-cp-tp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: formData.grade,
          phase: formData.phase,
          subject: activeSubject,
          topic: formData.topic,
          semester: formData.semester,
          model: formData.model,
          characterProfiles: formData.characterProfiles,
        }),
      });
      const data = await res.json();
      if (data.cp || data.tp || data.indicators) {
        setFormData((prev) => ({
          ...prev,
          cp: data.cp || prev.cp,
          tp: data.tp || prev.tp,
          indicators: data.indicators || prev.indicators,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSuggestingCpTp(false);
    }
  };

  // Submit and Generate LKPD
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    const activeSubject = isCustomSubject ? customSubject.trim() : formData.subject;

    // Strict Validation requirement:
    // "Sebelum Generate, sistem harus memastikan data penting sudah diisi.
    // Jika ada yang kosong tampilkan pesan: 'Silakan lengkapi data pembelajaran terlebih dahulu.'
    // Jangan generate jika: kelas belum dipilih, mata pelajaran belum dipilih, topik belum diisi"
    if (!formData.grade || !activeSubject || !formData.topic.trim()) {
      setValidationError('Silakan lengkapi data pembelajaran terlebih dahulu.');
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    setValidationError(null);
    setIsGenerating(true);

    const payload: LKPDFormData = {
      ...formData,
      subject: activeSubject,
    };

    try {
      const res = await fetch('/api/generate-lkpd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Gagal menghasilkan LKPD.');
      }

      onGenerateSuccess(json.data, payload);
    } catch (err: any) {
      console.error(err);
      setValidationError(err.message || 'Terjadi kesalahan saat membuat LKPD. Coba lagi.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                Formulir Generator LKPD
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Lengkapi identitas &amp; komponen pembelajaran untuk menghasilkan LKPD otomatis
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setIsExamplesModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs sm:text-sm font-bold transition-all shadow-xs"
              title="Buka katalog contoh hasil generate per kolom"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>💡 Contoh Hasil Tiap Kolom</span>
            </button>

            <button
              type="button"
              onClick={onOpenGuide}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Panduan Guru</span>
            </button>
          </div>
        </div>

        {/* Validation Error Alert */}
        {validationError && (
          <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm animate-shake">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{validationError}</p>
              <p className="text-xs text-red-600 mt-0.5">
                Pastikan pilihan Kelas, Mata Pelajaran, dan Topik Pembelajaran telah terisi dengan benar.
              </p>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleGenerate} className="space-y-8">
        {/* BAGIAN A: IDENTITAS PEMBELAJARAN */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
                A
              </span>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Identitas Pembelajaran
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">* Wajib diisi</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* 1. Nama Sekolah */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                1. Nama Sekolah
              </label>
              <input
                type="text"
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                placeholder="Contoh: SD Negeri 1 Merdeka"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all bg-white"
              />
            </div>

            {/* 2. Nama Guru */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                2. Nama Guru
              </label>
              <input
                type="text"
                value={formData.teacherName}
                onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                placeholder="Contoh: Budi Santoso, S.Pd"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all bg-white"
              />
            </div>

            {/* 3. Kelas */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                3. Kelas <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.grade}
                onChange={(e) => handleGradeChange(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-medium rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all bg-white text-slate-800"
              >
                <option value="1">Kelas 1 (Fase A - Kelas Rendah)</option>
                <option value="2">Kelas 2 (Fase A - Kelas Rendah)</option>
                <option value="3">Kelas 3 (Fase B - Kelas Rendah/Tengah)</option>
                <option value="4">Kelas 4 (Fase B - Kelas Tinggi)</option>
                <option value="5">Kelas 5 (Fase C - Kelas Tinggi)</option>
                <option value="6">Kelas 6 (Fase C - Kelas Tinggi)</option>
              </select>
            </div>

            {/* 4. Fase */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                4. Fase Kurikulum Merdeka
              </label>
              <select
                value={formData.phase}
                onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all bg-white text-slate-800"
              >
                <option value="Fase A">Fase A (Kelas 1 - 2 SD)</option>
                <option value="Fase B">Fase B (Kelas 3 - 4 SD)</option>
                <option value="Fase C">Fase C (Kelas 5 - 6 SD)</option>
              </select>
            </div>

            {/* 5. Mata Pelajaran */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                5. Mata Pelajaran <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={isCustomSubject ? '__custom__' : formData.subject}
                  onChange={(e) => {
                    if (e.target.value === '__custom__') {
                      setIsCustomSubject(true);
                    } else {
                      setIsCustomSubject(false);
                      setFormData({ ...formData, subject: e.target.value });
                    }
                  }}
                  className="sm:col-span-2 px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all bg-white"
                >
                  {SD_SUBJECTS.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                  <option value="__custom__">+ Mata Pelajaran Lainnya (Tulis Manual)</option>
                </select>

                {isCustomSubject && (
                  <input
                    type="text"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    placeholder="Nama mata pelajaran..."
                    className="sm:col-span-1 px-3.5 py-2.5 text-sm rounded-xl border border-blue-400 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all bg-white"
                  />
                )}
              </div>
            </div>

            {/* 6. Semester */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                6. Semester
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['1', '2'].map((sem) => (
                  <button
                    key={sem}
                    type="button"
                    onClick={() => setFormData({ ...formData, semester: sem })}
                    className={`py-2.5 px-3 text-sm font-semibold rounded-xl border text-center transition-all ${
                      formData.semester === sem
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Semester {sem}
                  </button>
                ))}
              </div>
            </div>

            {/* 8. Alokasi Waktu */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                8. Alokasi Waktu
              </label>
              <input
                type="text"
                value={formData.timeAllocation}
                onChange={(e) => setFormData({ ...formData, timeAllocation: e.target.value })}
                placeholder="Contoh: 2 x 35 Menit (1 Pertemuan)"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all bg-white"
              />
            </div>

            {/* 7. Topik / Materi Pembelajaran */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                7. Topik / Materi Pembelajaran <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="Contoh: Operasi Hitung Pecahan / Siklus Hidup Kupu-kupu / Norma dan Hak Kewajiban"
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all bg-white font-medium"
              />
              <p className="text-xs text-slate-500 mt-1">
                Tulis topik secara spesifik atau pilih dari rekomendasi AI di bawah agar aktivitas dan soal yang dihasilkan tepat sasaran.
              </p>

              {/* Minimal 8 Pilihan Hasil Rekomendasi Topik AI */}
              <TopicSuggester
                grade={formData.grade}
                subject={activeSubject}
                semester={formData.semester}
                phase={formData.phase}
                currentTopic={formData.topic}
                onSelectTopic={(selectedTopic) => {
                  setFormData((prev) => ({ ...prev, topic: selectedTopic }));
                }}
                themeColor="blue"
              />
            </div>
          </div>
        </section>

        {/* BAGIAN B: KOMPONEN PEMBELAJARAN */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
                B
              </span>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Komponen Pembelajaran (Kurikulum Merdeka)
              </h3>
            </div>

            {/* Auto AI formulation button */}
            <button
              type="button"
              onClick={handleAutoSuggestCpTp}
              disabled={isSuggestingCpTp}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 text-xs font-bold transition-colors disabled:opacity-50 shadow-xs"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-600" />
              <span>{isSuggestingCpTp ? 'Merumuskan CP & TP...' : '✨ Rumuskan CP & TP Otomatis'}</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* 9. Capaian Pembelajaran (CP) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  9. Capaian Pembelajaran (CP)
                </label>
                <FieldExampleBadge
                  exampleText={dynamicExamples.cp}
                  contextHint={currentContextHint}
                  onApply={() =>
                    setFormData((p) => ({
                      ...p,
                      cp: dynamicExamples.cp,
                    }))
                  }
                />
              </div>
              <textarea
                rows={2}
                value={formData.cp}
                onChange={(e) => setFormData({ ...formData, cp: e.target.value })}
                placeholder="Deskripsi capaian pembelajaran fase terkait..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all bg-white resize-y"
              />
            </div>

            {/* 10. Tujuan Pembelajaran (TP) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  10. Tujuan Pembelajaran (TP)
                </label>
                <FieldExampleBadge
                  exampleText={dynamicExamples.tp}
                  contextHint={currentContextHint}
                  onApply={() =>
                    setFormData((p) => ({
                      ...p,
                      tp: dynamicExamples.tp,
                    }))
                  }
                />
              </div>
              <textarea
                rows={2}
                value={formData.tp}
                onChange={(e) => setFormData({ ...formData, tp: e.target.value })}
                placeholder="1. Peserta didik dapat memahami...&#10;2. Peserta didik dapat menyajikan..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all bg-white resize-y"
              />
            </div>

            {/* 11. Indikator / Kriteria Ketercapaian */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  11. Indikator / Kriteria Ketercapaian (KKTP)
                </label>
                <FieldExampleBadge
                  exampleText={dynamicExamples.indicators}
                  contextHint={currentContextHint}
                  onApply={() =>
                    setFormData((p) => ({
                      ...p,
                      indicators: dynamicExamples.indicators,
                    }))
                  }
                />
              </div>
              <textarea
                rows={2}
                value={formData.indicators}
                onChange={(e) => setFormData({ ...formData, indicators: e.target.value })}
                placeholder="Indikator ketercapaian kompetensi pembelajaran..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all bg-white resize-y"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {/* 12. Model / Metode Pembelajaran */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    12. Model / Metode Pembelajaran
                  </label>
                  <FieldExampleBadge
                    exampleText={dynamicExamples.model}
                    contextHint={currentContextHint}
                    onApply={() => setFormData((p) => ({ ...p, model: dynamicExamples.model }))}
                  />
                </div>
                <select
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all bg-white"
                >
                  {LEARNING_MODELS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* 14. Sumber Belajar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    14. Sumber Belajar
                  </label>
                  <FieldExampleBadge
                    exampleText={dynamicExamples.learningSources}
                    contextHint={currentContextHint}
                    onApply={() =>
                      setFormData((p) => ({
                        ...p,
                        learningSources: dynamicExamples.learningSources,
                      }))
                    }
                  />
                </div>
                <input
                  type="text"
                  value={formData.learningSources}
                  onChange={(e) => setFormData({ ...formData, learningSources: e.target.value })}
                  placeholder="Buku Siswa Kemdikbudristek, video edukasi, dll."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all bg-white"
                />
              </div>

              {/* 15. Alat dan Bahan */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    15. Alat dan Bahan
                  </label>
                  <FieldExampleBadge
                    exampleText={dynamicExamples.toolsAndMaterials}
                    contextHint={currentContextHint}
                    onApply={() =>
                      setFormData((p) => ({
                        ...p,
                        toolsAndMaterials: dynamicExamples.toolsAndMaterials,
                      }))
                    }
                  />
                </div>
                <input
                  type="text"
                  value={formData.toolsAndMaterials}
                  onChange={(e) => setFormData({ ...formData, toolsAndMaterials: e.target.value })}
                  placeholder="Alat tulis, pewarna, gambar peraga, kartu bilangan, gunting, lem..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all bg-white"
                />
              </div>
            </div>

            {/* 13. Profil / Karakter yang Dikembangkan */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  13. Profil Pelajar Pancasila yang Dikembangkan
                </label>
                <FieldExampleBadge
                  exampleText={(dynamicExamples.characterProfiles || []).join(', ')}
                  contextHint={currentContextHint}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {PANCASILA_PROFILES.map((prof) => {
                  const isChecked = (formData.characterProfiles || []).includes(prof);
                  return (
                    <button
                      key={prof}
                      type="button"
                      onClick={() => toggleProfile(prof)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs text-left font-medium transition-all ${
                        isChecked
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                          isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="line-clamp-2">{prof}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* BAGIAN C: AKTIVITAS LKPD */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
                C
              </span>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Aktivitas &amp; Karakteristik LKPD
              </h3>
            </div>
            <span className="text-xs text-blue-600 font-semibold">
              {(formData.activityTypes || []).length} Jenis Terpilih
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Pilihan Jenis Aktivitas LKPD (Dapat memilih lebih dari satu):
              </label>
              <FieldExampleBadge exampleText="Kombinasi ideal SD: Mengamati (eksplorasi objek) + Menjodohkan (visual) + Isian + HOTS (pertanyaan analisis solusi)" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {ACTIVITY_TYPES_LIST.map((act) => {
                const isSelected = (formData.activityTypes || []).includes(act);
                return (
                  <button
                    key={act}
                    type="button"
                    onClick={() => toggleActivityType(act)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold text-left transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                        : 'border-slate-200 text-slate-700 bg-slate-50/70 hover:bg-slate-100'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white border-white text-blue-600' : 'border-slate-400 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="truncate">{act}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MENU KHUSUS: PENENTUAN JUMLAH PADA MASING-MASING PILIHAN AKTIVITAS LKPD (MAX 30) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-200/90 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-200/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <ListOrdered className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Jumlah Butir pada Masing-Masing Pilihan Aktivitas
                  </h4>
                  <p className="text-xs text-slate-500">
                    Tentukan rincian jumlah butir soal/tugas untuk setiap aktivitas terpilih (Maksimal akumulasi 30 soal)
                  </p>
                </div>
              </div>

              {/* Total Live Indicator Badge */}
              <div className="flex items-center gap-2 self-start sm:self-auto bg-white px-3 py-1.5 rounded-xl border border-blue-200 shadow-2xs">
                <span className="text-xs font-semibold text-slate-600">Total Akumulasi:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold tracking-wide ${
                    formData.activityCount > 30
                      ? 'bg-red-600 text-white animate-pulse'
                      : formData.activityCount >= 25
                      ? 'bg-amber-600 text-white'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {formData.activityCount} / 30 Soal
                </span>
              </div>
            </div>

            {/* Quick Presets Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-blue-600" />
                Distribusi Cepat Total:
              </span>
              {[5, 10, 15, 20, 25, 30].map((presetVal) => {
                const isActive = formData.activityCount === presetVal;
                return (
                  <button
                    key={presetVal}
                    type="button"
                    onClick={() => applyActivityTotalPreset(presetVal)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-200'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50 hover:border-blue-300'
                    }`}
                  >
                    {presetVal} Soal {presetVal === 30 ? '(Maks 30)' : ''}
                  </button>
                );
              })}
            </div>

            {/* Grid of counters for each selected activity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(formData.activityTypes || []).map((act) => {
                const count = formData.activityCountsByType?.[act] ?? 2;
                return (
                  <div
                    key={act}
                    className="p-3 bg-white rounded-xl border border-blue-200/80 shadow-2xs flex items-center justify-between gap-3 hover:border-blue-400 hover:shadow-xs transition-all"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                        <span className="text-xs font-bold text-slate-900 truncate" title={act}>
                          {act}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {count} butir {act.toLowerCase().includes('ganda') || act.toLowerCase().includes('isian') || act.toLowerCase().includes('uraian') || act.toLowerCase().includes('soal') ? 'soal' : 'tugas/soal'}
                      </span>
                    </div>

                    {/* Stepper Controls */}
                    <div className="flex items-center gap-1 shrink-0 bg-slate-50 p-1 rounded-lg border border-slate-200">
                      <button
                        type="button"
                        onClick={() => handleActivityCountChange(act, count - 1)}
                        disabled={count <= 1}
                        className="w-7 h-7 rounded-md bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-700 flex items-center justify-center text-xs font-bold border border-slate-200 transition-all shadow-2xs"
                        title="Kurangi 1 soal"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={count}
                        onChange={(e) => handleActivityCountChange(act, Number(e.target.value))}
                        className="w-12 text-center text-xs font-extrabold text-slate-900 bg-transparent outline-hidden py-1"
                      />

                      <button
                        type="button"
                        onClick={() => handleActivityCountChange(act, count + 1)}
                        disabled={count >= 30 || formData.activityCount >= 30}
                        className="w-7 h-7 rounded-md bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-700 flex items-center justify-center text-xs font-bold border border-slate-200 transition-all shadow-2xs"
                        title="Tambah 1 soal"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {formData.activityCount > 30 && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>Total akumulasi butir soal telah melebihi batas 30 soal. Silakan kurangi jumlah butir pada aktivitas di atas.</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
            {/* 16. Total Jumlah Aktivitas / Soal */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  16. Total Aktivitas / Soal
                </label>
                <span className="text-[11px] text-blue-600 font-bold">Maks. 30 Soal</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={formData.activityCount}
                  onChange={(e) => handleTotalActivityCountChange(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <span className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-800 text-sm font-bold min-w-14 text-center">
                  {formData.activityCount}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Rentang: 1 hingga 30 aktivitas / butir soal</p>
            </div>

            {/* 17. Tingkat Kesulitan */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                17. Tingkat Kesulitan
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all bg-white font-medium"
              >
                <option value="Mudah">Mudah (Dasar &amp; Konkrit)</option>
                <option value="Sedang">Sedang (Standar Kurikulum)</option>
                <option value="Sulit">Sulit (Analisis Mendalam)</option>
                <option value="Campuran">Campuran (Bervariasi Bertahap)</option>
              </select>
            </div>

            {/* 18. Karakter LKPD */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                18. Karakter LKPD
              </label>
              <select
                value={formData.characterLkpd}
                onChange={(e) => setFormData({ ...formData, characterLkpd: e.target.value as any })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all bg-white font-medium"
              >
                <option value="Individu">Individu (Perorangan)</option>
                <option value="Kelompok">Kelompok (Kolaborasi)</option>
                <option value="Individu dan kelompok">Individu dan Kelompok (Gabungan)</option>
              </select>
            </div>
          </div>
        </section>

        {/* SUBMIT BUTTON BAR */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm sm:text-base font-bold text-slate-800">
                Siap Menghasilkan Dokumen LKPD?
              </p>
              <p className="text-xs text-slate-500">
                AI akan menyesuaikan bahasa dan tingkat kognitif sesuai jenjang {formData.grade ? `Kelas ${formData.grade}` : 'SD'}.
              </p>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sedang Merancang LKPD...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>GENERATE LKPD</span>
                </>
              )}
            </button>
          </div>

          {/* OPSI KUNCI JAWABAN PADA MENGHASILKAN DOKUMEN LKPD */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
              <label className="flex items-start sm:items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.includeAnswerKey ?? true}
                  onChange={(e) => setFormData({ ...formData, includeAnswerKey: e.target.checked })}
                  className="w-4 h-4 mt-0.5 sm:mt-0 rounded-sm text-emerald-600 border-emerald-300 focus:ring-emerald-500"
                />
                <div>
                  <span className="text-xs sm:text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-emerald-700" />
                    Lengkapi dengan Kunci Jawaban &amp; Pedoman Penskoran Guru
                  </span>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Menghasilkan lembar kunci jawaban lengkap, pembahasan butir aktivitas, rubrik penskoran, dan pedoman formatif guru.
                  </p>
                </div>
              </label>
              <div className="flex items-center gap-2 pl-7 sm:pl-0">
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                  formData.includeAnswerKey ?? true
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-slate-100 text-slate-600 border-slate-300'
                }`}>
                  {formData.includeAnswerKey ?? true ? 'Kunci Jawaban Disertakan' : 'Hanya Lembar Siswa'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* MODAL CONTOH HASIL TIAP KOLOM */}
      <ColumnExamplesModal
        isOpen={isExamplesModalOpen}
        onClose={() => setIsExamplesModalOpen(false)}
        context="lkpd"
        currentFormData={formData}
        onApplyPreset={handleApplyPreset}
        onApplySingleField={handleApplySingleField}
      />
    </div>
  );
};
