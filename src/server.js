// require("dotenv").config();
import express, { text } from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouters from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import blogRouter from "./routers/blogRouter";
import { localMiddlewares } from "./middlewares";
import apiRouter from "./routers/apiRouter";

const app = express();
const logger = morgan("dev");

app.use(logger);

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use((req, res, next) => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Embedder-Policy", "credentialless");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.COOKIE_SERCURET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

app.get("/add-on", (req, res, next) => {
  console.log(req.sessionID);
  res.send(req.session.id);
});

app.use(flash());
app.use(localMiddlewares);
app.use("/convert", express.static("node_modules/@ffmpeg/core/dist"));
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));

app.use("/", rootRouter);
app.use("/users", userRouters);
app.use("/videos", videoRouter);
app.use("/blog", blogRouter);
app.use("/api", apiRouter);

export default app;
