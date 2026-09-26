import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Download,
  Edit3,
  Eye,
  Save,
  Copy,
  FileText,
  Calculator,
  Award,
  ArrowLeft,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Printer,
  Users,
  RotateCcw,
} from 'lucide-react';
import { RubricContent, RubricFormData, RubricCriterion, RecapStudentItem } from '../types';
import { exportRubricDocx } from '../utils/docxExport';

type RecapStudent = RecapStudentItem;

const SAMPLE_STUDENT_NAMES = [
  'Aditya Pratama',
  'Bunga Citra Lestari',
  'Dimas Satria Nusantara',
  'Fatimah Azzahra',
  'Gilang Ramadhan',
  'Hafizah Aulia Putri',
  'Ibrahim Al-Fatih',
  'Khairunnisa Rahma',
  'Muhammad Rizky',
  'Nabila Syakirah',
  'Pratama Arhan',
  'Rani Permatasari',
  'Siti Nurhaliza',
  'Tegar Septian',
  'Zahra Humaira',
];

interface RubricPreviewProps {
  rubric: RubricContent;
  formData: RubricFormData;
  onUpdateRubric: (updated: RubricContent) => void;
  onSaveDocument: () => void;
  onDuplicate: () => void;
  onBackToForm: () => void;
}

export const RubricPreview: React.FC<RubricPreviewProps> = ({
  rubric,
  formData,
  onUpdateRubric,
  onSaveDocument,
  onDuplicate,
  onBackToForm,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [saveSuccessNotification, setSaveSuccessNotification] = useState(false);

  // Collective Student Recap Table State (15 default students or loaded from rubric)
  const [recapStudents, setRecapStudents] = useState<RecapStudent[]>(() =>
    rubric.recapStudents && rubric.recapStudents.length > 0
      ? rubric.recapStudents
      : Array.from({ length: 15 }, (_, i) => ({
          id: i + 1,
          no: i + 1,
          abs: i < 9 ? `0${i + 1}` : String(i + 1),
          name: '',
          scores: {},
        }))
  );

  React.useEffect(() => {
    if (rubric.recapStudents && rubric.recapStudents.length > 0) {
      setRecapStudents(rubric.recapStudents);
    }
  }, [rubric.id]);

  // Interactive Scoring Calculator State
  // Criteria Index -> chosen score (1, 2, 3, 4)
  const [studentScores, setStudentScores] = useState<{ [criteriaIndex: number]: number }>({
    0: 4,
    1: 3,
    2: 4,
    3: 3,
  });

  // Calculate scores
  const scoringSummary = useMemo(() => {
    const totalCriteria = rubric.criteria.length;
    const maxScore = totalCriteria * 4;
    let earnedScore = 0;

    rubric.criteria.forEach((_, idx) => {
      earnedScore += studentScores[idx] || 0;
    });

    const finalScore = maxScore > 0 ? Math.round((earnedScore / maxScore) * 100 * 10) / 10 : 0;

    let predicate = 'Perlu Bimbingan (D)';
    let predicateColor = 'bg-rose-100 text-rose-800';

    if (finalScore >= 86) {
      predicate = 'Sangat Baik (A)';
      predicateColor = 'bg-emerald-100 text-emerald-800';
    } else if (finalScore >= 71) {
      predicate = 'Baik (B)';
      predicateColor = 'bg-blue-100 text-blue-800';
    } else if (finalScore >= 56) {
      predicate = 'Cukup (C)';
      predicateColor = 'bg-amber-100 text-amber-800';
    }

    return {
      earnedScore,
      maxScore,
      finalScore,
      predicate,
      predicateColor,
    };
  }, [rubric.criteria, studentScores]);

  const handleScoreSelect = (criteriaIdx: number, score: number) => {
    setStudentScores((prev) => ({
      ...prev,
      [criteriaIdx]: score,
    }));
  };

  // Criteria Edits
  const handleCriteriaNameChange = (index: number, val: string) => {
    const updatedCriteria = [...rubric.criteria];
    updatedCriteria[index] = {
      ...updatedCriteria[index],
      name: val,
      criteria: val,
    };
    onUpdateRubric({
      ...rubric,
      criteria: updatedCriteria,
    });
  };

  const handleScoreDescriptorChange = (index: number, score: number, text: string) => {
    const updatedCriteria = [...rubric.criteria];
    const crit = updatedCriteria[index];
    const currentDescriptors = { ...(crit.descriptors || {}) };
    currentDescriptors[score] = text;

    updatedCriteria[index] = {
      ...crit,
      descriptors: currentDescriptors,
      [`score${score}`]: text,
    };

    onUpdateRubric({
      ...rubric,
      criteria: updatedCriteria,
    });
  };

  const handleAddCriteria = () => {
    const newCriteria: RubricCriterion = {
      id: `crit-${Date.now()}`,
      no: rubric.criteria.length + 1,
      name: 'Kriteria Penilaian Baru',
      criteria: 'Kriteria Penilaian Baru',
      descriptors: {
        4: 'Sangat baik dan mandiri dalam memenuhi seluruh indikator capaian.',
        3: 'Baik dalam memenuhi indikator capaian dengan sedikit arahan.',
        2: 'Cukup mampu, masih membutuhkan bimbingan berkala.',
        1: 'Belum mampu memenuhi indikator capaian, perlu pendampingan intensif.',
      },
      score4: 'Sangat baik dan mandiri dalam memenuhi seluruh indikator capaian.',
      score3: 'Baik dalam memenuhi indikator capaian dengan sedikit arahan.',
      score2: 'Cukup mampu, masih membutuhkan bimbingan berkala.',
      score1: 'Belum mampu memenuhi indikator capaian, perlu pendampingan intensif.',
    };
    onUpdateRubric({
      ...rubric,
      criteria: [...rubric.criteria, newCriteria],
    });
  };

  const handleRemoveCriteria = (index: number) => {
    const filtered = rubric.criteria
      .filter((_, i) => i !== index)
      .map((c, idx) => ({ ...c, no: idx + 1 }));
    onUpdateRubric({
      ...rubric,
      criteria: filtered,
    });
  };

  // Export handlers
  const handleExportRubricOnly = async () => {
    setIsExporting(true);
    try {
      const updatedRubric: RubricContent = {
        ...rubric,
        recapStudents,
      };
      onUpdateRubric(updatedRubric);
      await exportRubricDocx(updatedRubric, recapStudents);
    } catch (err) {
      console.error(err);
      alert('Gagal mengunduh file Word rubrik.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveClick = () => {
    onUpdateRubric({
      ...rubric,
      recapStudents,
    });
    onSaveDocument();
    setSaveSuccessNotification(true);
    setTimeout(() => setSaveSuccessNotification(false), 3000);
  };

  // Direct print handler
  const handlePrint = () => {
    window.print();
  };

  // Handlers for collective recap table
  const handleStudentNameChange = (id: number, name: string) => {
    setRecapStudents((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, name } : s));
      onUpdateRubric({ ...rubric, recapStudents: next });
      return next;
    });
  };

  const handleStudentScoreChange = (id: number, critIdx: number, val: string) => {
    const num = val === '' ? '' : Math.max(1, Math.min(4, Number(val)));
    setRecapStudents((prev) => {
      const next = prev.map((s) => {
        if (s.id !== id) return s;
        const newScores = { ...s.scores };
        if (num === '') {
          delete newScores[critIdx];
        } else {
          newScores[critIdx] = num;
        }
        return { ...s, scores: newScores };
      });
      onUpdateRubric({ ...rubric, recapStudents: next });
      return next;
    });
  };

  const handleAddStudentRow = () => {
    setRecapStudents((prev) => {
      const nextNo = prev.length + 1;
      const next = [
        ...prev,
        {
          id: Date.now() + nextNo,
          no: nextNo,
          abs: nextNo < 10 ? `0${nextNo}` : String(nextNo),
          name: '',
          scores: {},
        },
      ];
      onUpdateRubric({ ...rubric, recapStudents: next });
      return next;
    });
  };

  const handleRemoveStudentRow = (id: number) => {
    setRecapStudents((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev
        .filter((s) => s.id !== id)
        .map((s, idx) => ({
          ...s,
          no: idx + 1,
          abs: idx < 9 ? `0${idx + 1}` : String(idx + 1),
        }));
      onUpdateRubric({ ...rubric, recapStudents: next });
      return next;
    });
  };

  const handleSetStudentCount = (count: number) => {
    setRecapStudents((prev) => {
      let next: RecapStudent[];
      if (count <= prev.length) {
        next = prev.slice(0, count).map((s, idx) => ({
          ...s,
          no: idx + 1,
          abs: idx < 9 ? `0${idx + 1}` : String(idx + 1),
        }));
      } else {
        const additional: RecapStudent[] = Array.from(
          { length: count - prev.length },
          (_, i) => {
            const num = prev.length + i + 1;
            return {
              id: Date.now() + num,
              no: num,
              abs: num < 10 ? `0${num}` : String(num),
              name: '',
              scores: {},
            };
          }
        );
        next = [...prev, ...additional];
      }
      onUpdateRubric({ ...rubric, recapStudents: next });
      return next;
    });
  };

  const handleFillSampleData = () => {
    setRecapStudents((prev) => {
      const next = prev.map((s, idx) => {
        const sampleName = SAMPLE_STUDENT_NAMES[idx % SAMPLE_STUDENT_NAMES.length];
        const scores: { [key: number]: number } = {};
        rubric.criteria.forEach((_, cIdx) => {
          const baseScores = [4, 3, 4, 3, 4, 3, 2, 4];
          scores[cIdx] = baseScores[(idx + cIdx) % baseScores.length];
        });
        return {
          ...s,
          name: sampleName,
          scores,
        };
      });
      onUpdateRubric({ ...rubric, recapStudents: next });
      return next;
    });
  };

  const handleResetRecapTable = () => {
    setRecapStudents((prev) => {
      const next = prev.map((s) => ({
        ...s,
        name: '',
        scores: {},
      }));
      onUpdateRubric({ ...rubric, recapStudents: next });
      return next;
    });
  };

  // Compute Recap Summary (class statistics)
  const recapClassSummary = useMemo(() => {
    const maxScorePerStudent = rubric.criteria.length * 4;
    let studentWithScoresCount = 0;
    let totalScoreSum = 0;
    let totalPercentageSum = 0;
    let tuntasCount = 0;
    let remedialCount = 0;

    recapStudents.forEach((st) => {
      const scoreKeys = Object.keys(st.scores);
      if (scoreKeys.length > 0) {
        studentWithScoresCount++;
        let sum = 0;
        scoreKeys.forEach((k) => {
          const val = st.scores[Number(k)];
          if (typeof val === 'number') sum += val;
        });
        totalScoreSum += sum;
        const finalPct = maxScorePerStudent > 0 ? (sum / maxScorePerStudent) * 100 : 0;
        totalPercentageSum += finalPct;
        if (finalPct >= 71) {
          tuntasCount++;
        } else {
          remedialCount++;
        }
      }
    });

    const avgScore =
      studentWithScoresCount > 0
        ? Math.round((totalScoreSum / studentWithScoresCount) * 10) / 10
        : 0;
    const avgPercentage =
      studentWithScoresCount > 0
        ? Math.round((totalPercentageSum / studentWithScoresCount) * 10) / 10
        : 0;

    return {
      activeStudents: studentWithScoresCount,
      avgScore,
      avgPercentage,
      tuntasCount,
      remedialCount,
      maxScorePerStudent,
    };
  }, [recapStudents, rubric.criteria]);

  const getDescriptorText = (crit: RubricCriterion, score: number) => {
    if (crit.descriptors && crit.descriptors[score]) {
      return crit.descriptors[score];
    }
    if ((crit as any)[`score${score}`]) {
      return (crit as any)[`score${score}`];
    }
    return '-';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 sticky top-20 z-30 print:hidden">
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
                Hasil Rubrik Penilaian
              </h2>
              <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-indigo-100 text-indigo-800">
                Skor 4–1
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {rubric.subject} &bull; {rubric.grade} &bull; {rubric.topic}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Edit / Preview Toggle */}
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              isEditMode
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isEditMode ? <Eye className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            <span>{isEditMode ? 'Lihat Preview' : 'Edit Rubrik'}</span>
          </button>

          {/* Direct Print */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
            title="Cetak rubrik dan tabel rekapitulasi kolektif"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Cetak Rubrik</span>
          </button>

          {/* Duplicate */}
          <button
            onClick={onDuplicate}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
          >
            <Copy className="w-4 h-4 text-slate-600" />
            <span>Duplikat</span>
          </button>

          {/* Save */}
          <button
            onClick={handleSaveClick}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all"
          >
            {saveSuccessNotification ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saveSuccessNotification ? 'Tersimpan!' : 'Simpan'}</span>
          </button>

          {/* Download Rubrik Word */}
          <button
            onClick={handleExportRubricOnly}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all disabled:opacity-60"
          >
            <Download className="w-4 h-4" />
            <span>Download Rubrik Word</span>
          </button>
        </div>
      </div>

      {/* KALKULATOR NILAI INTERAKTIF (Floating widget / preview card) */}
      <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg border border-indigo-700/50 space-y-4 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-700/50 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                Kalkulator Penilaian Interaktif Siswa
              </h3>
              <p className="text-xs text-indigo-200">
                Simulasi penskoran per kriteria &bull; Terhitung otomatis sesuai bobot KKTP
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-indigo-200">Rumus Asesmen:</span>
            <span className="px-2.5 py-1 rounded-md bg-white/10 font-mono text-xs text-amber-300 font-bold border border-white/10">
              (Skor Diperoleh / Total Skor Maksimal) x 100
            </span>
          </div>
        </div>

        {/* Live Calculation Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <p className="text-xs text-indigo-200 font-medium">Skor Diperoleh</p>
            <p className="text-2xl font-black text-amber-300 mt-0.5">
              {scoringSummary.earnedScore}{' '}
              <span className="text-sm font-normal text-indigo-200">/ {scoringSummary.maxScore}</span>
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <p className="text-xs text-indigo-200 font-medium">Nilai Akhir</p>
            <p className="text-2xl font-black text-white mt-0.5">
              {scoringSummary.finalScore}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 col-span-2">
            <p className="text-xs text-indigo-200 font-medium">Predikat Capaian Siswa</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-3 py-1 rounded-lg text-xs font-bold ${scoringSummary.predicateColor}`}>
                {scoringSummary.predicate}
              </span>
              <span className="text-xs text-indigo-200">
                (Kriteria KKTP Kurikulum Merdeka)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Document Sheet Layout */}
      <div className="bg-white rounded-2xl p-6 sm:p-10 lg:p-14 border border-slate-300 shadow-xl max-w-4xl mx-auto text-slate-900 font-serif leading-relaxed space-y-8 print:shadow-none print:border-none print:p-0 print:max-w-none print:space-y-6">
        {/* KOP / HEADER */}
        <div className="border-b-2 border-slate-900 pb-5 text-center space-y-1">
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-slate-900 font-heading">
            {rubric.schoolName || 'SEKOLAH DASAR'}
          </h1>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-800 font-heading tracking-tight">
            {rubric.title || 'RUBRIK PENILAIAN ASESMEN AUTENTIK'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 italic">
            Mata Pelajaran: {rubric.subject} | {rubric.grade} ({rubric.phase}) | Semester: {rubric.semester || '1'}
          </p>
        </div>

        {/* IDENTITAS ASESMEN */}
        <div className="border border-indigo-200 rounded-xl p-4 bg-indigo-50/40 font-sans text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <p>
                <strong className="text-slate-700">Materi Pokok:</strong> {rubric.topic}
              </p>
              <p className="mt-1">
                <strong className="text-slate-700">Bentuk Penilaian:</strong> {rubric.taskType}
              </p>
              <p className="mt-1">
                <strong className="text-slate-700">Skala Penilaian:</strong> {rubric.scale || '1 - 4'}
              </p>
            </div>
            <div>
              <p>
                <strong className="text-slate-700">Kelas / Rombel:</strong> {rubric.grade} ({rubric.phase})
              </p>
              <p className="mt-1">
                <strong className="text-slate-700">Sasaran Asesmen:</strong> Rekapitulasi Kolektif Seluruh Siswa ({recapStudents.length} Peserta Didik)
              </p>
              <p className="mt-1">
                <strong className="text-slate-700">Guru Penilai:</strong> {formData.teacherName || 'Guru Kelas'}
              </p>
            </div>
          </div>
        </div>

        {/* TABEL RUBRIK PENILAIAN */}
        <section className="font-sans space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-base sm:text-lg font-bold text-indigo-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-xs font-bold">
                B
              </span>
              <span>MATRIKS RUBRIK PENILAIAN</span>
            </h3>
            {isEditMode && (
              <button
                onClick={handleAddCriteria}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Kriteria
              </button>
            )}
          </div>

          <p className="text-xs text-slate-500 italic">
            * Klik salah satu kolom skor (4, 3, 2, atau 1) pada tiap kriteria di bawah untuk menguji kalkulator penilaian.
          </p>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead className="bg-indigo-50/80 text-indigo-950 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3 w-10 text-center">No</th>
                  <th className="p-3 min-w-44">Kriteria Penilaian</th>
                  <th className="p-3 min-w-40 bg-emerald-50/60 border-l border-slate-200">
                    Skor 4<br />
                    <span className="text-[11px] font-normal text-emerald-800">(Sangat Baik)</span>
                  </th>
                  <th className="p-3 min-w-40 bg-blue-50/60 border-l border-slate-200">
                    Skor 3<br />
                    <span className="text-[11px] font-normal text-blue-800">(Baik)</span>
                  </th>
                  <th className="p-3 min-w-40 bg-amber-50/60 border-l border-slate-200">
                    Skor 2<br />
                    <span className="text-[11px] font-normal text-amber-800">(Cukup)</span>
                  </th>
                  <th className="p-3 min-w-40 bg-rose-50/60 border-l border-slate-200">
                    Skor 1<br />
                    <span className="text-[11px] font-normal text-rose-800">(Perlu Bimbingan)</span>
                  </th>
                  {isEditMode && <th className="p-3 w-10 text-center">Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {rubric.criteria.map((crit, idx) => {
                  const selectedScore = studentScores[idx] || 0;
                  const critName = crit.name || crit.criteria || `Kriteria ${idx + 1}`;
                  const s4 = getDescriptorText(crit, 4);
                  const s3 = getDescriptorText(crit, 3);
                  const s2 = getDescriptorText(crit, 2);
                  const s1 = getDescriptorText(crit, 1);

                  return (
                    <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50/80">
                      <td className="p-3 text-center font-bold text-slate-600 align-top">
                        {idx + 1}
                      </td>

                      {/* Kriteria Title */}
                      <td className="p-3 font-semibold text-slate-900 align-top">
                        {isEditMode ? (
                          <textarea
                            rows={2}
                            value={critName}
                            onChange={(e) => handleCriteriaNameChange(idx, e.target.value)}
                            className="w-full p-1.5 text-xs border border-slate-300 rounded-md"
                          />
                        ) : (
                          <span>{critName}</span>
                        )}
                      </td>

                      {/* Skor 4 */}
                      <td
                        onClick={() => handleScoreSelect(idx, 4)}
                        className={`p-3 align-top border-l border-slate-200 cursor-pointer transition-all ${
                          selectedScore === 4
                            ? 'bg-emerald-100/90 font-medium text-emerald-950 ring-2 ring-emerald-500 rounded-sm'
                            : 'hover:bg-emerald-50/40 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <input
                            type="radio"
                            name={`criteria-${idx}`}
                            checked={selectedScore === 4}
                            onChange={() => handleScoreSelect(idx, 4)}
                            className="accent-emerald-600"
                          />
                          <span className="text-[11px] font-bold text-emerald-700">Skor 4</span>
                        </div>
                        {isEditMode ? (
                          <textarea
                            rows={3}
                            value={s4}
                            onChange={(e) => handleScoreDescriptorChange(idx, 4, e.target.value)}
                            className="w-full p-1 text-xs border border-slate-300 rounded-md"
                          />
                        ) : (
                          <p className="text-xs leading-relaxed">{s4}</p>
                        )}
                      </td>

                      {/* Skor 3 */}
                      <td
                        onClick={() => handleScoreSelect(idx, 3)}
                        className={`p-3 align-top border-l border-slate-200 cursor-pointer transition-all ${
                          selectedScore === 3
                            ? 'bg-blue-100/90 font-medium text-blue-950 ring-2 ring-blue-500 rounded-sm'
                            : 'hover:bg-blue-50/40 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <input
                            type="radio"
                            name={`criteria-${idx}`}
                            checked={selectedScore === 3}
                            onChange={() => handleScoreSelect(idx, 3)}
                            className="accent-blue-600"
                          />
                          <span className="text-[11px] font-bold text-blue-700">Skor 3</span>
                        </div>
                        {isEditMode ? (
                          <textarea
                            rows={3}
                            value={s3}
                            onChange={(e) => handleScoreDescriptorChange(idx, 3, e.target.value)}
                            className="w-full p-1 text-xs border border-slate-300 rounded-md"
                          />
                        ) : (
                          <p className="text-xs leading-relaxed">{s3}</p>
                        )}
                      </td>

                      {/* Skor 2 */}
                      <td
                        onClick={() => handleScoreSelect(idx, 2)}
                        className={`p-3 align-top border-l border-slate-200 cursor-pointer transition-all ${
                          selectedScore === 2
                            ? 'bg-amber-100/90 font-medium text-amber-950 ring-2 ring-amber-500 rounded-sm'
                            : 'hover:bg-amber-50/40 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <input
                            type="radio"
                            name={`criteria-${idx}`}
                            checked={selectedScore === 2}
                            onChange={() => handleScoreSelect(idx, 2)}
                            className="accent-amber-600"
                          />
                          <span className="text-[11px] font-bold text-amber-700">Skor 2</span>
                        </div>
                        {isEditMode ? (
                          <textarea
                            rows={3}
                            value={s2}
                            onChange={(e) => handleScoreDescriptorChange(idx, 2, e.target.value)}
                            className="w-full p-1 text-xs border border-slate-300 rounded-md"
                          />
                        ) : (
                          <p className="text-xs leading-relaxed">{s2}</p>
                        )}
                      </td>

                      {/* Skor 1 */}
                      <td
                        onClick={() => handleScoreSelect(idx, 1)}
                        className={`p-3 align-top border-l border-slate-200 cursor-pointer transition-all ${
                          selectedScore === 1
                            ? 'bg-rose-100/90 font-medium text-rose-950 ring-2 ring-rose-500 rounded-sm'
                            : 'hover:bg-rose-50/40 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <input
                            type="radio"
                            name={`criteria-${idx}`}
                            checked={selectedScore === 1}
                            onChange={() => handleScoreSelect(idx, 1)}
                            className="accent-rose-600"
                          />
                          <span className="text-[11px] font-bold text-rose-700">Skor 1</span>
                        </div>
                        {isEditMode ? (
                          <textarea
                            rows={3}
                            value={s1}
                            onChange={(e) => handleScoreDescriptorChange(idx, 1, e.target.value)}
                            className="w-full p-1 text-xs border border-slate-300 rounded-md"
                          />
                        ) : (
                          <p className="text-xs leading-relaxed">{s1}</p>
                        )}
                      </td>

                      {isEditMode && (
                        <td className="p-3 text-center align-top border-l border-slate-200">
                          <button
                            onClick={() => handleRemoveCriteria(idx)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* PEDOMAN PENSKORAN & INTERVAL NILAI */}
        <section className="font-sans space-y-4 pt-2">
          <div className="border-b border-slate-200 pb-2">
            <h3 className="text-base sm:text-lg font-bold text-indigo-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-xs font-bold">
                C
              </span>
              <span>PEDOMAN PENSKORAN &amp; INTERVAL NILAI</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm space-y-2">
              <p className="font-bold text-slate-800">Rumus Penentuan Nilai Akhir:</p>
              <div className="bg-white p-3 rounded-lg border border-slate-200 text-center font-mono text-xs font-bold text-indigo-900">
                Nilai = (Skor Perolehan / Total Skor Maksimal) &times; 100
              </div>
              <p className="text-slate-500 text-xs">
                Total skor maksimal pada rubrik ini = {rubric.criteria.length * 4} (Jumlah kriteria: {rubric.criteria.length} &times; 4).
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-100 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2 text-left">Rentang Nilai</th>
                    <th className="p-2 text-left">Predikat</th>
                    <th className="p-2 text-left">Keterangan Capaian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-emerald-50/50">
                    <td className="p-2 font-semibold">86 - 100</td>
                    <td className="p-2 font-bold text-emerald-800">Sangat Baik (A)</td>
                    <td className="p-2">Tercapai seluruhnya secara mandiri</td>
                  </tr>
                  <tr className="bg-blue-50/50">
                    <td className="p-2 font-semibold">71 - 85</td>
                    <td className="p-2 font-bold text-blue-800">Baik (B)</td>
                    <td className="p-2">Tercapai dengan pendampingan minim</td>
                  </tr>
                  <tr className="bg-amber-50/50">
                    <td className="p-2 font-semibold">56 - 70</td>
                    <td className="p-2 font-bold text-amber-800">Cukup (C)</td>
                    <td className="p-2">Tercapai sebagian, perlu latihan</td>
                  </tr>
                  <tr className="bg-rose-50/50">
                    <td className="p-2 font-semibold">0 - 55</td>
                    <td className="p-2 font-bold text-rose-800">Perlu Bimbingan (D)</td>
                    <td className="p-2">Belum tercapai, perlu remedi khusus</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* TABEL REKAPITULASI PENILAIAN SELURUH SISWA (KOLEKTIF KELAS) */}
        <section className="font-sans space-y-4 pt-6 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-indigo-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-xs font-bold">
                  D
                </span>
                <span>TABEL REKAPITULASI PENILAIAN SELURUH SISWA (KOLEKTIF KELAS)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Instrumen pencatatan penilaian autentik satu rombel/kelas secara kolektif (Format Kurikulum Merdeka)
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200 print:hidden">
              {recapStudents.length} Siswa Terdaftar
            </span>
          </div>

          {/* Interactive Controls Bar (Hidden in Print) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs flex flex-wrap items-center justify-between gap-3 print:hidden">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                Jumlah Siswa:
              </span>
              <select
                value={recapStudents.length}
                onChange={(e) => handleSetStudentCount(Number(e.target.value))}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value={10}>10 Siswa</option>
                <option value={15}>15 Siswa</option>
                <option value={20}>20 Siswa</option>
                <option value={25}>25 Siswa</option>
                <option value={30}>30 Siswa</option>
              </select>
              <button
                onClick={handleAddStudentRow}
                className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg flex items-center gap-1 transition-colors"
                title="Tambah satu baris siswa di bawah"
              >
                <Plus className="w-3 h-3" /> Tambah Baris
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleFillSampleData}
                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg border border-indigo-200 flex items-center gap-1 transition-colors"
                title="Isi contoh nama siswa dan nilai untuk melihat perhitungan otomatis"
              >
                <Sparkles className="w-3 h-3" /> Isi Contoh Siswa
              </button>
              <button
                onClick={handleResetRecapTable}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-600 font-semibold rounded-lg border border-slate-300 flex items-center gap-1 transition-colors"
                title="Kosongkan nama dan skor untuk cetak bersih (siap tulis tangan)"
              >
                <RotateCcw className="w-3 h-3" /> Kosongkan (Siap Cetak)
              </button>
            </div>
          </div>

          {/* Parity Notification with Word Document */}
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-medium print:hidden">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Sinkronisasi Word Aktif:</strong> Isian nama siswa, perolehan skor kriteria, nilai akhir, predikat, dan status T/R pada tabel ini otomatis disertakan ke dalam file Word (.docx) saat Anda mengunduh.
            </span>
          </div>

          {/* Statistics summary card when students have scores (Hidden in Print) */}
          {recapClassSummary.activeStudents > 0 && (
            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-slate-500">Siswa Dinilai:</span>{' '}
                  <strong className="text-indigo-950 font-bold">{recapClassSummary.activeStudents}</strong> / {recapStudents.length}
                </div>
                <div>
                  <span className="text-slate-500">Rata-rata Skor:</span>{' '}
                  <strong className="text-indigo-950 font-bold">{recapClassSummary.avgScore}</strong> / {recapClassSummary.maxScorePerStudent}
                </div>
                <div>
                  <span className="text-slate-500">Rata-rata Nilai:</span>{' '}
                  <strong className="text-indigo-950 font-bold">{recapClassSummary.avgPercentage}</strong>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                  Tuntas: {recapClassSummary.tuntasCount}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold">
                  Remedial: {recapClassSummary.remedialCount}
                </span>
              </div>
            </div>
          )}

          {/* The Collective Recap Table */}
          <div className="border border-slate-300 rounded-xl overflow-x-auto shadow-xs">
            <table className="w-full text-xs text-left border-collapse min-w-[700px]">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b-2 border-slate-300">
                <tr>
                  <th className="p-2 border-r border-slate-300 text-center w-8">No</th>
                  <th className="p-2 border-r border-slate-300 text-center w-12">Abs</th>
                  <th className="p-2 border-r border-slate-300 min-w-[170px]">Nama Peserta Didik</th>
                  {rubric.criteria.map((c, cIdx) => (
                    <th
                      key={cIdx}
                      className="p-2 border-r border-slate-300 text-center w-11 bg-indigo-50/50"
                      title={`K${cIdx + 1}: ${c.criteria}`}
                    >
                      K{cIdx + 1}
                    </th>
                  ))}
                  <th className="p-2 border-r border-slate-300 text-center w-14 bg-slate-100">
                    Total
                  </th>
                  <th className="p-2 border-r border-slate-300 text-center w-14 bg-slate-100">
                    Nilai
                  </th>
                  <th className="p-2 border-r border-slate-300 text-center w-20 bg-slate-100">
                    Predikat
                  </th>
                  <th className="p-2 border-r border-slate-300 text-center w-20 bg-slate-100">
                    Tindak Lanjut
                  </th>
                  <th className="p-2 text-center w-9 print:hidden">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recapStudents.map((st, sIdx) => {
                  const maxPerStudent = rubric.criteria.length * 4;
                  const enteredScoreKeys = Object.keys(st.scores);
                  const hasScores = enteredScoreKeys.length > 0;
                  let totalEarned = 0;
                  enteredScoreKeys.forEach((k) => {
                    const v = st.scores[Number(k)];
                    if (typeof v === 'number') totalEarned += v;
                  });
                  const finalVal =
                    hasScores && maxPerStudent > 0
                      ? Math.round((totalEarned / maxPerStudent) * 100)
                      : null;

                  let predText = '-';
                  let predColor = 'text-slate-400';
                  let followUpText = '-';
                  let followUpColor = 'text-slate-400';

                  if (finalVal !== null) {
                    if (finalVal >= 86) {
                      predText = 'Sangat Baik (A)';
                      predColor = 'text-emerald-700 font-bold';
                    } else if (finalVal >= 71) {
                      predText = 'Baik (B)';
                      predColor = 'text-blue-700 font-bold';
                    } else if (finalVal >= 56) {
                      predText = 'Cukup (C)';
                      predColor = 'text-amber-700 font-bold';
                    } else {
                      predText = 'Perlu Bimb. (D)';
                      predColor = 'text-rose-700 font-bold';
                    }

                    if (finalVal >= 71) {
                      followUpText = 'Tuntas (T)';
                      followUpColor = 'text-emerald-700 font-bold';
                    } else {
                      followUpText = 'Remedial (R)';
                      followUpColor = 'text-rose-700 font-bold';
                    }
                  }

                  return (
                    <tr
                      key={st.id}
                      className={`hover:bg-indigo-50/20 transition-colors ${
                        sIdx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'
                      }`}
                    >
                      <td className="p-1.5 border-r border-slate-200 text-center font-medium text-slate-600">
                        {st.no}
                      </td>
                      <td className="p-1.5 border-r border-slate-200 text-center font-mono text-slate-500">
                        {st.abs}
                      </td>
                      <td className="p-1.5 border-r border-slate-200">
                        <input
                          type="text"
                          value={st.name}
                          onChange={(e) => handleStudentNameChange(st.id, e.target.value)}
                          placeholder={`Nama Siswa ${st.no}...`}
                          className="w-full px-1.5 py-0.5 text-xs rounded border border-transparent hover:border-slate-300 focus:border-indigo-500 focus:bg-white bg-transparent font-medium text-slate-800 print:hidden"
                        />
                        <div className="hidden print:block text-xs py-0.5">
                          {st.name || (
                            <span className="text-slate-400">....................................................</span>
                          )}
                        </div>
                      </td>

                      {/* Criteria Scores */}
                      {rubric.criteria.map((_, cIdx) => {
                        const val = st.scores[cIdx] ?? '';
                        return (
                          <td
                            key={cIdx}
                            className="p-1 border-r border-slate-200 text-center bg-indigo-50/20"
                          >
                            <input
                              type="number"
                              min={1}
                              max={4}
                              value={val}
                              onChange={(e) =>
                                handleStudentScoreChange(st.id, cIdx, e.target.value)
                              }
                              className="w-8 text-center text-xs font-semibold py-0.5 rounded border border-slate-200 hover:border-indigo-400 focus:border-indigo-600 focus:bg-white bg-transparent print:hidden"
                            />
                            <span className="hidden print:inline font-mono text-xs">
                              {val !== '' ? val : '.....'}
                            </span>
                          </td>
                        );
                      })}

                      {/* Total Earned */}
                      <td className="p-1.5 border-r border-slate-200 text-center font-bold text-slate-800">
                        {hasScores ? (
                          totalEarned
                        ) : (
                          <span className="text-slate-300 print:hidden">-</span>
                        )}
                        {!hasScores && <span className="hidden print:inline font-mono">.....</span>}
                      </td>

                      {/* Nilai Akhir */}
                      <td className="p-1.5 border-r border-slate-200 text-center font-extrabold text-indigo-900">
                        {finalVal !== null ? (
                          finalVal
                        ) : (
                          <span className="text-slate-300 print:hidden">-</span>
                        )}
                        {finalVal === null && <span className="hidden print:inline font-mono">.....</span>}
                      </td>

                      {/* Predikat */}
                      <td className={`p-1.5 border-r border-slate-200 text-center text-[11px] ${predColor}`}>
                        {hasScores ? (
                          predText
                        ) : (
                          <span className="text-slate-300 print:hidden">-</span>
                        )}
                        {!hasScores && <span className="hidden print:inline font-mono">.....</span>}
                      </td>

                      {/* Tindak Lanjut */}
                      <td className={`p-1.5 border-r border-slate-200 text-center text-[11px] ${followUpColor}`}>
                        {hasScores ? (
                          followUpText
                        ) : (
                          <span className="text-slate-300 print:hidden">-</span>
                        )}
                        {!hasScores && (
                          <span className="hidden print:inline font-mono text-[10px]">
                            [ ] T &nbsp; [ ] R
                          </span>
                        )}
                      </td>

                      {/* Action (Delete) */}
                      <td className="p-1 text-center print:hidden">
                        <button
                          onClick={() => handleRemoveStudentRow(st.id)}
                          disabled={recapStudents.length <= 1}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors disabled:opacity-30"
                          title="Hapus baris siswa ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* Summary Footer */}
              <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300 text-slate-800">
                <tr>
                  <td colSpan={3} className="p-2 border-r border-slate-300 text-right">
                    Rata-rata Kelas / Capaian Kolektif:
                  </td>
                  {rubric.criteria.map((_, cIdx) => (
                    <td key={cIdx} className="p-2 border-r border-slate-300 text-center text-slate-500 font-mono">
                      -
                    </td>
                  ))}
                  <td className="p-2 border-r border-slate-300 text-center">
                    {recapClassSummary.activeStudents > 0
                      ? recapClassSummary.avgScore
                      : '-'}
                  </td>
                  <td className="p-2 border-r border-slate-300 text-center text-indigo-900">
                    {recapClassSummary.activeStudents > 0
                      ? recapClassSummary.avgPercentage
                      : '-'}
                  </td>
                  <td className="p-2 border-r border-slate-300 text-center text-[11px]">
                    {recapClassSummary.activeStudents > 0
                      ? `${recapClassSummary.tuntasCount} T / ${recapClassSummary.remedialCount} R`
                      : '-'}
                  </td>
                  <td className="p-2 border-r border-slate-300 text-center text-[11px] text-emerald-700">
                    {recapClassSummary.activeStudents > 0
                      ? `${Math.round((recapClassSummary.tuntasCount / recapClassSummary.activeStudents) * 100)}% Tuntas`
                      : '-'}
                  </td>
                  <td className="print:hidden"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Keterangan Kriteria & KKTP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
            <div>
              <p className="font-bold text-slate-800 mb-1">Keterangan Kode Kriteria:</p>
              <ul className="space-y-0.5">
                {rubric.criteria.map((c, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="font-bold text-indigo-800 w-7 shrink-0">K{idx + 1}:</span>
                    <span>{c.criteria}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-bold text-slate-800 mb-1">Pedoman &amp; Ketuntasan (KKTP):</p>
              <ul className="space-y-0.5">
                <li>&bull; Skala penskoran kriteria: 1 s.d. 4 (Total Skor Maks = {rubric.criteria.length * 4})</li>
                <li>&bull; Rumus Nilai = (Total Skor Diperoleh / Total Skor Maksimal) &times; 100</li>
                <li>&bull; <strong className="text-emerald-700">T = Tuntas</strong>: Nilai Akhir &ge; 71 (Kategori Baik / Sangat Baik)</li>
                <li>&bull; <strong className="text-rose-700">R = Remedial</strong>: Nilai Akhir &lt; 71 (Perlu Pendampingan Tambahan)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* SIGNATURE SECTION */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 text-center text-xs sm:text-sm font-sans">
          <div>
            <p>Mengetahui,</p>
            <p className="font-semibold mt-0.5">Kepala Sekolah</p>
            <div className="h-16" />
            <p className="font-bold underline">( .................................................... )</p>
            <p className="text-xs text-slate-500">NIP. ...............................................</p>
          </div>
          <div>
            <p>&nbsp;</p>
            <p className="font-semibold mt-0.5">Guru Penilai</p>
            <div className="h-16" />
            <p className="font-bold underline">
              ( {formData.teacherName || '....................................................'} )
            </p>
            <p className="text-xs text-slate-500">NIP. ...............................................</p>
          </div>
        </div>
      </div>
    </div>
  );
};
