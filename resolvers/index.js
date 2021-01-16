require("dotenv").config();
import { ApolloError } from "apollo-server";
import { UserModel, PostModel, CategoryModel } from "../models";
import { createPassword, checkPassword, generateToken } from "../utils";

export const resolvers = {
  Query: {
    users: async () => await UserModel.find().sort({ name: 1 }),
    me: async (_, args, { user }) => {
      try {
        if (!user) throw new ApolloError("Veuillez vous authentifier.");
        return await UserModel.findById(user.id);
      } catch (error) {
        throw new ApolloError("Veuillez vous authentifier.");
      }
      // return await UserModel.find({ name: { $regex: name, $options: "i" } });
    },
    userID: async (_, { id }) => await UserModel.findById(id),
    posts: async () =>
      await PostModel.find().sort({ date: -1 }),
    post: async (_, { title }) => {
      return await PostModel.find({
        title: { $regex: title, $options: "i" },
      }).sort({ updateAt: 1 });
    },
    postID: async (_, { id }) => await PostModel.findById(id),
    categories: async () => await CategoryModel.find(),
    category: async (_, { id }) => await CategoryModel.findById(id),
  },

  Mutation: {
    createUser: async (_, { input }) => {
      try {
        const user = await UserModel.findOne({ email: input.email });
        if (user)
          throw new ApolloError("Un utilisateur existe déja avec ce compte!");
        input.password = await createPassword(input.password);
        return await UserModel.create(input);
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },
    updateUser: async (_, { id, input }, { user }) => {
      if (!user)
        throw new ApolloError(
          "Veuillez vous authentifier pour mettre à jour votre profil."
        );
      await UserModel.updateOne({ _id: id }, { $set: input }, { new: true });
      return await UserModel.findById(id);
    },
    createCategory: async (_, { input }) => {
      const category = await CategoryModel.findOne({ name: input.name });
      if (category) throw new ApolloError("Cette catégorie existe déjà.");
      return await CategoryModel.create(input);
    },
    createPost: async (_, { input }, { user }) => {
      try {
        if (!user)
          throw new ApolloError("Veuillez vous authentifier pour publier un article.");
        const check_user = await UserModel.findById(user.id);
        if (check_user) {
          input.deleted = false;
          input.author = user.id;
          const post = await PostModel.create(input);
          check_user.posts.push(post);
          await UserModel.updateOne(
            { _id: user.id },
            { $set: check_user },
            { new: true }
          );
          return post;
        }
      } catch (error) {
        throw new ApolloError("Veuillez vous authentifier pour publier un article.");
      }
    },
    deletePost: async (_, { id }, { user }) => {
      if (!user)
        throw new ApolloError(
          "Veuillez vous authentifier pour supprimer cet article."
        );
      const check_user = await UserModel.findById(user.id);
      if(check_user){
        const docIndex = check_user.posts.findIndex(e => id === e)
        check_user.posts.splice(docIndex, 1);
        await UserModel.updateOne(
          { _id: user.id },
          { $set: check_user },
          { new: true }
        );
      }
      await PostModel.deleteOne({ _id: id });
      return await PostModel.find().sort({ date: -1 });
    },
    updatePost: async (_, { id, input }, { user }) => {
      if (!user)
        throw new ApolloError(
          "Veuillez vous authentifier pour mettre à jour cet article."
        );
      await PostModel.updateOne({ _id: id }, { $set: input }, { new: true });
      return PostModel.find().sort({ date: -1 });
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
      throw new ApolloError(
        "Connexion échouée. Veuillez verifier votre adresse e-mail ou votre mot de passe."
      );
    },
  },
};
