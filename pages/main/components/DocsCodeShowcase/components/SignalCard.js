export default class SignalCard extends MC {
	render({}, { label = '', value = '' }) {
		return $('<div>')
			.addClass('mc-docs_signal-card')
			.append(
				$('<div>').addClass('mc-docs_signal-label').text(label),
				$('<div>').addClass('mc-docs_signal-value').text(value)
			);
	}
}