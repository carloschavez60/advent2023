import { readFileSync } from 'fs';

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
  const filePath = process.cwd() + '/src/day12/test-input.txt';
  // const filePath = process.cwd() + '/src/day12/input.txt'; // 9536038 447744640566

  const rows = getRows(filePath);

  console.time('partOne');
  partOne(rows);
  console.timeEnd('partOne');

  // console.time('partTwo');
  // partTwo(lines);
  // console.timeEnd('partTwo');
}

function getRows(filePath: string): Row[] {
  const fileAsString = readFileSync(filePath, 'utf8');
  const lines = fileAsString.split('\n');
  lines.pop();

  const rows: Row[] = [];
  for (const line of lines) {
    const [conditions, groupsAsString] = line.split(' ');
    const groups: number[] = [];
    for (const s of groupsAsString.split(',')) {
      groups.push(+s);
    }
    rows.push(new Row(conditions, groups));
  }
  return rows;
}

function partOne(rows: Row[]) {
  let sum = 0;
  for (const row of rows) {
    const arrangementCount = getArrangementCount(row);
    sum += arrangementCount;
  }
  console.log(sum);
}

function getArrangementCount(row: Row): number {
  console.log(row);
  let curGroup = row.groups[0];
  let curGroupCount = 0;
  let conditions = row.conditions;
  for (let i = 0; i < conditions.length; i++) {
    const char = conditions[i];
    const rightChar = conditions[i + 1];
    if (char === '#') {
      curGroupCount++;
    } else if (char === '?') {
    }
  }
  return 1;
}

// function partTwo(lines: string[]) {
//   console.log(shortestPathSum);
// }
