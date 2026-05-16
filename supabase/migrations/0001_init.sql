-- ===================================================================
-- Storm Tracker — Initial schema
-- Created: 2026-05-16
-- ===================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ===================================================================
-- Table: storms (Library — 50 cơn bão lịch sử)
-- ===================================================================
CREATE TABLE storms (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  full_name       TEXT NOT NULL,
  year            INT NOT NULL,
  season          TEXT NOT NULL,
  basin           TEXT NOT NULL,             -- 'NA', 'EP', 'WP', 'NI', 'SI', 'SP'

  category_saffir INT,
  classification  TEXT NOT NULL,

  peak_wind_kmh   INT,
  peak_pressure   INT,
  peak_wind_date  DATE,

  formed_at       DATE NOT NULL,
  dissipated_at   DATE,

  fatalities      INT,
  damage_usd      BIGINT,
  damage_year     INT,

  affected_areas  TEXT[],
  summary         TEXT NOT NULL,
  research_md     TEXT NOT NULL DEFAULT '',
  fun_facts       TEXT[],
  sources         JSONB NOT NULL DEFAULT '[]',

  meta_title      TEXT,
  meta_description TEXT,
  og_image_url    TEXT,

  is_featured     BOOLEAN DEFAULT FALSE,
  display_order   INT,

  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_storms_year     ON storms(year DESC);
CREATE INDEX idx_storms_basin    ON storms(basin);
CREATE INDEX idx_storms_category ON storms(category_saffir);
CREATE INDEX idx_storms_featured ON storms(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_storms_search   ON storms USING gin(name gin_trgm_ops, full_name gin_trgm_ops);

-- ===================================================================
-- Table: storm_tracks
-- ===================================================================
CREATE TABLE storm_tracks (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  storm_id        UUID NOT NULL REFERENCES storms(id) ON DELETE CASCADE,
  observed_at     TIMESTAMPTZ NOT NULL,
  latitude        DECIMAL(6,3) NOT NULL,
  longitude       DECIMAL(7,3) NOT NULL,
  wind_kmh        INT,
  pressure_mb     INT,
  classification  TEXT,

  UNIQUE (storm_id, observed_at)
);

CREATE INDEX idx_tracks_storm ON storm_tracks(storm_id, observed_at);

-- ===================================================================
-- Table: storm_images
-- ===================================================================
CREATE TABLE storm_images (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  storm_id        UUID NOT NULL REFERENCES storms(id) ON DELETE CASCADE,
  storage_path    TEXT NOT NULL,
  public_url      TEXT NOT NULL,
  caption         TEXT NOT NULL,
  credit          TEXT NOT NULL,
  license         TEXT NOT NULL,
  source_url      TEXT,
  image_type      TEXT NOT NULL,   -- 'satellite', 'damage', 'track-map', 'aftermath'
  display_order   INT DEFAULT 0,

  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_images_storm ON storm_images(storm_id, display_order);

-- ===================================================================
-- Table: cache_nhc
-- ===================================================================
CREATE TABLE cache_nhc (
  cache_key       TEXT PRIMARY KEY,
  data            JSONB NOT NULL,
  cached_at       TIMESTAMPTZ DEFAULT NOW(),
  expires_at      TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_cache_expires ON cache_nhc(expires_at);

-- ===================================================================
-- Trigger: auto-update updated_at
-- ===================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_storms
  BEFORE UPDATE ON storms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================================================
-- RLS
-- ===================================================================
ALTER TABLE storms       ENABLE ROW LEVEL SECURITY;
ALTER TABLE storm_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE storm_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE cache_nhc    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read storms"       ON storms       FOR SELECT USING (true);
CREATE POLICY "Public read storm_tracks" ON storm_tracks FOR SELECT USING (true);
CREATE POLICY "Public read storm_images" ON storm_images FOR SELECT USING (true);

-- ===================================================================
-- View: storm_with_images
-- ===================================================================
CREATE VIEW storm_with_images AS
SELECT
  s.*,
  COALESCE(
    JSONB_AGG(
      JSONB_BUILD_OBJECT(
        'id', i.id,
        'url', i.public_url,
        'caption', i.caption,
        'credit', i.credit,
        'type', i.image_type
      ) ORDER BY i.display_order
    ) FILTER (WHERE i.id IS NOT NULL),
    '[]'::JSONB
  ) AS images
FROM storms s
LEFT JOIN storm_images i ON i.storm_id = s.id
GROUP BY s.id;
