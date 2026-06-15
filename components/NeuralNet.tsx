"use client";

const W = 400;
const H = 460;
const PAD_X = 44;
const PAD_Y = 30;
const layers = [5, 7, 7, 4];

type Pt = { x: number; y: number };

const cols: Pt[][] = layers.map((count, l) => {
  const x = PAD_X + (l * (W - PAD_X * 2)) / (layers.length - 1);
  const gap = (H - PAD_Y * 2) / (count + 1);
  const arr: Pt[] = [];
  for (let i = 0; i < count; i++) {
    arr.push({ x, y: PAD_Y + (i + 1) * gap });
  }
  return arr;
});

type Edge = { x1: number; y1: number; x2: number; y2: number; key: string };
const edges: Edge[] = [];
for (let l = 0; l < cols.length - 1; l++) {
  for (let a = 0; a < cols[l].length; a++) {
    for (let b = 0; b < cols[l + 1].length; b++) {
      edges.push({
        x1: cols[l][a].x,
        y1: cols[l][a].y,
        x2: cols[l + 1][b].x,
        y2: cols[l + 1][b].y,
        key: l + "-" + a + "-" + b,
      });
    }
  }
}

const viewBox = "0 0 " + W + " " + H;

export default function NeuralNet() {
  return (
    <svg viewBox={viewBox} className="h-full w-full" fill="none" aria-hidden="true">
      <g>
        {edges.map((e, i) => {
          const st = { animationDelay: ((i % 14) * 0.16).toFixed(2) + "s" };
          return (
            <line
              key={e.key}
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
              stroke="#ff5d3b"
              strokeWidth="0.6"
              className="nn-edge"
              style={st}
            />
          );
        })}
      </g>
      <g>
        {cols.map((col, l) =>
          col.map((p, i) => {
            const st = { animationDelay: ((l + i) * 0.2).toFixed(2) + "s" };
            const isEdgeLayer = l === 0 || l === cols.length - 1;
            return (
              <circle
                key={l + "-" + i}
                cx={p.x}
                cy={p.y}
                r={isEdgeLayer ? 5 : 4}
                fill={l === cols.length - 1 ? "#8fe7c4" : "#ece7dd"}
                className="nn-node"
                style={st}
              />
            );
          })
        )}
      </g>
      <text x={PAD_X - 4} y={18} fill="#7c7a74" fontSize="9" fontFamily="monospace">
        input
      </text>
      <text x={W - PAD_X - 30} y={18} fill="#7c7a74" fontSize="9" fontFamily="monospace">
        output
      </text>
    </svg>
  );
}
