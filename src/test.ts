import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline/promises';

main();

async function main() {
  const filePath = process.cwd() + '/src/day1/test-input.txt';

  const stream = createReadStream(filePath);
  const readline = createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  for await (const line of readline) {
    console.log(line);
  }

  const readline2 = createInterface({
    input: createReadStream(filePath),
    crlfDelay: Infinity,
  });

  for await (const line of readline2) {
    console.log(line);
  }
}
