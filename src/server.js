import express from "express";
import morgan from "morgan";
import session from "express-session";
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
  })
);

// app.use((req, res, next) => {
//   console.log(req.headers);
//   next();
// });
app.use((req, res, next) => {
  req.sessionStore.all((error, sessions) => {
    console.log(sessions);
    next();
  });
});
app.get("/add-on", (req, res, next) => {
  console.log(req.session.id);
  res.send(req.session.id);
});

app.use(localMiddlewares);

app.use("/", rootRouter);
app.use("/users", userRouters);
app.use("/videos", videoRouter);
app.use("/blog", blogRouter);

export default app;
