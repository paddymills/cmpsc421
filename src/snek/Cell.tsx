import { useSpring, animated } from "@react-spring/web";

export enum GameCell {
  Empty = 0,
  Snake = 1,
  Food = 2,
}

export function Cell({ value }: { value: GameCell }) {
  const color =
    value === GameCell.Empty
      ? "#345830"
      : value === GameCell.Snake
        ? "#1a1f16"
        : "#dd1c1a";

  const props = useSpring({
    backgroundColor: color,
    config: { tension: 300, friction: 15, mass: 1 },
  });

  return <animated.div style={props} />;
}
