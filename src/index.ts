import http, { RequestOptions } from "node:http";
import https from "node:https";
import readline from "node:readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let useHttps = false;

function parseFlags(): {
    host: string;
    port: number;
    path: string;
    method: string;
    useHttps: boolean;

} {
    const args = process.argv.slice(2); // Skip node and script path
    const flags: Record<string, string> = {};

        for (let i = 0; i < args.length; i++) {
        const flag = args[i];

        if (flag === "-https") {
            useHttps = true;
        } else if (flag.startsWith("-") && i + 1 < args.length && !args[i + 1].startsWith("-")) {
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


function ask(question: string): Promise<string> {
    return new Promise((resolve) => rl.question(question, resolve));
}

// (async () => {
//     const host = await ask("Enter host (e.g., localhost): ");
//     const port = await ask("Enter port (e.g., 8050): ");
//     const path = await ask("Enter path (e.g., /api): ");
//     const method = (await ask("Enter method (GET/POST): ")).toUpperCase();

//     rl.close();

const options: RequestOptions = {
    host,
    port,
    path,
    method,
    headers: {
        "Content-Type": "application/json",
    },
};

const client = useHttps ? https : http;


const req = client.request(options, (res) => {
    console.log("\n=== Response Received ===");

    console.table([{ Key: "Status Code", Value: res.statusCode }]);

    console.log("\n=== Headers ===");
    console.table(res.headers);

    let data = "";

    res.on("data", (chunk: Buffer) => {
        data += chunk.toString("utf-8");
    });

    res.on("end", () => {
        console.log("\n=== Body ===");
        try {
            const parsed = JSON.parse(data);
            console.log(parsed);
        } catch {
            console.log(data);
        }
        console.log("\n Done.");
    });
});

req.on("error", (err: Error) => {
    console.error("Request failed:", err.message);
});

if (method === "POST" || method === "PUT") {
    const body = JSON.stringify({ title: "Sample Title from CLI" });
    req.write(body);
}

req.end();
