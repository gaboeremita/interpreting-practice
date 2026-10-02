import type { ButtonHTMLAttributes } from "react";
import { classNames } from "../../lib/classNames";

type Variant = "default" | "primary" | "got" | "close" | "miss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "md" | "lg";
  /** Outlines the button, e.g. the app's suggested grade. */
  highlighted?: boolean;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  default: "border-line bg-surface",
  primary: "border-accent bg-accent text-accent-ink",
  got: "border-transparent bg-good-bg text-good",
  close: "border-transparent bg-warn-bg text-warn",
  miss: "border-transparent bg-bad-bg text-bad",
};

export function Button({
  variant = "default",
  size = "md",
  highlighted = false,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={classNames(
        "rounded-lg border font-bold disabled:cursor-not-allowed disabled:opacity-50",
        size === "lg" ? "px-6 py-3.5 text-lg" : "px-4 py-2.5",
        VARIANT_CLASSES[variant],
        highlighted && "outline-3 outline-offset-1 outline-current",
        className,
      )}
      {...props}
    />
  );
}
