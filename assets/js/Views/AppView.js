'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('Backbone');
Backbone.$ = $;

var ToolbarView = require('./ToolbarView.js');
var SlidesCollectionView = require('./SlidesCollectionView.js');

module.exports = Backbone.View.extend({
  className: 'container',
  initialize: function(){
    this.toolbar = new ToolbarView({appModel: this.model});
    this.rejig();
    var rejig = this.rejig.bind(this);
    rejig = _.throttle(rejig, 16);

    window.addEventListener('resize', rejig);
    this.model.on('slideChange', function(number){
      this.$el.find('span.slideNumber').text(number);
    }, this);
  },

  render: function(){
    this.$el.append( ( new SlidesCollectionView({collection: this.model.get('slides')})).render() );
    this.$el.append('<span class="slideNumber">' + this.model.currentSlideNumber + 1 + '</span>');
    this.$el.append(this.toolbar.render());
    return this.el;
  },

  rejig: function(){
    var height = window.innerHeight;
    var width = window.innerWidth;
    var hScale = height/820;
    var wScale = width/1280;
    var scale = Math.min(hScale, wScale);
    var translate;
    if(hScale === scale){
      translate = ( width - (1280.0 * scale) ) / 2;
      this.$el.css('-webkit-transform', 'scale('+ scale +') translateX('+ translate +'px)');
    } else if(wScale === scale){
      translate = ( height - (820.0 * scale) ) / 2;
      this.$el.css('-webkit-transform', 'scale('+ scale +') translateY('+ translate +'px)');
    }
  }

});