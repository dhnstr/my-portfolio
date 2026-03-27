import React from 'react';

const Workitem = ({ company, role, duration, highlights, logo, isLast }) => {
    return (
        <div className='relative pl-20 pb-10 sm:pb-12'>
            {!isLast && (
                <div
                    style={{ backgroundColor: 'var(--bd)' }}
                    className='absolute left-[24px] top-12 bottom-0 w-px'
                />
            )}

            <div
                style={{ backgroundColor: '#f5f5f5', borderColor: 'var(--bd)' }}
                className='absolute left-0 top-0 w-12 h-12 rounded-xl border shadow-sm flex items-center justify-center p-2.5'
            >
                <img src={logo} alt={`${company} logo`} className='w-full h-full object-contain' />
            </div>

            <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4'>
                <div>
                    <h3 style={{ color: 'var(--t1)' }} className='font-semibold text-2xl leading-tight'>
                        {company}
                    </h3>
                    <p style={{ color: 'var(--t6)' }} className='text-2xl mt-1'>
                        {role}
                    </p>
                </div>
                <div className='shrink-0 sm:text-right'>
                    <p style={{ color: 'var(--t6)' }} className='text-2xl font-medium'>
                        {duration}
                    </p>
                </div>
            </div>

            <ul className='mt-5 space-y-3'>
                {highlights.map((item) => (
                    <li key={item} className='flex items-start gap-3'>
                        <span
                            className='mt-[10px] w-2 h-2 rounded-full shrink-0'
                            style={{ backgroundColor: '#ff8a00' }}
                        />
                        <p style={{ color: 'var(--t1)' }} className='text-base leading-relaxed'>
                            {item}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Workitem;
