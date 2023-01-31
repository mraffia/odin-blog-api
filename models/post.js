const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, maxLength: 50 },
  content: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
  is_published: { type: Boolean, required: true, default: false },
});

// Virtual for post's URL
PostSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/posts/${this._id}`;
});

PostSchema.virtual("timestamp_formatted").get(function () {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED);
});

// Export model
module.exports = mongoose.model("Post", PostSchema);
