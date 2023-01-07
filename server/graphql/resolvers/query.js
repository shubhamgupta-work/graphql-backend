const User = require("../../models/user");
const authorize = require("../../utils/isAuth");
const {
  UserInputError,
  AuthenticationError,
  ApolloError,
} = require("apollo-server-express");
const Category = require("../../models/category");
const Post = require("../../models/post");
const { sortArgsHelper } = require("../../utils/tools");

module.exports = {
  Query: {
    user: async (parent, args, context, info) => {
      try {
        const req = await authorize(context.req);

        if (req.user._id.toString() !== args.id.toString()) {
          console.log("error");
          throw new AuthenticationError("The user is not you.");
        }
        const user = await User.findById(args.id);

        user.password = "";
        return user;
      } catch (err) {
        throw err;
      }
    },

    isAuth: async (parent, args, context, info) => {
      try {
        const req = await authorize(context.req, true);

        if (!req.isAuth) {
          throw new AuthenticationError("Bad Token");
        }
        return { _id: req.user._id, email: req.email, token: req.token };
      } catch (err) {
        throw err;
      }
    },
    category: async (parent, args, context, info) => {
      try {
        const category = await Category.findById(args.catId);
        return category;
      } catch (err) {
        throw err;
      }
    },
    categories: async (parent, args, context, info) => {
      try {
        const categories = await Category.find({});
        return categories;
      } catch (err) {
        throw err;
      }
    },
    post: async (parent, args, context, info) => {
      try {
        const post = await Post.findById(args.id);
        return post;
      } catch (err) {
        throw err;
      }
    },
    posts: async (parent, { sort, query }, context, info) => {
      try {
        let queryByArgs = {};
        let sortArgs = sortArgsHelper(sort);
        if (query) {
          queryByArgs[query.key] = query.value;
        }
        const posts = await Post.find(queryByArgs)
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
