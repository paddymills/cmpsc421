import { useEffect, useRef } from "react";
import { useSpring, animated } from "@react-spring/web";

export function Score({ score }: { score: number }) {
  // Keep previous score in a ref to detect changes
  const prevScoreRef = useRef(score);

  // Create spring animation
  const [springs, api] = useSpring(() => ({
    from: { scale: 1 },
    config: { tension: 300, friction: 10, mass: 1 },
  }));

  // Trigger animation when score changes
  useEffect(() => {
    // Only animate if score has changed and isn't the initial render
    if (prevScoreRef.current !== score && prevScoreRef.current !== undefined) {
      api.start({
        from: { scale: 1 },
        to: [
          { scale: 1.5 }, // Bounce up
          { scale: 1 }, // Return to normal
        ],
      });
    }

    // Update ref with current score
    prevScoreRef.current = score;
  }, [score, api]);

  return (
    <animated.h4
      style={{
        transform: springs.scale.to((s) => `scale(${s})`),
        transformOrigin: "center left",
      }}
    >
      Score: {score}
    </animated.h4>
  );
}
