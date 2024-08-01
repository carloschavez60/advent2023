import { readFileSync } from 'node:fs';

class Game {
  private id: string;
  private ballSets: Map<string, number>[];

  private static readonly ballCountLimitByBallColor: ReadonlyMap<
    string,
    number
  > = new Map([
    ['red', 12],
    ['green', 13],
    ['blue', 14],
  ]);

  public constructor(id: string, ballSets: Map<string, number>[]) {
    this.id = id;
    this.ballSets = ballSets;
  }

  public idAsNumber(): number {
    return parseInt(this.id);
  }

  public isPossible(): boolean {
    for (const ballSet of this.ballSets) {
      for (const [ballColor, ballCount] of ballSet.entries()) {
        const ballCountLimit = Game.ballCountLimitByBallColor.get(ballColor);
        if (ballCountLimit !== undefined && ballCount > ballCountLimit) {
          return false;
        }
      }
    }
    return true;
  }

  public minBallSetPower(): number {
    const minBallSet = this.minBallSet();
    let power = 1;
    for (const ballCount of minBallSet.values()) {
      power *= ballCount;
    }
    return power;
  }

  private minBallSet(): Map<string, number> {
    const minBallSet = new Map<string, number>();
    for (const ballSet of this.ballSets) {
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
}

class GameReader {
  private filePath: string;

  public constructor(filePath: string) {
    this.filePath = filePath;
  }

  public readGames(): Game[] {
    const lines = this.readFileLines();
    const games: Game[] = [];
    for (const line of lines) {
      const game = this.parseToGame(line);
      games.push(game);
    }
    return games;
  }

  private readFileLines(): string[] {
    const lines = readFileSync(this.filePath, 'utf8').split('\n');
    if (lines[lines.length - 1] === '') {
      lines.pop();
    }
    return lines;
  }

  private parseToGame(line: string): Game {
    const [idStr, ballSetsStr] = line.split(':');
    const id = idStr.split(' ')[1];
    const ballSets: Map<string, number>[] = [];
    for (const ballSetStr of ballSetsStr.split(';')) {
      ballSets.push(this.parseToBallSet(ballSetStr));
    }
    return new Game(id, ballSets);
  }

  private parseToBallSet(ballSetStr: string): Map<string, number> {
    const ballSet = new Map<string, number>();
    for (const ballSubsetStr of ballSetStr.split(',')) {
      const [ballCountStr, ballColor] = ballSubsetStr.trimStart().split(' ');
      const ballCount = parseInt(ballCountStr);
      ballSet.set(ballColor, ballCount);
    }
    return ballSet;
  }
}

class Day2 {
  private gameReader: GameReader;

  public constructor(gameReader: GameReader) {
    this.gameReader = gameReader;
  }

  public part1(): number {
    const games = this.gameReader.readGames();
    return this.sumPossibleGameIds(games);
  }

  private sumPossibleGameIds(games: Game[]): number {
    let sum = 0;
    for (const game of games) {
      if (game.isPossible()) {
        sum += game.idAsNumber();
      }
    }
    return sum;
  }

  public part2(): number {
    const games = this.gameReader.readGames();
    return this.sumMinBallSetPowers(games);
  }

  private sumMinBallSetPowers(games: Game[]): number {
    let sum = 0;
    for (const game of games) {
      sum += game.minBallSetPower();
    }
    return sum;
  }
}

const testFilePath = process.cwd() + '/src/day2/test-input.txt';
const filePath = process.cwd() + '/src/day2/input.txt';

const testGameReader = new GameReader(testFilePath);
const testDay2 = new Day2(testGameReader);
console.log(`Part 1 test result: ${testDay2.part1()}`); // 8
console.log(`Part 2 test result: ${testDay2.part2()}`); // 2286

const gameReader = new GameReader(filePath);
const day2 = new Day2(gameReader);
console.log(`Part 1 result: ${day2.part1()}`); // 2476
console.log(`Part 2 result: ${day2.part2()}`); // 54911
