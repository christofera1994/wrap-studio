import { useEffect, useRef } from "react";

export function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      opacity: number;
      fadeSpeed: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.1;
        this.speedY = Math.random() * 0.5 + 0.1;
        this.opacity = Math.random() * 0.5;
        this.fadeSpeed = Math.random() * 0.005 + 0.002;
      }

      update() {
        this.y -= this.speedY;
        if (this.y < 0) {
          this.y = height;
          this.x = Math.random() * width;
        }

        this.opacity += this.fadeSpeed;
        if (this.opacity > 0.5 || this.opacity < 0.1) {
          this.fadeSpeed = -this.fadeSpeed;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(213, 0, 0, ${this.opacity})`; // Ferrari Red particles
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(width * 0.05, 100); // Responsive count
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw subtle background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "rgba(10, 0, 0, 1)");
      gradient.addColorStop(1, "rgba(5, 0, 0, 1)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
    />
  );
}
