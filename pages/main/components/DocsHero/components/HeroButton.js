export default class HeroButton extends MC {
	render({}, { label = '', kind = 'primary', onClick = () => {} }) {
		return $('<button>')
			.addClass(`mc-docs_btn mc-docs_btn--${kind}`)
			.attr('type', 'button')
			.append(
				$('<span>').text(label)
			)
			.on('click', () => {
				onClick();
			});
	}
}