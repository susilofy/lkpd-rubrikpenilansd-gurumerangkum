import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { getCuratedTopicSuggestions } from './src/data/curriculumTopics';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy get Google GenAI client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Helper to clean JSON string from markdown code fence
function cleanJsonString(str: string): string {
  let cleaned = str.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}

// Robust caller for Gemini with retry logic, backoff, and model fallback
async function callGeminiWithRetry(
  prompt: string,
  config?: { responseMimeType?: string; temperature?: number }
): Promise<string> {
  const ai = getAI();
  if (!ai) {
    throw new Error('GEMINI_API_KEY_NOT_CONFIGURED');
  }

  // Priority list of Gemini models
  const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const model of candidateModels) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: config?.responseMimeType || 'application/json',
            temperature: config?.temperature ?? 0.7,
          },
        });

        if (response.text) {
          return response.text;
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = String(err?.message || err);
        const isTransient =
          err?.status === 503 ||
          err?.code === 503 ||
          errMsg.includes('503') ||
          errMsg.includes('high demand') ||
          errMsg.includes('UNAVAILABLE') ||
          err?.status === 429 ||
          err?.code === 429 ||
          errMsg.includes('429');

        if (isTransient) {
          console.warn(`[Gemini API] ${model} (percobaan ${attempt + 1}) lonjakan antrean. Menunggu sebelum mencoba kembali...`);
          await new Promise((resolve) => setTimeout(resolve, (attempt + 1) * 750));
          continue;
        } else {
          console.warn(`[Gemini API] Model ${model} mengembalikan: ${errMsg}`);
          break; // Try next model
        }
      }
    }
  }

  throw lastError || new Error('Semua model Gemini sedang dalam antrean tinggi.');
}

// Fallback high-quality CP, TP, and KKTP generator for Kurikulum Merdeka
function generateFallbackCpTp(grade: string, subject: string, topic: string, customPhase?: string) {
  const gradeNum = parseInt(grade, 10) || 4;
  const phase = customPhase || (gradeNum <= 2 ? 'Fase A' : gradeNum <= 4 ? 'Fase B' : 'Fase C');
  const subLower = (subject || '').toLowerCase();
  const isEarly = gradeNum <= 3;

  let cp = '';
  if (subLower.includes('matematika')) {
    cp = `Peserta didik pada ${phase} (Kelas ${grade}) menunjukkan pemahaman konsep matematika serta penalaran logis mengenai materi "${topic}", mampu menyelesaikan masalah matematis dan kontekstual menggunakan prosedur yang terstruktur, serta bernalar kritis dalam memverifikasi hasil perhitungan.`;
  } else if (subLower.includes('ipas') || subLower.includes('alam') || subLower.includes('sosial')) {
    cp = `Peserta didik pada ${phase} (Kelas ${grade}) mampu mengamati fenomena alam dan sosial di sekitarnya, memahami hubungan sebab-akibat terkait materi "${topic}", serta melakukan penyelidikan ilmiah sederhana untuk menarik kesimpulan yang bermanfaat bagi lingkungan sekitarnya.`;
  } else if (subLower.includes('pancasila')) {
    cp = `Peserta didik pada ${phase} (Kelas ${grade}) memahami nilai-nilai Pancasila, aturan, norma, serta hak dan kewajiban terkait materi "${topic}", serta menunjukkan perilaku bertanggung jawab, toleran, dan berpartisipasi aktif dalam kehidupan bersama di sekolah dan masyarakat.`;
  } else if (subLower.includes('indonesia')) {
    cp = `Peserta didik pada ${phase} (Kelas ${grade}) memiliki kemampuan berbahasa yang santun untuk berkomunikasi dan bernalar, memahami ide pokok teks bacaan mengenai "${topic}", serta mampu menyajikan gagasan tertulis secara runtut dan kreatif.`;
  } else {
    cp = `Peserta didik pada ${phase} (Kelas ${grade}) mampu menguasai kompetensi esensial materi "${topic}" pada mata pelajaran ${subject}, mengidentifikasi karakteristik dan unsur penting, serta menganalisis penerapannya dalam kehidupan sehari-hari secara kritis, mandiri, dan bergotong royong sesuai Profil Pelajar Pancasila.`;
  }

  let tp = '';
  if (isEarly) {
    tp = `1. Melalui pengamatan gambar dan bimbingan guru, peserta didik dapat menyebutkan 3 hal penting tentang "${topic}" dengan benar.\n2. Melalui aktivitas lembar kerja terpandu, peserta didik dapat menunjukkan contoh nyata "${topic}" dalam kehidupan sehari-hari.\n3. Melalui tanya jawab sederhana, peserta didik mampu menceritakan kembali pemahamannya tentang "${topic}" dengan percaya diri.`;
  } else {
    tp = `1. Melalui kegiatan telaah materi dan studi stimulus, peserta didik mampu menjelaskan konsep dasar dan karakteristik utama "${topic}" dengan tepat.\n2. Melalui diskusi kelompok dan pemecahan masalah kontekstual, peserta didik mampu menganalisis permasalahan terkait "${topic}" dan merumuskan solusinya secara logis.\n3. Peserta didik mampu menyajikan laporan hasil penyelidikan terkait "${topic}" secara sistematis dan komunikatif di depan kelas.`;
  }

  let indicators = '';
  if (isEarly) {
    indicators = `1. Mengidentifikasi minimal 3 bagian/unsur utama materi "${topic}" dengan benar.\n2. Menyelesaikan lembar aktivitas pengerjaan LKPD dengan rapi, tertib, dan tepat waktu.\n3. Menunjukkan keaktifan dan sikap gotong royong saat belajar bersama teman sekelas.`;
  } else {
    indicators = `1. Mengidentifikasi dan menjelaskan prinsip operasional materi "${topic}" dengan akurasi minimal 80%.\n2. Menyelesaikan soal penalaran atau studi kasus pemecahan masalah materi "${topic}" dengan langkah sistematis.\n3. Mengomunikasikan kesimpulan belajar dan menunjukkan profil bernalar kritis serta gotong royong.`;
  }

  return { cp, tp, indicators };
}

// Fallback high-quality LKPD generator for Kurikulum Merdeka
function generateFallbackLKPD(formData: any) {
  const grade = formData.grade || '4';
  const gradeNum = parseInt(grade, 10) || 4;
  const isEarlyGrade = gradeNum <= 3;
  const subject = formData.subject || 'Ilmu Pengetahuan Alam dan Sosial (IPAS)';
  const topic = formData.topic || 'Siklus Hidup Makhluk Hidup';
  const schoolName = formData.schoolName || 'SD Negeri Merdeka';
  const phase = formData.phase || (gradeNum <= 2 ? 'Fase A' : gradeNum <= 4 ? 'Fase B' : 'Fase C');
  const characterLkpd = formData.characterLkpd || 'Individu dan kelompok';

  const objectives = formData.tp
    ? [formData.tp, `Mengidentifikasi komponen utama pada materi ${topic}.`, `Menyajikan hasil eksplorasi secara mandiri dan percaya diri.`]
    : [
        `Peserta didik mampu memahami konsep dasar ${topic} melalui pengamatan langsung.`,
        `Peserta didik mampu melakukan aktivitas penyelidikan dan diskusi terkait ${topic}.`,
        `Peserta didik dapat menyimpulkan manfaat dan penerapan ${topic} dalam kehidupan sehari-hari.`,
      ];

  const instructions = isEarlyGrade
    ? [
        'Tuliskan nama lengkap dan kelasmu pada kolom yang tersedia.',
        'Dengarkan petunjuk dan penjelasan dari Bapak/Ibu Guru dengan seksama.',
        'Kerjakan aktivitas bergambar dengan teliti dan penuh semangat.',
        'Tanyakan kepada gurumu jika ada petunjuk yang belum kamu mengerti.',
      ]
    : [
        'Berdoalah sebelum memulai mengerjakan Lembar Kerja Peserta Didik (LKPD).',
        'Bacalah setiap instruksi dan studi kasus dengan cermat dan seksama.',
        'Lakukan kegiatan penyelidikan bersama kelompokmu secara gotong royong.',
        'Jawablah pertanyaan analisis dengan bahasa yang runtut dan jelas.',
        'Periksa kembali kelengkapan jawabanmu sebelum diserahkan kepada guru.',
      ];

  const tools = formData.toolsAndMaterials
    ? formData.toolsAndMaterials.split(',').map((s: string) => s.trim())
    : ['Buku Siswa dan Alat Tulis', 'Lembar Kerja Peserta Didik (LKPD)', 'Bahan ajar kontekstual / kartu gambar', 'Pewarna / spidol'];

  const learningSteps = [
    {
      step: 1,
      title: 'Apersepsi dan Pengamatan Awal (Stimulus)',
      description: isEarlyGrade
        ? `Guru memperlihatkan gambar atau benda nyata yang berhubungan dengan ${topic}. Peserta didik menyimak dan menyebutkan apa yang dilihat.`
        : `Peserta didik mengamati masalah nyata atau studi fenomena terkait ${topic} yang disajikan oleh guru secara kritis.`,
    },
    {
      step: 2,
      title: 'Penyelidikan dan Eksplorasi Materi',
      description: isEarlyGrade
        ? `Peserta didik mencoba mencocokkan, mewarnai, atau mengelompokkan benda/gambar sesuai instruksi kegiatan.`
        : `Peserta didik mengumpulkan informasi, berdiskusi dalam kelompok, dan melakukan analisis mendalam tentang faktor-faktor penting pada ${topic}.`,
    },
    {
      step: 3,
      title: 'Verifikasi dan Presentasi Hasil',
      description: `Peserta didik memaparkan hasil temuannya di depan kelas atau saling bertukar lembar kerja dengan bimbingan guru.`,
    },
  ];

  const selectedActivityTypes = formData.activityTypes && formData.activityTypes.length > 0
    ? formData.activityTypes
    : ['Isian', 'Pilihan ganda', 'Mengamati', 'HOTS'];

  const tasks: any[] = [];
  let taskCounter = 1;

  if (selectedActivityTypes.includes('Mengamati') || isEarlyGrade) {
    tasks.push({
      id: `task-${taskCounter}`,
      number: taskCounter++,
      type: 'Mengamati',
      prompt: `Amatilah gambar dan lingkungan sekitar yang berkaitan dengan ${topic}!`,
      instruction: 'Catat atau gambarkan 2 hal menarik yang kamu temukan dari pengamatanmu!',
      expectedLines: 3,
      answerKey: `Peserta didik menuliskan minimal 2 fakta/objek hasil pengamatan yang relevan mengenai ${topic}. Contoh: Mengidentifikasi bagian penting atau gejala nyata yang tampak pada lingkungan sekitar.`,
      scoringRubric: 'Skor 10 jika mencatat 2 hal relevan dan jelas; Skor 5 jika hanya 1 hal; Skor 0 jika tidak relevan/kosong.',
    });
  }

  if (selectedActivityTypes.includes('Pilihan ganda')) {
    tasks.push({
      id: `task-${taskCounter}`,
      number: taskCounter++,
      type: 'Pilihan Ganda',
      prompt: `Pilihlah salah satu jawaban yang paling tepat mengenai ${topic}!`,
      instruction: 'Berilah tanda silang (X) pada huruf A, B, atau C!',
      choices: [
        `A. Merupakan bagian penting dari konsep dasar ${topic}.`,
        `B. Tidak memiliki kaitan sama sekali dengan pembelajaran hari ini.`,
        `C. Hanya dapat ditemukan pada situasi tertentu saja.`,
      ],
      expectedLines: 1,
      answerKey: `Kunci: A. Merupakan bagian penting dari konsep dasar ${topic}.\nPembahasan: Pilihan A merupakan pernyataan ilmiah dan konsep dasar yang benar mengenai ${topic}.`,
      scoringRubric: 'Skor 10 jika menjawab A dengan benar; Skor 0 jika menjawab pilihan lain.',
    });
  }

  if (selectedActivityTypes.includes('Menjodohkan') || selectedActivityTypes.includes('Mencocokkan')) {
    tasks.push({
      id: `task-${taskCounter}`,
      number: taskCounter++,
      type: 'Menjodohkan',
      prompt: `Tariklah garis lurus untuk menghubungkan pernyataan di sebelah kiri dengan pasangan yang tepat di sebelah kanan!`,
      instruction: 'Hubungkan dengan rapi!',
      matchingPairs: [
        { left: `Konsep A (${topic})`, right: 'Pernyataan pendukung 1' },
        { left: `Ciri Utama (${topic})`, right: 'Karakteristik yang teramati' },
        { left: `Manfaat Nyata`, right: 'Penerapan sehari-hari' },
      ],
      expectedLines: 1,
      answerKey: `Kunci Pasangan:\n1. Konsep A (${topic}) -> Pernyataan pendukung 1\n2. Ciri Utama (${topic}) -> Karakteristik yang teramati\n3. Manfaat Nyata -> Penerapan sehari-hari`,
      scoringRubric: 'Tiap pasangan yang dihubungkan dengan benar bernilai 5 poin (Skor maksimal: 15 poin).',
    });
  }

  if (selectedActivityTypes.includes('Isian') || selectedActivityTypes.includes('Numerasi') || selectedActivityTypes.includes('Literasi')) {
    tasks.push({
      id: `task-${taskCounter}`,
      number: taskCounter++,
      type: isEarlyGrade ? 'Isian Singkat' : 'Literasi dan Analisis',
      prompt: `Lengkapilah kalimat rumpang berikut ini dengan istilah yang tepat terkait ${topic}!`,
      instruction: 'Tuliskan jawabanmu dengan tulisan yang rapi!',
      expectedLines: 3,
      answerKey: `Kata/istilah kunci yang tepat dan spesifik terkait konsep ${topic}.`,
      scoringRubric: 'Skor 10 jika istilah tepat dan ejaan benar; Skor 5 jika makna mendekati; Skor 0 jika salah.',
    });
  }

  if (selectedActivityTypes.includes('HOTS') || selectedActivityTypes.includes('Pemecahan masalah') || !isEarlyGrade) {
    tasks.push({
      id: `task-${taskCounter}`,
      number: taskCounter++,
      type: 'Pemecahan Masalah (HOTS)',
      prompt: `Bayangkan jika terjadi perubahan kondisi pada ${topic} di lingkungan sekitar sekolahmu. Apa solusi kreatif yang dapat kamu dan teman-temanmu usulkan?`,
      instruction: 'Uraikan alasan dan langkah-langkah solusimu secara jelas!',
      expectedLines: 4,
      answerKey: `Analisis memuat: (1) Identifikasi persoalan pada ${topic}, (2) Gagasan solusi orisinal yang logis, dan (3) Langkah nyata yang dapat dilakukan oleh siswa di lingkungan sekolah.`,
      scoringRubric: 'Skor 15: Gagasan solusi kreatif, logis, dan terperinci. Skor 10: Solusi logis namun sederhana. Skor 5: Solusi kurang operasional.',
    });
  }

  const questions = [
    {
      id: 'q-1',
      number: 1,
      question: isEarlyGrade
        ? `Apa hal baru yang kamu ketahui tentang ${topic}?`
        : `Jelaskan keterkaitan antara konsep ${topic} dengan kehidupan sehari-hari di sekitarmu!`,
      hotLevel: 'MOTS' as const,
      answerKey: `Peserta didik mampu menyebutkan konsep penting ${topic} dan mengaitkannya dengan fenomena nyata yang mereka alami di rumah atau lingkungan sekolah.`,
    },
    {
      id: 'q-2',
      number: 2,
      question: isEarlyGrade
        ? `Mengapa kita perlu mempelajari ${topic}?`
        : `Menurut analisis kelompokmu, tantangan apa yang paling sering muncul terkait ${topic} dan bagaimana cara mengatasinya?`,
      hotLevel: 'HOTS' as const,
      answerKey: `Peserta didik mampu menganalisis penyebab tantangan pada ${topic} serta menawarkan alternatif tindakan preventif/solutif yang aplikatif.`,
    },
  ];

  return {
    id: `lkpd-${Date.now()}`,
    title: `LEMBAR KERJA PESERTA DIDIK - ${topic.toUpperCase()}`,
    schoolName,
    grade: `Kelas ${grade}`,
    phase,
    subject,
    semester: formData.semester || '1',
    topic,
    timeAllocation: formData.timeAllocation || '2 x 35 Menit',
    characterLkpd,
    learningObjectives: objectives,
    instructions,
    toolsAndMaterials: tools,
    learningSteps,
    tasks,
    questions,
    conclusionPrompt: `Berdasarkan serangkaian aktivitas dan penyelidikan tentang "${topic}" yang telah kamu selesaikan, tuliskan kesimpulan inti pembelajaranmu:`,
    studentReflection: {
      learnedPrompt: `Hal terpenting yang saya pelajari tentang ${topic} hari ini:`,
      likedPrompt: 'Aktivitas yang paling menyenangkan dan saya sukai saat belajar:',
      unclearPrompt: 'Bagian materi yang masih ingin saya tanyakan atau pelajari lebih dalam:',
    },
    teacherGuide: {
      expectedConclusion: `Peserta didik menyimpulkan bahwa ${topic} memiliki manfaat penting dalam mata pelajaran ${subject} dan prinsip dasarnya dapat diterapkan dalam aktivitas sehari-hari.`,
      scoringSummary: 'Total Skor Maksimal: 100 poin (Aktivitas Tugas: 70 poin, Pertanyaan Pendalaman: 20 poin, Kesimpulan & Refleksi: 10 poin).',
      scoringFormula: 'Nilai Akhir = (Total Skor Perolehan / Total Skor Maksimal) x 100',
      notesForTeacher: 'Kunci jawaban ini berfungsi sebagai panduan acuan bagi guru. Jawaban siswa yang menunjukkan nalar kritis dan bahasa sendiri tetap diberikan apresiasi skor optimal.',
    },
  };
}

// Fallback high-quality Rubric generator
function generateFallbackRubric(formData: any, lkpdContext?: any) {
  const grade = formData.grade || lkpdContext?.grade || 'Kelas 4';
  const subject = formData.subject || lkpdContext?.subject || 'IPAS';
  const topic = formData.topic || lkpdContext?.topic || 'Siklus Hidup Makhluk Hidup';
  const phase = formData.phase || lkpdContext?.phase || 'Fase B';
  const taskType = formData.taskType || 'LKPD dan Aktivitas Eksplorasi';
  const schoolName = formData.schoolName || lkpdContext?.schoolName || 'SD Negeri Merdeka';
  const learningObjective = formData.learningObjective || lkpdContext?.learningObjectives?.[0] || `Memahami dan menerapkan konsep ${topic}`;

  const scaleLabels = [
    { score: 4, label: 'Sangat Baik (SB)' },
    { score: 3, label: 'Baik (B)' },
    { score: 2, label: 'Cukup (C)' },
    { score: 1, label: 'Perlu Bimbingan (PB)' },
  ];

  // Specific criteria adjusted to topic and task
  const criteriaList = [
    {
      id: 'crit-1',
      no: 1,
      name: 'Pemahaman Konsep Materi',
      description: `Penguasaan konsep esensial terkait ${topic}`,
      descriptors: {
        4: `Sangat memahami seluruh konsep materi ${topic} secara mendalam, tepat, dan mampu memberikan contoh nyata.`,
        3: `Memahami sebagian besar konsep materi ${topic} dengan tepat, meski masih ada sedikit kesalahan minor.`,
        2: `Cukup memahami sebagian kecil konsep materi ${topic}, namun masih memerlukan bantuan penjelasan guru.`,
        1: `Belum memahami konsep dasar ${topic} dan memerlukan bimbingan intensif dari guru.`,
      },
    },
    {
      id: 'crit-2',
      no: 2,
      name: 'Ketepatan Jawaban dan Analisis',
      description: 'Akurasi penyelesaian tugas, soal, dan aktivitas penyelidikan',
      descriptors: {
        4: 'Semua instruksi, soal, dan tugas LKPD diselesaikan dengan sangat tepat, runtut, dan lengkap.',
        3: 'Sebagian besar tugas diselesaikan dengan tepat (70% - 85% akurat) dengan langkah terstruktur.',
        2: 'Tugas diselesaikan dengan ketepatan cukup (50% - 69% akurat), beberapa jawaban belum lengkap.',
        1: 'Ketepatan jawaban kurang dari 50% dan banyak tugas yang belum terselesaikan.',
      },
    },
    {
      id: 'crit-3',
      no: 3,
      name: 'Keterampilan Proses & Kerja Ilmiah / Praktik',
      description: 'Kecakapan dalam mengamati, mengelompokkan, dan memecahkan masalah',
      descriptors: {
        4: 'Menunjukkan keterampilan eksplorasi yang sangat aktif, mandiri, teliti, dan sistematis.',
        3: 'Menunjukkan keterampilan proses yang baik dan terarah dengan sedikit arahan guru.',
        2: 'Keterampilan proses cukup, namun masih sering ragu dalam melaksanakan langkah kegiatan.',
        1: 'Kurang aktif dalam proses kegiatan dan selalu bergantung pada petunjuk langkah demi langkah.',
      },
    },
    {
      id: 'crit-4',
      no: 4,
      name: 'Kerapian, Kolaborasi, dan Komunikasi',
      description: 'Sikap tanggung jawab, kerja sama, dan penyajian hasil refleksi',
      descriptors: {
        4: 'Lembar kerja sangat rapi, komunikasi runtut, serta aktif berkolaborasi dan menyampaikan refleksi bermakna.',
        3: 'Lembar kerja rapi, mampu bekerja sama dengan baik dan menyampaikan refleksi dengan cukup jelas.',
        2: 'Lembar kerja cukup rapi, interaksi kerja sama masih pasif dan refleksi sangat singkat.',
        1: 'Lembar kerja kurang terawat, tidak mau berkolaborasi, dan belum mengisi bagian refleksi.',
      },
    },
  ];

  return {
    id: `rubric-${Date.now()}`,
    title: `RUBRIK PENILAIAN - ${topic.toUpperCase()}`,
    schoolName,
    subject,
    grade,
    phase,
    topic,
    taskType,
    learningObjective,
    maxScore: criteriaList.length * 4,
    scaleLabels,
    criteria: criteriaList,
    scoringFormula: 'Nilai Akhir = (Total Skor yang Diperoleh / Skor Maksimal) × 100',
    predicateCategories: [
      { minScorePct: 86, maxScorePct: 100, predicate: 'Sangat Baik (A)', label: 'Menunjukkan penguasaan sangat tinggi pada kriteria pembelajaran.' },
      { minScorePct: 71, maxScorePct: 85, predicate: 'Baik (B)', label: 'Menunjukkan penguasaan yang baik dan memenuhi kriteria ketuntasan.' },
      { minScorePct: 56, maxScorePct: 70, predicate: 'Cukup (C)', label: 'Menunjukkan penguasaan cukup, perlu penguatan pada beberapa indikator.' },
      { minScorePct: 0, maxScorePct: 55, predicate: 'Perlu Bimbingan (D)', label: 'Belum mencapai ketuntasan minimum, memerlukan pendampingan remediasi.' },
    ],
  };
}

// POST /api/generate-lkpd
app.post('/api/generate-lkpd', async (req, res) => {
  try {
    const formData = req.body;
    if (!formData || !formData.grade || !formData.subject || !formData.topic) {
      return res.status(400).json({
        error: 'Silakan lengkapi data pembelajaran terlebih dahulu (Kelas, Mata Pelajaran, dan Topik wajib diisi).',
      });
    }

    const grade = formData.grade;
    const isEarly = ['1', '2', '3'].includes(grade);

    const prompt = `Anda adalah konsultan ahli Kurikulum Merdeka dan guru Sekolah Dasar berprestasi.
Buatkan LEMBAR KERJA PESERTA DIDIK (LKPD) yang lengkap, profesional, kontekstual, dan siap pakai untuk siswa SD dengan rincian berikut:

IDENTITAS PEMBELAJARAN:
- Nama Sekolah: ${formData.schoolName || 'SD Negeri'}
- Nama Guru: ${formData.teacherName || 'Guru Kelas'}
- Kelas: Kelas ${grade} (${formData.phase || 'Fase SD'})
- Mata Pelajaran: ${formData.subject}
- Semester: ${formData.semester || '1'}
- Topik / Materi: ${formData.topic}
- Alokasi Waktu: ${formData.timeAllocation || '2 x 35 Menit'}
- Karakter LKPD: ${formData.characterLkpd || 'Individu dan kelompok'}
- Capaian Pembelajaran (CP): ${formData.cp || 'Sesuai BSKAP Kurikulum Merdeka'}
- Tujuan Pembelajaran (TP): ${formData.tp || 'Dirumuskan mendalam'}
- Indikator Ketercapaian: ${formData.indicators || 'Kriteria ketercapaian tujuan pembelajaran'}
- Model Pembelajaran: ${formData.model || 'Problem Based Learning / Discovery'}
- Profil Pelajar Pancasila: ${(formData.characterProfiles || []).join(', ') || 'Bernalar Kritis, Mandiri, Gotong Royong'}
- Sumber Belajar: ${formData.learningSources || 'Buku Siswa Kemdikbud'}
- Alat dan Bahan: ${formData.toolsAndMaterials || 'Alat tulis dan media konkrit'}

AKTIVITAS & TINGKAT KESULITAN:
- Jenis Aktivitas yang dipilih: ${(formData.activityTypes || []).join(', ') || 'Isian, Pilihan Ganda, Mengamati, HOTS'}
- Total Jumlah Soal/Aktivitas: ${formData.activityCount || 4} butir (Maksimal 30 butir)
${formData.activityCountsByType && Object.keys(formData.activityCountsByType).length > 0 ? `- Rincian Target Jumlah Soal per Pilihan Aktivitas:\n${Object.entries(formData.activityCountsByType)
  .filter(([type]) => (formData.activityTypes || []).includes(type))
  .map(([type, count]) => `  * ${type}: ${count} butir soal/tugas`)
  .join('\n')}` : ''}
- Tingkat Kesulitan: ${formData.difficulty || 'Campuran'}

ATURAN KEPATUHAN ISIAN PENGGUNA (MUTLAK & WAJIB DIPATUHI):
1. Topik & Materi: Seluruh butir soal, stimulus bacaan/kasus, instruksi pengerjaan, dan pertanyaan WAJIB 100% membahas topik "${formData.topic}" pada mata pelajaran "${formData.subject}". DILARANG KERAS mengganti atau memasukkan materi di luar topik ini!
2. Keselarasan CP & TP: Rujuk secara konsisten Capaian Pembelajaran ("${formData.cp || 'Standar Fase'}") dan Tujuan Pembelajaran ("${formData.tp || 'Standar TP'}") yang telah diisi pengguna.
3. Model Pembelajaran: Susunan langkah (learningSteps) WAJIB mengimplementasikan sintaks model "${formData.model || 'Problem Based Learning (PBL)'}".
4. Alat, Bahan & Sumber: Terapkan alat dan bahan ("${formData.toolsAndMaterials || 'Alat tulis'}") serta sumber belajar ("${formData.learningSources || 'Buku Siswa'}").
5. Karakter Pancasila: Refleksikan dimensi Profil Pelajar Pancasila: "${(formData.characterProfiles || []).join(', ')}".
6. Target Jumlah Soal: Buatlah butir soal/tugas pada array "tasks" dengan jumlah yang sesuai dengan rincian per aktivitas di atas (total ${formData.activityCount || 4} butir soal/aktivitas, maksimal 30). Beri nomor urut berkesinambungan 1, 2, 3 sampai selesai.
7. KUNCI JAWABAN & PEDOMAN PENSKORAN (WAJIB DILENGKAPI LENGKAP):
   - Setiap butir tugas pada "tasks" WAJIB menyertakan "answerKey" (kunci jawaban pasti beserta penjelasan rinci mengapa jawaban itu benar) dan "scoringRubric" (pedoman skor dan kriteria penilaian butir tersebut).
   - Setiap butir pada "questions" WAJIB menyertakan "answerKey" (jawaban lengkap dan kata kunci konsep yang diharapkan dari siswa).
   - Objek "teacherGuide" WAJIB disediakan yang berisi "expectedConclusion" (contoh kesimpulan ideal), "scoringSummary" (penjelasan sistem bobot skor 0-100), "scoringFormula", dan "notesForTeacher" (catatan penilaian formatif guru).

PANDUAN PENTING SESUAI TINGKAT PERKEMBANGAN ANAK:
${
  isEarly
    ? `- Karena untuk KELAS ${grade} (Fase A/B awal), gunakan BAHASA INDONESIA YANG SEDERHANA, kalimat instruksi pendek dan jelas.
- Aktivitas harus lebih konkret, visual, menyenangkan (misal: mengamati, mencocokkan/menjodohkan gambar, melingkari, melengkapi kata/isian singkat).
- Jangan membuat teks yang terlalu panjang atau istilah yang abstrak.`
    : `- Karena untuk KELAS ${grade} (Fase B/C), gunakan pertanyaan yang lebih analitis, pemecahan masalah kontekstual, studi kasus nyata anak, stimulus literasi atau numerasi, serta soal penalaran tingkat tinggi (HOTS).`
}

STRUKTUR OUTPUT:
Keluarkan HANYA JSON murni (valid RFC 8259, tanpa markdown text pembuka) dengan skema berikut:
{
  "id": "lkpd-${Date.now()}",
  "title": "LEMBAR KERJA PESERTA DIDIK (LKPD)",
  "schoolName": "${formData.schoolName || 'SD NEGERI'}",
  "grade": "Kelas ${grade}",
  "phase": "${formData.phase || 'Fase SD'}",
  "subject": "${formData.subject}",
  "semester": "${formData.semester || '1'}",
  "topic": "${formData.topic}",
  "timeAllocation": "${formData.timeAllocation || '2 x 35 Menit'}",
  "characterLkpd": "${formData.characterLkpd || 'Individu dan kelompok'}",
  "learningObjectives": ["Tujuan Pembelajaran 1", "Tujuan Pembelajaran 2"],
  "instructions": ["Petunjuk 1", "Petunjuk 2", "Petunjuk 3"],
  "toolsAndMaterials": ["Alat/bahan 1", "Alat/bahan 2"],
  "learningSteps": [
    { "step": 1, "title": "Apersepsi / Stimulus", "description": "Langkah konkret..." },
    { "step": 2, "title": "Eksplorasi & Diskusi", "description": "Langkah konkret..." },
    { "step": 3, "title": "Verifikasi & Presentasi", "description": "Langkah konkret..." }
  ],
  "tasks": [
    {
      "id": "task-1",
      "number": 1,
      "type": "Jenis aktivitas (misal Pilihan Ganda / Isian / Menjodohkan / Praktik / HOTS)",
      "prompt": "Pertanyaan atau instruksi tugas yang jelas",
      "instruction": "Keterangan pengerjaan",
      "choices": ["A. ...", "B. ...", "C. ..."],
      "matchingPairs": [ { "left": "...", "right": "..." } ],
      "expectedLines": 2,
      "answerKey": "Kunci jawaban pasti dan pembahasan lengkap butir tugas ini...",
      "scoringRubric": "Pedoman penskoran butir ini (misal: Skor 10 jika tepat, 5 jika sebagian, 0 jika salah)"
    }
  ],
  "questions": [
    {
      "id": "q-1",
      "number": 1,
      "question": "Pertanyaan pemahaman atau reflektif",
      "hotLevel": "MOTS",
      "answerKey": "Kunci jawaban atau ekspektasi jawaban yang diharapkan..."
    }
  ],
  "conclusionPrompt": "Berdasarkan kegiatan di atas, tuliskan kesimpulanmu:",
  "studentReflection": {
    "learnedPrompt": "Hal yang saya pelajari hari ini:",
    "likedPrompt": "Hal yang paling saya sukai:",
    "unclearPrompt": "Hal yang masih belum saya pahami:"
  },
  "teacherGuide": {
    "expectedConclusion": "Rumusan kesimpulan ideal yang diharapkan disimpulkan oleh siswa terkait topik...",
    "scoringSummary": "Total Skor Maksimal: 100 poin...",
    "scoringFormula": "Nilai Akhir = (Total Skor Perolehan / Skor Maksimal) x 100",
    "notesForTeacher": "Petunjuk asesmen formatif bagi guru dalam mengamati dan memeriksa LKPD..."
  }
}`;

    try {
      const rawText = await callGeminiWithRetry(prompt, {
        responseMimeType: 'application/json',
        temperature: 0.7,
      });
      const cleaned = cleanJsonString(rawText);
      const parsed = JSON.parse(cleaned);
      return res.json({ data: parsed, source: 'gemini-ai' });
    } catch (aiErr: any) {
      console.warn('[LKPD Generator] AI sedang padat/antrean tinggi. Menggunakan mesin Kurikulum Merdeka:', aiErr?.message || aiErr);
      const fallback = generateFallbackLKPD(formData);
      return res.json({ data: fallback, source: 'curriculum-engine', note: 'Mesin Kurikulum Merdeka' });
    }
  } catch (err: any) {
    console.warn('[LKPD Generator] Error umum, menyediakan template kurikulum:', err?.message || err);
    const fallback = generateFallbackLKPD(req.body || {});
    return res.json({ data: fallback, source: 'curriculum-engine' });
  }
});

// POST /api/generate-rubric
app.post('/api/generate-rubric', async (req, res) => {
  try {
    const formData = req.body?.formData;
    const lkpdContext = req.body?.lkpdContext || req.body?.sourceLKPD;
    if (!formData && !lkpdContext) {
      return res.status(400).json({ error: 'Data form atau konteks LKPD diperlukan.' });
    }

    const grade = formData?.grade || lkpdContext?.grade || 'Kelas 4';
    const subject = formData?.subject || lkpdContext?.subject || 'IPAS';
    const topic = formData?.topic || lkpdContext?.topic || 'Topik Pembelajaran';
    const taskType = formData?.taskType || 'LKPD';
    const criteriaCount = Number(formData?.criteriaCount) || 4;

    let prompt = `Anda adalah ahli asesmen pembelajaran Kurikulum Merdeka untuk Sekolah Dasar.
Buatkan RUBRIK PENILAIAN yang autentik, jelas, dan dapat dioperasionalkan secara obyektif oleh guru SD.

INFORMASI TUGAS:
- Kelas / Fase: ${grade} (${formData?.phase || lkpdContext?.phase || 'Fase SD'})
- Mata Pelajaran: ${subject}
- Materi / Topik: ${topic}
- Tujuan Pembelajaran: ${formData?.learningObjective || lkpdContext?.learningObjectives?.join('; ') || 'Sesuai indikator ketercapaian'}
- Jenis Tugas: ${taskType} (Contoh: LKPD, Praktik, Proyek, Presentasi, Diskusi, Produk, Unjuk Kerja, Portofolio)
- Jumlah Kriteria Penilaian: ${criteriaCount} kriteria
- Skala Penilaian: Skala 1 sampai 4 (4: Sangat Baik, 3: Baik, 2: Cukup, 1: Perlu Bimbingan)`;

    if (lkpdContext) {
      prompt += `\n\nKONTEKS LKPD TERKAIT:\nJudul: ${lkpdContext.title}\nAktivitas: ${JSON.stringify(lkpdContext.tasks?.map((t: any) => ({ type: t.type, prompt: t.prompt })))}\nTujuan: ${JSON.stringify(lkpdContext.learningObjectives)}\nSesuaikan kriteria rubrik agar mengukur performa siswa secara presisi pada aktivitas LKPD tersebut!`;
    }

    prompt += `\n\nPETUNJUK KRITERIA:
- Kriteria dan seluruh deskriptor skor (Skor 4, 3, 2, 1) WAJIB secara eksplisit mengukur materi "${topic}" pada mata pelajaran "${subject}" dan jenis tugas "${taskType}".
- Dilarang keras membuat kriteria generik atau mengambil materi pelajaran lain.
- Setiap deskriptor harus membedakan tingkat kemandirian, kedalaman analisis, dan ketepatan konsep materi "${topic}".

STRUKTUR OUTPUT:
Keluarkan HANYA JSON murni (valid RFC 8259) dengan format:
{
  "id": "rubric-${Date.now()}",
  "title": "RUBRIK PENILAIAN - ${topic.toUpperCase()}",
  "schoolName": "${formData?.schoolName || lkpdContext?.schoolName || 'SD NEGERI'}",
  "subject": "${subject}",
  "grade": "${grade}",
  "phase": "${formData?.phase || lkpdContext?.phase || 'Fase SD'}",
  "topic": "${topic}",
  "taskType": "${taskType}",
  "learningObjective": "${formData?.learningObjective || lkpdContext?.learningObjectives?.[0] || ''}",
  "maxScore": ${criteriaCount * 4},
  "scaleLabels": [
    { "score": 4, "label": "Sangat Baik" },
    { "score": 3, "label": "Baik" },
    { "score": 2, "label": "Cukup" },
    { "score": 1, "label": "Perlu Bimbingan" }
  ],
  "criteria": [
    {
      "id": "crit-1",
      "no": 1,
      "name": "Nama Kriteria Spesifik",
      "description": "Fokus yang dinilai",
      "descriptors": {
        "4": "Deskripsi rinci skor 4...",
        "3": "Deskripsi rinci skor 3...",
        "2": "Deskripsi rinci skor 2...",
        "1": "Deskripsi rinci skor 1..."
      }
    }
  ],
  "scoringFormula": "Nilai Akhir = (Total Skor yang Diperoleh / Skor Maksimal) × 100",
  "predicateCategories": [
    { "minScorePct": 86, "maxScorePct": 100, "predicate": "Sangat Baik (A)", "label": "Tercapai melampaui ekspektasi" },
    { "minScorePct": 71, "maxScorePct": 85, "predicate": "Baik (B)", "label": "Tercapai sesuai ekspektasi" },
    { "minScorePct": 56, "maxScorePct": 70, "predicate": "Cukup (C)", "label": "Sebagian tercapai, butuh pemantapan" },
    { "minScorePct": 0, "maxScorePct": 55, "predicate": "Perlu Bimbingan (D)", "label": "Belum tercapai, butuh pendampingan intensif" }
  ]
}`;

    try {
      const rawText = await callGeminiWithRetry(prompt, {
        responseMimeType: 'application/json',
        temperature: 0.7,
      });
      const cleaned = cleanJsonString(rawText);
      const parsed = JSON.parse(cleaned);
      return res.json({ data: parsed, source: 'gemini-ai' });
    } catch (aiErr: any) {
      console.warn('[Rubric Generator] AI antrean tinggi. Menggunakan mesin Kurikulum Merdeka:', aiErr?.message || aiErr);
      const fallback = generateFallbackRubric(formData || {}, lkpdContext);
      return res.json({ data: fallback, source: 'curriculum-engine', note: 'Mesin Kurikulum Merdeka' });
    }
  } catch (err: any) {
    console.warn('[Rubric Generator] Error umum, menyediakan template kurikulum:', err?.message || err);
    const fallback = generateFallbackRubric(req.body?.formData || {}, req.body?.lkpdContext || req.body?.sourceLKPD);
    return res.json({ data: fallback, source: 'curriculum-engine' });
  }
});

// POST /api/regenerate-section
app.post('/api/regenerate-section', async (req, res) => {
  try {
    const { currentContent, reason, targetType, sectionKey } = req.body;

    const prompt = `Anda adalah ahli Kurikulum Merdeka guru SD.
Pengguna ingin memperbarui bagian "${sectionKey || 'konten'}" pada dokumen ${targetType || 'LKPD'} dengan alasan: "${reason}".

Berikut konten saat ini:
${JSON.stringify(currentContent, null, 2)}

Silakan buat versi revisi yang secara nyata mencerminkan alasan perubahan tersebut (misal: lebih sederhana untuk anak, lebih HOTS, lebih kontekstual, atau variasi aktivitas baru).
Kembalikan HANYA JSON valid dengan struktur data yang sama persis dengan yang dikirimkan.`;

    try {
      const rawText = await callGeminiWithRetry(prompt, {
        responseMimeType: 'application/json',
        temperature: 0.8,
      });
      const cleaned = cleanJsonString(rawText);
      const parsed = JSON.parse(cleaned);
      return res.json({ data: parsed, source: 'gemini-ai' });
    } catch (aiErr: any) {
      console.warn('[Regenerate Section] AI sedang sibuk. Mengembalikan pembaruan berbasis konfigurasi:', aiErr?.message || aiErr);
      return res.json({ data: currentContent, source: 'curriculum-engine' });
    }
  } catch (err: any) {
    console.warn('[Regenerate Section] Error:', err?.message || err);
    return res.json({ data: req.body?.currentContent, error: err?.message });
  }
});

// POST /api/auto-suggest-cp-tp
app.post('/api/auto-suggest-cp-tp', async (req, res) => {
  try {
    const { grade, phase, subject, topic, semester, model, characterProfiles } = req.body;
    if (!grade || !subject || !topic) {
      return res.status(400).json({ error: 'Kelas, mata pelajaran, dan topik diperlukan.' });
    }

    const calculatedPhase = phase || (parseInt(grade, 10) <= 2 ? 'Fase A' : parseInt(grade, 10) <= 4 ? 'Fase B' : 'Fase C');

    const prompt = `Anda adalah pakar kurikulum BSKAP Kemdikbudristek untuk Sekolah Dasar.
TUGAS: Rumuskan Capaian Pembelajaran (CP), Tujuan Pembelajaran (TP), dan Indikator Ketercapaian (KKTP) yang 100% SPESIFIK dan EKSKLUSIF berakar pada topik dan mata pelajaran berikut:

INFORMASI PEMBELAJARAN:
- Jenjang: Sekolah Dasar (SD)
- Kelas: Kelas ${grade} (${calculatedPhase})
- Semester: ${semester || '1'}
- Mata Pelajaran: ${subject}
- Topik / Materi: "${topic}"
- Model Pembelajaran: ${model || 'Problem Based Learning'}
- Profil Pelajar Pancasila: ${Array.isArray(characterProfiles) ? characterProfiles.join(', ') : 'Bernalar Kritis, Gotong Royong'}

INSTRUKSI KETAT KURIKULUM MERDEKA:
1. Capaian Pembelajaran (CP): Rumuskan kalimat CP fase yang secara spesifik mencakup esensi mata pelajaran "${subject}" dan materi "${topic}".
2. Tujuan Pembelajaran (TP): Tulis 2 sampai 3 poin TP berjenjang, menggunakan Kata Kerja Operasional (KKO) Taksonomi Bloom yang realistis untuk anak SD Kelas ${grade}, dan secara eksplisit menyebut materi "${topic}".
3. Indikator (KKTP): Tulis 2 sampai 3 indikator kriteria ketercapaian yang dapat diobservasi secara konkret untuk tugas/asesmen materi "${topic}".
DILARANG menggunakan materi atau contoh generik di luar topik "${topic}".

Keluarkan HANYA JSON dengan struktur:
{
  "cp": "teks capaian pembelajaran lengkap...",
  "tp": "1. ...\\n2. ...\\n3. ...",
  "indicators": "1. ...\\n2. ...\\n3. ..."
}`;

    try {
      const rawText = await callGeminiWithRetry(prompt, {
        responseMimeType: 'application/json',
      });
      const cleaned = cleanJsonString(rawText);
      const parsed = JSON.parse(cleaned);
      return res.json(parsed);
    } catch (aiErr: any) {
      console.warn('[CP/TP Suggester] AI antrean tinggi. Menyajikan rumusan Kurikulum Merdeka:', aiErr?.message || aiErr);
      const fallback = generateFallbackCpTp(grade, subject, topic, calculatedPhase);
      return res.json(fallback);
    }
  } catch (err: any) {
    console.warn('[CP/TP Suggester] Error umum:', err?.message || err);
    const fallback = generateFallbackCpTp(
      req.body?.grade || '4',
      req.body?.subject || 'Mata Pelajaran',
      req.body?.topic || 'Materi',
      req.body?.phase
    );
    return res.json(fallback);
  }
});

// POST /api/suggest-topics
app.post('/api/suggest-topics', async (req, res) => {
  try {
    const { grade, phase, subject, semester } = req.body;
    const targetSubject = subject || 'Matematika';
    const targetGrade = grade || '4';
    const calculatedPhase =
      phase || (parseInt(targetGrade, 10) <= 2 ? 'Fase A' : parseInt(targetGrade, 10) <= 4 ? 'Fase B' : 'Fase C');

    const prompt = `Anda adalah pakar penyusun kurikulum BSKAP Kemendikbudristek untuk Sekolah Dasar (SD) Kurikulum Merdeka.
TUGAS: Hasilkan MINIMAL 8 PILIHAN TOPIK / MATERI PEMBELAJARAN (antara 8 sampai 10 pilihan) yang resmi, mendalam, kontekstual, dan menarik untuk jenjang SD.

INFORMASI PEMBELAJARAN:
- Jenjang: Sekolah Dasar (SD)
- Kelas: Kelas ${targetGrade} (${calculatedPhase})
- Semester: ${semester || '1'}
- Mata Pelajaran: ${targetSubject}

KETENTUAN WAJIB:
1. Hasilkan MINIMAL 8 PILIHAN TOPIK BERBEDA (tidak boleh kurang dari 8 item).
2. Setiap materi pokok harus spesifik, aplikatif untuk lembar kerja siswa (LKPD) dan rubrik penilaian, serta sesuai tingkat kognitif usia anak SD Kelas ${targetGrade}.
3. Variasikan aspek pembelajaran (pemahaman konsep, aktivitas sains/praktik/proyek, pemecahan masalah/HOTS, literasi, numerasi, kontekstual lingkungan).

Keluarkan HANYA format JSON murni:
{
  "topics": [
    {
      "title": "Judul materi pokok yang spesifik dan jelas",
      "category": "Kategori materi (contoh: Pemahaman Konsep / Praktik & Eksperimen / Pemecahan Masalah HOTS / Proyek Kolaboratif / Analisis Data)",
      "description": "Penjelasan singkat 1 kalimat tujuan dan fokus kegiatan belajar siswa"
    }
  ]
}`;

    try {
      const rawText = await callGeminiWithRetry(prompt, {
        responseMimeType: 'application/json',
      });
      const cleaned = cleanJsonString(rawText);
      const parsed = JSON.parse(cleaned);
      let topics = Array.isArray(parsed.topics) ? parsed.topics : [];

      // Ensure minimal 8 topics
      if (topics.length < 8) {
        const fallback = getCuratedTopicSuggestions(targetGrade, targetSubject, semester);
        for (const item of fallback) {
          if (!topics.some((t: any) => t.title?.toLowerCase() === item.title.toLowerCase())) {
            topics.push(item);
          }
          if (topics.length >= 8) break;
        }
      }

      return res.json({ topics, source: 'gemini-ai' });
    } catch (aiErr: any) {
      console.warn('[Topic Suggester] AI antrean tinggi. Menyajikan rekomendasi topik Kurikulum Merdeka:', aiErr?.message || aiErr);
      const fallback = getCuratedTopicSuggestions(targetGrade, targetSubject, semester);
      return res.json({ topics: fallback, source: 'curriculum-database' });
    }
  } catch (err: any) {
    console.warn('[Topic Suggester] Error umum:', err?.message || err);
    const fallback = getCuratedTopicSuggestions(req.body?.grade || '4', req.body?.subject || 'Matematika', req.body?.semester);
    return res.json({ topics: fallback, source: 'curriculum-database' });
  }
});

// Vite middleware or production static serving
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

start();
