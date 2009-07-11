var GMap2, GLatLng, GLatLngBounds, GMarker, MapIconMaker;
var G_NORMAL_MAP = 'G_NORMAL_MAP', G_HYBRID_MAP = 'G_HYBRID_MAP';
var GEvent = {};
var GSmallMapControl = function(){this.object_name = 'GSmallMapControl';};
var GSmallZoomControl = function(){this.object_name = 'GSmallZoomControl';};
var GMapTypeControl = function(){this.object_name = 'GMapTypeControl';};
function GBrowserIsCompatible(){return true;}

Screw.Specifications.mockGMaps = function(marker_mock, gmap_mock_setup){
  // mock out GLatLng
  GLatLng = Smoke.MockFunction(function(lat, lng){}, 'GLatLng');
  GLatLng.should_be_invoked().at_least('once');
  
  // mock out GMap2
  var gmap_mock = Smoke.Mock();
  gmap_mock.should_receive('centerAndZoomOnBounds').exactly('once');
  gmap_mock.should_receive('addOverlay').exactly('twice');
  if (gmap_mock_setup){
    gmap_mock_setup(gmap_mock);
  } else {
    gmap_mock.should_receive('setMapType').exactly('once').with_arguments(G_NORMAL_MAP);
    gmap_mock.should_receive('addControl').exactly('once').with_arguments(new GSmallMapControl());
  }
  GMap2 = function(){};
  $.extend(GMap2.prototype, gmap_mock);
  
  // mock out Bounds
  var bounds_mock = Smoke.Mock();
  bounds_mock.should_receive('extend').exactly('once');
  GLatLngBounds = Smoke.MockFunction(function(point1, point2){}, 'GLatLngBounds');
  GLatLngBounds.should_be_invoked().exactly('once');
  $.extend(GLatLngBounds.prototype, bounds_mock);
  
  // mock out Marker
  GMarker = Smoke.MockFunction(function(point, options){}, 'GMarker');
  GMarker.should_be_invoked().exactly('twice');
  $.extend(GMarker.prototype, marker_mock);
};
