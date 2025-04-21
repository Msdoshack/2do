import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { useTrashTodo } from "../../tanstack/mutation/todo/mutation";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import DeleteTodoModal from "../modals/DeleteTodoModal";
import { useNavigate, useSearchParams } from "react-router-dom";
import Spinner from "../Spinner";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/user/userSlice";

type PropsType = {
  todoId: string;
};

const TrashTodo = ({ todoId }: PropsType) => {
  const { user } = useSelector(selectUser);
  const [showModal, setShowModal] = useState(false);
  const { mutate, data, isSuccess, isError, error, isPending } = useTrashTodo();

  const [searchParams] = useSearchParams();
  const queryObj = Object.fromEntries(searchParams.entries());
  const { page } = queryObj;

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const handleShowModal = () => {
    setShowModal(true);
  };

  const onClose = () => {
    setShowModal(false);
  };
  const trashFn = () => {
    mutate({ todoId, token: user.token });
    setShowModal(false);
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
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      if (page === "single-todo") {
        navigate("/dashboard");
      }
      toast.success(data.message);
    }
  }, [data, isError, isSuccess]);
  return (
    <>
      <div>
        {page === "single-todo" ? (
          <Button
            variant={"outline"}
            size={"sm"}
            className="text-xs font-semibold text-orange-500 ring-1 ring-orange-400"
            disabled={isPending}
            onClick={() => setShowModal(true)}
          >
            {isPending ? <Spinner /> : "Delete"}
          </Button>
        ) : (
          <Button
            size={"sm"}
            variant={"outline"}
            onClick={handleShowModal}
            className="bg-neutral-100"
            disabled={isPending}
          >
            {isPending ? <Spinner /> : <Trash2 className="text-red-500" />}
          </Button>
        )}
      </div>

      {showModal && (
        <DeleteTodoModal option={"trash"} fn={trashFn} onClose={onClose} />
      )}
    </>
  );
};

export default TrashTodo;
