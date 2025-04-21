import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useDeleteTodo } from "../../tanstack/mutation/todo/mutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import DeleteTodoModal from "../modals/DeleteTodoModal";

type PropsType = {
  todoId: string;
};

const MDeleteTodoButton = ({ todoId }: PropsType) => {
  const [showDelModal, setShowDelModal] = useState(false);

  const { mutate, data, isSuccess, isError, error } = useDeleteTodo();
  const queryClient = useQueryClient();

  const onClose = () => {
    setShowDelModal(false);
  };
  const handleShowModal = () => {
    setShowDelModal(true);
  };

  const delTodoFn = () => {
    mutate(todoId);
    setShowDelModal(false);
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

      toast.success(data.message);
    }
  }, [data, isError, isSuccess]);
  return (
    <>
      <Button
        size={"sm"}
        className="text-red-500 bg-neutral-200"
        onClick={handleShowModal}
      >
        Del
      </Button>
      {showDelModal && (
        <DeleteTodoModal option="delete" fn={delTodoFn} onClose={onClose} />
      )}
    </>
  );
};

export default MDeleteTodoButton;
