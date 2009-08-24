/* ===========================================================================
 *
 * JQuery Quick Pagination
 * Version 2.0
 * Quick and dirty pagination for pretty much any set of elements on the page.
 *
 * Authors: Mark Perkins & Brian Landau
 *
 * ---------------------------------------------------------------------------
 *
 * LICENCE:
 *
 * Released under a MIT Licence. See licence.txt that should have been supplied with this file,
 * or visit http://projects.allmarkedup.com/jquery_quick_paginate/licence.txt
 *
 */
(function($) {
  $.fn.quickpaginate = function( settings ){
  	settings = jQuery.extend({
  		perpage: 10,
  		pager : null,
  		showcounter : true,
  		prev_class : "qp_next",
  		next_class : "qp_prev",
  		prev_text : 'Prev',
  		next_text : 'Next',
  		pagenumber : "qp_pagenumber",
  		totalnumber : "qp_totalnumber",
  		counter : "qp_counter"
  	}, settings);

  	var cm;
  	var total;
  	var last = false;
  	var first = true;
  	var items = jQuery(this);
  	var nextbut;
  	var prevbut;
	
  	var init = function(){
  		items.show();
  		total = items.size();
  		if ( items.size() > settings.perpage ) {
  			items.filter(":gt("+(settings.perpage-1)+")").hide();
  			cm = settings.perpage;
  			setNav();
  		}
  		$(document).trigger('init_finished.quickpaginate');
  	};
	
  	var goNext = function(){
  		if ( !last ) {
  			var nm = cm + settings.perpage;
  			items.hide();
			
  			items.slice( cm, nm ).show();
  			cm = nm;
			
  			if (cm >= total) {
  				last = true;
  				nextbut.addClass("qp_disabled");
  			}
			
  			if ( settings.showcounter ) settings.pager.find("."+settings.pagenumber).text(cm/settings.perpage);
			
  			prevbut.removeClass("qp_disabled");
  			first = false;
			  $(document).trigger('paginate.quickpaginate', ['next', (cm/settings.perpage)]);
  		}
  	};
	
  	var goPrev = function(){
  		if ( !first ){
  			var nm = cm-settings.perpage;
  			items.hide();
			
  			items.slice( (nm - settings.perpage), nm ).show();
  			cm = nm;
			
  			if (cm == settings.perpage){
  				first = true;
  				prevbut.addClass("qp_disabled");
  			}
			
  			if ( settings.showcounter ) settings.pager.find("."+settings.pagenumber).text(cm/settings.perpage);
			
  			nextbut.removeClass("qp_disabled");
  			last = false;
  			$(document).trigger('paginate.quickpaginate', ['prev', (cm/settings.perpage)]);
  		}
  	};
	
  	var setNav = function(){
  		if ( settings.pager === null ){	
  			settings.pager = jQuery('<div class="qc_pager"></div>');
  			items.eq( items.size() -1 ).after(settings.pager);
  		}
		
  		var pagerNav = $('<div class="'+settings.prev_class+'"><a href="#">'+settings.prev_text+'</a></div><div class="'+settings.next_class+'"><a href="#">'+settings.next_text+'</a></div>');
		
  		jQuery(settings.pager).append( pagerNav );
		
  		if ( settings.showcounter ){
  			var counter = '<span class="'+settings.counter+'"><span class="'+settings.pagenumber+'"></span> / <span class="'+settings.totalnumber+'"></span></span>';
			
  			settings.pager.find("."+settings.prev_class).after( counter );
  			settings.pager.find("."+settings.pagenumber).text( 1 );
  			settings.pager.find("."+settings.totalnumber).text( Math.ceil(total / settings.perpage) );
  		}

  		nextbut = settings.pager.find("."+settings.next_class+' a');
  		prevbut = settings.pager.find("."+settings.prev_class+' a');
  		prevbut.addClass("qp_disabled");
		
  		nextbut.click(function(){
  			goNext();
  			return false;
  		});
  		prevbut.click(function(){
  			goPrev();
  			return false;
  		});
  	};
	
  	init(); // run the function
  };
})(jQuery);
