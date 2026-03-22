/* ═══════════════════════════════════════════════════════════
   MAZE AI VISUALIZER — BFS vs DFS
   ═══════════════════════════════════════════════════════════

   BFS — Queue (FIFO).
     Nodes are marked visited ON ENQUEUE. This is the correct
     standard: marking on dequeue allows the same node to be
     queued multiple times, wasting work. BFS always finds the
     shortest path.

   DFS — Stack (LIFO).
     Nodes are marked visited ON POP (not on push). This is
     correct for DFS: the same node can be pushed via multiple
     paths before being processed, so we only commit when we
     actually process it. Direction order is FIXED (no shuffling)
     making the traversal deterministic and academically meaningful.

   Visualisation:
     bfsVisited / dfsVisited accumulate every cell each algorithm
     actually processes (dequeues/pops) over time, so the coloured
     trail reflects true exploration order — not just the path.
   ═══════════════════════════════════════════════════════════ */

// Fixed direction order — deterministic, no randomisation
const DIRS = [[-1,0],[0,1],[1,0],[0,-1]]; // N E S W

const ROWS = 12, COLS = 12;

let state = {
  maze: [],
  player: {},
  goal: {},
  enemyStart: {},
  bfsPos: {},
  dfsPos: {},
  bfsVisited: new Set(),   // all cells BFS has fully processed
  dfsVisited: new Set(),   // all cells DFS has fully processed
  playerMoves: 0,
  bfsSteps: 0,
  dfsSteps: 0,
  started: false,
  running: false
};

/* ── INIT ─────────────────────────────────────── */
function init() {
  state.maze = generateMaze();
  findEntities();

  state.bfsPos = {...state.enemyStart};
  state.dfsPos = {...state.enemyStart};

  state.bfsVisited = new Set();
  state.dfsVisited = new Set();

  state.playerMoves = 0;
  state.bfsSteps = 0;
  state.dfsSteps = 0;

  state.started = false;
  state.running = false;

  updateStatus("Press Start");
  document.getElementById("insight").textContent = "BFS finds shortest path · DFS explores depth-first";
  document.getElementById("bfsExplored").textContent = 0;
  document.getElementById("dfsExplored").textContent = 0;
  render();
}

/* ── MAZE GENERATION ──────────────────────────── */
function generateMaze() {
  let maze;
  do {
    maze = [];
    for (let r = 0; r < ROWS; r++) {
      const row = [];
      for (let c = 0; c < COLS; c++) {
        row.push(Math.random() < 0.18 ? '#' : '.');
      }
      maze.push(row);
    }
    for (let r = 2; r < ROWS - 2; r += 3) {
      for (let c = 2; c < COLS - 2; c++) {
        if (Math.random() < 0.5) maze[r][c] = '#';
      }
    }
    maze[0][0]           = 'P';
    maze[ROWS-1][0]      = 'E';
    maze[ROWS-1][COLS-1] = 'G';
  } while (
    !pathExists({r:0,c:0},      {r:ROWS-1,c:COLS-1}, maze) ||
    !pathExists({r:ROWS-1,c:0}, {r:0,c:0},           maze)
  );
  return maze;
}

// Reachability check used only during maze generation
function pathExists(start, end, maze) {
  const seen = new Set();
  const queue = [start];
  seen.add(`${start.r},${start.c}`);
  while (queue.length) {
    const cur = queue.shift();
    if (cur.r === end.r && cur.c === end.c) return true;
    for (const [dr, dc] of DIRS) {
      const nr = cur.r + dr, nc = cur.c + dc;
      const k = `${nr},${nc}`;
      if (!seen.has(k) && passable(nr, nc, maze)) {
        seen.add(k);
        queue.push({r:nr, c:nc});
      }
    }
  }
  return false;
}

function findEntities() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (state.maze[r][c] === 'P') state.player     = {r, c};
      if (state.maze[r][c] === 'E') state.enemyStart = {r, c};
      if (state.maze[r][c] === 'G') state.goal       = {r, c};
    }
  }
}

function passable(r, c, maze = state.maze) {
  return r >= 0 && r < ROWS && c >= 0 && c < COLS && maze[r][c] !== '#';
}

/* ══════════════════════════════════════════════════════════
   BFS — correct implementation
   Uses a Queue (FIFO). Marks visited ON ENQUEUE.
   Returns the shortest path from start → target,
   plus the full set of explored (processed) cells.
   ══════════════════════════════════════════════════════════ */
function bfs(start, target) {
  const seen     = new Set();   // enqueued — prevents re-queuing
  const explored = new Set();   // dequeued — fully processed

  const queue = [{ pos: start, path: [start] }];
  seen.add(`${start.r},${start.c}`);   // mark on enqueue ✓

  while (queue.length) {
    const { pos, path } = queue.shift();
    explored.add(`${pos.r},${pos.c}`);

    if (pos.r === target.r && pos.c === target.c) {
      return { path, explored };
    }

    for (const [dr, dc] of DIRS) {
      const np = { r: pos.r + dr, c: pos.c + dc };
      const nk = `${np.r},${np.c}`;
      if (!seen.has(nk) && passable(np.r, np.c)) {
        seen.add(nk);              // mark when enqueuing ✓
        queue.push({ pos: np, path: [...path, np] });
      }
    }
  }
  return { path: null, explored };
}

/* ══════════════════════════════════════════════════════════
   DFS — correct implementation
   Uses a Stack (LIFO). Marks visited ON POP.
   Direction order is fixed — no randomisation.
   Marking on pop is correct for DFS: a node may be pushed
   multiple times via different paths before processing,
   and we only commit once we actually process it.
   ══════════════════════════════════════════════════════════ */
function dfs(start, target) {
  const explored = new Set();   // popped (processed)

  const stack = [{ pos: start, path: [start] }];

  while (stack.length) {
    const { pos, path } = stack.pop();
    const k = `${pos.r},${pos.c}`;

    if (explored.has(k)) continue;  // already processed via another stack entry
    explored.add(k);                // mark on pop ✓

    if (pos.r === target.r && pos.c === target.c) {
      return { path, explored };
    }

    // Push in reverse so DIRS[0] is processed first (top of stack)
    for (let i = DIRS.length - 1; i >= 0; i--) {
      const [dr, dc] = DIRS[i];
      const np = { r: pos.r + dr, c: pos.c + dc };
      if (!explored.has(`${np.r},${np.c}`) && passable(np.r, np.c)) {
        stack.push({ pos: np, path: [...path, np] });
      }
    }
  }
  return { path: null, explored };
}

/* ── PLAYER MOVE ──────────────────────────────── */
function movePlayer(dr, dc) {
  if (!state.started || state.running) return;

  const nr = state.player.r + dr;
  const nc = state.player.c + dc;
  if (!passable(nr, nc)) return;

  state.player = {r: nr, c: nc};
  state.playerMoves++;

  if (nr === state.goal.r && nc === state.goal.c) {
    render();
    updateStatus("🎉 YOU WIN");
    state.started = false;
    return;
  }

  step();
}

/* ── STEP — run both algos, advance enemies ────── */
function step() {
  state.running = true;

  // Run BFS to completion from enemy → player
  const bfsResult = bfs(state.bfsPos, state.player);
  // Accumulate every cell BFS actually processed into the visible trail
  bfsResult.explored.forEach(k => state.bfsVisited.add(k));

  // Run DFS to completion from enemy → player
  const dfsResult = dfs(state.dfsPos, state.player);
  dfsResult.explored.forEach(k => state.dfsVisited.add(k));

  // Advance each enemy one step along its found path
  if (bfsResult.path && bfsResult.path.length > 1) {
    state.bfsPos = bfsResult.path[1];
    state.bfsSteps++;
  }
  if (dfsResult.path && dfsResult.path.length > 1) {
    state.dfsPos = dfsResult.path[1];
    state.dfsSteps++;
  }

  // Catch check
  const caught =
    (state.bfsPos.r === state.player.r && state.bfsPos.c === state.player.c) ||
    (state.dfsPos.r === state.player.r && state.dfsPos.c === state.player.c);

  render();
  updateInsight(bfsResult, dfsResult);

  if (caught) {
    updateStatus("💀 CAUGHT");
    state.started = false;
    return;
  }

  setTimeout(() => { state.running = false; }, 120);
}

/* ── RENDER ───────────────────────────────────── */
function render() {
  document.getElementById("playerMoves").textContent = state.playerMoves;
  document.getElementById("bfsSteps").textContent    = state.bfsSteps;
  document.getElementById("dfsSteps").textContent    = state.dfsSteps;
  document.getElementById("bfsExplored").textContent = state.bfsVisited.size;
  document.getElementById("dfsExplored").textContent = state.dfsVisited.size;

  draw("mazeBFS", state.bfsPos, state.bfsVisited, true);
  draw("mazeDFS", state.dfsPos, state.dfsVisited, false);
}

function draw(id, enemyPos, visited, isBFS) {
  const el = document.getElementById(id);
  el.innerHTML = "";
  el.style.gridTemplateColumns = `repeat(${COLS}, 32px)`;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      const k = `${r},${c}`;

      if (state.maze[r][c] === '#') {
        cell.classList.add("wall");
      } else if (r === state.player.r && c === state.player.c) {
        cell.classList.add("player");
      } else if (r === enemyPos.r && c === enemyPos.c) {
        cell.classList.add("enemy");
      } else if (r === state.goal.r && c === state.goal.c) {
        cell.classList.add("goal");
      } else if (visited.has(k)) {
        cell.classList.add(isBFS ? "visited-bfs" : "visited-dfs");
      }

      el.appendChild(cell);
    }
  }
}

/* ── INSIGHT ──────────────────────────────────── */
function updateInsight(bfsResult, dfsResult) {
  const bfsPath = bfsResult.path ? bfsResult.path.length : 0;
  const dfsPath = dfsResult.path ? dfsResult.path.length : 0;
  const bfsExp  = bfsResult.explored.size;
  const dfsExp  = dfsResult.explored.size;

  let msg;
  if (bfsPath > 0 && dfsPath > 0) {
    const diff = dfsPath - bfsPath;
    if (diff > 0) {
      msg = `BFS path: ${bfsPath} steps (shortest) · DFS path: ${dfsPath} steps (+${diff} longer) · BFS explored ${bfsExp} cells, DFS explored ${dfsExp}`;
    } else if (diff === 0) {
      msg = `Both found equal-length paths (${bfsPath} steps) · BFS explored ${bfsExp} cells, DFS explored ${dfsExp}`;
    } else {
      msg = `DFS found a shorter path this run (${dfsPath} vs ${bfsPath}) · BFS explored ${bfsExp}, DFS explored ${dfsExp}`;
    }
  } else {
    msg = `BFS explored ${bfsExp} cells · DFS explored ${dfsExp} cells`;
  }

  document.getElementById("insight").textContent = msg;
}

/* ── STATUS ───────────────────────────────────── */
function updateStatus(msg) {
  document.getElementById("status").textContent = msg;
}

/* ── CONTROLS ─────────────────────────────────── */
document.getElementById("startBtn").onclick = () => {
  state.started = true;
  updateStatus("Running...");
};

document.getElementById("restartBtn").onclick = init;

document.addEventListener("keydown", e => {
  if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
    e.preventDefault();
  }
  if (e.key === "ArrowUp"    || e.key === "w") movePlayer(-1,  0);
  if (e.key === "ArrowDown"  || e.key === "s") movePlayer( 1,  0);
  if (e.key === "ArrowLeft"  || e.key === "a") movePlayer( 0, -1);
  if (e.key === "ArrowRight" || e.key === "d") movePlayer( 0,  1);
});

init();
