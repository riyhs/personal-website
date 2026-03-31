"use client";

import { useEffect, useRef } from "react";

const cn = (...classes: (string | boolean | undefined | null)[]) =>
  classes.filter(Boolean).join(" ");

interface Neuron {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  radius: number;
  activation: number;
  neighbors: Neuron[];
  project: () => { x: number; y: number; scale: number };
  draw: () => void;
  update: () => void;
  fire: () => void;
}

interface Pulse {
  start: Neuron;
  end: Neuron;
  progress: number;
  speed: number;
  update: () => boolean;
  draw: () => void;
}

interface CosmicSynapseCanvasProps {
  className?: string;
}

export const CosmicSynapseCanvas = ({
  className,
}: CosmicSynapseCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let neurons: Neuron[] = [];
    let pulses: Pulse[] = [];
    const mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      radius: 150,
    };
    const perspective = 400;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const createNeuron = (x: number, y: number, z: number): Neuron => {
      const neuron: Neuron = {
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        radius: Math.random() * 2 + 1,
        activation: 0,
        neighbors: [],
        project: function () {
          const rotX = (mouse.y - canvas.height / 2) * 0.0001;
          const rotY = (mouse.x - canvas.width / 2) * 0.0001;

          const cosY = Math.cos(rotY);
          const sinY = Math.sin(rotY);
          const cosX = Math.cos(rotX);
          const sinX = Math.sin(rotX);

          const x1 = this.x * cosY - this.z * sinY;
          const z1 = this.z * cosY + this.x * sinY;
          const y1 = this.y * cosX - z1 * sinX;
          const z2 = z1 * cosX + this.y * sinX;

          const scale = perspective / (perspective + z2);
          const projectedX = x1 * scale + canvas.width / 2;
          const projectedY = y1 * scale + canvas.height / 2;
          return { x: projectedX, y: projectedY, scale };
        },
        draw: function () {
          const { x, y, scale } = this.project();
          ctx.beginPath();
          ctx.arc(x, y, this.radius * scale, 0, Math.PI * 2);
          const color = `rgba(191, 219, 254, ${0.08 + this.activation * 0.8})`;
          ctx.fillStyle = color;
          ctx.fill();
        },
        update: function () {
          const { x: projectedX, y: projectedY } = this.project();
          const dx = mouse.x - projectedX;
          const dy = mouse.y - projectedY;
          const dist = Math.hypot(dx, dy);
          const force = Math.max(0, (mouse.radius - dist) / mouse.radius);

          this.x += (dx / dist) * force * 0.5;
          this.y += (dy / dist) * force * 0.5;

          this.x += (this.baseX - this.x) * 0.01;
          this.y += (this.baseY - this.y) * 0.01;

          if (this.activation > 0) {
            this.activation -= 0.01;
          }
          this.draw();
        },
        fire: function () {
          if (this.activation > 0.5) return;
          this.activation = 1;
          this.neighbors.forEach((neighbor) => {
            pulses.push(createPulse(this, neighbor));
          });
        },
      };
      return neuron;
    };

    const createPulse = (startNeuron: Neuron, endNeuron: Neuron): Pulse => {
      const pulse: Pulse = {
        start: startNeuron,
        end: endNeuron,
        progress: 0,
        speed: 0.05,
        update: function () {
          this.progress += this.speed;
          if (this.progress >= 1) {
            this.end.activation = Math.min(1, this.end.activation + 0.5);
            return true;
          }
          return false;
        },
        draw: function () {
          const startPos = this.start.project();
          const endPos = this.end.project();

          const x = startPos.x + (endPos.x - startPos.x) * this.progress;
          const y = startPos.y + (endPos.y - startPos.y) * this.progress;
          const scale =
            startPos.scale + (endPos.scale - startPos.scale) * this.progress;

          ctx.beginPath();
          ctx.arc(x, y, 2.5 * scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${1 - this.progress})`;
          ctx.shadowColor = "white";
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        },
      };
      return pulse;
    };

    const init = () => {
      neurons = [];
      const numNeurons = 696;
      const isWide = canvas.width > 768;
      const radius = isWide ? canvas.height * 0.2967 : canvas.width * 0.5969;
      for (let i = 0; i < numNeurons; i++) {
        const phi = Math.acos(-1 + (2 * i) / numNeurons);
        const theta = Math.sqrt(numNeurons * Math.PI) * phi;
        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        neurons.push(createNeuron(x, y, z));
      }

      neurons.forEach((neuron) => {
        neurons.forEach((other) => {
          if (neuron !== other) {
            const dist = Math.hypot(
              neuron.x - other.x,
              neuron.y - other.y,
              neuron.z - other.z,
            );
            if (dist < 40) {
              neuron.neighbors.push(other);
            }
          }
        });
      });
    };

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1867)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (Math.random() > 0.9867) {
        neurons[Math.floor(Math.random() * neurons.length)].fire();
      }

      neurons.forEach((neuron) => neuron.update());

      pulses = pulses.filter((pulse) => !pulse.update());
      pulses.forEach((pulse) => pulse.draw());

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);

    resizeCanvas();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 z-0 w-full h-full bg-black", className)}
    />
  );
};
