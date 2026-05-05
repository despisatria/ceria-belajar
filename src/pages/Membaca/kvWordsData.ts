// Kata-kata contoh per suku kata konsonan-vokal
// emoji = use emoji display, image = use generated PNG image

export type WordItem = { word: string; emoji?: string; image?: string };

const KV_WORDS: Record<string, WordItem[]> = {
    // === B ===
    ba: [{ word: 'Batu', emoji: '🪨' }, { word: 'Balon', emoji: '🎈' }, { word: 'Baju', emoji: '👕' }],
    bi: [{ word: 'Bibir', emoji: '👄' }, { word: 'Bintang', emoji: '⭐' }, { word: 'Biru', emoji: '🔵' }],
    bu: [{ word: 'Buku', emoji: '📖' }, { word: 'Bunga', emoji: '🌸' }, { word: 'Bulan', emoji: '🌙' }],
    be: [{ word: 'Bebek', emoji: '🦆' }, { word: 'Beruang', emoji: '🐻' }, { word: 'Bel', emoji: '🔔' }],
    bo: [{ word: 'Bola', emoji: '⚽' }, { word: 'Boneka', image: '/images/kv-kata/boneka.png' }, { word: 'Botol', emoji: '🍼' }],

    // === C ===
    ca: [{ word: 'Cacing', emoji: '🪱' }, { word: 'Cangkir', emoji: '☕' }, { word: 'Cat', emoji: '🎨' }],
    ci: [{ word: 'Cincin', emoji: '💍' }, { word: 'Cinta', emoji: '❤️' }, { word: 'Cicak', image: '/images/kv-kata/cicak.png' }],
    cu: [{ word: 'Cumi', emoji: '🦑' }, { word: 'Cuaca', emoji: '⛅' }, { word: 'Cucian', image: '/images/kv-kata/cucian.png' }],
    ce: [{ word: 'Celana', emoji: '👖' }, { word: 'Cerita', emoji: '📖' }, { word: 'Cermin', emoji: '🪞' }],
    co: [{ word: 'Coklat', emoji: '🍫' }, { word: 'Corong', image: '/images/kv-kata/corong.png' }],

    // === D ===
    da: [{ word: 'Dasi', emoji: '👔' }, { word: 'Daun', emoji: '🍃' }, { word: 'Dadu', emoji: '🎲' }],
    di: [{ word: 'Diam', emoji: '🤫' }, { word: 'Dingin', emoji: '🥶' }, { word: 'Dinding', image: '/images/kv-kata/dinding.png' }],
    du: [{ word: 'Dunia', emoji: '🌍' }, { word: 'Duduk', emoji: '🪑' }, { word: 'Duri', image: '/images/kv-kata/duri.png' }],
    de: [{ word: 'Delapan', emoji: '8️⃣' }, { word: 'Dewi', emoji: '👸' }, { word: 'Desa', image: '/images/kv-kata/desa.png' }],
    do: [{ word: 'Doa', emoji: '🤲' }, { word: 'Domba', emoji: '🐑' }, { word: 'Dokter', emoji: '👨‍⚕️' }],

    // === G ===
    ga: [{ word: 'Gajah', emoji: '🐘' }, { word: 'Garam', emoji: '🧂' }, { word: 'Garpu', emoji: '🍴' }],
    gi: [{ word: 'Gigi', emoji: '🦷' }, { word: 'Gitar', emoji: '🎸' }, { word: 'Girang', emoji: '😊' }],
    gu: [{ word: 'Gunung', emoji: '🏔️' }, { word: 'Guru', emoji: '👩‍🏫' }, { word: 'Gula', emoji: '🍬' }],
    ge: [{ word: 'Gelas', emoji: '🥤' }, { word: 'Gereja', emoji: '⛪' }, { word: 'Gelang', image: '/images/kv-kata/gelang.png' }],
    go: [{ word: 'Goreng', emoji: '🍳' }, { word: 'Gorila', emoji: '🦍' }, { word: 'Gol', emoji: '⚽' }],

    // === H ===
    ha: [{ word: 'Harimau', emoji: '🐯' }, { word: 'Hadiah', emoji: '🎁' }, { word: 'Hati', emoji: '❤️' }],
    hi: [{ word: 'Hijau', emoji: '💚' }, { word: 'Hidung', emoji: '👃' }, { word: 'Hitung', emoji: '🔢' }],
    hu: [{ word: 'Hujan', emoji: '🌧️' }, { word: 'Hutan', emoji: '🌳' }, { word: 'Huruf', emoji: '🔤' }],
    he: [{ word: 'Hewan', emoji: '🐾' }, { word: 'Helm', emoji: '🪖' }, { word: 'Helikopter', emoji: '🚁' }],
    ho: [{ word: 'Hotel', emoji: '🏨' }, { word: 'Hormat', emoji: '🫡' }],

    // === J ===
    ja: [{ word: 'Jam', emoji: '🕐' }, { word: 'Jari', emoji: '👆' }, { word: 'Jalan', emoji: '🛤️' }],
    ji: [{ word: 'Jilbab', emoji: '🧕' }, { word: 'Jimat', emoji: '🧿' }],
    ju: [{ word: 'Juara', emoji: '🏆' }, { word: 'Jus', emoji: '🧃' }],
    je: [{ word: 'Jerapah', emoji: '🦒' }, { word: 'Jendela', emoji: '🪟' }, { word: 'Jeruk', emoji: '🍊' }],
    jo: [{ word: 'Joget', emoji: '💃' }],

    // === K ===
    ka: [{ word: 'Kaki', emoji: '🦶' }, { word: 'Kapal', emoji: '🚢' }, { word: 'Kambing', emoji: '🐐' }],
    ki: [{ word: 'Kipas', emoji: '🪭' }, { word: 'Kilat', emoji: '⚡' }, { word: 'Kijang', emoji: '🦌' }],
    ku: [{ word: 'Kucing', emoji: '🐱' }, { word: 'Kuda', emoji: '🐴' }, { word: 'Kura-kura', emoji: '🐢' }],
    ke: [{ word: 'Kelinci', emoji: '🐰' }, { word: 'Kereta', emoji: '🚂' }, { word: 'Kelapa', emoji: '🥥' }],
    ko: [{ word: 'Kopi', emoji: '☕' }, { word: 'Kotak', emoji: '📦' }, { word: 'Koala', emoji: '🐨' }],

    // === L ===
    la: [{ word: 'Laut', emoji: '🌊' }, { word: 'Lampu', emoji: '💡' }, { word: 'Layang-layang', emoji: '🪁' }],
    li: [{ word: 'Lilin', emoji: '🕯️' }, { word: 'Lidah', emoji: '👅' }, { word: 'Lima', emoji: '5️⃣' }],
    lu: [{ word: 'Lumba-lumba', emoji: '🐬' }, { word: 'Luka', emoji: '🩹' }, { word: 'Lubang', emoji: '🕳️' }],
    le: [{ word: 'Lebah', emoji: '🐝' }, { word: 'Lemari', emoji: '🗄️' }, { word: 'Lemon', emoji: '🍋' }],
    lo: [{ word: 'Lobster', emoji: '🦞' }, { word: 'Lomba', emoji: '🏅' }, { word: 'Lonceng', emoji: '🔔' }],

    // === M ===
    ma: [{ word: 'Mata', emoji: '👁️' }, { word: 'Makan', emoji: '🍽️' }, { word: 'Malam', emoji: '🌙' }],
    mi: [{ word: 'Mie', emoji: '🍜' }, { word: 'Minum', emoji: '🥤' }, { word: 'Mimpi', emoji: '💭' }],
    mu: [{ word: 'Mulut', emoji: '👄' }, { word: 'Musik', emoji: '🎵' }, { word: 'Murid', emoji: '🧑‍🎓' }],
    me: [{ word: 'Melon', emoji: '🍈' }, { word: 'Merak', emoji: '🦚' }, { word: 'Merah', emoji: '🔴' }],
    mo: [{ word: 'Monyet', emoji: '🐒' }, { word: 'Mobil', emoji: '🚗' }, { word: 'Motor', emoji: '🏍️' }],

    // === N ===
    na: [{ word: 'Nasi', emoji: '🍚' }, { word: 'Naga', emoji: '🐉' }, { word: 'Nanas', emoji: '🍍' }],
    ni: [{ word: 'Ninja', emoji: '🥷' }],
    nu: [{ word: 'Nuri', emoji: '🦜' }],
    ne: [{ word: 'Nelayan', emoji: '🎣' }, { word: 'Nenas', emoji: '🍍' }],
    no: [{ word: 'Nol', emoji: '0️⃣' }, { word: 'Nota', emoji: '🧾' }],

    // === P ===
    pa: [{ word: 'Payung', emoji: '☂️' }, { word: 'Padi', emoji: '🌾' }, { word: 'Panda', emoji: '🐼' }],
    pi: [{ word: 'Piano', emoji: '🎹' }, { word: 'Pintu', emoji: '🚪' }, { word: 'Pisang', emoji: '🍌' }],
    pu: [{ word: 'Pulau', emoji: '🏝️' }, { word: 'Puzzle', emoji: '🧩' }, { word: 'Pukul', emoji: '🕐' }],
    pe: [{ word: 'Pensil', emoji: '✏️' }, { word: 'Perahu', emoji: '⛵' }, { word: 'Permen', emoji: '🍬' }],
    po: [{ word: 'Pohon', emoji: '🌳' }, { word: 'Polisi', emoji: '👮' }, { word: 'Poci', emoji: '🫖' }],

    // === R ===
    ra: [{ word: 'Raja', emoji: '🤴' }, { word: 'Rakun', emoji: '🦝' }, { word: 'Radio', emoji: '📻' }],
    ri: [{ word: 'Riang', emoji: '😄' }, { word: 'Rindu', emoji: '🥺' }],
    ru: [{ word: 'Rumah', emoji: '🏠' }, { word: 'Rusa', emoji: '🦌' }, { word: 'Ruang', emoji: '🚪' }],
    re: [{ word: 'Roti', emoji: '🍞' }, { word: 'Rembulan', emoji: '🌕' }],
    ro: [{ word: 'Roket', emoji: '🚀' }, { word: 'Robot', emoji: '🤖' }, { word: 'Rosella', emoji: '🌺' }],

    // === S ===
    sa: [{ word: 'Sapi', emoji: '🐄' }, { word: 'Sayur', emoji: '🥬' }, { word: 'Sabun', emoji: '🧼' }],
    si: [{ word: 'Singa', emoji: '🦁' }, { word: 'Siput', emoji: '🐌' }, { word: 'Sirene', emoji: '🚨' }],
    su: [{ word: 'Susu', emoji: '🥛' }, { word: 'Sinar', emoji: '☀️' }, { word: 'Surat', emoji: '✉️' }],
    se: [{ word: 'Sepatu', emoji: '👟' }, { word: 'Sepeda', emoji: '🚲' }, { word: 'Semangka', emoji: '🍉' }],
    so: [{ word: 'Sofa', emoji: '🛋️' }, { word: 'Sosis', emoji: '🌭' }],

    // === T ===
    ta: [{ word: 'Tangan', emoji: '🤚' }, { word: 'Tali', emoji: '🪢' }, { word: 'Taman', emoji: '🏞️' }],
    ti: [{ word: 'Tidur', emoji: '😴' }, { word: 'Tikus', emoji: '🐭' }, { word: 'Tiket', emoji: '🎫' }],
    tu: [{ word: 'Topi', emoji: '🧢' }, { word: 'Tujuh', emoji: '7️⃣' }, { word: 'Tulang', emoji: '🦴' }],
    te: [{ word: 'Telur', emoji: '🥚' }, { word: 'Teman', emoji: '🤝' }, { word: 'Telepon', emoji: '📱' }],
    to: [{ word: 'Tomat', emoji: '🍅' }, { word: 'Toko', emoji: '🏪' }, { word: 'Topeng', emoji: '🎭' }],

    // === W ===
    wa: [{ word: 'Warna', emoji: '🎨' }, { word: 'Wajan', emoji: '🍳' }],
    wi: [{ word: 'Wifi', emoji: '📶' }],
    wu: [],
    we: [],
    wo: [{ word: 'Wortel', emoji: '🥕' }],

    // === Y ===
    ya: [{ word: 'Yakin', emoji: '💪' }],
    yi: [],
    yu: [],
    ye: [],
    yo: [{ word: 'Yogurt', emoji: '🥛' }],
};

export default KV_WORDS;
