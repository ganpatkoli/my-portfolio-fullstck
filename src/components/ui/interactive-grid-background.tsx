import { useEffect, useRef } from "react";

export const InteractiveGridBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let time = 0;
    let pitch = 0.65;
    let yaw = 0.45;
    let targetPitch = 0.65;
    let targetYaw = 0.45;

    const handleCanvasMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      targetYaw = 0.45 + ((x / width) - 0.5) * 0.5;
      targetPitch = 0.65 + ((y / height) - 0.5) * 0.4;
    };

    window.addEventListener("mousemove", handleCanvasMouseMove);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const cols = 26;
    const rows = 26;
    const spacing = 40; // slightly increased for full screen
    const fov = 420;
    const cameraDistance = 380;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Interpolate pitch/yaw smoothly
      pitch += (targetPitch - pitch) * 0.08;
      yaw += (targetYaw - yaw) * 0.08;
      time += 0.035;

      const grid: Array<Array<{ x2d: number; y2d: number; zProjected: number } | null>> = [];

      // Calculate 3D Wave positions & Project to 2D
      for (let r = 0; r < rows; r++) {
        grid[r] = [];
        for (let c = 0; c < cols; c++) {
          const x3d = (c - cols / 2) * spacing;
          const z3d = (r - rows / 2) * spacing;

          // Wave equation based on distance from grid center
          const dist = Math.sqrt(x3d * x3d + z3d * z3d);
          const y3d = Math.sin(dist * 0.015 - time) * 32;

          // Rotate around Y Axis (Yaw)
          const cosY = Math.cos(yaw);
          const sinY = Math.sin(yaw);
          const rx1 = x3d * cosY - z3d * sinY;
          const rz1 = x3d * sinY + z3d * cosY;

          // Rotate around X Axis (Pitch)
          const cosX = Math.cos(pitch);
          const sinX = Math.sin(pitch);
          const ry2 = y3d * cosX - rz1 * sinX;
          const rz2 = y3d * sinX + rz1 * cosX;

          // Depth projection
          const zProjected = rz2 + cameraDistance;
          if (zProjected > 50) {
            const scale = fov / zProjected;
            const x2d = width / 2 + rx1 * scale;
            const y2d = height / 2 + ry2 * scale;
            grid[r][c] = { x2d, y2d, zProjected };
          } else {
            grid[r][c] = null;
          }
        }
      }

      // Draw connecting vector grid lines
      ctx.lineWidth = 0.55;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const current = grid[r][c];
          if (!current) continue;

          const alpha = Math.max(0, 1 - current.zProjected / (cameraDistance * 1.8));
          if (alpha <= 0) continue;

          ctx.strokeStyle = `rgba(139, 92, 246, ${alpha * 0.07})`;

          // Connect to horizontal neighbor
          if (c < cols - 1) {
            const right = grid[r][c + 1];
            if (right) {
              ctx.beginPath();
              ctx.moveTo(current.x2d, current.y2d);
              ctx.lineTo(right.x2d, right.y2d);
              ctx.stroke();
            }
          }

          // Connect to vertical neighbor
          if (r < rows - 1) {
            const bottom = grid[r + 1][c];
            if (bottom) {
              ctx.beginPath();
              ctx.moveTo(current.x2d, current.y2d);
              ctx.lineTo(bottom.x2d, bottom.y2d);
              ctx.stroke();
            }
          }
        }
      }

      // Draw particle nodes
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const pt = grid[r][c];
          if (!pt) continue;

          const alpha = Math.max(0, 1 - pt.zProjected / (cameraDistance * 2.0));
          if (alpha <= 0) continue;

          const radius = Math.max(0.5, (fov / pt.zProjected) * 0.9);
          
          const isAccent = (r + c) % 8 === 0;
          ctx.fillStyle = isAccent 
            ? `rgba(34, 211, 238, ${alpha * 0.45})`  // Neon cyan accent dot
            : `rgba(168, 85, 247, ${alpha * 0.35})`; // Neon violet base dot

          ctx.beginPath();
          ctx.arc(pt.x2d, pt.y2d, radius, 0, Math.PI * 2);
          ctx.fill();

          if (isAccent && alpha > 0.4) {
            ctx.fillStyle = `rgba(34, 211, 238, ${alpha * 0.08})`;
            ctx.beginPath();
            ctx.arc(pt.x2d, pt.y2d, radius * 3.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleCanvasMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ opacity: 0.8 }}
      />
      {/* Edge gradient mask for smooth fading */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,black_100%)] pointer-events-none mix-blend-overlay dark:mix-blend-multiply opacity-50 dark:opacity-100" />
    </div>
  );
};
