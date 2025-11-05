import React from "react";

type StarIconProps = {
  size?: number | string;
  filled?: boolean;
  strokeWidth?: number;
  className?: string;
  title?: string;
  onClick?: React.MouseEventHandler<SVGSVGElement>;
};

/**
 * StarIcon - reusable star SVG
 * - Uses currentColor so you can color it with CSS / Tailwind (e.g. "text-yellow-400")
 * - Use `filled` to get a solid star, omit it for outline
 */
export default function StarIcon({
  size = 24,
  filled = false,
  strokeWidth = 1.5,
  className,
  title,
  onClick,
}: StarIconProps) {
  const ariaHidden = title ? undefined : true;
  const numericSize = typeof size === "number" ? size : undefined;

  // Outline path and filled path share a common star shape
  const outlinePath =
    "M12 17.25l-5.196 3.06 1.576-5.84L4 10.69l5.902-.51L12 4.5l2.098 5.68L20 10.69l-4.38 3.78 1.576 5.83L12 17.25z";
  const filledPath =
    "M12 .587l3.09 6.262 6.907 1.004-4.998 4.872 1.18 6.88L12 17.77l-6.179 3.835 1.18-6.88L2 7.853l6.907-1.004L12 .587z";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={numericSize}
      height={numericSize}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={filled ? 0 : strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? "img" : "img"}
      aria-hidden={ariaHidden}
      onClick={onClick}
    >
      {title ? <title>{title}</title> : null}
      {filled ? (
        // Filled star uses fill path
        <path d={filledPath} />
      ) : (
        // Outline star (same silhouette but stroked)
        <path d={outlinePath} />
      )}
    </svg>
  );
}
