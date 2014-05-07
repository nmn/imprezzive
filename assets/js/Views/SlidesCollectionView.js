'use strict';
var $ = require('jquery');
var Backbone = require('Backbone');
Backbone.$ = $;

var SlideView = require('./SlideView.js');

module.exports = Backbone.View.extend({
  tagName: 'section',
  className: 'slide',

  initialize: function(){
    this.fragment = document.createDocumentFragment();
    this.collection.on('add', function(slide){
      //console.log("adding slide");
      this.addSlide(slide);
    }, this);
  },

  render: function(){
    var that = this;
    this.fragment.innerHTML = '';
    this.collection.each(function(slide){
      that.fragment.appendChild( ( new SlideView({model: slide}) ).render() );
    });
    // var addSlide = ( new SlideView() ).render();
    // addSlide.className = 'slide addSlide';
    // this.fragment.appendChild(addSlide);
    return this.fragment;
  },

  addSlide: function(slide){
    $('.container .slide:last-of-type').after(( new SlideView({model: slide}) ).render());
  }
});