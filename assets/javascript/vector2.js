function Vector2(x, y) {
	this.x = x;
	this.y = y;
}
Vector2.prototype.add = function(other) {
	if (!(other instanceof Vector2)) throw new TypeError("Cannot add '" + other + "'' to '" + this + "'!");
	return new Vector2(this.x + other.x, this.y + other.y);
};
Vector2.prototype.subtract = function(other) {
	if (!(other instanceof Vector2)) throw new TypeError("Cannot subtract '" + other + "'' from '" + this + "'!");
	return new Vector2(this.x - other.x, this.y - other.y);
};
Vector2.prototype.equals = function(other) {
	return ((other instanceof Vector2) && (this.x == other.x) && (this.y == other.y));
};
Vector2.prototype.toString = function() {
	return this.constructor.name + "(" + this.x + ", " + this.y + ")";
};

// For NodeJS
if (exports === undefined) exports = {};
exports.Vector2 = Vector2;
