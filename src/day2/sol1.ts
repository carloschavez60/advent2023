import { readFileSync } from 'node:fs';

const ballCountLimitByBallColor: ReadonlyMap<string, number> = new Map([
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

  isPossible(): boolean {
    for (const ballSet of this.ballSets) {
      for (const [ballColor, ballCount] of ballSet.entries()) {
        const ballCountLimit: number | undefined =
          ballCountLimitByBallColor.get(ballColor);
        if (ballCountLimit === undefined) {
          continue;
        }
        if (ballCount > ballCountLimit) {
          return false;
        }
      }
    }
    return true;
  }

  minBallSetPower(): number {
    let power = 1;
    for (const ballCount of this.#minBallSet().values()) {
      power *= ballCount;
    }
    return power;
  }

  #minBallSet(): Map<string, number> {
    const minBallSet = new Map<string, number>();
    for (const ballSet of this.ballSets) {
      for (const [ballColor, ballCount] of ballSet.entries()) {
        const maxBallCount: number | undefined = minBallSet.get(ballColor);
        if (maxBallCount === undefined) {
          minBallSet.set(ballColor, ballCount);
        } else {
          const newMaxBallCount = Math.max(maxBallCount, ballCount);
          minBallSet.set(ballColor, newMaxBallCount);
        }
      }
    }
    return minBallSet;
  }
}

function day2Part1(filePath: string) {
  const games: Game[] = readGamesFromFile(filePath);

  const part1Result: number = sumPossibleGameIds(games);
  console.log('part 1 result:', part1Result);
}

function readGamesFromFile(filePath: string): Game[] {
  const lines: string[] = readFileLines(filePath);
  const games: Game[] = [];
  for (const line of lines) {
    const game: Game = parseLineToGame(line);
    games.push(game);
  }
  return games;
}

function readFileLines(filePath: string): string[] {
  const lines: string[] = readFileSync(filePath, 'utf8').split('\n');
  if (lines[lines.length - 1] === '') {
    lines.pop();
  }
  return lines;
}

function parseLineToGame(line: string): Game {
  const [idStr, ballSetsStr] = line.split(':');
  const id: string = idStr.split(' ')[1];
  const ballSets: Map<string, number>[] = [];
  for (const ballSetStr of ballSetsStr.split(';')) {
    ballSets.push(getBallSet(ballSetStr));
  }
  return new Game(id, ballSets);
}

function getBallSet(ballSetStr: string): Map<string, number> {
  const ballSet = new Map<string, number>();
  for (const ballSubsetStr of ballSetStr.split(',')) {
    const [ballCountStr, ballColor] = ballSubsetStr.trimStart().split(' ');
    const ballCount: number = parseInt(ballCountStr);
    ballSet.set(ballColor, ballCount);
  }
  return ballSet;
}

function sumPossibleGameIds(games: readonly Game[]): number {
  let sum = 0;
  for (const game of games) {
    if (game.isPossible()) {
      sum += parseInt(game.id);
    }
  }
  return sum;
}

function day2Part2(filePath: string) {
  const games: Game[] = readGamesFromFile(filePath);

  const part2Result: number = sumMinBallSetPowers(games);
  console.log('part 2 result:', part2Result);
}

function sumMinBallSetPowers(games: readonly Game[]): number {
  let sum = 0;
  for (const game of games) {
    sum += game.minBallSetPower();
  }
  return sum;
}

const testFilePath = process.cwd() + '/src/day2/test-input.txt';
const filePath = process.cwd() + '/src/day2/input.txt';

day2Part1(testFilePath); // 8
day2Part2(testFilePath); // 2286

day2Part1(filePath); // 2476
day2Part2(filePath); // 54911
