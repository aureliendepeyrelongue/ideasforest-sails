/* eslint-disable no-undef */
/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function() {

  // Import dependencies
  var path = require('path');

  // This bootstrap version indicates what version of fake data we're dealing with here.
  var HARD_CODED_DATA_VERSION = 0;

  // This path indicates where to store/look for the JSON file that tracks the "last run bootstrap info"
  // locally on this development computer (if we happen to be on a development computer).
  var bootstrapLastRunInfoPath = path.resolve(sails.config.appPath, '.tmp/bootstrap-version.json');

  // Whether or not to continue doing the stuff in this file (i.e. wiping and regenerating data)
  // depends on some factors:
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // If the hard-coded data version has been incremented, or we're being forced
  // (i.e. `--drop` or `--environment=test` was set), then run the meat of this
  // bootstrap script to wipe all existing data and rebuild hard-coded data.
  if (sails.config.models.migrate !== 'drop' && sails.config.environment !== 'test') {
    // If this is _actually_ a production environment (real or simulated), or we have
    // `migrate: safe` enabled, then prevent accidentally removing all data!
    if (process.env.NODE_ENV==='production' || sails.config.models.migrate === 'safe') {
      sails.log('Since we are running with migrate: \'safe\' and/or NODE_ENV=production (in the "'+sails.config.environment+'" Sails environment, to be precise), skipping the rest of the bootstrap to avoid data loss...');
      return;
    }//•

    // Compare bootstrap version from code base to the version that was last run
    var lastRunBootstrapInfo = await sails.helpers.fs.readJson(bootstrapLastRunInfoPath)
    .tolerate('doesNotExist');// (it's ok if the file doesn't exist yet-- just keep going.)

    if (lastRunBootstrapInfo && lastRunBootstrapInfo.lastRunVersion === HARD_CODED_DATA_VERSION) {
      sails.log('Skipping v'+HARD_CODED_DATA_VERSION+' bootstrap script...  (because it\'s already been run)');
      sails.log('(last run on this computer: @ '+(new Date(lastRunBootstrapInfo.lastRunAt))+')');
      return;
    }//•

    sails.log('Running v'+HARD_CODED_DATA_VERSION+' bootstrap script...  ('+(lastRunBootstrapInfo ? 'before this, the last time the bootstrap ran on this computer was for v'+lastRunBootstrapInfo.lastRunVersion+' @ '+(new Date(lastRunBootstrapInfo.lastRunAt)) : 'looks like this is the first time the bootstrap has run on this computer')+')');
  }
  else {
    sails.log('Running bootstrap script because it was forced...  (either `--drop` or `--environment=test` was used)');
  }

  // Since the hard-coded data version has been incremented, and we're running in
  // a "throwaway data" environment, delete all records from all models.


  // Save new bootstrap version
  await sails.helpers.fs.writeJson.with({
    destination: bootstrapLastRunInfoPath,
    json: {
      lastRunVersion: HARD_CODED_DATA_VERSION,
      lastRunAt: Date.now()
    },
    force: true
  })
  .tolerate((err)=>{
    sails.log.warn('For some reason, could not write bootstrap version .json file.  This could be a result of a problem with your configured paths, or, if you are in production, a limitation of your hosting provider related to `pwd`.  As a workaround, try updating app.js to explicitly pass in `appPath: __dirname` instead of relying on `chdir`.  Current sails.config.appPath: `'+sails.config.appPath+'`.  Full error details: '+err.stack+'\n\n(Proceeding anyway this time...)');
  });

  // bootstrap app
  try {

    console.log('C\'est parti pour le seeding');
    var globalPassword = await sails.helpers.passwords.hashPassword('testing123');
    await User.create( {
      fullName: 'John Wayne',
      emailAddress: 'johnnie86@gmail.com',
      password: globalPassword,

    });
    await User.create({
      fullName: 'Peter Quinn',
      emailAddress: 'peter.quinn@live.com',
      password : globalPassword
    });

    await User.create( {
      fullName: 'Jane Eyre',
      emailAddress: 'jane@hotmail.com',
      password: globalPassword
    });

    await User.create( {
      fullName: 'Muramasa',
      emailAddress: 'muramasa@gmail.com',
      password: globalPassword,

    });
    await User.create( {
      fullName: 'LeiLa',
      emailAddress: 'leila.quinn@live.com',
      password : globalPassword
    });
    await User.create( {
      fullName: 'Foncy',
      emailAddress: 'foncy@hotmail.com',
      password: globalPassword
    });



    var users = await User.find();


    var profile1 = await Profile.create({
      role : 'Développeur',
      about : 'A propos 1',
      author : users[0].id,
      avatar : 'https://randomuser.me/api/portraits/men/81.jpg'

    }).fetch();

    var profile2 = await Profile.create({
      role : 'Développeur',
      about : 'A propos 2',
      author : users[1].id,
      avatar : 'https://randomuser.me/api/portraits/men/34.jpg'

    }).fetch();

    var profile3 = await Profile.create({
      role : 'Développeur',
      about : 'A propos 3',
      author : users[2].id,
      avatar : 'https://randomuser.me/api/portraits/women/20.jpg'

    }).fetch();

    var profile4 = await Profile.create({
      role : 'Développeur',
      about : 'A propos 4',
      author : users[3].id,
      avatar : 'https://randomuser.me/api/portraits/men/61.jpg'

    }).fetch();

    var profile5 = await Profile.create({
      role : 'Développeur',
      about : 'A propos 5',
      author : users[4].id,
      avatar : 'https://randomuser.me/api/portraits/women/31.jpg'

    }).fetch();

    var profile6 = await Profile.create({
      role : 'Développeur',
      about : 'A propos 5',
      author : users[5].id,
      avatar : 'https://randomuser.me/api/portraits/men/20.jpg'

    }).fetch();

    var lastSelectedRoom1 = await LastSelectedRoom.create({
      user:  users[0].id

    }).fetch();



    var lastSelectedRoom2 = await LastSelectedRoom.create({
      user:  users[1].id

    }).fetch();
    var lastSelectedRoom3 = await LastSelectedRoom.create({
      user:  users[2].id

    }).fetch();
    var lastSelectedRoom4 = await LastSelectedRoom.create({
      user:  users[3].id

    }).fetch();
    var lastSelectedRoom5 = await LastSelectedRoom.create({
      user:  users[4].id

    }).fetch();
    var lastSelectedRoom6 = await LastSelectedRoom.create({
      user:  users[5].id

    }).fetch();

    var post1 = await Post.create({
      author:users[0].id,
      title : 'Titre 1',
      content: 'Contenu 1'
    }).fetch();

    var post2 = await Post.create({
      author:users[1].id,
      title : 'Titre 2',
      content: 'Contenu 2'
    }).fetch();

    var post3 = await Post.create({
      author:users[2].id,
      title : 'Titre 3',
      content: 'Contenu 3'
    }).fetch();

    var post4 = await Post.create({
      author:users[3].id,
      title : 'Titre 4',
      content: 'Contenu 4'
    }).fetch();

    var post5 = await Post.create({
      author:users[4].id,
      title : 'Titre 5',
      content: 'Contenu 5'
    }).fetch();

    var post6 = await Post.create({
      author:users[5].id,
      title : 'Titre 6',
      content: 'Contenu 6'
    }).fetch();


    var like1 = await Like.create({
      author : users[0].id,
      post : post1.id
    }).fetch();

    var like2 = await Like.create({
      author : users[1].id,
      post : post1.id
    }).fetch();

    var like3 = await Like.create({
      author : users[2].id,
      post : post1.id
    }).fetch();

    var comment1 = await Comment.create({
      author : users[1].id,
      post : post1.id,
      content: 'Super idée !!'

    }).fetch();

    var comment2 = await Comment.create({
      author : users[2].id,
      post : post1.id,
      content: 'Pas très crédible'

    }).fetch();

    var comment2 = await Comment.create({
      author : users[3].id,
      post : post1.id,
      content: 'Parfait ça te dit qu\'on fasse équipe ?'

    }).fetch();

    var room1 = await Room.create({
      createdBy: users[1].id
    }).fetch();

    var room2 = await Room.create({
      createdBy: users[2].id
    }).fetch();

    var room3 = await Room.create({
      createdBy: users[3].id
    }).fetch();

    await Room.addToCollection(room1.id, 'users', [users[0].id, users[1].id]);
    await Room.addToCollection(room2.id, 'users', [users[0].id, users[2].id]);
    await Room.addToCollection(room3.id, 'users', [users[0].id, users[3].id]);

    var chatMessage1 = await ChatMessage.create({
      author: users[1].id,
      content : 'salut !!',
      room : room1.id
    }).fetch();

    var chatMessage2 = await ChatMessage.create({
      author: users[2].id,
      content : 'salut Johnie!!',
      room : room2.id
    }).fetch();

    var chatMessage3 = await ChatMessage.create({
      author: users[0].id,
      content : 'Coucou !',
      room: room1.id
    }).fetch();
    var chatMessage4 = await ChatMessage.create({
      author: users[3].id,
      content : 'Coucou !',
      room: room3.id
    }).fetch();

  }catch(err){
    console.error(err);
  }


};
