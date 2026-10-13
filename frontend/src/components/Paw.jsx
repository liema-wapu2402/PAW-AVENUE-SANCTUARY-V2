export default function Paw({ className = '', style }) {
  return (
    <svg viewBox="0 0 64 64" className={`paw ${className}`} style={style} aria-hidden="true" fill="currentColor">
      <ellipse cx="32" cy="42" rx="14" ry="12" />
      <ellipse cx="13" cy="27" rx="6" ry="8" transform="rotate(-22 13 27)" />
      <ellipse cx="26" cy="14" rx="6" ry="8" />
      <ellipse cx="38" cy="14" rx="6" ry="8" />
      <ellipse cx="51" cy="27" rx="6" ry="8" transform="rotate(22 51 27)" />
    </svg>
  );
}
