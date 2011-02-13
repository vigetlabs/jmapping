Screw.Unit(function(){
  
  describe("makeGLatLng", function(){
    before(function(){
      google.maps.LatLng = mock_function(function(lat, lng){}, 'GLatLng');
      google.maps.LatLng.should_be_invoked().exactly('once').with_arguments(70, 50);
    });
    
    it("should be invoked", function(){
      expect($.jMapping.makeGLatLng({lat: 70, lng: 50})).to(be_true);
    });
  });
  
  describe("jMapping", function(){
    before(function(){
      // mock out Marker
      google.maps.InfoWindow = Smoke.MockFunction(function(options){}, 'InfoWindow');
      
      $('#map-side-bar .map-location .info-box').each(function(){
        google.maps.InfoWindow.should_be_invoked().exactly('once').with_arguments({
          content: $(this).html(),
          maxWidth: 425
        });
      });
      
      mockGMaps();
      mockMarkerManager();
    });
    after(function(){
      $('#map').data('jMapping', null);
      $('#map-side-bar .map-location a.map-link').attr('href', '#');
      $('#map-side-bar:first .map-location a.map-link').die('click');
    });
    
    it("should have 2 GMarkers", function(){
      $('#map').jMapping();
      var jmapper = $('#map').data('jMapping');
      expect(jmapper.gmarkers[5]).to(be_true);
      expect(jmapper.gmarkers[8]).to(be_true);
    });
    
    it("should hide the info html elements", function(){
      $('#map').jMapping();
      expect($('#map-side-bar .map-location .info-box')).to(match_selector, ':hidden');
    });
    
    it("should set the links to the correct URL", function(){
      $('#map').jMapping();
      expect($('#map-side-bar .map-location a.map-link#location5').attr('href')).to(equal, '#5');
      expect($('#map-side-bar .map-location a.map-link#location8').attr('href')).to(equal, '#8');
    });
    
    it("should only create the jMapping object once", function(){
      $('#map').jMapping();
      $('#map').jMapping();
      expect($('#map').data('jMapping')).to(be_true);
    });
    
    it('should fire a "beforeMapping.jMapping" event', function(){
      var callback = mock_function(function(){}, 'beforeMapping.jMapping');
      callback.should_be_invoked().exactly('once');
      $(document).bind('beforeMapping.jMapping', callback);
      $('#map').jMapping();
    });
    
    it('should fire a "afterMapping.jMapping" event', function(){
      var callback = mock_function(function(){}, 'afterMapping.jMapping');
      callback.should_be_invoked().exactly('once');
      $(document).bind('afterMapping.jMapping', callback);
      $('#map').jMapping();
    });
    
    it('should fire a "markerCreated.jMapping" event', function(){
      var callback = mock_function(function(){}, 'markerCreated.jMapping');
      callback.should_be_invoked().exactly('twice');
      $(document).bind('markerCreated.jMapping', callback);
      $('#map').jMapping();
    });
    
    describe("object created", function(){
      var jMapper;
      before(function(){
        $('#map').jMapping();
        jMapper = $('#map').data('jMapping');
      });
      
      it("should have a settings object", function(){
        expect(typeof jMapper.settings).to(equal, 'object');
      });
      
      it("should have a mapped boolean", function(){
        expect(typeof jMapper.mapped).to(equal, 'boolean');
        expect(jMapper.mapped).to(be_true);
      });
      
      it("should have a map GMap2 object", function(){
        expect(typeof jMapper.map).to(equal, 'object');
        expect(jMapper.map instanceof google.maps.Map).to(be_true);
      });
      
      it("should have a markerManager MarkerManager object", function(){
        expect(typeof jMapper.markerManager).to(equal, 'object');
        expect(jMapper.markerManager instanceof MarkerManager).to(be_true);
      });
      
      it("should have a gmarkersArray method that returns an array of markers", function(){
        expect($.isFunction(jMapper.gmarkersArray)).to(be_true);
        expect(jMapper.gmarkersArray()[0] instanceof google.maps.Marker).to(be_true);
      });
      
      it("should have a getBounds method", function(){
        expect($.isFunction(jMapper.getBounds)).to(be_true);
      });
      
      it("should have a getPlacesData method", function(){
        expect($.isFunction(jMapper.getPlacesData)).to(be_true);
      });
      
      it("should have a getPlaces method that returns a jQuery object", function(){
        expect($.isFunction(jMapper.getPlaces)).to(be_true);
        expect(jMapper.getPlaces() instanceof jQuery).to(be_true);
      });
      
      it("should have an update method", function(){
        expect($.isFunction(jMapper.update)).to(be_true);
      });
    });
    
    describe("setting link_selector to false", function(){
      before(function(){
        $('#map').jMapping({link_selector: false});
      });
      after(function(){
        delete google.maps.event._expectations;
        google.maps.event = {};
      });
      
      it("should not change the links url", function(){
        expect($('#map-side-bar .map-location a.map-link#location5').attr('href')).to_not(equal, '#5');
        expect($('#map-side-bar .map-location a.map-link#location8').attr('href')).to_not(equal, '#8');
      });
      
      it("should not trigger the GEvent function", function(){
        google.maps.event.should_receive('trigger').exactly(0, 'times')
          .with_arguments($('#map').data('jMapping').gmarkers[5], 'click');
        
        $('#map-side-bar .map-location a.map-link#location5').trigger('click');
      });
    });
    
    describe("click events for links", function(){
      before(function(){
        $('#map').jMapping();
      });
      after(function(){
        delete google.maps.event._expectations;
        google.maps.event = {};
      });
      
      it("should trigger the GEvent function", function(){
        google.maps.event.should_receive('trigger').exactly('once')
           .with_arguments($('#map').data('jMapping').gmarkers[5], 'click');
        
        $('#map-side-bar .map-location a.map-link#location5').trigger('click');
      });
    });
  });
  
  describe('jMapping with update', function(){
    var update_html = '<div class="map-location" data-jmapping="{id: 22, point: {lat: 72, lng: 75}, category: \'bogus\'}">'+
'      <a href="#" id="location22" class="map-link">Some New Place</a>'+
'      <div class="info-box"><p>Test Text.</p></div>'+
'    </div>'+
'    <div class="map-location" data-jmapping="{id: 28, point: {lat: 78, lng: 73}, category: \'sample\'}">'+
'      <a href="#" id="location28" class="map-link">Another Cool New Place</a>'+
'      <div class="info-box"><p>New Text.</p></div>'+
'    </div>';
    var old_html;
    before(function(){
      // mock out Marker
      google.maps.InfoWindow = Smoke.MockFunction(function(options){}, 'InfoWindow');
      $('#map-side-bar .map-location .info-box').each(function(){
        google.maps.InfoWindow.should_be_invoked().exactly('once').with_arguments({
          content: $(this).html(),
          maxWidth: 425
        });
      });
      google.maps.InfoWindow.should_be_invoked().exactly('once').with_arguments({
        content: '<p>Test Text.</p>',
        maxWidth: 425
      });
      google.maps.InfoWindow.should_be_invoked().exactly('once').with_arguments({
        content: '<p>New Text.</p>',
        maxWidth: 425
      });
      
      mockGMapsUpdate();
      mockMarkerManager(true);
      
      old_html = $('#map-side-bar').html();
    });
    after(function(){
      $('#map').data('jMapping', null);
      $('#map-side-bar .map-location a.map-link').attr('href', '#');
      $('#map-side-bar:first .map-location a.map-link').die('click');
      $('#map-side-bar').html(old_html);
    });
    
    it("should have 2 GMarkers", function(){
      $('#map').jMapping();
      $('#map-side-bar').html(update_html);
      var jmapper = $('#map').data('jMapping');
      jmapper.update();
      expect(jmapper.gmarkers[22]).to(be_true);
      expect(jmapper.gmarkers[28]).to(be_true);
    });
    
    it("should hide the info html elements", function(){
      $('#map').jMapping();
      $('#map-side-bar').html(update_html);
      $('#map').data('jMapping').update();
      expect($('#map-side-bar .map-location .info-box')).to(match_selector, ':hidden');
    });
    
    it("should set the links to the correct URL", function(){
      $('#map').jMapping();
      $('#map-side-bar').html(update_html);
      $('#map').data('jMapping').update();
      expect($('#map-side-bar .map-location a.map-link#location22').attr('href')).to(equal, '#22');
      expect($('#map-side-bar .map-location a.map-link#location28').attr('href')).to(equal, '#28');
    });
    
    it('should fire the "beforeUpdate.jMapping" event', function(){
      var callback = mock_function(function(){}, 'beforeUpdate.jMapping');
      callback.should_be_invoked().exactly('once');
      $(document).bind('beforeUpdate.jMapping', callback);
      
      $('#map').jMapping();
      $('#map-side-bar').html(update_html);
      $('#map').data('jMapping').update();
    });
    
    it('should fire the "afterUpdate.jMapping" event', function(){
      var callback = mock_function(function(){}, 'afterUpdate.jMapping');
      callback.should_be_invoked().exactly('once');
      $(document).bind('afterUpdate.jMapping', callback);
      
      $('#map').jMapping();
      $('#map-side-bar').html(update_html);
      $('#map').data('jMapping').update();
    });
    
    describe("click events for links", function(){
      before(function(){
        $('#map').jMapping();
        $('#map-side-bar').html(update_html);
        $('#map').data('jMapping').update();
      });
      after(function(){
        delete google.maps.event._expectations;
        google.maps.event = {};
      });
      
      it("should trigger the GEvent function", function(){
        delete google.maps.event._expectations;
        google.maps.event = mock();
        google.maps.event.should_receive('trigger').exactly('once').with_arguments($('#map').data('jMapping').gmarkers[22], 'click');
        
        $('#map-side-bar .map-location a.map-link#location22').trigger('click');
      });
    });
  });
  
  describe("jMapping with no location items", function(){
    before(function(){
      // mock out GLatLng
      google.maps.LatLng = Smoke.MockFunction(function(lat, lng){}, 'LatLng');
      google.maps.LatLng.should_be_invoked().at_least('once');

      // mock out GMap2
      var gmap_mock = Smoke.Mock();
      gmap_mock.should_receive('fitBounds').exactly('once');
      $.extend(google.maps.Map.prototype, gmap_mock);

      // mock out Bounds
      google.maps.LatLngBounds = Smoke.MockFunction(function(point1, point2){}, 'LatLngBounds');
      google.maps.LatLngBounds.should_be_invoked().exactly('once');
      
      google.maps.event = Smoke.Mock();
      google.maps.event.should_receive('addListener').at_least('once');
      
      mockMarkerManager();
    });
    after(function(){
      $('#map').data('jMapping', null);
    });
    it("should function correctly", function(){
      $('#map').jMapping({
        side_bar_selector: 'ul#empty-map-side-bar'
      });
      expect($('#map').data('jMapping')).to(be_true);
    });
  });

  describe("jMapping with options", function(){
    before(function(){
      // mock out Marker
      google.maps.InfoWindow = Smoke.MockFunction(function(options){}, 'InfoWindow');
      $('ul#map-item-list li.location .info-html').each(function(){
        google.maps.InfoWindow.should_be_invoked().exactly('once').with_arguments({
          content: $(this).html(),
          maxWidth: 380
        });
      });

      mockGMaps();
      mockMarkerManager();

      $('#map').jMapping({
        side_bar_selector: 'ul#map-item-list',
        location_selector: 'li.location',
        link_selector: 'a.map-item',
        info_window_selector: '.info-html',
        info_window_max_width: 380
      });
    });
    after(function(){
      $('#map').data('jMapping', null);
      $('ul#map-item-list li.location a.map-item').attr('href', '#');
      $('ul#map-item-list li.location a.map-item').die('click');
    });
    
    it("should have 2 GMarkers", function(){
      var jmapper = $('#map').data('jMapping');
      
      expect(jmapper.gmarkers[27]).to(be_true);
      expect(jmapper.gmarkers[23]).to(be_true);
    });
    
    it("should hide the info html elements", function(){
      expect($('ul#map-item-list li.location .info-html')).to(match_selector, ':hidden');
    });
    
    it("should set the links to the correct URL", function(){
      expect($('ul#map-item-list li.location a.map-item#location27').attr('href')).to(equal, '#27');
      expect($('ul#map-item-list li.location a.map-item#location23').attr('href')).to(equal, '#23');
    });
    
    describe("click events for links", function(){
      it("should trigger the GEvent function", function(){
        google.maps.event.should_receive('trigger').exactly('once')
           .with_arguments($('#map').data('jMapping').gmarkers[27], 'click');
        
        $('ul#map-item-list li.location a.map-item#location27').trigger('click');
      });
    });
  });
  
  describe("jMapping with an alternate metadata storage", function(){
    before(function(){
      // mock out Marker
      google.maps.InfoWindow = Smoke.MockFunction(function(options){}, 'InfoWindow');
      $('ul#map-list li.location .info-box').each(function(){
        google.maps.InfoWindow.should_be_invoked().exactly('once').with_arguments({
          content: $(this).html(),
          maxWidth: 425
        });
      });
      
      mockGMaps();
      mockMarkerManager();
    });
    after(function(){
      $('#map').data('jMapping', null);
      $('#map-side-bar .map-location a.map-link').attr('href', '#');
      $('#map-side-bar .map-location a.map-link').die('click');
    });
    
    it("should function correctly", function(){
      $('#map').jMapping({
        side_bar_selector: 'ul#map-list', 
        location_selector: 'li.location', 
        metadata_options: {type: 'html5'}
      });
      expect($('#map').data('jMapping')).to(be_true);
    });
  });
  
  describe("jMapping with no categories and 'category_icon_options'", function(){
    before(function(){
      // mock out Marker
      google.maps.InfoWindow = Smoke.MockFunction(function(options){}, 'InfoWindow');
      $('ul#map-list li.location .info-box').each(function(){
        google.maps.InfoWindow.should_be_invoked().exactly('once').with_arguments({
          content: $(this).html(),
          maxWidth: 425
        });
      });
      
      mockGMaps(true);
      mockMarkerManager();
    });
    after(function(){
      $('#map').data('jMapping', null);
      $('#map-side-bar .map-location a.map-link').attr('href', '#');
      $('#map-side-bar:first .map-location a.map-link').die('click');
    });
    
    it("should function correctly", function(){
      $('#map').jMapping({
        side_bar_selector: 'ul#map-list', 
        location_selector: 'li.location',
        category_icon_options: {'fun': {color: '#33FFFF'}, 'default': {color: '#CC0000'}},
        metadata_options: {type: 'html5'}
      });
      expect($('#map').data('jMapping')).to(be_true);
    });
  });
  
  describe("setting a function to category_icon_options", function(){
    var category_function;
    before(function(){
      // mock out Marker
      google.maps.InfoWindow = Smoke.MockFunction(function(options){}, 'InfoWindow');
      $('#map-side-bar .map-location .info-box').each(function(){
        google.maps.InfoWindow.should_be_invoked().exactly('once').with_arguments({
          content: $(this).html(),
          maxWidth: 425
        });
      });
      
      mockGMaps(true);
      mockMarkerManager();
      
      category_function = mock_function(function(category){
        if (category.charAt(0).match(/[a-m]/i)){
          return {color: '#CC0000'};
        } else if (category.charAt(0).match(/[n-z]/i)){
          return {color: '#33FFFF'};
        } else {
          return {color: '#00FFCC'};
        }
      }, 'category_icon_options_function');
      category_function.should_be_invoked().exactly('twice');
    });
    after(function(){
      $('#map').data('jMapping', null);
      $('#map-side-bar .map-location a.map-link').attr('href', '#');
      $('#map-side-bar:first .map-location a.map-link').die('click');
    });
    
    it("should function correctly", function(){
      $('#map').jMapping({
        category_icon_options: category_function
      });
      expect($('#map').data('jMapping')).to(be_true);
    });
  });
  
  describe("setting a function to category_icon_options that returns a string", function(){
    var category_function;
    before(function(){
      google.maps.InfoWindow = Smoke.MockFunction(function(options){}, 'InfoWindow');
      $('#map-side-bar .map-location .info-box').each(function(){
        google.maps.InfoWindow.should_be_invoked().exactly('once').with_arguments({
          content: $(this).html(),
          maxWidth: 425
        });
      });
      
      mockGMaps();
      mockMarkerManager();
      
      category_function = mock_function(function(category){
        return '/images/map_icons/icon1.jpg';
      }, 'category_icon_options_function');
      category_function.should_be_invoked().exactly('twice');
    });
    after(function(){
      $('#map').data('jMapping', null);
      $('#map-side-bar .map-location a.map-link').attr('href', '#');
      $('#map-side-bar:first .map-location a.map-link').die('click');
    });
    
    it("should function correctly", function(){
      $('#map').jMapping({
        category_icon_options: category_function
      });
      expect($('#map').data('jMapping')).to(be_true);
    });
  });
  
  describe("setting a function to category_icon_options that returns a MarkerImage", function(){
    var category_function;
    before(function(){
      google.maps.InfoWindow = Smoke.MockFunction(function(options){}, 'InfoWindow');
      $('#map-side-bar .map-location .info-box').each(function(){
        google.maps.InfoWindow.should_be_invoked().exactly('once').with_arguments({
          content: $(this).html(),
          maxWidth: 425
        });
      });
      
      mockGMaps();
      mockMarkerManager();
      
      category_function = mock_function(function(category){
        return new google.maps.MarkerImage('/images/map_icons/icon1.jpg');
      }, 'category_icon_options_function');
      category_function.should_be_invoked().exactly('twice');
    });
    after(function(){
      $('#map').data('jMapping', null);
      $('#map-side-bar .map-location a.map-link').attr('href', '#');
      $('#map-side-bar:first .map-location a.map-link').die('click');
    });
    
    it("should function correctly", function(){
      $('#map').jMapping({
        category_icon_options: category_function
      });
      expect($('#map').data('jMapping')).to(be_true);
    });
  });
  
});
