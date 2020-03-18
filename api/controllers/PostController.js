/* eslint-disable no-undef */
/**
 * PostController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  async getPostList(req,res){
    var posts = await Post.find().populate('likes');
    for (let i = 0; i < posts.length; i++) {
      const el = posts[i];
      el.author = await User.findOne({id: el.author}).populate('profile');
      el.author.profile = el.author.profile[0];
      var liked = false;
      if(req.me && el.likes){
        for (let k = 0; k < el.likes.length && !liked; k++) {
          if(el.likes[k].author === req.session.userId){
            liked = true;
          }
        }
      }
      el.liked = liked;
    }
    return res.view('pages/post/post-list',{posts});
  },

  async getPostDetail(req,res){

    let id = req.param('id');
    var post = await Post.findOne({id}).populate('likes').populate('comments');
    post.author = await User.findOne({id: post.author}).populate('profile');
    post.author.profile = post.author.profile[0];

    for (let i = 0; i < post.comments.length; i++) {
      var el = post.comments[i];
      el.author = await User.findOne({id: el.author}).populate('profile');
      el.author.profile = el.author.profile[0];
    }
    var liked = false;
    if(req.me && post.likes){
      for (let k = 0; k < post.likes.length && !liked; k++) {
        if(post.likes[k].author === req.session.userId){
          liked = true;
        }
      }
    }
    post.liked = liked;
    return res.view('pages/post/post-detail', {post});
  }

};

