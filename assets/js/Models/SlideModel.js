'use strict';
var $ = require('jquery');
var Backbone = require('Backbone');
Backbone.$ = $;
var ItemsCollection = require('./../Collections/ItemsCollection');
var Item = require('./ItemModel');

module.exports = Backbone.Model.extend({

  initialize: function(params){
    this.set('className', params.className);
    this.set('number', params.number);
    this.set('Items', new ItemsCollection());
  },

  setClass: function(status){
    if(this.get('className') !== status){
      this.set('className', status);
      this.trigger('slideChange', status);
    }
  },

  addItem: function(item){
    this.get('Items').add(item);
    this.trigger('itemAdded', item);
  },

  addText: function(){
    var that = this;
    socket.post('/item', {
      type: 'text',
      prezId: this.get('prezId'),
      slideId: this.get('id')
    }, function(res){
      console.log("Adding Text: ", res);
      var textItem = new Item(res);
      that.get('Items').add(textItem);
      that.trigger('itemAdded', textItem);
    });
  },

  updateItem: function(updatedItem){
    var item = this.get('Items').where({id: updatedItem.id});
    if(item.length > 0){
      item[0].set(updatedItem);
      item[0].trigger('rerender');
    } else {
      this.addItem(new Item(updatedItem));
    }
  },

  addPara: function(){
    var that = this;
    socket.post('/item', {
      type: 'para',
      prezId: this.get('prezId'),
      slideId: this.get('id')
    }, function(res){
      console.log("Adding Para: ", res);
      var textItem = new Item(res);
      that.get('Items').add(textItem);
      that.trigger('itemAdded', textItem);
    });
  },

  addImage: function(url){
    var that = this;
    socket.post('/item', {
      type: 'image',
      url: url,
      prezId: this.get('prezId'),
      slideId: this.get('id')
    }, function(res){
      console.log("Adding Image: ", res);
      var imageItem = new Item(res);
      that.get('Items').add(imageItem);
      that.trigger('itemAdded', imageItem);
    });
  },

  addCode: function(){
    var that = this;
    socket.post('/item', {
      type: 'code',
      prezId: this.get('prezId'),
      slideId: this.get('id'),
      top: '40px',
      left: '40px',
      height: '600px',
      width: '500px'
    }, function(res){
      console.log("Adding Code: ", res);
      var codeBlock = new Item(res);
      that.get('Items').add(codeBlock);
      that.trigger('itemAdded', codeBlock);
    });
  }
});