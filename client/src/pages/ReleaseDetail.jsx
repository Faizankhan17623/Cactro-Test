import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  getSteps,
  getRelease,
  updateRelease,
  deleteRelease,
} from '../api.js';
import { formatDate, statusLabel } from '../format.js';

export default function ReleaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [steps, setSteps] = useState([]);
  const [release, setRelease] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingInfo, setSavingInfo] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([getSteps(), getRelease(id)])
      .then(([stepList, rel]) => {
        if (!active) return;
        setSteps(stepList);
        setRelease(rel);
        setCompleted(rel.completedSteps);
        setInfo(rel.additionalInfo);
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  // Toggling a step persists immediately so the status stays in sync.
  async function toggleStep(stepId) {
    const next = completed.includes(stepId)
      ? completed.filter((s) => s !== stepId)
      : [...completed, stepId];

    setCompleted(next); // optimistic update
    try {
      const updated = await updateRelease(id, { completedSteps: next });
      setRelease(updated);
      setCompleted(updated.completedSteps);
    } catch (err) {
      setError(err.message);
      setCompleted(completed); // roll back on failure
    }
  }

  async function saveInfo() {
    setSavingInfo(true);
    try {
      await updateRelease(id, { additionalInfo: info });
      // Saved successfully — go back to the list so the user sees the updated
      // release (and its status) instead of staying on a page that looks unchanged.
      navigate('/');
    } catch (err) {
      setError(err.message);
      setSavingInfo(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${release.name}"? This cannot be undone.`)) return;
    try {
      await deleteRelease(id);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p className="muted">Loading release…</p>;
  if (error && !release) return <p className="error">{error}</p>;
  if (!release) return <p className="muted">Release not found.</p>;

  // Derive the status from the live checkbox state so the badge updates the
  // moment a step is toggled, without waiting for a refresh.
  const doneCount = completed.length;
  const total = steps.length;
  const liveStatus =
    doneCount === 0 ? 'planned' : doneCount === total ? 'done' : 'ongoing';

  return (
    <>
      <div className="card-head">
        <nav className="breadcrumb">
          <Link to="/">All releases</Link> <span>›</span>{' '}
          <span className="current">{release.name}</span>
        </nav>
        <button className="btn primary" onClick={handleDelete}>
          Delete <span aria-hidden="true">🗑</span>
        </button>
      </div>

      <div className="status-row">
        <span className={`status status-${liveStatus}`}>
          {statusLabel(liveStatus)}
        </span>
        <span className="muted">
          {doneCount} of {total} steps completed
        </span>
      </div>

      <div className="field-row read-only">
        <div className="field">
          <span>Release</span>
          <div className="value-box">{release.name}</div>
        </div>
        <div className="field">
          <span>Date</span>
          <div className="value-box">{formatDate(release.date)}</div>
        </div>
      </div>

      <ul className="checklist">
        {steps.map((step) => (
          <li key={step.id}>
            <label>
              <input
                type="checkbox"
                checked={completed.includes(step.id)}
                onChange={() => toggleStep(step.id)}
              />
              <span>{step.label}</span>
            </label>
          </li>
        ))}
      </ul>

      <label className="field">
        <span>Additional remarks / tasks</span>
        <textarea
          rows={5}
          value={info}
          placeholder="Please enter any other important notes for the release"
          onChange={(e) => setInfo(e.target.value)}
        />
      </label>

      {error && <p className="error">{error}</p>}

      <div className="form-actions">
        <button className="btn primary" onClick={saveInfo} disabled={savingInfo}>
          {savingInfo ? 'Saving…' : 'Save ✓'}
        </button>
      </div>
    </>
  );
}
