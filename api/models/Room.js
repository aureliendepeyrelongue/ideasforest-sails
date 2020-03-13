/**
 * Room.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    users : {collection : 'user', via : 'rooms'},
    messages : {collection: 'chatMessage', via : 'room'}
  },

};

