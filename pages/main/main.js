import DocsArchitecture from "./components/DocsArchitecture/DocsArchitecture.js";
import DocsBackground from "./components/DocsBackground.js";
import DocsCodeShowcase from "./components/DocsCodeShowcase/DocsCodeShowcase.js";
import DocsFeatureGrid from "./components/DocsFeatureGrid/DocsFeatureGrid.js";
import DocsFooter from "./components/DocsFooter.js";
import DocsHero from "./components/DocsHero/DocsHero.js";
import DocsIntro from "./components/DocsIntro/DocsIntro.js";

export default class Main extends MC {
	constructor() {
		super();
	}

	render({}, { setPage }) {
		return $('<main>')
			.addClass('mc-docs')
			.append(
				$.MC(DocsBackground, {}, 'mc-docs-bg'),
				$('<div>')
					.addClass('mc-docs_shell')
					.append(
						$.MC(DocsHero, { setPage }, 'mc-docs-hero'),
						$.MC(DocsIntro, {}, 'mc-docs-intro'),
						$.MC(DocsArchitecture, {}, 'mc-docs-architecture'),
						$.MC(DocsFeatureGrid, {}, 'mc-docs-feature-grid'),
						$.MC(DocsCodeShowcase, {}, 'mc-docs-code-showcase'),
						$.MC(DocsFooter, {}, 'mc-docs-footer')
					)
			);
	}
}
