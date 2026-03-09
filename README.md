# 🌟 Ceria Belajar

**Ceria Belajar** (formerly Cerdas Ceria) is an interactive and fun educational web application designed for children to learn various subjects through engaging activities and games.

## 🚀 Fitur Utama

- **🔤 Alfabet**: Mengenal huruf dan cara membacanya.
- **🔢 Angka**: Belajar membilang dan mengenal angka.
- **➕ Matematika**: Latihan berhitung dasar yang interaktif.
- **📖 Membaca**: Sesi interaktif untuk mengasah kemampuan membaca.
- **🧩 Mencocokkan**: Game edukatif untuk melatih logika dan ingatan.
- **🌈 Nama-Nama**: Mengenal nama benda, hewan, dan lingkungan sekitar.
- **🧪 Sains**: Eksperimen sederhana dan pengenalan dunia sekitar.
- **🇬🇧 English**: Dasar-dasar Bahasa Inggris untuk anak.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vite.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Animations**: [Canvas Confetti](https://www.kirilv.com/canvas-confetti/)
- **Styling**: Vanilla CSS with modern design (glassmorphism, vibrant colors).

## 📂 Struktur Proyek

- `src/pages/`: Berisi halaman-halaman utama untuk setiap kategori belajar.
- `src/components/`: Komponen UI yang reusable.
- `src/assets/`: Media (gambar, audio, dll).
- `public/`: Asset publik yang dapat diakses langsung.
- `scripts/`: Python scripts (`generate_audio.py`, etc.) untuk menghasilkan asset suara secara otomatis.

## 🏁 Memulai

### Prasyarat
- [Node.js](https://nodejs.org/) (versi terbaru direkomendasikan)
- [npm](https://www.npmjs.com/)

### Instalasi
1. Clone repository ini.
2. Jalankan `npm install` untuk menginstal dependensi.

### Menjalankan Mode Development
```bash
npm run dev
```

### Build untuk Produksi
```bash
npm run build
```

## 🎙️ Multimedia & Audio
Proyek ini menggunakan script Python untuk menghasilkan audio pembelajaran:
- `generate_audio.py`: Menggenerasi suara untuk konten umum.
- `generate_angka_audio.py`: Khusus untuk pengucapan angka.
- `generate_backsound.py`: Menangani musik latar.

---
Dibuat dengan ❤️ untuk menceriakan waktu belajar anak!
