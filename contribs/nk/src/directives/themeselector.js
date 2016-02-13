goog.provide('nk.ThemeselectorController');
goog.provide('nk.themeselectorDirective');

goog.require('nk');
goog.require('nk.Themes');
goog.require('ngeo.Location');


/**
 * @htmlAttribute {string} nk-themeselector-defaulttheme The default theme.
 * @htmlAttribute {string} nk-themeselector-currenttheme The selected theme.
 * @htmlAttribute {Function} nk-themeselector-filter The themes filter.
 * @return {angular.Directive} The directive specs.
 * @ngInject
 * @ngdoc directive
 * @ngname nkThemeselector
 */
nk.themeselectorDirective = function() {
  return {
    restrict: 'E',
    controller: 'nkThemeselectorController',
    scope: {
      'defaultTheme': '@nkThemeselectorDefaulttheme',
      'currentTheme': '=nkThemeselectorCurrenttheme',
      'filter': '=nkThemeselectorFilter'
    },
    bindToController: true,
    controllerAs: 'tsCtrl',
    templateUrl: nk.baseTemplateUrl + '/themeselector.html'
  };
};

nkModule.directive('nkThemeselector', nk.themeselectorDirective);



/**
 * @param {ngeo.Location} ngeoLocation ngeo Location service.
 * @param {nk.Themes} nkThemes Themes service.
 * @constructor
 * @export
 * @ngInject
 * @ngdoc controller
 * @ngname nkThemeselectorController
 */
nk.ThemeselectorController = function(ngeoLocation, nkThemes) {

  /**
   * @type {Array.<Object>}
   * @export
   */
  this.themes;

  /**
   * @type {Object}
   * @export
   */
  this.currentTheme;

  /**
   * @type {string}
   * @export
   */
  this.defaultTheme = this.defaultTheme || 'main';

  /**
   * @type {Function|undefined}
   * @export
   */
  this.filter;

  /**
   * @type {ngeo.Location}
   * @private
   */
  this.ngeoLocation_ = ngeoLocation;

  /**
   * @type {nk.Themes}
   * @private
   */
  this.nkThemes_ = nkThemes;


  this.setThemes_();
};


/**
 * Return true if there is a theme specified in the URL path.
 * @param {Array.<string>} pathElements Array of path elements.
 * @return {boolean} theme in path.
 */
nk.ThemeselectorController.themeInUrl = function(pathElements) {
  var indexOfTheme = pathElements.indexOf('theme');
  return indexOfTheme >= 0 &&
      pathElements.indexOf('theme') == pathElements.length - 2;
};


/**
 * @param {string} themeId The theme id to set in the path of the URL.
 * @private
 */
nk.ThemeselectorController.prototype.setLocationPath_ = function(themeId) {
  var pathElements = this.ngeoLocation_.getPath().split('/');
  goog.asserts.assert(pathElements.length > 1);
  if (pathElements[pathElements.length - 1] === '') {
    // case where the path is just "/"
    pathElements.splice(pathElements.length - 1);
  }
  if (nk.ThemeselectorController.themeInUrl(pathElements)) {
    pathElements[pathElements.length - 1] = themeId;
  } else {
    pathElements.push('theme', themeId);
  }
  this.ngeoLocation_.setPath(pathElements.join('/'));
};


/**
 * Store the loaded themes locally applying a filter (if any), then set the
 * current theme.
 * @private
 */
nk.ThemeselectorController.prototype.setThemes_ = function() {
  this.nkThemes_.getThemesObject().then(goog.bind(
      /**
       * @param {Array.<Object>} themes Array of theme objects.
       */
      function(themes) {
        // Keep only the themes dedicated to the theme switcher
        this.themes = this.filter ? themes.filter(this.filter) : themes;

        // Then set current theme by looking first in the URL, otherwise use
        // the default theme and add it to the URL.
        var currentTheme;
        var pathElements = this.ngeoLocation_.getPath().split('/');
        if (nk.ThemeselectorController.themeInUrl(pathElements)) {
          var themeIdFromUrl = pathElements[pathElements.length - 1];
          currentTheme = goog.array.find(this.themes, function(object) {
            return object['name'] === themeIdFromUrl;
          });
        }

        // fallback to default theme, if theme was not found from the url
        if (!currentTheme) {
          currentTheme = {
            'name': this.defaultTheme
          };
        }

        this.switchTheme(currentTheme);

      }, this));
};


/**
 * @param {Object} theme
 * @export
 */
nk.ThemeselectorController.prototype.switchTheme = function(theme) {
  var themeId = theme['name'];
  if (themeId) {
    this.currentTheme = theme;
    this.setLocationPath_(themeId);
  }
};


nkModule.controller('nkThemeselectorController',
    nk.ThemeselectorController);
