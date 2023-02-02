function setTimeoutMultiple(...callTimeoutEntries: [Function, number][]) {
	callTimeoutEntries.forEach(([call, timeout]) => {
		setTimeout(() => {
			call();
		}, timeout);
	});
}

export function transitionHideToHiddenClasses(
	transitionClassToggle: Function,
	hiddenClassToggle: Function,
	hide: boolean,
	transitionDuration: number,
	CSSReactionTime=50,
) {
	setTimeoutMultiple(
		[transitionClassToggle, CSSReactionTime * +!hide],
		[hiddenClassToggle, transitionDuration * +hide]
	);
}
