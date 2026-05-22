import React, { useState, useCallback } from 'react';
import CatchGame, { type CatchItem } from '../../components/games/CatchGame';
import styles from '../../components/games/CatchGame.module.css';
import { shuffleArray } from '../../utils/helpers';
import { type WordEntry, POOL_1, POOL_2, POOL_3, POOL_4, POOL_5 } from '../../data/membacaWordPools';

const ROUND_POOL_MAP: { pool: WordEntry[]; allPools: WordEntry[][] }[] = [
    { pool: POOL_1, allPools: [POOL_1] },
    { pool: POOL_1, allPools: [POOL_1] },
    { pool: POOL_2, allPools: [POOL_2, POOL_1] },
    { pool: POOL_2, allPools: [POOL_2, POOL_1] },
    { pool: POOL_3, allPools: [POOL_3, POOL_1, POOL_2] },
    { pool: POOL_3, allPools: [POOL_3, POOL_1, POOL_2] },
    { pool: POOL_4, allPools: [POOL_4, POOL_2, POOL_1] },
    { pool: POOL_4, allPools: [POOL_4, POOL_2, POOL_1] },
    { pool: POOL_5, allPools: [POOL_5, POOL_4] },
    { pool: POOL_5, allPools: [POOL_5, POOL_4] },
];

const FISH_EMOJIS = ['🐟', '🐠', '🐬', '🐡', '🦈'];

const PancingKata: React.FC = () => {
    const [usedWords, setUsedWords] = useState<Set<string>>(new Set());

    const buildRound = useCallback((round: number) => {
        const mapEntry = ROUND_POOL_MAP[round - 1];
        const primaryPool = mapEntry.pool;
        const available = primaryPool.filter(w => !usedWords.has(w.word));
        const candidates = available.length > 0 ? available : primaryPool;

        const correctWord = shuffleArray([...candidates])[0];
        
        // Use a functional state update to ensure latest state is captured if multiple updates happen
        setUsedWords(prev => new Set(prev).add(correctWord.word));

        // Get distractors
        const allPossible = mapEntry.allPools.flat().filter(w => w.word !== correctWord.word);
        const distractors = shuffleArray([...allPossible]).slice(0, 4);

        const allWords = shuffleArray([correctWord, ...distractors]);
        
        // Randomly pick a fish emoji for each item here or inside the render
        // Actually, CatchGame handles creating instances, but we pass data.
        
        const targetItem: CatchItem = {
            id: correctWord.word,
            data: { ...correctWord, fishEmoji: shuffleArray([...FISH_EMOJIS])[0] }
        };
        
        const allItems: CatchItem[] = allWords.map(w => ({
            id: w.word,
            data: { ...w, fishEmoji: shuffleArray([...FISH_EMOJIS])[0] }
        }));

        return { target: targetItem, allItems };
    }, [usedWords]);

    const handleRestart = useCallback(() => {
        setUsedWords(new Set());
    }, []);

    return (
        <CatchGame
            title="Pancing Kata! 🎣"
            subtitle="Tangkap ikan yang membawa kata yang benar"
            themeColor="var(--cat-cyan)"
            menuLink="/membaca"
            totalRounds={10}
            winMessage="Kamu berhasil menangkap semua ikan kata!"
            loseMessage="Jangan menyerah, ayo coba pancing lagi!"
            buildRound={buildRound}
            onRestart={handleRestart}
            getSpeechText={(target) => `Tangkaplah ikan dengan kata ${target.data.word}!`}
            renderInstruction={(target) => (
                <div className={styles.instructionArea}>
                    <h2 className={styles.instructionText} style={{ marginBottom: '20px' }}>Tangkaplah Ikan dengan kata:</h2>
                    <div className={styles.targetEmojiWrapper}>
                        <span className={styles.targetEmoji}>{target.data.emoji}</span>
                    </div>
                </div>
            )}
            renderFishContent={(item) => (
                <>
                    <span className={styles.fishEmoji}>{item.data.fishEmoji}</span>
                    <span className={styles.fishLabel}>{item.data.word}</span>
                </>
            )}
        />
    );
};

export default PancingKata;
