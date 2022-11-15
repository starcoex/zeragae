import express from "express";
import { all } from "express/lib/application";
import {
  home,
  search,
  getJoin,
  postJoin,
  getLogin,
  postLogin,
} from "../controllers/homeController";
import { publicOnlyMiddleware } from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter
  .route("/login")
  .all(publicOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter.get("/search", search);

export default rootRouter;
