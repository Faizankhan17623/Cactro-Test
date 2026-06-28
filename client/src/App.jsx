import { Routes, Route } from 'react-router-dom';
import ReleaseList from './pages/ReleaseList.jsx';
import NewRelease from './pages/NewRelease.jsx';
import ReleaseDetail from './pages/ReleaseDetail.jsx';

export default function App() {
  return (
    <div className="page">
      <header className="brand">
        <h1>ReleaseCheck</h1>
        <p>Your all-in-one release checklist tool</p>
      </header>

      <main className="card">
        <Routes>
          <Route path="/" element={<ReleaseList />} />
          <Route path="/new" element={<NewRelease />} />
          <Route path="/releases/:id" element={<ReleaseDetail />} />
        </Routes>
      </main>
    </div>
  );
}
