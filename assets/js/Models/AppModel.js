'use strict';

var $ = require('jquery');
var Backbone = require('Backbone');
Backbone.$ = $;

var SlidesCollection = require('./../Collections/SlidesCollection');
var SlideModel = require('./SlideModel');
var ItemModel = require('./ItemModel');

module.exports = Backbone.Model.extend({

  initialize: function(params){
    this.currentSlideNumber = 0;
    this.set('number', params.id || 1);
    this.set('id', params.id || 1);

    this.set('slides', new SlidesCollection() );
    if(params.slides.length === 0){
      this.addSlide();
    } else {
      params.slides.sort(function(slideA, slideB){
        return slideA.slideNumber - slideB.slideNumber;
      });
      var that = this;
      params.slides.forEach(function(slide){
        var newSlide = new SlideModel({className: 'after', number: slide.slideNumber, prezId: slide.prezId, id: slide.id});
        params.items.forEach(function(item){
          if(item.slideId === slide.id){
            newSlide.addItem(new ItemModel(item));
          }
        });
        that.get('slides').add(newSlide);
      });
      that.goToSlide(0);
    }
    // var firstSlide = new SlideModel({className: 'current', number: 0});
    // this.get('slides').add(firstSlide);
    // this.uploadNewSlide(firstSlide);


    // var slides = this.get('slides');
    // slides.on('add', function(slide){
    //   console.log('caught');
    //   this.uploadNewSlide(slide);
    // }, this);
  },

  updateItem: function(updatedItem){
    console.log("will do this part soon. Live Updating Items");
    var slide = this.get('slides').where({id: updatedItem.slideId});
    slide = slide[0];
    slide.updateItem(updatedItem);
  },

  uploadNewSlide: function(slide){
    var number = this.get('number');
    // socket.post('/newSlide', {
    //   prezId: this.get('number'),
    //   slideNumber: slide.get('number'),
    //   slide: slide.toJSON()
    // }, function(res){
    //   console.log('Slide Saved', res);
    // });
  },

  next: function(){
    if(this.currentSlideNumber < this.get('slides').length - 1){
      this.goToSlide( ++this.currentSlideNumber );
    }
  },

  prev: function(){
    if(this.currentSlideNumber > 0) {
      this.goToSlide(--this.currentSlideNumber);
    }
  },

  addText: function(){
    this.get('slides').at(this.currentSlideNumber).addText();
  },

  addPara: function(){
    this.get('slides').at(this.currentSlideNumber).addPara();
  },

  addCode: function(){
    this.get('slides').at(this.currentSlideNumber).addCode();
  },

  addImage: function(url){
    this.get('slides').at(this.currentSlideNumber).addImage(url);
  },

  addSlide: function(){
    var that = this;
    if(!!arguments[0]){
      var newSlide = arguments[0];
      that.get('slides').add(newSlide);
      that.goToSlide(that.get('slides').length - 1);
      that.currentSlideNumber = that.get('slides').length - 1;
      that.trigger('slideChange', that.currentSlideNumber + 1);
      return;
    }

    socket.post('/newSlide', {
      prezId: this.get('number'),
      slideNumber: this.get('slides').length
    }, function(res){
      console.log('Slide Saved', res);
      var newSlide = new SlideModel({className: 'after', number: res.slideNumber, prezId: res.prezId, id: res.id});
      that.get('slides').add(newSlide);
      that.goToSlide(that.get('slides').length - 1);
      that.currentSlideNumber = that.get('slides').length - 1;
      that.trigger('slideChange', that.currentSlideNumber + 1);
    });
  },

  goToSlide: function(num){
    if(this.get('slides').length <= num || num < 0){
      console.log('invalid slide');
      return;
    }
    num = Math.floor(num);
    //add a socket request here to change page
    this.get('slides').each(function(slide, index){
      if(index < num){
        slide.setClass('before');
      } else if(index === num){
        slide.setClass('current');
      } else {
        slide.setClass('after');
      }
    });
    this.trigger('slideChange', this.currentSlideNumber + 1);
  }

});