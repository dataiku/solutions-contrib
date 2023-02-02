export function setTimeoutMultiple(...callTimeoutEntries: [Function, number][]) {
	callTimeoutEntries.forEach(([call, timeout]) => {
		setTimeout(() => {
			call();
		}, timeout);
	});
}
