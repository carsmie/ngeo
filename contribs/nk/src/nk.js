/**
 * @module nk
 */
goog.provide('nk');

/**
 * This goog.require is needed because it provides ngeoModule.
 * @suppress {extraRequire}
 */
goog.require('ngeo');


/** @type {!angular.Module} */
var nkModule = angular.module('nk', [ngeoModule.name, 'gettext']);


/**
 * The default template based URL, used as it by the template cache.
 * @type {string}
 */
nk.baseTemplateUrl = 'nk';
