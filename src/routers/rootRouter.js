import express from "express";
import {
  home,
  search,
  getJoin,
  postJoin,
  getLogin,
  postLogin,
} from "../controllers/homeController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.get("/search", search);

export default rootRouter;
