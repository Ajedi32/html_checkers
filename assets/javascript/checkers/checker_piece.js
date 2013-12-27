function CheckerPiece(owner, rank) {
	rank = typeof rank !== 'undefined' ? rank : this.RANKS.MAN;

	this.owner = owner;
	this.rank = rank;
	this.position = null;
}
CheckerPiece.prototype.getMovementVectors = function () {
	var movementVectors = [];
	if (this.owner == CheckersGame.PLAYERS.RED || this.rank == this.RANKS.KING) movementVectors.push(new Vector2(-1, -1), new Vector2(1, -1));
	if (this.owner == CheckersGame.PLAYERS.BLACK || this.rank == this.RANKS.KING) movementVectors.push(new Vector2(-1, 1), new Vector2(1, 1));
	return movementVectors;
};
CheckerPiece.prototype.promote = function() {
	if (this.rank >= 1) throw new RangeError("This piece may not be promoted further. (" + this + ")");

	this.rank += 1;
};
CheckerPiece.prototype.RANKS = {
	MAN: 0,
	KING: 1
};
CheckerPiece.prototype.toString = function() {
	return this.constructor.name + "{ owner: " + this.owner + ", rank: " + this.rank + ", position: " + this.position + " }";
};
CheckerPiece.prototype.equals = function(other) {
	return (
		(other instanceof CheckerPiece) &&
		(this.owner == other.owner) &&
		(this.rank == other.rank) &&
		equal(this.position, other.position)
	);
};
