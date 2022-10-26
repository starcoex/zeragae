import express from "express";
import { handleWatch } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/id", handleWatch);

export default videoRouter;
