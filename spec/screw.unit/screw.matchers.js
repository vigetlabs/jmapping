Screw.Matchers = (function($) {
  return matchers = {
    expect: function(actual) {
      var funcname = function(f) {
          var s = f.toString().match(/function (\w*)/)[1];
          if ((s == null) || (s.length == 0)) return "anonymous";
          return s;
      };

      var stacktrace = function() {
          var s = "";
          for(var a = arguments.caller; a != null; a = a.caller) {
              s += funcname(a.callee) + "\n";
              if (a.caller == a) break;
          }
          return s;
      };

      return {
        to: function(matcher, expected, not) {
          var matched = matcher.match(expected, actual);
          if (not ? matched : !matched) {
            throw(matcher.failure_message(expected, actual, not));
          }
        },

        to_not: function(matcher, expected) {
          this.to(matcher, expected, true);
        }
      };
    },

    equal: {
      match: function(expected, actual) {
        if(expected == actual) return true;
        if(actual == undefined) return false;

        if (expected instanceof Array) {
          for (var i = 0; i < actual.length; i++)
            if (!Screw.Matchers.equal.match(expected[i], actual[i])) return false;
          return actual.length == expected.length;
        } else if (expected instanceof Object) {
          for (var key in expected)
            if (!this.match(expected[key], actual[key])) return false;
          for (var key in actual)
            if (!this.match(actual[key], expected[key])) return false;
          return true;
        }
        return false;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not equal ' : ' to equal ') + $.print(expected);
      }
    },

    be_gt: {
      match: function(expected, actual) {
        return actual > expected;
      },
      
      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not ' : ' to ') + 'be greater than ' + $.print(expected);
      }
    },

    be_gte: {
      match: function(expected, actual) {
        return actual >= expected;
      },
      
      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not ' : ' to ') + 'be greater than or equal to ' + $.print(expected);
      }
    },

    be_lt: {
      match: function(expected, actual) {
        return actual < expected;
      },
      
      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not ' : ' to ') + 'be less than ' + $.print(expected);
      }
    },

    be_lte: {
      match: function(expected, actual) {
        return actual <= expected;
      },
      
      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not ' : ' to ') + 'be less than or equal to ' + $.print(expected);
      }
    },

    match: {
      match: function(expected, actual) {
        if (expected.constructor == RegExp)
          return expected.exec(actual.toString());
        else
          return actual.indexOf(expected) > -1;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not match ' : ' to match ') + $.print(expected);
      }
    },

    include: {
      match: function(expected, actual) {
        return $.inArray(expected, actual) >= 0;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not include ' : ' to include ') + $.print(expected);
      }
    },

    be_empty: {
      match: function(expected, actual) {
        if (actual.length == undefined) throw(actual.toString() + " does not respond to length");

        return actual.length == 0;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not be empty' : ' to be empty');
      }
    },

    be_blank: {
      match: function(expected, actual) {
        if (actual == undefined) return true;
        if (typeof(actual) == "string") actual = actual.replace(/^\s*(.*?)\s*$/, "$1");
        return Screw.Matchers.be_empty.match(expected, actual);
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not be blank' : ' to be blank');
      }
    },

    have_length: {
      match: function(expected, actual) {
        if (actual.length == undefined) throw(actual.toString() + " does not respond to length");

        return actual.length == expected;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not' : ' to') + ' have length ' + expected;
      }
    },

    be_null: {
      match: function(expected, actual) {
        return actual == null;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not be null' : ' to be null');
      }
    },

    be_undefined: {
      match: function(expected, actual) {
        return actual == undefined;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not be undefined' : ' to be undefined');
      }
    },

    be_true: {
      match: function(expected, actual) {
        return actual;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not be true' : ' to be true');
      }
    },

    be_false: {
      match: function(expected, actual) {
        return !actual;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not be false' : ' to be false');
      }
    },

    match_html: {
      munge: function(mungee) {
        if (mungee instanceof jQuery) {
          mungee = mungee.html();
        } else if (typeof(mungee) == "string") {
          var span = document.createElement("span");
          span.innerHTML = mungee;
          mungee = span.innerHTML;
        }

        var regEx = /\sjQuery\d+=['"]\d+['"]/g;
        mungee = mungee.replace(regEx, "");

        return mungee;
      },

      match: function(expected, actual) {
        var trimmedExpected = this.munge(expected);
        var trimmedActual = this.munge(actual);
        return trimmedActual.indexOf(trimmedExpected) > -1;
      },

      failure_message: function(expected, actual, not) {
        var trimmedExpected = this.munge(expected);
        var trimmedActual = this.munge(actual);
        return 'expected ' + $.print(trimmedActual, { max_string: 300 }) +
               (not ? ' to not contain ' : ' to contain ') + $.print(trimmedExpected, { max_string: 300 });
      }
    },

    match_selector: {
      match: function(expected, actual) {
        if (!(actual instanceof jQuery)) {
          throw expected.toString() + " must be an instance of jQuery to match against a selector";
        }

        return actual.is(expected);
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not match selector ' : ' to match selector ') + expected;
      }
    },

    contain_selector: {
      match: function(expected, actual) {
        if (!(actual instanceof jQuery)) {
          throw expected.toString() + " must be an instance of jQuery to match against a selector";
        }

        return actual.find(expected).length > 0;
      },

      failure_message: function(expected, actual, not) {
        return 'expected ' + $.print(actual) + (not ? ' to not contain selector ' : ' to contain selector ') + expected;
      }
    }
  };
})(jQuery);
