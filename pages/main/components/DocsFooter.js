export default class DocsFooter extends MC {
	render() {
		return $('<footer>')
			.addClass('mc-docs_footer mc-docs_fade-up mc-docs_fade-up--delay-5')
			.append(
				$('<div>').addClass('mc-docs_footer-line'),
				$('<div>')
					.addClass('mc-docs_footer-text')
					.text('MC documentation — internal runtime overview')
			);
	}
}