import { classNames } from "../lib/classNames";

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const LOW_TIME_SECONDS = 3;
const LOW_TIME_SHARE = 0.3;

interface CountdownRingProps {
  secondsLeft: number;
  totalSeconds: number;
  /** Shown instead of the number before the clock starts. */
  idleLabel: string | null;
}

export function CountdownRing({ secondsLeft, totalSeconds, idleLabel }: CountdownRingProps) {
  const isIdle = idleLabel !== null;
  const elapsedShare = isIdle || totalSeconds === 0 ? 0 : 1 - secondsLeft / totalSeconds;
  const isLow = !isIdle && secondsLeft <= Math.min(LOW_TIME_SECONDS, totalSeconds * LOW_TIME_SHARE);

  return (
    <div className="relative size-[86px] shrink-0 max-[520px]:size-[70px]">
      <svg viewBox="0 0 100 100" aria-hidden="true" className="size-full -rotate-90">
        <circle className="fill-none stroke-surface-2 stroke-8" cx="50" cy="50" r={RADIUS} />
        <circle
          className={classNames(
            "fill-none stroke-8 transition-[stroke] [stroke-linecap:round]",
            isLow ? "stroke-live" : "stroke-accent",
          )}
          cx="50"
          cy="50"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * elapsedShare}
        />
      </svg>
      <span
        className={classNames(
          "absolute inset-0 grid place-items-center font-mono font-bold",
          isIdle ? "text-xs text-ink-soft" : "text-[1.35rem]",
        )}
      >
        {isIdle ? idleLabel : Math.ceil(secondsLeft)}
      </span>
    </div>
  );
}
