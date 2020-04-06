/* eslint-disable no-undef */
/**
 * RoomController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  async getNewRoomConnection(req,res){
    sails.sockets.join(req,'new-room-'+req.session.userId);
    return res.ok();
  },

  async postNewRoomChatMessagesConnection(req,res){
    sails.sockets.join(req,'chat-room-'+req.body.roomId);
    return res.ok();
  },
  async postRoom(req,res){
    var user = await User.findOne({id:req.session.userId}).populate('rooms').populate('profile');
    var foundRoom = null;
    var toUserId = parseInt(req.param('userId'));
    for (let i = 0; i < user.rooms.length && !foundRoom; i++) {
      let room = await Room.findOne({id:user.rooms[i].id}).populate('users');
      for (let j = 0; j < room.users.length && !foundRoom; j++) {
        if(room.users[j].id === toUserId){
          foundRoom = room;
        }
      }
    }
    if(foundRoom){
      await LastSelectedRoom.update({user:req.session.userId}).set({room:foundRoom.id});
    }
    else{
      var room = await Room.create({createdBy:req.session.userId}).fetch();
      await Room.addToCollection(room.id, 'users', [req.session.userId, req.param('userId')]);
      await LastSelectedRoom.update({user:req.session.userId}).set({room:room.id});

    }

    return res.redirect('/messages');
  },
  async getRoomsChatMessagesConnection(req,res){
    let user = await User.findOne({id:req.session.userId}).populate('rooms');
    user.rooms.forEach(room => {
      sails.sockets.join(req,'chat-room-'+room.id);
    });
    return res.ok();
  }

};

