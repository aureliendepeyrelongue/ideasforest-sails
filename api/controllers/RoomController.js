/* eslint-disable no-undef */
/**
 * RoomController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  async postRoom(req,res){
    var user = await User.findOne({id:req.session.userId}).populate('rooms');
    var foundRoom = null;
    var userId = parseInt(req.param('userId'));
    for (let i = 0; i < user.rooms.length && !foundRoom; i++) {
      let room = await Room.findOne({id:user.rooms[i].id}).populate('users');
      for (let j = 0; j < room.users.length && !foundRoom; j++) {
        if(room.users[j].id === userId){
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
  }

};

