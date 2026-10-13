import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hero animals.
 *
 * 1. If VITE_SPLINE_SCENE is set, the published Spline scene is loaded (lazily, so the heavy
 *    runtime never ships to visitors unless it is used).
 * 2. Otherwise - or while Spline loads / if it fails - a built-in, depth-layered 3D-style scene runs:
 *    three stacked layers tilt in perspective with the pointer, the dog and cat are rigged
 *    (wagging tail, panting tongue, flicking ears, blinking eyes whose pupils follow the cursor)
 *    and tapping an animal makes it talk and sends hearts floating up.
 */

const SPLINE_SCENE = import.meta.env.VITE_SPLINE_SCENE;
const Spline = SPLINE_SCENE ? lazy(() => import('@splinetool/react-spline')) : null;

class Boundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

const HEART = 'M0 7 C-10 -2 -9 -12 0 -8 C9 -12 10 -2 0 7Z';

function SceneBack() {
  return (
    <svg viewBox="0 0 560 520" className="stage-svg" aria-hidden="true">
      <defs>
        <radialGradient id="st-sun" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fff6c2" />
          <stop offset=".55" stopColor="#ffd34d" />
          <stop offset="1" stopColor="#ffa21f" />
        </radialGradient>
        <linearGradient id="st-heart" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff3d6" />
          <stop offset="1" stopColor="#ffd9a0" />
        </linearGradient>
        <linearGradient id="st-hill1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c4581a" />
          <stop offset="1" stopColor="#8a3a10" />
        </linearGradient>
        <linearGradient id="st-hill2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7a3a14" />
          <stop offset="1" stopColor="#4a2410" />
        </linearGradient>
      </defs>

      <g className="st-rays" style={{ transformOrigin: '280px 235px' }}>
        {Array.from({ length: 14 }, (_, i) => (
          <path key={i} d="M280 235 L262 20 L298 20Z" fill="#fff3c4" opacity=".1" transform={`rotate(${(i * 360) / 14} 280 235)`} />
        ))}
      </g>
      <circle className="st-halo" cx="280" cy="235" r="196" fill="#ffe58a" opacity=".28" />
      <circle cx="280" cy="235" r="168" fill="url(#st-sun)" />
      <path
        className="st-heart"
        d="M280 438 C96 322 70 168 178 132 C232 114 268 140 280 170 C292 140 328 114 382 132 C490 168 464 322 280 438Z"
        fill="none" stroke="url(#st-heart)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" pathLength="1"
      />
      <ellipse cx="280" cy="470" rx="236" ry="46" fill="url(#st-hill2)" />
      <ellipse cx="280" cy="462" rx="224" ry="38" fill="url(#st-hill1)" />
      <ellipse cx="280" cy="456" rx="190" ry="24" fill="#d8742a" opacity=".55" />
    </svg>
  );
}

function Eye({ cx, cy, r = 9, slit = false, color = '#2a1709', iris }) {
  return (
    <g className="st-eye" style={{ transformOrigin: `${cx}px ${cy}px` }}>
      {iris && <ellipse cx={cx} cy={cy} rx={r + 3} ry={r + 5} fill={iris} />}
      <g className="st-pupil">
        <ellipse cx={cx} cy={cy} rx={slit ? r * 0.38 : r} ry={slit ? r + 4 : r + 1.500} fill={color} />
        <circle cx={cx + r * 0.35} cy={cy - r * 0.45} r={r * 0.34} fill="#fff" />
      </g>
    </g>
  );
}

function SceneAnimals({ say, onTap }) {
  return (
    <svg viewBox="0 0 560 520" className="stage-svg" role="img" aria-label="An animated rescue dog and cat sitting together">
      <defs>
        <linearGradient id="st-dog" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#efb56c" />
          <stop offset="1" stopColor="#d58f45" />
        </linearGradient>
      </defs>

      {/* ground shadows */}
      <ellipse cx="228" cy="462" rx="104" ry="14" fill="#2a1306" opacity=".35" />
      <ellipse cx="404" cy="462" rx="66" ry="11" fill="#2a1306" opacity=".35" />

      {/* ---------------- CAT (puspin) ---------------- */}
      <g className="st-cat" onPointerDown={() => onTap('cat')} style={{ cursor: 'pointer' }}>
        <path className="st-cat-tail" d="M440 452 C500 450 516 392 486 372 C474 364 462 372 470 384 C482 400 470 428 436 432Z" fill="#2b2220" style={{ transformOrigin: '440px 440px' }} />
        <g className="st-breathe" style={{ transformOrigin: '404px 462px' }}>
          <path d="M350 462 C340 400 364 366 404 366 C444 366 468 400 458 462Z" fill="#2b2220" />
          <path d="M388 462 C384 424 392 396 404 392 C416 396 424 424 420 462Z" fill="#fff8ee" />
          <ellipse cx="386" cy="458" rx="15" ry="9" fill="#fff8ee" />
          <ellipse cx="422" cy="458" rx="15" ry="9" fill="#fff8ee" />
        </g>
        <g className="st-head-cat" style={{ transformOrigin: '404px 372px' }}>
          <g className="st-ear-l" style={{ transformOrigin: '372px 316px' }}>
            <path d="M360 332 L358 282 L398 312Z" fill="#2b2220" />
            <path d="M367 322 L366 296 L386 311Z" fill="#f2a79c" />
          </g>
          <g className="st-ear-r" style={{ transformOrigin: '436px 316px' }}>
            <path d="M448 332 L450 282 L410 312Z" fill="#2b2220" />
            <path d="M441 322 L442 296 L422 311Z" fill="#f2a79c" />
          </g>
          <ellipse cx="404" cy="346" rx="52" ry="44" fill="#2b2220" />
          <path d="M404 304 C396 322 394 336 384 352 C392 380 416 380 424 352 C414 336 412 322 404 304Z" fill="#fff8ee" />
          <Eye cx={384} cy={344} r={6.500} slit iris="#f3b92f" color="#150d09" />
          <Eye cx={424} cy={344} r={6.500} slit iris="#f3b92f" color="#150d09" />
          <path d="M399 358 L409 358 L404 365Z" fill="#ef8f8f" />
          <path d="M404 365 Q398 373 391 369 M404 365 Q410 373 417 369" stroke="#7a3a2a" strokeWidth="2.400" fill="none" strokeLinecap="round" />
          <g stroke="#fff8ee" strokeWidth="1.600" strokeLinecap="round" opacity=".9">
            <path d="M386 362 L354 356 M386 367 L356 372 M422 362 L454 356 M422 367 L452 372" />
          </g>
        </g>
      </g>

      {/* ---------------- DOG (aspin) ---------------- */}
      <g className="st-dog" onPointerDown={() => onTap('dog')} style={{ cursor: 'pointer' }}>
        <path className="st-dog-tail" d="M318 440 C360 434 372 394 358 370 C352 360 340 366 344 378 C352 398 340 420 312 424Z" fill="#d58f45" style={{ transformOrigin: '316px 432px' }} />
        <g className="st-breathe" style={{ transformOrigin: '228px 462px' }}>
          <path d="M142 462 C128 396 160 336 228 336 C296 336 330 396 314 462Z" fill="url(#st-dog)" />
          <path d="M196 462 C190 412 204 372 228 366 C252 372 266 412 260 462Z" fill="#f8e2b8" />
          <rect x="176" y="414" width="30" height="50" rx="15" fill="#e3a05a" />
          <rect x="250" y="414" width="30" height="50" rx="15" fill="#e3a05a" />
          <ellipse cx="191" cy="462" rx="21" ry="10" fill="#f8e2b8" />
          <ellipse cx="265" cy="462" rx="21" ry="10" fill="#f8e2b8" />
        </g>
        <g className="st-head-dog" style={{ transformOrigin: '228px 338px' }}>
          <path d="M182 238 C140 234 128 296 150 336 C162 348 180 332 184 304Z" fill="#8c5428" className="st-dear-l" style={{ transformOrigin: '182px 244px' }} />
          <path d="M274 238 C316 234 328 296 306 336 C294 348 276 332 272 304Z" fill="#8c5428" className="st-dear-r" style={{ transformOrigin: '274px 244px' }} />
          <ellipse cx="228" cy="288" rx="68" ry="64" fill="url(#st-dog)" />
          <path d="M228 226 C252 226 276 238 280 262 C262 258 240 248 228 226Z" fill="#c47a35" />
          <ellipse cx="228" cy="314" rx="40" ry="32" fill="#f8e2b8" />
          <Eye cx={202} cy={276} r={9} />
          <Eye cx={254} cy={276} r={9} />
          <path d="M190 258 Q202 250 214 257 M242 257 Q254 250 266 258" stroke="#a96a2e" strokeWidth="4.500" fill="none" strokeLinecap="round" />
          <ellipse cx="228" cy="300" rx="14" ry="10" fill="#2a1709" />
          <ellipse cx="223" cy="297" rx="4.500" ry="2.600" fill="#fff" opacity=".55" />
          <path d="M228 309 L228 321 M228 321 Q214 335 200 321 M228 321 Q242 335 256 321" stroke="#2a1709" strokeWidth="3.200" fill="none" strokeLinecap="round" />
          <g className="st-tongue" style={{ transformOrigin: '228px 328px' }}>
            <path d="M216 328 C216 354 240 354 240 328Z" fill="#f2697d" />
            <path d="M228 330 L228 342" stroke="#d94a60" strokeWidth="2.400" strokeLinecap="round" />
          </g>
        </g>
        {/* collar sits on top of the head/body seam */}
        <path d="M184 346 Q228 372 272 346" stroke="#c2452a" strokeWidth="11" fill="none" strokeLinecap="round" />
        <circle cx="236" cy="365" r="9" fill="#ffc83d" stroke="#d6980f" strokeWidth="2.500" />
      </g>

      {/* speech bubble */}
      {say && (
        <g key={say.id} className="st-say" style={{ transformOrigin: `${say.x}px ${say.y}px` }}>
          <path d={`M${say.x - 46} ${say.y - 26} h92 a14 14 0 0 1 14 14 v14 a14 14 0 0 1 -14 14 h-58 l-14 14 l-4 -14 h-16 a14 14 0 0 1 -14 -14 v-14 a14 14 0 0 1 14 -14z`} fill="#fff7ea" stroke="#5a3318" strokeWidth="3" />
          <text x={say.x} y={say.y + 2} textAnchor="middle" fontFamily="var(--font-head)" fontWeight="800" fontSize="22" fill="#5a3318">{say.text}</text>
        </g>
      )}
    </svg>
  );
}

function SceneFront({ hearts }) {
  return (
    <svg viewBox="0 0 560 520" className="stage-svg" aria-hidden="true">
      {/* drifting paws + sparkles in the foreground */}
      {[[60, 330, 0, 18], [500, 250, 1.200, 14], [96, 130, 2.400, 12], [470, 90, 3.400, 16]].map(([x, y, d, s], i) => (
        <g key={i} className="st-float" style={{ animationDelay: `${d}s` }}>
          <g transform={`translate(${x} ${y}) scale(${s / 32})`} fill="#fff3d6" opacity=".9">
            <ellipse cx="16" cy="21" rx="7.500" ry="6.200" />
            <ellipse cx="6.800" cy="14" rx="3.100" ry="4.200" transform="rotate(-22 6.800 14)" />
            <ellipse cx="13" cy="7.800" rx="3" ry="4.100" />
            <ellipse cx="19" cy="7.800" rx="3" ry="4.100" />
            <ellipse cx="25.200" cy="14" rx="3.100" ry="4.200" transform="rotate(22 25.200 14)" />
          </g>
        </g>
      ))}
      {/* ambient hearts */}
      {[[250, 230, 0], [386, 250, 2.600]].map(([x, y, d], i) => (
        <path key={i} className="st-heart-up" d={HEART} transform={`translate(${x} ${y}) scale(1.600)`} fill="#e8502e" style={{ animationDelay: `${d}s` }} />
      ))}
      {/* hearts from taps */}
      {hearts.map((h) => (
        <path key={h.id} className="st-heart-pop" d={HEART} transform={`translate(${h.x} ${h.y}) scale(${h.s})`} fill={h.c} style={{ '--dx': `${h.dx}px` }} />
      ))}
    </svg>
  );
}

function Scene() {
  const wrap = useRef(null);
  const [say, setSay] = useState(null);
  const [hearts, setHearts] = useState([]);
  const idRef = useRef(0);
  const timers = useRef({});

  // pointer -> CSS variables (read by the CSS tilt, parallax and pupil tracking)
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.setProperty('--px', cx.toFixed(3));
      el.style.setProperty('--py', cy.toFixed(3));
      raf = requestAnimationFrame(loop);
    };
    const move = (e) => {
      const r = el.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
      ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
    };
    const reset = () => { tx = 0; ty = 0; };
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', reset);
    document.addEventListener('visibilitychange', onVis);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', reset);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  const tap = useCallback((who) => {
    const id = ++idRef.current;
    const dog = who === 'dog';
    setSay({ id, who, text: dog ? 'Woof!' : 'Meow~', x: dog ? 228 : 404, y: dog ? 196 : 262 });
    const baseX = dog ? 228 : 404;
    const burst = Array.from({ length: 6 }, (_, i) => ({
      id: `${id}-${i}`,
      x: baseX + (Math.random() - 0.5) * 70,
      y: (dog ? 250 : 300) + Math.random() * 20,
      s: 1.200 + Math.random() * 1.100,
      dx: Math.round((Math.random() - 0.5) * 90),
      c: ['#e8502e', '#ff8a2a', '#ffc83d', '#fff3d6'][i % 4],
    }));
    setHearts((h) => [...h.slice(-12), ...burst]);
    const t = timers.current;
    clearTimeout(t.say); clearTimeout(t.hearts); clearTimeout(t.wag);
    t.say = setTimeout(() => setSay(null), 1500);
    t.hearts = setTimeout(() => setHearts([]), 2200);
    // tails go wild for a moment after a pet
    wrap.current?.classList.add('is-excited');
    t.wag = setTimeout(() => wrap.current?.classList.remove('is-excited'), 1800);
  }, []);

  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), []);

  return (
    <div className="stage-3d" ref={wrap}>
      <div className="stage-layer stage-layer-back"><SceneBack /></div>
      <div className="stage-layer stage-layer-mid"><SceneAnimals say={say} onTap={tap} /></div>
      <div className="stage-layer stage-layer-front"><SceneFront hearts={hearts} /></div>
    </div>
  );
}

export default function AnimalStage() {
  const [splineReady, setSplineReady] = useState(false);
  const builtIn = <Scene />;

  return (
    <div className="stage" aria-live="off">
      <div className="stage-glow" aria-hidden="true" />
      {Spline ? (
        <Boundary fallback={builtIn}>
          <div className={`stage-spline ${splineReady ? 'is-ready' : ''}`}>
            <Suspense fallback={null}>
              <Spline scene={SPLINE_SCENE} onLoad={() => setSplineReady(true)} />
            </Suspense>
          </div>
          {!splineReady && builtIn}
        </Boundary>
      ) : (
        builtIn
      )}
    </div>
  );
}
