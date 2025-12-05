# Puzzle Game

A 4×4 sliding puzzle built with HTML, CSS and vanilla JS, served by a tiny Node static server.

Language: English | 中文版: [README.zh-CN.md](README.zh-CN.md)

## Overview

A minimalist sliding puzzle focused on smooth interactions. Arrange tiles 1–15 with the empty cell in the bottom-right corner to win.

## Features
- Solvable shuffles only (validated before each game)
- Move counter and live timer
- Best time persisted in `localStorage`
- Keyboard controls with arrow keys
- Responsive layout and accessible labels

## Tech Stack
- Frontend: `index.html`, `style.css`, `script.js` (vanilla JS)
- Server: `server.js` using Node `http` module

## Run Locally

1. Install Node.js `>=18`.
2. Start the server:
   ```bash
   npm start
   ```
3. Open `http://localhost:8000` in your browser.

## Controls
- Click a tile adjacent to the empty cell to slide it
- Or use arrow keys to move the empty cell

## Configuration
- `PORT`: server port (default `8000`)
- `HOST`: bind address (default `0.0.0.0`)

## Project Structure
- `index.html` – UI layout and content
- `style.css` – glassmorphism styling and responsive rules
- `script.js` – game logic, timer, best-time storage
- `server.js` – static file server with safe path handling
- `package.json` – metadata and `npm start` script

## Troubleshooting
- If `npm start` prints `npm warn Unknown env config "http-proxy"`, the server still starts. The warning originates from a legacy npm setting and can be ignored, or remove it via `npm config delete http-proxy` if you control the environment.

## License
MIT
