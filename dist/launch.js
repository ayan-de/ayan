#!/usr/bin/env node
"use strict";
const { spawn, exec } = require("child_process");
const os = require("os");
const path = require("path");
const replPath = path.join(__dirname, "repl.js");
const isMac = process.platform === "darwin";
const isLinux = process.platform === "linux";
const isWindows = process.platform === "win32";
// Detect if running inside VS Code terminal
const isVSCode = !!process.env.TERM_PROGRAM &&
    process.env.TERM_PROGRAM.toLowerCase().includes("vscode");
if (isVSCode) {
    // Run in current VS Code terminal
    console.clear();
    spawn("node", [replPath], { stdio: "inherit" });
}
else if (isLinux) {
    // Try different terminal emulators
    const terminals = ["gnome-terminal", "xterm", "konsole", "x-terminal-emulator"];
    for (const terminal of terminals) {
        try {
            if (terminal === "gnome-terminal") {
                spawn(terminal, ["--hide-menubar", "--", "bash", "-c", `node ${replPath}; exec bash`], {
                    detached: true,
                    stdio: "ignore",
                }).unref();
            }
            else {
                spawn(terminal, ["-e", `node ${replPath}`], {
                    detached: true,
                    stdio: "ignore",
                }).unref();
            }
            break;
        }
        catch (error) {
            console.warn(`Failed to launch ${terminal}, trying next...`);
        }
    }
}
else if (isMac) {
    // Use AppleScript to open Terminal.app and run node ${replPath}
    exec(`osascript -e 'tell application "Terminal" to do script "node ${replPath}"'`);
}
else if (isWindows) {
    // Windows support
    spawn("cmd", ["/c", "start", "cmd", "/k", `node ${replPath}`], {
        detached: true,
        stdio: "ignore",
    }).unref();
}
else {
    console.error("Unsupported platform or environment");
}
