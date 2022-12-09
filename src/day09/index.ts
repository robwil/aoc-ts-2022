import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const visited: { [key: string]: boolean } = {};
  let headX = 0;
  let headY = 0;
  let tailX = 0;
  let tailY = 0;
  visited[`${tailX},${tailY}`] = true;
  input.split("\n").forEach((line) => {
    const [direction, amountStr] = line.split(" ");
    const amount = parseInt(amountStr, 10);
    let deltaX = 0;
    let deltaY = 0;
    if (direction === "L") {
      deltaX = -1;
    } else if (direction === "R") {
      deltaX = 1;
    } else if (direction === "U") {
      deltaY = 1;
    } else if (direction === "D") {
      deltaY = -1;
    }
    for (let i = 0; i < amount; i++) {
      headX += deltaX;
      headY += deltaY;
      // If the head is ever two steps directly up, down, left, or right from the tail, the tail must also move one step in that direction so it remains close enough:
      if (
        (headX === tailX || headY === tailY) &&
        (Math.abs(headX - tailX) === 2 || Math.abs(headY - tailY) === 2)
      ) {
        tailX += deltaX;
        tailY += deltaY;
      }
      // if the head and tail aren't touching and aren't in the same row or column, the tail always moves one step diagonally to keep up.
      // It has to be diagonal based on the valid movements, so we just need to check if it is more than 2 away.
      else if (Math.abs(headX - tailX) > 1 || Math.abs(headY - tailY) > 1) {
        if (deltaX !== 0) {
          tailX += deltaX;
          tailY = headY;
        } else if (deltaY !== 0) {
          tailX = headX;
          tailY += deltaY;
        }
      }
      visited[`${tailX},${tailY}`] = true;
    }
    // console.log({headX, headY, tailX, tailY});
  });
  // console.log(visited);
  const uniqueVisited = Object.keys(visited).length;
  return uniqueVisited;
};

interface Point {
  x: number;
  y: number;
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const visited: { [key: string]: boolean } = {};
  const knots: Point[] = [];
  for (let i = 0; i < 10; i++) {
    knots.push({ x: 0, y: 0 });
  }
  visited[`${knots[9].x},${knots[9].y}`] = true;
  input.split("\n").forEach((line) => {
    const [direction, amountStr] = line.split(" ");
    const amount = parseInt(amountStr, 10);
    let deltaX = 0;
    let deltaY = 0;
    if (direction === "L") {
      deltaX = -1;
    } else if (direction === "R") {
      deltaX = 1;
    } else if (direction === "U") {
      deltaY = 1;
    } else if (direction === "D") {
      deltaY = -1;
    }
    for (let _i = 0; _i < amount; _i++) {
      // knot[0] is the head
      knots[0].x += deltaX;
      knots[0].y += deltaY;
      for (let i = 1; i < knots.length; i++) {
        // If the knot is ever two steps directly up, down, left, or right from the next knot, the next knot must also move one step in that direction so it remains close enough:
        if (
          (knots[i - 1].x === knots[i].x || knots[i - 1].y === knots[i].y) &&
          (Math.abs(knots[i - 1].x - knots[i].x) === 2 ||
            Math.abs(knots[i - 1].y - knots[i].y) === 2)
        ) {
          // DIFF FROM PART 1: can't just assume deltaX/Y here because the way prev knot just moved may have been totally different
          if (knots[i - 1].x - knots[i].x === 2) {
            // last knot is 2 to the right, so let's move one right
            knots[i].x += 1;
          } else if (knots[i - 1].x - knots[i].x === -2) {
            // last knot is 2 to the left, so let's move one left
            knots[i].x -= 1;
          } else if (knots[i - 1].y - knots[i].y === 2) {
            // last knot is 2 to the top, so let's move one up
            knots[i].y += 1;
          } else if (knots[i - 1].y - knots[i].y === -2) {
            // last knot is 2 to the bottom, so let's move one down
            knots[i].y -= 1;
          }
        }
        // if the head and tail aren't touching and aren't in the same row or column, the tail always moves one step diagonally to keep up.
        // It has to be diagonal based on the valid movements, so we just need to check if it is more than 2 away.
        else if (
          Math.abs(knots[i - 1].x - knots[i].x) > 1 ||
          Math.abs(knots[i - 1].y - knots[i].y) > 1
        ) {
          // DIFF FROM PART 1: can't just use the = assignment here, because it "cascades" through all the knots and makes them jump.
          // We need to be more verbose and handle the movement 1x in the direction of X / Y of the prev knot
          // Also, we can't even use deltaX/Y because the prev knot's movement may have nothing to do with deltaX/Y.

          if (knots[i - 1].x - knots[i].x > 0) {
            // last knot is 1 to the right, so let's move one right
            knots[i].x += 1;
          } else if (knots[i - 1].x - knots[i].x < 0) {
            // last knot is 1 to the left, so let's move one left
            knots[i].x -= 1;
          }
          if (knots[i - 1].y - knots[i].y > 0) {
            // last knot is 1 to the top, so let's move one up
            knots[i].y += 1;
          } else if (knots[i - 1].y - knots[i].y < 0) {
            // last knot is 2 to the bottom, so let's move one down
            knots[i].y -= 1;
          }
        }
        visited[`${knots[9].x},${knots[9].y}`] = true;
      }
      // console.log({headX, headY, tailX, tailY});
    }
  });
  // console.log(knots);
  // console.log(visited);
  const uniqueVisited = Object.keys(visited).length;
  return uniqueVisited;
};

const exampleInput = `
R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2
`;

const exampleInput2 = `
R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20
`;

run({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 1,
      },
      {
        input: exampleInput2,
        expected: 36,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
