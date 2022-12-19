const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    picture: {
      type: String,
      default: null,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Image", imageSchema);
