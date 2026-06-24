import { forwardRef } from "react";
import { cn } from "./cn";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, children, ...props },
  ref
) {
  return (
    <select
      ref={ref}
      className={cn(
        "h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-ink shadow-sm transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500",
        "disabled:cursor-not-allowed disabled:bg-slate-50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});
