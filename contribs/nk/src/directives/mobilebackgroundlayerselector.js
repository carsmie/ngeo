goog.provide('nk.MobileBackgroundLayerSelectorController');
goog.provide('nk.mobileBackgroundLayerSelectorDirective');

goog.require('nk');
goog.require('nk.Themes');
goog.require('ngeo.BackgroundEventType');
goog.require('ngeo.BackgroundLayerMgr');


nkModule.value('nkMobileBackgroundLayerSelectorTemplateUrl',
    /**
     * @param {angular.JQLite} element Element.
     * @param {angular.Attributes} attrs Attributes.
     */
    function(element, attrs) {
      var templateUrl = attrs['nkMobileBackgroundLayerSelectorTemplateurl'];
      return templateUrl !== undefined ? templateUrl :
          nk.baseTemplateUrl + '/mobilebackgroundlayerselector.html';
    });


/**
 * Provide a "mobile background layer selector" directive.
 *
 * @example
 * <nk-mobile-background-layer-selector
 *   nk-mobile-background-layer-selector-map="::ctrl.map">
 * </nk-mobile-background-layer-selector>
 *
 * @param {string} nkMobileBackgroundLayerSelectorTemplateUrl Url to template.
 * @return {angular.Directive} The Directive Definition Object.
 * @ngInject
 * @ngdoc directive
 * @ngname nkMobileBackgroundLayerSelector
 */
nk.mobileBackgroundLayerSelectorDirective = function(
    nkMobileBackgroundLayerSelectorTemplateUrl) {

  return {
    restrict: 'E',
    scope: {
      'map': '=nkMobileBackgroundLayerSelectorMap'
    },
    bindToController: true,
    controller: 'nkMobileBackgroundLayerSelectorController',
    controllerAs: 'ctrl',
    templateUrl: nkMobileBackgroundLayerSelectorTemplateUrl
  };
};


nkModule.directive('nkMobileBackgroundLayerSelector',
    nk.mobileBackgroundLayerSelectorDirective);



/**
 * @constructor
 * @param {ngeo.BackgroundLayerMgr} ngeoBackgroundLayerMgr Background layer
 *     manager.
 * @param {nk.Themes} nkThemes Themes service.
 * @export
 * @ngInject
 * @ngdoc controller
 * @ngname nkMobileBackgroundLayerSelectorController
 */
nk.MobileBackgroundLayerSelectorController = function(
    ngeoBackgroundLayerMgr, nkThemes) {

  /**
   * @type {ol.Map}
   * @export
   */
  this.map;

  /**
   * @type {ol.layer.Base}
   * @export
   */
  this.bgLayer;

  /**
   * @type {Array.<ol.layer.Base>}
   * @export
   */
  this.bgLayers;

  /**
   * @type {ngeo.BackgroundLayerMgr}
   * @private
   */
  this.backgroundLayerMgr_ = ngeoBackgroundLayerMgr;
  nkThemes.getBgLayers().then(goog.bind(
      /**
       * @param {Array.<ol.layer.Base>} bgLayers Array of background
       *     layer objects.
       */
      function(bgLayers) {
        this.bgLayers = bgLayers;
        // set default bgLayer to the second one (if defined), the first
        // being the blank layer
        this.bgLayer = this.bgLayers[1] !== undefined ?
            this.bgLayers[1] : this.bgLayers[0];
        this.setLayer(this.bgLayer);
      }, this));

  ol.events.listen(
      this.backgroundLayerMgr_,
      ngeo.BackgroundEventType.CHANGE,
      function() {
        this.bgLayer = this.backgroundLayerMgr_.get(this.map);
      },
      this);

};


/**
 * @param {ol.layer.Base} layer Layer.
 * @export
 */
nk.MobileBackgroundLayerSelectorController.prototype.setLayer = function(
    layer) {
  this.bgLayer = layer;
  this.backgroundLayerMgr_.set(this.map, layer);
};


nkModule.controller('nkMobileBackgroundLayerSelectorController',
    nk.MobileBackgroundLayerSelectorController);
