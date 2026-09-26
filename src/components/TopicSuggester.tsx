import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RefreshCw,
  Check,
  ChevronDown,
  ChevronUp,
  Search,
  BookOpen,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { TopicSuggestion, getCuratedTopicSuggestions } from '../data/curriculumTopics';

interface TopicSuggesterProps {
  grade: string;
  subject: string;
  semester?: string;
  phase?: string;
  currentTopic: string;
  onSelectTopic: (topic: string) => void;
  themeColor?: 'blue' | 'indigo';
}

export const TopicSuggester: React.FC<TopicSuggesterProps> = ({
  grade,
  subject,
  semester = '1',
  phase,
  currentTopic,
  onSelectTopic,
  themeColor = 'blue',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [topics, setTopics] = useState<TopicSuggestion[]>(() =>
    getCuratedTopicSuggestions(grade, subject, semester)
  );
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [aiSource, setAiSource] = useState<'ai' | 'curriculum'>('curriculum');
  const [selectedJustNow, setSelectedJustNow] = useState<string | null>(null);

  // When grade, subject, or semester changes, update the topic list
  useEffect(() => {
    const updated = getCuratedTopicSuggestions(grade, subject, semester);
    setTopics(updated);
    setAiSource('curriculum');
  }, [grade, subject, semester]);

  // Request fresh AI generation of topics from Gemini
  const handleGenerateWithAi = async () => {
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/suggest-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: grade || '4',
          phase: phase || '',
          subject: subject || 'Matematika',
          semester: semester || '1',
        }),
      });
      const data = await res.json();
      if (Array.isArray(data.topics) && data.topics.length >= 8) {
        setTopics(data.topics);
        setAiSource('ai');
      } else if (Array.isArray(data.topics) && data.topics.length > 0) {
        // Guarantee minimal 8
        const fallback = getCuratedTopicSuggestions(grade, subject, semester);
        const merged = [...data.topics];
        for (const item of fallback) {
          if (!merged.some((m) => m.title.toLowerCase() === item.title.toLowerCase())) {
            merged.push(item);
          }
          if (merged.length >= 8) break;
        }
        setTopics(merged);
        setAiSource('ai');
      }
    } catch (err) {
      console.error('Error fetching AI topics:', err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleSelect = (topicTitle: string) => {
    onSelectTopic(topicTitle);
    setSelectedJustNow(topicTitle);
    setTimeout(() => {
      setSelectedJustNow(null);
    }, 2500);
  };

  // Color mappings based on themeColor
  const styles = {
    blue: {
      btnMain: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100/90',
      badge: 'bg-blue-600 text-white',
      panelBg: 'bg-blue-50/40 border-blue-200',
      cardActive: 'border-blue-500 bg-blue-50/80 ring-2 ring-blue-200',
      cardHover: 'hover:border-blue-300 hover:bg-blue-50/30',
      tagBg: 'bg-blue-100/70 text-blue-800',
      accentText: 'text-blue-600',
      focusRing: 'focus:border-blue-500 focus:ring-blue-200',
      aiBtn: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white',
      chipBtn: 'bg-white border-blue-200 text-blue-900 hover:bg-blue-50 hover:border-blue-300',
      chipActive: 'bg-blue-600 text-white border-blue-600 shadow-sm',
    },
    indigo: {
      btnMain: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100/90',
      badge: 'bg-indigo-600 text-white',
      panelBg: 'bg-indigo-50/40 border-indigo-200',
      cardActive: 'border-indigo-500 bg-indigo-50/80 ring-2 ring-indigo-200',
      cardHover: 'hover:border-indigo-300 hover:bg-indigo-50/30',
      tagBg: 'bg-indigo-100/70 text-indigo-800',
      accentText: 'text-indigo-600',
      focusRing: 'focus:border-indigo-500 focus:ring-indigo-200',
      aiBtn: 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white',
      chipBtn: 'bg-white border-indigo-200 text-indigo-900 hover:bg-indigo-50 hover:border-indigo-300',
      chipActive: 'bg-indigo-600 text-white border-indigo-600 shadow-sm',
    },
  }[themeColor];

  // Filtered topics based on search input
  const filteredTopics = topics.filter(
    (t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-2 space-y-2">
      {/* Quick Action Bar / Toggle Button */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all shadow-2xs ${styles.btnMain}`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>Rekomendasi Topik AI</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${styles.badge}`}>
            {topics.length} Pilihan
          </span>
          {isOpen ? (
            <ChevronUp className="w-3.5 h-3.5 opacity-70 ml-0.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 opacity-70 ml-0.5" />
          )}
        </button>

        <span className="text-[11px] text-slate-500 italic hidden sm:inline">
          {aiSource === 'ai' ? '✨ Hasil generate AI live' : '📚 Kurikulum Merdeka SD'} • Minimal 8 pilihan topik
        </span>
      </div>

      {/* Quick Chips preview (shows first 4-8 quick pills if panel is collapsed or even when open) */}
      {!isOpen && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[11px] font-medium text-slate-500 mr-1 flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-slate-400" />
            Pilihan Cepat:
          </span>
          {topics.slice(0, 4).map((top, idx) => {
            const isSelected = currentTopic.trim() === top.title.trim();
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(top.title)}
                title={top.description}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all text-left truncate max-w-[260px] sm:max-w-[320px] ${
                  isSelected ? styles.chipActive : styles.chipBtn
                }`}
              >
                {isSelected && '✓ '}
                {top.title}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className={`text-[11px] font-semibold underline underline-offset-2 px-1.5 py-1 transition-colors ${styles.accentText}`}
          >
            +{topics.length - 4} Pilihan Lainnya...
          </button>
        </div>
      )}

      {/* Full Interactive Suggestion Panel */}
      {isOpen && (
        <div className={`p-4 rounded-2xl border ${styles.panelBg} space-y-3.5 animate-fadeIn shadow-sm`}>
          {/* Header & Generate Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-200/80">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h4 className="text-sm font-bold text-slate-900">
                  Pilihan Topik Pembelajaran Kurikulum Merdeka
                </h4>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${styles.badge}`}>
                  {topics.length} Pilihan Tersedia
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Rekomendasi topik untuk <strong>Kelas {grade || '4'}</strong> • <strong>{subject || 'Mata Pelajaran'}</strong> (Semester {semester || '1'})
              </p>
            </div>

            {/* Actions: AI Generate & Close */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleGenerateWithAi}
                disabled={isLoadingAi}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-50 ${styles.aiBtn}`}
                title="Minta Gemini AI merumuskan 8-10 ide topik pembelajaran baru"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAi ? 'animate-spin' : ''}`} />
                <span>{isLoadingAi ? 'AI Merumuskan 8 Topik...' : '✨ Generate 8 Topik Baru (AI)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 font-medium transition-all"
              >
                Tutup
              </button>
            </div>
          </div>

          {/* Search bar inside panel */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Cari dari ${topics.length} pilihan topik/materi...`}
              className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white placeholder:text-slate-400 outline-hidden transition-all ${styles.focusRing}`}
            />
          </div>

          {/* Feedback message when user selected */}
          {selectedJustNow && (
            <div className="flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Topik berhasil dipilih: "{selectedJustNow}". Siap diproses!</span>
            </div>
          )}

          {/* Grid of Minimal 8 Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            {filteredTopics.map((item, idx) => {
              const isSelected = currentTopic.trim() === item.title.trim();
              return (
                <div
                  key={idx}
                  onClick={() => handleSelect(item.title)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between text-left relative bg-white ${
                    isSelected ? styles.cardActive : `border-slate-200 ${styles.cardHover}`
                  }`}
                >
                  <div>
                    {/* Top Row: Number & Category Badge */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold truncate ${styles.tagBg}`}>
                        {item.category}
                      </span>
                    </div>

                    {/* Topic Title */}
                    <h5 className="text-xs font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h5>

                    {/* Short Description */}
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Bottom Row: Choose Button / Selected Indicator */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-medium">
                      Kurikulum Merdeka
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(item.title);
                      }}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : `${styles.btnMain}`
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Dipilih</span>
                        </>
                      ) : (
                        <>
                          <span>Pilih Topik</span>
                          <ArrowRight className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
            <span>
              💡 Klik kartu atau tombol <strong>Pilih Topik</strong> untuk langsung mengisi kolom topik.
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="font-medium hover:underline text-slate-600"
            >
              Sembunyikan Panel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
