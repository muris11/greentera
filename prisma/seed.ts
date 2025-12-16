// Load environment variables FIRST
import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { Level, PrismaClient, TreeStage } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';

// Create pg Pool for adapter
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@greentera.id' },
    update: {},
    create: {
      email: 'admin@greentera.id',
      name: 'Admin Greentera',
      password: adminPassword,
      role: 'ADMIN',
      level: Level.GOLD,
      points: 10000,
      totalWaste: 500,
      treesGrown: 25,
      ecoXp: 0,
      treeStage: TreeStage.SEED,
      location: 'Indonesia',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create demo users
  const demoPassword = await bcrypt.hash('demo123', 12);
  
  const demoUsers: Array<{
    email: string;
    name: string;
    location: string;
    points: number;
    level: Level;
    totalWaste: number;
    treesGrown: number;
    ecoXp?: number;
    treeStage?: TreeStage;
  }> = [
    { email: 'ahmad@example.com', name: 'Ahmad Rizki', location: 'Jakarta', points: 5420, level: Level.GOLD, totalWaste: 156.5, treesGrown: 12 },
    { email: 'siti@example.com', name: 'Siti Nurhaliza', location: 'Bandung', points: 4850, level: Level.GOLD, totalWaste: 142.3, treesGrown: 10 },
    { email: 'budi@example.com', name: 'Budi Santoso', location: 'Surabaya', points: 4200, level: Level.GOLD, totalWaste: 128.7, treesGrown: 9 },
    { email: 'dewi@example.com', name: 'Dewi Lestari', location: 'Yogyakarta', points: 3100, level: Level.SILVER, totalWaste: 98.2, treesGrown: 7 },
    { email: 'demo@greentera.id', name: 'Demo User', location: 'Indonesia', points: 1250, level: Level.GOLD, totalWaste: 45.5, treesGrown: 3, ecoXp: 850, treeStage: TreeStage.LARGE },
  ];

  for (const userData of demoUsers) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        password: demoPassword,
        role: 'USER',
        ecoXp: userData.ecoXp || 0,
        treeStage: userData.treeStage || TreeStage.SEED,
      },
    });
  }
  console.log('✅ Demo users created');

  // Create education articles
  const articles = [
    {
      title: 'Cara Memilah Sampah yang Benar',
      content: `
# Cara Memilah Sampah yang Benar

Pemilahan sampah adalah langkah penting dalam pengelolaan limbah yang ramah lingkungan. Berikut adalah panduan lengkap untuk memilah sampah dengan benar.

## Jenis-Jenis Sampah

### 1. Sampah Organik (🟢)
- Sisa makanan
- Kulit buah dan sayur
- Daun-daun kering
- Kertas yang sudah kotor dengan makanan

### 2. Sampah Plastik (🔵)
- Botol plastik
- Kemasan makanan
- Kantong plastik
- Wadah plastik

### 3. Sampah Logam (🟡)
- Kaleng minuman
- Kaleng makanan
- Tutup botol logam
- Aluminium foil

### 4. Sampah Kertas (🟤)
- Kertas HVS
- Kardus
- Majalah dan koran
- Karton

## Tips Pemilahan yang Efektif

1. **Siapkan tempat sampah terpisah** - Minimal 3 wadah: organik, daur ulang, dan residu
2. **Bersihkan sebelum membuang** - Cuci wadah plastik/kaleng sebelum dibuang
3. **Pipihkan kemasan** - Untuk menghemat ruang
4. **Pisahkan langsung** - Biasakan memilah saat membuang, bukan dikumpulkan dulu

Dengan memilah sampah dengan benar, Anda berkontribusi dalam menjaga lingkungan dan memudahkan proses daur ulang!
      `,
      category: 'Pemilahan Sampah',
    },
    {
      title: 'Dampak Sampah Plastik terhadap Lingkungan',
      content: `
# Dampak Sampah Plastik terhadap Lingkungan

Plastik adalah salah satu pencemaran terbesar di bumi. Berikut adalah fakta-fakta mengejutkan tentang dampak sampah plastik.

## Fakta Mengejutkan

- **500 tahun** - Waktu yang dibutuhkan plastik untuk terurai
- **8 juta ton** - Plastik yang masuk ke laut setiap tahun
- **100.000** - Hewan laut yang mati karena plastik setiap tahun

## Dampak pada Ekosistem

### Laut
Mikroplastik mencemari seluruh rantai makanan laut, dari plankton hingga paus.

### Darat
Plastik mengganggu kesuburan tanah dan mencemari sumber air tanah.

### Udara
Pembakaran plastik melepaskan gas beracun yang berbahaya bagi kesehatan.

## Solusi

1. Kurangi penggunaan plastik sekali pakai
2. Gunakan tas belanja reusable
3. Pilih produk dengan kemasan minimal
4. Daur ulang dengan benar

Mari mulai dari diri sendiri untuk masa depan yang lebih hijau!
      `,
      category: 'Dampak Lingkungan',
    },
    {
      title: 'Manfaat Daur Ulang Sampah',
      content: `
# Manfaat Daur Ulang Sampah

Daur ulang bukan hanya baik untuk lingkungan, tapi juga memberikan banyak manfaat lainnya.

## Manfaat Lingkungan

- Mengurangi sampah di TPA
- Menghemat sumber daya alam
- Mengurangi emisi gas rumah kaca
- Melindungi habitat satwa liar

## Manfaat Ekonomi

- Menciptakan lapangan kerja
- Menghemat biaya produksi
- Menghasilkan produk baru dari bahan bekas

## Apa yang Bisa Didaur Ulang?

| Bahan | Contoh | Hasil Daur Ulang |
|-------|--------|------------------|
| Kertas | Koran, kardus | Kertas baru, tissue |
| Plastik | Botol PET | Serat polyester, botol baru |
| Logam | Kaleng aluminium | Kaleng baru, komponen mobil |
| Kaca | Botol kaca | Kaca baru, aspal |

Mulai daur ulang hari ini dengan Greentera!
      `,
      category: 'Daur Ulang',
    },
  ];

  for (const article of articles) {
    await prisma.educationArticle.upsert({
      where: { title: article.title },
      update: {},
      create: article,
    });
  }
  console.log('✅ Education articles created');

  // Create quizzes
  const quizzes = [
    {
      question: 'Sampah kulit pisang termasuk jenis sampah apa?',
      options: ['Plastik', 'Organik', 'Logam', 'B3'],
      correctAnswer: 'Organik',
      category: 'Pemilahan Sampah',
      pointsReward: 10,
    },
    {
      question: 'Berapa lama waktu yang dibutuhkan plastik untuk terurai?',
      options: ['10 tahun', '50 tahun', '100 tahun', '500 tahun'],
      correctAnswer: '500 tahun',
      category: 'Dampak Lingkungan',
      pointsReward: 15,
    },
    {
      question: 'Warna tempat sampah untuk sampah organik biasanya adalah?',
      options: ['Merah', 'Biru', 'Hijau', 'Kuning'],
      correctAnswer: 'Hijau',
      category: 'Pemilahan Sampah',
      pointsReward: 10,
    },
    {
      question: 'Apa manfaat utama dari daur ulang kertas?',
      options: [
        'Menambah sampah',
        'Mengurangi penebangan pohon',
        'Membuat udara kotor',
        'Tidak ada manfaat'
      ],
      correctAnswer: 'Mengurangi penebangan pohon',
      category: 'Daur Ulang',
      pointsReward: 10,
    },
    {
      question: 'Kaleng minuman aluminium termasuk jenis sampah?',
      options: ['Organik', 'Plastik', 'Logam', 'Kertas'],
      correctAnswer: 'Logam',
      category: 'Pemilahan Sampah',
      pointsReward: 10,
    },
  ];

  for (const quiz of quizzes) {
    await prisma.educationQuiz.upsert({
      where: { question: quiz.question },
      update: {},
      create: quiz,
    });
  }
  console.log('✅ Quizzes created');

  console.log('🌿 Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
