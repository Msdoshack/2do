import { ReminderEnum } from "../types/index.type";

interface UpdateTodoDto {
  title?: string;
  description?: string;
  deadline?: Date;
  reminderInterval?: ReminderEnum;
  isDone?: boolean;
}

export default UpdateTodoDto;
