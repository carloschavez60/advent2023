import { readFileLines } from '../utils.js';

const cache: Map<string, number> = new Map();

class Row {
  conditions: string;
  groups: number[];

  constructor(conditions: string, groups: number[]) {
    this.conditions = conditions;
    this.groups = groups;
  }
}

main();

function main() {
  // const inputPath = process.cwd() + '/src/day12/test-input.txt'; // 21 525152
  const inputPath = process.cwd() + '/src/day12/input.txt'; // 7379 7732028747925

  const l = readFileLines(inputPath);
  const r = toRows(l);

  console.time('partOne');
  const s = sumPossibleArrangementCounts(r);
  console.log(s);
  console.timeEnd('partOne');

  const r2 = unfoldRows(r);

  console.time('partTwo');
  const s2 = sumPossibleArrangementCounts(r2);
  console.log(s2);
  console.timeEnd('partTwo');
}

function toRows(lines: string[]): Row[] {
  const rows: Row[] = [];
  for (const l of lines) {
    const [conditions, sgroups] = l.split(' ');
    const groups: number[] = [];
    for (const s of sgroups.split(',')) {
      groups.push(Number(s));
    }
    rows.push(new Row(conditions, groups));
  }
  return rows;
}

function sumPossibleArrangementCounts(rows: Row[]): number {
  let sum = 0;
  for (const r of rows) {
    sum += countPossibleArrangements(r);
  }
  return sum;
}

function countPossibleArrangements(row: Row): number {
  return count(row.conditions, row.groups);
}

function count(conditions: string, groups: number[]): number {
  if (conditions === '') {
    if (groups.length === 0) {
      return 1;
    } else {
      return 0;
    }
  }
  if (groups.length === 0) {
    if (conditions.includes('#')) {
      return 0;
    } else {
      return 1;
    }
  }

  const key = JSON.stringify([conditions, groups]);
  if (cache.has(key)) {
    return cache.get(key)!;
  }

  let result = 0;
  if (conditions[0] === '.' || conditions[0] === '?') {
    result += count(conditions.slice(1), groups);
  }
  if (conditions[0] === '#' || conditions[0] === '?') {
    if (
      groups[0] <= conditions.length &&
      !conditions.slice(0, groups[0]).includes('.') &&
      (groups[0] === conditions.length || conditions[groups[0]] !== '#')
    ) {
      result += count(conditions.slice(groups[0] + 1), groups.slice(1));
    }
  }
  cache.set(key, result);
  return result;
}

function unfoldRows(rows: Row[]): Row[] {
  const rs = [...rows];
  for (const r of rs) {
    const ncArr: string[] = [];
    const ng: number[][] = [];
    for (let i = 0; i < 5; i++) {
      ncArr.push(r.conditions);
      ng.push(r.groups);
    }
    const nc = ncArr.join('?');
    r.conditions = nc;
    r.groups = ng.flat();
  }
  return rs;
}
