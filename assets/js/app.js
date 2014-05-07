var kickstarter = require('./kickstarter.js');

( function (io) {
  'use strict';
  function log () {
    if (typeof console !== 'undefined') {
      console.log.apply(console, arguments);
    }
  }
  var socket = io.connect();
  if (typeof console !== 'undefined') {
    log('Connecting to Sails.js...');
  }

  socket.on('connect', function socketConnected() {

    //Kickstarting the Backbone Process
    kickstarter(socket)();
    log('connected to server and starting app');

  });

  window.socket = socket;

})( window.io );
