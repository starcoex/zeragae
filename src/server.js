import express from "express";

const PORT = 4000;
const app = express();

const gossipMiddleware = (req, res, next) => {
  console.log(`going to ${req.method} url : ${req.url}`);
  next();
};

const privateMiddleware = (req, res, next) => {
  const url = req.url;
  if (url === "/protected") {
    return res.send("Not Allowed");
  } else {
    console.log("Allowed, you may continue.");
    next();
  }
};

const handleHome = (req, res) => {
  return res.send({ message: "Hello" });
};
const handleProtected = (req, res) => {
  res.send("Protected");
};

app.use(gossipMiddleware);
app.use(privateMiddleware);
app.get("/", gossipMiddleware, handleHome);
app.get("/protected", handleProtected);

app.listen(PORT, () => console.log(`Zeragae Server http://localhost:${PORT}`));
