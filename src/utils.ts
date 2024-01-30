import { readFileSync } from 'node:fs';

function getLines(filePath: string): string[] {
  const lines = readFileSync(filePath, 'utf8').split('\n');
  lines.pop();
  return lines;
}

export { getLines };
