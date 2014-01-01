/*
* A subclass of CheckersGame which mirrors changes made in the game to html
*/
class HTMLCheckersGame extends CheckersGame {
	constructor(htmlElement) {
		this._htmlGame = $(htmlElement).first();
		this._turnIndicator = this._htmlGame.find('.checkers-turn');

		super({
			board: new HTMLCheckerBoard(this._htmlGame.find('.checkers-board')),
			piece: HTMLCheckerPiece
		});


		this._selectedPiece = null;
		this._suggestedSpaces = [];

		this._bindEventHandlers();
	}

	_bindEventHandlers() {
		this._pieces.forEach(function(piece) {
			piece.on('click', this._clickPiece.bind(this, piece));
		}, this);

		this.board.onClickSpace(this._clickSpace.bind(this));
	}

	_clickPiece(piece) {
		if (this._multiJumpInProgress()) {
			window.alert("Please continue your jump.");
			return false;
		}
		if (this.currentPlayerCanJump() && !this.canJump(piece)) {
			window.alert("You must jump the other player.");
			return false;
		}
		if (this._selectedPiece === piece) {
			this._deselectPiece();
		} else {
			if (piece.owner != this.turn) {
				window.alert("It's not your turn.");
				return false;
			}
			this._selectPiece(piece);
		}
	}

	_selectPiece(piece) {
		this._deselectPiece();

		this._selectedPiece = piece;
		this._selectedPiece.select();

		this._highlightLegalMoves(this._selectedPiece);
	}

	_deselectPiece() {
		if (this._selectedPiece !== null) this._selectedPiece.deselect();
		this._selectedPiece = null;

		this._dehighlightLegalMoves();
	}

	_highlightLegalMoves(piece) {
		this._dehighlightLegalMoves();

		this._suggestedSpaces = this.getLegalMoves(piece).map(function(move) { return move.to; });
		this._suggestedSpaces.forEach(function(suggestedSpace) {
			this.board.highlightSpace(suggestedSpace);
		}, this);
	}

	_dehighlightLegalMoves() {
		this._suggestedSpaces.forEach(function(suggestedSpace) {
			this.board.unhighlightSpace(suggestedSpace);
		}, this);
	}

	_clickSpace(position) {
		if (this._selectedPiece === null) return false;
		if (!this._suggestedSpaces.contains(position)) return false;

		this.doMove(new CheckersMove(this._selectedPiece, position));
	}

	doMove(move) {
		super.doMove(...arguments);

		if (this._multiJumpInProgress()) {
			this._highlightLegalMoves(this._multiJumpPiece);
		} else {
			this._deselectPiece();
		}

		var winner = this.getWinner();
		if (winner !== null) this._declareWinner(winner);
	}

	_toggleTurn() {
		super._toggleTurn(...arguments);

		this._dehighlightLegalMoves();
	}

	_setTurn(player) {
		super._setTurn(...arguments);

		if (this.turn == CheckersGame.PLAYERS.RED) {
			this._turnIndicator.text("It's red's turn!");
		} else if (this.turn == CheckersGame.PLAYERS.BLACK) {
			this._turnIndicator.text("It's black's turn!");
		}
	}

	_declareWinner(winner) {
		window.alert("Player " + winner + " has won!");
		this._htmlGame.find('form').removeClass('hidden');

		$("#winner").val(winner);
		$("#remainingPieces").val(this._pieces.length);
		$("#submit").prop("disabled", false);
	}
}
