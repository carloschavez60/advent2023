import { readFileLines } from '../utils.js';

class Card {
  winningNumbers: number[];
  numbers: number[];

  constructor(winningNumbers: number[], numbers: number[]) {
    this.winningNumbers = winningNumbers;
    this.numbers = numbers;
  }

  getWorth(): number {
    const wnCount = this.countWinningNumbers();
    if (wnCount === 0) {
      return 0;
    }
    return 2 ** (wnCount - 1);
  }

  countWinningNumbers(): number {
    let count = 0;
    for (const n of this.numbers) {
      for (const wn of this.winningNumbers) {
        if (n === wn) {
          count++;
        }
      }
    }
    return count;
  }
}

main();

function main() {
  // const filePath = process.cwd() + '/src/day4/test-input.txt'; // 13 30
  const filePath = process.cwd() + '/src/day4/input.txt'; // 23673 12263631

  const lines = readFileLines(filePath);
  const cards = convertToCards(lines);

  console.time('partOne');
  const pileWorth = sumCardWorths(cards);
  console.log(pileWorth);
  console.timeEnd('partOne');

  console.time('partTwo');
  const totalCards = sumCardInstances(cards);
  console.log(totalCards);
  console.timeEnd('partTwo');
}

function convertToCards(lines: string[]): Card[] {
  const cards: Card[] = [];
  for (const line of lines) {
    const [swn, sn] = line.split(':')[1].split('|');
    const wn: number[] = [];
    for (const s of swn.trim().split(' ')) {
      wn.push(parseInt(s));
    }
    const n: number[] = [];
    for (const s of sn.trimStart().split(' ')) {
      n.push(parseInt(s));
    }
    cards.push(new Card(wn, n));
  }
  return cards;
}

function sumCardWorths(cards: Card[]): number {
  let sum = 0;
  for (const card of cards) {
    sum += card.getWorth();
  }
  return sum;
}

function sumCardInstances(cards: Card[]): number {
  const copiesArr: number[] = [];
  let sum = 0;
  for (const card of cards) {
    const instances = 1 + (copiesArr.shift() ?? 0);
    const wnCount = card.countWinningNumbers();
    for (let i = 0; i < wnCount; i++) {
      if (i < copiesArr.length) {
        copiesArr[i] += instances;
      } else {
        copiesArr.push(instances);
      }
    }
    sum += instances;
  }
  return sum;
}
