import express from "express";
import {
  see,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
  deleteVideo,
} from "../controllers/videoController";
import { protectorMiddleware } from "../middlewares";

const videoRouter = express.Router();
videoRouter
  .route("/upload")
  .get(getUpload)
  .all(protectorMiddleware)
  .post(postUpload);
videoRouter.get("/:id([0-9a-f]{24})", see);
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
videoRouter.get("/:id([0-9a-f]{24})/delete", protectorMiddleware, deleteVideo);

export default videoRouter;
