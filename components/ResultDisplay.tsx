import styles from './ResultDisplay.module.css';
import { Tooltip } from './Tooltip';

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

const handDescriptions: Record<string, string> = {
  'ロイヤルストレートフラッシュ': 'A, K, Q, J, 10 のストレートで同じスート',
  'ストレートフラッシュ': '5枚の連続した数字で同じスート',
  'フォーカード': '同じ数字のカード4枚',
  'フルハウス': 'スリーカードとワンペアの組み合わせ',
  'フラッシュ': '同じスートのカード5枚',
  'ストレート': '5枚の連続した数字',
  'スリーカード': '同じ数字のカード3枚',
  'ツーペア': '同じ数字のカード2組',
  'ワンペア': '同じ数字のカード2枚',
  'ハイカード': '役がない場合の最も強いカード'
};

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
      <table className={styles.probabilityTable}>
        <thead>
          <tr>
            <th>役</th>
            <th>確率</th>
            <th>説明</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(handProbabilities).map(([hand, probability]) => (
            <tr key={hand} className={styles.probabilityRow}>
              <td>{hand}</td>
              <td>{formatPercentage(probability)}</td>
              <td>
                <Tooltip content={handDescriptions[hand] || '説明なし'}>
                  <span className={styles.infoIcon}>ℹ️</span>
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultDisplay;
