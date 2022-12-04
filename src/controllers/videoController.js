import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

export const see = async (req, res) => {
  const { id } = req.params;
  // const video = await Video.findById(id).populate("owner").populate("comments");
  const video = await Video.findById(id).populate("owner").populate("comments");
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
  const {
    session: { _id },
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    req.flash("error", "Not authorized");
    return res.status(404).render("404");
  }
  if (String(video.owner !== String(_id))) {
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};
export const postEdit = async (req, res) => {
  const {
    session: { _id },
    params: { id },
    body: { title, description, hashtags },
  } = req;
  const video = await Video.findById({ _id: id });
  if (!video) {
    return res.status(404).render("404");
  }
  if (String(video.owner !== String(_id))) {
    req.flash("error", "You are not the the owner of the video.");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "Changes saved.");
  return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
  res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = async (req, res) => {
  const {
    body: { title, description, hashtags },
    files: { video, thumb },
    session: {
      user: { _id },
    },
  } = req;

  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: video[0].path,
      thumbUrl: thumb[0].path,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);

    user.videos.push(newVideo._id);
    user.save();

    res.redirect("/");
  } catch (error) {
    res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const {
    session: { _id },
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner !== String(_id))) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    session: { user },
    params: { id },
    body: { text },
  } = req;

  const video = await Video.findById(id);

  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();

  return res.status(201).json({ newCommentId: comment._id });
};

export const deleteComment = async (req, res) => {
  console.log(req.body);
  const {
    body: { videoId },
    params: { id },
    session: { user },
  } = req;
  const video = await Video.findById(videoId);
  console.log(video);
  const comment = await Comment.findById(videoId);
  console.log(comment);
  // const comment = await Comment.findById(videoId)
  //   .populate("video")
  //   .populate("owner");
  // console.log(comment);
  // if (!comment) {
  //   return res.sendStatus(404);
  // }
  // if (String(user._id) !== String(comment.owner_id)) {
  //   return res.status(403).redirect("/");
  // }
  await Comment.findByIdAndDelete(id);
  return res.sendStatus(200);
  // return res.status(200).redirect(`/videos/${comment.video._id}`);
};
