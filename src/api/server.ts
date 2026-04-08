import { Server } from "http";
import { app } from "./app";
import config from "./config";
import { startCronJobs } from "./cron";
import initDB from "./startup/initDB";
import { STARTUP_MESSAGE } from "./startup/startUpMessage";
const httpServer = new Server(app);

initDB();
startCronJobs();

const port = config.PORT;

httpServer.listen(port, () => {
  console.log("\x1b[96m", STARTUP_MESSAGE, "\x1b[0m");
  console.log(`🚩 Server is 🔥running on port: ${port}`);
  console.log(`🚀 Deploy stage: ${config.ENV}`);
  console.info("\x1b[93m" + `📀 Server: ${app.locals.title}` + "\x1b[0m");
});

// Handle graceful shutdown
process.on("unhandledRejection", (err: Error) => {
  console.error("UNHANDLED REJECTION 💥", err);
  httpServer.close(() => process.exit(1));
});

process.on("uncaughtException", (err: Error) => {
  console.error("UNCAUGHT EXCEPTION 💥", err);
  process.exit(1);
});
