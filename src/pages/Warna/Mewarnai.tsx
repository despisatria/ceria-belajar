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
    '#FAFAFA', // Putih (Eraser essentially, if canvas is white)
];

const BRUSH_SIZES = [
    { id: 'small', size: 5, label: 'Kecil' },
    { id: 'medium', size: 15, label: 'Sedang' },
    { id: 'large', size: 30, label: 'Besar' },
];

const Mewarnai: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState(COLORS[0]);
    const [brushSize, setBrushSize] = useState(BRUSH_SIZES[1].size);

    useSpeakOnMount('Ayo Mewarnai!');

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
        
        const handleResize = () => {
            initCanvas();
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        setIsDrawing(true);
        const { offsetX, offsetY } = getCoordinates(e, canvas);

        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);

        // Draw a single dot in case of just a click
        ctx.fillStyle = color;
        ctx.arc(offsetX, offsetY, brushSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath(); // Start new path for line
        ctx.moveTo(offsetX, offsetY);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Prevent scrolling while drawing on touch devices
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

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
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
                <button onClick={clearCanvas} className="btn" style={{ backgroundColor: 'var(--cat-red)', padding: '8px 16px', fontSize: '1rem' }}>
                    🗑️ Hapus Semua
                </button>
            </div>

            <h2 style={{ fontSize: '2rem', color: 'var(--cat-pink)', marginBottom: '15px', textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
                Mewarnai Canvas 🖌️
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
                border: '4px solid var(--cat-pink)',
                backgroundColor: 'white',
                touchAction: 'none' // Prevent pull-to-refresh and scrolling on canvas
            }}>
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
                        width: '100%',
                        height: '100%',
                        cursor: 'crosshair',
                        display: 'block' // Remove inline element bottom gap
                    }}
                />
            </div>
        </div>
    );
};

export default Mewarnai;
