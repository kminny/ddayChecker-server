const { makeExecutableSchema } = require('graphql-tools');

const resolvers = require('./graphql/resolvers/index');
const typeDefs = require('./graphql/typeDefs/index');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = schema;
