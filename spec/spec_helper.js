var google = {
  maps: {
    Map: function(){},
    event: {},
    NavigationControlStyle: {
      SMALL: 'SMALL', DEFAULT: 'DEFAULT'
    },
    MapTypeId: {
      ROADMAP: 'ROADMAP', HYBRID: 'HYBRID'
    },
    LatLngBounds: function(){},
    LatLng: function(){},
    Marker: function(){},
    InfoWindow: function(){},
    MarkerImage: function(){}
  }
},
StyledIconTypes = {
  MARKER: 'MARKER'
},
StyledIcon = function(){},
StyledMarker = function(){};

Screw.Specifications.mockGMaps = function(custom_markers){
  // mock out GLatLng
  google.maps.LatLng = Smoke.MockFunction(function(lat, lng){}, 'LatLng');
  google.maps.LatLng.should_be_invoked().at_least('once');
  
  // mock out GMap2
  var gmap_mock = Smoke.Mock();
  gmap_mock.should_receive('fitBounds').exactly('once');
  $.extend(google.maps.Map.prototype, gmap_mock);
  
  // mock out Bounds
  var bounds_mock = Smoke.Mock();
  bounds_mock.should_receive('extend').exactly('once');
  google.maps.LatLngBounds = Smoke.MockFunction(function(point1, point2){}, 'LatLngBounds');
  google.maps.LatLngBounds.should_be_invoked().exactly('once');
  $.extend(google.maps.LatLngBounds.prototype, bounds_mock);
  
  // mock out Marker
  if (custom_markers){
    StyledIcon = Smoke.MockFunction(function(options){}, 'StyledIcon');
    StyledIcon.should_be_invoked().exactly('twice');
    StyledMarker = Smoke.MockFunction(function(options){}, 'StyledMarker');
    StyledMarker.should_be_invoked().exactly('twice');
  } else {
    google.maps.Marker = Smoke.MockFunction(function(options){}, 'Marker');
    google.maps.Marker.should_be_invoked().exactly('twice');
  }
  
  google.maps.event = Smoke.Mock();
  google.maps.event.should_receive('addListener').at_least('once');
};
Screw.Specifications.mockGMapsUpdate = function(){
  // mock out GLatLng
  google.maps.LatLng = Smoke.MockFunction(function(lat, lng){}, 'LatLng');
  google.maps.LatLng.should_be_invoked().at_least('once');
  
  // mock out GMap2
  var gmap_mock = Smoke.Mock();
  gmap_mock.should_receive('fitBounds').exactly('twice');
  gmap_mock.should_receive('getZoom').exactly('once').and_return(10);
  $.extend(google.maps.Map.prototype, gmap_mock);
  
  // mock out Bounds
  var bounds_mock = Smoke.Mock();
  bounds_mock.should_receive('extend').exactly('twice');
  google.maps.LatLngBounds = Smoke.MockFunction(function(point1, point2){}, 'LatLngBounds');
  google.maps.LatLngBounds.should_be_invoked().exactly('twice');
  $.extend(google.maps.LatLngBounds.prototype, bounds_mock);
  
  // mock out Marker
  google.maps.Marker = Smoke.MockFunction(function(options){}, 'Marker');
  google.maps.Marker.should_be_invoked().exactly(4, 'times');
  
  google.maps.event = Smoke.Mock();
  google.maps.event.should_receive('trigger').exactly('once').with_arguments(google.maps.Map.prototype, 'resize');
  google.maps.event.should_receive('addListener').at_least('once');
};

Screw.Specifications.mockMarkerManager = function(update){
  var markermanager_mock = Smoke.Mock();
  if (update){
    markermanager_mock.should_receive('clearMarkers').exactly('once');
    markermanager_mock.should_receive('addMarkers').exactly('once');
    markermanager_mock.should_receive('refresh').exactly('once');
  }
  
  MarkerManager =  Smoke.MockFunction(function(map, options){}, 'MarkerManager');
  MarkerManager.should_be_invoked().exactly('once');
  $.extend(MarkerManager.prototype, markermanager_mock);
};
