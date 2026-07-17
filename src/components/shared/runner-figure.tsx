import { cn } from "@/lib/utils";

/** Two-frame stick-figure sprinter; frames alternate via CSS (globals.css). */
export function RunnerFigure({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-9 sm:size-10", className)}
      aria-hidden
    >
      {/* Frame A — full stride */}
      <g className="runner-frame-a">
        <circle cx={14.5} cy={4} r={2} fill="currentColor" stroke="none" />
        <path d="M13.8 6.5 11.5 12" />
        <path d="M13.2 7.5 16.5 9.5 19 8" />
        <path d="M13.2 7.5 10 9 8.5 7" />
        <path d="M11.5 12 15 14 16.5 18.5" />
        <path d="M11.5 12 8 14.5 4.5 14" />
      </g>
      {/* Frame B — legs passing, knee high */}
      <g className="runner-frame-b">
        <circle cx={14} cy={4.5} r={2} fill="currentColor" stroke="none" />
        <path d="M13.4 7 11.8 12.5" />
        <path d="M12.9 8 15.5 10.5 14.5 12.5" />
        <path d="M12.9 8 10.5 10 11.5 12" />
        <path d="M11.8 12.5 14.5 14.5 13.5 19" />
        <path d="M11.8 12.5 9.5 15.5 10.5 19.5" />
      </g>
    </svg>
  );
}
