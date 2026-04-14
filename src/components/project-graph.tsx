"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

interface GNode {
  id: string;
  label: string;
  type: "project" | "tech";
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface GEdge {
  project: string;
  tech: string;
}

const PROJECT_COLOR = "#F59E0B";
const TECH_COLOR    = "#8B7D6B";
const HOT_COLOR     = "#F59E0B";

const PROJECTS = [
  { id: "kernex",   label: "Kernex" },
  { id: "mercer",   label: "Mercer" },
  { id: "cynosure", label: "Cynosure" },
  { id: "encleare", label: "Encleare" },
  { id: "valerie",  label: "Valerie" },
];

const TECHS = [
  "Rust", "Python", "LLM", "SGLang", "PyTorch",
  "DuckDB", "Next.js", "Security", "Plaid", "Supabase",
];

const EDGES: GEdge[] = [
  { project: "kernex",   tech: "Rust"     },
  { project: "kernex",   tech: "Security" },
  { project: "kernex",   tech: "Python"   },
  { project: "mercer",   tech: "Python"   },
  { project: "mercer",   tech: "LLM"      },
  { project: "mercer",   tech: "SGLang"   },
  { project: "cynosure", tech: "Python"   },
  { project: "cynosure", tech: "LLM"      },
  { project: "cynosure", tech: "DuckDB"   },
  { project: "encleare", tech: "Next.js"  },
  { project: "encleare", tech: "LLM"      },
  { project: "encleare", tech: "Plaid"    },
  { project: "encleare", tech: "Supabase" },
  { project: "valerie",  tech: "PyTorch"  },
  { project: "valerie",  tech: "Python"   },
];

function initNodes(w: number, h: number): GNode[] {
  const nodes: GNode[] = [];

  // Project nodes in a ring
  PROJECTS.forEach((p, i) => {
    const angle = (i / PROJECTS.length) * Math.PI * 2 - Math.PI / 2;
    const r = Math.min(w, h) * 0.28;
    nodes.push({
      id: p.id,
      label: p.label,
      type: "project",
      x: w / 2 + Math.cos(angle) * r,
      y: h / 2 + Math.sin(angle) * r,
      vx: 0,
      vy: 0,
      radius: 34,
    });
  });

  // Tech nodes scattered
  TECHS.forEach((t) => {
    nodes.push({
      id: `tech-${t}`,
      label: t,
      type: "tech",
      x: Math.random() * w * 0.7 + w * 0.15,
      y: Math.random() * h * 0.7 + h * 0.15,
      vx: 0,
      vy: 0,
      radius: 24,
    });
  });

  return nodes;
}

export default function ProjectGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef  = useRef<GNode[]>([]);
  const mouseRef  = useRef<{ x: number; y: number } | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const rafRef = useRef<number>(0);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width  = canvas.offsetWidth  * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx!.scale(devicePixelRatio, devicePixelRatio);
      nodesRef.current = initNodes(canvas.offsetWidth, canvas.offsetHeight);
    };
    resize();
    window.addEventListener("resize", resize);

    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    function tick() {
      const nodes = nodesRef.current;
      const W = w();
      const H = h();

      for (const node of nodes) {
        // Spring attraction to edges
        for (const edge of EDGES) {
          const myId   = node.type === "project" ? node.id : `tech-${node.label}`;
          const linkId = node.type === "project" ? `tech-${edge.tech}` : edge.project;
          if ((node.id === edge.project || node.id === `tech-${edge.tech}`) ) {
            const other = nodes.find((n) =>
              node.type === "project" ? n.id === `tech-${edge.tech}` : n.id === edge.project
            );
            void myId; void linkId;
            if (other) {
              const dx = other.x - node.x;
              const dy = other.y - node.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const target = 120;
              const f = (dist - target) / dist * 0.04;
              node.vx += dx * f;
              node.vy += dy * f;
            }
          }
        }

        // Center gravity
        node.vx += (W / 2 - node.x) * 0.003;
        node.vy += (H / 2 - node.y) * 0.003;

        // Node-node repulsion
        for (const other of nodes) {
          if (other.id === node.id) continue;
          const rx = node.x - other.x;
          const ry = node.y - other.y;
          const d  = Math.sqrt(rx * rx + ry * ry) || 1;
          if (d < 100) {
            const f = (100 - d) / 100;
            node.vx += (rx / d) * f * 1.5;
            node.vy += (ry / d) * f * 1.5;
          }
        }

        // Mouse repulsion
        const mouse = mouseRef.current;
        if (mouse) {
          const mx = mouse.x - node.x;
          const my = mouse.y - node.y;
          const md = Math.sqrt(mx * mx + my * my);
          if (md < 90 && md > 0) {
            const f = (90 - md) / 90;
            node.vx -= (mx / md) * f * 2;
            node.vy -= (my / md) * f * 2;
          }
        }

        node.vx *= 0.80;
        node.vy *= 0.80;
        node.x  += node.vx;
        node.y  += node.vy;
        node.x   = Math.max(node.radius + 4, Math.min(W - node.radius - 4, node.x));
        node.y   = Math.max(node.radius + 4, Math.min(H - node.radius - 4, node.y));
      }
    }

    function draw() {
      const nodes = nodesRef.current;
      const W = w();
      const H = h();
      ctx.clearRect(0, 0, W, H);

      // Determine highlighted set
      const highlight = new Set<string>();
      if (hovered) {
        highlight.add(hovered);
        for (const edge of EDGES) {
          const projId  = edge.project;
          const techId  = `tech-${edge.tech}`;
          if (hovered === projId || hovered === techId) {
            highlight.add(projId);
            highlight.add(techId);
          }
        }
      }

      // Edges
      for (const edge of EDGES) {
        const proj = nodes.find((n) => n.id === edge.project);
        const tech = nodes.find((n) => n.id === `tech-${edge.tech}`);
        if (!proj || !tech) continue;
        const hot = highlight.has(edge.project) && highlight.has(`tech-${edge.tech}`);
        ctx.beginPath();
        ctx.moveTo(proj.x, proj.y);
        ctx.lineTo(tech.x, tech.y);
        ctx.strokeStyle = hot ? "rgba(245,158,11,0.4)" : "rgba(42,34,24,0.8)";
        ctx.lineWidth   = hot ? 1.5 : 1;
        ctx.stroke();
      }

      // Nodes
      for (const node of nodes) {
        const isProject = node.type === "project";
        const baseColor = isProject ? PROJECT_COLOR : TECH_COLOR;
        const hot       = hovered ? highlight.has(node.id) : false;
        const color     = hot ? HOT_COLOR : baseColor;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle   = hot ? color + "1A" : "rgba(18,16,13,0.9)";
        ctx.fill();
        ctx.strokeStyle = hot ? color : color + (isProject ? "88" : "44");
        ctx.lineWidth   = hot ? 1.5 : isProject ? 1.2 : 0.8;
        ctx.stroke();

        ctx.font           = `${hot ? 500 : 400} ${isProject ? 11 : 10}px monospace`;
        ctx.fillStyle      = hot ? color : isProject ? "rgba(245,240,232,0.8)" : "rgba(139,125,107,0.7)";
        ctx.textAlign      = "center";
        ctx.textBaseline   = "middle";
        ctx.fillText(node.label, node.x, node.y);
      }
    }

    function loop() {
      if (!shouldReduce) tick();
      draw();
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldReduce]);

  // Redraw when hover changes
  useEffect(() => { /* loop already handles it */ }, [hovered]);

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const mx   = e.clientX - rect.left;
    const my   = e.clientY - rect.top;
    mouseRef.current = { x: mx, y: my };
    const hit  = nodesRef.current.find((n) => {
      const dx = n.x - mx, dy = n.y - my;
      return Math.sqrt(dx * dx + dy * dy) <= n.radius;
    });
    setHovered(hit?.id ?? null);
  }

  function onMouseLeave() {
    mouseRef.current = null;
    setHovered(null);
  }

  return (
    <div>
      <div className="flex items-center gap-6 mb-4">
        {[
          { color: PROJECT_COLOR, label: "project" },
          { color: TECH_COLOR,    label: "technology" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                border: `1px solid ${color}`,
              }}
            />
            <span
              className="font-mono"
              style={{ fontSize: "10px", color: "var(--color-muted)", letterSpacing: "0.08em" }}
            >
              {label}
            </span>
          </div>
        ))}
        <span
          className="font-mono ml-auto"
          style={{ fontSize: "10px", color: "var(--color-amber-dim)" }}
        >
          hover to explore connections
        </span>
      </div>

      <canvas
        ref={canvasRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          width: "100%",
          height: "380px",
          cursor: hovered ? "pointer" : "default",
          display: "block",
        }}
      />
    </div>
  );
}
