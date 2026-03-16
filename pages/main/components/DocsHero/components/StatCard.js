export default class StatCard extends MC {
	render({}, { label = '', value = '', meta = '' }) {
		return $('<div>')
			.addClass('mc-docs_stat-card')
			.append(
				$('<div>').addClass('mc-docs_stat-label').text(label),
				$('<div>').addClass('mc-docs_stat-value').text(value),
				$('<div>').addClass('mc-docs_stat-meta').text(meta)
			);
	}
}