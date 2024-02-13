import { readFileLines } from '../utils.js';

class Hand {
  value: string;
  bid: number;
  strength: number;
  strengthWithJokers: number;

  #labelToCardStrength = {
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    T: 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14,
  } as const;
  #labelToCardStrengthWithJokers = {
    J: 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    T: 10,
    Q: 12,
    K: 13,
    A: 14,
  } as const;
  #labels = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'T',
    'Q',
    'K',
    'A',
  ] as const;

  constructor(value: string, bid: number) {
    this.value = value;
    this.bid = bid;
    this.strength = this.#getStrength(
      value,
      this.#getTypeStrength(value),
      this.#labelToCardStrength
    );
    this.strengthWithJokers = this.#getStrength(
      value,
      this.#getTypeStrengthWithJokers(value),
      this.#labelToCardStrengthWithJokers
    );
  }

  #getStrength(
    value: string,
    typeStrength: number,
    labelToCardStrength: { [label: string]: number }
  ): number {
    const labels = value.split('');
    let strength = 0;
    let i = 0;
    while (i < labels.length) {
      strength += 15 ** i * labelToCardStrength[labels.at(-i - 1)!];
      i++;
    }
    strength += 15 ** i * typeStrength;
    return strength;
  }

  #getTypeStrength(value: string): number {
    const digits = value.split('');
    digits.sort();

    if (digits[0] === digits[1]) {
      if (digits[1] === digits[2]) {
        if (digits[2] === digits[3]) {
          if (digits[3] === digits[4]) {
            return 7;
          } else {
            return 6;
          }
        } else {
          if (digits[3] === digits[4]) {
            return 5;
          } else {
            return 4;
          }
        }
      } else {
        if (digits[2] === digits[3]) {
          if (digits[3] === digits[4]) {
            return 5;
          } else {
            return 3;
          }
        } else {
          if (digits[3] === digits[4]) {
            return 3;
          } else {
            return 2;
          }
        }
      }
    } else {
      if (digits[1] === digits[2]) {
        if (digits[2] === digits[3]) {
          if (digits[3] === digits[4]) {
            return 6;
          } else {
            return 4;
          }
        } else {
          if (digits[3] === digits[4]) {
            return 3;
          } else {
            return 2;
          }
        }
      } else {
        if (digits[2] === digits[3]) {
          if (digits[3] === digits[4]) {
            return 4;
          } else {
            return 2;
          }
        } else {
          if (digits[3] === digits[4]) {
            return 2;
          } else {
            return 1;
          }
        }
      }
    }
  }

  #getTypeStrengthWithJokers(value: string): number {
    let max = 0;
    for (const label of this.#labels) {
      const typeStrength = this.#getTypeStrength(value.replaceAll('J', label));
      max = Math.max(typeStrength, max);
    }
    return max;
  }
}

main();

function main() {
  // const inputPath = process.cwd() + '/src/day7/test-input.txt';
  const inputPath = process.cwd() + '/src/day7/input.txt'; // 248569531 250382098

  const l = readFileLines(inputPath);
  const h = toHands(l);

  console.time('partOne');
  h.sort((a, b) => a.strength - b.strength);
  const tw = getTotalWinnings(h);
  console.log(tw);
  console.timeEnd('partOne');

  console.time('partTwo');
  h.sort((a, b) => a.strengthWithJokers - b.strengthWithJokers);
  const tw2 = getTotalWinnings(h);
  console.log(tw2);
  console.timeEnd('partTwo');
}

function toHands(lines: string[]): Hand[] {
  const hands: Hand[] = [];
  for (const l of lines) {
    const [value, sbid] = l.split(' ');
    hands.push(new Hand(value, Number(sbid)));
  }
  return hands;
}

function getTotalWinnings(orderedHands: Hand[]): number {
  let sum = 0;
  let rank = 1;
  for (const h of orderedHands) {
    sum += rank * h.bid;
    rank++;
  }
  return sum;
}
