export default class PreviewLine extends MC {
	render({}, { label = '', value = '' }) {
		return $('<div>')
			.addClass('mc-docs_preview-line')
			.append(
				$('<div>').addClass('mc-docs_preview-key').text(label),
				$('<div>').addClass('mc-docs_preview-sep').text('→'),
				$('<div>').addClass('mc-docs_preview-value').text(value)
			);
	}
}