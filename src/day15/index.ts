import run from "aocrunner";
import _ from "lodash";

interface Point {
  x: number;
  y: number;
}
interface Sensor {
  x: number;
  y: number;
  distance: number; // distance to its beacon
}

const parseInput = (rawInput: string) => {
  const positionRegex = /x=(-?\d+), y=(-?\d+)/;
  const input = rawInput.split("\n").map((line) => {
    const [_, sensorStr, beaconStr] = line.split("at ");
    const match1 = sensorStr.match(positionRegex);
    const match2 = beaconStr.match(positionRegex);
    if (match1 && match2) {
      const sensorX = parseInt(match1[1], 10);
      const sensorY = parseInt(match1[2], 10);
      const beaconX = parseInt(match2[1], 10);
      const beaconY = parseInt(match2[2], 10);
      return { sensorX, sensorY, beaconX, beaconY };
    } else {
      console.error(sensorStr, match1, beaconStr, match2);
      throw new Error("parsing error");
    }
  });
  const beacons: Point[] = [];
  const sensors: Sensor[] = [];
  let maxX = 0;
  let minX = Infinity;
  let maxY = 0;
  let minY = Infinity;
  input.forEach((line) => {
    const { beaconX, beaconY, sensorX, sensorY } = line;
    const beacon = { x: beaconX, y: beaconY };
    const sensor = { x: sensorX, y: sensorY };
    beacons.push(beacon);
    const distance = manhattanDistance(sensor, beacon);
    sensors.push({ ...sensor, distance });
    if (Math.min(sensorX, beaconX) < minX) {
      minX = Math.min(sensorX, beaconX);
    }
    if (Math.max(sensorX, beaconX) > maxX) {
      maxX = Math.max(sensorX, beaconX);
    }
    if (Math.min(sensorY, beaconY) < minY) {
      minY = Math.min(sensorY, beaconY);
    }
    if (Math.max(sensorY, beaconY) > maxY) {
      maxY = Math.max(sensorY, beaconY);
    }
  });
  return {
    beacons: [...beacons],
    sensors: [...sensors],
    maxX,
    maxY,
    minX,
    minY,
  };
};

const manhattanDistance = (p1: Point, p2: Point): number => {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
};

const part1 = (rawInput: string) => {
  const { sensors, beacons } = parseInput(rawInput);
  const example = beacons.length === 14;
  const rowY = example ? 10 : 2000000;
  let nonBeaconX = new Set<number>();
  for (let i = 0; i < sensors.length; i++) {
    const sensor = sensors[i];
    const distance = sensor.distance;
    // check from sensor y position up to maximum possible y value given manhattan distance
    for (let y = sensor.y - distance; y <= sensor.y + distance; y++) {
      if (y === rowY) {
        // limits search to possible xs given manhattan distance from sensor
        const diff = Math.abs(rowY - sensor.y);
        for (
          let x = sensor.x - distance + diff;
          x <= sensor.x + distance - diff;
          x++
        ) {
          nonBeaconX.add(x);
        }
      }
    }
  }
  for (const beacon of beacons) {
    if (beacon.y === rowY) {
      nonBeaconX.delete(beacon.x);
    }
  }
  return nonBeaconX.size;
};

const part2 = (rawInput: string) => {
  const { sensors } = parseInput(rawInput);
  const example = sensors.length === 14;
  const MAX_VAL = example ? 20 : 4000000;
  for (const sensor of sensors) {
    // Search only a limited set of candidate x,y values (the outer edge of the diamond formed by manhattan "radius")
    // Additionally, x has to be between 0 and MAX_VAL which limits the search further.
    // for each sensor, we only need to check the x values on either side of its manhattan distance radius.
    for (
      let x = Math.max(0, sensor.x - sensor.distance - 1);
      x <= Math.min(MAX_VAL, sensor.x + sensor.distance + 1);
      x++
    ) {
      const diff = Math.abs(x - sensor.x); // x distance can be subtracted from total distance to get Y differential
      // There are only 2 y values that intersect with a given X value on the outer edge of the diamond.
      const possibleY = [
        sensor.y - (sensor.distance - 1 - diff),
        sensor.y + (sensor.distance + 1 - diff),
      ];
      for (let y of possibleY) {
        if (y > MAX_VAL) {
          // console.log('skipping ', x, y, sensor);
          continue;
        }
        // console.log('checking ', x, y, sensor);

        let beaconCanBeHere = true;
        for (const sensor2 of sensors) {
          const distance = manhattanDistance({ x, y }, sensor2);
          if (distance <= sensor2.distance) {
            // console.log(`\t sensor is ${distance} away from ${x}, ${y}, but ${sensor2.distance} from its beacon`);
            beaconCanBeHere = false;
            break;
          }
        }
        // found beacon at x,y, which is outside the range that would've been detected by all sensors
        if (beaconCanBeHere) {
          console.log(`found answer at ${x}, ${y}`);
          return x * 4000000 + y;
        }
      }
    }
  }
  throw new Error("did not find answer");
};

// brute force idea: can BFS from every sensor (or every beacon) to mark all places without beacons. what could go wrong.
// turns out this doesn't even run for Part 1 input, so I gave up on this solution.
// const bruteForceAttempt = (rawInput: string) => {
//   const { sensors, beacons, minX, minY, maxX, maxY } = parseInput(rawInput);
//   console.log({ minX, minY, maxX, maxY });
//   // basic idea
//   // for each x in rowY, if it is in the path between any sensor and its beacon, then we know it cannot have a beacon.
//   const grid: { [key: string]: "S" | "B" | "#" } = {};
//   beacons.forEach((b) => (grid[`${b.x},${b.y}`] = "B"));
//   sensors.forEach((s) => (grid[`${s.x},${s.y}`] = "S"));
//   const neighbors = [...sensors];
//   const delta = [
//     { x: 1, y: 0 },
//     { x: -1, y: 0 },
//     { x: 0, y: 1 },
//     { x: 0, y: -1 },
//   ];
//   while (neighbors.length > 0) {
//     const point = neighbors.shift()!;
//     grid[`${point.x},${point.y}`] = "#";
//     for (const dp of delta) {
//       const target = { x: point.x + dp.x, y: point.y + dp.y };
//       if (
//         !grid[`${target.x},${target.y}`] &&
//         target.x >= minX &&
//         target.y >= minY &&
//         target.x <= maxX &&
//         target.y <= maxY
//       ) {
//         neighbors.push(target);
//       }
//     }
//   }
//   const example = beacons.length === 14;
//   const rowY = example ? 10 : 2000000;
//   let nonBeaconCount = 0;
//   for (let x = minX; x <= maxX; x++) {
//     if (grid[`${x},${rowY}`] === "#") {
//       nonBeaconCount++;
//     }
//   }
//   return nonBeaconCount;
// }

const exampleInput = `
Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3
`;

run({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 26,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 56000011,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
