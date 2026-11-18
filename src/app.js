/**
 * ========================================================================
 * SHAE Logo Turtle Drawing — Application Logic
 * Implements Logo turtle commands: FORWARD, BACK, LEFT, RIGHT,
 * PENUP, PENDOWN, HOME, CLEAR, REPEAT n [commands]
 * Copyright (c) 2026 spdedsec <legendsatya7272@gmail.com>
 * License: MIT
 * ========================================================================
 */

(function () {
    'use strict';

    // ------------------------------------------------------------------
    // Turtle State
    // ------------------------------------------------------------------

    const TURTLE_STATE = {
        x: 0,               // canvas coordinates (center-origin)
        y: 0,
        heading: 0,         // degrees, 0 = up, clockwise
        penDown: true,
        distanceTraveled: 0,
        history: []         // command history for undo/audit
    };

    // ------------------------------------------------------------------
    // DOM Elements
    // ------------------------------------------------------------------

    const canvas = document.getElementById('turtle-canvas');
    const ctx = canvas.getContext('2d');
    const inputEl = document.getElementById('command-input');
    const btnRun = document.getElementById('btn-run');
    const btnStep = document.getElementById('btn-step');
    const btnClearInput = document.getElementById('btn-clear-input');
    const btnClear = document.getElementById('btn-clear');
    const btnHome = document.getElementById('btn-home');
    const btnReset = document.getElementById('btn-reset');
    const stateX = document.getElementById('state-x');
    const stateY = document.getElementById('state-y');
    const stateHeading = document.getElementById('state-heading');
    const statePen = document.getElementById('state-pen');
    const stateDistance = document.getElementById('state-distance');

    // ------------------------------------------------------------------
    // Canvas Setup — HiDPI aware
    // ------------------------------------------------------------------

    const LOGICAL_WIDTH = 640;
    const LOGICAL_HEIGHT = 480;
    const SCALE = window.devicePixelRatio || 1;

    function setupCanvas() {
        canvas.width = LOGICAL_WIDTH * SCALE;
        canvas.height = LOGICAL_HEIGHT * SCALE;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        ctx.scale(SCALE, SCALE);
        clearCanvas();
    }

    // ------------------------------------------------------------------
    // Coordinate System: center-origin, y-up (convert to canvas y-down)
    // ------------------------------------------------------------------

    function toCanvasX(x) {
        return LOGICAL_WIDTH / 2 + x;
    }

    function toCanvasY(y) {
        return LOGICAL_HEIGHT / 2 - y;
    }

    // ------------------------------------------------------------------
    // Drawing Primitives
    // ------------------------------------------------------------------

    function clearCanvas() {
        ctx.fillStyle = '#F2EEE5';
        ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

        // Subtle grid
        ctx.strokeStyle = '#E0D9CC';
        ctx.lineWidth = 1;
        const gridSize = 40;
        for (let gx = 0; gx <= LOGICAL_WIDTH; gx += gridSize) {
            ctx.beginPath();
            ctx.moveTo(gx, 0);
            ctx.lineTo(gx, LOGICAL_HEIGHT);
            ctx.stroke();
        }
        for (let gy = 0; gy <= LOGICAL_HEIGHT; gy += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, gy);
            ctx.lineTo(LOGICAL_WIDTH, gy);
            ctx.stroke();
        }

        // Center crosshair
        ctx.strokeStyle = '#B3341B';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(LOGICAL_WIDTH / 2 - 8, LOGICAL_HEIGHT / 2);
        ctx.lineTo(LOGICAL_WIDTH / 2 + 8, LOGICAL_HEIGHT / 2);
        ctx.moveTo(LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2 - 8);
        ctx.lineTo(LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2 + 8);
        ctx.stroke();
    }

    function drawTurtle() {
        // Turtle indicator — small ink dot at current position
        ctx.fillStyle = '#191712';
        ctx.beginPath();
        ctx.arc(toCanvasX(TURTLE_STATE.x), toCanvasY(TURTLE_STATE.y), 4, 0, Math.PI * 2);
        ctx.fill();

        // Heading tick
        const rad = (TURTLE_STATE.heading - 90) * Math.PI / 180;
        ctx.strokeStyle = '#B3341B';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(toCanvasX(TURTLE_STATE.x), toCanvasY(TURTLE_STATE.y));
        ctx.lineTo(
            toCanvasX(TURTLE_STATE.x) + Math.cos(rad) * 12,
            toCanvasY(TURTLE_STATE.y) + Math.sin(rad) * 12
        );
        ctx.stroke();
    }

    function drawLine(fromX, fromY, toX, toY) {
        ctx.strokeStyle = '#191712';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(toCanvasX(fromX), toCanvasY(fromY));
        ctx.lineTo(toCanvasX(toX), toCanvasY(toY));
        ctx.stroke();
    }

    // ------------------------------------------------------------------
    // State Display Update
    // ------------------------------------------------------------------

    function updateState() {
        stateX.textContent = Math.round(TURTLE_STATE.x);
        stateY.textContent = Math.round(TURTLE_STATE.y);
        stateHeading.textContent = ((Math.round(TURTLE_STATE.heading) % 360) + 360) % 360 + '°';
        statePen.textContent = TURTLE_STATE.penDown ? 'DOWN' : 'UP';
        stateDistance.textContent = Math.round(TURTLE_STATE.distanceTraveled);
    }

    // ------------------------------------------------------------------
    // Command Parser — Tokenizer
    // ------------------------------------------------------------------

    const COMMANDS = {
        FORWARD: 1, BACK: 1, LEFT: 1, RIGHT: 1,
        PENUP: 0, PENDOWN: 0, HOME: 0, CLEAR: 0,
        REPEAT: -1 // special: n [commands]
    };

    function tokenize(input) {
        const tokens = [];
        const str = input.toUpperCase();
        let i = 0;
        while (i < str.length) {
            // Skip whitespace
            if (/\s/.test(str[i])) { i++; continue; }
            // Bracket tokens
            if (str[i] === '[') { tokens.push('['); i++; continue; }
            if (str[i] === ']') { tokens.push(']'); i++; continue; }
            // Word (letters) or number
            let j = i;
            while (j < str.length && !/[\s\[\]]/.test(str[j])) j++;
            tokens.push(str.slice(i, j));
            i = j;
        }
        return tokens;
    }

    // ------------------------------------------------------------------
    // Command Executor
    // ------------------------------------------------------------------

    function executeCommand(cmd, arg) {
        switch (cmd) {
            case 'FORWARD': {
                const d = Number(arg);
                if (!isFinite(d)) throw new Error(`FORWARD requires a number, got "${arg}"`);
                move(d);
                break;
            }
            case 'BACK': {
                const d = Number(arg);
                if (!isFinite(d)) throw new Error(`BACK requires a number, got "${arg}"`);
                move(-d);
                break;
            }
            case 'LEFT': {
                const deg = Number(arg);
                if (!isFinite(deg)) throw new Error(`LEFT requires a number, got "${arg}"`);
                TURTLE_STATE.heading -= deg;
                break;
            }
            case 'RIGHT': {
                const deg = Number(arg);
                if (!isFinite(deg)) throw new Error(`RIGHT requires a number, got "${arg}"`);
                TURTLE_STATE.heading += deg;
                break;
            }
            case 'PENUP':
                TURTLE_STATE.penDown = false;
                break;
            case 'PENDOWN':
                TURTLE_STATE.penDown = true;
                break;
            case 'HOME':
                TURTLE_STATE.x = 0;
                TURTLE_STATE.y = 0;
                TURTLE_STATE.heading = 0;
                break;
            case 'CLEAR':
                clearCanvas();
                TURTLE_STATE.distanceTraveled = 0;
                break;
            default:
                throw new Error(`Unknown command: ${cmd}`);
        }
        updateState();
    }

    function move(distance) {
        const rad = (TURTLE_STATE.heading - 90) * Math.PI / 180;
        const newX = TURTLE_STATE.x + Math.cos(rad) * distance;
        const newY = TURTLE_STATE.y + Math.sin(rad) * distance;

        if (TURTLE_STATE.penDown) {
            drawLine(TURTLE_STATE.x, TURTLE_STATE.y, newX, newY);
        }
        TURTLE_STATE.distanceTraveled += Math.abs(distance);
        TURTLE_STATE.x = newX;
        TURTLE_STATE.y = newY;
    }

    // ------------------------------------------------------------------
    // REPEAT Parser — handles nested brackets
    // ------------------------------------------------------------------

    function executeTokens(tokens) {
        let i = 0;
        while (i < tokens.length) {
            const token = tokens[i];
            if (token === 'REPEAT') {
                const count = Number(tokens[i + 1]);
                if (!isFinite(count) || count < 0) {
                    throw new Error(`REPEAT requires a non-negative number, got "${tokens[i + 1]}"`);
                }
                if (tokens[i + 2] !== '[') {
                    throw new Error('REPEAT requires an opening bracket [ after count');
                }
                // Find matching closing bracket
                let depth = 0;
                let j = i + 2;
                for (; j < tokens.length; j++) {
                    if (tokens[j] === '[') depth++;
                    if (tokens[j] === ']') {
                        depth--;
                        if (depth === 0) break;
                    }
                }
                if (depth !== 0) {
                    throw new Error('Mismatched brackets in REPEAT block');
                }
                const bodyTokens = tokens.slice(i + 3, j);
                for (let r = 0; r < count; r++) {
                    executeTokens(bodyTokens);
                }
                i = j + 1;
            } else if (token === '[' || token === ']') {
                throw new Error(`Unexpected bracket "${token}" outside REPEAT`);
            } else {
                const argCount = COMMANDS[token];
                if (argCount === undefined) {
                    throw new Error(`Unknown command: ${token}`);
                }
                if (argCount > 0) {
                    const arg = tokens[i + 1];
                    if (arg === undefined || arg === '[' || arg === ']') {
                        throw new Error(`${token} requires a numeric argument`);
                    }
                    executeCommand(token, arg);
                    i += 2;
                } else {
                    executeCommand(token, null);
                    i += 1;
                }
            }
        }
    }

    // ------------------------------------------------------------------
    // Public Actions
    // ------------------------------------------------------------------

    function runAll() {
        const raw = inputEl.value.trim();
        if (!raw) return;
        try {
            const tokens = tokenize(raw);
            executeTokens(tokens);
            inputEl.classList.remove('command-error');
            hideError();
        } catch (err) {
            showError(err.message);
        }
    }

    function runStep() {
        // Execute the first command only (simple step mode)
        const raw = inputEl.value.trim();
        if (!raw) return;
        try {
            const tokens = tokenize(raw);
            if (tokens.length === 0) return;
            const first = tokens[0];
            if (first === 'REPEAT') {
                // For step mode, execute one iteration of the repeat block
                const count = Number(tokens[1]);
                if (!isFinite(count) || tokens[2] !== '[') throw new Error('Invalid REPEAT');
                let depth = 0;
                let j = 2;
                for (; j < tokens.length; j++) {
                    if (tokens[j] === '[') depth++;
                    if (tokens[j] === ']') { depth--; if (depth === 0) break; }
                }
                const bodyTokens = tokens.slice(3, j);
                executeTokens(bodyTokens);
                // Rewrite input with count - 1
                const remaining = 'REPEAT ' + (count - 1) + ' [' + bodyTokens.join(' ') + ']' + ' ' + tokens.slice(j + 1).join(' ');
                inputEl.value = remaining.trim();
            } else {
                const argCount = COMMANDS[first];
                if (argCount === undefined) throw new Error(`Unknown command: ${first}`);
                const take = argCount > 0 ? 2 : 1;
                executeTokens(tokens.slice(0, take));
                inputEl.value = tokens.slice(take).join(' ');
            }
            inputEl.classList.remove('command-error');
            hideError();
        } catch (err) {
            showError(err.message);
        }
    }

    function clearAll() {
        TURTLE_STATE.x = 0;
        TURTLE_STATE.y = 0;
        TURTLE_STATE.heading = 0;
        TURTLE_STATE.penDown = true;
        TURTLE_STATE.distanceTraveled = 0;
        clearCanvas();
        updateState();
    }

    function resetState() {
        clearAll();
        inputEl.value = '';
        hideError();
        inputEl.focus();
    }

    function loadExample(name) {
        const examples = {
            square: 'REPEAT 4 [FORWARD 100 RIGHT 90]',
            triangle: 'REPEAT 3 [FORWARD 120 RIGHT 120]',
            spiral: 'REPEAT 36 [FORWARD 5 RIGHT 10 FORWARD 5 RIGHT 10 FORWARD 5 RIGHT 10 FORWARD 5 RIGHT 10 FORWARD 5 RIGHT 10 FORWARD 5 RIGHT 10 FORWARD 5 RIGHT 10 FORWARD 5 RIGHT 10 FORWARD 5 RIGHT 10 FORWARD 5 RIGHT 10]',
            star: 'REPEAT 5 [FORWARD 150 RIGHT 144]'
        };
        inputEl.value = examples[name] || '';
        inputEl.focus();
    }

    // ------------------------------------------------------------------
    // Error Display
    // ------------------------------------------------------------------

    let errorEl = null;
    function showError(message) {
        hideError();
        inputEl.classList.add('command-error');
        errorEl = document.createElement('div');
        errorEl.className = 'error-message';
        errorEl.setAttribute('role', 'alert');
        errorEl.textContent = '⚠ ' + message;
        inputEl.parentNode.insertBefore(errorEl, inputEl.nextSibling);
    }

    function hideError() {
        inputEl.classList.remove('command-error');
        if (errorEl) {
            errorEl.remove();
            errorEl = null;
        }
    }

    // ------------------------------------------------------------------
    // Event Bindings
    // ------------------------------------------------------------------

    btnRun.addEventListener('click', runAll);
    btnStep.addEventListener('click', runStep);
    btnClearInput.addEventListener('click', resetState);
    btnClear.addEventListener('click', clearAll);
    btnHome.addEventListener('click', function () {
        TURTLE_STATE.x = 0;
        TURTLE_STATE.y = 0;
        TURTLE_STATE.heading = 0;
        updateState();
        drawTurtle();
    });
    btnReset.addEventListener('click', resetState);

    inputEl.addEventListener('keydown', function (e) {
        // Ctrl/Cmd + Enter to run
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            runAll();
        }
    });

    // Example buttons
    document.querySelectorAll('.btn-example').forEach(function (btn) {
        btn.addEventListener('click', function () {
            loadExample(btn.getAttribute('data-example'));
        });
    });

    // ------------------------------------------------------------------
    // Initialize
    // ------------------------------------------------------------------

    setupCanvas();
    updateState();
    drawTurtle();
})();