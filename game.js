/**
 * Simulasi Kehidupan & Strategi Finansial (Game Master Engine)
 * Realistic Economic Engine, Probabilistic Outcomes & Second-Order Tracking
 */

// Initial Base State
const INITIAL_STATE = {
  round: 1,
  maxRounds: 20,
  age: 36,
  quarter: 1, // tiap ronde setara 1 kuartal (3 bulan)
  cash: 45000000,
  incomeActive: 22000000, // per bulan
  incomePassive: 150000, // per bulan
  expenses: 17500000, // per bulan
  debtMonthly: 1200000,
  debtTotal: 8400000,
  stamina: 85, // 0 - 100
  stress: 35, // 0 - 100
  freeHours: 15, // jam/minggu
  
  // Aset selain kas
  assets: [
    { id: 'motor', name: 'Motor Harian', value: 14000000, liquid: true },
    { id: 'gadget', name: 'Laptop Kerja & Gadget', value: 12000000, liquid: false }
  ],
  
  // Bisnis & Venture
  businesses: [],

  // Skills
  skills: [
    { name: 'Backend Engineering (Senior)', level: 'Tinggi', category: 'tech' },
    { name: 'AI & LLM Tooling', level: 'Dasar', category: 'tech' },
    { name: 'Sales & Distribution', level: 'Sangat Rendah', category: 'biz' },
    { name: 'Manajemen Keuangan', level: 'Menengah-Bawah', category: 'finance' }
  ],

  // Reputasi & Relasi
  reputation: 'Senior Dev Terpercaya di Agensi',
  networkQuality: 40, // 0 - 100

  // Riwayat Keputusan
  history: [],
  netWorthHistory: [62600000],
  
  // Target Milestones
  targets: [
    { id: 'emergency_fund', label: 'Dana Darurat 6 Bulan (Rp 105.000.000)', achieved: false },
    { id: 'school_fund', label: 'Biaya Masuk SD Anak (Rp 25.000.000)', achieved: false },
    { id: 'debt_free', label: 'Bebas Seluruh Utang Konsumtif', achieved: false },
    { id: 'first_side_asset', label: 'Memiliki Sumber Arus Kas Selain Gaji Agensi', achieved: false },
    { id: 'fi_target', label: 'Kebebasan Finansial (Kas Pasif > Pengeluaran)', achieved: false }
  ],

  // Flags & Second-Order Triggers
  flags: {
    burnoutAlert: false,
    aiSpecialist: false,
    agencyDownsizingSeen: false,
    freelanceClientNetwork: 0,
    hasSubcontractors: false,
    saasLaunched: false,
    firedFromJob: false
  }
};

let gameState = JSON.parse(JSON.stringify(INITIAL_STATE));
let netWorthChartInstance = null;

// Skenario 20 Ronde yang saling berkaitan dengan second-order effects
const SCENARIOS = {
  1: {
    title: "Tawaran Freelance Logistik vs Disrupsi AI",
    roundTitle: "RONDE 1 : PERSIMPANGAN DISRUPSI AI & KAS MIKRO",
    macro: "Tech winter berlanjut; klien agensi menuntut efisiensi biaya. Kenaikan gaji kantor dibekukan tahun ini (0%).",
    story: `Anda berusia 36 tahun dengan 1 anak usia 5 tahun yang butuh biaya masuk SD dalam 10 bulan ke depan (Rp 25.000.000). Dana darurat Anda saat ini baru menutupi sekitar 2,5 bulan pengeluaran keluarga.
    
Seorang mantan Product Manager agensi Anda yang kini di startup logistik menawarkan proyek integrasi API paruh waktu selama 3 bulan dengan nilai kontrak bersih Rp 35.000.000 (menuntut 18-20 jam/minggu). Di saat yang sama, tim internal Anda di agensi mulai bereksperimen dengan automated AI coding tools, membuat Anda sadar bahwa skill backend murni Anda sedang terancam komoditisasi.

Bagaimana Anda mengalokasikan 15 jam waktu luang dan modal Anda selama 3 bulan ke depan?`,
    choices: [
      {
        id: "A",
        name: "Ambil Kontrak Freelance Penuh Sendiri",
        capitalReq: "Rp 0",
        roi: "Pasti Rp 35.000.000 (kas instan)",
        risk: "Stres melonjak, risiko burnout, jam kerja utama terganggu",
        oppCost: "Nol waktu untuk belajar AI & nol waktu keluarga",
        timeImpact: "Menghabiskan 18-20 jam/minggu (defisit tidur)",
        type: "Reversible (3 Bulan)",
        typeClass: "badge-reversible",
        execute: (state) => {
          // Kas bertambah, sisa utang motor berkurang 3 bulan
          state.cash += 35000000;
          state.stress += 35;
          state.stamina -= 25;
          state.flags.freelanceClientNetwork += 1;
          return {
            title: "Uang Masuk, Namun Tubuh Anda Mulai Membayar Harganya",
            narration: "Anda lembur larut malam selama 3 bulan berturut-turut. Klien logistik puas dan melunasi kontrak Rp 35.000.000 penuh waktu! Uang sekolah anak berhasil diamankan. Namun, di kantor utama Anda ditegur manajer karena beberapa kali terlambat daily standup dan tampak lelah. Stamina Anda turun tajam.",
            impacts: [
              "+ Rp 35.000.000 kas bersih masuk",
              "+35 Beban Stres, -25 Stamina",
              "Relasi klien logistik terbentuk",
              "Peringatan informal dari atasan kantor utama"
            ]
          };
        }
      },
      {
        id: "B",
        name: "Tolak Freelance, Fokus Upskilling AI & Otomasi Kantor",
        capitalReq: "Rp 2.500.000 (Tools & Kursus Terapan)",
        roi: "Peluang naik peran Lead/Architect & proteksi dari PHK",
        risk: "Kehilangan Rp 35 jt tunai; agency tetap berisiko restrukturisasi",
        oppCost: "Uang sekolah anak belum aman",
        timeImpact: "10-12 jam/minggu untuk belajar mendalam",
        type: "Human Capital Investment",
        typeClass: "badge-leverage",
        execute: (state) => {
          state.cash -= 2500000;
          state.stress -= 5;
          state.stamina -= 5;
          state.skills.find(s => s.name === 'AI & LLM Tooling').level = 'Mahir (Agentic & Workflow)';
          state.flags.aiSpecialist = true;
          state.reputation = 'Inovator AI Internal di Agensi';
          return {
            title: "Menjadi Pelopor AI di Agensi",
            narration: "Anda merancang workflow otomatisasi koding internal yang mempercepat delivery agensi hingga 30%. Manajemen kantor kagum. Anda diposisikan sebagai kandidat Tech Lead untuk inisiatif baru. Namun secara finansial kas Anda berkurang Rp 2,5 jt dan biaya sekolah anak masih menjadi tanda tanya besar.",
            impacts: [
              "- Rp 2.500.000 untuk kursus & API kredensial",
              "Skill AI & LLM meningkat ke tingkat Mahir",
              "Reputasi di kantor melonjak signifikan",
              "Kas tidak bertambah, target jangka pendek tertunda"
            ]
          };
        }
      },
      {
        id: "C",
        name: "Ambil Freelance dengan Subkontrak ke Junior (Arbitrase)",
        capitalReq: "Rp 15.000.000 komitmen bayar junior dari nilai proyek",
        roi: "Margin bersih Rp 20.000.000 dengan hanya 6 jam/minggu",
        risk: "Kualitas kode junior rentan bug; reputasi dipertaruhkan",
        oppCost: "Melepas Rp 15 jt potensi laba kotor",
        timeImpact: "6-8 jam/minggu (Code Review & Manajemen)",
        type: "Leverage (Tenaga Kerja)",
        typeClass: "badge-leverage",
        execute: (state) => {
          // Roll probabilitas kualitas junior (70% mulus, 30% perlu perbaikan)
          const success = Math.random() < 0.75;
          state.flags.hasSubcontractors = true;
          if (success) {
            state.cash += 20000000;
            state.stress += 15;
            state.stamina -= 10;
            state.networkQuality += 10;
            return {
              title: "Arbitrase Sukses: Belajar Jadi Project Lead",
              narration: "Junior developer yang Anda bimbing bekerja dengan baik di bawah arsitektur yang Anda buat. Anda mengantongi untung bersih Rp 20.000.000 tanpa merusak jam tidur Anda. Anda mulai merasakan kekuatan delegasi (leverage).",
              impacts: [
                "+ Rp 20.000.000 kas bersih",
                "Waktu tidur dan keluarga relatif terjaga",
                "+10 Kualitas Relasi Profesional",
                "Memperoleh pengalaman manajemen delegasi"
              ]
            };
          } else {
            state.cash += 15000000; // kena penalti potongan keterlambatan
            state.stress += 30;
            state.stamina -= 20;
            return {
              title: "Kualitas Junior Bermasalah, Terpaksa Begadang Debugging",
              narration: "Kode dari junior ternyata memiliki kelemahan arsitektur fatal. Anda terpaksa mengerjakan ulang di menit-menit akhir. Klien sedikit kecewa karena delivery telat seminggu dan memotong Rp 5 juta, menyisakan margin Rp 15.000.000.",
              impacts: [
                "+ Rp 15.000.000 kas bersih (terkena penalti potongan)",
                "+30 Stres karena revisi mendadak",
                "Pelajaran mahal tentang filtrasi talenta & QA"
              ]
            };
          }
        }
      },
      {
        id: "D",
        name: "Tolak Semua, Bangun Micro-SaaS B2B Sendiri",
        capitalReq: "Rp 1.500.000 (Infrastruktur Cloud & Domain)",
        roi: "Aset berulang jangka panjang tak terbatas",
        risk: "Peluang gagal 80%+; kas masuk Rp 0 selama berbulan-bulan",
        oppCost: "Menolak Rp 35.000.000 uang tunai di depan mata",
        timeImpact: "15 jam/minggu penuh di depan laptop",
        type: "High Risk / High Reward (Equity)",
        typeClass: "badge-irreversible",
        execute: (state) => {
          state.cash -= 1500000;
          state.stress += 20;
          state.stamina -= 15;
          state.flags.saasLaunched = true;
          // Karena sales rendah, pendapatan awal sangat kecil
          state.businesses.push({
            name: "Micro-SaaS API Generator",
            mrr: 450000,
            valuation: 5000000
          });
          state.incomePassive += 450000;
          return {
            title: "Produk Rilis: Realita Pahit Distribusi Software",
            narration: "Aplikasi berhasil Anda bangun dan dideploy. Secara teknis sangat rapi! Namun karena Anda tidak memiliki skill marketing, hanya ada 3 pelanggan yang mendaftar setelah Anda posting di komunitas. MRR hanya Rp 450.000/bulan. Uang sekolah anak masih belum terpenuhi.",
            impacts: [
              "- Rp 1.500.000 modal awal terpakai",
              "+ Rp 450.000/bulan pendapatan pasif baru",
              "Aset bisnis digital terbentuk (Valuasi ~Rp 5 jt)",
              "Menyadari kelemahan fatal di distribusi & penjualan"
            ]
          };
        }
      }
    ]
  },

  2: {
    title: "Badai Efisiensi Kantor: Perampingan Agensi",
    roundTitle: "RONDE 2 : RESTRUKTURISASI KORPORASI",
    macro: "Klien korporat agensi memotong budget marketing & IT 40%. Manajemen mengumumkan program pemangkasan pegawai.",
    story: `Kuartal kedua tiba. Manajemen kantor mengumumkan restrukturisasi besar-besaran. 30% staf engineering akan dipangkas.
Kondisi Anda saat ini sangat dipengaruhi oleh apa yang Anda bangun di ronde sebelumnya.

Manajemen menawarkan program pensiun dini / pesangon sukarela (VSP) sebesar 4 bulan gaji (Rp 88.000.000 kotor / ~Rp 80.000.000 bersih) bagi yang ingin mengundurkan diri sekarang. Bagi yang bertahan, beban kerja akan bertambah dan divisi akan difokuskan ulang.

Apa langkah strategis Anda menghadapi gejolak ini?`,
    choices: [
      {
        id: "A",
        name: "Ambil Paket Pesangon Sukarela (Rp 80.000.000) & Jadi Full-Time Freelancer / Konsultan",
        capitalReq: "Rp 0 (Justru dapat uang pesangon)",
        roi: "Suntikan modal Rp 80.000.000 tunai langsung",
        risk: "Kehilangan gaji tetap Rp 22 jt/bulan di tengah tech winter",
        oppCost: "Kehilangan stabilitas dan asuransi kesehatan kantor",
        timeImpact: "Waktu bebas naik ke 40 jam/minggu (tapi tekanan mental tinggi)",
        type: "Irreversible Pivot",
        typeClass: "badge-irreversible",
        execute: (state) => {
          state.cash += 80000000;
          state.incomeActive = 0; // gaji hilang
          state.flags.firedFromJob = true;
          state.stress += 25;
          return {
            title: "Keluar dari Agensi dengan Kas Tebal",
            narration: "Anda mengambil uang pesangon Rp 80.000.000. Kas Anda melonjak drastis, mengamankan dana darurat dan biaya sekolah anak sekaligus. Namun sekarang speedometer arloji berdetak: gaji Rp 22.000.000/bulan sudah hilang. Anda sekarang sepenuhnya mandiri.",
            impacts: [
              "+ Rp 80.000.000 pesangon tunai masuk!",
              "Pendapatan aktif gaji turun menjadi Rp 0/bln",
              "Dana darurat dan biaya sekolah anak terpenuhi",
              "Tantangan baru: Menemukan klien berkelanjutan"
            ]
          };
        }
      },
      {
        id: "B",
        name: "Bertahan di Kantor & Negosiasi Posisi Kunci",
        capitalReq: "Rp 0",
        roi: "Gaji Rp 22 jt/bulan aman; peluang naik gaji jika kompeten",
        risk: "Jika evaluasi buruk, bisa di-PHK dengan pesangon standar tanpa opsi",
        oppCost: "Melepas uang kas Rp 80 jt di depan mata",
        timeImpact: "Beban kerja kantor naik menjadi 50 jam/minggu",
        type: "Defensive Play",
        typeClass: "badge-reversible",
        execute: (state) => {
          if (state.flags.aiSpecialist) {
            state.incomeActive += 4000000; // Promosi karena skill AI
            state.stress += 15;
            state.reputation = 'Principal Engineer & AI Lead';
            return {
              title: "Bertahan & Dipromosikan Berkat Penguasaan AI!",
              narration: "Karena Anda telah menguasai tooling AI di ronde 1, manajemen menganggap Anda aset kritis yang tak tergantikan. Anda tidak hanya selamat dari PHK, tetapi dipromosikan dengan kenaikan gaji menjadi Rp 26.000.000/bulan untuk memimpin otomatisasi tim!",
              impacts: [
                "Gaji naik menjadi Rp 26.000.000/bulan (+Rp 4 jt)",
                "Posisi karier sangat kokoh di agensi",
                "Arus kas bulanan semakin sehat (+Rp 8,65 jt FCF)"
              ]
            };
          } else {
            // Evaluasi biasa
            state.stress += 25;
            return {
              title: "Selamat dari PHK, Namun Tekanan Kerja Membengkak",
              narration: "Anda selamat dari gelombang PHK, namun rekan satu tim Anda berkurang. Beban kerja dari proyek klien yang tersisa dilimpahkan kepada Anda tanpa kenaikan gaji. Anda bekerja lebih keras hanya untuk mempertahankan status quo.",
              impacts: [
                "Gaji tetap Rp 22.000.000/bulan",
                "Beban kerja melonjak, waktu luang terpangkas",
                "+25 Stres kerja"
              ]
            };
          }
        }
      },
      {
        id: "C",
        name: "Lobi Manajemen untuk Menerima Proyek Outsourcing Eksternal Secara Resmi",
        capitalReq: "Rp 5.000.000 (Modal legalitas CV/Badan Usaha kecil)",
        roi: "Membangun agensi mini yang diakui kantor",
        risk: "Birokrasi kantor menolak; biaya legalitas hangus",
        oppCost: "Fokus terpecah antara internal kantor dan klien baru",
        timeImpact: "15 jam/minggu",
        type: "Leverage Opportunity",
        typeClass: "badge-leverage",
        execute: (state) => {
          state.cash -= 5000000;
          state.networkQuality += 15;
          state.businesses.push({
            name: "Digital Solutions Studio (CV)",
            mrr: 5000000,
            valuation: 30000000
          });
          state.incomePassive += 5000000;
          return {
            title: "Mendirikan Entitas Usaha Resmi",
            narration: "Anda melegalkan agensi mini Anda berbadan hukum CV. Kantor utama menyetujui perjanjian non-kompetisi terbatas, dan Anda mulai menerima sub-kontrak resmi bernilai stabil dengan margin Rp 5.000.000/bulan.",
            impacts: [
              "- Rp 5.000.000 biaya pendirian CV & administrasi",
              "+ Rp 5.000.000/bulan arus kas bisnis baru",
              "Aset bisnis berbadan hukum terbentuk"
            ]
          };
        }
      }
    ]
  },

  3: {
    title: "Tenggat Waktu Biaya Masuk SD & Pilihan Tempat Tinggal",
    roundTitle: "RONDE 3 : ALOKASI CAPITAL KELUARGA & KEBUTUHAN REAL",
    macro: "Sewa kontrakan naik 15% karena inflasi properti perkotaan. Pendaftaran SD swasta unggulan dibuka.",
    story: `Anak Anda genap berusia 6 tahun. Istri Anda menginginkan anak masuk ke SD Swasta Islam Terpadu/Nasional Plus dengan uang pangkal Rp 25.000.000 dan SPP Rp 1.800.000/bulan, demi lingkungan belajar yang baik. Alternatifnya adalah SD Negeri favorit dengan uang gedung Rp 3.000.000 dan SPP gratis.

Di saat bersamaan, masa sewa kontrakan rumah Anda habis. Pemilik rumah menawarkan: perpanjang sewa 1 tahun Rp 36.000.000 dimuka, ATAU Anda mulai mencicil KPR rumah pinggiran kota (DP Rp 60.000.000, cicilan Rp 5.500.000/bulan selama 15 tahun).

Bagaimana Anda mengalokasikan modal Anda untuk dua keputusan keluarga yang krusial ini?`,
    choices: [
      {
        id: "A",
        name: "Pilih SD Swasta Unggulan + Tetap Sewa Kontrakan 1 Tahun",
        capitalReq: "Rp 61.000.000 (Rp 25 jt SD + Rp 36 jt Sewa)",
        roi: "Keluarga bahagia, jaringan orang tua siswa berkulitas tinggi",
        risk: "Menguras kas secara masif; jika dana darurat tipis, likuiditas berbahaya",
        oppCost: "Tertunda membeli aset properti sendiri",
        timeImpact: "Netral",
        type: "Lifestyle & Human Capital",
        typeClass: "badge-reversible",
        execute: (state) => {
          if (state.cash < 61000000) {
            // Kas tidak cukup, terpaksa ambil pinjaman darurat / KTA berbunga tinggi
            const deficit = 61000000 - state.cash;
            state.debtTotal += Math.round(deficit * 1.3);
            state.debtMonthly += Math.round((deficit * 1.3) / 12);
            state.cash = 5000000;
            state.expenses += 1800000; // SPP bulanan
            state.stress += 40;
            return {
              title: "Paksakan Gaya Hidup Saat Kas Menipis: Terjebak Bunga Utang!",
              narration: `Kas Anda tidak cukup untuk membayar tunai Rp 61.000.000. Anda terpaksa berutang untuk menutupi kekurangan Rp ${formatIDR(deficit)}. Pengeluaran bulanan Anda kini melonjak drastis dengan cicilan bunga tinggi. Arus kas keluarga mengalami tekanan berat.`,
              impacts: [
                "Kas terkuras ke batas minimum Rp 5.000.000",
                `Utang baru bertambah Rp ${formatIDR(Math.round(deficit * 1.3))}`,
                "Pengeluaran bulanan naik +Rp 1.800.000 untuk SPP",
                "+40 Beban Stres Finansial"
              ]
            };
          } else {
            state.cash -= 61000000;
            state.expenses += 1800000; // SPP
            state.networkQuality += 15;
            state.stress -= 10; // Istri tenang
            return {
              title: "Kebutuhan Pendidikan Anak & Sewa Rumah Terpenuhi dari Kas",
              narration: "Dengan cadangan kas yang telah Anda kumpulkan sebelumnya, Anda mampu membayar Rp 61.000.000 tunai tanpa utang. Istri Anda sangat tenang, dan anak Anda masuk sekolah yang bagus. Namun likuiditas Anda berkurang signifikan.",
              impacts: [
                "- Rp 61.000.000 kas terbayar lunas",
                "Pengeluaran bulanan naik +Rp 1.800.000",
                "+15 Jaringan relasi orang tua siswa kelas menengah-atas",
                "Tidak ada utang baru yang terbentuk"
              ]
            };
          }
        }
      },
      {
        id: "B",
        name: "Pilih SD Negeri Favorit + Ambil KPR Rumah Pinggiran Kota",
        capitalReq: "Rp 63.000.000 (Rp 3 jt SD + Rp 60 jt DP KPR)",
        roi: "Memulai kepemilikan aset riil rumah tinggal; biaya sekolah murah",
        risk: "Komitmen utang 15 tahun (Rp 5,5 jt/bln); komuter harian bertambah 1,5 jam",
        oppCost: "Waktu luang berkurang drastis di jalan; likuiditas terkunci di batu bata",
        timeImpact: "Kehilangan 7-10 jam/minggu karena perjalanan komuter",
        type: "Heavy Leverage (Illiquid Asset)",
        typeClass: "badge-irreversible",
        execute: (state) => {
          if (state.cash < 63000000) {
            state.cash = 5000000;
            state.debtTotal += 450000000; // KPR
            state.debtMonthly += 5500000;
            state.stress += 35;
            state.stamina -= 15;
            state.assets.push({ id: 'rumah', name: 'Rumah Tinggal (KPR)', value: 500000000, liquid: false });
            return {
              title: "KPR Dipaksakan: Aset Bertambah tapi Arus Kas Tercekik",
              narration: "Kas Anda terkuras habis untuk DP dan akad KPR. Anda kini memiliki rumah sendiri seharga Rp 500 jt, namun memiliki beban cicilan Rp 5,5 jt/bulan selama 15 tahun dan komuter yang melelahkan.",
              impacts: [
                "Aset rumah Rp 500.000.000 tercatat di neraca",
                "Utang jangka panjang membengkak Rp 450.000.000",
                "Cicilan bulanan naik Rp 5.500.000/bulan",
                "Waktu luang berkurang karena komuter pinggiran kota"
              ]
            };
          } else {
            state.cash -= 63000000;
            state.debtTotal += 450000000;
            state.debtMonthly += 5500000;
            state.expenses -= 2500000; // Tidak ada lagi biaya sewa rumah bulanan
            state.assets.push({ id: 'rumah', name: 'Rumah Tinggal (KPR)', value: 500000000, liquid: false });
            state.stamina -= 15;
            return {
              title: "Memiliki Rumah Sendiri & Sekolah Hemat Biaya",
              narration: "Anda berhasil membayar DP KPR dan mengamankan rumah keluarga. Sekolah negeri gratis menekan pengeluaran pendidikan. Net worth Anda terdiversifikasi ke properti, tetapi cicilan KPR Rp 5,5 jt/bulan mengikat fleksibilitas keuangan Anda.",
              impacts: [
                "- Rp 63.000.000 kas terpakai untuk DP & biaya sekolah",
                "Kepemilikan aset rumah Rp 500.000.000",
                "Pengeluaran sewa Rp 2,5 jt/bln hilang, berganti cicilan KPR Rp 5,5 jt/bln",
                "Waktu luang berkurang akibat jarak tempuh komuter"
              ]
            };
          }
        }
      },
      {
        id: "C",
        name: "Pilih SD Negeri + Perpanjang Sewa Kontrakan (Prioritaskan Likuiditas Maksimal)",
        capitalReq: "Rp 39.000.000 (Rp 3 jt SD + Rp 36 jt Sewa)",
        roi: "Kas terselamatkan, fleksibilitas relokasi tinggi, tanpa komitmen utang besar",
        risk: "Tidak memiliki kepemilikan aset rumah; status sosial konvensional dipandang rendah",
        oppCost: "Melewatkan apresiasi harga properti",
        timeImpact: "Waktu tempuh tetap efisien dekat kantor",
        type: "Max Liquidity Preservation",
        typeClass: "badge-reversible",
        execute: (state) => {
          state.cash -= 39000000;
          state.stress -= 5;
          return {
            title: "Pragmatisme Finansial: Menjaga Amunisi Kas",
            narration: "Anda memilih opsi paling efisien modal. Anak Anda masuk SD Negeri dengan biaya sangat terjangkau, dan Anda tetap mengontrak di dekat kota tanpa komitmen cicilan KPR yang membelenggu. Kas Anda tetap memiliki sisa penyangga yang kuat untuk manuver investasi.",
            impacts: [
              "- Rp 39.000.000 kas terpakai (paling hemat)",
              "Nol komitmen utang baru",
              "Likuiditas dan stamina harian tetap terjaga prima"
            ]
          };
        }
      }
    ]
  },

  4: {
    title: "Peluang Saham Startup Pra-IPO vs Investasi Dividen Tunai",
    roundTitle: "RONDE 4 : ALOKASI CAPITAL & INSTRUMEN PASIF",
    macro: "Suku bunga acuan bank sentral mulai turun. Pasar modal mulai bergerak naik; pasar modal menawarkan return obligasi 6.5%.",
    story: `Seorang founder startup fintech kenalan lama menawarkan kesempatan membeli saham kepemilikan awal (secondary shares) senilai Rp 20.000.000 dengan diskon 40% sebelum rencana putaran pendanaan Seri A. Ada potensi valuasi naik 5x-10x jika berhasil, tetapi bisa menjadi Rp 0 jika startup gagal.

Di waktu yang sama, Anda memiliki sisa dana dan ingin membangun pendapatan pasif nyata yang langsung menghasilkan uang bulanan (obligasi/surat berharga negara atau saham dividen bervaluasi murah dengan yield 8% per tahun).

Atau opsi ketiga: Melunasi sisa seluruh utang cicilan motor dan memperkuat tabungan liquid.

Bagaimana alokasi modal Anda?`,
    choices: [
      {
        id: "A",
        name: "Beli Saham Startup (Spekulasi High Growth / Asymmetric Bet)",
        capitalReq: "Rp 20.000.000",
        roi: "Potensi 5x-10x lipat (Rp 100 jt - Rp 200 jt) dalam 2-3 tahun",
        risk: "Likuiditas 0%; Peluang hangus total 70%",
        oppCost: "Kehilangan pendapatan dividen pasti",
        timeImpact: "0 jam/minggu (Pasif)",
        type: "Asymmetric Venture Bet",
        typeClass: "badge-irreversible",
        execute: (state) => {
          if (state.cash < 20000000) {
            return {
              title: "Gagal Mengambil Peluang: Kas Tidak Memadai",
              narration: "Kas Anda tidak mencukupi untuk mengambil risiko spekulasi ini. Anda terpaksa melewatkannya.",
              impacts: ["Tidak ada perubahan status finansial"]
            };
          }
          state.cash -= 20000000;
          // Roll probabilitas startup (40% sukses besar, 60% stagnan/rugi)
          const isLucky = Math.random() < 0.45;
          if (isLucky) {
            state.assets.push({ id: 'startup_equity', name: 'Saham Fintech Startup', value: 80000000, liquid: false });
            return {
              title: "Spekulasi Berhasil! Startup Menutup Seri A",
              narration: "Startup fintech tersebut berhasil mengamankan pendanaan Seri A dari VC ternama Singapura! Valuasi saham kepemilikan Anda melonjak menjadi Rp 80.000.000 di atas kertas (illiquid).",
              impacts: [
                "- Rp 20.000.000 kas terpakai",
                "+ Rp 80.000.000 nilai aset tercatat (Unrealized Capital Gain 4x)",
                "Aset tidak likuid sebelum IPO/akuisisi"
              ]
            };
          } else {
            state.assets.push({ id: 'startup_equity', name: 'Saham Fintech (Troubled)', value: 4000000, liquid: false });
            return {
              title: "Startup Terganjal Regulasi: Valuasi Anjlok",
              narration: "Otoritas keuangan mengeluarkan aturan ketat baru terkait lending fintech. Startup kesulitan mencari ronde berikutnya. Saham Anda mengalami down-round berat dan terancam hangus.",
              impacts: [
                "- Rp 20.000.000 kas lenyap",
                "Aset hanya dihargai Rp 4.000.000",
                "Pelajaran nyata tentang risiko konsentrasi modal di aset spekulatif"
              ]
            };
          }
        }
      },
      {
        id: "B",
        name: "Alokasikan ke Portofolio Obligasi & Saham Dividen Blue Chip (8% p.a)",
        capitalReq: "Rp 20.000.000",
        roi: "Pendapatan pasif pasti ~Rp 135.000/bulan + keamanan modal",
        risk: "Sangat rendah; likuiditas menengah",
        oppCost: "Kehilangan peluang explosive multiplier",
        timeImpact: "0 jam/minggu",
        type: "Compounding Engine",
        typeClass: "badge-reversible",
        execute: (state) => {
          if (state.cash < 20000000) {
            return {
              title: "Kas Terbatas",
              narration: "Anda hanya bisa mengalokasikan sebagian kas yang tersisa.",
              impacts: ["Alokasi disesuaikan dengan saldo yang ada"]
            };
          }
          state.cash -= 20000000;
          const monthlyYield = Math.round((20000000 * 0.08) / 12);
          state.incomePassive += monthlyYield;
          state.assets.push({ id: 'dividen_portofolio', name: 'Obligasi & Dividen Bluechip', value: 20000000, liquid: true });
          return {
            title: "Fondasi Mesin Uang Pasif Mulai Berputar",
            narration: "Anda mengalokasikan dana ke aset yang menghasilkan arus kas riil. Setiap bulan, kupon dividen masuk ke rekening Anda tanpa Anda harus bekerja satu detik pun. Ini adalah langkah awal compounding yang terukur.",
            impacts: [
              "- Rp 20.000.000 kas dipindahkan ke aset produktif",
              `+ Rp ${formatIDR(monthlyYield)}/bulan pendapatan pasif mengalir rutin`,
              "Modal aman dan likuiditas terproteksi"
            ]
          };
        }
      },
      {
        id: "C",
        name: "Pelunasan Cepat Seluruh Sisa Utang Konsumtif Motor",
        capitalReq: "Rp 8.400.000 (Sisa pokok utang)",
        roi: "Instant Cash Flow Liberation (+Rp 1.200.000/bln kembali ke saku)",
        risk: "0% risiko (Risk-free return setara suku bunga kredit)",
        oppCost: "Uang kas berkurang Rp 8,4 jt",
        timeImpact: "Bebas dari beban pikiran cicilan",
        type: "De-leveraging (Guaranteed ROI)",
        typeClass: "badge-reversible",
        execute: (state) => {
          const payAmount = Math.min(state.cash, state.debtTotal);
          state.cash -= payAmount;
          state.debtTotal = 0;
          state.debtMonthly = 0;
          state.stress -= 10;
          return {
            title: "Bebas Utang Motor: Free Cash Flow Melejit!",
            narration: "Anda melunasi sisa seluruh pokok utang motor. Mulai bulan ini, beban cicilan Rp 1.200.000/bulan lenyap selamanya! Arus kas bersih keluarga Anda bertambah seketika. Rasio margin keamanan kas Anda naik.",
            impacts: [
              `- Rp ${formatIDR(payAmount)} kas untuk pelunasan`,
              "Utang konsumtif menjadi Rp 0 (LUNAS)",
              "+ Rp 1.200.000/bulan kembali utuh ke Free Cash Flow Anda",
              "Beban mental cicilan bulanan hilang"
            ]
          };
        }
      }
    ]
  },

  5: {
    title: "Krisis Kesehatan Keluarga & Ujian Dana Darurat",
    roundTitle: "RONDE 5 : BLACK SWAN EVENT & UJIAN RESILIENSI",
    macro: "Kondisi cuaca ekstrem memicu lonjakan kasus infeksi pernapasan berat di kota.",
    story: `Ujian tak terduga datang tanpa permisi. Anak Anda mengalami pneumonia berat dan harus dirawat intensif di rumah sakit swasta selama 10 hari.

Asuransi kantor yang Anda miliki hanya menanggung kamar kelas dasar dan memiliki plafon pembatasan obat tertentu. Total tagihan rumah sakit yang tidak tercover (out-of-pocket gap) adalah Rp 28.000.000 dan harus dilunasi sebelum pasien diizinkan keluar.

Ini adalah momen audit pertama ketahanan finansial Anda. Bagaimana Anda menuntaskan tagihan darurat ini?`,
    choices: [
      {
        id: "A",
        name: "Bayar Tunai dari Cadangan Kas Dana Darurat",
        capitalReq: "Rp 28.000.000",
        roi: "Anak sembuh total, tidak berutang sesen pun, reputasi keluarga terjaga",
        risk: "Likuiditas kas tergerus drastis jika buffer tipis",
        oppCost: "Kas tidak bisa dipakai untuk investasi dalam waktu dekat",
        timeImpact: "Menghabiskan waktu merawat anak di RS",
        type: "Emergency Absorption",
        typeClass: "badge-reversible",
        execute: (state) => {
          if (state.cash >= 28000000) {
            state.cash -= 28000000;
            state.stress += 10;
            return {
              title: "Dana Darurat Menyelamatkan Nyawa & Martabat Keluarga",
              narration: "Inilah bukti nyata mengapa likuiditas adalah raja! Anda mampu menggesek kartu debit dan melunasi Rp 28.000.000 tanpa memohon pinjaman ke keluarga atau terjerat pinjol. Anak Anda sembuh sehat walafiat. Dana darurat menipis, tapi berfungsi tepat seperti tujuannya.",
              impacts: [
                "- Rp 28.000.000 kas terpakai",
                "Keluarga selamat dari bencana medis tanpa utang",
                "Cadangan kas menurun dan perlu dibangun kembali"
              ]
            };
          } else {
            // Kas tekor, terpaksa jual aset atau utang
            const deficit = 28000000 - state.cash;
            state.cash = 0;
            state.debtTotal += Math.round(deficit * 1.25);
            state.debtMonthly += Math.round((deficit * 1.25) / 10);
            state.stress += 40;
            return {
              title: "Kas Tidak Cukup! Terpaksa Mengambil Utang Rumah Sakit",
              narration: `Kas Anda tidak cukup membayar penuh tagihan RS! Anda menguras seluruh kas Anda hingga Rp 0 dan meminjam darurat sebesar Rp ${formatIDR(deficit)} dengan bunga. Tekanan mental keluarga sangat tinggi.`,
              impacts: [
                "Kas terkuras habis menjadi Rp 0",
                `Utang baru bertambah Rp ${formatIDR(Math.round(deficit * 1.25))}`,
                "+40 Beban stres mental & finansial"
              ]
            };
          }
        }
      },
      {
        id: "B",
        name: "Jual Cepat Aset Gadget / Kendaraan dengan Diskon Likuidasi",
        capitalReq: "Aset fisik dikorbankan",
        roi: "Menghindari utang berbunga",
        risk: "Kehilangan mobilitas harian atau alat penunjang kerja produktif",
        oppCost: "Nilai jual aset anjlok 30% karena butuh uang mendesak (fire sale)",
        timeImpact: "Repot mencari pembeli cepat",
        type: "Distressed Asset Sale",
        typeClass: "badge-irreversible",
        execute: (state) => {
          state.assets = state.assets.filter(a => a.id !== 'motor');
          const motorSale = 10000000; // diskon darurat
          const sisaBayar = 28000000 - motorSale;
          state.cash = Math.max(0, state.cash - sisaBayar);
          state.expenses += 500000; // Biaya ojek online harian karena motor dijual
          state.stress += 25;
          return {
            title: "Fire-Sale Aset untuk Menutupi Tagihan Medis",
            narration: "Anda terpaksa menjual motor harian Anda dengan harga jatuh Rp 10.000.000 kepada tetangga demi menutupi tagihan rumah sakit, sisanya dibayar dari tabungan. Anak sembuh, tetapi Anda kini harus mengeluarkan biaya ojol setiap hari untuk bekerja.",
            impacts: [
              "Aset motor senilai Rp 14 jt terjual rugi di angka Rp 10 jt",
              "Biaya transportasi bulanan bertambah +Rp 500.000",
              "Tidak memiliki utang bunga tinggi, tapi kenyamanan hilang"
            ]
          };
        }
      },
      {
        id: "C",
        name: "Minta Bantuan Dana ke Kantor Agensi / Rekan Kerja (Bantuan Finansial)",
        capitalReq: "Rp 0 (Meminjam kasbon perusahaan)",
        roi: "Kas pribadi tidak terkuras habis",
        risk: "Reputasi di hadapan pimpinan kantor turun; posisi tawar negosiasi gaji melemah",
        oppCost: "Kehilangan leverage profesional",
        timeImpact: "Netral",
        type: "Social Capital Consumption",
        typeClass: "badge-reversible",
        execute: (state) => {
          state.debtTotal += 28000000;
          state.debtMonthly += 2333000; // potong gaji 12 bulan
          state.networkQuality -= 15;
          state.reputation = 'Karyawan dengan Beban Kasbon Kantor';
          state.stress += 20;
          return {
            title: "Kasbon Kantor Mengikat Leher Anda",
            narration: "Manajemen kantor menyetujui pinjaman lunak Rp 28.000.000 yang langsung dipotong dari gaji bulanan Anda selama setahun. Anak Anda tertolong, tetapi kini Anda tidak bisa leluasa resign atau meminta kenaikan gaji karena posisi psikologis yang tersandera utang budi.",
            impacts: [
              "Gaji bulanan dipotong Rp 2.333.000/bulan selama 12 bulan",
              "Reputasi profesional dan daya tawar di kantor merosot",
              "Kas tabungan Anda selamat tidak tersentuh"
            ]
          };
        }
      }
    ]
  }
};

// Generasi Skenario Lanjutan (Ronde 6 - 20) secara prosedural dengan dinamika second-order
function getScenarioForRound(roundNumber) {
  if (SCENARIOS[roundNumber]) {
    return SCENARIOS[roundNumber];
  }

  // Prosedural generator untuk ronde 6 s/d 20
  const scenariosList = [
    {
      round: 6,
      title: "Tawaran Bergabung Sebagai Co-Founder CTO di Startup AI Baru",
      roundTitle: "RONDE 6 : EQUITY VS GAJI & RISIKO KEGAGALAN",
      macro: "Modal ventura global mulai membanjiri sektor AI aplikatif di Asia Tenggara.",
      story: `Seorang mantan VP agensi mengajak Anda membangun startup B2B automation. Menawarkan 20% kepemilikan saham (equity), tetapi Anda harus menerima pemotongan gaji 50% selama 12 bulan ke depan (hanya dibayar Rp 11.000.000/bln). Alternatifnya: Anda menolak dan tetap fokus pada jalur saat ini, atau menawarkan diri sebagai penasihat teknis (Technical Advisor) paruh waktu dengan 3% equity tanpa potong gaji.`,
      choices: [
        {
          id: "A",
          name: "Terima Posisi CTO Penuh (Taruhan Equity Besar, Potong Gaji 50%)",
          capitalReq: "Defisit arus kas bulanan",
          roi: "Potensi nilai equity bernilai miliaran rupiah jika tembus Valuasi",
          risk: "Runway keluarga terancam jika kas habis; 90% startup gagal",
          oppCost: "Kehilangan arus kas stabil",
          timeImpact: "55 jam/minggu (Komitmen total)",
          type: "High Leverage / High Vulnerability",
          typeClass: "badge-irreversible",
          execute: (s) => {
            s.incomeActive = 11000000;
            s.stress += 30;
            s.businesses.push({ name: 'AI Startup Equity (20%)', mrr: 0, valuation: 150000000 });
            return {
              title: "Lompatan ke Dunia Startup: Pertaruhan Hidup-Mati",
              narration: "Anda resmi menjadi co-founder CTO. Beban kerja melonjak drastis, gaji terpotong separuh. Namun Anda kini memiliki 20% kepemilikan saham sebuah tech company yang berpeluang eksponensial.",
              impacts: ["Gaji turun menjadi Rp 11.000.000/bln", "+ Rp 150.000.000 estimasi valuasi kepemilikan saham", "+30 Beban Stres"]
            };
          }
        },
        {
          id: "B",
          name: "Ambil Peran Technical Advisor (3% Saham, Jam Kerja Terbatas, Gaji Utuh)",
          capitalReq: "Rp 0",
          roi: "Dapat 3% kepemilikan tanpa risiko arus kas keluarga",
          risk: "Founder mungkin mengutamakan CTO fulltime di masa depan",
          oppCost: "Kepemilikan saham relatif kecil",
          timeImpact: "5 jam/minggu di akhir pekan",
          type: "Asymmetric Upside with Low Downside",
          typeClass: "badge-leverage",
          execute: (s) => {
            s.businesses.push({ name: 'Advisory Equity (3%)', mrr: 0, valuation: 25000000 });
            s.networkQuality += 15;
            return {
              title: "Strategi Cerdik: Upside Tanpa Mengorbankan Roti Keluarga",
              narration: "Founder menyetujui peran Technical Advisor Anda. Anda menghadiri sprint arsitektur tiap Sabtu, menerima 3% saham vesting, sementara gaji utama dan stabilitas kas keluarga Anda tetap 100% aman.",
              impacts: ["Gaji utama tetap aman utuh", "+ Rp 25.000.000 valuasi aset ekuitas", "+15 Nilai Jaringan Profesional"]
            };
          }
        },
        {
          id: "C",
          name: "Tolak Tawaran Secara Penuh & Fokus Memperkuat Arus Kas Internal",
          capitalReq: "Rp 0",
          roi: "Konsentrasi penuh pada kesehatan mental dan modal likuid",
          risk: "Melewatkan gelombang pertumbuhan startup baru",
          oppCost: "Nol potensi kepemilikan saham unicorn",
          timeImpact: "Waktu luang tetap terjaga",
          type: "Conservative Protection",
          typeClass: "badge-reversible",
          execute: (s) => {
            s.stress -= 10;
            return {
              title: "Menolak Godaan Startup: Fokus pada Ketahanan Nyata",
              narration: "Anda menolak tawaran dengan sopan. Anda menyadari dengan usia 37 tahun dan anak sekolah, stabilitas dan free cash flow yang nyata jauh lebih penting daripada mimpi di atas kertas slide pitch deck.",
              impacts: ["Fokus waktu dan keluarga terlindungi", "Stres menurun", "Tidak ada modal terbuang"]
            };
          }
        }
      ]
    },
    {
      round: 7,
      title: "Momen Emas Pasar Modal: Krisis Sektor Perbankan Membuka Peluang Undervalued",
      roundTitle: "RONDE 7 : ALOKASI CAPITAL SAAT PASAR PANIK (VALUE INVESTING)",
      macro: "Sentimen kepanikan pasar modal global menjatuhkan harga saham sektor perbankan dan consumer goods hingga diskon 35%.",
      story: `Pasar modal sedang panik akibat sentimen makro global. Indeks saham terkoreksi tajam. Saham-saham berfundamental emas dengan rekam jejak dividen konsisten 20 tahun kini dihargai sangat murah dengan potensi Dividend Yield mencapai 10-12% per tahun dan potensi capital gain saat ekonomi pulih.

Apakah Anda memiliki likuiditas untuk mengeksekusi prinsip Warren Buffett: 'Greedy when others are fearful', ataukah Anda harus melewatkannya karena uang kas terkunci?`,
      choices: [
        {
          id: "A",
          name: "Lakukan 'Lump-Sum' Pembelian Agresif Saham Dividen Undervalued (Rp 30.000.000)",
          capitalReq: "Rp 30.000.000 tunai",
          roi: "Yield dividen 11% p.a + potensi apresiasi modal 40% saat pulih",
          risk: "Harga bisa turun lebih dalam sebelum memantul",
          oppCost: "Kas likuid berkurang signifikan",
          timeImpact: "0 jam/minggu",
          type: "Value Investing (Margin of Safety)",
          typeClass: "badge-reversible",
          execute: (s) => {
            if (s.cash < 30000000) {
              return {
                title: "Tragedi Investor: Kas Kurang di Waktu Terbaik!",
                narration: "Anda melihat peluang emas, namun kas Anda tidak mencapai Rp 30.000.000 karena terkuras di ronde sebelumnya. Peluang diskon besar lewat begitu saja di depan mata Anda.",
                impacts: ["Gagal mengeksekusi karena kurangnya likuiditas"]
              };
            }
            s.cash -= 30000000;
            const yieldBulan = Math.round((30000000 * 0.11) / 12);
            s.incomePassive += yieldBulan;
            s.assets.push({ id: 'value_stocks', name: 'Saham Bluechip Undervalued', value: 42000000, liquid: true });
            return {
              title: "Membeli di Titik Nadir: Pembuktian Margin of Safety",
              narration: "Anda mengeksekusi pembelian saat semua orang panik menjual. Dalam 6 bulan berikutnya, harga saham pulih dan dividen mengalir deras ke rekening Anda setiap kuartal!",
              impacts: [
                "- Rp 30.000.000 kas teralokasi",
                `+ Rp ${formatIDR(yieldBulan)}/bulan dividen pasif baru`,
                "+ Rp 12.000.000 apresiasi nilai aset (Capital Gain Unrealized)"
              ]
            };
          }
        },
        {
          id: "B",
          name: "Beli Bertahap (Dollar Cost Averaging / DCA) Rp 5.000.000 / Bulan",
          capitalReq: "Rp 5.000.000 / bulan dari Free Cash Flow",
          roi: "Mendapatkan harga rata-rata yang optimal tanpa risiko timing pasar",
          risk: "Rendah",
          oppCost: "Tidak menangkap bottom harga absolut",
          timeImpact: "0 jam/minggu",
          type: "Systematic Compounding",
          typeClass: "badge-reversible",
          execute: (s) => {
            s.cash -= 5000000;
            const yieldBulan = Math.round((5000000 * 0.09) / 12);
            s.incomePassive += yieldBulan;
            s.assets.push({ id: 'dca_stocks', name: 'Portofolio DCA Saham', value: 5500000, liquid: true });
            return {
              title: "Disiplin DCA: Mengurangi Emosi Finansial",
              narration: "Anda memilih pendekatan teratur tanpa mencoba menebak dasar pasar. Dana kas tetap aman tersisa, dan Anda mulai membangun portofolio saham secara metodis.",
              impacts: [
                "- Rp 5.000.000 kas teralokasi bulan ini",
                `+ Rp ${formatIDR(yieldBulan)}/bulan pendapatan pasif`,
                "Risiko psikologis tetap tenang"
              ]
            };
          }
        },
        {
          id: "C",
          name: "Tahan Seluruh Kas di Deposito / Pasar Uang (Utamakan Likuiditas Mutlak)",
          capitalReq: "Rp 0",
          roi: "Bunga 4.5% p.a bebas risiko",
          risk: "Kalah terhadap inflasi riil",
          oppCost: "Melewatkan momen diskon harga saham sekali dalam beberapa tahun",
          timeImpact: "0 jam/minggu",
          type: "Capital Preservation",
          typeClass: "badge-reversible",
          execute: (s) => {
            const bunga = Math.round((s.cash * 0.045) / 12);
            s.incomePassive += bunga;
            return {
              title: "Kas Adalah Raja: Menjaga Benteng Pertahanan",
              narration: "Anda memutuskan untuk tidak menyentuh pasar saham yang sedang bergejolak. Uang Anda aman di instrumen pasar uang bebas risiko, meskipun Anda tahu Anda melewatkan potensi diskon harga aset besar.",
              impacts: [
                `+ Rp ${formatIDR(bunga)}/bulan bunga pasar uang bertambah`,
                "Likuiditas 100% terjaga utuh"
              ]
            };
          }
        }
      ]
    },
    {
      round: 8,
      title: "Peluang Otomasi Bisnis Lokal: Menjadi Partner IT Apotek / Klinik",
      roundTitle: "RONDE 8 : MEMBANGUN MESIN CASH FLOW RIIL (CASH COW)",
      macro: "Kemenkes mewajibkan digitalisasi rekam medis dan inventaris obat bagi seluruh klinik swasta.",
      story: `Seorang pemilik jaringan 4 klinik pratama di Jabodetabek butuh sistem manajemen inventaris dan bridging BPJS/SatuSehat terintegrasi. Mereka enggan membayar software vendor mahal ratusan juta. Mereka menawarkan kontrak setup Rp 40.000.000 + biaya langganan maintenance rutin Rp 4.500.000/bulan jika sistem stabil.

Ini adalah bentuk 'Boring Business' yang tidak glamor seperti startup VC, tetapi merupakan mesin penghasil cash flow riil dengan margin 90%.`,
      choices: [
        {
          id: "A",
          name: "Ambil Kontrak & Bangun Solusi dengan White-Label Open Source Tool",
          capitalReq: "Rp 5.000.000 (Server Cloud & Lisensi Modul)",
          roi: "Rp 40 jt dimuka + Rp 4.500.000/bulan Cash Flow Abadi",
          risk: "Dukungan operasional klinik menuntut SLA tinggi di jam kerja",
          oppCost: "Waktu terikat untuk maintenance harian",
          timeImpact: "8 jam/minggu",
          type: "B2B Cash Cow Business",
          typeClass: "badge-leverage",
          execute: (s) => {
            s.cash += 35000000; // 40 jt - 5 jt
            s.incomePassive += 4500000;
            s.businesses.push({ name: 'SaaS Rekam Medis Klinik', mrr: 4500000, valuation: 54000000 });
            s.stress += 10;
            return {
              title: "Boring Business yang Sangat Menguntungkan!",
              narration: "Sistem berhasil diimplementasikan dalam 6 minggu menggunakan teknologi open-source matang. Klinik sangat puas. Anda mengantongi kas bersih Rp 35.000.000 dan sekarang memiliki kontrak langganan rutin Rp 4.500.000 setiap awal bulan!",
              impacts: [
                "+ Rp 35.000.000 kas bersih masuk",
                "+ Rp 4.500.000/bulan pendapatan berulang (MRR)",
                "Valuasi bisnis software bertambah Rp 54.000.000"
              ]
            };
          }
        },
        {
          id: "B",
          name: "Tolak Tawaran & Jaga Waktu Luang Agar Tidak Terganggu Telepon Klien",
          capitalReq: "Rp 0",
          roi: "Nol gangguan telepon darurat klinik saat weekend",
          risk: "Melewatkan peluang arus kas pasif/semi-pasif yang langka",
          oppCost: "Kehilangan Rp 54.000.000/tahun potensi arus kas",
          timeImpact: "Waktu luang utuh",
          type: "Lifestyle Protection",
          typeClass: "badge-reversible",
          execute: (s) => {
            s.stress -= 5;
            return {
              title: "Menjaga Ketenangan Hidup di Atas Tambahan Uang",
              narration: "Anda menolak karena tidak ingin repot melayani komplain server klinik di hari Minggu. Keputusan ini menjaga ketenangan hidup Anda, meskipun potensi arus kas berulang hilang.",
              impacts: ["Tidak ada perubahan pendapatan", "Kesehatan mental tetap terjaga"]
            };
          }
        }
      ]
    }
  ];

  const found = scenariosList.find(s => s.round === roundNumber);
  if (found) return found;

  // Fallback procedural builder untuk ronde 9-20
  return generateProceduralRound(roundNumber, gameState);
}

function generateProceduralRound(roundNumber, state) {
  const titles = [
    "Dilema Pajak & Optimalisasi Entitas Bisnis",
    "Peluang Investasi Properti Lelang Sitaan Bank",
    "Disrupsi Model Bisnis oleh Generative AI Baru",
    "Tawaran Akuisisi Bisnis Sampingan oleh Kompetitor",
    "Ekspansi Tim: Merekrut Pegawai Penuh Waktu Pertama",
    "Krisis Likuiditas Makro: Inflasi Naik & Suku Bunga Melonjak",
    "Diversifikasi Portofolio ke Emas & Aset Global Dolar",
    "Transisi Menuju Kebebasan Penuh: Resign dari Pekerjaan Utama?",
    "Skalabilitas Operasional: Melepas Kontrol Teknis Mandiri",
    "Membangun Moat (Parit Pertahanan) Bisnis",
    "Keputusan Warisan & Perencanaan Finansial Generasi Berikutnya",
    "Garpu Jalan Terakhir: Menghitung Angka Kebebasan Finansial (FIRE)"
  ];
  
  const idx = (roundNumber - 9) % titles.length;
  const currentTitle = titles[idx];

  return {
    round: roundNumber,
    title: currentTitle,
    roundTitle: `RONDE ${roundNumber} : UJIAN STRATEGIS KELAS TINGGI`,
    macro: "Kondisi pasar menuntut efisiensi modal dan proteksi arus kas secara ketat.",
    story: `Memasuki Ronde ${roundNumber} (Usia Anda ${36 + Math.floor(roundNumber / 4)} tahun). Portofolio kekayaan bersih Anda saat ini berada di angka ${formatIDR(calculateNetWorth(state))}. 
    
Situasi saat ini menantang Anda pada ${currentTitle.toLowerCase()}. Setiap keputusan yang Anda buat kini memiliki dampak compounding yang jauh lebih besar terhadap target kebebasan finansial Anda.

Pilihlah alokasi sumber daya terbaik antara memperbesar aset, melindungi kas, atau memperkuat daya tahan keluarga.`,
    choices: [
      {
        id: "A",
        name: "Langkah Agresif: Rekapitalisasi & Ekspansi Aset Berpenghasilan Tinggi",
        capitalReq: "Rp 25.000.000",
        roi: "Peningkatan arus kas pasif +Rp 3.000.000/bulan",
        risk: "Keterikatan modal dan risiko pasar",
        oppCost: "Penurunan likuiditas jangka pendek",
        timeImpact: "5-10 jam/minggu",
        type: "Growth Engine",
        typeClass: "badge-leverage",
        execute: (s) => {
          if (s.cash < 25000000) {
            return {
              title: "Kas Tidak Cukup untuk Ekspansi",
              narration: "Anda ingin berekspansi tetapi modal kas likuid tidak memadai. Anda terpaksa berhati-hati.",
              impacts: ["Ekspansi tertahan karena faktor likuiditas"]
            };
          }
          s.cash -= 25000000;
          s.incomePassive += 3000000;
          s.assets.push({ id: `asset_r${roundNumber}`, name: `Aset Produktif Ronde ${roundNumber}`, value: 35000000, liquid: false });
          return {
            title: "Ekspansi Berhasil Memperkuat Arus Kas!",
            narration: "Alokasi modal berjalan efektif. Mesin aset Anda bertambah kuat dan memberikan dividen/arus kas baru setiap bulannya.",
            impacts: ["- Rp 25.000.000 kas terinvestasi", "+ Rp 3.000.000/bulan pendapatan pasif", "Net worth meningkat"]
          };
        }
      },
      {
        id: "B",
        name: "Langkah Defensif: Pertebal Kas & Alokasikan ke Aset Sangat Likuid",
        capitalReq: "Rp 0 (Mengumpulkan simpanan kas)",
        roi: "Margin of safety maksimal menghadapi krisis",
        risk: "Rendah",
        oppCost: "Pertumbuhan nilai aset melambat",
        timeImpact: "0 jam/minggu",
        type: "Capital Preservation",
        typeClass: "badge-reversible",
        execute: (s) => {
          s.stress -= 10;
          return {
            title: "Benteng Likuiditas Diperkuat",
            narration: "Anda memilih menjaga amunisi kas tetap tebal. Tidur Anda nyenyak tanpa khawatir risiko fluktuasi ekonomi.",
            impacts: ["Kas terakumulasi aman", "Stres menurun", "Resiliensi terhadap guncangan darurat maksimal"]
          };
        }
      },
      {
        id: "C",
        name: "Optimasi Efisiensi: Pangkas Biaya Operasional & Naikkan Tabungan",
        capitalReq: "Rp 0",
        roi: "Pengeluaran turun Rp 1.500.000/bulan secara permanen",
        risk: "Pengorbanan gaya hidup sedikit",
        oppCost: "Kenyamanan konsumtif sesaat",
        timeImpact: "0 jam/minggu",
        type: "Cost Discipline",
        typeClass: "badge-reversible",
        execute: (s) => {
          s.expenses = Math.max(12000000, s.expenses - 1500000);
          return {
            title: "Efisiensi Berhasil: Free Cash Flow Melonjak",
            narration: "Anda mengaudit seluruh langganan tak terpakai dan gaya hidup impulsif. Pengeluaran turun Rp 1.500.000/bulan tanpa mengurangi kebahagiaan inti keluarga.",
            impacts: ["Pengeluaran rutin bulanan berkurang Rp 1.500.000/bln", "Free cash flow langsung naik"]
          };
        }
      }
    ]
  };
}

// Helpers
function formatIDR(val) {
  if (isNaN(val)) return "Rp 0";
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val);
}

function calculateNetWorth(state) {
  const totalAssets = state.cash + state.assets.reduce((sum, a) => sum + (a.value || 0), 0) + state.businesses.reduce((sum, b) => sum + (b.valuation || 0), 0);
  const totalDebt = state.debtTotal || 0;
  return totalAssets - totalDebt;
}

function calculateFreeCashFlow(state) {
  const totalIncome = (state.incomeActive || 0) + (state.incomePassive || 0);
  const totalOut = (state.expenses || 0) + (state.debtMonthly || 0);
  return totalIncome - totalOut;
}

// UI Updating
function renderUI() {
  const netWorth = calculateNetWorth(gameState);
  const fcf = calculateFreeCashFlow(gameState);
  
  // Header badges
  document.getElementById('badge-round').textContent = `RONDE ${gameState.round} / ${gameState.maxRounds}`;
  const badgeHealth = document.getElementById('badge-health');
  if (badgeHealth) badgeHealth.textContent = `STAMINA: ${gameState.stamina}%`;

  // Profile
  document.getElementById('char-role').textContent = `${gameState.age} Tahun • Senior Software Engineer (Jakarta)`;
  document.getElementById('stamina-val').textContent = `${gameState.stamina} / 100`;
  document.getElementById('stamina-bar').style.width = `${Math.max(0, Math.min(100, gameState.stamina))}%`;
  document.getElementById('stress-val').textContent = `${gameState.stress} / 100`;
  document.getElementById('stress-bar').style.width = `${Math.max(0, Math.min(100, gameState.stress))}%`;
  
  // Warna bar stres
  const stressBar = document.getElementById('stress-bar');
  if (gameState.stress > 70) {
    stressBar.className = "meter-fill fill-rose";
  } else if (gameState.stress > 40) {
    stressBar.className = "meter-fill fill-amber";
  } else {
    stressBar.className = "meter-fill fill-green";
  }

  // Net Worth & Stats
  document.getElementById('stat-networth').textContent = formatIDR(netWorth);
  
  // Update Mobile Ticker Bar & Mobile Bottom Nav
  if (document.getElementById('ticker-networth')) {
    document.getElementById('ticker-networth').textContent = formatIDR(netWorth);
    document.getElementById('ticker-cash').textContent = formatIDR(gameState.cash);
    document.getElementById('ticker-fcf').textContent = `${fcf >= 0 ? '+' : ''}${formatIDR(fcf)}`;
    document.getElementById('ticker-vital').textContent = `${gameState.stamina} / ${gameState.stress}`;
    document.getElementById('mobile-nav-nw').textContent = `Rp ${(netWorth / 1000000).toFixed(1)} Jt`;
  }
  
  const initialNW = gameState.netWorthHistory[0] || 62600000;
  const nwDelta = netWorth - initialNW;
  const deltaEl = document.getElementById('stat-networth-delta');
  if (nwDelta >= 0) {
    deltaEl.textContent = `▲ +${formatIDR(nwDelta)} sejak awal`;
    deltaEl.className = "nw-delta text-emerald";
  } else {
    deltaEl.textContent = `▼ ${formatIDR(nwDelta)} sejak awal`;
    deltaEl.className = "nw-delta text-rose";
  }

  document.getElementById('stat-cash').textContent = formatIDR(gameState.cash);
  const monthsBuffer = ((gameState.cash / Math.max(1, gameState.expenses))).toFixed(1);
  document.getElementById('stat-cash-buffer').textContent = `~${monthsBuffer} Bln Pengeluaran`;

  const fcfEl = document.getElementById('stat-fcf');
  fcfEl.textContent = `${fcf >= 0 ? '+' : ''}${formatIDR(fcf)}`;
  fcfEl.className = `m-val font-mono ${fcf >= 0 ? 'text-cyan' : 'text-rose'}`;

  // Cash flow details
  document.getElementById('stat-income-active').textContent = formatIDR(gameState.incomeActive);
  document.getElementById('stat-income-passive').textContent = formatIDR(gameState.incomePassive);
  document.getElementById('stat-expenses').textContent = formatIDR(gameState.expenses);
  document.getElementById('stat-debt-monthly').textContent = `${formatIDR(gameState.debtMonthly)} / bln`;
  document.getElementById('stat-debt-total').textContent = formatIDR(gameState.debtTotal);

  // Assets & Business
  const assetsContainer = document.getElementById('assets-list');
  assetsContainer.innerHTML = '';
  
  gameState.assets.forEach(asset => {
    const item = document.createElement('div');
    item.className = 'data-row';
    item.innerHTML = `<span>${asset.name}</span><span class="font-mono text-cyan">${formatIDR(asset.value)}</span>`;
    assetsContainer.appendChild(item);
  });

  gameState.businesses.forEach(biz => {
    const item = document.createElement('div');
    item.className = 'data-row';
    item.innerHTML = `<span>🏢 ${biz.name}</span><span class="font-mono text-emerald">+${formatIDR(biz.mrr)}/bln</span>`;
    assetsContainer.appendChild(item);
  });

  if (gameState.assets.length === 0 && gameState.businesses.length === 0) {
    assetsContainer.innerHTML = '<span class="text-dim">Belum memiliki portofolio aset produktif.</span>';
  }

  // Skills
  const skillsContainer = document.getElementById('skills-grid');
  skillsContainer.innerHTML = '';
  gameState.skills.forEach(skill => {
    const tag = document.createElement('span');
    tag.className = 'skill-tag';
    tag.textContent = `${skill.name}: ${skill.level}`;
    skillsContainer.appendChild(tag);
  });

  // Milestones Check
  checkMilestones();
  const targetList = document.getElementById('target-list');
  targetList.innerHTML = '';
  gameState.targets.forEach(t => {
    const li = document.createElement('li');
    li.className = `target-item ${t.achieved ? 'completed' : ''}`;
    li.innerHTML = `<span>${t.achieved ? '✅' : '⏳'}</span> <span>${t.label}</span>`;
    targetList.appendChild(li);
  });

  // Render Skenario & Pilihan
  renderCurrentScenario();
  renderHistory();
}

function checkMilestones() {
  const fcf = calculateFreeCashFlow(gameState);
  // Emergency Fund: 6x pengeluaran
  const efTarget = gameState.targets.find(t => t.id === 'emergency_fund');
  if (efTarget && gameState.cash >= (gameState.expenses * 6)) efTarget.achieved = true;

  // School fund: cash >= 25 jt
  const sfTarget = gameState.targets.find(t => t.id === 'school_fund');
  if (sfTarget && gameState.cash >= 25000000 && gameState.round >= 2) sfTarget.achieved = true;

  // Debt Free
  const dfTarget = gameState.targets.find(t => t.id === 'debt_free');
  if (dfTarget && gameState.debtTotal <= 0) dfTarget.achieved = true;

  // First Side Asset
  const saTarget = gameState.targets.find(t => t.id === 'first_side_asset');
  if (saTarget && (gameState.incomePassive > 500000 || gameState.businesses.length > 0)) saTarget.achieved = true;

  // FI Target (Financial Independence)
  const fiTarget = gameState.targets.find(t => t.id === 'fi_target');
  if (fiTarget && gameState.incomePassive >= gameState.expenses && gameState.debtTotal === 0) fiTarget.achieved = true;
}

function renderCurrentScenario() {
  const scenario = getScenarioForRound(gameState.round);
  if (!scenario) return;

  document.getElementById('scenario-round-title').textContent = scenario.roundTitle || `RONDE ${gameState.round}`;
  document.getElementById('time-free-pill').textContent = `⏳ Waktu Luang: ${gameState.freeHours} Jam / Minggu`;
  document.getElementById('scenario-title').textContent = scenario.title;
  document.getElementById('scenario-description').innerHTML = scenario.story.replace(/\n/g, '<br>');
  document.getElementById('macro-text').textContent = scenario.macro || "Stabilitas makro normal.";

  const choicesGrid = document.getElementById('choices-grid');
  choicesGrid.innerHTML = '';

  scenario.choices.forEach(c => {
    const card = document.createElement('div');
    card.className = 'choice-card';
    card.innerHTML = `
      <div>
        <div class="card-top-row">
          <span class="choice-letter">PILIHAN ${c.id}</span>
          <span class="choice-type-badge ${c.typeClass || 'badge-reversible'}">${c.type || 'Keputusan'}</span>
        </div>
        <h4 class="choice-name">${c.name}</h4>
        
        <div class="choice-meta-grid">
          <div class="meta-row">
            <span class="meta-label">Modal / Biaya:</span>
            <span class="meta-val font-mono">${c.capitalReq}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Potensi Hasil:</span>
            <span class="meta-val text-emerald font-bold">${c.roi}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Risiko Utama:</span>
            <span class="meta-val text-rose">${c.risk}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Opp. Cost:</span>
            <span class="meta-val text-amber">${c.oppCost}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Dampak Waktu:</span>
            <span class="meta-val">${c.timeImpact}</span>
          </div>
        </div>
      </div>
      <button class="btn-choose" data-choice="${c.id}">Eksekusi Keputusan ${c.id} ➔</button>
    `;

    card.querySelector('.btn-choose').addEventListener('click', (e) => {
      e.stopPropagation();
      executeChoice(c);
    });

    choicesGrid.appendChild(card);
  });
}

function executeChoice(choice) {
  // Sembunyikan choices, tampilkan panel resolusi
  document.getElementById('decision-section').classList.add('hidden');
  
  // Eksekusi fungsi konsekuensi
  const result = choice.execute(gameState);

  // Simulasi penambahan kas kuartalan dari Free Cash Flow (3 bulan per ronde)
  const fcfMonthly = calculateFreeCashFlow(gameState);
  const fcfQuarterly = fcfMonthly * 3;
  gameState.cash += fcfQuarterly;

  // Cicilan utang berkurang jika ada utang bulanan
  if (gameState.debtTotal > 0 && gameState.debtMonthly > 0) {
    const debtPaid = gameState.debtMonthly * 3;
    gameState.debtTotal = Math.max(0, gameState.debtTotal - debtPaid);
    if (gameState.debtTotal === 0) gameState.debtMonthly = 0;
  }

  // Update Net Worth
  const currentNetWorth = calculateNetWorth(gameState);
  gameState.netWorthHistory.push(currentNetWorth);

  // Simpan riwayat
  gameState.history.push({
    round: gameState.round,
    title: getScenarioForRound(gameState.round).title,
    choiceId: choice.id,
    choiceName: choice.name,
    resultTitle: result.title,
    resultSummary: result.narration,
    fcfQuarterly: fcfQuarterly,
    netWorth: currentNetWorth
  });

  // Tampilkan resolusi
  const resPanel = document.getElementById('resolution-panel');
  resPanel.classList.remove('hidden');
  document.getElementById('res-title').textContent = result.title;
  document.getElementById('res-story').textContent = result.narration;

  const impactsContainer = document.getElementById('res-impacts');
  impactsContainer.innerHTML = '';
  
  // Dampak spesifik
  result.impacts.forEach(imp => {
    const div = document.createElement('div');
    div.className = 'impact-item';
    div.innerHTML = `<span>🔹</span> <span>${imp}</span>`;
    impactsContainer.appendChild(div);
  });

  // Dampak kuartal FCF
  const fcfDiv = document.createElement('div');
  fcfDiv.className = 'impact-item';
  fcfDiv.innerHTML = `<span>📈</span> <span>Akumulasi Free Cash Flow 3 bulan (1 Kuartal): <strong>${fcfQuarterly >= 0 ? '+' : ''}${formatIDR(fcfQuarterly)}</strong></span>`;
  impactsContainer.appendChild(fcfDiv);

  // Scroll otomatis ke resolution panel untuk pengalaman mobile yang mulus
  resPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Trigger confetti jika ada pencapaian besar
  if (result.title.includes('Sukses') || result.title.includes('Melonjak') || result.title.includes('Lunas')) {
    if (typeof confetti === 'function') confetti({ particleCount: 50, spread: 60 });
  }

  // Update UI Stats
  renderUI();
}

function nextRound() {
  document.getElementById('resolution-panel').classList.add('hidden');
  document.getElementById('decision-section').classList.remove('hidden');

  // Cek apakah mencapai Ronde 5, 10, 15 (Audit 5 Ronde) atau 20 (Final Report)
  if (gameState.round % 5 === 0 || gameState.round === gameState.maxRounds) {
    showAuditReport(gameState.round);
  }

  if (gameState.round < gameState.maxRounds) {
    gameState.round += 1;
    gameState.quarter += 1;
    if (gameState.quarter > 4) {
      gameState.quarter = 1;
      gameState.age += 1;
    }
    renderUI();
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    // Game Selesai
    showFinalReport();
  }
}

function showAuditReport(roundNum) {
  const modal = document.getElementById('audit-modal');
  modal.classList.remove('hidden');

  const titleEl = document.getElementById('audit-title');
  const bodyEl = document.getElementById('audit-body');

  const currentNW = calculateNetWorth(gameState);
  const nwDelta = currentNW - gameState.netWorthHistory[0];

  titleEl.textContent = roundNum === 20 ? "🏆 LAPORAN AKHIR SIMULASI 20 RONDE" : `📋 AUDIT KINERJA STRATEGIS (RONDE ${roundNum - 4} s/d ${roundNum})`;

  // Analisis mendalam berbasis data
  let analysisHtml = `
    <div class="audit-section-box">
      <h4>1. Pola Pengambilan Keputusan & Profil Risiko</h4>
      <p>Dari ${gameState.history.length} ronde yang telah dilalui, Anda menunjukkan profil: <strong>${gameState.cash > 80000000 ? 'Disiplin Menjaga Likuiditas Kas' : 'Agresif Mengejar Pertumbuhan'}</strong>. Tingkat stamina fisik berada di angka <strong>${gameState.stamina}%</strong> dan stres <strong>${gameState.stress}%</strong>.</p>
    </div>
    
    <div class="audit-section-box">
      <h4>2. Kualitas Alokasi Modal & Arus Kas</h4>
      <p>Net Worth saat ini: <strong class="font-mono text-emerald">${formatIDR(currentNW)}</strong> (${nwDelta >= 0 ? '+' : ''}${formatIDR(nwDelta)} sejak awal). 
      Pendapatan pasif/bisnis rutin telah mencapai <strong class="font-mono text-cyan">${formatIDR(gameState.incomePassive)}/bulan</strong>.</p>
    </div>

    <div class="audit-section-box">
      <h4>3. Analisis Kesalahan & Opportunity Cost Terbesar</h4>
      <p>Pelajaran terpenting: Mempertahankan likuiditas kas terbukti menjadi senjata terkuat saat krisis medis dan penawaran diskon pasar saham. Hindari mengorbankan kesehatan fisik demi pendapatan aktif murni yang tidak memiliki efek *leverage*.</p>
    </div>
  `;

  bodyEl.innerHTML = analysisHtml;

  // Render chart
  renderChart();
}

function renderChart() {
  const ctx = document.getElementById('networth-chart').getContext('2d');
  if (netWorthChartInstance) {
    netWorthChartInstance.destroy();
  }

  const labels = gameState.netWorthHistory.map((_, i) => i === 0 ? 'Awal' : `R${i}`);
  
  netWorthChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Net Worth (Rp)',
        data: gameState.netWorthHistory,
        borderColor: '#38BDF8',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        fill: true,
        tension: 0.35,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          ticks: {
            color: '#94A3B8',
            callback: (v) => 'Rp ' + (v / 1000000) + ' Jt'
          },
          grid: { color: '#202D49' }
        },
        x: {
          ticks: { color: '#94A3B8' },
          grid: { color: '#202D49' }
        }
      },
      plugins: {
        legend: { labels: { color: '#F8FAFC' } }
      }
    }
  });
}

function renderHistory() {
  const list = document.getElementById('history-list');
  const countEl = document.getElementById('history-count');
  list.innerHTML = '';
  
  if (countEl) countEl.textContent = `${gameState.history.length} Ronde Terekam`;

  if (gameState.history.length === 0) {
    list.innerHTML = '<span class="text-dim">Belum ada keputusan yang dieksekusi.</span>';
    return;
  }

  gameState.history.slice().reverse().forEach(h => {
    const card = document.createElement('div');
    card.className = 'history-card';
    card.innerHTML = `
      <strong>Ronde ${h.round}: ${h.title}</strong>
      <div>Pilihan: <em>${h.choiceId} - ${h.choiceName}</em></div>
      <div class="text-emerald">${h.resultTitle}</div>
      <div class="text-dim">Net Worth: ${formatIDR(h.netWorth)}</div>
    `;
    list.appendChild(card);
  });
}

// Mobile Drawer & Modal Handlers
function setupMobileDrawer() {
  const sidebar = document.getElementById('sidebar-panel');
  const overlay = document.getElementById('drawer-overlay');
  const btnOpen = document.getElementById('btn-open-sidebar');
  const btnClose = document.getElementById('btn-close-drawer');

  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      sidebar.classList.add('drawer-open');
      overlay.classList.remove('hidden');
    });
  }

  const closeDrawer = () => {
    sidebar.classList.remove('drawer-open');
    overlay.classList.add('hidden');
  };

  if (btnClose) btnClose.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  const btnOpenChart = document.getElementById('btn-open-chart');
  if (btnOpenChart) {
    btnOpenChart.addEventListener('click', () => {
      showAuditReport(gameState.round);
    });
  }
}

// Event Listeners
document.getElementById('btn-next-round').addEventListener('click', nextRound);
document.getElementById('btn-close-audit').addEventListener('click', () => {
  document.getElementById('audit-modal').classList.add('hidden');
});
document.getElementById('btn-continue-after-audit').addEventListener('click', () => {
  document.getElementById('audit-modal').classList.add('hidden');
});
document.getElementById('btn-restart').addEventListener('click', () => {
  if (confirm("Mulai ulang seluruh simulasi dari awal?")) {
    gameState = JSON.parse(JSON.stringify(INITIAL_STATE));
    renderUI();
  }
});

// Toggle history list
document.getElementById('toggle-history').addEventListener('click', () => {
  const content = document.getElementById('history-list');
  const arrow = document.getElementById('history-arrow');
  if (content.style.display === 'none') {
    content.style.display = 'flex';
    arrow.textContent = '▼';
  } else {
    content.style.display = 'none';
    arrow.textContent = '▲';
  }
});

// Init
window.addEventListener('DOMContentLoaded', () => {
  renderUI();
  setupMobileDrawer();
});
