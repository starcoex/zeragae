import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/Zeragae");

const db = mongoose.connection;

const handleOpen = () => console.log("Conntected to DB");

db.on("error", (error) => console.log("DB Error", error));
db.once("open", handleOpen);
