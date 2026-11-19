# SHAE Logo Turtle Drawing

Interactive Logo-inspired turtle graphics environment. Write Logo commands to create drawings, explore geometry, and learn programming concepts.

## Features

- **Full Logo Interpreter** — FORWARD, BACK, LEFT, RIGHT, REPEAT, IF, pen control, color, loops
- **Real-time Canvas** — 60fps rendering with turtle cursor visualization
- **Command History** — Persistent history with error reporting
- **Keyboard Shortcuts** — `/` focus input, `Ctrl+L` clear, `Ctrl+E` export PNG
- **Export** — Download drawings as PNG
- **Responsive Design** — Works on desktop and mobile
- **Accessibility** — WCAG AA compliant, keyboard navigable, screen reader support

## Quick Start

```bash
# Development server
npx serve src

# Or with Python
python3 -m http.server 8080 -d src
```

Then open http://localhost:8080

## Commands

| Command | Alias | Description |
|---------|-------|-------------|
| `FORWARD n` | `FD n` | Move forward n units |
| `BACK n` | `BK n` | Move backward n units |
| `RIGHT deg` | `RT deg` | Turn right |
| `LEFT deg` | `LT deg` | Turn left |
| `SETXY x y` | | Set absolute position |
| `SETHEADING deg` | `SETH deg` | Set heading |
| `HOME` | | Return to origin |
| `PENUP` | `PU` | Lift pen |
| `PENDOWN` | `PD` | Lower pen |
| `PENCOLOR r g b` | `PC` | Set pen color (0-255) |
| `PENSIZE n` | `PS` | Set pen width |
| `CLEARSCREEN` | `CS` | Clear canvas |
| `SHOWTURTLE` | `ST` | Show turtle cursor |
| `HIDETURTLE` | `HT` | Hide turtle cursor |
| `REPEAT n [cmds]` | | Repeat commands n times |
| `IF cond [cmds]` | | Conditional execution |

### Examples

```logo
# Square
REPEAT 4 [FORWARD 100 RIGHT 90]

# Spiral
REPEAT 36 [FORWARD 100 RIGHT 170]

# Nested polygons
REPEAT 6 [REPEAT 4 [FORWARD 50 RIGHT 90] RIGHT 60]

# Colorful pattern
PENCOLOR 179 52 27
REPEAT 12 [FORWARD 150 RIGHT 150 PENUP FORWARD 20 PENDOWN]
```

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod src
```

Or connect the repository to Vercel for automatic deployments.

## Design System

Follows the [SHAE Field Manual](https://github.com/spdedsec/shae-site):
- Warm paper `#F2EEE5` background
- Near-black ink `#191712` text
- Oxide red `#B3341B` accent
- Zero border radius, 1px hairline borders
- Archivo display, Instrument Sans body, JetBrains Mono code
- 140-240ms transitions, reduced-motion support
- WCAG AA contrast, 44px touch targets

## License

MIT © 2026 SHAE
