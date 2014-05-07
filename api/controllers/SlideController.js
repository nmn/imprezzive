/**
{ prezId: 0,
  slideNumber: 1,
  slide: { className: 'after', number: 1, Items: [] } }
 */
'use strict';

module.exports = {

  checkAndSave: function(req, res){
    console.log(req.body);
    var slide = req.body;
    var query = {
      prezId: slide.prezId,
      slideNumber: slide.slideNumber
    };

    Imprezzive.find({ $or: [{id: slide.prezId}, {_id: slide.prezId}]})
      .then(function(prezzes){
        if(prezzes.length !== 0){
          return null;
        }
        console.log('creating...');
        return Imprezzive.create({id: slide.prezId});
      })
      .then(function(newPrezzi){
        if(newPrezzi === null) {
          return null;
        }
        console.log('new app saved');
      })
      .catch(function(err){
        console.error(err);
      });

    Slide.find(query)
    .then(function(slides){
      if(slides.length !== 0){
        return slides[0];
      }
      return Slide.create(slide);
    })
    .then(res.send.bind(res))
    .catch(function(err){
      console.error(err);
      res.send('An Error Occurred Please Try Later');
    });

  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SlideController)
   */
  _config: {}


};
