const express = require('express');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const bodyParser = require('body-parser');

// Some fake data
const authors = [
  {
    id: "1",
    info: {
      name: "Joe Kelly",
      age: 32,
      gender: "M",
    }
  },
  {
    id: "2",
    info: {
      name: "Mary Jane",
      age: 27,
      gender: "F",
    }
  }
  
];

// The GraphQL schema in string form
const typeDefs = `
type Author {
	id: ID!
	info: Person
}
type Person {
	name: String!
	age: Int
	gender: String
}
type Query {
  getAuthors: [Author]
}
`;

// The resolvers
const resolvers = {
  Query: { getAuthors: () => authors },
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});
 
const PORT = 3500;
 
const app = express();

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
 
app.listen(PORT, ()=> {
  console.log("Server Running on Port:", PORT);
});