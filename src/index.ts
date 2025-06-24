import http, { RequestOptions } from "node:http";
import readline from "node:readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function ask(question: string): Promise<string> {
    return new Promise((resolve) => rl.question(question, resolve));
}

(async () => {
    const host = await ask("Enter host (e.g., localhost): ");
    const port = await ask("Enter port (e.g., 8050): ");
    const path = await ask("Enter path (e.g., /api): ");
    const method = (await ask("Enter method (GET/POST): ")).toUpperCase();

    rl.close();

    const options: RequestOptions = {
        host,
        port: parseInt(port),
        path,
        method,
        headers: {
            "Content-Type": "application/json",
        },
    };

    const req = http.request(options, (res) => {
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
                console.table(parsed);
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
})();
