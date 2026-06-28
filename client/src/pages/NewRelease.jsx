import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createRelease } from '../api.js';

export default function NewRelease() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Please give the release a name.');
    if (!date) return setError('Please pick a release date.');

    setSaving(true);
    try {
      // <input type="datetime-local"> gives a local string; convert to ISO.
      const release = await createRelease({
        name: name.trim(),
        date: new Date(date).toISOString(),
        additionalInfo: additionalInfo.trim(),
      });
      navigate(`/releases/${release.id}`);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <>
      <nav className="breadcrumb">
        <Link to="/">All releases</Link> <span>›</span> <span>New release</span>
      </nav>

      <form className="release-form" onSubmit={handleSubmit}>
        <div className="field-row">
          <label className="field">
            <span>Release</span>
            <input
              type="text"
              value={name}
              placeholder="Version 1.0.1"
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="field">
            <span>Date</span>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
        </div>

        <label className="field">
          <span>Additional remarks / tasks</span>
          <textarea
            rows={5}
            value={additionalInfo}
            placeholder="Please enter any other important notes for the release"
            onChange={(e) => setAdditionalInfo(e.target.value)}
          />
        </label>

        {error && <p className="error">{error}</p>}

        <div className="form-actions">
          <button className="btn primary" type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Create release ✓'}
          </button>
        </div>
      </form>
    </>
  );
}
