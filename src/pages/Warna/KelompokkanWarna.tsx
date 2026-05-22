import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSpeakOnMount } from '../../hooks/useSpeakOnMount';
import confetti from 'canvas-confetti';

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
    '#FFFFFF', // Putih
];

interface TemplateProps {
    fills: Record<string, string>;
    onFill: (id: string) => void;
}

const TEMPLATES = [
    { 
        id: 'pemandangan', 
        name: 'Pemandangan',
        render: ({ fills, onFill }: TemplateProps) => (
            <svg viewBox="0 0 200 150" style={{ width: '100%', height: '100%' }}>
                {/* Sky */}
                <rect id="sky" x="0" y="0" width="200" height="150" fill={fills['sky'] || '#FFFFFF'} stroke="black" strokeWidth="1" onClick={() => onFill('sky')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                
                {/* Sun */}
                <circle id="sun" cx="170" cy="30" r="15" fill={fills['sun'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('sun')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                
                {/* Cloud 1 */}
                <path id="cloud1" d="M 30 40 C 30 30, 45 25, 55 35 C 65 30, 80 40, 75 50 C 80 60, 65 65, 55 60 C 45 70, 30 65, 30 55 C 20 50, 20 40, 30 40 Z" fill={fills['cloud1'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('cloud1')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                
                {/* Ground */}
                <path id="ground" d="M 0 100 Q 50 85, 100 105 T 200 100 L 200 150 L 0 150 Z" fill={fills['ground'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('ground')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                
                {/* Tree */}
                <path id="tree_trunk" d="M 140 120 L 140 80 L 150 80 L 150 120 Z" fill={fills['tree_trunk'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('tree_trunk')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <path id="tree_leaves" d="M 145 50 C 120 50, 110 70, 125 85 C 115 100, 140 105, 145 95 C 150 105, 175 100, 165 85 C 180 70, 170 50, 145 50 Z" fill={fills['tree_leaves'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('tree_leaves')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />

                {/* House */}
                <rect id="house_wall" x="30" y="80" width="50" height="40" fill={fills['house_wall'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('house_wall')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <polygon id="house_roof" points="20,80 55,50 90,80" fill={fills['house_roof'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('house_roof')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <rect id="house_door" x="50" y="95" width="15" height="25" fill={fills['house_door'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('house_door')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <rect id="house_window" x="35" y="90" width="10" height="10" fill={fills['house_window'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('house_window')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
            </svg>
        )
    },
    { 
        id: 'roket', 
        name: 'Luar Angkasa',
        render: ({ fills, onFill }: TemplateProps) => (
            <svg viewBox="0 0 200 150" style={{ width: '100%', height: '100%' }}>
                {/* Space Background */}
                <rect id="space" x="0" y="0" width="200" height="150" fill={fills['space'] || '#FFFFFF'} stroke="black" strokeWidth="1" onClick={() => onFill('space')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                
                {/* Planet 1 (bottom left) */}
                <path id="planet1" d="M -20 120 A 50 50 0 0 0 50 170 L -20 170 Z" fill={fills['planet1'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('planet1')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                
                {/* Planet 2 (top right) with ring */}
                <circle id="planet2" cx="160" cy="40" r="15" fill={fills['planet2'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('planet2')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <path id="planet2_ring" d="M 132 48 Q 160 60, 192 35 A 3 3 0 0 0 188 30 Q 160 52, 134 43 A 3 3 0 0 0 132 48 Z" fill={fills['planet2_ring'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('planet2_ring')} style={{ cursor: 'pointer' }} />
                
                {/* Stars */}
                <path id="star1" d="M 30 20 L 32 25 L 37 25 L 33 28 L 35 33 L 30 30 L 25 33 L 27 28 L 23 25 L 28 25 Z" fill={fills['star1'] || '#FFFFFF'} stroke="black" strokeWidth="1" onClick={() => onFill('star1')} style={{ cursor: 'pointer' }} />
                <path id="star2" d="M 100 15 L 101 18 L 104 18 L 102 20 L 103 23 L 100 21 L 97 23 L 98 20 L 96 18 L 99 18 Z" fill={fills['star2'] || '#FFFFFF'} stroke="black" strokeWidth="1" onClick={() => onFill('star2')} style={{ cursor: 'pointer' }} />
                <path id="star3" d="M 140 110 L 142 115 L 147 115 L 143 118 L 145 123 L 140 120 L 135 123 L 137 118 L 133 115 L 138 115 Z" fill={fills['star3'] || '#FFFFFF'} stroke="black" strokeWidth="1" onClick={() => onFill('star3')} style={{ cursor: 'pointer' }} />

                {/* Flame */}
                <path id="flame" d="M 80 110 Q 90 140, 100 110 Q 110 140, 120 110 Q 100 80, 80 110 Z" fill={fills['flame'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('flame')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />

                {/* Rocket Fins */}
                <path id="fin_left" d="M 85 90 L 70 110 L 85 100 Z" fill={fills['fin_left'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('fin_left')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <path id="fin_right" d="M 115 90 L 130 110 L 115 100 Z" fill={fills['fin_right'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('fin_right')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />

                {/* Rocket Body */}
                <path id="rocket_body" d="M 85 50 C 80 70, 80 100, 85 110 L 115 110 C 120 100, 120 70, 115 50 Z" fill={fills['rocket_body'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('rocket_body')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                
                {/* Rocket Nose */}
                <path id="rocket_nose" d="M 85 50 C 95 30, 105 30, 115 50 Z" fill={fills['rocket_nose'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('rocket_nose')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                
                {/* Rocket Window */}
                <circle id="rocket_window_frame" cx="100" cy="70" r="10" fill={fills['rocket_window_frame'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('rocket_window_frame')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <circle id="rocket_window" cx="100" cy="70" r="6" fill={fills['rocket_window'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('rocket_window')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
            </svg>
        )
    },
    { 
        id: 'laut', 
        name: 'Dunia Laut',
        render: ({ fills, onFill }: TemplateProps) => (
            <svg viewBox="0 0 200 150" style={{ width: '100%', height: '100%' }}>
                {/* Water */}
                <path id="water" d="M 0 30 Q 25 15, 50 30 T 100 30 T 150 30 T 200 30 L 200 150 L 0 150 Z" fill={fills['water'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('water')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                
                {/* Sand/Sea floor */}
                <path id="sand" d="M 0 130 Q 50 120, 100 135 T 200 125 L 200 150 L 0 150 Z" fill={fills['sand'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('sand')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                
                {/* Seaweed 1 */}
                <path id="seaweed1" d="M 30 140 Q 20 110, 35 90 Q 25 70, 30 50 Q 35 70, 45 90 Q 35 110, 40 140 Z" fill={fills['seaweed1'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('seaweed1')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                
                {/* Seaweed 2 */}
                <path id="seaweed2" d="M 160 135 Q 170 100, 155 80 Q 165 60, 160 40 Q 155 60, 145 80 Q 155 100, 150 135 Z" fill={fills['seaweed2'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('seaweed2')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                
                {/* Bubbles */}
                <circle id="bubble1" cx="80" cy="50" r="5" fill={fills['bubble1'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('bubble1')} style={{ cursor: 'pointer' }} />
                <circle id="bubble2" cx="95" cy="35" r="3" fill={fills['bubble2'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('bubble2')} style={{ cursor: 'pointer' }} />
                
                {/* Fish 1 (facing right) */}
                <path id="fish1_tail" d="M 50 85 L 35 75 L 35 95 Z" fill={fills['fish1_tail'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('fish1_tail')} style={{ cursor: 'pointer' }} />
                <path id="fish1_body" d="M 50 85 C 50 65, 80 65, 90 85 C 80 105, 50 105, 50 85 Z" fill={fills['fish1_body'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('fish1_body')} style={{ cursor: 'pointer' }} />
                <circle cx="75" cy="80" r="2" fill="black" />
                <path id="fish1_fin" d="M 60 85 Q 65 95, 70 85 Z" fill={fills['fish1_fin'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('fish1_fin')} style={{ cursor: 'pointer' }} />
                
                {/* Fish 2 (facing left, smaller) */}
                <path id="fish2_tail" d="M 130 100 L 140 95 L 140 105 Z" fill={fills['fish2_tail'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('fish2_tail')} style={{ cursor: 'pointer' }} />
                <path id="fish2_body" d="M 130 100 C 130 90, 110 90, 105 100 C 110 110, 130 110, 130 100 Z" fill={fills['fish2_body'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('fish2_body')} style={{ cursor: 'pointer' }} />
                <circle cx="115" cy="98" r="1.5" fill="black" />
            </svg>
        )
    },
    { 
        id: 'bunga', 
        name: 'Bunga',
        render: ({ fills, onFill }: TemplateProps) => (
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                <path id="stem" d="M 48 50 L 48 25 L 52 25 L 52 50 Z" fill={fills['stem'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('stem')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <path id="leaf1" d="M 48 40 Q 30 30, 20 40 Q 30 50, 48 45 Z" fill={fills['leaf1'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('leaf1')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <path id="leaf2" d="M 52 35 Q 70 25, 80 35 Q 70 45, 52 40 Z" fill={fills['leaf2'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('leaf2')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <path id="pot" d="M 30 90 L 70 90 L 80 60 L 20 60 Z" fill={fills['pot'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('pot')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <rect id="pot_rim" x="15" y="50" width="70" height="10" fill={fills['pot_rim'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('pot_rim')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                
                {/* Petals drawn behind center */}
                <circle id="petal1" cx="50" cy="12" r="10" fill={fills['petal1'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('petal1')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <circle id="petal2" cx="63" cy="25" r="10" fill={fills['petal2'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('petal2')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <circle id="petal3" cx="50" cy="38" r="10" fill={fills['petal3'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('petal3')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <circle id="petal4" cx="37" cy="25" r="10" fill={fills['petal4'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('petal4')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                
                <circle id="flower_center" cx="50" cy="25" r="8" fill={fills['flower_center'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('flower_center')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
            </svg>
        )
    },
    { 
        id: 'eskrim', 
        name: 'Es Krim',
        render: ({ fills, onFill }: TemplateProps) => (
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                <polygon id="cone" points="50,90 25,45 75,45" fill={fills['cone'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('cone')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <path id="cone_lines" d="M 35 45 L 50 75 M 45 45 L 60 75 M 55 45 L 70 75 M 65 45 L 45 85 M 55 45 L 35 85 M 45 45 L 25 85" fill="none" stroke="black" strokeWidth="0.5" />
                
                <path id="icecream_base" d="M 25 45 C 25 25, 75 25, 75 45 Z" fill={fills['icecream_base'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('icecream_base')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                
                <circle id="scoop1" cx="35" cy="35" r="12" fill={fills['scoop1'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('scoop1')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <circle id="scoop2" cx="65" cy="35" r="12" fill={fills['scoop2'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('scoop2')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <circle id="scoop3" cx="50" cy="22" r="15" fill={fills['scoop3'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('scoop3')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                
                <circle id="cherry" cx="50" cy="8" r="6" fill={fills['cherry'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('cherry')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <path id="stem" d="M 50 2 Q 55 -5, 60 5" fill="none" stroke="black" strokeWidth="1.5" />
            </svg>
        )
    },
    { 
        id: 'perahu', 
        name: 'Perahu Layar',
        render: ({ fills, onFill }: TemplateProps) => (
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                <rect id="sky" x="0" y="0" width="100" height="70" fill={fills['sky'] || '#FFFFFF'} stroke="black" strokeWidth="1" onClick={() => onFill('sky')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <circle id="sun" cx="85" cy="15" r="10" fill={fills['sun'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('sun')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                
                <path id="water" d="M 0 70 Q 25 60, 50 70 T 100 70 L 100 100 L 0 100 Z" fill={fills['water'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('water')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                
                <path id="boat_hull" d="M 20 70 L 80 70 L 65 90 L 35 90 Z" fill={fills['boat_hull'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('boat_hull')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <rect id="mast" x="48" y="20" width="4" height="50" fill={fills['mast'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('mast')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <polygon id="sail_left" points="46,25 46,65 15,65" fill={fills['sail_left'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('sail_left')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <polygon id="sail_right" points="54,25 54,65 85,65" fill={fills['sail_right'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('sail_right')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
            </svg>
        )
    },
    { 
        id: 'pesawat', 
        name: 'Pesawat',
        render: ({ fills, onFill }: TemplateProps) => (
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                <rect id="sky" x="0" y="0" width="100" height="100" fill={fills['sky'] || '#FFFFFF'} stroke="black" strokeWidth="1" onClick={() => onFill('sky')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <path id="cloud1" d="M 20 20 Q 30 10, 40 20 Q 50 20, 45 30 Q 35 35, 25 30 Q 15 35, 10 25 Q 10 15, 20 20 Z" fill={fills['cloud1'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('cloud1')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <path id="cloud2" d="M 80 80 Q 90 70, 100 80 Q 110 80, 105 90 Q 95 95, 85 90 Q 75 95, 70 85 Q 70 75, 80 80 Z" fill={fills['cloud2'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('cloud2')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                
                <path id="tail" d="M 20 50 L 15 35 L 30 50 Z" fill={fills['tail'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('tail')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <path id="wing_top" d="M 45 50 L 35 30 L 55 50 Z" fill={fills['wing_top'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('wing_top')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <path id="wing_bottom" d="M 45 60 L 35 80 L 55 60 Z" fill={fills['wing_bottom'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('wing_bottom')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                
                <path id="body" d="M 20 60 C 10 60, 10 50, 20 50 L 70 50 C 90 50, 90 60, 70 60 Z" fill={fills['body'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('body')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                
                <path id="window1" d="M 60 52 L 65 52 L 65 57 L 60 57 Z" fill={fills['window1'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('window1')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <path id="window2" d="M 50 52 L 55 52 L 55 57 L 50 57 Z" fill={fills['window2'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('window2')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <path id="window3" d="M 40 52 L 45 52 L 45 57 L 40 57 Z" fill={fills['window3'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('window3')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
            </svg>
        )
    },
    { 
        id: 'kupukupu', 
        name: 'Kupu-Kupu',
        render: ({ fills, onFill }: TemplateProps) => (
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                <path id="wing_top_left" d="M 45 40 C 10 30, 0 0, 45 30 Z" fill={fills['wing_top_left'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('wing_top_left')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <path id="wing_top_right" d="M 55 40 C 90 30, 100 0, 55 30 Z" fill={fills['wing_top_right'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('wing_top_right')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <path id="wing_bot_left" d="M 45 60 C 10 70, 20 100, 45 70 Z" fill={fills['wing_bot_left'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('wing_bot_left')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <path id="wing_bot_right" d="M 55 60 C 90 70, 80 100, 55 70 Z" fill={fills['wing_bot_right'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('wing_bot_right')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                
                <ellipse id="body" cx="50" cy="50" rx="6" ry="25" fill={fills['body'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('body')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <circle id="head" cx="50" cy="20" r="6" fill={fills['head'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('head')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <path d="M 48 15 Q 40 5, 35 10 M 52 15 Q 60 5, 65 10" fill="none" stroke="black" strokeWidth="1.5" />
                
                <circle id="dot1" cx="30" cy="25" r="4" fill={fills['dot1'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('dot1')} style={{ cursor: 'pointer' }} />
                <circle id="dot2" cx="70" cy="25" r="4" fill={fills['dot2'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('dot2')} style={{ cursor: 'pointer' }} />
                <circle id="dot3" cx="35" cy="75" r="3" fill={fills['dot3'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('dot3')} style={{ cursor: 'pointer' }} />
                <circle id="dot4" cx="65" cy="75" r="3" fill={fills['dot4'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('dot4')} style={{ cursor: 'pointer' }} />
            </svg>
        )
    },
    { 
        id: 'kastil', 
        name: 'Kastil',
        render: ({ fills, onFill }: TemplateProps) => (
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                <rect id="sky" x="0" y="0" width="100" height="100" fill={fills['sky'] || '#FFFFFF'} stroke="black" strokeWidth="1" onClick={() => onFill('sky')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                
                <rect id="wall" x="25" y="50" width="50" height="50" fill={fills['wall'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('wall')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <rect id="tower_left" x="15" y="30" width="20" height="70" fill={fills['tower_left'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('tower_left')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <rect id="tower_right" x="65" y="30" width="20" height="70" fill={fills['tower_right'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('tower_right')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                
                <polygon id="roof_left" points="10,30 25,10 40,30" fill={fills['roof_left'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('roof_left')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <polygon id="roof_right" points="60,30 75,10 90,30" fill={fills['roof_right'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('roof_right')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                
                <path id="door" d="M 40 100 L 40 75 A 10 10 0 0 1 60 75 L 60 100 Z" fill={fills['door'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('door')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <rect id="window1" x="20" y="45" width="10" height="15" fill={fills['window1'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('window1')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <rect id="window2" x="70" y="45" width="10" height="15" fill={fills['window2'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('window2')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                
                <path id="flag1" d="M 25 10 L 25 0 L 35 5 Z" fill={fills['flag1'] || '#FFFFFF'} stroke="black" strokeWidth="1" strokeLinejoin="round" onClick={() => onFill('flag1')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <path id="flag2" d="M 75 10 L 75 0 L 85 5 Z" fill={fills['flag2'] || '#FFFFFF'} stroke="black" strokeWidth="1" strokeLinejoin="round" onClick={() => onFill('flag2')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
            </svg>
        )
    },
    { 
        id: 'kereta', 
        name: 'Kereta Api',
        render: ({ fills, onFill }: TemplateProps) => (
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                <rect id="sky" x="0" y="0" width="100" height="100" fill={fills['sky'] || '#FFFFFF'} stroke="black" strokeWidth="1" onClick={() => onFill('sky')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <path id="track" d="M 0 85 L 100 85 M 0 90 L 100 90" fill="none" stroke="black" strokeWidth="1.5" />
                <rect id="track_ground" x="0" y="90" width="100" height="10" fill={fills['track_ground'] || '#FFFFFF'} stroke="black" strokeWidth="1" onClick={() => onFill('track_ground')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                
                <rect id="cab" x="10" y="30" width="30" height="50" fill={fills['cab'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('cab')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <rect id="boiler" x="40" y="50" width="45" height="30" fill={fills['boiler'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('boiler')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <rect id="chimney" x="70" y="30" width="10" height="20" fill={fills['chimney'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('chimney')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <polygon id="cowcatcher" points="85,80 100,80 85,60" fill={fills['cowcatcher'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" strokeLinejoin="round" onClick={() => onFill('cowcatcher')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                
                <circle id="wheel1" cx="25" cy="80" r="10" fill={fills['wheel1'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('wheel1')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <circle id="wheel2" cx="55" cy="80" r="8" fill={fills['wheel2'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('wheel2')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <circle id="wheel3" cx="75" cy="80" r="8" fill={fills['wheel3'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('wheel3')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                
                <rect id="window" x="15" y="40" width="20" height="15" fill={fills['window'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('window')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                
                <path id="smoke1" d="M 75 25 A 5 5 0 1 1 85 25 A 5 5 0 1 1 75 25" fill={fills['smoke1'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('smoke1')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
                <path id="smoke2" d="M 80 15 A 7 7 0 1 1 94 15 A 7 7 0 1 1 80 15" fill={fills['smoke2'] || '#FFFFFF'} stroke="black" strokeWidth="1.5" onClick={() => onFill('smoke2')} style={{ cursor: 'pointer', transition: 'fill 0.2s' }} />
            </svg>
        )
    }
];

const KelompokkanWarna: React.FC = () => {
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [activeTemplate, setActiveTemplate] = useState(TEMPLATES[0]);
    const [fills, setFills] = useState<Record<string, string>>({});

    useSpeakOnMount('Mewarnai Pintar!');

    const handleFill = (id: string) => {
        setFills(prev => {
            return {
                ...prev,
                [id]: selectedColor
            };
        });
        
        // Optional subtle pop confetti just for fun when clicking
        confetti({
            particleCount: 15,
            spread: 40,
            origin: { y: 0.9 },
            colors: [selectedColor]
        });
    };

    const handleClear = () => {
        setFills({});
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: '800px', margin: '0 auto' }}>
            {/* Header / Nav */}
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
                            onClick={() => { setActiveTemplate(t); setFills({}); }}
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
                <button onClick={handleClear} className="btn" style={{ backgroundColor: 'var(--cat-red)', padding: '8px 16px', fontSize: '1rem' }}>
                    🗑️ Hapus
                </button>
            </div>

            <h2 style={{ fontSize: '2rem', color: 'var(--cat-green)', marginBottom: '15px', textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
                Mewarnai Pintar 🖌️
            </h2>
            <p style={{ color: 'var(--quaternary)', fontWeight: 'bold', marginBottom: '20px' }}>
                Pilih warna di bawah, lalu sentuh bagian gambar untuk mewarnai!
            </p>

            {/* Drawing Area */}
            <div style={{ 
                flex: 1, 
                width: '100%', 
                backgroundColor: 'white',
                borderRadius: '15px', 
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                border: '2px solid var(--cat-green)',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px'
            }}>
                <div style={{ width: '80%', height: '80%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {activeTemplate.render({ fills, onFill: handleFill })}
                </div>
            </div>

            {/* Color Palette */}
            <div style={{ 
                marginTop: '20px',
                display: 'flex', 
                flexDirection: 'column', 
                gap: '15px', 
                backgroundColor: 'rgba(255,255,255,0.5)',
                padding: '15px',
                borderRadius: '15px',
                border: '2px solid rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    {COLORS.map(c => (
                        <button
                            key={c}
                            onClick={() => setSelectedColor(c)}
                            style={{
                                width: '45px',
                                height: '45px',
                                borderRadius: '50%',
                                backgroundColor: c,
                                border: c === '#FFFFFF' ? '2px solid #ccc' : '2px solid rgba(0,0,0,0.1)',
                                cursor: 'pointer',
                                transform: selectedColor === c ? 'scale(1.2)' : 'scale(1)',
                                boxShadow: selectedColor === c ? '0 4px 12px rgba(0,0,0,0.3)' : 'none',
                                transition: 'all 0.2s',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            aria-label={`Pilih warna ${c}`}
                        >
                            {c === '#FFFFFF' && <span style={{ fontSize: '10px', color: '#666' }}>Eraser</span>}
                            {selectedColor === c && c !== '#FFFFFF' && (
                                <div style={{ width: '15px', height: '15px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.4)' }} />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default KelompokkanWarna;
