/**
 * DOWNLOADS / RESOURCE LIBRARY.
 *
 * Every entry below is a PDF this site SERVES, from /public/downloads. There
 * are no outbound placeholders: if a document is listed, the file is here, and
 * the byte count is its real size on disk (frontend/test/downloads.test.js
 * fails the build if either stops being true).
 *
 * WHY THAT IS WORTH SAYING.
 * The legacy downloads page carried 22 entries. Fifteen pointed at
 * mahadiscom.in and every one of them returns HTTP 503; a sixteenth, the MP
 * rooftop policy, 404s on the legacy server itself. Re-checked 5 September
 * 2026: nothing has come back. Two of the dead entries were not clean downloads
 * in any case — a .rar archive and a .shtm web page.
 *
 * An earlier pass here replaced those with links to the regulators' own index
 * pages. That was worse than it looked: it handed a reader a homepage to search
 * instead of the document they asked for. So the documents were tracked down
 * individually at the issuing Commission and are now republished as files.
 *
 * WHAT THAT RECOVERED, beyond the legacy list:
 * - The whole MERC open-access set — both principal regulations, all three
 *   amendments and both practice directions — replacing the 503s.
 * - The MERC rooftop and net-metering set, which is not the 2015 net-metering
 *   regulations the legacy page listed: those were superseded by the Grid
 *   Interactive Rooftop RE Regulations, 2019, and re-publishing the repealed
 *   text would have been actively misleading. The current chain is listed
 *   instead, down to the June 2026 practice direction.
 * - The MERC Forecasting & Scheduling regulations, procedure and commercial
 *   notification. Maharashtra is the company's principal regulated market and
 *   the 2018 regulations are the ones its QCA work is performed under; the
 *   legacy page never carried them at all.
 *
 * TITLES AND DATES were read out of each PDF, not inferred from its filename.
 *
 * THE COMPANY PROFILE IS DELIBERATELY ABSENT.
 * VPPL_PROFILE.PDF still resolves on the legacy domain, but its contact block
 * is entirely superseded: Indore PIN 452008 (now 452010), a Pune address at
 * "Asawari, Nanded City" (now Grand Horizon, Sinhagad Road), phone numbers
 * 09049063366 / 9981500612 (now 7666901814), email services@vedanjay.com (now
 * projects@vedanjay-power.com) and the domain vedanjaypower.co.in. Not one
 * current detail. Publishing it would send prospects to dead contacts.
 */

/** @typedef {{id:string, title:string, description:string, href:string,
 *             bytes:number, issuer:string, date:string}} Resource */

/** @typedef {{id:string, title:string, blurb:string, items:Resource[]}} ResourceGroup */

/* A "Company resources / in preparation" group used to sit here with an empty
   item list and five pending titles. It rendered as a dashed box telling every
   visitor which documents the company had not produced yet — build-status
   commentary on a live page. When there is a company profile to publish it can
   be added as a group with real files in it. */

/** @type {ResourceGroup[]} */
export const resourceGroups = [
  {
    id: 'fs-maharashtra',
    title: 'Forecasting & scheduling — Maharashtra',
    blurb: 'The framework our QCA work in the state is performed under: the regulations, the amendment in force, the MSLDC procedure and the notification that started commercial settlement.',
    items: [
      {
        id: 'merc-fs-2018',
        title: 'MERC (Forecasting, Scheduling and Deviation Settlement for Solar and Wind Generation) Regulations, 2018',
        description: 'The principal Maharashtra regulations governing forecasting, scheduling and deviation settlement for solar and wind generators, as notified in the state gazette.',
        href: '/downloads/merc-fs-regulations-2018.pdf',
        bytes: 342269,
        issuer: 'MERC',
        date: '20 July 2018',
      },
      {
        id: 'merc-fs-amendment-2024',
        title: 'MERC (Forecasting, Scheduling and Deviation Settlement for Solar and Wind Generation) (First Amendment) Regulations, 2024',
        description: 'The first amendment to the 2018 regulations. Read with the principal regulations above, this is the text currently in force.',
        href: '/downloads/merc-fs-amendment-regulations.pdf',
        bytes: 5762782,
        issuer: 'MERC',
        date: '2024',
      },
      {
        id: 'merc-fs-procedure-2019',
        title: 'Amended Procedure for Forecasting, Scheduling and Deviation Settlement of Solar and Wind Generation',
        description: 'The operating procedure prepared by the Maharashtra State Load Despatch Centre and approved by the Commission — schedule submission, revision windows and settlement mechanics.',
        href: '/downloads/merc-fs-procedure-amended-2019.pdf',
        bytes: 1000768,
        issuer: 'MSLDC · approved by MERC',
        date: '19 December 2019',
      },
      {
        id: 'merc-fs-commercial-2019',
        title: 'Notification of effective date for commercial settlement under the F&S Regulations, 2018',
        description: 'The Commission’s notification fixing the date from which the commercial arrangement under the 2018 regulations takes effect.',
        href: '/downloads/merc-fs-commercial-settlement-2019.pdf',
        bytes: 266500,
        issuer: 'MERC',
        date: '18 March 2019',
      },
    ],
  },
  {
    id: 'fs-other',
    title: 'Forecasting & scheduling — central and other states',
    blurb: 'The central framework and the state regulations that shape forecasting, scheduling and deviation settlement elsewhere in our operating area.',
    items: [
      {
        id: 'cerc-fs-2017',
        title: 'CERC (Deviation Settlement Mechanism and related matters) — forecasting and scheduling of wind and solar',
        description: 'Central Electricity Regulatory Commission regulations for forecasting, scheduling and deviation settlement of wind and solar generation.',
        href: '/downloads/cerc-forecasting-scheduling-2017.pdf',
        bytes: 964153,
        issuer: 'CERC',
        date: '3 March 2017',
      },
      {
        id: 'rerc-fs',
        title: 'RERC Forecasting & Scheduling Regulations — Rajasthan',
        description: 'Rajasthan Electricity Regulatory Commission regulations for forecasting and scheduling of renewable generation.',
        href: '/downloads/rerc-forecasting-scheduling-regulations.pdf',
        bytes: 531288,
        issuer: 'RERC',
        date: 'Rajasthan',
      },
      {
        id: 'rerc-order-418',
        title: 'RERC Order 418 — forecasting and scheduling',
        description: 'Commission order supplementing the Rajasthan forecasting and scheduling framework.',
        href: '/downloads/rerc-order-418-2017.pdf',
        bytes: 347109,
        issuer: 'RERC',
        date: '2017',
      },
      {
        id: 'kerc-fs-2015',
        title: 'KERC Forecasting & Scheduling Regulations — Karnataka',
        description: 'Karnataka Electricity Regulatory Commission forecasting and scheduling regulations.',
        href: '/downloads/kerc-forecasting-scheduling-regulations-2015.pdf',
        bytes: 3978402,
        issuer: 'KERC',
        date: '2015',
      },
      {
        id: 'mp-model-dsm',
        title: 'Model DSM Regulations — Madhya Pradesh',
        description: 'Model deviation settlement mechanism regulations for the state of Madhya Pradesh, where we hold SLDC registration.',
        href: '/downloads/mp-model-dsm-regulations.pdf',
        bytes: 340094,
        issuer: 'Madhya Pradesh',
        date: 'Madhya Pradesh',
      },
    ],
  },
  {
    id: 'open-access-mh',
    title: 'Open access — Maharashtra',
    blurb: 'The complete MERC open-access framework — distribution and transmission, every amendment, and both practice directions. These are the documents the legacy site linked to before the DISCOM’s file server went down.',
    items: [
      {
        id: 'merc-doa-2016',
        title: 'MERC (Distribution Open Access) Regulations, 2016',
        description: 'The principal distribution open-access regulations, as notified in the state gazette.',
        href: '/downloads/merc-distribution-open-access-regulations-2016.pdf',
        bytes: 989581,
        issuer: 'MERC',
        date: '30 March 2016',
      },
      {
        id: 'merc-doa-amend-1',
        title: 'MERC (Distribution Open Access) (First Amendment) Regulations, 2019',
        description: 'First amendment to the 2016 distribution open-access regulations.',
        href: '/downloads/merc-doa-first-amendment-2019.pdf',
        bytes: 203935,
        issuer: 'MERC',
        date: '2019',
      },
      {
        id: 'merc-doa-amend-2',
        title: 'MERC (Distribution Open Access) (Second Amendment) Regulations, 2023',
        description: 'Second amendment, read with the 2016 principal regulations and the 2019 first amendment.',
        href: '/downloads/merc-doa-second-amendment-2023.pdf',
        bytes: 321758,
        issuer: 'MERC',
        date: '2023',
      },
      {
        id: 'merc-toa-2016',
        title: 'MERC (Transmission Open Access) Regulations, 2016',
        description: 'The principal transmission open-access regulations governing long-, medium- and short-term access to the state transmission system.',
        href: '/downloads/merc-transmission-open-access-regulations-2016.pdf',
        bytes: 1017751,
        issuer: 'MERC',
        date: '2016',
      },
      {
        id: 'merc-toa-amend-1',
        title: 'MERC (Transmission Open Access) (First Amendment) Regulations, 2019',
        description: 'First amendment to the 2016 transmission open-access regulations.',
        href: '/downloads/merc-toa-first-amendment-2019.pdf',
        bytes: 476879,
        issuer: 'MERC',
        date: '2019',
      },
      {
        id: 'merc-oa-pd-2016',
        title: 'Practice Directions — open access',
        description: 'Commission practice directions issued under the distribution and transmission open-access regulations, 2016.',
        href: '/downloads/merc-open-access-practice-direction-2016.pdf',
        bytes: 88830,
        issuer: 'MERC',
        date: '19 October 2016',
      },
      {
        id: 'merc-oa-pd-2017',
        title: 'Practice Directions — open access (short-term)',
        description: 'Further practice directions under the 2016 open-access regulations, covering short-term open access.',
        href: '/downloads/merc-open-access-practice-direction-2017.pdf',
        bytes: 372655,
        issuer: 'MERC',
        date: '8 March 2017',
      },
    ],
  },
  {
    id: 'rooftop-mh',
    title: 'Rooftop solar & net metering — Maharashtra',
    blurb: 'The current chain, not the repealed one. The 2015 net-metering regulations the legacy site listed were superseded by the 2019 rooftop regulations; what follows is the text in force and every amendment since.',
    items: [
      {
        id: 'merc-rre-2019',
        title: 'MERC (Grid Interactive Rooftop Renewable Energy Generating Systems) Regulations, 2019',
        description: 'The principal rooftop regulations, which replaced the MERC net-metering regulations of 2015. Net metering, gross metering and behind-the-meter arrangements.',
        href: '/downloads/merc-rooftop-rre-regulations-2019.pdf',
        bytes: 287675,
        issuer: 'MERC',
        date: '30 December 2019',
      },
      {
        id: 'merc-rre-amend-1',
        title: 'First Amendment to the MERC (Grid Interactive Rooftop Renewable Energy Generating Systems) Regulations',
        description: 'First amendment to the 2019 principal regulations, aligning them with the Electricity (Rights of Consumers) Rules, 2020 and the 2021 amendment rules.',
        href: '/downloads/merc-rooftop-rre-first-amendment-2023.pdf',
        bytes: 471907,
        issuer: 'MERC',
        date: '2023',
      },
      {
        id: 'merc-rre-2024',
        title: 'Amendment to the Grid Interactive Rooftop RE Regulations',
        description: 'Further amendment to the principal regulations, including revised annexures and the technical requirements in Part B.',
        href: '/downloads/merc-rooftop-rre-regulations-2024.pdf',
        bytes: 687745,
        issuer: 'MERC',
        date: '29 August 2024',
      },
      {
        id: 'merc-nm-waiver-2026',
        title: 'Practice Direction — waiving the separate net-metering agreement',
        description: 'Practice direction under Regulation 17 of the 2019 regulations, waiving the requirement for a separate physical net-metering agreement.',
        href: '/downloads/merc-net-metering-agreement-waiver-2026.pdf',
        bytes: 201829,
        issuer: 'MERC',
        date: '30 June 2026',
      },
    ],
  },
];

/** Every document, flattened — used for counts and for the tests. */
export const allResources = resourceGroups.flatMap((g) => g.items);

/** 964153 → "941 KB". Uses the real byte count, so nothing is estimated. */
export function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

/** Shown on the page so the limits of a republished set are visible. */
export const downloadsNote =
  'These are third-party regulatory documents, republished here for reference '
  + 'and served from this site. Each was retrieved from the issuing Commission '
  + 'on 5 September 2026 — always check the Commission for the current version '
  + 'before relying on it.';
