const { GraphQLServer } = require("graphql-yoga");
const { Prisma } = require("prisma-binding");

const resolvers = {
  Query: {
    fetchAllBooks: (parent, args, ctx, info) => {
      return ctx.db.query.books({}, info);
    }
  },
  Mutation: {
    createBook: (parent, args, context, info) => {
      const { title, description } = args;
      return context.db.mutation.createBook(
        { data: { title, description } },
        info
      );
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: "src/generated/prisma.graphql",
      endpoint: "https://eu1.prisma.sh/brian-kim/prisma-books/dev", // the endpoint of the Prisma DB service
      secret: "mysecret123", // specified in database/prisma.yml
      debug: true // log all GraphQL queryies & mutations
    })
  })
});

server.start(() => console.log("Server is running on http://localhost:4000"));
