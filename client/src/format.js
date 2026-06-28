// "September 20, 2022" style date, matching the mockup.
export function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const STATUS_LABELS = {
  planned: 'Planned',
  ongoing: 'Ongoing',
  done: 'Done',
};

export const statusLabel = (status) => STATUS_LABELS[status] ?? status;
