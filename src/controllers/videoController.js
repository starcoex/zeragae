import Video from "../models/Video";
import User from "../models/User";

export const see = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner");
  // const owner = await User.findById(video.owner);
  if (!video) {
    return res.status(404).render("404");
  }
  return res.render("see", {
    pageTitle: `Watching ${video.title}`,
    video,
  });
};
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404");
  }
  return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.status(404).render("404");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
  res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = async (req, res) => {
  const {
    body: { title, description, hashtags },
    file: { path },
    session: {
      user: { _id },
    },
  } = req;

  try {
    await Video.create({
      title,
      description,
      fileUrl: path,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    res.redirect("/");
  } catch (error) {
    res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id, createdAt } = req.params;
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};
