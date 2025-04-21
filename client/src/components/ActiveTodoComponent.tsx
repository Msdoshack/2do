import { useState } from "react";
import { useGetUserTodos } from "../tanstack/queries/todo/query";
import Loading from "./Loading";
import Pagination from "./Pagination";
import TodoHeader from "./TodoHeader";
import TodoTableComponent from "./TodoTableComponent";

const ActiveTodoComponent = () => {
  const [offset, setOffset] = useState(0);
  const { data, isLoading, error } = useGetUserTodos(
    `active=true&offset=${offset}`,
    offset
  );

  const notNext = !data || !data.data || data?.data.length < 10;

  const notPrev = offset === 0;

  if (isLoading) return <Loading />;

  return (
    <div className="mx-auto py-10 px-4 md:px-16  flex flex-col w-full items-center min-h-screen">
      <TodoHeader title="Active Tasks" isAddTask />

      {data?.data.length || !error ? (
        <>
          <TodoTableComponent caption="active" data={data?.data!} />
          <Pagination
            offset={offset}
            setOffset={setOffset}
            notNext={notNext}
            notPrev={notPrev}
          />
        </>
      ) : (
        <div className="h-[70vh] flex items-center justify-center text-center text-lg font-medium">
          No task yet
        </div>
      )}
    </div>
  );
};

export default ActiveTodoComponent;
