import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollManager() {
    const location = useLocation();

    // Pulihkan posisi scroll saat path berubah
    useEffect(() => {
        const savedPosition = sessionStorage.getItem(`scrollPos-${location.pathname}`);
        
        if (savedPosition) {
            // setTimeout digunakan agar proses scroll terjadi setelah halaman selesai di-render
            setTimeout(() => {
                window.scrollTo(0, parseInt(savedPosition, 10));
            }, 50);
        } else {
            window.scrollTo(0, 0);
        }
    }, [location.pathname]);

    // Simpan posisi scroll secara berkala saat pengguna melakukan scroll
    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;
        
        const handleScroll = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                sessionStorage.setItem(`scrollPos-${location.pathname}`, window.scrollY.toString());
            }, 100);
        };

        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timeoutId);
        };
    }, [location.pathname]);

    return null;
}
