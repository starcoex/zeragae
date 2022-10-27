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
export const getUpload = (req, res) => {
  res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = (req, res) => {
  const { title } = req.body;
  const newVideo = {
    title,
    rating: 5,
    comments: 2,
    creatdAt: "just now",
    views: 1,
    id: videos.length + 1,
  };
  videos.push(newVideo);
  res.redirect("/");
};

export const remove = (req, res) => res.send("Video Remove");
