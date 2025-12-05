# ayan - HTTP/HTTPS API Testing REPL

A tiny, interactive command-line REPL for testing HTTP and HTTPS API endpoints directly from your terminal.

## Features

- **Interactive REPL**: Test APIs with an interactive shell
- **HTTP & HTTPS Support**: Make requests to both HTTP and HTTPS endpoints
- **Multiple HTTP Methods**: GET, POST, PUT, DELETE, and more
- **Custom Headers**: Set custom request headers
- **JSON Support**: Automatic JSON parsing of responses
- **CLI Integration**: Use as a command-line tool or interactive REPL

## Requirements

- **Node.js** v18 or higher
- **npm** v8 or higher

## Installation

### Option 1: Global Installation (Recommended)

Install globally via npm:
```bash
npm install -g ayan-cli
```

Then start the REPL with:
```bash
ayan
```

This works on macOS, Linux, and Windows.

### Option 2: Local Installation

1. Clone the repository:
```bash
git clone https://github.com/ayan-de/ayan.git
cd ayan
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Run the REPL:
```bash
npm start
```

## Usage

### Interactive REPL Mode

Start the REPL:
```bash
ayan
```

You'll see the welcome prompt:
```
Welcome to λyan REPL!
Type .help for available commands
Type .exit to quit

λyan > 
```

### Using the `.run` Command

Test an API endpoint using the `.run` command with flags:

```
.run [flags]
```

**Available Flags:**
- `-h <host>` - Host/domain (default: `localhost`)
- `-p <port>` - Port number (default: `80`)
- `-a <path>` - API path (default: `/`)
- `-m <method>` - HTTP method (default: `GET`)
- `-https` - Use HTTPS instead of HTTP

### Examples

#### Example 1: GET Request (HTTP)
```
λyan > .run -h jsonplaceholder.typicode.com -p 80 -a /posts/1 -m GET
```

#### Example 2: GET Request (HTTPS)
```
λyan > .run -h jsonplaceholder.typicode.com -p 443 -a /posts/1 -m GET -https
```

#### Example 3: POST Request
```
λyan > .run -h api.example.com -p 443 -a /users -m POST -https
```

#### Example 4: Local API
```
λyan > .run -h localhost -p 3000 -a /api/data -m GET
```

### Available REPL Commands

- `.run [flags]` - Run the API test with specified flags
- `.help` - Show available commands
- `.exit` - Exit the REPL

## Development

### Run in Development Mode

With auto-reload on file changes:
```bash
npm run dev
```

**Note:** You may need to install `nodemon` globally:
```bash
npm install -g nodemon
```

### Build Only

Compile TypeScript to JavaScript:
```bash
npm run build
```

### Scripts

- `npm start` - Compile and run the project
- `npm run build` - Compile TypeScript
- `npm run dev` - Run in development mode with auto-reload

## Project Structure

```
ayan/
├── src/
│   ├── index.ts      # Main API request handler
│   ├── launch.ts     # CLI entry point
│   └── repl.ts       # Interactive REPL implementation
├── dist/             # Compiled JavaScript (generated)
├── package.json      # Project metadata
├── tsconfig.json     # TypeScript configuration
└── nodemon.json      # Nodemon configuration
```

## Response Output

When you run an API test, ayan displays:

1. **Status Code** - HTTP response status
2. **Headers** - Response headers in a table format
3. **Body** - Response body (auto-parsed if JSON)

Example output:
```
=== Response Received ===
┌─────────┬───────────────┬───────┐
│ (index) │      Key      │ Value │
├─────────┼───────────────┼───────┤
│    0    │ 'Status Code' │  200  │
└─────────┴───────────────┴───────┘

=== Headers ===
(headers table here)

=== Body ===
{
  "id": 1,
  "title": "Sample Post",
  ...
}

 Done.
```

## Troubleshooting

### Error: "node: command not found"
Make sure Node.js is installed. Download it from [nodejs.org](https://nodejs.org/)

### Error: "index.js not found"
Build the project first:
```bash
npm run build
```

### HTTPS requests fail
Ensure you include the `-https` flag and use port 443:
```
.run -h example.com -p 443 -a /api -m GET -https
```

## License

ISC

## Author

[ayan-de](https://github.com/ayan-de)

## Repository

[GitHub - ayan-de/ayan](https://github.com/ayan-de/ayan)

## Support

For issues and feature requests, visit: https://github.com/ayan-de/ayan/issues
