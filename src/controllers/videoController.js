import { videos } from "./homeController";
export const see = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  res.render("see", { pageTitle: `Watching ${video.title}`, video });
};

export const upload = (req, res) => res.send("Video Upload");
export const edit = (req, res) => res.send("Video Edit");
export const remove = (req, res) => res.send("Video Remove");
