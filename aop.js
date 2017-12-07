Function.prototype.before = function(beforeFn) {
	var _self = this;
	return function() {
		beforeFn.apply(this, arguments);
		return _self.apply(this, arguments);
	}
}
Function.prototype.after = function(afterFn) {
	var _self = this;
	return function() {
		var next = _self.apply(this, arguments);
		afterFn.apply(this, arguments);
		return next;
	}
}