var Screw = (function($) {
  var screw = {
    Unit: function(fn) {
      var wrappedFn;
      if(fn.length == 0) {
        var contents = fn.toString().match(/^[^\{]*{((.*\n*)*)}/m)[1];
        wrappedFn = new Function("matchers", "specifications",
        "with (specifications) { with (matchers) { " + contents + " } }"
        );
      } else {
        wrappedFn = function(matchers, specifications) {
          var screwContext = {};
          for(var method in matchers) {
            screwContext[method] = matchers[method];
          }
          for(var method in specifications) {
            screwContext[method] = specifications[method];
          }
          fn(screwContext);
        };
      }

      $(Screw).queue(function() {
        Screw.Specifications.context.push($('body > .describe'));
        wrappedFn.call(this, Screw.Matchers, Screw.Specifications);
        Screw.Specifications.context.pop();
        $(this).dequeue();
      });
    },

    Wait: function (fn, ms) {
      this.func = fn;
      this.delay = ms;
      
      this.toString = function () {
        return "Screw.Wait for " + this.delay + "ms and then execute " + this.func;
      };
    },

    Specifications: {
      context: [],

      describe: function(name, fn) {
        var describe = $('<li class="describe"></li>')
          .append($('<h1></h1>').text(name))
          .append('<ol class="befores"></ol>')
          .append('<ul class="its"></ul>')
          .append('<ul class="describes"></ul>')
          .append('<ol class="afters"></ol>');

        this.context.push(describe);
        fn.call();
        this.context.pop();

        this.context[this.context.length-1]
          .children('.describes')
            .append(describe);
      },

      it: function(name, fn) {
        var it = $('<li class="it"></li>')
          .append($('<h2></h2>').text(name))
          .data('screwunit.run', fn);

        this.context[this.context.length-1]
          .children('.its')
            .append(it);
      },

      before: function(fn) {
        var before = $('<li class="before"></li>')
          .data('screwunit.run', fn);

        this.context[this.context.length-1]
          .children('.befores')
            .append(before);
      },

      after: function(fn) {
        var after = $('<li class="after"></li>')
          .data('screwunit.run', fn);

        this.context[this.context.length-1]
          .children('.afters')
            .append(after);
      },

      wait: function(fn, ms) {
        throw new Screw.Wait(fn, ms);
      }
    }
  };

  $(screw).queue(function() { $(screw).trigger('loading'); });
  $(window).load(function(){
    $('<div class="describe"></div>')
      .append('<h3 class="status"></h3>')
      .append('<ol class="befores"></ol>')
      .append('<ul class="describes"></ul>')
      .append('<ol class="afters"></ol>')
      .appendTo('body');
  
    $(screw).dequeue();
    $(screw).trigger('loaded');
  });
  
  return screw;
})(jQuery);