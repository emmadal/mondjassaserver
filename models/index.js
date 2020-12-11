import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: String,
  email: { type: String, index: { unique: true } },
  password: String,
  phone: Number,
  biography: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  picture: {
    filename: String,
    mimetype: String,
    encoding: String,
  },
});

const postSchema = mongoose.Schema(
  {
    city: String,
    title: String,
    description: String,
    price: Number,
    phone: Number,
    photos: [String],
  },
  { timestamps: true }
);

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      index: { unique: true },
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);
const PostModel = mongoose.model("Post", postSchema);
const CategoryModel = mongoose.model("Category", categorySchema);

export { UserModel, PostModel, CategoryModel };
