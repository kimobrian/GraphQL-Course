const express = require('express');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const bodyParser = require('body-parser');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

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