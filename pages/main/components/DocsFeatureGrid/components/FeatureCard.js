export default class FeatureCard extends MC {
	render({}, { title = '', text = '' }) {
		return $('<article>')
			.addClass('mc-docs_feature-card')
			.append(
				$('<div>').addClass('mc-docs_feature-dot'),
				$('<h3>').addClass('mc-docs_feature-title').text(title),
				$('<p>').addClass('mc-docs_feature-text').text(text)
			);
	}
}