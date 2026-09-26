import React, { useState } from 'react';
import {
  X,
  Sparkles,
  BookOpen,
  Check,
  Copy,
  Layers,
  FileText,
  CheckSquare,
  ArrowRight,
  HelpCircle,
  Award,
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  COLUMN_EXAMPLES_LKPD,
  COLUMN_EXAMPLES_RUBRIC,
  PRESET_COMPLETE_EXAMPLES,
  ColumnExampleItem,
  PresetSubjectExample,
} from '../data/columnExamplesData';
import { LKPDFormData, RubricFormData } from '../types';
import {
  getDynamicLkpdColumnExamples,
  getDynamicRubricColumnExamples,
} from '../utils/dynamicExamples';

interface ColumnExamplesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPreset?: (preset: PresetSubjectExample) => void;
  onApplySingleField?: (fieldKey: string, value: string) => void;
  initialTab?: 'lkpd' | 'rubric' | 'presets';
  context?: 'all' | 'lkpd' | 'rubric' | 'presets';
  currentFormData?: Partial<LKPDFormData & RubricFormData>;
}

export const ColumnExamplesModal: React.FC<ColumnExamplesModalProps> = ({
  isOpen,
  onClose,
  onApplyPreset,
  onApplySingleField,
  initialTab,
  context,
  currentFormData,
}) => {
  const determineInitialTab = (): 'lkpd' | 'rubric' | 'presets' => {
    if (context === 'rubric') return 'rubric';
    if (context === 'lkpd') return 'lkpd';
    if (context === 'presets' || context === 'all') return 'presets';
    if (initialTab) return initialTab;
    return 'lkpd';
  };

  const [activeTab, setActiveTab] = useState<'lkpd' | 'rubric' | 'presets'>(determineInitialTab);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'identitas' | 'kurikulum' | 'aktivitas'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activePresetIndex, setActivePresetIndex] = useState(0);

  // Sync activeTab when context or isOpen changes
  React.useEffect(() => {
    if (isOpen) {
      if (context === 'rubric') setActiveTab('rubric');
      else if (context === 'lkpd') setActiveTab('lkpd');
      else if (context === 'presets' || context === 'all') setActiveTab('presets');
      else if (initialTab) setActiveTab(initialTab);
    }
  }, [isOpen, context, initialTab]);

  const lkpdExamplesList = React.useMemo(() => {
    if (!currentFormData) return COLUMN_EXAMPLES_LKPD;
    return getDynamicLkpdColumnExamples(currentFormData as LKPDFormData);
  }, [currentFormData]);

  const rubricExamplesList = React.useMemo(() => {
    if (!currentFormData) return COLUMN_EXAMPLES_RUBRIC;
    return getDynamicRubricColumnExamples(currentFormData as RubricFormData);
  }, [currentFormData]);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredLkpdExamples = lkpdExamplesList.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[90vh] flex flex-col my-auto overflow-hidden animate-scaleUp">
        {/* Header Modal */}
        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-heading">
                Katalog Contoh Hasil Generate per Kolom
              </h2>
              <p className="text-xs text-slate-500">
                Lihat format kalimat nyata dan struktur dokumen yang dihasilkan AI untuk setiap bagian LKPD &amp; Rubrik
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 bg-slate-50/70 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('lkpd')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'lkpd'
                ? 'border-blue-600 text-blue-700 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Contoh Setiap Kolom LKPD ({lkpdExamplesList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rubric')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'rubric'
                ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckSquare className="w-4 h-4 text-indigo-600" />
            <span>Contoh Setiap Kolom Rubrik ({rubricExamplesList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'presets'
                ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Paket Contoh Lengkap Siap Pasang ({PRESET_COMPLETE_EXAMPLES.length})</span>
          </button>
        </div>

        {/* Dynamic Context Sync Banner */}
        {currentFormData && (currentFormData.subject || currentFormData.grade) && (
          <div className="mx-6 mt-3 px-4 py-2.5 rounded-xl bg-blue-50/90 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-blue-950">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <div>
                <span className="font-bold text-blue-900">✨ Contoh Disesuaikan Otomatis:</span>{' '}
                <span className="font-semibold">{currentFormData.subject || 'Mata Pelajaran'}</span> •{' '}
                <span>Kelas {currentFormData.grade || '4'}</span>
                {currentFormData.topic ? (
                  <>
                    {' '}• <span className="font-medium text-blue-800">Topik: "{currentFormData.topic}"</span>
                  </>
                ) : (
                  <span className="text-blue-600 italic"> (Mengikuti materi rekomendasi untuk mapel ini)</span>
                )}
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-600 text-white shrink-0 self-start sm:self-auto">
              Tersinkronisasi dengan Isian Anda
            </span>
          </div>
        )}

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: LKPD EXAMPLES */}
          {activeTab === 'lkpd' && (
            <div className="space-y-4">
              {/* Category Filter */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <span className="text-xs font-semibold text-slate-400 mr-1">Kategori:</span>
                  {(
                    [
                      { id: 'all', label: 'Semua Kolom' },
                      { id: 'identitas', label: 'A. Identitas' },
                      { id: 'kurikulum', label: 'B. CP, TP & KKTP' },
                      { id: 'aktivitas', label: 'C. Aktivitas Soal' },
                    ] as const
                  ).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <span className="text-xs text-slate-500">
                  Klik <strong>Salin</strong> untuk menempelkan kalimat contoh ke formulir Anda
                </span>
              </div>

              {/* List of Column Cards */}
              <div className="grid grid-cols-1 gap-4">
                {filteredLkpdExamples.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-xs transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 font-mono font-bold text-xs">
                          {item.columnNumber ? `Kolom ${item.columnNumber}` : 'Bagian'}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">{item.columnName}</h3>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => handleCopy(item.exampleGenerated, item.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-2xs"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span>Salin Contoh</span>
                            </>
                          )}
                        </button>

                        {onApplySingleField && item.appliedValue && (
                          <button
                            type="button"
                            onClick={() => {
                              onApplySingleField(item.id, item.appliedValue || item.exampleGenerated);
                              onClose();
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-2xs"
                          >
                            <span>Gunakan di Form</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>

                    {/* Box Hasil Generate */}
                    <div className="rounded-lg bg-white border border-blue-100 p-3.5 shadow-2xs">
                      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-blue-50">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          Contoh Hasil yang Dihasilkan AI:
                        </span>
                      </div>
                      <div className="text-xs text-slate-800 font-mono whitespace-pre-line leading-relaxed bg-blue-50/30 p-2.5 rounded-md border border-blue-100/60">
                        {item.exampleGenerated}
                      </div>
                    </div>

                    {/* Tips */}
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50/70 px-2.5 py-1.5 rounded-lg border border-amber-200/60">
                      <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{item.tips}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: RUBRIC EXAMPLES */}
          {activeTab === 'rubric' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 flex items-start gap-2.5">
                <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <p>
                  Berikut adalah format matriks penilaian standar Kurikulum Merdeka yang dihasilkan untuk setiap
                  kolom tabel rubrik, mulai dari Aspek Penilaian, Deskriptor Skor 4 hingga 1, serta Rumus Konversi Nilai.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {rubricExamplesList.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-xs transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-800 font-mono font-bold text-xs">
                          {item.columnNumber ? `Kolom ${item.columnNumber}` : 'Bagian'}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">{item.columnName}</h3>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => handleCopy(item.exampleGenerated, item.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-2xs"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span>Salin Teks</span>
                            </>
                          )}
                        </button>

                        {onApplySingleField && item.appliedValue && (
                          <button
                            type="button"
                            onClick={() => {
                              onApplySingleField(item.id, item.appliedValue || item.exampleGenerated);
                              onClose();
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-2xs"
                          >
                            <span>Gunakan di Form</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-500">{item.description}</p>

                    <div className="rounded-lg bg-white border border-indigo-100 p-3.5 shadow-2xs">
                      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-indigo-50">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          Contoh Hasil Generasi pada Rubrik:
                        </span>
                      </div>
                      <div className="text-xs text-slate-800 font-mono whitespace-pre-line leading-relaxed bg-indigo-50/30 p-2.5 rounded-md border border-indigo-100/60">
                        {item.exampleGenerated}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50/70 px-2.5 py-1.5 rounded-lg border border-amber-200/60">
                      <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{item.tips}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: COMPLETE PRESETS */}
          {activeTab === 'presets' && (
            <div className="space-y-6">
              {/* Preset Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PRESET_COMPLETE_EXAMPLES.map((preset, idx) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setActivePresetIndex(idx)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      activePresetIndex === idx
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <span className="block font-bold text-xs sm:text-sm text-slate-900 mb-1">{preset.title}</span>
                    <span className="text-[11px] text-slate-500 block">
                      {preset.subject} • Kelas {preset.grade} ({preset.phase})
                    </span>
                  </button>
                ))}
              </div>

              {/* Active Preset Detail */}
              {PRESET_COMPLETE_EXAMPLES[activePresetIndex] && (
                <div className="border border-emerald-200 rounded-2xl bg-white p-5 sm:p-6 shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs mb-1">
                        Paket Lengkap Terverifikasi
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                        {PRESET_COMPLETE_EXAMPLES[activePresetIndex].title}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Topik: {PRESET_COMPLETE_EXAMPLES[activePresetIndex].topic} ({PRESET_COMPLETE_EXAMPLES[activePresetIndex].timeAllocation})
                      </p>
                    </div>

                    {onApplyPreset && (
                      <button
                        type="button"
                        onClick={() => {
                          onApplyPreset(PRESET_COMPLETE_EXAMPLES[activePresetIndex]);
                          onClose();
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto"
                      >
                        <Check className="w-4 h-4" />
                        <span>Terapkan Seluruh Contoh ke Formulir</span>
                      </button>
                    )}
                  </div>

                  {/* Matrix of Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                      <span className="text-[11px] font-bold uppercase text-slate-500">Capaian Pembelajaran (CP)</span>
                      <p className="text-xs text-slate-800 leading-relaxed font-mono">
                        {PRESET_COMPLETE_EXAMPLES[activePresetIndex].cpExample}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                      <span className="text-[11px] font-bold uppercase text-slate-500">Tujuan Pembelajaran (TP)</span>
                      <p className="text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-line">
                        {PRESET_COMPLETE_EXAMPLES[activePresetIndex].tpExample}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                      <span className="text-[11px] font-bold uppercase text-slate-500">
                        Indikator Ketercapaian (KKTP)
                      </span>
                      <p className="text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-line">
                        {PRESET_COMPLETE_EXAMPLES[activePresetIndex].indicatorsExample}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                      <span className="text-[11px] font-bold uppercase text-slate-500">
                        Profil Pelajar Pancasila &amp; Model
                      </span>
                      <div className="text-xs text-slate-800 leading-relaxed font-mono">
                        <p className="font-bold text-blue-700">
                          {PRESET_COMPLETE_EXAMPLES[activePresetIndex].modelExample}
                        </p>
                        <p className="text-slate-600 mt-1">
                          {(PRESET_COMPLETE_EXAMPLES[activePresetIndex]?.profilesExample || []).join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sample Activities */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Rancangan Aktivitas Lembar Kerja:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {PRESET_COMPLETE_EXAMPLES[activePresetIndex].activitiesExample.map((act, i) => (
                        <div key={i} className="p-3 rounded-lg border border-slate-200 bg-white text-xs space-y-1 shadow-2xs">
                          <span className="font-bold text-blue-800 block">{act.title}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-sm bg-slate-100 text-slate-600 inline-block">
                            {act.type}
                          </span>
                          <p className="text-[11px] text-slate-500 italic mt-1">{act.preview}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Modal */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Katalog Panduan Kurikulum Merdeka Sekolah Dasar
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-all"
          >
            Tutup Katalog Contoh
          </button>
        </div>
      </div>
    </div>
  );
};
