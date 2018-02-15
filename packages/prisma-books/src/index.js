const { GraphQLServer } = require("graphql-yoga");
const { Prisma } = require("prisma-binding");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const APP_SECRET = "super_secret123";

function retrieveUserIdFromToken(ctx) {
  const authToken = ctx.request.get("Authorization");
  if (authToken) {
    const token = authToken.replace("Bearer ", "");
    const { userId } = jwt.verify(token, APP_SECRET);
    return userId;
  }
  throw new Error("Authentication Failed");
}

const resolvers = {
  Query: {
    fetchAllBooks: (parent, args, ctx, info) => {
      return ctx.db.query.books({}, info);
    }
  },
  Mutation: {
    createBook: (parent, args, context, info) => {
      const { title, description } = args;
      const userId = retrieveUserIdFromToken(context);
      return context.db.mutation.createBook(
        {
          data: {
            title,
            description,
            owner: {
              connect: { id: userId }
            }
          }
        },
        info
      );
    },
    signupUser: async (parent, args, context, info) => {
      const password = await bcrypt.hash(args.password, 10);
      const user = await context.db.mutation.createUser({
        data: { ...args, password }
      });
      return user;
    },

    loginUser: async (parent, args, context, info) => {
      const user = await context.db.query.user({
        where: { email: args.email }
      });
      if (!user) {
        throw new Error(`Could not find user with email: ${args.email}`);
      }

      const valid = await bcrypt.compare(args.password, user.password);
      if (!valid) {
        throw new Error("Invalid password");
      }

      const token = jwt.sign({ userId: user.id }, APP_SECRET);

      return {
        token,
        user
      };
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
