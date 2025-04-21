import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { TodoType } from "../types";
import { format } from "date-fns";
import MRestoreTodoButton from "./mutation-buttons/MRestoreTodoButton";
import MTrashTodoButton from "./mutation-buttons/MTrashTodoButton";
import MDeleteTodoButton from "./mutation-buttons/MDeleteTodoButton";

type PropsType = {
  caption: string;
  data: TodoType[];
};

const TodoTableComponent = ({ caption, data }: PropsType) => {
  return (
    <Table className="mt-16 w-full">
      <TableCaption>A list of your {caption} tasks.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Task</TableHead>
          <TableHead>Status</TableHead>

          <TableHead className="text-right">Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data &&
          data?.map((todo) => (
            <TableRow>
              <TableCell className="font-medium capitalize">
                <Link to={`/dashboard?page=single-todo&todoId=${todo._id}`}>
                  {todo.title.length <= 20
                    ? todo.title
                    : todo.title.substring(0, 20) + "..."}
                </Link>
              </TableCell>
              <TableCell
                className={`${
                  todo.isDeleted
                    ? "text-red-500"
                    : todo.isDone
                    ? "text-green-500"
                    : "text-yellow-600"
                }`}
              >
                {todo?.isDeleted
                  ? "deleted"
                  : todo.isDone
                  ? "Completed"
                  : "Active"}
              </TableCell>
              <TableCell className="text-right">
                {format(todo.createdAt, "PPP")}
              </TableCell>

              {!todo.isDeleted ? (
                <>
                  <TableCell className="text-right ">
                    <Link to={`/dashboard?page=single-todo&todoId=${todo._id}`}>
                      <Button size={"sm"} className="text-xs font-medium">
                        View
                      </Button>
                    </Link>
                  </TableCell>

                  <TableCell className="text-right">
                    <MTrashTodoButton todoId={todo._id} />
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell className="text-right">
                    <MRestoreTodoButton todoId={todo._id} />
                  </TableCell>
                  <TableCell className="text-right">
                    <MDeleteTodoButton todoId={todo._id} />
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default TodoTableComponent;
