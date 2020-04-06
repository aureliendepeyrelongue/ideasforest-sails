/**
 * Post.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    title: { type: 'string', required: true , minLength:1, maxLength:100},
    content: { type: 'string', required: true, minLength:50},
    author: { model: 'user'},
    comments : {collection : 'postComment', via: 'post'},
    likes : { collection : 'like', via: 'post'}
  },

};

