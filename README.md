# Logo Turtle Drawing

Interactive Logo-inspired turtle graphics environment crafted with Apple Human Interface Guidelines (HIG). Write Logo commands to create drawings, explore geometry, and learn programming concepts.

## Features

- **Full Logo Interpreter** — FORWARD, BACK, LEFT, RIGHT, REPEAT, IF, pen control, color, loops
- **Apple HIG Design** — Cupertino aesthetic, San Francisco typography, light/dark mode support
- **Real-time Canvas** — 60fps rendering with turtle cursor visualization
- **Command History** — Persistent history with error reporting
- **Keyboard Shortcuts** — `/` focus input, `Ctrl+L` clear, `Ctrl+E` export PNG
- **Export** — Download drawings as PNG
- **Responsive Design** — Works seamlessly across desktop, iPad, and iPhone
- **Accessibility** — Full ARIA support, touch targets ≥ 44pt, visible focus rings, reduced-motion support

## Quick Start

```bash
# Serve static files locally
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
PENCOLOR 0 122 255
REPEAT 12 [FORWARD 150 RIGHT 150 PENUP FORWARD 20 PENDOWN]
```

## Design System

Engineered strictly following the [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/):
- **Typography:** San Francisco (`-apple-system`, `BlinkMacSystemFont`, `SF Pro Text`, `SF Pro Display`)
- **System Colors:** Apple dynamic system colors (`UIColor.systemBackground`, `UIColor.label`, `UIColor.systemBlue` `#007AFF`, `UIColor.systemRed` `#FF3B30`, `UIColor.systemGreen` `#34C759`)
- **Light/Dark Mode:** Full native support via `color-scheme: light dark` and `@media (prefers-color-scheme: dark)`
- **8pt Grid:** Consistent spacing increments (8, 16, 24, 32, 48px)
- **Corner Radii:** 8pt, 12pt, 16pt, and pill buttons
- **Elevation:** Apple 5-tier shadow elevation system (`.shadow-1` through `.shadow-5`)
- **Motion:** Spring timing functions (`cubic-bezier(0.4, 0, 0.2, 1)`) with `prefers-reduced-motion` compliance
- **Touch Targets:** Minimum 44pt touch targets with accessible high-contrast focus rings

## License

MIT © 2026 spdedsec
