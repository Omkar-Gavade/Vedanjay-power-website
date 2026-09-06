/**
 * Company identity and contact.
 * SOURCE OF TRUTH: Vedanjay Power Website Information Requirement Document (IRD).
 * Nothing here is inferred. Items the IRD marks "to be confirmed" are omitted.
 */
export const company = {
  legalName: 'Vedanjay Power Pvt. Ltd.',
  name: 'Vedanjay Power',
  tagline: 'Connecting to a More Sustainable Future',
  established: 2011,                                    // IRD §1
  website: 'https://vedanjay-power.com/',

  /** IRD §1 — Company Overview (short). Used verbatim in substance. */
  overview:
    'Vedanjay Power Pvt. Ltd. is a power-sector solutions company providing end-to-end services ' +
    'across renewable energy, open-access power, forecasting and scheduling, electrical ' +
    'infrastructure, metering, telemetry, transmission and grid consultancy.',

  offices: [
    {
      id: 'indore',
      role: 'Corporate Office',
      city: 'Indore',
      lines: ['4/F/S3, Nai Sadak, Scheme No. 78', 'Indore – 452010', 'Madhya Pradesh, India'],
      /**
       * The SAME address, split into the fields schema.org's PostalAddress
       * expects. Not a new fact and not a second source of truth — every token
       * below appears verbatim in `lines` above, which stays the thing the page
       * renders. Structured data built by string-slicing `lines` was getting
       * the postcode and the state wrong in two different ways on two pages.
       */
      postal: {
        street: '4/F/S3, Nai Sadak, Scheme No. 78',
        locality: 'Indore',
        region: 'Madhya Pradesh',
        postalCode: '452010',
        country: 'IN',
      },
      /**
       * Geocodable subset of the address above, for the contact-page map.
       *
       * NOT a new fact — every token appears in `lines`. The unit designator
       * ("4/F/S3") and "Nai Sadak" are dropped because Google cannot resolve
       * the combination and falls back to an unmarked area view. Verified
       * 4 Sep 2026: this query returns a marker whose info card reads
       * "Scheme Number 78, Part II … Indore, Madhya Pradesh 452010" — the
       * published PIN.
       */
      mapQuery: 'Scheme No. 78, Indore, Madhya Pradesh 452010, India',
    },
    {
      id: 'pune',
      role: 'Branch Office',
      city: 'Pune',
      lines: [
        'Flat No. 210, Grand Horizon',
        'Behind Brahma Hotel, Sinhagad Road',
        'Pune City, Pune – 411041',
        'Maharashtra, India',
      ],
      /** As above — the same address in PostalAddress fields. */
      postal: {
        street: 'Flat No. 210, Grand Horizon, Behind Brahma Hotel, Sinhagad Road',
        locality: 'Pune',
        region: 'Maharashtra',
        postalCode: '411041',
        country: 'IN',
      },
      /**
       * As above. Verified 4 Sep 2026: returns a marker labelled "Grand
       * Horizon" whose info card reads "Sinhgad Rd … behind Bramha Hotel",
       * matching the published landmark.
       */
      mapQuery: 'Grand Horizon, Sinhagad Road, Pune, Maharashtra, India',
    },
  ],

  phone: { display: '7666901814', href: 'tel:+917666901814' },
  whatsapp: { display: '7666901814', href: 'https://wa.me/917666901814' },
  emails: {
    general: 'projects@vedanjay-power.com',
    operations: 'forecasting.india@vedanjay-power.com',
  },

  /**
   * Social accounts.
   *
   * Only LinkedIn is stated in the source document (IRD §22), so only LinkedIn
   * carries a URL. Facebook and X are declared with `href: null` — the icons
   * render as part of the footer set but do not navigate, because inventing a
   * handle would be worse than an inactive button.
   *
   * To activate: paste the verified profile URL into `href`. Nothing else changes.
   */
  social: [
    {
      id: 'linkedin', label: 'LinkedIn',
      href: 'https://in.linkedin.com/company/vedanjay-power-private-limited',
    },
    {
      id: 'facebook', label: 'Facebook',
      href: 'https://www.facebook.com/people/Vedanjay-Power-Private-Limited/100061144302620/',
    },
    /* Supplied as a twitter.com address and kept verbatim: it redirects to
       x.com, and the company's own handle is the canonical thing to publish. */
    { id: 'x', label: 'X', href: 'https://twitter.com/VedanjayPower' },
  ],

  /** IRD §1 — Areas of Operation. Registrations, not marketing reach. */
  operatingAreas: [
    { name: 'Maharashtra', basis: 'Registered SLDC operations' },
    { name: 'Madhya Pradesh', basis: 'Registered SLDC operations' },
    { name: 'Telangana', basis: 'Registered SLDC operations' },
    { name: 'Western Region', basis: 'Registered WRLDC operations' },
  ],
};

export const currentYear = () => new Date().getFullYear();
