goog.provide('ngeo_control_directive');

goog.require('goog.asserts');
goog.require('ngeo');


/**
 * @typedef {function(Element): ol.control.Control}
 */
ngeo.CreateControl;


/**
 * This directive can be used to add a control to a DOM element of
 * the HTML page. The user of the directive is responsible for
 * providing a function that returns the control instance. That
 * function should be defined in the parent scope.
 *
 * Example #1:
 * <div ngeo-control="createScaleLineControl"></div>
 *
 * Example #2:
 * <div ngeo-control="createScaleLineControl" ngeo-control-map="map1"></div>
 */
ngeoModule.directive('ngeoControl', ['ngeoDefaultMap',
  /**
   * @param {string} ngeoDefaultMap Default map constant.
   * @return {angular.Directive} The directive specs.
   */
  function(ngeoDefaultMap) {
    return {
      restrict: 'A',
      link:
          /**
           * @param {angular.Scope} scope Scope.
           * @param {angular.JQLite} element Element.
           * @param {angular.Attributes} attrs Attributes.
           */
          function(scope, element, attrs) {
            var attr;

            attr = 'ngeoControl';
            var createControl = /** @type {ngeo.CreateControl} */
                (scope.$eval(attrs[attr]));
            var control = createControl(element[0]);

            attr = 'ngeoControlMap';
            var map = /** @type {ol.Map} */
                (scope.$eval(attrs[attr] || ngeoDefaultMap));
            goog.asserts.assertInstanceof(map, ol.Map);

            map.addControl(control);
          }
    };
  }]);