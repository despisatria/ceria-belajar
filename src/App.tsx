import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MusicToggle from './components/MusicToggle';
import { Link } from 'react-router-dom';
import ScrollManager from './components/ScrollManager';

// Lazy load pages for better performance (Code Splitting)
const Alfabet = lazy(() => import('./pages/Alfabet/Alfabet'));
const AlfabetMenu = lazy(() => import('./pages/Alfabet/AlfabetMenu'));
const AlfabetCocokkan = lazy(() => import('./pages/Alfabet/AlfabetCocokkan'));
const AlfabetBesarKecil = lazy(() => import('./pages/Alfabet/AlfabetBesarKecil'));
const BalonHuruf = lazy(() => import('./pages/Alfabet/BalonHuruf'));
const Angka = lazy(() => import('./pages/Angka/Angka'));
const AngkaMenu = lazy(() => import('./pages/Angka/AngkaMenu'));
const HitungBenda = lazy(() => import('./pages/Angka/HitungBenda'));
const HitungJari = lazy(() => import('./pages/Angka/HitungJari'));
const MenaraBalok = lazy(() => import('./pages/Angka/MenaraBalok'));
const BalonAngka = lazy(() => import('./pages/Angka/BalonAngka'));
const MencocokkanMenu = lazy(() => import('./pages/Mencocokkan/Mencocokkan'));
const GambarSama = lazy(() => import('./pages/Mencocokkan/GambarSama'));
const GambarBerpasangan = lazy(() => import('./pages/Mencocokkan/GambarBerpasangan'));
const CocokkanBayangan = lazy(() => import('./pages/Mencocokkan/CocokkanBayangan'));
const WarnaMenu = lazy(() => import('./pages/Warna/WarnaMenu'));
const MengenalWarna = lazy(() => import('./pages/Warna/MengenalWarna'));
const CocokkanWarna = lazy(() => import('./pages/Warna/CocokkanWarna'));
const Mewarnai = lazy(() => import('./pages/Warna/Mewarnai'));
const BelajarCampurWarna = lazy(() => import('./pages/Warna/BelajarCampurWarna'));
const CampurWarna = lazy(() => import('./pages/Warna/CampurWarna'));
const KelompokkanWarna = lazy(() => import('./pages/Warna/KelompokkanWarna'));
const BalonWarna = lazy(() => import('./pages/Warna/BalonWarna'));
const PancingWarna = lazy(() => import('./pages/Warna/PancingWarna'));
const BukuMewarnai = lazy(() => import('./pages/Warna/BukuMewarnai'));
const CocokkanBentuk = lazy(() => import('./pages/Mencocokkan/CocokkanBentuk'));
const CocokkanIndukAnak = lazy(() => import('./pages/Mencocokkan/CocokkanIndukAnak'));
const HijaiyahMenu = lazy(() => import('./pages/Hijaiyah/HijaiyahMenu'));
const MengenalHijaiyah = lazy(() => import('./pages/Hijaiyah/MengenalHijaiyah'));
const AngkaHijaiyah = lazy(() => import('./pages/Hijaiyah/AngkaHijaiyah'));
const BelajarIqro = lazy(() => import('./pages/Hijaiyah/BelajarIqro'));
const MembacaMenu = lazy(() => import('./pages/Membaca/MembacaMenu'));
const SukuKata = lazy(() => import('./pages/Membaca/SukuKata'));
const MembacaKata = lazy(() => import('./pages/Membaca/MembacaKata'));
const MembacaKata3 = lazy(() => import('./pages/Membaca/MembacaKata3'));
const TebakKata = lazy(() => import('./pages/Membaca/TebakKata'));
const PasangkanKata = lazy(() => import('./pages/Membaca/PasangkanKata'));
const SusunSukuKata = lazy(() => import('./pages/Membaca/SusunSukuKata'));
const PancingKata = lazy(() => import('./pages/Membaca/PancingKata'));
const PohonKata = lazy(() => import('./pages/Membaca/PohonKata'));
const KeretaKata = lazy(() => import('./pages/Membaca/KeretaKata'));
const MatematikaMenu = lazy(() => import('./pages/Matematika/MatematikaMenu'));
const BelajarPenjumlahan = lazy(() => import('./pages/Matematika/BelajarPenjumlahan'));
const BelajarPengurangan = lazy(() => import('./pages/Matematika/BelajarPengurangan'));
const PenjumlahanGaris = lazy(() => import('./pages/Matematika/PenjumlahanGaris'));
const PenguranganGaris = lazy(() => import('./pages/Matematika/PenguranganGaris'));
const KuisTambah = lazy(() => import('./pages/Matematika/KuisTambah'));
const KuisKurang = lazy(() => import('./pages/Matematika/KuisKurang'));
const TebakLompatMaju = lazy(() => import('./pages/Matematika/TebakLompatMaju'));
const TebakLompatMundur = lazy(() => import('./pages/Matematika/TebakLompatMundur'));
const CocokPenjumlahan = lazy(() => import('./pages/Matematika/CocokPenjumlahan'));
const CocokPengurangan = lazy(() => import('./pages/Matematika/CocokPengurangan'));
const SainsMenu = lazy(() => import('./pages/Sains/SainsMenu'));
const MengenalHewan = lazy(() => import('./pages/Sains/MengenalHewan'));
const BagianTumbuhan = lazy(() => import('./pages/Sains/BagianTumbuhan'));
const MengenalCuaca = lazy(() => import('./pages/Sains/MengenalCuaca'));
const TataSurya = lazy(() => import('./pages/Sains/TataSurya'));
const BendaHidupMati = lazy(() => import('./pages/Sains/BendaHidupMati'));
const MateriHuruf = lazy(() => import('./pages/Mengetik/MateriHuruf'));
const GameHuruf = lazy(() => import('./pages/Mengetik/GameHuruf'));
const MateriKata = lazy(() => import('./pages/Mengetik/MateriKata'));
const GameKata = lazy(() => import('./pages/Mengetik/GameKata'));

const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60vh',
    fontSize: '2rem',
    color: 'var(--cat-blue)',
    fontWeight: 'bold',
    flexDirection: 'column',
    gap: '20px'
  }}>
    <div className="loading-spinner" style={{
      width: '50px',
      height: '50px',
      border: '6px solid var(--tertiary)',
      borderTop: '6px solid var(--primary)',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
    <span>Memuat halaman ceria...</span>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

const Placeholder = ({ title }: { title: string }) => (
  <div style={{ textAlign: 'center', padding: '50px' }}>
    <h2>{title} Game Page (Under Construction)</h2>
    <Link to="/" className="btn" style={{ marginTop: '20px' }}>Kembali ke Beranda</Link>
  </div>
);

function App() {
  return (
    <Router>
      <ScrollManager />
      <div className="app-container">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/alfabet" element={<AlfabetMenu />} />
            <Route path="/alfabet/besar" element={<Alfabet />} />
            <Route path="/alfabet/kecil" element={<Alfabet isLowercase={true} />} />
            <Route path="/alfabet/cocokkan" element={<AlfabetCocokkan />} />
            <Route path="/alfabet/cocokkan-kecil" element={<AlfabetCocokkan isLowercase={true} />} />
            <Route path="/alfabet/besar-kecil" element={<AlfabetBesarKecil />} />
            <Route path="/alfabet/balon-huruf" element={<BalonHuruf />} />
            <Route path="/angka" element={<AngkaMenu />} />
            <Route path="/angka/0-20" element={<Angka rangeStart={0} rangeEnd={20} title="Angka 0 - 20" />} />
            <Route path="/angka/21-50" element={<Angka rangeStart={21} rangeEnd={50} title="Angka 21 - 50" />} />
            <Route path="/angka/51-100" element={<Angka rangeStart={51} rangeEnd={100} title="Angka 51 - 100" />} />
            <Route path="/angka/hitung-benda" element={<HitungBenda />} />
            <Route path="/angka/hitung-jari" element={<HitungJari />} />
            <Route path="/angka/menara-balok" element={<MenaraBalok />} />
            <Route path="/angka/balon-angka" element={<BalonAngka />} />
            <Route path="/mencocokkan" element={<MencocokkanMenu />} />
            <Route path="/mencocokkan/gambar-sama" element={<GambarSama />} />
            <Route path="/mencocokkan/gambar-berpasangan" element={<GambarBerpasangan />} />
            <Route path="/mencocokkan/cocokkan-bayangan" element={<CocokkanBayangan />} />
            <Route path="/warna" element={<WarnaMenu />} />
            <Route path="/warna/mengenal" element={<MengenalWarna />} />
            <Route path="/warna/cocokkan-warna" element={<CocokkanWarna />} />
            <Route path="/warna/mewarnai" element={<Mewarnai />} />
            <Route path="/warna/belajar-campur" element={<BelajarCampurWarna />} />
            <Route path="/warna/campur-warna" element={<CampurWarna />} />
            <Route path="/warna/kelompokkan-warna" element={<KelompokkanWarna />} />
            <Route path="/warna/balon-warna" element={<BalonWarna />} />
            <Route path="/warna/pancing-warna" element={<PancingWarna />} />
            <Route path="/warna/buku-mewarnai" element={<BukuMewarnai />} />
            <Route path="/mencocokkan/cocokkan-bentuk" element={<CocokkanBentuk />} />
            <Route path="/mencocokkan/cocokkan-hewan-mirip" element={<CocokkanIndukAnak />} />
            <Route path="/hijaiyah" element={<HijaiyahMenu />} />
            <Route path="/hijaiyah/mengenal" element={<MengenalHijaiyah />} />
            <Route path="/hijaiyah/angka" element={<AngkaHijaiyah />} />
            <Route path="/hijaiyah/iqro" element={<BelajarIqro />} />
            <Route path="/nama" element={<Placeholder title="Nama-nama" />} />
            <Route path="/membaca" element={<MembacaMenu />} />
            <Route path="/membaca/dasar" element={<SukuKata type="dasar" />} />
            <Route path="/membaca/khusus" element={<SukuKata type="khusus" />} />
            <Route path="/membaca/kata" element={<MembacaKata />} />
            <Route path="/membaca/kata3" element={<MembacaKata3 />} />
            <Route path="/membaca/tebak-kata" element={<TebakKata />} />
            <Route path="/membaca/pasangkan-kata" element={<PasangkanKata />} />
            <Route path="/membaca/susun-suku-kata" element={<SusunSukuKata />} />
            <Route path="/membaca/pancing-kata" element={<PancingKata />} />
            <Route path="/membaca/pohon-kata" element={<PohonKata />} />
            <Route path="/membaca/kereta-kata" element={<KeretaKata />} />
            <Route path="/matematika" element={<MatematikaMenu />} />
            <Route path="/matematika/penjumlahan" element={<BelajarPenjumlahan />} />
            <Route path="/matematika/pengurangan" element={<BelajarPengurangan />} />
            <Route path="/matematika/penjumlahan-garis" element={<PenjumlahanGaris />} />
            <Route path="/matematika/pengurangan-garis" element={<PenguranganGaris />} />
            <Route path="/matematika/kuis-tambah" element={<KuisTambah />} />
            <Route path="/matematika/kuis-kurang" element={<KuisKurang />} />
            <Route path="/matematika/tebak-lompat-maju" element={<TebakLompatMaju />} />
            <Route path="/matematika/tebak-lompat-mundur" element={<TebakLompatMundur />} />
            <Route path="/matematika/cocok-tambah" element={<CocokPenjumlahan />} />
            <Route path="/matematika/cocok-kurang" element={<CocokPengurangan />} />
            <Route path="/sains" element={<SainsMenu />} />
            <Route path="/sains/hewan" element={<MengenalHewan />} />
            <Route path="/sains/tumbuhan" element={<BagianTumbuhan />} />
            <Route path="/sains/cuaca" element={<MengenalCuaca />} />
            <Route path="/sains/tata-surya" element={<TataSurya />} />
            <Route path="/sains/hidup-mati" element={<BendaHidupMati />} />
            <Route path="/alfabet/ketik-huruf" element={<MateriHuruf />} />
            <Route path="/alfabet/game-ketik-huruf" element={<GameHuruf />} />
            <Route path="/membaca/ketik-kata" element={<MateriKata />} />
            <Route path="/membaca/game-ketik-kata" element={<GameKata />} />
            <Route path="/english" element={<Placeholder title="English" />} />
          </Routes>
        </Suspense>

        <MusicToggle />
      </div>
    </Router>
  );
}

export default App;
