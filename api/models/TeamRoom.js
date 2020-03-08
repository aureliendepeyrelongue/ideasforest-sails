/**
 * TeamRoom.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    team : {model: 'team', unique : true},
    messages : {collection: 'teamChatMessage', via : 'teamRoom'}
  },

};

