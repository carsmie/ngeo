goog.provide('nk.source.norgeskart');

goog.require('ol.Attribution');
goog.require('ol.source.WMTS');
goog.require('ol.tilegrid.WMTS');


/**
 * @const {!Array.<number>}
 * @private
 */
nk.source.NorgeskartResolutions_ = [
  4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250,
  1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5
];


/**
 * @const {ol.tilegrid.WMTS}
 * @private
 */
nk.source.NorgeskartTileGrid_ = new ol.tilegrid.WMTS({
  extent: [-2500000, 3500000, 3045984, 9045984],
  resolutions: nk.source.NorgeskartResolutions_,
  matrixIds: nk.source.NorgeskartResolutions_.map(function(value, index) {
    return String(index);
  })
});


/**
 * Layer source for the Norgeskart tile server.
 * WARNING: This tile server is not publicly available: you have to be
 *          registered by Kartverket to use the service.
 * @see https://kartverket.no
 *
 * @constructor
 * @extends {ol.source.WMTS}
 * @param {nkx.source.SwisstopoOptions} options WMTS options.
 */
nk.source.kartverket = function(options) {

  var format = options.format ? options.format : 'png';

  goog.base(this, {
    attributions: [nk.source.kartverket.ATTRIBUTION_],
    url: 'https://cache{1-4}.kartverket.no/proff/wmts/{Layer}' +
        '/{TileMatrix}/{TileRow}/{TileCol}.' + format,
    projection: 'EPSG:32633',
    requestEncoding: 'REST',
    layer: options.layer,
    style: 'default',
    matrixSet: '32633',
    format: 'image/' + format,
    tileGrid: nk.source.kartverketTileGrid_
  });
};
goog.inherits(nk.source.kartverket, ol.source.WMTS);


/**
 * @const {ol.Attribution}
 * @private
 */
nk.source.kartverket.ATTRIBUTION_ = new ol.Attribution({
  html: '&copy; <a href="http://www.kartverket.no">Kartverket</a>'
});
