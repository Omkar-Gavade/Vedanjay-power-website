import { company } from '../data/company.js';
import { ContactHero } from '../components/contact/ContactHero.jsx';
import { ContactPrimary } from '../components/contact/ContactPrimary.jsx';
import { Locations } from '../components/contact/Locations.jsx';
import '../styles/contact.css';

/**
 * Contact — the site's primary conversion page.
 *
 * Order follows how a buyer actually behaves: give them a direct line first
 * (many will just call), then the structured enquiry for those who prefer it,
 * then where we are, then what support they get. No section exists to add
 * length.
 *
 * React 19 hoists <title>/<meta>/<link> from the tree, which is why this needs
 * no SEO dependency — the same approach the rest of the site already uses.
 */
export default function Contact() {
  /* Only facts already published elsewhere on the site. Nothing is invented,
     so this cannot drift from what a visitor is told. */
  const ldJson = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.legalName,
    url: company.website,
    telephone: `+91${company.phone.display}`,
    email: company.emails.general,
    foundingDate: String(company.established),
    address: company.offices.map((o) => ({
      '@type': 'PostalAddress',
      streetAddress: o.lines.slice(0, -2).join(', '),
      addressLocality: o.city,
      addressCountry: 'IN',
    })),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: company.emails.general,
        telephone: `+91${company.phone.display}`,
      },
      {
        '@type': 'ContactPoint',
        contactType: 'technical support',
        email: company.emails.operations,
        availableLanguage: 'en',
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          opens: '00:00', closes: '23:59',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        },
      },
    ],
  };

  return (
    <>
      <title>Contact — Vedanjay Power Pvt. Ltd.</title>
      <meta
        name="description"
        content="Contact Vedanjay Power for QCA, forecasting and scheduling, open-access power, ABT metering, electrical infrastructure and grid studies. Offices in Indore and Pune."
      />
      <link rel="canonical" href={`${company.website.replace(/\/$/, '')}/contact/`} />
      {/* JSON-LD is data, not markup — React renders it as text, so there is no
          innerHTML and nothing executable. */}
      <script type="application/ld+json">{JSON.stringify(ldJson)}</script>

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
