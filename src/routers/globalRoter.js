import express from "express";
import { home, login, join, search } from "../controllers/homeController";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/login", login);
globalRouter.get("/join", join);
globalRouter.get("/search", search);

export default globalRouter;
