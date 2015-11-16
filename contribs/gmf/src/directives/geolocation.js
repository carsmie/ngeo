goog.provide('gmf.GeolocationController');
goog.provide('gmf.geolocationDirective');

goog.require('gmf');
goog.require('ngeo.DecorateGeolocation');
goog.require('ngeo.FeatureOverlay');
goog.require('ngeo.FeatureOverlayMgr');
goog.require('ol.Feature');
goog.require('ol.Geolocation');
goog.require('ol.Map');
goog.require('ol.geom.Point');
goog.require('ol.proj');


/**
 * Provide a "geolocation" directive.
 *
 * TODO
 *
 * @example
 * <gmf-geolocation gmf-geolocation-map="ctrl.map"
 * <gmf-geolocation gmf-geolocation-options="ctrl.geolocationOptions"
 * </gmf-geolocation>
 *
 * @return {angular.Directive} The Directive Definition Object.
 * @ngInject
 */
gmf.geolocationDirective = function() {
  return {
    restrict: 'E',
    scope: {
      'getMapFn': '&gmfGeolocationMap',
      'getGeolocationOptionsFn': '&gmfGeolocationOptions'
    },
    controller: 'GmfGeolocationController',
    controllerAs: 'ctrl',
    template:
        '<button ng-click="ctrl.toggleTracking()">Toggle tracking</button>'
  };
};


gmfModule.directive('gmfGeolocation', gmf.geolocationDirective);



/**
 * @constructor
 * @param {angular.Scope} $scope The directive's scope.
 * @param {ngeo.DecorateGeolocation} ngeoDecorateGeolocation Decorate
 *     Geolocation service.
 * @param {ngeo.FeatureOverlayMgr} ngeoFeatureOverlayMgr The ngeo feature
 *     overlay manager service.
 * @export
 * @ngInject
 */
gmf.GeolocationController = function($scope, ngeoDecorateGeolocation,
    ngeoFeatureOverlayMgr) {

  /**
   * @type {angular.Scope}
   * @private
   */
  this.scope_ = $scope;

  var map = this.scope_['getMapFn']();
  goog.asserts.assertInstanceof(map, ol.Map);

  /**
   * @type {!ol.Map}
   * @private
   */
  this.map_ = map;

  var options = this.scope_['getGeolocationOptionsFn']() || {};
  goog.asserts.assertObject(options);

  /**
   * @type {ngeo.FeatureOverlay}
   * @private
   */
  this.featureOverlay_ = ngeoFeatureOverlayMgr.getFeatureOverlay();

  /**
   * @type {ol.Geolocation}
   * @private
   */
  this.geolocation_ = new ol.Geolocation({
    projection: map.getView().getProjection()
  });

  /**
   * @type {ol.Feature}
   * @private
   */
  this.positionFeature_ = new ol.Feature(new ol.geom.Point([0, 0]));

  if (options.positionFeatureStyle) {
    this.positionFeature_.setStyle(options.positionFeatureStyle);
  }

  /**
   * @type {ol.Feature}
   * @private
   */
  this.accuracyFeature_ = new ol.Feature();

  if (options.accuracyFeatureStyle) {
    this.accuracyFeature_.setStyle(options.accuracyFeatureStyle);
  }

  /**
   * @type {number|undefined}
   * @private
   */
  this.zoom_ = options.zoom;

  this.geolocation_.on('change:accuracyGeometry', function() {
    this.accuracyFeature_.setGeometry(this.geolocation_.getAccuracyGeometry());
  }, this);

  this.geolocation_.on('change:position', function(e) {
    this.setPosition_(e);
  }, this);

  ngeoDecorateGeolocation(this.geolocation_);
};


/**
 * @export
 */
gmf.GeolocationController.prototype.toggleTracking = function() {
  this.geolocation_.getTracking() ? this.untrack_() : this.track_();
};


/**
 * @private
 */
gmf.GeolocationController.prototype.track_ = function() {
  this.featureOverlay_.addFeature(this.positionFeature_);
  this.featureOverlay_.addFeature(this.accuracyFeature_);
  this.geolocation_.setTracking(true);
};


/**
 * @private
 */
gmf.GeolocationController.prototype.untrack_ = function() {
  this.featureOverlay_.clear();
  this.geolocation_.setTracking(false);
};


/**
 * @param {jQuery.Event} event Event.
 * @private
 */
gmf.GeolocationController.prototype.setPosition_ = function(event) {
  var position = /** @type {ol.Coordinate} */ (this.geolocation_.getPosition());
  var point = /** @type {ol.geom.Point} */
      (this.positionFeature_.getGeometry());

  point.setCoordinates(position);
  this.map_.getView().setCenter(position);

  if (this.zoom_ !== undefined) {
    this.map_.getView().setZoom(this.zoom_);
  }
};


gmfModule.controller('GmfGeolocationController', gmf.GeolocationController);
