/**
 * Request validation for the enquiry endpoint.
 *
 * This module also validated the chat endpoint, where its job was to stop the
 * client influencing the prompt or the model. That endpoint is gone — the
 * assistant is client-side now — so only the enquiry rules remain.
 */

export const LIMITS = {
  BODY_BYTES: 16 * 1024,
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** @returns {{ok:true, data:object} | {ok:false, fields:Record<string,string>}} */
export function validateEnquiry(raw) {
  /** @type {Record<string,string>} */
  const fields = {};
  const str = (v) => (typeof v === 'string' ? v.trim() : '');

  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, fields: { form: 'Invalid request.' } };
  }

  const name = str(raw.name);
  const email = str(raw.email);
  const message = str(raw.message);
  const phone = str(raw.phone);

  if (name.length < 2 || name.length > 100) fields.name = 'Please enter your name.';
  if (!email || email.length > 254 || !EMAIL.test(email)) fields.email = 'Please enter a valid email address.';
  if (message.length < 10 || message.length > 2000) fields.message = 'Please describe what you need (at least 10 characters).';
  if (phone && phone.length > 20) fields.phone = 'That phone number looks too long.';

  if (Object.keys(fields).length) return { ok: false, fields };

  return {
    ok: true,
    data: {
      name, email, message,
      phone: phone || null,
      source: raw.source === 'chat' ? 'chat' : 'contact-form',
    },
  };
}
