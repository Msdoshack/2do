import { LoaderCircle } from "lucide-react";

const Spinner = () => {
  return (
    <div className="w-fit animate-spin">
      <LoaderCircle />
    </div>
  );
};

export default Spinner;
