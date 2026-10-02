import { useEffect, useRef } from "react";

/** Listens to document keydowns, always calling the latest handler without re-subscribing. */
export function useKeydown(handler: (event: KeyboardEvent) => void): void {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => handlerRef.current(event);
    document.addEventListener("keydown", listener);

    return () => document.removeEventListener("keydown", listener);
  }, []);
}

export function isTypingInField(): boolean {
  const tag = document.activeElement?.tagName;

  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}
