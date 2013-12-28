/*
* A standard, 8x8 American checker board.
*/
class CheckerBoard {
	constructor() {
		this._board = new Array(8);
		this._initialize();
	}

	_initialize() {
		this._board = new Array(8);
		for (var i = 0; i < 8; ++i) {
			this._board[i] = new Array(8);
		}
	}

	isBlackSpace(pos) {
		var isWhite = ((pos.x + pos.y) % 2) === 0;
		return !isWhite;
	}

	isValidSpace(pos) {
		if (pos === null || pos === undefined) return false;
		return (pos.x >= 0 && pos.x < 8) && (pos.y >= 0 && pos.y < 8);
	}

	isEmptySpace(pos) {
		return this.getPiece(pos) === null;
	}

	getPiece(pos) {
		if (!this.isValidSpace(pos)) return undefined;

		var piece = this._board[pos.x][pos.y];
		return (typeof piece == 'undefined') ? null : piece;
	}

	setPiece(pos, piece) {
		if (piece.position !== null) throw "Piece " + piece + " cannot be on more than one tile at once.";

		piece.position = pos;
		this._board[pos.x][pos.y] = piece;
	}

	clearPiece(piece) {
		if (piece.position === null) throw "Piece " + piece + " cannot be cleared because it is not on the board.";

		var pos = piece.position;
		piece.position = null;
		this._board[pos.x][pos.y] = null;
	}

	movePiece(piece, pos) {
		this.clearPiece(piece);
		this.setPiece(pos, piece);
	}
}
