// This is a lightweight bridge between Smoke and Screw.Unit.
// It shadows mocking and stubbing onto the matchers to make them available within tests.

Screw.Matchers.mock = function(m) {
  return Smoke.Mock(m);
};

Screw.Matchers.mock_function = function(func,name) {
  return Smoke.MockFunction(func,name);
};

Screw.Matchers.stub = function(obj, attr) {
  return new Smoke.Stub(obj,attr);
};

(function($) {
  $(Screw).bind("before", function(){
    function checkAndResetSmoke() {
      Smoke.checkExpectations();
      Smoke.reset();
    }

    $('.it').bind('finished.screwunit', function(){ checkAndResetSmoke(); });
  });
})(jQuery);
