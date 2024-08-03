import { readFileSync } from 'node:fs';

const ballCountLimitByBallColor: ReadonlyMap<string, number> = new Map([
  ['red', 12],
  ['green', 13],
  ['blue', 14],
]);

type Game = {
  id: string;
  ballSets: Map<string, number>[];
};

function getGameIdAsNumber(game: Game): number {
  return parseInt(game.id);
}

function checkGameIsPossible(game: Game): boolean {
  for (const ballSet of game.ballSets) {
    for (const [ballColor, ballCount] of ballSet.entries()) {
      const ballCountLimit = ballCountLimitByBallColor.get(ballColor);
      if (ballCountLimit !== undefined && ballCount > ballCountLimit) {
        return false;
      }
    }
  }
  return true;
}

function getMinBallSetPower(game: Game): number {
  const minBallSet = getMinBallSet(game);
  let power = 1;
  for (const ballCount of minBallSet.values()) {
    power *= ballCount;
  }
  return power;
}

function getMinBallSet(game: Game): Map<string, number> {
  const minBallSet = new Map<string, number>();
  for (const ballSet of game.ballSets) {
    for (const [ballColor, ballCount] of ballSet.entries()) {
      const maxBallCount = minBallSet.get(ballColor);
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

function readGamesFromFile(filePath: string): Game[] {
  const lines = readFileLines(filePath);
  const games: Game[] = [];
  for (const line of lines) {
    const game = parseLineToGame(line);
    games.push(game);
  }
  return games;
}

function readFileLines(filePath: string): string[] {
  const lines = readFileSync(filePath, 'utf8').split('\n');
  if (lines[lines.length - 1] === '') {
    lines.pop();
  }
  return lines;
}

function parseLineToGame(line: string): Game {
  const [idStr, ballSetsStr] = line.split(':');
  const id = idStr.split(' ')[1];
  const ballSets: Map<string, number>[] = [];
  for (const ballSetStr of ballSetsStr.split(';')) {
    ballSets.push(parseStrToBallSet(ballSetStr));
  }
  return { id, ballSets };
}

function parseStrToBallSet(ballSetStr: string): Map<string, number> {
  const ballSet = new Map<string, number>();
  for (const ballSubsetStr of ballSetStr.split(',')) {
    const [ballCountStr, ballColor] = ballSubsetStr.trimStart().split(' ');
    const ballCount = parseInt(ballCountStr);
    ballSet.set(ballColor, ballCount);
  }
  return ballSet;
}

function day2Part1(filePath: string): number {
  const games = readGamesFromFile(filePath);
  return sumPossibleGameIds(games);
}

function sumPossibleGameIds(games: Game[]): number {
  let sum = 0;
  for (const game of games) {
    const gameIsPossible = checkGameIsPossible(game);
    if (gameIsPossible) {
      sum += getGameIdAsNumber(game);
    }
  }
  return sum;
}

function day2Part2(filePath: string): number {
  const games = readGamesFromFile(filePath);
  return sumMinBallSetPowers(games);
}

function sumMinBallSetPowers(games: Game[]): number {
  let sum = 0;
  for (const game of games) {
    sum += getMinBallSetPower(game);
  }
  return sum;
}

const testFilePath = process.cwd() + '/src/day2/test-input.txt';
const filePath = process.cwd() + '/src/day2/input.txt';

console.log(`Part 1 test result: ${day2Part1(testFilePath)}`); // 8
console.log(`Part 2 test result: ${day2Part2(testFilePath)}`); // 2286

console.log(`Part 1 result: ${day2Part1(filePath)}`); // 2476
console.log(`Part 2 result: ${day2Part2(filePath)}`); // 54911
