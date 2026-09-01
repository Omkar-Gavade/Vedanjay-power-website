import { Button } from '../components/ui/Button.jsx';
import { ROUTES } from '../constants/routes.js';

/** Placeholder for routes not yet built. Navigation links to them already, so
 *  this has to be honest and offer a way back rather than being a dead end. */
export default function NotFound() {
  return (
    <>
      <title>In development — Vedanjay Power</title>
      <meta name="robots" content="noindex" />
      <section className="vp-section" style={{ paddingTop: 'calc(var(--vp-header-h) + 5rem)' }}>
        <div className="vp-container">
          <p className="vp-eyebrow vp-label mb-3">In development</p>
          <h1 className="vp-h1 vp-measure-tight mb-3">This page is being built.</h1>
          <p className="vp-lead vp-measure-lead mb-4">
            The home page and navigation are complete. The remaining pages — services,
            industries, projects, about and contact — are specified in the project
            documentation and are next in the build.
          </p>
          <Button to={ROUTES.home} variant="primary" size="lg" arrow>Back to home</Button>
        </div>
      </section>
    </>
  );
}
