import { Button } from "./ui/button";
import { Eye, EyeOff } from "lucide-react";

type PropsType = {
  fn: () => void;
  isShowPassword: boolean;
};

const ShowPassword = ({ fn, isShowPassword }: PropsType) => {
  return (
    <Button
      onClick={fn}
      variant={"ghost"}
      className="w-fit absolute right-2 bottom-0 py-[1px]!"
      type="button"
    >
      {isShowPassword ? <EyeOff /> : <Eye />}
    </Button>
  );
};

export default ShowPassword;
