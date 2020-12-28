require("dotenv").config();
import { ApolloError } from "apollo-server";
import { UserModel, PostModel, CategoryModel } from "../models";
import { createPassword, checkPassword, generateToken } from "../utils";

export const resolvers = {
  Query: {
    users: async () => await UserModel.find().sort({ name: 1 }),
    me: async (_, args, { user }) => {
      if (!user) throw new Error("You are not authenticated");
      return await UserModel.findById(user.id);
      // return await UserModel.find({ name: { $regex: name, $options: "i" } });
    },
    posts: async () =>
      await PostModel.find({ deleted: false }).sort({ updateAt: -1 }),
    post: async (_, { title }) => {
      return await PostModel.find({
        title: { $regex: title, $options: "i" },
      }).sort({ updateAt: 1 });
    },
    categories: async () => await CategoryModel.find(),
    category: async (_, { id }) => await CategoryModel.findById(id),
  },

  Mutation: {
    createUser: async (_, { input }) => {
      try {
        const user = await UserModel.findOne({ email: input.email });
        if (user) throw new Error("User already exist!");
        input.password = await createPassword(input.password);
        return await UserModel.create(input);
      } catch (error) {
        console.log("error:" + error);
      }
    },
    createCategory: async (_, { input }) => {
      const category = await CategoryModel.findOne({ name: input.name });
      if (category) throw new ApolloError("Category already exist!");
      return await CategoryModel.create(input);
    },
    createPost: async (_, { input }, { user }) => {
      try {
        if (!user)
          throw new Error("You are not authenticated to post an article");
        const check_user = await UserModel.findById(user.id);
        if (check_user) {
          input.deleted = false;
          input.author = user.id;
          const post = await PostModel.create(input);
          check_user.posts.push(post._id);
          await UserModel.updateOne(
            { _id: user.id },
            { $set: check_user },
            { new: true }
          );
          return post;
        }
      } catch (error) {}
    },
    deletePost: async (_, { id }, { user }) => {
      if (!user)
        throw new Error("You are not authenticated to delete this article");
      await PostModel.deleteOne({ _id: id });
      return await PostModel.find().sort({ updateAt: -1 });
    },
    updatePost: async (_, { id, input }, { user }) => {
      if (!user)
        throw new Error("You are not authenticated to update this article");
      await PostModel.updateOne({ _id: id }, { $set: input }, { new: true });
      return PostModel.find().sort({ updateAt: -1 });
    },
    login: async (_, { email, password }) => {
      const user = await UserModel.findOne({ email: email });
      if (user) {
        const check_password = await checkPassword(user.password, password);
        if (check_password) {
          const token = await generateToken(user._id);
          return { token, user };
        }
      }
      throw new Error("Login failed 😭. Please verify your email or password!");
    },
  },
};
