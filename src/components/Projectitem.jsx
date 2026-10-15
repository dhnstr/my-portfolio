import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { FiExternalLink, FiGithub, FiLock, FiX } from 'react-icons/fi';

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

const CLOSE_DURATION = 220;

const Projectitem = ({
    img,
    title,
    tech,
    type,
    year,
    duration,
    category,
    description,
    highlights = [],
    techStack,
    githubUrl,
    demoUrl,
    isInternal = false,
    index = 0,
}) => {
    const [mounted, setMounted] = useState(false);
    const [exiting, setExiting] = useState(false);
    const exitTimer = useRef(null);

    const open = useCallback(() => {
        clearTimeout(exitTimer.current);
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

    const stackTags = Array.isArray(techStack) && techStack.length > 0
        ? techStack
        : (typeof tech === 'string' ? tech.split(',').map((s) => s.trim()).filter(Boolean) : []);

    const modal = mounted && createPortal(
        <div
            className={`modal-overlay${exiting ? ' exiting' : ''} fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto`}
            onClick={close}
        >
            <div
                className={`modal-card${exiting ? ' exiting' : ''} relative max-w-2xl w-full rounded-2xl border shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col`}
                style={{ backgroundColor: 'var(--bg2)', borderColor: 'var(--bd)' }}
                role='dialog'
                aria-modal='true'
                aria-labelledby='project-modal-title'
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    type='button'
                    onClick={close}
                    style={{ color: 'var(--t2)' }}
                    className='absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-black/50 hover:bg-black/80 hover:text-[var(--t1)] transition-colors border border-white/10'
                    aria-label='Close modal'
                >
                    <FiX size={16} />
                </button>

                {/* Modal Visual Header */}
                <div className='relative h-48 sm:h-56 w-full shrink-0 overflow-hidden bg-black/40 border-b border-[var(--bd)]'>
                    <img
                        src={img}
                        alt={title}
                        className='w-full h-full object-cover'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-[var(--bg2)] via-black/30 to-black/50' />
                    <div className='absolute bottom-3 left-4 sm:left-6 right-12 flex flex-wrap gap-2 items-center'>
                        <span
                            style={{ color: 'var(--t1)', borderColor: 'var(--bd)', backgroundColor: 'var(--bg)' }}
                            className='text-xs border px-2.5 py-0.5 rounded-full font-mono'
                        >
                            {year}
                        </span>
                        <span
                            style={{ color: 'var(--t2)', borderColor: 'var(--bd)', backgroundColor: 'var(--bg)' }}
                            className='text-xs border px-2.5 py-0.5 rounded-full'
                        >
                            {type}
                        </span>
                        {isInternal && (
                            <span className='inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full border border-amber-500/40 bg-amber-500/15 text-amber-300 font-medium'>
                                <FiLock size={11} /> Internal Enterprise System
                            </span>
                        )}
                    </div>
                </div>

                {/* Modal Scrollable Body */}
                <div className='p-5 sm:p-6 overflow-y-auto space-y-5'>
                    <div>
                        <h3
                            id='project-modal-title'
                            style={{ color: 'var(--t1)' }}
                            className='text-xl sm:text-2xl font-bold tracking-tight mb-2'
                        >
                            {title}
                        </h3>
                        <p style={{ color: 'var(--t5)' }} className='text-sm leading-relaxed'>
                            {description || 'Comprehensive software development project focusing on stability, architectural scalability, and business efficiency.'}
                        </p>
                    </div>

                    {/* Metadata Grid */}
                    <div
                        style={{ borderColor: 'var(--bd)' }}
                        className='grid grid-cols-2 sm:grid-cols-3 gap-3 py-3 border-y text-xs sm:text-sm'
                    >
                        <div>
                            <p style={{ color: 'var(--t4)' }} className='uppercase tracking-wider text-[10px] font-medium mb-1'>Category</p>
                            <p style={{ color: 'var(--t2)' }} className='font-medium'>{category || 'Full Stack'}</p>
                        </div>
                        <div>
                            <p style={{ color: 'var(--t4)' }} className='uppercase tracking-wider text-[10px] font-medium mb-1'>Timeline</p>
                            <p style={{ color: 'var(--t2)' }} className='font-medium'>{duration}</p>
                        </div>
                        <div className='col-span-2 sm:col-span-1'>
                            <p style={{ color: 'var(--t4)' }} className='uppercase tracking-wider text-[10px] font-medium mb-1'>Access Scope</p>
                            <p style={{ color: 'var(--t2)' }} className='font-medium'>{isInternal ? 'Intranet / FMM Restricted' : 'Public / Open Showcase'}</p>
                        </div>
                    </div>

                    {/* Highlights / Features */}
                    {highlights && highlights.length > 0 && (
                        <div>
                            <h4 style={{ color: 'var(--t1)' }} className='text-xs font-semibold uppercase tracking-wider mb-2.5'>
                                Key Highlights & Features
                            </h4>
                            <ul className='space-y-2'>
                                {highlights.map((highlight, idx) => (
                                    <li key={idx} className='flex items-start gap-2.5 text-xs sm:text-sm'>
                                        <span className='mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-[#ff8a00]' />
                                        <span style={{ color: 'var(--t2)' }} className='leading-relaxed'>{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Tech Stack Tags */}
                    <div>
                        <h4 style={{ color: 'var(--t1)' }} className='text-xs font-semibold uppercase tracking-wider mb-2.5'>
                            Tech Stack & Tools
                        </h4>
                        <div className='flex flex-wrap gap-1.5'>
                            {stackTags.map((techItem, idx) => (
                                <span
                                    key={idx}
                                    style={{ borderColor: 'var(--bd)', backgroundColor: 'var(--bg)' }}
                                    className='text-xs border px-2.5 py-1 rounded-full text-[var(--t2)] font-mono'
                                >
                                    {techItem}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Internal Enterprise Note */}
                    {isInternal && (
                        <div
                            style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--bd)' }}
                            className='p-3.5 rounded-xl border flex items-start gap-2.5 text-xs leading-relaxed text-[var(--t3)]'
                        >
                            <FiLock className='text-amber-400 shrink-0 mt-0.5' size={14} />
                            <div>
                                <span className='font-semibold text-[var(--t2)]'>Internal Enterprise System</span>: Source code, production database, and operational endpoints are confidential under enterprise policies at PT. Fajar Mas Murni.
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer Actions */}
                <div
                    style={{ borderColor: 'var(--bd)', backgroundColor: 'var(--bg2)' }}
                    className='px-5 py-3.5 border-t flex flex-wrap items-center justify-between gap-3'
                >
                    <div className='flex flex-wrap items-center gap-2'>
                        {demoUrl && (
                            <a
                                href={demoUrl}
                                target={demoUrl.startsWith('#') ? undefined : '_blank'}
                                rel='noreferrer'
                                onClick={() => {
                                    if (demoUrl.startsWith('#')) {
                                        close();
                                    }
                                }}
                                className='inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full bg-[var(--inv)] text-[var(--inv-t)] hover:opacity-90 transition-all'
                            >
                                <FiExternalLink size={12} />
                                <span>{demoUrl.startsWith('#') ? 'Launch Terminal' : 'Live Demo'}</span>
                            </a>
                        )}
                        {githubUrl && (
                            <a
                                href={githubUrl}
                                target='_blank'
                                rel='noreferrer'
                                className='inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full border border-[var(--bd)] text-[var(--t2)] hover:text-[var(--t1)] hover:border-[var(--inv)] transition-all'
                            >
                                <FiGithub size={12} />
                                <span>View Code</span>
                            </a>
                        )}
                        {isInternal && (
                            <span
                                style={{ borderColor: 'var(--bd)', backgroundColor: 'var(--bg)' }}
                                className='inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border text-[var(--t3)]'
                            >
                                <FiLock size={11} className='text-amber-400' /> Proprietary System
                            </span>
                        )}
                    </div>

                    <button
                        type='button'
                        onClick={close}
                        style={{ borderColor: 'var(--bd)' }}
                        className='text-xs border px-4 py-1.5 rounded-full text-[var(--t3)] hover:text-[var(--t1)] hover:border-[var(--bd2)] transition-all ml-auto'
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
                className='group relative overflow-hidden rounded-2xl border hover:border-[var(--bd2)] transition-all duration-300 flex flex-col'
            >
                <div className='relative overflow-hidden h-52'>
                    <img
                        src={img}
                        alt={title}
                        className='w-full h-full object-cover group-hover:scale-105 transition-all duration-500 grayscale group-hover:grayscale-0'
                    />
                    <div className='absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors duration-500' />
                    <div className='absolute top-4 right-4 flex items-center gap-2'>
                        {isInternal && (
                            <span
                                style={{ borderColor: 'var(--bd2)', backgroundColor: 'var(--bg)' }}
                                className='text-xs border backdrop-blur-sm px-2.5 py-1 rounded-full text-amber-300 inline-flex items-center gap-1'
                            >
                                <FiLock size={10} /> Enterprise
                            </span>
                        )}
                        <span
                            style={{ color: 'var(--t3)', borderColor: 'var(--bd2)', backgroundColor: 'var(--bg)' }}
                            className='text-xs border backdrop-blur-sm px-2.5 py-1 rounded-full'
                        >
                            {year}
                        </span>
                    </div>
                </div>

                <div className='p-6 flex flex-col flex-1'>
                    <h3 style={{ color: 'var(--t1)' }} className='font-bold text-xl mb-1'>{title}</h3>
                    <p style={{ color: 'var(--t2)' }} className='text-sm mb-5'>{tech}</p>

                    <div style={{ borderColor: 'var(--bd)' }} className='grid grid-cols-2 gap-4 pt-4 mb-5 border-t'>
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
                        className='mt-auto text-xs border px-4 py-2 rounded-full text-[var(--t3)] hover:bg-[var(--inv)] hover:text-[var(--inv-t)] hover:border-[var(--inv)] transition-all duration-200 self-start'
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
