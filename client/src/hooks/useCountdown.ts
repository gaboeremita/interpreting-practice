import { useCallback, useEffect, useRef, useState } from "react";

const TICK_MS = 100;

interface Countdown {
  secondsLeft: number;
  totalSeconds: number;
  isRunning: boolean;
  start: (seconds: number) => void;
  stop: () => void;
}

export function useCountdown(onExpire: () => void): Countdown {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalId = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  const stop = useCallback(() => {
    clearInterval(intervalId.current);
    intervalId.current = undefined;
    setIsRunning(false);
  }, []);

  const start = useCallback(
    (seconds: number) => {
      clearInterval(intervalId.current);
      const endsAt = Date.now() + seconds * 1000;
      setTotalSeconds(seconds);
      setSecondsLeft(seconds);
      setIsRunning(true);

      intervalId.current = setInterval(() => {
        const left = Math.max(0, (endsAt - Date.now()) / 1000);
        setSecondsLeft(left);
        if (left <= 0) {
          stop();
          onExpireRef.current();
        }
      }, TICK_MS);
    },
    [stop],
  );

  useEffect(() => () => clearInterval(intervalId.current), []);

  return { secondsLeft, totalSeconds, isRunning, start, stop };
}
