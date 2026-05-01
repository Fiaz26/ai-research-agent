/**
 * Universal startup script — works on Glitch, Render, Railway, Fly.io, etc.
 * If no production build exists, it builds first automatically then starts.
 */
import { existsSync } from "fs";
import { execSync, spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distPath = join(__dirname, "dist", "index.cjs");

if (!existsSync(distPath)) {
  console.log("[startup] No production build found — building now...");
  console.log("[startup] This takes 1–2 minutes on first launch.");
  try {
    execSync("npm run build", { stdio: "inherit", cwd: __dirname });
    console.log("[startup] Build complete — starting server...");
  } catch (err) {
    console.error("[startup] Build failed:", err.message);
    process.exit(1);
  }
} else {
  console.log("[startup] Build found — starting server...");
}

const child = spawn("node", [distPath], {
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || "production",
  },
});

child.on("exit", (code) => process.exit(code ?? 0));
