import React, { useMemo } from 'react';
import Workitem from './Workitem';
import telkomLogo from '../assets/telkom-logo.png';
import fmmLogo from '../assets/fmm-logo.png';
import workData from './data/work.json';

const workLogos = {
    telkom: telkomLogo,
    fmm: fmmLogo,
};

const Work = () => {
    const data = useMemo(
        () =>
            workData.map(({ logoKey, ...rest }) => ({
                ...rest,
                logo: workLogos[logoKey],
            })),
        []
    );

    return (
        <div id='work' className='py-28 px-6'>
            <div className='max-w-6xl mx-auto'>
                <div className='mb-14'>
                    <div
                        style={{ color: 'var(--t2)', borderColor: 'var(--bd)' }}
                        className='inline-flex items-center gap-2 text-xs border px-4 py-2 rounded-full mb-6 uppercase tracking-widest'
                    >
                        Experience
                    </div>
                    <h2
                        style={{ color: 'var(--t1)' }}
                        className='text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 tracking-tight leading-tight'
                    >
                        Journey in the Field
                    </h2>
                    <p style={{ color: 'var(--t5)' }} className='text-base max-w-xl leading-relaxed'>
                        My work and academic experience that have shaped my skills over the years.
                    </p>
                </div>

                <div className='mt-10'>
                    {data.map((item, idx) => (
                        <Workitem key={`${item.company}-${item.duration}`} isLast={idx === data.length - 1} {...item} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Work;
