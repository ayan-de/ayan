"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = __importDefault(require("node:http"));
const node_https_1 = __importDefault(require("node:https"));
let useHttps = false;
function parseFlags() {
    const args = process.argv.slice(2); // Skip node and script path
    const flags = {};
    for (let i = 0; i < args.length; i++) {
        const flag = args[i];
        if (flag === "-https") {
            useHttps = true;
        }
        else if (flag.startsWith("-") && i + 1 < args.length && !args[i + 1].startsWith("-")) {
            flags[flag] = args[i + 1];
            i++;
        }
    }
    return {
        host: flags["-h"] || "localhost",
        port: parseInt(flags["-p"] || "80"),
        path: flags["-a"] || "/",
        method: (flags["-m"] || "GET").toUpperCase(),
        useHttps,
    };
}
const { host, port, path, method } = parseFlags();
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
const client = useHttps ? node_https_1.default : node_http_1.default;
const req = client.request(options, (res) => {
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
            console.log(parsed);
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
