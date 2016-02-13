goog.provide('nk.ExportFeatures');
goog.provide('nk.ExportFormat');

goog.require('nk');
goog.require('goog.asserts');


/**
 * @enum {string}
 */
nk.ExportFormat = {
  GPX: 'gpx',
  KML: 'kml'
};


/**
 * @typedef {function(string, nk.ExportFormat, string)}
 */
nk.ExportFeatures;


/**
 * @param {Document} $document Angular $document service.
 * @param {nkx.ServiceUrls} nkServiceUrls nk URLs objects.
 * @return {nk.ExportFeatures} The "export features" function.
 * @ngInject
 * @private
 * @ngdoc service
 * @ngname nkExportFeatures
 */
nk.exportFeaturesFactory_ = function($document, nkServiceUrls) {
  goog.asserts.assert(nkServiceUrls.exportgpxkml);
  var exportgpxkmlUrl = nkServiceUrls.exportgpxkml;

  return (
      /**
       * @param {string} doc The document to export/download.
       * @param {nk.ExportFormat} format The document format.
       * @param {string} filename File name for the exported document.
       */
      function exportFeatures(doc, format, filename) {
        var formatInput = $('<input>').attr({
          type: 'hidden',
          name: 'format',
          value: format
        });
        var nameInput = $('<input>').attr({
          type: 'hidden',
          name: 'name',
          value: filename
        });
        var docInput = $('<input>').attr({
          type: 'hidden',
          name: 'doc',
          value: doc
        });
        var form = $('<form>').attr({
          method: 'POST',
          action: exportgpxkmlUrl
        });
        form.append(formatInput, nameInput, docInput);
        angular.element($document[0].body).append(form);
        form[0].submit();
        form.remove();
      });
};

nkModule.factory('nkExportFeatures', nk.exportFeaturesFactory_);
