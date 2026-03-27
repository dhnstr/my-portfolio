import React, { useMemo, useState } from 'react';
import Projectitem from './Projectitem';
import web1 from '../assets/web-1.jpeg';
import web3 from '../assets/web-3.jpg';
import web4 from '../assets/web-4.jpeg';
import web5 from '../assets/web-5.jpeg';

const projects = [
    {
        img: web3,
        title: 'Portfolio Website',
        tech: 'ReactJs, Tailwind CSS',
        type: 'Personal Project',
        year: '2024',
        duration: '1 Week',
        category: 'React.js',
    },  
    {
        img: web1,
        title: 'Lingkar Budaya',
        tech: 'Laravel, HTML, CSS, PHP',
        type: 'Academic Project',
        year: '2023',
        duration: '2 Months',
        category: 'Laravel',
    },
    {
        img: web4,
        title: 'Genetic Algorithm',
        tech: 'Python',
        type: 'Academic Project',
        year: '2023',
        duration: '1 Month',
        category: 'Python',
    },
    {
        img: web5,
        title: 'FMM Prospect System',
        tech: 'CodeIgniter, PHP, SQL Server',
        type: 'Internship Project',
        year: '2023',
        duration: '2 Months',
        category: 'CodeIgniter',
    },
];

const Project = () => {
    const [activeFilter, setActiveFilter] = useState('All');

    const filters = useMemo(() => {
        const categories = [...new Set(projects.map((project) => project.category))];
        return ['All', ...categories];
    }, []);

    const filteredProjects = useMemo(() => {
        if (activeFilter === 'All') return projects;
        return projects.filter((project) => project.category === activeFilter);
    }, [activeFilter]);

    return (
        <div id='project' className='py-28 px-6'>
            <div className='max-w-6xl mx-auto'>
                <div className='mb-14'>
                    <div
                        style={{ color: 'var(--t2)', borderColor: 'var(--bd)' }}
                        className='inline-flex items-center gap-2 text-xs border px-4 py-2 rounded-full mb-6 uppercase tracking-widest'
                    >
                        Projects
                    </div>
                    <h2
                        style={{ color: 'var(--t1)' }}
                        className='text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 tracking-tight leading-tight'
                    >
                        Project Showcase
                    </h2>
                    <p style={{ color: 'var(--t5)' }} className='text-base max-w-2xl leading-relaxed'>
                        These are some of the projects I've poured my time and effort into. Each one tells a different story, all sharing the same goal: building reliable, efficient, and meaningful software.
                    </p>
                </div>

                <div className='flex flex-wrap gap-3 mb-10'>
                    {filters.map((filter) => {
                        const isActive = activeFilter === filter;
                        return (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                style={
                                    isActive
                                        ? { backgroundColor: 'var(--inv)', color: 'var(--inv-t)', borderColor: 'var(--inv)' }
                                        : { backgroundColor: 'var(--bg2)', color: 'var(--t3)', borderColor: 'var(--bd)' }
                                }
                                className='px-5 py-2 rounded-full border text-sm font-medium transition-all duration-200 hover:opacity-85'
                            >
                                {filter}
                            </button>
                        );
                    })}
                </div>

                <div className='grid sm:grid-cols-2 gap-5'>
                    {filteredProjects.map((p, i) => (
                        <Projectitem key={i} {...p} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Project;
