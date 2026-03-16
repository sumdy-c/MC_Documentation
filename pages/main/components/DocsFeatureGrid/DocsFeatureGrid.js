import SectionHeading from "../DocsCodeShowcase/components/SectionHeading.js";
import FeatureCard from "./components/FeatureCard.js";

export default class DocsFeatureGrid extends MC {
	render() {
		return $('<section>')
			.addClass('mc-docs_section mc-docs_fade-up mc-docs_fade-up--delay-3')
			.append(
				$.MC(SectionHeading, {
					kicker: 'FEATURES',
					title: 'На чём держится система',
					text:
						'Это не список “фич ради фич”, а набор опорных механизмов, которые делают runtime устойчивым в реальном приложении.'
				}, 'features-heading'),
				$('<div>')
					.addClass('mc-docs_feature-grid')
					.append(
						$.MC(FeatureCard, {
							title: 'Keyed identity',
							text: 'Стабильная идентичность детей при динамическом дереве и условных ветках.'
						}, 'feature-keyed'),
						$.MC(FeatureCard, {
							title: 'Batched updates',
							text: 'Контролируемый flush обновлений вместо хаотичных каскадных ререндеров.'
						}, 'feature-batched'),
						$.MC(FeatureCard, {
							title: 'Lifecycle hooks',
							text: 'mounted, updated, unmounted и логика reconnection после реального DOM patch.'
						}, 'feature-lifecycle'),
						$.MC(FeatureCard, {
							title: 'Legacy interop',
							text: 'Возможность жить рядом с jQuery, событиями и старым приложением без полной ломки слоя UI.'
						}, 'feature-interop')
					)
			);
	}
}