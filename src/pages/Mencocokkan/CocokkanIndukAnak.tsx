import React from 'react';
import PairMatchingGame, { type DeckCard, type MatchingGameConfig } from './PairMatchingGame';

const ANIMAL_PAIRS = [
    { id: 1, parent: '🐓', child: '🐥' }, // Chicken -> Chick
    { id: 2, parent: '🐈', child: '🐱' }, // Cat -> Kitten
    { id: 3, parent: '🐕', child: '🐶' }, // Dog -> Puppy
    { id: 4, parent: '🐄', child: '🐮' }, // Cow -> Calf
    { id: 5, parent: '🐖', child: '🐷' }, // Pig -> Piglet
    { id: 6, parent: '🐅', child: '🐯' }, // Tiger -> Cub
    { id: 7, parent: '🐎', child: '🐴' }, // Horse -> Foal
    { id: 8, parent: '🐒', child: '🐵' }, // Gorilla -> Monkey
    { id: 9, parent: '🦅', child: '🐦' }, // Eagle -> Hatching Bird
    { id: 10, parent: '🐻', child: '🧸' }, // Bear -> Teddy/Cub
    { id: 11, parent: '🐁', child: '🐭' }, // Dino -> Lizard
    { id: 12, parent: '🐉', child: '🐲' }, // Dragon -> Dragon Face
];

const config: MatchingGameConfig = {
    title: 'Cocokkan Hewan yang mirip! 🐣',
    subtitle: 'Pasangkan hewan dengan hewan lain yang mirip!',
    speechText: 'Cocokkan Hewan yang mirip!',
    themeColor: 'var(--cat-orange)',
    menuLink: '/mencocokkan',
    roundWinTitle: 'Bagus! 🌟',
    roundWinMessage: 'Pasangan hewan bertemu!',
    buildDeck: (pairCount: number): DeckCard[] => {
        const shuffled = [...ANIMAL_PAIRS].sort(() => Math.random() - 0.5).slice(0, pairCount);
        const deck: DeckCard[] = [];
        shuffled.forEach((pair) => {
            deck.push({ uniqueId: `${pair.id}-parent`, pairId: pair.id, content: pair.parent });
            deck.push({ uniqueId: `${pair.id}-child`, pairId: pair.id, content: pair.child });
        });
        return deck.sort(() => Math.random() - 0.5);
    },
    renderCard: (card: DeckCard) => (
        <span style={{ fontSize: 'inherit' }}>{card.content}</span>
    ),
};

const CocokkanIndukAnak: React.FC = () => <PairMatchingGame config={config} />;

export default CocokkanIndukAnak;
