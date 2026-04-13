import { useEffect, useRef } from 'react';

export default function SpaceBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let width, height;

    const stars = [];
    const shootingStars = [];
    const planets = [];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function initStars() {
      stars.length = 0;
      for (let i = 0; i < 200; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.8 + 0.2,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.008 + 0.002,
        });
      }
    }

    function initPlanets() {
      planets.length = 0;
      const defs = [
        { xp: 0.85, yp: 0.18, r: 28, color: '#c2690a', rings: true,  moons: 1, speed: 0.0003 },
        { xp: 0.08, yp: 0.75, r: 18, color: '#5dcaa5', rings: false, moons: 2, speed: 0.0005 },
        { xp: 0.75, yp: 0.82, r: 14, color: '#a78bfa', rings: false, moons: 0, speed: 0.0004 },
        { xp: 0.5,  yp: 0.06, r: 10, color: '#ef9f27', rings: false, moons: 1, speed: 0.0007 },
      ];
      defs.forEach(d => {
        const moons = [];
        for (let m = 0; m < d.moons; m++) {
          moons.push({
            angle: Math.random() * Math.PI * 2,
            dist: d.r + 14 + m * 10,
            r: 3 + m * 1.5,
            speed: 0.003 + m * 0.002,
          });
        }
        planets.push({ ...d, moons });
      });
    }

    function spawnShooting() {
      if (shootingStars.length < 3 && Math.random() < 0.008) {
        shootingStars.push({
          x: Math.random() * width * 0.7 + width * 0.1,
          y: Math.random() * height * 0.4,
          vx: 6 + Math.random() * 4,
          vy: 3 + Math.random() * 3,
          len: 80 + Math.random() * 60,
          life: 0,
          maxLife: 40 + Math.random() * 30,
        });
      }
    }

    function drawStars() {
      stars.forEach(s => {
        s.phase += s.speed;
        const a = 0.3 + 0.7 * Math.abs(Math.sin(s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fill();
      });
    }

    function drawShootingStars() {
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.life++;
        const alpha = 1 - s.life / s.maxLife;
        const speed = Math.hypot(s.vx, s.vy);
        const tailX = s.x - (s.vx / speed) * s.len;
        const tailY = s.y - (s.vy / speed) * s.len;
        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, `rgba(167,139,250,0)`);
        grad.addColorStop(1, `rgba(220,200,255,${alpha})`);
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
        s.x += s.vx;
        s.y += s.vy;
        if (s.life >= s.maxLife || s.x > width + 50 || s.y > height + 50) {
          shootingStars.splice(i, 1);
        }
      }
    }

    function drawPlanets() {
      planets.forEach(p => {
        const x = p.xp * width;
        const y = p.yp * height;

        // Planet body
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Shine
        ctx.beginPath();
        ctx.arc(x - p.r * 0.25, y - p.r * 0.25, p.r * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.fill();

        // Rings
        if (p.rings) {
          ctx.save();
          ctx.translate(x, y);
          ctx.scale(1, 0.3);
          ctx.beginPath();
          ctx.arc(0, 0, p.r + 14, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(194,105,10,0.55)';
          ctx.lineWidth = 5;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, p.r + 22, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(194,105,10,0.25)';
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.restore();
        }

        // Moons
        p.moons.forEach(m => {
          m.angle += m.speed;
          const mx = x + Math.cos(m.angle) * m.dist;
          const my = y + Math.sin(m.angle) * m.dist * 0.45;
          ctx.beginPath();
          ctx.arc(mx, my, m.r, 0, Math.PI * 2);
          ctx.fillStyle = '#cccccc';
          ctx.fill();
        });
      });
    }

    function drawEarth(time) {
      const x = width * 0.06;
      const y = height * 0.88;
      const r = 34;

      // Glow
      const glow = ctx.createRadialGradient(x, y, r * 0.7, x, y, r * 1.5);
      glow.addColorStop(0, 'rgba(29,158,117,0.2)');
      glow.addColorStop(1, 'rgba(29,158,117,0)');
      ctx.beginPath();
      ctx.arc(x, y, r * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Ocean
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = '#1a5fa8';
      ctx.fill();

      // Continents
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = '#2d7a3a';
      ctx.beginPath();
      ctx.ellipse(x + 8,  y + 2,  10, 14, 0.2,  0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(x + 4,  y - 12, 16, 8, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(x - 14, y,      7,  16, 0.1,  0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Clouds
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      const cx = Math.sin(time * 0.0003) * 6;
      ctx.ellipse(x - 5 + cx, y - 5, 14, 5,  0.3,  0, Math.PI * 2);
      ctx.fill();
      ctx.ellipse(x + 10 - cx, y + 8, 10, 4, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawRocket(time) {
      const rx = width * 0.92;
      const ry = height * 0.88 + Math.sin(time * 0.002) * 6;
      ctx.save();
      ctx.translate(rx, ry);
      ctx.rotate(-Math.PI * 0.22);

      // Flame
      ctx.beginPath();
      ctx.moveTo(-4, 14);
      ctx.lineTo(0, 24 + Math.sin(time * 0.015) * 4);
      ctx.lineTo(4, 14);
      ctx.fillStyle = '#ef9f27';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-2, 14);
      ctx.lineTo(0, 20 + Math.sin(time * 0.02) * 3);
      ctx.lineTo(2, 14);
      ctx.fillStyle = '#e8593c';
      ctx.fill();

      // Body
      ctx.beginPath();
      ctx.moveTo(0, -18);
      ctx.lineTo(6, 6);
      ctx.lineTo(-6, 6);
      ctx.closePath();
      ctx.fillStyle = '#e2d9f3';
      ctx.fill();

      // Nose
      ctx.beginPath();
      ctx.arc(0, -18, 6, 0, Math.PI);
      ctx.fillStyle = '#a78bfa';
      ctx.fill();

      // Fins
      ctx.beginPath();
      ctx.moveTo(6, 6); ctx.lineTo(12, 14); ctx.lineTo(6, 12);
      ctx.fillStyle = '#7c6fa0';
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-6, 6); ctx.lineTo(-12, 14); ctx.lineTo(-6, 12);
      ctx.fillStyle = '#7c6fa0';
      ctx.fill();

      // Window
      ctx.beginPath();
      ctx.arc(0, -6, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#5dcaa5';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-1, -7, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fill();

      ctx.restore();
    }

    function animate(time) {
      animationId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, width, height);

      // Background gradient
      const bg = ctx.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0,   '#03001e');
      bg.addColorStop(0.5, '#07023a');
      bg.addColorStop(1,   '#030b22');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      drawStars();
      spawnShooting();
      drawShootingStars();
      drawPlanets();
      drawEarth(time);
      drawRocket(time);
    }

    resize();
    initStars();
    initPlanets();
    animate(0);

    const handleResize = () => { resize(); initStars(); initPlanets(); };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}