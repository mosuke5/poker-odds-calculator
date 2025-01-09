import styles from './ResultDisplay.module.css';

interface ResultDisplayProps {
  winRate: number;
  tieRate: number;
  loseRate: number;
  handProbabilities: Record<string, number>;
  selectedCards: {
    hand: string[];
    flop: string[];
  };
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  winRate,
  tieRate,
  loseRate,
  handProbabilities,
  selectedCards
}) => {
  const formatPercentage = (value: number) => `${(value * 100).toFixed(2)}%`;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>勝率分析</h3>
      
      <div className={styles.selectedCards}>
        <div className={styles.cardGroup}>
          <span className={styles.cardLabel}>手持ちのカード:</span>
          {selectedCards.hand.map(card => (
            <span key={card} className={styles.card}>
              {card}
            </span>
          ))}
        </div>
        <div className={styles.cardGroup}>
          <span className={styles.cardLabel}>フロップのカード:</span>
          {selectedCards.flop.map(card => (
            <span key={card} className={styles.card}>
              {card}
            </span>
          ))}
        </div>
      </div>
      
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span className={styles.label}>勝率</span>
          <span className={styles.value}>{formatPercentage(winRate)}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.label}>引き分け率</span>
          <span className={styles.value}>{formatPercentage(tieRate)}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.label}>負け率</span>
          <span className={styles.value}>{formatPercentage(loseRate)}</span>
        </div>
      </div>

      <h4 className={styles.subtitle}>役の出現確率</h4>
      <div className={styles.handProbabilities}>
        {Object.entries(handProbabilities).map(([hand, probability]) => (
          <div key={hand} className={styles.probabilityItem}>
            <span className={styles.handName}>{hand}</span>
            <span className={styles.probabilityValue}>
              {formatPercentage(probability)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultDisplay;
