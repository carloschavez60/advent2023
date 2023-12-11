// credits to TheVimeagen : https://www.youtube.com/watch?v=LuYOIzd5lKg

import { readFileSync } from 'node:fs';

const buf = readFileSync(process.cwd() + '/src/day5/test-input.txt'); // 35
// const buf = readFileSync(process.cwd() + '/src/day5/input.txt'); // 226172555
const contents = buf
  .toString()
  .split('\n\n')
  .filter((x) => x.length);
const seeds = contents
  .shift()
  ?.split(': ')[1]
  .split(' ')
  .map((x) => parseInt(x))!;

interface Range {
  dest: number;
  src: number;
  range: number;
}

function createRange(line: string): Range {
  const items = line.split(' ');
  return {
    dest: +items[0],
    src: +items[1],
    range: +items[2],
  };
}

interface Map {
  from: string;
  to: string;
  map: Range[];
}

function parseMap(data: string): Map {
  const contents = data.split('\n').filter((x) => x);
  const [from, _, to] = contents.shift()?.split(' ')[0].split('-')!;
  return {
    from,
    to,
    map: contents.map(createRange),
  };
}

function walk(
  value: number,
  name: string,
  map: { [name: string]: Map }
): number {
  if (map[name] === undefined) {
    return value;
  }

  const item = map[name];
  const range = item.map.find(
    (x: Range) => x.src <= value && value < x.src + x.range
  );
  if (range) {
    const newValue = range.dest + (value - range.src);
    return walk(newValue, item.to, map);
  }

  return walk(value, item.to, map);
}

const parsed = contents.map((x) => parseMap(x));

// const acc:{[from: string]: Section} = {};
const parsedMap = parsed.reduce((acc: { [name: string]: Map }, x) => {
  acc[x.from] = x;
  return acc;
}, {});

console.log(parsedMap);

const locs = [];
for (const seed of seeds) {
  const loc = walk(seed, 'seed', parsedMap);
  locs.push(loc);
}

console.log(Math.min(...locs));
// console.log(locs.sort((a, b) => a - b)[0]);
