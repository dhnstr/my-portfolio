import React, { useState, useEffect } from 'react';
import logoBlack from './assets/logo-black.png';
import logoWhite from './assets/logo-white.png';
import Navbar from './components/Navbar';
import Main from './components/Main';
import Project from './components/Project';
import About from './components/About';
import Skill from './components/Skill';
import Education from './components/Education';
import Work from './components/Work';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
    const [theme, setTheme] = useState('dark');

    const toggleTheme = () =>
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

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
            <Project />
            <About />
            <Skill />
            <Education />
            <Work />
            <Contact />
            <Footer theme={theme} />
        </div>
    );
}

export default App;
