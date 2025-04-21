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

      // const now = new Date();

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
              taskLink: `https://example.com/todos/${todo._id}`,
            }
          );
          // Delay 1 minute between each email
          // await sleep(60000);
        }
      } catch (error) {
        console.error(`❌ Error processing ${interval} reminders:`, error);
      }
    });
  });
};

export default scheduleReminders;

// Update next reminder time
// switch (interval) {
//   case "min":
//     todo.nextReminderAt = new Date(now.getTime() + 60 * 1000);
//     break;
//   case "hourly":
//     todo.nextReminderAt = new Date(now.getTime() + 60 * 60 * 1000);
//     break;
//   case "daily":
//     todo.nextReminderAt = new Date(
//       now.getTime() + 24 * 60 * 60 * 1000
//     );
//     break;
//   case "weekly":
//     todo.nextReminderAt = new Date(
//       now.getTime() + 7 * 24 * 60 * 60 * 1000
//     );
//     break;
//   case "monthly":
//     todo.nextReminderAt = new Date(now.setMonth(now.getMonth() + 1));
//     break;
//   case "yearly":
//     todo.nextReminderAt = new Date(
//       now.setFullYear(now.getFullYear() + 1)
//     );
//     break;
// }
// await todo.save();
