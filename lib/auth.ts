export const AUTH_COOKIE = "pp_auth";
export const AUTH_MAX_AGE = 60 * 60 * 24 * 30;

/** The gate only runs in production builds (Vercel previews + prod, `next start`). */
export const isGateEnabled = () => process.env.NODE_ENV === "production";

/** Cookie value derived from the password, so changing the password signs everyone out. */
export async function authToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`prototype-playground:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function isValidToken(token: string | undefined): Promise<boolean> {
  const password = process.env.PLAYGROUND_PASSWORD;
  if (!password || !token) return false;
  return safeEqual(token, await authToken(password));
}

export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
