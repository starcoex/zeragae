import express from "express";
import {
  see,
  logout,
  remove,
  startGithubLogin,
  callbackGithubLogin,
  getEdit,
  postEdit,
  getChangePassword,
  postChangePassword,
  getChating,
  postChating,
  getVideoChat,
  postVideoChat,
} from "../controllers/userController";
import {
  protectorMiddleware,
  publicOnlyMiddleware,
  avatarUpload,
} from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(avatarUpload.single("avatar"), postEdit);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/callback", publicOnlyMiddleware, callbackGithubLogin);
userRouter
  .route("/change-password")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get("/remove", remove);
userRouter.get("/:id([0-9a-f]{24})", see);
userRouter.route("/:id([0-9a-f]{24})/chat").get(getChating).post(postChating);
userRouter
  .route("/:id([0-9a-f]{24})/video-chat")
  .get(getVideoChat)
  .post(postVideoChat);

export default userRouter;
