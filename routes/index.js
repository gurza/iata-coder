
/*
 * GET home page.
 */

var http = require('http');
var OzonTravelCities = require('../lib/supplierhub');

exports.index = function(req, res){
  var sup = new OzonTravelCities({
    code: 'LON',
    debug: true
  });

  sup.on('end', function(){
    res.render('index', { title: 'iata-coder' });
  });

  sup.on('error', function(e){
    res.render('index', { title: e.message });
  });

  sup.getCityNameByCode();
};