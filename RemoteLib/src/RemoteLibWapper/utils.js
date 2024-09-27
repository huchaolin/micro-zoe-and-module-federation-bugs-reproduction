export function writeCssVariablesToBody(themeConfig) {
	const root = (window?.appRealWindow || window).document.body;
	Object.keys(themeConfig).forEach((name) => {
		root.style.setProperty(`--${name.replace(/([A-Z])/g, '-$1').toLowerCase()}`, themeConfig[name]);
	});
}