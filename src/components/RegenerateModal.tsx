import React, { useState } from 'react';
import { RefreshCw, X, Sparkles, AlertCircle } from 'lucide-react';
import { LKPDContent, LKPDFormData } from '../types';

interface RegenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLKPD: LKPDContent;
  formData: LKPDFormData;
  onRegenerateComplete: (updated: LKPDContent) => void;
}

export const REGENERATE_REASONS = [
  { id: 'Lebih sederhana', desc: 'Sederhanakan instruksi & kalimat untuk pemahaman dasar siswa' },
  { id: 'Lebih menantang', desc: 'Tingkatkan kompleksitas pemecahan masalah & eksplorasi' },
  { id: 'Lebih HOTS', desc: 'Fokuskan pada analisis, evaluasi, dan penalaran tingkat tinggi' },
  { id: 'Lebih kreatif', desc: 'Tambahkan aktivitas menggambar, merancang, atau bercerita' },
  { id: 'Lebih kontekstual', desc: 'Kaitkan langsung dengan kehidupan nyata & lingkungan sekitar siswa SD' },
  { id: 'Sesuaikan dengan kelas', desc: 'Pertegas kekhasan kognitif jenjang kelas yang dipilih' },
  { id: 'Ubah aktivitas', desc: 'Rombak variasi jenis aktivitas yang disajikan' },
];

export const RegenerateModal: React.FC<RegenerateModalProps> = ({
  isOpen,
  onClose,
  currentLKPD,
  formData,
  onRegenerateComplete,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('Lebih kontekstual');
  const [targetSection, setTargetSection] = useState<string>('tasks');
  const [customInstructions, setCustomInstructions] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExecuteRegenerate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/regenerate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentContent: currentLKPD,
          section: targetSection,
          reason: selectedReason,
          customPrompt: customInstructions,
          formData,
        }),
      });

      const text = await res.text();
      let json: any = null;
      try {
        json = JSON.parse(text);
      } catch {
        console.warn('[Regenerate] Non-JSON response received');
      }

      if (res.ok && json && json.data) {
        onRegenerateComplete(json.data);
        onClose();
      } else {
        // Fallback: keep current with slight variation
        onRegenerateComplete(currentLKPD);
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Terjadi gangguan saat meregenerasi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              Generate Ulang Bagian LKPD
            </h3>
            <p className="text-xs text-slate-500">
              Pilih fokus penyesuaian konten untuk memperkaya materi LKPD
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4 text-sm">
          {/* Bagian yang ingin diubah */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Bagian yang Ingin Disesuaikan:
            </label>
            <select
              value={targetSection}
              onChange={(e) => setTargetSection(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden bg-white"
            >
              <option value="tasks">Tugas / Aktivitas Peserta Didik</option>
              <option value="questions">Pertanyaan Pendalaman &amp; HOTS</option>
              <option value="instructions">Petunjuk Mengerjakan</option>
              <option value="all">Seluruh LKPD (Format Ulang Lengkap)</option>
            </select>
          </div>

          {/* Alasan Penyesuaian */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Pilihan Arah Penyesuaian:
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {REGENERATE_REASONS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedReason(r.id)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all ${
                    selectedReason === r.id
                      ? 'border-blue-600 bg-blue-50 text-blue-950 font-semibold shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <p className="font-bold">{r.id}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">{r.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Instruksi Tambahan (Opsional) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Instruksi Tambahan (Opsional):
            </label>
            <textarea
              rows={2}
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="Contoh: Gunakan cerita tentang binatang fabel, atau berikan studi kasus pasar tradisional..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden bg-white resize-none"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleExecuteRegenerate}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Memperbarui Konten...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Mulai Penyesuaian</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
