Function.prototype.setSuperclass = function(target) {
	// Set a custom field for keeping track of the object's 'superclass'.
	this._superclass = target;

	// Set the internal [[Prototype]] of instances of this object to a new object
	// which inherits from the superclass's prototype.
	this.prototype = Object.create(this._superclass.prototype);

	// Correct the constructor attribute of this class's prototype
	this.prototype.constructor = this;
};

Function.prototype.getSuperclass = function(target) {
	// Easy way of finding out what a class inherits from
	return this._superclass;
};

Function.prototype.callSuper = function(target, methodName, args) {
	// If methodName is ommitted, call the constructor.
	if (arguments.length < 3) {
		return this.callSuperConstructor(arguments[0], arguments[1]);
	}

	// `args` is an empty array by default.
	if (args === undefined || args === null) args = [];

	var superclass = this.getSuperclass();
	if (superclass === undefined) throw new TypeError("A superclass for " + this + " could not be found.");

	var method = superclass.prototype[methodName];
	if (typeof method != "function") throw new TypeError("TypeError: Object " + superclass.prototype + " has no method '" + methodName + "'");

	return method.apply(target, args);
};

Function.prototype.callSuperConstructor = function(target, args) {
	if (args === undefined || args === null) args = [];

	var superclass = this.getSuperclass();
	if (superclass === undefined) throw new TypeError("A superclass for " + this + " could not be found.");

	return superclass.apply(target, args);
};

Function.prototype.withArgs = function() {
	if (typeof this !== "function") {
		throw new TypeError("Function.prototype.withArgs needs to be called on a function");
	}
	var fn = this;
	var slice = Array.prototype.slice;
	var args = slice.call(arguments);
	partial = function() {
		return fn.apply(this, args.concat(slice.call(arguments)));
	};
	//partial.prototype = Object.create(this.prototype);
	return partial;
};
