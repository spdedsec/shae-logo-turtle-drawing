# SHAE Logo Turtle Drawing

<div align="center">

```
   ___  _   _    _    _____     ____    _    _     ____ 
  / _ \| | | |  / \  | ____|   / ___|  / \  | |   / ___|
 | | | | |_| | / _ \ |  _|    | |     / _ \ | |  | |    
 | |_| |  _  |/ ___ \| |___   | |___ / ___ \| |__| |___ 
  \___/|_| |_/_/   \_\_____|   \____/_/   \_\_____\____|
                                                        
      Logo Turtle Graphics — SHAE Edition
```

[![Platform](https://img.shields.io/badge/Platform-Web%20Browser-blue.svg)](#)
[![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)](LICENSE)
[![Design System](https://img.shields.io/badge/Design-SHAE%20Field%20Manual-orange.svg)](DESIGN.md)

</div>

---

## Overview

An interactive Logo turtle graphics drawing app. Enter turtle commands and watch the turtle draw on an HTML5 canvas with Apple-like SHAE design:

- Warm paper background (#F2EEE5), ink lines (#191712), oxide accents (#B3341B)
- Flat design: 0px radius, 1px borders, border-defined cards
- Typography: Archivo / Instrument Sans / JetBrains Mono
- Motion: 140–240ms state changes, reduced-motion fallbacks
- Accessibility: WCAG AA contrast, keyboard navigation, oxide focus rings

---

## Supported Commands

| Command | Description |
|---------|-------------|
| `FORWARD n` | Move turtle forward n pixels |
| `BACK n` | Move turtle backward n pixels |
| `LEFT deg` | Turn turtle left by deg degrees |
| `RIGHT deg` | Turn turtle right by deg degrees |
| `PENUP` | Lift pen (move without drawing) |
| `PENDOWN` | Lower pen (draw while moving) |
| `HOME` | Return turtle to center, heading 0° |
| `CLEAR` | Clear canvas, reset turtle to home |
| `REPEAT n [commands]` | Execute commands n times |

## Examples

Press **Ctrl+Enter** to run your commands, or click **RUN**.

```
REPEAT 4 [FORWARD 100 RIGHT 90]
```
Draws a square.

```
REPEAT 36 [FORWARD 5 RIGHT 10]
```
Draws a spiral.

```
REPEAT 5 [FORWARD 150 RIGHT 144]
```
Draws a star.

---

## State Display

The app shows the turtle's current coordinates (X, Y), heading (degrees), pen state (UP/DOWN), and total distance traveled.

---

## Installation

### Browser / Desktop Web App

1. **Clone the repository:**
   ```bash
   git clone https://github.com/spdedsec/shae-logo-turtle-drawing.git
   cd shae-logo-turtle-drawing
   ```

2. **Run locally:**
   ```bash
   make dev
   # Opens at http://localhost:8080
   ```

3. **Or open directly:**
   ```bash
   # Open src/index.html in your browser
   ./scripts/install.sh
   ```

### Design System

This project follows the **SHAE Field Manual** design system. See [DESIGN.md](DESIGN.md) for full specifications.

---

## Build & Release

```bash
make build          # Create distribution in dist/
make release        # Create .tar.gz and .zip archives
```

Releases are published to GitHub via the `.github/workflows/release.yml` workflow.

---

## License

MIT © 2026 spdedsec <legendsatya7272@gmail.com>.  
Developed under the **SHAE** language & systems architecture project.