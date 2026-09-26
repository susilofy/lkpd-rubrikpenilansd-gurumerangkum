import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Sparkles,
  FileText,
  CheckSquare,
  Download,
  Lightbulb,
  ExternalLink,
  GraduationCap,
} from 'lucide-react';
import { ColumnExamplesModal } from './ColumnExamplesModal';

interface GuideViewProps {
  onStartLKPD: () => void;
  onStartRubric: () => void;
}

export const GuideView: React.FC<GuideViewProps> = ({ onStartLKPD, onStartRubric }) => {
  const [isExamplesModalOpen, setIsExamplesModalOpen] = useState(false);
  const [modalContext, setModalContext] = useState<'all' | 'lkpd' | 'rubric'>('all');

  const handleOpenModal = (ctx: 'all' | 'lkpd' | 'rubric') => {
    setModalContext(ctx);
    setIsExamplesModalOpen(true);
  };
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              Panduan Praktis Guru SD
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Petunjuk penyusunan LKPD, Rubrik Penilaian, dan Asesmen Kurikulum Merdeka
            </p>
          </div>
        </div>
      </div>

      {/* 3 Langkah Cepat */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>Cara Membuat LKPD &amp; Rubrik dalam 3 Langkah Mudah</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-2">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
              1
            </span>
            <h4 className="font-bold text-sm text-blue-900">Pilih Identitas &amp; Topik</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tentukan Kelas (1–6 SD), Mata Pelajaran, dan ketikkan Topik atau Materi yang ingin diajarkan. Gunakan tombol bantuan AI untuk merumuskan CP &amp; TP otomatis jika dibutuhkan.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
              2
            </span>
            <h4 className="font-bold text-sm text-indigo-900">Generate &amp; Sesuaikan</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Klik <strong>GENERATE LKPD</strong>. Anda dapat mengedit teks, menambah soal, atau menggunakan fitur <em>Generate Ulang</em> untuk membuat materi lebih HOTS atau lebih kontekstual.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
              3
            </span>
            <h4 className="font-bold text-sm text-emerald-900">Pilih Menu LKPD atau Rubrik</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Menu LKPD dan Menu Rubrik Penilaian bekerja secara mandiri dan terpisah. Anda bebas menyusun LKPD secara terpisah atau menyusun rubrik asesmen secara terpisah lalu mengunduh berkas Word (.docx) masing-masing.
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={onStartLKPD}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Mulai Buat LKPD Sekarang</span>
          </button>
          <button
            onClick={onStartRubric}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-all"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Buat Rubrik Penilaian</span>
          </button>
          <button
            onClick={() => handleOpenModal('all')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs sm:text-sm font-bold shadow-xs transition-all"
          >
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>💡 Lihat Contoh Hasil Tiap Kolom</span>
          </button>
        </div>
      </section>

      {/* Referensi Contoh Hasil Tiap Kolom Section */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <span>Contoh Format &amp; Output Setiap Kolom Input</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Panduan pengisian formulir dengan contoh kalimat nyata sesuai Kurikulum Merdeka
            </p>
          </div>
          <button
            onClick={() => handleOpenModal('all')}
            className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors shrink-0"
          >
            Buka Katalog Lengkap &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div
            onClick={() => handleOpenModal('lkpd')}
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                Kolom LKPD
              </span>
              <span className="text-xs text-blue-600 font-semibold group-hover:underline">Buka &rarr;</span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">Capaian &amp; Tujuan Pembelajaran</h4>
            <p className="text-xs text-slate-500 line-clamp-2">
              Contoh kata kerja operasional (KKO) Taksonomi Bloom, rumusan indikator, dan pemetaan materi per fase A, B, dan C.
            </p>
          </div>

          <div
            onClick={() => handleOpenModal('rubric')}
            className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
                Kolom Rubrik
              </span>
              <span className="text-xs text-indigo-600 font-semibold group-hover:underline">Buka &rarr;</span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">Kriteria &amp; Deskriptor Skor 4 - 1</h4>
            <p className="text-xs text-slate-500 line-clamp-2">
              Contoh deskriptor tingkatan Sangat Baik (4), Baik (3), Cukup (2), dan Perlu Bimbingan (1) untuk berbagai jenis tugas.
            </p>
          </div>
        </div>
      </section>

      {/* Karakteristik Fase Kurikulum Merdeka */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 font-heading">
          Pedoman Kognitif Peserta Didik per Fase (SD)
        </h3>

        <div className="space-y-4 text-xs sm:text-sm">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-xs font-bold">
                Fase A (Kelas 1 - 2 SD)
              </span>
              <span className="font-semibold text-slate-800">Fondasi Konkrit &amp; Literasi Awal</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Utamakan instruksi bergambar, bahasa yang sangat ramah anak, kalimat pendek, aktivitas mencocokkan, mewarnai, serta manipulasi objek konkrit di sekitar kelas atau rumah.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-xs font-bold">
                Fase B (Kelas 3 - 4 SD)
              </span>
              <span className="font-semibold text-slate-800">Transisi Logis &amp; Eksplorasi Terstruktur</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Mulai menerapkan pengelompokan konsep, observasi sederhana terhadap lingkungan (IPAS), diskusi kelompok kecil, tabel data sederhana, dan pertanyaan penalaran 'mengapa' dan 'bagaimana'.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-amber-600 text-white text-xs font-bold">
                Fase C (Kelas 5 - 6 SD)
              </span>
              <span className="font-semibold text-slate-800">Penalaran Abstrak, Analisis, &amp; HOTS</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Sajikan pemecahan masalah kontekstual, studi kasus, perancangan proyek mini, evaluasi alternatif solusi, serta penulisan refleksi diri yang mendalam.
            </p>
          </div>
        </div>
      </section>

      {/* Profil Pengembang Info Box */}
      <section className="bg-slate-900 text-slate-300 rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <GraduationCap className="w-5 h-5 text-blue-400" />
          <span>Informasi Pengembang &amp; Dukungan Penggunaan</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Aplikasi ini dirancang dan dikembangkan oleh <strong>Susilo Fitri Yatmoko, M.Pd</strong> untuk mendukung optimalisasi kerja para pendidik sekolah dasar di seluruh Indonesia. Segala hak cipta dan pengembangan media didedikasikan untuk komunitas guru.
        </p>
        <div className="pt-2">
          <a
            href="https://www.gurumerangkum.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
          >
            <span>Kunjungi www.gurumerangkum.com</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* Modal Contoh Hasil Tiap Kolom */}
      <ColumnExamplesModal
        isOpen={isExamplesModalOpen}
        onClose={() => setIsExamplesModalOpen(false)}
        context={modalContext}
        onApplyPreset={(preset) => {
          setIsExamplesModalOpen(false);
          onStartLKPD();
        }}
      />
    </div>
  );
};
