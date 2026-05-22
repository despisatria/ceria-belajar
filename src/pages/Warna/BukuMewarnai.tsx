import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSpeakOnMount } from '../../hooks/useSpeakOnMount';

const COLORS = [
    '#E53935', // Merah
    '#1E88E5', // Biru
    '#FDD835', // Kuning
    '#43A047', // Hijau
    '#FB8C00', // Oranye
    '#8E24AA', // Ungu
    '#EC407A', // Pink
    '#6D4C41', // Coklat
    '#9E9E9E', // Abu-abu
    '#212121', // Hitam
    '#FAFAFA', // Putih (Eraser)
];

const BRUSH_SIZES = [
    { id: 'small', size: 10, label: 'Kecil' },
    { id: 'medium', size: 25, label: 'Sedang' },
    { id: 'large', size: 50, label: 'Besar' },
];

const TEMPLATES = [
    {
        id: 'apel',
        name: 'Apel',
        svg: (
            <svg viewBox="5 0 90 95" style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
                <path d="M 50 25 C 30 15, 10 30, 15 55 C 20 85, 40 95, 50 90 C 60 95, 80 85, 85 55 C 90 30, 70 15, 50 25 Z" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 50 25 Q 45 10, 55 5" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 55 15 C 65 5, 85 10, 90 25 C 80 35, 60 30, 55 15 Z" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 25 45 C 22 55, 25 65, 30 70" fill="none" stroke="black" strokeWidth="1" strokeLinecap="round" />
            </svg>
        )
    },
    {
        id: 'rumah',
        name: 'Rumah',
        svg: (
            <svg viewBox="5 10 90 90" style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
                <rect x="20" y="45" width="60" height="50" fill="none" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />
                <polygon points="10,45 50,15 90,45" fill="none" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />
                <rect x="70" y="20" width="10" height="15" fill="none" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M 68 20 L 82 20" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 40 95 L 40 65 C 40 60, 50 60, 50 65 L 50 95" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="48" cy="80" r="1.5" fill="black" />
                <rect x="25" y="55" width="12" height="12" fill="none" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M 31 55 L 31 67 M 25 61 L 37 61" stroke="black" strokeWidth="1" strokeLinecap="round" />
                <rect x="63" y="55" width="12" height="12" fill="none" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M 69 55 L 69 67 M 63 61 L 75 61" stroke="black" strokeWidth="1" strokeLinecap="round" />
                <circle cx="50" cy="32" r="6" fill="none" stroke="black" strokeWidth="1.5" />
                <path d="M 50 26 L 50 38 M 44 32 L 56 32" stroke="black" strokeWidth="1" strokeLinecap="round" />
            </svg>
        )
    },
    {
        id: 'mobil',
        name: 'Mobil',
        svg: (
            <svg viewBox="0 15 120 75" style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
                <path d="M 35 45 C 35 25, 45 20, 60 20 C 75 20, 85 25, 85 45" fill="none" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M 15 45 L 105 45 C 115 45, 115 55, 115 65 L 115 70 C 115 75, 110 75, 105 75 L 95 75 C 95 65, 80 65, 80 75 L 40 75 C 40 65, 25 65, 25 75 L 15 75 C 10 75, 5 75, 5 70 L 5 65 C 5 55, 5 45, 15 45 Z" fill="none" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />
                <circle cx="32.5" cy="75" r="10" fill="none" stroke="black" strokeWidth="1.5" />
                <circle cx="32.5" cy="75" r="4" fill="none" stroke="black" strokeWidth="1" />
                <circle cx="87.5" cy="75" r="10" fill="none" stroke="black" strokeWidth="1.5" />
                <circle cx="87.5" cy="75" r="4" fill="none" stroke="black" strokeWidth="1" />
                <path d="M 40 45 L 40 28 C 45 25, 55 25, 58 25 L 58 45 Z" fill="none" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M 62 45 L 62 25 C 70 25, 75 28, 80 45 Z" fill="none" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M 10 50 C 15 50, 15 60, 10 60" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 110 50 C 105 50, 105 60, 110 60" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        )
    },
    {
        id: 'kucing',
        name: 'Kucing',
        svg: (
            <svg viewBox="0 0 100 90" style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
                <circle cx="50" cy="50" r="35" fill="none" stroke="black" strokeWidth="1.5" />
                <path d="M 25 25 L 15 5 L 40 18" fill="none" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M 75 25 L 85 5 L 60 18" fill="none" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />
                <circle cx="35" cy="45" r="4" fill="black" />
                <circle cx="65" cy="45" r="4" fill="black" />
                <polygon points="45,55 55,55 50,60" fill="black" />
                <path d="M 50 60 C 45 65, 40 65, 40 60" fill="none" stroke="black" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M 50 60 C 55 65, 60 65, 60 60" fill="none" stroke="black" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M 25 55 L 10 50 M 25 60 L 5 60 M 25 65 L 10 70" stroke="black" strokeWidth="1" strokeLinecap="round" />
                <path d="M 75 55 L 90 50 M 75 60 L 95 60 M 75 65 L 90 70" stroke="black" strokeWidth="1" strokeLinecap="round" />
            </svg>
        )
    },
    {
        id: 'kupu',
        name: 'Kupu-kupu',
        svg: (
            <svg viewBox="5 0 90 100" style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
                <path d="M 50 20 C 40 10, 30 10, 35 5" fill="none" stroke="black" strokeWidth="1.2" strokeLinecap="round" />
                <circle cx="35" cy="5" r="2" fill="black" />
                <path d="M 50 20 C 60 10, 70 10, 65 5" fill="none" stroke="black" strokeWidth="1.2" strokeLinecap="round" />
                <circle cx="65" cy="5" r="2" fill="black" />
                <path d="M 45 35 C 10 10, 0 40, 40 55" fill="none" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M 55 35 C 90 10, 100 40, 60 55" fill="none" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M 40 55 C 10 70, 20 100, 45 75" fill="none" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M 60 55 C 90 70, 80 100, 55 75" fill="none" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />
                <circle cx="25" cy="35" r="6" fill="none" stroke="black" strokeWidth="1.2" />
                <circle cx="75" cy="35" r="6" fill="none" stroke="black" strokeWidth="1.2" />
                <circle cx="30" cy="70" r="4" fill="none" stroke="black" strokeWidth="1.2" />
                <circle cx="70" cy="70" r="4" fill="none" stroke="black" strokeWidth="1.2" />
                <ellipse cx="50" cy="50" rx="6" ry="25" fill="none" stroke="black" strokeWidth="1.5" />
                <circle cx="50" cy="20" r="6" fill="none" stroke="black" strokeWidth="1.5" />
                <path d="M 45 40 L 55 40 M 44 50 L 56 50 M 45 60 L 55 60" stroke="black" strokeWidth="1" strokeLinecap="round" />
            </svg>
        )
    }
];

const BukuMewarnai: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState(COLORS[0]);
    const [brushSize, setBrushSize] = useState(BRUSH_SIZES[1].size);
    const [activeTemplate, setActiveTemplate] = useState(TEMPLATES[0]);

    useSpeakOnMount('Buku Mewarnai!');

    const initCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;

            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }
    };

    useEffect(() => {
        initCanvas();

        // Handle window resize
        const handleResize = () => {
            initCanvas();
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Also re-init canvas if template changes (to clear it)
    useEffect(() => {
        initCanvas();
    }, [activeTemplate]);


    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        setIsDrawing(true);
        const { offsetX, offsetY } = getCoordinates(e, canvas);

        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);

        ctx.fillStyle = color;
        ctx.arc(offsetX, offsetY, brushSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (e.type.includes('touch')) {
            e.preventDefault();
        }

        const { offsetX, offsetY } = getCoordinates(e, canvas);

        ctx.lineTo(offsetX, offsetY);
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) ctx.closePath();
        }
    };

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
        const rect = canvas.getBoundingClientRect();
        if ('touches' in e) {
            return {
                offsetX: e.touches[0].clientX - rect.left,
                offsetY: e.touches[0].clientY - rect.top,
            };
        } else {
            return {
                offsetX: (e as React.MouseEvent).clientX - rect.left,
                offsetY: (e as React.MouseEvent).clientY - rect.top,
            };
        }
    };

    return (
        <div className="app-container" style={{ padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div style={{ marginBottom: '10px', textAlign: 'left', display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <Link to="/warna" className="btn" style={{
                    backgroundColor: 'var(--text-color)',
                    textTransform: 'none',
                    fontSize: '1rem',
                    padding: '8px 16px'
                }}>
                    ⬅️ Kembali
                </Link>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {TEMPLATES.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setActiveTemplate(t)}
                            className="btn"
                            style={{
                                backgroundColor: activeTemplate.id === t.id ? 'var(--cat-blue)' : 'var(--text-color)',
                                padding: '8px 16px',
                                fontSize: '1rem'
                            }}
                        >
                            {t.name}
                        </button>
                    ))}
                </div>
                <button onClick={initCanvas} className="btn" style={{ backgroundColor: 'var(--cat-red)', padding: '8px 16px', fontSize: '1rem' }}>
                    🗑️ Hapus
                </button>
            </div>

            <h2 style={{ fontSize: '2rem', color: 'var(--cat-pink)', marginBottom: '15px', textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
                Buku Mewarnai 🎨
            </h2>

            {/* Toolbar */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                marginBottom: '15px',
                backgroundColor: 'rgba(255,255,255,0.5)',
                padding: '10px',
                borderRadius: '15px',
                border: '2px solid rgba(0,0,0,0.05)'
            }}>
                {/* Colors */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {COLORS.map(c => (
                        <button
                            key={c}
                            onClick={() => setColor(c)}
                            style={{
                                width: '35px',
                                height: '35px',
                                borderRadius: '50%',
                                backgroundColor: c,
                                border: c === '#FAFAFA' ? '2px solid #ccc' : '2px solid rgba(0,0,0,0.1)',
                                cursor: 'pointer',
                                transform: color === c ? 'scale(1.2)' : 'scale(1)',
                                boxShadow: color === c ? '0 4px 8px rgba(0,0,0,0.2)' : 'none',
                                transition: 'all 0.2s'
                            }}
                            aria-label={`Pilih warna ${c}`}
                        >
                            {c === '#FAFAFA' && <span style={{ fontSize: '12px' }}></span>}
                        </button>
                    ))}
                </div>

                {/* Brush Sizes */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 'bold', color: 'var(--text-color)' }}>Ukuran Kuas:</span>
                    {BRUSH_SIZES.map(b => (
                        <button
                            key={b.id}
                            onClick={() => setBrushSize(b.size)}
                            style={{
                                padding: '5px 10px',
                                borderRadius: '10px',
                                border: 'none',
                                backgroundColor: brushSize === b.size ? 'var(--cat-blue)' : '#ddd',
                                color: brushSize === b.size ? 'white' : '#333',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            {b.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Canvas Container */}
            <div style={{
                flex: 1,
                width: '100%',
                maxWidth: '800px',
                margin: '0 auto',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                border: '2px solid var(--cat-pink)',
                backgroundColor: 'white',
                touchAction: 'none',
                position: 'relative'
            }}>
                {/* The Canvas where user draws */}
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        cursor: 'crosshair',
                        zIndex: 1
                    }}
                />

                {/* The Template Overlay (blocks clicks, so it must have pointerEvents: 'none') */}
                <div style={{
                    position: 'absolute',
                    top: '5%',
                    left: '5%',
                    width: '90%',
                    height: '90%',
                    zIndex: 2,
                    pointerEvents: 'none'
                }}>
                    {activeTemplate.svg}
                </div>
            </div>
        </div>
    );
};

export default BukuMewarnai;
