/** Single source of truth for route paths. No path string literals in components. */
export const ROUTES = {
  home: '/',
  services: '/services/',
  industries: '/industries/',
  projects: '/projects/',
  about: '/about/',
  leadership: '/about/leadership/',
  credentials: '/about/credentials/',
  partners: '/about/partners/',
  contact: '/contact/',
  privacy: '/privacy/',
  terms: '/terms/',
};

/** Contact route with a pre-selected enquiry intent. */
export const enquiryHref = (intent = 'general', service) =>
  `${ROUTES.contact}?intent=${intent}${service ? `&service=${service}` : ''}`;
