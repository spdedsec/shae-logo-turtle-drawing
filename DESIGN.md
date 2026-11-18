# SHAE Logo Turtle Drawing — Design Specification

**Project:** shae-logo-turtle-drawing  
**Design System:** SHAE Field Manual (shared/design-system.md)  
**Status:** Production-ready

---

## Design System Application

### Color Palette (Compliant)

| Token | Value | Usage |
|-------|-------|-------|
| `--paper` | `#F2EEE5` | Primary background |
| `--paper-alt` | `#E8E2D5` | Alt background (panel headers) |
| `--ink` | `#191712` | Primary ink / canvas strokes |
| `--ink-muted` | `#4A4540` | Secondary text |
| `--ink-dim` | `#8A8580` | Tertiary text |
| `--oxide` | `#B3341B` | Accent / focus / active states |
| `--oxide-hover` | `#8E2A16` | Accent hover |

### Typography (Compliant)

| Role | Font | Usage |
|------|------|-------|
| **Display** | Archivo | Panel titles, brand |
| **Body** | Instrument Sans | UI text, help text |
| **Labels/Code** | JetBrains Mono | Commands, state values, meta |

### Spacing & Layout (Compliant)

- **Base unit:** 4px
- **Max container:** 1280px
- **Border:** 1px solid ink / ink-dim
- **Border-radius:** 0px
- **No shadows, gradients, glass, pills**

### Motion (Compliant)

- State changes: 140ms
- Reduced motion: respected
- Transform/opacity only

### Accessibility (Compliant)

- WCAG AA contrast
- Oxide focus rings
- Keyboard navigation
- 44px touch targets
- No horizontal overflow

---

## Canvas Design

- Background: Warm paper (#F2EEE5)
- Stroke: Ink (#191712), width 2
- Grid: Subtle ink-dim lines (40px)
- Center crosshair: Oxide (#B3341B)
- Turtle indicator: Ink dot + Oxide heading tick

## Components

| Component | Design |
|-----------|--------|
| Canvas | Paper bg, ink stroke, oxide grid/crosshair |
| State Bar | 1px borders, mono labels/values |
| Command Panel | Ink border, oxide syntax accents |
| Buttons | 44px min height, ink hover, oxide accent |

---

## Verification

- [x] Design tokens applied
- [x] Accessibility compliant
- [x] Reduced motion respected
- [x] 44px touch targets
- [x] WCAG AA contrast
- [x] No horizontal overflow

---

## Files

| File | Role |
|------|------|
| `src/index.html` | Canvas + command interface |
| `src/styles.css` | Design tokens and components |
| `src/app.js` | Turtle engine and state |
| `scripts/install.sh` | Installation script |
| `Makefile` | Dev/build commands |
| `DESIGN.md` | Design specification |