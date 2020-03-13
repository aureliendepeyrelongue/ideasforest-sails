/* eslint-disable no-undef */
/**
 * ChatMessageController
 *
 * @description :: Server-side actions for handling incoming reqs.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  getView(req,res){
    return res.view('pages/chat/chat');
  },
  async getChatMessages(req,res){
    let user = await User.findOne({id:req.session.userId}).populate('rooms');
    for (let i = 0; i < user.rooms.length; i++) {
      user.rooms[i] = await Room.findOne({id:user.rooms[i].id}).populate('messages').populate('users');
      for (let j = 0; j < user.rooms[i].messages.length; j++) {
        user.rooms[i].messages[j] = await ChatMessage.findOne({id:user.rooms[i].messages[j].id}).populate('author');
      }
      for (let j = 0; j < user.rooms[i].users.length; j++) {
        user.rooms[i].users[j] = await User.findOne({id:user.rooms[i].users[j].id}).populate('profile');
        user.rooms[i].users[j].profile = user.rooms[i].users[j].profile[0];
      }
    }
    return res.json(user);
  },
  async postChatMessage(req,res) {
    console.log('entrée');
    // Make sure this is a socket req (not traditional HTTP)
    if (!req.isSocket) {
      return res.badRequest();
    }

    try {
      let user = await User.findOne({id:req.session.userId});
      let chatMessage = await ChatMessage.create({content:req.body.message, room : req.body.roomId, author:user.id }).fetch();
      if(!chatMessage.id) {
        throw new Error('Message processing failed!');
      }
      chatMessage.author = user;
      console.log('channels broadcast');
      sails.sockets.broadcast('chat-room-'+req.body.roomId,chatMessage);
      console.log('chat-room-'+req.body.roomId);
    } catch(err) {
      return res.serverError(err);
    }

    return res.ok();
  },

  async getChatConnect(req,res){
    let user = await User.findOne({id:req.session.userId}).populate('rooms');
    console.log('channels connect');
    user.rooms.forEach(room => {
      sails.sockets.join(req,'chat-room-'+room.id);

      console.log('chat-room-'+room.id);

    });
    return res.ok();
  }

};

