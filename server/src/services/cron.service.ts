import cron from "node-cron";
import Todo, { IUser } from "../models/todo.model";
import sendEmail from "../utils/sendEmail";
import { sleep } from "../utils/sleep";

const scheduleReminders = () => {
  const intervals = ["min", "hourly", "daily", "weekly", "monthly", "yearly"];

  intervals.forEach((interval) => {
    let cronPattern = "";
    switch (interval) {
      case "min":
        // Every 5 minutes
        cronPattern = "*/5 * * * *";
        break;

      case "hourly":
        // Every hour at minute 0
        cronPattern = "0 * * * *";
        break;

      case "daily":
        // Every day at 07:00 AM
        cronPattern = "0 7 * * *";
        break;

      case "weekly":
        // Every Monday at 07:00 AM
        cronPattern = "0 7 * * 1";
        break;

      case "monthly":
        // Every 1st of the month at 07:00 AM
        cronPattern = "0 7 1 * *";
        break;

      case "yearly":
        // Every January 1st at 07:00 AM
        cronPattern = "0 7 1 1 *";
        break;
    }

    cron.schedule(cronPattern, async () => {
      console.log(`⏳ Checking for ${interval} reminders...`);

      try {
        const todos = await Todo.find({
          reminder: true,
          reminderInterval: interval,
          isDone: false,
        }).populate<{ user: IUser }>("user", "email username");

        for (const todo of todos) {
          if (!todo.user || !todo.user.email) continue;

          await sendEmail(
            todo.user.email,
            `⏰ Reminder: ${todo.title}`,
            "remainderEmail",
            {
              username: todo.user.username,
              taskTitle: todo.title,
              taskLink: `https://twodo-r0as.onrender.com/dashboard?page=single-todo&todoId=${todo._id}`,
            }
          );
        }
      } catch (error) {
        console.error(`❌ Error processing ${interval} reminders:`, error);
      }
    });
  });
};

export default scheduleReminders;
