/*
* A game of American Checkers.
*/
class CheckersGame {
	constructor(options) {
		options = (typeof options == 'undefined') ? {} : options;

		this.board = (options.board === undefined) ? new CheckerBoard() : options.board;
		this._pieceClass = (options.piece === undefined) ? HTMLCheckerPiece : options.piece;

		this.turn = null;
		this._setTurn(CheckersGame.PLAYERS.BLACK);

		this._multiJumpPiece = null;

		this._pieces = [];
		this._setUp();
	}

	_setUp() {
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
	}

	_getLegalTargets(piece) {
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
	}

	getLegalMoves(piece) {
		var legalMoves = this._getLegalTargets(piece).map(function(legalTarget) {
			return new CheckersMove(piece, legalTarget);
		});
		if (legalMoves.some(function(move){ return move.isJump(); })) {
			legalMoves = legalMoves.filter(function(move){ return move.isJump(); });
		}
		return legalMoves;
	}

	isLegalMove(move) {
		return this.getLegalMoves(move.piece).contains(move);
	}

	doMove(move) {
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
	}

	isPromotable(piece) {
		if (piece.rank == CheckerPiece.RANKS.KING) return false;

		if (piece.owner == CheckersGame.PLAYERS.RED) {
			return piece.position.y === 0;
		} else if (piece.owner == CheckersGame.PLAYERS.BLACK) {
			return piece.position.y === 7;
		}
	}

	_setTurn(player) {
		this.turn = player;
	}

	_toggleTurn() {
		if (this.turn == CheckersGame.PLAYERS.BLACK) {
			this._setTurn(CheckersGame.PLAYERS.RED);
		} else if (this.turn == CheckersGame.PLAYERS.RED) {
			this._setTurn(CheckersGame.PLAYERS.BLACK);
		}
	}

	_getJumpedPiece(validMove) {
		if (!validMove.isJump()) return null;

		var movementVector = validMove.to.subtract(validMove.piece.position);
		var direction = new Vector2(movementVector.x > 0 ? 1 : -1, movementVector.y > 0 ? 1 : -1);
		var jumpedPos = validMove.piece.position.add(direction);
		var jumpedPiece = this.board.getPiece(jumpedPos);

		return jumpedPiece;
	}

	canJump(piece) {
		return this.getLegalMoves(piece).some(function(move){ return move.isJump(); });
	}

	_multiJumpInProgress() {
		return this._multiJumpPiece !== null;
	}

	_removePiece(piece) {
		this.board.clearPiece(piece);
		this._pieces.splice(this._pieces.indexOf(piece), 1);
	}

	playerCanJump(player) {
		return this.getPiecesForPlayer(player).some(function(piece) {
			return this.canJump(piece);
		}, this);
	}

	currentPlayerCanJump() {
		return this.playerCanJump(this.turn);
	}

	getPiecesForPlayer(player) {
		return this._pieces.filter(function(piece) {
			return piece.owner === player;
		}, this);
	}

	getWinner() {
		if (this.getPiecesForPlayer(CheckersGame.PLAYERS.RED).length === 0) {
			return CheckersGame.PLAYERS.BLACK;
		} else if (this.getPiecesForPlayer(CheckersGame.PLAYERS.BLACK).length === 0) {
			return CheckersGame.PLAYERS.RED;
		}
		return null;
	}
}

CheckersGame.PLAYERS = {
	RED: 0,
	BLACK: 1
};
