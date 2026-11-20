import { NOTES, RUN_SEEDS, SUITES } from "./data";
import type { Classified, EvalCase } from "./types";
import { createRng } from "./utils";

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/** Baseline scores are fixed; each candidate run perturbs them with its own seed. */
export function generateCases(run: string): EvalCase[] {
  const baseRng = createRng(0.31);
  const runRng = createRng(RUN_SEEDS[run] ?? RUN_SEEDS.b);
  const cases: EvalCase[] = [];
  let n = 0;
  for (const [suite, names] of Object.entries(SUITES)) {
    for (const name of names) {
      const baseline = baseRng() < 0.18 ? 0.25 + baseRng() * 0.4 : 0.62 + baseRng() * 0.38;
      const big = runRng() < 0.16;
      const delta = big ? (runRng() < 0.55 ? -1 : 1) * (0.25 + runRng() * 0.3) : (runRng() - 0.5) * 0.12;
      cases.push({
        id: `${suite}/${name}`,
        name,
        suite,
        baseline: clamp(baseline),
        candidate: clamp(baseline + delta),
        note: NOTES[n % NOTES.length],
      });
      n += 1;
    }
  }
  return cases;
}

/**
 * A flip crosses the pass bar. It only counts as a regression or fix when the score moved
 * at least `noiseFloor`; smaller crossings are noise.
 */
export function classify(cases: EvalCase[], passBar: number, noiseFloor: number): Classified[] {
  return cases.map((c) => {
    const delta = c.candidate - c.baseline;
    const basePass = c.baseline >= passBar;
    const candPass = c.candidate >= passBar;
    let kind: Classified["kind"] = "unchanged";
    if (basePass !== candPass) {
      if (Math.abs(delta) < noiseFloor) kind = "noise";
      else kind = basePass ? "regression" : "fix";
    }
    return { ...c, kind, delta };
  });
}

export function summarize(classified: Classified[], passBar: number) {
  const count = (kind: Classified["kind"]) => classified.filter((c) => c.kind === kind).length;
  const passRate = (key: "baseline" | "candidate") =>
    classified.filter((c) => c[key] >= passBar).length / classified.length;
  return {
    regressions: count("regression"),
    fixes: count("fix"),
    noise: count("noise"),
    unchanged: count("unchanged"),
    baselinePass: passRate("baseline"),
    candidatePass: passRate("candidate"),
  };
}
