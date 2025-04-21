import { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";

type PropsType = {
  offset: number;
  setOffset: Dispatch<SetStateAction<number>>;
  notNext: boolean;
  notPrev: boolean;
};

const Pagination = ({ offset, setOffset, notNext, notPrev }: PropsType) => {
  const handleNext = () => {
    setOffset((prev) => prev + 10);
  };

  const handlePrev = () => {
    const idx = Math.max(0, offset - 10);
    setOffset(idx);
  };

  return (
    <div className="flex justify-between items-center mt-6 w-full px-10">
      <Button
        variant={"outline"}
        size={"sm"}
        onClick={handlePrev}
        disabled={notPrev}
      >
        Prev
      </Button>
      <Button
        variant={"outline"}
        size={"sm"}
        onClick={handleNext}
        disabled={notNext}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
