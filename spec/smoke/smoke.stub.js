Smoke.Stub = function(obj,attr) {
	this.obj = obj;
	this.attribute = attr;
	this.and_return(this.defaultReturn);
};

Smoke.Stub.prototype = {
	defaultReturn: null, 
	property: function(p){
		this.property = p;
		this.and_set_to(this.defaultReturn);
		return this;
	},
	method: function(f){
		this.func = f;
		this.and_return(this.defaultReturn);
		return this;
	},
	and_return: function(v){
		this.obj[this.attribute] = function() {
			return v;
		};
		return this.obj;
	},
	and_set_to: function(v){
		this.obj[this.attribute] = v;
		return this.obj;
	}
};