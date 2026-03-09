import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Alfabet from './pages/Alfabet/Alfabet';
import AlfabetMenu from './pages/Alfabet/AlfabetMenu';
import AlfabetCocokkan from './pages/Alfabet/AlfabetCocokkan';
import AlfabetBesarKecil from './pages/Alfabet/AlfabetBesarKecil';
import Angka from './pages/Angka/Angka';
import AngkaMenu from './pages/Angka/AngkaMenu';
import HitungBenda from './pages/Angka/HitungBenda';
import MencocokkanMenu from './pages/Mencocokkan/Mencocokkan';
import GambarSama from './pages/Mencocokkan/GambarSama';
import GambarBerpasangan from './pages/Mencocokkan/GambarBerpasangan';
import CocokkanWarna from './pages/Mencocokkan/CocokkanWarna';
import MusicToggle from './components/MusicToggle';
// Placeholder components for other pages
import { Link } from 'react-router-dom';
const Placeholder = ({ title }: { title: string }) => (
  <div style={{ textAlign: 'center', padding: '50px' }}>
    <h2>{title} Game Page (Under Construction)</h2>
    <Link to="/" className="btn" style={{ marginTop: '20px' }}>Kembali ke Beranda</Link>
  </div>
);

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/alfabet" element={<AlfabetMenu />} />
          <Route path="/alfabet/besar" element={<Alfabet />} />
          <Route path="/alfabet/kecil" element={<Alfabet isLowercase={true} />} />
          <Route path="/alfabet/cocokkan" element={<AlfabetCocokkan />} />
          <Route path="/alfabet/cocokkan-kecil" element={<AlfabetCocokkan isLowercase={true} />} />
          <Route path="/alfabet/besar-kecil" element={<AlfabetBesarKecil />} />
          <Route path="/angka" element={<AngkaMenu />} />
          <Route path="/angka/0-20" element={<Angka rangeStart={0} rangeEnd={20} title="Angka 0 - 20" />} />
          <Route path="/angka/21-50" element={<Angka rangeStart={21} rangeEnd={50} title="Angka 21 - 50" />} />
          <Route path="/angka/51-100" element={<Angka rangeStart={51} rangeEnd={100} title="Angka 51 - 100" />} />
          <Route path="/angka/hitung-benda" element={<HitungBenda />} />
          <Route path="/mencocokkan" element={<MencocokkanMenu />} />
          <Route path="/mencocokkan/gambar-sama" element={<GambarSama />} />
          <Route path="/mencocokkan/gambar-berpasangan" element={<GambarBerpasangan />} />
          <Route path="/mencocokkan/cocokkan-warna" element={<CocokkanWarna />} />
          <Route path="/nama" element={<Placeholder title="Nama-nama" />} />
          <Route path="/membaca" element={<Placeholder title="Membaca" />} />
          <Route path="/matematika" element={<Placeholder title="Matematika" />} />
          <Route path="/sains" element={<Placeholder title="Sains & IPA" />} />
          <Route path="/english" element={<Placeholder title="English" />} />
        </Routes>

        <footer style={{ textAlign: 'center', padding: '40px 20px', marginTop: '20px', color: 'var(--quaternary)', fontWeight: 'bold' }}>
          <p>© {new Date().getFullYear()} Ceria Belajar - Belajar Senang, Tumbuh Cemerlang.</p>
          <p>Game edukasi interaktif untuk anak PAUD & TK.</p>
        </footer>
        <MusicToggle />
      </div>
    </Router>
  );
}

export default App;
