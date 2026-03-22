# 🧠 MazeMind: BFS vs DFS Visualizer

An interactive web-based visualization tool to demonstrate the behavior of **Breadth-First Search (BFS)** and **Depth-First Search (DFS)** in a maze environment.

This project helps users understand how different search algorithms explore paths and why BFS guarantees the shortest path while DFS does not.

---

## 🚀 Features

* 🎮 Interactive maze game (WASD / Arrow key controls)
* 🧠 Side-by-side BFS and DFS comparison
* 🔍 Real-time exploration visualization
* 📊 Live stats:

  * Player moves
  * BFS steps
  * DFS steps
  * Nodes explored
* 🎯 Always solvable maze generation
* 🧱 Clean, structured maze (not random noise)
* ⚡ Smooth gameplay with no glitches

---

## 🧠 Algorithm Concepts

### 🔵 Breadth-First Search (BFS)

* Explores nodes level-by-level
* Uses a **queue (FIFO)**
* Guarantees shortest path
* Marks nodes visited when enqueued

### 🟠 Depth-First Search (DFS)

* Explores nodes depth-first
* Uses a **stack (LIFO)**
* Does not guarantee shortest path
* Marks nodes visited when processed

---

## 🎯 What You Can Learn

* Difference between BFS and DFS exploration patterns
* Why BFS is optimal for shortest path problems
* How DFS explores deeply and backtracks
* Efficiency comparison between search algorithms

---

## 🕹️ Controls

| Key   | Action     |
| ----- | ---------- |
| W / ↑ | Move Up    |
| S / ↓ | Move Down  |
| A / ← | Move Left  |
| D / → | Move Right |

---

## 📁 Project Structure

```bash
MazeMind/
│
├── index.html   # UI structure
├── style.css    # Styling
└── script.js    # Game logic + BFS & DFS
```

---

## ⚙️ How to Run

1. Clone the repository:

   ```bash
   git clone https://github.com/samulya896/mazemind.git
   ```

2. Open the folder

3. Run `index.html` in your browser

👉 No installation required

---
