import run from "aocrunner";
import _ from "lodash";

interface Valve {
  name: string;
  flowRate: number;
  neighbors: string[];
}

const parseInput = (rawInput: string): Valve[] => {
  // e.g. Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
  return rawInput
    .split("\n")
    .map((line) =>
      line.match(
        /Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (.+)/,
      ),
    )
    .filter((match) => match && match[1] && match[2] && match[3])
    .map((match) => ({
      name: match![1],
      flowRate: parseInt(match![2]),
      neighbors: match![3].split(", "),
    }));
};

interface DfsIO {
  graph: { [key: string]: Valve };
  time: number;
  activeValves: Set<Valve>;
  releasedSteam: number;
  path: string[];
  // goal is to try to turn on all valves in minimum time, or most released steam in 30 min
  minTime: number;
  minTimeState?: DfsIO;
  maxReleasedSteam: number;
  maxReleasedState?: DfsIO;
}

function advanceTime(io: DfsIO, multiplier: 1 | -1) {
  io.time += 1 * multiplier;
  for (const valve of io.activeValves) {
    io.releasedSteam += io.graph[valve.name].flowRate * multiplier;
  }
}

function backtrack(io: DfsIO, current: Valve, turnedOn: boolean) {
  if (turnedOn) {
    io.activeValves.delete(current);
    advanceTime(io, -1); // advance time backward to turn off valve
  }
  advanceTime(io, -1); // advance time backward to move away from current node
  io.path.pop();
}

function dfsWithBacktrack(current: Valve, io: DfsIO, last?: Valve) {
  // for a valve that has not been turned on, we have two options:
  // either turn it on now, or ignore it and move to a neighbor (which can be better if neighbor leads to faster release of steam).
  // we have to try both!
  const turnOnOptions =
    !io.activeValves.has(current) && current.flowRate > 0
      ? [true, false]
      : [false];
  for (const turnedOn of turnOnOptions) {
    io.path.push(current.name);
    advanceTime(io, 1); // advance time to move here

    if (turnedOn) {
      advanceTime(io, 1); // advance time to turn on valve
      io.activeValves.add(current);
    }

    // if we have already exceeded known best path to turn everything on, there's no point in continuing.
    if (
      (io.time > io.minTime &&
        io.releasedSteam < io.minTimeState!.releasedSteam) ||
      (io.releasedSteam < io.maxReleasedSteam &&
        io.time > io.maxReleasedState!.time)
    ) {
      // console.log('abandoning path that is taking too much time', io.time);
      backtrack(io, current, turnedOn);
      continue;
    }

    // Stop after unreasonable path lengths
    if (io.path.length > 30) {
      // console.log('abandoning path that is too long', io.path.length);
      backtrack(io, current, turnedOn);
      continue;
    }

    // If all valves with >0 flow rate are turned on, we are at end of a path.
    // TODO: can precalculate this filter to save some time, but shouldn't matter.
    if (
      io.activeValves.size ===
      Object.keys(io.graph).filter((a) => io.graph[a].flowRate > 0).length
    ) {
      console.log(io.path);
      // Record min time to turn on all valves.
      if (io.time < io.minTime) {
        io.minTime = io.time;
        io.minTimeState = _.cloneDeep(io);
      }
      // Record max amount of steam achieved by turning on all valves.
      if (io.releasedSteam > io.maxReleasedSteam) {
        io.maxReleasedSteam = io.releasedSteam;
        io.maxReleasedState = _.cloneDeep(io);
      }
      backtrack(io, current, turnedOn);
      continue;
    }

    const neighbors = [...io.graph[current.name].neighbors];
    neighbors.sort((nameA, nameB) => {
      // prioritize neighbors that we haven't turned on already
      if (
        io.activeValves.has(io.graph[nameA]) &&
        !io.activeValves.has(io.graph[nameB])
      ) {
        return 1;
      }
      if (
        !io.activeValves.has(io.graph[nameA]) &&
        io.activeValves.has(io.graph[nameB])
      ) {
        return -1;
      }
      // prioritize neighbors that have highest flow rate
      return io.graph[nameB]?.flowRate - io.graph[nameA]?.flowRate;
    });
    for (const neighbor of neighbors) {
      if (neighbor === last?.name && !turnedOn) {
        // there is never a time we would want to go back where we came from, if we didn't turn on a valve here.
        continue;
      }
      if (!io.graph[neighbor]) {
        throw new Error(`missing neighbor ${neighbor} in graph`);
      }
      dfsWithBacktrack(io.graph[neighbor], io, current);
    }

    backtrack(io, current, turnedOn);
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  input.sort((a, b) => b.flowRate - a.flowRate);
  console.log(input);
  // const example = input.length === 5;
  // AA,DD,CC,BB,AA,II,JJ,II,AA,DD,EE,FF,GG,HH,GG,FF,EE,DD,CC
  const graph: { [key: string]: Valve } = {};
  input.forEach((input) => (graph[input.name] = input));
  const io: DfsIO = {
    graph,
    time: 0,
    activeValves: new Set<Valve>(),
    releasedSteam: 0,
    minTime: Infinity,
    maxReleasedSteam: 0,
    path: [],
  };
  dfsWithBacktrack(graph["AA"], io);
  let option1 = io.minTimeState!;
  while (option1.time < 30) {
    advanceTime(option1, 1);
  }
  let option2 = io.maxReleasedState!;
  while (option2.time < 30) {
    advanceTime(option2, 1);
  }
  console.log(option1.releasedSteam, option2.releasedSteam);
  throw new Error("unfinished");
  return;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  throw new Error("unfinished");
  return;
};

const exampleInput = `
Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II
`;

run({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 1651,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: "",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
