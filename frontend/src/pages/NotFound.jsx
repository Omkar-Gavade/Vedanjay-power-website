import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button.jsx';
import { Seo } from '../components/seo/Seo.jsx';
import { ROUTES } from '../constants/routes.js';

/**
 * 404.
 *
 * WHAT THIS USED TO SAY, and why it changed: "This page is coming soon — the
 * home page is live, the remaining sections are in preparation." That was true
 * when one page existed. All twelve are now built, so any request reaching here
 * is a wrong URL, and a wrong URL that says "coming soon" reads to a crawler
 * like a real page that is merely empty — the classic soft 404.
 *
 * ON THE STATUS CODE. The asset store serves the SPA shell with 200 for unknown
 * paths (`not_found_handling = "single-page-application"`), and routing the
 * Worker in front of every request to change that would make every image and
 * chunk a billable invocation. `noindex` — emitted by <Seo> for any route with
 * no metadata entry — is what keeps these out of the index instead, and the
 * links below give a crawler somewhere real to go.
 */
export default function NotFound() {
  return (
    <>
      <Seo route="__notfound__" />
      <title>Page not found — Vedanjay Power Pvt. Ltd.</title>
      <section className="vp-section" style={{ paddingTop: 'calc(var(--vp-header-h) + 5rem)' }}>
        <div className="vp-container">
          <p className="vp-eyebrow vp-label mb-3">404</p>
          <h1 className="vp-h1 vp-measure-tight mb-3">We can’t find that page.</h1>
          <p className="vp-lead vp-measure-lead mb-4">
            The address may be mistyped, or the page may have moved. Everything the site
            publishes is reachable from the links below.
          </p>
          <div className="d-flex flex-wrap gap-3 mb-5">
            <Button to={ROUTES.home} variant="primary" size="lg">Back to home</Button>
            <Button to={ROUTES.contact} variant="outline" size="lg">Contact us</Button>
          </div>
          <nav aria-label="Main sections">
            <ul className="list-unstyled d-flex flex-wrap gap-3 mb-0">
              <li><Link className="vp-link" to={ROUTES.about}>About Vedanjay Power</Link></li>
              <li><Link className="vp-link" to={ROUTES.services}>Services</Link></li>
              <li><Link className="vp-link" to={ROUTES.projects}>Projects</Link></li>
              <li><Link className="vp-link" to={ROUTES.industries}>Industries</Link></li>
              <li><Link className="vp-link" to={ROUTES.careers}>Careers</Link></li>
            </ul>
          </nav>
        </div>
      </section>
    </>
  );
}
