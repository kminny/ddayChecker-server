const { ApolloServer, PubSub } = require('apollo-server-express');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const http = require('http');

const schema = require('./schema');
const db = require('./models');

const PORT = process.env.PORT || 5000;
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || '/graphql';
const SUBSCRIPTION_ENDPOINT = process.env.SUBSCRIPTION_ENDPOINT || '/subscriptions';

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(helmet());

const pubsub = new PubSub();
pubsub.ee.setMaxListeners(99);

const server = new ApolloServer({
  schema,
  subscriptions: {
    path: SUBSCRIPTION_ENDPOINT,
  },
  context: ({ req, connection }) => {
    return {
      req,
      pubsub: pubsub,
    };
  },
});

server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
httpServer.timeout = 5000;

app.get('/', (req, res) => res.end('Graphql Server'));
app.get('/healthCheck', (req, res) => res.status(200).send('Instance is Healthy'));

db.sequelize
  .sync()
  .then(() => {
    console.log('Database Connection Succeed');
    httpServer.listen({ port: PORT }, () => {
      console.info(`GraphQL server running on http://localhost:${PORT}${server.graphqlPath}`);
      console.info(
        `Subscription server running on ws://localhost:${PORT}${server.subscriptionsPath}`
      );
    });
  })
  .catch((err) => {
    console.error('Database Connection failed with: ' + err);
  });

// httpServer.listen({ port: PORT }, () => {
//   console.info(`GraphQL server running on http://localhost:${PORT}${server.graphqlPath}`);
//   console.info(`Subscription server running on ws://localhost:${PORT}${server.subscriptionsPath}`);
// });
