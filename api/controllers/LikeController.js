/* eslint-disable no-undef */
/**
 * LikeController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  async postLike(req,res){
    var postId = req.body.postId;
    var like = await Like.findOne({author:req.session.userId,post:postId});
    var liked;
    if(like){
      await Like.destroyOne({id:like.id});
      liked=false;
    }
    else{
      await Like.create({author:req.session.userId,post:postId});
      liked=true;
    }
    return res.json({likes:(await Like.find({post:postId})).length, liked});
  },
  async getLikes(req,res){

  }
};

