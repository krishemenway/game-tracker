if (((Array.prototype as any).distinct) === undefined) {
	(Array.prototype as any).distinct = function<T>(this: T[]): T[] {
		return this.filter((value, index) => this.indexOf(value) === index);
	}
}
