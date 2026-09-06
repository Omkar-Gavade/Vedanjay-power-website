/** Line icons at a consistent 20px / 1.5 stroke. No icon dependency added. */
const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true };
const stroke = { stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };

export const PhoneIcon = () => (
  <svg {...base}><path {...stroke} d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5L17 13l4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 3.5 5.2 2 2 0 0 1 5.5 3h1Z" /></svg>
);
export const WhatsAppIcon = () => (
  <svg {...base}><path {...stroke} d="M3.5 20.5 5 16.4A8.2 8.2 0 1 1 8 19.3l-4.5 1.2Z" /><path {...stroke} d="M9 9.2c.3 2.2 2.6 4.5 4.8 4.8l1-1.3 2 .9v1.4c-.2.6-.8 1-1.5.9A8 8 0 0 1 8.3 9.2c-.1-.7.3-1.3.9-1.5h1.4l.9 2-1.5 1Z" /></svg>
);
export const MailIcon = () => (
  <svg {...base}><rect {...stroke} x="2.75" y="5" width="18.5" height="14" rx="2" /><path {...stroke} d="m3.5 6.5 8.5 6 8.5-6" /></svg>
);
export const PinIcon = () => (
  <svg {...base}><path {...stroke} d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" /><circle {...stroke} cx="12" cy="10" r="2.6" /></svg>
);
export const ClockIcon = () => (
  <svg {...base}><circle {...stroke} cx="12" cy="12" r="8.5" /><path {...stroke} d="M12 7.5V12l3 1.8" /></svg>
);
export const LinkedInIcon = () => (
  <svg {...base}><rect {...stroke} x="3.25" y="3.25" width="17.5" height="17.5" rx="2.5" /><path {...stroke} d="M7.5 10.5V17M7.5 7.6v.01M11.5 17v-3.6a2 2 0 0 1 4 0V17" /></svg>
);
export const ExternalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path {...stroke} d="M14 4h6v6M20 4l-8.5 8.5M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
  </svg>
);
