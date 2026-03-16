export default class InfoCard extends MC {
	render({}, { title = '', text = '' }) {
		return $('<article>')
			.addClass('mc-docs_card')
			.append(
				$('<div>').addClass('mc-docs_card-shine'),
				$('<h3>').addClass('mc-docs_card-title').text(title),
				$('<p>').addClass('mc-docs_card-text').text(text)
			);
	}
}