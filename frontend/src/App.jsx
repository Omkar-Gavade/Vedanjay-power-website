import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { RootLayout } from './components/layout/RootLayout.jsx';
import { ROUTES } from './constants/routes.js';
import Home from './pages/Home.jsx';

/* Home is in the initial bundle. Routes declared in the navigation but not yet
   built resolve to the interim page, which is code-split. */
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Team = lazy(() => import('./pages/Team.jsx'));
const Awards = lazy(() => import('./pages/Awards.jsx'));
const Downloads = lazy(() => import('./pages/Downloads.jsx'));
const Partners = lazy(() => import('./pages/Partners.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Services = lazy(() => import('./pages/Services.jsx'));
const Industries = lazy(() => import('./pages/Industries.jsx'));
const Projects = lazy(() => import('./pages/Projects.jsx'));
const Gallery = lazy(() => import('./pages/Gallery.jsx'));
const Careers = lazy(() => import('./pages/Careers.jsx'));

/** Reserves layout height so a route swap does not collapse the page. */
const routeFallback = <div style={{ minHeight: '70vh' }} />;

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path={ROUTES.contact} element={<Suspense fallback={routeFallback}><Contact /></Suspense>} />
        <Route path={ROUTES.team} element={<Suspense fallback={routeFallback}><Team /></Suspense>} />
        <Route path={ROUTES.awards} element={<Suspense fallback={routeFallback}><Awards /></Suspense>} />
        <Route path={ROUTES.downloads} element={<Suspense fallback={routeFallback}><Downloads /></Suspense>} />
        <Route path={ROUTES.partners} element={<Suspense fallback={routeFallback}><Partners /></Suspense>} />
        <Route path={ROUTES.about} element={<Suspense fallback={routeFallback}><About /></Suspense>} />
        <Route path={ROUTES.services} element={<Suspense fallback={routeFallback}><Services /></Suspense>} />
        <Route path={ROUTES.industries} element={<Suspense fallback={routeFallback}><Industries /></Suspense>} />
        {/* Gallery before the register so /projects/gallery/ is not shadowed. */}
        <Route path={ROUTES.gallery} element={<Suspense fallback={routeFallback}><Gallery /></Suspense>} />
        <Route path={ROUTES.projects} element={<Suspense fallback={routeFallback}><Projects /></Suspense>} />
        <Route path={ROUTES.careers} element={<Suspense fallback={routeFallback}><Careers /></Suspense>} />
        <Route path="*" element={<Suspense fallback={routeFallback}><NotFound /></Suspense>} />
      </Route>
    </Routes>
  );
}
