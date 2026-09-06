/**
 * PROJECT GALLERY — Vedanjay Power's own site photography.
 *
 * SOURCE: vedanjay-power.com/image-gallery.html, the company's own legacy
 * gallery. Twelve photographs, retrieved 5 September 2026.
 *
 * WHY THIS CHANGES THE PAGE'S PREMISE
 * The gallery previously showed licensed stock and said so in a standing
 * notice, because at the time no photography of Vedanjay's own sites had been
 * supplied. These are that photography: phone-camera pictures taken on site,
 * of switchyard structures, linesmen working at height, piling rigs, solar
 * mounting structures under erection, metering wiring and an earth pit. The
 * stock frames and the notice both go.
 *
 * CAPTIONS DESCRIBE WHAT IS VISIBLE, NOTHING MORE.
 * The legacy page carried no captions, titles, dates, locations or client
 * names — the files are numbered 1 to 12 and that is all. So each caption here
 * describes only what can be seen in the frame. None of them names a project, a
 * client, a site or a year, because the source supports none of that. If the
 * company supplies that detail, it can be added per entry.
 *
 * ORIENTATION is recorded because three of the twelve are portrait. A grid that
 * assumes landscape crops a piling rig down to its wheels.
 *
 * SPAN drives the mosaic, and it is set here rather than computed from the
 * index so the layout is stable and deliberate. Four sizes on a four-column
 * dense grid:
 *   big  2x2   wide 2x1   tall 1x2   unit 1x1
 * The three PORTRAIT frames are the three `tall` ones — a portrait in a wide
 * cell is cropped to a strip. The cells total 24 on a four-column grid, which
 * is six exact rows, so the mosaic closes without a hole to fill.
 */

/** @typedef {{id:string, src:string, alt:string, caption:string, tall:boolean,
 *             span:'big'|'wide'|'tall'|'unit'}} Shot */

/** @type {Shot[]} */
export const shots = [
  {
    id: 'switchyard-metering-structure',
    span: 'big',
    alt: 'Outdoor switching structure carrying isolators, current transformers and lightning arresters inside a fenced yard',
    caption: 'Switching and metering structure, fenced yard',
    tall: false,
  },
  {
    id: 'switching-structure-underside',
    span: 'unit',
    alt: 'Switching structure photographed from below, showing a disconnector, insulator strings and overhead conductors',
    caption: 'Disconnector and insulator strings',
    tall: false,
  },
  {
    id: 'switchyard-perimeter',
    span: 'unit',
    alt: 'Switchyard structure and equipment plinths behind a chain-link perimeter fence',
    caption: 'Switchyard structure and equipment plinths',
    tall: false,
  },
  {
    id: 'foundation-plinths',
    span: 'wide',
    alt: 'Foundation plinths set out across a levelled site with a mast standing behind them',
    caption: 'Foundations set out on a levelled site',
    tall: false,
  },
  {
    id: 'wind-turbine',
    span: 'unit',
    alt: 'Wind turbine nacelle and blades against a clear sky',
    caption: 'Wind turbine',
    tall: false,
  },
  {
    id: 'linesmen-switching-structure',
    span: 'big',
    alt: 'Two linesmen working at height on a switching structure, with rope access and hand lines rigged below',
    caption: 'Working at height on a switching structure',
    tall: false,
  },
  {
    id: 'piling-rig-crew',
    span: 'tall',
    alt: 'Crew operating a truck-mounted drilling rig, dust rising from the bore',
    caption: 'Drilling rig at work',
    tall: true,
  },
  {
    id: 'solar-mounting-structure',
    span: 'tall',
    alt: 'Rows of galvanised module mounting structure under erection across a solar site, with a loader working behind',
    caption: 'Module mounting structure under erection',
    tall: true,
  },
  {
    id: 'ct-pt-marshalling-box',
    span: 'wide',
    alt: 'Terminal block inside a marshalling box with metering cores individually labelled and wired',
    caption: 'Metering cores wired and labelled',
    tall: false,
  },
  {
    id: 'piling-rig-foundation',
    span: 'tall',
    alt: 'Truck-mounted piling rig boring a foundation on open ground',
    caption: 'Boring a foundation',
    tall: true,
  },
  {
    id: 'crew-transformer-bay',
    span: 'wide',
    alt: 'Crew working on a switching structure beside a transformer bay, with hand lines rigged from the frame',
    caption: 'Switching structure beside a transformer bay',
    tall: false,
  },
  {
    id: 'earth-pit-electrode',
    span: 'unit',
    alt: 'Earth electrode in a masonry earth pit with a copper strip bonded to it',
    caption: 'Earth electrode and copper bonding strip',
    tall: false,
  },
].map((s) => ({
  ...s,
  src: `/gallery/${s.id}.jpg`,
  small: `/gallery/sm/${s.id}.jpg`,
}));

