import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import profileImage from '../assets/profile.png';

function About() {
    return (
        <div id='about' className='py-28 px-6'>
            <div className='max-w-6xl mx-auto'>
                <div className='grid md:grid-cols-2 gap-16 items-center'>
                    <div>
                        <div
                            style={{ color: 'var(--t2)', borderColor: 'var(--bd)' }}
                            className='inline-flex items-center gap-2 text-xs border px-4 py-2 rounded-full mb-8 uppercase tracking-widest'
                        >
                            About
                        </div>

                        <h2
                            style={{ color: 'var(--t1)' }}
                            className='text-4xl sm:text-5xl font-bold mb-6 leading-tight'
                        >
                            Hey there 👋 I'm Dhanu your go-to{' '}
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
                                style={{ color: 'var(--t7)', fontWeight: 600, display: 'inline-block' }}
                            />
                        </h2>

                        <p style={{ color: 'var(--t5)' }} className='text-base leading-relaxed mb-4'>
                            Hi! I&apos;m a Web Developer with a strong background in both backend and frontend development,
                            passionate about building efficient, scalable, and user-friendly web applications.
                        </p>
                        <p style={{ color: 'var(--t5)' }} className='text-base leading-relaxed mb-4'>
                            I graduated with a Bachelor&apos;s degree in Informatics from Telkom University (GPA 3.94), where I
                            developed a solid foundation in software engineering, databases, and web technologies. During my
                            academic journey, I also served as a Practicum Assistant and Assistant Lecturer, supporting courses
                            such as Operating Systems and Discrete Mathematics—an experience that strengthened my
                            problem-solving, communication, and time management skills.
                        </p>
                        <p style={{ color: 'var(--t5)' }} className='text-base leading-relaxed mb-4'>
                            Currently, I work at PT Fajar Mas Murni, where I&apos;m involved in developing and maintaining internal
                            web applications using PHP (CodeIgniter), SQL Server, HTML, CSS, and JavaScript. I focus on writing
                            clean, maintainable code, optimizing database queries, and delivering solutions that align with
                            business needs and enhance user experience.
                        </p>
                        <p style={{ color: 'var(--t5)' }} className='text-base leading-relaxed mb-4'>
                            I&apos;m highly motivated to continuously learn, explore new technologies, and grow as a professional
                            in the tech industry—especially in building impactful web solutions that bring real value to users and
                            organizations.
                        </p>
                        <p style={{ color: 'var(--t5)' }} className='text-base leading-relaxed mb-10'>
                            ✨ Always open to collaboration, knowledge sharing, and new challenges in web development.
                        </p>

                        <div
                            style={{ borderColor: 'var(--bd-dim)' }}
                            className='grid grid-cols-3 gap-6 pt-8 border-t'
                        >
                            {[
                                { value: '3.94', label: 'GPA' },
                                { value: 'Tel-U', label: 'Alumni' },
                                { value: 'BKS', label: 'Location' },
                            ].map(({ value, label }) => (
                                <div key={label}>
                                    <p style={{ color: 'var(--t1)' }} className='text-3xl sm:text-4xl font-bold'>{value}</p>
                                    <p style={{ color: 'var(--t6)' }} className='text-xs mt-1.5 uppercase tracking-wider'>{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='relative group'>
                        <div
                            // style={{ borderColor: 'var(--bd)' }}
                            className='relative rounded-2xl overflow-hidden'
                        >
                            <img
                                src={profileImage}
                                alt='Dhanu Satrio Darjanto'
                                className='w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500'
                            />
                            <div
                                className='absolute left-0 right-0 bottom-0 h-32 sm:h-40 pointer-events-none'
                                style={{
                                    background: 'linear-gradient(to top, var(--bg) 15%, transparent 80%)',
                                }}
                            />
                        </div>
                        <div
                            // style={{ borderColor: 'var(--bd)' }}
                            className='absolute -bottom-4 -right-4 w-full h-full rounded-2xl -z-10'
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
