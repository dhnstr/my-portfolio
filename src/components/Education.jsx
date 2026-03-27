import React from 'react';
import educations from './data/educations.json';

const Education = () => {
    return (
        <div id='education' className='py-28 px-6'>
            <div className='max-w-6xl mx-auto'>
                <div className='mb-14'>
                    <div
                        style={{ color: 'var(--t2)', borderColor: 'var(--bd)' }}
                        className='inline-flex items-center gap-2 text-xs border px-4 py-2 rounded-full mb-6 uppercase tracking-widest'
                    >
                        Education
                    </div>
                    <h2 style={{ color: 'var(--t1)' }} className='text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 tracking-tight leading-tight'>
                        My Educational Journey
                    </h2>
                    <p style={{ color: 'var(--t5)' }} className='text-base max-w-2xl leading-relaxed'>
                        My educational journey that has shaped my skills and knowledge over the years.
                    </p>
                </div>

                <div className='space-y-4'>
                    {educations.map((education, index) => (
                        <div
                            key={index}
                            style={{ backgroundColor: 'var(--bg2)', borderColor: 'var(--bd)' }}
                            className='rounded-2xl border px-6 py-5 hover:border-[var(--bd2)] transition-colors duration-200'
                        >
                            <p style={{ color: 'var(--t1)' }} className='font-bold text-lg'>{education.school}</p>
                            <p style={{ color: 'var(--t4)' }} className='mt-1.5'>{education.degree}</p>
                            <p style={{ color: 'var(--t5)' }} className='text-sm mt-1'>{education.fieldOfStudy}</p>
                            <p style={{ color: 'var(--t7)' }} className='text-xs mt-2 uppercase tracking-wider'>{education.year}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Education;
