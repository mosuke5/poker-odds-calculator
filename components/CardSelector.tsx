import { useState } from 'react';
import styles from './CardSelector.module.css';

interface CardSelectorProps {
  title: string;
  maxCards: number;
  selectedCards: string[];
  onSelect: (cards: string[]) => void;
}

const CardSelector: React.FC<CardSelectorProps> = ({
  title,
  maxCards,
  selectedCards,
  onSelect
}) => {
  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const cards = ranks.flatMap(rank => suits.map(suit => ({ rank, suit })));

  const handleCardClick = (card: string) => {
    if (selectedCards.includes(card)) {
      onSelect(selectedCards.filter(c => c !== card));
    } else if (selectedCards.length < maxCards) {
      onSelect([...selectedCards, card]);
    }
  };

  const getCardDisplay = (rank: string, suit: string) => {
    let suitColor;
    if (suit === '♥') {
      suitColor = styles.red;
    } else if (suit === '♦') {
      suitColor = styles.blue;
    } else if (suit === '♣') {
      suitColor = styles.green;
    } else {
      suitColor = styles.black;
    }
    return (
      <div className={`${styles.card} ${suitColor}`}>
        <div className={styles.top}>
          <span className={styles.rank}>{rank}</span>
          <span className={styles.suit} style={{ fontSize: '1.2rem' }}>{suit}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.cardGrid}>
        {ranks.map(rank => (
          <div key={rank} className={styles.numberRow}>
            {suits.map(suit => {
              const card = `${rank}${suit}`;
              const isSelected = selectedCards.includes(card);
              return (
                <button
                  key={card}
                  className={`${styles.cardButton} ${isSelected ? styles.selected : ''}`}
                  onClick={() => handleCardClick(card)}
                  disabled={!isSelected && selectedCards.length >= maxCards}
                >
                  {getCardDisplay(rank, suit)}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardSelector;
