import { Button } from '../components/ui/Button.jsx';
import { ROUTES } from '../constants/routes.js';

/** Interim page for routes declared in the navigation but not yet built. */
export default function NotFound() {
  return (
    <>
      <title>Coming soon — Vedanjay Power Pvt. Ltd.</title>
      <meta name="robots" content="noindex" />
      <section className="vp-section" style={{ paddingTop: 'calc(var(--vp-header-h) + 5rem)' }}>
        <div className="vp-container">
          <p className="vp-eyebrow vp-label mb-3">In development</p>
          <h1 className="vp-h1 vp-measure-tight mb-3">This page is coming soon.</h1>
          <p className="vp-lead vp-measure-lead mb-4">
            The home page is live. The remaining sections are in preparation.
          </p>
          <Button to={ROUTES.home} variant="primary" size="lg">Back to home</Button>
        </div>
      </section>
    </>
  );
}
