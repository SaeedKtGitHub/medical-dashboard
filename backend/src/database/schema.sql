-- GIS Medical Dashboard Schema
-- PostgreSQL (no PostGIS required)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DROP TABLE IF EXISTS alert_history CASCADE;
DROP TABLE IF EXISTS ambulance_history CASCADE;
DROP TABLE IF EXISTS hospital_history CASCADE;
DROP TABLE IF EXISTS history_snapshots CASCADE;
DROP TABLE IF EXISTS ambulances CASCADE;
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS hospitals CASCADE;

CREATE TABLE hospitals (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(150) NOT NULL,
  latitude     DOUBLE PRECISION NOT NULL,
  longitude    DOUBLE PRECISION NOT NULL,
  occupancy    INTEGER NOT NULL CHECK (occupancy >= 0 AND occupancy <= 100),
  type         VARCHAR(50) NOT NULL,
  status       VARCHAR(50) NOT NULL DEFAULT 'Active',
  governorate  VARCHAR(100) NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ambulances (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code         VARCHAR(50) NOT NULL UNIQUE,
  latitude     DOUBLE PRECISION NOT NULL,
  longitude    DOUBLE PRECISION NOT NULL,
  status       VARCHAR(50) NOT NULL DEFAULT 'available',
  hospital_id  UUID REFERENCES hospitals(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE alerts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message     TEXT NOT NULL,
  severity    VARCHAR(20) NOT NULL CHECK (severity IN ('INFO', 'WARNING', 'CRITICAL')),
  category    VARCHAR(20) NOT NULL CHECK (category IN ('Hospital', 'Ambulance', 'Emergency', 'System')),
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hospitals_status ON hospitals(status);
CREATE INDEX idx_hospitals_type ON hospitals(type);
CREATE INDEX idx_hospitals_governorate ON hospitals(governorate);
CREATE INDEX idx_ambulances_status ON ambulances(status);
CREATE INDEX idx_ambulances_hospital_id ON ambulances(hospital_id);
CREATE INDEX idx_alerts_created_at ON alerts(created_at DESC);
CREATE INDEX idx_alerts_severity ON alerts(severity);

CREATE TABLE history_snapshots (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ambulance_history (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_id   UUID NOT NULL REFERENCES history_snapshots(id) ON DELETE CASCADE,
  ambulance_id  UUID NOT NULL REFERENCES ambulances(id) ON DELETE CASCADE,
  latitude      DOUBLE PRECISION NOT NULL,
  longitude     DOUBLE PRECISION NOT NULL,
  status        VARCHAR(50) NOT NULL
);

CREATE TABLE hospital_history (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_id  UUID NOT NULL REFERENCES history_snapshots(id) ON DELETE CASCADE,
  hospital_id  UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  occupancy    INTEGER NOT NULL CHECK (occupancy >= 0 AND occupancy <= 100)
);

CREATE TABLE alert_history (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_id  UUID NOT NULL REFERENCES history_snapshots(id) ON DELETE CASCADE,
  message      TEXT NOT NULL,
  severity     VARCHAR(20) NOT NULL
);

CREATE INDEX idx_history_snapshots_created_at ON history_snapshots(created_at DESC);
CREATE INDEX idx_ambulance_history_snapshot ON ambulance_history(snapshot_id);
CREATE INDEX idx_hospital_history_snapshot ON hospital_history(snapshot_id);
CREATE INDEX idx_alert_history_snapshot ON alert_history(snapshot_id);
