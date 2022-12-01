import fetch from "node-fetch";
import User from "../models/User";
import Video from "../models/Video";
import bcrypt from "bcrypt";
import { async } from "regenerator-runtime";

export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
      model: "User",
    },
  });

  if (!user) {
    return res.status(404).render("404", { pageTitle: "User not found." });
  }
  // const videos = await Video.find({ owner: user._id });
  return res.render("users/profile", {
    pageTitle: `${user.name}의 Profile`,
    user,
  });
};
export const logout = (req, res) => {
  // req.session.destroy();
  req.session.user = null;
  req.session.loggedIn = false;
  req.flash("info", "Bye Bye");
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GITHUB_CLIENT,
    allow_singup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  res.redirect(finalUrl);
};
export const callbackGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GITHUB_CLIENT,
    client_secret: process.env.GITHUB_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const apiUrl = "https://api.github.com";
    const { access_token } = tokenRequest;
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    const existingUser = await User.findOne({ email: emailObj.email });
    if (existingUser) {
      req.session.loggedIn = true;
      req.session.user = existingUser;
      return res.redirect("/");
    } else {
      const user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location:
          userData.location === null ? "Not Location" : userData.location,
      });
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    }
  } else {
    return res.redirect("/login");
  }
};
export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profiles" });
};
export const postEdit = async (req, res) => {
  const {
    body: { name, email, username, location },
    file,
    session: {
      user: { _id, avatarUrl },
    },
  } = req;

  const findUsername = await User.findOne({ username });
  const findEmail = await User.findOne({ email });
  if (findUsername._id != _id || findEmail._id != _id) {
    return res.render("edit-profile", {
      pageTitle: "Edit Profile",
      errorMessage: "User is exist",
    });
  }
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      name,
      email,
      username,
      location,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  // req.session.user = {
  //   ...req.session.user,
  //   name,
  //   email,
  //   username,
  //   location,
  // };
  return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    req.flash("error", "Can't change password.");
    return res.redirect("/");
  }
  return res.render("users/change-password", { pageTitle: "Change Password" });
};
export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPsaawordConfirmation },
    session: {
      user: { _id },
    },
  } = req;
  const user = await User.findById(_id);
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    return res.render("users/change-password", {
      errorMessage: "기존 패스워드가 맞지 않습니다.",
    });
  }
  if (newPassword !== newPsaawordConfirmation) {
    return res.render("users/change-password", {
      errorMessage: "비밀번화가 맞지 않습니다",
    });
  }
  user.password = newPassword;
  await user.save();
  req.flash("info", "Password updated");
  return res.redirect("/users/logout");
};

export const remove = (req, res) => res.send("Remove");

export const getChating = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  return res.render("chat", { pageTitle: "Chating Room", user });
};
export const postChating = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  // return res.redirect("/");
  return res.redirect(`/users/${id}/chat`);
};
