import { useEffect } from "react";
import { useRestoreTodo } from "../../tanstack/mutation/todo/mutation";
import { Button } from "../ui/button";
import Spinner from "../Spinner";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

type PropsType = {
  todoId: string;
};

const MRestoreTodoButton = ({ todoId }: PropsType) => {
  const { mutate, data, error, isPending, isError, isSuccess } =
    useRestoreTodo();
  const queryClient = useQueryClient();

  const handleRestore = () => {
    mutate(todoId);
  };

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
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      return;
    }
  }, [isError, isSuccess, data]);
  return (
    <Button size={"sm"} disabled={isPending} onClick={handleRestore}>
      {isPending ? <Spinner /> : "Restore"}
    </Button>
  );
};

export default MRestoreTodoButton;
