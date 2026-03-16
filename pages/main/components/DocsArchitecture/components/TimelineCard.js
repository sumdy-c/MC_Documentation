export default class TimelineCard extends MC {
	render({}, { index = '', title = '', text = '' }) {
		return $('<article>')
			.addClass('mc-docs_timeline-card')
			.append(
				$('<div>').addClass('mc-docs_timeline-index').text(index),
				$('<div>').addClass('mc-docs_timeline-title').text(title),
				$('<div>').addClass('mc-docs_timeline-text').text(text)
			);
	}
}