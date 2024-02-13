import { readFileLines } from '../utils.js';

class Card {
  winningNumbers: number[];
  numbers: number[];

  constructor(winningNumbers: number[], numbers: number[]) {
    this.winningNumbers = winningNumbers;
    this.numbers = numbers;
  }

  getWorth(): number {
    const c = this.countWinningNumbers();
    if (c === 0) {
      return 0;
    }
    return 2 ** (c - 1);
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
  // const inputPath = process.cwd() + '/src/day4/test-input.txt'; // 13 30
  const inputPath = process.cwd() + '/src/day4/input.txt'; // 23673 12263631

  const l = readFileLines(inputPath);
  const c = toCards(l);

  console.time('partOne');
  const s = sumCardWorths(c);
  console.log(s);
  console.timeEnd('partOne');

  console.time('partTwo');
  const s2 = sumCardInstances(c);
  console.log(s2);
  console.timeEnd('partTwo');
}

function toCards(lines: string[]): Card[] {
  const cards: Card[] = [];
  for (const l of lines) {
    const [swn, sn] = l.split(':')[1].split('|');
    const wn: number[] = [];
    for (const s of swn.trim().split(' ')) {
      if (s !== '') {
        wn.push(Number(s));
      }
    }
    const n: number[] = [];
    for (const s of sn.trimStart().split(' ')) {
      if (s !== '') {
        n.push(Number(s));
      }
    }
    cards.push(new Card(wn, n));
  }
  return cards;
}

function sumCardWorths(cards: Card[]): number {
  let sum = 0;
  for (const c of cards) {
    sum += c.getWorth();
  }
  return sum;
}

function sumCardInstances(cards: Card[]): number {
  const copiesArr: number[] = [];
  let sum = 0;
  for (const c of cards) {
    const instances = 1 + (copiesArr.shift() ?? 0);
    const count = c.countWinningNumbers();
    for (let i = 0; i < count; i++) {
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
