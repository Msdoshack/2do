import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetSingleTodo } from "../tanstack/queries/todo/query";
import { Button } from "../components/ui/button";
import "react-quill-new/dist/quill.snow.css";
import DOMPurify from "dompurify";
import { format } from "date-fns";
import { CheckCheck, ChevronLeft } from "lucide-react";
import { useState } from "react";
import UpdateTodoComponent from "../components/UpdateTodoComponent";

import MarkDone from "./mutation-buttons/MMarkDoneButton";

import Loading from "../components/Loading";
import ToggleReminder from "./mutation-buttons/MToggleReminderButton";
import TrashTodo from "./mutation-buttons/MTrashTodoButton";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/user/userSlice";

const SingleTodoComponent = () => {
  const { user } = useSelector(selectUser);
  const [searchParams] = useSearchParams();
  const queryObject = Object.fromEntries(searchParams.entries());
  const { todoId } = queryObject;
  const [isUpdate, setIsUpdate] = useState(false);
  const { data, isLoading } = useGetSingleTodo({ todoId, token: user.token });

  const onCloseUpdate = () => {
    setIsUpdate(false);
  };

  const onShowUpdate = () => {
    setIsUpdate(true);
  };

  const navigate = useNavigate();

  if (isLoading) return <Loading />;
  return (
    <>
      {data ? (
        <div className="py-8  max-w-xl mx-auto w-full min-h-dvh px-2 sm:px-0">
          <Button
            onClick={() => navigate(-1)}
            variant={"link"}
            size={"default"}
            className="flex items-center mb-8 px-6 text-base"
          >
            <ChevronLeft />
            Back
          </Button>

          {isUpdate && (
            <h1 className="text-center font-bold capitalize mb-4 text-lg">
              Update Todo
            </h1>
          )}

          {isUpdate ? (
            <div className="p-8 border rounded-lg">
              <UpdateTodoComponent data={data?.data!} onClose={onCloseUpdate} />
            </div>
          ) : (
            <div className="p-8 border rounded-lg">
              <div
                className="quill-content "
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(data?.data?.description!),
                }}
              ></div>

              <div className="mt-16 flex items-center justify-between">
                <p className="text-xs text-green-600">
                  Date Created: {format(data?.data.createdAt!, "PPP")}
                </p>
                {/* <p className="text-xs text-orange-500">
                  Deadline Date: {format(data?.data.deadline!, "PPP")}
                </p> */}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-4 px-4 mt-16">
            <MarkDone isDone={data?.data.isDone!} todoId={data?.data._id!} />

            <ToggleReminder
              todoId={data?.data._id!}
              reminder={data?.data.reminder!}
            />

            {isUpdate ? (
              <Button
                size={"sm"}
                variant={"outline"}
                className="text-green-500"
              >
                <CheckCheck />
              </Button>
            ) : (
              <Button
                size={"sm"}
                variant={"outline"}
                className="text-xs font-semibold text-purple-500 ring-1 ring-purple-500"
                onClick={onShowUpdate}
              >
                Update
              </Button>
            )}

            <TrashTodo todoId={data.data._id} />
          </div>
        </div>
      ) : (
        <div className="h-screen flex items-center justify-center">
          <h1 className="text-lg">Task not Found</h1>
        </div>
      )}
    </>
  );
};

export default SingleTodoComponent;
