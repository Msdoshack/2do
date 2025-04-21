import { useState } from "react";
import { useGetUserTodos } from "../tanstack/queries/todo/query";
import Loading from "./Loading";
import TodoHeader from "./TodoHeader";
import TodoTableComponent from "./TodoTableComponent";
import Pagination from "./Pagination";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/user/userSlice";

const DeleteTodoComponent = () => {
  const { user } = useSelector(selectUser);
  const [offset, setOffset] = useState(0);

  const { data, isLoading, isFetching } = useGetUserTodos({
    query: `isDeleted=true&offset=${offset}`,
    offset,
    token: user.token,
  });

  const notNext = !data || !data.data || data?.data.length < 10;

  const notPrev = offset === 0;

  if (isLoading || isFetching) return <Loading />;

  return (
    <div className="mx-auto py-10 px-4 md:px-16  flex flex-col w-full items-center">
      <TodoHeader title="Deleted Tasks" isAddTask />

      {data?.data.length ? (
        <>
          <TodoTableComponent caption="deleted" data={data?.data!} />
          <Pagination
            setOffset={setOffset}
            offset={offset}
            notNext={notNext}
            notPrev={notPrev}
          />
        </>
      ) : (
        <div className="h-[70vh] flex items-center justify-center text-center text-lg font-medium">
          No deleted task
        </div>
      )}
    </div>
  );
};

export default DeleteTodoComponent;
