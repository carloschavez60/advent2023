import { readFile } from 'node:fs/promises';

(async () => {
  const buf = await readFile(process.cwd() + '/src/3/input.txt');
  // const buf = await readFile(process.cwd() + '/3/test-input.txt');
  const input = buf.toString();

  console.time('time');

  const lines = input.split('\n');
  const lineLen = lines[0].length;
  const ghostLine = ''.padStart(lineLen, '.');

  // fill edge cases
  lines.pop();
  lines.unshift(ghostLine);
  lines.push(ghostLine);

  let totalSum = 0;

  for (let i = 1; i < lines.length - 1; i++) {
    const prevLine = lines[i - 1];
    const curLine = lines[i];
    const nextLine = lines[i + 1];

    // console.log(prevLine, curLine, nextLine, i);

    let curNumber = '';
    let curNumberLen = 0;

    for (let j = 0; j <= lineLen; j++) {
      if (isNumber(curLine[j])) {
        curNumber += curLine[j];
        curNumberLen++;
      } else {
        if (curNumberLen > 0) {
          // check for symbol
          let curNumberIsAdjacentToSymbol = false;
          if (
            (curLine[j] && curLine[j] !== '.') ||
            (curLine[j - curNumberLen - 1] &&
              curLine[j - curNumberLen - 1] !== '.')
          ) {
            curNumberIsAdjacentToSymbol = true;
          }
          for (let k = j - curNumberLen - 1; k <= j; k++) {
            if (
              (prevLine[k] && prevLine[k] !== '.') ||
              (nextLine[k] && nextLine[k] !== '.')
            ) {
              curNumberIsAdjacentToSymbol = true;
            }
          }

          if (curNumberIsAdjacentToSymbol) {
            totalSum += Number(curNumber);
          }

          // console.log(Number(curNumber), curNumberIsAdjacentToSymbol);

          curNumber = '';
          curNumberLen = 0;
          curNumberIsAdjacentToSymbol = false;
        }
      }
    }
  }
  console.timeEnd('time');
  console.log(totalSum);
})();

function isNumber(number: string) {
  const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  return numbers.includes(number);
}
