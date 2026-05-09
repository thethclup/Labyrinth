type Point = { x: number; y: number; vx: number; vy: number; fixed: boolean; color?: string; id?: string };
type Thread = { p1: Point; p2: Point; length: number; active: boolean; type?: 'normal' | 'resonance' };

interface EngineCallbacks {
  onTensionChange: (tension: number) => void;
  onLevelComplete: () => void;
}

export class ThreadPhysicsEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private points: Point[] = [];
  private threads: Thread[] = [];
  private isRunning: boolean = false;
  private animationId: number = 0;
  
  private width: number = 0;
  private height: number = 0;
  
  private dragPoint: Point | null = null;
  private callbacks: EngineCallbacks;
  
  constructor(canvas: HTMLCanvasElement, callbacks: EngineCallbacks) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.callbacks = callbacks;
    
    this.resize = this.resize.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    
    window.addEventListener('resize', this.resize);
    this.canvas.addEventListener('mousedown', this.handleStart);
    this.canvas.addEventListener('mousemove', this.handleMove);
    this.canvas.addEventListener('mouseup', this.handleEnd);
    this.canvas.addEventListener('mouseleave', this.handleEnd);

    this.canvas.addEventListener('touchstart', this.handleStart, { passive: false });
    this.canvas.addEventListener('touchmove', this.handleMove, { passive: false });
    this.canvas.addEventListener('touchend', this.handleEnd);
    this.canvas.addEventListener('touchcancel', this.handleEnd);

    this.resize();
  }

  private resize() {
    this.width = this.canvas.parentElement!.clientWidth;
    this.height = this.canvas.parentElement!.clientHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  public start(level: number) {
    this.isRunning = true;
    this.loadLevel(level);
    this.loop();
  }

  public destroy() {
    this.isRunning = false;
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.resize);
    this.canvas.removeEventListener('mousedown', this.handleStart);
    this.canvas.removeEventListener('mousemove', this.handleMove);
    this.canvas.removeEventListener('mouseup', this.handleEnd);
    this.canvas.removeEventListener('mouseleave', this.handleEnd);
    
    this.canvas.removeEventListener('touchstart', this.handleStart);
    this.canvas.removeEventListener('touchmove', this.handleMove);
    this.canvas.removeEventListener('touchend', this.handleEnd);
    this.canvas.removeEventListener('touchcancel', this.handleEnd);
  }

  private loadLevel(level: number) {
    this.points = [];
    this.threads = [];
    
    // Abstract level generation based on screen center
    const cx = this.width / 2;
    const cy = this.height / 2;
    const padding = Math.min(this.width, this.height) * 0.15;
    
    // Create goal
    const goal: Point = { x: cx, y: cy - padding * 2, vx: 0, vy: 0, fixed: true, color: '#00FFFF', id: 'goal' };
    
    // Create base anchors
    const p1: Point = { x: cx - padding, y: cy + padding, vx: 0, vy: 0, fixed: true, color: '#FFD700', id: 'start1' };
    const p2: Point = { x: cx + padding, y: cy + padding, vx: 0, vy: 0, fixed: true, color: '#FFD700', id: 'start2' };
    
    // Free nodes
    const n1: Point = { x: cx, y: cy, vx: 0, vy: 0, fixed: false };
    const n2: Point = { x: cx - padding * 0.8, y: cy - padding, vx: 0, vy: 0, fixed: false };
    const n3: Point = { x: cx + padding * 0.8, y: cy - padding, vx: 0, vy: 0, fixed: false };

    this.points.push(goal, p1, p2, n1, n2, n3);

    // Initial threads
    this.createThread(p1, n1);
    this.createThread(p2, n1);
    this.createThread(n1, n2, 'resonance');
    this.createThread(n1, n3, 'resonance');
  }

  private createThread(p1: Point, p2: Point, type: 'normal' | 'resonance' = 'normal') {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    this.threads.push({ p1, p2, length, active: true, type });
  }

  private update() {
    const dt = 0.5;
    const gravity = 0.2;
    const friction = 0.95;
    const tensionStiffness = 0.05;
    
    let maxTensionValue = 0;

    // Update positions
    for (const p of this.points) {
      if (!p.fixed) {
        if (this.dragPoint !== p) {
           p.vy += gravity;
        }
        
        p.vx *= friction;
        p.vy *= friction;
        
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Bounds
        if (p.x < 0) { p.x = 0; p.vx *= -0.5; }
        if (p.x > this.width) { p.x = this.width; p.vx *= -0.5; }
        if (p.y < 0) { p.y = 0; p.vy *= -0.5; }
        if (p.y > this.height) { p.y = this.height; p.vy *= -0.5; }
      }
    }

    // Relax threads (Verlet-like)
    const iterations = 5;
    for (let i = 0; i < iterations; i++) {
      for (const thread of this.threads) {
        if (!thread.active) continue;
        
        const dx = thread.p2.x - thread.p1.x;
        const dy = thread.p2.y - thread.p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist === 0) continue;

        const diff = dist - thread.length;
        const percent = (diff / dist) * 0.5; // Spring force
        const forceX = dx * percent;
        const forceY = dy * percent;

        if (i === 0) {
           // Calculate tension for UI
           const tension = Math.max(0, (dist - thread.length) / thread.length);
           maxTensionValue = Math.max(maxTensionValue, tension);
           
           if (tension > 1.5) { // Snapping threshold
              thread.active = false;
              if (navigator.vibrate) navigator.vibrate(50);
           }
        }

        if (!thread.p1.fixed && this.dragPoint !== thread.p1) {
          thread.p1.x += forceX;
          thread.p1.y += forceY;
        }
        if (!thread.p2.fixed && this.dragPoint !== thread.p2) {
          thread.p2.x -= forceX;
          thread.p2.y -= forceY;
        }
      }
    }
    
    // Check goal collision
    const goal = this.points.find(p => p.id === 'goal');
    if (goal) {
       for (const p of this.points) {
         if (!p.fixed && p !== goal) {
            const dx = p.x - goal.x;
            const dy = p.y - goal.y;
            if (dx*dx + dy*dy < 900) { // Radius 30 squared
               this.callbacks.onLevelComplete();
               this.isRunning = false;
            }
         }
       }
    }

    this.callbacks.onTensionChange(Math.min(100, maxTensionValue * 50));
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw active threads
    for (const thread of this.threads) {
      if (!thread.active) continue;
      
      const dx = thread.p2.x - thread.p1.x;
      const dy = thread.p2.y - thread.p1.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const tension = Math.max(0, (dist - thread.length) / thread.length);
      
      this.ctx.beginPath();
      this.ctx.moveTo(thread.p1.x, thread.p1.y);
      this.ctx.lineTo(thread.p2.x, thread.p2.y);
      
      this.ctx.lineWidth = Math.max(1, 3 - tension * 2);
      
      if (tension > 0.8) {
         this.ctx.strokeStyle = '#ef4444'; // Red snapping
         this.ctx.shadowColor = '#ef4444';
      } else {
         this.ctx.strokeStyle = thread.type === 'resonance' ? '#FF00FF' : '#FFD700';
         this.ctx.shadowColor = this.ctx.strokeStyle;
      }
      
      this.ctx.shadowBlur = 10;
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;
    }

    // Draw nodes
    for (const p of this.points) {
      this.ctx.beginPath();
      if (p.id === 'goal') {
         this.ctx.arc(p.x, p.y, 15, 0, Math.PI * 2);
         this.ctx.fillStyle = '#05050A';
         this.ctx.strokeStyle = p.color || '#00FFFF';
         this.ctx.lineWidth = 2;
         this.ctx.shadowColor = p.color || '#00FFFF';
         this.ctx.shadowBlur = 15;
         this.ctx.fill();
         this.ctx.stroke();
      } else {
         this.ctx.arc(p.x, p.y, p.fixed ? 6 : 4, 0, Math.PI * 2);
         this.ctx.fillStyle = p.fixed ? (p.color || '#fff') : '#8A2BE2';
         this.ctx.shadowColor = this.ctx.fillStyle;
         this.ctx.shadowBlur = p.fixed ? 10 : 5;
         this.ctx.fill();
      }
      this.ctx.shadowBlur = 0;
    }
  }

  private loop() {
    if (!this.isRunning) return;
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.loop());
  }

  private getCanvasPos(e: MouseEvent | TouchEvent) {
    const rect = this.canvas.getBoundingClientRect();
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  private handleStart(e: MouseEvent | TouchEvent) {
    if ('touches' in e && e.cancelable) e.preventDefault();
    const pos = this.getCanvasPos(e);
    
    // Find closest node to drag
    let closestDist = 900; // 30px radius squared
    let closest: Point | null = null;
    
    for (const p of this.points) {
      const dx = p.x - pos.x;
      const dy = p.y - pos.y;
      const distSq = dx * dx + dy * dy;
      if (distSq < closestDist) {
        closestDist = distSq;
        closest = p;
      }
    }
    
    if (closest && !closest.fixed) {
      this.dragPoint = closest;
      if (navigator.vibrate) navigator.vibrate(10);
    }
  }

  private handleMove(e: MouseEvent | TouchEvent) {
    if ('touches' in e && e.cancelable) e.preventDefault();
    if (!this.dragPoint) return;
    const pos = this.getCanvasPos(e);
    this.dragPoint.x = pos.x;
    this.dragPoint.y = pos.y;
    this.dragPoint.vx = 0;
    this.dragPoint.vy = 0;
  }

  private handleEnd(e: MouseEvent | TouchEvent) {
    this.dragPoint = null;
  }
}
