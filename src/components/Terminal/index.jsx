import { useState, useRef, useEffect, useCallback } from 'react';
import { BsTerminal, BsLightningCharge, BsCheckCircle } from 'react-icons/bs';

const COMMANDS = [
    'help',
    'whoami',
    'bio',
    'skills',
    'stack',
    'projects',
    'stats',
    'contact',
    'theme',
    'clear',
    'sudo',
    'matrix',
    'exit'
];

const QUICK_CHIPS = ['help', 'whoami', 'skills', 'projects', 'stats', 'contact', 'clear'];

export const Terminal = ({ theme, toggleTheme }) => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [lines, setLines] = useState([
        {
            id: 'init-1',
            type: 'system',
            content: (
                <div className='text-[var(--t5)] mb-3 leading-relaxed'>
                    <div className='text-[var(--t1)] font-semibold flex items-center gap-2'>
                        <BsTerminal className='text-emerald-400' />
                        <span>Dhanu Satrio — Developer Command Center [v5.2.0-release]</span>
                    </div>
                    <div className='mt-1 text-xs sm:text-sm text-[var(--t4)]'>
                        Type <span className='text-[var(--t1)] font-semibold underline underline-offset-2'>help</span> to list commands, press <kbd className='px-1.5 py-0.5 rounded bg-[var(--bd-dim)] text-[var(--t2)] text-xs'>Tab</kbd> for auto-complete, or tap quick chips below.
                    </div>
                </div>
            )
        }
    ]);

    const inputRef = useRef(null);
    const scrollRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [lines, scrollToBottom]);

    const executeCommand = useCallback((cmdRaw) => {
        const raw = cmdRaw.trim();
        const cmd = raw.toLowerCase();

        // Record command in history
        if (raw) {
            setHistory((prev) => [...prev, raw]);
            setHistoryIndex(-1);
        }

        const cmdId = Date.now() + Math.random().toString(36).substring(2, 5);

        // Empty command
        if (!cmd) {
            setLines((prev) => [
                ...prev,
                { id: cmdId, type: 'prompt', command: '' }
            ]);
            return;
        }

        let outputContent = null;

        switch (cmd) {
            case 'help':
                outputContent = (
                    <div className='py-2 space-y-1.5 text-xs sm:text-sm'>
                        <div className='text-[var(--t2)] font-semibold mb-2'>Available Commands:</div>
                        <div className='grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-x-4 gap-y-1.5'>
                            <div><span className='text-emerald-400 font-mono font-semibold'>help</span></div>
                            <div className='text-[var(--t4)]'>Show available terminal commands</div>

                            <div><span className='text-emerald-400 font-mono font-semibold'>whoami / bio</span></div>
                            <div className='text-[var(--t4)]'>Display Dhanu Satrio&apos;s profile &amp; role</div>

                            <div><span className='text-emerald-400 font-mono font-semibold'>skills / stack</span></div>
                            <div className='text-[var(--t4)]'>List core technical stacks & engineering tools</div>

                            <div><span className='text-emerald-400 font-mono font-semibold'>projects</span></div>
                            <div className='text-[var(--t4)]'>View production & open-source projects summary</div>

                            <div><span className='text-emerald-400 font-mono font-semibold'>stats</span></div>
                            <div className='text-[var(--t4)]'>Interactive engineering & performance metrics</div>

                            <div><span className='text-emerald-400 font-mono font-semibold'>contact</span></div>
                            <div className='text-[var(--t4)]'>Direct contact links & social handles</div>

                            <div><span className='text-emerald-400 font-mono font-semibold'>theme</span></div>
                            <div className='text-[var(--t4)]'>Toggle light / dark workspace theme</div>

                            <div><span className='text-emerald-400 font-mono font-semibold'>clear</span></div>
                            <div className='text-[var(--t4)]'>Clear terminal screen buffer</div>

                            <div><span className='text-amber-400 font-mono font-semibold'>sudo / matrix</span></div>
                            <div className='text-[var(--t4)]'>System easter eggs</div>
                        </div>
                    </div>
                );
                break;

            case 'whoami':
            case 'bio':
                outputContent = (
                    <div className='py-2 space-y-2 text-xs sm:text-sm text-[var(--t4)]'>
                        <div className='text-[var(--t1)] font-semibold text-sm sm:text-base'>
                            Dhanu Satrio Darjanto
                        </div>
                        <div className='text-emerald-400 font-mono'>
                            Role: Fullstack Developer & AI Specialist
                        </div>
                        <div className='leading-relaxed'>
                            Passionate software engineer focused on building robust, scalable enterprise systems and modern reactive web applications. Experienced in developing enterprise portals, event management platforms, and autonomous multi-agent developer workflows.
                        </div>
                        <div className='pt-1 text-[var(--t5)]'>
                            Location: Jakarta, Indonesia • Status: Open for innovative opportunities
                        </div>
                    </div>
                );
                break;

            case 'skills':
            case 'stack':
                outputContent = (
                    <div className='py-2 space-y-2 text-xs sm:text-sm'>
                        <div className='text-[var(--t2)] font-semibold mb-2'>Core Technical Stack:</div>
                        <div className='space-y-1.5'>
                            <div>
                                <span className='text-sky-400 font-mono font-semibold'>Frontend:</span>{' '}
                                <span className='text-[var(--t3)]'>React 18, Next.js, TypeScript, Tailwind CSS, Vite</span>
                            </div>
                            <div>
                                <span className='text-indigo-400 font-mono font-semibold'>Backend:</span>{' '}
                                <span className='text-[var(--t3)]'>Node.js, Python, PHP (Laravel, CodeIgniter), Go</span>
                            </div>
                            <div>
                                <span className='text-emerald-400 font-mono font-semibold'>Databases:</span>{' '}
                                <span className='text-[var(--t3)]'>PostgreSQL, SQL Server, MySQL</span>
                            </div>
                            <div>
                                <span className='text-purple-400 font-mono font-semibold'>AI & Agents:</span>{' '}
                                <span className='text-[var(--t3)]'>Hermes Agent, Autonomous Tooling, LLM Gateway Orchestration</span>
                            </div>
                            <div>
                                <span className='text-amber-400 font-mono font-semibold'>DevOps:</span>{' '}
                                <span className='text-[var(--t3)]'>Git, GitHub CI/CD, Linux Bash, CDP Automation</span>
                            </div>
                        </div>
                    </div>
                );
                break;

            case 'projects':
                outputContent = (
                    <div className='py-2 space-y-3 text-xs sm:text-sm'>
                        <div className='text-[var(--t2)] font-semibold'>Featured Projects:</div>
                        <div className='space-y-2'>
                            <div className='border-l-2 border-sky-400 pl-3'>
                                <div className='text-[var(--t1)] font-semibold'>1. FMM Prospect System</div>
                                <div className='text-[var(--t4)] text-xs'>Tech: CodeIgniter, PHP, SQL Server, PostgreSQL, JS</div>
                                <div className='text-[var(--t5)] mt-0.5'>Enterprise sales pipeline & lead tracking platform with high data integrity.</div>
                            </div>
                            <div className='border-l-2 border-emerald-400 pl-3'>
                                <div className='text-[var(--t1)] font-semibold'>2. FMM Event Management System</div>
                                <div className='text-[var(--t4)] text-xs'>Tech: CodeIgniter, PHP, SQL Server, HTML, CSS, JS</div>
                                <div className='text-[var(--t5)] mt-0.5'>Real-time event lifecycle, ticket verification, and attendee management.</div>
                            </div>
                            <div className='border-l-2 border-indigo-400 pl-3'>
                                <div className='text-[var(--t1)] font-semibold'>3. FMM Media Asset</div>
                                <div className='text-[var(--t4)] text-xs'>Tech: CodeIgniter, PHP, SQL Server, Asset Pipeline</div>
                                <div className='text-[var(--t5)] mt-0.5'>Centralized media and digital asset cataloging and indexing portal.</div>
                            </div>
                            <div className='border-l-2 border-purple-400 pl-3'>
                                <div className='text-[var(--t1)] font-semibold'>4. Interactive Developer Terminal</div>
                                <div className='text-[var(--t4)] text-xs'>Tech: React 18, Tailwind CSS, CDP Test Harness</div>
                                <div className='text-[var(--t5)] mt-0.5'>Lightweight, high-performance in-browser shell with keyboard history & quick chips.</div>
                            </div>
                            <div className='border-l-2 border-amber-400 pl-3'>
                                <div className='text-[var(--t1)] font-semibold'>5. Lingkar Budaya & Genetic Algorithm</div>
                                <div className='text-[var(--t4)] text-xs'>Tech: Laravel, Python Heuristics</div>
                                <div className='text-[var(--t5)] mt-0.5'>Cultural preservation portal and evolutionary optimization algorithm in Python.</div>
                            </div>
                        </div>
                    </div>
                );
                break;

            case 'stats':
                outputContent = (
                    <div className='py-2 space-y-2 text-xs sm:text-sm'>
                        <div className='text-[var(--t2)] font-semibold mb-2'>Production & Engineering Benchmarks:</div>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                            <div className='p-3 rounded-lg bg-[var(--bd-dim)]/40 border border-[var(--bd-dim)]'>
                                <div className='text-2xl font-bold text-emerald-400 font-mono'>10+</div>
                                <div className='text-xs text-[var(--t4)] mt-0.5'>Production Systems Delivered</div>
                            </div>
                            <div className='p-3 rounded-lg bg-[var(--bd-dim)]/40 border border-[var(--bd-dim)]'>
                                <div className='text-2xl font-bold text-sky-400 font-mono'>100%</div>
                                <div className='text-xs text-[var(--t4)] mt-0.5'>Test Integrity & Zero Regressions</div>
                            </div>
                            <div className='p-3 rounded-lg bg-[var(--bd-dim)]/40 border border-[var(--bd-dim)]'>
                                <div className='text-2xl font-bold text-indigo-400 font-mono'>0ms</div>
                                <div className='text-xs text-[var(--t4)] mt-0.5'>Layout Shift / Zero Mobile Overflow</div>
                            </div>
                            <div className='p-3 rounded-lg bg-[var(--bd-dim)]/40 border border-[var(--bd-dim)]'>
                                <div className='text-2xl font-bold text-purple-400 font-mono'>v5.2</div>
                                <div className='text-xs text-[var(--t4)] mt-0.5'>Terminal Command Architecture</div>
                            </div>
                        </div>
                    </div>
                );
                break;

            case 'contact':
                outputContent = (
                    <div className='py-2 space-y-2 text-xs sm:text-sm text-[var(--t4)]'>
                        <div className='text-[var(--t2)] font-semibold mb-1'>Direct Contact & Connect:</div>
                        <div className='space-y-1.5'>
                            <div>
                                <span className='text-emerald-400 font-semibold'>WhatsApp:</span>{' '}
                                <a
                                    href='https://wa.me/6281298063349'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-[var(--t1)] hover:underline'
                                >
                                    +62 812-9806-3349
                                </a>
                            </div>
                            <div>
                                <span className='text-sky-400 font-semibold'>Telegram:</span>{' '}
                                <a
                                    href='https://t.me/dhanusatrio'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-[var(--t1)] hover:underline'
                                >
                                    @dhanusatrio
                                </a>
                            </div>
                            <div>
                                <span className='text-purple-400 font-semibold'>Email:</span>{' '}
                                <a
                                    href='mailto:satriodhanu12@gmail.com'
                                    className='text-[var(--t1)] hover:underline'
                                >
                                    satriodhanu12@gmail.com
                                </a>
                            </div>
                            <div>
                                <span className='text-amber-400 font-semibold'>GitHub:</span>{' '}
                                <a
                                    href='https://github.com/dhanusatrio'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-[var(--t1)] hover:underline'
                                >
                                    github.com/dhanusatrio
                                </a>
                            </div>
                        </div>
                    </div>
                );
                break;

            case 'theme': {
                if (typeof toggleTheme === 'function') {
                    toggleTheme();
                    const nextMode = theme === 'dark' ? 'light' : 'dark';
                    outputContent = (
                        <div className='py-1 text-xs sm:text-sm text-sky-400'>
                            ✓ Workspace theme switched to {nextMode} mode.
                        </div>
                    );
                } else {
                    outputContent = (
                        <div className='py-1 text-xs sm:text-sm text-[var(--t4)]'>
                            Current theme: {theme || 'dark'}. Theme toggling is handled via navigation bar.
                        </div>
                    );
                }
                break;
            }

            case 'clear':
                setLines([]);
                return;

            case 'sudo':
                outputContent = (
                    <div className='py-1 text-xs sm:text-sm text-rose-400 font-mono'>
                        Permission denied: guest is not in the sudoers file. This incident will be reported to Dhanu.
                    </div>
                );
                break;

            case 'matrix':
                outputContent = (
                    <div className='py-1 text-xs sm:text-sm text-emerald-400 font-mono leading-relaxed'>
                        Wake up, Neo...<br />
                        The Matrix has you.<br />
                        Follow the white rabbit. 🐇
                    </div>
                );
                break;

            case 'exit':
                outputContent = (
                    <div className='py-1 text-xs sm:text-sm text-[var(--t4)]'>
                        Session kept alive. Scroll smoothly through the portfolio sections or press <kbd className='px-1 py-0.5 rounded bg-[var(--bd-dim)] text-[var(--t2)] text-xs'>Home</kbd> to return to top.
                    </div>
                );
                break;

            default:
                outputContent = (
                    <div className='py-1 text-xs sm:text-sm text-rose-400 font-mono'>
                        Command not found: &quot;{raw}&quot;. Type <span className='text-emerald-400 font-semibold'>help</span> for available commands.
                    </div>
                );
                break;
        }

        setLines((prev) => [
            ...prev,
            {
                id: cmdId,
                type: 'command',
                command: raw,
                content: outputContent
            }
        ]);
    }, [theme, toggleTheme]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const toExec = input;
            setInput('');
            executeCommand(toExec);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (history.length === 0) return;
            const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
            setHistoryIndex(nextIdx);
            setInput(history[nextIdx] || '');
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex === -1) return;
            const nextIdx = historyIndex + 1;
            if (nextIdx >= history.length) {
                setHistoryIndex(-1);
                setInput('');
            } else {
                setHistoryIndex(nextIdx);
                setInput(history[nextIdx] || '');
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const current = input.trim().toLowerCase();
            if (!current) return;
            const match = COMMANDS.find((c) => c.startsWith(current));
            if (match) {
                setInput(match);
            }
        }
    };

    const handleChipClick = (chip) => {
        executeCommand(chip);
        inputRef.current?.focus();
    };

    const focusInput = () => {
        inputRef.current?.focus();
    };

    return (
        <section id='terminal' className='py-28 px-6 overflow-hidden'>
            <div className='max-w-5xl mx-auto'>
                {/* Header Badge & Title */}
                <div className='mb-10'>
                    <div
                        style={{ color: 'var(--t2)', borderColor: 'var(--bd)' }}
                        className='inline-flex items-center gap-2 text-xs border px-4 py-2 rounded-full mb-6 uppercase tracking-widest'
                    >
                        <span
                            style={{ backgroundColor: 'var(--t1)' }}
                            className='w-1.5 h-1.5 rounded-full animate-pulse'
                        />
                        Interactive Developer Terminal
                    </div>
                    <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
                        <div>
                            <h2
                                style={{ color: 'var(--t1)' }}
                                className='text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight'
                            >
                                Command Center<span style={{ color: 'var(--bd2)' }}>.</span>
                            </h2>
                            <p
                                style={{ color: 'var(--t5)' }}
                                className='text-base sm:text-lg mt-3 max-w-2xl leading-relaxed'
                            >
                                Explore Dhanu&apos;s background, technical stack, featured projects, and live metrics via an interactive in-browser CLI. Type commands directly or tap quick chips.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Command Chips */}
                <div className='mb-4 flex items-center gap-2 flex-wrap'>
                    <span className='text-xs font-mono text-[var(--t5)] mr-1 flex items-center gap-1'>
                        <BsLightningCharge className='text-amber-400' /> Quick:
                    </span>
                    {QUICK_CHIPS.map((chip) => (
                        <button
                            key={chip}
                            type='button'
                            onClick={() => handleChipClick(chip)}
                            className='text-xs font-mono px-3 py-1 rounded-md border border-[var(--bd)] bg-[var(--card)] text-[var(--t3)] hover:text-[var(--t1)] hover:border-[var(--inv)] transition-all cursor-pointer shadow-sm active:scale-95'
                        >
                            {chip}
                        </button>
                    ))}
                </div>

                {/* macOS Style Terminal Window */}
                <div
                    onClick={focusInput}
                    style={{
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--bd)',
                    }}
                    className='rounded-xl border shadow-2xl overflow-hidden cursor-text transition-all duration-300'
                >
                    {/* Top Bar */}
                    <div
                        style={{
                            borderColor: 'var(--bd)',
                            backgroundColor: 'var(--bg2)',
                        }}
                        className='flex items-center justify-between px-4 py-3 border-b select-none'
                    >
                        {/* Traffic light window dots */}
                        <div className='flex items-center gap-2'>
                            <span className='w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm' />
                            <span className='w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm' />
                            <span className='w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-sm' />
                        </div>

                        {/* Terminal Tab Label */}
                        <div className='flex items-center gap-2 text-xs font-mono text-[var(--t4)] font-medium'>
                            <BsTerminal size={13} className='text-[var(--t3)]' />
                            <span>guest@dhanu.dev:~</span>
                        </div>

                        {/* Status Badge */}
                        <div className='flex items-center gap-1.5 text-xs font-mono text-[var(--t4)]'>
                            <span className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse' />
                            <span className='hidden sm:inline text-[11px]'>bash v5.2</span>
                        </div>
                    </div>

                    {/* Terminal Buffer Content */}
                    <div
                        ref={scrollRef}
                        className='p-4 sm:p-6 min-h-[340px] max-h-[460px] sm:max-h-[500px] overflow-y-auto font-mono text-xs sm:text-sm space-y-3'
                    >
                        {lines.map((entry) => (
                            <div key={entry.id} className='break-words leading-relaxed'>
                                {entry.type === 'system' && entry.content}

                                {entry.type === 'command' && (
                                    <div>
                                        <div className='flex items-center gap-2 text-[var(--t3)]'>
                                            <span className='text-emerald-400 font-semibold select-none'>visitor@dhanu:~$</span>
                                            <span className='text-[var(--t1)] font-semibold'>{entry.command}</span>
                                        </div>
                                        {entry.content && (
                                            <div className='mt-1 text-[var(--t2)] pl-2 border-l border-[var(--bd-dim)] ml-1'>
                                                {entry.content}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {entry.type === 'prompt' && (
                                    <div className='flex items-center gap-2 text-[var(--t3)]'>
                                        <span className='text-emerald-400 font-semibold select-none'>visitor@dhanu:~$</span>
                                        <span className='text-[var(--t1)]'>{entry.command}</span>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Active Input Line */}
                        <div className='flex items-center gap-2 pt-1'>
                            <span className='text-emerald-400 font-semibold select-none whitespace-nowrap'>
                                visitor@dhanu:~$
                            </span>
                            <div className='relative flex-1 flex items-center'>
                                <input
                                    ref={inputRef}
                                    type='text'
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    spellCheck={false}
                                    autoCapitalize='none'
                                    autoComplete='off'
                                    autoCorrect='off'
                                    className='w-full bg-transparent text-[var(--t1)] font-mono text-xs sm:text-sm focus:outline-none border-none p-0 tracking-wide'
                                    aria-label='Terminal input'
                                    placeholder=''
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Status Strip */}
                    <div
                        style={{
                            borderColor: 'var(--bd)',
                            backgroundColor: 'var(--bg2)',
                        }}
                        className='px-4 py-2 border-t flex items-center justify-between text-[11px] font-mono text-[var(--t5)] select-none'
                    >
                        <div className='flex items-center gap-3'>
                            <span className='flex items-center gap-1'>
                                <BsCheckCircle className='text-emerald-400' size={11} /> Ready
                            </span>
                            <span className='hidden sm:inline'>UTF-8</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className='hidden sm:inline'>Press</span>
                            <kbd className='px-1.5 py-0.5 rounded bg-[var(--bd-dim)] text-[var(--t2)] text-[10px]'>Enter ↵</kbd>
                            <span className='hidden sm:inline'>to execute</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Terminal;
