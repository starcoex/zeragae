import Video from "../models/Video";
export const see = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404");
  }
  return res.render("see", { pageTitle: `Watching ${video.title}`, video });
};
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404");
  }
  return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.render("404");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: hashtags
      .split(",")
      .map((hashtag) => (hashtag.startsWith("#") ? hashtag : `#${hashtag}`)),
  });
  return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
  res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      hashtags,
    });
    res.redirect("/");
  } catch (error) {
    res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const remove = (req, res) => res.send("Video Remove");
