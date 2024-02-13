import { readFileSync } from 'node:fs';

type Map = MapRange[];

class MapRange {
  start: number;
  length: number;
  destinationStart: number;

  constructor(start: number, length: number, destinationStart: number) {
    this.start = start;
    this.length = length;
    this.destinationStart = destinationStart;
  }
}

class Range {
  start: number;
  length: number;

  constructor(start: number, length: number) {
    this.start = start;
    this.length = length;
  }
}

main();

function main() {
  // const inputPath = process.cwd() + '/src/day5/test-input.txt'; // 35 46
  const inputPath = process.cwd() + '/src/day5/input.txt'; // 226172555 47909639

  const [s, m] = toSeedsAndMaps(inputPath);

  console.time('partOne');
  const l = getMinLocation(s, m);
  console.log(l);
  console.timeEnd('partOne');

  const sr = getSeedRanges(s);

  console.time('partTwo');
  const l2 = getMinLocation2(sr, m);
  console.log(l2);
  console.timeEnd('partTwo');
}

function toSeedsAndMaps(inputPath: string): [number[], Map[]] {
  const chunks = readFileSync(inputPath, 'utf8').split('\n\n');
  chunks[chunks.length - 1] = chunks[chunks.length - 1].slice(0, -1);

  const seeds: number[] = [];
  for (const s of chunks.shift()!.split(': ')[1].split(' ')) {
    seeds.push(Number(s));
  }

  const m = getMaps(chunks);
  return [seeds, m];
}

function getMaps(chunks: string[]): Map[] {
  const maps: Map[] = [];
  for (const smap of chunks) {
    const lines = smap.split('\n');
    lines.shift();

    const map: MapRange[] = [];
    for (const l of lines) {
      const [sdestStart, sstart, slen] = l.split(' ');
      map.push(new MapRange(Number(sstart), Number(slen), Number(sdestStart)));
    }

    addComplementRanges(map);
    maps.push(map);
  }
  return maps;
}

function addComplementRanges(map: MapRange[]) {
  map.sort((a, b) => a.start - b.start);
  let start = 0;
  for (let i = 0; i < map.length; i++) {
    const range = map[i];
    if (range.start > start) {
      map.splice(i, 0, new MapRange(start, range.start - start, start));
      i++;
    }
    start = range.start + range.length;
  }
  map.push(new MapRange(start, Infinity, start));
}

function getMinLocation(seeds: number[], maps: Map[]): number {
  let minLoc = Infinity;
  for (const s of seeds) {
    const l = toLocation(s, maps);
    minLoc = Math.min(minLoc, l);
  }
  return minLoc;
}

function toLocation(seed: number, maps: Map[]): number {
  let loc = seed;
  for (const m of maps) {
    loc = toNextCategory(loc, m);
  }
  return loc;
}

function toNextCategory(c: number, map: MapRange[]): number {
  for (const mr of map) {
    if (mr.start <= c && c < mr.start + mr.length) {
      const diff = c - mr.start;
      return mr.destinationStart + diff;
    }
  }
  return c;
}

function getSeedRanges(seeds: number[]): Range[] {
  const seedRanges: Range[] = [];
  for (let i = 0; i < seeds.length; i += 2) {
    seedRanges.push(new Range(seeds[i], seeds[i + 1]));
  }
  return seedRanges;
}

function getMinLocation2(seedRanges: Range[], maps: Map[]): number {
  let minLoc = Infinity;
  for (const sr of seedRanges) {
    const l = toMinLocation(sr, maps);
    minLoc = Math.min(minLoc, l);
  }
  return minLoc;
}

function toMinLocation(seedRange: Range, maps: Map[]): number {
  let minLoc = Infinity;
  let remainer = new Range(seedRange.start, seedRange.length);
  while (remainer.length > 0) {
    const consumed = consumeRange(remainer, maps);
    minLoc = Math.min(minLoc, consumed.start);
    remainer.start += consumed.length;
    remainer.length -= consumed.length;
  }
  return minLoc;
}

function consumeRange(remainer: Range, maps: Map[]): Range {
  let consumed = new Range(remainer.start, remainer.length);
  for (const m of maps) {
    consumed = toNextCategoryRange(consumed, m);
  }
  return consumed;
}

function toNextCategoryRange(cr: Range, map: MapRange[]): Range {
  for (const mr of map) {
    if (mr.start <= cr.start && cr.start < mr.start + mr.length) {
      const diff = cr.start - mr.start;
      const nextStart = mr.destinationStart + diff;
      const nextLen = Math.min(cr.length, mr.length - diff);
      return new Range(nextStart, nextLen);
    }
  }
  throw new Error('MapRange not found');
}
