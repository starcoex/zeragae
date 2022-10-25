import express from "express";
import morgan from "morgan";

const PORT = 4000;

const app = express();
const logger = morgan("dev");

const handleHome = (req, res) => {
  return res.send({ message: "Hello" });
};

app.use(logger);
app.get("/", handleHome);

app.listen(PORT, () => console.log(`Zeragae Server http://localhost:${PORT}`));
