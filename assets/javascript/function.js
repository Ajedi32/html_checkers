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
