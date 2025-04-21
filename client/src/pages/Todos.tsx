import { useSearchParams } from "react-router-dom";
import SideMenu from "../components/SideMenu";
import CompletedTodoComponent from "../components/CompletedTodoComponent";
import ActiveTodoComponent from "../components/ActiveTodoComponent";
import DeleteTodoComponent from "../components/DeleteTodoComponent";
import ProfileComponent from "../components/ProfileComponent";
import AllTodosComponent from "../components/AllTodosComponent";
import AddTodoComponent from "../components/AddTodoComponent";
import SingleTodoComponent from "../components/SingleTodoComponent";

const Todos = () => {
  const [searchParams] = useSearchParams();
  const queryObject = Object.fromEntries(searchParams.entries());
  const { page } = queryObject;

  return (
    <div className="flex w-full">
      <SideMenu />

      <div className="w-full min-h-screen">
        {page === "completed" ? (
          <CompletedTodoComponent />
        ) : page === "active" ? (
          <ActiveTodoComponent />
        ) : page === "deleted" ? (
          <DeleteTodoComponent />
        ) : page === "profile" ? (
          <ProfileComponent />
        ) : page === "add-todo" ? (
          <AddTodoComponent />
        ) : page === "single-todo" ? (
          <SingleTodoComponent />
        ) : (
          <AllTodosComponent />
        )}
      </div>
    </div>
  );
};

export default Todos;
