import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import { Link } from 'react-scroll';
import resume from '../assets/Resume.pdf';
import webBanner from '../assets/web-banner.jpg';

export const Main = () => {
    return (
        <div
            id='main'
            className='relative px-6 pt-24 pb-14'
        >
            <div className='max-w-6xl mx-auto min-h-[72vh] md:min-h-[78vh] grid lg:grid-cols-2 gap-10 lg:gap-12 items-center'>
                <div className='order-2 lg:order-1'>
                    <div className='mb-8 fade-in-up'>
                        <span
                            style={{ color: 'var(--t2)', borderColor: 'var(--bd)' }}
                            className='inline-flex items-center gap-2.5 text-sm border px-4 py-2 rounded-full'
                        >
                            <span
                                style={{ backgroundColor: 'var(--t1)' }}
                                className='w-2 h-2 rounded-full animate-pulse'
                            />
                            Available for Future Projects
                        </span>
                    </div>

                    <h1
                        style={{ color: 'var(--t1)' }}
                        className='text-5xl sm:text-7xl xl:text-[84px] font-bold leading-[1.05] mb-6 tracking-tight fade-in-up'
                    >
                        Building<br />
                        Solutions<span style={{ color: 'var(--bd2)' }}>.</span><br />
                        <TypeAnimation
                            sequence={[
                                'Code That Works',
                                2000,
                                'Built for Real Impact',
                                2000,
                                'Reliable & Maintainable',
                                2000,
                                'Engineered With Intent',
                                2000,
                                'From Idea to Production',
                                2000,
                            ]}
                            wrapper='span'
                            cursor
                            repeat={Infinity}
                            style={{
                                color: 'var(--t7)',
                                fontWeight: 700,
                                display: 'inline-block',
                                minHeight: '1.05em',
                            }}
                        />
                    </h1>

                    <p
                        style={{ color: 'var(--t5)' }}
                        className='text-lg sm:text-xl mb-10 max-w-lg leading-relaxed fade-in-up'
                    >
                        Every line written with intent, every project built for real-world impact
                    </p>

                    <div className='flex flex-wrap gap-3 mb-14 fade-in-up'>
                        <Link to='contact' smooth duration={500} className='cursor-pointer'>
                            <button
                                className='border px-6 py-3 rounded-full font-medium text-sm border-[var(--bd)] bg-transparent text-[var(--t1)] transition-all duration-200 hover:bg-[var(--inv)] hover:text-[var(--inv-t)] hover:border-[var(--inv)]'
                            >
                                Get In Touch
                            </button>
                        </Link>
                        <Link to='project' smooth duration={500} className='cursor-pointer'>
                            <button
                                className='border px-6 py-3 rounded-full font-medium text-sm border-[var(--bd)] bg-transparent text-[var(--t1)] transition-all duration-200 hover:bg-[var(--inv)] hover:text-[var(--inv-t)] hover:border-[var(--inv)]'
                            >
                                View Projects
                            </button>
                        </Link>
                        <a href={resume} download='CV_Dhanu.pdf'>
                            <button
                                className='border px-6 py-3 rounded-full font-medium text-sm border-[var(--inv)] bg-[var(--inv)] text-[var(--inv-t)] transition-all duration-200 hover:bg-transparent hover:text-[var(--t3)] hover:border-[var(--bd)]'
                            >
                                Download CV
                            </button>
                        </a>
                    </div>

                </div>

                <div className='order-1 lg:order-2 fade-in-up'>
                    <div
                        style={{ borderColor: 'var(--bd)' }}
                        className='group relative rounded-2xl overflow-hidden border h-[280px] sm:h-[340px] lg:h-[520px]'
                    >
                        <img
                            src={webBanner}
                            alt='Creative wall background'
                            className='w-full h-full object-cover object-center grayscale group-hover:grayscale-0 transition-[filter] duration-700 scale-x-[-1]'
                        />
                        <div className='absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors duration-700 pointer-events-none' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
