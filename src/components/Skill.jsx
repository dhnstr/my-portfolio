import React from 'react';
import skills from './data/skills.json';

const Skill = () => {
    return (
        <div id='skill' className='py-20 px-6'>
            <div className='max-w-6xl mx-auto'>
                <div className='mb-12'>
                    <div
                        style={{ color: 'var(--t2)', borderColor: 'var(--bd)' }}
                        className='inline-flex items-center gap-2 text-xs border px-4 py-2 rounded-full mb-6 uppercase tracking-widest'
                    >
                        Stack
                    </div>
                    <h2 style={{ color: 'var(--t1)' }} className='text-4xl font-bold mb-3 tracking-tight'>
                        What I Bring to the Table
                    </h2>
                    <p style={{ color: 'var(--t6)' }} className='text-sm'>Technologies and tools I work with daily</p>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                    {skills.map((skill, index) => (
                        <div
                            key={index}
                            style={{ backgroundColor: 'var(--bg2)', borderColor: 'var(--bd)' }}
                            className='rounded-2xl border px-6 py-5 hover:border-[var(--bd2)] transition-colors duration-200'
                        >
                            <p style={{ color: 'var(--t1)' }} className='font-semibold mb-4'>{skill.category}</p>
                            <div className='flex flex-wrap gap-2'>
                                {skill.skills.map((s, i) => (
                                    <span
                                        key={i}
                                        style={{ color: 'var(--t4)', borderColor: 'var(--bd)' }}
                                        className='text-xs border px-3 py-1.5 rounded-full hover:border-[var(--bd2)] transition-colors'
                                    >
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Skill;
