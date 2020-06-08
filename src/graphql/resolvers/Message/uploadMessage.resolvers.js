const { NEW_MESSAGE } = require('../../constants');
const db = require('../../../models');

const resolvers = {
  Mutation: {
    uploadMessage: async (_, args, { pubsub }) => {
      try {
        const message = await db.Message.create({
          ...args,
        });

        if (message) {
          pubsub.publish(NEW_MESSAGE, { newMessageSubscription: message });
          return {
            ok: true,
            message,
            error: '',
          };
        }
      } catch (error) {
        console.error('Creating message failed with error: ' + error);
        return {
          ok: false,
          message: null,
          error: 'error',
        };
      }
    },
  },
};

module.exports = resolvers;
