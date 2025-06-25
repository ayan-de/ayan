"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_repl_1 = require("node:repl");
const node_child_process_1 = require("node:child_process");
const node_path_1 = __importDefault(require("node:path"));
const yellow = "\x1b[33m";
const reset = "\x1b[0m";
const promptSymbol = `${yellow}λyan${reset} > `;
const replServer = (0, node_repl_1.start)({
    prompt: promptSymbol,
    useGlobal: true,
    input: process.stdin,
    output: process.stdout,
});
replServer.defineCommand("run", {
    help: "Run the API test using index.js",
    action(input) {
        const args = input.trim().split(" ").filter(Boolean);
        const indexPath = node_path_1.default.join(__dirname, "index.js"); // ✅ absolute path
        const command = [indexPath, ...args];
        const proc = (0, node_child_process_1.spawn)("node", command, {
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
