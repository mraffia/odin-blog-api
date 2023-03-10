const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true, maxLength: 20 },
  username: { type: String, required: true, maxLength: 50 },
  password: { type: String, required: true },
});

// Virtual for user's URL
UserSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/users/${this._id}`;
});

// Export model
module.exports = mongoose.model("User", UserSchema);
