import { readFileLines } from '../utils.js';

const config = {
  red: 12,
  green: 13,
  blue: 14,
} as const;

class Game {
  gameId: string;
  sets: { [color: string]: number }[];

  constructor(gameId: string, sets: { [color: string]: number }[]) {
    this.gameId = gameId;
    this.sets = sets;
  }

  isPossible(): boolean {
    for (const s of this.sets) {
      for (const c in s) {
        if (s[c] > config[c as keyof typeof config]) {
          return false;
        }
      }
    }
    return true;
  }

  getMinSetPower(): number {
    const ms = this.#getMinSet();
    let p = 1;
    for (const c in ms) {
      p *= ms[c];
    }
    return p;
  }

  #getMinSet(): { [color: string]: number } {
    const minSet: { [color: string]: number } = {
      red: 0,
      green: 0,
      blue: 0,
    };
    for (const s of this.sets) {
      for (const c in s) {
        minSet[c] = Math.max(minSet[c], s[c]);
      }
    }
    return minSet;
  }
}

main();

function main() {
  // const filePath = process.cwd() + '/src/day2/test-input.txt'; // 8 2286
  const filePath = process.cwd() + '/src/day2/input.txt'; // 2476 54911
  const l = readFileLines(filePath);
  const g = toGames(l);

  console.time('partOne');
  const s = sumPossibleGameIds(g);
  console.log(s);
  console.timeEnd('partOne');

  console.time('partTwo');
  const s2 = sumMinSetPowers(g);
  console.log(s2);
  console.timeEnd('partTwo');
}

function toGames(lines: string[]): Game[] {
  const games: Game[] = [];
  for (const l of lines) {
    const [sid, ssets] = l.split(':');
    const id = sid.split(' ')[1];
    const sets: { [color: string]: number }[] = [];
    for (const sset of ssets.split(';')) {
      const set: { [color: string]: number } = {};
      for (const ssubset of sset.split(',')) {
        const [scount, color] = ssubset.trimStart().split(' ');
        set[color] = Number(scount);
      }
      sets.push(set);
    }
    games.push(new Game(id, sets));
  }
  return games;
}

function sumPossibleGameIds(games: Game[]): number {
  let s = 0;
  for (const g of games) {
    if (g.isPossible()) {
      s += Number(g.gameId);
    }
  }
  return s;
}

function sumMinSetPowers(games: Game[]): number {
  let s = 0;
  for (const g of games) {
    s += g.getMinSetPower();
  }
  return s;
}
