Screw.Unit(function(){
  
  describe("makeGLatLng", function(){
    before(function(){
      GLatLng = mock_function(function(lat, lng){}, 'GLatLng');
      GLatLng.should_be_invoked().exactly('once').with_arguments(70, 50);
    });
    
    it("should be invoked", function(){
      expect($.jMapping.makeGLatLng({lat: 70, lng: 50})).to(be_true);
    });
  });
  
  describe("jMapping", function(){
    before(function(){
      // mock out GLatLng
      GLatLng = mock_function(function(lat, lng){}, 'GLatLng');
      GLatLng.should_be_invoked().at_least('once');
      
      // mock out GMap2
      var gmap_mock = mock();
      gmap_mock.should_receive('setMapType').exactly('once').with_arguments(G_NORMAL_MAP);
      gmap_mock.should_receive('addControl').exactly('once').with_arguments(new GSmallMapControl());
      gmap_mock.should_receive('centerAndZoomOnBounds').exactly('once');
      gmap_mock.should_receive('addOverlay').exactly('twice');
      GMap2 = function(){};
      $.extend(GMap2.prototype, gmap_mock);
      
      // mock out Bounds
      var bounds_mock = mock();
      bounds_mock.should_receive('extend').exactly('once');
      GLatLngBounds = mock_function(function(point1, point2){}, 'GLatLngBounds');
      GLatLngBounds.should_be_invoked().exactly('once');
      $.extend(GLatLngBounds.prototype, bounds_mock);
      
      // mock out Marker
      var marker_mock = mock();
      $('#map-side-bar .map-location .info-box').each(function(){
        marker_mock.should_receive('bindInfoWindow').exactly('once').with_arguments(this, {maxWidth: 425});
      });
      GMarker = mock_function(function(point, options){}, 'GMarker');
      GMarker.should_be_invoked().exactly('twice');
      $.extend(GMarker.prototype, marker_mock);
      
      // mock out Icon
      MapIconMaker = mock();
      MapIconMaker.should_receive('createMarkerIcon').exactly(0, 'times');
    });
    after(function(){
      $('#map').data('jMapping', null);
      $('#map-side-bar .map-location a.map-link').attr('href', '#');
    });
    
    it("should have 2 GMarkers", function(){
      $('#map').jMapping();
      var jmapper = $('#map').data('jMapping');
      expect(jmapper.gmarkers[5]).to(be_true);
      expect(jmapper.gmarkers[8]).to(be_true);
    });
    
    it("should hide the info html elements", function(){
      $('#map').jMapping();
      expect($('#map-side-bar .map-location .info-box').is(':hidden')).to(be_true);
    });
    
    it("should set the links to the correct URL", function(){
      $('#map').jMapping();
      expect($('#map-side-bar .map-location a.map-link#location5').attr('href')).to(equal, '#5');
      expect($('#map-side-bar .map-location a.map-link#location8').attr('href')).to(equal, '#8');
    });
    
    describe("click events for links", function(){
      var jmapper;
      before(function(){
        $('#map').jMapping();
        jmapper = $('#map').data('jMapping');
      });
      
      it("should trigger the GEvent function", function(){
        GEvent = mock();
        GEvent.should_receive('trigger').at_least('once');
        
        $('#map-side-bar .map-location a.map-link#location5').trigger('click');
      });
    });
  });
  
  describe("jMapping with options", function(){
    before(function(){
      // mock out GLatLng
      GLatLng = mock_function(function(lat, lng){}, 'GLatLng');
      GLatLng.should_be_invoked().at_least('once');
      
      // mock out GMap2
      var gmap_mock = mock();
      gmap_mock.should_receive('setMapType').exactly('once').with_arguments(G_NORMAL_MAP);
      gmap_mock.should_receive('addControl').exactly('once').with_arguments(new GSmallMapControl());
      gmap_mock.should_receive('centerAndZoomOnBounds').exactly('once');
      gmap_mock.should_receive('addOverlay').exactly('twice');
      GMap2 = function(){};
      $.extend(GMap2.prototype, gmap_mock);
      
      // mock out Bounds
      var bounds_mock = mock();
      bounds_mock.should_receive('extend').exactly('once');
      GLatLngBounds = mock_function(function(point1, point2){}, 'GLatLngBounds');
      GLatLngBounds.should_be_invoked().exactly('once');
      $.extend(GLatLngBounds.prototype, bounds_mock);
      
      // mock out Marker
      var marker_mock = mock();
      $('ul#map-item-list li.location .info-html').each(function(){
        marker_mock.should_receive('bindInfoWindow').exactly('once').with_arguments(this, {maxWidth: 380});
      });
      GMarker = mock_function(function(point, options){}, 'GMarker');
      GMarker.should_be_invoked().exactly('twice');
      $.extend(GMarker.prototype, marker_mock);
      
      // mock out Icon
      MapIconMaker = mock();
      MapIconMaker.should_receive('createMarkerIcon').exactly('once').with_arguments({primaryColor: '#CC0000'});
      MapIconMaker.should_receive('createMarkerIcon').exactly('once').with_arguments({primaryColor: '#33FFFF'});
    });
    after(function(){
      $('#map').data('jMapping', null);
      $('ul#map-item-list li.location a.map-item').attr('href', '#');
    });
    
    it("should have 2 GMarkers", function(){
      $('#map').jMapping({
        side_bar_selector: 'ul#map-item-list', 
        location_selector: 'li.location', 
        link_selector: 'a.map-item',
        info_window_selector: '.info-html',
        info_window_max_width: 380,
        category_icon_options: {'fun': {primaryColor: '#33FFFF'}, 'default': {primaryColor: '#CC0000'}}
      });
      var jmapper = $('#map').data('jMapping');
      
      expect(jmapper.gmarkers[27]).to(be_true);
      expect(jmapper.gmarkers[23]).to(be_true);
    });
    
    it("should hide the info html elements", function(){
      $('#map').jMapping();
      expect($('ul#map-item-list li.location .info-html').is(':hidden')).to(be_true);
    });
    
    it("should set the links to the correct URL", function(){
      $('#map').jMapping();
      expect($('ul#map-item-list li.location a.map-item#location27').attr('href')).to(equal, '#27');
      expect($('ul#map-item-list li.location a.map-item#location23').attr('href')).to(equal, '#23');
    });
    
    describe("click events for links", function(){
      var jmapper;
      before(function(){
        $('#map').jMapping();
        jmapper = $('#map').data('jMapping');
      });
      
      it("should trigger the GEvent function", function(){
        GEvent = mock();
        GEvent.should_receive('trigger').at_least('once');
        
        $('ul#map-item-list li.location a.map-item#location27').trigger('click');
      });
    });
  });
  
  // TODO: Test that jMapping won't be loaded twice.
  // TODO: Tests for alternate place of storing metadata
  // TODO: Tests for function based "category_icon_options"
  // TODO: Tests object based "category_icon_options" and no category on location
  // TODO: Test that setting `false` for "link_selector" has desired effect
  
});
