'use client';

import React, { useEffect, useRef } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
  
    const particles = [];
    const options = {
      dotColor: '#5cbdaa',
      lineColor: '#5cbdaa',
      particleRadius: 3,
      maxSpeedX: 1,
      maxSpeedY: 1,
      minSpeedX: 0.1,
      minSpeedY: 0.1,
      proximity: 100,
      density: 15000, // Adjust for more particles
    };
  
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr); 
  
      const numParticles = Math.round((canvas.width * canvas.height) / options.density);
      particles.length = 0; 
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
    };
  
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speedX = (Math.random() * (options.maxSpeedX - options.minSpeedX)) + options.minSpeedX;
        this.speedY = (Math.random() * (options.maxSpeedY - options.minSpeedY)) + options.minSpeedY;
      }
  
      updatePosition() {
        this.x += this.speedX;
        this.y += this.speedY;
  
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
      }
  
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, options.particleRadius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = options.dotColor;
        ctx.fill();
      }
    }
  
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      particles.forEach((particle, i) => {
        particle.updatePosition();
        particle.draw();
  
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.sqrt(
            (particle.x - particles[j].x) ** 2 + (particle.y - particles[j].y) ** 2
          );
  
          if (dist < options.proximity) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = options.lineColor;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.closePath();
          }
        }
      });
  
      requestAnimationFrame(draw);
    };
  
    window.addEventListener('resize', handleResize);
    handleResize();
    draw();
  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-[120vh] md:h-[110vh] lg:h-[60vh] xl:h-[110vh]" />;
};

export default ParticleBackground;
