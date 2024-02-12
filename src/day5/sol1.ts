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
  // const filePath = process.cwd() + '/src/day5/test-input.txt'; // 35 46
  const filePath = process.cwd() + '/src/day5/input.txt'; // 226172555 47909639

  const [seeds, maps] = toSeedsAndMaps(filePath);

  console.time('partOne');
  const minLocation = getMinLocation(seeds, maps);
  console.log(minLocation);
  console.timeEnd('partOne');

  const seedRanges = getSeedRanges(seeds);

  console.time('partTwo');
  const minLocation2 = getMinLocation2(seedRanges, maps);
  console.log(minLocation2);
  console.timeEnd('partTwo');
}

function toSeedsAndMaps(filePath: string): [number[], Map[]] {
  const fileStr = readFileSync(filePath, 'utf8');
  const contents = fileStr.slice(0, -1).split('\n\n');

  const seeds: number[] = [];
  for (const s of contents.shift()!.split(': ')[1].split(' ')) {
    seeds.push(Number(s));
  }

  const maps = getMaps(contents);
  return [seeds, maps];
}

function getMaps(contents: string[]): Map[] {
  const maps: Map[] = [];
  for (const strMap of contents) {
    const lines = strMap.split('\n');
    lines.shift();

    const map: MapRange[] = [];
    for (const line of lines) {
      const [destinationStart, start, length] = line.split(' ');
      map.push(new MapRange(+start, +length, +destinationStart));
    }

    addComplementRanges(map);
    maps.push(map);
  }
  return maps;
}

function addComplementRanges(ranges: MapRange[]) {
  ranges.sort((a, b) => a.start - b.start);
  let start = 0;
  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    if (range.start > start) {
      ranges.splice(i, 0, new MapRange(start, range.start - start, start));
      i++;
    }
    start = range.start + range.length;
  }
  ranges.push(new MapRange(start, Infinity, start));
}

function getMinLocation(seeds: number[], maps: Map[]): number {
  let minLocation = Infinity;
  for (const seed of seeds) {
    minLocation = Math.min(minLocation, toLocation(seed, maps));
  }
  return minLocation;
}

function toLocation(seed: number, maps: Map[]): number {
  let temp = seed;
  for (const map of maps) {
    temp = getNextTemp(temp, map);
  }
  const location = temp;
  return location;
}

function getNextTemp(temp: number, map: Map): number {
  for (const range of map) {
    if (range.start <= temp && temp < range.start + range.length) {
      const diff = temp - range.start;
      return range.destinationStart + diff;
    }
  }
  return temp;
}

function getSeedRanges(seeds: number[]): Range[] {
  const seedRanges: Range[] = [];
  for (let i = 0; i < seeds.length; i += 2) {
    seedRanges.push(new Range(seeds[i], seeds[i + 1]));
  }
  return seedRanges;
}

function getMinLocation2(seedRanges: Range[], maps: Map[]): number {
  let minLocation = Infinity;
  for (const seedRange of seedRanges) {
    minLocation = Math.min(minLocation, toMinLocation(seedRange, maps));
  }
  return minLocation;
}

function toMinLocation(seedRange: Range, maps: Map[]): number {
  let lowestLocation = Infinity;
  let remainingRange = new Range(seedRange.start, seedRange.length);
  while (remainingRange.length > 0) {
    const consumptionRange = getConsumptionRange(remainingRange, maps);

    remainingRange = new Range(
      remainingRange.start + consumptionRange.length,
      remainingRange.length - consumptionRange.length
    );

    lowestLocation = Math.min(consumptionRange.start, lowestLocation);
  }
  return lowestLocation;
}

function getConsumptionRange(remainderRange: Range, maps: Map[]): Range {
  let tempRange = new Range(remainderRange.start, remainderRange.length);
  for (const map of maps) {
    tempRange = getNextTempRange(tempRange, map);
  }
  return new Range(tempRange.start, tempRange.length);
}

function getNextTempRange(tempRange: Range, map: Map): Range {
  for (const mapRange of map) {
    if (
      mapRange.start <= tempRange.start &&
      tempRange.start < mapRange.start + mapRange.length
    ) {
      const diff = tempRange.start - mapRange.start;
      return new Range(
        mapRange.destinationStart + diff,
        Math.min(tempRange.length, mapRange.length - diff)
      );
    }
  }
  throw new Error('mapRange not found');
}
