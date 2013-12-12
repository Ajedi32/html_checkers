Function.prototype.setSuperclass = function(target) {
	this._superclass = target;
	this.prototype = Object.create(this._superclass.prototype);
	this.prototype.constructor = this;
};

Function.prototype.getSuperclass = function(target) {
	return this._superclass;
};

Object.defineProperty(Object.prototype, 'callSuper', {
	value: function(methodName, args) {
		var superclass = this.constructor.getSuperclass();
		if (superclass === undefined) throw new TypeError("A superclass for " + this.constructor + " could not be found.");

		var method = superclass.prototype[methodName];
		if (typeof method != "function") throw new TypeError("TypeError: Object " + superclass.prototype + " has no method '" + methodName + "'");

		return method.apply(this, args);
	}
});


function CheckersGame(options) {
	options = (typeof options == 'undefined') ? {} : options;

	this.board = (options.board === undefined) ? new CheckerBoard() : options.board;
	this._pieceClass = (options.piece === undefined) ? HTMLCheckerPiece : options.piece;

	this._setUp();
}
CheckersGame.PLAYERS = {
	RED: 0,
	BLACK: 1
};
CheckersGame.prototype._setUp = function() {
	var column;
	var row;

	// Populate black spaces on top three rows of the board with black pieces
	for (column = 0; column < 8; ++column) {
		for (row = 0; row < 3; ++row) {
			if (this.board.isBlackSpace(new Vector2(column, row))) {
				this.board.setPiece(new Vector2(column, row), new this._pieceClass(CheckersGame.PLAYERS.BLACK));
			}
		}
	}

	// Populate black spaces on bottom three rows of the board with red pieces
	for (column = 0; column < 8; ++column) {
		for (row = 5; row < 8; ++row) {
			if (this.board.isBlackSpace(new Vector2(column, row))) {
				this.board.setPiece(new Vector2(column, row), new this._pieceClass(CheckersGame.PLAYERS.RED));
			}
		}
	}
};
CheckersGame.prototype.getLegalMoves = function(piece) {
	if (piece === null) return [];

	var legalTargets = [];

	var movementVectors = piece.getMovementVectors();
	for (var movementVector in movementVectors) {
		movementVector = movementVectors[movementVector];

		var potentialTarget = piece.position.add(movementVector);
		var piece2 = this.board.getPiece(potentialTarget);

		if (this.board.isValidSpace(potentialTarget)) {
			if (this.board.isEmptySpace(potentialTarget)) {
				legalTargets.push(potentialTarget);
			} else if (piece.owner != this.board.getPiece(potentialTarget).owner) { // If jump might be possible...
				potentialTarget = potentialTarget.add(movementVector);

				if (this.board.isValidSpace(potentialTarget) && this.board.isEmptySpace(potentialTarget)) legalTargets.push(potentialTarget);
			}
		}
	}

	return legalTargets;
};
CheckersGame.prototype.isLegalMove = function(piece, pos) {
	var legalMoves = this.getLegalMoves(piece);
	for (var move in legalMoves) {
		move = legalMoves[move];
		if (move.equals(pos)) return true;
	}
	return false;
};
CheckersGame.prototype.doMove = function(piece, pos) {
	if (!this.isLegalMove(piece, pos)) return false;

	var movementVector = pos.subtract(piece.position);
	if (Math.abs(movementVector.x) > 1 || Math.abs(movementVector.y) > 1) { // Jump
		var direction = new Vector2(movementVector.x > 0 ? 1 : -1, movementVector.y > 0 ? 1 : -1);
		var jumpedPos = piece.position.add(direction);

		this.board.clearPiece(this.board.getPiece(jumpedPos));
	}

	this.board.clearPiece(piece);
	this.board.setPiece(pos, piece);
};


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


function Vector2(x, y) {
	this.x = x;
	this.y = y;
}
Vector2.prototype.add = function(other) {
	if (!(other instanceof Vector2)) throw new TypeError("Cannot add '" + other + "'' to '" + this + "'!");
	return new Vector2(this.x + other.x, this.y + other.y);
};
Vector2.prototype.subtract = function(other) {
	if (!(other instanceof Vector2)) throw new TypeError("Cannot subtract '" + other + "'' from '" + this + "'!");
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
	if (this.owner == CheckersGame.PLAYERS.RED || this.rank == this.RANKS.KING) movementVectors.push(new Vector2(-1, -1), new Vector2(1, -1));
	if (this.owner == CheckersGame.PLAYERS.BLACK || this.rank == this.RANKS.KING) movementVectors.push(new Vector2(-1, 1), new Vector2(1, 1));
	return movementVectors;
};
CheckerPiece.prototype.RANKS = {
	MAN: 0,
	KING: 1
};


/*
* A subclass of CheckersGame which mirrors changes made in the game to html
*/
function HTMLCheckersGame(htmlElement) {
	this._htmlGame = $(htmlElement).first();

	this.constructor.getSuperclass().call(this, {
		board: new HTMLCheckerBoard(this._htmlGame.find('.checkers-board')),
		piece: HTMLCheckerPiece
	});
}
HTMLCheckersGame.setSuperclass(CheckersGame);


/*
* A subclass of CheckerBoard which mirrors changes made to the board in the UI.
*/
function HTMLCheckerBoard(htmlElement) {
	this.constructor.getSuperclass().call(this);

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
// @Override
HTMLCheckerBoard.prototype.setPiece = function(pos, piece) {
	this.callSuper('setPiece', arguments);

	var space = this._boardSpaces[pos.x][pos.y];
	space.empty();
	space.append(piece.htmlElement);
};
// @Override
HTMLCheckerBoard.prototype.clearPiece = function(piece) {
	var pos = piece.position;

	this.callSuper('clearPiece', arguments);
	this._boardSpaces[pos.x][pos.y].empty();
};


/*
* A subclass of CheckerPiece for use with an HTMLCheckerBoard.
*/
function HTMLCheckerPiece(owner, rank) {
	this.constructor.getSuperclass().call(this, owner, rank);

	this.htmlElement = $(document.createElement('div'));
	this.htmlElement.addClass('piece');
	this.htmlElement.addClass((this.owner == CheckersGame.PLAYERS.RED ? 'red' : 'black') + '-piece');

	if (rank == this.RANKS.KING) this.htmlElement.addClass('king-piece');
}
HTMLCheckerPiece.setSuperclass(CheckerPiece);


$(document).ready(function() {
	var game = new HTMLCheckersGame('.checkers-game');
});
