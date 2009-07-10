/*
 * jMapping - jQuery plugin for creating Google Maps
 *
 * Copyright (c) 2009 Brian Landau (Viget Labs)
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 */

if (GMap2){
  // A convience function.
  GMap2.prototype.centerAndZoomOnBounds = function(bounds) {
    this.setCenter(bounds.getCenter(), this.getBoundsZoomLevel(bounds));
  };
}

(function($){
  $.jMapping = function(map_elm, options){
    var self = this, places, info_window_selector;
    if (typeof map_elm == "string"){
      map_elm = $(map_elm).get(0);
    }
    this.settings = $.extend(true, {}, $.jMapping.defaults);
    $.extend(true, this.settings, options);
    
    if (!($(map_elm).data('jMapping') instanceof $.jMapping)){
      if (GBrowserIsCompatible()) {
        info_window_selector = [
          this.settings.side_bar_selector, 
          this.settings.location_selector, 
          this.settings.info_window_selector
        ].join(' ');
        $(info_window_selector).hide();

        places = this.getPlaces();

        this.createMap(map_elm, places);
        
        places.each(function(){
          var marker = self.createMarker(this);
          self.map.addOverlay(marker);
          
          if (!(self.settings.link_selector === false)){
            self.setupLink(this);
          }
        });
        
        if (!(this.settings.link_selector === false)){
          this.attachMapsEventToLinks();
        }
      } else {
        this.mapped = false;
      }
    }
  };
  
  $.extend($.jMapping, {
    defaults: {
      side_bar_selector: '#map-side-bar:first',
      location_selector: '.map-location',
      link_selector: 'a.map-link',
      info_window_selector: '.info-box',
      info_window_max_width: 425,
      metadata_options: {type: 'attr', name: 'data'}
    },
    makeGLatLng: function(place_point){
      return new GLatLng(place_point.lat, place_point.lng);
    }
  });
  
  $.jMapping.prototype = {
    gmarkers: {},
    mapped: true,
    createMap: function(map_elm, places){
      this.map = new GMap2(map_elm);
      if ($.isFunction(this.settings.map_config)){
        this.settings.map_config(this.map);
      } else {
        this.map.setMapType(G_NORMAL_MAP);
        this.map.addControl(new GSmallMapControl());
      }
      this.map.centerAndZoomOnBounds(this.getBounds(places));
    },
    getPlaces: function(){
      return $(this.settings.side_bar_selector+' '+this.settings.location_selector);
    },
    getPlacesData: function(places){
      var self = this;
      return places.map(function(){
        return $(this).metadata(self.settings.metadata_options);
      });
    },
    getBounds: function(places){
      var places_data = this.getPlacesData(places);
      var bounds = new GLatLngBounds($.jMapping.makeGLatLng(places_data[0].point), $.jMapping.makeGLatLng(places_data[0].point));
      for (var i=1, len = places_data.length ; i<len; i++) {
        bounds.extend($.jMapping.makeGLatLng(places_data[i].point));
      }
      return bounds;
    },
    setupLink: function(place_elm){
      var $place_elm = $(place_elm);
      var location_data = $place_elm.metadata(this.settings.metadata_options);
      var link = $place_elm.find(this.settings.link_selector);
      if (link.attr('href').match(/^((\#.*)|(\s*))$/)){
        link.attr('href', ("#" + location_data.id));
      }
    },
    chooseIconOptions: function(category){
      if (this.settings.category_icon_options){
        if ($.isFunction(this.settings.category_icon_options)){
          return this.settings.category_icon_options(category);
        } else {
          return this.settings.category_icon_options[category] || this.settings.category_icon_options['default'];
        }
      } else {
        return {};
      }
    },
    createMarker: function(place_elm){
      var $place_elm = $(place_elm), place_data, point, marker, $info_window_elm;
      
      place_data = $place_elm.metadata(this.settings.metadata_options);
      point = $.jMapping.makeGLatLng(place_data.point);
      if (this.settings.category_icon_options){
        var custom_icon = MapIconMaker.createMarkerIcon(this.chooseIconOptions(place_data.category));
        marker = new GMarker(point, {icon: custom_icon});
      } else {
        marker = new GMarker(point);
      }
      
      $info_window_elm = $place_elm.find(this.settings.info_window_selector);
      if ($info_window_elm.length > 0){
        // bind the info HTML to the marker
        marker.bindInfoWindowHtml(
          $info_window_elm.html(), 
          {maxWidth: this.settings.info_window_max_width}
        );
      }
      
      this.gmarkers[parseInt(place_data.id, 10)] = marker;
      
      return marker;
    },
    attachMapsEventToLinks: function(){
      var self = this;
      var location_link_selector = [
        this.settings.side_bar_selector, 
        this.settings.location_selector, 
        this.settings.link_selector
      ].join(' ');

      $(location_link_selector).live('click', function(e){
        e.preventDefault();
        var marker_index = parseInt($(this).attr('href').split('#')[1], 10);
        GEvent.trigger(self.gmarkers[marker_index], "click");
      });
    }
  };
  
  $.fn.jMapping = function(options){
    $(this[0]).data('jMapping', new $.jMapping(this[0], options));
    return this;
  };
})(jQuery);
