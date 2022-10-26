import express from "express";
import { handleBlog } from "../controllers/blogController";

const blogRouter = express.Router();

blogRouter.get("/id", handleBlog);

export default blogRouter;
