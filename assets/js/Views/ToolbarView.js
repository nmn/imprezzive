'use strict';
var $ = require('jquery');
var Backbone = require('Backbone');
Backbone.$ = $;

module.exports = Backbone.View.extend({
  className: 'toolbar',
  template: $('#toolbar').html(),

  events: {
    'click .next': function(evt){
      evt.preventDefault();
      this.appModel.next();
    },
    'click .prev': function(evt){
      evt.preventDefault();
      this.appModel.prev();
    },
    'click .addText': function(evt){
      evt.preventDefault();
      this.appModel.addText();
    },
    'click .addPara': function(evt){
      evt.preventDefault();
      this.appModel.addPara();
    },
    'click .addCode': function(evt){
      evt.preventDefault();
      this.appModel.addCode();
    },
    'click .addSlide': function(evt){
      evt.preventDefault();
      this.appModel.addSlide();
    },
    'click .addImage': function(evt){
      evt.preventDefault();
      if($('.toolbar input').val() === ''){
        return;
      }
      this.appModel.addImage($('.toolbar input').val());
    },
    'click .mic': function(evt){
      var that = this;
      if($(evt.currentTarget).hasClass('active')){
        $(evt.currentTarget).removeClass('active');
        if (!!('webkitSpeechRecognition' in window)){
          that.recognition.stop();
          that.speechCount = 0;
        }
      } else {
        $(evt.currentTarget).addClass('active');
        if (!!('webkitSpeechRecognition' in window)){
          that.recognition.start();
        }
      }
    },
    'click .fullscreen': function(){

      var el  = document.documentElement;
      var rfs =  el.requestFullScreen
              || el.webkitRequestFullScreen
              || el.mozRequestFullScreen;
      rfs.call(el);
      this.fullscreen = true;

    }
  },

  initialize: function(params){
    this.appModel = params.appModel;
    var that = this;
    if (!!('webkitSpeechRecognition' in window)){
      that.recognition = new webkitSpeechRecognition();
      that.recognition.continuous = true;
      that.recognition.interimResults = true;
      that.lang = 'en-US';
      that.speechCount = 0;
      that.recognition.onresult = function(data){
        var results = data.results;
        var length = results.length;
        for(var i = that.speechCount; i < length; i++){
          if(results[i].isFinal){
            that.speechCount = i + 1;
          }
          console.log(results[i][0].transcript, results[i][0].confidence);
          if(results[i][0].transcript.trim() === 'next' && results[i][0].confidence > 0.35){
            that.speechCount = i + 1;
            that.appModel.next();
            break;
          }
          if(results[i][0].transcript.trim() === 'go back' && results[i][0].confidence > 0.35){
            that.speechCount = i + 1;
            that.appModel.prev();
            break;
          }
        }
      };
    }
  },
  render: function(){
    this.$el.html(this.template);
    return this.el;
  }
});