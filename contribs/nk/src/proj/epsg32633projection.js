goog.provide('nk.proj.EPSG32633');

goog.require('ol.proj');

if (typeof proj4 == 'function') {
	proj4.defs('EPSG:32633','+proj=utm +zone=33 +datum=WGS84 +units=m +no_defs');
	proj4.defs("urn:ogc:def:crs:EPSG::32633","+proj=utm +zone=33 +datum=WGS84 +units=m +no_defs");
	ol.proj.get('EPSG:32633').setExtent([-2500000, 3500000, 3045984, 9045984]);
}
