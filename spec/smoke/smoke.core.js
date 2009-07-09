Smoke = {
	print: function(v) {
		// use the jquery print plugin if it is available or fall back to toString();
		return (jQuery && jQuery.print) ? jQuery.print(v) : v.toString();
	},
	
	printArguments: function(args) {    
    var a = [];
    if (args === undefined) args = '';
    if ((args && args.callee) || (args instanceof Array)) {
      for(var i = 0; i < args.length; i++) {
        a.push(Smoke.print(args[i]));
      }      
    } else {
      // Workaround for jQuery.print returning "null" when called with an empty string.
      if (!args && (typeof args == 'string')) {
        a.push('');
      } else {
        a.push(Smoke.print(args));
      }
    }
		return '(' + a.join(', ') + ')';
	},
	
	argumentsToArray: function(args) {	  
    return Array.prototype.slice.call(args);
  },
  
  compare: function(a, b) {
    if (a === b) return true;
    if (a instanceof Array) {
      if (b.length != a.length) return false;
      for (var i = 0; i < b.length; i++)
        if (!this.compare(a[i], b[i])) return false;
    } else if (a instanceof Object) {
      for (var key in a)
        if (!this.compare(a[key], b[key])) return false;
      for (var key in b)
        if (!this.compare(b[key], a[key])) return false;
    } else {
      return false;
    }
    return true;
	},
	
	compareArguments: function(a, b) {
	  return this.compare(Smoke.argumentsToArray(a), Smoke.argumentsToArray(b));
	}
};