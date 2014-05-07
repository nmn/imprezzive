'use strict';
var Backbone = require('Backbone');
var ItemModel = require('./../Models/ItemModel.js');

module.exports = Backbone.Collection.extend({
  model: ItemModel
});