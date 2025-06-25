"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repl = require("node:repl");
const msg = "message";
const yellow = "\x1b[33m"; // ANSI code for yellow
const reset = "\x1b[0m"; // Reset color
const options = { useColors: true };
// Custom colored prompt
const promptSymbol = `${yellow}λyan${reset} > `;
const replServer = new repl.start({
    prompt: promptSymbol,
    options,
    useGlobal: true,
    input: process.stdin,
    output: process.stdout,
});
replServer.context.m = msg;
replServer.defineCommand("run", {
    help: "Say hello",
    action() {
        console.table(["200", "Success"]);
        this.displayPrompt();
    },
});
replServer.on("exit", () => {
    console.clear();
    process.exit();
});
