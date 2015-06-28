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

Object.defineProperty(Array.prototype, 'contains', {
	value: function(object) {
		return this.some(function(i) {
			return (i === object) || (typeof i.equals == 'function' && i.equals(object));
		});
	}
});

var $__Object = Object, $__getOwnPropertyNames = $__Object.getOwnPropertyNames, $__getOwnPropertyDescriptor = $__Object.getOwnPropertyDescriptor, $__getDescriptors = function(object) {
  var descriptors = {}, name, names = $__getOwnPropertyNames(object);
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    descriptors[name] = $__getOwnPropertyDescriptor(object, name);
  }
  return descriptors;
}, $__createClassNoExtends = function(object, staticObject) {
  var ctor = object.constructor;
  Object.defineProperty(object, 'constructor', {enumerable: false});
  ctor.prototype = object;
  Object.defineProperties(ctor, $__getDescriptors(staticObject));
  return ctor;
};
var Vector2 = function() {
  'use strict';
  var $Vector2 = ($__createClassNoExtends)({
    constructor: function(x, y) {
      this.x = x;
      this.y = y;
    },
    add: function(other) {
      if (!(other instanceof Vector2)) throw new TypeError("Cannot add '" + other + "'' to '" + this + "'!");
      return new Vector2(this.x + other.x, this.y + other.y);
    },
    subtract: function(other) {
      if (!(other instanceof Vector2)) throw new TypeError("Cannot subtract '" + other + "'' from '" + this + "'!");
      return new Vector2(this.x - other.x, this.y - other.y);
    },
    equals: function(other) {
      return ((other instanceof Vector2) && (this.x == other.x) && (this.y == other.y));
    },
    toString: function() {
      return "Vector2(" + this.x + ", " + this.y + ")";
    }
  }, {});
  return $Vector2;
}();
if (typeof exports == "undefined") exports = {};
exports.Vector2 = Vector2;

var $__Object = Object, $__getOwnPropertyNames = $__Object.getOwnPropertyNames, $__getOwnPropertyDescriptor = $__Object.getOwnPropertyDescriptor, $__getDescriptors = function(object) {
  var descriptors = {}, name, names = $__getOwnPropertyNames(object);
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    descriptors[name] = $__getOwnPropertyDescriptor(object, name);
  }
  return descriptors;
}, $__createClassNoExtends = function(object, staticObject) {
  var ctor = object.constructor;
  Object.defineProperty(object, 'constructor', {enumerable: false});
  ctor.prototype = object;
  Object.defineProperties(ctor, $__getDescriptors(staticObject));
  return ctor;
};
var CheckerBoard = function() {
  'use strict';
  var $CheckerBoard = ($__createClassNoExtends)({
    constructor: function() {
      this._board = new Array(8);
      this._initialize();
    },
    _initialize: function() {
      this._board = new Array(8);
      for (var i = 0; i < 8; ++i) {
        this._board[i] = new Array(8);
      }
    },
    isBlackSpace: function(pos) {
      var isWhite = ((pos.x + pos.y) % 2) === 0;
      return !isWhite;
    },
    isValidSpace: function(pos) {
      if (pos === null || pos === undefined) return false;
      return (pos.x >= 0 && pos.x < 8) && (pos.y >= 0 && pos.y < 8);
    },
    isEmptySpace: function(pos) {
      return this.getPiece(pos) === null;
    },
    getPiece: function(pos) {
      if (!this.isValidSpace(pos)) return undefined;
      var piece = this._board[pos.x][pos.y];
      return (typeof piece == 'undefined') ? null: piece;
    },
    setPiece: function(pos, piece) {
      if (piece.position !== null) throw "Piece " + piece + " cannot be on more than one tile at once.";
      piece.position = pos;
      this._board[pos.x][pos.y] = piece;
    },
    clearPiece: function(piece) {
      if (piece.position === null) throw "Piece " + piece + " cannot be cleared because it is not on the board.";
      var pos = piece.position;
      piece.position = null;
      this._board[pos.x][pos.y] = null;
    },
    movePiece: function(piece, pos) {
      this.clearPiece(piece);
      this.setPiece(pos, piece);
    }
  }, {});
  return $CheckerBoard;
}();

var $__Object = Object, $__getOwnPropertyNames = $__Object.getOwnPropertyNames, $__getOwnPropertyDescriptor = $__Object.getOwnPropertyDescriptor, $__getDescriptors = function(object) {
  var descriptors = {}, name, names = $__getOwnPropertyNames(object);
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    descriptors[name] = $__getOwnPropertyDescriptor(object, name);
  }
  return descriptors;
}, $__createClassNoExtends = function(object, staticObject) {
  var ctor = object.constructor;
  Object.defineProperty(object, 'constructor', {enumerable: false});
  ctor.prototype = object;
  Object.defineProperties(ctor, $__getDescriptors(staticObject));
  return ctor;
};
var CheckerPiece = function() {
  'use strict';
  var $CheckerPiece = ($__createClassNoExtends)({
    constructor: function(owner, rank) {
      rank = typeof rank !== 'undefined' ? rank: CheckerPiece.RANKS.MAN;
      this.owner = owner;
      this.rank = rank;
      this.position = null;
    },
    getMovementVectors: function() {
      var movementVectors = [];
      if (this.owner == CheckersGame.PLAYERS.RED || this.rank == CheckerPiece.RANKS.KING) movementVectors.push(new Vector2(- 1, - 1), new Vector2(1, - 1));
      if (this.owner == CheckersGame.PLAYERS.BLACK || this.rank == CheckerPiece.RANKS.KING) movementVectors.push(new Vector2(- 1, 1), new Vector2(1, 1));
      return movementVectors;
    },
    promote: function() {
      if (this.rank >= 1) throw new RangeError("This piece may not be promoted further. (" + this + ")");
      this.rank += 1;
    },
    toString: function() {
      return this.constructor.name + "{ owner: " + this.owner + ", rank: " + this.rank + ", position: " + this.position + " }";
    },
    equals: function(other) {
      return ((other instanceof CheckerPiece) && (this.owner == other.owner) && (this.rank == other.rank) && equal(this.position, other.position));
    }
  }, {});
  return $CheckerPiece;
}();
CheckerPiece.RANKS = {
  MAN: 0,
  KING: 1
};

var $__Object = Object, $__getOwnPropertyNames = $__Object.getOwnPropertyNames, $__getOwnPropertyDescriptor = $__Object.getOwnPropertyDescriptor, $__getDescriptors = function(object) {
  var descriptors = {}, name, names = $__getOwnPropertyNames(object);
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    descriptors[name] = $__getOwnPropertyDescriptor(object, name);
  }
  return descriptors;
}, $__createClassNoExtends = function(object, staticObject) {
  var ctor = object.constructor;
  Object.defineProperty(object, 'constructor', {enumerable: false});
  ctor.prototype = object;
  Object.defineProperties(ctor, $__getDescriptors(staticObject));
  return ctor;
};
var CheckersGame = function() {
  'use strict';
  var $CheckersGame = ($__createClassNoExtends)({
    constructor: function(options) {
      options = (typeof options == 'undefined') ? {}: options;
      this.board = (options.board === undefined) ? new CheckerBoard(): options.board;
      this._pieceClass = (options.piece === undefined) ? HTMLCheckerPiece: options.piece;
      this.turn = null;
      this._setTurn(CheckersGame.PLAYERS.BLACK);
      this._multiJumpPiece = null;
      this._pieces = [];
      this._setUp();
    },
    _setUp: function() {
      var column;
      var row;
      var piece;
      for (column = 0; column < 8; ++column) {
        for (row = 0; row < 3; ++row) {
          if (this.board.isBlackSpace(new Vector2(column, row))) {
            piece = new this._pieceClass(CheckersGame.PLAYERS.BLACK);
            this._pieces.push(piece);
            this.board.setPiece(new Vector2(column, row), piece);
          }
        }
      }
      for (column = 0; column < 8; ++column) {
        for (row = 5; row < 8; ++row) {
          if (this.board.isBlackSpace(new Vector2(column, row))) {
            piece = new this._pieceClass(CheckersGame.PLAYERS.RED);
            this._pieces.push(piece);
            this.board.setPiece(new Vector2(column, row), piece);
          }
        }
      }
    },
    _getLegalTargets: function(piece) {
      if (piece === null) return [];
      var legalTargets = [];
      piece.getMovementVectors().forEach(function(movementVector) {
        var potentialTarget = piece.position.add(movementVector);
        if (this.board.isValidSpace(potentialTarget)) {
          if (this.board.isEmptySpace(potentialTarget)) {
            legalTargets.push(potentialTarget);
          } else if (piece.owner != this.board.getPiece(potentialTarget).owner) {
            potentialTarget = potentialTarget.add(movementVector);
            if (this.board.isValidSpace(potentialTarget) && this.board.isEmptySpace(potentialTarget)) legalTargets.push(potentialTarget);
          }
        }
      }, this);
      return legalTargets;
    },
    getLegalMoves: function(piece) {
      var legalMoves = this._getLegalTargets(piece).map(function(legalTarget) {
        return new CheckersMove(piece, legalTarget);
      });
      if (legalMoves.some(function(move) {
        return move.isJump();
      })) {
        legalMoves = legalMoves.filter(function(move) {
          return move.isJump();
        });
      }
      return legalMoves;
    },
    isLegalMove: function(move) {
      return this.getLegalMoves(move.piece).contains(move);
    },
    doMove: function(move) {
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
      if (isJump && this.canJump(move.piece)) {
        this._multiJumpPiece = move.piece;
      } else {
        this._multiJumpPiece = null;
        this._toggleTurn();
      }
      if (this.isPromotable(move.piece)) move.piece.promote();
    },
    isPromotable: function(piece) {
      if (piece.rank == CheckerPiece.RANKS.KING) return false;
      if (piece.owner == CheckersGame.PLAYERS.RED) {
        return piece.position.y === 0;
      } else if (piece.owner == CheckersGame.PLAYERS.BLACK) {
        return piece.position.y === 7;
      }
    },
    _setTurn: function(player) {
      this.turn = player;
    },
    _toggleTurn: function() {
      if (this.turn == CheckersGame.PLAYERS.BLACK) {
        this._setTurn(CheckersGame.PLAYERS.RED);
      } else if (this.turn == CheckersGame.PLAYERS.RED) {
        this._setTurn(CheckersGame.PLAYERS.BLACK);
      }
    },
    _getJumpedPiece: function(validMove) {
      if (!validMove.isJump()) return null;
      var movementVector = validMove.to.subtract(validMove.piece.position);
      var direction = new Vector2(movementVector.x > 0 ? 1: - 1, movementVector.y > 0 ? 1: - 1);
      var jumpedPos = validMove.piece.position.add(direction);
      var jumpedPiece = this.board.getPiece(jumpedPos);
      return jumpedPiece;
    },
    canJump: function(piece) {
      return this.getLegalMoves(piece).some(function(move) {
        return move.isJump();
      });
    },
    _multiJumpInProgress: function() {
      return this._multiJumpPiece !== null;
    },
    _removePiece: function(piece) {
      this.board.clearPiece(piece);
      this._pieces.splice(this._pieces.indexOf(piece), 1);
    },
    playerCanJump: function(player) {
      return this.getPiecesForPlayer(player).some(function(piece) {
        return this.canJump(piece);
      }, this);
    },
    currentPlayerCanJump: function() {
      return this.playerCanJump(this.turn);
    },
    getPiecesForPlayer: function(player) {
      return this._pieces.filter(function(piece) {
        return piece.owner === player;
      }, this);
    },
    getWinner: function() {
      if (this.getPiecesForPlayer(CheckersGame.PLAYERS.RED).length === 0) {
        return CheckersGame.PLAYERS.BLACK;
      } else if (this.getPiecesForPlayer(CheckersGame.PLAYERS.BLACK).length === 0) {
        return CheckersGame.PLAYERS.RED;
      }
      return null;
    }
  }, {});
  return $CheckersGame;
}();
CheckersGame.PLAYERS = {
  RED: 0,
  BLACK: 1
};

var $__TypeError = TypeError, $__Object = Object, $__getOwnPropertyDescriptor = $__Object.getOwnPropertyDescriptor, $__getPrototypeOf = $__Object.getPrototypeOf, $__getPropertyDescriptor = function(object, name) {
  while (object !== null) {
    var result = $__getOwnPropertyDescriptor(object, name);
    if (result) return result;
    object = $__getPrototypeOf(object);
  }
  return undefined;
}, $__superDescriptor = function(proto, name) {
  if (!proto) throw new $__TypeError('super is null');
  return $__getPropertyDescriptor(proto, name);
}, $__superCall = function(self, proto, name, args) {
  var descriptor = $__superDescriptor(proto, name);
  if (descriptor) {
    if ('value'in descriptor) return descriptor.value.apply(self, args);
    if (descriptor.get) return descriptor.get.call(self).apply(self, args);
  }
  throw new $__TypeError("Object has no method '" + name + "'.");
}, $__getProtoParent = function(superClass) {
  if (typeof superClass === 'function') {
    var prototype = superClass.prototype;
    if (Object(prototype) === prototype || prototype === null) return superClass.prototype;
  }
  if (superClass === null) return null;
  throw new TypeError();
}, $__getOwnPropertyNames = $__Object.getOwnPropertyNames, $__getDescriptors = function(object) {
  var descriptors = {}, name, names = $__getOwnPropertyNames(object);
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    descriptors[name] = $__getOwnPropertyDescriptor(object, name);
  }
  return descriptors;
}, $__createClass = function(object, staticObject, protoParent, superClass, hasConstructor) {
  var ctor = object.constructor;
  if (typeof superClass === 'function') ctor.__proto__ = superClass;
  if (!hasConstructor && protoParent === null) ctor = object.constructor = function() {};
  var descriptors = $__getDescriptors(object);
  descriptors.constructor.enumerable = false;
  ctor.prototype = Object.create(protoParent, descriptors);
  Object.defineProperties(ctor, $__getDescriptors(staticObject));
  return ctor;
}, $__toObject = function(value) {
  if (value == null) throw $__TypeError();
  return $__Object(value);
}, $__spread = function() {
  var rv = [], k = 0;
  for (var i = 0; i < arguments.length; i++) {
    var value = $__toObject(arguments[i]);
    for (var j = 0; j < value.length; j++) {
      rv[k++] = value[j];
    }
  }
  return rv;
};
var CheckersGameError = function($__super) {
  'use strict';
  var $__proto = $__getProtoParent($__super);
  var $CheckersGameError = ($__createClass)({constructor: function() {
      $__superCall(this, $__proto, "constructor", $__spread(arguments));
      this.name = this.constructor.name;
      this.message = message;
    }}, {}, $__proto, $__super, true);
  return $CheckersGameError;
}(Error);

var $__Object = Object, $__getOwnPropertyNames = $__Object.getOwnPropertyNames, $__getOwnPropertyDescriptor = $__Object.getOwnPropertyDescriptor, $__getDescriptors = function(object) {
  var descriptors = {}, name, names = $__getOwnPropertyNames(object);
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    descriptors[name] = $__getOwnPropertyDescriptor(object, name);
  }
  return descriptors;
}, $__createClassNoExtends = function(object, staticObject) {
  var ctor = object.constructor;
  Object.defineProperty(object, 'constructor', {enumerable: false});
  ctor.prototype = object;
  Object.defineProperties(ctor, $__getDescriptors(staticObject));
  return ctor;
};
var CheckersMove = function() {
  'use strict';
  var $CheckersMove = ($__createClassNoExtends)({
    constructor: function(piece, target) {
      this.piece = piece;
      this.to = target;
    },
    isJump: function() {
      var movementVector = this.to.subtract(this.piece.position);
      return Math.abs(movementVector.x) > 1 || Math.abs(movementVector.y) > 1;
    },
    equals: function(other) {
      return ((other instanceof CheckersMove) && (this.piece.equals(other.piece)) && this.to.equals(other.to));
    },
    toString: function() {
      return this.constructor.name + "{ piece: " + this.piece + ", to: " + this.to + " }";
    }
  }, {});
  return $CheckersMove;
}();

var $__TypeError = TypeError, $__Object = Object, $__getOwnPropertyDescriptor = $__Object.getOwnPropertyDescriptor, $__getPrototypeOf = $__Object.getPrototypeOf, $__getPropertyDescriptor = function(object, name) {
  while (object !== null) {
    var result = $__getOwnPropertyDescriptor(object, name);
    if (result) return result;
    object = $__getPrototypeOf(object);
  }
  return undefined;
}, $__superDescriptor = function(proto, name) {
  if (!proto) throw new $__TypeError('super is null');
  return $__getPropertyDescriptor(proto, name);
}, $__superCall = function(self, proto, name, args) {
  var descriptor = $__superDescriptor(proto, name);
  if (descriptor) {
    if ('value'in descriptor) return descriptor.value.apply(self, args);
    if (descriptor.get) return descriptor.get.call(self).apply(self, args);
  }
  throw new $__TypeError("Object has no method '" + name + "'.");
}, $__getProtoParent = function(superClass) {
  if (typeof superClass === 'function') {
    var prototype = superClass.prototype;
    if (Object(prototype) === prototype || prototype === null) return superClass.prototype;
  }
  if (superClass === null) return null;
  throw new TypeError();
}, $__getOwnPropertyNames = $__Object.getOwnPropertyNames, $__getDescriptors = function(object) {
  var descriptors = {}, name, names = $__getOwnPropertyNames(object);
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    descriptors[name] = $__getOwnPropertyDescriptor(object, name);
  }
  return descriptors;
}, $__createClass = function(object, staticObject, protoParent, superClass, hasConstructor) {
  var ctor = object.constructor;
  if (typeof superClass === 'function') ctor.__proto__ = superClass;
  if (!hasConstructor && protoParent === null) ctor = object.constructor = function() {};
  var descriptors = $__getDescriptors(object);
  descriptors.constructor.enumerable = false;
  ctor.prototype = Object.create(protoParent, descriptors);
  Object.defineProperties(ctor, $__getDescriptors(staticObject));
  return ctor;
}, $__toObject = function(value) {
  if (value == null) throw $__TypeError();
  return $__Object(value);
}, $__spread = function() {
  var rv = [], k = 0;
  for (var i = 0; i < arguments.length; i++) {
    var value = $__toObject(arguments[i]);
    for (var j = 0; j < value.length; j++) {
      rv[k++] = value[j];
    }
  }
  return rv;
};
var HTMLCheckerBoard = function($__super) {
  'use strict';
  var $__proto = $__getProtoParent($__super);
  var $HTMLCheckerBoard = ($__createClass)({
    constructor: function(htmlElement) {
      $__superCall(this, $__proto, "constructor", []);
      this._htmlBoard = $(htmlElement).first();
      this._boardSpaces = new Array(8);
      this._parseSpaces();
    },
    _parseSpaces: function() {
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
    },
    _initializeSpaces: function() {
      this._boardSpaces = new Array(8);
      for (var i = 0; i < 8; ++i) {
        this._boardSpaces[i] = new Array(8);
      }
    },
    _getSpace: function(pos) {
      return this._boardSpaces[pos.x][pos.y];
    },
    setPiece: function(pos, piece) {
      $__superCall(this, $__proto, "setPiece", $__spread(arguments));
      var space = this._getSpace(pos);
      space.empty();
      space.append(piece.htmlElement);
    },
    clearPiece: function(piece) {
      var pos = piece.position;
      $__superCall(this, $__proto, "clearPiece", $__spread(arguments));
      this._getSpace(new Vector2(pos.x, pos.y)).empty();
    },
    movePiece: function(piece, pos) {
      $__superCall(this, $__proto, "clearPiece", [piece]);
      var space = this._getSpace(pos);
      space.append(piece.htmlElement);
      $__superCall(this, $__proto, "setPiece", [pos, piece]);
    },
    onClickSpace: function(func) {
      var columnNum;
      var rowNum;
      for (columnNum = 0; columnNum < 8; ++columnNum) {
        for (rowNum = 0; rowNum < 8; ++rowNum) {
          var pos = new Vector2(columnNum, rowNum);
          this._getSpace(pos).on('click', func.withArgs(pos));
        }
      }
    },
    highlightSpace: function(pos) {
      this._getSpace(pos).addClass('selected');
    },
    unhighlightSpace: function(pos) {
      this._getSpace(pos).removeClass('selected');
    }
  }, {}, $__proto, $__super, true);
  return $HTMLCheckerBoard;
}(CheckerBoard);

var $__TypeError = TypeError, $__Object = Object, $__getOwnPropertyDescriptor = $__Object.getOwnPropertyDescriptor, $__getPrototypeOf = $__Object.getPrototypeOf, $__getPropertyDescriptor = function(object, name) {
  while (object !== null) {
    var result = $__getOwnPropertyDescriptor(object, name);
    if (result) return result;
    object = $__getPrototypeOf(object);
  }
  return undefined;
}, $__superDescriptor = function(proto, name) {
  if (!proto) throw new $__TypeError('super is null');
  return $__getPropertyDescriptor(proto, name);
}, $__superCall = function(self, proto, name, args) {
  var descriptor = $__superDescriptor(proto, name);
  if (descriptor) {
    if ('value'in descriptor) return descriptor.value.apply(self, args);
    if (descriptor.get) return descriptor.get.call(self).apply(self, args);
  }
  throw new $__TypeError("Object has no method '" + name + "'.");
}, $__getProtoParent = function(superClass) {
  if (typeof superClass === 'function') {
    var prototype = superClass.prototype;
    if (Object(prototype) === prototype || prototype === null) return superClass.prototype;
  }
  if (superClass === null) return null;
  throw new TypeError();
}, $__getOwnPropertyNames = $__Object.getOwnPropertyNames, $__getDescriptors = function(object) {
  var descriptors = {}, name, names = $__getOwnPropertyNames(object);
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    descriptors[name] = $__getOwnPropertyDescriptor(object, name);
  }
  return descriptors;
}, $__createClass = function(object, staticObject, protoParent, superClass, hasConstructor) {
  var ctor = object.constructor;
  if (typeof superClass === 'function') ctor.__proto__ = superClass;
  if (!hasConstructor && protoParent === null) ctor = object.constructor = function() {};
  var descriptors = $__getDescriptors(object);
  descriptors.constructor.enumerable = false;
  ctor.prototype = Object.create(protoParent, descriptors);
  Object.defineProperties(ctor, $__getDescriptors(staticObject));
  return ctor;
}, $__toObject = function(value) {
  if (value == null) throw $__TypeError();
  return $__Object(value);
}, $__spread = function() {
  var rv = [], k = 0;
  for (var i = 0; i < arguments.length; i++) {
    var value = $__toObject(arguments[i]);
    for (var j = 0; j < value.length; j++) {
      rv[k++] = value[j];
    }
  }
  return rv;
};
var HTMLCheckerPiece = function($__super) {
  'use strict';
  var $__proto = $__getProtoParent($__super);
  var $HTMLCheckerPiece = ($__createClass)({
    constructor: function(owner, rank) {
      $__superCall(this, $__proto, "constructor", $__spread(arguments));
      this.htmlElement = $(document.createElement('div'));
      this.htmlElement.addClass('piece');
      this.htmlElement.addClass((this.owner == CheckersGame.PLAYERS.RED ? 'red': 'black') + '-piece');
      if (rank == CheckerPiece.RANKS.KING) this.htmlElement.addClass('king-piece');
    },
    on: function() {
      this.htmlElement.on.apply(this.htmlElement, arguments);
    },
    off: function() {
      this.htmlElement.off.apply(this.htmlElement, arguments);
    },
    select: function() {
      this.htmlElement.addClass('selected');
    },
    deselect: function() {
      this.htmlElement.removeClass('selected');
    },
    promote: function() {
      $__superCall(this, $__proto, "promote", $__spread(arguments));
      if (this.rank == CheckerPiece.RANKS.KING) this.htmlElement.addClass("king-piece");
    }
  }, {}, $__proto, $__super, true);
  return $HTMLCheckerPiece;
}(CheckerPiece);

var $__TypeError = TypeError, $__Object = Object, $__getOwnPropertyDescriptor = $__Object.getOwnPropertyDescriptor, $__getPrototypeOf = $__Object.getPrototypeOf, $__getPropertyDescriptor = function(object, name) {
  while (object !== null) {
    var result = $__getOwnPropertyDescriptor(object, name);
    if (result) return result;
    object = $__getPrototypeOf(object);
  }
  return undefined;
}, $__superDescriptor = function(proto, name) {
  if (!proto) throw new $__TypeError('super is null');
  return $__getPropertyDescriptor(proto, name);
}, $__superCall = function(self, proto, name, args) {
  var descriptor = $__superDescriptor(proto, name);
  if (descriptor) {
    if ('value'in descriptor) return descriptor.value.apply(self, args);
    if (descriptor.get) return descriptor.get.call(self).apply(self, args);
  }
  throw new $__TypeError("Object has no method '" + name + "'.");
}, $__getProtoParent = function(superClass) {
  if (typeof superClass === 'function') {
    var prototype = superClass.prototype;
    if (Object(prototype) === prototype || prototype === null) return superClass.prototype;
  }
  if (superClass === null) return null;
  throw new TypeError();
}, $__getOwnPropertyNames = $__Object.getOwnPropertyNames, $__getDescriptors = function(object) {
  var descriptors = {}, name, names = $__getOwnPropertyNames(object);
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    descriptors[name] = $__getOwnPropertyDescriptor(object, name);
  }
  return descriptors;
}, $__createClass = function(object, staticObject, protoParent, superClass, hasConstructor) {
  var ctor = object.constructor;
  if (typeof superClass === 'function') ctor.__proto__ = superClass;
  if (!hasConstructor && protoParent === null) ctor = object.constructor = function() {};
  var descriptors = $__getDescriptors(object);
  descriptors.constructor.enumerable = false;
  ctor.prototype = Object.create(protoParent, descriptors);
  Object.defineProperties(ctor, $__getDescriptors(staticObject));
  return ctor;
}, $__toObject = function(value) {
  if (value == null) throw $__TypeError();
  return $__Object(value);
}, $__spread = function() {
  var rv = [], k = 0;
  for (var i = 0; i < arguments.length; i++) {
    var value = $__toObject(arguments[i]);
    for (var j = 0; j < value.length; j++) {
      rv[k++] = value[j];
    }
  }
  return rv;
};
var HTMLCheckersGame = function($__super) {
  'use strict';
  var $__proto = $__getProtoParent($__super);
  var $HTMLCheckersGame = ($__createClass)({
    constructor: function(htmlElement) {
      this._htmlGame = $(htmlElement).first();
      this._turnIndicator = this._htmlGame.find('.checkers-turn');
      $__superCall(this, $__proto, "constructor", [{
        board: new HTMLCheckerBoard(this._htmlGame.find('.checkers-board')),
        piece: HTMLCheckerPiece
      }]);
      this._selectedPiece = null;
      this._suggestedSpaces = [];
      this._bindEventHandlers();
    },
    _bindEventHandlers: function() {
      this._pieces.forEach(function(piece) {
        piece.on('click', this._clickPiece.bind(this, piece));
      }, this);
      this.board.onClickSpace(this._clickSpace.bind(this));
    },
    _clickPiece: function(piece) {
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
    },
    _selectPiece: function(piece) {
      this._deselectPiece();
      this._selectedPiece = piece;
      this._selectedPiece.select();
      this._highlightLegalMoves(this._selectedPiece);
    },
    _deselectPiece: function() {
      if (this._selectedPiece !== null) this._selectedPiece.deselect();
      this._selectedPiece = null;
      this._dehighlightLegalMoves();
    },
    _highlightLegalMoves: function(piece) {
      this._dehighlightLegalMoves();
      this._suggestedSpaces = this.getLegalMoves(piece).map(function(move) {
        return move.to;
      });
      this._suggestedSpaces.forEach(function(suggestedSpace) {
        this.board.highlightSpace(suggestedSpace);
      }, this);
    },
    _dehighlightLegalMoves: function() {
      this._suggestedSpaces.forEach(function(suggestedSpace) {
        this.board.unhighlightSpace(suggestedSpace);
      }, this);
    },
    _clickSpace: function(position) {
      if (this._selectedPiece === null) return false;
      if (!this._suggestedSpaces.contains(position)) return false;
      this.doMove(new CheckersMove(this._selectedPiece, position));
    },
    doMove: function(move) {
      $__superCall(this, $__proto, "doMove", $__spread(arguments));
      if (this._multiJumpInProgress()) {
        this._highlightLegalMoves(this._multiJumpPiece);
      } else {
        this._deselectPiece();
      }
      var winner = this.getWinner();
      if (winner !== null) this._declareWinner(winner);
    },
    _toggleTurn: function() {
      $__superCall(this, $__proto, "_toggleTurn", $__spread(arguments));
      this._dehighlightLegalMoves();
    },
    _setTurn: function(player) {
      $__superCall(this, $__proto, "_setTurn", $__spread(arguments));
      if (this.turn == CheckersGame.PLAYERS.RED) {
        this._turnIndicator.text("It's red's turn!");
      } else if (this.turn == CheckersGame.PLAYERS.BLACK) {
        this._turnIndicator.text("It's black's turn!");
      }
    },
    _declareWinner: function(winner) {
      window.alert("Player " + winner + " has won!");
      this._htmlGame.find('form').removeClass('hidden');
      $("#winner").val(winner);
      $("#remainingPieces").val(this._pieces.length);
      $("#submit").prop("disabled", false);
    }
  }, {}, $__proto, $__super, true);
  return $HTMLCheckersGame;
}(CheckersGame);

$(document).ready(function() {
	var game = new HTMLCheckersGame('.checkers-game');
});
