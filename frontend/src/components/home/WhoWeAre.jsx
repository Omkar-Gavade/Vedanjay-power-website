import { journey } from '../../data/capabilities.js';
import { company } from '../../data/company.js';
import { Media } from '../ui/Media.jsx';
import { Reveal } from '../ui/Reveal.jsx';
import { SectionHead } from '../ui/SectionHead.jsx';
import { Button } from '../ui/Button.jsx';
import { ROUTES } from '../../constants/routes.js';

/** Who we are — the company's own story, set as editorial prose beside a photograph. */
export function WhoWeAre() {
  return (
    <section className="vp-section" aria-labelledby="who-h">
      <div className="vp-container">
        <div className="row g-4 g-lg-5 align-items-center">
          <div className="col-12 col-lg-6">
            <Reveal>
              <Media slug="grid-transmission" ratio="4x3" className="vp-img-reveal vp-zoom"
                     sizes="(max-width: 992px) 100vw, 48vw" />
            </Reveal>
          </div>

          <div className="col-12 col-lg-6 ps-lg-5">
            <SectionHead id="who-h" eyebrow="Who we are" title="A diversified power-sector solutions company." />
            <Reveal delay={80}>
              <div className="vp-prose mt-4">
                {journey.map((p) => <p key={p.slice(0, 24)} className="vp-body vp-text-soft">{p}</p>)}
              </div>
              <dl className="vp-factline mt-4">
                <div>
                  <dt>Established</dt>
                  <dd>{company.established}</dd>
                </div>
                <div>
                  <dt>Operations</dt>
                  <dd>Maharashtra · Madhya Pradesh · Telangana · WRLDC</dd>
                </div>
                <div>
                  <dt>Technologies</dt>
                  <dd>Solar · Wind · Hybrid</dd>
                </div>
              </dl>
              <div className="mt-4">
                <Button to={ROUTES.about} variant="outline">About Vedanjay Power</Button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
