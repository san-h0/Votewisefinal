/**
 * Sanitizes user inputs to defensively protect against XSS injections.
 * Strips dangerous HTML tags, javascript: protocols, and encodes special characters.
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Trim whitespace
  let clean = input.trim();

  // Strip script tags and content
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Strip any remaining HTML tags
  clean = clean.replace(/<[^>]+>/g, '');

  // Strip dangerous javascript: or data: URIs
  clean = clean.replace(/javascript:/gi, '');
  clean = clean.replace(/data:/gi, '');
  clean = clean.replace(/vbscript:/gi, '');

  // Strip dangerous event attributes if entered as text
  clean = clean.replace(/on\w+\s*=/gi, '');

  // Replace special characters with safe representations
  clean = clean
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

  return clean;
}

/**
 * Strips HTML and special characters back to clean searchable text for query filtering
 */
export function normalizeSearchTerm(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  return input
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim();
}
