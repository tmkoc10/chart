"use client";

import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation"; // Removed unused import
import { AnimatedCircularProgressBar } from "@/components/magicui/animated-circular-progress-bar"; // Adjusted path

export function CircularProgressPage({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  // const router = useRouter(); // Removed unused variable

  useEffect(() => {
    // Animate progress from 0 to 100 over 2.5 seconds
    const totalDuration = 2500; // 2.5 seconds
    const intervals = 100; // Number of steps in the animation
    const intervalTime = totalDuration / intervals; // This is 25ms

    let currentProgress = 0;
    const intervalId = setInterval(() => {
      currentProgress += 1;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(intervalId);
        onComplete();
      }
    }, intervalTime);

    return () => clearInterval(intervalId);
  }, [onComplete]);

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background">
      <AnimatedCircularProgressBar
        max={100}
        min={0}
        value={progress}
        gaugePrimaryColor="rgb(79 70 229)" // indigo-600
        gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
        className="h-32 w-32" // Example size, adjust as needed
        style={{
            // Set a short transition length for smoothing between JS-driven steps.
            // e.g., slightly longer than the intervalTime (25ms) to ensure smooth catch-up.
            "--transition-length": "0.05s", // 50 milliseconds
          } as React.CSSProperties
        }
      />
      <p className="mt-4 text-lg text-muted-foreground">Preparing charts...</p>
    </div>
  );
} 