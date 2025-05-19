import { cn } from "@/lib/utils";

interface AnimatedCircularProgressBarProps {
  max: number;
  value: number;
  min: number;
  gaugePrimaryColor: string;
  gaugeSecondaryColor: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AnimatedCircularProgressBar({
  max = 100,
  min = 0,
  value = 0,
  gaugePrimaryColor,
  gaugeSecondaryColor,
  className,
  style,
}: AnimatedCircularProgressBarProps) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const currentPercent = Math.max(0, Math.min(100, Math.round(((value - min) / (max - min)) * 100)));

  // Calculate the stroke-dashoffset for the primary circle
  // Offset goes from circumference (empty) to 0 (full)
  const primaryStrokeDashoffset = circumference * (1 - currentPercent / 100);

  const defaultStyles: React.CSSProperties = {
    "--circle-size": "100px",
    "--circumference": circumference,
    "--percent-to-px": `${circumference / 100}px`, // Retained for potential use by other elements
    "--gap-percent": "0",
    "--offset-factor": "0",
    "--transition-length": "1s", // This will be overridden by circular-progress-page.tsx to 2.5s
    "--transition-step": "200ms",
    "--delay": "0s",
    "--percent-to-deg": "3.6deg",
    transform: "translateZ(0)",
  };

  return (
    <div
      className={cn("relative size-40 text-2xl font-semibold", className)}
      style={{ ...defaultStyles, ...style }} // Merged styles
    >
      <svg
        fill="none"
        className="size-full"
        strokeWidth="2" // This is for the svg container, not the circles directly if overridden
        viewBox="0 0 100 100"
      >
        {/* Secondary Circle (Background) - Static full circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            stroke: gaugeSecondaryColor,
            // To make it a static full circle, no dasharray/dashoffset manipulation needed for animation
            // Or be explicit: strokeDasharray: `${circumference} ${circumference}`, strokeDashoffset: 0,
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
          } as React.CSSProperties}
        />
        {/* Primary Circle (Foreground) */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            stroke: gaugePrimaryColor,
            strokeDasharray: `${circumference} ${circumference}`,
            strokeDashoffset: primaryStrokeDashoffset,
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
            transition: `stroke-dashoffset var(--transition-length) linear var(--delay), transform var(--transition-length) linear var(--delay)`,
          } as React.CSSProperties}
        />
      </svg>
      <span
        data-current-value={currentPercent}
        // Ensure text transition is also linear and respects the full duration
        className="absolute inset-0 m-auto size-fit ease-linear animate-in fade-in"
        style={{
          transitionDuration: `var(--transition-length)`,
          transitionDelay: `var(--delay)`,
          transitionTimingFunction: 'linear',
        } as React.CSSProperties}
      >
        {currentPercent}%
      </span>
    </div>
  );
}
