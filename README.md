# demo01
The first codex experimental project

## Run locally

1. Ensure Node.js 18+ is available.
2. Install dependencies (none beyond Node built-ins).
3. Start the static server (binds to all interfaces so the preview URL works and auto-opens your browser locally):
   ```bash
   npm start
   ```
   - To skip auto-opening (e.g., CI), run `npm start -- --no-open` or set `OPEN_BROWSER=false`.
   - If your OS is missing an opener like `xdg-open`, the server will keep running and log a hint to open the URL manually.
   - To restart without killing the process (handy when testing), press `r` in the terminal where it is running or send `SIGHUP`/`SIGUSR2` to the Node process.
4. Open http://localhost:8000 to play (or use the forwarded preview link in your environment).

## Troubleshooting
- If `npm start` prints `npm warn Unknown env config "http-proxy"`, the server still starts normally. The warning comes from a legacy npm environment variable and can be ignored or removed with `npm config delete http-proxy` if you control the setting.
