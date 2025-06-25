#!/usr/bin/env node

const { spawn, exec } = require("child_process");
const os = require("os");
const path = require("path");

const replPath = path.join(__dirname, "repl.js");



const isMac = process.platform === "darwin";
const isLinux = process.platform === "linux";

// Detect if running inside VS Code terminal
const isVSCode =
    !!process.env.TERM_PROGRAM &&
    process.env.TERM_PROGRAM.toLowerCase().includes("vscode");

if (isVSCode) {
    // Run in current VS Code terminal
    console.clear();
    spawn("node", [replPath], { stdio: "inherit" });
} else if (isLinux) {
    // Open new gnome-terminal (you can change to xterm, konsole, etc.)
    spawn(
        "gnome-terminal",
        ["--hide-menubar", "--", "bash", "-c", `node ${replPath}; exec bash`],
        {
            detached: true,
            stdio: "ignore",
        }
    ).unref();
} else if (isMac) {
    // Use AppleScript to open Terminal.app and run node ${replPath}
    exec(
        `osascript -e 'tell application "Terminal" to do script "node ${replPath}"'`
    );
} else {
    console.error("Unsupported platform or environment");
}
