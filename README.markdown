jMapping - Google Maps jQuery Plugin
=====================================

This plugin is designed for quick development of a page that implements 
a Google Map with a list of the locations that are specified within the HTML.


### Links

* [Documentation](http://vigetlabs.github.com/jmapping/ "jMapping Documentation")
* [Examples](http://vigetlabs.github.com/jmapping/examples/ "jMapping: Examples")
* [Repository@GitHub](http://github.com/vigetlabs/jmapping)
* [Downloads](http://wiki.github.com/vigetlabs/jmapping/downloads)


Graceful degradation and Semantic Expectations
-----------------------------------------------

This plugin tries to allow as much graceful degradation as possible by having the HTML be as semantic as possible.
The plugin expect the HTML for the locations to be grouped under a common element.
Additionally, it expects the links and Map Info Window content to be grouped under the location elements.
It also expects the necessary metadata to be on the location element.
This way the HTML semantically reflects that all of those parts and information are associated with the specific location or place.


Basic Usage
------------

Download the necessary dependencies and jMapping.

Make sure you include the necessary scripts in your page:

    <script type="text/javascript" src="http://maps.google.com/maps/api/js?v=3.3&amp;sensor=false"></script>
    <script type="text/javascript" src="markermanager.js"></script>
    <script type="text/javascript" src="StyledMarker.js"></script>
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js"></script>
    <script type="text/javascript" src="jquery.metadata.js"></script>
    <script type="text/javascript" src="jquery.jmapping.js"></script>

Make sure your HTML has a `div` element for the Google map, and there is a container element with some locations and their data. The data by default is expected to be on the "data-jmapping" attribute of the location (this can be configured):

    <div id="map"></div>
    
    <div id="map-side-bar">
      <div class="map-location" data-jmapping="{id: 5, point: {lat: 35.925, lng: -79.053}, category: 'Gas'}">
        <a href="#" class="map-link">Some Place</a>
        <div class="info-box">
          <p>Some thing for the info box.</p>
        </div>
      </div>
      <div class="map-location" data-jmapping="{id: 8, point: {lat: 35.935, lng: -79.024}, category: 'Food'}">
        <a href="#" class="map-link">Another Place</a>
        <div class="info-box">
          <p>Example Text.</p>
        </div>
      </div>
    </div>

Then just call the `jMapping` function on the map element:

    $(document).ready(function(){
      $('#map').jMapping();
    });


If you need to change the markers on the map, usually for some type of pagination, this can be done by simply updating the content of the "side-bar" container to contain new location data and then calling the update function:

    $('#map-side-bar').load('ajax/path/file.html', nil, function(){
      $('#map').jMapping('update');
    });

*OR*

    $('#map-side-bar').load('ajax/path/file.html', nil, function(){
      $('#map').data('jMapping').update();
    });


Options
--------

These are options that can be passed to the `jMapping` function to change specific settings.


* `side_bar_selector`:
  * *Default*: `"#map-side-bar:first"`
  * This defines the selector where location items will be searched for within.
* `location_selector`:
  * *Default*: `".map-location"`
  * This defines the selector for location items. This is the element that the metadata
    needs to be associated with. The plugin will look for items matching this selector *inside* of the side bar element.
* `link_selector`:
  * *Default*: `a.map-link`
  * This selector defines the link that will be used to "activate" a marker on the map. 
    If info window elements are provided the HTML inside of them will be loaded into 
    the pop up window when these links are clicked. You should set this value to `false`
    if you do not wish to use this functionality.
    These links will be searched for inside of the location elements specified in the `location_selector`.
* `info_window_selector`:
  * *Default*: `".info-box"`
  * This selector defines where the content for the Google Maps info window for each location marker is.
    This element will be searched for inside of the location elements specified in the `location_selector`.
    If no element is found no Info Window will be attached to the marker.
* `default_point`:
  * *Default*: `{lat: 0.0, lng: 0.0}`
  * This point determines the Google Maps location if there are no location elements inside the specified `location_selector`.
* `metadata_options`:
  * *Default*: `{type: "attr", name: "data"}`
  * This is the set of options passed to the jQuery metadata function. It defines how the necessary
    metadata for each location will be searched for.
    See the [metadata plugins docs](http://docs.jquery.com/Plugins/Metadata/metadata#toptions) for more info.
* `info_window_max_width`:
  * *Default*: `425`
  * This specifies what the max width of the Google Maps Info Windows can be when a marker is activated.
    Otherwise it will expand to fit the width of the content.
* `map_config`:
  * *Default*: *N/A*
  * This can be set to a [MapOptions object](http://code.google.com/apis/maps/documentation/javascript/reference.html#MapOptions). Which is just a normal object `{}` with specific properties that become the settings for the map.
* `category_icon_options`:
  * *Default*: *N/A*
  * By default the plugin will use the default Google Maps marker icon. But you can use this option
    to specify what options to pass to the StyledMarker based on category data associated with the location.
    It accepts 2 types of values: an object or a function.  
    If the setting is to an object it will take the category data on the location and look for a key on the object
    that matches and return that value. If there is no value for the supplied category, it will return
    the value specified in the "default" key.  
    If the setting is set to a function it will call the function and  pass the value for the
    category data to the function, returning the result. This can be used for more complicated logic and for
    using something other then just string data in the category, such as an object with multiple data
    attributes it's self.
    The object values for the associated category key or the function should return one of three data types:
    1. A string, this will be used as the image source for the marker icon.
    2. A [google.maps.MarkerImage](http://code.google.com/apis/maps/documentation/javascript/reference.html#MarkerImage), this will be used as the icon for the Marker object.
    3. An object that has [valid options for a StyledIcon object](http://google-maps-utility-library-v3.googlecode.com/svn/trunk/styledmarker/docs/reference.html#StyledIconOptions).
* `default_zoom_level`:
  * *Default*: *N/A*
  * Use this option to set the default zoom level for your map. Normally, zoom level is set dynamically based on the position of locations being mapped. But, in some cases, like viewing a single mapped location, you may wish to set a default zoom level. Zoom level values should be between 1 and 20. Neighborhood level is approximately 15.
* `force_zoom_level`:
  * *Default*: *N/A*
  * This will force the map to **always** be rendered at this zoom level.
* `always_show_markers`:
  * *Default*: `false`
  * Set this option to `true` if you wish to display markers on all zoom levels. (Normally, the markers may only be visible on certain zoom levels, depending on the normal bounds and zoom level of the marker data.)

Object API
-----------

The jMapping API object is available from the "jMapping" data value on
the selector passed to the original $().jMapping function.

For example:

    $('#map').jMapping();
    $('#map').data('jMapping'); // returns the jMapping API object

The API of that object:

* `gmarkers`:
  * The google.maps.Marker objects that have been placed on the map.
    Stored in an object where the keys are the id's are those provided in the metadata
* `settings`:
  * The settings for this jMapping instance.
* `mapped`:
  * Did the plugin create the map and markers as expected or not.
* `map`:
  * the google.maps.Map Google Map API object.
* `markerManager`:
  * The Google Maps MarkerManager object for manipulating groups of markers, has control over all markers on the map.
* `gmarkersArray`:
  * Returns an array of all the markers currently on the map.
* `getBounds`:
  * The Google Maps google.maps.LatLngBounds bounds object for all the markers on the map.
* `getPlaces`:
  * Returns the set of jQuery objects for the place DOM Elements.
* `getPlacesData`:
  * Returns an array of all the metadata for each place returned by `getPlaces`
* `update`:
  * Used to update the map if the HTML DOM for the locations has changed.


Event API
----------

There a number of events that fire as jMapping is used.

* `beforeMapping.jMapping`
  * This fires immediately before the main functionality of the plugin begins and is passed the settings object.
    If it returns false the mapping will be canceled.
* `afterMapping.jMapping`
  * This fires immediately after the plugins mapping has finished, passes in the jMapping API object.
* `beforeUpdate.jMapping`
  * This fires right before the map is updated via the "update" method. The jMapping API object is passed to the callback.
    If the callback returns false the update will be canceled.
* `afterUpdate.jMapping`
  * This fires immediately after the map is updated.
* `markerCreated.jMapping`
  * This fires right after a map marker is created, the marker object is passed to the callback.


Dependencies
-------------

* [jQuery 1.4.4](http://docs.jquery.com/Downloading_jQuery)
* [jQuery Metadata plugin 2.1](http://plugins.jquery.com/project/metadata)
* [MarkerManager v3 1.0](http://google-maps-utility-library-v3.googlecode.com/svn/tags/markermanager/1.0)
* [StyledMarker 0.5](http://google-maps-utility-library-v3.googlecode.com/svn/trunk/styledmarker)


License
--------

Copyright (c) 2009-2011 Brian Landau (Viget Labs)  
MIT License: [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php)
