const express = require("express");
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server-express");
require("dotenv").config();

////   GRAPHQL ///
const typeDefs = require("./graphql/schema");
const { Query } = require("./graphql/resolvers/query");
const { Mutation } = require("./graphql/resolvers/mutation");
const { User } = require("./graphql/resolvers/user");
const { Post } = require("./graphql/resolvers/post");
const { Category } = require("./graphql/resolvers/category");

const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    User,
    Post,
    Category,
  },

  //We can have access to the request objects via the context
  //What ever we return in the context below will be accessible in the resovers' arogument of 'context'
  context: ({ req }) => {
    req.headers.authorization =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZyYW5jaXNAZ21haWwuY29tIiwiX2lkIjoiNjNhNmU1YjM0ZDQ2ZTUwZDZmYWM0Mzk2IiwiaWF0IjoxNjcxODgyMTYzLCJleHAiOjE2NzI0ODY5NjN9.sAoN1hjWh0kokFvhe5Azg2QZ7vh_dsTKnk2sbywwWSQ";
    return { req };
  },
});

server.applyMiddleware({ app });
const PORT = process.env.PORT || 9000;

mongoose
  .connect(
    "mongodb+srv://shubham:zN0wEboXgHyEO0Fr@cluster0.cpxbd4r.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT} and database is connected...`
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });
