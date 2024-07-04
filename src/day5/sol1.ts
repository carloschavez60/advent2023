import { readFileSync } from 'node:fs';

class MapRange {
  readonly start: number;
  readonly length: number;
  readonly destinationStart: number;

  constructor(start: number, length: number, destinationStart: number) {
    this.start = start;
    this.length = length;
    this.destinationStart = destinationStart;
  }
}

class Range {
  readonly start: number;
  readonly length: number;

  constructor(start: number, length: number) {
    this.start = start;
    this.length = length;
  }
}

function day5Part1(filePath: string) {
  const [seeds, maps]: [number[], MapRange[][]] =
    readSeedsAndMapsFromFile(filePath);

  const part1Result: number = getMinLocation(seeds, maps);
  console.log('part 1 result:', part1Result);
}

function readSeedsAndMapsFromFile(inputPath: string): [number[], MapRange[][]] {
  const chunks: string[] = readFileSync(inputPath, 'utf8').split('\n\n');
  chunks[chunks.length - 1] = chunks[chunks.length - 1].slice(0, -1);

  const seeds: number[] = [];
  for (const seedStr of chunks[0].split(': ')[1].split(' ')) {
    seeds.push(parseInt(seedStr));
  }

  const maps: MapRange[][] = parseChunksToMaps(chunks);
  return [seeds, maps];
}

function parseChunksToMaps(chunks: readonly string[]): MapRange[][] {
  const maps: MapRange[][] = [];
  for (let i = 1; i < chunks.length; i++) {
    const mapStr = chunks[i];
    const lines = mapStr.split('\n');

    const mapRanges: MapRange[] = [];
    for (let j = 1; j < lines.length; j++) {
      const [destStartStr, startStr, lengthStr] = lines[j].split(' ');
      mapRanges.push(
        new MapRange(
          parseInt(startStr),
          parseInt(lengthStr),
          parseInt(destStartStr)
        )
      );
    }
    maps.push(mapRanges);
  }
  return maps;
}

/**
 * Precondition: Maps are sorted. Category of destination is equal
 * to category of source of next element in maps.
 */
function getMinLocation(
  seeds: readonly number[],
  maps: readonly (readonly MapRange[])[]
): number {
  let minLocation: number = getLocationFromSeed(seeds[0], maps);
  for (let i = 1; i < seeds.length; i++) {
    const seed: number = seeds[i];
    const location: number = getLocationFromSeed(seed, maps);
    minLocation = Math.min(minLocation, location);
  }
  return minLocation;
}

/**
 * Precondition: Maps are sorted. Category of destination is equal
 * to category of source of next element in maps.
 */
function getLocationFromSeed(
  seed: number,
  maps: readonly (readonly MapRange[])[]
): number {
  let location: number = seed;
  for (const mapRanges of maps) {
    location = getNextCategory(location, mapRanges);
  }
  return location;
}

function getNextCategory(
  category: number,
  mapRanges: readonly MapRange[]
): number {
  for (const mapRange of mapRanges) {
    if (
      mapRange.start <= category &&
      category < mapRange.start + mapRange.length
    ) {
      const diff: number = category - mapRange.start;
      return mapRange.destinationStart + diff;
    }
  }
  return category;
}

function day5Part2(filePath: string) {
  const [seeds, maps]: [number[], MapRange[][]] =
    readSeedsAndMapsFromFile(filePath);

  const seedRanges: Range[] = getSeedRanges(seeds);

  for (const mapRanges of maps) {
    sortAndAddComplementMapRanges(mapRanges); // mutates mapRanges
  }

  const part2Result: number = getPart2MinLocation(seedRanges, maps);
  console.log('part 2 result:', part2Result);
}

function getSeedRanges(seeds: readonly number[]): Range[] {
  const seedRanges: Range[] = [];
  for (let i = 0; i < seeds.length; i += 2) {
    seedRanges.push(new Range(seeds[i], seeds[i + 1]));
  }
  return seedRanges;
}

/**
 * Mutates mapRanges
 */
function sortAndAddComplementMapRanges(mapRanges: MapRange[]) {
  mapRanges.sort((a, b) => a.start - b.start);
  let start = 0;
  for (let i = 0; i < mapRanges.length; i++) {
    const mapRange: MapRange = mapRanges[i];
    if (mapRange.start > start) {
      mapRanges.splice(
        i,
        0,
        new MapRange(start, mapRange.start - start, start)
      );
      i++;
    }
    start = mapRange.start + mapRange.length;
  }
}

/**
 * Precondition: mapRanges of every map are sorted by mapRange.start
 * and have complement mapRanges.
 */
function getPart2MinLocation(
  seedRanges: readonly Range[],
  maps: readonly (readonly MapRange[])[]
): number {
  let minLocation: number = getMinLocationFromSeedRange(seedRanges[0], maps);
  for (let i = 1; i < seedRanges.length; i++) {
    const seedRange: Range = seedRanges[i];
    const location: number = getMinLocationFromSeedRange(seedRange, maps);
    minLocation = Math.min(minLocation, location);
  }
  return minLocation;
}

/**
 * Precondition: mapRanges of every map are sorted by mapRange.start
 * and have complement mapRanges.
 * Precondition: seedRange.length > 0
 */
function getMinLocationFromSeedRange(
  seedRange: Range,
  maps: readonly (readonly MapRange[])[]
): number {
  let minLocation: number | undefined;
  let remainingSeedRange: Range = seedRange;
  while (remainingSeedRange.length > 0) {
    const partialLocationRange: Range = getPartialLocationRange(
      remainingSeedRange,
      maps
    );
    if (minLocation === undefined) {
      minLocation = partialLocationRange.start;
    } else {
      minLocation = Math.min(minLocation, partialLocationRange.start);
    }
    remainingSeedRange = new Range(
      remainingSeedRange.start + partialLocationRange.length,
      remainingSeedRange.length - partialLocationRange.length
    );
  }
  return minLocation!;
}

/**
 * Precondition: mapRanges of every map are sorted by mapRange.start
 * and have complement mapRanges.
 */
function getPartialLocationRange(
  remainingSeedRange: Range,
  maps: readonly (readonly MapRange[])[]
): Range {
  let partialLocationRange: Range = remainingSeedRange;
  for (const mapRanges of maps) {
    partialLocationRange = getNextPartialCategoryRange(
      partialLocationRange,
      mapRanges
    );
  }
  return partialLocationRange;
}

/**
 * Precondition: mapRanges of every map are sorted by mapRange.start
 * and have complement mapRanges.
 */
function getNextPartialCategoryRange(
  categoryRange: Range,
  mapRanges: readonly MapRange[]
): Range {
  for (const mapRange of mapRanges) {
    if (
      mapRange.start <= categoryRange.start &&
      categoryRange.start < mapRange.start + mapRange.length
    ) {
      const diff: number = categoryRange.start - mapRange.start;
      const nextStart: number = mapRange.destinationStart + diff;
      const nextLength: number = Math.min(
        categoryRange.length,
        mapRange.length - diff
      );
      return new Range(nextStart, nextLength);
    }
  }
  return categoryRange;
}

const testFilePath = process.cwd() + '/src/day5/test-input.txt';
const filePath = process.cwd() + '/src/day5/input.txt';

day5Part1(testFilePath); // 35
day5Part2(testFilePath); // 46

day5Part1(filePath); // 226172555
day5Part2(filePath); // 47909639
