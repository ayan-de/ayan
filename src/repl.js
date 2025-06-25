const repl = require("node:repl");
const { spawn } = require("node:child_process");
const path = require("node:path");

const yellow = "\x1b[33m";
const reset = "\x1b[0m";
const promptSymbol = `${yellow}λyan${reset} > `;

const replServer = repl.start({
  prompt: promptSymbol,
  useGlobal: true,
  input: process.stdin,
  output: process.stdout,
});

replServer.defineCommand("runapi", {
  help: "Run the API test using index.js",
  action(input) {
    const args = input.trim().split(" ").filter(Boolean);
    const command = ["dist/index.js", ...args];

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
