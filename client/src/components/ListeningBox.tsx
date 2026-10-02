import { classNames } from "../lib/classNames";

interface ListeningBoxProps {
  isListening: boolean;
  finalText: string;
  interimText: string;
  placeholder: string;
}

/** Live view of what the microphone is hearing. */
export function ListeningBox({ isListening, finalText, interimText, placeholder }: ListeningBoxProps) {
  const hasText = Boolean(finalText || interimText);

  return (
    <div className="flex min-h-[2.6em] items-start gap-2.5 rounded-lg border border-line bg-canvas px-3 py-2.5">
      <span
        className={classNames(
          "mt-[7px] size-2.5 shrink-0 rounded-full",
          isListening ? "animate-pulse bg-live motion-reduce:animate-none" : "bg-line",
        )}
      />
      <span className={classNames("min-w-0 wrap-anywhere", !hasText && "text-sm text-ink-soft")}>
        {hasText ? (
          <>
            {finalText} <span className="text-ink-soft">{interimText}</span>
          </>
        ) : (
          placeholder
        )}
      </span>
    </div>
  );
}
