import { useState, useEffect, useRef, useCallback } from 'react';

const PATH = [{ x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 3, y: 2 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 }, { x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }, { x: 2, y: 5 }, { x: 1, y: 5 }, { x: 1, y: 6 }, { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 5, y: 7 }, { x: 6, y: 7 }, { x: 7, y: 7 }, { x: 8, y: 7 }, { x: 9, y: 7 }];

interface Enemy { id: number; pathIndex: number; hp: number; maxHp: number; }
interface Tower { x: number; y: number; type: 'laser' | 'cannon'; cooldown: number; }

export default function TowerDefense() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [money, setMoney] = useState(150);
  const [lives, setLives] = useState(20);
  const [wave, setWave] = useState(1);
  const [selectedTower, setSelectedTower] = useState<'laser' | 'cannon' | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const stateRef = useRef({
    enemies: [] as Enemy[],
    towers: [] as Tower[],
    projectiles: [] as { x: number; y: number; tx: number; ty: number; speed: number; damage: number }[],
    frame: 0,
  });

  const spawnWave = useCallback(() => {
    const s = stateRef.current;
    for (let i = 0; i < 5 + wave * 2; i++) {
      setTimeout(() => {
        s.enemies.push({ id: Date.now() + i, pathIndex: 0, hp: 20 + wave * 5, maxHp: 20 + wave * 5 });
      }, i * 800);
    }
  }, [wave]);

  const placeTower = (gx: number, gy: number) => {
    if (!selectedTower || gameOver) return;
    const cost = selectedTower === 'laser' ? 50 : 75;
    if (money < cost) return;
    // Check not on path
    if (PATH.some(p => p.x === gx && p.y === gy)) return;
    if (stateRef.current.towers.some(t => t.x === gx && t.y === gy)) return;
    stateRef.current.towers.push({ x: gx, y: gy, type: selectedTower, cooldown: 0 });
    setMoney(m => m - cost);
  };

  useEffect(() => {
    spawnWave();
  }, [wave, spawnWave]);

  useEffect(() => {
    if (gameOver) return;
    const iv = setInterval(() => {
      const s = stateRef.current;
      s.frame++;

      // Move enemies
      s.enemies.forEach(e => {
        if (e.pathIndex < PATH.length - 1) e.pathIndex += 0.03;
      });
      const reached = s.enemies.filter(e => e.pathIndex >= PATH.length - 1);
      if (reached.length > 0) {
        setLives(l => { const nl = l - reached.length; if (nl <= 0) setGameOver(true); return Math.max(0, nl); });
        s.enemies = s.enemies.filter(e => e.pathIndex < PATH.length - 1);
      }
      s.enemies = s.enemies.filter(e => e.hp > 0);

      // Tower attacks
      s.towers.forEach(t => {
        t.cooldown--;
        if (t.cooldown > 0) return;
        const enemies = s.enemies.map(e => ({ e, pos: PATH[Math.floor(e.pathIndex)] })).filter(({ pos }) => pos && Math.abs(pos.x - t.x) + Math.abs(pos.y - t.y) <= 3);
        if (enemies.length > 0) {
          const target = enemies[0];
          s.projectiles.push({ x: t.x, y: t.y, tx: target.pos.x, ty: target.pos.y, speed: 0.3, damage: t.type === 'laser' ? 5 : 10 });
          t.cooldown = t.type === 'laser' ? 20 : 40;
        }
      });

      // Move projectiles
      s.projectiles = s.projectiles.filter(p => {
        const dx = p.tx - p.x, dy = p.ty - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.5) {
          s.enemies.forEach(e => {
            const pos = PATH[Math.floor(e.pathIndex)];
            if (pos && Math.abs(pos.x - p.tx) < 1 && Math.abs(pos.y - p.ty) < 1) {
              e.hp -= p.damage;
              if (e.hp <= 0) setMoney(m => m + 10);
            }
          });
          return false;
        }
        p.x += (dx / dist) * p.speed;
        p.y += (dy / dist) * p.speed;
        return true;
      });

      // Draw
      const c = canvasRef.current;
      const ctx = c?.getContext('2d');
      if (!c || !ctx) return;
      const CS = 50;
      ctx.fillStyle = '#0d0d12'; ctx.fillRect(0, 0, 500, 400);

      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      for (let x = 0; x <= 10; x++) { ctx.beginPath(); ctx.moveTo(x * CS, 0); ctx.lineTo(x * CS, 400); ctx.stroke(); }
      for (let y = 0; y <= 8; y++) { ctx.beginPath(); ctx.moveTo(0, y * CS); ctx.lineTo(500, y * CS); ctx.stroke(); }

      // Path
      ctx.fillStyle = 'rgba(0, 212, 255, 0.1)';
      PATH.forEach(p => ctx.fillRect(p.x * CS + 2, p.y * CS + 2, CS - 4, CS - 4));

      // Towers
      s.towers.forEach(t => {
        ctx.fillStyle = t.type === 'laser' ? '#00d4ff' : '#ff9500';
        ctx.fillRect(t.x * CS + 10, t.y * CS + 10, CS - 20, CS - 20);
        ctx.fillStyle = 'white'; ctx.font = '10px sans-serif'; ctx.fillText(t.type[0].toUpperCase(), t.x * CS + 20, t.y * CS + 30);
      });

      // Enemies
      s.enemies.forEach(e => {
        const pos = PATH[Math.min(Math.floor(e.pathIndex), PATH.length - 1)];
        if (!pos) return;
        ctx.fillStyle = '#ff007f'; ctx.beginPath(); ctx.arc(pos.x * CS + CS / 2, pos.y * CS + CS / 2, 10, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'red'; ctx.fillRect(pos.x * CS + 5, pos.y * CS - 5, (CS - 10) * (e.hp / e.maxHp), 3);
      });

      // Projectiles
      s.projectiles.forEach(p => {
        ctx.fillStyle = '#4effa1'; ctx.beginPath(); ctx.arc(p.x * CS + CS / 2, p.y * CS + CS / 2, 3, 0, Math.PI * 2); ctx.fill();
      });
    }, 16);
    return () => clearInterval(iv);
  }, [gameOver]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / 50);
    const y = Math.floor((e.clientY - rect.top) / 50);
    placeTower(x, y);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] items-center justify-center p-4">
      <div className="flex items-center gap-4 mb-2 text-xs text-white/50">
        <span>Money: <span className="text-yellow-400 font-mono">${money}</span></span>
        <span>Lives: <span className="text-red-400 font-mono">{lives}</span></span>
        <span>Wave: <span className="text-[#00d4ff] font-mono">{wave}</span></span>
        <button onClick={() => setWave(w => w + 1)} className="px-2 py-0.5 rounded bg-[#00d4ff]/20 text-[#00d4ff] text-[10px]">Next Wave</button>
      </div>
      <div className="flex gap-2 mb-2">
        <button onClick={() => setSelectedTower('laser')} className={`px-3 py-1 rounded text-xs ${selectedTower === 'laser' ? 'bg-[#00d4ff]/20 text-[#00d4ff]' : 'bg-white/5 text-white/40'}`}>Laser ($50)</button>
        <button onClick={() => setSelectedTower('cannon')} className={`px-3 py-1 rounded text-xs ${selectedTower === 'cannon' ? 'bg-[#ff9500]/20 text-[#ff9500]' : 'bg-white/5 text-white/40'}`}>Cannon ($75)</button>
      </div>
      <canvas ref={canvasRef} width={500} height={400} className="rounded-lg border border-white/5 cursor-crosshair" onClick={handleClick} />
      {gameOver && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl text-white font-bold mb-2">Game Over</div>
            <div className="text-sm text-[#00d4ff] mb-1">Wave {wave}</div>
            <button onClick={() => { setMoney(150); setLives(20); setWave(1); stateRef.current = { enemies: [], towers: [], projectiles: [], frame: 0 }; setGameOver(false); }} className="px-4 py-2 rounded-lg bg-[#00d4ff]/20 text-[#00d4ff] text-xs">Restart</button>
          </div>
        </div>
      )}
    </div>
  );
}
