import { readFileSync } from 'fs';

type HandType =
  | 'five of a kind'
  | 'four of a kind'
  | 'full house'
  | 'three of a kind'
  | 'two pair'
  | 'one pair'
  | 'high card';

class Hand {
  value: string;
  bid: number;
  type: HandType;
  typeWithJokers: HandType;
  strength: number;
  strengthWithJokers: number;

  readonly #decimalDigits: { [digit: string]: number } = Object.freeze({
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

  readonly #decimalDigitsPartTwo: { [digit: string]: number } = Object.freeze({
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
  });

  constructor(value: string, bid: number) {
    this.value = value;
    this.bid = bid;
    this.type = this.#getType(value);
    this.strength = this.#getStrength(value);
    this.typeWithJokers = this.#getTypePartTwo(value);
    this.strengthWithJokers = this.#getStrengthPartTwo(value);
  }

  #getType(value: string): typeof this.type {
    const digits = value.split('');
    digits.sort((a, b) => this.#decimalDigits[a] - this.#decimalDigits[b]);

    if (digits[0] === digits[1]) {
      if (digits[1] === digits[2]) {
        if (digits[2] === digits[3]) {
          if (digits[3] === digits[4]) {
            return 'five of a kind';
          } else {
            return 'four of a kind';
          }
        } else {
          if (digits[3] === digits[4]) {
            return 'full house';
          } else {
            return 'three of a kind';
          }
        }
      } else {
        if (digits[2] === digits[3]) {
          if (digits[3] === digits[4]) {
            return 'full house';
          } else {
            return 'two pair';
          }
        } else {
          if (digits[3] === digits[4]) {
            return 'two pair';
          } else {
            return 'one pair';
          }
        }
      }
    } else {
      if (digits[1] === digits[2]) {
        if (digits[2] === digits[3]) {
          if (digits[3] === digits[4]) {
            return 'four of a kind';
          } else {
            return 'three of a kind';
          }
        } else {
          if (digits[3] === digits[4]) {
            return 'two pair';
          } else {
            return 'one pair';
          }
        }
      } else {
        if (digits[2] === digits[3]) {
          if (digits[3] === digits[4]) {
            return 'three of a kind';
          } else {
            return 'one pair';
          }
        } else {
          if (digits[3] === digits[4]) {
            return 'one pair';
          } else {
            return 'high card';
          }
        }
      }
    }
  }

  #getStrength(value: string): number {
    const digits = value.split('');
    let strength = 0;
    for (let i = 0; i < digits.length; i++) {
      strength += this.#decimalDigits[digits.at(-i - 1)!] * Math.pow(15, i);
    }
    return strength;
  }

  #getTypePartTwo(value: string): typeof this.typeWithJokers {
    const handTypeStrengths: { [handType: string]: number } = Object.freeze({
      'five of a kind': 7,
      'four of a kind': 6,
      'full house': 5,
      'three of a kind': 4,
      'two pair': 3,
      'one pair': 2,
      'high card': 1,
    });

    const handTypeByStrength: {
      [handTypeStrength: number]: string;
    } = {};
    for (const handType in handTypeStrengths) {
      handTypeByStrength[handTypeStrengths[handType]] = handType;
    }

    const cardLabels = [
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
    ];

    let highestHandTypeStrength = 0;
    for (const cardLabel of cardLabels) {
      const newValue = value.replaceAll('J', cardLabel);
      const newType = this.#getType(newValue);
      const handTypeStrength = handTypeStrengths[newType];
      if (handTypeStrength > highestHandTypeStrength) {
        highestHandTypeStrength = handTypeStrength;
      }
    }

    return handTypeByStrength[
      highestHandTypeStrength
    ] as typeof this.typeWithJokers;
  }

  #getStrengthPartTwo(value: string): number {
    const digits = value.split('');
    let strength = 0;
    for (let i = 0; i < digits.length; i++) {
      strength +=
        this.#decimalDigitsPartTwo[digits.at(-i - 1)!] * Math.pow(15, i);
    }
    return strength;
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
  const totalWinnings = getTotalWinnings(hands, 'type', 'strength');
  console.log(totalWinnings);
}

function partTwo(hands: Hand[]) {
  const totalWinnings = getTotalWinnings(
    hands,
    'typeWithJokers',
    'strengthWithJokers'
  );
  console.log(totalWinnings);
}

function getTotalWinnings(
  hands: Hand[],
  handType: 'type' | 'typeWithJokers',
  handStrength: 'strength' | 'strengthWithJokers'
) {
  const handsByType: { [handType: string]: Hand[] } = {
    'five of a kind': [],
    'four of a kind': [],
    'full house': [],
    'three of a kind': [],
    'two pair': [],
    'one pair': [],
    'high card': [],
  };

  for (const hand of hands) {
    handsByType[hand[handType]].push(hand);
  }

  for (const type in handsByType) {
    const hands = handsByType[type];
    hands.sort((a, b) => a[handStrength] - b[handStrength]);
  }

  const orderedHands = [
    ...handsByType['high card'],
    ...handsByType['one pair'],
    ...handsByType['two pair'],
    ...handsByType['three of a kind'],
    ...handsByType['full house'],
    ...handsByType['four of a kind'],
    ...handsByType['five of a kind'],
  ];

  let totalWinnings = 0;
  for (let i = 0; i < orderedHands.length; i++) {
    const hand = orderedHands[i];
    totalWinnings += (i + 1) * hand.bid;
  }
  return totalWinnings;
}
