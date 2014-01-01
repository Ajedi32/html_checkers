/*
* A subclass of CheckerPiece for use with an HTMLCheckerBoard.
*/
class HTMLCheckerPiece extends CheckerPiece {
	constructor(owner, rank) {
		super(...arguments);

		this.htmlElement = $(document.createElement('div'));
		this.htmlElement.addClass('piece');
		this.htmlElement.addClass((this.owner == CheckersGame.PLAYERS.RED ? 'red' : 'black') + '-piece');

		if (rank == CheckerPiece.RANKS.KING) this.htmlElement.addClass('king-piece');
	}

	on() {
		this.htmlElement.on.apply(this.htmlElement, arguments);
	}

	off() {
		this.htmlElement.off.apply(this.htmlElement, arguments);
	}

	select() {
		this.htmlElement.addClass('selected');
	}

	deselect() {
		this.htmlElement.removeClass('selected');
	}

	promote() {
		super.promote(...arguments);

		if (this.rank == CheckerPiece.RANKS.KING) this.htmlElement.addClass("king-piece");
	}
}
