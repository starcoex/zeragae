import express from "express";
import {
  see,
  logout,
  edit,
  remove,
  startGithubLogin,
  callbackGithubLogin,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/edit", edit);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/callback", callbackGithubLogin);
userRouter.get("/remove", remove);
userRouter.get("/:id(\\d+)", see);

export default userRouter;
