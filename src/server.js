import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouters from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import blogRouter from "./routers/blogRouter";
import { localMiddlewares } from "./middlewares";

const app = express();
const logger = morgan("dev");
app.use(logger);

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "hello",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/Zeragae" }),
  })
);

app.get("/add-on", (req, res, next) => {
  console.log(req.sessionID);
  res.send(req.session.id);
});

app.use(localMiddlewares);

app.use("/", rootRouter);
app.use("/users", userRouters);
app.use("/videos", videoRouter);
app.use("/blog", blogRouter);

export default app;
