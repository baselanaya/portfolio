"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

interface SkillNode {
  id: string;
  label: string;
  group: "AI/ML" | "Systems" | "Web" | "Data";
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Edge {
  a: string;
  b: string;
}

const GROUP_COLORS: Record<string, string> = {
  "AI/ML":   "#F59E0B",
  Systems:   "#C2410C",
  Web:       "#8B7D6B",
  Data:      "#92400E",
};

const SKILLS: Omit<SkillNode, "x" | "y" | "vx" | "vy" | "radius">[] = [
  { id: "pytorch",    label: "PyTorch",      group: "AI/ML"   },
  { id: "sglang",     label: "SGLang",       group: "AI/ML"   },
  { id: "llm",        label: "LLM Inference",group: "AI/ML"   },
  { id: "finetune",   label: "Fine-tuning",  group: "AI/ML"   },
  { id: "agents",     label: "AI Agents",    group: "AI/ML"   },
  { id: "nlp",        label: "Arabic NLP",   group: "AI/ML"   },
  { id: "rust",       label: "Rust",         group: "Systems" },
  { id: "kernel",     label: "Kernel Dev",   group: "Systems" },
  { id: "security",   label: "Zero-Trust",   group: "Systems" },
  { id: "hypervisor", label: "Hypervisor",   group: "Systems" },
  { id: "linux",      label: "Linux",        group: "Systems" },
  { id: "nextjs",     label: "Next.js",      group: "Web"     },
  { id: "typescript", label: "TypeScript",   group: "Web"     },
  { id: "python",     label: "Python",       group: "Web"     },
  { id: "duckdb",     label: "DuckDB",       group: "Data"    },
  { id: "sql",        label: "SQL",          group: "Data"    },
];

// Edges represent co-occurrence in projects
const EDGES: Edge[] = [
  { a: "rust",       b: "kernel"     },
  { a: "rust",       b: "hypervisor" },
  { a: "rust",       b: "security"   },
  { a: "kernel",     b: "hypervisor" },
  { a: "kernel",     b: "security"   },
  { a: "llm",        b: "sglang"     },
  { a: "llm",        b: "agents"     },
  { a: "llm",        b: "finetune"   },
  { a: "sglang",     b: "finetune"   },
  { a: "pytorch",    b: "finetune"   },
  { a: "pytorch",    b: "nlp"        },
  { a: "duckdb",     b: "sql"        },
  { a: "nextjs",     b: "typescript" },
  { a: "agents",     b: "security"   },
  { a: "python",     b: "llm"        },
  { a: "python",     b: "duckdb"     },
];

function initNodes(w: number, h: number): SkillNode[] {
  return SKILLS.map((s) => ({
    ...s,
    x: Math.random() * w * 0.8 + w * 0.1,
    y: Math.random() * h * 0.8 + h * 0.1,
    vx: 0,
    vy: 0,
    radius: 28,
  }));
}

export default function SkillsConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<SkillNode[]>([]);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const rafRef = useRef<number>(0);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
      if (nodesRef.current.length === 0) {
        nodesRef.current = initNodes(canvas.offsetWidth, canvas.offsetHeight);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    // Group centers for attraction
    const groupCenter: Record<string, { x: number; y: number }> = {
      "AI/ML":   { x: w() * 0.28, y: h() * 0.32 },
      Systems:   { x: w() * 0.72, y: h() * 0.32 },
      Web:       { x: w() * 0.28, y: h() * 0.70 },
      Data:      { x: w() * 0.72, y: h() * 0.70 },
    };

    function tick() {
      const nodes = nodesRef.current;
      if (!nodes.length) return;

      const W = w();
      const H = h();

      // Update group centers on resize
      groupCenter["AI/ML"]   = { x: W * 0.28, y: H * 0.32 };
      groupCenter.Systems    = { x: W * 0.72, y: H * 0.32 };
      groupCenter.Web        = { x: W * 0.28, y: H * 0.70 };
      groupCenter.Data       = { x: W * 0.72, y: H * 0.70 };

      for (const node of nodes) {
        // Attraction to group center
        const gc = groupCenter[node.group];
        const dx = gc.x - node.x;
        const dy = gc.y - node.y;
        node.vx += dx * 0.015;
        node.vy += dy * 0.015;

        // Repulsion from mouse
        const mouse = mouseRef.current;
        if (mouse) {
          const mx = mouse.x - node.x;
          const my = mouse.y - node.y;
          const dist = Math.sqrt(mx * mx + my * my);
          if (dist < 100 && dist > 0) {
            const f = (100 - dist) / 100;
            node.vx -= (mx / dist) * f * 2.5;
            node.vy -= (my / dist) * f * 2.5;
          }
        }

        // Node-node repulsion
        for (const other of nodes) {
          if (other.id === node.id) continue;
          const rx = node.x - other.x;
          const ry = node.y - other.y;
          const dist = Math.sqrt(rx * rx + ry * ry) || 1;
          if (dist < 90) {
            const f = (90 - dist) / 90;
            node.vx += (rx / dist) * f * 1.2;
            node.vy += (ry / dist) * f * 1.2;
          }
        }

        // Damping
        node.vx *= 0.82;
        node.vy *= 0.82;

        node.x += node.vx;
        node.y += node.vy;

        // Bounds
        node.x = Math.max(node.radius + 4, Math.min(W - node.radius - 4, node.x));
        node.y = Math.max(node.radius + 4, Math.min(H - node.radius - 4, node.y));
      }
    }

    function draw() {
      const nodes = nodesRef.current;
      if (!nodes.length) return;
      const W = w();
      const H = h();

      ctx.clearRect(0, 0, W, H);

      // Draw edges
      for (const edge of EDGES) {
        const a = nodes.find((n) => n.id === edge.a);
        const b = nodes.find((n) => n.id === edge.b);
        if (!a || !b) continue;
        const isHot = hovered === edge.a || hovered === edge.b;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = isHot
          ? "rgba(245,158,11,0.35)"
          : "rgba(42,34,24,0.9)";
        ctx.lineWidth = isHot ? 1.5 : 1;
        ctx.stroke();
      }

      // Draw nodes
      for (const node of nodes) {
        const isHot = hovered === node.id;
        const color = GROUP_COLORS[node.group];

        // Circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = isHot
          ? color + "22"
          : "rgba(18,16,13,0.9)";
        ctx.fill();
        ctx.strokeStyle = isHot ? color : color + "55";
        ctx.lineWidth = isHot ? 1.5 : 1;
        ctx.stroke();

        // Label
        ctx.font = `${isHot ? 500 : 400} 10px monospace`;
        ctx.fillStyle = isHot ? color : "rgba(139,125,107,0.9)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
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

  function getCanvasPos(canvas: HTMLCanvasElement, clientX: number, clientY: number) {
    const rect = canvas.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const { x: mx, y: my } = getCanvasPos(e.currentTarget, e.clientX, e.clientY);
    mouseRef.current = { x: mx, y: my };
    const hit = nodesRef.current.find((n) => {
      const dx = n.x - mx;
      const dy = n.y - my;
      return Math.sqrt(dx * dx + dy * dy) <= n.radius;
    });
    setHovered(hit?.id ?? null);
  }

  function onMouseLeave() {
    mouseRef.current = null;
    setHovered(null);
  }

  function onTouchMove(e: React.TouchEvent<HTMLCanvasElement>) {
    e.preventDefault();
    const touch = e.touches[0];
    if (!touch) return;
    const { x: mx, y: my } = getCanvasPos(e.currentTarget, touch.clientX, touch.clientY);
    mouseRef.current = { x: mx, y: my };
    const hit = nodesRef.current.find((n) => {
      const dx = n.x - mx;
      const dy = n.y - my;
      return Math.sqrt(dx * dx + dy * dy) <= n.radius;
    });
    setHovered(hit?.id ?? null);
  }

  function onTouchEnd() {
    mouseRef.current = null;
    setHovered(null);
  }

  return (
    <div>
      {/* Group legend */}
      <div className="flex flex-wrap gap-4 mb-4">
        {Object.entries(GROUP_COLORS).map(([group, color]) => (
          <div key={group} className="flex items-center gap-1.5">
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                border: `1px solid ${color}`,
              }}
            />
            <span
              className="font-mono"
              style={{ fontSize: "10px", color: "var(--color-muted)", letterSpacing: "0.08em" }}
            >
              {group}
            </span>
          </div>
        ))}
      </div>

      <canvas
        ref={canvasRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          width: "100%",
          height: "320px",
          cursor: hovered ? "pointer" : "default",
          display: "block",
          touchAction: "none",
        }}
      />
    </div>
  );
}
