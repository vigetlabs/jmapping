/*
 * jMapping v2.1.0 - jQuery plugin for creating Google Maps
 *
 * Copyright (c) 2009-2010 Brian Landau (Viget Labs)
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 */

(function($){
  $.jMapping = function(map_elm, options){
    var settings, gmarkers, mapped, map, markerManager, places, bounds, jMapper, info_windows;
    map_elm = (typeof map_elm == "string") ? $(map_elm).get(0) : map_elm;
    
    if (!($(map_elm).data('jMapping'))){ // TODO: Should we use a different test here?
      settings = $.extend(true, {}, $.jMapping.defaults);
      $.extend(true, settings, options);
      gmarkers = {};
      info_windows = [];
      
      var init = function(doUpdate){
        var info_window_selector, min_zoom, zoom_level;

        info_window_selector = [
          settings.side_bar_selector, 
          settings.location_selector, 
          settings.info_window_selector
        ].join(' ');
        $(info_window_selector).hide();

        places = getPlaces();
        bounds = getBounds(doUpdate);

        if (doUpdate){
          gmarkers = {};
          info_windows = [];
          markerManager.clearMarkers();
          google.maps.event.trigger(map, 'resize');
          map.fitBounds(bounds);
          if (settings.force_zoom_level){
            map.setZoom(settings.force_zoom_level);
          }
        } else {
          map = createMap();
          markerManager = new MarkerManager(map);
        }

        places.each(function(){
          var marker = createMarker(this);
          if (!(settings.link_selector === false)){
            setupLink(this);
          }
          $(document).trigger('markerCreated.jMapping', [marker]);
        });
        
        if (doUpdate){
          updateMarkerManager();
        } else {
          google.maps.event.addListener(markerManager, 'loaded', function(){
            updateMarkerManager();
            if (settings.default_zoom_level){
              map.setZoom(settings.default_zoom_level);
            }
          }); 
        }

        if (!(settings.link_selector === false) && !doUpdate){
          attachMapsEventToLinks();
        }
      };
      
      var createMap = function(){
        if (settings.map_config){
          map = new google.maps.Map(map_elm, settings.map_config);
        } else {
          map = new google.maps.Map(map_elm, {
            navigationControlOptions: {
              style: google.maps.NavigationControlStyle.SMALL
            },
            mapTypeControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoom: 9
          });
        }
        map.fitBounds(bounds);
        if (settings.force_zoom_level){
          map.setZoom(settings.force_zoom_level);
        }
        return map;
      };
      
      var getPlaces = function(){
        return $(settings.side_bar_selector+' '+settings.location_selector);
      };
      
      var getPlacesData = function(doUpdate){
        return places.map(function(){
          if (doUpdate){
            $(this).data('metadata', false);
          }
          return $(this).metadata(settings.metadata_options);
        });
      };
      
      var getBounds = function(doUpdate){
        var places_data = getPlacesData(doUpdate),
            newBounds, initialPoint;
        
        if (places_data.length){
          initialPoint = $.jMapping.makeGLatLng(places_data[0].point);
        }else{
          initialPoint = $.jMapping.makeGLatLng(settings.default_point);
        }
        newBounds = new google.maps.LatLngBounds(initialPoint, initialPoint);

        for (var i=1, len = places_data.length; i<len; i++) {
          newBounds.extend($.jMapping.makeGLatLng(places_data[i].point));
        }
        return newBounds;
      };
      
      var setupLink = function(place_elm){
        var $place_elm = $(place_elm),
            location_data = $place_elm.metadata(settings.metadata_options),
            link = $place_elm.find(settings.link_selector);

        link.attr('href', ("#" + location_data.id));
      };
      
      var chooseIconOptions = function(category){
        if (settings.category_icon_options){
          if ($.isFunction(settings.category_icon_options)){
            return settings.category_icon_options(category);
          } else {
            return settings.category_icon_options[category] || settings.category_icon_options['default'];
          }
        } else {
          return {};
        }
      };
      
      var createMarker = function(place_elm){
        var $place_elm = $(place_elm), place_data, point, marker, $info_window_elm, 
          info_window;

        place_data = $place_elm.metadata(settings.metadata_options);
        point = $.jMapping.makeGLatLng(place_data.point);
        
        if (settings.category_icon_options){
          icon_options = chooseIconOptions(place_data.category);
          if ((typeof icon_options === "string") || (icon_options instanceof google.maps.MarkerImage)){
            marker = new google.maps.Marker({
              icon: icon_options,
              position: point,
              map: map
            });
          } else {
            marker = new StyledMarker({
              styleIcon: new StyledIcon(StyledIconTypes.MARKER, icon_options),
              position: point,
              map: map
            });
          }
        } else {
          marker = new google.maps.Marker({
            position: point,
            map: map
          });
        }

        $info_window_elm = $place_elm.find(settings.info_window_selector);
        if ($info_window_elm.length > 0){
          info_window = new google.maps.InfoWindow({
              content: $info_window_elm.html(),
              maxWidth: settings.info_window_max_width 
          });
          info_windows.push(info_window);
          google.maps.event.addListener(marker, 'click', function() {
            $.each(info_windows, function(index, iwindow){
              if (info_window != iwindow){
                iwindow.close();
              }
            });
            info_window.open(map, marker);
          });
        }

        gmarkers[parseInt(place_data.id, 10)] = marker;
        return marker;
      };
      
      var updateMarkerManager = function(){
        if (settings.always_show_markers === true) {
          min_zoom = 0;
          max_zoom = null;
        } else {
          min_zoom = settings.marker_min_zoom;
          max_zoom = settings.marker_max_zoom;
        }
        markerManager.addMarkers(gmarkersArray(), min_zoom, max_zoom);
        markerManager.refresh();
        if (settings.force_zoom_level){
          map.setZoom(settings.force_zoom_level);
        }
      };
      
      var attachMapsEventToLinks = function(){
        var location_link_selector = [
          settings.side_bar_selector, 
          settings.location_selector, 
          settings.link_selector
        ].join(' ');
        
        $(location_link_selector).live('click', function(e){
          e.preventDefault();
          var marker_index = parseInt($(this).attr('href').split('#')[1], 10);
          google.maps.event.trigger(gmarkers[marker_index], "click");
        });
      };
      
      var gmarkersArray = function(){
        var marker_arr = [];
        $.each(gmarkers, function(key, value){
          marker_arr.push(value);
        });
        return marker_arr;
      };
      
      if ($(document).trigger('beforeMapping.jMapping', [settings]) != false){
        init();
        mapped = true;
      } else {
        mapped = false;
      }
      jMapper = {
        gmarkers: gmarkers,
        settings: settings,
        mapped: mapped,
        map: map,
        markerManager: markerManager,
        gmarkersArray: gmarkersArray,
        getBounds: getBounds,
        getPlacesData: getPlacesData,
        getPlaces: getPlaces,
        update: function(){
          if ($(document).trigger('beforeUpdate.jMapping', [this])  != false){
            
            init(true);
            this.map = map;
            this.gmarkers = gmarkers;
            this.markerManager = markerManager;
            $(document).trigger('afterUpdate.jMapping', [this]);
          }
        }
      };
      $(document).trigger('afterMapping.jMapping', [jMapper]);
      return jMapper;
    } else {
      return $(map_elm).data('jMapping');
    }
  };
  
  $.extend($.jMapping, {
    defaults: {
      side_bar_selector: '#map-side-bar:first',
      location_selector: '.map-location',
      link_selector: 'a.map-link',
      info_window_selector: '.info-box',
      info_window_max_width: 425,
      default_point: {lat: 0.0, lng: 0.0},
      metadata_options: {type: 'attr', name: 'data-jmapping'},
      marker_max_zoom: null,
      marker_min_zoom: 9
    },
    makeGLatLng: function(place_point){
      return new google.maps.LatLng(place_point.lat, place_point.lng);
    }
  });
  
  $.fn.jMapping = function(options){
    if ((options == 'update') && $(this[0]).data('jMapping')){
      $(this[0]).data('jMapping').update();
    } else {
      if (options == 'update') options = {};
      $(this[0]).data('jMapping', $.jMapping(this[0], options));
    }
    return this;
  };
})(jQuery);
