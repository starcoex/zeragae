import { videos } from "./homeController";
export const see = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  res.render("see", { pageTitle: `Watching ${video.title}`, video });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};
export const postEdit = (req, res) => {
  res.send("Post");
};
export const upload = (req, res) => res.send("Video Upload");

export const remove = (req, res) => res.send("Video Remove");
