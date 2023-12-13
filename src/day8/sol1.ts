import { readFileSync } from 'fs';

class Node {
  readonly id: string;
  readonly leftNodeId: string;
  readonly rightNodeId: string;

  constructor(id: string, leftNodeId: string, rightNodeId: string) {
    this.id = id;
    this.leftNodeId = leftNodeId;
    this.rightNodeId = rightNodeId;
  }
}

// const filePath = process.cwd() + '/src/day8/test-input.txt';
// const filePath = process.cwd() + '/src/day8/test-input-part-two.txt';
const filePath = process.cwd() + '/src/day8/input.txt'; // 16343 15299095336639

const [instructions, nodes] = getInstructionsAndNodes(filePath);

const nodeById = nodes.reduce((acc: { [id: string]: Node }, node) => {
  acc[node.id] = node;
  return acc;
}, {});

console.time('partOne');
partOne(instructions, nodeById);
console.timeEnd('partOne');

console.time('partTwo');
partTwo(instructions, nodeById);
console.timeEnd('partTwo');

function getInstructionsAndNodes(filePath: string): [string, Node[]] {
  const lines = readFileSync(filePath, 'utf8').split('\n');
  const instructions = lines.shift()!;
  lines.shift();
  lines.pop();

  const nodes: Node[] = [];
  for (const line of lines) {
    const [id, str] = line.split(' = ');
    const [leftNodeId, rightNodeId] = str.slice(1, -1).split(', ');
    nodes.push(new Node(id, leftNodeId, rightNodeId));
  }
  return [instructions, nodes];
}

function partOne(instructions: string, nodeById: { [id: string]: Node }) {
  const nodeIdByInstruction: {
    [instruction: string]: 'leftNodeId' | 'rightNodeId';
  } = Object.freeze({
    L: 'leftNodeId',
    R: 'rightNodeId',
  });

  let step = 0;
  let curNodeId = 'AAA';
  while (curNodeId !== 'ZZZ') {
    const instruction = instructions[step % instructions.length];
    const curNode = nodeById[curNodeId];

    curNodeId = curNode[nodeIdByInstruction[instruction]];
    step++;
  }

  console.log(step);
}

function partTwo(instructions: string, nodeById: { [id: string]: Node }) {
  const nodeIdByInstruction: {
    [instruction: string]: 'leftNodeId' | 'rightNodeId';
  } = Object.freeze({
    L: 'leftNodeId',
    R: 'rightNodeId',
  });
  const aNodeIds = getANodes(nodeById);

  const nodeSteps: number[] = [];
  for (const aNodeId of aNodeIds) {
    let step = 0;
    let curNodeId = aNodeId;
    while (!isZNodeId(curNodeId)) {
      const instruction = instructions[step % instructions.length];
      const curNode = nodeById[curNodeId];

      curNodeId = curNode[nodeIdByInstruction[instruction]];
      step++;
    }
    nodeSteps.push(step);
  }
  // console.log(nodeSteps);

  let lcmValue = lcm(nodeSteps[0], nodeSteps[1]);
  for (let i = 2; i < nodeSteps.length; i++) {
    lcmValue = lcm(lcmValue, nodeSteps[i]);
  }
  console.log(lcmValue);
}

function getANodes(nodeById: { [id: string]: Node }): string[] {
  const aNodeIds: string[] = [];
  for (const id in nodeById) {
    if (id.slice(-1) === 'A') {
      aNodeIds.push(id);
    }
  }
  return aNodeIds;
}

function isZNodeId(nodeId: string): boolean {
  if (nodeId.slice(-1) === 'Z') {
    return true;
  }
  return false;
}

function lcm(a: number, b: number): number {
  const gcdValue = gcd(a, b);
  return (a * b) / gcdValue;
}

function gcd(a: number, b: number): number {
  for (let temp = b; b !== 0; ) {
    b = a % b;
    a = temp;
    temp = b;
  }
  return a;
}
