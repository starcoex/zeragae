import express from "express";
import morgan from "morgan";
import session from "express-session";
import rootRouter from "./routers/rootRouter";
import userRouters from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import blogRouter from "./routers/blogRouter";

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
  })
);

app.use((req, res, next) => {
  console.log(req.headers);
  next();
});

app.use("/", rootRouter);
app.use("/users", userRouters);
app.use("/videos", videoRouter);
app.use("/blog", blogRouter);

export default app;
