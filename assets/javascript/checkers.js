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
CheckerBoard.prototype.getLegalMoves = function(pos) {
	if (!this.isValidSpace(pos)) return [];

	var piece = this.getPiece(pos);
	if (piece === null) return [];

	var movementVectors = piece.getMovementVectors();
	var legalTargets = [];

	for (var movementVector in movementVectors) {
		movementVector = movementVectors[movementVector];

		var pos2 = pos.add(movementVector);
		var piece2 = this.getPiece(pos2);

		if (piece2 === null) {
			legalTargets.push(pos2);
		} else if (piece2 !== undefined && piece2 !== null && piece.owner != piece2.owner) {
			pos2 = pos2.add(movementVector);
			piece2 = this.getPiece(pos2);

			if (piece2 === null) legalTargets.push(pos2);
		}
	}

	return legalTargets;
};


function Vector2(x, y) {
	this.x = x;
	this.y = y;
}
Vector2.prototype.add = function(other) {
	if (!(other instanceof Vector2)) throw "Cannot add '" + other + "'' to '" + this + "'!";
	return new Vector2(this.x + other.x, this.y + other.y);
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
