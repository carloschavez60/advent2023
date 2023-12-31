import { readFileSync } from 'node:fs';

class Range {
  dest: number;
  src: number;
  length: number;

  constructor(dest: number, src: number, length: number) {
    this.dest = dest;
    this.src = src;
    this.length = length;
  }
}

class Map {
  id: string;
  nextMapId: string;
  ranges: Range[];

  constructor(id: string, nextMapId: string, ranges: Range[]) {
    this.id = id;
    this.nextMapId = nextMapId;
    this.ranges = ranges;
  }
}

// const filePath = process.cwd() + '/src/day5/test-input.txt'; // 35 46
const filePath = process.cwd() + '/src/day5/input.txt'; // 226172555 47909639

const fileStr = readFileSync(filePath, 'utf8');
const contents = fileStr.split('\n\n');

const seeds = contents
  .shift()!
  .split(': ')[1]
  .split(' ')
  .map((str) => +str);

const maps = contents.map((mapAsString): Map => {
  const lines = mapAsString.split('\n');
  const [id, _, nextMapId] = lines.shift()!.split(' ')[0].split('-');

  return new Map(
    id,
    nextMapId,
    lines
      .filter((line) => line !== '')
      .map((line): Range => {
        const [dest, src, length] = line.split(' ');
        return new Range(+dest, +src, +length);
      })
  );
});

for (const map of maps) {
  map.ranges = addComplementRanges(map.ranges);
}

// console.log(JSON.stringify(maps, null, 4));
// console.log(maps[1].ranges);

console.time('partOne');
partOne(seeds, maps);
console.timeEnd('partOne');
console.time('partTwo');
partTwo(seeds, maps);
console.timeEnd('partTwo');

function addComplementRanges(ranges: Range[]) {
  ranges.sort((a, b) => a.src - b.src);

  let start = 0;
  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    if (range.src > start) {
      ranges.splice(i, 0, {
        src: start,
        dest: start,
        length: range.src - start,
      });
      i++;
    }
    start = range.src + range.length;
  }
  ranges.push({
    src: start,
    dest: start,
    length: Infinity,
  });
  return ranges;
}

function partOne(seeds: number[], maps: Map[]) {
  const locs: number[] = [];
  for (const seed of seeds) {
    const loc = maps.reduce(walkMapsToGetLocation, seed);
    locs.push(loc);
  }
  // console.log(locs);
  console.log(Math.min(...locs));
}

function walkMapsToGetLocation(value: number, map: Map): number {
  let nextValue = value;
  const range = map.ranges.find(
    (range) => range.src <= value && value < range.src + range.length
  );
  if (range !== undefined) {
    nextValue = value + (range.dest - range.src);
  }
  return nextValue;
}

function partTwo(seeds: number[], maps: Map[]) {
  let lowest = Infinity;
  // const locs: number[] = [];
  for (let i = 0; i < seeds.length; i += 2) {
    const seedStart = seeds[i];
    const seedRange = seeds[i + 1];
    // console.log(seedStart, seedRange);
    let start = seedStart;
    let remainder = seedRange;
    while (remainder > 0) {
      // console.log('start', start, 'remainder', remainder);
      const [locStart, consumed] = maps.reduce(walkMapsToGetLocInterval, [
        start,
        remainder,
      ]);
      // console.log('locStart', locStart, 'consumed', consumed);
      remainder -= consumed;
      start += consumed;
      if (locStart < lowest) {
        lowest = locStart;
      }
      // locs.push(locStart);
    }
  }
  console.log(lowest);
  // console.log(Math.min(...locs));
}

function walkMapsToGetLocInterval(
  [value, valueRange]: [number, number],
  map: Map
): [number, number] {
  // console.log(value, valueRange, map.id);
  const range = map.ranges.find(
    (range) => range.src <= value && value < range.src + range.length
  )!;
  // if (range !== undefined) {
  const diff = value - range.src;
  const nextValue = range.dest + diff;
  return [nextValue, Math.min(valueRange, range.length - diff)];
  // }
  // console.log('this is never printed');
  // return [value, 1];
}
