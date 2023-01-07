const Post = require("../../models/post");
const User = require("../../models/user");

module.exports = {
  Category: {
    author: async (parent, args, context, info) => {
      try {
        const author = await User.findById(parent.author).select("-password");
        return author;
      } catch (err) {
        throw err;
      }
    },
    posts: async (parent, args, context, info) => {
      try {
        const posts = await Post.find({ category: parent._id });
        return posts;
      } catch (err) {
        throw err;
      }
    },
  },
};
