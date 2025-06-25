import { start, REPLServer } from "node:repl";
import { spawn } from "node:child_process";
import path from "node:path";

const yellow = "\x1b[33m";
const reset = "\x1b[0m";
const promptSymbol = `${yellow}λyan${reset} > `;

const replServer: REPLServer = start({
  prompt: promptSymbol,
  useGlobal: true,
  input: process.stdin,
  output: process.stdout,
});

replServer.defineCommand("run", {
  help: "Run the API test using index.js",
  action(this: REPLServer, input: string) {
    const args = input.trim().split(" ").filter(Boolean);
    const indexPath = path.join(__dirname, "index.js");  // ✅ absolute path
    const command = [indexPath, ...args];
    
    const proc = spawn("node", command, {
      stdio: "inherit",
    });

    proc.on("close", () => {
      this.displayPrompt();
    });
  },
});

replServer.on("exit", () => {
  console.clear();
  process.exit(0);
});
