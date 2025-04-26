import { useSpring, animated } from "@react-spring/web";

export function Cell({
  index,
  onClick,
  children,
}: {
  index: number;
  onClick: (index: number) => void;
  children: React.ReactNode;
}) {
  const [props, api] = useSpring(() => ({
    // Initial state
    backgroundColor: "#242424",

    // Configuration for the spring physics
    config: { mass: 1, tension: 300, friction: 20 },
  }));

  const gainFocus = () =>
    children ? loseFocus() : api({ backgroundColor: "#ABABAB" });
  const loseFocus = () => api({ backgroundColor: "#242424" });
  const onClickHandler = () => {
    loseFocus();
    onClick(index);
  };

  return (
    <animated.div
      className="ttt-cell"
      onClick={onClickHandler}
      style={props}
      onMouseEnter={gainFocus}
      onMouseLeave={loseFocus}
    >
      {children}
    </animated.div>
  );
}
