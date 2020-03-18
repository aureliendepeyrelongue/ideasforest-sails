/**
 * LastSelectedRoom.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    room: { model: 'room'},
    user: { model: 'user'}
  },

};

