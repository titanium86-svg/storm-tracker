export type GIBSLayer =
  | "MODIS_Terra_CorrectedReflectance_TrueColor"
  | "VIIRS_SNPP_CorrectedReflectance_TrueColor"
  | "GOES-East_ABI_Band13_Clean_Infrared_Brightness_Temp";

export function buildGIBSSource(layer: GIBSLayer, date: string) {
  return {
    type: "raster" as const,
    tiles: [
      `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${layer}/default/${date}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`,
    ],
    tileSize: 256,
    maxzoom: 9, // GIBS only has tiles up to z=9; MapLibre upscales beyond
    attribution:
      'Imagery <a href="https://earthdata.nasa.gov/gibs">NASA EOSDIS GIBS</a>',
  };
}

export function defaultSatelliteDate(): string {
  const d = new Date();
  d.setDate(d.getDate() - 2); // MODIS has 1-2 day lag
  return d.toISOString().slice(0, 10);
}

export function formatSliderDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
}
