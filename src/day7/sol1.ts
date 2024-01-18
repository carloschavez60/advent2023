import { readFileSync } from 'fs';

class Hand {
  readonly value: string;
  readonly bid: number;
  readonly strength: number;
  readonly strengthWithJokers: number;

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
      strength += Math.pow(15, i) * labelToCardStrength[labels.at(-i - 1)!];
      i++;
    }
    strength += Math.pow(15, i) * typeStrength;
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
  // const filePath = process.cwd() + '/src/day7/test-input.txt';
  const filePath = process.cwd() + '/src/day7/input.txt'; // 248569531 250382098

  const hands = getHands(filePath);

  console.time('partOne');
  let totalWinnings = partOne(hands);
  console.log(totalWinnings);
  console.timeEnd('partOne');

  console.time('partTwo');
  totalWinnings = partTwo(hands);
  console.log(totalWinnings);
  console.timeEnd('partTwo');
}

function getHands(filePath: string): readonly Hand[] {
  const fileStr = readFileSync(filePath, 'utf8');
  const lines = fileStr.split('\n');
  lines.pop();

  const hands: Hand[] = [];
  for (const line of lines) {
    const [value, bid] = line.split(' ');
    hands.push(new Hand(value, +bid));
  }
  return hands;
}

function partOne(hands: readonly Hand[]): number {
  const orderedHands = [...hands];
  orderedHands.sort((a, b) => a.strength - b.strength);
  return getTotalWinnings(orderedHands);
}

function partTwo(hands: readonly Hand[]): number {
  const orderedHands = [...hands];
  orderedHands.sort((a, b) => a.strengthWithJokers - b.strengthWithJokers);
  return getTotalWinnings(orderedHands);
}

function getTotalWinnings(orderedHands: readonly Hand[]): number {
  let sum = 0;
  for (let i = 0; i < orderedHands.length; i++) {
    const hand = orderedHands[i];
    sum += (i + 1) * hand.bid;
  }
  return sum;
}
