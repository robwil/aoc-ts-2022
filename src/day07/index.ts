import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

interface DirectoryInfo {
  totalSize: number;
  totalRecursiveSize?: number;
  files: FileInfo[];
}
interface FileInfo {
  name: string;
  size: number;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");
  const directories = new Set<string>();
  const directoryFiles: { [key: string]: DirectoryInfo } = {};
  let currentDirectory = [""];
  for (const line of lines) {
    if (line.startsWith("$")) {
      if (line.startsWith("$ cd")) {
        const [_prompt, _cd, dir] = line.split(" ");
        if (dir === "/") {
          currentDirectory = [""];
        } else if (dir === "..") {
          currentDirectory.pop();
        } else {
          currentDirectory.push(dir);
          directories.add(currentDirectory.join("/"));
        }
      } else if (line.startsWith("$ ls")) {
        directoryFiles[currentDirectory.join("/")] = {
          totalSize: 0,
          files: [],
        };
      }
    } else {
      // lazily assume that any line not starting with $ is a listing of current directory
      const [maybeSize, name] = line.split(" ");
      if (maybeSize === "dir") {
        // we can ignore directory in listing, since we will always discover it through 'cd' handling code above
        continue;
      }
      const fileInfo: FileInfo = {
        name,
        size: parseInt(maybeSize, 10),
      };
      directoryFiles[currentDirectory.join("/")].files.push(fileInfo);
      directoryFiles[currentDirectory.join("/")].totalSize += fileInfo.size;
    }
  }
  // console.log(directories);
  // console.log(directoryFiles);
  let total = 0;
  for (const directory of directories) {
    const totalSize = [...directories]
      .filter((dir) => dir.startsWith(directory))
      .map((dir) => directoryFiles[dir].totalSize)
      .reduce((currentSum, currentSize) => currentSum + currentSize, 0);
    if (totalSize <= 100000) {
      total += totalSize;
    }
  }
  return total;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");
  const directories = new Set<string>();
  const directoryFiles: { [key: string]: DirectoryInfo } = {};
  let currentDirectory = [""];
  for (const line of lines) {
    if (line.startsWith("$")) {
      if (line.startsWith("$ cd")) {
        const [_prompt, _cd, dir] = line.split(" ");
        if (dir === "/") {
          currentDirectory = [""];
        } else if (dir === "..") {
          currentDirectory.pop();
        } else {
          currentDirectory.push(dir);
          directories.add(currentDirectory.join("/"));
        }
      } else if (line.startsWith("$ ls")) {
        directoryFiles[currentDirectory.join("/")] = {
          totalSize: 0,
          files: [],
        };
      }
    } else {
      // lazily assume that any line not starting with $ is a listing of current directory
      const [maybeSize, name] = line.split(" ");
      if (maybeSize === "dir") {
        // we can ignore directory in listing, since we will always discover it through 'cd' handling code above
        continue;
      }
      const fileInfo: FileInfo = {
        name,
        size: parseInt(maybeSize, 10),
      };
      directoryFiles[currentDirectory.join("/")].files.push(fileInfo);
      directoryFiles[currentDirectory.join("/")].totalSize += fileInfo.size;
    }
  }
  directories.add("/");
  directoryFiles["/"] = directoryFiles[""];
  delete directoryFiles[""];
  for (const directory of directories) {
    const totalRecursiveSize = [...directories]
      .filter((dir) => dir.startsWith(directory))
      .map((dir) => directoryFiles[dir].totalSize)
      .reduce((currentSum, currentSize) => currentSum + currentSize, 0);
    directoryFiles[directory].totalRecursiveSize = totalRecursiveSize;
  }
  // console.log(directories);
  // console.log(directoryFiles);
  const spaceNeeded =
    30000000 - (70000000 - directoryFiles["/"].totalRecursiveSize!);
  let minDeletionCandidate = directoryFiles["/"].totalRecursiveSize!;
  for (const directory of directories) {
    const totalRecursiveSize = directoryFiles[directory].totalRecursiveSize!;
    if (
      totalRecursiveSize >= spaceNeeded &&
      totalRecursiveSize < minDeletionCandidate
    ) {
      // console.log(`Could delete ${directory} for ${totalRecursiveSize}, better than needed ${spaceNeeded}`);
      minDeletionCandidate = totalRecursiveSize;
    }
  }
  return minDeletionCandidate;
};

const exampleInput = `
$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
`;

run({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 95437,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 24933642,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
