import express from "express";

const PORT = 4000;
const app = express();

const gossipMiddleWare = (req, res, next) => {
  console.log(`going to url : ${req.url}`);
  next();
};

const handleHome = (req, res) => {
  res.send({ message: "Hello" });
};

app.get("/", gossipMiddleWare, handleHome);

app.listen(PORT, () => console.log(`Zeragae Server http://localhost:${PORT}`));
