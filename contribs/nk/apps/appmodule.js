/**
 * This file provides the "app" namespace, which is the
 * application's main namespace. And it defines the application's Angular
 * module.
 */
goog.provide('app');

/**
 * This goog.require is needed because it provides nkModule.
 * @suppress {extraRequire}
 */
goog.require('nk');


/**
 * @type {!angular.Module}
 */
var appModule = angular.module('app', [nkModule.name]);
