import { readFileLines } from '../utils.js';

class Card {
  constructor(
    public readonly winningNumbers: readonly number[],
    public readonly numbers: readonly number[]
  ) {}

  getWorth(): number {
    const wnCount = this.getWinningNumberCount();
    return wnCount > 0 ? Math.pow(2, wnCount - 1) : 0;
  }

  getWinningNumberCount(): number {
    return this.numbers.filter((n) =>
      this.winningNumbers.some((wn) => wn === n)
    ).length;
  }
}

main();

function main() {
  // const filePath = process.cwd() + '/src/day4/test-input.txt'; // 13 30
  const filePath = process.cwd() + '/src/day4/input.txt'; // 23673 12263631

  const lines = readFileLines(filePath);
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

function getCards(lines: readonly string[]): readonly Card[] {
  return lines.map((line) => {
    const [wnStr, nStr] = line.split(':')[1].split('|');
    const wn = wnStr
      .trim()
      .split(' ')
      .map((s) => parseInt(s));
    const n = nStr
      .trimStart()
      .split(' ')
      .map((s) => parseInt(s));
    return new Card(wn, n);
  });
}

function partOne(cards: readonly Card[]): number {
  return cards.reduce((s, card) => s + card.getWorth(), 0);
}

function partTwo(cards: readonly Card[]): number {
  const [sum] = cards
    .map((card) => card.getWinningNumberCount())
    .reduce(
      ([sum, arr], wnCount) => {
        const instances = 1 + (arr[0] ?? 0);
        const nextArr: number[] = new Array(Math.max(wnCount, arr.length - 1))
          .fill(0)
          .map((_, i) => {
            if (i < wnCount) {
              return instances + (arr[i + 1] ?? 0);
            } else {
              return arr[i + 1];
            }
          });
        return [sum + instances, nextArr];
      },
      [0, []] as [number, number[]]
    );
  return sum;
}
