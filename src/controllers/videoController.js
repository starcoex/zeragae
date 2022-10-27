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
export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  const video = new Video({
    title,
    description,
    createAt: Date.now(),
    hashtags: hashtags.split(",").map((hashtag) => `#${hashtag}`),
    meta: {
      views: 0,
      rating: 0,
    },
  });
  await video.save();
  res.redirect("/");
};

export const remove = (req, res) => res.send("Video Remove");
