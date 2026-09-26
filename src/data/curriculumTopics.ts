export interface TopicSuggestion {
  title: string;
  category: string;
  description: string;
}

// Curated comprehensive Kurikulum Merdeka topic database for SD
// Guarantees at least 8 to 10 choices for every subject and grade combination
export function getCuratedTopicSuggestions(
  grade: string,
  subject: string,
  semester?: string
): TopicSuggestion[] {
  const g = grade || '4';
  const subLower = (subject || '').toLowerCase();
  const isSem2 = semester === '2';

  // 1. MATEMATIKA
  if (subLower.includes('matematika')) {
    if (g === '1') {
      return [
        {
          title: 'Mengenal Bilangan Cacah 1 sampai 10 dan Menghitung Benda Konkret',
          category: 'Bilangan & Konsep',
          description: 'Membilang, membaca, dan menuliskan lambang bilangan 1-10 dengan benda di kelas.',
        },
        {
          title: 'Operasi Penjumlahan Bilangan Cacah sampai 10 dengan Bantuan Gambar',
          category: 'Operasi Hitung',
          description: 'Memahami arti penjumlahan sebagai penggabungan dua kelompok objek.',
        },
        {
          title: 'Operasi Pengurangan Bilangan Cacah sampai 10 dalam Cerita Sehari-hari',
          category: 'Operasi Hitung',
          description: 'Memahami arti pengurangan sebagai pengambilan objek dengan ilustrasi gambar.',
        },
        {
          title: 'Mengenal Bentuk Bangun Datar (Segitiga, Segiempat, Lingkaran) di Rumah',
          category: 'Geometri',
          description: 'Mengamati dan mengelompokkan benda-benda berdasarkan bentuk dasarnya.',
        },
        {
          title: 'Membandingkan dan Mengurutkan Panjang Benda (Lebih Panjang / Pendek)',
          category: 'Pengukuran',
          description: 'Mengukur dan membandingkan panjang benda menggunakan jengkal atau klip kertas.',
        },
        {
          title: 'Mengenal Nilai Tempat Puluhan dan Satuan pada Bilangan 11 sampai 20',
          category: 'Nilai Tempat',
          description: 'Menguraikan bilangan belasan menjadi puluhan dan satuan secara terstruktur.',
        },
        {
          title: 'Mengenal Pola Warna dan Pola Bentuk Gambar Sederhana',
          category: 'Pola & Aljabar',
          description: 'Melengkapi pola berulang dua dan tiga elemen secara runtut dan cermat.',
        },
        {
          title: 'Pengelompokkan Data Sederhana Benda Favorit Siswa di Kelas',
          category: 'Analisis Data',
          description: 'Mengumpulkan data buah atau warna kesukaan dan menampilkannya dengan tabel turus.',
        },
        {
          title: 'Mengenal Waktu Pagi, Siang, Malam dan Membaca Jam Analog Tepat',
          category: 'Pengukuran Waktu',
          description: 'Menentukan jadwal kegiatan harian dan membaca waktu jam tepat (pukul 1.00 - 12.00).',
        },
      ];
    }

    if (g === '2') {
      return [
        {
          title: 'Penjumlahan dan Pengurangan Bilangan Cacah sampai 100 dengan Menyimpan',
          category: 'Operasi Hitung',
          description: 'Menyelesaikan operasi hitung menggunakan teknik bersusun pendek dengan teliti.',
        },
        {
          title: 'Mengenal Konsep Perkalian sebagai Penjumlahan Berulang',
          category: 'Konsep Perkalian',
          description: 'Menghitung kelompok benda yang sama banyak dan mengubahnya ke bentuk perkalian.',
        },
        {
          title: 'Mengenal Konsep Pembagian sebagai Pengurangan Berulang sampai Habis',
          category: 'Konsep Pembagian',
          description: 'Membagi sejumlah kelereng/permen kepada beberapa teman secara adil.',
        },
        {
          title: 'Mengenal Nilai dan Kesetaraan Pecahan Mata Uang Rupiah',
          category: 'Aritmetika Sosial',
          description: 'Menghitung uang kembalian dan menukar nominal uang logam serta uang kertas.',
        },
        {
          title: 'Pengukuran Panjang dengan Satuan Baku (Sentimeter dan Meter)',
          category: 'Pengukuran',
          description: 'Mengukur panjang meja, buku, dan pensil menggunakan penggaris dan meteran pita.',
        },
        {
          title: 'Mengenal Ciri-Ciri Bangun Datar: Sisi, Sudut, dan Titik Sudut',
          category: 'Geometri',
          description: 'Menghitung banyak sisi dan sudut pada bangun datar persegi, persegi panjang, dan segitiga.',
        },
        {
          title: 'Pecahan Sederhana Setengah (1/2), Sepertiga (1/3), dan Seperempat (1/4)',
          category: 'Pecahan',
          description: 'Membagi sebuah kue atau buah menjadi bagian-bagian yang sama besar.',
        },
        {
          title: 'Membaca dan Membuat Diagram Gambar (Piktogram) Sederhana',
          category: 'Analisis Data',
          description: 'Menyajikan data mainan atau kendaraan yang melintas menggunakan simbol gambar.',
        },
        {
          title: 'Mengukur Berat Benda dengan Timbangan dan Satuan Kilogram (kg) & Gram (g)',
          category: 'Pengukuran Berat',
          description: 'Membaca skala timbangan dan membandingkan berat benda belanjaan.',
        },
      ];
    }

    if (g === '3') {
      return [
        {
          title: 'Operasi Perkalian Bilangan Cacah sampai 100 dengan Metode Susun',
          category: 'Operasi Hitung',
          description: 'Menyelesaikan perkalian dua digit dengan satu digit secara tepat dan logis.',
        },
        {
          title: 'Operasi Pembagian Bilangan Cacah sampai 100 dengan Pembagian Bersusun',
          category: 'Operasi Hitung',
          description: 'Menyelesaikan pembagian tanpa sisa dan dengan sisa menggunakan cara bersusun.',
        },
        {
          title: 'Mengenal Pecahan Senilai dan Membandingkan Dua Pecahan Sederhana',
          category: 'Pecahan',
          description: 'Membandingkan pecahan menggunakan arsiran gambar pada pizza atau bangun datar.',
        },
        {
          title: 'Keliling Bangun Datar Persegi dan Persegi Panjang Menggunakan Satuan Baku',
          category: 'Geometri & Pengukuran',
          description: 'Menghitung total panjang sisi luar bangun datar dengan rumus keliling.',
        },
        {
          title: 'Luas Bangun Datar dengan Menghitung Petak Satuan Persegi',
          category: 'Geometri & Pengukuran',
          description: 'Menghitung luas daerah yang diarsir menggunakan petak satuan secara mandiri.',
        },
        {
          title: 'Mengenal Hubungan Antarsatuan Waktu (Tahun, Bulan, Minggu, Hari, Jam, Menit)',
          category: 'Pengukuran Waktu',
          description: 'Mengonversi satuan waktu dan menghitung lama suatu aktivitas belajar.',
        },
        {
          title: 'Mengidentifikasi Sudut Siku-Siku, Sudut Lancip, dan Sudut Tumpul',
          category: 'Eksplorasi Geometri',
          description: 'Menemukan macam-macam sudut pada benda dan sudut ruang kelas.',
        },
        {
          title: 'Penyajian dan Penafsiran Data dalam Tabel dan Diagram Batang',
          category: 'Analisis Data',
          description: 'Membaca informasi nilai ulangan atau tinggi badan siswa dari diagram batang.',
        },
        {
          title: 'Pemecahan Masalah Kontekstual Operasi Hitung Campuran dalam Kehidupan Sehari-hari',
          category: 'HOTS & Penalaran',
          description: 'Menyelesaikan soal cerita gabungan penjumlahan, pengurangan, dan perkalian.',
        },
      ];
    }

    if (g === '4') {
      return [
        {
          title: 'Operasi Perkalian dan Pembagian Bilangan Cacah sampai 1.000',
          category: 'Operasi Bilangan',
          description: 'Menyelesaikan perkalian dan pembagian ratusan dengan prosedur bersusun teratur.',
        },
        {
          title: 'Pecahan Senilai, Menyederhanakan Pecahan, dan Mengubah ke Pecahan Campuran',
          category: 'Pecahan',
          description: 'Menentukan pecahan yang memiliki nilai sama melalui perkalian dan pembagian pembilang-penyebut.',
        },
        {
          title: 'Penjumlahan dan Pengurangan Pecahan Berpenyebut Sama dan Berbeda',
          category: 'Operasi Pecahan',
          description: 'Menyamakan penyebut menggunakan KPK sederhana untuk menjumlahkan pecahan.',
        },
        {
          title: 'Mengenal Pola Bilangan Membesar dan Mengecil serta Pola Gambar Berulang',
          category: 'Pola & Aljabar',
          description: 'Menemukan aturan pola deret bilangan dan memprediksi suku berikutnya.',
        },
        {
          title: 'Pengukuran Luas Bangun Persegi dan Persegi Panjang Menggunakan Rumus Baku',
          category: 'Pengukuran & Luas',
          description: 'Menghitung luas area menggunakan perkalian panjang dan lebar (P x L).',
        },
        {
          title: 'Mengidentifikasi dan Mengukur Besar Sudut Menggunakan Busur Derajat',
          category: 'Geometri Sudut',
          description: 'Menentukan besar sudut dalam satuan derajat (°) secara akurat.',
        },
        {
          title: 'Pengolahan dan Penyajian Data dalam Bentuk Diagram Batang Vertikal dan Horizontal',
          category: 'Statistika & Data',
          description: 'Membaca sumbu nilai, frekuensi data, serta menarik kesimpulan dari diagram.',
        },
        {
          title: 'Menyelesaikan Masalah Kontekstual Terkait Uang dan Transaksi Belanja',
          category: 'Pemecahan Masalah / HOTS',
          description: 'Menghitung harga barang, total belanja, dan kembalian pada simulasi pasar kelas.',
        },
        {
          title: 'Keliling Bangun Gabungan Berbentuk Persegi dan Persegi Panjang',
          category: 'Geometri Terapan',
          description: 'Menghitung panjang garis batas luar bangun datar gabungan dengan teliti.',
        },
      ];
    }

    if (g === '5') {
      return [
        {
          title: 'Operasi Penjumlahan dan Pengurangan Pecahan Biasa dan Campuran Berpenyebut Beda',
          category: 'Pecahan',
          description: 'Menyamakan penyebut dengan mencari KPK serta menyederhanakan hasil akhir.',
        },
        {
          title: 'Operasi Perkalian dan Pembagian Pecahan serta Desimal',
          category: 'Operasi Pecahan & Desimal',
          description: 'Menghitung perkalian pecahan biasa, pecahan campuran, dan bilangan desimal persepuluhan.',
        },
        {
          title: 'Perbandingan (Rasio) dan Skala pada Peta / Denah Lokasi',
          category: 'Perbandingan & Skala',
          description: 'Menghitung jarak sebenarnya dan jarak pada peta berdasarkan skala yang diketahui.',
        },
        {
          title: 'Volume Bangun Ruang Kubus dan Balok Menggunakan Kubus Satuan dan Rumus Baku',
          category: 'Geometri Ruang',
          description: 'Menghitung volume ruang kubus (s³) dan balok (p x l x t) secara sistematis.',
        },
        {
          title: 'Jaring-Jaring Bangun Ruang Sederhana (Kubus dan Balok)',
          category: 'Geometri Ruang',
          description: 'Menganalisis pola jaring-jaring yang dapat membentuk bangun ruang tertutup.',
        },
        {
          title: 'Penyajian dan Analisis Data dalam Bentuk Diagram Garis',
          category: 'Analisis Data',
          description: 'Membaca tren kenaikan dan penurunan suhu, berat badan, atau penjualan dari waktu ke waktu.',
        },
        {
          title: 'Kecepatan dan Debit sebagai Perbandingan Besaran Terkait Waktu',
          category: 'Pengukuran Dinamis',
          description: 'Menghitung kecepatan rata-rata perjalanan dan debit aliran air keran per menit.',
        },
        {
          title: 'Pemecahan Masalah HOTS Bertingkat tentang Operasi Pecahan dan Persen',
          category: 'HOTS & Pemecahan Masalah',
          description: 'Menyelesaikan soal cerita diskon toko, pembagian warisan/tanah, dan resep masakan.',
        },
      ];
    }

    // Kelas 6
    return [
      {
        title: 'Operasi Hitung Campuran Bilangan Bulat Positif dan Negatif pada Garis Bilangan',
        category: 'Bilangan Bulat',
        description: 'Memahami penjumlahan, pengurangan, dan perkalian bilangan bulat dalam konteks suhu dan kedalaman.',
      },
      {
        title: 'Unsur-Unsur Lingkaran (Jari-Jari, Diameter, Busur, Tali Busur, Tembereng, Juring)',
        category: 'Geometri Lingkaran',
        description: 'Mengidentifikasi bagian-bagian lingkaran dan menghitung keliling lingkaran (K = 2πr).',
      },
      {
        title: 'Menghitung Luas Lingkaran (L = πr²) dan Luas Bangun Datar Gabungan',
        category: 'Geometri Terapan',
        description: 'Menghitung luas area taman berbentuk lingkaran dan pecahan juring lingkaran.',
      },
      {
        title: 'Luas Permukaan dan Volume Bangun Ruang (Prisma, Tabung, Limas, Kerucut)',
        category: 'Geometri Ruang',
        description: 'Menghitung volume kaleng tabung dan tenda prisma segitiga dengan formula baku.',
      },
      {
        title: 'Pengolahan Data Statistik: Menentukan Mean (Rata-rata), Median, dan Modus',
        category: 'Statistika & Data',
        description: 'Menghitung rata-rata nilai kelas, nilai tengah, dan data yang paling sering muncul.',
      },
      {
        title: 'Penyajian dan Interpretasi Data dalam Diagram Lingkaran (Persen & Derajat)',
        category: 'Analisis Data',
        description: 'Membaca persentase data hobi dan menghitung sudut juring pada diagram lingkaran.',
      },
      {
        title: 'Pemecahan Masalah Kontekstual Gabungan Volume dan Luas Permukaan Benda Nyata',
        category: 'HOTS & Pemecahan Masalah',
        description: 'Menyelesaikan studi kasus kapasitas bak mandi dan kebutuhan cat untuk mengecat ruangan.',
      },
      {
        title: 'Penerapan Peluang Kejadian Sederhana dalam Percobaan Melempar Dadu atau Koin',
        category: 'Peluang & Eksperimen',
        description: 'Mencatat frekuensi relatif dan memprediksi kemungkinan munculnya angka.',
      },
    ];
  }

  // 2. ILMU PENGETAHUAN ALAM DAN SOSIAL (IPAS)
  if (subLower.includes('ipas') || subLower.includes('alam') || subLower.includes('sosial')) {
    if (g === '1' || g === '2') {
      return [
        {
          title: 'Mengenal Panca Indra Manusia dan Fungsinya dalam Kehidupan Sehari-hari',
          category: 'Tubuh & Indra',
          description: 'Mengamati fungsi mata, telinga, hidung, lidah, dan kulit dalam merespons lingkungan.',
        },
        {
          title: 'Perubahan Wujud Benda: Benda Padat dan Benda Cair di Lingkungan Rumah',
          category: 'Zat & Benda',
          description: 'Mengamati sifat bentuk dan volume air serta batu saat dipindahkan ke wadah berbeda.',
        },
        {
          title: 'Mengenal Anggota Keluarga dan Peran Masing-Masing di Rumah',
          category: 'Sosial & Budaya',
          description: 'Menceritakan tugas ayah, ibu, dan anak serta pentingnya tolong-menolong di rumah.',
        },
        {
          title: 'Merawat Kebersihan Tubuh dan Makanan Bergizi untuk Pertumbuhan Sehat',
          category: 'Kesehatan Diri',
          description: 'Membiasakan cuci tangan pakai sabun, sikat gigi, dan mengonsumsi sayur serta buah.',
        },
        {
          title: 'Mengenal Bagian-Bagian Tumbuhan di Sekitar Sekolah (Akar, Batang, Daun, Bunga)',
          category: 'Makhluk Hidup',
          description: 'Mengamati tanaman di halaman sekolah dan menggambar bagian-bagian pentingnya.',
        },
        {
          title: 'Kondisi Cuaca (Cerah, Berawan, Hujan) dan Pengaruhnya terhadap Aktivitas Manusia',
          category: 'Bumi & Cuaca',
          description: 'Mencatat prakiraan cuaca sederhana dan pakaian/perlengkapan yang sesuai.',
        },
        {
          title: 'Mengenal Letak Ruangan di Sekolah dan Lingkungan Sekitar Rumah',
          category: 'Geografi Sederhana',
          description: 'Membuat denah sederhana perjalanan dari gerbang sekolah menuju ruang kelas.',
        },
        {
          title: 'Hewan Peliharaan dan Hewan Liar serta Cara Merawat Hewan dengan Kasih Sayang',
          category: 'Fauna & Ekosistem',
          description: 'Mengetahui makanan, tempat hidup, dan kewajiban menyayangi hewan ciptaan Tuhan.',
        },
      ];
    }

    if (g === '3') {
      return [
        {
          title: 'Metamorfosis Sempurna dan Tidak Sempurna pada Hewan (Kupu-Kupu & Katak)',
          category: 'Siklus Hidup Hewan',
          description: 'Mengurutkan tahapan daur hidup hewan dan membandingkan perubahannya.',
        },
        {
          title: 'Wujud Benda dan Perubahannya (Mencair, Membeku, Menguap, Mengembun, Menyublim)',
          category: 'Zat & Perubahan Wujud',
          description: 'Melakukan eksperimen sederhana perubahan es batu dan pembuatan agar-agar.',
        },
        {
          title: 'Mengenal Hewan Berdasarkan Jenis Makanannya (Herbivora, Karnivora, Omnivora)',
          category: 'Klasifikasi Hewan',
          description: 'Mengelompokkan hewan di sekitar dan menganalisis bentuk gigi serta makanannya.',
        },
        {
          title: 'Tradisi, Budaya, dan Makanan Khas di Daerah Tempat Tinggalku',
          category: 'Sosial Budaya',
          description: 'Mengenal kearifan lokal, baju adat, dan upacara tradisional suku bangsa di daerahku.',
        },
        {
          title: 'Denah Lokasi dan Mengenal Delapan Arah Mata Angin Menggunakan Kompas',
          category: 'Spasial & Denah',
          description: 'Membaca arah utara, timur, selatan, barat untuk menemukan lokasi fasilitas umum.',
        },
        {
          title: 'Mengenal Kebutuhan Pokok Manusia (Kebutuhan Primer, Sekunder, dan Tersier)',
          category: 'Ekonomi Dasar',
          description: 'Membedakan antara kebutuhan mendesak dan keinginan serta cara berhemat.',
        },
        {
          title: 'Hubungan Sumber Daya Alam dan Mata Pencaharian Penduduk di Dataran Rendah/Tinggi',
          category: 'Geografi Sosial',
          description: 'Menganalisis pekerjaan petani, nelayan, dan pedagang berdasarkan kondisi geografis.',
        },
        {
          title: 'Pengaruh Gaya Otot, Gaya Gesek, dan Gaya Magnet dalam Kehidupan Sehari-hari',
          category: 'Fisika Sederhana',
          description: 'Mempraktikkan pengaruh dorongan/tarikan terhadap gerak dan bentuk benda.',
        },
      ];
    }

    if (g === '4') {
      return [
        {
          title: 'Bagian Tubuh Tumbuhan dan Fungsinya serta Proses Fotosintesis',
          category: 'Biologi Tumbuhan',
          description: 'Menyelidiki bagaimana akar menyerap air dan daun memasak makanan dengan sinar matahari.',
        },
        {
          title: 'Macam-Macam Wujud Zat dan Perubahan Sifat Benda Akibat Perlakuan Suhu',
          category: 'Sains Eksperimen',
          description: 'Menganalisis kerapatan partikel padat, cair, dan gas serta peristiwa kalor.',
        },
        {
          title: 'Pengaruh Gaya terhadap Benda: Gaya Otot, Gesek, Gravitasi, dan Magnet',
          category: 'Fisika Terapan',
          description: 'Melakukan uji coba meluncurkan mobil mainan pada permukaan kasar dan licin.',
        },
        {
          title: 'Transformasi Energi di Sekitar Kita (Energi Listrik, Panas, Gerak, Bunyi, Cahaya)',
          category: 'Energi & Transformasi',
          description: 'Mengidentifikasi perubahan energi pada kipas angin, setrika, radio, dan baterai.',
        },
        {
          title: 'Kearifan Lokal dan Keberagaman Budaya Masyarakat Daerahku',
          category: 'Sosial & Kebudayaan',
          description: 'Menelusuri sejarah daerah, peninggalan bersejarah, dan pelestarian kesenian lokal.',
        },
        {
          title: 'Bentang Alam Indonesia dan Pemanfaatan Sumber Daya Alam secara Bijak',
          category: 'Geografi & Konservasi',
          description: 'Menganalisis manfaat sungai, laut, hutan, gunung serta bahaya eksploitasi berlebihan.',
        },
        {
          title: 'Mengenal Uang sebagai Alat Tukar dan Aktivitas Jual Beli di Pasar Tradisional/Modern',
          category: 'Literasi Finansial',
          description: 'Memahami fungsi uang, sejarah barter, serta cara mengelola uang jajan secara bijak.',
        },
        {
          title: 'Norma dan Peraturan di Lingkungan Tempat Tinggal serta Hak dan Kewajiban Warga',
          category: 'Kewarganegaraan Lingkungan',
          description: 'Menganalisis pentingnya mematuhi norma tertulis dan tidak tertulis demi ketertiban bersama.',
        },
      ];
    }

    if (g === '5') {
      return [
        {
          title: 'Sistem Organ Pernapasan pada Manusia dan Hewan serta Cara Memeliharanya',
          category: 'Biologi Manusia',
          description: 'Mempelajari alur oksigen dari hidung, trakea, hingga alveolus paru-paru.',
        },
        {
          title: 'Sistem Organ Pencernaan Manusia dan Gangguan Pencernaan serta Pola Gizi Seimbang',
          category: 'Biologi Manusia',
          description: 'Menelusuri perjalanan makanan dari mulut hingga usus besar dan penyakit maag/diare.',
        },
        {
          title: 'Rantai Makanan, Jaring-Jaring Makanan, dan Keseimbangan Ekosistem',
          category: 'Ekologi & Lingkungan',
          description: 'Menganalisis peran produsen, konsumen tingkat 1, 2, puncak, serta dekomposer.',
        },
        {
          title: 'Sifat-Sifat Cahaya dan Penerapannya (Merambat Lurus, Menembus, Dibiaskan, Dipantulkan)',
          category: 'Fisika Cahaya',
          description: 'Melakukan eksperimen bayangan, pensil terlihat patah di air, dan pelangi buatan.',
        },
        {
          title: 'Sifat Bunyi dan Perambatannya Melalui Benda Padat, Cair, dan Gas',
          category: 'Fisika Bunyi',
          description: 'Membuat telepon sederhana dari gelas plastik dan benang kasur untuk uji rambat bunyi.',
        },
        {
          title: 'Lapisan Bumi, Gunung Berapi, Gempa Bumi, dan Mitigasi Bencana Alam',
          category: 'Bumi & Antariksa',
          description: 'Mempelajari struktur litosfer, hidrosfer, atmosfer, dan simulasi penyelamatan diri saat gempa.',
        },
        {
          title: 'Kondisi Geografis Indonesia sebagai Negara Maritim dan Agraris',
          category: 'Geografi Indonesia',
          description: 'Menganalisis potensi perikanan, pertanian, dan jalur perdagangan strategis Indonesia.',
        },
        {
          title: 'Interaksi Sosial dan Aktivitas Ekonomi Masyarakat untuk Kesejahteraan Bersama',
          category: 'Ekonomi Sosial',
          description: 'Mengetahui peran koperasi, BUMN, UMKM, dan kegiatan distribusi barang antarprovinsi.',
        },
      ];
    }

    // Kelas 6
    return [
      {
        title: 'Sistem Tata Surya: Karakteristik Planet dan Pergerakan Bumi (Rotasi & Revolusi)',
        category: 'Astronomi & Bumi',
        description: 'Menganalisis terjadinya siang-malam, perbedaan waktu dunia, dan pergantian musim.',
      },
      {
        title: 'Gerhana Bulan dan Gerhana Matahari serta Fase-Fase Kenampakan Bulan',
        category: 'Astronomi Terapan',
        description: 'Membuat model peraga posisi matahari, bumi, dan bulan saat terjadi umbra dan penumbra.',
      },
      {
        title: 'Perkembangbiakan Generatif dan Vegetatif pada Tumbuhan (Cangkok, Stek, Okulasi)',
        category: 'Biologi Reproduksi',
        description: 'Mempraktikkan teknik vegetatif buatan dan mengamati struktur serbuksari pada bunga.',
      },
      {
        title: 'Penyesuaian Diri (Adaptasi Morfologi, Fisiologi, Tingkah Laku) Hewan dan Tumbuhan',
        category: 'Adaptasi Makhluk Hidup',
        description: 'Menganalisis kantung semar, kaktus, bunglon, dan bebek dalam bertahan hidup di habitatnya.',
      },
      {
        title: 'Rangkaian Listrik Seri dan Paralel serta Penggunaan Energi Listrik Ramah Lingkungan',
        category: 'Fisika Listrik',
        description: 'Merakit sakelar, lampu bohlam kecil, dan baterai serta mengamati nyala lampu.',
      },
      {
        title: 'Pengaruh Globalisasi terhadap Kebudayaan, Teknologi, dan Ekonomi Masyarakat Indonesia',
        category: 'Sosial Global',
        description: 'Menimbang dampak positif dan negatif internet, produk impor, dan pelestarian jati diri bangsa.',
      },
      {
        title: 'Peran Indonesia dalam Kerjasama ASEAN di Bidang Ekonomi, Politik, dan Sosial Budaya',
        category: 'Hubungan Internasional',
        description: 'Menelusuri sejarah Deklarasi Bangkok, pertukaran pelajar, dan festival budaya ASEAN.',
      },
      {
        title: 'Pemanfaatan Energi Alternatif (Matahari, Angin, Air, Biogas) untuk Mengurangi Emisi',
        category: 'Teknologi Ramah Lingkungan',
        description: 'Merancang ide pembangkit listrik tenaga surya sederhana untuk kebutuhan masa depan.',
      },
    ];
  }

  // 3. BAHASA INDONESIA
  if (subLower.includes('indonesia')) {
    if (g === '1' || g === '2') {
      return [
        {
          title: 'Mengenal Bunyi Huruf Vokal dan Konsonan pada Kata Benda di Sekitar Kita',
          category: 'Literasi Awal',
          description: 'Mengeja, melafalkan bunyi huruf dengan artikulasi jelas, dan mencocokkan dengan gambar.',
        },
        {
          title: 'Membaca Cerita Fabel Bergambar dan Menemukan Karakter Tokoh serta Pesan Moral',
          category: 'Membaca & Pemahaman',
          description: 'Menceritakan kembali alur dongeng hewan fabel dan menyebutkan perbuatan baik tokoh.',
        },
        {
          title: 'Menulis Kalimat Sederhana Menggunakan Huruf Kapital dan Tanda Titik (.)',
          category: 'Tata Bahasa & Menulis',
          description: 'Menyusun kata acak menjadi kalimat yang bermakna dengan ejaan yang rapi.',
        },
        {
          title: 'Mengenal Kosakata Ungkapan Tolong, Maaf, Terima Kasih, dan Permisi',
          category: 'Keterampilan Berbahasa',
          description: 'Mempraktikkan percakapan santun dalam situasi sehari-hari di rumah dan sekolah.',
        },
        {
          title: 'Mendeskripsikan Ciri-Ciri Benda dan Hewan Kesayangan secara Lisan dan Tulisan',
          category: 'Teks Deskripsi',
          description: 'Menulis 3-4 kalimat tentang warna, bentuk, dan kebiasaan hewan peliharaan.',
        },
        {
          title: 'Membaca Nyaring Kata Berima dan Menirukan Puisi Anak Sederhana',
          category: 'Apresiasi Sastra',
          description: 'Membacakan puisi anak bertema keluarga dan alam dengan intonasi gembira.',
        },
        {
          title: 'Membedakan Kalimat Ajakan, Perintah, dan Penolakan yang Santun',
          category: 'Pragmatik & Komunikasi',
          description: 'Menggunakan kata "Ayo", "Mari", "Harap", dan "Maaf tidak bisa" dengan benar.',
        },
        {
          title: 'Membaca Petunjuk Arah Sederhana dan Rambu-Rambu Keselamatan di Sekolah',
          category: 'Membaca Fungsional',
          description: 'Menafsirkan simbol gambar jalur evakuasi, buang sampah, dan hati-hati tangga licin.',
        },
      ];
    }

    if (g === '3' || g === '4') {
      return [
        {
          title: 'Menemukan Ide Pokok dan Kalimat Pendukung dalam Paragraf Teks Narasi',
          category: 'Pemahaman Membaca',
          description: 'Menggarisbawahi gagasan utama dan membedakan informasi penting dari penjelas.',
        },
        {
          title: 'Menulis Teks Petunjuk Penggunaan / Petunjuk Membuat Sesuatu (Teks Prosedur)',
          category: 'Menulis Fungsional',
          description: 'Menulis langkah-langkah membuat kerajinan atau resep minuman sehat secara urut.',
        },
        {
          title: 'Mengenal Awalan me- (Menulis, Membaca, Menggambar) dan Maknanya pada Kata Kerja',
          category: 'Morfologi & Ejaan',
          description: 'Mengubah kata dasar menjadi kata berimbuhan me- dengan peluluhan huruf yang tepat.',
        },
        {
          title: 'Menulis Paragraf Deskripsi tentang Tempat Wisata Lokal atau Bangunan Bersejarah',
          category: 'Teks Deskripsi',
          description: 'Mengembangkan panca indra penglihatan, pendengaran, dan penciuman ke dalam teks naratif.',
        },
        {
          title: 'Menyimak Cerita Rakyat Daerah dan Mengidentifikasi Unsur Intrinsik (Tema, Tokoh, Latar)',
          category: 'Apresiasi Cerita',
          description: 'Menjawab pertanyaan 5W+1H (Apa, Siapa, Kapan, Di mana, Mengapa, Bagaimana) dari dongeng.',
        },
        {
          title: 'Melakukan Wawancara Sederhana dengan Tokoh di Sekolah (Guru, Petugas Kebersihan, Penjaga)',
          category: 'Wawancara & Komunikasi',
          description: 'Menyusun daftar pertanyaan sopan dan mencatat intisari jawaban narasumber.',
        },
        {
          title: 'Membuat Poster Iklan Layanan Masyarakat tentang Hemat Air dan Jaga Kebersihan',
          category: 'Kreativitas Visual & Teks',
          description: 'Memadukan kalimat persuasif yang berima dengan ilustrasi gambar yang menarik pembaca.',
        },
        {
          title: 'Mengenal Majas Personifikasi dan Metafora Sederhana dalam Puisi Anak',
          category: 'Gaya Bahasa',
          description: 'Menemukan ungkapan seperti "angin berbisik" dan "pohon melambai" dalam bait puisi.',
        },
      ];
    }

    // Kelas 5 & 6
    return [
      {
        title: 'Menulis Teks Eksplanasi Ilmiah tentang Fenomena Alam (Hujan, Gunung Meletus, Pelangi)',
        category: 'Teks Eksplanasi',
        description: 'Menyusun teks yang memuat pernyataan umum, deretan sebab-akibat, dan interpretasi kesimpulan.',
      },
      {
        title: 'Menganalisis Unsur Intrinsik Cerpen (Tema, Alur Maju/Mundur, Sudut Pandang, Amanat)',
        category: 'Analisis Sastra',
        description: 'Membuat diagram alur plot cerita dan mendalami konflik batin tokoh utama.',
      },
      {
        title: 'Menulis Teks Pidato Persuasif Bertema Cinta Tanah Air dan Pelestarian Lingkungan',
        category: 'Keterampilan Berpidato',
        description: 'Menyusun struktur salam pembuka, pengantar, isi argumen kuat, dan kalimat imbauan penutup.',
      },
      {
        title: 'Membuat Teks Formulir Pendaftaran, Daftar Riwayat Hidup, dan Bukti Pengiriman Barang',
        category: 'Teks Fungsional Resmi',
        description: 'Mengisi kolom data pribadi, tanggal lahir, prestasi, dan alamat tujuan dengan cermat.',
      },
      {
        title: 'Membedakan Fakta dan Opini dalam Artikel Berita Surat Kabar atau Media Daring',
        category: 'Literasi Kritis',
        description: 'Menganalisis kebenaran sumber data angka vs pendapat subjektif penulis berita.',
      },
      {
        title: 'Menulis Laporan Hasil Pengamatan (Observasi) terhadap Keanekaragaman Hayati di Sekolah',
        category: 'Teks Laporan Hasil Observasi',
        description: 'Menyajikan data fakta objektif berdasarkan hasil pengamatan langsung di lapangan.',
      },
      {
        title: 'Mengenal Pantun Nasihat, Pantun Jenaka, dan Menulis Sampiran serta Isi Berima A-B-A-B',
        category: 'Sastra Tradisional',
        description: 'Menganalisis syarat 4 baris, 8-12 suku kata per baris, dan membuat bait pantun sendiri.',
      },
      {
        title: 'Menulis Resensi Buku Cerita: Sinopsis Singkat, Kelebihan, dan Kekurangan Buku',
        category: 'Apresiasi & Kritik Sastra',
        description: 'Memberikan penilaian objektif atas alur cerita dan tampilan ilustrasi buku bacaan.',
      },
    ];
  }

  // 4. PENDIDIKAN PANCASILA
  if (subLower.includes('pancasila')) {
    if (g === '1' || g === '2') {
      return [
        {
          title: 'Mengenal Simbol-Simbol Garuda Pancasila (Bintang, Rantai, Pohon Beringin, Banteng, Padi-Kapas)',
          category: 'Simbol Negara',
          description: 'Mencocokkan simbol sila dengan bunyi sila pertama hingga kelima secara runtut.',
        },
        {
          title: 'Penerapan Nilai Sila Pertama dan Kedua dalam Sikap Sopan Santun kepada Orang Tua',
          category: 'Karakter & Moral',
          description: 'Menunjukkan sikap berdoa sebelum belajar dan gemar membantu sesama anggota keluarga.',
        },
        {
          title: 'Aturan dan Tata Tertib yang Berlaku di Rumah dan di Ruang Kelas',
          category: 'Norma & Aturan',
          description: 'Mengetahui waktu tidur, merapikan mainan sendiri, dan tidak bersuara keras saat guru menerangkan.',
        },
        {
          title: 'Menghargai Keberagaman Karakteristik Fisik, Hobi, dan Asal Suku Teman Sekelas',
          category: 'Bhinneka Tunggal Ika',
          description: 'Bermain rukun tanpa membeda-bedakan warna kulit, bentuk rambut, dan jenis permainan kesukaan.',
        },
        {
          title: 'Mengenal Hak dan Kewajiban Anak di Lingkungan Keluarga dan Sekolah',
          category: 'Hak & Kewajiban',
          description: 'Mengetahui hak mendapat kasih sayang serta kewajiban belajar dan menjaga kebersihan.',
        },
        {
          title: 'Sikap Gotong Royong Membersihkan Ruang Kelas dan Halaman Bersama Teman',
          category: 'Gotong Royong',
          description: 'Bekerja sama menyapu, mengepel, dan membuang sampah pada tempatnya dengan gembira.',
        },
        {
          title: 'Mengenal Identitas Diri, Teman, dan Makna Bendera Merah Putih serta Lagu Kebangsaan',
          category: 'Kebangsaan',
          description: 'Menyanyikan lagu Indonesia Raya dengan sikap tegap dan menghormati bendera pusaka.',
        },
        {
          title: 'Menyelesaikan Perselisihan Permainan dengan Cara Minta Maaf dan Bermusyawarah',
          category: 'Musyawarah & Perdamaian',
          description: 'Belajar mendengarkan pendapat teman dan tidak memaksakan kehendak saat bermain.',
        },
      ];
    }

    return [
      {
        title: 'Makna Sila-Sila Pancasila dan Aktualisasi Nilai Gotong Royong di Lingkungan Sekitar',
        category: 'Nilai-Nilai Luhur',
        description: 'Menganalisis butir-butir sila Pancasila dalam perbuatan nyata bermasyarakat.',
      },
      {
        title: 'Norma Kesusilaan, Kesopanan, Agama, dan Hukum dalam Kehidupan Berbangsa',
        category: 'Norma Sosial & Hukum',
        description: 'Membedakan jenis-jenis norma, sanksi pelanggaran, dan pentingnya budaya tertib hukum.',
      },
      {
        title: 'Pelaksanaan Hak dan Kewajiban Warga Negara secara Seimbang sesuai UUD 1945',
        category: 'Hak & Kewajiban',
        description: 'Menganalisis dampak jika kewajiban diabaikan dan hak dituntut secara berlebihan.',
      },
      {
        title: 'Musyawarah Mufakat dalam Pengambilan Keputusan Pemilihan Ketua Kelas / Kegiatan Sekolah',
        category: 'Demokrasi Pancasila',
        description: 'Mempraktikkan cara menyampaikan usulan secara santun dan menerima hasil mufakat secara ikhlas.',
      },
      {
        title: 'Keberagaman Rumah Adat, Tarian Daerah, Pakaian Tradisional, dan Senjata Khas Nusantara',
        category: 'Bhinneka Tunggal Ika',
        description: 'Menjelajahi keunikan budaya dari Sabang sampai Merauke serta pentingnya saling menghargai.',
      },
      {
        title: 'Menjaga Persatuan dan Kesatuan NKRI dari Bahaya Intoleransi dan Sikap Etnosentrisme',
        category: 'Bela Negara & Persatuan',
        description: 'Menganalisis contoh peristiwa yang memicu perpecahan dan solusi damai menjunjung toleransi.',
      },
      {
        title: 'Sejarah Perumusan Pancasila oleh BPUPKI dan Semangat Juang Para Pendiri Bangsa',
        category: 'Sejarah Konstitusi',
        description: 'Meneladani pengorbanan Ir. Soekarno, Moh. Hatta, dan tokoh nasional dalam Piagam Jakarta.',
      },
      {
        title: 'Penerapan Sikap Antikorupsi Sejak Dini: Kejujuran, Disiplin, dan Tanggung Jawab',
        category: 'Pendidikan Karakter',
        description: 'Menjaga integritas saat mengerjakan ujian, mengembalikan barang temuan, dan menepati janji.',
      },
    ];
  }

  // 5. PENDIDIKAN AGAMA DAN BUDI PEKERTI
  if (subLower.includes('agama')) {
    return [
      {
        title: 'Membaca Ayat-Ayat Al-Qur\'an / Kitab Suci Pilihan dengan Tartil dan Tajwid yang Benar',
        category: 'Pemahaman Kitab Suci',
        description: 'Menerapkan bacaan tartil, menghafal surat pendek, dan memahami kandungan maknanya.',
      },
      {
        title: 'Mengenal Asmaul Husna / Sifat-Sifat Mulia Tuhan dan Keteladanan dalam Kehidupan Nyata',
        category: 'Keimanan & Akidah',
        description: 'Meresapi sifat Pengasih, Penyayang, Adil, dan Bijaksana dalam memperlakukan makhluk lain.',
      },
      {
        title: 'Keteladanan Kisah Nabi dan Rasul / Tokoh Suci dalam Menghadapi Ujian Kesabaran',
        category: 'Kisah Teladan',
        description: 'Meneladani kejujuran, keteguhan iman, dan akhlak pemaaf para tokoh inspiratif agama.',
      },
      {
        title: 'Tata Cara Bersuci (Wudhu / Tayamum / Mandi) dan Praktik Ibadah Shalat Fardhu',
        category: 'Ibadah & Fiqih',
        description: 'Menyempurnakan gerakan dan bacaan doa ibadah secara khusyuk dan tertib.',
      },
      {
        title: 'Akhlak Terpuji kepada Orang Tua (Birrul Walidain), Guru, dan Teman Sebaya',
        category: 'Akhlak & Moral',
        description: 'Berbicara dengan nada lemah lembut, mendoakan orang tua, dan menghormati bimbingan guru.',
      },
      {
        title: 'Membiasakan Sedekah, Infaq, Tolong Menolong, dan Gemar Berbagi kepada Kaum Duafa',
        category: 'Kepedulian Sosial',
        description: 'Menumbuhkan rasa empati terhadap orang yang membutuhkan dan tidak berperilaku kikir.',
      },
      {
        title: 'Menjaga Kebersihan Lingkungan Tempat Ibadah dan Menyayangi Tumbuhan serta Hewan',
        category: 'Etika Lingkungan Hidup',
        description: 'Memahami bahwa kebersihan adalah sebagian dari iman dan bukti syukur atas nikmat Tuhan.',
      },
      {
        title: 'Sikap Toleransi dan Kerukunan Antarumat Beragama dalam Bingkai Moderasi Beragama',
        category: 'Moderasi Beragama',
        description: 'Menghormati hari besar keagamaan teman yang berbeda agama dengan suasana damai.',
      },
    ];
  }

  // 6. PJOK (PENDIDIKAN JASMANI, OLAHRAGA, DAN KESEHATAN)
  if (subLower.includes('pjok') || subLower.includes('jasmani') || subLower.includes('olahraga')) {
    return [
      {
        title: 'Variasi dan Kombinasi Gerak Dasar Lokomotor (Jalan, Lari, Lompat) Melalui Lintasan Rintangan',
        category: 'Kebugaran & Gerak Dasar',
        description: 'Melatih kelincahan dan koordinasi kaki melewati corong kerucut dan kardus rintangan.',
      },
      {
        title: 'Gerak Non-Lokomotor: Memutar Tubuh, Menekuk Lutut, dan Mengayun Lengan untuk Kelenturan',
        category: 'Pemanasan & Statis',
        description: 'Melakukan gerakan peregangan dinamis dan statis sebelum beraktivitas olahraga.',
      },
      {
        title: 'Gerak Manipulatif: Melempar, Menangkap, dan Memukul Bola pada Permainan Kasti / Rounders',
        category: 'Permainan Bola Kecil',
        description: 'Melatih ketepatan lemparan bola melambung, mendatar, dan memukul dengan tongkat kayu.',
      },
      {
        title: 'Teknik Dasar Menendang, Menggiring, dan Menghentikan Bola pada Permainan Sepak Bola',
        category: 'Permainan Bola Besar',
        description: 'Mempraktikkan passing kaki bagian dalam dan dribbling zig-zag dengan kontrol bola baik.',
      },
      {
        title: 'Senam Lantai: Gerakan Guling Depan (Forward Roll) dan Sikap Lilin di Atas Matras',
        category: 'Senam Ketangkasan',
        description: 'Mempelajari teknik keselamatan mendaratkan tengkuk dan menjaga keseimbangan tubuh.',
      },
      {
        title: 'Aktivitas Gerak Berirama: Senam Irama Sederhana Mengikuti Ketukan Musik Daerah',
        category: 'Gerak Berirama',
        description: 'Menyelaraskan langkah kaki, ayunan tangan, dan irama ketukan secara kompak bersama tim.',
      },
      {
        title: 'Mengenal Makanan Bergizi Seimbang (Isi Piringku) dan Dampak Mengonsumsi Jajanan Berbahaya',
        category: 'Pendidikan Kesehatan',
        description: 'Membedakan karbohidrat, protein, vitamin, dan bahaya pengawet/pewarna sintetis.',
      },
      {
        title: 'Pertolongan Pertama pada Kecelakaan (P3K) Sederhana pada Luka Lecet dan Memar saat Olahraga',
        category: 'Keselamatan Diri',
        description: 'Mencuci luka dengan antiseptik, mengompres air dingin, dan membalut kasa dengan rapi.',
      },
    ];
  }

  // 7. SENI RUPA
  if (subLower.includes('seni rupa')) {
    return [
      {
        title: 'Eksplorasi Garis, Bentuk Geometris, dan Pencampuran Warna Primer Menjadi Warna Sekunder',
        category: 'Unsur Seni Rupa',
        description: 'Mencampurkan cat merah, kuning, dan biru untuk menghasilkan hijau, oranye, dan ungu.',
      },
      {
        title: 'Membuat Karya Kolase dan Mozaik Menggunakan Bahan Alam (Biji-bijian, Daun Kering, Ranting)',
        category: 'Kriya Bahan Alam',
        description: 'Menempelkan biji jagung dan kacang hijau pada pola gambar hewan dengan rapi dan teliti.',
      },
      {
        title: 'Teknik Cetak Tinggi Sederhana Menggunakan Pelepah Pisang dan Sayuran (Stempel Motif)',
        category: 'Seni Grafis Cetak',
        description: 'Mengecap permukaan cat air pada kertas gambar untuk menciptakan pola tekstil berulang.',
      },
      {
        title: 'Menggambar Ilustrasi Cerita Pendek dengan Prinsip Proporsi dan Gelap Terang (Arsir)',
        category: 'Menggambar & Ilustrasi',
        description: 'Membuat adegan cerita rakyat dengan teknik arsiran pensil untuk kesan bayangan 3 dimensi.',
      },
      {
        title: 'Membuat Kerajinan Anyaman Tunggal dan Ganda dari Kertas Warna-Warni',
        category: 'Kriya Tradisional',
        description: 'Menyusun bilah-bilah kertas selang-seling untuk menghasilkan pola kotak-kotak hiasan dinding.',
      },
      {
        title: 'Mendesain Motif Batik Tradisional Sederhana Khas Nusantara (Kawung / Parang / Megamendung)',
        category: 'Ragam Hias Nusantara',
        description: 'Menggambar sketsa pola geometris batik dan mewarnainya dengan harmoni warna kontras.',
      },
      {
        title: 'Membuat Patung Miniatur Tiga Dimensi dari Plastisin atau Tanah Liat',
        category: 'Seni Patung 3D',
        description: 'Membentuk massa plastisin dengan memijit, memilin, dan merakit menjadi miniatur buah atau hewan.',
      },
      {
        title: 'Pemanfaatan Sampah Plastik dan Kardus Bekas Menjadi Produk Kriya Fungsional (Tempat Pensil)',
        category: 'Daur Ulang & Desain',
        description: 'Memotong botol plastik bekas dan menghiasnya dengan kain flanel menjadi organizer meja.',
      },
    ];
  }

  // 8. SENI MUSIK, TARI, TEATER
  if (subLower.includes('musik') || subLower.includes('tari') || subLower.includes('teater')) {
    return [
      {
        title: 'Mengenal Pola Irama, Birama (2/4, 3/4, 4/4), dan Ketukan Lagu Anak Nasional',
        category: 'Irama & Ketukan',
        description: 'Bertepuk tangan dan memainkan alat musik ritmis marakas sesuai tanda ketukan.',
      },
      {
        title: 'Menyanyikan Lagu Daerah Nusantara dengan Artikulasi, Pernapasan Diafragma, dan Nada Tepat',
        category: 'Vokal & Nyanyi',
        description: 'Menyanyikan lagu Bungong Jeumpa / Ampar-Ampar Pisang dengan penghayatan makna lirik.',
      },
      {
        title: 'Membuat Alat Musik Perkusi Sederhana dari Kaleng Biskuit, Botol Kaca, dan Bambu',
        category: 'Eksplorasi Bunyi',
        description: 'Mengisi botol dengan air pada ketinggian berbeda untuk menghasilkan tangga nada variatif.',
      },
      {
        title: 'Mengenal Gerak Dasar Tari Tradisional: Sikap Kaki, Gerakan Tangan, dan Ayunan Kepala',
        category: 'Seni Tari',
        description: 'Mempraktikkan gerak ukel, mendak, dan seblak selendang dengan kelembutan gerak.',
      },
      {
        title: 'Pementasan Tari Kreasi Baru Bertema Kelestarian Alam Bersama Kelompok Tari',
        category: 'Tari Kreasi',
        description: 'Mengombinasikan gerak tari meniru gerakan kupu-kupu dan desiran angin secara kompak.',
      },
      {
        title: 'Bermain Peran (Role Play) Sederhana: Menirukan Ekspresi Emosi (Senang, Sedih, Takut, Marah)',
        category: 'Seni Teater',
        description: 'Melatih mimik muka, vokal intonasi, dan gestur tubuh dalam adegan drama mini fabel.',
      },
      {
        title: 'Mengenal Notasi Angka Sederhana (Do, Re, Mi, Fa, Sol, La, Si, Do) pada Pianika',
        category: 'Instrumen Melodis',
        description: 'Meniup pianika dengan posisi penjarian lima jari yang benar memainkan melodi Ibu Kita Kartini.',
      },
      {
        title: 'Membuat Naskah Drama Pendek Bertema Tolong-Menolong dan Mementaskannya di Depan Kelas',
        category: 'Pentas Drama',
        description: 'Membagi peran protagonis, antagonis, properti panggung, dan menyampaikan pesan kebaikan.',
      },
    ];
  }

  // 9. BAHASA INGGRIS
  if (subLower.includes('inggris')) {
    return [
      {
        title: 'Self Introduction and Greetings: "Hello, My Name is...", "How Are You?"',
        category: 'Daily Conversation',
        description: 'Memperkenalkan nama, umur, dan hobi menggunakan frasa bahasa Inggris sederhana.',
      },
      {
        title: 'Things in the Classroom and School Supplies (Book, Pencil, Eraser, Ruler, Bag)',
        category: 'Vocabulary',
        description: 'Menyebutkan benda di kelas dalam bentuk singular dan plural ("a pencil" / "two pencils").',
      },
      {
        title: 'Colors, Shapes, and Counting Numbers 1 to 100 in Fun Games',
        category: 'Basic Language',
        description: 'Mendeskripsikan benda: "The red apple is big", "Three blue balloons".',
      },
      {
        title: 'My Family Members and Describing People (Father, Mother, Brother, Sister)',
        category: 'Family & Identity',
        description: 'Menceritakan anggota keluarga: "My father is tall", "My mother has long hair".',
      },
      {
        title: 'Days of the Week, Months of the Year, and Telling Time (O\'clock, Half Past)',
        category: 'Time & Calendar',
        description: 'Menyebutkan hari: "Today is Monday", "It is seven o\'clock in the morning".',
      },
      {
        title: 'Animals in the Zoo, Farm Animals, and Their Habitats (Tiger, Cow, Duck, Monkey)',
        category: 'Animal Kingdom',
        description: 'Mempelajari kata sifat: "The elephant is huge", "The rabbit can hop fast".',
      },
      {
        title: 'Daily Activities and Simple Present Tense: "I wake up at 5", "I brush my teeth"',
        category: 'Grammar & Routine',
        description: 'Menuliskan rutinitas harian anak dari pagi hingga malam dalam kalimat pendek.',
      },
      {
        title: 'Food, Drinks, and Ordering in a Restaurant: "I would like a glass of milk, please"',
        category: 'Functional Dialogue',
        description: 'Mempraktikkan percakapan sopan memesan makanan dan menyebut rasa (sweet, sour, salty).',
      },
    ];
  }

  // 10. DEFAULT / UMUM
  return [
    {
      title: `Pemahaman Konsep Esensial dan Karakteristik Materi ${subject} Kelas ${g}`,
      category: 'Konsep Dasar',
      description: `Menganalisis prinsip inti dan teori dasar pembelajaran ${subject} secara runtut.`,
    },
    {
      title: `Eksplorasi Fakta dan Fenomena Nyata Terkait Materi ${subject} di Sekitar Kita`,
      category: 'Studi Kontekstual',
      description: `Mengaitkan materi pokok dengan contoh nyata dalam kehidupan sehari-hari siswa.`,
    },
    {
      title: `Aktivitas Penyelidikan Mandiri dan Kolaboratif Materi ${subject}`,
      category: 'Praktik & Eksplorasi',
      description: `Melakukan langkah penyelidikan langsung untuk membuktikan konsep yang dipelajari.`,
    },
    {
      title: `Pemecahan Masalah Kontekstual (HOTS) Materi ${subject} Kelas ${g}`,
      category: 'HOTS & Penalaran',
      description: `Menyelesaikan studi kasus penalaran tingkat tinggi dan merumuskan argumen solusi.`,
    },
    {
      title: `Proyek Kreatif dan Pembuatan Produk Sederhana Berbasis Materi ${subject}`,
      category: 'Proyek Kolaborasi',
      description: `Menghasilkan karya visual atau laporan rangkuman kreatif secara berkelompok.`,
    },
    {
      title: `Literasi dan Analisis Teks Bacaan Informatif Terkait Materi ${subject}`,
      category: 'Penguatan Literasi',
      description: `Membaca teks ulasan materi, menemukan informasi kunci, dan menarik kesimpulan.`,
    },
    {
      title: `Numerasi dan Pengolahan Informasi Kuantitatif Materi ${subject}`,
      category: 'Penguatan Numerasi',
      description: `Mengolah data tabel, grafik, atau besaran hitung terkait materi yang dipelajari.`,
    },
    {
      title: `Refleksi Pembelajaran dan Implementasi Nilai Profil Pelajar Pancasila`,
      category: 'Refleksi & Karakter',
      description: `Menyimpulkan manfaat materi bagi diri sendiri, keluarga, dan kelestarian lingkungan.`,
    },
  ];
}
