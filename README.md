# 🧠 MazeMind: BFS vs DFS Visualizer

An interactive web-based visualization tool demonstrating **Breadth-First Search (BFS)** and **Depth-First Search (DFS)** in a live maze environment. Built for academic understanding of graph traversal algorithms — watch both algorithms explore in real time, compare their behavior, and play against them.

---

## 🚀 Features

### 🎮 Gameplay
- Interactive maze — move with **WASD** or **Arrow Keys**
- Player navigates from top-left to the goal (bottom-right)
- Two enemies (BFS and DFS) chase the player simultaneously
- Win by reaching the goal; lose if caught

### 🧠 Algorithm Visualization
- **Side-by-side BFS and DFS mazes** rendered independently
- Exploration trail shown in real time — cells color as they are processed
- **Path highlight** — the active route each enemy is following is outlined distinctly on top of the trail
- Both algorithms run to full completion on every player move

### 📋 Live Queue / Stack Inspector
- **BFS Queue panel** (left) — shows the current FIFO queue contents after each move, front item highlighted
- **DFS Stack panel** (right) — shows the current LIFO stack contents, top item highlighted
- Size counter updates every move
- Deduplicated entries for clean display

### 📊 Comparative Analysis (below the game)
- **Last Move Breakdown** — table comparing path length, cells explored, and structure size per move, with a winner column
- **Cells Explored per Move** — live bar chart (BFS blue, DFS orange) growing with each move
- **Session Totals** — cumulative explored counts, step counts, and averages across the full session
- **Verdict callout** — plain-English summary explaining what each move's data means algorithmically

---

## 🧠 Algorithm Implementation

### 🔵 Breadth-First Search (BFS)
- Data structure: **Queue (FIFO)**
- Nodes marked visited **on enqueue** ✓ (correct standard — prevents duplicate queuing)
- Explores level-by-level, guarantees the **shortest path**
- Space complexity: O(V) — frontier can be wide

### 🟠 Depth-First Search (DFS)
- Data structure: **Stack (LIFO)**
- Nodes marked visited **on pop** ✓ (correct for DFS — allows backtracking to be visible)
- Direction order is **fixed** (N → E → S → W) — deterministic, not randomised
- Explores depth-first, **does not guarantee shortest path**
- Space complexity: O(depth) — memory efficient in deep graphs

> Both implementations are academically correct and suitable for citation in coursework.

---

## 🎯 What You Can Observe

| Concept | What to watch |
|---|---|
| BFS shortest-path guarantee | BFS path length ≤ DFS path length every move |
| DFS depth-first exploration | DFS trail forms narrow corridors; BFS spreads wide |
| Queue vs Stack behaviour | Live panels show FIFO vs LIFO ordering in action |
| Exploration efficiency | Chart shows how many cells each algorithm touches per move |
| Backtracking | DFS stack size fluctuates as it pushes/pops during search |

---

## 🕹️ Controls

| Key | Action |
|---|---|
| W / ↑ | Move Up |
| S / ↓ | Move Down |
| A / ← | Move Left |
| D / → | Move Right |
| Start | Begin the game |
| Restart | Generate a new maze and reset all stats |

---

## 🖥️ Layout

```
┌─────────────────────────────────────────────────────────┐
│                   Header + Stats + Insight               │
├──────────────┬──────────────────────────┬───────────────┤
│  BFS Queue   │   BFS Maze  │  DFS Maze  │   DFS Stack   │
│  (FIFO live) │             │            │  (LIFO live)  │
├──────────────┴──────────────────────────┴───────────────┤
│                  Start / Restart                         │
├─────────────────┬───────────────────┬───────────────────┤
│  Last Move      │  Cells Explored   │  Session Totals   │
│  Breakdown      │  Bar Chart        │  + Verdict        │
└─────────────────┴───────────────────┴───────────────────┘
```

---

## 📁 Project Structure

```
MazeMind/
│
├── index.html   # UI structure and layout
├── style.css    # Styling — dark theme, maze cells, panels, chart
└── script.js    # BFS, DFS, maze generation, rendering, analysis
```

---

## ⚙️ How to Run

1. Clone the repository:

   ```bash
   git clone https://github.com/samulya896/mazemind.git
   ```

2. Open the folder

3. Open `index.html` in any modern browser

👉 No installation, no dependencies, no build step required.

---

## 🔬 Academic Notes

- The BFS implementation marks nodes visited **when enqueued**, which is the correct standard. Marking on dequeue allows the same node to enter the queue multiple times — a common mistake this project avoids.
- The DFS implementation marks nodes visited **when popped**, which is correct for DFS. This allows a node to be pushed via multiple paths before being committed, faithfully showing backtracking behaviour.
- DFS direction order is fixed (`N → E → S → W`), making traversal **deterministic** — the same maze will always produce the same DFS path, which is important for academic reproducibility.
- The exploration trail shown in each maze reflects cells **actually processed** by each algorithm, not just the final path. This distinction is what makes the visualisation educationally meaningful.
