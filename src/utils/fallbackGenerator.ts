import { LKPDContent, LKPDFormData, RubricContent, RubricFormData } from '../types';

export function generateFallbackCpTp(grade: string, subject: string, topic: string, customPhase?: string) {
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

export function generateFallbackLKPD(formData: Partial<LKPDFormData>): LKPDContent {
  const grade = formData.grade || '4';
  const gradeNum = parseInt(grade, 10) || 4;
  const isEarlyGrade = gradeNum <= 3;
  const subject = formData.subject || 'Ilmu Pengetahuan Alam dan Sosial (IPAS)';
  const topic = formData.topic || 'Bagian Tubuh Tumbuhan dan Fungsinya';
  const schoolName = formData.schoolName || 'SD Negeri Merdeka 01';
  const teacherName = formData.teacherName || 'Guru Kelas';
  const phase = formData.phase || (gradeNum <= 2 ? 'Fase A' : gradeNum <= 4 ? 'Fase B' : 'Fase C');
  const characterLkpd = formData.characterLkpd || 'Individu dan kelompok';

  const objectives = formData.tp
    ? formData.tp.split('\n').filter((s) => s.trim().length > 0)
    : [
        `Peserta didik mampu memahami konsep esensial materi "${topic}" melalui telaah gambar dan pengamatan.`,
        `Peserta didik mampu melakukan aktivitas penyelidikan terpandu dan bernalar kritis terkait "${topic}".`,
        `Peserta didik mampu mempresentasikan kesimpulan dan menghubungkan manfaat materi "${topic}" dalam kehidupan nyata.`,
      ];

  const instructions = isEarlyGrade
    ? [
        'Tuliskan nama lengkap dan kelasmu pada bagian atas LKPD.',
        'Dengarkan petunjuk dan penjelasan dari Bapak/Ibu Guru dengan seksama.',
        'Kerjakan aktivitas bergambar dengan teliti, tertib, dan gembira.',
        'Tanyakan kepada gurumu jika ada instruksi yang belum kamu pahami.',
      ]
    : [
        'Berdoalah sebelum memulai mengerjakan Lembar Kerja Peserta Didik (LKPD).',
        'Bacalah setiap pengantar wacana dan instruksi pengerjaan dengan cermat.',
        'Lakukan kegiatan penyelidikan bersama kelompokmu secara gotong royong dan mandiri.',
        'Tuliskan argumentasi dan jawaban analisis menggunakan bahasa Indonesia yang baik dan benar.',
        'Periksa kembali kelengkapan seluruh jawaban sebelum dikumpulkan.',
      ];

  const tools = formData.toolsAndMaterials
    ? formData.toolsAndMaterials.split(',').map((s: string) => s.trim()).filter(Boolean)
    : ['Buku Siswa dan Alat Tulis', 'Lembar Kerja Peserta Didik (LKPD)', 'Bahan ajar kontekstual / kartu peraga gambar', 'Pewarna / spidol'];

  const learningSteps = [
    {
      step: 1,
      title: 'Apersepsi dan Pengamatan Awal (Stimulus)',
      description: isEarlyGrade
        ? `Guru memperlihatkan gambar atau media konkret tentang "${topic}". Peserta didik menyimak dan mengidentifikasi apa yang dilihat.`
        : `Peserta didik mengamati studi kasus atau fenomena kontekstual terkait "${topic}" yang disajikan oleh guru secara kritis.`,
    },
    {
      step: 2,
      title: 'Penyelidikan dan Eksplorasi Materi',
      description: isEarlyGrade
        ? `Peserta didik mengelompokkan, mewarnai, atau melengkapi lembar aktivitas sesuai bimbingan instruksi.`
        : `Peserta didik berdiskusi dalam kelompok untuk mengumpulkan fakta, menganalisis faktor penyebab, dan merumuskan jawaban penyelidikan.`,
    },
    {
      step: 3,
      title: 'Verifikasi dan Presentasi Hasil',
      description: `Peserta didik mengomunikasikan hasil temuannya di depan kelas, saling menanggapi, dan menarik kesimpulan bersama guru.`,
    },
  ];

  const selectedActivityTypes = formData.activityTypes && formData.activityTypes.length > 0
    ? formData.activityTypes
    : ['Mengamati', 'Pilihan ganda', 'Isian', 'HOTS'];

  const tasks: any[] = [];
  let taskCounter = 1;

  if (selectedActivityTypes.includes('Mengamati') || isEarlyGrade) {
    tasks.push({
      id: `task-${taskCounter}`,
      number: taskCounter++,
      type: 'Mengamati',
      prompt: `Amatilah stimulus gambar atau lingkungan sekitar yang berkaitan dengan "${topic}"!`,
      instruction: 'Catat atau gambarkan minimal 2 hal penting yang kamu temukan dari pengamatanmu!',
      expectedLines: 3,
      answerKey: `Peserta didik menuliskan minimal 2 objek atau karakteristik nyata hasil pengamatan terkait "${topic}". Contoh: Mengidentifikasi bagian penting atau perubahan yang teramati secara saksama.`,
      scoringRubric: 'Skor 10 jika mencatat 2 hal relevan dan jelas; Skor 5 jika hanya 1 hal; Skor 0 jika tidak relevan.',
    });
  }

  if (selectedActivityTypes.includes('Pilihan ganda')) {
    tasks.push({
      id: `task-${taskCounter}`,
      number: taskCounter++,
      type: 'Pilihan Ganda',
      prompt: `Pilihlah salah satu jawaban yang paling tepat mengenai "${topic}"!`,
      instruction: 'Berilah tanda silang (X) pada huruf A, B, atau C!',
      choices: [
        `A. Merupakan prinsip dasar yang benar mengenai konsep "${topic}".`,
        `B. Tidak memiliki kaitan dengan materi pembelajaran yang sedang dipelajari.`,
        `C. Hanya dapat diaplikasikan pada situasi laboratorium khusus.`,
      ],
      expectedLines: 1,
      answerKey: `Kunci Jawaban: A. Merupakan prinsip dasar yang benar mengenai konsep "${topic}".\nPembahasan: Pilihan A memuat konsep ilmiah yang tepat dan sesuai capaian pembelajaran.`,
      scoringRubric: 'Skor 10 jika menjawab A; Skor 0 jika memilih opsi lain.',
    });
  }

  if (selectedActivityTypes.includes('Menjodohkan') || selectedActivityTypes.includes('Mencocokkan')) {
    tasks.push({
      id: `task-${taskCounter}`,
      number: taskCounter++,
      type: 'Menjodohkan',
      prompt: `Tariklah garis lurus untuk menghubungkan istilah di sebelah kiri dengan keterangan yang tepat di sebelah kanan!`,
      instruction: 'Hubungkan pasangan yang paling sesuai!',
      matchingPairs: [
        { left: `Konsep Dasar (${topic})`, right: 'Prinsip utama yang dipelajari' },
        { left: `Ciri / Karakteristik`, right: 'Sifat khas yang dapat diamati' },
        { left: `Manfaat Kontekstual`, right: 'Penerapan nyata di sekitar kita' },
      ],
      expectedLines: 1,
      answerKey: `Kunci Pasangan:\n1. Konsep Dasar (${topic}) -> Prinsip utama yang dipelajari\n2. Ciri / Karakteristik -> Sifat khas yang dapat diamati\n3. Manfaat Kontekstual -> Penerapan nyata di sekitar kita`,
      scoringRubric: 'Tiap pasangan yang benar bernilai 5 poin (Skor maksimal: 15 poin).',
    });
  }

  if (selectedActivityTypes.includes('Isian') || selectedActivityTypes.includes('Literasi')) {
    tasks.push({
      id: `task-${taskCounter}`,
      number: taskCounter++,
      type: isEarlyGrade ? 'Isian Singkat' : 'Isian & Telaah Konsep',
      prompt: `Lengkapilah kalimat berikut ini dengan istilah yang tepat mengenai "${topic}":`,
      instruction: 'Tuliskan kata kunci yang benar pada titik-titik yang tersedia!',
      expectedLines: 2,
      answerKey: `Istilah esensial yang sesuai dengan konsep materi "${topic}". Siswa menyebutkan kata kunci pokok materi dengan ejaan baku.`,
      scoringRubric: 'Skor 10 jika istilah tepat; Skor 5 jika mendekati; Skor 0 jika keliru.',
    });
  }

  if (selectedActivityTypes.includes('HOTS') || selectedActivityTypes.includes('Pemecahan masalah') || !isEarlyGrade) {
    tasks.push({
      id: `task-${taskCounter}`,
      number: taskCounter++,
      type: 'Pemecahan Masalah (HOTS)',
      prompt: `Jika kamu menemui permasalahan di lingkungan sekolah yang berkaitan dengan "${topic}", solusi inovatif apa yang dapat kamu dan teman kelompokmu tawarkan?`,
      instruction: 'Tuliskan argumen dan tahapan tindakan solusimu secara logis!',
      expectedLines: 4,
      answerKey: `Jawaban memuat: (1) Identifikasi akar masalah pada "${topic}", (2) Usulan solusi kreatif yang realistis, dan (3) Manfaat langsung bagi warga sekolah.`,
      scoringRubric: 'Skor 15: Solusi orisinal, logis, terperinci. Skor 10: Solusi logis sederhana. Skor 5: Kurang operasional.',
    });
  }

  const questions = [
    {
      id: 'q-1',
      number: 1,
      question: isEarlyGrade
        ? `Sebutkan hal menarik yang paling kamu ingat tentang "${topic}"!`
        : `Jelaskan bagaimana konsep "${topic}" dapat membantu kita memahami peristiwa di lingkungan sekitar!`,
      hotLevel: 'MOTS' as const,
      answerKey: `Peserta didik mampu mendeskripsikan intisari materi "${topic}" dan mengaitkannya dengan pengalaman nyata.`,
    },
    {
      id: 'q-2',
      number: 2,
      question: isEarlyGrade
        ? `Mengapa materi "${topic}" ini bermanfaat untuk kita ketahui?`
        : `Menurut pendapatmu, apa akibat yang timbul jika kita tidak memahami materi "${topic}" dengan baik?`,
      hotLevel: 'HOTS' as const,
      answerKey: `Peserta didik bernalar kritis mengenai implikasi materi "${topic}" terhadap kehidupan bersama dan kelestarian lingkungan.`,
    },
  ];

  return {
    id: `lkpd-${Date.now()}`,
    title: `LEMBAR KERJA PESERTA DIDIK (LKPD) - ${topic.toUpperCase()}`,
    schoolName,
    teacherName,
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
      learnedPrompt: `Hal baru yang saya pelajari tentang ${topic} hari ini:`,
      likedPrompt: 'Bagian kegiatan pembelajaran yang paling menyenangkan bagi saya:',
      unclearPrompt: 'Materi yang masih memerlukan penjelasan tambahan dari guru:',
    },
    teacherGuide: {
      expectedConclusion: `Peserta didik mampu menguasai kompetensi dasar "${topic}" pada mata pelajaran ${subject} dan mengaplikasikannya dalam konteks sehari-hari secara kritis dan bergotong royong.`,
      scoringSummary: 'Total Skor Maksimal: 100 poin (Aktivitas Tugas: 70 poin, Pertanyaan Reflektif: 20 poin, Kesimpulan & Sikap: 10 poin).',
      scoringFormula: 'Nilai Akhir = (Total Skor Perolehan / Total Skor Maksimal) x 100',
      notesForTeacher: 'Kunci jawaban dan rubrik ini merupakan acuan formatif guru. Jawaban siswa dengan bahasa mandiri dan nalar yang tepat diberikan skor optimal.',
    },
    includeAnswerKey: formData.includeAnswerKey ?? true,
  };
}

export function generateFallbackRubric(formData: Partial<RubricFormData>, lkpdContext?: any): RubricContent {
  const grade = formData.grade || lkpdContext?.grade || '4';
  const subject = formData.subject || lkpdContext?.subject || 'Ilmu Pengetahuan Alam dan Sosial (IPAS)';
  const topic = formData.topic || lkpdContext?.topic || 'Bagian Tubuh Tumbuhan dan Fungsinya';
  const phase = formData.phase || lkpdContext?.phase || 'Fase B';
  const taskType = formData.taskType || 'LKPD dan Aktivitas Praktik';
  const schoolName = formData.schoolName || lkpdContext?.schoolName || 'SD Negeri Merdeka 01';
  const learningObjective = formData.learningObjective || lkpdContext?.learningObjectives?.[0] || `Memahami dan mengaplikasikan konsep esensial ${topic}`;

  const scaleLabels = [
    { score: 4, label: 'Sangat Baik (SB)' },
    { score: 3, label: 'Baik (B)' },
    { score: 2, label: 'Cukup (C)' },
    { score: 1, label: 'Perlu Bimbingan (PB)' },
  ];

  const criteria = [
    {
      id: 'crit-1',
      no: 1,
      name: 'Pemahaman Konsep Materi',
      description: `Penguasaan konsep dan materi esensial mengenai "${topic}"`,
      descriptors: {
        4: `Sangat memahami seluruh konsep materi "${topic}" secara mendalam, tepat, dan mampu memberikan analogi/contoh konkret.`,
        3: `Memahami sebagian besar konsep materi "${topic}" dengan tepat, terdapat kesalahan minor yang tidak mengubah prinsip utama.`,
        2: `Cukup memahami konsep materi "${topic}", namun masih memerlukan arahan atau klarifikasi dari guru.`,
        1: `Belum memahami konsep dasar "${topic}" dan memerlukan pendampingan remediasi secara intensif.`,
      },
    },
    {
      id: 'crit-2',
      no: 2,
      name: 'Ketepatan Jawaban & Prosedur Kerja',
      description: 'Akurasi penyelesaian butir tugas dan langkah kerja LKPD',
      descriptors: {
        4: 'Seluruh butir tugas diselesaikan dengan akurasi di atas 85%, langkah sistematis, serta penjelasan logis.',
        3: 'Sebagian besar tugas (70% - 84%) dikerjakan secara tepat dan runtut sesuai petunjuk kegiatan.',
        2: 'Ketepatan pengerjaan tugas berkisar antara 50% - 69%, beberapa bagian masih belum tuntas.',
        1: 'Ketepatan pengerjaan tugas di bawah 50% dan banyak instruksi yang belum terpenuhi.',
      },
    },
    {
      id: 'crit-3',
      no: 3,
      name: 'Keterampilan Proses & Bernalar Kritis',
      description: 'Kecakapan observasi, analisis masalah, dan penyusunan solusi',
      descriptors: {
        4: 'Menunjukkan daya analisis tinggi, kritis dalam menelaah stimulus gambar/fenomena, dan solutif.',
        3: 'Mampu menghubungkan fakta materi dengan baik dan memberikan tanggapan yang rasional.',
        2: 'Keterampilan analisis cukup, namun tanggapan yang diberikan masih sebatas mengulang wacana.',
        1: 'Belum mampu menarik benang merah analisis dan pasif dalam menemukan pemecahan masalah.',
      },
    },
    {
      id: 'crit-4',
      no: 4,
      name: 'Kerapian, Tanggung Jawab & Refleksi',
      description: 'Disiplin waktu, kerapian dokumen LKPD, dan perumusan refleksi',
      descriptors: {
        4: 'Lembar kerja tersusun sangat rapi dan bersih, tuntas tepat waktu, serta refleksi diri bermakna.',
        3: 'Lembar kerja rapi, selesai tepat waktu, dan memuat catatan refleksi yang memadai.',
        2: 'Lembar kerja cukup rapi, pengumpulan sedikit terlambat, dan catatan refleksi sangat singkat.',
        1: 'Lembar kerja kurang rapi, terlambat diserahkan, dan belum melengkapi bagian refleksi belajar.',
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
    maxScore: criteria.length * 4,
    scaleLabels,
    criteria,
    scoringFormula: 'Nilai Akhir = (Total Skor yang Diperoleh / Skor Maksimal) × 100',
    predicateCategories: [
      { minScorePct: 86, maxScorePct: 100, predicate: 'Sangat Baik (A)', label: 'Menunjukkan penguasaan sangat tinggi dan melampaui capaian pembelajaran.' },
      { minScorePct: 71, maxScorePct: 85, predicate: 'Baik (B)', label: 'Menunjukkan penguasaan yang baik dan memenuhi seluruh kriteria ketercapaian.' },
      { minScorePct: 56, maxScorePct: 70, predicate: 'Cukup (C)', label: 'Menunjukkan penguasaan cukup, perlu penguatan pada indikator tertentu.' },
      { minScorePct: 0, maxScorePct: 55, predicate: 'Perlu Bimbingan (D)', label: 'Belum mencapai ketuntasan minimum, memerlukan bimbingan intensif.' },
    ],
  };
}
