import { readFileLinesWithoutLastLine } from '../utils.js';

class Card {
  constructor(public winningNumbers: number[], public numbers: number[]) {}

  getWorth(): number {
    const wnCount = this.getWinningNumberCount();
    if (wnCount > 0) {
      return Math.pow(2, wnCount - 1);
    }
    return 0;
  }

  getWinningNumberCount(): number {
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
  const filePath = process.cwd() + '/src/day4/test-input.txt'; // 13 30
  // const filePath = process.cwd() + '/src/day4/input.txt'; // 23673 12263631

  const lines = readFileLinesWithoutLastLine(filePath);
  const cards = getCards(lines);

  console.time('partOne');
  const pileWorth = partOne(cards);
  console.log(pileWorth);
  console.timeEnd('partOne');

  console.time('partTwo');
  const totalCards = partTwo(cards);
  console.log(totalCards);
  console.timeEnd('partTwo');
}

function getCards(lines: string[]): Card[] {
  return lines.map((line) => {
    const [swn, sn] = line.split(':')[1].split('|');
    const wn = swn
      .trim()
      .split(' ')
      .map((s) => parseInt(s));
    const n = sn
      .trimStart()
      .split(' ')
      .map((s) => parseInt(s));
    return new Card(wn, n);
  });
}

function partOne(cards: Card[]): number {
  let sum = 0;
  for (const card of cards) {
    sum += card.getWorth();
  }
  return sum;
}

function partTwo(cards: Card[]): number {
  const copiesArr: number[] = [];
  let sum = 0;
  for (const card of cards) {
    const instances = 1 + (copiesArr.shift() ?? 0);
    const wnCount = card.getWinningNumberCount();
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
