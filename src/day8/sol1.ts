import { readFileLines } from '../utils.js';

const instructionToNodeId = {
  L: 'leftId',
  R: 'rightId',
} as const;

class Node {
  readonly id: string;
  readonly leftId: string;
  readonly rightId: string;

  constructor(id: string, leftNodeId: string, rightNodeId: string) {
    this.id = id;
    this.leftId = leftNodeId;
    this.rightId = rightNodeId;
  }
}

main();

function main() {
  // const inputPath = process.cwd() + '/src/day8/test-input.txt'; // 6 6
  // const inputPath = process.cwd() + '/src/day8/part-two-test-input.txt'; // X 6
  const inputPath = process.cwd() + '/src/day8/input.txt'; // 16343 15299095336639

  const l = readFileLines(inputPath);
  const [i, n] = toInstructionsAndNodes(l);

  console.time('partOne');
  const c = countSteps(i, n);
  console.log(c);
  console.timeEnd('partOne');

  console.time('partTwo');
  const c2 = countTotalSteps(i, n);
  console.log(c2);
  console.timeEnd('partTwo');
}

function toInstructionsAndNodes(
  lines: string[]
): [string, { [id: string]: Node }] {
  const instructions = lines.shift()!;
  lines.shift()!;
  const nodes: { [id: string]: Node } = {};
  for (const l of lines) {
    const [id, s] = l.split(' = ');
    const [leftNodeId, rightNodeId] = s.slice(1, -1).split(', ');
    nodes[id] = new Node(id, leftNodeId, rightNodeId);
  }
  return [instructions, nodes];
}

function countSteps(instructions: string, nodes: { [id: string]: Node }) {
  let count = 0;
  let id = 'AAA';
  while (id !== 'ZZZ') {
    const instruction = instructions[count % instructions.length] as 'L' | 'R';
    count++;
    const node = nodes[id];
    id = node[instructionToNodeId[instruction]];
  }
  return count;
}

function countTotalSteps(instructions: string, nodes: { [id: string]: Node }) {
  const aNodeIds = getANodes(nodes);
  const steps: number[] = [];
  for (const id of aNodeIds) {
    const c = countSteps2(id, instructions, nodes);
    steps.push(c);
  }
  if (steps.length === 1) {
    return steps[0];
  }
  let count = lcm(steps[0], steps[1]);
  for (let i = 2; i < steps.length; i++) {
    count = lcm(count, steps[i]);
  }
  return count;
}

function countSteps2(
  nodeId: string,
  instructions: string,
  nodes: { [id: string]: Node }
): number {
  let count = 0;
  let id = nodeId;
  while (!isZNodeId(id)) {
    const instruction = instructions[count % instructions.length] as 'L' | 'R';
    count++;
    const node = nodes[id];
    id = node[instructionToNodeId[instruction]];
  }
  return count;
}

function getANodes(nodes: { [id: string]: Node }): string[] {
  const aNodeIds: string[] = [];
  for (const id in nodes) {
    if (id.slice(-1) === 'A') {
      aNodeIds.push(id);
    }
  }
  return aNodeIds;
}

function isZNodeId(id: string): boolean {
  if (id.slice(-1) === 'Z') {
    return true;
  }
  return false;
}

function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

function gcd(a: number, b: number): number {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}
