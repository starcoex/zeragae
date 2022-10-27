import Video from "../models/Video";
export const see = (req, res) => {
  res.render("see", { pageTitle: `Watching ${video.title}`, video });
};
export const getEdit = (req, res) => {
  res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};
export const postEdit = (req, res) => {
  res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
  res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = (req, res) => {
  res.redirect("/");
};

export const remove = (req, res) => res.send("Video Remove");
