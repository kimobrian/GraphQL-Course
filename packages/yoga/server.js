const { GraphQLServer, PubSub } = require('graphql-yoga');

var records = [];
const typeDefs = `
  type Query {
    fetchRecords: [String]
  }
  type Mutation {
    createRecord(recordData: String!): String!,
    updateRecord(recordIndex: Int!, recordName: String!): String
  },
  type Subscription {
    newRecord: String
  }
`;

const RECORD_CHANNEL = "RECORDS";

const resolvers = {
	Query: {
		fetchRecords: () => records
	},
	Mutation: {
    createRecord: (_, { recordData }, { pubsub }) => {
      records.push(recordData);
      pubsub.publish(RECORD_CHANNEL, { newRecord: recordData })
      return `New Record Created: ${recordData}`;
    },
		updateRecord: (_, { recordIndex, recordName }) => {
			if (records[+recordIndex] === undefined) {
				throw Error(`Record Index Does not Exist`);
			}
			records[+recordIndex] = recordName;
			return `Record Updated to: ${records[recordIndex]}`;
		}
  },
  Subscription: {
    newRecord: {
      subscribe: (parent, args, { pubsub }) => {
        return pubsub.asyncIterator(RECORD_CHANNEL);
      },
    }
  },
};

const pubsub = new PubSub();
const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub }});
server.start({ port: 5000 }, ()=> {
  console.log('Server is running on localhost:')
});