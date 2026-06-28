// "September 20, 2022, 02:30 PM" style date — shows the time in 12-hour
// (AM/PM) format, since a release has a datetime.
export function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

const STATUS_LABELS = {
  planned: 'Planned',
  ongoing: 'Ongoing',
  done: 'Done',
};

export const statusLabel = (status) => STATUS_LABELS[status] ?? status;
