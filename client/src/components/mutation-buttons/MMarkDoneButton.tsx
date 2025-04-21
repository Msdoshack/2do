import { CheckCheck } from "lucide-react";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { useMarkTodoAsDone } from "../../tanstack/mutation/todo/mutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Spinner from "../Spinner";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/user/userSlice";

type PropsType = {
  isDone: boolean;
  todoId: string;
};

const MMarkDoneButton = ({ isDone, todoId }: PropsType) => {
  const { user } = useSelector(selectUser);
  const { mutate, data, error, isPending, isError, isSuccess } =
    useMarkTodoAsDone();

  const handleMarkAsDone = () => {
    mutate({ todoId, token: user.token });
  };

  const queryClient = useQueryClient();

  useEffect(() => {
    if (isError) {
      if (error) {
        if (error.response.data) {
          toast.error(error.response.data.error);
          return;
        }
        if (error.code && error.code == "ERR_BAD_RESPONSE") {
          toast.error("Server error");
        }
      }
    }

    if (isSuccess) {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["todo", { todoId }] });
    }
  }, [isSuccess, data, isError]);
  return (
    <>
      {isDone ? (
        <Button
          variant={"outline"}
          size={"sm"}
          className="text-green-500 ring-1 ring-green-500"
        >
          Done <CheckCheck />
        </Button>
      ) : (
        <Button
          size={"sm"}
          variant={"outline"}
          className="text-xs text-green-500  font-semibold ring-2 ring-green-500"
          onClick={handleMarkAsDone}
          disabled={isPending}
        >
          {isPending ? <Spinner /> : "Mark As Done"}
        </Button>
      )}
    </>
  );
};

export default MMarkDoneButton;
