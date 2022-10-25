import express from "express";

const PORT = 4000;
const app = express();

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(PORT, () => console.log(`Zeragae Server http://localhost:${PORT}`));
