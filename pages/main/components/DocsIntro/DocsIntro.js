import SectionHeading from "../DocsCodeShowcase/components/SectionHeading.js";
import InfoCard from "./components/InfoCard.js";

export default class DocsIntro extends MC {
	render() {
		return $('<section>')
			.addClass('mc-docs_section mc-docs_section--intro mc-docs_fade-up mc-docs_fade-up--delay-1')
			.append(
				$.MC(SectionHeading, {
					kicker: 'OVERVIEW',
					title: 'Что такое MC',
					text:
						'MC — это не просто набор хелперов, а собственная модель исполнения UI. Компоненты, state, effects, reconciliation и DOM-обновления связаны в одну систему.'
				}, 'intro-heading'),
				$('<div>')
					.addClass('mc-docs_intro-grid')
					.append(
						$.MC(InfoCard, {
							title: 'Component Model',
							text: 'Class-компоненты, composition через $.MC(...), разделение дерева на небольшие изолированные части.'
						}, 'intro-card-components'),
						$.MC(InfoCard, {
							title: 'State System',
							text: 'Local и shared state с подписками на тех, кто реально читает данные внутри render / effect / fn-container.'
						}, 'intro-card-state'),
						$.MC(InfoCard, {
							title: 'DOM-first Thinking',
							text: 'Фрейм не прячет реальный DOM слишком далеко и остаётся удобным для среды, где jQuery всё ещё часть продукта.'
						}, 'intro-card-dom')
					)
			);
	}
}
