/**
 * ProfileController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  async getProfileDetail(req,res){
    var id = req.param('id');
    var user = await User.findOne({id}).populate('profile').populate('posts');
    user.profile = user.profile[0];
    return res.view('pages/profile/profile-detail', {user});
  }

};

