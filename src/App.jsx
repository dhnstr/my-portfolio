import { useState, useEffect } from 'react';
import logoBlack from './assets/logo-black.png';
import logoWhite from './assets/logo-white.png';
import Navbar from './components/Navbar';
import Main from './components/Main';
import Terminal from './components/Terminal';
import Project from './components/Project';
import About from './components/About';
import Skill from './components/Skill';
import Education from './components/Education';
import Work from './components/Work';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
    const [theme, setTheme] = useState('dark');
    const [motion, setMotion] = useState(() => {
        // Baca preferensi sekali di awal (lazy init), selaras dengan script
        // pre-paint di index.html - biar tidak ada flicker ON->OFF->ON saat mount.
        try {
            return localStorage.getItem('portfolio-motion') !== 'off';
        } catch {
            return true;
        }
    });

    const toggleTheme = () =>
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

    // Motion toggle — kontrol animasi dekoratif (marquee, orb, grid, dll).
    // Default: NYALA, biar portfolio langsung "hidup" (termasuk di OS yang
    // mematikan animasi). User bisa matiin lewat tombol "Motion" di footer;
    // pilihannya disimpan di localStorage dan dipakai lagi di kunjungan berikutnya.

    useEffect(() => {
        // Set eksplisit 'on'/'off' — CSS pakai [data-motion="off"] buat berhentiin animasi.
        document.documentElement.setAttribute('data-motion', motion ? 'on' : 'off');
    }, [motion]);

    const toggleMotion = () => {
        setMotion((prev) => {
            const next = !prev;
            try {
                localStorage.setItem('portfolio-motion', next ? 'on' : 'off');
            } catch {
                /* localStorage bisa diblokir — abaikan */
            }
            return next;
        });
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        const href = theme === 'dark' ? logoWhite : logoBlack;
        let link = document.querySelector("link[rel='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = href;
        link.type = 'image/png';
    }, [theme]);

    return (
        <div className='bg-[var(--bg)] min-h-screen'>
            <Navbar theme={theme} toggleTheme={toggleTheme} />
            <Main />
            <Terminal theme={theme} toggleTheme={toggleTheme} />
            <Project />
            <About />
            <Skill />
            <Education />
            <Work />
            <Contact />
            <Footer theme={theme} motion={motion} toggleMotion={toggleMotion} />
        </div>
    );
}

export default App;
