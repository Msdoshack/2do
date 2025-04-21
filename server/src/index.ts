import express from "express";
import { PORT } from "./config/env";
import connectToDataBase from "./database/connectDB";
import errorMiddleware from "./middlewares/error.middleware";
import cookieParser from "cookie-parser";
import arcjetMiddleware from "./middlewares/arcjet.middleware";
import passport from "passport";
import routes from "./routes/index.routes";
import "./strategies/jwt.strategy";
import scheduleReminders from "./services/cron.service";
import path from "path";

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.json());

app.use(arcjetMiddleware);

app.use(passport.initialize());

app.use("/api/v1", routes);

app.use(errorMiddleware);

// Serve static files from the Vite build folder
app.use(express.static(path.join(__dirname, "../../client/dist")));

// Handle all routes and send the index.html for client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});

scheduleReminders();

app.listen(PORT, async () => {
  console.log(`Server running at ${PORT}`);
  await connectToDataBase();
});
