import mongoose from "mongoose";



const postSchema = mongoose.Schema(
  {
    city: String,
    title: String,
    description: String,
    price: Number,
    phone: Number,
    deleted: Boolean,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    photos: [String],
    date: {type: Date, default: Date.now}
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

const userSchema = mongoose.Schema({
  name: String,
  email: { type: String, index: { unique: true } },
  password: String,
  phone: String,
  biography: String,
  imageUrl: String,
  posts: [postSchema],
});

const UserModel = mongoose.model("User", userSchema);
const PostModel = mongoose.model("Post", postSchema);
const CategoryModel = mongoose.model("Category", categorySchema);

export { UserModel, PostModel, CategoryModel };
