const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  author: { type: String, required: true, maxLength: 100 },
  content: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
});

// Virtual for comment's URL
CommentSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/comment/${this._id}`;
});

// Export model
module.exports = mongoose.model("Comment", CommentSchema);
