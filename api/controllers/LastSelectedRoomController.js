/* eslint-disable no-undef */
/**
 * LastSelectedRoomController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  async putLastSelectedRoom(req,res){
    if (!req.isSocket) {
      return res.badRequest();
    }
    await LastSelectedRoom.updateOne({user: req.session.userId}).set({room: req.body.roomId});

    return res.ok();
  }

};

