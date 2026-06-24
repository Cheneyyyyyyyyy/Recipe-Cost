import Link from "next/link";
import { cn } from "./ui/cn";

/** Luma wordmark: a soft teal "spark" dot + the name. */
export function Logo({
  href = "/",
  className,
  onDark = false,
}: {
  href?: string;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-2", className)}>
      <span className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 shadow-sm">
        <span className="h-2.5 w-2.5 rounded-full bg-white" />
      </span>
      <span className={cn("text-lg font-semibold tracking-tight", onDark ? "text-white" : "text-ink")}>
        Luma
      </span>
    </Link>
  );
}
