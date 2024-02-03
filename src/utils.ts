import { readFileSync } from 'node:fs';

/**
 * file should end with a newline.
 */
function readFileLines(filePath: string): string[] {
  const lines = readFileSync(filePath, 'utf8').split('\n');
  lines.pop();
  return lines;
}

export { readFileLines };
