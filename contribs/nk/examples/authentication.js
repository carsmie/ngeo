goog.provide('nk-authentication');

goog.require('nk.authenticationDirective');


/** @const **/
var app = {};


/** @type {!angular.Module} **/
app.module = angular.module('app', ['nk']);


app.module.constant(
    'authenticationBaseUrl',
    'https://geomapfish-demo.camptocamp.net/2.0/wsgi');



/**
 * @constructor
 */
app.MainController = function() {};


app.module.controller('MainController', app.MainController);
