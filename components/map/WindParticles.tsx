"use client";

import { useEffect, useRef } from "react";
import type maplibregl from "maplibre-gl";

type WindPoint = { lat: number; lng: number; u: number; v: number };
type Props = { map: maplibregl.Map; points: WindPoint[] };
type Particle = { lat: number; lng: number; age: number; px: number; py: number };
type Cell = { u: number; v: number; speed: number };

const GW = 160; // velocity grid width (cols)
const GH = 110; // velocity grid height (rows)
const N = 6000;
const MAX_AGE = 130;
const BASE_STEP = 1.6; // canvas pixels per frame at 10 m/s wind

// Inverse-distance weighting — called once per grid cell, not per particle
function idw(points: WindPoint[], lat: number, lng: number): Cell {
  let wu = 0, wv = 0, ws = 0;
  for (const p of points) {
    const d = Math.hypot(lat - p.lat, lng - p.lng) + 0.001;
    const w = 1 / (d * d);
    wu += p.u * w; wv += p.v * w; ws += w;
  }
  const u = ws > 0 ? wu / ws : 0;
  const v = ws > 0 ? wv / ws : 0;
  return { u, v, speed: Math.hypot(u, v) };
}

function speedRgb(speed: number): [number, number, number] {
  const t = Math.min(speed / 25, 1);
  const stops: [number, number, number, number][] = [
    [0,     10,  40, 130],
    [0.15,  20,  90, 210],
    [0.3,    0, 175, 190],
    [0.5,   20, 210,  70],
    [0.7,  210, 200,  15],
    [0.85, 245, 110,   5],
    [1,    255,  25,   5],
  ];
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const s = (t - stops[i - 1][0]) / (stops[i][0] - stops[i - 1][0]);
      return [
        Math.round(stops[i - 1][1] + s * (stops[i][1] - stops[i - 1][1])),
        Math.round(stops[i - 1][2] + s * (stops[i][2] - stops[i - 1][2])),
        Math.round(stops[i - 1][3] + s * (stops[i][3] - stops[i - 1][3])),
      ];
    }
  }
  return [255, 25, 5];
}

export default function WindParticles({ map, points }: Props) {
  const hmapRef = useRef<HTMLCanvasElement>(null);
  const ptclRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const hmap = hmapRef.current;
    const ptcl = ptclRef.current;
    if (!hmap || !ptcl || points.length === 0) return;

    const hc = hmap;
    const pc = ptcl;
    const hctx = hc.getContext("2d")!;
    const pctx = pc.getContext("2d")!;
    const dpr = () => window.devicePixelRatio || 1;

    // Temp canvas for grid→image (reused)
    const tmp = document.createElement("canvas");
    tmp.width = GW; tmp.height = GH;
    const tctx = tmp.getContext("2d")!;

    // ── Velocity grid ───────────────────────────────────────────────────────
    let grid: Cell[] = new Array(GW * GH);
    type Bounds = { south: number; north: number; west: number; east: number };
    let bounds: Bounds = { south: -80, north: 80, west: -180, east: 180 };

    function buildGrid() {
      const b = map.getBounds();
      bounds = {
        south: b.getSouth(),
        north: b.getNorth(),
        west: b.getWest(),
        east: b.getEast(),
      };
      for (let gy = 0; gy < GH; gy++) {
        for (let gx = 0; gx < GW; gx++) {
          const lat = bounds.north - (gy / (GH - 1)) * (bounds.north - bounds.south);
          const lng = bounds.west + (gx / (GW - 1)) * (bounds.east - bounds.west);
          grid[gy * GW + gx] = idw(points, lat, lng);
        }
      }
    }

    function lookupCell(lat: number, lng: number): Cell {
      const gx = Math.round(((lng - bounds.west) / (bounds.east - bounds.west)) * (GW - 1));
      const gy = Math.round(((bounds.north - lat) / (bounds.north - bounds.south)) * (GH - 1));
      return grid[Math.max(0, Math.min(GH - 1, gy)) * GW + Math.max(0, Math.min(GW - 1, gx))]
        ?? { u: 0, v: 0, speed: 0 };
    }

    // ── Canvas sizing ───────────────────────────────────────────────────────
    const syncSize = () => {
      const mc = map.getCanvas();
      hc.width = mc.width; hc.height = mc.height;
      pc.width = mc.width; pc.height = mc.height;
    };
    syncSize();
    map.on("resize", syncSize);

    // ── Heatmap — render grid as color image ────────────────────────────────
    function drawHeatmap() {
      const img = tctx.createImageData(GW, GH);
      for (let i = 0; i < grid.length; i++) {
        const [r, g, b] = speedRgb(grid[i].speed);
        img.data[i * 4]     = r;
        img.data[i * 4 + 1] = g;
        img.data[i * 4 + 2] = b;
        img.data[i * 4 + 3] = 200;
      }
      tctx.putImageData(img, 0, 0);
      hctx.clearRect(0, 0, hc.width, hc.height);
      hctx.drawImage(tmp, 0, 0, hc.width, hc.height);
    }

    // ── Helpers ─────────────────────────────────────────────────────────────
    function project(lat: number, lng: number) {
      const pt = map.project([lng, lat] as [number, number]);
      const d = dpr();
      return { px: pt.x * d, py: pt.y * d };
    }

    function randomPos() {
      const b = map.getBounds();
      return {
        lat: b.getSouth() + Math.random() * (b.getNorth() - b.getSouth()),
        lng: b.getWest() + Math.random() * (b.getEast() - b.getWest()),
      };
    }

    // ── Init ────────────────────────────────────────────────────────────────
    buildGrid();
    drawHeatmap();

    const particles: Particle[] = Array.from({ length: N }, () => {
      const { lat, lng } = randomPos();
      const { px, py } = project(lat, lng);
      return { lat, lng, age: Math.floor(Math.random() * MAX_AGE), px, py };
    });

    let raf: number;

    // ── Animation loop ───────────────────────────────────────────────────────
    function frame() {
      const w = pc.width, h = pc.height;
      const zoom = map.getZoom();
      const centerLat = map.getCenter().lat;
      const d = dpr();

      // degrees per canvas pixel at current zoom & center lat
      const mpp = 40075016 * Math.cos(centerLat * Math.PI / 180) / (512 * Math.pow(2, zoom));
      const degPerPx = mpp / 111320 / d;

      // Fade trail — slightly more opaque fade = shorter but cleaner trails
      pctx.globalCompositeOperation = "source-over";
      pctx.fillStyle = "rgba(0,0,0,0.92)";
      pctx.fillRect(0, 0, w, h);
      pctx.globalCompositeOperation = "lighter";

      // Line width: thinner at global view, thicker zoomed in
      pctx.lineWidth = Math.max(0.9, Math.min(2.2, zoom * 0.22));

      for (const p of particles) {
        p.age++;
        if (p.age > MAX_AGE) {
          const pos = randomPos();
          p.lat = pos.lat; p.lng = pos.lng; p.age = 0;
          const pp = project(pos.lat, pos.lng);
          p.px = pp.px; p.py = pp.py;
          continue;
        }

        const cell = lookupCell(p.lat, p.lng);
        const { u, v, speed } = cell;

        // Kill near-calm particles early
        if (speed < 0.3) { p.age = MAX_AGE; continue; }

        // Pixel step proportional to wind speed, direction from u/v
        const pixelStep = BASE_STEP * (speed / 10);
        const cosLat = Math.max(Math.cos(p.lat * Math.PI / 180), 0.05);
        p.lat += (v / speed) * pixelStep * degPerPx;
        p.lng += (u / speed) * pixelStep * degPerPx / cosLat;

        if (p.lat > 85 || p.lat < -85) { p.age = MAX_AGE; continue; }
        const { px: nx, py: ny } = project(p.lat, p.lng);

        // Cull if far off-screen
        if (nx < -w * 0.15 || nx > w * 1.15 || ny < -h * 0.15 || ny > h * 1.15) {
          p.age = MAX_AGE; continue;
        }

        const alpha = Math.min((1 - p.age / MAX_AGE) * 0.95, 0.9);
        const [r, g, b] = speedRgb(speed);
        // Boost brightness so particles are visible with screen/lighter blend on dark map
        const pr = Math.min(r + 130, 255);
        const pg = Math.min(g + 130, 255);
        const pb = Math.min(b + 130, 255);
        pctx.beginPath();
        pctx.moveTo(p.px, p.py);
        pctx.lineTo(nx, ny);
        pctx.strokeStyle = `rgba(${pr},${pg},${pb},${alpha})`;
        pctx.stroke();

        p.px = nx; p.py = ny;
      }

      raf = requestAnimationFrame(frame);
    }

    // Reproject particles on pan
    const onMove = () => {
      for (const p of particles) {
        const pp = project(p.lat, p.lng);
        p.px = pp.px; p.py = pp.py;
      }
    };

    // Rebuild grid on pan/zoom end
    const onMoveEnd = () => {
      buildGrid();
      drawHeatmap();
    };

    map.on("move", onMove);
    map.on("moveend", onMoveEnd);
    frame();

    return () => {
      cancelAnimationFrame(raf);
      map.off("resize", syncSize);
      map.off("move", onMove);
      map.off("moveend", onMoveEnd);
    };
  }, [map, points]);

  return (
    <>
      {/* Heatmap — grid color image, heavily blurred */}
      <canvas
        ref={hmapRef}
        className="absolute inset-0 pointer-events-none"
        style={{ width: "100%", height: "100%", opacity: 0.62, filter: "blur(45px)" }}
      />
      {/* Particles — colored by wind speed, screen blend */}
      <canvas
        ref={ptclRef}
        className="absolute inset-0 pointer-events-none"
        style={{ width: "100%", height: "100%", mixBlendMode: "screen" }}
      />
    </>
  );
}
