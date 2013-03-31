
/*
 * GET home page.
 */

var OzonTravelCities = require('../lib/supplierhub');

exports.index = function(req, res){
  var code = req.query['code'] || 'LON';

  var sup = new OzonTravelCities({
    code: code,
    debug: true
  });

  sup.on('end', function(result){
    res.render('index', { code: code, result: result });
  });

  sup.on('error', function(e){
    res.render('index', { code: code, result: e.message });
  });

  sup.getCityNameByCode();
};