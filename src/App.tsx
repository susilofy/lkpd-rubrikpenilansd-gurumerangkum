/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { LKPDGenerator } from './components/LKPDGenerator';
import { LKPDPreview } from './components/LKPDPreview';
import { RubricGenerator } from './components/RubricGenerator';
import { RubricPreview } from './components/RubricPreview';
import { HistoryView } from './components/HistoryView';
import { GuideView } from './components/GuideView';
import { RegenerateModal } from './components/RegenerateModal';
import { LKPDContent, LKPDFormData, RubricContent, RubricFormData, SavedDocument } from './types';
import { SampleLesson } from './data/curriculumData';

const LOCAL_STORAGE_KEY = 'generator_lkpd_saved_docs_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'lkpd' | 'rubric' | 'history' | 'guide'>('home');

  // LKPD State
  const [lkpdViewMode, setLkpdViewMode] = useState<'form' | 'preview'>('form');
  const [currentLKPD, setCurrentLKPD] = useState<LKPDContent | null>(null);
  const [lkpdFormData, setLkpdFormData] = useState<LKPDFormData | null>(null);

  // Rubric State
  const [rubricViewMode, setRubricViewMode] = useState<'form' | 'preview'>('form');
  const [currentRubric, setCurrentRubric] = useState<RubricContent | null>(null);
  const [rubricFormData, setRubricFormData] = useState<RubricFormData | null>(null);

  // Modal State
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);

  // Saved Documents
  const [savedDocs, setSavedDocs] = useState<SavedDocument[]>([]);

  // Load saved documents from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setSavedDocs(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load saved docs', e);
    }
  }, []);

  // Save docs helper
  const persistDocs = (docs: SavedDocument[]) => {
    setSavedDocs(docs);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(docs));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  };

  // Handlers for Home interactions
  const handleStartLKPD = () => {
    setActiveTab('lkpd');
    setLkpdViewMode('form');
  };

  const handleStartRubric = () => {
    setActiveTab('rubric');
    setRubricViewMode('form');
  };

  const handleSelectSample = (sample: SampleLesson) => {
    setLkpdFormData({
      schoolName: 'SD Negeri Merdeka 01',
      teacherName: 'Guru Kelas',
      grade: sample.grade,
      phase: sample.phase,
      subject: sample.subject,
      semester: '1',
      topic: sample.topic,
      timeAllocation: sample.timeAllocation,
      cp: '',
      tp: '',
      indicators: '',
      model: 'Problem Based Learning (PBL)',
      characterProfiles: ['Bernalar Kritis', 'Gotong Royong', 'Mandiri'],
      learningSources: 'Buku Siswa Kemdikbudristek, Lingkungan Sekitar',
      toolsAndMaterials: 'Alat tulis, LKPD, media konkrit/kartu',
      activityTypes: sample.activities,
      activityCount: Math.min(30, sample.activities.length * 2),
      activityCountsByType: sample.activities.reduce((acc, act) => {
        acc[act] = 2;
        return acc;
      }, {} as Record<string, number>),
      difficulty: 'Campuran',
      characterLkpd: 'Individu dan kelompok',
    });
    setActiveTab('lkpd');
    setLkpdViewMode('form');
  };

  // LKPD Generation Success
  const handleLKPDGenerated = (content: LKPDContent, formData: LKPDFormData) => {
    setCurrentLKPD(content);
    setLkpdFormData(formData);
    setLkpdViewMode('preview');
  };

  // Save LKPD Document
  const handleSaveLKPD = () => {
    if (!currentLKPD || !lkpdFormData) return;
    const newDoc: SavedDocument = {
      id: `doc-lkpd-${Date.now()}`,
      title: currentLKPD.title || 'Lembar Kerja Peserta Didik',
      type: 'lkpd',
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      grade: currentLKPD.grade,
      phase: currentLKPD.phase,
      subject: currentLKPD.subject,
      topic: currentLKPD.topic,
      lkpdContent: currentLKPD,
      lkpdFormData: lkpdFormData,
    };
    persistDocs([newDoc, ...savedDocs]);
  };

  // Duplicate LKPD
  const handleDuplicateLKPD = () => {
    if (!lkpdFormData) return;
    setLkpdFormData({
      ...lkpdFormData,
      topic: `${lkpdFormData.topic} (Salinan)`,
    });
    setLkpdViewMode('form');
  };

  // Rubric Generation Success
  const handleRubricGenerated = (content: RubricContent, formData: RubricFormData) => {
    setCurrentRubric(content);
    setRubricFormData(formData);
    setRubricViewMode('preview');
  };

  // Save Rubric Document
  const handleSaveRubric = () => {
    if (!currentRubric || !rubricFormData) return;
    const newDoc: SavedDocument = {
      id: `doc-rubric-${Date.now()}`,
      title: currentRubric.title || 'Rubrik Penilaian Asesmen',
      type: 'rubric',
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      grade: currentRubric.grade,
      phase: currentRubric.phase,
      subject: currentRubric.subject,
      topic: currentRubric.topic,
      rubricContent: currentRubric,
      rubricFormData: rubricFormData,
    };
    persistDocs([newDoc, ...savedDocs]);
  };

  // Duplicate Rubric
  const handleDuplicateRubric = () => {
    if (!rubricFormData) return;
    setRubricFormData({
      ...rubricFormData,
      topic: `${rubricFormData.topic} (Salinan)`,
    });
    setRubricViewMode('form');
  };

  // Open from History
  const handleOpenFromHistory = (doc: SavedDocument) => {
    if (doc.type === 'lkpd') {
      if (doc.lkpdContent) setCurrentLKPD(doc.lkpdContent);
      if (doc.lkpdFormData) setLkpdFormData(doc.lkpdFormData);
      setActiveTab('lkpd');
      setLkpdViewMode('preview');
    } else if (doc.type === 'rubric') {
      if (doc.rubricContent) setCurrentRubric(doc.rubricContent);
      if (doc.rubricFormData) setRubricFormData(doc.rubricFormData);
      setActiveTab('rubric');
      setRubricViewMode('preview');
    } else if (doc.type === 'both') {
      // Legacy document fallback
      if (doc.lkpdContent) {
        setCurrentLKPD(doc.lkpdContent);
        if (doc.lkpdFormData) setLkpdFormData(doc.lkpdFormData);
        setActiveTab('lkpd');
        setLkpdViewMode('preview');
      } else if (doc.rubricContent) {
        setCurrentRubric(doc.rubricContent);
        if (doc.rubricFormData) setRubricFormData(doc.rubricFormData);
        setActiveTab('rubric');
        setRubricViewMode('preview');
      }
    }
  };

  // Duplicate from History
  const handleDuplicateFromHistory = (doc: SavedDocument) => {
    if (doc.type === 'lkpd') {
      if (doc.lkpdFormData) {
        setLkpdFormData({
          ...doc.lkpdFormData,
          topic: `${doc.lkpdFormData.topic} (Salinan)`,
        });
        setActiveTab('lkpd');
        setLkpdViewMode('form');
      }
    } else if (doc.type === 'rubric') {
      if (doc.rubricFormData) {
        setRubricFormData({
          ...doc.rubricFormData,
          topic: `${doc.rubricFormData.topic} (Salinan)`,
        });
        setActiveTab('rubric');
        setRubricViewMode('form');
      }
    } else if (doc.type === 'both') {
      if (doc.lkpdFormData) {
        setLkpdFormData({
          ...doc.lkpdFormData,
          topic: `${doc.lkpdFormData.topic} (Salinan)`,
        });
        setActiveTab('lkpd');
        setLkpdViewMode('form');
      }
    }
  };

  // Delete from History
  const handleDeleteFromHistory = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus dokumen ini dari riwayat?')) {
      const updated = savedDocs.filter((d) => d.id !== id);
      persistDocs(updated);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-200 selection:text-blue-900">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab as any)}
        savedCount={savedDocs.length}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'home' && (
          <HomeView
            onStartLKPD={handleStartLKPD}
            onStartRubric={handleStartRubric}
            onSelectSample={handleSelectSample}
            onOpenGuide={() => setActiveTab('guide')}
          />
        )}

        {activeTab === 'lkpd' && (
          <>
            {lkpdViewMode === 'form' ? (
              <LKPDGenerator
                initialData={lkpdFormData || undefined}
                onGenerateSuccess={handleLKPDGenerated}
                onOpenGuide={() => setActiveTab('guide')}
              />
            ) : currentLKPD && lkpdFormData ? (
              <LKPDPreview
                content={currentLKPD}
                formData={lkpdFormData}
                onUpdateContent={setCurrentLKPD}
                onSaveDocument={handleSaveLKPD}
                onDuplicate={handleDuplicateLKPD}
                onOpenRegenerateModal={() => setIsRegenerateModalOpen(true)}
                onBackToForm={() => setLkpdViewMode('form')}
              />
            ) : (
              <LKPDGenerator
                onGenerateSuccess={handleLKPDGenerated}
                onOpenGuide={() => setActiveTab('guide')}
              />
            )}
          </>
        )}

        {activeTab === 'rubric' && (
          <>
            {rubricViewMode === 'form' ? (
              <RubricGenerator
                initialData={rubricFormData || undefined}
                onGenerateSuccess={handleRubricGenerated}
              />
            ) : currentRubric && rubricFormData ? (
              <RubricPreview
                rubric={currentRubric}
                formData={rubricFormData}
                onUpdateRubric={setCurrentRubric}
                onSaveDocument={handleSaveRubric}
                onDuplicate={handleDuplicateRubric}
                onBackToForm={() => setRubricViewMode('form')}
              />
            ) : (
              <RubricGenerator
                onGenerateSuccess={handleRubricGenerated}
              />
            )}
          </>
        )}

        {activeTab === 'history' && (
          <HistoryView
            documents={savedDocs}
            onOpenDocument={handleOpenFromHistory}
            onDuplicateDocument={handleDuplicateFromHistory}
            onDeleteDocument={handleDeleteFromHistory}
            onCreateNewLKPD={handleStartLKPD}
            onCreateNewRubric={handleStartRubric}
          />
        )}

        {activeTab === 'guide' && (
          <GuideView
            onStartLKPD={handleStartLKPD}
            onStartRubric={handleStartRubric}
          />
        )}
      </main>

      {/* Regenerate Modal */}
      {isRegenerateModalOpen && currentLKPD && lkpdFormData && (
        <RegenerateModal
          isOpen={isRegenerateModalOpen}
          onClose={() => setIsRegenerateModalOpen(false)}
          currentLKPD={currentLKPD}
          formData={lkpdFormData}
          onRegenerateComplete={(updated) => {
            setCurrentLKPD(updated);
          }}
        />
      )}

      {/* Footer with Developer Credits */}
      <Footer />
    </div>
  );
}
