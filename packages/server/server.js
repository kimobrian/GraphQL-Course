const express = require('express');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const bodyParser = require('body-parser');
const schema = require('./schema');
const resolvers = require('./resolvers');
 
const PORT = 3500;
 
const app = express();

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
 
app.listen(PORT, ()=> {
  console.log("Server Running on Port:", PORT);
});