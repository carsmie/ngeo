/**
 * Externs for GeoMapFish
 *
 * @externs
 */



/**
 * @type {Object}
 */
var nkx;

/**
 * A part of the application config.
 * @typedef {{
 *    srid: (number),
 *    positionFeatureStyle: (ol.style.Style|undefined),
 *    accuracyFeatureStyle: (ol.style.Style|undefined),
 *    geolocationZoom: (number|undefined),
 *    mapViewConfig: (olx.ViewOptions|undefined),
 *    mapControls: (ol.Collection.<ol.control.Control>|Array.<ol.control.Control>|undefined),
 *    mapInteractions: (ol.Collection.<ol.interaction.Interaction>|Array.<ol.interaction.Interaction>|undefined)
 * }}
 */
nkx.Config;

/**
 * Datasource configuration options for the search directive.
 * @typedef {{
 *    bloodhoundOptions: (BloodhoundOptions|undefined),
 *    datasetTitle: (string|undefined),
 *    labelKey: string,
 *    groupsKey: (string|undefined),
 *    groupValues: (Array.<string>|undefined),
 *    projection: (string|undefined),
 *    typeaheadDatasetOptions: (TypeaheadDataset|undefined),
 *    url: string
 * }}
 */
nkx.SearchDirectiveDatasource;


/**
 * The optional Bloodhound configuration for this data set.
 * See: https://github.com/twitter/typeahead.js/blob/master/doc/bloodhound.md
 * @type {BloodhoundOptions|undefined}
 */
nkx.SearchDirectiveDatasource.prototype.bloodhoundOptions;


/**
 * The title of this set of data.
 * @type {string|undefined}
 */
nkx.SearchDirectiveDatasource.prototype.datasetTitle;


/**
 * The name of a corresponding GeoJSON property key in the current dataset.
 * The bound value of this property key will be used as label.
 * @type {string|undefined}
 */
nkx.SearchDirectiveDatasource.prototype.labelKey;


/**
 * The GeoJSON property key that will be used to group data.
 * If set, the option 'groupValues' must be set too.
 * @type {string}
 */
nkx.SearchDirectiveDatasource.prototype.groupsKey;


/**
 * Possible values for the 'groupsKey' key. Will be ignored if option
 * 'groupsKey' is not set. Used to define groups of dataset.
 * @type {Array.<string>|undefined}
 */
nkx.SearchDirectiveDatasource.prototype.groupValues;


/**
 * The geometry's projection for this set of data.
 * @type {string|undefined}
 */
nkx.SearchDirectiveDatasource.prototype.projection;


/**
 * The optional Typeahead configuration for this dataset.
 * See: https://github.com/twitter/typeahead.js/blob/master/
 * doc/jquery_typeahead.md#datasets
 * @type {TypeaheadDataset|undefined}
 */
nkx.SearchDirectiveDatasource.prototype.typeaheadDatasetOptions;


/**
 * Url of the search service. Must contain a '%QUERY' term that will be
 * replaced by the input string.
 * @type {string}
 */
nkx.SearchDirectiveDatasource.prototype.url;


/**
 * @typedef {{layer: string}}
 */
nkx.source.AsitVDOptions;


/**
 * Layer name. Possible values are `asitvd.fond_couleur`, `asitvd.fond_gris`
 * and `asitvd.fond_pourortho`.
 * @type {string}
 */
nkx.source.AsitVDOptions.prototype.layer;


/**
 * @typedef {{
 *    layer: string,
 *    format: (string|undefined),
 *    timestamp: string
 * }}
 */
nkx.source.SwisstopoOptions;


/**
 * Layer name.
 * @type {string}
 */
nkx.source.SwisstopoOptions.prototype.layer;


/**
 * Image format. Default is `png`.
 * @type {string}
 */
nkx.source.SwisstopoOptions.prototype.format;


/**
 * The `Time` dimension of the source.
 * @type {string}
 */
nkx.source.SwisstopoOptions.prototype.timestamp;


/**
 * @typedef {{
 *     exportgpxkml: string
 * }}
 */
nkx.ServiceUrls;


/**
 * URL to the "exportgpxkml" service.
 * @type {string}
 */
nkx.ServiceUrls.prototype.exportgpxkml;
