import express from "express";
import { home } from "../controllers/blogController";

const blogRouter = express.Router();

blogRouter.get("/", home);

export default blogRouter;
