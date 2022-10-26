import express from "express";
import { handleHome } from "../controllers/homeController";

const globalRouter = express.Router();

globalRouter.get("/", handleHome);

export default globalRouter;
