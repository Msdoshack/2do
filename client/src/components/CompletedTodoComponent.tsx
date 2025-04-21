import { useState } from "react";
import { useGetUserTodos } from "../tanstack/queries/todo/query";
import Loading from "./Loading";
import TodoHeader from "./TodoHeader";
import TodoTableComponent from "./TodoTableComponent";
import Pagination from "./Pagination";

const CompletedTodoComponent = () => {
  const [offset, setOffset] = useState(0);
  const { data, isLoading, isFetching, error } = useGetUserTodos(
    `isDone=true&offset=${offset}`,
    offset
  );

  const notNext = !data || !data.data || data?.data.length < 10;

  const notPrev = offset === 0;

  if (isLoading || isFetching) return <Loading />;
  return (
    <div className="mx-auto py-10 px-4 md:px-16  flex flex-col w-full items-center">
      <TodoHeader title="Completed Tasks" isAddTask />

      {data?.data.length || !error ? (
        <>
          <TodoTableComponent caption="completed" data={data?.data!} />
          <Pagination
            setOffset={setOffset}
            offset={offset}
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

export default CompletedTodoComponent;
