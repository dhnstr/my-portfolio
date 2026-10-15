import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
} from 'remotion';
import profileImg from '../../assets/profile.png';
import logoImg from '../../assets/logo-white.png';

export const ShowreelComposition = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // ── Timeline progress (0-100%) ──
    const progressWidth = interpolate(frame, [0, 209], [0, 100], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    // ── Scene 1: Intro (Frames 0 - 75) ──
    const s1Spring = spring({
        frame,
        fps,
        config: { damping: 14, mass: 0.6, stiffness: 110 },
    });
    const s1Opacity = interpolate(frame, [0, 14, 58, 72], [0, 1, 1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });
    const s1Y = interpolate(frame, [0, 20, 58, 72], [35, 0, 0, -25], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });
    const s1Scale = interpolate(s1Spring, [0, 1], [0.92, 1]);

    // ── Scene 2: Code in Motion (Frames 65 - 145) ──
    const s2Spring = spring({
        frame: frame - 65,
        fps,
        config: { damping: 14, mass: 0.65, stiffness: 110 },
    });
    const s2Opacity = interpolate(frame, [65, 76, 130, 142], [0, 1, 1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });
    const s2Y = interpolate(frame, [65, 80, 130, 142], [35, 0, 0, -25], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });
    const s2Scale = interpolate(s2Spring, [0, 1], [0.93, 1]);

    // Code lines reveal progress
    const codeProgress = interpolate(frame, [72, 122], [0, 10], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });
    const visibleLinesCount = Math.floor(codeProgress);
    const cursorVisible = Math.floor(frame / 6) % 2 === 0;

    // ── Scene 3: Tech Stack & Highlights (Frames 135 - 210) ──
    const s3Spring = spring({
        frame: frame - 135,
        fps,
        config: { damping: 14, mass: 0.7, stiffness: 110 },
    });
    const s3Opacity = interpolate(frame, [135, 146, 196, 209], [0, 1, 1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });
    const s3Y = interpolate(frame, [135, 148, 196, 209], [30, 0, 0, -20], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });
    const s3Scale = interpolate(s3Spring, [0, 1], [0.93, 1]);

    // Glow orbit rotation
    const glowRotate = interpolate(frame, [0, 210], [0, 360]);

    return (
        <AbsoluteFill
            style={{
                backgroundColor: '#0a0d14',
                color: '#f8fafc',
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                overflow: 'hidden',
                userSelect: 'none',
            }}
        >
            {/* Ambient Background Grid & Orbs */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage:
                        'radial-gradient(circle at 50% 25%, rgba(56, 189, 248, 0.12) 0%, transparent 60%), radial-gradient(circle at 85% 75%, rgba(129, 140, 248, 0.08) 0%, transparent 50%)',
                    pointerEvents: 'none',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage:
                        'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    pointerEvents: 'none',
                }}
            />

            {/* Top Showcase Watermark */}
            <div
                style={{
                    position: 'absolute',
                    top: 28,
                    left: 40,
                    right: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    zIndex: 20,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img
                        src={logoImg}
                        alt='Logo'
                        style={{ width: 30, height: 30, objectFit: 'contain' }}
                    />
                    <span
                        style={{
                            fontSize: 14,
                            fontWeight: 700,
                            letterSpacing: '0.05em',
                            color: '#e2e8f0',
                            textTransform: 'uppercase',
                        }}
                    >
                        Dhanu Satrio <span style={{ color: '#38bdf8' }}>/</span> Showreel
                    </span>
                </div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '6px 14px',
                        borderRadius: 9999,
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                    }}
                >
                    <span
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: '#22c55e',
                            boxShadow: '0 0 10px #22c55e',
                        }}
                    />
                    <span
                        style={{
                            fontSize: 12,
                            fontWeight: 600,
                            letterSpacing: '0.08em',
                            color: '#94a3b8',
                            textTransform: 'uppercase',
                        }}
                    >
                        Programmatic React Video
                    </span>
                </div>
            </div>

            {/* ══════════════ SCENE 1: INTRO & BRANDING ══════════════ */}
            {frame <= 75 && (
                <AbsoluteFill
                    style={{
                        opacity: s1Opacity,
                        transform: `translateY(${s1Y}px) scale(${s1Scale})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            maxWidth: 880,
                            padding: '0 24px',
                        }}
                    >
                        {/* Profile Avatar with Glowing Tech Rings */}
                        <div
                            style={{
                                position: 'relative',
                                width: 110,
                                height: 110,
                                marginBottom: 28,
                            }}
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    inset: -6,
                                    borderRadius: '50%',
                                    background:
                                        'conic-gradient(from 0deg, #38bdf8, #818cf8, #38bdf8)',
                                    transform: `rotate(${glowRotate}deg)`,
                                    opacity: 0.8,
                                    filter: 'blur(4px)',
                                }}
                            />
                            <div
                                style={{
                                    position: 'relative',
                                    width: 110,
                                    height: 110,
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    border: '3px solid #0f172a',
                                    background: '#1e293b',
                                }}
                            >
                                <img
                                    src={profileImg}
                                    alt='Dhanu Satrio'
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Title */}
                        <h1
                            style={{
                                fontSize: 62,
                                fontWeight: 800,
                                letterSpacing: '-0.03em',
                                margin: 0,
                                lineHeight: 1.1,
                                color: '#ffffff',
                            }}
                        >
                            Dhanu Satrio
                        </h1>

                        {/* Role Subtitle */}
                        <p
                            style={{
                                fontSize: 24,
                                fontWeight: 600,
                                margin: '14px 0 20px',
                                background:
                                    'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                letterSpacing: '-0.01em',
                            }}
                        >
                            Fullstack Developer & AI Automation Specialist
                        </p>

                        <p
                            style={{
                                fontSize: 16,
                                color: '#94a3b8',
                                maxWidth: 620,
                                lineHeight: 1.6,
                                margin: '0 0 32px',
                            }}
                        >
                            Building reliable web architectures, production-grade applications,
                            and intelligent autonomous workflows.
                        </p>

                        {/* Stack Pills */}
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                gap: 10,
                            }}
                        >
                            {[
                                'React 18',
                                'Next.js 16',
                                'Node.js',
                                'Python',
                                'AI Agents',
                                'PostgreSQL',
                            ].map((tech) => (
                                <span
                                    key={tech}
                                    style={{
                                        fontSize: 13,
                                        fontWeight: 600,
                                        padding: '7px 16px',
                                        borderRadius: 9999,
                                        background: 'rgba(30, 41, 59, 0.7)',
                                        border: '1px solid rgba(148, 163, 184, 0.25)',
                                        color: '#e2e8f0',
                                    }}
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </AbsoluteFill>
            )}

            {/* ══════════════ SCENE 2: CODE IN MOTION ══════════════ */}
            {frame >= 60 && frame <= 145 && (
                <AbsoluteFill
                    style={{
                        opacity: s2Opacity,
                        transform: `translateY(${s2Y}px) scale(${s2Scale})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                    }}
                >
                    <div
                        style={{
                            width: 920,
                            borderRadius: 16,
                            overflow: 'hidden',
                            background: 'rgba(11, 15, 25, 0.95)',
                            border: '1px solid rgba(56, 189, 248, 0.3)',
                            boxShadow: '0 24px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(56, 189, 248, 0.1)',
                        }}
                    >
                        {/* IDE Window Header */}
                        <div
                            style={{
                                padding: '12px 18px',
                                background: 'rgba(15, 23, 42, 0.95)',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span
                                    style={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: '50%',
                                        background: '#ef4444',
                                        display: 'inline-block',
                                    }}
                                />
                                <span
                                    style={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: '50%',
                                        background: '#eab308',
                                        display: 'inline-block',
                                    }}
                                />
                                <span
                                    style={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: '50%',
                                        background: '#22c55e',
                                        display: 'inline-block',
                                    }}
                                />
                            </div>
                            <span
                                style={{
                                    fontSize: 13,
                                    fontFamily: 'monospace',
                                    color: '#94a3b8',
                                }}
                            >
                                ~/dhanu-lab/autonomous-agent.ts
                            </span>
                            <span
                                style={{
                                    fontSize: 11,
                                    fontFamily: 'monospace',
                                    padding: '3px 8px',
                                    borderRadius: 4,
                                    background: 'rgba(56, 189, 248, 0.15)',
                                    color: '#38bdf8',
                                }}
                            >
                                TypeScript
                            </span>
                        </div>

                        {/* IDE Code Area */}
                        <div
                            style={{
                                padding: '24px 30px',
                                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                                fontSize: 15,
                                lineHeight: 1.65,
                                color: '#e2e8f0',
                            }}
                        >
                            {[
                                { t: '// Building real-world web apps & agents', c: '#64748b' },
                                { t: "import { AutonomousAgent } from '@dhanu/core';", c: '#38bdf8' },
                                { t: "import { RemotionPipeline } from '@remotion/player';", c: '#38bdf8' },
                                { t: '', c: '' },
                                { t: 'const agent = new AutonomousAgent({', c: '#f8fafc' },
                                { t: "  developer: 'Dhanu Satrio',", c: '#a5f3fc' },
                                { t: "  capabilities: ['Fullstack', 'Remotion', 'AI Workflows'],", c: '#a5f3fc' },
                                { t: "  architecture: 'Clean, Resilient, & Maintainable',", c: '#a5f3fc' },
                                { t: '});', c: '#f8fafc' },
                                { t: "await agent.deploy({ target: 'production', quality: '100%' });", c: '#34d399' },
                            ].map((line, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        display: 'flex',
                                        opacity: idx <= visibleLinesCount ? 1 : 0.1,
                                        transition: 'opacity 0.15s ease',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: 32,
                                            color: '#475569',
                                            userSelect: 'none',
                                            fontSize: 13,
                                        }}
                                    >
                                        {idx + 1}
                                    </span>
                                    <span style={{ color: line.c || 'inherit' }}>
                                        {line.t}
                                        {idx === visibleLinesCount && cursorVisible && (
                                            <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>
                                                |
                                            </span>
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Mini Terminal Output Bar */}
                        <div
                            style={{
                                padding: '14px 24px',
                                background: 'rgba(2, 6, 23, 0.95)',
                                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontSize: 13,
                                fontFamily: 'monospace',
                            }}
                        >
                            <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span>✔</span> Tests passed (Exit 0) • Zero regressions
                            </span>
                            <span style={{ color: '#64748b' }}>
                                Status: Operational
                            </span>
                        </div>
                    </div>
                </AbsoluteFill>
            )}

            {/* ══════════════ SCENE 3: TECH STACK & IMPACT ══════════════ */}
            {frame >= 130 && (
                <AbsoluteFill
                    style={{
                        opacity: s3Opacity,
                        transform: `translateY(${s3Y}px) scale(${s3Scale})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                    }}
                >
                    <div
                        style={{
                            maxWidth: 1040,
                            width: '100%',
                            padding: '0 32px',
                        }}
                    >
                        {/* Section Header */}
                        <div style={{ textAlign: 'center', marginBottom: 36 }}>
                            <h2
                                style={{
                                    fontSize: 42,
                                    fontWeight: 800,
                                    margin: 0,
                                    letterSpacing: '-0.02em',
                                    color: '#ffffff',
                                }}
                            >
                                Tech Stack & Production Highlights
                            </h2>
                            <p
                                style={{
                                    fontSize: 17,
                                    color: '#94a3b8',
                                    margin: '10px 0 0',
                                }}
                            >
                                Delivering scalable solutions with modern software craftsmanship
                            </p>
                        </div>

                        {/* Bento Pillars */}
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: 20,
                                marginBottom: 32,
                            }}
                        >
                            {[
                                {
                                    title: 'Fullstack Web',
                                    badge: 'Frontend',
                                    badgeColor: '#38bdf8',
                                    desc: 'Dynamic SPAs, responsive UX, interactive data flows.',
                                    tags: ['React 18', 'Next.js 16', 'Tailwind', 'Motion'],
                                },
                                {
                                    title: 'Backend & Data',
                                    badge: 'Server',
                                    badgeColor: '#818cf8',
                                    desc: 'High-throughput APIs, PostgreSQL, robust security.',
                                    tags: ['Node.js', 'Express', 'Python', 'PostgreSQL'],
                                },
                                {
                                    title: 'AI & Automation',
                                    badge: 'Intelligent',
                                    badgeColor: '#34d399',
                                    desc: 'Remotion video coding, autonomous agent pipelines.',
                                    tags: ['Remotion', 'Agent CLI', 'LLM Routing', 'CI/CD'],
                                },
                            ].map((pillar) => (
                                <div
                                    key={pillar.title}
                                    style={{
                                        background: 'rgba(15, 23, 42, 0.75)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: 14,
                                        padding: '24px 20px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginBottom: 14,
                                        }}
                                    >
                                        <h3
                                            style={{
                                                fontSize: 20,
                                                fontWeight: 700,
                                                margin: 0,
                                                color: '#f8fafc',
                                            }}
                                        >
                                            {pillar.title}
                                        </h3>
                                        <span
                                            style={{
                                                fontSize: 11,
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                padding: '3px 8px',
                                                borderRadius: 9999,
                                                color: pillar.badgeColor,
                                                background: `${pillar.badgeColor}20`,
                                                border: `1px solid ${pillar.badgeColor}40`,
                                            }}
                                        >
                                            {pillar.badge}
                                        </span>
                                    </div>
                                    <p
                                        style={{
                                            fontSize: 13,
                                            color: '#94a3b8',
                                            lineHeight: 1.5,
                                            margin: '0 0 16px',
                                            flexGrow: 1,
                                        }}
                                    >
                                        {pillar.desc}
                                    </p>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 6,
                                        }}
                                    >
                                        {pillar.tags.map((t) => (
                                            <span
                                                key={t}
                                                style={{
                                                    fontSize: 11,
                                                    padding: '3px 8px',
                                                    borderRadius: 6,
                                                    background: 'rgba(255, 255, 255, 0.06)',
                                                    color: '#cbd5e1',
                                                }}
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Impact Stats Banner */}
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: 16,
                                padding: '16px 24px',
                                borderRadius: 12,
                                background: 'rgba(2, 6, 23, 0.85)',
                                border: '1px solid rgba(56, 189, 248, 0.25)',
                                textAlign: 'center',
                            }}
                        >
                            <div>
                                <div style={{ fontSize: 24, fontWeight: 800, color: '#38bdf8' }}>
                                    10+
                                </div>
                                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                                    Production Platforms
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: 24, fontWeight: 800, color: '#22c55e' }}>
                                    100%
                                </div>
                                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                                    Clean Lint & Build Integrity
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: 24, fontWeight: 800, color: '#818cf8' }}>
                                    Full-Stack
                                </div>
                                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                                    Zero-Bloat Engineering
                                </div>
                            </div>
                        </div>
                    </div>
                </AbsoluteFill>
            )}

            {/* Bottom Progress Bar */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: 4,
                    background: 'rgba(255, 255, 255, 0.1)',
                    zIndex: 30,
                }}
            >
                <div
                    style={{
                        height: '100%',
                        width: `${progressWidth}%`,
                        background:
                            'linear-gradient(90deg, #38bdf8 0%, #818cf8 50%, #22c55e 100%)',
                        boxShadow: '0 0 10px rgba(56, 189, 248, 0.8)',
                    }}
                />
            </div>
        </AbsoluteFill>
    );
};
