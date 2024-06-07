import { readFileSync } from 'node:fs';

const ballCountLimits: ReadonlyMap<string, number> = new Map([
  ['red', 12],
  ['green', 13],
  ['blue', 14],
]);

class Game {
  readonly id: string;
  readonly ballSets: ReadonlyMap<string, number>[];

  constructor(id: string, ballSets: ReadonlyMap<string, number>[]) {
    this.id = id;
    this.ballSets = ballSets;
  }

  get isPossible(): boolean {
    for (const ballSet of this.ballSets) {
      for (const [color, ballCount] of ballSet.entries()) {
        const ballCountLimit: number | undefined = ballCountLimits.get(color);
        if (ballCountLimit !== undefined) {
          if (!(ballCount <= ballCountLimit)) {
            return false;
          }
        }
      }
    }
    return true;
  }

  get minBallSetPower(): number {
    let power = 1;
    for (const ballCount of this.#minBallSet.values()) {
      power *= ballCount;
    }
    return power;
  }

  get #minBallSet(): Map<string, number> {
    const minBallSet = new Map<string, number>();
    for (const ballSet of this.ballSets) {
      for (const [color, ballCount] of ballSet.entries()) {
        const maxBallCount: number = minBallSet.get(color) ?? 0;
        const newMaxBallCount = Math.max(ballCount, maxBallCount);
        minBallSet.set(color, newMaxBallCount);
      }
    }
    return minBallSet;
  }
}

main();

function main() {
  const testFilePath = process.cwd() + '/src/day2/test-input.txt'; // 8 2286
  const filePath = process.cwd() + '/src/day2/input.txt'; // 2476 54911

  day2(testFilePath);
  day2(filePath);
}

function day2(filePath: string) {
  console.time('day2');

  const games: Game[] = readGames(filePath);

  const part1Result: number = sumPossibleGameIds(games);
  console.log('part 1 result: ', part1Result);

  const part2Result: number = sumMinBallSetPowers(games);
  console.log('part 2 result: ', part2Result);

  console.timeEnd('day2');
}

function readGames(filePath: string): Game[] {
  const lines: string[] = readFileLines(filePath);
  const games: Game[] = [];
  for (const line of lines) {
    const game: Game = parse(line);
    games.push(game);
  }
  return games;
}

function readFileLines(path: string): string[] {
  const lines: string[] = readFileSync(path, 'utf8').split('\n');
  if (lines.at(-1) === '') {
    lines.pop();
  }
  return lines;
}

function parse(line: string): Game {
  const [idStr, ballSetsStr] = line.split(':');
  const id = idStr.split(' ')[1];
  const ballSets: Map<string, number>[] = [];
  for (const ballSetStr of ballSetsStr.split(';')) {
    ballSets.push(getBallSet(ballSetStr));
  }
  return new Game(id, ballSets);
}

function getBallSet(ballSetStr: string): Map<string, number> {
  const ballSet = new Map<string, number>();
  for (const ballSubsetStr of ballSetStr.split(',')) {
    const [ballCountStr, color] = ballSubsetStr.trimStart().split(' ');
    const ballCount: number = parseInt(ballCountStr);
    ballSet.set(color, ballCount);
  }
  return ballSet;
}

function sumPossibleGameIds(games: readonly Game[]): number {
  let sum = 0;
  for (const game of games) {
    if (game.isPossible) {
      sum += parseInt(game.id);
    }
  }
  return sum;
}

function sumMinBallSetPowers(games: readonly Game[]): number {
  let sum = 0;
  for (const game of games) {
    sum += game.minBallSetPower;
  }
  return sum;
}
