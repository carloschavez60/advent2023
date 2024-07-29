import { readFileSync } from 'node:fs';

const ballCountLimitByBallColor: ReadonlyMap<string, number> = new Map([
  ['red', 12],
  ['green', 13],
  ['blue', 14],
]);

class Game {
  id: string;
  ballSets: Map<string, number>[];

  constructor(id: string, ballSets: Map<string, number>[]) {
    this.id = id;
    this.ballSets = ballSets;
  }
}

function day2Part1(filePath: string) {
  let games = readGamesFromFile(filePath);
  let part1Result = sumPossibleGameIds(games);
  console.log('part 1 result:', part1Result);
}

function readGamesFromFile(filePath: string): Game[] {
  let lines = readFileLines(filePath);
  let games: Game[] = [];
  for (let line of lines) {
    let game = parseLineToGame(line);
    games.push(game);
  }
  return games;
}

function readFileLines(filePath: string): string[] {
  let lines = readFileSync(filePath, 'utf8').split('\n');
  if (lines[lines.length - 1] === '') {
    lines.pop();
  }
  return lines;
}

function parseLineToGame(line: string): Game {
  let [idStr, ballSetsStr] = line.split(':');
  let id = idStr.split(' ')[1];
  let ballSets: Map<string, number>[] = [];
  for (let ballSetStr of ballSetsStr.split(';')) {
    ballSets.push(getBallSet(ballSetStr));
  }
  return new Game(id, ballSets);
}

function getBallSet(ballSetStr: string): Map<string, number> {
  let ballSet = new Map<string, number>();
  for (let ballSubsetStr of ballSetStr.split(',')) {
    let [ballCountStr, ballColor] = ballSubsetStr.trimStart().split(' ');
    let ballCount = parseInt(ballCountStr);
    ballSet.set(ballColor, ballCount);
  }
  return ballSet;
}

function sumPossibleGameIds(games: Game[]): number {
  let sum = 0;
  for (let game of games) {
    if (isPossible(game)) {
      sum += parseInt(game.id);
    }
  }
  return sum;
}

function isPossible(game: Game): boolean {
  for (let ballSet of game.ballSets) {
    for (let [ballColor, ballCount] of ballSet.entries()) {
      let ballCountLimit = ballCountLimitByBallColor.get(ballColor);
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

function day2Part2(filePath: string) {
  let games = readGamesFromFile(filePath);
  let part2Result = sumMinBallSetPowers(games);
  console.log('part 2 result:', part2Result);
}

function sumMinBallSetPowers(games: Game[]): number {
  let sum = 0;
  for (let game of games) {
    sum += getMinBallSetPower(game);
  }
  return sum;
}

function getMinBallSetPower(game: Game): number {
  let minBallSet = getMinBallSet(game);
  let power = 1;
  for (let ballCount of minBallSet.values()) {
    power *= ballCount;
  }
  return power;
}

function getMinBallSet(game: Game): Map<string, number> {
  let minBallSet = new Map<string, number>();
  for (let ballSet of game.ballSets) {
    for (let [ballColor, ballCount] of ballSet.entries()) {
      let maxBallCount = minBallSet.get(ballColor);
      if (maxBallCount === undefined) {
        minBallSet.set(ballColor, ballCount);
      } else {
        let newMaxBallCount = Math.max(maxBallCount, ballCount);
        minBallSet.set(ballColor, newMaxBallCount);
      }
    }
  }
  return minBallSet;
}

let testFilePath = process.cwd() + '/src/day2/test-input.txt';
let filePath = process.cwd() + '/src/day2/input.txt';

day2Part1(testFilePath); // 8
day2Part2(testFilePath); // 2286

day2Part1(filePath); // 2476
day2Part2(filePath); // 54911
