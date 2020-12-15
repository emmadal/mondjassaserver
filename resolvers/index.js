import { ApolloError } from "apollo-server";
import { UserModel, PostModel, CategoryModel } from "../models";
import { createPassword, checkPassword, generateToken } from "../utils";

export const resolvers = {
  Query: {
    users: async () => await UserModel.find().sort({ name: 1 }),
    user: async (_, { name }) => {
      return await UserModel.find({ name: { $regex: name, $options: "i" } });
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
      const user = await UserModel.findOne({ email: input.email });
      if (user) return new ApolloError("User already exist!");
      input.password = await createPassword(input.password);
      return await UserModel.create(input);
    },
    createCategory: async (_, { input }) => {
      const category = await CategoryModel.findOne({ name: input.name });
      if (category) return new ApolloError("Category already exist!");
      return await CategoryModel.create(input);
    },
    createPost: async (_, { input }) => {
      return await PostModel.create(input);
    },
    deletePost: async (_, { id }) => {
      await PostModel.deleteOne({ _id: id });
      return await PostModel.find().sort({ updateAt: -1 });
    },
    updatePost: async (_, { id, input }) => {
      await PostModel.updateOne({ _id: id }, { $set: input }, { new: true });
      return PostModel.find().sort({ updateAt: -1 });
    },
    login: async (_, { email, password }) => {
      const user = await UserModel.findOne({ email: email });
      if (user) {
        const isPassword = await checkPassword(user.password, password);
        if (isPassword) {
          user.token = generateToken({userID: user._id, userName: user.name});
          return user;
        }
      }
      return new ApolloError(
        "Login failed 😭. Please verify your email or password!"
      );
    },
  },
};
