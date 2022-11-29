import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server";

const PORT = 4900;

app.listen(PORT, () => console.log(`Zeragae Server http://localhost:${PORT}`));
