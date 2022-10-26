import express from "express";
import morgan from "morgan";

const PORT = 4000;

const app = express();
const logger = morgan("dev");

const handleHome = (req, res) => {
  return res.send({ message: "Hello" });
};
const SecurityLogger = (req, res, next) => {
  const protocol = req.protocol;
  console.log(protocol === "https" ? "Secure" : "Insecure");
  next();
};
app.use(logger);
app.use(SecurityLogger);
app.get("/", handleHome);

app.listen(PORT, () => console.log(`Zeragae Server http://localhost:${PORT}`));
