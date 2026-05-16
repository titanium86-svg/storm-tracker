export type WeatherLayer = "radar" | "precipitation" | "wind" | "temp" | "pressure";

export const LAYERS: { id: WeatherLayer; label: string; sub: string }[] = [
  { id: "radar",         label: "Radar",         sub: "Live precipitation" },
  { id: "precipitation", label: "Precipitation",  sub: "Rainfall intensity" },
  { id: "wind",          label: "Wind",           sub: "Animated flow"      },
  { id: "temp",          label: "Temperature",    sub: "Surface temp"       },
  { id: "pressure",      label: "Pressure",       sub: "Sea level"          },
];

export type LegendStop = { value: number; color: string };
export type LegendConfig = { label: string; unit: string; stops: LegendStop[] };

export const LAYER_LEGENDS: Partial<Record<WeatherLayer, LegendConfig>> = {
  wind: {
    label: "Wind Speed", unit: "km/h",
    stops: [
      { value: 0,   color: "#1a56db" },
      { value: 20,  color: "#0ea5e9" },
      { value: 40,  color: "#22c55e" },
      { value: 60,  color: "#eab308" },
      { value: 80,  color: "#f97316" },
      { value: 120, color: "#ef4444" },
    ],
  },
  temp: {
    label: "Temperature", unit: "°C",
    stops: [
      { value: -30, color: "#581c87" },
      { value: -10, color: "#1d4ed8" },
      { value: 0,   color: "#0ea5e9" },
      { value: 15,  color: "#22c55e" },
      { value: 25,  color: "#eab308" },
      { value: 35,  color: "#f97316" },
      { value: 45,  color: "#ef4444" },
    ],
  },
  precipitation: {
    label: "Precipitation", unit: "mm/h",
    stops: [
      { value: 0,  color: "#bfdbfe" },
      { value: 1,  color: "#22c55e" },
      { value: 5,  color: "#eab308" },
      { value: 10, color: "#f97316" },
      { value: 20, color: "#ef4444" },
      { value: 50, color: "#7f1d1d" },
    ],
  },
  pressure: {
    label: "Pressure", unit: "hPa",
    stops: [
      { value: 960,  color: "#581c87" },
      { value: 980,  color: "#1d4ed8" },
      { value: 1000, color: "#22c55e" },
      { value: 1013, color: "#eab308" },
      { value: 1030, color: "#f97316" },
      { value: 1050, color: "#ef4444" },
    ],
  },
};

export type OWMPoint = {
  temp: number;       // °C
  pressure: number;   // hPa
  windSpeed: number;  // km/h
  windDeg: number;
  rain: number;       // mm/h
};

const weatherCache = new Map<string, { data: OWMPoint; ts: number }>();

export async function fetchWeatherPoint(lat: number, lng: number, apiKey: string): Promise<OWMPoint | null> {
  const key = `${Math.round(lat * 10) / 10},${Math.round(lng * 10) / 10}`;
  const cached = weatherCache.get(key);
  if (cached && Date.now() - cached.ts < 5 * 60 * 1000) return cached.data;
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat.toFixed(3)}&lon=${lng.toFixed(3)}&appid=${apiKey}&units=metric`
    );
    if (!res.ok) return null;
    const json = await res.json();
    const data: OWMPoint = {
      temp: json.main?.temp ?? 0,
      pressure: json.main?.pressure ?? 1013,
      windSpeed: (json.wind?.speed ?? 0) * 3.6,
      windDeg: json.wind?.deg ?? 0,
      rain: json.rain?.["1h"] ?? json.rain?.["3h"] ?? 0,
    };
    weatherCache.set(key, { data, ts: Date.now() });
    return data;
  } catch {
    return null;
  }
}

const OWM = process.env.NEXT_PUBLIC_OWM_KEY;

export function owmTileUrl(layer: string): string {
  return `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${OWM}`;
}

export async function getRadarTileUrl(): Promise<string | null> {
  try {
    const res = await fetch("https://api.rainviewer.com/public/weather-maps.json");
    if (!res.ok) return null;
    const data = await res.json();
    const past = data.radar?.past as { path: string }[] | undefined;
    if (!past?.length) return null;
    const latest = past[past.length - 1];
    return `https://tilecache.rainviewer.com${latest.path}/256/{z}/{x}/{y}/2/1_1.png`;
  } catch {
    return null;
  }
}
