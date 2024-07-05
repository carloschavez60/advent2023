import { readFileSync } from 'node:fs';

class Hand {
  value: string;
  bid: number;

  #hexDigitByLabel: ReadonlyMap<string, string> = new Map([
    ['2', '2'],
    ['3', '3'],
    ['4', '4'],
    ['5', '5'],
    ['6', '6'],
    ['7', '7'],
    ['8', '8'],
    ['9', '9'],
    ['T', 'A'],
    ['J', 'B'],
    ['Q', 'C'],
    ['K', 'D'],
    ['A', 'E'],
  ]);
  #hexDigitByLabelWithJokers: ReadonlyMap<string, string> = new Map([
    ['J', '1'],
    ['2', '2'],
    ['3', '3'],
    ['4', '4'],
    ['5', '5'],
    ['6', '6'],
    ['7', '7'],
    ['8', '8'],
    ['9', '9'],
    ['T', 'A'],
    ['Q', 'C'],
    ['K', 'D'],
    ['A', 'E'],
  ]);
  #noJokerLabels: readonly string[] = [
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

  constructor(value: string, bid: number) {
    this.value = value;
    this.bid = bid;
  }

  strength() {
    return this.#calculateStrength(
      this.#calculateTypeStrength(this.value),
      this.#hexDigitByLabel
    );
  }

  #calculateStrength(
    typeStrength: string,
    hexDigitByLabel: ReadonlyMap<string, string>
  ): number {
    let hex = '';
    for (const label of this.value) {
      hex += hexDigitByLabel.get(label);
    }
    hex = typeStrength + hex;
    return parseInt(hex, 16);
  }

  /**
   * @returns hexDigit
   */
  #calculateTypeStrength(value: string): string {
    const labels: string[] = value.split('');
    labels.sort();
    if (labels[0] === labels[1]) {
      if (labels[1] === labels[2]) {
        if (labels[2] === labels[3]) {
          if (labels[3] === labels[4]) {
            return '8'; // Five of a kind
          } else {
            return '7'; // Four of a kind
          }
        } else {
          if (labels[3] === labels[4]) {
            return '6'; // Full house
          } else {
            return '5'; // Three of a kind
          }
        }
      } else {
        if (labels[2] === labels[3]) {
          if (labels[3] === labels[4]) {
            return '6'; // Full house
          } else {
            return '4'; // Two pair
          }
        } else {
          if (labels[3] === labels[4]) {
            return '4'; // Two pair
          } else {
            return '3'; // One pair
          }
        }
      }
    } else {
      if (labels[1] === labels[2]) {
        if (labels[2] === labels[3]) {
          if (labels[3] === labels[4]) {
            return '7'; // Four of a kind
          } else {
            return '5'; // Three of a kind
          }
        } else {
          if (labels[3] === labels[4]) {
            return '4'; // Two pair
          } else {
            return '3'; // One pair
          }
        }
      } else {
        if (labels[2] === labels[3]) {
          if (labels[3] === labels[4]) {
            return '5'; // Three of a kind
          } else {
            return '3'; // One pair
          }
        } else {
          if (labels[3] === labels[4]) {
            return '3'; // One pair
          } else {
            return '2'; // High card
          }
        }
      }
    }
  }

  strengthWithJokers() {
    return this.#calculateStrength(
      this.#typeStrengthWithJokers(),
      this.#hexDigitByLabelWithJokers
    );
  }

  #typeStrengthWithJokers(): string {
    let max = 0;
    for (const label of this.#noJokerLabels) {
      const typeStrength = this.#calculateTypeStrength(
        this.value.replaceAll('J', label)
      );
      max = Math.max(max, parseInt(typeStrength, 16));
    }
    return String(max);
  }
}

function day7Part1(filePath: string) {
  const hands: Hand[] = readHandsFromFile(filePath);
  hands.sort((a, b) => a.strength() - b.strength());

  const part1Result: number = getTotalWinnings(hands);
  console.log('part 1 result:', part1Result);
}

function readHandsFromFile(filePath: string): Hand[] {
  const lines: string[] = readFileLines(filePath);
  const hands: Hand[] = [];
  for (const l of lines) {
    const [value, sbid] = l.split(' ');
    hands.push(new Hand(value, Number(sbid)));
  }
  return hands;
}

function readFileLines(filePath: string): string[] {
  const lines: string[] = readFileSync(filePath, 'utf8').split('\n');
  if (lines[lines.length - 1] === '') {
    lines.pop();
  }
  return lines;
}

/**
 * Precondition: Hands are ordered by strength.
 */
function getTotalWinnings(orderedHands: Hand[]): number {
  let sum = 0;
  let rank = 1;
  for (const hand of orderedHands) {
    sum += rank * hand.bid;
    rank++;
  }
  return sum;
}

function day7Part2(filePath: string) {
  const hands: Hand[] = readHandsFromFile(filePath);
  hands.sort((a, b) => a.strengthWithJokers() - b.strengthWithJokers());

  const part2Result: number = getTotalWinnings(hands);
  console.log('part 2 result:', part2Result);
}

const testFilePath = process.cwd() + '/src/day7/test-input.txt';
const filePath = process.cwd() + '/src/day7/input.txt';

day7Part1(testFilePath); // 6440
day7Part2(testFilePath); // 5905

day7Part1(filePath); // 248569531
day7Part2(filePath); // 250382098
