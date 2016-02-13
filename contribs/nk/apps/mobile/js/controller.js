/**
 * Application entry point.
 *
 * This file defines the "app_mobile" Closure namespace, which is be used as the
 * Closure entry point (see "closure_entry_point" in the "build.json" file).
 *
 * This file includes `goog.require`'s for all the components/directives used
 * by the HTML page and the controller to provide the configuration.
 */
goog.provide('app.MobileController');
goog.provide('app_mobile');

goog.require('app');
goog.require('nk.AbstractMobileController');
goog.require('nk.Themes');
/** @suppress {extraRequire} */
goog.require('nk.authenticationDirective');
/** @suppress {extraRequire} */
goog.require('nk.proj.EPSG21781');
/** @suppress {extraRequire} */
goog.require('ngeo.mobileGeolocationDirective');



/**
 * @param {string} defaultLang The default language.
 * @param {Object.<string, string>} langUrls The languages URLs.
 * @param {angularGettext.Catalog} gettextCatalog Gettext catalog.
 * @param {ngeo.GetBrowserLanguage} ngeoGetBrowserLanguage
 * @param {angular.Scope} $scope Scope.
 * @param {ngeo.StateManager} ngeoStateManager the state manager.
 * @param {ngeo.FeatureOverlayMgr} ngeoFeatureOverlayMgr The ngeo feature
 *     overlay manager service.
 * @param {nk.Themes} nkThemes Themes service.
 * @param {string} fulltextsearchUrl url to a nk fulltextsearch service.
 * @constructor
 * @extends {nk.AbstractMobileController}
 * @ngInject
 * @export
 */
app.MobileController = function(
    defaultLang, langUrls, gettextCatalog, ngeoGetBrowserLanguage,
    $scope, ngeoStateManager, ngeoFeatureOverlayMgr,
    nkThemes, fulltextsearchUrl) {
  goog.base(
      this, {
        srid: 21781,
        mapViewConfig: {
          center: [632464, 185457],
          minZoom: 3,
          zoom: 3
        }
      }, defaultLang, langUrls, gettextCatalog, ngeoGetBrowserLanguage,
      $scope, ngeoStateManager, ngeoFeatureOverlayMgr,
      nkThemes, fulltextsearchUrl);
};
goog.inherits(app.MobileController, nk.AbstractMobileController);



appModule.controller('MobileController', app.MobileController);
