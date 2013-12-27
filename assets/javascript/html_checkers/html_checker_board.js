/*
* A subclass of CheckerBoard which mirrors changes made to the board in the UI.
*/
function HTMLCheckerBoard(htmlElement) {
	HTMLCheckerBoard.callSuper(this);

	this._htmlBoard = $(htmlElement).first();

	this._boardSpaces = new Array(8);
	this._parseSpaces();
}
HTMLCheckerBoard.setSuperclass(CheckerBoard);

HTMLCheckerBoard.prototype._parseSpaces = function() {
	this._initializeSpaces();

	var rows = this._htmlBoard.find("tr");

	var columnNum;
	var rowNum;

	for (rowNum = 0; rowNum < 8; ++rowNum) {
		var row = $(rows[rowNum]).find("td");
		for (columnNum = 0; columnNum < 8; ++columnNum) {
			this._boardSpaces[columnNum][rowNum] = $(row[columnNum]);
		}
	}
};
HTMLCheckerBoard.prototype._initializeSpaces = function() {
	this._boardSpaces = new Array(8);
	for (var i = 0; i < 8; ++i) {
		this._boardSpaces[i] = new Array(8);
	}
};
HTMLCheckerBoard.prototype._getSpace = function(pos) {
	return this._boardSpaces[pos.x][pos.y];
};
// @Override
HTMLCheckerBoard.prototype.setPiece = function(pos, piece) {
	HTMLCheckerBoard.callSuper(this, 'setPiece', arguments);

	var space = this._getSpace(pos);
	space.empty();
	space.append(piece.htmlElement);
};
// @Override
HTMLCheckerBoard.prototype.clearPiece = function(piece) {
	var pos = piece.position;

	HTMLCheckerBoard.callSuper(this, 'clearPiece', arguments);
	this._getSpace(new Vector2(pos.x, pos.y)).empty();
};
HTMLCheckerBoard.prototype.movePiece = function(piece, pos) {
	HTMLCheckerBoard.callSuper(this, 'clearPiece', [piece]);

	var space = this._getSpace(pos);
	space.append(piece.htmlElement);

	HTMLCheckerBoard.callSuper(this, 'setPiece', [pos, piece]);
};
HTMLCheckerBoard.prototype.onClickSpace = function(func) {
	var columnNum;
	var rowNum;

	for (columnNum = 0; columnNum < 8; ++columnNum) {
		for (rowNum = 0; rowNum < 8; ++rowNum) {
			var pos = new Vector2(columnNum, rowNum);
			this._getSpace(pos).on('click', func.withArgs(pos));
		}
	}
};
HTMLCheckerBoard.prototype.highlightSpace = function(pos) {
	this._getSpace(pos).addClass('selected');
};
HTMLCheckerBoard.prototype.unhighlightSpace = function(pos) {
	this._getSpace(pos).removeClass('selected');
};
