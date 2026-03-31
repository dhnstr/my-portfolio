import React, { useMemo, useState } from 'react';
import Projectitem from './Projectitem';
import web1 from '../assets/web-lingkar-budaya.jpeg';
import web3 from '../assets/web-portfolio.png';
import web4 from '../assets/web-genetic-algorithm.jpeg';
import web5 from '../assets/web-prospectsys.png';
import web6 from '../assets/web-event-management.png';
import web7 from '../assets/web-media-asset.png';
import web8 from '../assets/web-dashboard-marketing.png';
import web9 from '../assets/web-phe-services.png';
import web10 from '../assets/web-helpdesk-ticketing.png';
import projectsData from './data/projects.json';

const projectImages = {
    web1,
    web3,
    web4,
    web5,
    web6,
    web7,
    web8,
    web9,
    web10,
};

const Project = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const projects = useMemo(
        () =>
            projectsData.map((project) => ({
                ...project,
                img: projectImages[project.imageKey],
            })),
        []
    );

    const filters = useMemo(() => {
        const categories = [...new Set(projects.map((project) => project.category))];
        return ['All', ...categories];
    }, [projects]);

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
                        <Projectitem key={p.title} index={i} {...p} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Project;
