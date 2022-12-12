# 🎄 Advent of Code 2022 - day 12 🎄

## Info

Task description: [link](https://adventofcode.com/2022/day/12)

## Notes

I went with a DFS with Backtracking approach here, even though BFS was clearly better (I just was not thinking that BFS would solve the problem due to early morning brain).

Part 2 seemed specifically design to prevent DFS from working, but I added a little optimization which saved some repeat work by memoizing `minSteps[x][y]` to know the minimum number of steps up to `x,y` that has been checked so far. My solution gets Part 2 answer in 14 seconds which is not good but still worked.
