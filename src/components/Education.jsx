import React from 'react';
import Educationitem from './Educationitem';
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
                    <h2
                        style={{ color: 'var(--t1)' }}
                        className='text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 tracking-tight leading-tight'
                    >
                        My Educational Journey
                    </h2>
                    <p style={{ color: 'var(--t5)' }} className='text-base max-w-xl leading-relaxed'>
                        My educational journey that has shaped my skills and knowledge over the years.
                    </p>
                </div>

                <div className='mt-10'>
                    {educations.map((education, index) => (
                        <Educationitem
                            key={`${education.school}-${education.year}`}
                            isLast={index === educations.length - 1}
                            {...education}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Education;
