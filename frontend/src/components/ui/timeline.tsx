import * as React from "react";
import { cn } from "@/lib/utils";

const Timeline = React.forwardRef<
  HTMLOListElement,
  React.OlHTMLAttributes<HTMLOListElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Central vertical line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-600 transform -translate-x-1/2" />

      <ol ref={ref} className={cn("relative space-y-16", className)} {...props}>
        {children}
      </ol>
    </div>
  );
});
Timeline.displayName = "Timeline";

interface TimelineItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  side?: "home" | "away"; // which side to render
  icon?: React.ReactNode; // event icon (goal, card, etc.)
  time?: string; // elapsed time
}

const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>(
  ({ className, side = "home", icon, time, children, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={cn("relative min-h-[60px] flex items-center", className)}
        {...props}
      >
        {/* Center column (icon + time) */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center z-10">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
            {icon}
          </div>
          {time && (
            <span className="mt-1 text-[10px] ml-5 text-primary font-medium">
              {time}
            </span>
          )}
        </div>

        {/* Content for home team */}
        {side === "home" && (
          <div className="absolute right-1/2 pr-10 text-right max-w-xs">
            {children}
          </div>
        )}

        {/* Content for away team */}
        {side === "away" && (
          <div className="absolute left-1/2 pl-10 text-left max-w-xs">
            {children}
          </div>
        )}
      </li>
    );
  }
);
TimelineItem.displayName = "TimelineItem";

export { Timeline, TimelineItem };
