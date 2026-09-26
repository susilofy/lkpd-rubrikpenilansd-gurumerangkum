import React from 'react';
import {
  FileText,
  CheckSquare,
  Sparkles,
  Download,
  BookOpen,
  ArrowRight,
  ExternalLink,
  GraduationCap,
  Layers,
  Award,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { SAMPLE_LESSONS, SampleLesson } from '../data/curriculumData';

interface HomeViewProps {
  onStartLKPD: () => void;
  onStartRubric: () => void;
  onSelectSample?: (sample: SampleLesson) => void;
  onOpenGuide: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onStartLKPD,
  onStartRubric,
  onSelectSample,
  onOpenGuide,
}) => {
  return (
    <div className="space-y-12 pb-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16 shadow-xl border border-blue-700/50">
        {/* Background Subtle Patterns */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs sm:text-sm font-semibold tracking-wide">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Kurikulum Merdeka &bull; Asesmen Autentik Deep Learning</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-heading leading-tight">
            Generator LKPD &amp; Rubrik Penilaian SD
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto font-normal leading-relaxed">
            Solusi praktis untuk guru SD kelas 1–6 dalam membuat LKPD dan rubrik penilaian berbantuan AI dengan ekspor file Word (.docx) yang dapat diedit langsung.
          </p>

          {/* 3 Keunggulan */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-2">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white border border-white/10">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Semua Kelas 1–6</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white border border-white/10">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Semua Mata Pelajaran</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white border border-white/10">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Download Word (.docx)</span>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onStartLKPD}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-base shadow-lg hover:shadow-amber-400/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <FileText className="w-5 h-5 text-slate-900" />
              <span>Mulai Membuat LKPD</span>
              <ArrowRight className="w-4 h-4 text-slate-900" />
            </button>
            <button
              onClick={onStartRubric}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/15 hover:bg-white/20 text-white font-semibold text-base border border-white/20 backdrop-blur-sm transition-all"
            >
              <CheckSquare className="w-5 h-5 text-blue-200" />
              <span>Buat Rubrik Penilaian</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2 Menu Utama Berbentuk Kartu */}
      <section className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            Pilih Layanan Utama
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Dua instrumen pembelajaran dan penilaian mandiri untuk guru SD
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Kartu A: BUAT LKPD */}
          <div
            onClick={onStartLKPD}
            className="group cursor-pointer bg-white rounded-2xl p-8 border border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all duration-200 relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform" />
            <div className="relative z-10 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Menu A (Terpisah)</span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1 font-heading group-hover:text-blue-600 transition-colors">
                  GENERATOR LKPD
                </h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Rancang Lembar Kerja Peserta Didik interaktif dengan ragam jenis aktivitas:
                pilihan ganda, isian, menjodohkan, stimulus konkret untuk kelas rendah (1–3),
                hingga analisis masalah kontekstual &amp; soal HOTS untuk kelas tinggi (4–6).
              </p>
              <div className="space-y-2 pt-2 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Struktur lengkap: Tujuan, Petunjuk, Aktivitas, Pertanyaan &amp; Refleksi</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Bisa diubah &amp; ditambah langsung di web sebelum diunduh</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm font-bold text-blue-600 group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
                Mulai Buat LKPD Sekarang <ChevronRight className="w-4 h-4" />
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg">
                Format Word (.docx)
              </span>
            </div>
          </div>

          {/* Kartu B: BUAT RUBRIK PENILAIAN */}
          <div
            onClick={onStartRubric}
            className="group cursor-pointer bg-white rounded-2xl p-8 border border-slate-200 hover:border-indigo-500 hover:shadow-xl transition-all duration-200 relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform" />
            <div className="relative z-10 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:bg-indigo-700 transition-colors">
                <CheckSquare className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Menu B (Terpisah)</span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1 font-heading group-hover:text-indigo-600 transition-colors">
                  GENERATOR RUBRIK
                </h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Susun instrumen asesmen autentik secara mandiri dengan matriks kriteria penilaian (Skor 4, 3, 2, 1).
                Dapat dibuat terpisah untuk berbagai jenis tugas: unjuk kerja, praktik, proyek, presentasi, atau tes tertulis.
              </p>
              <div className="space-y-2 pt-2 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>Kalkulator nilai otomatis: Skor diperoleh &rarr; Nilai 0–100 &amp; Predikat</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>Format siap cetak dan ekspor mandiri ke Microsoft Word (.docx)</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm font-bold text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
                Mulai Buat Rubrik Sekarang <ChevronRight className="w-4 h-4" />
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg">
                Kalkulator Interaktif
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Inspirasi Cepat: Contoh Topik Pembelajaran SD */}
      <section className="max-w-7xl mx-auto bg-slate-100/70 rounded-2xl p-6 sm:p-8 border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-heading">
              Inspirasi Cepat Topik Pembelajaran SD
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Klik salah satu contoh untuk langsung mengisi form LKPD secara instan:
            </p>
          </div>
          <button
            onClick={onOpenGuide}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <BookOpen className="w-4 h-4" />
            <span>Lihat Panduan Lengkap Guru</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {SAMPLE_LESSONS.map((sample, idx) => (
            <div
              key={idx}
              onClick={() => onSelectSample && onSelectSample(sample)}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                    Kelas {sample.grade} ({sample.phase})
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{sample.subject}</span>
                </div>
                <p className="text-sm font-bold text-slate-800 line-clamp-2">{sample.topic}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-semibold">
                <span>Gunakan Contoh Ini &rarr;</span>
                <span className="text-slate-400 font-normal">{sample.timeAllocation}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bagian Informasi Pengembang (User Spec requirement) */}
      <section className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-sm text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span>TENTANG PENGEMBANG</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
            Dedikasi untuk Kemajuan Pendidikan Dasar Indonesia
          </h3>

          <div className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed space-y-2">
            <p>
              Aplikasi <strong>Generator LKPD &amp; Rubrik Penilaian SD</strong> dikembangkan oleh:
            </p>
            <p className="text-xl font-extrabold text-blue-700">
              Susilo Fitri Yatmoko, M.Pd
            </p>
            <p className="text-xs sm:text-sm text-slate-500">
              Pengembang media pembelajaran digital dan praktisi pendidikan yang berkomitmen menghadirkan teknologi praktis, terstruktur, dan tepat guna bagi rekan-rekan guru di seluruh penjuru Indonesia.
            </p>
          </div>

          <div className="pt-2">
            <a
              href="https://www.gurumerangkum.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors shadow-xs"
            >
              <span>Website Resmi: https://www.gurumerangkum.com/</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
