import { useEffect } from "react";
import { useToggleReminder } from "../../tanstack/mutation/todo/mutation";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import Spinner from "../Spinner";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/user/userSlice";

type PropsType = {
  todoId: string;
  reminder: boolean;
};

const MToggleReminderButton = ({ todoId, reminder }: PropsType) => {
  const { user } = useSelector(selectUser);
  const { mutate, data, error, isPending, isError, isSuccess } =
    useToggleReminder();

  const queryClient = useQueryClient();

  const handleToggle = () => {
    mutate({ todoId, token: user.token });
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
      queryClient.invalidateQueries({ queryKey: ["todo", { todoId }] });
      toast.success(data.message);
      return;
    }
  }, [isSuccess, isError, data]);
  return (
    <Button
      size={"sm"}
      variant={"outline"}
      className="text-xs font-semibold text-indigo-500 ring-1 ring-indigo-500"
      disabled={isPending}
      onClick={handleToggle}
    >
      {isPending ? (
        <Spinner />
      ) : reminder ? (
        "🕰️ Turn Off Reminder"
      ) : (
        "🕰️ Turn On Reminder"
      )}
    </Button>
  );
};

export default MToggleReminderButton;
