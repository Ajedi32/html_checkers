class CheckerPiece {
	constructor(owner, rank) {
		rank = typeof rank !== 'undefined' ? rank : CheckerPiece.RANKS.MAN;

		this.owner = owner;
		this.rank = rank;
		this.position = null;
	}

	getMovementVectors() {
		var movementVectors = [];
		if (this.owner == CheckersGame.PLAYERS.RED || this.rank == CheckerPiece.RANKS.KING) movementVectors.push(new Vector2(-1, -1), new Vector2(1, -1));
		if (this.owner == CheckersGame.PLAYERS.BLACK || this.rank == CheckerPiece.RANKS.KING) movementVectors.push(new Vector2(-1, 1), new Vector2(1, 1));
		return movementVectors;
	}

	promote() {
		if (this.rank >= 1) throw new RangeError("This piece may not be promoted further. (" + this + ")");

		this.rank += 1;
	}

	toString() {
		return this.constructor.name + "{ owner: " + this.owner + ", rank: " + this.rank + ", position: " + this.position + " }";
	}

	equals(other) {
		return (
			(other instanceof CheckerPiece) &&
			(this.owner == other.owner) &&
			(this.rank == other.rank) &&
			equal(this.position, other.position)
		);
	}
}

CheckerPiece.RANKS = {
	MAN: 0,
	KING: 1
};
