/**
 * Single source of truth for company identity and contact details.
 * Every fact here is cross-referenced to docs/06-content/company-facts.md.
 * Facts marked `verified: false` are NOT rendered in production — see ./verification.js
 */
export const company = {
  legalName: 'Vedanjay Power Private Limited',
  name: 'Vedanjay Power',
  shortName: 'VPPL',
  tagline: 'Connecting to a more sustainable future',

  /** VERIFIED — MCA registry. `MP2011` segment gives state + year of incorporation. */
  cin: 'U40100MP2011PTC026570',
  incorporated: 2011,
  stateOfIncorporation: 'Madhya Pradesh',

  offices: [
    {
      id: 'indore',
      label: 'Indore',
      role: 'Registered office',
      /** VERIFIED as published on the legacy site. Note: the MCA record shows a
       *  different landmark and PIN (452001). See TO VERIFY #10. */
      lines: [
        'Plot No. 4/F/53, Scheme No. 78',
        'Opp. Sagar Automobile, A.B. Road',
        'Indore 452008, Madhya Pradesh',
      ],
      verified: true,
    },
  ],

  phones: [
    { label: 'Office', value: '0731-4239605', href: 'tel:+917314239605' },
    { label: 'Mobile', value: '+91 73142 39605', href: 'tel:+917314239605' },
  ],

  emails: [
    { label: 'Enquiries', value: 'services@vedanjay-power.com' },
  ],

  social: [
    { label: 'LinkedIn', href: 'https://in.linkedin.com/company/vedanjay-power-private-limited' },
  ],

  /** VERIFIED as published — legacy about-us.html */
  coreMarkets: ['Madhya Pradesh', 'Maharashtra'],
};

/** Computed at render time. The legacy site hard-codes 2017 — the clearest
 *  signal of abandonment on the whole site. */
export const currentYear = () => new Date().getFullYear();

/** Years since incorporation, computed — never hard-coded. */
export const yearsEstablished = () => currentYear() - company.incorporated;
