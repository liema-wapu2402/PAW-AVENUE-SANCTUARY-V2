/**
 * Paw Avenue Sanctuary icon set.
 * Duotone style: a warm sunset-gradient shape + a rounded brown line detail.
 * <IconDefs /> must be rendered once (SiteLayout does it) so every icon can share the gradients.
 */

export function IconDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="pa-sun" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd24d" />
          <stop offset=".55" stopColor="#ffa21f" />
          <stop offset="1" stopColor="#ee6a17" />
        </linearGradient>
        <linearGradient id="pa-cream" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff3d6" />
          <stop offset="1" stopColor="#ffd9a0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const F = 'url(#pa-sun)'; // main gradient fill

const PATHS = {
  // ---- "why choose us" / services ----
  care: (
    <>
      <path d="M9 5v8.500a7 7 0 0 0 14 0V5" fill="none" stroke="currentColor" strokeWidth="2.200" strokeLinecap="round" />
      <path d="M16 20.500V23a5 5 0 0 0 10 0v-3" fill="none" stroke="currentColor" strokeWidth="2.200" strokeLinecap="round" />
      <circle cx="26" cy="17.500" r="3.600" fill={F} stroke="currentColor" strokeWidth="2" />
      <circle cx="9" cy="5" r="1.600" fill="currentColor" />
      <circle cx="23" cy="5" r="1.600" fill="currentColor" />
    </>
  ),
  chat: (
    <>
      <path d="M5 9.500A4.500 4.500 0 0 1 9.500 5h13A4.500 4.500 0 0 1 27 9.500v8a4.500 4.500 0 0 1-4.500 4.500H14l-5.500 5v-5A4.500 4.500 0 0 1 5 17.500z" fill={F} />
      <g fill="#fff"><circle cx="11" cy="13.500" r="1.700" /><circle cx="16" cy="13.500" r="1.700" /><circle cx="21" cy="13.500" r="1.700" /></g>
    </>
  ),
  siren: (
    <>
      <path d="M8 22v-6a8 8 0 0 1 16 0v6z" fill={F} />
      <rect x="5.500" y="22" width="21" height="4.500" rx="2.200" fill="none" stroke="currentColor" strokeWidth="2.200" />
      <path d="M16 4v2.500M5.500 8.500l2 1.800M26.500 8.500l-2 1.800" stroke="currentColor" strokeWidth="2.200" strokeLinecap="round" fill="none" />
      <path d="M12.500 16a3.500 3.500 0 0 1 3.500-3.500" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
    </>
  ),
  shield: (
    <>
      <path d="M16 4l10 3.500v7.500c0 6.200-4.200 10.500-10 13-5.800-2.500-10-6.800-10-13V7.500z" fill={F} />
      <path d="M16 11v9M11.500 15.500h9" stroke="#fff" strokeWidth="2.800" strokeLinecap="round" />
    </>
  ),
  heart: (
    <path d="M16 27C8 21.500 4.500 17.200 4.500 12.300A6.300 6.300 0 0 1 16 8.800a6.300 6.300 0 0 1 11.500 3.500C27.500 17.200 24 21.500 16 27z" fill={F} />
  ),
  paw: (
    <g fill={F}>
      <ellipse cx="16" cy="21" rx="7.500" ry="6.200" />
      <ellipse cx="6.800" cy="14" rx="3.100" ry="4.200" transform="rotate(-22 6.800 14)" />
      <ellipse cx="13" cy="7.800" rx="3" ry="4.100" />
      <ellipse cx="19" cy="7.800" rx="3" ry="4.100" />
      <ellipse cx="25.200" cy="14" rx="3.100" ry="4.200" transform="rotate(22 25.200 14)" />
    </g>
  ),
  dog: (
    <>
      <path d="M8.500 9C5 9 3.500 13 4.500 18c.5 2.200 2.500 2.800 3.800 1.400.9-1 1.200-3 1.200-5.800z" fill="currentColor" opacity=".85" />
      <path d="M23.500 9C27 9 28.500 13 27.500 18c-.5 2.200-2.500 2.800-3.800 1.400-.9-1-1.200-3-1.200-5.800z" fill="currentColor" opacity=".85" />
      <ellipse cx="16" cy="15.500" rx="8.500" ry="9" fill={F} />
      <ellipse cx="16" cy="19.500" rx="4.800" ry="4" fill="#fff3d6" />
      <circle cx="12.500" cy="14" r="1.400" fill="currentColor" /><circle cx="19.500" cy="14" r="1.400" fill="currentColor" />
      <ellipse cx="16" cy="17.800" rx="2" ry="1.400" fill="currentColor" />
    </>
  ),
  cat: (
    <>
      <path d="M5.500 4.500l7 4.500h7l7-4.500v12H5.500z" fill={F} />
      <ellipse cx="16" cy="18" rx="10.500" ry="8.800" fill={F} />
      <path d="M7.500 8l3.500 2.500M24.500 8L21 10.500" stroke="#fff3d6" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="11.800" cy="17" rx="1.500" ry="2" fill="currentColor" /><ellipse cx="20.200" cy="17" rx="1.500" ry="2" fill="currentColor" />
      <path d="M14.500 20.500h3L16 22z" fill="currentColor" />
      <path d="M3.500 19l5 .8M3.500 22.500l5-1M28.500 19l-5 .8M28.500 22.500l-5-1" stroke="currentColor" strokeWidth="1.200" strokeLinecap="round" />
    </>
  ),
  leash: (
    <>
      <circle cx="9.500" cy="9.500" r="5.500" fill="none" stroke="currentColor" strokeWidth="2.400" />
      <path d="M13.500 13.500c4 4 4 7 8.500 8" fill="none" stroke="currentColor" strokeWidth="2.400" strokeLinecap="round" />
      <circle cx="24" cy="22.500" r="4.200" fill={F} stroke="currentColor" strokeWidth="2" />
    </>
  ),
  home: (
    <>
      <path d="M4.500 15L16 5l11.500 10v11a1.500 1.500 0 0 1-1.500 1.500H6A1.500 1.500 0 0 1 4.500 26z" fill={F} />
      <path d="M16 23.500c-3.200-2.300-4.800-4-4.800-5.800a2.600 2.600 0 0 1 4.800-1.400 2.600 2.600 0 0 1 4.800 1.400c0 1.800-1.600 3.500-4.800 5.800z" fill="#fff" />
    </>
  ),
  bubbles: (
    <>
      <circle cx="12" cy="19" r="8" fill={F} />
      <circle cx="23" cy="9" r="4.200" fill="none" stroke="currentColor" strokeWidth="2.200" />
      <circle cx="25" cy="22.500" r="2.400" fill="currentColor" />
      <path d="M8.500 17a4 4 0 0 1 3-3" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
    </>
  ),
  ball: (
    <>
      <circle cx="16" cy="16" r="11.500" fill={F} />
      <path d="M6.500 9.500c5 1 8 5 8 11.500M25.500 22.500c-5-1-8-5-8-11.500" stroke="#fff" strokeWidth="2.200" strokeLinecap="round" fill="none" />
      <circle cx="16" cy="16" r="11.500" fill="none" stroke="currentColor" strokeWidth="2" />
    </>
  ),
  bone: (
    <>
      <path d="M9.500 5.500a3.500 3.500 0 0 0-3.300 4.700 3.500 3.500 0 1 0 4.800 4.800L17 21l-2 2a3.500 3.500 0 1 0 4.700 4.800 3.500 3.500 0 0 0 4.800-4.800 3.500 3.500 0 1 0-4.800-4.800l-6.300-6.300a3.500 3.500 0 0 0-3.900-5.200z" transform="translate(-1 -1)" fill={F} stroke="currentColor" strokeWidth="1.800" strokeLinejoin="round" />
    </>
  ),
  // ---- contact ----
  pin: (
    <>
      <path d="M16 28.500S6 19.700 6 12.500a10 10 0 0 1 20 0c0 7.200-10 16-10 16z" fill={F} />
      <circle cx="16" cy="12.500" r="3.800" fill="#fff" />
    </>
  ),
  phone: (
    <path d="M9.500 4.500h3.200l2 5-2.500 1.800a15 15 0 0 0 7 7l1.800-2.500 5 2v3.200a2.800 2.800 0 0 1-3 2.800C13 23 7 15.500 6.700 7.500a2.800 2.800 0 0 1 2.800-3z" fill={F} />
  ),
  mail: (
    <>
      <rect x="4" y="7" width="24" height="18" rx="4" fill={F} />
      <path d="M6.500 10.500L16 18l9.500-7.500" stroke="#fff" strokeWidth="2.200" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  globe: (
    <>
      <circle cx="16" cy="16" r="11.500" fill={F} />
      <path d="M4.500 16h23M16 4.500c4 3.500 4 19.500 0 23M16 4.500c-4 3.500-4 19.500 0 23" stroke="#fff" strokeWidth="1.800" fill="none" />
    </>
  ),
  calendar: (
    <>
      <rect x="4.500" y="7" width="23" height="20" rx="4.500" fill={F} />
      <path d="M10.500 4v6M21.500 4v6" stroke="currentColor" strokeWidth="2.400" strokeLinecap="round" />
      <path d="M4.500 13.500h23" stroke="#fff" strokeWidth="2" />
    </>
  ),
  star: (
    <path d="M16 4.500l3.400 7 7.600 1.100-5.500 5.400 1.300 7.600L16 22l-6.800 3.600 1.300-7.600L5 12.600l7.600-1.100z" fill={F} stroke="currentColor" strokeWidth="1.400" strokeLinejoin="round" />
  ),
  // ---- UI ----
  arrow: <path d="M6 16h19M18 8.500L25.500 16 18 23.500" fill="none" stroke="currentColor" strokeWidth="2.800" strokeLinecap="round" strokeLinejoin="round" />,
  check: <path d="M7 16.500l6 6L25 10" fill="none" stroke="currentColor" strokeWidth="3.200" strokeLinecap="round" strokeLinejoin="round" />,
  plus: <path d="M16 6v20M6 16h20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />,
  // ---- social ----
  facebook: <path d="M18.500 27V17.500h3.200l.6-3.700h-3.800v-2.300c0-1.100.5-2 2.100-2h1.800V6.300c-.4 0-1.600-.2-3-.2-3 0-4.900 1.800-4.900 5.100v2.600H11.500v3.700h3V27z" fill="currentColor" />,
  instagram: (
    <>
      <rect x="5.500" y="5.500" width="21" height="21" rx="6.500" fill="none" stroke="currentColor" strokeWidth="2.400" />
      <circle cx="16" cy="16" r="4.800" fill="none" stroke="currentColor" strokeWidth="2.400" />
      <circle cx="22" cy="10" r="1.500" fill="currentColor" />
    </>
  ),
  x: <path d="M7 7l18 18M25 7L7 25" fill="none" stroke="currentColor" strokeWidth="2.800" strokeLinecap="round" />,
};

export default function Icon({ name, size, className = '', title }) {
  const body = PATHS[name] || PATHS.paw;
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={`icon icon-${name} ${className}`}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : 'true'}
      aria-label={title}
      focusable="false"
    >
      {body}
    </svg>
  );
}

/** Rounded tile that frames an icon. */
export function IconBadge({ name, size = 'md', className = '' }) {
  return (
    <span className={`icon-badge icon-badge-${size} ${className}`}>
      <Icon name={name} />
    </span>
  );
}

/** Service titles come from the database with an emoji; map them to our icon set. */
export function serviceIcon(title = '') {
  const t = title.toLowerCase();
  if (t.includes('walk')) return 'leash';
  if (t.includes('daycare') || t.includes('boarding') || t.includes('sitting')) return 'home';
  if (t.includes('groom') || t.includes('spa')) return 'bubbles';
  if (t.includes('train')) return 'ball';
  if (t.includes('vet') || t.includes('check')) return 'care';
  if (t.includes('product') || t.includes('shop') || t.includes('food')) return 'bone';
  return 'paw';
}
