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

export const getBsMenuTabId = (tabId: string) => `bs-menu-tab-${tabId}`;
export const getBsContentId = (tabId: string) => `tab-content-id-${tabId}`;
