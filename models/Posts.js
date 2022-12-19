const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
     user: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: 'User'
     },
     title: {
       type: String,
       required: true,
     },
    picture: {
      type: String,
      default: null,
    },
    status: {
      type: Number,
      default: 0,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
