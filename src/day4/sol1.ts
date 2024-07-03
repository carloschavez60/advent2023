import { readFileSync } from 'node:fs';

class Card {
  readonly winningNumbers: readonly number[];
  readonly numbers: readonly number[];

  constructor(winningNumbers: readonly number[], numbers: readonly number[]) {
    this.winningNumbers = winningNumbers;
    this.numbers = numbers;
  }

  /**
   * Returns 0 if any number is a winning number.
   */
  worth(): number {
    const count = this.countWinningNumbers();
    if (count === 0) {
      return 0;
    }
    return 2 ** (count - 1);
  }

  countWinningNumbers(): number {
    let count = 0;
    for (const num of this.numbers) {
      for (const winningNum of this.winningNumbers) {
        if (num === winningNum) {
          count++;
        }
      }
    }
    return count;
  }
}

function day4Part1(filePath: string) {
  const cards: Card[] = readCardsFromFile(filePath);

  const part1Result: number = sumCardWorths(cards);
  console.log('part 1 result:', part1Result);
}

function readCardsFromFile(filePath: string): Card[] {
  const lines: string[] = readFileLines(filePath);
  const cards: Card[] = [];
  for (const line of lines) {
    const [winningNumbersStr, numbersStr] = line.split(':')[1].split('|');
    const winningNumbers: number[] = [];
    for (const winningNumberStr of winningNumbersStr.trim().split(' ')) {
      if (winningNumberStr !== '') {
        winningNumbers.push(parseInt(winningNumberStr));
      }
    }
    const numbers: number[] = [];
    for (const numberStr of numbersStr.trimStart().split(' ')) {
      if (numberStr !== '') {
        numbers.push(parseInt(numberStr));
      }
    }
    cards.push(new Card(winningNumbers, numbers));
  }
  return cards;
}

function readFileLines(filePath: string): string[] {
  const lines: string[] = readFileSync(filePath, 'utf8').split('\n');
  if (lines[lines.length - 1] === '') {
    lines.pop();
  }
  return lines;
}

function sumCardWorths(cards: readonly Card[]): number {
  let sum = 0;
  for (const card of cards) {
    sum += card.worth();
  }
  return sum;
}

function day4Part2(filePath: string) {
  const cards: Card[] = readCardsFromFile(filePath);

  const part2Result: number = sumCardInstances(cards);
  console.log('part 2 result:', part2Result);
}

function sumCardInstances(cards: readonly Card[]): number {
  const copiesQueue: number[] = [];
  let sum = 0;
  for (const card of cards) {
    let cardCopies: number | undefined = copiesQueue.shift();
    if (cardCopies === undefined) {
      cardCopies = 0; // no copies
    }
    const cardInstances: number = 1 + cardCopies; // original plus copies
    for (let i = 0; i < card.countWinningNumbers(); i++) {
      if (i < copiesQueue.length) {
        copiesQueue[i] += cardInstances;
      } else {
        copiesQueue.push(cardInstances);
      }
    }
    sum += cardInstances;
  }
  return sum;
}

const testFilePath = process.cwd() + '/src/day4/test-input.txt';
const filePath = process.cwd() + '/src/day4/input.txt';

day4Part1(testFilePath); // 13
day4Part2(testFilePath); // 30

day4Part1(filePath); // 23673
day4Part2(filePath); // 12263631
