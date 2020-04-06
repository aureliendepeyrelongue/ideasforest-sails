/* eslint-disable no-undef */
/**
 * CommentController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  async postComment(req,res){
    try{
      PostComment.validate('content', req.body.content);
    }
    // eslint-disable-next-line no-unused-vars
    catch(err){
      return res.json({error : true});
    }
    var comment = await PostComment.create({author:req.session.userId,post:req.body.postId,content:req.body.content}).fetch();
    var author = await User.findOne({id:req.session.userId}).populate('profile');
    comment.author = author;
    comment.author.profile = author.profile[0];
    return res.json({comment});

  }

};

