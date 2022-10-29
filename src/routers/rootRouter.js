import express from "express";
import {
  home,
  login,
  search,
  getjoin,
  postjoin,
} from "../controllers/homeController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/login", login);
rootRouter.route("/join").get(getjoin).post(postjoin);
rootRouter.get("/search", search);

export default rootRouter;
