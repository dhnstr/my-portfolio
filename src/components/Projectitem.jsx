import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';

const cardVariants = {
    offscreen: { opacity: 0, y: 52, scale: 0.97 },
    onscreen: (i) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring',
            bounce: 0.32,
            duration: 0.72,
            delay: i * 0.1,
        },
    }),
};

const MAINTENANCE_GIF = 'https://media.giphy.com/media/WoWm8YzFQJg5i/giphy.gif';
const CLOSE_DURATION = 220;

const Projectitem = ({ img, title, tech, type, year, duration, index = 0 }) => {
    const [mounted, setMounted] = useState(false);
    const [exiting, setExiting] = useState(false);
    const [gifFailed, setGifFailed] = useState(false);
    const exitTimer = useRef(null);

    const open = useCallback(() => {
        clearTimeout(exitTimer.current);
        setGifFailed(false);
        setExiting(false);
        setMounted(true);
    }, []);

    const close = useCallback(() => {
        setExiting(true);
        exitTimer.current = setTimeout(() => setMounted(false), CLOSE_DURATION);
    }, []);

    useEffect(() => {
        if (!mounted) return undefined;
        const onKey = (e) => { if (e.key === 'Escape') close(); };
        document.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [mounted, close]);

    useEffect(() => () => clearTimeout(exitTimer.current), []);

    const modal = mounted && createPortal(
        <div
            className={`modal-overlay${exiting ? ' exiting' : ''} fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50`}
            onClick={close}
        >
            <div
                className={`modal-card${exiting ? ' exiting' : ''} relative max-w-md w-full rounded-2xl border p-6 shadow-xl`}
                style={{ backgroundColor: 'var(--bg2)', borderColor: 'var(--bd)' }}
                role='dialog'
                aria-modal='true'
                aria-labelledby='project-maintenance-title'
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type='button'
                    onClick={close}
                    style={{ color: 'var(--t3)' }}
                    className='absolute top-4 right-4 text-2xl leading-none hover:text-[var(--t1)] transition-colors'
                    aria-label='Close'
                >
                    ×
                </button>
                <div className='flex flex-col items-center text-center pt-2'>
                    {gifFailed ? (
                        <div
                            className='w-48 h-48 flex items-center justify-center rounded-xl mb-4 text-7xl'
                            style={{ backgroundColor: 'var(--bg)' }}
                            aria-hidden
                        >
                            🚧
                        </div>
                    ) : (
                        <img
                            src={MAINTENANCE_GIF}
                            alt='Under construction'
                            className='w-48 h-48 object-contain rounded-xl mb-4'
                            onError={() => setGifFailed(true)}
                        />
                    )}
                    <h3
                        id='project-maintenance-title'
                        style={{ color: 'var(--t1)' }}
                        className='text-lg font-bold mb-2'
                    >
                        Under Construction
                    </h3>
                    <p style={{ color: 'var(--t5)' }} className='text-sm leading-relaxed mb-6'>
                        The project detail page is not available yet. Please check back later or
                        reach out through the contact section.
                    </p>
                    <button
                        type='button'
                        onClick={close}
                        style={{ borderColor: 'var(--bd)' }}
                        className='text-xs border px-5 py-2.5 rounded-full text-[var(--t3)] hover:bg-[var(--inv)] hover:text-[var(--inv-t)] hover:border-[var(--inv)] transition-all duration-200'
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );

    return (
        <>
            <motion.div
                initial='offscreen'
                whileInView='onscreen'
                viewport={{ once: true, amount: 0.15 }}
                variants={cardVariants}
                custom={index}
                style={{ backgroundColor: 'var(--bg2)', borderColor: 'var(--bd)' }}
                className='group relative overflow-hidden rounded-2xl border hover:border-[var(--bd2)] transition-all duration-300'
            >
                <div className='relative overflow-hidden h-52'>
                    <img
                        src={img}
                        alt={title}
                        className='w-full h-full object-cover group-hover:scale-105 transition-all duration-500 grayscale group-hover:grayscale-0'
                    />
                    <div className='absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors duration-500' />
                    <div className='absolute top-4 right-4'>
                        <span
                            style={{ color: 'var(--t3)', borderColor: 'var(--bd2)', backgroundColor: 'var(--bg)' }}
                            className='text-xs border backdrop-blur-sm px-2.5 py-1 rounded-full'
                        >
                            {year}
                        </span>
                    </div>
                </div>

                <div className='p-6'>
                    <h3 style={{ color: 'var(--t1)' }} className='font-bold text-xl mb-1'>{title}</h3>
                    <p style={{ color: 'var(--t2)' }} className='text-sm mb-5'>{tech}</p>

                    <div style={{ borderColor: 'var(--bd)' }} className='grid grid-cols-2 gap-4 pt-4 border-t'>
                        <div>
                            <p style={{ color: 'var(--t2)' }} className='text-xs mb-1 uppercase tracking-wider'>Type</p>
                            <p style={{ color: 'var(--t3)' }} className='text-sm'>{type}</p>
                        </div>
                        <div>
                            <p style={{ color: 'var(--t2)' }} className='text-xs mb-1 uppercase tracking-wider'>Duration</p>
                            <p style={{ color: 'var(--t3)' }} className='text-sm'>{duration}</p>
                        </div>
                    </div>

                    <button
                        type='button'
                        onClick={open}
                        style={{ borderColor: 'var(--bd)' }}
                        className='mt-5 text-xs border px-4 py-2 rounded-full text-[var(--t3)] hover:bg-[var(--inv)] hover:text-[var(--inv-t)] hover:border-[var(--inv)] transition-all duration-200'
                    >
                        See Project →
                    </button>
                </div>
            </motion.div>
            {modal}
        </>
    );
};

export default Projectitem;
