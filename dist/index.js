"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = __importDefault(require("node:http"));
const node_readline_1 = __importDefault(require("node:readline"));
const rl = node_readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function parseFlags() {
    const args = process.argv.slice(2); // Skip node and script path
    const flags = {};
    for (let i = 0; i < args.length; i += 2) {
        const flag = args[i];
        const value = args[i + 1];
        if (!flag.startsWith("-") || !value) {
            console.error(`Invalid flag/value pair: ${flag} ${value}`);
            process.exit(1);
        }
        flags[flag] = value;
    }
    return {
        host: flags["-h"] || "localhost",
        port: parseInt(flags["-p"] || "80"),
        path: flags["-a"] || "/",
        method: (flags["-m"] || "GET").toUpperCase(),
    };
}
const { host, port, path, method } = parseFlags();
function ask(question) {
    return new Promise((resolve) => rl.question(question, resolve));
}
// (async () => {
//     const host = await ask("Enter host (e.g., localhost): ");
//     const port = await ask("Enter port (e.g., 8050): ");
//     const path = await ask("Enter path (e.g., /api): ");
//     const method = (await ask("Enter method (GET/POST): ")).toUpperCase();
//     rl.close();
const options = {
    host,
    port,
    path,
    method,
    headers: {
        "Content-Type": "application/json",
    },
};
const req = node_http_1.default.request(options, (res) => {
    console.log("\n=== Response Received ===");
    console.table([{ Key: "Status Code", Value: res.statusCode }]);
    console.log("\n=== Headers ===");
    console.table(res.headers);
    let data = "";
    res.on("data", (chunk) => {
        data += chunk.toString("utf-8");
    });
    res.on("end", () => {
        console.log("\n=== Body ===");
        try {
            const parsed = JSON.parse(data);
            console.table(parsed);
        }
        catch {
            console.log(data);
        }
        console.log("\n Done.");
    });
});
req.on("error", (err) => {
    console.error("Request failed:", err.message);
});
if (method === "POST" || method === "PUT") {
    const body = JSON.stringify({ title: "Sample Title from CLI" });
    req.write(body);
}
req.end();
