// The release process is the same for every release, so we keep the list of
// steps here in code instead of in a database table. Each release only stores
// which of these step ids it has completed.
//
// If you want to change the release process, edit this list. Existing releases
// will simply ignore any completed ids that are no longer present.
export const STEPS = [
  { id: 'prs_merged', label: 'All relevant GitHub pull requests have been merged' },
  { id: 'changelog_updated', label: 'CHANGELOG.md files have been updated' },
  { id: 'tests_passing', label: 'All tests are passing' },
  { id: 'github_release', label: 'Releases in Github created' },
  { id: 'deployed_demo', label: 'Deployed in demo' },
  { id: 'tested_demo', label: 'Tested thoroughly in demo' },
  { id: 'deployed_production', label: 'Deployed in production' },
];

const STEP_IDS = new Set(STEPS.map((s) => s.id));

// Keep only ids that are real steps, drop duplicates and anything unknown.
export function sanitizeCompleted(completed) {
  if (!Array.isArray(completed)) return [];
  return [...new Set(completed)].filter((id) => STEP_IDS.has(id));
}

// status is never set by the user, it is derived from how many steps are done.
export function computeStatus(completed) {
  const done = sanitizeCompleted(completed).length;
  if (done === 0) return 'planned';
  if (done === STEPS.length) return 'done';
  return 'ongoing';
}
