function CheckersMove(piece, target) {
	this.piece = piece;
	this.to = target;
}
CheckersMove.prototype.isJump = function() {
	var movementVector = this.to.subtract(this.piece.position);
	return Math.abs(movementVector.x) > 1 || Math.abs(movementVector.y) > 1;
};
CheckersMove.prototype.equals = function(other) {
	return (
		(other instanceof CheckersMove) &&
		(this.piece.equals(other.piece)) &&
		this.to.equals(other.to)
	);
};
CheckersMove.prototype.toString = function() {
	return this.constructor.name + "{ piece: " + this.piece + ", to: " + this.to + " }";
};
