export default class SectionHeading extends MC {
	render({}, { kicker = '', title = '', text = '' }) {
		return $('<div>')
			.addClass('mc-docs_section-heading')
			.append(
				$('<div>').addClass('mc-docs_section-kicker').text(kicker),
				$('<h2>').addClass('mc-docs_section-title').text(title),
				$('<p>').addClass('mc-docs_section-text').text(text)
			);
	}
}