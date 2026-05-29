import { useState, useEffect, useRef, useCallback } from 'react';

export default function GalaxyShooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [running, setRunning] = useState(false);
  const stateRef = useRef({
    player: { x: 350, y: 450 },
    bullets: [] as { x: number; y: number }[],
    enemies: [] as { x: number; y: number; hp: number }[],
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number }[],
    frame: 0,
  });

  const reset = useCallback(() => {
    stateRef.current = { player: { x: 350, y: 450 }, bullets: [], enemies: [], particles: [], frame: 0 };
    setScore(0); setGameOver(false); setRunning(true);
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (e.key === 'ArrowLeft') s.player.x = Math.max(20, s.player.x - 15);
      if (e.key === 'ArrowRight') s.player.x = Math.min(680, s.player.x + 15);
      if (e.key === ' ') {
        s.bullets.push({ x: s.player.x, y: s.player.y - 10 });
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => {
      const s = stateRef.current;
      s.frame++;

      // Update bullets
      s.bullets = s.bullets.map(b => ({ ...b, y: b.y - 6 })).filter(b => b.y > 0);

      // Spawn enemies
      if (s.frame % 40 === 0) {
        s.enemies.push({ x: 30 + Math.random() * 640, y: -20, hp: 2 });
      }
      s.enemies = s.enemies.map(e => ({ ...e, y: e.y + 2 }));

      // Bullet-enemy collision
      s.bullets = s.bullets.filter(b => {
        let hit = false;
        s.enemies.forEach(e => {
          if (Math.abs(b.x - e.x) < 20 && Math.abs(b.y - e.y) < 20) {
            e.hp--;
            hit = true;
            if (e.hp <= 0) {
              for (let i = 0; i < 8; i++) {
                s.particles.push({ x: e.x, y: e.y, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6, life: 20 });
              }
              setScore(sc => sc + 10);
            }
          }
        });
        return !hit;
      });
      s.enemies = s.enemies.filter(e => e.hp > 0 && e.y < 500);

      // Player-enemy collision
      for (const e of s.enemies) {
        if (Math.abs(e.x - s.player.x) < 25 && Math.abs(e.y - s.player.y) < 25) {
          setGameOver(true); setRunning(false); return;
        }
      }

      // Particles
      s.particles = s.particles.map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, life: p.life - 1 })).filter(p => p.life > 0);

      // Draw
      const c = canvasRef.current;
      const ctx = c?.getContext('2d');
      if (!c || !ctx) return;
      ctx.fillStyle = '#0d0d12'; ctx.fillRect(0, 0, 700, 500);

      // Stars
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      for (let i = 0; i < 50; i++) ctx.fillRect((i * 47 + s.frame * 0.3) % 700, (i * 53) % 500, 1, 1);

      // Player
      ctx.fillStyle = '#00d4ff'; ctx.beginPath(); ctx.moveTo(s.player.x, s.player.y - 15); ctx.lineTo(s.player.x - 15, s.player.y + 15); ctx.lineTo(s.player.x + 15, s.player.y + 15); ctx.closePath(); ctx.fill();

      // Bullets
      ctx.fillStyle = '#4effa1'; s.bullets.forEach(b => { ctx.fillRect(b.x - 2, b.y, 4, 10); });

      // Enemies
      s.enemies.forEach(e => { ctx.fillStyle = '#ff007f'; ctx.beginPath(); ctx.arc(e.x, e.y, 12, 0, Math.PI * 2); ctx.fill(); });

      // Particles
      s.particles.forEach(p => { ctx.fillStyle = `rgba(255, 149, 0, ${p.life / 20})`; ctx.fillRect(p.x, p.y, 3, 3); });
    }, 16);
    return () => clearInterval(iv);
  }, [running]);

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] items-center justify-center p-4">
      <div className="flex items-center gap-6 mb-2">
        <span className="text-xs text-white/50">Score: <span className="text-[#00d4ff] font-mono">{score}</span></span>
        <button onClick={reset} className="px-3 py-1 rounded-lg bg-white/5 text-white/50 text-xs hover:bg-white/10">{running ? 'Restart' : 'Start'}</button>
      </div>
      <canvas ref={canvasRef} width={700} height={500} className="rounded-lg border border-white/5" />
      {gameOver && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl text-white font-bold mb-1">Game Over</div>
            <div className="text-sm text-[#00d4ff] mb-3">Score: {score}</div>
            <button onClick={reset} className="px-4 py-2 rounded-lg bg-[#00d4ff]/20 text-[#00d4ff] text-xs">Play Again</button>
          </div>
        </div>
      )}
      <div className="text-[10px] text-white/20 mt-1">Arrow keys to move, Space to shoot</div>
    </div>
  );
}
