import React from 'react';
import { FaLinkedin, FaGithub, FaInstagram, FaFacebookF } from 'react-icons/fa';
import { BiLogoGmail } from 'react-icons/bi';

    const marqueeItems = Array(12).fill(null).flatMap(() => [
        "✦ Let's Build Something Great",
        "✦ Open for Collaboration",
        "✦ Available for Projects",
        "✦ Turning Ideas Into Reality",
        "✦ Let's Create Impact",
        "✦ Ready to Collaborate",
    ]);

const socialLinks = [
    { href: 'mailto:satriodhanu12@gmail.com', icon: <BiLogoGmail size={18} />, hoverColor: '#EA4335' },
    { href: 'https://www.facebook.com/dhanu.satriod', icon: <FaFacebookF size={16} />, hoverColor: '#1877F2' },
    { href: 'https://www.instagram.com/dhnstr_/', icon: <FaInstagram size={16} />, hoverColor: '#E04A83' },
    { href: 'https://www.linkedin.com/in/dhnstr/', icon: <FaLinkedin size={16} />, hoverColor: '#0A66C2' },
    { href: 'https://github.com/dhnstr', icon: <FaGithub size={16} />, hoverColor: '#A371F7' },
];

const inputClass =
    'w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors';

const Contact = () => {
    return (
        <div id='contact'>
            <div
                style={{ borderColor: 'var(--bd-dim)' }}
                className='overflow-hidden border-y py-5'
            >
                <div className='flex whitespace-nowrap animate-marquee'>
                    {marqueeItems.map((text, i) => (
                        <span
                            key={i}
                            style={{ color: 'var(--bd2)' }}
                            className='text-2xl font-bold mx-10 tracking-tight'
                        >
                            {text}
                        </span>
                    ))}
                </div>
            </div>

            <div className='py-28 px-6'>
                <div className='max-w-6xl mx-auto'>
                    <div className='grid md:grid-cols-2 gap-16 items-start'>
                        <div>
                            <div
                                style={{ color: 'var(--t2)', borderColor: 'var(--bd)' }}
                                className='inline-flex items-center gap-2 text-xs border px-4 py-2 rounded-full mb-8 uppercase tracking-widest'
                            >
                                Contact
                            </div>
                            <h2
                                style={{ color: 'var(--t1)' }}
                                className='text-4xl sm:text-5xl font-bold mb-5 tracking-tight leading-tight'
                            >
                                Start Working<br />Together
                            </h2>
                            <p style={{ color: 'var(--t5)' }} className='text-base mb-3'>Just email me at</p>
                            <a
                                href='mailto:satriodhanu12@gmail.com'
                                style={{ color: 'var(--t1)' }}
                                className='text-lg font-medium hover:text-[var(--t3)] transition-colors underline underline-offset-4'
                            >
                                satriodhanu12@gmail.com
                            </a>

                            <div className='flex items-center gap-3 mt-10'>
                                {socialLinks.map(({ href, icon, hoverColor }, i) => (
                                    <a
                                        key={i}
                                        href={href}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        style={{
                                            color: 'var(--t5)',
                                            borderColor: 'var(--bd)',
                                            '--social-hover-color': hoverColor,
                                        }}
                                        className='social-glow p-3 border rounded-full transition-all duration-300'
                                    >
                                        {icon}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <form
                            action='https://getform.io/f/2e6ac70e-d6d0-47f1-8581-0ab3516f9174'
                            method='POST'
                            encType='multipart/form-data'
                            className='space-y-4'
                        >
                            <div className='grid grid-cols-2 gap-4'>
                                {[
                                    { label: 'Name', name: 'name', type: 'text', placeholder: 'Your name' },
                                    { label: 'Phone', name: 'phone', type: 'text', placeholder: '+62...' },
                                ].map(({ label, name, type, placeholder }) => (
                                    <div key={name}>
                                        <label
                                            style={{ color: 'var(--t6)' }}
                                            className='text-xs uppercase tracking-wider block mb-2'
                                        >
                                            {label}
                                        </label>
                                        <input
                                            type={type}
                                            name={name}
                                            placeholder={placeholder}
                                            style={{
                                                backgroundColor: 'var(--bg2)',
                                                borderColor: 'var(--bd)',
                                                color: 'var(--t1)',
                                            }}
                                            className={`${inputClass} border focus:border-[var(--bd2)]`}
                                        />
                                    </div>
                                ))}
                            </div>

                            {[
                                { label: 'Email', name: 'email', type: 'email', placeholder: 'your@email.com' },
                                { label: 'Subject', name: 'subject', type: 'text', placeholder: 'What is this about?' },
                            ].map(({ label, name, type, placeholder }) => (
                                <div key={name}>
                                    <label
                                        style={{ color: 'var(--t6)' }}
                                        className='text-xs uppercase tracking-wider block mb-2'
                                    >
                                        {label}
                                    </label>
                                    <input
                                        type={type}
                                        name={name}
                                        placeholder={placeholder}
                                        style={{
                                            backgroundColor: 'var(--bg2)',
                                            borderColor: 'var(--bd)',
                                            color: 'var(--t1)',
                                        }}
                                        className={`${inputClass} border focus:border-[var(--bd2)]`}
                                    />
                                </div>
                            ))}

                            <div>
                                <label
                                    style={{ color: 'var(--t6)' }}
                                    className='text-xs uppercase tracking-wider block mb-2'
                                >
                                    Message
                                </label>
                                <textarea
                                    name='message'
                                    rows={5}
                                    placeholder='Tell me about your project...'
                                    style={{
                                        backgroundColor: 'var(--bg2)',
                                        borderColor: 'var(--bd)',
                                        color: 'var(--t1)',
                                    }}
                                    className={`${inputClass} border focus:border-[var(--bd2)] resize-none`}
                                />
                            </div>

                            <button
                                type='submit'
                                style={{ backgroundColor: 'var(--inv)', color: 'var(--inv-t)' }}
                                className='w-full font-semibold py-3.5 rounded-xl text-sm tracking-wide hover:opacity-80 transition-opacity'
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
