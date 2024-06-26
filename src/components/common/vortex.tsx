import { cn } from "@utils/cn";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { createNoise3D } from "simplex-noise";
import { motion } from "framer-motion";

interface VortexProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  particleCount?: number;
  rangeY?: number;
  baseHue?: number;
  baseSpeed?: number;
  rangeSpeed?: number;
  baseRadius?: number;
  rangeRadius?: number;
  backgroundColor?: string;
}

const Vortex: React.FC<VortexProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef(null);
  const particleCount = props.particleCount || 700;
  const particlePropCount = 9;
  const particlePropsLength = particleCount * particlePropCount;
  const rangeY = props.rangeY || 100;
  const baseTTL = 50;
  const rangeTTL = 150;
  const baseSpeed = props.baseSpeed || 0.0;
  const rangeSpeed = props.rangeSpeed || 1.5;
  const baseRadius = props.baseRadius || 1;
  const rangeRadius = props.rangeRadius || 2;
  const baseHue = props.baseHue || 220;
  const rangeHue = 100;
  const noiseSteps = 3;
  const xOff = 0.00125;
  const yOff = 0.00125;
  const zOff = 0.0005;
  const backgroundColor = props.backgroundColor || "#000000";
  const tick = useRef(0);
  const noise3D = createNoise3D();
  const particleProps = useRef(new Float32Array(particlePropsLength));
  const center: [number, number] = useMemo(() => [0, 0], []);

  // const HALF_PI: number = 0.5 * Math.PI;
  const TAU: number = 2 * Math.PI;
  // const TO_RAD: number = Math.PI / 180;
  const rand = (n: number): number => n * Math.random();
  const randRange = useCallback((n: number): number => n - rand(2 * n), []);
  const fadeInOut = (t: number, m: number): number => {
    const hm = 0.5 * m;
    return Math.abs(((t + hm) % m) - hm) / hm;
  };
  const lerp = (n1: number, n2: number, speed: number): number =>
    (1 - speed) * n1 + speed * n2;

  const initParticle = useCallback(
    (i: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const x = rand(canvas.width);
      const y = center[1] + randRange(rangeY);
      const vx = 0;
      const vy = 0;
      const life = 0;
      const ttl = baseTTL + rand(rangeTTL);
      const speed = baseSpeed + rand(rangeSpeed);
      const radius = baseRadius + rand(rangeRadius);
      const hue = baseHue + rand(rangeHue);

      particleProps.current.set(
        [x, y, vx, vy, life, ttl, speed, radius, hue],
        i
      );
    },
    [
      baseHue,
      baseRadius,
      baseSpeed,
      center,
      particleProps,
      randRange,
      rangeRadius,
      rangeSpeed,
      rangeY,
    ]
  );

  const initParticles = useCallback(() => {
    tick.current = 0;
    // simplex = new SimplexNoise();
    particleProps.current = new Float32Array(particlePropsLength);

    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      initParticle(i);
    }
  }, [initParticle, particlePropsLength]);

  const drawParticle = useCallback(
    (
      x: number,
      y: number,
      x2: number,
      y2: number,
      life: number,
      ttl: number,
      radius: number,
      hue: number,
      ctx: CanvasRenderingContext2D
    ) => {
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineWidth = radius;
      ctx.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    },
    []
  );

  const updateParticle = useCallback(
    (i: number, ctx: CanvasRenderingContext2D) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const i2 = 1 + i,
        i3 = 2 + i,
        i4 = 3 + i,
        i5 = 4 + i,
        i6 = 5 + i,
        i7 = 6 + i,
        i8 = 7 + i,
        i9 = 8 + i;

      const x = particleProps.current[i];
      const y = particleProps.current[i2];
      const n =
        noise3D(x * xOff, y * yOff, tick.current * zOff) * noiseSteps * TAU;
      const vx = lerp(particleProps.current[i3], Math.cos(n), 0.5);
      const vy = lerp(particleProps.current[i4], Math.sin(n), 0.5);
      let life = particleProps.current[i5];
      const ttl = particleProps.current[i6];
      const speed = particleProps.current[i7];
      const x2 = x + vx * speed;
      const y2 = y + vy * speed;
      const radius = particleProps.current[i8];
      const hue = particleProps.current[i9];

      drawParticle(x, y, x2, y2, life, ttl, radius, hue, ctx);

      life++;

      particleProps.current[i] = x2;
      particleProps.current[i2] = y2;
      particleProps.current[i3] = vx;
      particleProps.current[i4] = vy;
      particleProps.current[i5] = life;

      (checkBounds(x, y, canvas) || life > ttl) && initParticle(i);
    },
    [TAU, drawParticle, initParticle, noise3D, particleProps, tick]
  );

  const drawParticles = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      for (let i = 0; i < particlePropsLength; i += particlePropCount) {
        updateParticle(i, ctx);
      }
    },
    [particlePropsLength, updateParticle]
  );

  const draw = useCallback(
    (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
      tick.current++;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawParticles(ctx);
      renderGlow(canvas, ctx);
      renderToScreen(canvas, ctx);

      window.requestAnimationFrame(() => draw(canvas, ctx));
    },
    [backgroundColor, drawParticles, tick]
  );

  const checkBounds = (x: number, y: number, canvas: HTMLCanvasElement) => {
    return x > canvas.width || x < 0 || y > canvas.height || y < 0;
  };

  const resize = useCallback(
    (canvas: HTMLCanvasElement, ctx?: CanvasRenderingContext2D) => {
      const { innerWidth, innerHeight } = window;
      ctx?.save();

      canvas.width = innerWidth;
      canvas.height = innerHeight;

      center[0] = 0.5 * canvas.width;
      center[1] = 0.5 * canvas.height;
      ctx?.restore();
    },
    [center]
  );

  const renderGlow = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) => {
    ctx.save();
    ctx.filter = "blur(8px) brightness(200%)";
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();

    ctx.save();
    ctx.filter = "blur(4px) brightness(200%)";
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
  };

  const renderToScreen = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) => {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
  };

  const setup = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (canvas && container) {
      const ctx = canvas.getContext("2d");

      if (ctx) {
        resize(canvas, ctx);
        initParticles();
        draw(canvas, ctx);
      }
    }
  }, [draw, initParticles, resize]);
  useEffect(() => {
    setup();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener("resize", () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        resize(canvas, ctx);
      }
    });
  }, [resize]);

  return (
    <div className={cn("relative h-full w-full", props.containerClassName)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        ref={containerRef}
        className="absolute h-full w-full inset-0 z-0 bg-transparent flex items-center justify-center"
      >
        <canvas ref={canvasRef}></canvas>
      </motion.div>

      <div className={cn("relative z-10", props.className)}>
        {props.children}
      </div>
    </div>
  );
};

export default Vortex;
