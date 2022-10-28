import { query } from "express";
import Video from "../models/Video";
export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ createdAt: "descending" });
    res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    console.log("Error", error);
  }
};
export const login = (req, res) => res.send("Login");
export const join = (req, res) => res.send("Join");
export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    });
  }
  return res.render("search", { pageTitle: "Search", videos });
};
