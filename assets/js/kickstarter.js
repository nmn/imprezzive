var AppModel = require('./Models/AppModel.js');
var AppView = require('./Views/AppView.js');
var $ = require('jquery');

module.exports = function(socket) {
  'use strict';
  var hasRun = false;

  return function(){
    if(hasRun) {
      return;
    }
    hasRun = true;
    var data = JSON.parse($('#data').html());
    var app = new AppModel(data);
    window.app = app;
    setTimeout(function(){
      var container = (new AppView({model:app})).render();
      document.body.appendChild(container);
    }, 1000);

    console.log("making request to slides");
    socket.get('/slide', function(res){
      console.log("subscribed to slide Updates");
    });
    socket.get('/item', function(res){
      console.log("subscribed to item Updates");
    });

    socket.on('message', function messageReceived(message) {
      if(message.data.prezId === data.id){
        if(message.model === 'item' && message.data.type !== 'code'){
          app.updateItem(message.data);
        }
        if(message.model === 'slide'){
          console.log("new Slide Added. You should refresh now!");
        }
      }
    });

  };

};