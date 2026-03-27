import React from 'react';
import Workitem from './Workitem';
import telkomLogo from '../assets/telkom-logo.png';
import fmmLogo from '../assets/fmm-logo.png';

const data = [
    {
        company: 'Telkom University',
        role: 'Mathematic Discrete Assistant Lecturer',
        duration: 'Jun 2022 – Sept 2022',
        logo: telkomLogo,
        highlights: [
            'Conducted task evaluation and summarization for weekly student assignments.',
            'Performed testing and validation of online quiz questions before release.',
            'Assisted students and answered class discussions through online forums.',
        ],
    },
    {
        company: 'Telkom University',
        role: 'Practicum Assistant for Computer Network',
        duration: 'Mar 2023 – Jun 2023',
        logo: telkomLogo,
        highlights: [
            'Evaluated laboratory journals and assessed practicum task submissions.',
            'Explained networking laboratory materials and guided hands-on sessions.',
            'Provided technical assistance to students during major assignments.',
        ],
    },
    {
        company: 'Telkom University',
        role: 'Practicum Assistant for Operating System',
        duration: 'Mar 2023 – Jun 2023',
        logo: telkomLogo,
        highlights: [
            'Reviewed laboratory journals and graded operating system practicum work.',
            'Delivered explanations for core operating system concepts in lab sessions.',
            'Supported students in solving technical issues during final assignments.',
        ],
    },
    {
        company: 'PT. Fajar Mas Murni',
        role: 'IT Development Intern',
        duration: 'Aug 2023 – Sept 2023',
        logo: fmmLogo,
        highlights: [
            'Troubleshooted enterprise web applications built with CodeIgniter.',
            'Developed a CRUD-based authentication feature for internal systems.',
            'Collaborated with the development team to verify bug fixes and flows.',
        ],
    },
];

const Work = () => {
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
                        <Workitem key={idx} isLast={idx === data.length - 1} {...item} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Work;
