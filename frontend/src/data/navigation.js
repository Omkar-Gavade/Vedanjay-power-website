import { ROUTES } from '../constants/routes.js';
import { services } from './services.js';
import { industries } from './industries.js';

/**
 * Primary navigation: five items plus one distinct action.
 * Below the ~7-item scanning threshold, with deliberate room for Insights and
 * Careers in phase 2 without restructuring. See docs/03-design/navigation.md.
 */
export const primaryNav = [
  {
    id: 'services',
    label: 'Services',
    href: ROUTES.services,
    menu: 'mega',
    children: services.map((s) => ({
      label: s.name,
      descriptor: s.descriptor,
      index: s.index,
      href: `${ROUTES.services}${s.slug}/`,
    })),
  },
  {
    id: 'industries',
    label: 'Industries',
    href: ROUTES.industries,
    menu: 'dropdown',
    children: industries.map((i) => ({
      label: i.name,
      descriptor: i.problem,
      href: `${ROUTES.industries}${i.slug}/`,
    })),
  },
  { id: 'projects', label: 'Projects', href: ROUTES.projects },
  {
    id: 'about',
    label: 'About',
    href: ROUTES.about,
    menu: 'dropdown',
    children: [
      { label: 'Company', descriptor: 'Who we are and how we work', href: ROUTES.about },
      { label: 'Leadership', descriptor: 'The people behind the firm', href: ROUTES.leadership },
      { label: 'Credentials', descriptor: 'Licences, registrations and recognition', href: ROUTES.credentials },
      { label: 'Partners', descriptor: 'Technology cooperation', href: ROUTES.partners },
    ],
  },
  { id: 'contact', label: 'Contact', href: ROUTES.contact },
];

export const footerNav = [
  {
    title: 'Services',
    links: services.map((s) => ({ label: s.name, href: `${ROUTES.services}${s.slug}/` })),
  },
  {
    title: 'Industries',
    links: industries.map((i) => ({ label: i.name, href: `${ROUTES.industries}${i.slug}/` })),
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: ROUTES.about },
      { label: 'Leadership', href: ROUTES.leadership },
      { label: 'Credentials', href: ROUTES.credentials },
      { label: 'Partners', href: ROUTES.partners },
      { label: 'Projects', href: ROUTES.projects },
    ],
  },
];
