/*
* A standard, 8x8 American checker board.
*/
function CheckerBoard() {
	this.board = new Array(8);
	this.setUp();
}
CheckerBoard.prototype.PLAYERS = {
	RED: 0,
	BLACK: 1
};
CheckerBoard.prototype.initialize = function() {
	this.board = new Array(8);
	for (var i = 0; i < 8; ++i) {
		this.board[i] = new Array(8);
	}
};
CheckerBoard.prototype.setUp = function() {
	this.initialize();

	var column;
	var row;

	// Populate black spaces on top three rows of the board with black pieces
	for (column = 0; column < 8; ++column) {
		for (row = 0; row < 3; ++row) {
			if (this.isBlackSpace(new Vector2(column, row))) {
				this.setPiece(new Vector2(column, row), new CheckerPiece(this.PLAYERS.BLACK));
			}
		}
	}

	// Populate black spaces on bottom three rows of the board with red pieces
	for (column = 0; column < 8; ++column) {
		for (row = 5; row < 8; ++row) {
			if (this.isBlackSpace(new Vector2(column, row))) {
				this.setPiece(new Vector2(column, row), new CheckerPiece(this.PLAYERS.RED));
			}
		}
	}
};
CheckerBoard.prototype.isBlackSpace = function(pos) {
	var isWhite = ((pos.x + pos.y) % 2) === 0;
	return !isWhite;
};
CheckerBoard.prototype.isValidSpace = function(pos) {
	if (pos === null || pos === undefined) return false;
	return (pos.x >= 0 && pos.x < 8) && (pos.y >= 0 && pos.y < 8);
};
CheckerBoard.prototype.isEmptySpace = function(pos) {
	return this.getPiece(pos) === null;
};
CheckerBoard.prototype.getPiece = function(pos) {
	if (!this.isValidSpace(pos)) return undefined;

	var piece = this.board[pos.x][pos.y];
	return (typeof piece == 'undefined') ? null : piece;
};
CheckerBoard.prototype.setPiece = function(pos, piece) {
	if (piece.position !== null) throw "Piece " + piece + " cannot be on more than one tile at once.";

	piece.position = pos;
	this.board[pos.x][pos.y] = piece;
};
CheckerBoard.prototype.clearPiece = function(piece) {
	if (piece.position === null) throw "Piece " + piece + " cannot be cleared because it is not on the board.";

	piece.position = null;
	this.board[pos.x][pos.y] = null;
};
CheckerBoard.prototype.getLegalMoves = function(piece) {
	if (piece === null) return [];

	var legalTargets = [];

	var movementVectors = piece.getMovementVectors();
	for (var movementVector in movementVectors) {
		movementVector = movementVectors[movementVector];

		var potentialTarget = piece.position.add(movementVector);
		var piece2 = this.getPiece(potentialTarget);

		if (isValidSpace(potentialTarget)) {
			if (isEmptySpace(potentialTarget)) {
				legalTargets.push(potentialTarget);
			} else if (piece.owner != this.getPiece(potentialTarget).owner) { // If jump might be possible...
				potentialTarget = potentialTarget.add(movementVector);

				if (isValidSpace(potentialTarget) && isEmptySpace(potentialTarget)) legalTargets.push(potentialTarget);
			}
		}
	}

	return legalTargets;
};
CheckerBoard.prototype.isLegalMove = function(piece, pos) {
	var legalMoves = this.getLegalMoves(piece);
	for (var move in legalMoves) {
		move = legalMoves[move];
		if (move.equals(pos)) return true;
	}
	return false;
};
CheckerBoard.prototype.doMove = function(piece, pos) {
	if (!this.isLegalMove(piece, pos)) return false;

	var movementVector = pos.subtract(piece.position);
	if (Math.abs(movementVector.x) > 1 || Math.abs(movementVector.y) > 1) { // Jump
		var direction = new Vector2(movementVector.x > 0 ? 1 : -1, movementVector.y > 0 ? 1 : -1);
		var jumpedPos = piece.position.add(diection);

		this.clearPiece(this.getPiece(jumpedPos));
	}

	this.clearPiece(piece);
	this.setPiece(pos, piece);
};


function Vector2(x, y) {
	this.x = x;
	this.y = y;
}
Vector2.prototype.add = function(other) {
	if (!(other instanceof Vector2)) throw "Cannot add '" + other + "'' to '" + this + "'!";
	return new Vector2(this.x + other.x, this.y + other.y);
};
Vector2.prototype.subtract = function(other) {
	if (!(other instanceof Vector2)) throw "Cannot subtract '" + other + "'' from '" + this + "'!";
	return new Vector2(this.x - other.x, this.y - other.y);
};
Vector2.prototype.equals = function(other) {
	return ((other instanceof Vector2) && (this.x == other.x) && (this.y == other.y));
};

function CheckerPiece(owner, rank) {
	rank = typeof rank !== 'undefined' ? rank : this.RANKS.MAN;

	this.owner = owner;
	this.rank = rank;
	this.position = null;
}
CheckerPiece.prototype.getMovementVectors = function () {
	var movementVectors = [];
	if (this.owner == CheckerBoard.prototype.PLAYERS.RED || this.rank == this.RANKS.KING) movementVectors.push(new Vector2(-1, -1), new Vector2(1, -1));
	if (this.owner == CheckerBoard.prototype.PLAYERS.BLACK || this.rank == this.RANKS.KING) movementVectors.push(new Vector2(-1, 1), new Vector2(1, 1));
	return movementVectors;
};
CheckerPiece.prototype.RANKS = {
	MAN: 0,
	KING: 1
};
