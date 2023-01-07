const User = require("../../models/user");
const Post = require("../../models/post");
const Category = require("../../models/category");

//Apollo server provides various error classes for throwing a specific type of error
//AuthenticationError,
//ForbiddenError
// UserInputError
//ApolloError (this is a generic error)

const {
  UserInputError,
  AuthenticationError,
  ApolloError,
} = require("apollo-server-express");
const authorize = require("../../utils/isAuth");

module.exports = {
  Mutation: {
    ////////  Users /////
    authUser: async (parent, args, context, info) => {
      try {
        //here we don't get email and password from the req.body
        //and we can also check whether the fields fultill certain criteria, the requiredness is already taked care by the typeDefs

        // CHECK THE EMAIL
        const user = await User.findOne({ email: args.fields.email });
        if (!user) {
          throw new AuthenticationError(
            "Email not found. Please check before entering..."
          );
        }

        // CHECK THE PASSWORD
        const correctPassword = await user.comparePassword(
          args.fields.password
        );
        if (!correctPassword) {
          throw new AuthenticationError("Your password is incorrect");
        }

        //IF PASSWORD CORRECT, SEND TOKEN
        const token = await user.generateToken();
        if (!token) {
          throw new AuthenticationError("Issues creating token...");
        }

        //RETURN
        return {
          _id: token._id,
          email: token.email,
          token: token.token,
        };
      } catch (err) {
        if (err.code === 11000) {
          throw new AuthenticationError(
            "Email already exists, please login..."
          );
        }
      }
    },
    signUp: async (parent, args, context, info) => {
      try {
        //here we don't get email and password from the req.body
        //and we can also check whether the fields fultill certain criteria, the requiredness is already taked care by the typeDefs
        const user = await User.create({
          email: args.fields.email,
          password: args.fields.password,
        });
        const token = await user.generateToken();
        console.log(token);

        if (!token) {
          throw new AuthenticationError(
            "Something went wrong with email or password..."
          );
        }

        return token._doc;
      } catch (err) {
        // if (err.code === 11000) {
        //   throw new AuthenticationError(
        //     "Email already exists, please login..."
        //   );
        // }
        //We can manually set the code
        throw new ApolloError("Something went wrong...", 400, err);
      }
    },
    updateUserProfile: async (parent, args, context, info) => {
      try {
        const req = await authorize(context.req);
        const { name, lastname } = args;
        console.log(req.user);
        const user = await User.findByIdAndUpdate(
          req.user._id,
          {
            name,
            lastname,
          },
          { new: true }
        );
        return user;
      } catch (err) {
        throw err;
      }
    },
    updateUserEmailPass: async (parent, args, context, info) => {
      try {
        const req = await authorize(context.req);
        const user = await User.findById(req.user._id);

        if (args.email) {
          user.email = args.email;
        }

        if (args.password) {
          user.password = args.password;
        }

        await user.generateToken();
        const updatedUser = await user.save();

        return {
          _id: updatedUser._doc._id,
          email: updatedUser._doc.email,
          token: updatedUser._doc.token,
        };
      } catch (err) {
        console.log(err);
        throw new ApolloError("Something went wrong please try again...", err);
      }
    },

    /////  Posts ////
    createPost: async (parent, { fields }, context, info) => {
      try {
        const req = await authorize(context.req);

        //// validate the fields

        const post = await Post.create({
          title: fields.title,
          excerpt: fields.excerpt,
          content: fields.content,
          author: req.user._id,
          category: fields.category,
        });

        return post._doc;
      } catch (err) {
        throw err;
      }
    },
    updatePost: async (parent, args, context, info) => {
      try {
        const req = await authorize(context.req);
        let post = await Post.findById(args.postId);
        if (post.author.toString() !== req.user._id.toString()) {
          throw new AuthenticationError(
            "You can't edit this post, because you didn't create it."
          );
        }

        post = await Post.findByIdAndUpdate(args.postId, args.fields, {
          new: true,
        });
        return post;
      } catch (err) {
        throw err;
      }
    },
    deletePost: async (parent, args, context, info) => {
      try {
        const req = await authorize(context.req);
        let post = await Post.findById(args.postId);
        if (post.author.toString() !== req.user._id.toString()) {
          throw new AuthenticationError(
            "You can't edit this post, because you didn't create it."
          );
        }
        post = await Post.findByIdAndDelete(args.postId);

        return true;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },

    ///// Category
    createCategory: async (parent, args, context, info) => {
      try {
        const req = await authorize(context.req);
        console.log;
        const category = await Category.create({
          name: args.name,
          author: req.user._id,
        });
        return category;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    updateCategory: async (parent, args, context, info) => {
      try {
        const req = await authorize(context.req);
        const category = await Category.findByIdAndUpdate(
          args.catId,
          {
            name: args.name,
          },
          { new: true }
        );
        return category;
      } catch (err) {
        throw err;
      }
    },
    deleteCategory: async (parent, args, context, info) => {
      try {
        const req = await authorize(context.req);
        const posts = await Post.find({
          category: args.catId,
        }).countDocuments();
        if (posts > 0) {
          throw new UserInputError(
            "This category can't be delete because the category has posts under it."
          );
        }
        await Category.findByIdAndDelete(args.catId);
        return true;
      } catch (err) {
        throw err;
      }
    },
  },
};
