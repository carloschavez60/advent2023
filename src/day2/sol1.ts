import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline/promises';

const config: ReadonlyMap<string, number> = new Map([
  ['red', 12],
  ['green', 13],
  ['blue', 14],
]);

class Game {
  constructor(
    public readonly id: string,
    public readonly ballSets: ReadonlyMap<string, number>[]
  ) {}

  isPossible(): boolean {
    for (const ballSet of this.ballSets) {
      for (const color of ballSet.keys()) {
        const configBallCount = config.get(color);
        if (configBallCount === undefined) {
          continue;
        }
        if (ballSet.get(color)! > configBallCount) {
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
    const minSet = new Map<string, number>();
    for (const ballSet of this.ballSets) {
      for (const color of ballSet.keys()) {
        minSet.set(
          color,
          Math.max(ballSet.get(color)!, minSet.get(color) ?? 0)
        );
      }
    }
    return minSet;
  }
}

main();

async function main() {
  // const inputFilePath = process.cwd() + '/src/day2/test-input.txt'; // 8 2286
  const inputFilePath = process.cwd() + '/src/day2/input.txt'; // 2476 54911

  console.time('partOne');
  const sum: number = await sumPossibleGameIds(inputFilePath);
  console.log(sum);
  console.timeEnd('partOne');

  console.time('partTwo');
  const sum2: number = await sumMinBallSetPowers(inputFilePath);
  console.log(sum2);
  console.timeEnd('partTwo');
}

async function sumPossibleGameIds(inputFilePath: string): Promise<number> {
  const rl = createInterface({
    input: createReadStream(inputFilePath),
    crlfDelay: Infinity,
  });

  let sum = 0;
  for await (const line of rl) {
    const game: Game = toGame(line);
    if (game.isPossible()) {
      sum += Number(game.id);
    }
  }
  return sum;
}

function toGame(line: string): Game {
  const [idAsString, ballSetsAsString] = line.split(':');
  const id = idAsString.split(' ')[1];
  const ballSets: ReadonlyMap<string, number>[] = [];
  for (const ballSetAsString of ballSetsAsString.split(';')) {
    const ballSet = new Map<string, number>();
    for (const ballSubsetAsString of ballSetAsString.split(',')) {
      const [ballCountAsString, color] = ballSubsetAsString
        .trimStart()
        .split(' ');
      ballSet.set(color, Number(ballCountAsString));
    }
    ballSets.push(ballSet);
  }
  return new Game(id, ballSets);
}

async function sumMinBallSetPowers(inputFilePath: string): Promise<number> {
  const rl = createInterface({
    input: createReadStream(inputFilePath),
    crlfDelay: Infinity,
  });

  let sum = 0;
  for await (const line of rl) {
    const game: Game = toGame(line);
    sum += game.minBallSetPower();
  }
  return sum;
}
