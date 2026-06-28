-- A single table is enough for this app.
-- The completed steps are stored as a text[] of step ids (see src/steps.js).
-- We don't store the status column because it is always derived from the steps.
CREATE TABLE IF NOT EXISTS releases (
  id              SERIAL PRIMARY KEY,
  name            TEXT        NOT NULL,
  release_date    TIMESTAMPTZ NOT NULL,
  additional_info TEXT        NOT NULL DEFAULT '',
  completed_steps TEXT[]      NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
