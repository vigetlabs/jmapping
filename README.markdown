jMapping - Google Maps jQuery Plugin
=====================================

This plugin is designed for quick development of a page that implements 
a Google Map with a list of the locations that are specified within the HTML.


Graceful degradation and Semantic Expectations
-----------------------------------------------

This plugin tries to allow as much graceful degradation as possible by having the HTML be as semantic as possible.
The plugin expect the HTML for the locations to be grouped under a common element.
Additionally, it expects the links and Map Info Window content to be grouped under the location elements.
It also expects the necessary metadata to be on the location element.
This way the HTML semantically reflects that all of those parts and information are associated with the specific location or place.


Usage
------

[Start by getting a Google Maps API key](http://code.google.com/apis/maps/signup.html).
Download the necessary dependencies and jMapping.

Make sure you include the necessary scripts in your page:

    <script type="text/javascript" src="http://maps.google.com/maps?file=api&v=2&key=someapikey"></script>
    <script type="text/javascript" src="mapiconmaker.js"></script>
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>
    <script type="text/javascript" src="jquery.metadata.js"></script>
    <script type="text/javascript" src="jquery.jmapping.js"></script>

Make sure your HTML has a `div` element for the Google map, and there is a container element with some locations and their data. The data by default is expected to be on the "data" attribute of the location (this can be configured):

    <div id="map"></div>
    
    <div id="map-side-bar">
      <div class="map-location" data="{id: 5, point: {lat: 35.925, lng: -79.053}, category: 'Gas'}">
        <a href="#" class="map-link">Some Place</a>
        <div class="info-box">
          <p>Some thing for the info box.</p>
        </div>
      </div>
      <div class="map-location" data="{id: 8, point: {lat: 35.935, lng: -79.024}, category: 'Food'}">
        <a href="#" class="map-link">Another Place</a>
        <div class="info-box">
          <p>Example Text.</p>
        </div>
      </div>
    </div>

Then just call the `jMapping` function on the map element:

    $('#map').jMapping();
    


Options
--------

These are options that can be passed to the `jMapping` function to change specific settings.


* **`side_bar_selector`**:
  * *Default*: `"#map-side-bar:first"`
  * This defines the selector where location items will be searched for within.
* **`location_selector`**:
  * *Default*: `".map-location"`
  * This defines the selector for location items. This is the element that the metadata
    needs to be associated with. The plugin will for item matching this selector *inside* of
    the side bar element.
* **`link_selector`**:
  * *Default*: `a.map-link`
  * This selector defines the link that will be used to "activate" a marker on the map. 
    If info window elements are provided the HTML inside of them will be loaded into 
    the pop up window when these links are clicked. You should set this value to `false`
    if you do not wish to use this functionality.
    These links will be searched for inside of the location elements specified in the `location_selector`.
* **`info_window_selector`**:
  * *Default*: `".info-box"`
  * This selector defines where the content for the Google Maps Info window for each location marker is.
    This element will be searched for inside of the location elements specified in the `location_selector`.
    If no element is found no Info Window will be attached to the marker.
* **`metadata_options`**:
  * *Default*: `{type: "attr", name: "data"}`
  * This is the set of options passed to the jQuery metadata function. It defines how the necessary
    metadata for each location will be searched for.
    See the [metadata plugins docs](http://docs.jquery.com/Plugins/Metadata/metadata#toptions) for more info.
* **`info_window_max_width`**:
  * *Default*: `425`
  * This specifies what the max width of the Google Maps Info Windows can be when a marker is activated.
    Otherwise it will expand to fit the width of the content.
* **`category_icon_options`**:
  * *Default*: *N/A*
  * By default the plugin will use the default Google Maps marker icon. But if you can use this option
    to specify what options to pass to the MapIconMaker based on category data associated with the location.
    It accepts 2 types of values: an object or a function.
    If the setting is to an object it will take the category data on the location and look for a key on the object
    that matches and return that value. If there is no value for the supplied category, it will return
    the value specified in the "default" key.
    If the setting is set to a function it will call the function and  pass the value for the
    category data to the function, returning the result. This can be used for more complicated logic and for
    using something other then just string data in the category, such as an object with multiple data
    attributes it's self.


Dependencies
-------------

* [jQuery 1.3.2](http://docs.jquery.com/Downloading_jQuery)
* [jQuery Metadata plugin 2.1](http://plugins.jquery.com/project/metadata)
* [MapIconMaker 1.1](http://gmaps-utility-library.googlecode.com/svn/trunk/mapiconmaker/1.1/)


License
--------

Copyright (c) 2009 Brian Landau (Viget Labs)  
MIT License: [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php)
