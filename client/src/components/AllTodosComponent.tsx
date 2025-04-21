import { useEffect, useState } from "react";
import { useGetUserTodos } from "../tanstack/queries/todo/query";
import Loading from "./Loading";
import TodoHeader from "./TodoHeader";
import TodoTableComponent from "./TodoTableComponent";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, selectUser } from "../redux/user/userSlice";
import Pagination from "./Pagination";

const AllTodosComponent = () => {
  const [offset, setOffset] = useState(0);
  const { user } = useSelector(selectUser);

  const { data, error, isError, isLoading, isFetching } = useGetUserTodos({
    query: `isDeleted=false&offset=${offset}`,
    offset,
    token: user.token,
  });

  const dispatch = useDispatch();

  const notNext = !data || !data.data || data?.data.length < 10;

  const notPrev = offset === 0;

  useEffect(() => {
    if (isError) {
      if (error?.status === 401) {
        dispatch(logoutUser());
        return;
      }
    }
  }, [error, isError]);

  if (isLoading || isFetching) return <Loading />;

  return (
    <div className="mx-auto py-10 px-4 md:px-16  flex flex-col w-full items-center">
      <TodoHeader title="All Task" isAddTask />

      {data?.data.length ? (
        <>
          <TodoTableComponent caption="" data={data?.data!} />
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

export default AllTodosComponent;
