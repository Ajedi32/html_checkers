class CheckersMove {
	constructor(piece, target) {
		this.piece = piece;
		this.to = target;
	}

	isJump() {
		var movementVector = this.to.subtract(this.piece.position);
		return Math.abs(movementVector.x) > 1 || Math.abs(movementVector.y) > 1;
	}

	equals(other) {
		return (
			(other instanceof CheckersMove) &&
			(this.piece.equals(other.piece)) &&
			this.to.equals(other.to)
		);
	}

	toString() {
		return this.constructor.name + "{ piece: " + this.piece + ", to: " + this.to + " }";
	}
}
