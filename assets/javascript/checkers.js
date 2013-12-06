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
			if (this.isBlackSpace(column, row)) {
				this.setPiece(column, row, new CheckerPiece(this.PLAYERS.BLACK));
			}
		}
	}

	// Populate black spaces on bottom three rows of the board with red pieces
	for (column = 0; column < 8; ++column) {
		for (row = 5; row < 8; ++row) {
			if (this.isBlackSpace(column, row)) {
				this.setPiece(column, row, new CheckerPiece(this.PLAYERS.RED));
			}
		}
	}
};
CheckerBoard.prototype.isBlackSpace = function(x, y) {
	var isWhite = ((x + y) % 2) === 0;
	return !isWhite;
};
CheckerBoard.prototype.isValidSpace = function(x, y) {
	return (x >= 0 && x < 8) && (y >= 0 && y < 8);
};
CheckerBoard.prototype.getPiece = function(x, y) {
	if (!this.isValidSpace(x, y)) return undefined;

	var piece = this.board[x][y];
	return (typeof piece == 'undefined') ? null : piece;
};
CheckerBoard.prototype.setPiece = function(x, y, piece) {
	return this.board[x][y] = piece;
};


function CheckerPiece(owner, rank) {
	rank = typeof rank !== 'undefined' ? rank : this.RANKS.MAN;

	this.owner = owner;
	this.rank = rank;
}
CheckerPiece.prototype.RANKS = {
	MAN: 0,
	KING: 1
};
