export class Solution {
  public xSolution: number[][];
  public ySolution: number[][];

  constructor(xSolution?: number[][], ySolution?: number[][]) {
    this.xSolution = xSolution;
    this.ySolution = ySolution;
  }

  public static parseSolution(): Solution {
    return new Solution();
  }
}
