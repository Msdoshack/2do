import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const TodoHeader = ({
  title,
  isAddTask,
}: {
  title: string;
  isAddTask?: boolean;
}) => {
  return (
    <div className=" flex items-center justify-between w-full">
      <h1 className="text-2xl font-bold">{title}</h1>

      {isAddTask && (
        <Link to={"/dashboard?page=add-todo"}>
          <Button size={"sm"} className=" font-medium">
            Add Task
          </Button>
        </Link>
      )}
    </div>
  );
};

export default TodoHeader;
