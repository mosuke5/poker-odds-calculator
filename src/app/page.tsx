'use client';

import { useState } from 'react';
import CardSelector from '../../components/CardSelector';
import ResultDisplay from '../../components/ResultDisplay';
import styles from './page.module.css';

export default function HomePage() {
  const [handCards, setHandCards] = useState<string[]>([]);
  const [flopCards, setFlopCards] = useState<string[]>([]);
  const [results, setResults] = useState<{
    win: number;
    tie: number;
    lose: number;
    handProbabilities: Record<string, number>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculateOdds = async () => {
    if (handCards.length < 2 || flopCards.length < 3) {
      alert('カードを選択してください');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          handCards,
          flopCards
        }),
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('計算エラー:', error);
      alert('計算中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ポーカー勝率計算</h1>
      <div className={styles.cardSelectors}>
        <CardSelector 
          title="手持ちのカード"
          maxCards={2}
          selectedCards={handCards}
          onSelect={setHandCards}
        />
        <CardSelector 
          title="フロップのカード" 
          maxCards={3}
          selectedCards={flopCards}
          onSelect={setFlopCards}
        />
      </div>

      <button 
        className={styles.calculateButton}
        onClick={calculateOdds}
        disabled={isLoading}
      >
        {isLoading ? '計算中...' : '勝率を計算'}
      </button>

      {results && (
        <ResultDisplay
          winRate={results.win}
          tieRate={results.tie}
          loseRate={results.lose}
          handProbabilities={results.handProbabilities}
          selectedCards={{
            hand: handCards,
            flop: flopCards
          }}
        />
      )}
    </div>
  );
}
