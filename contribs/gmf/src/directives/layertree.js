goog.provide('gmf.LayertreeController');
goog.provide('gmf.layertreeDirective');

goog.require('gmf');
goog.require('ngeo.CreatePopup');
goog.require('ngeo.LayerHelper');
goog.require('ngeo.LayertreeController');
goog.require('ol.Collection');
goog.require('ol.layer.Tile');


gmfModule.value('gmfLayertreeTemplate',
    /**
     * @param {angular.JQLite} element Element.
     * @param {angular.Attributes} attrs Attributes.
     */
    function(element, attrs) {
      var subTemplateUrl = gmf.baseTemplateUrl + '/layertree.html';
      return '<div ngeo-layertree="gmfLayertreeCtrl.tree" ' +
          'ngeo-layertree-map="gmfLayertreeCtrl.map" ' +
          'ngeo-layertree-nodelayer="gmfLayertreeCtrl.getLayer(node)" ' +
          'ngeo-layertree-listeners="gmfLayertreeCtrl.listeners(treeScope, ' +
          'treeCtrl)" ' +
          'ngeo-layertree-templateurl="' + subTemplateUrl + '"' +
          '</div>';
    });


// Overrides the path to the layertree template (used by each nodes, except
// the root node that path is defined by the gmfLayertreeTemplate value.
ngeoModule.value('ngeoLayertreeTemplateUrl',
    /**
     * @param {angular.JQLite} element Element.
     * @param {angular.Attributes} attrs Attributes.
     */
    function(element, attrs) {
      return gmf.baseTemplateUrl + '/layertree.html';
    });


/**
 * This directive creates a layertree based on the c2cgeoportal JSON themes
 * source and a {@link ngeo.layertreeDirective}. The controller used by this
 * directive defines some fonctions for each node that are created by a default
 * template. This default template can be overrided by setting the constant
 * 'gmf.layertreeTemplateUrl' but you will must adapt the
 * ngeoLayertreeTemplateUrl value too (to define the children's nodes template
 * path).
 *
 * @example
 * <gmf-layertree
 *   gmf-layertree-source="ctrl.source"
 *   gmf-layertree-map="ctrl.map"
 * </gmf-layertree>
 *
 * You can add an attribute 'gmf-layertree-openlinksinnewwindow="true"' to open
 * metadata URLs in a new window. By default, and in the default template,
 * links will be opened in a popup.
 *
 * @param {string|function(!angular.JQLite=, !angular.Attributes=)}
 *     gmfLayertreeTemplate Template for the directive.
 * @return {angular.Directive} The directive specs.
 * @ngInject
 * @ngdoc directive
 * @ngname gmfLayertreeDirective
 */
gmf.layertreeDirective = function(gmfLayertreeTemplate) {
  return {
    scope: {
      'map': '=gmfLayertreeMap',
      'tree': '=gmfLayertreeSource',
      'openLinksInNewWindowFn': '&gmfLayertreeOpenlinksinnewwindow'
    },
    bindToController: true,
    controller: 'GmfLayertreeController',
    controllerAs: 'gmfLayertreeCtrl',
    template: gmfLayertreeTemplate
  };
};

gmfModule.directive('gmfLayertree', gmf.layertreeDirective);



/**
 * @param {angular.$http} $http Angular http service.
 * @param {angular.$sce} $sce Angular sce service.
 * @param {ngeo.CreatePopup} ngeoCreatePopup Popup service.
 * @param {ngeo.LayerHelper} ngeoLayerHelper Ngeo Layer Helper.
 * @param {string} gmfWmsUrl URL to the wms service to use by default.
 * @constructor
 * @export
 * @ngInject
 * @ngdoc controller
 * @ngname gmfLayertreeController
 */
gmf.LayertreeController = function($http, $sce, ngeoCreatePopup,
    ngeoLayerHelper, gmfWmsUrl) {

  /**
   * @private
   * @type {angular.$http}
   */
  this.$http_ = $http;

  /**
   * @private
   * @type {angular.$sce}
   */
  this.$sce_ = $sce;

  /**
   * @type {string}
   * @private
   */
  this.gmfWmsUrl_ = gmfWmsUrl;

  /**
   * @type {ngeo.LayerHelper}
   * @private
   */
  this.layerHelper_ = ngeoLayerHelper;

  /**
   * @type {Array.<ol.layer.Layer>}
   * @private
   */
  this.existingLayers_ = [];

  /**
   * @private
   * @type {ngeo.Popup}
   */
  this.infoPopup_ = ngeoCreatePopup();

  /**
   * @type {Object.<string, !angular.$q.Promise>}
   * @private
   */
  this.promises_ = {};

  /**
   * @type {boolean}
   * @export
   */
  this.openLinksInNewWindow = this['openLinksInNewWindowFn']() === true ?
      true : false;
};


/**
 * Create and return a layer corresponding to the ngeo layertree's node.
 * Currently only creates WMS layers (internal or external) and WMTS layers.
 * @param {GmfThemesNode} node Layer tree node.
 * @return {ol.layer.Base} The OpenLayers layer or group for the node.
 * @export
 */
gmf.LayertreeController.prototype.getLayer = function(node) {
  var layer;
  var layerName = node.name;
  var layerURL = node.url || this.gmfWmsUrl_;
  var i, children = node.children;

  // If node is a group.
  if (goog.isDef(children)) {
    var layers = new ol.Collection();
    for (i = 0; i < children.length; i++) {
      layers.push(this.getLayer(children[i]));
    }
    return this.layerHelper_.createBasicGroup(layers);
  }

  // If node describes a layer that was already created.
  layer = this.layerHelper_.findLayer(this.existingLayers_,
      this.layerHelper_.makeHelperID(layerURL, layerName));
  if (goog.isDefAndNotNull(layer)) {
    return layer;
  }

  // If node describes a layer that was not already created.
  if (node.type === 'WMTS') {
    var newLayer = new ol.layer.Tile();
    this.layerHelper_.setHelperID(newLayer, layerURL, layerName);
    this.layerHelper_.createWMTSLayerFromCapabilitites(layerURL, layerName)
      .then(function(layer) {
          newLayer.setSource(layer.getSource());
          newLayer.set('capabilitiesStyles', layer.get('capabilitiesStyles'));
        });
    layer = newLayer;
  } else {
    layer = this.layerHelper_.createBasicWMSLayer(layerURL, layerName);
  }
  this.existingLayers_.push(layer);

  // Add the new layer on the map
  this.layerHelper_.addLayerToMap(this.map, layer);

  // If layer is 'unchecked', set it to invisible.
  var metadata = node.metadata;
  if (goog.isDefAndNotNull(metadata)) {
    if (metadata['isChecked'] != 'true') {
      layer.setVisible(false);
    }
  }

  return layer;
};


/**
 * Remove layer from map and from this gmf-layertree's existing layers when the
 * relative layertree of the layer catch an on destroy event.
 * @param {angular.Scope} scope treeCtrl scope.
 * @param {ngeo.LayertreeController} treeCtrl ngeo layertree controller, from
 *     the current node.
 * @export
 */
gmf.LayertreeController.prototype.listeners = function(scope, treeCtrl) {
  var existingLayers = this.existingLayers_;
  scope.$on('$destroy', angular.bind(treeCtrl, function() {
    var i, l;
    // Remove treeCtrl.layer from  map.
    treeCtrl.map.removeLayer(treeCtrl.layer);
    // Remove the treeCtrl.layer from gmf layertree's layers.
    for (i = 0; i < existingLayers.length; i++) {
      l = existingLayers[i];
      if (l === treeCtrl.layer) {
        existingLayers.splice(i, 1);
        break;
      }
    }
  }));
};


/**
 * Return 'outOfResolution' if the current resolution of the map is out of
 * the min/max resolution in the node.
 * @param {GmfThemesNode} node Layer tree node.
 * @return {?string} 'outOfResolution' or null.
 * @export
 */
gmf.LayertreeController.prototype.getResolutionStyle = function(node) {
  var style;
  var resolution = this.map.getView().getResolution();
  var maxExtent = node.maxResolutionHint;
  var minExtent = node.minResolutionHint;
  if (goog.isDef(minExtent) && resolution < minExtent ||
      goog.isDef(maxExtent) && resolution > maxExtent) {
    style = 'outOfResolution';
  }
  return style || null;
};


/**
 * Toggle activation of a node by adding or removing relative(s) layer(s) on
 * the map.
 * @param {ngeo.LayertreeController} treeCtrl ngeo layertree controller, from
 *     the current node.
 * @export
 */
gmf.LayertreeController.prototype.toggleActive = function(treeCtrl) {
  var layer = treeCtrl.layer;
  var i;
  // Check if the current node state is 'activated'.
  var visible = (this.getNodeState(treeCtrl) === 'on') ? false : true;

  var layers = this.layerHelper_.getFlatLayers(layer);
  for (i = 0; i < layers.length; i++) {
    layers[i].setVisible(visible);
  }
};


/**
 * Return a class name that match with the current node activation state.
 * @param {ngeo.LayertreeController} treeCtrl ngeo layertree controller, from
 *     the current node.
 * @return {string} 'on' or 'off' or 'indeterminate'.
 * @export
 */
gmf.LayertreeController.prototype.getNodeState = function(treeCtrl) {
  var style;
  var node = treeCtrl.node;
  var layer = treeCtrl.layer;

  if (goog.isDef(node.children)) {
    // Find number of visible layers on the map for this layer group.
    var i, nbrLayerOnMap = 0;
    var layers = this.layerHelper_.getFlatLayers(layer);
    for (i = 0; i < layers.length; i++) {
      if (layers[i].getVisible()) {
        nbrLayerOnMap++;
      }
    }
    // Get style for this layer group node state
    if (nbrLayerOnMap === layers.length) {
      style = 'on';
    } else if (nbrLayerOnMap > 0) {
      style = 'indeterminate';
    } else {
      style = 'off';
    }
  } else {
    // Get style of this node depending if the relative layer is visible.
    style = layer.getVisible() ? 'on' : 'off';
  }
  return style;
};


/**
 * Get the icon image URL for the given treeCtrl's layer. It can only return a
 * string for internal WMS layers without multiple childlayers in the node.
 * @param {ngeo.LayertreeController} treeCtrl ngeo layertree controller, from
 *     the current node.
 * @return {?string} The icon legend URL or null.
 * @export
 */
gmf.LayertreeController.prototype.getLegendIconURL = function(treeCtrl) {
  var layer = treeCtrl.layer;
  var node = treeCtrl.node;
  var opt_legendRule = node.metadata['legendRule'];

  if (goog.isDef(node.children) ||
      !goog.isDef(opt_legendRule) ||
      node.type === 'WMTS' ||
      node.type === 'external WMS' ||
      goog.isDef(node.childLayers) && node.childLayers.length > 1) {
    return null;
  }

  goog.asserts.assertInstanceof(layer, ol.layer.Image);
  return this.getWMSLegendURL_(layer, opt_legendRule);
};


/**
 * Get the complete legend URL for the given treeCtrl's layer.
 * @param {ngeo.LayertreeController} treeCtrl ngeo layertree controller, from
 *     the current node.
 * @return {?string} The legend URL or null.
 * @export
 */
gmf.LayertreeController.prototype.getLegendURL = function(treeCtrl) {
  var layer = treeCtrl.layer;
  var node = treeCtrl.node;

  if (goog.isDef(node.children)) {
    return null;
  }

  if (node.type === 'WMTS') {
    goog.asserts.assertInstanceof(layer, ol.layer.Tile);
    return this.getWMTSLegendURL_(layer);
  } else {
    goog.asserts.assertInstanceof(layer, ol.layer.Image);
    return this.getWMSLegendURL_(layer);
  }
};


/**
 * Get the WMTS legend URL for the given layer.
 * @param {ol.layer.Tile} layer Tile layer as returned by the
 * gmf layerHelper service.
 * @return {?string} The legend URL or null.
 * @private
 */
gmf.LayertreeController.prototype.getWMTSLegendURL_ = function(layer) {
  // FIXME case of multiple styles ?  case of multiple legendUrl ?
  var url;
  var styles = layer.get('capabilitiesStyles');
  if (goog.isDef(styles)) {
    var legendURL = styles[0]['legendURL'];
    if (goog.isDef(legendURL)) {
      url = legendURL[0]['href'];
    }
  }
  return url || null;
};


/**
 * Get the WMS legend URL for the given layer.
 * @param {ol.layer.Image} layer Image layer.
 * @param {string=} opt_legendRule rule parameters to add to the returned URL.
 * @return {?string} The legend URL or null.
 * @private
 */
gmf.LayertreeController.prototype.getWMSLegendURL_ = function(layer,
    opt_legendRule) {
  var source = /** @type {ol.source.ImageWMS} */ (layer.getSource());
  var layerName = source.getParams()['LAYERS'];
  var scale = this.getScale_();
  var url = source.getUrl();
  if (goog.isDef(url)) {
    url = goog.uri.utils.setParam(url, 'FORMAT', 'image/png');
    url = goog.uri.utils.setParam(url, 'TRANSPARENT', true);
    url = goog.uri.utils.setParam(url, 'SERVICE', 'wms');
    url = goog.uri.utils.setParam(url, 'VERSION', '1.1.1');
    url = goog.uri.utils.setParam(url, 'REQUEST', 'GetLegendGraphic');
    url = goog.uri.utils.setParam(url, 'LAYER', layerName);
    url = goog.uri.utils.setParam(url, 'SCALE', scale);
    if (goog.isDef(opt_legendRule)) {
      url = goog.uri.utils.setParam(url, 'RULE', opt_legendRule);
    }
  }
  return url || null;
};


/**
 * Return the current scale of the map.
 * @return {number}
 * @private
 */
gmf.LayertreeController.prototype.getScale_ = function() {
  var view = this.map.getView();
  var resolution = view.getResolution();
  var mpu = view.getProjection().getMetersPerUnit();
  var dpi = 25.4 / 0.28;
  return resolution * mpu * 39.37 * dpi;
};


/**
 * Display a ngeo.infoPopup with the content of the metadata url of a node.
 * @param {ngeo.LayertreeController} treeCtrl ngeo layertree controller, from
 *     the current node.
 * @export
 */
gmf.LayertreeController.prototype.displayMetadata = function(treeCtrl) {
  var treeUid = treeCtrl['uid'].toString();
  var node = treeCtrl.node;
  var metadataURL = node.metadata['metadataUrl'];
  if (goog.isDef(metadataURL)) {
    if (!(treeUid in this.promises_)) {
      this.promises_[treeUid] = this.$http_.get(metadataURL).then(
          angular.bind(this, function(resp) {
            var html = this.$sce_.trustAsHtml(resp.data);
            return html;
          }));
    }
    var infoPopup = this.infoPopup_;
    this.promises_[treeUid].then(function(html) {
      infoPopup.setTitle(node.name);
      infoPopup.setContent(html);
      infoPopup.setOpen(true);
    });
  }
};


/**
 * Return 'noSource' if no source is defined in the given treeCtrl's layer.
 * @param {ngeo.LayertreeController} treeCtrl ngeo layertree controller, from
 *     the current node.
 * @return {?string} 'noSource' or null
 * @export
 */
gmf.LayertreeController.prototype.getNoSourceStyle = function(treeCtrl) {
  var layer = treeCtrl.layer;
  if (goog.isDef(layer.getSource)) {
    if (!goog.isDefAndNotNull(layer.getSource())) {
      return 'noSource';
    }
  }
  return null;
};


/**
 * Set the resolution of the map with the max or min resolution of the node.
 * @param {GmfThemesNode} node Layer tree node.
 * @export
 */
gmf.LayertreeController.prototype.zoomToResolution = function(node) {
  var view = this.map.getView();
  var resolution = node.minResolutionHint || node.maxResolutionHint;
  if (goog.isDef(resolution)) {
    view.setResolution(resolution);
  }
};


gmfModule.controller('GmfLayertreeController', gmf.LayertreeController);
