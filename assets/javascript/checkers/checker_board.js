/*
* A standard, 8x8 American checker board.
*/
function CheckerBoard() {
	this._board = new Array(8);
	this._initialize();
}
CheckerBoard.prototype._initialize = function() {
	this._board = new Array(8);
	for (var i = 0; i < 8; ++i) {
		this._board[i] = new Array(8);
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

	var piece = this._board[pos.x][pos.y];
	return (typeof piece == 'undefined') ? null : piece;
};
CheckerBoard.prototype.setPiece = function(pos, piece) {
	if (piece.position !== null) throw "Piece " + piece + " cannot be on more than one tile at once.";

	piece.position = pos;
	this._board[pos.x][pos.y] = piece;
};
CheckerBoard.prototype.clearPiece = function(piece) {
	if (piece.position === null) throw "Piece " + piece + " cannot be cleared because it is not on the board.";

	var pos = piece.position;
	piece.position = null;
	this._board[pos.x][pos.y] = null;
};
CheckerBoard.prototype.movePiece = function(piece, pos) {
	this.clearPiece(piece);
	this.setPiece(pos, piece);
};
