/**
 * @name MapIconMaker
 * @version 1.1
 * @author Pamela Fox
 * @copyright (c) 2008 Pamela Fox
 * @homepage http://gmaps-utility-library.googlecode.com/svn/trunk/mapiconmaker
 * @fileoverview This gives you static functions for creating dynamically
 *     sized and colored marker icons using the Charts API marker output.
 */

/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. 
 */

/**
 * @name MarkerIconOptions
 * @class This class represents optional arguments to {@link createMarkerIcon}, 
 *     {@link createFlatIcon}, or {@link createLabeledMarkerIcon}. Each of the
 *     functions use a subset of these arguments. See the function descriptions
 *     for the list of supported options.
 * @property {Number} [width=32] Specifies, in pixels, the width of the icon.
 *     The width may include some blank space on the side, depending on the
 *     height of the icon, as the icon will scale its shape proportionately.
 * @property {Number} [height=32] Specifies, in pixels, the height of the icon.
 * @property {String} [primaryColor="#ff0000"] Specifies, as a hexadecimal
 *     string, the color used for the majority of the icon body.
 * @property {String} [cornerColor="#ffffff"] Specifies, as a hexadecimal
 *     string, the color used for the top corner of the icon. If you'd like the
 *     icon to have a consistent color, make the this the same as the
 *     {@link primaryColor}.
 * @property {String} [strokeColor="#000000"] Specifies, as a hexadecimal
 *     string, the color used for the outside line (stroke) of the icon.
 * @property {String} [shadowColor="#000000"] Specifies, as a hexadecimal
 *     string, the color used for the shadow of the icon. 
 * @property {String} [label=""] Specifies a character or string to display
 *     inside the body of the icon. Generally, one or two characters looks best.
 * @property {String} [labelColor="#000000"] Specifies, as a hexadecimal 
 *     string, the color used for the label text.
 * @property {Number} [labelSize=0] Specifies, in pixels, the size of the label
 *     text. If set to 0, the text auto-sizes to fit the icon body.
 * @property {String} [shape="circle"] Specifies shape of the icon. Current
 *     options are "circle" for a circle or "roundrect" for a rounded rectangle.
 * @property {Boolean} [addStar = false] Specifies whether to add a star to the
 *     edge of the icon.
 * @property {String} [starPrimaryColor="#FFFF00"] Specifies, as a hexadecimal
 *     string, the color used for the star body.
 * @property {String} [starStrokeColor="#0000FF"] Specifies, as a hexadecimal
 *     string, the color used for the outside line (stroke) of the star.
 */

/**
 * This namespace contains functions that you can use to easily create
 *     dynamically sized, colored, and labeled icons.
 * @namespace
 */
var MapIconMaker = {};

/**
 * Creates an icon based on the specified options in the 
 *   {@link MarkerIconOptions} argument.
 *   Supported options are: width, height, primaryColor, 
 *   strokeColor, and cornerColor.
 * @param {MarkerIconOptions} [opts]
 * @return {GIcon}
 */
MapIconMaker.createMarkerIcon = function (opts) {
  var width = opts.width || 32;
  var height = opts.height || 32;
  var primaryColor = opts.primaryColor || "#ff0000";
  var strokeColor = opts.strokeColor || "#000000";
  var cornerColor = opts.cornerColor || "#ffffff";
   
  var baseUrl = "http://chart.apis.google.com/chart?cht=mm";
  var iconUrl = baseUrl + "&chs=" + width + "x" + height + 
      "&chco=" + cornerColor.replace("#", "") + "," + 
      primaryColor.replace("#", "") + "," + 
      strokeColor.replace("#", "") + "&ext=.png";
  var icon = new GIcon(G_DEFAULT_ICON);
  icon.image = iconUrl;
  icon.iconSize = new GSize(width, height);
  icon.shadowSize = new GSize(Math.floor(width * 1.6), height);
  icon.iconAnchor = new GPoint(width / 2, height);
  icon.infoWindowAnchor = new GPoint(width / 2, Math.floor(height / 12));
  icon.printImage = iconUrl + "&chof=gif";
  icon.mozPrintImage = iconUrl + "&chf=bg,s,ECECD8" + "&chof=gif";
  iconUrl = baseUrl + "&chs=" + width + "x" + height + 
      "&chco=" + cornerColor.replace("#", "") + "," + 
      primaryColor.replace("#", "") + "," + 
      strokeColor.replace("#", "");
  icon.transparent = iconUrl + "&chf=a,s,ffffff11&ext=.png";

  icon.imageMap = [
    width / 2, height,
    (7 / 16) * width, (5 / 8) * height,
    (5 / 16) * width, (7 / 16) * height,
    (7 / 32) * width, (5 / 16) * height,
    (5 / 16) * width, (1 / 8) * height,
    (1 / 2) * width, 0,
    (11 / 16) * width, (1 / 8) * height,
    (25 / 32) * width, (5 / 16) * height,
    (11 / 16) * width, (7 / 16) * height,
    (9 / 16) * width, (5 / 8) * height
  ];
  for (var i = 0; i < icon.imageMap.length; i++) {
    icon.imageMap[i] = parseInt(icon.imageMap[i]);
  }

  return icon;
};


/**
 * Creates a flat icon based on the specified options in the 
 *     {@link MarkerIconOptions} argument.
 *     Supported options are: width, height, primaryColor,
 *     shadowColor, label, labelColor, labelSize, and shape..
 * @param {MarkerIconOptions} [opts]
 * @return {GIcon}
 */
MapIconMaker.createFlatIcon = function (opts) {
  var width = opts.width || 32;
  var height = opts.height || 32;
  var primaryColor = opts.primaryColor || "#ff0000";
  var shadowColor = opts.shadowColor || "#000000";
  var label = MapIconMaker.escapeUserText_(opts.label) || "";
  var labelColor = opts.labelColor || "#000000";
  var labelSize = opts.labelSize || 0;
  var shape = opts.shape ||  "circle";
  var shapeCode = (shape === "circle") ? "it" : "itr";

  var baseUrl = "http://chart.apis.google.com/chart?cht=" + shapeCode;
  var iconUrl = baseUrl + "&chs=" + width + "x" + height + 
      "&chco=" + primaryColor.replace("#", "") + "," + 
      shadowColor.replace("#", "") + "ff,ffffff01" +
      "&chl=" + label + "&chx=" + labelColor.replace("#", "") + 
      "," + labelSize;
  var icon = new GIcon(G_DEFAULT_ICON);
  icon.image = iconUrl + "&chf=bg,s,00000000" + "&ext=.png";
  icon.iconSize = new GSize(width, height);
  icon.shadowSize = new GSize(0, 0);
  icon.iconAnchor = new GPoint(width / 2, height / 2);
  icon.infoWindowAnchor = new GPoint(width / 2, height / 2);
  icon.printImage = iconUrl + "&chof=gif";
  icon.mozPrintImage = iconUrl + "&chf=bg,s,ECECD8" + "&chof=gif";
  icon.transparent = iconUrl + "&chf=a,s,ffffff01&ext=.png";
  icon.imageMap = []; 
  if (shapeCode === "itr") {
    icon.imageMap = [0, 0, width, 0, width, height, 0, height];
  } else {
    var polyNumSides = 8;
    var polySideLength = 360 / polyNumSides;
    var polyRadius = Math.min(width, height) / 2;
    for (var a = 0; a < (polyNumSides + 1); a++) {
      var aRad = polySideLength * a * (Math.PI / 180);
      var pixelX = polyRadius + polyRadius * Math.cos(aRad);
      var pixelY = polyRadius + polyRadius * Math.sin(aRad);
      icon.imageMap.push(parseInt(pixelX), parseInt(pixelY));
    }
  }

  return icon;
};


/**
 * Creates a labeled marker icon based on the specified options in the 
 *     {@link MarkerIconOptions} argument.
 *     Supported options are: primaryColor, strokeColor, 
 *     starPrimaryColor, starStrokeColor, label, labelColor, and addStar.
 * @param {MarkerIconOptions} [opts]
 * @return {GIcon}
 */
MapIconMaker.createLabeledMarkerIcon = function (opts) {
  var primaryColor = opts.primaryColor || "#DA7187";
  var strokeColor = opts.strokeColor || "#000000";
  var starPrimaryColor = opts.starPrimaryColor || "#FFFF00";
  var starStrokeColor = opts.starStrokeColor || "#0000FF";
  var label = MapIconMaker.escapeUserText_(opts.label) || "";
  var labelColor = opts.labelColor || "#000000";
  var addStar = opts.addStar || false;
  
  var pinProgram = (addStar) ? "pin_star" : "pin";
  var baseUrl = "http://chart.apis.google.com/chart?cht=d&chdp=mapsapi&chl=";
  var iconUrl = baseUrl + pinProgram + "'i\\" + "'[" + label + 
      "'-2'f\\"  + "hv'a\\]" + "h\\]o\\" + 
      primaryColor.replace("#", "")  + "'fC\\" + 
      labelColor.replace("#", "")  + "'tC\\" + 
      strokeColor.replace("#", "")  + "'eC\\";
  if (addStar) {
    iconUrl += starPrimaryColor.replace("#", "") + "'1C\\" + 
        starStrokeColor.replace("#", "") + "'0C\\";
  }
  iconUrl += "Lauto'f\\";

  var icon = new GIcon(G_DEFAULT_ICON);
  icon.image = iconUrl + "&ext=.png";
  icon.iconSize = (addStar) ? new GSize(23, 39) : new GSize(21, 34);
  return icon;
};


/**
 * Utility function for doing special chart API escaping first,
 *  and then typical URL escaping. Must be applied to user-supplied text.
 * @private
 */
MapIconMaker.escapeUserText_ = function (text) {
  if (text === undefined) {
    return null;
  }
  text = text.replace(/@/, "@@");
  text = text.replace(/\\/, "@\\");
  text = text.replace(/'/, "@'");
  text = text.replace(/\[/, "@[");
  text = text.replace(/\]/, "@]");
  return encodeURIComponent(text);
};
