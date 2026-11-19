// Prints the preview deployment URL for the current commit (Vercel or any host that
// reports GitHub Deployments), waiting until it's ready.
//
//   npm run preview-url                         # base preview URL
//   npm run preview-url -- --slug flow-field    # direct link to a prototype
//   npm run preview-url -- --timeout 900        # seconds to wait (default 600)
import { execFileSync } from "node:child_process";

const argv = process.argv.slice(2);
const flag = (name: string) => {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : undefined;
};
const slug = flag("--slug");
const timeoutS = Number(flag("--timeout") ?? 600);

const sh = (cmd: string, args: string[]) => execFileSync(cmd, args, { encoding: "utf8" }).trim();
const gh = <T,>(path: string): T => JSON.parse(sh("gh", ["api", path])) as T;

type Deployment = { id: number; statuses_url: string; environment: string };
type Status = { state: string; environment_url?: string; target_url?: string };

const sha = sh("git", ["rev-parse", "HEAD"]);
const deadline = Date.now() + timeoutS * 1000;
process.stderr.write(`Waiting for a preview deployment of ${sha.slice(0, 7)}…\n`);

while (Date.now() < deadline) {
  const deployments = gh<Deployment[]>(`repos/{owner}/{repo}/deployments?sha=${sha}`);
  for (const d of deployments) {
    const [latest] = gh<Status[]>(`repos/{owner}/{repo}/deployments/${d.id}/statuses?per_page=1`);
    if (latest?.state === "success" && latest.environment_url) {
      const url = latest.environment_url.replace(/\/$/, "");
      console.log(slug ? `${url}/prototypes/${slug}` : url);
      process.exit(0);
    }
    if (latest?.state === "failure" || latest?.state === "error") {
      console.error(`Deployment ${d.environment} failed: ${latest.target_url ?? ""}`);
      process.exit(1);
    }
  }
  await new Promise((r) => setTimeout(r, 10_000));
}

console.error("Timed out. Is the repo connected to Vercel (or another host that reports deployments)?");
process.exit(1);
