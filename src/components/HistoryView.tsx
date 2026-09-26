import React, { useState } from 'react';
import {
  History,
  FileText,
  CheckSquare,
  Download,
  Trash2,
  ExternalLink,
  Copy,
  Search,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { SavedDocument } from '../types';
import { exportLKPDDocx, exportRubricDocx, exportBothDocx } from '../utils/docxExport';

interface HistoryViewProps {
  documents: SavedDocument[];
  onOpenDocument: (doc: SavedDocument) => void;
  onDuplicateDocument: (doc: SavedDocument) => void;
  onDeleteDocument: (id: string) => void;
  onCreateNewLKPD: () => void;
  onCreateNewRubric?: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  documents,
  onOpenDocument,
  onDuplicateDocument,
  onDeleteDocument,
  onCreateNewLKPD,
  onCreateNewRubric,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'lkpd' | 'rubric'>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const filteredDocs = documents.filter((doc) => {
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    const matchesSearch =
      (doc.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.topic || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.grade || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleDownload = async (doc: SavedDocument) => {
    setDownloadingId(doc.id);
    try {
      const lkpd = doc.lkpdContent || doc.lkpdData?.content;
      const rubric = doc.rubricContent || doc.rubricData?.content;

      if (doc.type === 'lkpd' && lkpd) {
        await exportLKPDDocx(lkpd);
      } else if (doc.type === 'rubric' && rubric) {
        await exportRubricDocx(rubric);
      } else if (doc.type === 'both') {
        if (lkpd && rubric) {
          await exportBothDocx(lkpd, rubric);
        } else if (lkpd) {
          await exportLKPDDocx(lkpd);
        } else if (rubric) {
          await exportRubricDocx(rubric);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Gagal mengunduh dokumen.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              Riwayat Dokumen Tersimpan
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Kelola, edit kembali, atau unduh dokumen LKPD dan rubrik penilaian secara mandiri
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onCreateNewLKPD}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs"
          >
            <FileText className="w-4 h-4" />
            <span>Buat LKPD</span>
          </button>
          {onCreateNewRubric && (
            <button
              onClick={onCreateNewRubric}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Buat Rubrik</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari topik, mapel, atau kelas..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Semua Dokumen' },
            { id: 'lkpd', label: 'Dokumen LKPD' },
            { id: 'rubric', label: 'Dokumen Rubrik' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTypeFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                typeFilter === tab.id
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Document List */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto">
            <History className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Belum Ada Dokumen Tersimpan
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
              Dokumen yang Anda buat dan klik tombol "Simpan" akan otomatis dicatat di sini untuk diakses kapan saja.
            </p>
          </div>
          <button
            onClick={onCreateNewLKPD}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Mulai Buat Dokumen Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                      doc.type === 'lkpd'
                        ? 'bg-blue-100 text-blue-800'
                        : doc.type === 'rubric'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {doc.type === 'lkpd'
                      ? 'Dokumen LKPD'
                      : doc.type === 'rubric'
                      ? 'Dokumen Rubrik'
                      : 'Dokumen Tersimpan'}
                  </span>

                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {doc.date || doc.createdAt || 'Baru'}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1">
                    {doc.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {doc.subject} &bull; {doc.grade} {doc.phase ? `(${doc.phase})` : ''}
                  </p>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-700 font-medium line-clamp-2">
                  Topik: {doc.topic}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenDocument(doc)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Buka</span>
                  </button>

                  <button
                    onClick={() => onDuplicateDocument(doc)}
                    className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-xs transition-colors"
                    title="Duplikat"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteDocument(doc.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 text-xs transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => handleDownload(doc)}
                  disabled={downloadingId === doc.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors disabled:opacity-60"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadingId === doc.id ? 'Mengunduh...' : 'Word'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
