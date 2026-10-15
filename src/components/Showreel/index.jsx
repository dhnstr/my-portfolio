import { useRef, useState, useCallback, useEffect } from 'react';
import { Player } from '@remotion/player';
import { ShowreelComposition } from './ShowreelComposition';
import { BsPlayFill, BsPauseFill, BsLightningCharge, BsCpu, BsCodeSlash } from 'react-icons/bs';

export const Showreel = ({ motion = true }) => {
    const playerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(motion);
    const [activeScene, setActiveScene] = useState(1);

    const handleTogglePlay = useCallback(() => {
        if (!playerRef.current) return;
        playerRef.current.toggle();
    }, []);

    const handleSeek = useCallback((frame, sceneNum) => {
        if (!playerRef.current) return;
        playerRef.current.seekTo(frame);
        setActiveScene(sceneNum);
    }, []);

    useEffect(() => {
        const player = playerRef.current;
        if (!player) return;

        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onFrameUpdate = (e) => {
            const current = e.detail?.frame ?? 0;
            if (current < 65) {
                setActiveScene(1);
            } else if (current < 135) {
                setActiveScene(2);
            } else {
                setActiveScene(3);
            }
        };

        player.addEventListener('play', onPlay);
        player.addEventListener('pause', onPause);
        player.addEventListener('frameupdate', onFrameUpdate);

        return () => {
            player.removeEventListener('play', onPlay);
            player.removeEventListener('pause', onPause);
            player.removeEventListener('frameupdate', onFrameUpdate);
        };
    }, []);

    // Stop autoplay if motion is turned off
    useEffect(() => {
        if (!motion && playerRef.current) {
            playerRef.current.pause();
            setIsPlaying(false);
        }
    }, [motion]);

    return (
        <section id='showreel' className='py-28 px-6 overflow-hidden'>
            <div className='max-w-6xl mx-auto'>
                {/* Header Badge & Title */}
                <div className='mb-12'>
                    <div
                        style={{ color: 'var(--t2)', borderColor: 'var(--bd)' }}
                        className='inline-flex items-center gap-2 text-xs border px-4 py-2 rounded-full mb-6 uppercase tracking-widest'
                    >
                        <span
                            style={{ backgroundColor: 'var(--t1)' }}
                            className='w-1.5 h-1.5 rounded-full animate-pulse'
                        />
                        Showreel & Interactive Demo
                    </div>
                    <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
                        <div>
                            <h2
                                style={{ color: 'var(--t1)' }}
                                className='text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight'
                            >
                                Code That Moves<span style={{ color: 'var(--bd2)' }}>.</span>
                            </h2>
                            <p
                                style={{ color: 'var(--t5)' }}
                                className='text-base sm:text-lg mt-3 max-w-2xl leading-relaxed'
                            >
                                Dynamic programmatic video rendering powered by <span className='text-[var(--t1)] font-semibold'>Remotion</span> and <span className='text-[var(--t1)] font-semibold'>React 18</span>. Rendered natively in the DOM with spring physics, real-time code simulation, and zero video bandwidth overhead.
                            </p>
                        </div>

                        {/* Quick Jump Buttons */}
                        <div className='flex items-center gap-2 self-start md:self-end flex-wrap'>
                            <button
                                type='button'
                                onClick={() => handleSeek(0, 1)}
                                className={`text-xs px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer font-medium ${
                                    activeScene === 1
                                        ? 'bg-[var(--inv)] text-[var(--inv-t)] border-[var(--inv)] shadow-sm'
                                        : 'bg-[var(--card)] text-[var(--t4)] border-[var(--bd)] hover:text-[var(--t1)]'
                                }`}
                            >
                                01 Intro
                            </button>
                            <button
                                type='button'
                                onClick={() => handleSeek(72, 2)}
                                className={`text-xs px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer font-medium ${
                                    activeScene === 2
                                        ? 'bg-[var(--inv)] text-[var(--inv-t)] border-[var(--inv)] shadow-sm'
                                        : 'bg-[var(--card)] text-[var(--t4)] border-[var(--bd)] hover:text-[var(--t1)]'
                                }`}
                            >
                                02 Code
                            </button>
                            <button
                                type='button'
                                onClick={() => handleSeek(140, 3)}
                                className={`text-xs px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer font-medium ${
                                    activeScene === 3
                                        ? 'bg-[var(--inv)] text-[var(--inv-t)] border-[var(--inv)] shadow-sm'
                                        : 'bg-[var(--card)] text-[var(--t4)] border-[var(--bd)] hover:text-[var(--t1)]'
                                }`}
                            >
                                03 Stack
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Player Frame Mockup */}
                <div
                    style={{
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--bd)',
                    }}
                    className='rounded-2xl border shadow-2xl overflow-hidden mb-10 transition-colors duration-300'
                >
                    {/* Mockup Window Topbar */}
                    <div
                        style={{
                            borderColor: 'var(--bd)',
                            backgroundColor: 'rgba(0, 0, 0, 0.25)',
                        }}
                        className='px-4 sm:px-6 py-3.5 border-b flex items-center justify-between gap-4 select-none'
                    >
                        <div className='flex items-center gap-3'>
                            <div className='flex items-center gap-2'>
                                <span className='w-3 h-3 rounded-full bg-[#ef4444] inline-block shadow-sm' />
                                <span className='w-3 h-3 rounded-full bg-[#eab308] inline-block shadow-sm' />
                                <span className='w-3 h-3 rounded-full bg-[#22c55e] inline-block shadow-sm' />
                            </div>
                            <span
                                style={{ color: 'var(--t4)' }}
                                className='text-xs sm:text-sm font-mono truncate hidden sm:inline-block'
                            >
                                dhanu-satrio-showreel.remotion
                            </span>
                        </div>

                        <div className='flex items-center gap-3'>
                            <button
                                type='button'
                                onClick={handleTogglePlay}
                                style={{
                                    borderColor: 'var(--bd)',
                                    color: 'var(--t2)',
                                }}
                                className='flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border bg-black/20 hover:text-[var(--t1)] transition-colors cursor-pointer'
                                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                            >
                                {isPlaying ? <BsPauseFill size={15} /> : <BsPlayFill size={15} />}
                                <span className='font-medium'>{isPlaying ? 'Pause' : 'Play'}</span>
                            </button>

                            <div
                                style={{
                                    borderColor: 'var(--bd-dim)',
                                    color: 'var(--t3)',
                                }}
                                className='hidden lg:flex items-center gap-2 text-xs border px-3 py-1 rounded-md bg-black/10 font-mono'
                            >
                                <span className='w-2 h-2 rounded-full bg-sky-400 animate-pulse' />
                                <span>1280×720 @ 30FPS</span>
                            </div>
                        </div>
                    </div>

                    {/* Remotion Player Canvas */}
                    <div className='relative w-full aspect-video bg-[#0a0d14]'>
                        <Player
                            ref={playerRef}
                            component={ShowreelComposition}
                            durationInFrames={210}
                            fps={30}
                            compositionWidth={1280}
                            compositionHeight={720}
                            controls
                            loop
                            autoPlay={motion}
                            muted
                            acknowledgeRemotionLicense
                            style={{
                                width: '100%',
                                height: '100%',
                                display: 'block',
                            }}
                        />
                    </div>
                </div>

                {/* Bento Highlights Cards */}
                <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    <div
                        style={{
                            backgroundColor: 'var(--card)',
                            borderColor: 'var(--bd)',
                        }}
                        className='p-6 rounded-2xl border transition-all hover:border-[var(--bd2)] duration-300'
                    >
                        <div
                            style={{ borderColor: 'var(--bd2)', color: 'var(--t1)' }}
                            className='w-10 h-10 rounded-xl border flex items-center justify-center mb-4 bg-sky-500/10'
                        >
                            <BsLightningCharge size={20} className='text-sky-400' />
                        </div>
                        <h3 style={{ color: 'var(--t1)' }} className='font-bold text-lg mb-2'>
                            Reactive Video Engine
                        </h3>
                        <p style={{ color: 'var(--t4)' }} className='text-sm leading-relaxed'>
                            Rendered on-the-fly directly inside React components using frame hooks and physics springs. No video server or streaming lag required.
                        </p>
                    </div>

                    <div
                        style={{
                            backgroundColor: 'var(--card)',
                            borderColor: 'var(--bd)',
                        }}
                        className='p-6 rounded-2xl border transition-all hover:border-[var(--bd2)] duration-300'
                    >
                        <div
                            style={{ borderColor: 'var(--bd2)', color: 'var(--t1)' }}
                            className='w-10 h-10 rounded-xl border flex items-center justify-center mb-4 bg-emerald-500/10'
                        >
                            <BsCpu size={20} className='text-emerald-400' />
                        </div>
                        <h3 style={{ color: 'var(--t1)' }} className='font-bold text-lg mb-2'>
                            Zero-Bloat Engineering
                        </h3>
                        <p style={{ color: 'var(--t4)' }} className='text-sm leading-relaxed'>
                            100% vector, typography, and code-based animation. High visual fidelity at a fraction of standard video bandwidth.
                        </p>
                    </div>

                    <div
                        style={{
                            backgroundColor: 'var(--card)',
                            borderColor: 'var(--bd)',
                        }}
                        className='p-6 rounded-2xl border transition-all hover:border-[var(--bd2)] duration-300 sm:col-span-2 lg:col-span-1'
                    >
                        <div
                            style={{ borderColor: 'var(--bd2)', color: 'var(--t1)' }}
                            className='w-10 h-10 rounded-xl border flex items-center justify-center mb-4 bg-indigo-500/10'
                        >
                            <BsCodeSlash size={20} className='text-indigo-400' />
                        </div>
                        <h3 style={{ color: 'var(--t1)' }} className='font-bold text-lg mb-2'>
                            Motion Sync & Control
                        </h3>
                        <p style={{ color: 'var(--t4)' }} className='text-sm leading-relaxed'>
                            Fully integrated with the portfolio motion toggle. Disables autoplay when users prefer reduced motion while keeping manual scrubbers interactive.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Showreel;
