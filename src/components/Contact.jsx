import { motion } from 'motion/react';
import { FaLinkedin, FaGithub, FaInstagram, FaFacebookF } from 'react-icons/fa';
import { BiLogoGmail } from 'react-icons/bi';

const marqueeItems = [
    "✦ Let's Build Something Great",
    "✦ Open for Collaboration",
    "✦ Available for Projects",
    "✦ Turning Ideas Into Reality",
    "✦ Let's Create Impact",
    "✦ Ready to Collaborate",
];

// Satu set item = satu jalur. Setiap baris dirender 6 set (3 pasang) supaya
// animasi translateX(-50%) nyambung mulus — pergeseran 50% (~5,6k px) selalu
// lebih lebar dari viewport, aman sampai layar 4K.
const MarqueeRow = ({ dim }) => (
    <div aria-hidden className='flex shrink-0 items-center gap-8 pr-8 sm:gap-10 sm:pr-10'>
        {marqueeItems.map((text, i) => (
            <span
                key={i}
                style={{ color: dim ? 'var(--bd-dim)' : 'var(--bd2)' }}
                className='whitespace-nowrap text-2xl font-bold tracking-tight'
            >
                {text}
            </span>
        ))}
    </div>
);

// Render n set item berurutan (total track = n * lebar set).
const MarqueeContent = ({ sets, dim }) => (
    <>
        {Array.from({ length: sets }, (_, s) => (
            <MarqueeRow key={s} dim={dim} />
        ))}
    </>
);

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
        <div id='contact' className='relative overflow-hidden'>

            {/* ── Background animasi (grid bergerak + aura + orb mengambang) ── */}
            <div aria-hidden className='pointer-events-none absolute inset-0 overflow-hidden'>
                {/* Grid halus yang bergerak pelan */}
                <div
                    className='animate-grid-pan absolute inset-0 opacity-[0.35]'
                    style={{
                        backgroundImage:
                            'linear-gradient(var(--bd-dim) 1px, transparent 1px), linear-gradient(90deg, var(--bd-dim) 1px, transparent 1px)',
                        backgroundSize: '64px 64px',
                        maskImage: 'radial-gradient(ellipse 90% 75% at 50% 40%, black 25%, transparent 78%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 90% 75% at 50% 40%, black 25%, transparent 78%)',
                    }}
                />
                {/* Aura lembut berdenyut di tengah */}
                <div
                    className='animate-aura absolute left-1/2 top-1/2 h-[560px] w-[860px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl'
                    style={{ background: 'radial-gradient(closest-side, var(--bd-dim), transparent 72%)' }}
                />
                {/* Dua orb monokrom yang bergerak berlawanan arah */}
                <div
                    className='animate-drift absolute -left-24 top-10 h-72 w-72 rounded-full opacity-70 blur-3xl'
                    style={{ background: 'radial-gradient(circle, var(--bd-dim), transparent 70%)' }}
                />
                <div
                    className='animate-drift-reverse absolute -right-24 bottom-0 h-80 w-80 rounded-full opacity-70 blur-3xl'
                    style={{ background: 'radial-gradient(circle, var(--bd-dim), transparent 70%)' }}
                />
            </div>

            {/* ── Band marquee (2 baris, arah berlawanan, pause saat hover) ── */}
            <div
                className='marquee-band relative overflow-hidden border-y py-5'
                style={{
                    borderColor: 'var(--bd-dim)',
                    maskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)',
                    WebkitMaskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)',
                }}
            >
                <div className='marquee-track flex w-max items-center'>
                    <MarqueeContent sets={6} />
                </div>
                <div className='marquee-track reverse mt-1 flex w-max items-center'>
                    <MarqueeContent sets={6} dim />
                </div>
            </div>

            <div className='relative py-28 px-6'>
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

                        <motion.form
                            initial={{ opacity: 0, y: 28 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.15 }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
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
                        </motion.form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
