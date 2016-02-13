/**
 * @fileoverview Application entry point.
 *
 * This file defines the "app_desktop" Closure namespace, which is be used as
 * the Closure entry point (see "closure_entry_point" in the "build.json"
 * file).
 *
 * This file includes `goog.require`'s for all the components/directives used
 * by the HTML page and the controller to provide the configuration.
 */
goog.provide('app.DesktopController');
goog.provide('app_desktop');

goog.require('app');
goog.require('nk.AbstractDesktopController');
goog.require('nk.Themes');
/** @suppress {extraRequire} */
goog.require('nk.authenticationDirective');
/** @suppress {extraRequire} */
goog.require('nk.layertreeDirective');


appModule.constant(
    'authenticationBaseUrl',
    'https://geomapfish-demo.camptocamp.net/2.0/wsgi');



/**
 * @param {ngeo.FeatureOverlayMgr} ngeoFeatureOverlayMgr The ngeo feature
 *     overlay manager service.
 * @param {string} fulltextsearchUrl url to a nk fulltextsearch service.
 * @param {nk.Themes} nkThemes Themes service.
 * @constructor
 * @extends {nk.AbstractDesktopController}
 * @ngInject
 * @export
 */
app.DesktopController = function(
    ngeoFeatureOverlayMgr, fulltextsearchUrl, nkThemes) {
  goog.base(
      this, {
        srid: 21781,
        mapViewConfig: {
          center: [632464, 185457],
          minZoom: 3,
          zoom: 3
        }
      }, ngeoFeatureOverlayMgr, fulltextsearchUrl, nkThemes);
};
goog.inherits(app.DesktopController, nk.AbstractDesktopController);


appModule.controller('DesktopController', app.DesktopController);
