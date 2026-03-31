import React from 'react';
import { FiArrowUp } from 'react-icons/fi';
import logoBlack from '../assets/logo-black.png';
import logoWhite from '../assets/logo-white.png';

const Footer = ({ theme }) => {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <footer style={{ borderColor: 'var(--bd-dim)' }} className='border-t'>
            <div className='max-w-6xl mx-auto px-6 py-8 flex items-center justify-between'>
                <div>
                    <img
                        src={theme === 'dark' ? logoWhite : logoBlack}
                        alt='Logo'
                        className='w-10 h-10 object-contain transition-opacity duration-300'
                    />
                    {/* <p style={{ color: 'var(--t1)' }} className='text-sm font-bold tracking-tight'>
                        Dhanu<span style={{ color: 'var(--t6)' }}> Satrio<span style={{ color: 'var(--t1)' }}> Darjanto</span></span>
                    </p> */}
                    <p style={{ color: 'var(--t2)' }} className='text-xs mt-1'>
                        Made with too much coffee ☕ • 2024
                    </p>
                </div>

                <button
                    onClick={scrollToTop}
                    style={{ borderColor: 'var(--t2)', color: 'var(--t1)' }}
                    className='border hover:border-[var(--t1)] hover:text-[var(--t1)] p-2.5 rounded-full transition-all duration-200'
                    aria-label='Scroll to top'
                >
                    <FiArrowUp size={15} />
                </button>
            </div>
        </footer>
    );
};

export default Footer;
