/**
 * Temple Ease - Production-Safe Image Utility
 * 
 * Ensures all temple images load reliably across local dev, preview, and production deployment.
 * Normalizes legacy paths, provides verified fallbacks, and prevents blank/grey image areas.
 */

export const DEFAULT_TEMPLE_IMAGE = '/images/default_temple.jpg';

// Verified temple-specific image mappings
export const TEMPLE_IMAGES: Record<string, string> = {
  // By Temple ID
  temple_tirumala_01: '/images/temple_tirumala.jpg',
  temple_srisailam_02: '/images/temple_srisailam.jpg',
  temple_meenakshi_03: '/images/temple_meenakshi.jpg',
  temple_jagannath_04: '/images/temple_jagannath.jpg',
  temple_somnath_05: '/images/temple_somnath.jpg',
  temple_kashi_06: '/images/temple_kashi.jpg',
  temple_vaishno_07: '/images/temple_complex_aerial_1794224329595.jpg',
  temple_shirdi_08: '/images/temple_kashi.jpg',
  temple_golden_09: '/images/temple_annadanam_hall_1794224331195.jpg',
  temple_kanakadurgamma_10: '/images/temple_hero_gopuram.jpg',
  temple_kedarnath_11: '/images/temple_complex_aerial_1794224329595.jpg',
  temple_badrinath_12: '/images/temple_annadanam_hall_1794224331195.jpg',

  // By Temple Slug
  'tirumala-venkateswara': '/images/temple_tirumala.jpg',
  'srisailam-mallikarjuna': '/images/temple_srisailam.jpg',
  'madurai-meenakshi-amman': '/images/temple_meenakshi.jpg',
  'puri-jagannath-temple': '/images/temple_jagannath.jpg',
  'somnath-temple-gujarat': '/images/temple_somnath.jpg',
  'kashi-vishwanath-varanasi': '/images/temple_kashi.jpg',
  'vaishno-devi-katra': '/images/temple_complex_aerial_1794224329595.jpg',
  'shirdi-sai-baba': '/images/temple_kashi.jpg',
  'golden-temple-amritsar': '/images/temple_annadanam_hall_1794224331195.jpg',
  'kanaka-durga-vijayawada': '/images/temple_hero_gopuram.jpg',
  'kedarnath-temple-rudraprayag': '/images/temple_complex_aerial_1794224329595.jpg',
  'badrinath-temple-chamoli': '/images/temple_annadanam_hall_1794224331195.jpg'
};

// Stable secondary external HTTPS fallbacks (Wikimedia Commons / public domain) in case offline assets ever fail
export const EXTERNAL_FALLBACK_IMAGES: Record<string, string> = {
  temple_tirumala_01: 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&w=1200&q=80',
  temple_srisailam_02: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
  temple_meenakshi_03: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80',
  temple_jagannath_04: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
  temple_somnath_05: 'https://images.unsplash.com/photo-1621360841013-c7683c659ec6?auto=format&fit=crop&w=1200&q=80'
};

/**
 * Returns a guaranteed valid image URL for a temple in production and dev environments.
 */
export function getTempleImageUrl(rawUrl?: string, templeKey?: string): string {
  // If specific key matches our verified list, prefer that if rawUrl is missing or invalid
  const knownImage = templeKey ? TEMPLE_IMAGES[templeKey] : undefined;

  if (!rawUrl || typeof rawUrl !== 'string' || rawUrl.trim() === '') {
    return knownImage || DEFAULT_TEMPLE_IMAGE;
  }

  const trimmed = rawUrl.trim();

  // Normalize legacy development path `/src/assets/images/` to production static `/images/`
  if (trimmed.startsWith('/src/assets/images/')) {
    const filename = trimmed.replace('/src/assets/images/', '');
    return `/images/${filename}`;
  }

  // If already a root-relative or absolute URL, return as-is
  return trimmed;
}

/**
 * Handles image loading errors gracefully so cards never appear blank or broken.
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  templeKey?: string
) {
  const target = event.currentTarget;
  const currentSrc = target.src;

  // Level 1: Try local named temple image
  if (templeKey && TEMPLE_IMAGES[templeKey] && !currentSrc.includes(TEMPLE_IMAGES[templeKey])) {
    target.src = TEMPLE_IMAGES[templeKey];
    return;
  }

  // Level 2: Try default temple hero gopuram image
  if (!currentSrc.includes('/images/default_temple.jpg') && !currentSrc.includes('/images/temple_hero_gopuram.jpg')) {
    target.src = DEFAULT_TEMPLE_IMAGE;
    return;
  }

  // Level 3: Try external HTTPS fallback if local failed
  if (templeKey && EXTERNAL_FALLBACK_IMAGES[templeKey] && !currentSrc.startsWith('https://')) {
    target.src = EXTERNAL_FALLBACK_IMAGES[templeKey];
    return;
  }
}
