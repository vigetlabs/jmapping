(function($) {
  $(Screw)
    .bind('loaded', function() {    
      $('.describe, .it')
        .click(function() {
          document.location = location.href.split('?')[0] + '?' + $(this).fn('selector');
          return false;
        })
        .focus(function() {
          return $(this).addClass('focused');
        })
        .bind('scroll', function() {
          document.body.scrollTop = $(this).offset().top;
        });

      $('.it')
        .bind('enqueued', function() {
          $(this).addClass('enqueued');
        })
        .bind('running', function() {
          $(this).addClass('running');
        })
        .bind('passed', function() {
          $(this).addClass('passed');
        })
        .bind('failed', function(e, reason) {
          $(this)
            .addClass('failed')
            .append($('<p class="error"></p>').text(reason.message || reason.toString()));

          var file = reason.fileName || reason.sourceURL;
          var line = reason.lineNumber || reason.line;          
          if (file || line) {
            $(this).append($('<p class="error"></p>').text('line ' + line + ', ' + file));
          }
        });
    })
    .bind('before', function() {
      Screw.suite_start_time = new Date();
      $('.status').text('Running...');
    })
    .bind('after', function() {
      $('body .status').fn('display');
    });
})(jQuery);
