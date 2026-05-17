import React from 'react';
import PairMatchingGame, { type DeckCard, type MatchingGameConfig } from './PairMatchingGame';

const SHADOW_ITEMS = [
    { id: 1, emoji: '🍎' },
    { id: 2, emoji: '🚗' },
    { id: 3, emoji: '🐈' },
    { id: 4, emoji: '🐘' },
    { id: 5, emoji: '🦋' },
    { id: 6, emoji: '⚽️' },
    { id: 7, emoji: '🍌' },
    { id: 8, emoji: '🌻' },
    { id: 9, emoji: '🎁' },
    { id: 10, emoji: '🍕' },
    { id: 11, emoji: '🏠' },
    { id: 12, emoji: '🧸' },
];

const config: MatchingGameConfig = {
    title: 'Cocokkan Gambar dengan Bayangannya! 👤',
    subtitle: 'Pasangkan gambar asli dengan bayangannya',
    speechText: 'Cocokkan Gambar dengan Bayangannya!',
    themeColor: 'var(--cat-blue)',
    menuLink: '/mencocokkan',
    roundWinTitle: 'Hebat! 🌟',
    roundWinMessage: 'Bayangan cocok semua!',
    buildDeck: (pairCount: number): DeckCard[] => {
        const shuffled = [...SHADOW_ITEMS].sort(() => Math.random() - 0.5).slice(0, pairCount);
        const deck: DeckCard[] = [];
        shuffled.forEach((item) => {
            deck.push({ uniqueId: `${item.id}-original`, pairId: item.id, content: item.emoji, extra: { isShadow: false } });
            deck.push({ uniqueId: `${item.id}-shadow`, pairId: item.id, content: item.emoji, extra: { isShadow: true } });
        });
        return deck.sort(() => Math.random() - 0.5);
    },
    renderCard: (card: DeckCard) => (
        <span style={{
            fontSize: 'inherit',
            filter: card.extra?.isShadow ? 'brightness(0) drop-shadow(2px 4px 6px rgba(0,0,0,0.5))' : 'none'
        }}>
            {card.content}
        </span>
    ),
};

const CocokkanBayangan: React.FC = () => <PairMatchingGame config={config} />;

export default CocokkanBayangan;
