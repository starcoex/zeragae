import { query } from "express";
import Video from "../models/Video";
import User from "../models/User";
import bcrypt from "bcrypt";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ createdAt: "descending" });
    res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    console.log("Error", error);
  }
};
export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "Login" });
};
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const usernameExist = await User.exists({ username });
  if (!usernameExist) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exists.",
    });
  }
  const user = await User.findOne({ username });
  const ok = await bcrypt.compare(password, user.password);
  console.log(ok);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};
export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res) => {
  const { email, username, name, password, password2, location } = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match.",
    });
  }
  const usernameExists = await User.exists({ username });
  if (usernameExists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username is already taken.",
    });
  }
  const emailExists = await User.exists({ email });
  if (emailExists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This email is already taken.",
    });
  }
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
    res
      .status(400)
      .render("join", { pageTitle: "Join", errorMessage: error._message });
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
