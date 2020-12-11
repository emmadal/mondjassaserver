import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schemas";
import { resolvers } from "./resolvers";
import mongoose from "mongoose";

const app = new ApolloServer({ typeDefs, resolvers });

// asynchronous function that allow us to connect on our database
const dbConnect = async (url) => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useCreateIndex:true,
      // useUnifiedTopology: true, // used for Mongo Atlas instead of local database
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
//   dbConnect(
//     "mongodb+srv://emmadal:reactjs2019@agenda-cluster-ruxrq.mongodb.net/agenda?retryWrites=true&w=majority"
//   );
  dbConnect("mongodb://localhost:27017/mondjassa");
  console.log(`🚀 GraphQL server started at ${url}`);
});
