/**
 * AWARDS & RECOGNITION.
 *
 * EVERY entry below was verified by opening its certificate or plaque image and
 * reading it, on 4 September 2026. Titles, organisations, categories, dates and
 * venues are transcribed from that evidence — not from the legacy page's
 * summary text, which was wrong in at least one place (see `solarroofs-2019`).
 *
 * DELIBERATELY NOT PUBLISHED:
 *
 * - "Crossed the target of selling 100 MW power in MP & MH". Its only legacy
 *   image is a GENERIC STOCK TROPHY, and the underlying figure conflicts across
 *   the legacy site (100 MW vs 110 MW). A business milestone with a disputed
 *   number and no evidence is not a recognition.
 *
 * - A separate "Certificate of Excellence" entry. The legacy page listed it
 *   apart from the CEO Magazine award, but the certificate image proves they
 *   are the SAME award — the certificate simply IS the CEO Magazine one.
 *
 * All recognitions are 2016–2019; nothing later is published anywhere. The page
 * therefore presents them as a dated record rather than a live claim.
 */

/** @typedef {{id:string, year:number, date:string|null, title:string, organisation:string,
 *             category:string|null, result:string, venue:string|null, image:string,
 *             alt:string, individual:string|null}} Award */

/** @type {Award[]} Newest first. */
export const awards = [
  {
    id: 'solarroofs-2019',
    year: 2019,
    date: '12 April 2019',
    title: 'SolarRoofs Series Excellence Awards',
    organisation: 'SolarQuarter · FirstVIEW Media Network',
    category: 'Solar Rooftop Consulting Company of the Year 2018-19',
    /* The certificate reads "Awarded Winner Of". An internal note had recorded
       this as runner-up; the certificate is the primary evidence. */
    result: 'Winner',
    venue: 'SolarRoofs Maharashtra Edition',
    image: '/awards/solarroofs-2019.jpg',
    alt: 'Framed SolarRoofs Series Excellence Awards certificate naming Vedanjay Power Private Limited as winner, Solar Rooftop Consulting Company of the Year 2018-19',
    individual: null,
  },
  {
    id: 're-assets-2019',
    year: 2019,
    date: null,
    title: 'RE Assets Excellence Awards 2019',
    organisation: 'SolarQuarter · WindInsiders',
    category: 'Technical O&M Service Provider of the Year — Rooftop Solar',
    result: 'Gold Award Winner',
    venue: null,
    image: '/awards/re-assets-2019.jpg',
    alt: 'RE Assets Excellence Awards 2019 gold plaque presented to Vedanjay Power Private Limited, Technical O&M Service Provider of the Year for Rooftop Solar',
    individual: null,
  },
  {
    id: 'ceo-magazine-2018',
    year: 2018,
    date: 'July 2018',
    title: '25 Fastest Growing Consultants in India — 2018',
    organisation: 'The CEO Magazine',
    category: null,
    result: 'Certificate of Excellence',
    venue: 'New Delhi',
    image: '/awards/ceo-magazine-2018.jpg',
    alt: 'The CEO Magazine Certificate of Excellence issued to Vedanjay Power Pvt. Ltd. under 25 Fastest Growing Consultants in India 2018',
    individual: null,
  },
  {
    id: 're-assets-2018',
    year: 2018,
    date: '1–2 February 2018',
    title: 'RE Assets India 2018',
    organisation: 'SolarQuarter · Wind Insider',
    category: 'Technical O&M Service Provider of the Year — Rooftop Solar Energy',
    result: 'Gold Award Winner, Rising Star category',
    venue: 'New Delhi',
    image: '/awards/re-assets-2018.jpg',
    alt: 'RE Assets India 2018 gold plaque presented to Vedanjay Power Private Limited in the Rising Star category',
    individual: null,
  },
  {
    id: 'solarquarter-40under40',
    year: 2018,
    date: null,
    title: 'India’s 40 Most Promising Young Business Leaders in the Solar Industry',
    organisation: 'SolarQuarter',
    category: 'Top Entrepreneur',
    result: 'Listed',
    venue: null,
    image: '/awards/solarquarter-40under40.jpg',
    alt: 'SolarQuarter 40 Under 40 listing featuring Gajanan Yadav, Managing Director, Vedanjay Power Pvt Ltd',
    individual: 'Mr. Gajanan Yadav, Managing Director',
  },
  {
    id: 'solarquarter-women-leaders',
    year: 2018,
    date: null,
    title: 'Women Leaders in Solar Sector',
    organisation: 'SolarQuarter',
    category: null,
    result: 'Listed',
    venue: null,
    image: '/awards/solarquarter-women-leaders.jpg',
    alt: 'SolarQuarter Women Leaders in Solar Sector listing featuring Mrs. Anjali Gajanan Yadav, Director, Vedanjay Power Private Limited',
    /* The listing itself spells the name "Anjali Gajanan Yadav"; the current
       company document gives "Anjaly Yadav". Quoted here as printed. */
    individual: 'Mrs. Anjali Gajanan Yadav, Director',
  },
  {
    id: 'consultants-review-2017',
    year: 2017,
    date: null,
    title: '10 Most Promising Solar Energy Consultants — 2017',
    organisation: 'Consultants Review',
    category: null,
    result: 'Listed',
    venue: null,
    image: '/awards/consultants-review-2017.jpg',
    alt: 'Consultants Review certificate recognising Vedanjay Power among 10 Most Promising Solar Energy Consultants 2017',
    individual: null,
  },
  {
    id: 'india-solar-week-2016',
    year: 2016,
    date: '2–3 June 2016',
    title: 'India Solar Week 2016',
    organisation: 'SolarQuarter · FirstVIEW',
    category: 'Solar Business Consulting Company of the Year',
    result: 'Runner-up',
    venue: 'New Delhi',
    image: '/awards/india-solar-week-2016.jpg',
    alt: 'India Solar Week 2016 plaque naming Vedanjay Power Private Limited runner-up, Solar Business Consulting Company of the Year',
    individual: null,
  },
];

/** Distinct years, newest first — drives the chronological grouping. */
export const awardYears = [...new Set(awards.map((a) => a.year))].sort((a, b) => b - a);
