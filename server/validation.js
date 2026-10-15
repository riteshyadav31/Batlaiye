export const MAX_MESSAGE_LENGTH = 1000;
const PREFERENCES = new Set(['anyone', 'men', 'women', 'nonbinary']);
const GENDERS = new Set(['male', 'female', 'nonbinary']);
const CONTROL_CHARS = /[\u0000-\u001f\u007f-\u009f]/;

export function validProfile(value) {
  if (!value || typeof value !== 'object') return null;
  const nickname = typeof value.nickname === 'string' ? value.nickname.trim() : '';
  if (nickname.length < 2 || nickname.length > 24 || !/^[\p{L}\p{N} _.-]+$/u.test(nickname) || CONTROL_CHARS.test(nickname)) return null;
  if (!GENDERS.has(value.gender) || !PREFERENCES.has(value.preference)) return null;
  if (value.adult !== true || value.terms !== true || value.guidelines !== true) return null;
  return { nickname, gender: value.gender, preference: value.preference };
}

export function validMessage(value) {
  if (typeof value !== 'string') return null;
  const message = value.trim();
  if (!message || message.length > MAX_MESSAGE_LENGTH || CONTROL_CHARS.test(message)) return null;
  return message;
}

export function compatible(a, b) {
  const allows = (preference, gender) => preference === 'anyone' ||
    (preference === 'men' && gender === 'male') ||
    (preference === 'women' && gender === 'female') ||
    (preference === 'nonbinary' && gender === 'nonbinary');
  return allows(a.preference, b.gender) && allows(b.preference, a.gender);
}

export function validReport(value) {
  const reasons = new Set(['Sexual content or nudity', 'Harassment or bullying', 'Hate speech', 'Threats or violence', 'Suspected minor', 'Spam or scams', 'Other']);
  if (!value || typeof value !== 'object' || !reasons.has(value.reason)) return null;
  const details = typeof value.details === 'string' ? value.details.trim() : '';
  if (details.length > 300 || CONTROL_CHARS.test(details)) return null;
  return { reason: value.reason, details };
}

const OBVIOUS_PROHIBITED = [
  /\b(?:send|show|share)\s+(?:me\s+)?(?:nudes?|naked pics?|explicit pics?)\b/i,
  /\b(?:child porn|underage sex|rape threats?)\b/i,
];
export function prohibitedMessage(message) { return OBVIOUS_PROHIBITED.some((pattern) => pattern.test(message)); }
