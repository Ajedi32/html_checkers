var should = require("should");

var Vector2 = require("../assets/javascript/vector2.js").Vector2;

describe('Vector2', function(){
	var vector;

	beforeEach(function() {
		vector = new Vector2(3, -5);
	});

	describe('.x', function(){
		it("should have the value set in the constructor", function (){
			vector.x.should.equal(3);
		});
	});

	describe('.y', function(){
		it("should have the value set in the constructor", function (){
			vector.y.should.equal(-5);
		});
	});

	describe('#equals()', function(){
		it("should be defined", function (){
			vector.equals.should.be.ok;
		});
		it("should return true when its components are equal to the other vector's components", function(){
			vector.equals(new Vector2(3, -5)).should.be.true;
		});
		it("should return false when the x component of the other vector differs", function(){
			vector.equals(new Vector2(0, -5)).should.be.false;
		});
		it("should return false when the x component of the other vector differs", function(){
			vector.equals(new Vector2(3, 0)).should.be.false;
		});
		it("should return false when called with an object that is not a vector2", function(){
			vector.equals({}).should.be.false;
		});
		it("should return false when called with null", function(){
			vector.equals(null).should.be.false;
		});
	});

	describe('#add(other)', function() {
		var other;

		it("should be defined", function (){
			vector.add.should.be.ok;
		});

		describe('when given an object that is not a vector2', function() {
			beforeEach(function() {
				other = {};
			});

			it("should throw a TypeError", function(){
				(function() {
					vector.add(other);
				}).should.throw(TypeError);
			});
		});

		describe('when given null', function() {
			beforeEach(function() {
				other = null;
			});

			it("should throw a TypeError", function(){
				(function() {
					vector.add(other);
				}).should.throw(TypeError);
			});
		});


		describe('when given undefined', function() {
			beforeEach(function() {
				other = undefined;
			});

			it("should throw a TypeError", function(){
				(function() {
					vector.add(other);
				}).should.throw(TypeError);
			});
		});

		describe('when given a valid vector', function() {
			beforeEach(function() {
				other = new Vector2(1, 7);
			});

			it("should return a vector with an x component equaling the sum of this and the other vector's x components", function(){
				vector.add(other).x.should.equal(4);
			});
			it("should return a vector with a y component equaling the sum of this and the other vector's y components", function(){
				vector.add(other).y.should.equal(2);
			});
			it("should not modify its own x component", function() {
				vector.add(other);
				vector.x.should.equal(3);
			});
			it("should not modify its own y component", function() {
				vector.add(other);
				vector.y.should.equal(-5);
			});
			it("should not modify the other vector's x component", function() {
				vector.add(other);
				other.x.should.equal(1);
			});
			it("should not modify the other vector's y component", function() {
				vector.add(other);
				other.y.should.equal(7);
			});
		});
	});

	describe('#subtract(other)', function() {
		var other;

		it("should be defined", function (){
			vector.subtract.should.be.ok;
		});

		describe('when given an object that is not a vector2', function() {
			beforeEach(function() {
				other = {};
			});

			it("should throw a TypeError", function(){
				(function() {
					vector.subtract(other);
				}).should.throw(TypeError);
			});
		});

		describe('when given null', function() {
			beforeEach(function() {
				other = null;
			});

			it("should throw a TypeError", function(){
				(function() {
					vector.subtract(other);
				}).should.throw(TypeError);
			});
		});


		describe('when given undefined', function() {
			beforeEach(function() {
				other = undefined;
			});

			it("should throw a TypeError", function(){
				(function() {
					vector.subtract(other);
				}).should.throw(TypeError);
			});
		});

		describe('when given a valid vector', function() {
			beforeEach(function() {
				other = new Vector2(1, 7);
			});

			it("should return a vector with an x component equaling the difference of this and the other vector's x components", function(){
				vector.subtract(other).x.should.equal(2);
			});
			it("should return a vector with a y component equaling the difference of this and the other vector's y components", function(){
				vector.subtract(other).y.should.equal(-12);
			});
			it("should not modify its own x component", function() {
				vector.subtract(other);
				vector.x.should.equal(3);
			});
			it("should not modify its own y component", function() {
				vector.subtract(other);
				vector.y.should.equal(-5);
			});
			it("should not modify the other vector's x component", function() {
				vector.subtract(other);
				other.x.should.equal(1);
			});
			it("should not modify the other vector's y component", function() {
				vector.subtract(other);
				other.y.should.equal(7);
			});
		});
	});

	describe('#toString()', function() {
		it("should include the name 'Vector2'", function() {
			vector.toString().should.match(/Vector2/);
		});
		it("should include the vector's x component", function() {
			vector.toString().should.match(/3/);
		});
		it("should include the vector's y component", function() {
			vector.toString().should.match(/-5/);
		});
	});
});
