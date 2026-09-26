import React from 'react';
import { ExternalLink, Heart, Sparkles, BookCheck, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: App Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-heading font-bold text-white text-base">
                GENERATOR LKPD &amp; RUBRIK PENILAIAN GURU SD
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Platform modern pendukung guru Sekolah Dasar di seluruh Indonesia untuk menyusun
              Lembar Kerja Peserta Didik (LKPD) dan Rubrik Asesmen Kurikulum Merdeka secara otomatis,
              mendalam (deep learning), dan siap diunduh dalam format Microsoft Word (.docx).
            </p>
          </div>

          {/* Col 2: Fitur Utama */}
          <div className="md:pl-6">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Fitur Unggulan
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <BookCheck className="w-4 h-4 text-blue-400" />
                <span>Mendukung Kelas 1 hingga Kelas 6 (Fase A, B, C)</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Semua Mata Pelajaran Kurikulum Merdeka</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Generate Rubrik Otomatis dari LKPD</span>
              </li>
              <li className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-blue-400" />
                <span>Ekspor File Word (.docx) Rapi &amp; Dapat Diedit</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Identitas Pengembang */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Tentang Pengembang
            </h4>
            <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60">
              <p className="text-xs text-slate-400 mb-1 font-medium">Aplikasi ini dikembangkan oleh:</p>
              <p className="text-base font-bold text-white mb-2">
                Susilo Fitri Yatmoko, M.Pd
              </p>
              <p className="text-xs text-slate-400 mb-3">
                Praktisi Pendidikan &amp; Penggagas Edukasi Digital Guru Indonesia.
              </p>
              <a
                href="https://www.gurumerangkum.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
              >
                <span>Kunjungi Website: www.gurumerangkum.com</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Elegant Bottom Footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span className="font-semibold text-slate-200">
              &copy; 2026 Susilo Fitri Yatmoko, M.Pd
            </span>
            <span className="hidden sm:inline">&bull;</span>
            <a
              href="https://www.gurumerangkum.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-medium underline underline-offset-4 transition-colors"
            >
              www.gurumerangkum.com
            </a>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span>Didedikasikan untuk kemajuan Guru Sekolah Dasar Indonesia</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 inline ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
