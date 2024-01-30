import { getLines } from '../utils.js';

const config = {
  red: 12,
  green: 13,
  blue: 14,
} as const;

class Game {
  constructor(
    public readonly gameID: string,
    public readonly sets: readonly GameSet[]
  ) {}
}

class GameSet {
  constructor(
    public readonly red: number,
    public readonly green: number,
    public readonly blue: number
  ) {}
}

main();

function main() {
  // const filePath = process.cwd() + '/src/day2/test-input.txt'; // 8 2286
  const filePath = process.cwd() + '/src/day2/input.txt'; // 2476 54911

  const lines = getLines(filePath);
  const games = getGames(lines);

  console.time('partOne');
  const gameIdSum = partOne(games);
  console.log(gameIdSum);
  console.timeEnd('partOne');

  console.time('partTwo');
  const setPowerSum = partTwo(games);
  console.log(setPowerSum);
  console.timeEnd('partTwo');
}

function getGames(lines: readonly string[]): readonly Game[] {
  return lines.map((line) => {
    const [game, setsAsString] = line.split(':');
    const gameID = game.split(' ')[1];
    const sets = setsAsString.split(';').map((setAsString) => {
      const subsets = setAsString
        .split(',')
        .reduce((acc: { [color: string]: number }, subsetAsString) => {
          const [cubeCount, cubeColor] = subsetAsString.trimStart().split(' ');
          acc[cubeColor] = parseInt(cubeCount);
          return acc;
        }, {});
      return new GameSet(
        subsets.red ?? 0,
        subsets.green ?? 0,
        subsets.blue ?? 0
      );
    });
    return new Game(gameID, sets);
  });
}

function partOne(games: readonly Game[]): number {
  return games
    .filter((game) => isPossible(game))
    .reduce((sum, game) => sum + parseInt(game.gameID), 0);
}

function isPossible(game: Game): boolean {
  return game.sets.every(
    (set) =>
      set.red <= config.red &&
      set.green <= config.green &&
      set.blue <= config.blue
  );
}

function partTwo(games: readonly Game[]): number {
  return games
    .map((game) =>
      game.sets.reduce((minSet, set) => {
        return new GameSet(
          Math.max(set.red, minSet.red),
          Math.max(set.green, minSet.green),
          Math.max(set.blue, minSet.blue)
        );
      })
    )
    .reduce((sum, minSet) => sum + minSet.red * minSet.green * minSet.blue, 0);
}
