const Category = require("../../models/category");
const Post = require("../../models/post");
const authorize = require("../../utils/isAuth");
const { sortArgsHelper } = require("../../utils/tools");

//Here we will use "parent" because these are the resolvers of a custom type's fields, its children, so we can get most of the information through the "parent" which the parent document
// in categories we use parent._id, because we only want the categories that has the parent's id. since its parent is the User, giving us the userId
module.exports = {
  User: {
    posts: async (parent, args, context, info) => {
      try {
        const sortByArgs = sortArgsHelper(args.sort);
        const posts = await Post.find({ author: parent._id })
          .sort([[sortByArgs.sortBy, sortByArgs.order]])
          .skip(sortByArgs.skip)
          .limit(sortByArgs.limit);
        return posts;
      } catch (err) {
        throw err;
      }
    },
    categories: async (parent, args, context, info) => {
      try {
        const categories = await Category.find({ author: parent._id });
        return categories;
      } catch (err) {
        throw err;
      }
    },
  },
};
