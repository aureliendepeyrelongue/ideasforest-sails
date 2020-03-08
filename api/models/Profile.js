/**
 * Profile.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    about: { type: 'string'},
    avatar: { type: 'string'},
    author: { model: 'user', unique : true}
  },

};

