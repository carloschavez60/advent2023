import { readFileSync } from 'node:fs';

interface Range {
  dest: number;
  src: number;
  length: number;
}

interface Map {
  id: string;
  nextMapId: string;
  ranges: Range[];
}

const filePath = process.cwd() + '/src/day5/test-input.txt'; // 35 46
// const filePath = process.cwd() + '/src/day5/input.txt'; // 226172555

const fileStr = readFileSync(filePath, 'utf8');
const contents = fileStr.split('\n\n');

const seeds = contents
  .shift()!
  .split(': ')[1]
  .split(' ')
  .map((x) => parseInt(x));
// console.log(seeds);

const mapsArr = contents.map((mapStr): Map => {
  const lines = mapStr.split('\n');
  const [id, _, nextMapId] = lines.shift()!.split(' ')[0].split('-');
  return {
    id,
    nextMapId,
    ranges: lines.map((line): Range => {
      const [dest, src, length] = line.split(' ');
      return {
        dest: parseInt(dest),
        src: parseInt(src),
        length: parseInt(length),
      };
    }),
  };
});
// console.log(mapsArr);

const maps: { [id: string]: Map } = {};
for (const map of mapsArr) {
  maps[map.id] = map;
}
// const mapsLen = mapsArr.length;

console.time('partOne');
partOne(seeds, maps);
console.timeEnd('partOne');
// console.time('partTwo');
// partTwo(lines);
// console.timeEnd('partTwo');

function partOne(seeds: number[], maps: { [id: string]: Map }) {
  const locs: number[] = [];
  for (const seed of seeds) {
    let value = seed;
    let id = 'seed';
    while (maps[id] !== undefined) {
      const map = maps[id];
      const range = map.ranges.find(
        (range) => range.src <= value && value < range.src + range.length
      );
      if (range !== undefined) {
        value = value + (range.dest - range.src);
      }
      id = map.nextMapId;
    }
    const loc = value;
    locs.push(loc);
  }
  // console.log(locs);
  console.log(Math.min(...locs));
}

function partTwo(lines: string[]) {}

function getRanges(line: string): [number, number, number] {
  const [desRanStart, sourRanStart, range] = line
    .split(' ')
    .map((str) => parseInt(str));
  return [desRanStart, sourRanStart, range];
}
