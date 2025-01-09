import { NextResponse } from 'next/server';

// カードの強さを評価する関数
type CardValue = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

const evaluateHand = (cards: string[]) => {
  // カードのランクを数値に変換
  const rankCounts: Record<string, number> = {};
  const suits: Record<string, number> = {};
  
  cards.forEach(card => {
    const [rank, suit] = [card.slice(0, -1), card.slice(-1)];
    rankCounts[rank] = (rankCounts[rank] || 0) + 1;
    suits[suit] = (suits[suit] || 0) + 1;
  });

  // 役の判定
  const counts = Object.values(rankCounts);
  const isFlush = Object.values(suits).some(count => count >= 5);
  const isStraight = checkStraight(Object.keys(rankCounts));
  
  if (isFlush && isStraight) return 'ストレートフラッシュ';
  if (counts.includes(4)) return 'フォーカード';
  if (counts.includes(3) && counts.includes(2)) return 'フルハウス';
  if (isFlush) return 'フラッシュ';
  if (isStraight) return 'ストレート';
  if (counts.includes(3)) return 'スリーカード';
  if (counts.filter(c => c === 2).length >= 2) return 'ツーペア';
  if (counts.includes(2)) return 'ワンペア';
  return 'ハイカード';
};

const checkStraight = (ranks: string[]): boolean => {
  const rankOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const uniqueRanks = [...new Set(ranks)].sort((a, b) => 
    rankOrder.indexOf(a) - rankOrder.indexOf(b)
  );
  
  // ストレート判定
  let consecutive = 1;
  for (let i = 1; i < uniqueRanks.length; i++) {
    if (rankOrder.indexOf(uniqueRanks[i]) === rankOrder.indexOf(uniqueRanks[i-1]) + 1) {
      consecutive++;
      if (consecutive >= 5) return true;
    } else {
      consecutive = 1;
    }
  }
  
  // A-2-3-4-5の特殊ケース
  if (uniqueRanks.includes('2') && uniqueRanks.includes('3') && 
      uniqueRanks.includes('4') && uniqueRanks.includes('5') && 
      uniqueRanks.includes('A')) {
    return true;
  }
  
  return false;
};

// デッキを作成する関数
const createDeck = () => {
  const suits = ['S', 'H', 'D', 'C'];
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const deck = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push(`${rank}${suit}`);
    }
  }
  return deck;
};

// 配列をシャッフルする関数
const shuffle = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export async function POST(request: Request) {
  const { handCards, flopCards } = await request.json();
  
  // モンテカルロシミュレーションによる勝率計算
  const simulate = (hand: string[], flop: string[], iterations = 10000) => {
    const deck = createDeck();
    const usedCards = new Set([...hand, ...flop]);
    const availableCards = deck.filter(card => !usedCards.has(card));
    
    const handCounts: Record<string, number> = {
      'ストレートフラッシュ': 0,
      'フォーカード': 0,
      'フルハウス': 0,
      'フラッシュ': 0,
      'ストレート': 0,
      'スリーカード': 0,
      'ツーペア': 0,
      'ワンペア': 0,
      'ハイカード': 0
    };

    let winCount = 0;
    let tieCount = 0;
    let loseCount = 0;

    for (let i = 0; i < iterations; i++) {
      const shuffled = shuffle([...availableCards]);
      const turn = shuffled[0];
      const river = shuffled[1];
      const opponentHand = shuffled.slice(2, 4);
      
      const myHand = [...hand, ...flop, turn, river];
      const oppHand = [...opponentHand, ...flop, turn, river];
      
      const myBest = evaluateHand(myHand);
      const oppBest = evaluateHand(oppHand);
      
      handCounts[myBest]++;
      
      if (myBest > oppBest) winCount++;
      else if (myBest === oppBest) tieCount++;
      else loseCount++;
    }

    const handProbabilities = Object.fromEntries(
      Object.entries(handCounts).map(([hand, count]) => [
        hand,
        count / iterations
      ])
    );

    return {
      win: winCount / iterations,
      tie: tieCount / iterations,
      lose: loseCount / iterations,
      handProbabilities
    };
  };

  const odds = simulate(handCards, flopCards);

  return NextResponse.json(odds);
}
