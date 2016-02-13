goog.provide('nk-themeselector');

goog.require('nk.Themes');
goog.require('nk.ThemesEventType');
goog.require('nk.themeselectorDirective');


/** @const **/
var app = {};


/** @type {!angular.Module} **/
app.module = angular.module('app', ['nk']);

app.module.constant('nkTreeUrl', 'data/themes.json');



/**
 * @constructor
 * @param {angular.$http} $http Angular's $http service.
 * @param {nk.Themes} nkThemes Themes service.
 * @ngInject
 */
app.MainController = function($http, nkThemes) {

  /**
   * @type {Function}
   * @export
   */
  this.filter =
      /**
       * @param {Object} theme
       * @return {boolean}
       */
      function(theme) {
    return theme.name !== 'Enseignement';
  };

  /**
   * @type {Object|undefined}
   * @export
   */
  this.theme = undefined;

  nkThemes.loadThemes();
};


app.module.controller('MainController', app.MainController);
