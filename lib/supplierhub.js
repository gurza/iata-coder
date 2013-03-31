/**
 * Created with JetBrains WebStorm.
 * User: gurza
 * Date: 31.03.13
 * Time: 12:31
 * Supplier Hub
 */

var http = require('http');
var events = require('events');

// About EventEmitter http://venodesigns.net/2011/04/16/emitting-custom-events-in-node-js/
// plus sources https://github.com/ryanmcgrath/jsmag/blob/master/events/

/*
 * Trying to get name of geo objects from OZON.travel using IATA codes
 * Request URL:http://www.ozon.travel/ajax/cities.html
 * Request Method:POST (also GET works)
 * Request params:
 *   Commander.Command:SearchAirLocation
 *   Top:7
 *   Word:lon
 */

var OzonTravelCities = function(opts){
  this.code = opts.code;
  this.debug = opts.debug || false;
};

OzonTravelCities.prototype = new events.EventEmitter;

OzonTravelCities.prototype.getCityNameByCode = function() {
  // make a request
  // http://nodejs.org/docs/v0.10.2/api/http.html#http_http_request_options_callback
  var opts = {
    hostname: 'www.ozon.travel',
    port: 80,
    method: 'POST',
    path: '/ajax/cities.html?Commander.Command=SearchAirLocation&Top=7&Word=' + this.code
  },
  self = this;

  this.connection = http.request(opts, function(response) {
    if (this.debug) {
      console.log('STATUS: ' + response.statusCode);
      console.log('HEADERS: ' + response.headers);
    }
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
    });

    response.on('end', function(){
      console.log('It works');
      self.emit('end', 'London');
    });
  });

  this.connection.on('error', function(e){
    if (this.debug) {
      console.log('problem with request: ' + e.message);
    }
    self.emit('error', e);
  });
  this.connection.end();
};

module.exports = OzonTravelCities;