import React, { useState } from 'react';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { BsMoon, BsSun } from 'react-icons/bs';
import { Link } from 'react-scroll';
import resume from '../assets/Resume.pdf';
import logoBlack from '../assets/logo-black.png';
import logoWhite from '../assets/logo-white.png';

const ThemeToggle = ({ theme, toggleTheme }) => (
    <button
        onClick={toggleTheme}
        aria-label='Toggle theme'
        className='flex items-center gap-2 cursor-pointer shrink-0'
    >
        <BsMoon
            size={12}
            style={{ color: 'var(--t5)' }}
            className={`transition-opacity duration-300 ${theme === 'dark' ? 'opacity-100' : 'opacity-25'}`}
        />
        <div
            style={{
                border: `1px solid var(--bd2)`,
                backgroundColor: theme === 'light' ? 'var(--inv)' : 'transparent',
            }}
            className='relative w-10 h-[22px] rounded-full transition-all duration-300'
        >
            <div
                style={{ backgroundColor: theme === 'dark' ? 'var(--t3)' : 'var(--inv-t)' }}
                className={`absolute top-[3px] w-4 h-4 rounded-full transition-all duration-300 ${
                    theme === 'dark' ? 'translate-x-[2px]' : 'translate-x-[20px]'
                }`}
            />
        </div>
        <BsSun
            size={12}
            style={{ color: 'var(--t5)' }}
            className={`transition-opacity duration-300 ${theme === 'light' ? 'opacity-100' : 'opacity-25'}`}
        />
    </button>
);

const Navbar = ({ theme, toggleTheme }) => {
    const [nav, setNav] = useState(false);

    const navLinks = [
        { to: 'main',    label: 'Home' },
        { to: 'project', label: 'Projects' },
        { to: 'about',   label: 'About' },
        { to: 'skill',   label: 'Stack' },
        { to: 'education', label: 'Education' },
        { to: 'work',    label: 'Experience' },
        { to: 'contact', label: 'Contact' },
    ];

    return (
        <nav
            style={{ backgroundColor: 'var(--bg)' }}
            className='fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-[var(--bd)] backdrop-blur-md'
        >
            <div className='max-w-6xl mx-auto px-6 py-5 flex items-center justify-between'>
                <Link to='main' spy smooth duration={500} className='cursor-pointer inline-flex items-center gap-2'>
                    <img
                        src={theme === 'dark' ? logoWhite : logoBlack}
                        alt='Logo'
                        className='w-10 h-10 object-contain transition-opacity duration-300'
                    />
                    <span style={{ color: 'var(--t1)' }} className='font-bold text-base tracking-tight'>
                        Dhanu<span style={{ color: 'var(--t6)' }}> Satrio <span style={{ color: 'var(--t1)' }}>Darjanto</span></span>
                    </span>
                </Link>

                <div className='hidden md:flex items-center gap-6'>
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            spy
                            smooth
                            duration={500}
                            activeClass='!text-[var(--t1)]'
                            style={{ color: 'var(--t4)' }}
                            className='text-sm transition-colors duration-200 cursor-pointer hover:text-[var(--t1)]'
                        >
                            {link.label}
                        </Link>
                    ))}

                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

                    <a
                        href={resume}
                        download='CV_Dhanu.pdf'
                        className='text-sm px-5 py-2 rounded-full font-medium border border-[var(--inv)] bg-[var(--inv)] text-[var(--inv-t)] transition-all duration-200 hover:bg-transparent hover:text-[var(--t3)] hover:border-[var(--bd)]'
                    >
                        Download CV
                    </a>
                </div>

                <div className='flex items-center gap-4 md:hidden'>
                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                    <button
                        onClick={() => setNav(!nav)}
                        style={{ color: 'var(--t3)' }}
                        className='hover:text-[var(--t1)] transition-colors'
                    >
                        {nav ? <AiOutlineClose size={22} /> : <AiOutlineMenu size={22} />}
                    </button>
                </div>
            </div>

            {nav && (
                <div
                    style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--bd)' }}
                    className='md:hidden border-t px-6 py-6 flex flex-col gap-1'
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            spy
                            smooth
                            duration={500}
                            onClick={() => setNav(false)}
                            style={{ color: 'var(--t4)', borderColor: 'var(--bd-dim)' }}
                            className='text-base transition-colors cursor-pointer py-3 border-b last:border-0 hover:text-[var(--t1)]'
                        >
                            {link.label}
                        </Link>
                    ))}
                    <a
                        href={resume}
                        download='CV_Dhanu.pdf'
                        className='text-sm px-5 py-3 rounded-full font-medium text-center mt-4 border border-[var(--inv)] bg-[var(--inv)] text-[var(--inv-t)] transition-all duration-200 hover:bg-transparent hover:text-[var(--t3)] hover:border-[var(--bd)]'
                    >
                        Download CV
                    </a>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
