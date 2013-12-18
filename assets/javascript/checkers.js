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

Object.defineProperty(Array.prototype, 'contains', {
	value: function(object) {
		return this.some(function(i) {
			return (i === object) || (typeof i.equals == 'function' && i.equals(object));
		});
	}
});

Function.prototype.withArgs = function() {
	if (typeof this !== "function") {
		throw new TypeError("Function.prototype.withArgs needs to be called on a function");
	}
	var fn = this;
	var slice = Array.prototype.slice;
	var args = slice.call(arguments);
	partial = function() {
		return fn.apply(this, args.concat(slice.call(arguments)));
	};
	//partial.prototype = Object.create(this.prototype);
	return partial;
};


/*
* Checkes for equality between two objects or primitives
*/
function equal(object1, object2) {
	return (
		(object1 === object2) || (
			object1 !== undefined &&
			object1 !== null &&
			typeof object1.equals == "function" &&
			object1.equals(object2)
		)
	);
}


function CheckersGame(options) {
	options = (typeof options == 'undefined') ? {} : options;

	this.board = (options.board === undefined) ? new CheckerBoard() : options.board;
	this._pieceClass = (options.piece === undefined) ? HTMLCheckerPiece : options.piece;

	this.turn = null;
	this._setTurn(CheckersGame.PLAYERS.BLACK);

	this._multiJumpPiece = null;

	this._pieces = [];
	this._setUp();
}
CheckersGame.PLAYERS = {
	RED: 0,
	BLACK: 1
};
CheckersGame.prototype._setUp = function() {
	var column;
	var row;

	var piece;

	// Populate black spaces on top three rows of the board with black pieces
	for (column = 0; column < 8; ++column) {
		for (row = 0; row < 3; ++row) {
			if (this.board.isBlackSpace(new Vector2(column, row))) {
				piece = new this._pieceClass(CheckersGame.PLAYERS.BLACK);
				this._pieces.push(piece);
				this.board.setPiece(new Vector2(column, row), piece);
			}
		}
	}

	// Populate black spaces on bottom three rows of the board with red pieces
	for (column = 0; column < 8; ++column) {
		for (row = 5; row < 8; ++row) {
			if (this.board.isBlackSpace(new Vector2(column, row))) {
				piece = new this._pieceClass(CheckersGame.PLAYERS.RED);
				this._pieces.push(piece);
				this.board.setPiece(new Vector2(column, row), piece);
			}
		}
	}
};
CheckersGame.prototype._getLegalTargets = function(piece) {
	if (piece === null) return [];

	var legalTargets = [];

	piece.getMovementVectors().forEach(function(movementVector) {
		var potentialTarget = piece.position.add(movementVector);

		if (this.board.isValidSpace(potentialTarget)) {
			if (this.board.isEmptySpace(potentialTarget)) {
				legalTargets.push(potentialTarget);
			} else if (piece.owner != this.board.getPiece(potentialTarget).owner) { // If jump might be possible...
				potentialTarget = potentialTarget.add(movementVector);

				if (this.board.isValidSpace(potentialTarget) && this.board.isEmptySpace(potentialTarget)) legalTargets.push(potentialTarget);
			}
		}
	}, this);

	return legalTargets;
};
CheckersGame.prototype.getLegalMoves = function(piece) {
	var legalMoves = this._getLegalTargets(piece).map(function(legalTarget) {
		return new CheckersMove(piece, legalTarget);
	});
	if (legalMoves.some(function(move){ return move.isJump(); })) {
		legalMoves = legalMoves.filter(function(move){ return move.isJump(); });
	}
	return legalMoves;
};
CheckersGame.prototype.isLegalMove = function(move) {
	return this.getLegalMoves(move.piece).contains(move);
};
CheckersGame.prototype.doMove = function(move) {
	if (move.piece.owner !== this.turn) throw new CheckersGameError("Cannot do move '" + move + "'; it's not your turn!");
	if (!this.isLegalMove(move)) throw new CheckersGameError("Cannot do move '" + move + "'; that's against the rules.");
	if (this._multiJumpInProgress() && !this._multiJumpPiece.equals(move.piece)) {
		throw new CheckersGameError("Cannot do move '" + move + "'; piece '" + this._multiJumpPiece + "' is in the middle of a jump.");
	}
	if (this.currentPlayerCanJump() && !move.isJump()) throw new CheckersGameError("Cannot do move '" + move + "'; jumps must be taken when possible.");

	var isJump = move.isJump();
	if (isJump) {
		this._removePiece(this._getJumpedPiece(move));
	}

	this.board.movePiece(move.piece, move.to);

	if (isJump && this.canJump(move.piece)) { // Double jump?
		this._multiJumpPiece = move.piece;
	} else {
		this._multiJumpPiece = null;
		this._toggleTurn();
	}

	if (this.isPromotable(move.piece)) move.piece.promote();
};
CheckersGame.prototype.isPromotable = function(piece) {
	if (piece.rank == piece.RANKS.KING) return false;

	if (piece.owner == CheckersGame.PLAYERS.RED) {
		return piece.position.y === 0;
	} else if (piece.owner == CheckersGame.PLAYERS.BLACK) {
		return piece.position.y === 7;
	}
};
CheckersGame.prototype._setTurn = function(player) {
	this.turn = player;
};
CheckersGame.prototype._toggleTurn = function() {
	if (this.turn == CheckersGame.PLAYERS.BLACK) {
		this._setTurn(CheckersGame.PLAYERS.RED);
	} else if (this.turn == CheckersGame.PLAYERS.RED) {
		this._setTurn(CheckersGame.PLAYERS.BLACK);
	}
};
CheckersGame.prototype._getJumpedPiece = function(validMove) {
	if (!validMove.isJump()) return null;

	var movementVector = validMove.to.subtract(validMove.piece.position);
	var direction = new Vector2(movementVector.x > 0 ? 1 : -1, movementVector.y > 0 ? 1 : -1);
	var jumpedPos = validMove.piece.position.add(direction);
	var jumpedPiece = this.board.getPiece(jumpedPos);

	return jumpedPiece;
};
CheckersGame.prototype.canJump = function(piece) {
	return this.getLegalMoves(piece).some(function(move){ return move.isJump(); });
};
CheckersGame.prototype._multiJumpInProgress = function() {
	return this._multiJumpPiece !== null;
};
CheckersGame.prototype._removePiece = function(piece) {
	this.board.clearPiece(piece);
	this._pieces.splice(this._pieces.indexOf(piece), 1);
};
CheckersGame.prototype.playerCanJump = function(player) {
	return this._pieces.filter(function(piece) {
		return piece.owner === player;
	}, this).some(function(piece) {
		return this.canJump(piece);
	}, this);
};
CheckersGame.prototype.currentPlayerCanJump = function() {
	return this.playerCanJump(this.turn);
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
CheckerBoard.prototype.movePiece = function(piece, pos) {
	this.clearPiece(piece);
	this.setPiece(pos, piece);
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
Vector2.prototype.toString = function() {
	return this.constructor.name + "(" + this.x + ", " + this.y + ")";
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
CheckerPiece.prototype.promote = function() {
	if (this.rank >= 1) throw new RangeError("This piece may not be promoted further. (" + this + ")");

	this.rank += 1;
};
CheckerPiece.prototype.RANKS = {
	MAN: 0,
	KING: 1
};
CheckerPiece.prototype.toString = function() {
	return this.constructor.name + "{ owner: " + this.owner + ", rank: " + this.rank + ", position: " + this.position + " }";
};
CheckerPiece.prototype.equals = function(other) {
	return (
		(other instanceof CheckerPiece) &&
		(this.owner == other.owner) &&
		(this.rank == other.rank) &&
		equal(this.position, other.position)
	);
};


function CheckersMove(piece, target) {
	this.piece = piece;
	this.to = target;
}
CheckersMove.prototype.isJump = function() {
	var movementVector = this.to.subtract(this.piece.position);
	return Math.abs(movementVector.x) > 1 || Math.abs(movementVector.y) > 1;
};
CheckersMove.prototype.equals = function(other) {
	return (
		(other instanceof CheckersMove) &&
		(this.piece.equals(other.piece)) &&
		this.to.equals(other.to)
	);
};
CheckersMove.prototype.toString = function() {
	return this.constructor.name + "{ piece: " + this.piece + ", to: " + this.to + " }";
};


/*
* This error is thrown to indicate an action was attempted that violates the
* rules of checkers.
*/
function CheckersGameError(message) {
	this.constructor.getSuperclass().call(this, arguments);
	this.name = this.constructor.name;
	this.message = message;
}
CheckersGameError.setSuperclass(Error);


/*
* A subclass of CheckersGame which mirrors changes made in the game to html
*/
function HTMLCheckersGame(htmlElement) {
	this._htmlGame = $(htmlElement).first();
	this._turnIndicator = this._htmlGame.find('.checkers-turn');

	this.constructor.getSuperclass().call(this, {
		board: new HTMLCheckerBoard(this._htmlGame.find('.checkers-board')),
		piece: HTMLCheckerPiece
	});


	this._selectedPiece = null;
	this._suggestedSpaces = [];

	this._bindEventHandlers();
}
HTMLCheckersGame.setSuperclass(CheckersGame);

HTMLCheckersGame.prototype._bindEventHandlers = function() {
	this._pieces.forEach(function(piece) {
		piece.on('click', this._clickPiece.bind(this, piece));
	}, this);

	this.board.onClickSpace(this._clickSpace.bind(this));
};
HTMLCheckersGame.prototype._clickPiece = function(piece) {
	if (this._selectedPiece === piece) {
		this._deselectPiece();
	} else {
		this._selectPiece(piece);
	}
};
HTMLCheckersGame.prototype._selectPiece = function(piece) {
	this._deselectPiece();

	this._selectedPiece = piece;
	this._selectedPiece.select();

	this._highlightLegalMoves(this._selectedPiece);
};
HTMLCheckersGame.prototype._deselectPiece = function() {
	if (this._selectedPiece !== null) this._selectedPiece.deselect();
	this._selectedPiece = null;

	this._dehighlightLegalMoves();
};
HTMLCheckersGame.prototype._highlightLegalMoves = function(piece) {
	this._dehighlightLegalMoves();

	this._suggestedSpaces = this.getLegalMoves(piece).map(function(move) { return move.to; });
	this._suggestedSpaces.forEach(function(suggestedSpace) {
		this.board.highlightSpace(suggestedSpace);
	}, this);
};
HTMLCheckersGame.prototype._dehighlightLegalMoves = function() {
	this._suggestedSpaces.forEach(function(suggestedSpace) {
		this.board.unhighlightSpace(suggestedSpace);
	}, this);
};
HTMLCheckersGame.prototype._clickSpace = function(position) {
	if (this._selectedPiece === null) return false;
	if (!this._suggestedSpaces.contains(position)) return false;

	this.doMove(new CheckersMove(this._selectedPiece, position));
};
HTMLCheckersGame.prototype.doMove = function(move) {
	this.callSuper('doMove', arguments);

	if (this._multiJumpInProgress()) {
		this._highlightLegalMoves(this._multiJumpPiece);
	} else {
		this._deselectPiece();
	}
};
HTMLCheckersGame.prototype._toggleTurn = function() {
	this.callSuper('_toggleTurn', arguments);
	this._dehighlightLegalMoves();
};
HTMLCheckersGame.prototype._setTurn = function(player) {
	this.callSuper('_setTurn', arguments);

	if (this.turn == CheckersGame.PLAYERS.RED) {
		this._turnIndicator.text("It's red's turn!");
	} else if (this.turn == CheckersGame.PLAYERS.BLACK) {
		this._turnIndicator.text("It's black's turn!");
	}
};


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
HTMLCheckerBoard.prototype._getSpace = function(pos) {
	return this._boardSpaces[pos.x][pos.y];
};
// @Override
HTMLCheckerBoard.prototype.setPiece = function(pos, piece) {
	this.callSuper('setPiece', arguments);

	var space = this._getSpace(pos);
	space.empty();
	space.append(piece.htmlElement);
};
// @Override
HTMLCheckerBoard.prototype.clearPiece = function(piece) {
	var pos = piece.position;

	this.callSuper('clearPiece', arguments);
	this._getSpace(new Vector2(pos.x, pos.y)).empty();
};
HTMLCheckerBoard.prototype.movePiece = function(piece, pos) {
	this.callSuper('clearPiece', [piece]);

	var space = this._getSpace(pos);
	space.append(piece.htmlElement);

	this.callSuper('setPiece', [pos, piece]);
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

HTMLCheckerPiece.prototype.on = function() {
	this.htmlElement.on.apply(this.htmlElement, arguments);
};
HTMLCheckerPiece.prototype.off = function() {
	this.htmlElement.off.apply(this.htmlElement, arguments);
};
HTMLCheckerPiece.prototype.select = function() {
	this.htmlElement.addClass('selected');
};
HTMLCheckerPiece.prototype.deselect = function() {
	this.htmlElement.removeClass('selected');
};
HTMLCheckerPiece.prototype.promote = function() {
	this.callSuper('promote', arguments);

	if (this.rank == this.RANKS.KING) this.htmlElement.addClass("king-piece");
};


$(document).ready(function() {
	var game = new HTMLCheckersGame('.checkers-game');
});
