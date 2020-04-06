/* eslint-disable linebreak-style */
module.exports = {


  friendlyName: 'date helper',
  sync : true,

  inputs :{
    dateUTC: {
      type: 'number',
      description: 'The value of the date UTC',
      required: true
    }
  },



  fn: function(inputs,exits) {
    var converter = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    var d = new Date();
    d.setTime(inputs.dateUTC);
    var m = d.getMinutes();
    return exits.success(  d.getDate() + ' ' + converter[d.getMonth()]
    + ' ' + d.getHours() + 'h' + (m < 10 ? '0' + m : m ));
  }

};

