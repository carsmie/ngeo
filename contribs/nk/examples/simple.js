goog.provide('nk-simple');

goog.require('nk.mapDirective');
goog.require('nk.source.norgeskart');
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.layer.Tile');


/** @const **/
var app = {};


/** @type {!angular.Module} **/
app.module = angular.module('app', ['nk']);



/**
 * @constructor
 */
app.MainController = function() {

  /**
   * @type {ol.Map}
   * @export
   */
  this.map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new nk.source.norgeskart({
          layer: 'toporaster3'
        })
      })
    ],
    view: new ol.View({
      resolutions: [250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5],
      center: [235951, 6679217],
      zoom: 5
    })
  });
};


app.module.controller('MainController', app.MainController);
