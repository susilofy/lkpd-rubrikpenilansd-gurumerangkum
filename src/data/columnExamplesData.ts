export interface ColumnExampleItem {
  id: string;
  columnNumber?: string;
  columnName: string;
  category: 'identitas' | 'kurikulum' | 'aktivitas' | 'rubrik';
  description: string;
  exampleGenerated: string;
  appliedValue?: string;
  tips: string;
}

export interface PresetSubjectExample {
  id: string;
  title: string;
  subject: string;
  grade: string;
  phase: string;
  topic: string;
  timeAllocation: string;
  cpExample: string;
  tpExample: string;
  indicatorsExample: string;
  modelExample: string;
  profilesExample: string[];
  sourcesExample: string;
  toolsExample: string;
  activitiesExample: {
    title: string;
    type: string;
    instruction: string;
    preview: string;
  }[];
  rubricExample: {
    criteria: string;
    skor4: string;
    skor3: string;
    skor2: string;
    skor1: string;
  }[];
}

export const COLUMN_EXAMPLES_LKPD: ColumnExampleItem[] = [
  {
    id: 'schoolName',
    columnNumber: '1',
    columnName: 'Nama Sekolah / Satuan Pendidikan',
    category: 'identitas',
    description: 'Nama resmi instansi sekolah dasar tempat guru mengajar yang tercetak di kop LKPD.',
    exampleGenerated: 'SD Negeri Merdeka 01 Jakarta Pusat',
    appliedValue: 'SD Negeri Merdeka 01',
    tips: 'Gunakan nama resmi sekolah agar dokumen resmi dan siap diarsipkan dalam portofolio guru.',
  },
  {
    id: 'teacherName',
    columnNumber: '2',
    columnName: 'Nama Guru Pengampu',
    category: 'identitas',
    description: 'Nama guru kelas atau guru mata pelajaran pembuat dan penilai lembar kerja.',
    exampleGenerated: 'Siti Rahmawati, S.Pd.Gr',
    appliedValue: 'Siti Rahmawati, S.Pd.Gr',
    tips: 'Dapat disertai gelar atau NIP jika dibutuhkan untuk administrasi supervisi kepala sekolah.',
  },
  {
    id: 'gradePhase',
    columnNumber: '3 & 4',
    columnName: 'Kelas & Fase Kurikulum Merdeka',
    category: 'identitas',
    description: 'Tingkatan kelas SD dan padanan fasenya (Fase A: Kelas 1-2, Fase B: Kelas 3-4, Fase C: Kelas 5-6).',
    exampleGenerated: 'Kelas 4 (Empat) - Fase B',
    appliedValue: '4',
    tips: 'Memilih kelas secara otomatis menyesuaikan fase kognitif anak SD dalam gaya bahasa instruksi.',
  },
  {
    id: 'subject',
    columnNumber: '5',
    columnName: 'Mata Pelajaran',
    category: 'identitas',
    description: 'Mata pelajaran Kurikulum Merdeka yang menjadi fokus lembar kerja.',
    exampleGenerated: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    appliedValue: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    tips: 'Tersedia pilihan mata pelajaran pokok SD maupun opsi menuliskan mata pelajaran lokal/khusus.',
  },
  {
    id: 'semester',
    columnNumber: '6',
    columnName: 'Semester',
    category: 'identitas',
    description: 'Periode semester kegiatan belajar mengajar (Semester 1 / Semester 2).',
    exampleGenerated: 'Semester 1 (Ganjil)',
    appliedValue: '1',
    tips: 'Menandai waktu pelaksanaan pembelajaran pada tahun ajaran aktif.',
  },
  {
    id: 'topic',
    columnNumber: '7',
    columnName: 'Topik / Materi Pembelajaran',
    category: 'identitas',
    description: 'Materi pokok spesifik yang menjadi topik utama pembelajaran siswa.',
    exampleGenerated: 'Bagian Tubuh Tumbuhan dan Fungsinya',
    appliedValue: 'Bagian Tubuh Tumbuhan dan Fungsinya',
    tips: 'Tuliskan topik secara spesifik (misal: "Siklus Air" daripada hanya "IPA") agar soal dan LKPD sangat relevan.',
  },
  {
    id: 'timeAllocation',
    columnNumber: '8',
    columnName: 'Alokasi Waktu',
    category: 'identitas',
    description: 'Perkiraan durasi siswa mengerjakan LKPD dalam jam pelajaran tatap muka.',
    exampleGenerated: '2 x 35 Menit (1 Pertemuan)',
    appliedValue: '2 x 35 Menit',
    tips: 'Standar 1 JP di Sekolah Dasar adalah 35 menit.',
  },
  {
    id: 'cp',
    columnNumber: '9',
    columnName: 'Capaian Pembelajaran (CP)',
    category: 'kurikulum',
    description: 'Kompetensi pembelajaran yang harus dicapai peserta didik pada fase tersebut.',
    exampleGenerated:
      'Peserta didik menganalisis hubungan antara bentuk serta fungsi bagian tubuh pada tumbuhan (akar, batang, daun, bunga, dan buah) serta mengaitkannya dengan kemampuan bertahan hidup di lingkungan sekitarnya sesuai kodrat alam.',
    appliedValue:
      'Peserta didik menganalisis hubungan antara bentuk serta fungsi bagian tubuh pada tumbuhan (akar, batang, daun, bunga, dan buah) serta mengaitkannya dengan kemampuan bertahan hidup di lingkungan sekitarnya.',
    tips: 'Gunakan tombol "✨ Rumuskan CP & TP Otomatis" untuk mendapatkan CP resmi Kemdikbudristek seketika.',
  },
  {
    id: 'tp',
    columnNumber: '10',
    columnName: 'Tujuan Pembelajaran (TP)',
    category: 'kurikulum',
    description: 'Penjabaran kompetensi spesifik yang diharapkan dicapai siswa dalam 1 pembelajaran.',
    exampleGenerated:
      '1. Melalui pengamatan sampel daun dan akar, peserta didik dapat mengidentifikasi 5 bagian utama tumbuhan dan fungsinya dengan benar.\n2. Melalui diskusi kelompok, peserta didik dapat membedakan jenis-jenis akar dan tulang daun secara tepat.\n3. Melalui percobaan sederhana, peserta didik dapat menyimpulkan peranan fotosintesis bagi makhluk hidup.',
    appliedValue:
      '1. Melalui pengamatan sampel daun dan akar, peserta didik dapat mengidentifikasi 5 bagian utama tumbuhan dan fungsinya dengan benar.\n2. Melalui diskusi kelompok, peserta didik dapat membedakan jenis-jenis akar dan tulang daun secara tepat.\n3. Melalui percobaan sederhana, peserta didik dapat menyimpulkan peranan fotosintesis bagi makhluk hidup.',
    tips: 'Gunakan kata kerja operasional (KKO) yang dapat diamati dan diukur (mengidentifikasi, membedakan, menyimpulkan).',
  },
  {
    id: 'indicators',
    columnNumber: '11',
    columnName: 'Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)',
    category: 'kurikulum',
    description: 'Indikator bukti konkret bahwa siswa telah mencapai tujuan pembelajaran.',
    exampleGenerated:
      '1. Menyebutkan fungsi akar menyerap air dan fungsi daun sebagai tempat fotosintesis minimal 90% tepat.\n2. Mengklasifikasikan 4 contoh daun berdasarkan bentuk tulang daun (menyirip, menjari, melengkung, sejajar).\n3. Menyelesaikan lembar pengamatan kelompok dengan data yang akurat dan berargumen saat diskusi.',
    appliedValue:
      '1. Menyebutkan fungsi akar menyerap air dan fungsi daun sebagai tempat fotosintesis minimal 90% tepat.\n2. Mengklasifikasikan 4 contoh daun berdasarkan bentuk tulang daun (menyirip, menjari, melengkung, sejajar).\n3. Menyelesaikan lembar pengamatan kelompok dengan data yang akurat.',
    tips: 'Menjadi acuan dasar dalam menyusun rubrik penilaian asesmen formatif.',
  },
  {
    id: 'model',
    columnNumber: '12',
    columnName: 'Model / Metode Pembelajaran',
    category: 'kurikulum',
    description: 'Sintaks model pembelajaran Kurikulum Merdeka yang melandasi langkah kegiatan di LKPD.',
    exampleGenerated: 'Problem Based Learning (PBL) - Pendekatan Saintifik Kontekstual',
    appliedValue: 'Problem Based Learning (PBL)',
    tips: 'PBL sangat efektif untuk memicu rasa ingin tahu siswa melalui masalah nyata sehari-hari.',
  },
  {
    id: 'characterProfiles',
    columnNumber: '13',
    columnName: 'Dimensi Profil Pelajar Pancasila',
    category: 'kurikulum',
    description: 'Nilai karakter luhur yang ditumbuhkembangkan selama pengerjaan LKPD.',
    exampleGenerated:
      '• Bernalar Kritis: Mengidentifikasi hubungan kausal fungsi akar dan kelangsungan hidup pohon.\n• Gotong Royong: Berbagi peran aktif saat pengamatan sampel tumbuhan.\n• Mandiri: Menyelesaikan penulisan kesimpulan reflektif secara bertanggung jawab.',
    appliedValue: 'Bernalar Kritis, Gotong Royong, Mandiri',
    tips: 'Pilihlah 2-3 dimensi yang paling relevan dengan tipe aktivitas yang direncanakan.',
  },
  {
    id: 'learningSources',
    columnNumber: '14',
    columnName: 'Sumber Belajar',
    category: 'kurikulum',
    description: 'Buku, bahan ajar, dan media referensi peserta didik.',
    exampleGenerated: 'Buku Siswa IPAS Kelas IV Kemdikbudristek, Tanaman di Kebun Sekolah, Ensiklopedia Tumbuhan',
    appliedValue: 'Buku Siswa IPAS Kelas IV Kemdikbudristek, Kebun Sekolah, Ensiklopedia Anak',
    tips: 'Dapat menggabungkan sumber cetak, lingkungan sekitar, maupun tautan video edukasi.',
  },
  {
    id: 'toolsAndMaterials',
    columnNumber: '15',
    columnName: 'Alat dan Bahan',
    category: 'kurikulum',
    description: 'Peralatan dan material fisik yang diperlukan murid dalam melakukan aktivitas.',
    exampleGenerated: 'Berbagai jenis daun dan akar segar, kaca pembesar (lup), gunting, selotip, pensil warna, kertas LKPD',
    appliedValue: 'Sampel daun segar, kaca pembesar (lup), selotip, gunting, pensil warna',
    tips: 'Sediakan alat-alat yang aman dan mudah dijumpai di lingkungan sekolah dasar.',
  },
  {
    id: 'activityTypes',
    columnNumber: '16, 17, 18',
    columnName: 'Jenis & Karakter Aktivitas LKPD',
    category: 'aktivitas',
    description: 'Kombinasi model tugas siswa (Pilihan Ganda, Isian, Menjodohkan, Eksperimen, dan HOTS).',
    exampleGenerated:
      'Aktivitas 1: Mengamati sampel daun & akar nyata (Praktik konkrit)\nAktivitas 2: Menjodohkan jenis tulang daun dengan gambar pasangannya\nAktivitas 3: Soal analisis HOTS tentang mengapa daun menguning jika tidak terkena cahaya matahari\nAktivitas 4: Refleksi diri dengan emotikon perasaan belajar',
    tips: 'Menggabungkan variasi aktivitas menjaga konsentrasi anak dan menjangkau berbagai gaya belajar.',
  },
];

export const COLUMN_EXAMPLES_RUBRIC: ColumnExampleItem[] = [
  {
    id: 'criteria',
    columnNumber: '1',
    columnName: 'Kriteria / Aspek yang Dinilai',
    category: 'rubrik',
    description: 'Dimensi kompetensi yang dievaluasi (pengetahuan, keterampilan proses, atau sikap).',
    exampleGenerated: '1. Ketepatan Identifikasi Bagian Tumbuhan & Fungsinya',
    tips: 'Hindari kriteria abstrak seperti "Bagus/Jelek"; gunakan kompetensi terukur seperti "Ketepatan Analisis".',
  },
  {
    id: 'skor4',
    columnNumber: '2',
    columnName: 'Deskriptor Skor 4 (Sangat Baik / Mahir)',
    category: 'rubrik',
    description: 'Capaian melampaui harapan dengan akurasi sempurna dan penjelasan mendalam.',
    exampleGenerated:
      'Mampu mengidentifikasi seluruh 5 bagian tubuh tumbuhan (akar, batang, daun, bunga, biji) beserta fungsinya secara lengkap, tepat, dan mampu mengaitkannya dengan proses fotosintesis.',
    tips: 'Menunjukkan pemahaman utuh dan kemampuan mengartikulasikan konsep secara mandiri.',
  },
  {
    id: 'skor3',
    columnNumber: '3',
    columnName: 'Deskriptor Skor 3 (Baik / Cakap)',
    category: 'rubrik',
    description: 'Capaian memenuhi standar kompetensi yang diharapkan tanpa kesalahan fatal.',
    exampleGenerated:
      'Mampu mengidentifikasi 4 bagian tubuh tumbuhan beserta fungsinya dengan tepat, dengan penjelasan yang jelas meskipun belum mengaitkan secara rinci dengan fotosintesis.',
    tips: 'Kategori ini mencerminkan siswa yang telah tuntas KKTP secara mandiri.',
  },
  {
    id: 'skor2',
    columnNumber: '4',
    columnName: 'Deskriptor Skor 2 (Cukup / Layak)',
    category: 'rubrik',
    description: 'Capaian masih berada pada tahap dasar dan membutuhkan sedikit stimulus/arahan.',
    exampleGenerated:
      'Mampu mengidentifikasi 2–3 bagian tubuh tumbuhan, namun penjelasan fungsi masih tertukar atau membutuhkan pertanyaan pancingan dari guru.',
    tips: 'Indikator bahwa siswa memerlukan penguatan konsep sebelum melangkah ke topik berikutnya.',
  },
  {
    id: 'skor1',
    columnNumber: '5',
    columnName: 'Deskriptor Skor 1 (Perlu Bimbingan / Baru Berkembang)',
    category: 'rubrik',
    description: 'Siswa belum menguasai materi pokok dan memerlukan bimbingan intensif.',
    exampleGenerated:
      'Belum mampu mengidentifikasi bagian tubuh tumbuhan dan fungsinya dengan benar, atau pasif dan membutuhkan panduan langkah-demi-langkah dari guru.',
    tips: 'Sinyal intervensi pembelajaran remidial atau pendampingan individual.',
  },
  {
    id: 'rumusNilai',
    columnNumber: '6',
    columnName: 'Rumus Konversi & Predikat Nilai',
    category: 'rubrik',
    description: 'Kalkulasi otomatis skor mentah menjadi nilai skala 100 beserta deskripsi predikat.',
    exampleGenerated:
      'Nilai = (Jumlah Skor Perolehan / 16) x 100\nPredikat: 86–100 (Sangat Baik / A), 71–85 (Baik / B), 56–70 (Cukup / C), <56 (Perlu Bimbingan / D)',
    tips: 'Memudahkan guru dalam pengisian aplikasi e-Rapor Kurikulum Merdeka secara otomatis.',
  },
];

export const PRESET_COMPLETE_EXAMPLES: PresetSubjectExample[] = [
  {
    id: 'ipas-4',
    title: '🌿 IPAS Kelas 4 - Bagian Tubuh Tumbuhan & Fotosintesis',
    subject: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    grade: '4',
    phase: 'Fase B',
    topic: 'Bagian Tubuh Tumbuhan dan Fungsinya',
    timeAllocation: '2 x 35 Menit (1 Pertemuan)',
    cpExample:
      'Peserta didik menganalisis hubungan antara bentuk serta fungsi bagian tubuh pada tumbuhan (akar, batang, daun, bunga, dan buah) serta mengaitkannya dengan kemampuan bertahan hidup di lingkungan sekitarnya.',
    tpExample:
      '1. Melalui pengamatan spesimen langsung, peserta didik dapat menyebutkan 5 organ pokok tumbuhan dan kegunaannya.\n2. Melalui eksplorasi kartu gambar, peserta didik dapat mengklasifikasikan bentuk susunan tulang daun.\n3. Melalui studi kasus sederhana, peserta didik dapat menganalisis dampak apabila akar tanaman rusak.',
    indicatorsExample:
      '1. Menjelaskan fungsi akar menyerap hara dan batang menyalurkan air dengan tepat.\n2. Mengelompokkan minimal 4 jenis daun ke dalam pola menyirip/menjari/sejajar.\n3. Memberikan argumen logis terhadap pertanyaan pemecahan masalah lingkungan.',
    modelExample: 'Problem Based Learning (PBL)',
    profilesExample: ['Bernalar Kritis', 'Gotong Royong', 'Mandiri'],
    sourcesExample: 'Buku Siswa IPAS Kelas 4 Kemdikbudristek, Tanaman di Halaman Sekolah',
    toolsExample: 'Kaca pembesar (lup), 4 jenis daun segar, gunting, selotip, lembar LKPD',
    activitiesExample: [
      {
        title: 'Aktivitas 1: Eksplorasi & Pengamatan Nyata',
        type: 'Mengamati & Isian',
        instruction: 'Ambil daun dan amati urat-urat daunnya dengan lup pembesar!',
        preview: 'Tabel Pengamatan: [Nama Daun] | [Bentuk Tulang Daun] | [Tekstur Permukaan]',
      },
      {
        title: 'Aktivitas 2: Menjodohkan Pasangan Fungsi',
        type: 'Menjodohkan',
        instruction: 'Tarik garis dari organ tumbuhan ke fungsi utamanya yang sesuai!',
        preview: 'Akar -> Menyerap air dan mineral dari tanah\nBatang -> Mengalirkan nutrisi ke seluruh bagian\nDaun -> Tempat terjadinya proses fotosintesis',
      },
      {
        title: 'Aktivitas 3: Analisis Masalah Lingkungan (HOTS)',
        type: 'HOTS & Uraian',
        instruction: 'Diskusikan bersama kelompokmu situasi berikut!',
        preview: 'Pak Joko menyiram tanamannya setiap hari tetapi meletakkannya di dalam kamar mandi yang gelap tanpa jendela. Mengapa tanamannya menguning dan layu? Jelaskan analisis kelompokmu!',
      },
    ],
    rubricExample: [
      {
        criteria: 'Identifikasi Organ Tumbuhan',
        skor4: 'Menyebutkan 5 organ dan fungsinya secara tepat, lengkap, dan runtut.',
        skor3: 'Menyebutkan 4 organ dan fungsinya dengan tepat.',
        skor2: 'Menyebutkan 2-3 organ dengan beberapa kekeliruan fungsi.',
        skor1: 'Hanya dapat menyebutkan 1 organ atau memerlukan panduan penuh.',
      },
      {
        criteria: 'Analisis Soal HOTS Tanaman Layu',
        skor4: 'Menghubungkan ketiadaan sinar matahari dengan gagalnya fotosintesis dan klorofil secara ilmiah.',
        skor3: 'Menyebutkan tanaman layu karena butuh cahaya matahari namun belum mengaitkan klorofil.',
        skor2: 'Menjawab butuh udara/panas tanpa penjelasan ilmiah.',
        skor1: 'Jawaban tidak sesuai dengan konteks permasalahan.',
      },
    ],
  },
  {
    id: 'matematika-2',
    title: '🔢 Matematika Kelas 2 - Penjumlahan & Pengurangan Cacah',
    subject: 'Matematika',
    grade: '2',
    phase: 'Fase A',
    topic: 'Penjumlahan dan Pengurangan Bilangan Cacah sampai 50',
    timeAllocation: '2 x 35 Menit',
    cpExample:
      'Peserta didik menunjukkan pemahaman dan memiliki intuisi bilangan (number sense) pada bilangan cacah sampai 100, dapat membaca, menulis, menentukan nilai tempat, membandingkan, serta melakukan operasi penjumlahan dan pengurangan menggunakan benda-benda konkret.',
    tpExample:
      '1. Peserta didik dapat menghitung hasil penjumlahan dua bilangan cacah sampai 50 menggunakan bantuan lidi/balok puluhan.\n2. Peserta didik dapat menyelesaikan soal cerita sederhana terkait pengurangan dalam kehidupan sehari-hari.',
    indicatorsExample:
      '1. Menyelesaikan 5 soal hitung penjumlahan susun tanpa menyimpan dengan benar.\n2. Menuliskan kalimat matematika yang tepat dari soal cerita bergambar.',
    modelExample: 'Contextual Teaching and Learning (CTL)',
    profilesExample: ['Mandiri', 'Bernalar Kritis'],
    sourcesExample: 'Buku Matematika Siswa Kelas 2 Kemdikbudristek, Kartu Angka',
    toolsExample: 'Stik es krim / lidi penghitung, kantong puluhan, pensil warna',
    activitiesExample: [
      {
        title: 'Aktivitas 1: Hitung Ceria Bergambar',
        type: 'Numerasi & Pilihan Ganda',
        instruction: 'Hitung banyaknya buah apel di dalam kotak lalu lingkari jawaban yang benar!',
        preview: '24 apel merah + 13 apel hijau = .... [ A. 36 | B. 37 | C. 38 ]',
      },
      {
        title: 'Aktivitas 2: Pasangan Nilai Tempat Puluhan & Satuan',
        type: 'Menjodohkan',
        instruction: 'Tarik garis dari balok puluhan ke bilangan yang sesuai!',
        preview: '3 ikatan puluhan + 5 stik satuan ---> [ 35 ]\n4 ikatan puluhan + 2 stik satuan ---> [ 42 ]',
      },
      {
        title: 'Aktivitas 3: Petualangan Belanja di Kantin (Soal Cerita)',
        type: 'Pemecahan masalah',
        instruction: 'Bantulah Dito menghitung sisa uang jajannya!',
        preview: 'Dito membawa uang Rp30.000. Ia membeli roti seharga Rp12.000. Berapa sisa uang Dito sekarang? Tuliskan langkah hitungmu!',
      },
    ],
    rubricExample: [
      {
        criteria: 'Keterampilan Menghitung Penjumlahan',
        skor4: 'Menghitung seluruh penjumlahan dengan benar tanpa bantuan alat bantu.',
        skor3: 'Menghitung benar 80% dengan bantuan stik hitung mandiri.',
        skor2: 'Menghitung benar 50% dan masih sering keliru menghitung satuan.',
        skor1: 'Belum mampu melakukan operasi hitung penjumlahan secara mandiri.',
      },
      {
        criteria: 'Penyelesaian Soal Cerita',
        skor4: 'Mampu menuliskan kalimat matematika dengan tepat dan menghitung hasil akhir benar.',
        skor3: 'Kalimat matematika benar namun terdapat kekeliruan perhitungan minor.',
        skor2: 'Masih bingung membedakan operasi tambah atau kurang dalam cerita.',
        skor1: 'Belum memahami isi soal cerita yang dibacakan.',
      },
    ],
  },
  {
    id: 'pancasila-5',
    title: '🏛️ Pendidikan Pancasila Kelas 5 - Norma & Hak Kewajiban',
    subject: 'Pendidikan Pancasila',
    grade: '5',
    phase: 'Fase C',
    topic: 'Norma, Hak, dan Kewajiban dalam Kehidupan Bermasyarakat',
    timeAllocation: '2 x 35 Menit',
    cpExample:
      'Peserta didik memahami norma, aturan, hak, dan kewajiban sebagai anggota keluarga, warga sekolah, dan bagian dari masyarakat; menunjukkan sikap disiplin, toleran, dan berpartisipasi aktif dalam mematuhi norma di lingkungan sekitar.',
    tpExample:
      '1. Peserta didik dapat membedakan empat jenis norma (agama, kesusilaan, kesopanan, hukum) beserta sanksinya.\n2. Peserta didik dapat menganalisis studi kasus pelanggaran hak dan kewajiban di lingkungan sekolah.',
    indicatorsExample:
      '1. Mengidentifikasi minimal 3 contoh penerapan norma kesopanan di sekolah.\n2. Merumuskan solusi musyawarah atas masalah ketidakseimbangan hak dan kewajiban kelas.',
    modelExample: 'Discovery Learning & Diskusi Kolaboratif',
    profilesExample: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Gotong Royong', 'Bernalar Kritis'],
    sourcesExample: 'Buku Siswa Pendidikan Pancasila Kelas 5 Kemdikbudristek, Kliping Berita Koran',
    toolsExample: 'Kertas karton kerja kelompok, spidol warna, teks studi kasus',
    activitiesExample: [
      {
        title: 'Aktivitas 1: Detektif Norma Masyarakat',
        type: 'Mengelompokkan',
        instruction: 'Klasifikasikan tindakan di bawah ini ke dalam kolom norma yang sesuai!',
        preview: '1. Mengucapkan salam saat masuk rumah -> [Norma Kesopanan]\n2. Mengembalikan dompet temuan kepada pemiliknya -> [Norma Kesusilaan]',
      },
      {
        title: 'Aktivitas 2: Analisis Dilema Studi Kasus (HOTS)',
        type: 'Pemecahan masalah & Diskusi',
        instruction: 'Bacalah cerita singkat "Tugas Piket Roni" dan diskusikan jalan keluarnya!',
        preview: 'Roni menuntut haknya bermain bola saat istirahat, namun ia menolak melaksanakan kewajiban piket membersihkan papan tulis. Apa akibatnya bagi teman sekelas? Apa solusi bijak yang kalian usulkan?',
      },
    ],
    rubricExample: [
      {
        criteria: 'Pemahaman Konsep Hak & Kewajiban',
        skor4: 'Mampu membedakan hak dan kewajiban secara tepat dengan argumen timbal balik yang matang.',
        skor3: 'Mampu menjelaskan hak dan kewajiban dengan contoh relevan namun argumen masih sederhana.',
        skor2: 'Masih tertukar antara hak yang diterima dengan kewajiban yang harus dijalankan.',
        skor1: 'Belum mampu membedakan hak dan kewajiban.',
      },
    ],
  },
];
