import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import { FaFacebookF, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';
import { BiLogoGmail } from 'react-icons/bi';
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
                        <span style={{ color: 'var(--t7)' }}>Code That Works</span>
                    </h1>

                    <p
                        style={{ color: 'var(--t5)' }}
                        className='text-lg sm:text-xl mb-10 max-w-lg leading-relaxed fade-in-up'
                    >
                        Every line written with intent, every project built for real-world impact
                    </p>

                    <div
                        style={{ color: 'var(--t4)' }}
                        className='flex items-center gap-3 mb-10 text-base sm:text-lg fade-in-up'
                    >
                        <span>The</span>
                        <TypeAnimation
                            sequence={[
                                'Web Developer', 1200,
                                'Programmer', 1200,
                                'Software Engineer', 1200,
                                'Tech Enthusiast', 1200,
                                'Code Composer', 1200,
                                'Code Ninja', 1200,
                                'Part-time Gamer', 1200,
                            ]}
                            wrapper='span'
                            cursor={true}
                            repeat={Infinity}
                            style={{ color: 'var(--t1)', fontWeight: 600, display: 'inline-block' }}
                        />
                    </div>

                    <div className='flex flex-wrap gap-3 mb-14 fade-in-up'>
                        <Link to='contact' smooth duration={500} className='cursor-pointer'>
                            <button
                                style={{ backgroundColor: 'var(--inv)', color: 'var(--inv-t)' }}
                                className='px-6 py-3 rounded-full font-medium text-sm hover:opacity-80 transition-opacity'
                            >
                                Get In Touch
                            </button>
                        </Link>
                        <Link to='project' smooth duration={500} className='cursor-pointer'>
                            <button
                                style={{ borderColor: 'var(--bd2)', color: 'var(--t3)' }}
                                className='border px-6 py-3 rounded-full font-medium text-sm transition-all duration-200 hover:text-[var(--t1)] hover:border-[var(--t5)]'
                            >
                                View Projects
                            </button>
                        </Link>
                        <a href={resume} download='CV_Dhanu.pdf'>
                            <button
                                style={{ borderColor: 'var(--bd2)', color: 'var(--t3)' }}
                                className='border px-6 py-3 rounded-full font-medium text-sm transition-all duration-200 hover:text-[var(--t1)] hover:border-[var(--t5)]'
                            >
                                Download CV
                            </button>
                        </a>
                    </div>

                    <div className='flex items-center gap-4 fade-in-up'>
                        <span
                            style={{ color: 'var(--bd2)' }}
                            className='text-xs uppercase tracking-widest mr-2'
                        >
                            Connect
                        </span>
                        {[
                            { href: 'mailto:satriodhanu123@gmail.com', icon: <BiLogoGmail size={20} /> },
                            { href: 'https://www.facebook.com/dhanu.satriod', icon: <FaFacebookF size={17} /> },
                            { href: 'https://www.instagram.com/dhnstr_/', icon: <FaInstagram size={17} /> },
                            { href: 'https://www.linkedin.com/in/dhnstr/', icon: <FaLinkedin size={17} /> },
                            { href: 'https://github.com/dhnstr', icon: <FaGithub size={17} /> },
                        ].map(({ href, icon }, i) => (
                            <a
                                key={i}
                                href={href}
                                target='_blank'
                                rel='noopener noreferrer'
                                style={{ color: 'var(--t6)' }}
                                className='hover:text-[var(--t1)] transition-colors'
                            >
                                {icon}
                            </a>
                        ))}
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
