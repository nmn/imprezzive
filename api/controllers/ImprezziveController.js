/**
 * ImprezziveController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
'use strict';
var Promise = require('bluebird');

module.exports = {



  homepage: function(req, res){
    Imprezzive.find()
      .then(function(prezzes){
        res.view('home/home', {
          prezzes: prezzes
        });
      })
      .catch(function(err){
        console.error(err);
        res.send(500, err);
      });
  },

  newPrez: function(req, res){
    Imprezzive.create()
      .then(function(prezzes){
        res.redirect('/work/' + prezzes.id);
      })
      .catch(function(err){
        console.error(err);
        res.send(err);
      });
  },

  work: function(req, res){
    var id = req.params.id;
    Promise.all([
      Imprezzive.find({id:id}),
      Slide.find({prezId: id}),
      Item.find({prezId: id})
    ])
    .spread(function(prezz, slides, items){
      var data = {};
      data.id = prezz[0].id;
      data.slides = slides;
      data.items = items;
      var obj = {};
      obj.title = 'Imprezzive';
      obj.data = JSON.stringify(data);
      res.view('home/index', obj);
    })
    .catch(function(err){
      console.error(err);
      res.send(500, err);
    });
  },
  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ImprezziveController)
   */
  _config: {}


};
