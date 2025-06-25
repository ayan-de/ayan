import { start, REPLServer } from "node:repl";
import { spawn } from "node:child_process";
import path from "node:path";

const yellow = "\x1b[33m";
const reset = "\x1b[0m";
const green = "\x1b[32m";
const red = "\x1b[31m";
const promptSymbol = `${yellow}λyan${reset} > `;


console.log(`${green}Welcome to λyan REPL!${reset}`);
console.log(`${green}Type .help for available commands${reset}`);
console.log(`${green}Type .exit to quit${reset}\n`);

const replServer: REPLServer = start({
  prompt: promptSymbol,
  useGlobal: false,
  input: process.stdin,
  output: process.stdout,
      ignoreUndefined: true,

});

replServer.defineCommand("run", {
    help: "Run the API test using index.js - Usage: .run [flags] (e.g., .run -h localhost -p 8080 -a /api -m POST)",
    action(this: REPLServer, input: string) {
        const args = input.trim().split(" ").filter(Boolean);
        const indexPath = path.join(__dirname, "index.js");
        
        if (!require("fs").existsSync(indexPath)) {
            console.log(`${red}Error: ${indexPath} not found. Make sure to compile TypeScript files first.${reset}`);
            this.displayPrompt();
            return;
        }
        
        console.log(`${green}Running API test with args: ${args.join(" ")}${reset}`);
        
        const proc = spawn("node", [indexPath, ...args], {
            stdio: "inherit",
        });
        
        proc.on("error", (error) => {
            console.log(`${red}Failed to start process: ${error.message}${reset}`);
            this.displayPrompt();
        });
        
        proc.on("close", (code) => {
            if (code !== 0) {
                console.log(`${red}Process exited with code ${code}${reset}`);
            }
            this.displayPrompt();
        });
    },
});

// Add a clear command
replServer.defineCommand("clear", {
    help: "Clear the terminal screen",
    action(this: REPLServer) {
        console.clear();
        console.log(`${green}Welcome to λyan REPL!${reset}`);
        console.log(`${green}Type .help for available commands${reset}`);
        console.log(`${green}Type .exit to quit${reset}\n`);
        this.displayPrompt();
    },
});

// Add help command override
replServer.defineCommand("help", {
    help: "Show available commands",
    action(this: REPLServer) {
        console.log(`${green}Available commands:${reset}`);
        console.log("  .run [flags]  - Run API test (e.g., .run -h localhost -p 8080)");
        console.log("  .clear        - Clear the screen");
        console.log("  .help         - Show this help");
        console.log("  .exit         - Exit the REPL");
        console.log(`${green}Flags for .run command:${reset}`);
        console.log("  -h <host>     - Set host (default: localhost)");
        console.log("  -p <port>     - Set port (default: 80)");
        console.log("  -a <path>     - Set API path (default: /)");
        console.log("  -m <method>   - Set HTTP method (default: GET)");
        console.log("  -https        - Use HTTPS instead of HTTP");
        this.displayPrompt();
    },
});

// Handle REPL server events properly
replServer.on("exit", () => {
    console.log(`\n${green}Goodbye!${reset}`);
    process.exit(0);
});

// Handle process signals for graceful shutdown
process.on("SIGINT", () => {
    console.log(`\n${yellow}Use .exit to quit${reset}`);
    replServer.displayPrompt();
});

process.on("SIGTERM", () => {
    console.log(`\n${green}Goodbye!${reset}`);
    process.exit(0);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
    console.error(`${red}Uncaught Exception: ${error.message}${reset}`);
    replServer.displayPrompt();
});

process.on("unhandledRejection", (reason) => {
    console.error(`${red}Unhandled Rejection: ${reason}${reset}`);
    replServer.displayPrompt();
});
