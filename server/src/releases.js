import { query } from './db/pool.js';
import { computeStatus, sanitizeCompleted } from './steps.js';

// Turn a database row into the shape the frontend expects, adding the
// derived status field on the way out.
function toRelease(row) {
  const completedSteps = row.completed_steps ?? [];
  return {
    id: row.id,
    name: row.name,
    date: row.release_date,
    additionalInfo: row.additional_info,
    completedSteps,
    status: computeStatus(completedSteps),
  };
}

export async function listReleases() {
  const { rows } = await query(
    'SELECT * FROM releases ORDER BY release_date ASC, id ASC'
  );
  return rows.map(toRelease);
}

export async function getRelease(id) {
  const { rows } = await query('SELECT * FROM releases WHERE id = $1', [id]);
  return rows[0] ? toRelease(rows[0]) : null;
}

export async function createRelease({ name, date, additionalInfo }) {
  const { rows } = await query(
    `INSERT INTO releases (name, release_date, additional_info)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name.trim(), date, additionalInfo?.trim() ?? '']
  );
  return toRelease(rows[0]);
}

// Used both for editing the additional info and for toggling steps. Only the
// fields that are provided get updated.
export async function updateRelease(id, { additionalInfo, completedSteps }) {
  const sets = [];
  const values = [];
  let i = 1;

  if (additionalInfo !== undefined) {
    sets.push(`additional_info = $${i++}`);
    values.push(additionalInfo.trim());
  }
  if (completedSteps !== undefined) {
    sets.push(`completed_steps = $${i++}`);
    values.push(sanitizeCompleted(completedSteps));
  }

  if (sets.length === 0) {
    return getRelease(id);
  }

  values.push(id);
  const { rows } = await query(
    `UPDATE releases SET ${sets.join(', ')} WHERE id = $${i} RETURNING *`,
    values
  );
  return rows[0] ? toRelease(rows[0]) : null;
}

export async function deleteRelease(id) {
  const { rowCount } = await query('DELETE FROM releases WHERE id = $1', [id]);
  return rowCount > 0;
}
