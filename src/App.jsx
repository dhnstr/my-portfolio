import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Main from './components/Main';
import Project from './components/Project';
import Page from './components/Page';
import Work from './components/Work';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
    const [theme, setTheme] = useState('dark');

    const toggleTheme = () =>
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <div className='bg-[var(--bg)] min-h-screen'>
            <Navbar theme={theme} toggleTheme={toggleTheme} />
            <Main />
            <Project />
            <Page />
            <Work />
            <Contact />
            <Footer />
        </div>
    );
}

export default App;
