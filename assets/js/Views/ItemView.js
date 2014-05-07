'use strict';
var $ = require('jquery');
var Backbone = require('Backbone');
Backbone.$ = $;

var ace = require('brace');
require('brace/mode/javascript');
require('brace/theme/monokai');

module.exports = Backbone.View.extend({
  className: 'item',
  template: {
    image: $('#image-template').html(),
    text: $('#text-template').html(),
    para: $('#para-template').html(),
    code: $('#code-template').html()
  },
  worker : {
    start: $('#worker-start').html(),
    end: $('#worker-end').html()
  },
  dragging: false,
  events: {
    'mousedown .dragger': function(event){
      event.preventDefault();
      this.dragging = true;
      this.startX = event.clientX;
      this.startY = event.clientY;
      this.startTop = parseInt(this.$el.css('top')) || 300;
      this.startLeft = parseInt(this.$el.css('left')) || 300;
      //var scale = $('.container').css('-webkit-transform');
      //debugger;
      //scale = scale.slice(7, scale.indexOf(',') + 1);
      //scale = parseFloat(scale);
      var height = window.innerHeight;
      var width = window.innerWidth;
      var hScale = height/820;
      var wScale = width/1280;
      var scale = Math.min(hScale, wScale);
      scale = 1/scale;
      var that = this;
      var moveListener = document.addEventListener('mousemove', function(event){
        if(that.dragging === true){
          var left = event.clientX;
          var top = event.clientY;
          that.$el.css({
            top: ((top - that.startY) * scale) + that.startTop + 'px',
            left: ((left - that.startX) * scale)+ that.startLeft + 'px'
          });
        }
      });
      var upListener = document.addEventListener('mouseup', function(){
        that.dragging = false;
        document.removeEventListener(moveListener);
        document.removeEventListener(upListener);
        if( parseInt(that.$el.css('top')) < 40){
          that.$el.css('top', '40px');
        }
        if( parseInt(that.$el.css('top')) > 630){
          that.$el.css('top', '630px');
        }
        if( parseInt(that.$el.css('left')) < 20){
          that.$el.css('left', '20px');
        }
        if( parseInt(that.$el.css('left')) > 1180){
          that.$el.css('left', '1180px');
        }
        socket.put('/item/' + that.model.get('id'), {
          top: parseInt(that.$el.css('top')),
          left: parseInt(that.$el.css('left'))
        }, function(res){
          //console.log("updated server!");
        });
      });
    },
    'mouseup .delete': function(event){
      event.preventDefault();
      this.$el.remove();
      socket['delete']('/item/' + this.model.id, function(res){
        console.log("DELETED : ", res);
      });
    },
    'mouseup img': function(event){
      event.preventDefault();
      if(this.$el.hasClass('active')){
        this.$el.removeClass('active');
      } else {
        $('.item.active').removeClass('active');
        this.$el.addClass('active');
      }
    },

    'mouseup button': function(event){
      event.preventDefault();
      this.$el.find('.console').html("");
      var code = this.worker.start + this.editor.getValue() + this.worker.end;
      var bb = new Blob([code], {
        type: 'text/javascript'
      });
      var bbURL = URL.createObjectURL(bb);
      var worker = new Worker(bbURL);
      var that = this;
      worker.addEventListener('message', function(e){
        var string = (e.data).toString();
        that.$el.find('.console').append('<p>' + string + '</p>').scrollTop(1000);
      });
      worker.addEventListener('error', function(e){
        var string = (e.message).toString();
        that.$el.find('.console').append('<p> ERROR: ' + string + '</p>').scrollTop(1000);
      });
      worker.postMessage('start');
      setTimeout(function(){
        worker.terminate();
        worker = null;
      }, 10000);
    },
    'mouseup .content': function(evt){
      console.log($(evt.currentTarget).height(), $(evt.currentTarget).width());
      this.model.set('height', $(evt.currentTarget).height());
      this.model.set('width', $(evt.currentTarget).width());
      socket.put('/item/' + this.model.get('id'), {
        height: $(evt.currentTarget).height(),
        width: $(evt.currentTarget).width()
      }, function(res){
        //console.log("updated server!");
      });
    },
    'keyup .content': function(evt){
      //console.log($(evt.currentTarget).val());
      socket.put('/item/' + this.model.id, {
        content: $(evt.currentTarget).val()
      }, function(res){
        //console.log("Update Server", res);
      });
    }
  },

  uploadCode: function(){
    var content = this.editor.getValue();
    socket.put('/item/' + this.model.id, {
      content: content
    }, function(res){
      //console.log("Update Server", res);
    });
  },

  initialize: function(){
    this.model.on('rerender', function(){
      this.$el.css({
        top: (this.model.get('top') || 40) + 'px',
        left: (this.model.get('left') || 40) + 'px'
      });
      if(this.model.get('type') === 'text' || this.model.get('type') === 'para'){
        this.$el.find('.content').html(this.model.get('content'));
      }
      if(this.model.get('type') === 'code'){
        this.editor.setValue(this.model.get('content'))
      }
    }, this);
  },
  render: function(){

    if(this.model.get('type') === 'code'){
      this.$el.addClass('alwaysActive');
      var height = window.innerHeight;
      var width = window.innerWidth;
      var hScale = height/820;
      var wScale = width/1280;
      var scale = Math.min(hScale, wScale);
      this.$el.css({
        top: (this.model.get('top') || 40) + 'px',
        left: (this.model.get('left') || 40) + 'px',
        height: '600px',
        width: '500px'
      });

      this.$el.html(this.template[this.model.get('type')]);
      var newid = 'code' + (new Date()).valueOf().toString(36);
      this.$el.find('#code').css({
        height: (400 * scale) + 'px',
        width: (500 * scale) + 'px',
        '-webkit-transform': 'scale('+(1/scale)+')'
      }).attr('id', newid);
      var that = this;
      setTimeout(function(){
        // debugger;
        var editor = ace.edit(newid);
        editor.getSession().setMode('ace/mode/javascript');
        editor.setTheme('ace/theme/monokai');
        editor.setValue(that.model.get('content') || "");
        that.editor = editor;
        editor.getSession().on('change', function(evt){
          that.uploadCode();
        });
      },100);
      return this.el;
    }

    this.$el.html(this.template[this.model.get('type')]);
    if(this.model.get('type') === 'image'){
      var that = this;
      var image = document.createElement('img');
      image.src = this.model.get('url');
      $(image).on('load', function(){
        that.$el.find('img').replaceWith(image);
      });
    } else {
      if(this.model.get('height')){
        this.$el.find('textarea').css({
          height: (this.model.get('height') ) + 'px',
          width: (this.model.get('width') ) + 'px'
        });
      }
      this.$el.find('textarea').text(this.model.get('content') || "");
    }
    this.$el.css({
      top: (this.model.get('top') || 250) + 'px',
      left: (this.model.get('left') || 250) + 'px'
    });
    return this.el;
  }
});