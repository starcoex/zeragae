import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  createAt: Date,
  hashtags: [{ type: String }],
  meta: {
    views: String,
    rating: Number,
  },
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
