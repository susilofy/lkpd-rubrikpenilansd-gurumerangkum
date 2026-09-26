export interface LKPDFormData {
  schoolName: string;
  teacherName: string;
  grade: string; // '1' | '2' | '3' | '4' | '5' | '6'
  phase: string; // 'Fase A' | 'Fase B' | 'Fase C'
  subject: string;
  semester: string; // '1' | '2'
  topic: string;
  timeAllocation: string;
  cp: string; // Capaian Pembelajaran
  tp: string; // Tujuan Pembelajaran
  indicators: string; // Indikator ketercapaian
  model: string; // Model/metode
  characterProfiles: string[]; // Profil Pelajar Pancasila
  learningSources: string;
  toolsAndMaterials: string;
  activityTypes: string[]; // Multi-select
  activityCount: number;
  activityCountsByType?: Record<string, number>; // Jumlah soal per jenis aktivitas (maksimal 30)
  difficulty: 'Mudah' | 'Sedang' | 'Sulit' | 'Campuran';
  characterLkpd: 'Individu' | 'Kelompok' | 'Individu dan kelompok';
  includeAnswerKey?: boolean;
}

export interface LKPDTaskItem {
  id: string;
  number: number;
  type: string; // 'Pilihan Ganda', 'Isian', 'Menjodohkan', 'Eksperimen', 'HOTS', dll.
  prompt: string;
  instruction?: string;
  choices?: string[]; // for multiple choice
  matchingPairs?: { left: string; right: string }[]; // for matching
  expectedLines?: number; // for writing room in docx / print
  notes?: string;
  answerKey?: string; // Kunci jawaban & pembahasan butir aktivitas ini
  scoringRubric?: string; // Pedoman penskoran butir ini
}

export interface LKPDQuestionItem {
  id: string;
  number: number;
  question: string;
  hotLevel?: 'LOTS' | 'MOTS' | 'HOTS';
  hint?: string;
  answerKey?: string; // Kunci jawaban / uraian yang diharapkan
}

export interface LKPDTeacherGuide {
  expectedConclusion?: string;
  scoringSummary?: string;
  scoringFormula?: string;
  notesForTeacher?: string;
}

export interface LKPDContent {
  id: string;
  title: string;
  schoolName: string;
  teacherName?: string;
  grade: string;
  phase: string;
  subject: string;
  semester: string;
  topic: string;
  timeAllocation: string;
  characterLkpd: string;
  learningObjectives: string[];
  instructions: string[];
  toolsAndMaterials: string[];
  learningSteps: {
    step: number;
    title: string;
    description: string;
  }[];
  tasks: LKPDTaskItem[];
  questions: LKPDQuestionItem[];
  conclusionPrompt: string;
  studentReflection: {
    learnedPrompt: string;
    likedPrompt: string;
    unclearPrompt: string;
  };
  teacherGuide?: LKPDTeacherGuide;
  includeAnswerKey?: boolean;
}

export interface RubricScaleDescriptor {
  score: number;
  label: string;
}

export interface RubricCriterion {
  id: string;
  no: number;
  name: string;
  criteria?: string;
  description?: string;
  descriptors: Record<number, string>;
  score4?: string;
  score3?: string;
  score2?: string;
  score1?: string;
}

export interface RubricFormData {
  schoolName?: string;
  teacherName?: string;
  grade: string;
  phase: string;
  subject: string;
  semester?: string;
  topic: string;
  learningObjectives?: string;
  learningObjective?: string;
  taskType: string;
  criteriaCount: number;
  scaleType?: '1-4' | '1-5' | '1-10' | 'custom';
  scale?: string;
}

export interface RecapStudentItem {
  id: number;
  no: number;
  abs?: string;
  name: string;
  scores: { [criterionIndex: number]: number | '' };
}

export interface RubricContent {
  id: string;
  title: string;
  schoolName: string;
  teacherName?: string;
  subject: string;
  grade: string;
  phase: string;
  semester?: string;
  topic: string;
  taskType: string;
  scale?: string;
  learningObjective: string;
  maxScore: number;
  scaleLabels: RubricScaleDescriptor[];
  criteria: RubricCriterion[];
  scoringFormula: string;
  predicateCategories: {
    minScorePct: number;
    maxScorePct: number;
    predicate: string;
    label: string;
  }[];
  recapStudents?: RecapStudentItem[];
}

export interface SavedDocument {
  id: string;
  title: string;
  type: 'lkpd' | 'rubric' | 'both';
  createdAt?: string;
  updatedAt?: string;
  date?: string;
  grade: string;
  phase?: string;
  subject: string;
  topic: string;
  schoolName?: string;
  teacherName?: string;
  lkpdContent?: LKPDContent;
  lkpdFormData?: LKPDFormData;
  rubricContent?: RubricContent;
  rubricFormData?: RubricFormData;
  lkpdData?: {
    form: LKPDFormData;
    content: LKPDContent;
  };
  rubricData?: {
    form: RubricFormData;
    content: RubricContent;
  };
}
