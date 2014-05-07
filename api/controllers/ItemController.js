/**
 * ItemController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {


  // checkAndSave: function(req, res){
  //   console.log(req.body);
  //   var item = req.body;
  //   var query = {
  //     prezId: item.prezId,
  //     slideId: item.slideId
  //   };

  //   Slide.create(item);
  //   .then(res.send.bind(res))
  //   .catch(function(err){
  //     console.error(err);
  //     res.send('An Error Occurred Please Try Later');
  //   });

  // },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ItemController)
   */
  _config: {}


};
