const Post = require("../models/Posts");
const Image = require("../models/Image");
const User = require("../models/User");

// @desc Get all notes
// @route GET /notes
// @access Private
const getAllPosts = async (req, res) => {
  // Get all notes from MongoDB
  const posts = await Post.find().lean();

  // If no notes
  if (!posts?.length) {
    return res.status(400).json({ message: "No posts found" });
  }

  // Add username to each note before sending the response
  // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE
  // You could also do this with a for...of loop
  // const postsWithUser = await Promise.all(
  //   notes.map(async (note) => {
  //     const user = await User.findById(note.user).lean().exec();
  //     return { ...note, username: user.username };
  //   })
  // );

  res.json(posts);
};

// @desc Create new note
// @route POST /notes
// @access Private
const createNewPost = async (req, res) => {
  const { title, content, user } = req.body;

  
  if (!title || !content) {
    return res.status(400).json({ message: "Content field and title are required" });
  }

   // Check for duplicate title
  //  const duplicate = await Post.findOne({ title })
  //    .lean()
  //    .exec()
  //  if (duplicate) {
  //    return res.status(409).json({ message: "Duplicate note title" });
  //  }
   console.log(req?.file?.filename)
  // Create and store the new user
  const note = await Post.create({
    user: user,
    title: title,
    picture: req?.file?.filename ? `http://localhost:3500/image/${req.file.filename}` : null,
    content: content
  });

  if (note) {
    // Created
    return res.status(201).json({ message: "New post created" });
  } else {
    return res.status(400).json({ message: "Invalid post data received" });
  }
};

const createNewImage = async (req, res) => {

   console.log(req?.file?.filename)
  // Create and store the new user
  const img = await Image.create({
    picture: req?.file?.filename ? `http://localhost:3500/image/${req.file.filename}` : null,
  });

  if (img) {
    // Created
    return res.status(201).json({ message: "New image posted" });
  } else {
    return res.status(400).json({ message: "Invalid post data received" });
  }
};

module.exports = {
  getAllPosts,
  createNewPost,
  createNewImage
};
