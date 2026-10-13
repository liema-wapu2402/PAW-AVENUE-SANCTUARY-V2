import Paw from './Paw';

/** A soft trail of paw prints that "walks" across its parent, one step at a time. */
export default function PawTrail({ count = 10 }) {
  return (
    <div className="paw-trail" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const left = 3 + (i * 94) / count;
        const wobble = i % 2 === 0 ? -6 : 6;
        const top = 72 - (i * 36) / count + wobble;
        return (
          <Paw
            key={i}
            className="paw-step"
            style={{ left: `${left}%`, top: `${top}%`, '--rot': `${58 + (i % 2 ? 12 : -12)}deg`, animationDelay: `${i * 0.6}s` }}
          />
        );
      })}
    </div>
  );
}
