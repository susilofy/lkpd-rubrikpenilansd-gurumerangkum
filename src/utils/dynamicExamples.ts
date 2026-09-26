import { LKPDFormData, RubricFormData } from '../types';
import { ColumnExampleItem } from '../data/columnExamplesData';

// Standard recommended topics for Kurikulum Merdeka SD per subject & grade
export function getDefaultTopicForSubject(subject: string, grade: string): string {
  const g = grade || '4';
  const subLower = (subject || '').toLowerCase();

  if (subLower.includes('matematika')) {
    if (g === '1') return 'Mengenal Bilangan Cacah 1 sampai 20 dan Penjumlahan Dasar';
    if (g === '2') return 'Penjumlahan dan Pengurangan Bilangan Cacah sampai 50';
    if (g === '3') return 'Mengenal Pecahan Sederhana (Setengah, Sepertiga, Seperempat)';
    if (g === '4') return 'Operasi Perkalian dan Pembagian Bilangan Cacah';
    if (g === '5') return 'Operasi Penjumlahan dan Pengurangan Pecahan Biasa & Campuran';
    return 'Pengolahan dan Penyajian Data dalam Bentuk Diagram Batang';
  }

  if (subLower.includes('ipas') || subLower.includes('alam') || subLower.includes('sosial')) {
    if (g === '1') return 'Mengenal Bagian-Bagian Tubuh dan Cara Merawatnya';
    if (g === '2') return 'Benda Padat, Benda Cair, dan Perubahannya di Rumah';
    if (g === '3') return 'Siklus Hidup Kupu-Kupu dan Metamorfosis Hewan';
    if (g === '4') return 'Bagian Tubuh Tumbuhan dan Fungsinya';
    if (g === '5') return 'Sistem Organ Pencernaan Manusia dan Pola Makan Sehat';
    return 'Hubungan Ekosistem, Rantai Makanan, dan Keseimbangan Alam';
  }

  if (subLower.includes('indonesia')) {
    if (g === '1') return 'Mengenal Bunyi Huruf Vokal dan Konsonan pada Kata Benda Sekitar';
    if (g === '2') return 'Membaca Cerita Fabel dan Menemukan Pesan Moral';
    if (g === '3') return 'Menulis Paragraf Deskripsi Sederhana tentang Hewan Peliharaan';
    if (g === '4') return 'Menemukan Ide Pokok dan Informasi Pendukung dalam Teks Narasi';
    if (g === '5') return 'Menulis Teks Eksplanasi tentang Terjadinya Pelangi';
    return 'Menganalisis Unsur Intrinsik Cerpen dan Membuat Ringkasan';
  }

  if (subLower.includes('pancasila')) {
    if (g === '1') return 'Simbol-Simbol Sila Pancasila dan Contoh Penerapannya di Rumah';
    if (g === '2') return 'Aturan dan Tata Tertib yang Berlaku di Sekolah';
    if (g === '3') return 'Menghargai Keberagaman Karakteristik Individu di Kelas';
    if (g === '4') return 'Makna Sila-Sila Pancasila dan Gotong Royong di Lingkungan Sekitar';
    if (g === '5') return 'Norma, Hak, dan Kewajiban sebagai Warga Sekolah dan Masyarakat';
    return 'Musyawarah Mufakat dalam Menyelesaikan Permasalahan Bersama';
  }

  if (subLower.includes('jasmani') || subLower.includes('pjok') || subLower.includes('olahraga')) {
    if (g === '1' || g === '2') return 'Gerak Dasar Lokomotor (Berjalan, Berlari, dan Melompat)';
    if (g === '3' || g === '4') return 'Gerak Dasar Manipulatif dalam Permainan Bola Kasti';
    return 'Aktivitas Kebugaran Jasmani dan Pola Hidup Sehat';
  }

  if (subLower.includes('seni rupa')) {
    if (g === '1' || g === '2') return 'Eksplorasi Garis, Bentuk Geometris, dan Warna Primer';
    if (g === '3' || g === '4') return 'Membuat Kolase dan Mozaik dari Bahan Alam Sekitar';
    return 'Menggambar Perspektif Sederhana dan Desain Motif Ragam Hias';
  }

  if (subLower.includes('seni musik')) {
    return 'Mengenal Pola Irama Sederhana dan Ketukan Lagu Anak Daerah';
  }

  if (subLower.includes('inggris')) {
    if (g === '1' || g === '2') return 'Greetings and Introducing My Family Members';
    if (g === '3' || g === '4') return 'Things in the Classroom and My Daily Activities';
    return 'Describing Animals, Hobbies, and Weather';
  }

  if (subLower.includes('agama')) {
    return 'Membaca Ayat Pilihan, Keteladanan Akhlak Terpuji, dan Ibadah Harian';
  }

  // Default fallback
  return `Konsep Esensial Pembelajaran ${subject} Kelas ${g}`;
}

export interface DynamicLkpdExampleResult {
  topicExample: string;
  cpExample: string;
  tpExample: string;
  indicatorsExample: string;
  modelExample: string;
  sourcesExample: string;
  toolsExample: string;
  activitiesExample: string;
  appliedTopic: string;

  // Form field aliases for LKPDGenerator
  timeAllocation: string;
  topic: string;
  cp: string;
  tp: string;
  indicators: string;
  model: string;
  learningSources: string;
  toolsAndMaterials: string;
  characterProfiles: string[];
}

export function getDynamicLkpdExamples(formData: LKPDFormData): DynamicLkpdExampleResult {
  const grade = formData.grade || '4';
  const gradeNum = parseInt(grade, 10) || 4;
  const phase = formData.phase || (gradeNum <= 2 ? 'Fase A' : gradeNum <= 4 ? 'Fase B' : 'Fase C');
  const subject = formData.subject || 'Ilmu Pengetahuan Alam dan Sosial (IPAS)';
  const appliedTopic = formData.topic && formData.topic.trim() ? formData.topic.trim() : getDefaultTopicForSubject(subject, grade);
  const isEarly = gradeNum <= 3;
  const subLower = subject.toLowerCase();

  // 1. CP Example tailored to subject, grade, phase, and topic
  let cpExample = '';
  if (subLower.includes('matematika')) {
    if (gradeNum <= 2) {
      cpExample = `Peserta didik menunjukkan pemahaman dan intuisi bilangan (number sense) pada bilangan cacah sampai 100, mampu membaca, menulis, menentukan nilai tempat, serta menyelesaikan operasi hitung kontekstual terkait "${appliedTopic}" dengan bantuan benda konkret.`;
    } else if (gradeNum <= 4) {
      cpExample = `Peserta didik dapat memahami konsep dan prosedur operasi hitung bilangan, menganalisis hubungan antar-bilangan, serta memecahkan masalah kontekstual yang berkaitan dengan materi "${appliedTopic}" secara bernalar kritis dan mandiri.`;
    } else {
      cpExample = `Peserta didik mampu melakukan penalaran logis, menyelesaikan operasi hitung pecahan, desimal, atau geometri yang berkaitan dengan materi "${appliedTopic}", serta menyajikan penalaran matematika secara sistematis.`;
    }
  } else if (subLower.includes('ipas')) {
    if (gradeNum <= 2) {
      cpExample = `Peserta didik mengamati fenomena dan lingkungan sekitar, mengidentifikasi ciri-ciri penting terkait materi "${appliedTopic}", serta menceritakan hasil pengamatannya dengan bahasa sederhana.`;
    } else if (gradeNum <= 4) {
      cpExample = `Peserta didik menganalisis fenomena alam dan sosial di sekitarnya, memahami hubungan sebab-akibat terkait konsep "${appliedTopic}", serta melakukan penyelidikan sederhana untuk membuktikan prinsip ilmiah secara bergotong royong.`;
    } else {
      cpExample = `Peserta didik menganalisis sistem alam, keterkaitan struktur dan fungsi organ/ekosistem pada materi "${appliedTopic}", serta merancang solusi kreatif atas permasalahan lingkungan dan kehidupan sehari-hari.`;
    }
  } else if (subLower.includes('pancasila')) {
    cpExample = `Peserta didik memahami nilai-nilai Pancasila, norma, hak, dan kewajiban terkait materi "${appliedTopic}", serta menunjukkan perilaku bertanggung jawab, toleran, dan berpartisipasi aktif dalam kehidupan bersama di sekolah dan masyarakat.`;
  } else if (subLower.includes('indonesia')) {
    if (isEarly) {
      cpExample = `Peserta didik mampu bersikap menjadi pendengar yang penuh perhatian, memahami pesan lisan dan informasi dari teks bacaan anak terkait "${appliedTopic}", serta mengekspresikan gagasan secara santun.`;
    } else {
      cpExample = `Peserta didik mampu membaca dengan fasih, memahami ide pokok dan gagasan pendukung teks bacaan mengenai "${appliedTopic}", serta menulis teks informatif atau narasi runtut dengan ejaan yang tepat.`;
    }
  } else {
    cpExample = `Peserta didik pada ${phase} (Kelas ${grade}) menguasai kompetensi esensial materi "${appliedTopic}" pada mata pelajaran ${subject}, mampu menerapkan konsep dalam kehidupan nyata, serta menumbuhkan karakter Profil Pelajar Pancasila.`;
  }

  // 2. TP Example tailored to topic, subject, and grade
  let tpExample = '';
  if (isEarly) {
    tpExample = `1. Melalui pengamatan gambar dan media konkret, peserta didik dapat menyebutkan 3 hal penting tentang "${appliedTopic}" dengan benar.\n2. Melalui aktivitas mencocokkan/melengkapi lembar kerja, peserta didik dapat menunjukkan contoh nyata "${appliedTopic}" dalam kehidupan sehari-hari.\n3. Melalui tanya jawab sederhana, peserta didik mampu menceritakan kembali pemahamannya tentang "${appliedTopic}" dengan percaya diri.`;
  } else {
    tpExample = `1. Melalui eksplorasi data dan studi kasus, peserta didik dapat menjelaskan konsep dasar serta prinsip utama "${appliedTopic}" dengan tepat.\n2. Melalui diskusi kelompok, peserta didik dapat menganalisis permasalahan kontekstual terkait "${appliedTopic}" dan merumuskan alternatif penyelesaiannya.\n3. Peserta didik dapat menyajikan hasil penyelidikan materi "${appliedTopic}" secara tertulis dan terstruktur di depan kelas.`;
  }

  // 3. Indicators (KKTP) tailored to topic and subject
  let indicatorsExample = '';
  if (isEarly) {
    indicatorsExample = `1. Mengidentifikasi minimal 3 ciri/komponen materi "${appliedTopic}" secara tepat.\n2. Menyelesaikan lembar aktivitas pengerjaan LKPD dengan rapi dan runtut.\n3. Menunjukkan keaktifan dan sikap gotong royong saat belajar bersama teman.`;
  } else {
    indicatorsExample = `1. Menjelaskan hubungan sebab-akibat atau prinsip operasional materi "${appliedTopic}" dengan akurasi minimal 80%.\n2. Menyelesaikan soal penalaran/studi kasus pemecahan masalah materi "${appliedTopic}" dengan argumen logis.\n3. Mengomunikasikan kesimpulan belajar kelompok secara sistematis dan santun.`;
  }

  // 4. Model Example tailored
  const currentModel = formData.model || 'Problem Based Learning (PBL)';
  const modelExample = `${currentModel} — Pembelajaran kontekstual yang berpusat pada murid melalui eksplorasi masalah nyata materi "${appliedTopic}".`;

  // 5. Learning Sources tailored to subject, grade, and topic
  let sourcesExample = `Buku Siswa ${subject} Kelas ${grade} Kemdikbudristek, Lembar Kerja Peserta Didik`;
  if (subLower.includes('ipas')) {
    sourcesExample += `, Lingkungan Alam Sekitar Sekolah, Video Pembelajaran Edukatif "${appliedTopic}"`;
  } else if (subLower.includes('matematika')) {
    sourcesExample += `, Benda Konkret / Kartu Bilangan, Media Visual Pecahan/Geometri`;
  } else if (subLower.includes('pancasila')) {
    sourcesExample += `, Gambar Perilaku Sehari-hari, Cerita Bergambar Pengamalan Pancasila`;
  } else if (subLower.includes('indonesia')) {
    sourcesExample += `, Teks Cerita/Artikel Anak Bertema "${appliedTopic}", Pojok Baca Kelas`;
  } else {
    sourcesExample += `, Media Pembelajaran Konkret Sesuai Topik "${appliedTopic}"`;
  }

  // 6. Tools and Materials tailored to subject and topic
  let toolsExample = 'Alat tulis, kertas LKPD, pensil warna / spidol';
  if (subLower.includes('matematika')) {
    toolsExample = 'Alat tulis, kartu angka/bilangan, stik berhitung / kancing hitung, penggaris, kertas berpetak';
  } else if (subLower.includes('ipas')) {
    if (appliedTopic.toLowerCase().includes('tumbuhan') || appliedTopic.toLowerCase().includes('daun')) {
      toolsExample = 'Sampel daun/akar segar di halaman sekolah, kaca pembesar (lup), selotip, gunting, pensil warna';
    } else if (appliedTopic.toLowerCase().includes('air') || appliedTopic.toLowerCase().includes('wujud') || appliedTopic.toLowerCase().includes('benda')) {
      toolsExample = 'Gelas ukur bening, air, es batu, mangkuk, pewarna makanan, sendok';
    } else {
      toolsExample = `Kartu gambar peraga materi "${appliedTopic}", kaca pembesar/media riil, alat tulis, pewarna`;
    }
  } else if (subLower.includes('pancasila')) {
    toolsExample = 'Kartu studi kasus bergambar, kertas manila/karton, spidol warna, lem kertas, kartu perilaku';
  } else if (subLower.includes('indonesia')) {
    toolsExample = 'Teks bacaan narasi/informasi, kartu kata kunci, stabilo / spidol warna, lembar analisis';
  } else if (subLower.includes('seni rupa')) {
    toolsExample = 'Buku gambar A4, pensil 2B, krayon / pensil warna, gunting, lem kertas, bahan kolase';
  } else if (subLower.includes('pjok')) {
    toolsExample = 'Peluit, stopwatch, kerucut penanda (cone), matras / bola sesuai nomor aktivitas';
  }

  // 7. Sample Activities preview tailored to topic
  const activitiesExample = isEarly
    ? `Aktivitas 1: Mengamati gambar fenomena "${appliedTopic}" dan melingkari jawaban yang tepat.\nAktivitas 2: Menjodohkan pasangan istilah/konsep "${appliedTopic}" dengan garis lurus.\nAktivitas 3: Melengkapi isian kalimat rumpang bergambar secara mandiri.\nAktivitas 4: Refleksi perasaan belajar dengan mewarnai emotikon kegembiraan.`
    : `Aktivitas 1: Stimulus & Studi Fenomena Nyata — Menganalisis pengamatan awal topik "${appliedTopic}".\nAktivitas 2: Penyelidikan Mandiri & Kolaboratif — Menjawab soal pemahaman konsep dan isian analitis.\nAktivitas 3: Pemecahan Masalah (HOTS) — Menyelesaikan tantangan kasus di lingkungan sekitar terkait "${appliedTopic}".\nAktivitas 4: Refleksi & Penarikan Kesimpulan Bermakna.`;

  const timeAllocation = formData.timeAllocation || '2 x 35 menit (1 Pertemuan)';
  const characterProfiles =
    Array.isArray(formData.characterProfiles) && formData.characterProfiles.length > 0
      ? formData.characterProfiles
      : ['Bernalar Kritis', 'Gotong Royong', 'Mandiri'];

  return {
    topicExample: appliedTopic,
    cpExample,
    tpExample,
    indicatorsExample,
    modelExample,
    sourcesExample,
    toolsExample,
    activitiesExample,
    appliedTopic,

    timeAllocation,
    topic: appliedTopic,
    cp: cpExample,
    tp: tpExample,
    indicators: indicatorsExample,
    model: modelExample,
    learningSources: sourcesExample,
    toolsAndMaterials: toolsExample,
    characterProfiles,
  };
}

export interface DynamicRubricExampleResult {
  appliedTopic: string;
  learningObjectiveExample: string;
  criteria1Name: string;
  criteria1Desc: string;
  criteria2Name: string;
  criteria2Desc: string;
  criteria3Name: string;
  criteria3Desc: string;
  criteria4Name: string;
  criteria4Desc: string;
  skor4Example: string;
  skor3Example: string;
  skor2Example: string;
  skor1Example: string;

  // Form field aliases for RubricGenerator
  topic: string;
  learningObjectives: string;
  taskType: string;
  criteriaCountExample: string;
  scale: string;
}

export function getDynamicRubricExamples(formData: RubricFormData): DynamicRubricExampleResult {
  const grade = formData.grade || '4';
  const subject = formData.subject || 'Ilmu Pengetahuan Alam dan Sosial (IPAS)';
  const appliedTopic = formData.topic && formData.topic.trim() ? formData.topic.trim() : getDefaultTopicForSubject(subject, grade);
  const taskType = formData.taskType || 'LKPD';
  const subLower = subject.toLowerCase();

  let learningObjectiveExample = `Peserta didik mampu memahami, menganalisis, dan menerapkan konsep "${appliedTopic}" pada mata pelajaran ${subject} melalui tugas ${taskType}.`;

  // Specific criteria based on taskType and subject
  let c1Name = 'Pemahaman Konsep Materi';
  let c1Desc = `Ketepatan memahami esensi materi ${appliedTopic}`;
  let c2Name = 'Akurasi Jawaban & Langkah Kerja';
  let c2Desc = `Ketepatan penyelesaian tugas asesmen ${taskType}`;
  let c3Name = 'Keterampilan Proses & Penalaran';
  let c3Desc = `Kemampuan berpikir kritis dan memecahkan masalah terkait ${appliedTopic}`;
  let c4Name = 'Kerapian, Kolaborasi, dan Komunikasi';
  let c4Desc = 'Tanggung jawab penyajian hasil kerja dan refleksi';

  if (taskType.toLowerCase().includes('praktik') || taskType.toLowerCase().includes('unjuk kerja')) {
    c1Name = `Persiapan Alat dan Bahan ${appliedTopic}`;
    c1Desc = 'Kelengkapan dan kesiapan perlengkapan praktik';
    c2Name = 'Keterampilan Prosedural Kerja';
    c2Desc = 'Kesesuaian langkah pelaksanaan dengan petunjuk teknis';
    c3Name = 'Akurasi Pengamatan & Data Praktik';
    c3Desc = `Keberhasilan memperoleh hasil/data riil terkait ${appliedTopic}`;
    c4Name = 'Sikap Keselamatan & Refleksi Praktik';
    c4Desc = 'Tanggung jawab kebersihan, ketertiban, dan penarikan kesimpulan';
  } else if (taskType.toLowerCase().includes('proyek') || taskType.toLowerCase().includes('produk')) {
    c1Name = `Perencanaan & Desain Proyek ${appliedTopic}`;
    c1Desc = 'Kematangan ide, pembagian peran, dan jadwal kerja';
    c2Name = 'Kesesuaian Konten Produk dengan Materi';
    c2Desc = `Kebenaran substansi materi ${appliedTopic} pada karya/produk`;
    c3Name = 'Kreativitas, Estetika, dan Daya Guna';
    c3Desc = 'Kerapian, inovasi tampilan, dan kemudahan pemanfaatan karya';
    c4Name = 'Presentasi & Kerja Sama Kelompok';
    c4Desc = 'Kelancaran menjelaskan produk dan kekompakan tim';
  } else if (taskType.toLowerCase().includes('presentasi')) {
    c1Name = `Penguasaan Substansi Materi ${appliedTopic}`;
    c1Desc = 'Kedalaman penjelasan konsep tanpa membaca teks penuh';
    c2Name = 'Artikulasi, Bahasa, dan Kejelasan Suara';
    c2Desc = 'Kelancaran bertutur dengan bahasa Indonesia yang santun';
    c3Name = 'Kualitas Media Tayang / Alat Peraga';
    c3Desc = 'Daya tarik dan kejelasan media visual pendukung';
    c4Name = 'Respons terhadap Pertanyaan Audiens';
    c4Desc = 'Kemampuan menjawab dan menanggapi diskusi secara logis';
  }

  const skor4Example = `Menunjukkan pemahaman sangat utuh pada materi "${appliedTopic}", seluruh instruksi tugas ${taskType} diselesaikan secara tepat, mandiri, runtut, dan mampu memberikan argumentasi/contoh nyata yang mendalam.`;
  const skor3Example = `Memahami sebagian besar konsep materi "${appliedTopic}" dengan tepat (75% - 89%), tugas ${taskType} diselesaikan dengan baik dan terstruktur, terdapat sedikit kekeliruan minor yang tidak mengganggu pemahaman inti.`;
  const skor2Example = `Cukup memahami konsep dasar materi "${appliedTopic}" (50% - 74%), penyelesaian tugas ${taskType} belum lengkap dan masih memerlukan bantuan petunjuk atau arahan dari guru.`;
  const skor1Example = `Belum memahami konsep materi "${appliedTopic}" (< 50%), tugas ${taskType} banyak yang belum tuntas atau keliru, dan memerlukan bimbingan intensif langkah demi langkah.`;

  const scale = formData.scale || '1-4';
  const scaleText =
    scale === '1-4'
      ? 'Skala 1 - 4 (Sangat Baik s/d Perlu Bimbingan)'
      : scale === '1-5'
      ? 'Skala 1 - 5 (5 Tingkat Capaian)'
      : scale === '1-10'
      ? 'Skala 1 - 10 (Desimal/Detail)'
      : 'Skala Khusus';

  return {
    appliedTopic,
    learningObjectiveExample,
    criteria1Name: c1Name,
    criteria1Desc: c1Desc,
    criteria2Name: c2Name,
    criteria2Desc: c2Desc,
    criteria3Name: c3Name,
    criteria3Desc: c3Desc,
    criteria4Name: c4Name,
    criteria4Desc: c4Desc,
    skor4Example,
    skor3Example,
    skor2Example,
    skor1Example,

    topic: appliedTopic,
    learningObjectives: learningObjectiveExample,
    taskType,
    criteriaCountExample: `${formData.criteriaCount || 4} Kriteria Penilaian Terstruktur`,
    scale: scaleText,
  };
}

// Generate full dynamic ColumnExampleItem array for Modal LKPD tab
export function getDynamicLkpdColumnExamples(formData: LKPDFormData): ColumnExampleItem[] {
  const dynamic = getDynamicLkpdExamples(formData);
  const grade = formData.grade || '4';
  const phase = formData.phase || 'Fase B';
  const subject = formData.subject || 'Ilmu Pengetahuan Alam dan Sosial (IPAS)';
  const schoolName = formData.schoolName || 'SD Negeri Merdeka 01';
  const teacherName = formData.teacherName || 'Guru Kelas';

  return [
    {
      id: 'schoolName',
      columnNumber: '1',
      columnName: 'Nama Sekolah / Satuan Pendidikan',
      category: 'identitas',
      description: 'Nama resmi instansi sekolah tempat LKPD diterapkan.',
      exampleGenerated: `${schoolName} Kota Pendidikan`,
      appliedValue: schoolName,
      tips: 'Tercetak rapi di bagian kop judul dokumen resmi sekolah.',
    },
    {
      id: 'teacherName',
      columnNumber: '2',
      columnName: 'Nama Guru Pengampu',
      category: 'identitas',
      description: 'Nama guru penyusun sekaligus penilai pembelajaran.',
      exampleGenerated: `${teacherName}, S.Pd.`,
      appliedValue: teacherName,
      tips: 'Dapat disertai gelar untuk keperluan arsip supervisi kepala sekolah.',
    },
    {
      id: 'gradePhase',
      columnNumber: '3 & 4',
      columnName: 'Kelas & Fase Kurikulum Merdeka',
      category: 'identitas',
      description: 'Jenjang kelas dan fase perkembangan kognitif anak SD.',
      exampleGenerated: `Kelas ${grade} — ${phase}`,
      appliedValue: grade,
      tips: `Kelas ${grade} diselaraskan secara otomatis dengan ${phase}.`,
    },
    {
      id: 'subject',
      columnNumber: '5',
      columnName: 'Mata Pelajaran',
      category: 'identitas',
      description: 'Mata pelajaran Kurikulum Merdeka yang dipilih guru.',
      exampleGenerated: subject,
      appliedValue: subject,
      tips: 'Menjadi poros penyesuaian materi dan gaya aktivitas soal.',
    },
    {
      id: 'semester',
      columnNumber: '6',
      columnName: 'Semester',
      category: 'identitas',
      description: 'Periode semester berjalan (Semester 1 / Semester 2).',
      exampleGenerated: `Semester ${formData.semester || '1'} (${formData.semester === '2' ? 'Genap' : 'Ganjil'})`,
      appliedValue: formData.semester || '1',
      tips: 'Menandai periode tahun ajaran aktif.',
    },
    {
      id: 'topic',
      columnNumber: '7',
      columnName: 'Topik / Materi Pembelajaran',
      category: 'identitas',
      description: 'Materi pokok spesifik yang menjadi fokus lembar kerja.',
      exampleGenerated: dynamic.appliedTopic,
      appliedValue: dynamic.appliedTopic,
      tips: 'Semakin spesifik topik yang ditulis, semakin kontekstual aktivitas dan soal yang dihasilkan AI.',
    },
    {
      id: 'timeAllocation',
      columnNumber: '8',
      columnName: 'Alokasi Waktu',
      category: 'identitas',
      description: 'Perkiraan durasi pengerjaan LKPD dalam jam pelajaran.',
      exampleGenerated: formData.timeAllocation || '2 x 35 Menit (1 Pertemuan)',
      appliedValue: formData.timeAllocation || '2 x 35 Menit',
      tips: 'Standar alokasi waktu SD adalah 35 menit per jam pelajaran tatap muka.',
    },
    {
      id: 'cp',
      columnNumber: '9',
      columnName: 'Capaian Pembelajaran (CP)',
      category: 'kurikulum',
      description: `Kompetensi fase untuk mata pelajaran ${subject} materi "${dynamic.appliedTopic}".`,
      exampleGenerated: dynamic.cpExample,
      appliedValue: dynamic.cpExample,
      tips: 'Disesuaikan langsung dengan pedoman BSKAP Kurikulum Merdeka untuk materi ini.',
    },
    {
      id: 'tp',
      columnNumber: '10',
      columnName: 'Tujuan Pembelajaran (TP)',
      category: 'kurikulum',
      description: `Tujuan operasional berjenjang untuk materi "${dynamic.appliedTopic}".`,
      exampleGenerated: dynamic.tpExample,
      appliedValue: dynamic.tpExample,
      tips: 'Memuat Kata Kerja Operasional (KKO) yang terukur dan dapat diamati.',
    },
    {
      id: 'indicators',
      columnNumber: '11',
      columnName: 'Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)',
      category: 'kurikulum',
      description: `Bukti konkret pencapaian materi "${dynamic.appliedTopic}".`,
      exampleGenerated: dynamic.indicatorsExample,
      appliedValue: dynamic.indicatorsExample,
      tips: 'Menjadi acuan penyusunan kriteria penilaian asesmen formatif.',
    },
    {
      id: 'model',
      columnNumber: '12',
      columnName: 'Model / Metode Pembelajaran',
      category: 'kurikulum',
      description: 'Sintaks model pembelajaran yang mendasari langkah LKPD.',
      exampleGenerated: dynamic.modelExample,
      appliedValue: formData.model || 'Problem Based Learning (PBL)',
      tips: 'Langkah pembelajaran di LKPD otomatis merefleksikan model yang dipilih.',
    },
    {
      id: 'characterProfiles',
      columnNumber: '13',
      columnName: 'Dimensi Profil Pelajar Pancasila',
      category: 'kurikulum',
      description: 'Nilai karakter yang ditumbuhkan selama siswa menyelesaikan tugas.',
      exampleGenerated: (formData.characterProfiles || ['Bernalar Kritis', 'Gotong Royong', 'Mandiri']).join(', '),
      appliedValue: (formData.characterProfiles || ['Bernalar Kritis', 'Gotong Royong', 'Mandiri']).join(', '),
      tips: 'Terintegrasi dalam instruksi kolaborasi dan pertanyaan refleksi diri siswa.',
    },
    {
      id: 'learningSources',
      columnNumber: '14',
      columnName: 'Sumber Belajar',
      category: 'kurikulum',
      description: `Buku dan referensi materi "${dynamic.appliedTopic}".`,
      exampleGenerated: dynamic.sourcesExample,
      appliedValue: dynamic.sourcesExample,
      tips: 'Menggabungkan buku teks resmi Kemdikbudristek dengan stimulus lingkungan nyata.',
    },
    {
      id: 'toolsAndMaterials',
      columnNumber: '15',
      columnName: 'Alat dan Bahan',
      category: 'kurikulum',
      description: `Perlengkapan fisik untuk aktivitas "${dynamic.appliedTopic}".`,
      exampleGenerated: dynamic.toolsExample,
      appliedValue: dynamic.toolsExample,
      tips: 'Alat dan bahan aman, mudah ditemukan, dan relevan dengan konten materi.',
    },
    {
      id: 'activityTypes',
      columnNumber: '16, 17, 18',
      columnName: 'Jenis & Variasi Aktivitas LKPD',
      category: 'aktivitas',
      description: `Rangkaian penugasan siswa untuk materi "${dynamic.appliedTopic}".`,
      exampleGenerated: dynamic.activitiesExample,
      tips: 'Variasi penugasan memadukan aktivitas visual, penemuan, dan pemecahan masalah (HOTS).',
    },
  ];
}

// Generate full dynamic ColumnExampleItem array for Modal Rubrik tab
export function getDynamicRubricColumnExamples(formData: RubricFormData): ColumnExampleItem[] {
  const dynamic = getDynamicRubricExamples(formData);
  const subject = formData.subject || 'IPAS';
  const grade = formData.grade || '4';
  const taskType = formData.taskType || 'LKPD';

  return [
    {
      id: 'criteria',
      columnNumber: '1',
      columnName: 'Kriteria / Aspek Penilaian Terkalibrasi',
      category: 'rubrik',
      description: `Kriteria penilaian yang disesuaikan dengan jenis tugas "${taskType}" dan materi "${dynamic.appliedTopic}".`,
      exampleGenerated: `1. ${dynamic.criteria1Name}\n2. ${dynamic.criteria2Name}\n3. ${dynamic.criteria3Name}\n4. ${dynamic.criteria4Name}`,
      tips: 'Menilai keterampilan proses, kedalaman pemahaman, serta sikap secara proporsional.',
    },
    {
      id: 'skor4',
      columnNumber: '2',
      columnName: 'Deskriptor Skor 4 (Sangat Baik / A)',
      category: 'rubrik',
      description: `Ketercapaian maksimal peserta didik pada materi "${dynamic.appliedTopic}".`,
      exampleGenerated: dynamic.skor4Example,
      tips: 'Mencerminkan peserta didik yang mencapai kompetensi melampaui ekspektasi minimum.',
    },
    {
      id: 'skor3',
      columnNumber: '3',
      columnName: 'Deskriptor Skor 3 (Baik / B)',
      category: 'rubrik',
      description: `Ketercapaian sesuai standar KKTP pada materi "${dynamic.appliedTopic}".`,
      exampleGenerated: dynamic.skor3Example,
      tips: 'Mencerminkan penguasaan mandiri yang telah tuntas KKTP.',
    },
    {
      id: 'skor2',
      columnNumber: '4',
      columnName: 'Deskriptor Skor 2 (Cukup / C)',
      category: 'rubrik',
      description: `Penguasaan parsial yang membutuhkan sedikit bantuan guru.`,
      exampleGenerated: dynamic.skor2Example,
      tips: 'Menandai bagian indikator yang perlu pemantapan sebelum asesmen sumatif.',
    },
    {
      id: 'skor1',
      columnNumber: '5',
      columnName: 'Deskriptor Skor 1 (Perlu Bimbingan / D)',
      category: 'rubrik',
      description: `Belum menguasai kompetensi dasar materi "${dynamic.appliedTopic}".`,
      exampleGenerated: dynamic.skor1Example,
      tips: 'Menjadi acuan dasar untuk memberikan pendampingan belajar atau pembelajaran remedial.',
    },
    {
      id: 'rumusNilai',
      columnNumber: '6',
      columnName: 'Rumus Kalkulator Nilai & Predikat Rapor',
      category: 'rubrik',
      description: 'Konversi skor mentah menjadi nilai skala 0–100 dan tindak lanjut KKTP.',
      exampleGenerated: `Nilai Akhir = (Total Skor yang Diperoleh / ${Number(formData.criteriaCount || 4) * 4}) × 100\nPredikat: 86–100 (Sangat Baik / Tuntas), 71–85 (Baik / Tuntas), 56–70 (Cukup / Penguatan), <56 (Perlu Bimbingan / Remedial)`,
      tips: 'Dilengkapi kalkulator otomatis dan rekapitulasi kolektif satu rombongan belajar.',
    },
  ];
}
