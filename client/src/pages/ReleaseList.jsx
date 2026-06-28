import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getReleases, deleteRelease } from '../api.js';
import { formatDate, statusLabel } from '../format.js';

export default function ReleaseList() {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    getReleases()
      .then((data) => active && setReleases(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteRelease(id);
      setReleases((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="card-head">
        <h2>All releases</h2>
        <button className="btn primary" onClick={() => navigate('/new')}>
          New release <span aria-hidden="true">＋</span>
        </button>
      </div>

      {loading && <p className="muted">Loading releases…</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && releases.length === 0 && (
        <p className="muted">No releases yet. Create your first one.</p>
      )}

      {!loading && releases.length > 0 && (
        <table className="releases">
          <thead>
            <tr>
              <th>Release</th>
              <th>Date</th>
              <th>Status</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {releases.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{formatDate(r.date)}</td>
                <td>
                  <span className={`status status-${r.status}`}>
                    {statusLabel(r.status)}
                  </span>
                </td>
                <td>
                  <Link className="action" to={`/releases/${r.id}`}>
                    View <span aria-hidden="true">👁</span>
                  </Link>
                </td>
                <td>
                  <button
                    className="action danger"
                    onClick={() => handleDelete(r.id, r.name)}
                  >
                    Delete <span aria-hidden="true">🗑</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
