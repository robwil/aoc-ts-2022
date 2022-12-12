import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput: string) => rawInput;

interface DfsIO {
  map: string[][];
  visited: boolean[][];
  steps: number;
  minSteps: number[][];
  minEndSteps: number;
}

function dfsWithBacktrack(x: number, y: number, io: DfsIO) {
  if (io.minSteps[y][x] <= io.steps + 1) {
    // already explored this path from this number of steps
    return;
  }
  io.visited[y][x] = true;
  io.steps++;
  io.minSteps[y][x] = io.steps;
  if (io.map[y][x] === "E") {
    if (io.steps < io.minEndSteps) {
      io.minEndSteps = io.steps;
    }
    io.steps--;
    io.visited[y][x] = false;
    return true;
  }
  let z = io.map[y][x].charCodeAt(0);
  if (io.map[y][x] === "S") {
    z = "a".charCodeAt(0);
  }
  const neighbors = [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
  ];
  for (const neighbor of neighbors) {
    const [x2, y2] = neighbor;
    if (y2 < 0 || x2 < 0 || y2 >= io.map.length || x2 >= io.map[y2].length) {
      continue;
    }
    let z2 = io.map[y2][x2].charCodeAt(0);
    if (io.map[y2][x2] === "E") {
      z2 = "z".charCodeAt(0);
    }
    if (io.visited[y2][x2]) {
      continue;
    }
    if (z2 <= z + 1) {
      if (dfsWithBacktrack(x2, y2, io)) {
        break;
      }
    }
  }
  // unsetting visited here is effectively backtracking
  io.visited[y][x] = false;
  io.steps--;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const map = input.split("\n").map((line) => line.split(""));
  const visited: boolean[][] = Array.from({ length: map.length }, () =>
    new Array(map[0].length).fill(false),
  );
  const minSteps: number[][] = Array.from({ length: map.length }, () =>
    new Array(map[0].length).fill(1e99),
  );
  let startX = 0,
    startY = 0;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === "S") {
        startX = x;
        startY = y;
      }
    }
  }
  const io = { map, visited, steps: -1, minSteps, minEndSteps: 1e99 };
  dfsWithBacktrack(startX, startY, io);
  return io.minEndSteps;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const map = input.split("\n").map((line) => line.split(""));
  const visited: boolean[][] = Array.from({ length: map.length }, () =>
    new Array(map[0].length).fill(false),
  );
  const minSteps: number[][] = Array.from({ length: map.length }, () =>
    new Array(map[0].length).fill(1e99),
  );
  let starts = [];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === "S" || map[y][x] === "a") {
        starts.push([x, y]);
      }
    }
  }
  let realMin = 1e99;
  for (const start of starts) {
    const io = {
      map,
      visited: _.cloneDeep(visited),
      steps: -1,
      minSteps: _.cloneDeep(minSteps),
      minEndSteps: 1e99,
    };
    const [x, y] = start;
    dfsWithBacktrack(x, y, io);
    if (io.minEndSteps < realMin) {
      realMin = io.minEndSteps;
    }
  }
  return realMin;
};

const exampleInput = `
Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi
`;

run({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 31,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 29,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
