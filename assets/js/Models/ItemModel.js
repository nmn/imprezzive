'use strict';
var $ = require('jquery');
var Backbone = require('Backbone');
Backbone.$ = $;

module.exports = Backbone.Model.extend({
  tagname: 'div',
  className: 'item active',

  initialize: function(params){
    this.set('type', params.type || 'text' );
    if(this.get('type') === 'image'){
      this.set('url', params.url || 'http://sd.keepcalm-o-matic.co.uk/i/keep-calm-cause-you-win.png');
    }
    this.set('number', params.number);
  },

  uploadPosition: function(params){
    console.log(params);
  }

});