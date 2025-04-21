import { Button } from "../ui/button";

type PropsType = {
  onClose: () => void;
  fn: () => void;
  option: string;
};

const DeleteTodoModal = ({ onClose, fn, option }: PropsType) => {
  return (
    <div className="fixed top-0 left-0 w-full h-screen flex flex-col gap-5 items-center justify-center overflow-hidden z-50 bg-[#000000ea] px-4">
      <div className="absolute right-5 top-10">
        <Button
          variant={"ghost"}
          onClick={onClose}
          className="text-red-400 font-bold text-lg"
        >
          Close X
        </Button>
      </div>

      <div className="border py-5 bg-white w-full max-w-sm rounded-md">
        {option === "trash" && (
          <div className="mb-10">
            <h4 className="mb-1 font-medium sm:text-lg text-center">
              Are sure you want to delete task?
            </h4>
            <p className="text-red-500 text-xs text-center">
              (note: task would be moved to trash for a period or 30days)
            </p>
          </div>
        )}

        {option === "delete" && (
          <div className="mb-10 ">
            <h4 className="mb-1 font-medium sm:text-lg text-center ">
              Are sure you want delete task Permanently?
            </h4>
            <p className="text-red-500 text-xs text-center">
              (note: task can't be restored after deletion)
            </p>
          </div>
        )}

        <div className="flex items-center justify-center gap-10">
          <Button className="bg-red-500" size={"sm"} onClick={fn}>
            Yes
          </Button>

          <Button size={"sm"} onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTodoModal;
