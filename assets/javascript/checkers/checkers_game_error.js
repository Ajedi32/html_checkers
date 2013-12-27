/*
* This error is thrown to indicate an action was attempted that violates the
* rules of checkers.
*/
function CheckersGameError(message) {
	CheckersGameError.callSuper(this, arguments);
	this.name = this.constructor.name;
	this.message = message;
}
CheckersGameError.setSuperclass(Error);
