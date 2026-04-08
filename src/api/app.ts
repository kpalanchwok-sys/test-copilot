import cors from "cors";
import express, { type Request, type Response } from "express";
import helmet from "helmet";
import morgan from "morgan";

import MainRouter from "./startup/MainRouter";
import { globalErrorHandler } from "./utils/globalErrorHandler";

const app = express();

app.locals.title = "Lock-Gate";
app.locals.version = "1.0.0";

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "🏘️ Welcome to Lock-gate",
    testVersion: "1.1",
  });
});

// sendPushNotifications({
//   //   // tokens: ["ExponentPushToken[0SqM-cBX7Wbf5LiSaXh9uG]"], // huntgate
//   tokens: ["ExponentPushToken[D3zaKlIyZ1TpIdfb1vnbds]"], // lock gate

//   title: "Testing notify",
//   body: "fjhsfdsnfsn",
//   data: {
//     resourceId: "test-maintenance-item-id",
//     targetScreen: TargetScreen.MAINTENANCE_DETAIL,
//   },
// });

MainRouter(app);

app.use(globalErrorHandler);

export { app };
