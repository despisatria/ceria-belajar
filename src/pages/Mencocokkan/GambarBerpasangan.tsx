import React from 'react';
import PairMatchingGame, { type DeckCard, type MatchingGameConfig } from './PairMatchingGame';

// Pairs for Gambar Berpasangan (e.g., Animal -> Food/Product)
const MATCHING_PAIRS = [
    { id: 1, itemA: '🐄', itemB: '🥛' }, // Cow -> Milk
    { id: 2, itemA: '🐝', itemB: '🍯' }, // Bee -> Honey
    { id: 3, itemA: '🐒', itemB: '🍌' }, // Monkey -> Banana
    { id: 4, itemA: '🐔', itemB: '🥚' }, // Chicken -> Egg
    { id: 5, itemA: '🌧️', itemB: '☂️' }, // Rain -> Umbrella
    { id: 6, itemA: '🦷', itemB: '🪥' }, // Tooth -> Toothbrush
    { id: 7, itemA: '🔒', itemB: '🔑' }, // Lock -> Key
    { id: 8, itemA: '🔨', itemB: '📍' }, // Hammer -> Nail (Pushpin)
    { id: 9, itemA: '🕸️', itemB: '🕷️' }, // Web -> Spider
    { id: 10, itemA: '🌸', itemB: '🦋' }, // Flower -> Butterfly
    { id: 11, itemA: '🐟', itemB: '🎣' }, // Fish -> Fishing Pole
    { id: 12, itemA: '📝', itemB: '✏️' }, // Paper -> Pencil
];

const config: MatchingGameConfig = {
    title: 'Cocokkan Gambar Berpasangan!',
    subtitle: 'Contoh: Sapi (🐄) dipasangkan dengan Susu (🥛)',
    speechText: 'Cocokkan Gambar yang Berpasangan!',
    themeColor: 'var(--cat-purple)',
    menuLink: '/mencocokkan',
    roundWinTitle: 'Hebat! 🌟',
    roundWinMessage: 'Pasangan gambar sangat cocok!',
    buildDeck: (pairCount: number): DeckCard[] => {
        const shuffled = [...MATCHING_PAIRS].sort(() => Math.random() - 0.5).slice(0, pairCount);
        const deck: DeckCard[] = [];
        shuffled.forEach((pair) => {
            deck.push({ uniqueId: `${pair.id}-A`, pairId: pair.id, content: pair.itemA });
            deck.push({ uniqueId: `${pair.id}-B`, pairId: pair.id, content: pair.itemB });
        });
        return deck.sort(() => Math.random() - 0.5);
    },
    renderCard: (card: DeckCard) => card.content,
};

const GambarBerpasangan: React.FC = () => <PairMatchingGame config={config} />;

export default GambarBerpasangan;
