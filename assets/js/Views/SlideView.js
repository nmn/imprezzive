'use strict';
var $ = require('jquery');
var Backbone = require('Backbone');
Backbone.$ = $;
var ItemView = require('./ItemView.js');

module.exports = Backbone.View.extend({
  tagName: 'section',

  initialize: function(){
    this.el.className = 'slide ' + this.model.get('className');
    this.model.on('slideChange', function(classname){
      this.el.className = 'slide ' + classname;
    }, this);
    this.model.on('itemAdded', function(item){
      this.$el.append((new ItemView({model: item})).render());
    }, this);
  },

  render: function(){
    var that = this;
    this.model.get('Items').each(function(item){
      that.$el.append((new ItemView({model: item})).render());
    });
    return this.el;
  }
});