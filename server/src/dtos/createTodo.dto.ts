import { ReminderEnum } from "../types/index.type";

interface CreateTodoDto {
  title: string;
  description: string;
  reminder: boolean;
  reminderInterval: ReminderEnum;
  deadline?: Date;
}

export default CreateTodoDto;
