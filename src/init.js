import "dotenv/config";
import app from "./server";
import "./db";
import Video from "./models/Video";
import User from "./models/User";

const PORT = 4000;

app.listen(PORT, () => console.log(`Zeragae Server http://localhost:${PORT}`));
