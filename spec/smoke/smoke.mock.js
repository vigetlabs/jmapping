// Overide these functions for custom pass/fail behaviours
Smoke.passed = function(mock){
	Smoke.passCount++;
};

Smoke.failed = function(mock, message){
	Smoke.failCount++;
	throw(message);
};

// Some helpers
Smoke.reset = function(){
	Smoke.mocks = [];
	Smoke.passCount = 0;
	Smoke.failCount = 0;
};
Smoke.reset();

Smoke.checkExpectations = function(){
	for(var i=0; i<Smoke.mocks.length; i++) Smoke.mocks[i].checkExpectations();
};

// Don't play beyond here unless you know what you're doing
Smoke.Mock = function(originalObj) {
	var obj = originalObj || {} ;
	obj._expectations = {};
	obj.stub = function(attr){
		return new Smoke.Stub(this, attr);
	};
	
	obj.should_receive = function(attr){
		var expectation = new Smoke.Mock.Expectation(this, attr);
		this._expectations[attr] = (this._expectations[attr] || []).concat([expectation]);
		if(this._expectations[attr].length == 1) {
  		this[attr] = Smoke.Mock.Expectation.stub(this, attr);
		} 
		return expectation;		  
	};

	obj.checkExpectations = function(){
		for(var e in this._expectations) {
			var expectations = this._expectations[e];
			for(var i=0; i < expectations.length; i++) expectations[i].check();
		};
	};
	
	Smoke.mocks.push(obj);
	return obj;
};

Smoke.MockFunction = function(originalFunction, name) {
  name = name || 'anonymous_function';
  var mock = Smoke.Mock(function() {
    var return_value = arguments.callee[name].apply(this, arguments);
    if (return_value === undefined) {
      return_value = (originalFunction || new Function()).apply(this, arguments);
    }
    return return_value;
  });
  mock[name] = (originalFunction || new Function());
  mock.should_be_invoked = function() {
    return this.should_receive(name);
  };
  return mock;
};

Smoke.Mock.Expectation = function(mock, attr) {
	this._mock = mock;
	this._attr = attr;
	this.callCount = 0;
	this.returnValue = undefined;
	this.callerArgs = undefined;
	this.hasReturnValue = false;
};

Smoke.Mock.Expectation.stub = function(mock, attr) {
  return function() {
    return function() {
      var matched, return_value, args = arguments;
      jQuery.each(this, function() {
    	  this.run(args) && (matched = true) && (return_value = this.returnValue);
      });
      if (!matched) {
        this[0].argumentMismatchError(args);
      }
      return return_value;        
    }.apply(mock._expectations[attr], arguments);
  };
};


Smoke.Mock.Expectation.prototype = {
	exactly: function(count,type){
		// type isn't used for now, it's just syntax ;)
		this.minCount = this.maxCount = undefined;
		this.exactCount = this.parseCount(count);
		return this;
	},
	at_most: function(count,type){
		this.maxCount = this.parseCount(count);
		return this;
	},
	at_least: function(count,type){
		this.minCount = this.parseCount(count);
		return this;
	},
	with_arguments: function(){
		this.callerArgs = arguments;
		return this;
	},
	run: function(args){
		if((this.callerArgs === undefined) || Smoke.compareArguments(args, this.callerArgs)) {
			return !!(this.callCount+=1);
		};
		return false;
	},
	and_return: function(v){
	  this.hasReturnValue = true;
		this.returnValue = v;
	},
	check: function(){
		if(this.exactCount!=undefined) this.checkExactCount();
		if(this.minCount!=undefined) this.checkMinCount();
		if(this.maxCount!=undefined) this.checkMaxCount();
	},
	checkExactCount: function(){
		if(this.exactCount==this.callCount) Smoke.passed(this);//console.log('Mock passed!')
		else Smoke.failed(this, 'expected '+this.methodSignature()+' to be called exactly '+this.exactCount+" times but it got called "+this.callCount+' times');
	},
	checkMinCount: function(){
		if(this.minCount<=this.callCount) Smoke.passed(this);
		else Smoke.failed(this, 'expected '+this.methodSignature()+' to be called at least '+this.minCount+" times but it only got called "+this.callCount+' times');
	},
	checkMaxCount: function(){
		if(this.maxCount>=this.callCount) Smoke.passed(this);//console.log('Mock passed!')
		else Smoke.failed(this, 'expected '+this.methodSignature()+' to be called at most '+this.maxCount+" times but it actually got called "+this.callCount+' times');
	},
	argumentMismatchError: function(args) {
	  Smoke.failed(this, 'expected ' + this._attr + ' with ' + Smoke.printArguments(this.callerArgs) + ' but received it with ' + Smoke.printArguments(args));
	},
	methodSignature: function(){
		return this._attr + Smoke.printArguments(this.callerArgs);
	},
	parseCount: function(c){
		switch(c){
			case 'once': 
				return 1;
			case 'twice':
				return 2;
			default:
				return c;
		}
	}
};