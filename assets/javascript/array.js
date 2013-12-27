Object.defineProperty(Array.prototype, 'contains', {
	value: function(object) {
		return this.some(function(i) {
			return (i === object) || (typeof i.equals == 'function' && i.equals(object));
		});
	}
});
