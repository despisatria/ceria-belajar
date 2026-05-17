import React from 'react';
import PairMatchingGame, { type DeckCard, type MatchingGameConfig } from './PairMatchingGame';

const SHAPE_PAIRS = [
    { id: 1, shape: '🟠', object: '🍊' }, // Circle -> Clock
    { id: 2, shape: '🔺', object: '⛺' }, // Triangle -> Pizza
    { id: 3, shape: '🟧', object: '🎁' }, // Square -> Gift
    { id: 4, shape: '🟦', object: '🧊' }, // Square -> Gift
    { id: 5, shape: '❤️', object: '🍓' }, // Heart -> Strawberry
    { id: 6, shape: '🔷', object: '🪁' }, // Diamond -> Kite
    { id: 7, shape: '🌙', object: '🍌' }, // Crescent -> Croissant
    { id: 8, shape: '🔵', object: '🌍' }, // Blue Circle -> Earth
    { id: 9, shape: '☆', object: '🎖️' }, // Square -> Sponge
    { id: 10, shape: '－', object: '🥢' }, // Inverted Triangle -> Ice Cream Cone
    { id: 11, shape: '🟫', object: '🚪' }, // Black Square -> TV
    { id: 12, shape: '🟢', object: '🥝' }, // Green Circle -> Kiwi
];

const config: MatchingGameConfig = {
    title: 'Cocokkan Bentuk dengan Bendanya! 🔺',
    subtitle: 'Pasangkan bentuk dasar dengan benda nyatanya',
    speechText: 'Cocokkan Bentuk dengan Bendanya!',
    themeColor: 'var(--cat-green)',
    menuLink: '/mencocokkan',
    roundWinTitle: 'Bagus! 🌟',
    roundWinMessage: 'Bentuk berhasil dicocokkan!',
    buildDeck: (pairCount: number): DeckCard[] => {
        const shuffled = [...SHAPE_PAIRS].sort(() => Math.random() - 0.5).slice(0, pairCount);
        const deck: DeckCard[] = [];
        shuffled.forEach((pair) => {
            deck.push({ uniqueId: `${pair.id}-shape`, pairId: pair.id, content: pair.shape });
            deck.push({ uniqueId: `${pair.id}-object`, pairId: pair.id, content: pair.object });
        });
        return deck.sort(() => Math.random() - 0.5);
    },
    renderCard: (card: DeckCard) => (
        <span style={{ fontSize: 'inherit' }}>{card.content}</span>
    ),
};

const CocokkanBentuk: React.FC = () => <PairMatchingGame config={config} />;

export default CocokkanBentuk;
