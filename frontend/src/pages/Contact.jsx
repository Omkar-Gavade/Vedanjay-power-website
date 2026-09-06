import { ContactHero } from '../components/contact/ContactHero.jsx';
import { ContactPrimary } from '../components/contact/ContactPrimary.jsx';
import { Locations } from '../components/contact/Locations.jsx';
import '../styles/contact.css';
import { Seo } from '../components/seo/Seo.jsx';
import { ROUTES } from '../constants/routes.js';

/**
 * Contact — the site's primary conversion page.
 *
 * Order follows how a buyer actually behaves: give them a direct line first
 * (many will just call), then the structured enquiry for those who prefer it,
 * then where we are, then what support they get. No section exists to add
 * length.
 *
 * Head metadata and structured data come from <Seo>, which reads the route's
 * entry in data/seo.js. The Organization node this page used to emit itself is
 * gone: it described the same company as the home page's and disagreed with it
 * about the address, so there is now one organisation node with one @id that
 * every page references.
 */
export default function Contact() {
  return (
    <>
      <Seo route={ROUTES.contact} />

      {/*
        Hero → contact routes beside the enquiry form → offices.
        The form is the primary conversion mechanism, so it sits immediately
        under the hero rather than below a scroll of supporting content.
      */}
      <ContactHero />
      <ContactPrimary />
      <Locations />
    </>
  );
}
