import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRoter";
import userRouters from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import blogRouter from "./routers/blogRouter";

const PORT = 4000;

const app = express();
const logger = morgan("dev");
app.use(logger);

app.use("/", globalRouter);
app.use("/users", userRouters);
app.use("/videos", videoRouter);
app.use("/blog", blogRouter);

app.listen(PORT, () => console.log(`Zeragae Server http://localhost:${PORT}`));
