import { Hero } from '../components/home/Hero.jsx';
import { Intro } from '../components/home/Intro.jsx';
import { Capabilities } from '../components/home/Capabilities.jsx';
import { Industries } from '../components/home/Industries.jsx';
import { Projects } from '../components/home/Projects.jsx';
import { Numbers } from '../components/home/Numbers.jsx';
import { Clients } from '../components/home/Clients.jsx';
import { WhyUs } from '../components/home/WhyUs.jsx';
import { ClosingCTA } from '../components/home/ClosingCTA.jsx';
import { company } from '../data/company.js';

const DESCRIPTION =
  'Vedanjay Power is a renewable power consultancy in Indore, India — open access, forecasting ' +
  'and scheduling, regulatory liaisoning, electrical infrastructure, rooftop solar and O&M for ' +
  'renewable generators, utilities and industrial power buyers.';

/* Generated from the same data that renders the page, so structured data
   cannot drift from the visible content. The legacy site has none. */
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: company.legalName,
  alternateName: company.name,
  url: 'https://vedanjay-power.com/',
  description: DESCRIPTION,
  foundingDate: String(company.incorporated),
  identifier: { '@type': 'PropertyValue', propertyID: 'CIN', value: company.cin },
  address: {
    '@type': 'PostalAddress',
    streetAddress: company.offices[0].lines.slice(0, 2).join(', '),
    addressLocality: 'Indore', addressRegion: 'Madhya Pradesh',
    postalCode: '452008', addressCountry: 'IN',
  },
  contactPoint: {
    '@type': 'ContactPoint', telephone: '+91-731-4239605',
    email: company.emails[0].value, contactType: 'sales', areaServed: 'IN',
  },
};

export default function Home() {
  return (
    <>
      {/* React 19 hoists these into <head> natively — no helmet dependency */}
      <title>Vedanjay Power — Renewable Power Consultancy | Open Access, Grid Connection &amp; O&amp;M</title>
      <meta name="description" content={DESCRIPTION} />
      <link rel="canonical" href="https://vedanjay-power.com/" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Vedanjay Power — Renewable Power Consultancy" />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:url" content="https://vedanjay-power.com/" />
      <meta property="og:site_name" content={company.name} />
      <meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>

      <Hero />
      <Intro />
      <Capabilities />
      <Industries />
      <Projects />
      <Numbers />
      <Clients />
      <WhyUs />
      <ClosingCTA />
    </>
  );
}
