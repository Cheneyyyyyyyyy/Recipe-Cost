import { forwardRef } from "react";
import { cn } from "./cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-lg border bg-white px-3 text-sm text-ink shadow-sm transition-colors",
        "placeholder:text-slate-400",
        "focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500",
        "disabled:cursor-not-allowed disabled:bg-slate-50",
        invalid ? "border-red-400 focus:ring-red-500/30 focus:border-red-500" : "border-slate-300",
        className
      )}
      {...props}
    />
  );
});
