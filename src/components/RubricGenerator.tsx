import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckSquare,
  Sparkles,
  AlertCircle,
  FileText,
  School,
  Clock,
  Layers,
  Award,
} from 'lucide-react';
import { RubricFormData, RubricContent } from '../types';
import { SD_SUBJECTS, TASK_TYPES_RUBRIC } from '../data/curriculumData';
import { ColumnExamplesModal } from './ColumnExamplesModal';
import { FieldExampleBadge } from './FieldExampleBadge';
import { TopicSuggester } from './TopicSuggester';
import { PresetSubjectExample } from '../data/columnExamplesData';
import { getDynamicRubricExamples, getDefaultTopicForSubject } from '../utils/dynamicExamples';
import { generateFallbackRubric } from '../utils/fallbackGenerator';

interface RubricGeneratorProps {
  initialData?: Partial<RubricFormData>;
  onGenerateSuccess: (rubric: RubricContent, formData: RubricFormData) => void;
}

export const RubricGenerator: React.FC<RubricGeneratorProps> = ({
  initialData,
  onGenerateSuccess,
}) => {
  const [formData, setFormData] = useState<RubricFormData>({
    schoolName: initialData?.schoolName || 'SD Negeri Merdeka 01',
    teacherName: initialData?.teacherName || 'Guru Kelas',
    grade: initialData?.grade || '4',
    phase: initialData?.phase || 'Fase B',
    subject: initialData?.subject || 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    semester: initialData?.semester || '1',
    topic: initialData?.topic || 'Bagian Tubuh Tumbuhan dan Fungsinya',
    learningObjectives: initialData?.learningObjectives || '',
    taskType: initialData?.taskType || 'Praktik',
    criteriaCount: initialData?.criteriaCount || 4,
    scaleType: (initialData?.scaleType as any) || '1-4',
    scale: initialData?.scale || '1-4',
  });

  const [isCustomSubject, setIsCustomSubject] = useState(false);
  const [customSubject, setCustomSubject] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isExamplesModalOpen, setIsExamplesModalOpen] = useState(false);

  const activeSubject = isCustomSubject ? customSubject.trim() : formData.subject;

  // Dynamically compute rubric examples tailored to user inputs
  const dynamicExamples = useMemo(() => {
    return getDynamicRubricExamples({
      ...formData,
      subject: activeSubject || formData.subject,
    });
  }, [formData, activeSubject]);

  const currentContextHint = `${activeSubject || 'Mata Pelajaran'} • Kelas ${formData.grade}${
    formData.topic.trim() ? ` • ${formData.topic.trim()}` : ''
  }`;

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

  const handleApplyPreset = (preset: PresetSubjectExample) => {
    setIsCustomSubject(false);
    setFormData((prev) => ({
      ...prev,
      grade: preset.grade,
      phase: preset.phase,
      subject: preset.subject,
      topic: preset.topic,
      learningObjectives: preset.tpExample,
    }));
  };

  const handleApplySingleField = (fieldKey: string, value: string) => {
    if (fieldKey === 'schoolName') setFormData((p) => ({ ...p, schoolName: value }));
    else if (fieldKey === 'teacherName') setFormData((p) => ({ ...p, teacherName: value }));
    else if (fieldKey === 'topic') setFormData((p) => ({ ...p, topic: value }));
    else if (fieldKey === 'learningObjectives' || fieldKey === 'tp') {
      setFormData((p) => ({ ...p, learningObjectives: value }));
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    const activeSubject = isCustomSubject ? customSubject.trim() : formData.subject;
    const currentGrade = formData.grade || '4';
    const currentSubject = activeSubject || 'Ilmu Pengetahuan Alam dan Sosial (IPAS)';

    let currentTopic = formData.topic.trim();
    if (!currentTopic) {
      currentTopic = getDefaultTopicForSubject(currentSubject, currentGrade);
      setFormData((prev) => ({ ...prev, topic: currentTopic }));
    }

    setValidationError(null);
    setIsGenerating(true);

    const payload: RubricFormData = {
      ...formData,
      grade: currentGrade,
      subject: currentSubject,
      topic: currentTopic,
      learningObjective: formData.learningObjectives || currentTopic,
    };

    try {
      let finalRubric: RubricContent | null = null;

      try {
        const res = await fetch('/api/generate-rubric', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            formData: payload,
          }),
        });

        const text = await res.text();
        let json: any = null;
        try {
          json = JSON.parse(text);
        } catch {
          console.warn('[Rubrik] Server mengembalikan respons non-JSON, menggunakan mesin Kurikulum Merdeka mandiri.');
        }

        if (res.ok && json && json.data) {
          finalRubric = json.data;
        }
      } catch (networkErr) {
        console.warn('[Rubrik] Koneksi jaringan perangkat lambat, beralih ke generator lokal:', networkErr);
      }

      if (!finalRubric) {
        finalRubric = generateFallbackRubric(payload);
      }

      onGenerateSuccess(finalRubric, payload);
    } catch (err: any) {
      console.error(err);
      const fallback = generateFallbackRubric(payload);
      onGenerateSuccess(fallback, payload);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                Formulir Generator Rubrik Penilaian
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Buat rubrik asesmen autentik mandiri dengan matriks skor 4-1 dan kalkulator nilai terintegrasi
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsExamplesModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs sm:text-sm font-bold transition-all shadow-xs self-start sm:self-auto"
            title="Buka katalog contoh hasil generate per kolom"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>💡 Contoh Hasil Tiap Kolom</span>
          </button>
        </div>

        {validationError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleGenerate} className="space-y-6">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-lg font-bold text-slate-900 font-heading border-b border-slate-100 pb-3">
            Identitas Asesmen &amp; Kriteria Rubrik
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Satuan Pendidikan */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Satuan Pendidikan (Sekolah)
              </label>
              <input
                type="text"
                value={formData.schoolName || ''}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden bg-white"
              />
            </div>

            {/* Nama Guru */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Nama Guru Penilai
              </label>
              <input
                type="text"
                value={formData.teacherName || ''}
                onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden bg-white"
              />
            </div>

            {/* Kelas */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Kelas <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.grade}
                onChange={(e) => handleGradeChange(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden bg-white font-medium"
              >
                <option value="1">Kelas 1 (Fase A)</option>
                <option value="2">Kelas 2 (Fase A)</option>
                <option value="3">Kelas 3 (Fase B)</option>
                <option value="4">Kelas 4 (Fase B)</option>
                <option value="5">Kelas 5 (Fase C)</option>
                <option value="6">Kelas 6 (Fase C)</option>
              </select>
            </div>

            {/* Fase */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Fase Kurikulum
              </label>
              <select
                value={formData.phase}
                onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden bg-white"
              >
                <option value="Fase A">Fase A (Kelas 1 - 2)</option>
                <option value="Fase B">Fase B (Kelas 3 - 4)</option>
                <option value="Fase C">Fase C (Kelas 5 - 6)</option>
              </select>
            </div>

            {/* Mata Pelajaran */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Mata Pelajaran <span className="text-red-500">*</span>
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
                  className="sm:col-span-2 px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden bg-white"
                >
                  {SD_SUBJECTS.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                  <option value="__custom__">+ Mata Pelajaran Lain (Manual)</option>
                </select>

                {isCustomSubject && (
                  <input
                    type="text"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    placeholder="Mata pelajaran..."
                    className="sm:col-span-1 px-3.5 py-2.5 text-sm rounded-xl border border-indigo-400 bg-white"
                  />
                )}
              </div>
            </div>

            {/* Topik / Materi */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Topik / Materi Pokok <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="Contoh: Pengukuran Panjang dan Berat / Siklus Air / Keberagaman Budaya"
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden bg-white font-medium"
              />
              <p className="text-xs text-slate-500 mt-1">
                Tulis topik secara spesifik atau pilih dari rekomendasi AI di bawah untuk perumusan kriteria penilaian yang akurat.
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
                themeColor="indigo"
              />
            </div>

            {/* Tujuan Pembelajaran */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Tujuan Pembelajaran yang Dinilai
                </label>
                <FieldExampleBadge
                  exampleText={dynamicExamples.learningObjectives}
                  contextHint={currentContextHint}
                  onApply={() =>
                    setFormData((p) => ({
                      ...p,
                      learningObjectives: dynamicExamples.learningObjectives,
                    }))
                  }
                />
              </div>
              <textarea
                rows={2}
                value={formData.learningObjectives || ''}
                onChange={(e) => setFormData({ ...formData, learningObjectives: e.target.value })}
                placeholder="Tulis tujuan pembelajaran atau indikator kompetensi..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden bg-white"
              />
            </div>

            {/* Jenis Tugas */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Jenis Tugas / Bentuk Asesmen
                </label>
                <FieldExampleBadge
                  exampleText={dynamicExamples.taskType}
                  contextHint={currentContextHint}
                  onApply={() => setFormData((p) => ({ ...p, taskType: dynamicExamples.taskType }))}
                />
              </div>
              <select
                value={formData.taskType}
                onChange={(e) => setFormData({ ...formData, taskType: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden bg-white font-medium"
              >
                {TASK_TYPES_RUBRIC.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Jumlah Kriteria */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Jumlah Kriteria Penilaian
                </label>
                <FieldExampleBadge
                  exampleText={dynamicExamples.criteriaCountExample}
                  contextHint={currentContextHint}
                />
              </div>
              <select
                value={formData.criteriaCount}
                onChange={(e) => setFormData({ ...formData, criteriaCount: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden bg-white font-medium"
              >
                <option value={3}>3 Kriteria</option>
                <option value={4}>4 Kriteria (Rekomendasi)</option>
                <option value={5}>5 Kriteria</option>
                <option value={6}>6 Kriteria</option>
              </select>
            </div>

            {/* Skala Penilaian */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Skala Penilaian
                </label>
                <FieldExampleBadge
                  exampleText={dynamicExamples.scale}
                  contextHint={currentContextHint}
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: '1-4', label: 'Skala 1 - 4 (Sangat Baik s/d Perlu Bimbingan)' },
                  { id: '1-5', label: 'Skala 1 - 5 (5 Tingkat Capaian)' },
                  { id: '1-10', label: 'Skala 1 - 10 (Desimal/Detail)' },
                  { id: 'custom', label: 'Skala Khusus' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, scale: s.id, scaleType: s.id as any })}
                    className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                      (formData.scale || formData.scaleType) === s.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Generate Rubric Action Bar */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-slate-800">
              Siap Menyusun Rubrik Penilaian?
            </p>
            <p className="text-xs text-slate-500">
              Matriks rubrik akan disusun secara komprehensif lengkap dengan deskriptor tiap level skor.
            </p>
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-base shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Sedang Menyusun Rubrik...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>GENERATE RUBRIK PENILAIAN</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* MODAL CONTOH HASIL TIAP KOLOM */}
      <ColumnExamplesModal
        isOpen={isExamplesModalOpen}
        onClose={() => setIsExamplesModalOpen(false)}
        context="rubric"
        currentFormData={formData}
        onApplyPreset={handleApplyPreset}
        onApplySingleField={handleApplySingleField}
      />
    </div>
  );
};
