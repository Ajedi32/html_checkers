/*
* A subclass of CheckerBoard which mirrors changes made to the board in the UI.
*/
class HTMLCheckerBoard extends CheckerBoard {
	constructor(htmlElement) {
		super();

		this._htmlBoard = $(htmlElement).first();

		this._boardSpaces = new Array(8);
		this._parseSpaces();
	}

	_parseSpaces() {
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
	}

	_initializeSpaces() {
		this._boardSpaces = new Array(8);
		for (var i = 0; i < 8; ++i) {
			this._boardSpaces[i] = new Array(8);
		}
	}

	_getSpace(pos) {
		return this._boardSpaces[pos.x][pos.y];
	}


	setPiece(pos, piece) {
		super.setPiece(...arguments);

		var space = this._getSpace(pos);
		space.empty();
		space.append(piece.htmlElement);
	}


	clearPiece(piece) {
		var pos = piece.position;

		super.clearPiece(...arguments);
		this._getSpace(new Vector2(pos.x, pos.y)).empty();
	}

	movePiece(piece, pos) {
		super.clearPiece(piece);

		var space = this._getSpace(pos);
		space.append(piece.htmlElement);

		super.setPiece(pos, piece);
	}

	onClickSpace(func) {
		var columnNum;
		var rowNum;

		for (columnNum = 0; columnNum < 8; ++columnNum) {
			for (rowNum = 0; rowNum < 8; ++rowNum) {
				var pos = new Vector2(columnNum, rowNum);
				this._getSpace(pos).on('click', func.withArgs(pos));
			}
		}
	}

	highlightSpace(pos) {
		this._getSpace(pos).addClass('selected');
	}

	unhighlightSpace(pos) {
		this._getSpace(pos).removeClass('selected');
	}
}
