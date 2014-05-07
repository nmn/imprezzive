'use strict';
var $ = require('jquery');
var Backbone = require('Backbone');
Backbone.$ = $;
var SlideModel = require('./../Models/SlideModel.js');

module.exports = Backbone.Collection.extend({
  model: SlideModel
});