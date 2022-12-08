import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const map = input
    .split("\n")
    .map((line) => line.split("").map((a) => parseInt(a, 10)));
  const counted: boolean[][] = Array.from({ length: map.length }, () =>
    new Array(map[0].length).fill(false),
  );
  let totalCount = 0;
  for (let y = 0; y < map.length; y++) {
    // consider visibility starting from outside left
    let currentlyVisible = -1;
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] > currentlyVisible) {
        currentlyVisible = map[y][x];
        if (!counted[y][x]) {
          totalCount++;
          counted[y][x] = true;
        }
      }
    }
    // consider visibility starting from outside right
    currentlyVisible = -1;
    for (let x = map[0].length - 1; x >= 0; x--) {
      if (map[y][x] > currentlyVisible) {
        currentlyVisible = map[y][x];
        if (!counted[y][x]) {
          totalCount++;
          counted[y][x] = true;
        }
      }
    }
  }
  for (let x = 0; x < map.length; x++) {
    // consider visibility starting from outside top
    let currentlyVisible = -1;
    for (let y = 0; y < map[0].length; y++) {
      if (map[y][x] > currentlyVisible) {
        currentlyVisible = map[y][x];
        if (!counted[y][x]) {
          totalCount++;
          counted[y][x] = true;
        }
      }
    }
    // consider visibility starting from outside bottom
    currentlyVisible = -1;
    for (let y = map.length - 1; y >= 0; y--) {
      if (map[y][x] > currentlyVisible) {
        currentlyVisible = map[y][x];
        if (!counted[y][x]) {
          totalCount++;
          counted[y][x] = true;
        }
      }
    }
  }
  // console.log(map);
  // console.log(counted);
  // console.log(totalCount);
  return totalCount;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const map = input
    .split("\n")
    .map((line) => line.split("").map((a) => parseInt(a, 10)));
  let maxScenicScore = -1;
  for (let y = 0; y < map.length; y++) {
    // consider visibility starting from current tree
    for (let x = 0; x < map[0].length; x++) {
      let currentlyVisible = map[y][x];
      let seenRight = 0;
      for (let x2 = x + 1; x2 < map.length; x2++) {
        seenRight++;
        if (map[y][x2] >= currentlyVisible) {
          break;
        }
      }
      let seenLeft = 0;
      for (let x2 = x - 1; x2 >= 0; x2--) {
        seenLeft++;
        if (map[y][x2] >= currentlyVisible) {
          break;
        }
      }
      let seenBottom = 0;
      for (let y2 = y + 1; y2 < map.length; y2++) {
        seenBottom++;
        if (map[y2][x] >= currentlyVisible) {
          break;
        }
      }
      let seenTop = 0;
      for (let y2 = y - 1; y2 >= 0; y2--) {
        seenTop++;
        if (map[y2][x] >= currentlyVisible) {
          break;
        }
      }
      const scenicScore = seenLeft * seenRight * seenBottom * seenTop;
      if (scenicScore > maxScenicScore) {
        maxScenicScore = scenicScore;
      }
      // console.log({x,y,currentlyVisible,seenRight,seenLeft,seenBottom, seenTop,scenicScore});
    }
  }
  // console.log(maxScenicScore);
  return maxScenicScore;
};

const exampleInput = `
30373
25512
65332
33549
35390
`;

run({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 8,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
