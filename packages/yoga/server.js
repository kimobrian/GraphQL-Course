const { GraphQLServer } = require('graphql-yoga');

var records = [];
const typeDefs = `
  type Query {
    fetchRecords: [String]
  }
  type Mutation {
    createRecord(recordData: String!): String!
    updateRecord(recordIndex: Int!, recordName: String!): String
  }
`;

const resolvers = {
	Query: {
		fetchRecords: () => records
	},
	Mutation: {
    createRecord: (_, { recordData }) => {
      records.push(recordData);
      return `New Record Created: ${recordData}`;
    },
		updateRecord: (_, { recordIndex, recordName }) => {
			if (records[+recordIndex] === undefined) {
				throw Error(`Record Index Does not Exist`);
			}
			records[+recordIndex] = recordName;
			return `Record Updated to: ${records[recordIndex]}`;
		}
	}
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log('Server is running on localhost:4000'));
