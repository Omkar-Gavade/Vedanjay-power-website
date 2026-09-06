import { Hero } from '../components/home/Hero.jsx';
import { WhoWeAre } from '../components/home/WhoWeAre.jsx';
import { Capabilities } from '../components/home/Capabilities.jsx';
import { Expertise } from '../components/home/Expertise.jsx';
import { PortfolioMap } from '../components/home/PortfolioMap.jsx';
import { ClosingCTA } from '../components/home/ClosingCTA.jsx';
import { company } from '../data/company.js';

const DESCRIPTION =
  'Vedanjay Power Pvt. Ltd. — power-sector solutions across renewable energy, open-access power, ' +
  'forecasting and scheduling (QCA), ABT metering and telemetry, electrical infrastructure, ' +
  'transmission and grid consultancy. Established 2011.';

/* Organization schema built from the same data that renders the page, so
   structured data cannot drift from the visible content. */
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: company.legalName,
  alternateName: company.name,
  slogan: company.tagline,
  url: company.website,
  description: company.overview,
  foundingDate: String(company.established),
  logo: 'https://vedanjay-power.com/brand/vedanjay-power-logo.png',
  sameAs: company.social.map((s) => s.href),
  address: company.offices.map((o) => ({
    '@type': 'PostalAddress',
    streetAddress: o.lines.slice(0, -1).join(', '),
    addressLocality: o.city,
    addressCountry: 'IN',
  })),
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-7666901814',
    email: company.emails.general,
    contactType: 'sales',
    areaServed: 'IN',
  },
};

export default function Home() {
  return (
    <>
      {/* React 19 hoists these into <head> natively — no helmet dependency. */}
      <title>Vedanjay Power | Renewable Energy &amp; Power Management</title>
      <meta name="description" content={DESCRIPTION} />
      <link rel="canonical" href={company.website} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Vedanjay Power | Renewable Energy &amp; Power Management" />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:url" content={company.website} />
      <meta property="og:site_name" content={company.legalName} />
      <meta property="og:image" content="https://vedanjay-power.com/images/hero-substation.jpg" />
      <meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>

      <Hero />
      <WhoWeAre />
      <Capabilities />
      <Expertise />
      <PortfolioMap />
      <ClosingCTA />
    </>
  );
}
