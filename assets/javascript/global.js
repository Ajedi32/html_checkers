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
