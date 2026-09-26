export const SD_SUBJECTS = [
  'Pendidikan Pancasila',
  'Bahasa Indonesia',
  'Matematika',
  'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
  'Pendidikan Agama dan Budi Pekerti',
  'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
  'Seni Rupa',
  'Seni Musik',
  'Seni Tari',
  'Seni Teater',
  'Bahasa Inggris',
  'Muatan Lokal (Bahasa Daerah)',
  'Teknologi Informasi dan Komunikasi (TIK)',
];

export const ACTIVITY_TYPES_LIST = [
  'Pilihan ganda',
  'Isian',
  'Menjodohkan',
  'Benar/Salah',
  'Uraian',
  'Mengamati',
  'Mengelompokkan',
  'Mencocokkan',
  'Eksperimen',
  'Praktik',
  'Diskusi kelompok',
  'Proyek',
  'Pemecahan masalah',
  'Literasi',
  'Numerasi',
  'HOTS',
  'Aktivitas kreatif',
];

export const PANCASILA_PROFILES = [
  'Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia',
  'Berkebinekaan Global',
  'Gotong Royong',
  'Mandiri',
  'Bernalar Kritis',
  'Kreatif',
];

export const LEARNING_MODELS = [
  'Problem Based Learning (PBL)',
  'Project Based Learning (PjBL)',
  'Discovery Learning',
  'Inquiry Learning',
  'Cooperative Learning',
  'Contextual Teaching and Learning (CTL)',
  'Diferensiasi Pembelajaran',
  'Eksplorasi Kontekstual',
];

export const TASK_TYPES_RUBRIC = [
  'LKPD',
  'Praktik',
  'Proyek',
  'Presentasi',
  'Diskusi',
  'Produk',
  'Unjuk kerja',
  'Portofolio',
  'Karya Seni',
  'Lainnya',
];

export interface SampleLesson {
  grade: string;
  phase: string;
  subject: string;
  topic: string;
  timeAllocation: string;
  activities: string[];
}

export const SAMPLE_LESSONS: SampleLesson[] = [
  {
    grade: '1',
    phase: 'Fase A',
    subject: 'Bahasa Indonesia',
    topic: 'Mengenal Huruf Vokal dan Suku Kata "Ba, Bi, Bu, Be, Bo"',
    timeAllocation: '2 x 35 Menit',
    activities: ['Mengamati', 'Mencocokkan', 'Isian', 'Aktivitas kreatif'],
  },
  {
    grade: '2',
    phase: 'Fase A',
    subject: 'Matematika',
    topic: 'Penjumlahan dan Pengurangan Bilangan Cacah sampai 50',
    timeAllocation: '2 x 35 Menit',
    activities: ['Numerasi', 'Pilihan ganda', 'Isian', 'Menjodohkan'],
  },
  {
    grade: '3',
    phase: 'Fase B',
    subject: 'IPAS',
    topic: 'Wujud Benda dan Perubahannya di Sekitar Kita',
    timeAllocation: '2 x 35 Menit',
    activities: ['Eksperimen', 'Mengamati', 'Diskusi kelompok', 'HOTS'],
  },
  {
    grade: '4',
    phase: 'Fase B',
    subject: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    topic: 'Bagian Tubuh Tumbuhan dan Fungsinya',
    timeAllocation: '2 x 35 Menit',
    activities: ['Mengamati', 'Mengelompokkan', 'Literasi', 'HOTS', 'Uraian'],
  },
  {
    grade: '5',
    phase: 'Fase C',
    subject: 'Pendidikan Pancasila',
    topic: 'Norma dan Aturan dalam Kehidupan Bermasyarakat',
    timeAllocation: '2 x 35 Menit',
    activities: ['Diskusi kelompok', 'Pemecahan masalah', 'HOTS', 'Uraian'],
  },
  {
    grade: '6',
    phase: 'Fase C',
    subject: 'Matematika',
    topic: 'Operasi Hitung Pecahan Biasa dan Campuran',
    timeAllocation: '2 x 35 Menit',
    activities: ['Numerasi', 'Pemecahan masalah', 'Pilihan ganda', 'HOTS'],
  },
];
