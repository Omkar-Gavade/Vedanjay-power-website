import { ROUTES } from '../constants/routes.js';

/**
 * Primary navigation.
 *
 * About Us carries a dropdown. Meet Our Team, Awards and Downloads are built
 * and navigate normally. A child that is not yet built carries `pending: true`
 * and renders as a non-navigating note rather than a dead link.
 */
export const primaryNav = [
  { id: 'home', label: 'Home', href: ROUTES.home },
  {
    id: 'about', label: 'About Us', href: ROUTES.about, menu: 'dropdown',
    children: [
      { label: 'Company Overview', href: ROUTES.about },
      { label: 'Meet Our Team', href: ROUTES.team },
      { label: 'Awards', href: ROUTES.awards },
      { label: 'Partners', href: ROUTES.partners },
      { label: 'Downloads', href: ROUTES.downloads },
    ],
  },
  { id: 'services', label: 'Services', href: ROUTES.services },
  { id: 'industries', label: 'Industries', href: ROUTES.industries },
  {
    id: 'projects', label: 'Projects', href: ROUTES.projects, menu: 'dropdown',
    children: [
      { label: 'Project Register', href: ROUTES.projects },
      { label: 'Image Gallery', href: ROUTES.gallery },
    ],
  },
  { id: 'careers', label: 'Careers', href: ROUTES.careers },
  { id: 'contact', label: 'Contact', href: ROUTES.contact },
];

/** Footer capability links point at the Services route until service pages exist. */
export const footerCapabilities = [
  'Forecasting & Scheduling / QCA',
  'Open Access',
  'ABT Metering & Telemetry',
  'Electrical Infrastructure',
  'Transmission & Grid Connectivity',
  'Grid Studies & Consultancy',
];
