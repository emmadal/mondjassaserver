
require('dotenv').config()
import jwt from 'jsonwebtoken'
import { ApolloServer} from "apollo-server";
import { typeDefs } from "./schemas";
import { resolvers } from "./resolvers";
import mongoose from "mongoose";

const getUser = (token) => {
  try {
    if (token) {
      return jwt.verify(token, process.env.SECRET_KEY);
    }
    return null;
  } catch (error) {
    return null;
  }
};

const app = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || "";
    return { user: getUser(token.replace("Bearer", "")) };
  },
});

// asynchronous function that allow us to connect on our database
const dbConnect = async (url) => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useCreateIndex:true,
      useUnifiedTopology: true, // used for Mongo Atlas instead of local database
    });
    console.log(`connected to database with mogoose version ${mongoose.version}`);
    
  } catch (error) {
    console.error(
      "Database not available. Please ensure you that the mongod.service is enable or verify your connection internet."
    );
  }
};

// starting our GraphQL server...
app.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  dbConnect(process.env.DBHOST);
  console.log(`🚀 GraphQL server started at ${url}`);
});
