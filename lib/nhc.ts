export type StormClassification =
  | "TD" | "TS" | "HU" | "MH" | "STS" | "TY" | "STY";

export type NHCStorm = {
  id: string;
  binNumber: string;
  name: string;
  classification: StormClassification;
  intensity: string;
  pressure: string;
  latitudeNumeric: number;
  longitudeNumeric: number;
  movementDir: number;
  movementSpeed: number;
  lastUpdate: string;
  forecastAdvisory: { url: string };
  forecastGraphics: { url: string; satellitePass?: string };
  trackCone?: { geoJSON: string };
  trackLine?: { geoJSON: string };
  windWatchesWarnings?: { geoJSON: string };
};

export type NHCActiveStormsResponse = {
  activeStorms: NHCStorm[];
};

export function classificationLabel(c: StormClassification): string {
  const map: Record<StormClassification, string> = {
    TD: "Tropical Depression",
    TS: "Tropical Storm",
    HU: "Hurricane",
    MH: "Major Hurricane",
    STS: "Severe Tropical Storm",
    TY: "Typhoon",
    STY: "Super Typhoon",
  };
  return map[c];
}
