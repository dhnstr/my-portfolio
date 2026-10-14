import { useEffect, useState } from 'react';
import { FiArrowUp } from 'react-icons/fi';
import { MdAnimation } from 'react-icons/md';
import logoBlack from '../assets/logo-black.png';
import logoWhite from '../assets/logo-white.png';

const Footer = ({ theme, motion, toggleMotion }) => {
    const [showTop, setShowTop] = useState(false);

    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 600);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

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
                        Made with too much coffee ☕ • 2026
                    </p>
                </div>

                <div className='flex items-center gap-3'>
                    <button
                        onClick={toggleMotion}
                        style={{
                            borderColor: motion ? 'var(--t2)' : 'var(--bd)',
                            color: motion ? 'var(--t1)' : 'var(--t5)',
                        }}
                        className='flex items-center gap-2 border px-3.5 py-2 rounded-full text-xs transition-all duration-300 hover:border-[var(--t2)] hover:text-[var(--t1)]'
                        aria-pressed={motion}
                        aria-label='Animasi dekoratif'
                        title={
                            motion
                                ? 'Animasi dekoratif aktif — klik untuk mematikan'
                                : 'Animasi dekoratif mati — klik untuk menyalakan'
                        }
                    >
                        <MdAnimation size={14} className={motion ? 'opacity-100' : 'opacity-50'} />
                        <span className='hidden sm:inline'>Motion</span>
                        <span
                            style={{
                                backgroundColor: motion ? 'var(--t1)' : 'var(--bd)',
                                color: motion ? 'var(--inv-t)' : 'var(--t1)',
                            }}
                            className='px-1.5 py-px rounded-full text-[10px] font-semibold leading-4'
                        >
                            {motion ? 'ON' : 'OFF'}
                        </span>
                    </button>

                    <button
                        onClick={scrollToTop}
                        style={{ borderColor: 'var(--t2)', color: 'var(--t1)' }}
                        className={`border hover:border-[var(--t1)] hover:text-[var(--t1)] p-2.5 rounded-full transition-all duration-300 ${showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'}`}
                        aria-label='Scroll to top'
                    >
                        <FiArrowUp size={15} />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
