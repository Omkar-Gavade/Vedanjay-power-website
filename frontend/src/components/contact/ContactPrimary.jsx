import { ConnectPanel } from './ConnectPanel.jsx';
import { EnquiryPanel } from './EnquiryPanel.jsx';

/**
 * The page's primary conversion section: contact routes beside the enquiry
 * form, directly under the hero.
 *
 * Proportion is ~38/62 rather than 50/50. The form is the primary action and
 * needs the width; the contact rows are compact by design and stretching them
 * to half the page would waste space on both sides.
 *
 * The left column is sticky on desktop. Without it, a ~2,000px form beside a
 * ~700px column leaves 1,300px of dead space — the single biggest layout
 * problem this composition creates. Sticky turns that into an asset: the
 * contact routes stay in view for the whole time someone is filling the form.
 */
export function ContactPrimary() {
  return (
    <section className="vp-section vp-primary" id="enquiry" aria-labelledby="enq-h">
      <div className="vp-container">
        <div className="vp-primary__grid">
          <div className="vp-primary__aside">
            <ConnectPanel />
          </div>
          <div className="vp-primary__main">
            <EnquiryPanel />
          </div>
        </div>
      </div>
    </section>
  );
}
