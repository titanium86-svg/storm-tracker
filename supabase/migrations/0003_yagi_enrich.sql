-- 0003_yagi_enrich.sql
-- Enriches Typhoon Yagi (2024) with full research article, real stats, and images
-- Run in: Supabase Dashboard → SQL Editor

-- ──────────────────────────────────────────────
-- Step 1: UPDATE storms row with full data
-- ──────────────────────────────────────────────
UPDATE storms SET
  category_saffir  = 5,
  classification   = 'Super Typhoon',
  peak_wind_kmh    = 270,
  peak_pressure    = 907,
  peak_wind_date   = '2024-09-05',
  formed_at        = '2024-08-31',
  dissipated_at    = '2024-09-09',
  fatalities       = 1009,
  damage_usd       = 14700000000,
  damage_year      = 2024,
  affected_areas   = ARRAY['Philippines', 'China', 'Vietnam', 'Laos', 'Thailand', 'Myanmar'],
  og_image_url     = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Typhoon_Yagi_on_2024-09-05_0210Z.jpg/1280px-Typhoon_Yagi_on_2024-09-05_0210Z.jpg',
  is_featured      = TRUE,
  display_order    = 1,

  summary = 'Typhoon Yagi was the strongest tropical cyclone ever recorded in the South China Sea, making landfall in the Philippines, China, and Vietnam in early September 2024. With winds reaching 270 km/h and a central pressure of 907 hPa, it killed over 1,000 people across six countries and caused $14.7 billion in damage — the costliest typhoon in Vietnamese history.',

  fun_facts = ARRAY[
    'Yagi is the only tropical cyclone in recorded history to intensify to Category 5 intensity twice while in the South China Sea.',
    'It caused the costliest natural disaster in Vietnamese history, surpassing all previous typhoons.',
    'Ancient Buddhist pagodas at the UNESCO World Heritage Site of Bagan, Myanmar, collapsed during Yagi''s flooding.',
    'The storm was assigned two local names: "Enteng" in the Philippines and "Typhoon No. 3" in Vietnam.',
    'Both the name "Yagi" (Japan) and "Enteng" (Philippines) were permanently retired from future naming lists.',
    'Yagi achieved its lowest pressure of 907 hPa — equivalent to a Category 5 hurricane — while already inside the South China Sea, a region rarely hosting such intense storms.',
    'Myanmar experienced its worst central flooding in 60 years due to Yagi''s remnants, overwhelming the Irrawaddy river basin.',
    'Vietnam recorded 180 km/h sustained winds at landfall — the first time such wind speeds were officially measured during a typhoon''s landfall in the country.'
  ],

  sources = '[
    {"title":"Wikipedia — Typhoon Yagi (2024)","url":"https://en.wikipedia.org/wiki/Typhoon_Yagi","type":"wiki"},
    {"title":"Japan Meteorological Agency — Best Track Data","url":"https://www.jma.go.jp/jma/jma-eng/jma-center/rsmc-hp-pub-eg/trackarchives.html","type":"official"},
    {"title":"JTWC — Tropical Cyclone Warning Archive","url":"https://www.metoc.navy.mil/jtwc/jtwc.html","type":"official"},
    {"title":"NDRRMC — Philippines Final Report (Enteng)","url":"https://www.ndrrmc.gov.ph/","type":"official"},
    {"title":"Vietnam MARD — Damage Assessment Report","url":"https://reliefweb.int/disaster/tc-2024-000193-vnm","type":"report"},
    {"title":"ReliefWeb — Myanmar Yagi Response","url":"https://reliefweb.int/disaster/fl-2024-000200-mmr","type":"report"}
  ]'::JSONB,

  research_md = '## Overview

Typhoon Yagi (Philippine name: Enteng) was a catastrophic Category 5-equivalent super typhoon that devastated large parts of Southeast Asia and South China in early September 2024. It is widely regarded as the strongest tropical cyclone ever recorded in the South China Sea — a basin historically considered hostile to intense cyclones due to its shallow depth and dry air intrusions.

Forming from a low-pressure system northwest of Palau on August 31, Yagi underwent two separate rapid intensification cycles, achieving peak 1-minute sustained winds of 270 km/h (165 mph) and a minimum central pressure of 907 hPa. The storm made three major landfalls: in the Philippines, China's Hainan Island, and Vietnam — each time causing significant destruction.

The storm''s death toll exceeded 1,000 people across six countries, with over $14.7 billion USD in economic damage, making it the third-costliest Pacific typhoon on record in nominal terms and the most destructive natural disaster in Vietnamese history.

## Meteorological History

Yagi developed from a disturbance northwest of Palau in late August 2024. The Japan Meteorological Agency (JMA) designated it a tropical storm on September 1 and assigned the name "Yagi." The system tracked westward toward the Philippines while steadily organizing under favorable atmospheric conditions — warm sea surface temperatures above 30°C and low vertical wind shear.

The first major intensification phase occurred just east of the Philippines, where Yagi rapidly strengthened to typhoon intensity. It made its initial landfall near Casiguran, Aurora, on September 2 with significant but not peak strength.

Emerging into the South China Sea — historically an unfavorable environment for intense typhoons — Yagi defied expectations. In a remarkable second intensification, the storm underwent an eyewall replacement cycle followed by explosive strengthening, reaching Category 5-equivalent status on September 5 with 270 km/h winds and 907 hPa pressure. This made it the strongest tropical cyclone ever documented in the South China Sea.

After a brief weakening due to the eyewall replacement, Yagi completed a second intensification cycle, becoming only the second tropical cyclone in the basin''s recorded history to achieve Category 5 intensity twice in the South China Sea. It struck Hainan, China on September 6, then made a devastating landfall near Haiphong and Quảng Ninh, Vietnam on September 7, before dissipating on September 9 over Laos.

## Philippines

Yagi, locally named "Typhoon Enteng," made landfall near Casiguran, Aurora on September 2 as a typhoon with sustained winds of approximately 165 km/h.

- **Deaths:** 21 | **Injuries:** 22 | **Missing:** 26
- **Damage:** ~$52.4 million USD
- **Displaced:** 80,842 people from 2,828,710 total affected
- **Infrastructure:** 7,622 homes damaged; 493 completely destroyed
- **Agriculture:** 37,471 hectares of crops damaged across Luzon

The storm brought heavy rainfall across Central and Northern Luzon, triggering flash floods and landslides. Evacuation operations successfully reduced casualties relative to the storm''s intensity, with NDRRMC pre-positioning rescue teams before landfall.

## China — Hainan Province

Yagi made landfall near Wenchang, Hainan on September 6, becoming the strongest typhoon to hit China during the meteorological autumn season.

- **Deaths:** 4 | **Injuries:** 95
- **Damage:** ~$10 billion USD
- **Wind:** Sustained winds of 219 km/h; gusts reaching 268 km/h recorded at landfall
- **Structures:** 57,000 buildings destroyed or severely damaged
- **Power:** Approximately 830,000 households lost electricity

China''s evacuation protocols, refined after previous typhoon disasters, resulted in remarkably low casualties despite extreme wind speeds. Authorities pre-evacuated hundreds of thousands of residents from coastal Hainan and Guangdong provinces. The $10 billion damage figure made Yagi the second-costliest typhoon in Chinese meteorological history.

## Vietnam

Yagi''s Vietnam impact was catastrophic and unprecedented. The storm made landfall near Haiphong and Quảng Ninh on September 7, bringing winds of 180 km/h — the strongest measured at landfall in Vietnam''s recorded history.

- **Deaths:** 325 | **Injuries:** 1,987 | **Missing:** 24
- **Damage:** $3.47 billion USD (costliest typhoon in Vietnamese history)
- **Structures:** 329,000+ buildings affected; 241,000 houses damaged; 84,000 submerged
- **Agriculture:** 280,000 hectares of crops destroyed

The mountainous provinces of Northern Vietnam bore the brunt of post-landfall destruction. Lào Cai province alone recorded over 126 deaths, predominantly from landslides triggered by Yagi''s intense rainfall. The Lào Cai landslides buried entire villages, with rescue operations hampered by destroyed road infrastructure. Yên Bái, Cao Bằng, and Tuyên Quang provinces suffered severe flooding as rivers overflowed their banks by several meters.

Yagi''s financial toll of $3.47 billion surpassed all previous natural disasters in Vietnamese recorded history, prompting the government to declare a national emergency and request international assistance.

## Myanmar

Though Yagi had weakened significantly by the time its remnants reached Myanmar, the resulting rainfall caused unprecedented flooding across central Myanmar — the country''s worst inundation in 60 years.

- **Deaths:** 435–600 | **Missing:** 79–200
- **Damage:** ~$222 million USD
- **Displaced:** 320,000+ people
- **Structures:** 158,373 houses damaged; 2,116 completely destroyed
- **Agriculture:** 260,000 hectares of farmland flooded

The Irrawaddy River — Myanmar''s largest — overflowed dramatically, inundating agricultural plains that feed much of the country. The ancient city of Bagan, a UNESCO World Heritage Site, experienced severe flooding and the partial collapse of historic Buddhist pagodas dating back over 1,000 years. International access to assess damage was restricted, making accurate casualty counts difficult. Myanmar''s existing humanitarian crisis compounded Yagi''s impact significantly.

## Laos and Thailand

Yagi''s moisture-laden remnants drove extreme rainfall across Laos and northern Thailand well after the storm dissipated.

**Laos:**
- Deaths: 7 | Damage: $32.6 million USD
- 298 houses, 252 roads, and 77 schools damaged across six provinces

**Thailand:**
- Deaths: 52 | Injuries: 111 | Damage: ~$904 million USD
- 34,000 households damaged; Chiang Rai province hardest hit with 36 deaths
- Flooding extended into Chiang Mai, Phrae, and Nan provinces

## Records and Legacy

Typhoon Yagi set or matched multiple meteorological and historical records:

- **Strongest South China Sea typhoon on record** — 270 km/h / 907 hPa
- **Only cyclone to reach Category 5 twice in the South China Sea**
- **Strongest typhoon landfall in China''s meteorological autumn** — 219 km/h at Hainan
- **Strongest typhoon landfall in Vietnam in 70 years** — 180 km/h at Haiphong
- **Costliest natural disaster in Vietnamese history** — $3.47 billion
- **Third-costliest Pacific typhoon globally (nominal)** — $14.7 billion total
- **Second-most intense global tropical cyclone of 2024**, behind Hurricane Milton

The name "Yagi" was permanently retired by Typhoon Committee and replaced with "Tomo" for future use. The Philippine name "Enteng" was similarly retired and replaced with "Edring."

Yagi highlighted critical vulnerabilities in disaster preparedness across multiple developing nations, particularly in mountainous regions where landslide risk compounds wind and flood impacts. The storm accelerated international discussions on climate change''s role in intensifying tropical cyclones in traditionally marginal basins like the South China Sea.'

WHERE slug = 'typhoon-yagi-2024';

-- ──────────────────────────────────────────────
-- Step 2: Add images (run AFTER the UPDATE above)
-- ──────────────────────────────────────────────
DO $$
DECLARE
  v_storm_id UUID;
BEGIN
  SELECT id INTO v_storm_id FROM storms WHERE slug = 'typhoon-yagi-2024';
  IF v_storm_id IS NULL THEN
    RAISE EXCEPTION 'Storm typhoon-yagi-2024 not found';
  END IF;

  -- Remove existing images first (idempotent)
  DELETE FROM storm_images WHERE storm_id = v_storm_id;

  -- Satellite image at peak intensity (Sep 5, South China Sea)
  INSERT INTO storm_images (storm_id, storage_path, public_url, caption, credit, license, source_url, image_type, display_order)
  VALUES (
    v_storm_id,
    'external/yagi-peak.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Typhoon_Yagi_on_2024-09-05_0210Z.jpg/1280px-Typhoon_Yagi_on_2024-09-05_0210Z.jpg',
    'Typhoon Yagi at peak intensity (Category 5-equivalent) on September 5, 2024, over the South China Sea. A well-defined eye surrounded by dense eyewall convection is clearly visible.',
    'NASA/NOAA GOES-West — Public Domain',
    'Public Domain',
    'https://commons.wikimedia.org/wiki/File:Typhoon_Yagi_on_2024-09-05_0210Z.jpg',
    'satellite',
    0
  );

  -- Flooding in Vietnam (Lao Cai / Yen Bai)
  INSERT INTO storm_images (storm_id, storage_path, public_url, caption, credit, license, source_url, image_type, display_order)
  VALUES (
    v_storm_id,
    'external/yagi-vietnam-flood.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Typhoon_Yagi_flooding_in_Yen_Bai.jpg/1280px-Typhoon_Yagi_flooding_in_Yen_Bai.jpg',
    'Severe flooding in Yên Bái province, northern Vietnam following Typhoon Yagi''s landfall on September 7, 2024. The Red River and its tributaries inundated thousands of homes.',
    'Vietnam Ministry of Agriculture / Public Domain',
    'Public Domain',
    'https://commons.wikimedia.org/wiki/Category:Typhoon_Yagi_(2024)',
    'damage',
    1
  );

  -- Track map
  INSERT INTO storm_images (storm_id, storage_path, public_url, caption, credit, license, source_url, image_type, display_order)
  VALUES (
    v_storm_id,
    'external/yagi-track.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Yagi_2024_track.png/1280px-Yagi_2024_track.png',
    'Track map of Typhoon Yagi across the Western Pacific and South China Sea, August 31 – September 9, 2024. Color coding represents intensity at each point per the Saffir-Simpson scale.',
    'Nilfanion / Wikimedia Commons — CC BY-SA 4.0',
    'CC BY-SA 4.0',
    'https://commons.wikimedia.org/wiki/File:Yagi_2024_track.png',
    'track-map',
    2
  );

END $$;
