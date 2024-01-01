import { readFileSync } from 'node:fs';

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

class Map {
  ranges: MapRange[];

  constructor(ranges: MapRange[]) {
    this.ranges = this.#addComplementRanges(ranges);
  }

  #addComplementRanges(ranges: MapRange[]): MapRange[] {
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
    return ranges;
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

// const filePath = process.cwd() + '/src/day5/test-input.txt'; // 35 46
const filePath = process.cwd() + '/src/day5/input.txt'; // 226172555 47909639

const [seeds, maps] = getSeedsAndMaps(filePath);

// console.log(JSON.stringify(maps, null, 4));
// console.log(maps[1].ranges);

console.time('partOne');
partOne(seeds, maps);
console.timeEnd('partOne');

const seedRanges = getSeedRanges(seeds);

console.time('partTwo');
partTwo(seedRanges, maps);
console.timeEnd('partTwo');

function getSeedsAndMaps(filePath: string): [number[], Map[]] {
  const fileStr = readFileSync(filePath, 'utf8');
  const contents = fileStr.slice(0, -1).split('\n\n');

  const seeds = contents
    .shift()!
    .split(': ')[1]
    .split(' ')
    .map((str) => +str);

  const maps = getMaps(contents);
  return [seeds, maps];
}

function getMaps(contents: string[]): Map[] {
  const maps: Map[] = [];
  for (const mapAsString of contents) {
    const lines = mapAsString.split('\n');
    lines.shift();

    const ranges: MapRange[] = [];
    for (const line of lines) {
      const [destinationStart, start, length] = line.split(' ');
      ranges.push(new MapRange(+start, +length, +destinationStart));
    }

    maps.push(new Map(ranges));
  }
  return maps;
}

function partOne(seeds: number[], maps: Map[]) {
  const locations: number[] = [];
  for (const seed of seeds) {
    const location = getLocation(seed, maps);
    locations.push(location);
  }

  console.log(Math.min(...locations));
}

function getLocation(seed: number, maps: Map[]): number {
  let temp = seed;
  for (const map of maps) {
    temp = getNextTemp(temp, map);
  }
  const location = temp;
  return location;
}

function getNextTemp(temp: number, map: Map): number {
  for (const range of map.ranges) {
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

function partTwo(seedRanges: Range[], maps: Map[]) {
  let lowestLocation = Infinity;
  for (const seedRange of seedRanges) {
    lowestLocation = Math.min(getLowestLocation(seedRange), lowestLocation);
  }
  console.log(lowestLocation);
}

function getLowestLocation(seedRange: Range): number {
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
  for (const mapRange of map.ranges) {
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
