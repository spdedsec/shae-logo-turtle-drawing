/**
 * SHAE Logo Turtle Drawing - Production Application
 * Full Logo interpreter with turtle graphics
 */

(function() {
  'use strict';

  // ============================================================================
  // TURTLE STATE
  // ============================================================================
  const TurtleState = {
    x: 0,
    y: 0,
    heading: 0,
    penDown: true,
    penColor: { r: 0, g: 122, b: 255 },
    penSize: 2,
    visible: true,
    canvasWidth: 800,
    canvasHeight: 600,
    history: []
  };

  // ============================================================================
  // CANVAS & RENDERING
  // ============================================================================
  const canvas = document.getElementById('turtleCanvas');
  const ctx = canvas.getContext('2d');
  const turtleCursor = document.getElementById('turtleCursor');
  const canvasWrapper = document.querySelector('.canvas-wrapper');

  // DPR handling for crisp rendering
  let dpr = window.devicePixelRatio || 1;
  function resizeCanvas() {
    const rect = canvasWrapper.getBoundingClientRect();
    const maxWidth = Math.min(800, rect.width - 32);
    const maxHeight = Math.min(600, rect.height - 32);
    const size = Math.min(maxWidth, maxHeight / (3/4));
    
    TurtleState.canvasWidth = size;
    TurtleState.canvasHeight = size * 0.75;
    
    canvas.width = TurtleState.canvasWidth * dpr;
    canvas.height = TurtleState.canvasHeight * dpr;
    canvas.style.width = TurtleState.canvasWidth + 'px';
    canvas.style.height = TurtleState.canvasHeight + 'px';
    ctx.scale(dpr, dpr);
    
    // Center coordinate system
    ctx.translate(TurtleState.canvasWidth / 2, TurtleState.canvasHeight / 2);
    ctx.scale(1, -1); // Y-up coordinate system
    
    redraw();
  }

  // ============================================================================
  // DRAWING PRIMITIVES
  // ============================================================================
  function drawLine(x1, y1, x2, y2, color, width) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }

  function drawTurtle() {
    if (!TurtleState.visible) return;
    
    const x = TurtleState.x;
    const y = TurtleState.y;
    const h = TurtleState.heading * Math.PI / 180;
    const size = 12;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-h); // Negative because Y is flipped
    
    // Turtle body
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.7, size * 0.5);
    ctx.lineTo(-size * 0.7, size * 0.5);
    ctx.closePath();
    ctx.fillStyle = `rgb(${TurtleState.penColor.r}, ${TurtleState.penColor.g}, ${TurtleState.penColor.b})`;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    ctx.restore();
  }

  function clearCanvas() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    
    // Dynamic Apple HIG canvas background
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    ctx.fillStyle = isDark ? '#1C1C1E' : '#FFFFFF';
    ctx.fillRect(-TurtleState.canvasWidth/2, -TurtleState.canvasHeight/2, TurtleState.canvasWidth, TurtleState.canvasHeight);
  }

  function redraw() {
    clearCanvas();
    
    // Redraw all history lines
    for (const segment of TurtleState.history) {
      drawLine(segment.x1, segment.y1, segment.x2, segment.y2, segment.color, segment.width);
    }
    
    drawTurtle();
    updateCursor();
    updateStateDisplay();
  }

  function updateCursor() {
    const rect = canvas.getBoundingClientRect();
    const cx = rect.left + rect.width / 2 + TurtleState.x;
    const cy = rect.top + rect.height / 2 - TurtleState.y; // Y flipped
    turtleCursor.style.transform = `translate(${cx}px, ${cy}px) rotate(${TurtleState.heading}deg)`;
    turtleCursor.style.display = TurtleState.visible ? 'block' : 'none';
  }

  // ============================================================================
  // TURTLE COMMANDS
  // ============================================================================
  function forward(distance) {
    const rad = TurtleState.heading * Math.PI / 180;
    const newX = TurtleState.x + distance * Math.cos(rad);
    const newY = TurtleState.y + distance * Math.sin(rad);
    
    if (TurtleState.penDown) {
      TurtleState.history.push({
        x1: TurtleState.x,
        y1: TurtleState.y,
        x2: newX,
        y2: newY,
        color: { ...TurtleState.penColor },
        width: TurtleState.penSize
      });
    }
    
    TurtleState.x = newX;
    TurtleState.y = newY;
  }

  function backward(distance) {
    forward(-distance);
  }

  function right(degrees) {
    TurtleState.heading = (TurtleState.heading + degrees) % 360;
  }

  function left(degrees) {
    TurtleState.heading = (TurtleState.heading - degrees) % 360;
    if (TurtleState.heading < 0) TurtleState.heading += 360;
  }

  function setHeading(degrees) {
    TurtleState.heading = degrees % 360;
    if (TurtleState.heading < 0) TurtleState.heading += 360;
  }

  function setPosition(x, y) {
    if (TurtleState.penDown) {
      TurtleState.history.push({
        x1: TurtleState.x,
        y1: TurtleState.y,
        x2: x,
        y2: y,
        color: { ...TurtleState.penColor },
        width: TurtleState.penSize
      });
    }
    TurtleState.x = x;
    TurtleState.y = y;
  }

  function home() {
    setPosition(0, 0);
    setHeading(0);
  }

  function clearScreen() {
    TurtleState.history = [];
    home();
  }

  function penUp() { TurtleState.penDown = false; }
  function penDown() { TurtleState.penDown = true; }

  function setPenColor(r, g, b) {
    TurtleState.penColor = {
      r: Math.max(0, Math.min(255, Math.round(r))),
      g: Math.max(0, Math.min(255, Math.round(g))),
      b: Math.max(0, Math.min(255, Math.round(b)))
    };
  }

  function setPenSize(size) {
    TurtleState.penSize = Math.max(0.5, Math.min(50, size));
  }

  function showTurtle() { TurtleState.visible = true; }
  function hideTurtle() { TurtleState.visible = false; }

  // ============================================================================
  // COMMAND PARSER & INTERPRETER
  // ============================================================================
  const CommandParser = {
    tokens: [],
    pos: 0,

    tokenize(input) {
      // Replace brackets with spaced versions for easier parsing
      input = input.replace(/\[/g, ' [ ').replace(/\]/g, ' ] ');
      // Split on whitespace, preserving quoted strings
      const regex = /"[^"]*"|'[^']*'|\S+/g;
      this.tokens = input.match(regex) || [];
      this.pos = 0;
      return this.tokens;
    },

    peek() { return this.tokens[this.pos] || null; },
    consume() { return this.tokens[this.pos++]; },
    expect(type) {
      const token = this.consume();
      if (!token) throw new Error(`Expected ${type}, got EOF`);
      return token;
    },

    parseNumber() {
      const token = this.consume();
      const num = parseFloat(token);
      if (isNaN(num)) throw new Error(`Expected number, got "${token}"`);
      return num;
    },

    parseColor() {
      const r = this.parseNumber();
      const g = this.parseNumber();
      const b = this.parseNumber();
      return { r, g, b };
    },

    parseCommand() {
      const token = this.peek();
      if (!token) return null;

      const cmd = token.toUpperCase();
      this.consume();

      switch (cmd) {
        // Movement
        case 'FORWARD': case 'FD':
          return { type: 'forward', distance: this.parseNumber() };
        case 'BACK': case 'BACKWARD': case 'BK':
          return { type: 'backward', distance: this.parseNumber() };
        case 'RIGHT': case 'RT':
          return { type: 'right', degrees: this.parseNumber() };
        case 'LEFT': case 'LT':
          return { type: 'left', degrees: this.parseNumber() };
        case 'SETXY':
          return { type: 'setxy', x: this.parseNumber(), y: this.parseNumber() };
        case 'SETHEADING': case 'SETH':
          return { type: 'seth', degrees: this.parseNumber() };
        case 'HOME':
          return { type: 'home' };

        // Pen control
        case 'PENUP': case 'PU':
          return { type: 'penup' };
        case 'PENDOWN': case 'PD':
          return { type: 'pendown' };
        case 'PENCOLOR': case 'PC':
          return { type: 'pencolor', color: this.parseColor() };
        case 'PENSIZE': case 'PS':
          return { type: 'pensize', size: this.parseNumber() };

        // Screen control
        case 'CLEARSCREEN': case 'CS':
          return { type: 'clear' };
        case 'SHOWTURTLE': case 'ST':
          return { type: 'showturtle' };
        case 'HIDETURTLE': case 'HT':
          return { type: 'hideturtle' };

        // Control flow
        case 'REPEAT':
          const count = Math.floor(this.parseNumber());
          if (this.peek() !== '[') throw new Error('Expected "[" after REPEAT count');
          this.consume(); // consume [
          const body = this.parseBlock();
          if (this.peek() !== ']') throw new Error('Expected "]" to close REPEAT');
          this.consume(); // consume ]
          return { type: 'repeat', count, body };

        case 'IF':
          const condition = this.parseCondition();
          if (this.peek() !== '[') throw new Error('Expected "[" after IF condition');
          this.consume();
          const ifBody = this.parseBlock();
          if (this.peek() !== ']') throw new Error('Expected "]" to close IF');
          this.consume();
          return { type: 'if', condition, body };

        default:
          throw new Error(`Unknown command: "${token}"`);
      }
    },

    parseCondition() {
      // Simple condition: variable comparison
      const left = this.consume();
      const op = this.consume();
      const right = this.parseNumber();
      return { left, op, right };
    },

    parseBlock() {
      const commands = [];
      while (this.peek() && this.peek() !== ']') {
        commands.push(this.parseCommand());
      }
      return commands;
    },

    parse(input) {
      this.tokenize(input);
      const commands = [];
      while (this.peek()) {
        commands.push(this.parseCommand());
      }
      return commands;
    }
  };

  const Interpreter = {
    execute(commands) {
      for (const cmd of commands) {
        this.executeCommand(cmd);
      }
    },

    executeCommand(cmd) {
      switch (cmd.type) {
        case 'forward': forward(cmd.distance); break;
        case 'backward': backward(cmd.distance); break;
        case 'right': right(cmd.degrees); break;
        case 'left': left(cmd.degrees); break;
        case 'seth': setHeading(cmd.degrees); break;
        case 'setxy': setPosition(cmd.x, cmd.y); break;
        case 'home': home(); break;
        case 'penup': penUp(); break;
        case 'pendown': penDown(); break;
        case 'pencolor': setPenColor(cmd.color.r, cmd.color.g, cmd.color.b); break;
        case 'pensize': setPenSize(cmd.size); break;
        case 'clear': clearScreen(); break;
        case 'showturtle': showTurtle(); break;
        case 'hideturtle': hideTurtle(); break;
        case 'repeat':
          for (let i = 0; i < cmd.count; i++) {
            this.execute(cmd.body);
          }
          break;
        case 'if':
          if (this.evalCondition(cmd.condition)) {
            this.execute(cmd.body);
          }
          break;
      }
      redraw();
    },

    evalCondition(cond) {
      let leftVal;
      switch (cond.left.toUpperCase()) {
        case 'XPOS': leftVal = TurtleState.x; break;
        case 'YPOS': leftVal = TurtleState.y; break;
        case 'HEADING': leftVal = TurtleState.heading; break;
        default: leftVal = parseFloat(cond.left) || 0;
      }
      const rightVal = cond.right;
      switch (cond.op) {
        case '=': case '==': return leftVal === rightVal;
        case '!=': case '<>': return leftVal !== rightVal;
        case '<': return leftVal < rightVal;
        case '>': return leftVal > rightVal;
        case '<=': return leftVal <= rightVal;
        case '>=': return leftVal >= rightVal;
        default: return false;
      }
    }
  };

  // ============================================================================
  // UI STATE MANAGEMENT
  // ============================================================================
  const commandInput = document.getElementById('commandInput');
  const runBtn = document.getElementById('runBtn');
  const clearBtn = document.getElementById('clearBtn');
  const exportBtn = document.getElementById('exportBtn');
  const historyList = document.getElementById('historyList');
  const quickBtns = document.querySelectorAll('.quick-btn');

  let commandHistory = [];
  let historyIndex = -1;

  function addToHistory(cmd, success = true, error = null) {
    commandHistory.unshift({ cmd, success, error, time: Date.now() });
    if (commandHistory.length > 50) commandHistory.pop();
    renderHistory();
  }

  function renderHistory() {
    if (commandHistory.length === 0) {
      historyList.innerHTML = '<div class="empty">No commands yet</div>';
      return;
    }
    historyList.innerHTML = commandHistory.map(h => `
      <div class="history-entry ${h.success ? '' : 'error'}">
        <span class="cmd">${escapeHtml(h.cmd)}</span>
        ${!h.success ? `<span class="result">Error: ${escapeHtml(h.error)}</span>` : ''}
      </div>
    `).join('');
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function updateStateDisplay() {
    document.getElementById('posDisplay').textContent = `${TurtleState.x.toFixed(1)}, ${TurtleState.y.toFixed(1)}`;
    document.getElementById('headingDisplay').textContent = `${((TurtleState.heading % 360) + 360) % 360}°`;
    document.getElementById('penDisplay').textContent = TurtleState.penDown ? 'DOWN' : 'UP';
    document.getElementById('colorDisplay').innerHTML = `<span class="color-swatch" style="background: rgb(${TurtleState.penColor.r},${TurtleState.penColor.g},${TurtleState.penColor.b})"></span>RGB(${TurtleState.penColor.r},${TurtleState.penColor.g},${TurtleState.penColor.b})`;
    document.getElementById('sizeDisplay').textContent = TurtleState.penSize;
  }

  // ============================================================================
  // COMMAND EXECUTION
  // ============================================================================
  function executeInput(input) {
    const trimmed = input.trim();
    if (!trimmed) return;

    try {
      const commands = CommandParser.parse(trimmed);
      Interpreter.execute(commands);
      addToHistory(trimmed, true);
    } catch (e) {
      addToHistory(trimmed, false, e.message);
      console.error('Execution error:', e);
    }
  }

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  function handleRun() {
    const input = commandInput.value.trim();
    if (input) {
      executeInput(input);
      commandInput.value = '';
      commandInput.focus();
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleRun();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        commandInput.value = commandHistory[historyIndex].cmd;
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        commandInput.value = commandHistory[historyIndex].cmd;
      } else {
        historyIndex = -1;
        commandInput.value = '';
      }
    } else if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      clearScreen();
      addToHistory('CLEARSCREEN', true);
    } else if (e.key === 'e' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      exportPNG();
    }
  }

  function handleClear() {
    clearScreen();
    addToHistory('CLEARSCREEN', true);
  }

  function exportPNG() {
    const link = document.createElement('a');
    link.download = `shae-turtle-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  function handleQuickCommand(e) {
    const cmd = e.target.dataset.cmd;
    if (cmd) {
      commandInput.value = cmd;
      commandInput.focus();
      // Auto-run for simple commands
      if (!cmd.includes('[')) {
        setTimeout(handleRun, 50);
      }
    }
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================
  function init() {
    resizeCanvas();
    redraw();
    updateStateDisplay();
    renderHistory();

    // Event listeners
    runBtn.addEventListener('click', handleRun);
    clearBtn.addEventListener('click', handleClear);
    exportBtn.addEventListener('click', exportPNG);
    commandInput.addEventListener('keydown', handleKeyDown);
    
    quickBtns.forEach(btn => {
      btn.addEventListener('click', handleQuickCommand);
    });

    window.addEventListener('resize', () => {
      resizeCanvas();
    });

    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        redraw();
      });
    }

    // Focus input on load
    commandInput.focus();

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.target === commandInput) return;
      if (e.key === '/') {
        e.preventDefault();
        commandInput.focus();
      }
    });

    console.log('SHAE Logo Turtle initialized');
  }

  // Start when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
