import { getLines } from '../utils.js';

class Card {
  constructor(
    public readonly winningNumbers: readonly number[],
    public readonly numbers: readonly number[]
  ) {}
}

main();

function main() {
  // const filePath = process.cwd() + '/src/day4/test-input.txt'; // 13 30
  const filePath = process.cwd() + '/src/day4/input.txt'; // 23673 12263631

  const lines = getLines(filePath);
  const cards = getCards(lines);

  console.time('partOne');
  const pileWorth = partOne(cards);
  console.log(pileWorth);
  console.timeEnd('partOne');

  console.time('partTwo');
  // const totalCards = partTwo(cards);
  // console.log(totalCards);
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
  return cards.reduce((s, card) => s + getWorth(card), 0);
}

function getWorth(card: Card): number {
  const wnCount = card.numbers.filter((n) =>
    card.winningNumbers.some((wn) => wn === n)
  ).length;
  return wnCount > 0 ? Math.pow(2, wnCount - 1) : 0;
}

function partTwo(cards: readonly Card[]): number {
  return 0;
  // const copiesArr: number[] = [];
  // let totalCards = 0;
  // for (const line of lines) {
  //   const copies = copiesArr.shift() ?? 0;
  //   const instances = 1 + copies;
  //   totalCards += instances;
  //   const myWinNumsCount = getMyWinNumsCount(line);
  //   for (let i = 0; i < myWinNumsCount; i++) {
  //     if (copiesArr[i] !== undefined) {
  //       copiesArr[i] += instances;
  //     } else {
  //       copiesArr.push(instances);
  //     }
  //   }
  //   // console.log(copiesArr);
  // }
  // console.log(totalCards);
}

function getMyWinNumsCount(line: string) {
  const [_, nums] = line.split(':');
  const [wStr, myStr] = nums.split('|');
  const winNums = toNumArray(wStr);
  const myNums = toNumArray(myStr);

  let myWinNumCount = 0;
  for (const myNum of myNums) {
    for (const winNum of winNums) {
      if (myNum === winNum) {
        myWinNumCount++;
      }
    }
  }
  return myWinNumCount;
}

function toNumArray(str: string) {
  return str
    .split(' ')
    .filter((elem) => elem !== '')
    .map((str) => parseInt(str));
}
