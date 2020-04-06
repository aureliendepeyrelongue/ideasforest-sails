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
    let user = await User.findOne({id:req.session.userId}).populate('rooms').populate('lastSelectedRoom');
    user.lastSelectedRoom = user.lastSelectedRoom[0];
    var i=0;
    while (i < user.rooms.length) {
      user.rooms[i] = await Room.findOne({id:user.rooms[i].id}).populate('messages').populate('users');
      if(user.rooms[i].messages.length || user.rooms[i].createdBy === user.id){
        for (let j = 0; j < user.rooms[i].messages.length; j++) {
          user.rooms[i].messages[j] = await ChatMessage.findOne({id:user.rooms[i].messages[j].id}).populate('author');
          user.rooms[i].messages[j].createdAt= sails.helpers.dateHelper(user.rooms[i].messages[j].createdAt);
        }
        for (let j = 0; j < user.rooms[i].users.length; j++) {
          user.rooms[i].users[j] = await User.findOne({id:user.rooms[i].users[j].id}).populate('profile');
          user.rooms[i].users[j].profile = user.rooms[i].users[j].profile[0];
        }
        i++;
      }
      else{
        user.rooms.splice(i,1);
      }

    }

    return res.json(user);
  },

  async postChatMessage(req,res) {
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
      chatMessage.createdAt = sails.helpers.dateHelper(chatMessage.createdAt);
      var room = await Room.findOne({id:req.body.roomId}).populate('messages').populate('users');
      //utiliser la base de donnée avec un attribut firstSend = true (default)
      if(room.messages.length === 1){
        var toUser;
        for (let i = 0; i < room.users.length; i++) {
          room.users[i] = await User.findOne({id:room.users[i].id}).populate('profile');
          room.users[i].profile = room.users[i].profile[0];
          if(room.users[i].id !== user.id){
            toUser = room.users[i];
          }
        }
        for (let i = 0; i < room.messages.length; i++) {
          room.messages[i] = await ChatMessage.findOne({id:room.messages[i].id}).populate('author');
          room.messages[i].createdAt = sails.helpers.dateHelper( room.messages[i].createdAt);
        }

        sails.sockets.broadcast('new-room-'+toUser.id,'new-room',room);
        sails.sockets.broadcast(sails.sockets.getId(req), 'chat-message', chatMessage);
      }
      else{

        sails.sockets.broadcast('chat-room-'+req.body.roomId,'chat-message',chatMessage);
      }

    } catch(err) {
      return res.serverError(err);
    }
    return res.ok();
  },

};

