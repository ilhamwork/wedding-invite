// Original, hand-authored SVG line-art ornaments — eucalyptus sprigs and
// brush-stroke dividers. No third-party template assets are used anywhere
// in this project; every ornament here is original vector artwork.

export function CornerSprig({ className = '', flip = false }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 4 C 30 10, 46 26, 52 52"
        stroke="var(--color-rust)"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {[
        [10, 8, 22, 2],
        [18, 16, 32, 12],
        [27, 25, 42, 22],
        [36, 34, 50, 34],
      ].map(([x1, y1, x2, y2], i) => (
        <ellipse
          key={i}
          cx={(x1 + x2) / 2}
          cy={(y1 + y2) / 2}
          rx="7"
          ry="3.4"
          transform={`rotate(${35 + i * 6} ${(x1 + x2) / 2} ${(y1 + y2) / 2})`}
          stroke="var(--color-sage)"
          strokeWidth="1"
        />
      ))}
      <circle cx="52" cy="52" r="1.6" fill="var(--color-rust)" />
    </svg>
  )
}

export function BrushDivider({ className = '' }) {
  return (
    <svg viewBox="0 0 240 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M2 12 C 40 4, 70 20, 110 12 S 180 4, 238 12"
        stroke="var(--color-rust)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="120" cy="11" r="2.5" fill="var(--color-rust)" />
      <ellipse cx="107" cy="6" rx="5" ry="2.2" transform="rotate(-20 107 6)" stroke="var(--color-sage)" strokeWidth="1" />
      <ellipse cx="133" cy="6" rx="5" ry="2.2" transform="rotate(20 133 6)" stroke="var(--color-sage)" strokeWidth="1" />
    </svg>
  )
}

export function LeafMonogram({ className = '' }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden="true">
      <circle cx="50" cy="50" r="46" stroke="var(--color-rust)" strokeWidth="1" />
      <path
        d="M50 20 C 60 32, 60 68, 50 80 C 40 68, 40 32, 50 20 Z"
        stroke="var(--color-sage)"
        strokeWidth="1.1"
      />
      <path d="M50 22 L50 78" stroke="var(--color-sage)" strokeWidth="0.7" />
    </svg>
  )
}

export function FloatingLeaf({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 40 40" className={className} style={style} fill="none" aria-hidden="true">
      <ellipse
        cx="20"
        cy="20"
        rx="14"
        ry="6"
        transform="rotate(35 20 20)"
        stroke="var(--color-sage)"
        strokeWidth="1"
        fillOpacity="0.06"
        fill="var(--color-sage)"
      />
      <path d="M8 14 L32 26" stroke="var(--color-sage)" strokeWidth="0.6" transform="rotate(35 20 20)" />
    </svg>
  )
}
