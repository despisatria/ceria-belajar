import React from 'react';
import PairMatchingGame, { type DeckCard, type MatchingGameConfig } from './PairMatchingGame';

// Color pairs: colored circle -> emoji representing that color
const COLOR_PAIRS = [
    { id: 1, name: 'Merah', color: '#E53935', emoji: '🌹' },
    { id: 2, name: 'Biru', color: '#1E88E5', emoji: '🐳' },
    { id: 3, name: 'Kuning', color: '#FDD835', emoji: '🌻' },
    { id: 4, name: 'Hijau', color: '#43A047', emoji: '🐸' },
    { id: 5, name: 'Oranye', color: '#FB8C00', emoji: '🥕' },
    { id: 6, name: 'Ungu', color: '#8E24AA', emoji: '🍇' },
    { id: 7, name: 'Merah Muda', color: '#EC407A', emoji: '🌸' },
    { id: 8, name: 'Coklat', color: '#6D4C41', emoji: '🐻' },
    { id: 9, name: 'Hitam', color: '#212121', emoji: '🎩' },
    { id: 10, name: 'Putih', color: '#FAFAFA', emoji: '🐑' },
    { id: 11, name: 'Abu-abu', color: '#9E9E9E', emoji: '🐘' },
];

const config: MatchingGameConfig = {
    title: 'Cocokkan Nama Warna! 🎨',
    subtitle: 'Pasangkan warna dengan gambar yang sesuai',
    speechText: 'Cocokkan Nama Warna!',
    themeColor: 'var(--cat-orange)',
    menuLink: '/mencocokkan',
    roundWinTitle: 'Hebat! 🌟',
    roundWinMessage: 'Semua warna cocok!',
    roundConfigs: [4, 6, 8, 10, 11],
    buildDeck: (pairCount: number): DeckCard[] => {
        const shuffled = [...COLOR_PAIRS].sort(() => Math.random() - 0.5).slice(0, pairCount);
        const deck: DeckCard[] = [];
        shuffled.forEach((pair) => {
            deck.push({ uniqueId: `${pair.id}-emoji`, pairId: pair.id, content: pair.emoji });
            deck.push({ uniqueId: `${pair.id}-color`, pairId: pair.id, content: '', extra: { colorCircle: pair.color } });
        });
        return deck.sort(() => Math.random() - 0.5);
    },
    renderCard: (card: DeckCard) => {
        const colorCircle = card.extra?.colorCircle as string | undefined;
        if (colorCircle) {
            return (
                <div style={{
                    width: '70%',
                    height: '70%',
                    borderRadius: '50%',
                    backgroundColor: colorCircle,
                    border: colorCircle === '#FAFAFA' ? '3px solid #ccc' : '3px solid rgba(0,0,0,0.1)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }} />
            );
        }
        return <span style={{ fontSize: 'inherit' }}>{card.content}</span>;
    },
};

const CocokkanWarna: React.FC = () => <PairMatchingGame config={config} />;

export default CocokkanWarna;
