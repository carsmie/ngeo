goog.provide('nk-mobilebackgroundlayerselector');

goog.require('nk.Themes');
goog.require('nk.mapDirective');
goog.require('nk.mobileBackgroundLayerSelectorDirective');
goog.require('nk.proj.EPSG21781');
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.layer.Tile');
goog.require('ol.source.OSM');


/** @const **/
var app = {};


/** @type {!angular.Module} **/
app.module = angular.module('app', ['nk']);


app.module.constant(
    'nkTreeUrl',
    'https://geomapfish-demo.camptocamp.net/2.0/wsgi/themes?' +
        'version=2&background=background');



/**
 * @param {nk.Themes} nkThemes Themes service.
 * @constructor
 * @ngInject
 */
app.MainController = function(nkThemes) {

  nkThemes.loadThemes();

  /**
   * @type {ol.Map}
   * @export
   */
  this.map = new ol.Map({
    layers: [],
    view: new ol.View({
      center: [632464, 185457],
      projection: ol.proj.get('epsg:21781'),
      minZoom: 3,
      zoom: 3
    })
  });
};


app.module.controller('MainController', app.MainController);
