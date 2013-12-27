/*
* A subclass of CheckerPiece for use with an HTMLCheckerBoard.
*/
function HTMLCheckerPiece(owner, rank) {
	HTMLCheckerPiece.callSuper(this, arguments);

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
	HTMLCheckerPiece.callSuper(this, 'promote', arguments);

	if (this.rank == this.RANKS.KING) this.htmlElement.addClass("king-piece");
};
