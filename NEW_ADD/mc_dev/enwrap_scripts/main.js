(function () {
	function nowLabel() {
		const d = new Date();
		return d.toLocaleTimeString('ru-RU');
	}

	function writeRuntimeLog(message) {
		const container = document.getElementById('runtime-log');
		if (!container) return;

		const line = document.createElement('div');
		line.className = 'runtime-log__item';
		line.textContent = `[${nowLabel()}] ${message}`;
		container.prepend(line);

		while (container.children.length > 100) {
			container.removeChild(container.lastChild);
		}
	}

	function shuffleArray(list) {
		const next = Array.isArray(list) ? list.slice() : [];
		for (let i = next.length - 1; i > 0; i -= 1) {
			const j = Math.floor(Math.random() * (i + 1));
			[next[i], next[j]] = [next[j], next[i]];
		}
		return next;
	}

	function makeBenchItems() {
		return [
			{ id: 'a1', title: 'Alpha', tone: 'is-good' },
			{ id: 'b2', title: 'Beta', tone: 'is-warning' },
			{ id: 'c3', title: 'Gamma', tone: '' },
			{ id: 'd4', title: 'Delta', tone: '' },
		];
	}

	function nextBenchItem(index) {
		const seeds = ['Sigma', 'Omega', 'Lambda', 'Kappa', 'Zeta', 'Mu'];
		const title = seeds[index % seeds.length] + ' #' + (index + 1);
		return {
			id: 'x' + Date.now() + '_' + index,
			title,
			tone: index % 2 === 0 ? 'is-good' : 'is-warning',
		};
	}

	class Header extends MC {
		render() {
			return $('<header class="site-header">').append(
				$('<div>').append(
					$('<h1 class="site-header__title">').text('MC Test Bench'),
					$('<p class="site-header__subtitle">').text('Страница для ручной диагностики новых возможностей и узких мест движка'),
				),
				$('<div class="badge">').append(
					$('<span class="status-dot">'),
					$('<span>').text('jQuery + MC runtime')
				)
			);
		}
	}

	class Footer extends MC {
		render() {
			return $('<footer class="site-footer">').append(
				$('<p class="site-footer__text">').text('Нижний блок оставлен намеренно простым: он нужен как контрольный статический компонент.'),
				$('<div class="footer-links">').append(
					$('<a class="footer-link" href="#identity-lab">').text('Identity'),
					$('<a class="footer-link" href="#list-lab">').text('Keyed lists'),
					$('<a class="footer-link" href="#lifecycle-lab">').text('Lifecycle'),
					$('<a class="footer-link" href="#provider-lab">').text('Providers')
				)
			);
		}
	}

	class HeroBanner extends MC {
		render() {
			return $('<section class="hero-banner">').append(
				$('<div>').append(
					$('<h2 class="hero-banner__title">').text('Стенд специально сделан неровным и насыщенным'),
					$('<p class="hero-banner__text">').text('Он не только показывает happy-path, но и провоцирует перестановки, размонтирование, частую смену props, вложенные провайдеры и сценарии, где без key может всплывать ошибка идентичности компонента.')
				),
				$('<div class="hero-banner__badges">').append(
					$('<div class="badge">').text('render(state, props)'),
					$('<div class="badge">').text('provider-like wrappers'),
					$('<div class="badge">').text('key / no-key'),
					$('<div class="badge">').text('mount / unmount'),
					$('<div class="badge">').text('nested fragments')
				)
			);
		}
	}

	class Panel extends MC {
		render({}, { id, title, note, spanClass, children }) {
			return $('<section class="panel">')
				.attr('id', id || null)
				.addClass(spanClass || 'panel--span-12')
				.append(
					$('<div class="panel__head">').append(
						$('<div>').append(
							$('<h3 class="panel__title">').text(title || 'Panel'),
							note ? $('<p class="section-note">').text(note) : null,
						)
					),
					$('<div class="panel__body">').append(children)
				);
		}
	}

	class MetricCard extends MC {
		render({}, { label, value }) {
			return $('<div class="metric">').append(
				$('<div class="metric__label">').text(label),
				$('<div class="metric__value">').text(value)
			);
		}
	}

	class InfoBox extends MC {
		render({}, { tone, children }) {
			return $('<div class="info-box">').addClass(tone || '').append(children);
		}
	}

	class TextLeaf extends MC {
		render({}, { text }) {
			return $('<div class="provider-card">').append(
				$('<div class="provider-card__label">').text('Leaf component'),
				$('<div class="provider-card__value">').text(text)
			);
		}
	}

	class Provider extends MC {
		constructor() {
			super();
			this.testState = super.state(false);
		}

		render({ testState }, { text }) {
			const [test, setTest] = testState;
			const nextText = (test ? 'Provider mutate - ON - ' : 'Provider mutate - OFF - ') + text;

			return $('</>').append(
				$('<div class="toolbar">').append(
					$('<button type="button">').text(test ? 'Выключить mutate' : 'Включить mutate').on('click', () => {
						setTest(!test);
						writeRuntimeLog(`Provider.toggle -> ${!test}`);
					})
				),
				$.MC(TextLeaf, { text: nextText })
			);
		}
	}

	class NestedProvider extends MC {
		constructor() {
			super();
			this.prefixState = super.state('Nested');
		}

		render({ prefixState }, { text }) {
			const [prefix, setPrefix] = prefixState;
			return $('</>').append(
				$('<div class="toolbar">').append(
					$('<button type="button">').text('Prefix: Nested').on('click', () => setPrefix('Nested')),
					$('<button type="button">').text('Prefix: Deep').on('click', () => setPrefix('Deep')),
					$('<button type="button">').text('Prefix: Wrapped').on('click', () => setPrefix('Wrapped')),
				),
				$.MC(TextLeaf, { text: `${prefix} provider -> ${text}` })
			);
		}
	}

	class ProviderLab extends MC {
		render() {
			return $('</>').append(
				$.MC(InfoBox, {
					tone: 'is-good',
					children: $('<div class="stack">').append(
						$('<strong>').text('Проверка нового render(stateBag, props)'),
						$('<span class="muted">').text('Внутри провайдера используется собственный state и одновременно происходит трансформация входного props.text.')
					),
				}),
				$.MC(Provider, { text: 'Hello from parent props' }),
				$.MC(NestedProvider, { text: 'Second level provider' })
			);
		}
	}

	class IdentityProfileCard extends MC {
		constructor() {
			super();
			this.localClicksState = super.state(0);
		}

		mounted(_, props) {
			writeRuntimeLog(`IdentityProfileCard.mounted -> ${props?.profile?.id}`);
		}

		unmounted(_, props) {
			writeRuntimeLog(`IdentityProfileCard.unmounted -> ${props?.profile?.id}`);
		}

		render({ localClicksState }, { profile, label, tone }) {
			const [localClicks, setLocalClicks] = localClicksState;
			
			$.MC.effect(() => {
				writeRuntimeLog(`IdentityProfileCard.effect -> ${label}: ${profile.id}`);
			}, [profile.id, label]);

			return $('<div class="identity-card">').addClass(tone || '').append(
				$('<div class="identity-card__label">').text(label),
				$('<div class="identity-card__value">').text(profile.name),
				$('<p class="muted">').text(`Entity id: ${profile.id}`),
				$('<p class="muted">').text(`Локальный state card.clicks = ${localClicks}`),
				$('<div class="card-actions">').append(
					$('<button type="button">').text('Локальный +1').on('click', () => setLocalClicks(localClicks + 1))
				)
			);
		}
	}

	class IdentityLab extends MC {
		constructor() {
			super();
			this.activeIndexState = super.state(0);
		}

		render({ activeIndexState }) {
			const [activeIndex, setActiveIndex, inst ] = activeIndexState;
			const profiles = [
				{ id: 'user-alpha', name: 'Alpha operator' },
				{ id: 'user-beta', name: 'Beta operator' },
			];
			const current = profiles[activeIndex % profiles.length];

			return $('</>').append(
				$('<div class="toolbar">').append(
					$('<button type="button">').text('Переключить entity').on('click', () => setActiveIndex((activeIndex + 1) % profiles.length))
				),
				$('<div class="two-columns">').append(
					$('<div class="stack">').append(
						$('<div class="log-hint is-warning">').text('Слева без явного key. Если движок неправильно держит identity, локальный state может остаться от прошлого entity.'),
						$.MC(IdentityProfileCard, {
							profile: current,
							label: 'Без key',
							tone: 'is-warning',
						})
					),
					$('<div class="stack">').append(
						$('<div class="log-hint is-good">').text('Справа с key = profile.id. Здесь локальный state должен быть привязан к конкретной сущности.'),
						$.MC(IdentityProfileCard, {
							profile: current,
							label: 'С key = profile.id',
							tone: 'is-good',
						}, current.id)
					)
				)
			);
		}
	}

	class BenchItemCard extends MC {
		constructor() {
			super();
			this.clicksState = super.state(0);
		}

		render({ clicksState }, { item, label, tone }) {
			const [clicks, setClicks] = clicksState;
			return $('<div class="item-card">').addClass(tone || item.tone || '').append(
				$('<div class="item-card__label">').text(label),
				$('<div class="item-card__value">').text(item.title),
				$('<p class="muted">').text(`id: ${item.id}`),
				$('<p class="muted">').text(`local clicks: ${clicks}`),
				$('<div class="card-actions">').append(
					$('<button type="button">').text('+1').on('click', () => setClicks(clicks + 1))
				)
			);
		}
	}

	class ListLab extends MC {
		constructor() {
			super();
			this.itemsState = super.state(makeBenchItems());
			this.sequenceState = super.state(0);
		}

		render({ itemsState, sequenceState }) {
			const [items, setItems] = itemsState;
			const [sequence, setSequence] = sequenceState;
			const list = Array.isArray(items) ? items : [];

			const keyedShell = $('<div class="list-grid">');
			const noKeyShell = $('<div class="list-grid">');

			list.forEach((item) => {
				keyedShell.append($.MC(BenchItemCard, {
					item,
					label: 'Keyed list item',
					tone: 'is-good',
				}, item.id));
				noKeyShell.append($.MC(BenchItemCard, {
					item,
					label: 'No-key list item',
					tone: 'is-warning',
				}));
			});

			return $('</>').append(
				$('<div class="toolbar">').append(
					$('<button type="button">').text('Shuffle').on('click', () => {
						setItems(shuffleArray(list));
						writeRuntimeLog('ListLab.shuffle');
					}),
					$('<button type="button">').text('Reverse').on('click', () => {
						setItems(list.slice().reverse());
						writeRuntimeLog('ListLab.reverse');
					}),
					$('<button type="button">').text('Remove first').on('click', () => {
						setItems(list.slice(1));
						writeRuntimeLog('ListLab.removeFirst');
					}),
					$('<button type="button">').text('Add item').on('click', () => {
						const nextIndex = sequence + 1;
						setSequence(nextIndex);
						setItems(list.concat(nextBenchItem(nextIndex)));
						writeRuntimeLog('ListLab.addItem');
					}),
					$('<button type="button">').text('Reset').on('click', () => {
						setSequence(0);
						setItems(makeBenchItems());
						writeRuntimeLog('ListLab.reset');
					})
				),
				$('<div class="two-columns">').append(
					$('<div class="stack">').append(
						$('<div class="log-hint is-good">').text('С key локальный state должен ездить вместе с логической сущностью item.id.'),
						keyedShell
					),
					$('<div class="stack">').append(
						$('<div class="log-hint is-warning">').text('Без key локальный state обычно прилипает к позиции в списке. Это хороший тест на рассинхрон.'),
						noKeyShell
					)
				)
			);
		}
	}

	class LifecycleProbe extends MC {
		constructor() {
			super();
			this.tickState = super.state(0);
			this._timer = null;
		}

		mounted() {
			writeRuntimeLog('LifecycleProbe.mounted -> interval start');
			this._timer = setInterval(() => {
				const currentPair = this.tickState && typeof this.tickState.get === 'function' ? this.tickState.get() : null;
				if (!Array.isArray(currentPair)) return;
				const [value, setValue] = currentPair;
				setValue(value + 1);
			}, 1000);
		}

		unmounted() {
			writeRuntimeLog('LifecycleProbe.unmounted -> interval cleared');
			if (this._timer) {
				clearInterval(this._timer);
				this._timer = null;
			}
		}

		render({ tickState }) {
			const [tick] = tickState;
			return $('<div class="probe-card">').append(
				$('<div class="probe-card__label">').text('Lifecycle probe'),
				$('<div class="probe-card__value">').text(`Tick: ${tick}`),
				$('<p class="muted">').text('Если unmounted работает корректно, после снятия компонента таймер больше не должен тикать.')
			);
		}
	}

	class LifecycleLab extends MC {
		constructor() {
			super();
			this.visibleState = super.state(true);
		}

		render({ visibleState }) {
			const [visible, setVisible] = visibleState;
			return $('</>').append(
				$('<div class="toolbar">').append(
					$('<button type="button">').text(visible ? 'Unmount child' : 'Mount child').on('click', () => setVisible(!visible))
				),
				visible
					? $.MC(LifecycleProbe, {}, 'lifecycle-probe-singleton')
					: $('<div class="info-box is-warning">').text('Probe сейчас размонтирован. Наблюдай Runtime log: таймер должен быть остановлен.')
			);
		}
	}

	class ForwardLeaf extends MC {
		render({}, { text }) {
			return $('<div class="mode-card">').append(
				$('<div class="mode-card__label">').text('Forward leaf'),
				$('<div class="mode-card__value">').text(text)
			);
		}
	}

	class WrapperChooser extends MC {
		render({}, { mode, message }) {
			if (mode === 'dom') {
				return $('<div class="mode-card">').append(
					$('<div class="mode-card__label">').text('DOM mode'),
					$('<div class="mode-card__value">').text(message)
				);
			}

			if (mode === 'fragment') {
				return $('</>').append(
					$('<div class="mode-card">').append(
						$('<div class="mode-card__label">').text('Fragment mode / block A'),
						$('<div class="mode-card__value">').text(message)
					),
					$('<div class="mode-card">').append(
						$('<div class="mode-card__label">').text('Fragment mode / block B'),
						$('<div class="mode-card__value">').text('Дополнительный соседний узел')
					)
				);
			}

			return $.MC(ForwardLeaf, { text: `Forwarded by wrapper -> ${message}` });
		}
	}

	class WrapperLab extends MC {
		constructor() {
			super();
			this.modeState = super.state('dom');
		}

		render({ modeState }) {
			const [mode, setMode] = modeState;
			return $('</>').append(
				$('<div class="toolbar">').append(
					$('<button type="button">').text('DOM').on('click', () => setMode('dom')),
					$('<button type="button">').text('Fragment').on('click', () => setMode('fragment')),
					$('<button type="button">').text('Forward child').on('click', () => setMode('forward')),
				),
				$.MC(WrapperChooser, { mode, message: `Current mode = ${mode}` })
			);
		}
	}

	class RecursiveNode extends MC {
		render({}, { depth, maxDepth, label }) {
			const node = $('<div class="recursive-node">').append(
				$('<strong>').text(`${label} depth ${depth}`),
				$('<div class="muted">').text('Полезно смотреть, не ломается ли вложенный composition path.')
			);

			if (depth >= maxDepth) {
				return node;
			}

			return node.append($.MC(RecursiveNode, {
				depth: depth + 1,
				maxDepth,
				label,
			}, `${label}-${depth + 1}`));
		}
	}

	class DeepTreeLab extends MC {
		constructor() {
			super();
			this.depthState = super.state(6);
		}

		render({ depthState }) {
			const [depth, setDepth] = depthState;
			return $('</>').append(
				$('<div class="toolbar">').append(
					$('<button type="button">').text('Depth -').on('click', () => setDepth(Math.max(1, depth - 1))),
					$('<button type="button">').text('Depth +').on('click', () => setDepth(Math.min(18, depth + 1)))
				),
				$.MC(RecursiveNode, {
					depth: 1,
					maxDepth: depth,
					label: 'Recursive wrapper',
				}, 'recursive-root')
			);
		}
	}

	class EffectCounter extends MC {
		constructor() {
			super();
			this.countState = super.state(0);
		}

		render({ countState }, { label }) {
			const [count, setCount] = countState;
			$.MC.effect(() => {
				writeRuntimeLog(`EffectCounter.effect -> ${label}: ${count}`);
			}, [count, label]);

			return $('<div class="probe-card">').append(
				$('<div class="probe-card__label">').text(label),
				$('<div class="probe-card__value">').text(count),
				$('<div class="card-actions">').append(
					$('<button type="button">').text('Increment').on('click', () => setCount(count + 1)),
					$('<button type="button">').text('Burst +3').on('click', () => {
						setCount(count + 1);
						setCount(count + 2);
						setCount(count + 3);
						writeRuntimeLog(`EffectCounter.burst -> ${label}`);
					})
				)
			);
		}
	}

	class EffectLab extends MC {
		render() {
			return $('<div class="two-columns">').append(
				$.MC(EffectCounter, { label: 'Effect / state probe A' }, 'effect-probe-a'),
				$.MC(EffectCounter, { label: 'Effect / state probe B' }, 'effect-probe-b')
			);
		}
	}

	class Main extends MC {
		render() {
			return $('<div class="app-shell">').append(
				$.MC(Header),
				$.MC(HeroBanner),
				$('<div class="grid">').append(
					$.MC(Panel, {
						id: 'overview',
						title: 'Что здесь проверяется',
						note: 'Этот блок нужен как краткая карта стенда.',
						spanClass: 'panel--span-12',
						children: $('<div class="kv">').append(
							$.MC(MetricCard, { label: 'State bag', value: 'render({ localState }, props)' }),
							$.MC(MetricCard, { label: 'Providers', value: 'State + props mutation' }),
							$.MC(MetricCard, { label: 'Identity', value: 'Single child key check' }),
							$.MC(MetricCard, { label: 'Lists', value: 'Keyed vs no-key reorder' })
						),
					}),
					$.MC(Panel, {
						id: 'provider-lab',
						title: 'Provider / props mutation lab',
						note: 'Проверка твоего нового сценария, где render принимает stateBag отдельно от props.',
						spanClass: 'panel--span-6',
						children: $.MC(ProviderLab)
					}),
					$.MC(Panel, {
						id: 'wrapper-lab',
						title: 'Wrapper / adapter lab',
						note: 'Компонент по условию возвращает DOM, fragment или другого ребёнка напрямую.',
						spanClass: 'panel--span-6',
						children: $.MC(WrapperLab)
					}),
					$.MC(Panel, {
						id: 'identity-lab',
						title: 'Identity lab: одиночный компонент с key и без key',
						note: 'Полезно именно для того кейса, где без key у одного экземпляра может не создаться корректная identity.',
						spanClass: 'panel--span-12',
						children: $.MC(IdentityLab)
					}),
					$.MC(Panel, {
						id: 'list-lab',
						title: 'List diff lab: keyed vs no-key',
						note: 'Перестановка, reverse, удаление и добавление элементов.',
						spanClass: 'panel--span-12',
						children: $.MC(ListLab)
					}),
					$.MC(Panel, {
						id: 'lifecycle-lab',
						title: 'Lifecycle lab',
						note: 'mounted / unmounted + cleanup таймера.',
						spanClass: 'panel--span-6',
						children: $.MC(LifecycleLab)
					}),
					$.MC(Panel, {
						id: 'effect-lab',
						title: 'Effect / repeated setState lab',
						note: 'Смотри лог при одиночном increment и при burst-обновлениях.',
						spanClass: 'panel--span-6',
						children: $.MC(EffectLab)
					}),
					$.MC(Panel, {
						id: 'deep-tree-lab',
						title: 'Deep composition lab',
						note: 'Проверка глубокой вложенности и рекурсивной сборки дерева.',
						spanClass: 'panel--span-12',
						children: $.MC(DeepTreeLab)
					})
				),
				$.MC(Footer),
			);
		}
	}

	document.addEventListener('DOMContentLoaded', () => {
		const clearButton = document.getElementById('clear-runtime-log');
		if (clearButton) {
			clearButton.addEventListener('click', () => {
				const container = document.getElementById('runtime-log');
				if (container) {
					container.innerHTML = '';
				}
			});
		}

		writeRuntimeLog('DOMContentLoaded');
		$('#root').append($.MC(Main));
	});
})();