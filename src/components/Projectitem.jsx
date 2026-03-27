import React from 'react';

const Projectitem = ({ img, title, tech, type, year, duration }) => {
    return (
        <div
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

                <div
                    style={{ borderColor: 'var(--bd)' }}
                    className='grid grid-cols-2 gap-4 pt-4 border-t'
                >
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
                    style={{ borderColor: 'var(--bd)' }}
                    className='mt-5 text-xs border px-4 py-2 rounded-full text-[var(--t3)] hover:bg-[var(--inv)] hover:text-[var(--inv-t)] hover:border-[var(--inv)] transition-all duration-200'
                >
                    See Project →
                </button>
            </div>
        </div>
    );
};

export default Projectitem;
