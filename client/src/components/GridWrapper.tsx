import { AnimatedGridPattern } from "./magicui/animated-grid-pattern";
import { ReactNode } from "react";

const GridWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="text-black relative">
      <AnimatedGridPattern width={100} height={100} numSquares={5} />

      {children}
    </div>
  );
};

export default GridWrapper;
