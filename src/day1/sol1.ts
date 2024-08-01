import { readFileSync } from 'node:fs';

class Day1 {
  private filePath: string;

  private static readonly digitCharBySpelledDigit: ReadonlyMap<string, string> =
    new Map([
      ['one', '1'],
      ['two', '2'],
      ['three', '3'],
      ['four', '4'],
      ['five', '5'],
      ['six', '6'],
      ['seven', '7'],
      ['eight', '8'],
      ['nine', '9'],
    ]);

  public constructor(filePath: string) {
    this.filePath = filePath;
  }

  public part1(): number {
    const lines = this.readFileLines(this.filePath);
    return this.sumCalibrationValues(lines);
  }

  private readFileLines(filePath: string): string[] {
    const lines = readFileSync(filePath, 'utf8').split('\n');
    if (lines[lines.length - 1] === '') {
      lines.pop();
    }
    return lines;
  }

  private sumCalibrationValues(lines: string[]): number {
    let sum = 0;
    for (const line of lines) {
      sum += this.getCalibrationValue(line);
    }
    return sum;
  }

  /**
   * Returns 0 if there are no digit characters on the line.
   */
  private getCalibrationValue(line: string): number {
    const firstDigitChar = this.searchFirstDigitChar(line);
    if (firstDigitChar === undefined) {
      return 0;
    }
    const lastDigitChar = this.searchLastDigitChar(line);
    if (lastDigitChar === undefined) {
      return 0;
    }
    return parseInt(firstDigitChar + lastDigitChar);
  }

  private searchFirstDigitChar(line: string): string | undefined {
    for (const char of line) {
      const charIsDigit = this.checkCharIsDigit(char);
      if (charIsDigit) {
        return char;
      }
    }
    return undefined;
  }

  private checkCharIsDigit(char: string): boolean {
    return '0' <= char && char <= '9';
  }

  private searchLastDigitChar(line: string): string | undefined {
    for (let i = line.length - 1; i >= 0; i--) {
      const char = line.charAt(i);
      const charIsDigit = this.checkCharIsDigit(char);
      if (charIsDigit) {
        return char;
      }
    }
    return undefined;
  }

  public part2(): number {
    const lines = this.readFileLines(this.filePath);
    return this.sumPart2CalibrationValues(lines);
  }

  private sumPart2CalibrationValues(lines: string[]): number {
    let sum = 0;
    for (const line of lines) {
      sum += this.getPart2CalibrationValue(line);
    }
    return sum;
  }

  /**
   * Returns 0 if there are no digit characters on the line.
   */
  private getPart2CalibrationValue(line: string): number {
    const firstDigitChar = this.searchPart2FirstDigitChar(line);
    if (firstDigitChar === undefined) {
      return 0;
    }
    const lastDigitChar = this.searchPart2LastDigitChar(line);
    if (lastDigitChar === undefined) {
      return 0;
    }
    return parseInt(firstDigitChar + lastDigitChar);
  }

  private searchPart2FirstDigitChar(line: string): string | undefined {
    for (let i = 0; i < line.length; i++) {
      const char = line.charAt(i);
      const charIsDigit = this.checkCharIsDigit(char);
      if (charIsDigit) {
        return char;
      }
      const digitChar = this.searchDigitCharAsSpelledDigit(line, i);
      if (digitChar !== undefined) {
        return digitChar;
      }
    }
    return undefined;
  }

  private searchPart2LastDigitChar(line: string): string | undefined {
    for (let i = line.length - 1; i >= 0; i--) {
      const char = line.charAt(i);
      const charIsDigit = this.checkCharIsDigit(char);
      if (charIsDigit) {
        return char;
      }
      const digitChar = this.searchDigitCharAsSpelledDigit(line, i);
      if (digitChar !== undefined) {
        return digitChar;
      }
    }
    return undefined;
  }

  private searchDigitCharAsSpelledDigit(
    line: string,
    position: number
  ): string | undefined {
    for (const [
      spelledDigit,
      digitChar,
    ] of Day1.digitCharBySpelledDigit.entries()) {
      if (line.startsWith(spelledDigit, position)) {
        return digitChar;
      }
    }
    return undefined;
  }
}

const part1TestFilePath = process.cwd() + '/src/day1/test-input.txt';
const part2TestFilePath = process.cwd() + '/src/day1/part-two-test-input.txt';
const filePath = process.cwd() + '/src/day1/input.txt';

const part1TestDay1 = new Day1(part1TestFilePath);
console.log(`Part 1 test result: ${part1TestDay1.part1()}`); // 142

const part2TestDay1 = new Day1(part2TestFilePath);
console.log(`Part 2 test result: ${part2TestDay1.part2()}`); // 281

const day1 = new Day1(filePath);
console.log(`Part 1 result: ${day1.part1()}`); // 54573
console.log(`Part 2 result: ${day1.part2()}`); // 54591
