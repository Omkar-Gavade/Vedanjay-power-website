import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { RootLayout } from './components/layout/RootLayout.jsx';
import Home from './pages/Home.jsx';

/* Home ships in the initial bundle; everything else is split out. */
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<Suspense fallback={<div style={{ minHeight: '70vh' }} />}><NotFound /></Suspense>} />
      </Route>
    </Routes>
  );
}
