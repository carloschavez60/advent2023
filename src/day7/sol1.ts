import { readFileSync } from 'fs';

class Hand {
  value: string;
  bid: number;
  strength: number;
  strengthWithJokers: number;

  constructor(value: string, bid: number) {
    this.value = value;
    this.bid = bid;
    this.strength = this.#getStrength(value, this.#getTypeStrength(value), {
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
    });
    this.strengthWithJokers = this.#getStrength(
      value,
      this.#getTypeStrengthWithJokers(value),
      {
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
      }
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
    const labels = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A'];

    let highestTypeStrength = 0;
    for (const label of labels) {
      const newValue = value.replaceAll('J', label);

      const typeStrength = this.#getTypeStrength(newValue);
      if (typeStrength > highestTypeStrength) {
        highestTypeStrength = typeStrength;
      }
    }

    return highestTypeStrength;
  }
}

// const filePath = process.cwd() + '/src/day7/test-input.txt';
const filePath = process.cwd() + '/src/day7/input.txt'; // 248569531 250382098

const hands = getHands(filePath);

console.time('partOne');
partOne(hands);
console.timeEnd('partOne');

console.time('partTwo');
partTwo(hands);
console.timeEnd('partTwo');

function getHands(filePath: string): Hand[] {
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

function partOne(hands: Hand[]) {
  const orderedHands = [...hands];
  orderedHands.sort((a, b) => a.strength - b.strength);
  console.log(getTotalWinnings(orderedHands));
}

function partTwo(hands: Hand[]) {
  const orderedHands = [...hands];
  orderedHands.sort((a, b) => a.strengthWithJokers - b.strengthWithJokers);
  console.log(getTotalWinnings(orderedHands));
}

function getTotalWinnings(orderedHands: Hand[]): number {
  let totalWinnings = 0;
  for (let i = 0; i < orderedHands.length; i++) {
    const hand = orderedHands[i];
    totalWinnings += (i + 1) * hand.bid;
  }
  return totalWinnings;
}
