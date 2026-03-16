export default class DocsBackground extends MC {
	render() {
		return $('<div>')
			.addClass('mc-docs_bg')
			.append(
				$('<div>').addClass('mc-docs_bg-grid'),
				$('<div>').addClass('mc-docs_bg-orb mc-docs_bg-orb--1'),
				$('<div>').addClass('mc-docs_bg-orb mc-docs_bg-orb--2'),
				$('<div>').addClass('mc-docs_bg-noise')
			);
	}
}