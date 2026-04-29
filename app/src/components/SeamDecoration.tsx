import { useState, useEffect, useMemo } from 'react';

/* ─────────────────────────────────────────────────────────────
   Sewing button SVG element
   ───────────────────────────────────────────────────────────── */
function Button({ x, y, r = 15, rot = 0 }: { x: number; y: number; r?: number; rot?: number }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`} opacity="0.48">
      {/* shadow */}
      <circle cx="1" cy="1.5" r={r + 1} fill="rgba(0,0,0,0.07)" />
      {/* body */}
      <circle r={r} fill="white" stroke="#FF6B35" strokeWidth="2" />
      {/* inner dashed groove */}
      <circle r={r - 4} fill="none" stroke="#FF6B35" strokeWidth="0.7" strokeDasharray="2.5 2" opacity="0.5" />
      {/* 4 holes */}
      {[[-4, -4], [4, -4], [-4, 4], [4, 4]].map(([hx, hy], i) => (
        <circle key={i} cx={hx} cy={hy} r={2.2} fill="#FF6B35" />
      ))}
      {/* cross thread */}
      <line x1="-4" y1="-4" x2="4" y2="4" stroke="#FF6B35" strokeWidth="0.9" />
      <line x1="4" y1="-4" x2="-4" y2="4" stroke="#FF6B35" strokeWidth="0.9" />
    </g>
  );
}

/* ─────────────────────────────────────────────────────────────
   Sewing needle SVG element
   ───────────────────────────────────────────────────────────── */
function Needle({ x, y, angle = 20 }: { x: number; y: number; angle?: number }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${angle})`} opacity="0.55">
      {/* shaft */}
      <path
        d="M 0 -65 C 2.4 -60, 2.8 -30, 2.4 0 C 2.0 12, 1.0 18, 0 20
           C -1.0 18, -2.0 12, -2.4 0 C -2.8 -30, -2.4 -60, 0 -65 Z"
        fill="#FF6B35"
      />
      {/* highlight */}
      <path
        d="M 0 -63 C 0.9 -55, 1.1 -30, 0.9 0 C 0.6 10, 0.2 16, 0 20"
        stroke="rgba(255,255,255,0.38)"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
      {/* eye hole */}
      <ellipse cx="0" cy="-55" rx="1.2" ry="3.5" fill="rgba(0,0,0,0.22)" />
      {/* thread tail out of eye */}
      <line x1="0" y1="-58" x2="-6" y2="-76"
        stroke="#FF6B35" strokeWidth="1.3" strokeDasharray="3 4"
        strokeLinecap="round" opacity="0.65" />
    </g>
  );
}

/* ─────────────────────────────────────────────────────────────
   Kitten mascot (based on KISU logo cat, playing with buttons)
   ───────────────────────────────────────────────────────────── */
function Kitten({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`} opacity="0.60">
      {/* ground shadow */}
      <ellipse cx="10" cy="82" rx="52" ry="9" fill="rgba(0,0,0,0.07)" />

      {/* tail (behind body) */}
      <path
        d="M 34 48 C 65 52, 78 68, 62 80 C 48 90, 28 82, 30 70"
        stroke="#F07020" strokeWidth="11" fill="none" strokeLinecap="round"
      />
      <path
        d="M 34 48 C 65 52, 78 68, 62 80 C 48 90, 28 82, 30 70"
        stroke="#FFBE80" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.45"
      />

      {/* body */}
      <ellipse cx="5" cy="50" rx="34" ry="36" fill="#F07020" />
      {/* belly */}
      <ellipse cx="5" cy="54" rx="19" ry="24" fill="#FFBE80" />

      {/* left ear */}
      <polygon points="-26,-42 -40,-68 -10,-38" fill="#F07020" />
      <polygon points="-23,-43 -34,-62 -12,-40" fill="#FFB0B0" />

      {/* right ear */}
      <polygon points="30,-38 44,-64 16,-36" fill="#F07020" />
      <polygon points="27,-39 38,-58 18,-38" fill="#FFB0B0" />

      {/* head */}
      <circle cx="5" cy="-6" r="36" fill="#F07020" />

      {/* forehead stripes */}
      <path d="M -8 -40 Q -4 -33 2 -30" stroke="#C05010" strokeWidth="1.8" fill="none" opacity="0.55" />
      <path d="M 2 -42 Q 2 -35 2 -30"   stroke="#C05010" strokeWidth="1.8" fill="none" opacity="0.55" />
      <path d="M 12 -40 Q 8 -33 2 -30"  stroke="#C05010" strokeWidth="1.8" fill="none" opacity="0.55" />

      {/* white eye areas */}
      <circle cx="-10" cy="-10" r="11" fill="white" />
      <circle cx="18"  cy="-10" r="11" fill="white" />

      {/* pupils — looking slightly downward (at the button) */}
      <circle cx="-9"  cy="-7" r="7" fill="#222" />
      <circle cx="19"  cy="-7" r="7" fill="#222" />

      {/* eye shine */}
      <circle cx="-6"  cy="-11" r="3" fill="white" />
      <circle cx="22"  cy="-11" r="3" fill="white" />

      {/* nose */}
      <polygon points="4,5 0,10 8,10" fill="#FF88AA" />

      {/* mouth */}
      <path d="M -4 11 Q 4 16 12 11" stroke="#BB4466" strokeWidth="1.4" fill="none" />

      {/* whiskers left */}
      <line x1="-30" y1="2"  x2="-2" y2="4"  stroke="#aaa" strokeWidth="1" opacity="0.55" />
      <line x1="-30" y1="8"  x2="-2" y2="7"  stroke="#aaa" strokeWidth="1" opacity="0.55" />
      <line x1="-28" y1="14" x2="-2" y2="10" stroke="#aaa" strokeWidth="1" opacity="0.55" />

      {/* whiskers right */}
      <line x1="10" y1="4"  x2="38" y2="2"  stroke="#aaa" strokeWidth="1" opacity="0.55" />
      <line x1="10" y1="7"  x2="38" y2="8"  stroke="#aaa" strokeWidth="1" opacity="0.55" />
      <line x1="10" y1="10" x2="36" y2="14" stroke="#aaa" strokeWidth="1" opacity="0.55" />

      {/* right paw (sitting) */}
      <ellipse cx="30" cy="80" rx="13" ry="9" fill="#F07020" />
      <ellipse cx="24" cy="79" rx="5" ry="4" fill="#F07020" />
      <ellipse cx="30" cy="82" rx="5" ry="4" fill="#F07020" />
      <ellipse cx="36" cy="80" rx="5" ry="4" fill="#F07020" />

      {/* left arm reaching out to bat at the button */}
      <path
        d="M -22 40 C -45 44, -65 54, -72 66"
        stroke="#F07020" strokeWidth="12" fill="none" strokeLinecap="round"
      />
      {/* paw tip */}
      <circle cx="-72" cy="66" r="10" fill="#F07020" />
      <ellipse cx="-80" cy="62" rx="6" ry="4" fill="#F07020" />
      <ellipse cx="-82" cy="68" rx="6" ry="4" fill="#F07020" />
      <ellipse cx="-77" cy="74" rx="6" ry="4" fill="#F07020" />

      {/* tiny button the kitten is batting — just below the paw */}
      <g transform="translate(-76, 84)">
        <circle r="10" fill="white" stroke="#FF6B35" strokeWidth="1.6" />
        <circle r="7"  fill="none" stroke="#FF6B35" strokeWidth="0.5" strokeDasharray="1.5 1.5" opacity="0.5" />
        <circle cx="-2.5" cy="-2.5" r="1.5" fill="#FF6B35" />
        <circle cx="2.5"  cy="-2.5" r="1.5" fill="#FF6B35" />
        <circle cx="-2.5" cy="2.5"  r="1.5" fill="#FF6B35" />
        <circle cx="2.5"  cy="2.5"  r="1.5" fill="#FF6B35" />
        <line x1="-2.5" y1="-2.5" x2="2.5"  y2="2.5"  stroke="#FF6B35" strokeWidth="0.7" />
        <line x1="2.5"  y1="-2.5" x2="-2.5" y2="2.5"  stroke="#FF6B35" strokeWidth="0.7" />
      </g>
    </g>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main component
   ───────────────────────────────────────────────────────────── */
export default function SeamDecoration() {
  const [vw, setVw] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { threadPath, btnList, needleX, needleY, kittenX, kittenY } = useMemo(() => {
    const W = vw;
    const R = Math.round(W * 0.90);   // right peak
    const L = Math.round(W * 0.08);   // left peak
    const E = Math.round(W * 0.13);   // bezier overshoot

    // Wide S-curves sweeping across the full page.
    // Hero ends ~750px, so seam starts at y=820.
    // Each wave roughly corresponds to one section (~700-800px).
    const threadPath = [
      `M ${R} 820`,
      `C ${R+E} 970,  ${L-E} 1120, ${L} 1310`,   // → left  (About — behind factory image)
      `C ${L-E} 1500, ${R+E} 1780, ${R} 1960`,   // → right (Assortment — behind product image)
      `C ${R+E} 2140, ${L-E} 2400, ${L} 2580`,   // → left  (Retail)
      `C ${L-E} 2760, ${R+E} 3060, ${R} 3240`,   // → right (Technology)
      `C ${R+E} 3420, ${L-E} 3720, ${L} 3920`,   // → left  (Quality)
      `C ${L-E} 4120, ${R+E} 4400, ${R} 4600`,   // → right (Cooperation)
      `C ${R+E} 4800, ${L-E} 5150, ${L} 5360`,   // → left  (Lookbook)
      `C ${L-E} 5560, ${R+E} 5860, ${R} 6060`,   // → right (CTA/Contacts)
      `C ${R+E} 6260, ${W*0.6} 6480, ${W*0.5} 6680`, // → center (kitten)
    ].join(' ');

    // Buttons at the peaks of each swing
    const btnList = [
      { x: R,        y: 900,  r: 14, rot: 10  },
      { x: L,        y: 1310, r: 16, rot: -15 },
      { x: R,        y: 1960, r: 13, rot: 25  },
      { x: L,        y: 2580, r: 15, rot: -8  },
      { x: R,        y: 3240, r: 14, rot: 18  },
      { x: L,        y: 3920, r: 16, rot: -20 },
      { x: R,        y: 4600, r: 13, rot: 12  },
    ];

    const needleX = Math.round(W * 0.52);
    const needleY = 6580;
    const kittenX = Math.round(W * 0.50) - 10;
    const kittenY = 6700;

    return { threadPath, btnList, needleX, needleY, kittenX, kittenY };
  }, [vw]);

  const H = 9200;

  return (
    <div
      aria-hidden="true"
      className="absolute top-0 left-0 pointer-events-none hidden md:block"
      style={{ width: vw, height: H, zIndex: 3 }}
    >
      <svg width={vw} height={H} xmlns="http://www.w3.org/2000/svg">

        {/* ── Thread seam ── */}
        <path
          d={threadPath}
          stroke="#FF6B35"
          strokeWidth="2.2"
          strokeDasharray="9 7"
          strokeLinecap="round"
          fill="none"
          opacity="0.42"
        />

        {/* ── Buttons ── */}
        {btnList.map((b, i) => (
          <Button key={i} x={b.x} y={b.y} r={b.r} rot={b.rot} />
        ))}

        {/* ── Needle (just before kitten) ── */}
        <Needle x={needleX} y={needleY} angle={-25} />

        {/* ── Kitten mascot ── */}
        <Kitten x={kittenX} y={kittenY} />

      </svg>
    </div>
  );
}
