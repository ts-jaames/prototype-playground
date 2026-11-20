import { CASE_NAMES } from "./data";
import type { CaseRow, Scenario } from "./types";
import { createRng } from "./utils";

/**
 * Deterministic result matrix. "Broken change": ~40% of cases fail for three consecutive runs
 * (a vertical stripe). "Flaky": some cases fail at random (horizontal speckle).
 * One case always fails, in every scenario.
 */
export function generateResults(scenario: Scenario, runs: number): CaseRow[] {
  const rng = createRng(0.77);
  const brokenFrom = Math.floor(runs * 0.6);
  const flakyEvery = scenario === "flaky" ? 4 : 7;

  return CASE_NAMES.map((id, i) => {
    const alwaysFails = i === 5;
    const flaky = scenario !== "regression" && i % flakyEvery === 3;
    const hitByChange = scenario !== "flaky" && rng() < 0.4;
    const failP = flaky ? 0.4 + rng() * 0.2 : 0.015;

    const results = Array.from({ length: runs }, (_, run) => {
      if (alwaysFails) return false;
      const broken = hitByChange && run >= brokenFrom && run < brokenFrom + 3;
      return !(broken || rng() < failP);
    });
    return { id, results };
  });
}
