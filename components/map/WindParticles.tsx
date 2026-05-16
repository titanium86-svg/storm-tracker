"use client";

import { useEffect, useRef } from "react";
import type maplibregl from "maplibre-gl";

type WindPoint = { lat: number; lng: number; u: number; v: number };

type Props = {
  map: maplibregl.Map;
  points: WindPoint[];
};

type Particle = {
  lat: number;
  lng: number;
  age: number;
  px: number; // canvas physical pixels
  py: number;
  speed: number;
};

const N = 4000;
const MAX_AGE = 160;

// Inverse-distance-weighted interpolation of U/V wind at a given lat/lng
function interpolate(points: WindPoint[], lat: number, lng: number): { u: number; v: number } {
  let wu = 0, wv = 0, wsum = 0;
  for (const p of points) {
    const d = Math.hypot(lat - p.lat, lng - p.lng) + 0.001;
    const w = 1 / (d * d);
    wu += p.u * w;
    wv += p.v * w;
    wsum += w;
  }
  return wsum > 0 ? { u: wu / wsum, v: wv / wsum } : { u: 0, v: 0 };
}

// Speed (m/s) → RGB string. Blue (calm) → cyan → yellow → red (strong)
function rgb(speed: number): string {
  const t = Math.min(speed / 22, 1);
  const r = Math.round(t > 0.5 ? (t - 0.5) * 2 * 255 : 0);
  const g = Math.round(t < 0.5 ? t * 2 * 220 : (1 - (t - 0.5) * 2) * 220);
  const b = Math.round(t < 0.5 ? (1 - t * 2) * 255 + 40 : 0);
  return `${r},${g},${b}`;
}

export default function WindParticles({ map, points }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || points.length === 0) return;
    // Capture as non-null for closure use
    const cv: HTMLCanvasElement = canvas;
    const ctx = cv.getContext("2d")!;

    const syncSize = () => {
      const mc = map.getCanvas();
      cv.width = mc.width;
      cv.height = mc.height;
    };
    syncSize();
    map.on("resize", syncSize);

    const dpr = () => window.devicePixelRatio || 1;

    function project(lat: number, lng: number): { px: number; py: number } {
      const pt = map.project([lng, lat] as [number, number]);
      const d = dpr();
      return { px: pt.x * d, py: pt.y * d };
    }

    function randomPos(): { lat: number; lng: number } {
      const b = map.getBounds();
      return {
        lat: b.getSouth() + Math.random() * (b.getNorth() - b.getSouth()),
        lng: b.getWest() + Math.random() * (b.getEast() - b.getWest()),
      };
    }

    const particles: Particle[] = Array.from({ length: N }, () => {
      const { lat, lng } = randomPos();
      const { px, py } = project(lat, lng);
      return { lat, lng, age: Math.random() * MAX_AGE, px, py, speed: 0 };
    });

    let raf: number;

    function frame() {
      const d = dpr();
      const w = cv.width;
      const h = cv.height;

      // Fade trail
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(0,0,0,0.93)";
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = "lighter";
      ctx.lineWidth = 1.8;

      for (const p of particles) {
        p.age++;
        if (p.age > MAX_AGE) {
          const pos = randomPos();
          p.lat = pos.lat;
          p.lng = pos.lng;
          p.age = 0;
          const { px, py } = project(p.lat, p.lng);
          p.px = px;
          p.py = py;
          continue;
        }

        const { u, v } = interpolate(points, p.lat, p.lng);
        p.speed = Math.hypot(u, v);

        // Move in geographic space — slow scale for smooth flow
        const cosLat = Math.max(Math.cos((p.lat * Math.PI) / 180), 0.05);
        p.lat += v * 0.004;
        p.lng += (u * 0.004) / cosLat;

        if (p.lat > 85 || p.lat < -85) {
          p.age = MAX_AGE;
          continue;
        }

        const { px: nx, py: ny } = project(p.lat, p.lng);

        if (nx < 0 || nx > w || ny < 0 || ny > h) {
          p.age = MAX_AGE;
          continue;
        }

        const alpha = Math.min((1 - p.age / MAX_AGE) * 0.9, 0.85);
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(nx, ny);
        ctx.strokeStyle = `rgba(${rgb(p.speed)},${alpha})`;
        ctx.stroke();

        p.px = nx;
        p.py = ny;
      }

      raf = requestAnimationFrame(frame);
    }

    // Re-project all particles after map moves so trails stay locked to geography
    const onMove = () => {
      for (const p of particles) {
        const { px, py } = project(p.lat, p.lng);
        p.px = px;
        p.py = py;
      }
    };
    map.on("move", onMove);

    frame();

    return () => {
      cancelAnimationFrame(raf);
      map.off("resize", syncSize);
      map.off("move", onMove);
    };
  }, [map, points]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: "100%", height: "100%", mixBlendMode: "screen" }}
    />
  );
}
