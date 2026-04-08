import { startSetReminderCron } from "./setReminderCron";

export const startCronJobs = () => {
  startSetReminderCron();
};
