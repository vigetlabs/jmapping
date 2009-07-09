(function($) {
  $(Screw).bind('loaded', function() {
    $('.status').fn({
      display: function() {
        $(this).html(
          $('.passed').length + $('.failed').length + ' test(s), ' + $('.failed').length + ' failure(s)<br />' +
          ((new Date() - Screw.suite_start_time)/1000.0).toString() + " seconds elapsed"
        );
      }
    });

    $('.describe').fn({
      parent: function() {
        return $(this).parent('.describes').parent('.describe');
      },
      
      run_befores: function() {
        $(this).fn('parent').fn('run_befores');
        $(this).children('.befores').children('.before').fn('run');
      },
      
      run_afters: function() {
        $(this).fn('parent').fn('run_afters');
        $(this).children('.afters').children('.after').fn('run');
      },
      
      enqueue: function() {
        $(this).children('.its').children('.it').fn('enqueue');
        $(this).children('.describes').children('.describe').fn('enqueue');
      },
      
      selector: function() {
        return $(this).fn('parent').fn('selector')
          + ' > .describes > .describe:eq(' + $(this).parent('.describes').children('.describe').index(this) + ')';
      }
    });
  
    $('body > .describe').fn({
      selector: function() { return 'body > .describe'; }
    });
    
    $('.it').fn({
      parent: function() {
        return $(this).parent('.its').parent('.describe');
      },

      run: function() {
        var self = this;
        $(this).data('screwunit.run_segment', function () {
          $(self).fn('parent').fn('run_befores');
          $(self).data('screwunit.run')();
        });
        $(this).fn('run_segment');
      },

      run_segment: function() {
        var failure = null;
        try {
          $(this).data('screwunit.run_segment')();
          $(this).trigger('finished.screwunit');
        } catch(e) {
          if (e instanceof Screw.Wait) {
            var self = this;
            $(this).data('timeout', setTimeout(function () {
              $(self).data('screwunit.run_segment', e.func);
              $(self).fn("run_segment");
            }, e.delay));
            return;
          } else {
            failure = [e];
          }
        }

        try {
          if (failure) {
            $(this).trigger('failed', failure);
          } else {
            $(this).trigger('passed');
          }
        } finally {
          $(this).fn('parent').fn('run_afters');
          $(this).removeData('timeout');
        }
      },

      enqueue: function() {
        var self = $(this).trigger('enqueued');
        $(Screw)
          .queue(function() {
            self.fn('run');
            if (self.data('timeout')) {
              // If the test contains pending async elements, wait for
              // them to complete.
              var watcher = setInterval(function () {
                if (!self.data('timeout')) {
                  clearInterval(watcher);
                  $(Screw).dequeue();
                }
              }, 100);
            } else {
              // Otherwise, immediately start the next test.
              setTimeout(function() { $(Screw).dequeue(); }, 0);
            }
          });
      },
      
      selector: function() {
        return $(this).fn('parent').fn('selector')
          + ' > .its > .it:eq(' + $(this).parent('.its').children('.it').index(this) + ')';
      }
    });
    
    $('body .before').fn({
      run: function() { $(this).data('screwunit.run')(); }
    }); 
  
    $('body .after').fn({
      run: function() {
        $(this).data('screwunit.run')(); }
    });

    $(Screw).trigger('before');
    var to_run = unescape(location.search.slice(1)) || 'body > .describe > .describes > .describe';
    $(to_run)
      .focus()
      .eq(0).trigger('scroll').end()
      .fn('enqueue');
    $(Screw).queue(function() { $(Screw).trigger('after'); });
  });
})(jQuery);
