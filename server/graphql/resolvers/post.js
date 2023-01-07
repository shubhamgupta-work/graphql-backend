const Category = require("../../models/category");
const Post = require("../../models/post");
const User = require("../../models/user");
const { sortArgsHelper } = require("../../utils/tools");

module.exports = {
  Post: {
    author: async (parent, args, context, info) => {
      try {
        const user = await User.findById(parent.author).select("-password");
        return user;
      } catch (err) {
        throw err;
      }
    },
    category: async (parent, args, context, info) => {
      try {
        const category = await Category.findById(parent.category);
        return category;
      } catch (err) {
        throw err;
      }
    },
    related: async (parent, args, context, info) => {
      try {
        const sortArgs = sortArgsHelper(args.sort);
        const posts = await Post.find({
          category: parent.category,
          title: { $ne: parent.title },
        })
          .sort([[sortArgs.sortBy, sortArgs.order]])
          .skip(sortArgs.skip)
          .limit(sortArgs.limit);

        return posts;
      } catch (err) {
        throw err;
      }
    },
  },
};
