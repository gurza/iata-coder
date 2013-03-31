/**
 * Created with JetBrains WebStorm.
 * User: gurza
 * Date: 31.03.13
 * Time: 12:31
 * Supplier Hub
 */

var http = require('http');
var events = require('events');


var OzonTravelCities = function(opts){
  this.code = opts.code;
  this.debug = opts.debug || false;
};

OzonTravelCities.prototype = new events.EventEmitter;

/*
 * Call /ajax/cities.html,
 * response should contain name of city/airport and country (Russian)
 */
OzonTravelCities.prototype.getCityNameByCode = function() {
  // make a request
  var opts = {
    hostname: 'www.ozon.travel',
    port: 80,
    method: 'POST',
    path: '/ajax/cities.html?Commander.Command=SearchAirLocation&Top=7&Word=' + this.code
  };
  var self = this;
  var responseOzonTravel = '';

  this.connection = http.request(opts, function(response) {
    if (self.debug) {
      console.log('STATUS: ' + response.statusCode);
      console.log('HEADERS: ' + JSON.stringify(response.headers));
    }
    response.setEncoding('utf8');

    response.on('data', function (chunk) {
      if (self.debug) {
        console.log('BODY: ' + chunk);
      }
      responseOzonTravel += chunk.toString('utf8');
    });

    response.on('end', function(){
      var result;

      // parse response of OZON.travel
      responseOzonTravel = responseOzonTravel.replace('﻿[', '['); // todo: strange first symbol
      var jsonResult = JSON.parse(responseOzonTravel);
      var jsonResultLength = jsonResult.length;
      for(var i=0; i<jsonResultLength; i++){
        if (jsonResult[i].Code == self.code) {
          if (self.debug){
            console.log('I found ' + jsonResult[i].Name + ', ' + jsonResult[i].Country);
          }
          result = jsonResult[i].Name +', ' + jsonResult[i].Country;
          break; // I found it
        }
      }
      self.emit('end', result);
    });
  });

  this.connection.on('error', function(e){
    if (self.debug) {
      console.log('Problem with request: ' + e.message);
    }
    self.emit('error', e);
  });

  this.connection.end();
};

module.exports = OzonTravelCities;