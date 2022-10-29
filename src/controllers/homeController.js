import { query } from "express";
import Video from "../models/Video";
import User from "../models/User";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ createdAt: "descending" });
    res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    console.log("Error", error);
  }
};
export const login = (req, res) => res.send("Login");
export const getjoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};
export const postjoin = async (req, res) => {
  const { email, username, name, password, location } = req.body;
  try {
    await User.create({
      email,
      username,
      name,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    res.render("join", { pageTitle: "Join", errorMessage: error._message });
  }
};
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
