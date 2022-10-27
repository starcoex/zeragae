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
  const { id } = req.params;
  const { title } = req.body;
  videos[id - 1].title = title;
  res.redirect(`/videos/${id}`);
};
export const upload = (req, res) => res.send("Video Upload");

export const remove = (req, res) => res.send("Video Remove");
