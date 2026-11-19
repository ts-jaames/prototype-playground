// Shared helpers for capture scripts: arg parsing, production build, server lifecycle, login.
import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import { randomBytes } from "node:crypto";
import process from "node:process";

import type { BrowserContext } from "playwright";

export type Args = { slugs: string[]; missing: boolean; build: boolean; port: number };

/** `--slug a --slug b`, `--slug a,b`, `--missing`, `--no-build`, `--port 3999`, or bare slugs. */
export function parseArgs(argv = process.argv.slice(2)): Args {
  const args: Args = { slugs: [], missing: false, build: true, port: 3999 };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--slug" || arg === "-s") args.slugs.push(...(argv[++i] ?? "").split(","));
    else if (arg.startsWith("--slug=")) args.slugs.push(...arg.slice(7).split(","));
    else if (arg === "--missing") args.missing = true;
    else if (arg === "--no-build") args.build = false;
    else if (arg === "--port") args.port = Number(argv[++i]);
    else if (!arg.startsWith("-")) args.slugs.push(...arg.split(","));
    else throw new Error(`Unknown flag: ${arg}`);
  }
  args.slugs = args.slugs.map((s) => s.trim()).filter(Boolean);
  return args;
}

export function build() {
  console.log("Building production bundle…");
  const result = spawnSync("npx", ["next", "build"], { stdio: "inherit" });
  if (result.status !== 0) throw new Error("next build failed");
}

export type Server = { url: string; password: string; stop: () => void };

/** Starts `next start` with a throwaway password so the production gate can be passed. */
export async function startServer(port: number): Promise<Server> {
  const password = randomBytes(12).toString("hex");
  const child: ChildProcess = spawn("npx", ["next", "start", "-p", String(port)], {
    env: { ...process.env, PLAYGROUND_PASSWORD: password },
    stdio: ["ignore", "pipe", "pipe"],
    detached: true,
  });
  let output = "";
  child.stdout?.on("data", (d) => (output += d));
  child.stderr?.on("data", (d) => (output += d));

  const url = `http://localhost:${port}`;
  const stop = () => {
    try {
      if (child.pid) process.kill(-child.pid, "SIGTERM");
    } catch {
      // already exited
    }
  };
  process.on("exit", stop);

  for (let i = 0; i < 60; i++) {
    if (child.exitCode !== null) throw new Error(`next start exited:\n${output}`);
    try {
      const res = await fetch(`${url}/login`);
      if (res.ok) return { url, password, stop };
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  stop();
  throw new Error(`Server did not start on ${url}:\n${output}`);
}

/** Signs the browser context in through the real auth route. */
export async function login(context: BrowserContext, server: Server) {
  const res = await context.request.post(`${server.url}/api/auth`, {
    data: { password: server.password },
  });
  if (!res.ok()) throw new Error(`Login failed: ${res.status()} ${await res.text()}`);
}

/** Forces a theme before any page script runs (next-themes reads localStorage "theme"). */
export async function forceTheme(context: BrowserContext, theme: "light" | "dark") {
  await context.addInitScript((t) => {
    try {
      localStorage.setItem("theme", t);
    } catch {
      // ignore
    }
  }, theme);
}

/** Hides playground chrome (prototype header) so captures show only the prototype. */
export const HIDE_CHROME_CSS = `[data-playground-chrome]{display:none !important}`;

/** Share images show only the subject: no chrome, no control panel. */
export const HIDE_FOR_OG_CSS = `${HIDE_CHROME_CSS}[data-playground-panel]{display:none !important}`;
