(function () {
	'use strict';

	MC.debugMode = false;

	const STORAGE_KEY = 'mc_docs_active_page';
	const THEME_KEY = 'mc_docs_theme';
	const READ_MODE_KEY = 'mc_docs_read_mode';
	const THEME_OPTIONS = [
		{ id: 'light', label: 'Light' },
		{ id: 'dark', label: 'Dark' },
		{ id: 'system', label: 'System' },
	];
	const READING_MODES = [
		{ id: 'learn', label: 'Learn' },
		{ id: 'reference', label: 'Ref' },
		{ id: 'deep', label: 'Deep' },
	];
	const SEARCH_CHIPS = ['state', 'effect', 'key', 'ref', 'host', 'render'];
	const AI_DOCS_URL = '../clientscript/MicroComponent/MC.ai.md';
	const ALWAYS_VISIBLE_BLOCKS = ['lab', 'diff-simulator', 'identity-playground', 'rosetta', 'component-tree'];
	const MODE_BLOCKS = {
		learn: ['lead', 'text', 'list', 'cards', 'flow', 'demo', 'do-dont', 'callout', 'code', 'tabs'],
		reference: ['lead', 'table', 'code', 'tabs', 'template-grid', 'callout'],
		deep: null,
	};
	const LAB_STEPS = [
		{ id: 'event', title: 'event', text: 'Handler получает текущий snapshot из render.' },
		{ id: 'set', title: 'state.set', text: 'MCState сравнивает value и помечает state dirty.' },
		{ id: 'queue', title: 'microtask', text: 'Runtime группирует изменения и готовит flush.' },
		{ id: 'render', title: 'render', text: 'Компонент получает свежий tuple и строит новый DOM-образ.' },
		{ id: 'diff', title: 'diff', text: 'Существующий DOM патчится без полной пересборки.' },
		{ id: 'effect', title: 'effect', text: 'Side effects запускаются после commit.' },
	];
	const DIFF_SCENARIOS = [
		{
			id: 'text',
			title: 'Text node',
			oldTree: ['button.counter', '  text: "Clicked: 1"'],
			newTree: ['button.counter', '  text: "Clicked: 2"'],
			ops: ['Сохранить <button>', 'Обновить textContent', 'События оставить без пересоздания'],
		},
		{
			id: 'attrs',
			title: 'Attributes',
			oldTree: ['input.search', '  value="mc"', '  class="field"'],
			newTree: ['input.search', '  value="mc state"', '  class="field is-hot"'],
			ops: ['Сохранить <input>', 'Синхронизировать property value', 'Поменять class attribute'],
		},
		{
			id: 'keyed',
			title: 'Keyed children',
			oldTree: ['UserCard key="u-7"', 'UserCard key="u-9"'],
			newTree: ['UserCard key="u-9"', 'UserCard key="u-7"'],
			ops: ['Сопоставить детей по key', 'Переставить DOM без сброса local state', 'Не вызывать unmounted() для тех же identity'],
		},
		{
			id: 'replace',
			title: 'Replace',
			oldTree: ['section.panel', '  div.body'],
			newTree: ['dialog.panel', '  form.body'],
			ops: ['Tag name изменился', 'Очистить refs/effects старой ветки', 'Поставить новый root node'],
		},
	];
	const JS_KEYWORDS = new Set([
		'async',
		'await',
		'catch',
		'class',
		'const',
		'constructor',
		'else',
		'extends',
		'false',
		'finally',
		'for',
		'function',
		'if',
		'import',
		'from',
		'instanceof',
		'let',
		'new',
		'null',
		'return',
		'static',
		'super',
		'this',
		'true',
		'try',
		'typeof',
		'undefined',
		'var',
		'while',
	]);
	const JS_GLOBALS = new Set([
		'Array',
		'Boolean',
		'Date',
		'Error',
		'Map',
		'MC',
		'Number',
		'Object',
		'Promise',
		'RegExp',
		'Set',
		'String',
		'jQuery',
	]);
	const CODE_TOKEN_RE = /\/\/[^\n]*|\/\*[\s\S]*?\*\/|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`|\b[A-Za-z_$][\w$]*\b|\b\d+(?:\.\d+)?\b|[{}()[\].,;:+\-*/%=!<>?&|]/g;
	const HTML_TOKEN_RE = /<!--[\s\S]*?-->|<\/?[A-Za-z][^>]*>|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g;

	function code(strings, ...values) {
		return String.raw({ raw: strings }, ...values).trim();
	}

	function copyTextToClipboard(text) {
		if (navigator.clipboard && window.isSecureContext) {
			return navigator.clipboard.writeText(text);
		}

		const $textarea = $('<textarea>')
			.val(text)
			.attr('readonly', 'readonly')
			.css({
				position: 'fixed',
				left: '-1000px',
				top: '-1000px',
				opacity: 0,
			});

		$(document.body).append($textarea);
		$textarea[0].select();

		try {
			if (!document.execCommand('copy')) {
				return Promise.reject(new Error('Copy command failed'));
			}
			return Promise.resolve();
		} catch (error) {
			return Promise.reject(error);
		} finally {
			$textarea.remove();
		}
	}

	function appendToken($target, token, type) {
		if (!type) {
			$target.append(document.createTextNode(token));
			return;
		}

		$target.append(
			$('<span>')
				.addClass('tok tok-' + type)
				.text(token)
		);
	}

	function getJsTokenType(token, source, index) {
		if (token.startsWith('//') || token.startsWith('/*')) return 'comment';
		if (token[0] === '\'' || token[0] === '"' || token[0] === '`') return 'string';
		if (/^\d/.test(token)) return 'number';
		if (JS_KEYWORDS.has(token)) return 'keyword';
		if (JS_GLOBALS.has(token) || token === '$') return 'global';
		if (/^[A-Za-z_$]/.test(token)) {
			const next = source.slice(index + token.length).match(/^\s*\(/);
			return next ? 'function' : 'name';
		}
		return 'punctuation';
	}

	function appendHighlightedJs($target, source) {
		let cursor = 0;

		source.replace(CODE_TOKEN_RE, (token, index) => {
			if (index > cursor) {
				$target.append(document.createTextNode(source.slice(cursor, index)));
			}
			appendToken($target, token, getJsTokenType(token, source, index));
			cursor = index + token.length;
			return token;
		});

		if (cursor < source.length) {
			$target.append(document.createTextNode(source.slice(cursor)));
		}
	}

	function appendHighlightedHtml($target, source) {
		let cursor = 0;

		source.replace(HTML_TOKEN_RE, (token, index) => {
			if (index > cursor) {
				$target.append(document.createTextNode(source.slice(cursor, index)));
			}
			if (token.startsWith('<!--')) {
				appendToken($target, token, 'comment');
			} else if (token[0] === '\'' || token[0] === '"') {
				appendToken($target, token, 'string');
			} else {
				appendToken($target, token, 'tag');
			}
			cursor = index + token.length;
			return token;
		});

		if (cursor < source.length) {
			$target.append(document.createTextNode(source.slice(cursor)));
		}
	}

	function renderCodeElement(source, lang) {
		const normalizedLang = lang || 'text';
		const $code = $('<code>')
			.addClass('language-' + normalizedLang)
			.addClass('docs-code-highlight');

		if (normalizedLang === 'js' || normalizedLang === 'javascript') {
			appendHighlightedJs($code, source || '');
		} else if (normalizedLang === 'html' || normalizedLang === 'xml') {
			appendHighlightedHtml($code, source || '');
		} else {
			$code.text(source || '');
		}

		return $code;
	}

	function shortRuntimeKey(key) {
		const value = String(key || '');
		if (value.length <= 42) return value || 'root';
		return value.slice(0, 16) + '...' + value.slice(-18);
	}

	function getRuntimeNodeName(vdom, fallback) {
		if (!vdom) return fallback;
		return (
			vdom.component?.constructor?.name ||
			vdom.normalized?.component?.name ||
			vdom.draw?.name ||
			vdom.run?.name ||
			fallback
		);
	}

	function createRuntimeNode(type, key, name, parent, meta) {
		return {
			type,
			key,
			name,
			parent: parent || null,
			meta: meta || '',
			children: [],
		};
	}

	function getRuntimeTreeSnapshot() {
		const root = window.iMC;
		const nodes = [];
		const byKey = new Map();

		if (!root) {
			return { roots: [], total: 0 };
		}

		(root.componentCollection || new Map()).forEach((vdom, key) => {
			const stateCount = vdom.states?.size || 0;
			const node = createRuntimeNode(
				'component',
				key,
				getRuntimeNodeName(vdom, 'Component'),
				vdom.component?.parentKey || null,
				(stateCount ? stateCount + ' state' : 'no state') + (vdom.HTML?.isConnected ? ' · connected' : ' · detached')
			);
			nodes.push(node);
			byKey.set(key, node);
		});

		(root.fcCollection || new Map()).forEach((vdom, key) => {
			const node = createRuntimeNode(
				'fc',
				key,
				getRuntimeNodeName(vdom, 'Function container'),
				null,
				(vdom.states?.size || 0) + ' deps'
			);
			nodes.push(node);
			byKey.set(key, node);
		});

		(root.effectCollection || new Map()).forEach((effect, key) => {
			const node = createRuntimeNode(
				effect._deferred ? 'deferred' : 'effect',
				key,
				getRuntimeNodeName(effect, effect._deferred ? 'deferredEffect' : 'effect'),
				effect.parent || null,
				(effect.states?.size || 0) + ' deps'
			);
			nodes.push(node);
			byKey.set(key, node);
		});

		const roots = [];
		nodes.forEach((node) => {
			const parent = node.parent ? byKey.get(node.parent) : null;
			if (parent && parent !== node) {
				parent.children.push(node);
			} else {
				roots.push(node);
			}
		});

		return { roots, total: nodes.length };
	}

	const CODE_TEMPLATES = [
		{
			id: 'class-component',
			title: 'Class component',
			lang: 'js',
			code: code`
				class Widget extends MC {
					constructor() {
						super();
						this.valueState = super.state(null);
					}

					render({ valueState }, { title }) {
						const [value, setValue, valueRef] = valueState;

						return $('<section>').append(
							$('<h2>').text(title),
							$('<button type="button">')
								.text(String(value))
								.on('click', () => setValue(Date.now()))
						);
					}
				}
			`,
		},
		{
			id: 'effect',
			title: 'Effect',
			lang: 'js',
			code: code`
				render({ selectedState }) {
					const [selected, setSelected, selectedRef] = selectedState;

					$.MC.effect(([nextSelected]) => {
						if (!nextSelected) return;
						this.loadDetails(nextSelected);
					}, [selectedRef], 'load-selected-details');

					return $('<div>');
				}
			`,
		},
		{
			id: 'global-gate',
			title: 'Global state gate',
			lang: 'js',
			code: code`
				const openState = MC.uState(false, 'widget:is-open');

				$(document.body).append(
					$.MC(([isOpen]) => {
						if (!isOpen) return null;

						return $.MC(AppShell, {
							close: () => openState.set(false),
						}, 'widget-shell');
					}, [openState], 'widget-gate')
				);
			`,
		},
		{
			id: 'async-mounted',
			title: 'Async mounted',
			lang: 'js',
			code: code`
				class DataPanel extends MC {
					constructor() {
						super();
						this.itemsState = super.state([]);
						this.loadingState = super.state(true);
					}

					async mounted() {
						const items = await api.loadItems();
						this.itemsState.set(items);
						this.loadingState.set(false);
					}
				}
			`,
		},
		{
			id: 'host-canvas',
			title: 'Canvas host',
			lang: 'js',
			code: code`
				render({}, { model }) {
					return MC.host($('<canvas>'), (canvas) => {
						if (!canvas) return;
						this.draw(canvas, model);
					});
				}
			`,
		},
	];

	function isKnownPageId(id) {
		return DOCS.some((page) => page.id === id);
	}

	function normalizePageId(value) {
		const id = String(value || '').replace(/^#/, '');
		return isKnownPageId(id) ? id : DOCS[0].id;
	}

	function getHashPageId() {
		return normalizePageId(window.location.hash);
	}

	function getStoredTheme() {
		try {
			const stored = localStorage.getItem(THEME_KEY);
			return THEME_OPTIONS.some((item) => item.id === stored) ? stored : 'system';
		} catch (_error) {
			return 'system';
		}
	}

	function getStoredReadMode() {
		try {
			const stored = localStorage.getItem(READ_MODE_KEY);
			return READING_MODES.some((item) => item.id === stored) ? stored : 'learn';
		} catch (_error) {
			return 'learn';
		}
	}

	function storeTheme(theme) {
		try {
			localStorage.setItem(THEME_KEY, theme);
		} catch (_error) {
			// ignore storage failures
		}
	}

	function storeReadMode(mode) {
		try {
			localStorage.setItem(READ_MODE_KEY, mode);
		} catch (_error) {
			// ignore storage failures
		}
	}

	function getSystemTheme() {
		return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light';
	}

	function resolveTheme(theme) {
		return theme === 'system' ? getSystemTheme() : theme;
	}

	function applyTheme(theme) {
		const resolved = resolveTheme(theme);
		document.documentElement.dataset.docsTheme = resolved;
		document.documentElement.dataset.docsThemeChoice = theme;
	}

	function getRuntimeSnapshot() {
		const root = window.iMC;
		return {
			states: MC.getState ? MC.getState().length : 0,
			components: root?.componentCollection?.size || 0,
			functions: root?.fcCollection?.size || 0,
			effects: root?.effectCollection?.size || 0,
			debug: !!MC.debugMode,
		};
	}

	function renderHighlightedText(text, query, className) {
		const value = String(text || '');
		const normalizedQuery = normalizeSearch(query);
		const $wrap = $('<span>').addClass(className || '');

		if (!normalizedQuery) {
			return $wrap.text(value);
		}

		const lower = value.toLowerCase();
		const index = lower.indexOf(normalizedQuery);
		if (index === -1) {
			return $wrap.text(value);
		}

		const before = value.slice(0, index);
		const match = value.slice(index, index + normalizedQuery.length);
		const after = value.slice(index + normalizedQuery.length);

		return $wrap.append(
			document.createTextNode(before),
			$('<mark>').text(match),
			document.createTextNode(after)
		);
	}

	function blockVisibleInMode(block, readMode) {
		if (!block) return false;
		if (ALWAYS_VISIBLE_BLOCKS.includes(block.kind)) return true;
		if (Array.isArray(block.modes)) return block.modes.includes(readMode);
		const allowed = MODE_BLOCKS[readMode];
		return !allowed || allowed.includes(block.kind);
	}

	function getVisibleBlocks(blocks, readMode) {
		const source = blocks || [];
		const visible = source.filter((block) => blockVisibleInMode(block, readMode));
		return visible.length ? visible : source;
	}

	function buildCommandItems(query, actions) {
		const normalized = normalizeSearch(query);
		const pageItems = DOCS.map((page) => ({
			type: 'page',
			title: page.title,
			meta: page.group,
			summary: page.summary,
			keywords: [page.id, page.short, page.title, page.summary, page.group, ...(page.keywords || [])],
			run: () => actions.goTo(page.id),
		}));
		const modeItems = READING_MODES.map((mode) => ({
			type: 'mode',
			title: 'Mode: ' + mode.label,
			meta: 'Reading',
			summary: mode.id === actions.readMode ? 'Текущий режим чтения' : 'Переключить режим документации',
			keywords: ['mode', 'reading', mode.id, mode.label, 'learn', 'reference', 'deep'],
			run: () => actions.setReadMode(mode.id),
		}));
		const themeItems = THEME_OPTIONS.map((theme) => ({
			type: 'theme',
			title: 'Theme: ' + theme.label,
			meta: 'Interface',
			summary: theme.id === actions.theme ? 'Текущая тема' : 'Переключить тему интерфейса',
			keywords: ['theme', theme.id, theme.label, 'dark', 'light', 'system'],
			run: () => actions.setTheme(theme.id),
		}));
		const templateItems = CODE_TEMPLATES.map((template) => ({
			type: 'template',
			title: template.title,
			meta: 'Template',
			summary: 'Открыть копируемый шаблон кода',
			keywords: ['template', 'copy', template.id, template.title, template.lang],
			run: () => actions.goTo('templates'),
		}));
		const utilityItems = [
			{
				type: 'utility',
				title: 'MC.ai.md',
				meta: 'AI docs',
				summary: 'Открыть Markdown-документацию для AI и скрапинга',
				keywords: ['ai', 'markdown', 'md', 'crawler', 'docs', 'download', 'MC.ai.md'],
				run: () => window.open(AI_DOCS_URL, '_blank', 'noopener'),
			},
		];
		const allItems = [...utilityItems, ...pageItems, ...modeItems, ...themeItems, ...templateItems];

		if (!normalized) {
			return allItems.slice(0, 12);
		}

		return allItems
			.filter((item) => item.keywords.join(' ').toLowerCase().includes(normalized))
			.slice(0, 18);
	}

	const DOCS = [
		{
			id: 'overview',
			group: 'Старт',
			title: 'Что такое MC',
			short: 'Обзор',
			summary: 'Micro Component: реактивные компоненты поверх jQuery без сборки и JSX.',
			keywords: ['mc', 'micro component', 'jquery', 'runtime', 'архитектура'],
			blocks: [
				{
					kind: 'lead',
					text: 'MC (Micro Component) - компактный UI runtime поверх jQuery для реактивных компонентов, state, effects, lifecycle и DOM diff в legacy-приложениях. По роли это уже мини-фреймворк, но без отдельной сборки, JSX и большой внешней экосистемы.',
				},
				{
					kind: 'cards',
					title: 'Главные идеи',
					cards: [
						{
							title: 'jQuery остается основой',
							text: 'render() возвращает jQuery-объект, DOM-элемент, DocumentFragment, дочерний $.MC(...) или null.',
						},
						{
							title: 'State управляет перерисовкой',
							text: 'state.set(nextValue) планирует батчированный flush. Обновляются только подписанные компоненты, контейнеры и эффекты.',
						},
						{
							title: 'Компоненты живут в дереве',
							text: 'Класс extends MC получает props, локальные state, lifecycle и стабильный ключ в дереве рендера.',
						},
						{
							title: 'Императивный DOM не запрещен',
							text: 'Для canvas, video и сторонних виджетов есть MC.ref() и MC.host(), чтобы безопасно работать с DOM напрямую.',
						},
					],
				},
				{
					kind: 'list',
					title: 'Что библиотека делает сама',
					items: [
						'Автоматически инициализируется после загрузки jQuery или при первом вызове $.MC().',
						'Патчит jQuery .on()/.bind(), чтобы diff мог корректно менять обработчики событий.',
						'Сравнивает старый и новый DOM, обновляет атрибуты, классы, стили, события и дочерние узлы.',
						'Вызывает mounted(), updated(), unmounted() и cleanup-функции эффектов.',
						'Следит за удалением MC-узлов из DOM через MutationObserver и чистит внутренние коллекции.',
					],
				},
				{
					kind: 'callout',
					tone: 'important',
					title: 'Актуальный источник',
					text: 'Эта документация описывает public/clientscript/MicroComponent/MC.js. В проекте есть MCv8/MCv8.js, но он немного отличается: в MC.js исправлен fast-path сравнения Map и Set.',
				},
			],
		},
		{
			id: 'install',
			group: 'Старт',
			title: 'Подключение и инициализация',
			short: 'Подключение',
			summary: 'Как подключить jQuery, MC.js и запустить первый компонент.',
			keywords: ['script', 'jquery', 'init', 'bootstrap', 'auto init'],
			blocks: [
				{
					kind: 'text',
					title: 'Порядок подключения',
					text: [
						'MC должен загружаться после jQuery. Начиная с текущей версии, ручной MC.init() обычно не нужен: runtime пробует инициализироваться сразу, на DOMContentLoaded и затем коротким polling, если jQuery подключается асинхронно.',
						'Если страница подключает jQuery позже вручную, можно вызвать MC.init() после появления window.$. Повторный вызов безопасен: bootstrap идемпотентен.',
					],
				},
				{
					kind: 'code',
					title: 'Минимальная HTML-страница',
					lang: 'html',
					code: code`
						<div id="root"></div>

						<script src="/template/jquery-ui/jquery.min.js"></script>
						<script src="/clientscript/MicroComponent/MC.js"></script>
						<script src="/clientscript/MyApp/main.js" type="module"></script>
					`,
				},
				{
					kind: 'code',
					title: 'Ручная инициализация, если она нужна',
					lang: 'js',
					code: code`
						// Обычно не требуется, но безопасно:
						MC.init();

						// Для подробных логов:
						MC.debugMode = true;
					`,
				},
				{
					kind: 'table',
					title: 'Что появляется после bootstrap',
					columns: ['Глобальное имя', 'Назначение'],
					rows: [
						['$.MC', 'Монтирование class-компонентов и function containers.'],
						['$.MC.memo', 'Мемоизированный function container.'],
						['$.MC.effect', 'Реактивный эффект по MCState-зависимостям.'],
						['$.MC.deferredEffect', 'Эффект после полного завершения flush и mounted/refs.'],
						['window.iMC', 'Root-instance для диагностики внутренних коллекций.'],
					],
				},
			],
		},
		{
			id: 'mental-model',
			group: 'Старт',
			title: 'Ментальная модель',
			short: 'Модель',
			summary: 'Как думать о MC: state changes, flush, render, diff, lifecycle и effects.',
			keywords: ['mental model', 'state set', 'flush', 'render', 'diff', 'effects', 'lifecycle'],
			blocks: [
				{
					kind: 'lead',
					text: 'MC проще понимать как цикл. Событие вызывает state.set(), runtime собирает изменения, перерисовывает подписчиков, применяет DOM diff, актуализирует refs/lifecycle и только потом запускает effects.',
				},
				{
					kind: 'cards',
					title: 'Один цикл обновления',
					cards: [
						{
							title: '1. Событие',
							text: 'Пользовательский click/input, ответ API, socket event или таймер вызывает setter состояния.',
						},
						{
							title: '2. state.set()',
							text: 'MC сравнивает новое значение со старым и добавляет state.id в очередь dirty states.',
						},
						{
							title: '3. Flush',
							text: 'В microtask runtime группирует изменения, сортирует подписчиков и дедуплицирует компоненты.',
						},
						{
							title: '4. render()',
							text: 'Подписанные компоненты получают свежие [value, setter, stateRef] и возвращают новый DOM-образ.',
						},
						{
							title: '5. DOM diff',
							text: 'MC патчит атрибуты, классы, стили, события, text nodes, children и keyed MC-компоненты.',
						},
						{
							title: '6. Effects',
							text: 'После DOM-коммита запускаются обычные effects, а deferred effects ждут конца всех re-flush.',
						},
					],
				},
				{
					kind: 'flow',
					title: 'Flush как цепочка',
					steps: [
						{
							label: 'event',
							title: 'Событие',
							text: 'Handler получает текущее значение из render-closure и вызывает setter.',
						},
						{
							label: 'set',
							title: 'Dirty state',
							text: 'state.set() сравнивает значения и добавляет state.id в очередь обновлений.',
						},
						{
							label: 'batch',
							title: 'Microtask flush',
							text: 'Несколько синхронных set() схлопываются в один проход runtime.',
						},
						{
							label: 'render',
							title: 'Новый DOM-образ',
							text: 'Компонент получает свежие tuples и возвращает jQuery/DOM/fragment/null.',
						},
						{
							label: 'diff',
							title: 'DOM commit',
							text: 'MC патчит существующий DOM, стараясь сохранить identity и refs.',
						},
						{
							label: 'effect',
							title: 'Effects',
							text: 'После commit запускаются effects, deferred effects ждут полного завершения.',
						},
					],
				},
				{
					kind: 'code',
					title: 'Событие -> state -> render',
					lang: 'js',
					code: code`
						class Toggle extends MC {
							constructor() {
								super();
								this.openState = super.state(false);
							}

							render({ openState }) {
								const [open, setOpen] = openState;

								return $('<button type="button">')
									.text(open ? 'Open' : 'Closed')
									.on('click', () => setOpen(!open));
							}
						}
					`,
				},
				{
					kind: 'callout',
					tone: 'important',
					title: 'render должен быть почти чистым',
					text: 'В render описывайте DOM для текущих state/props. Side effects, подписки, фокус, измерения и внешние вызовы лучше держать в обработчиках, mounted/unmounted, $.MC.effect или $.MC.deferredEffect.',
				},
			],
		},
		{
			id: 'quick-start',
			group: 'Старт',
			title: 'Первый компонент',
			short: 'Quick start',
			summary: 'Минимальный class component с локальным состоянием и обработчиком клика.',
			keywords: ['quick start', 'component', 'render', 'state', 'click'],
			blocks: [
				{
					kind: 'lead',
					text: 'Рекомендуемый базовый стиль MC - классовые компоненты. Компонент наследуется от MC, создает локальные состояния в constructor и возвращает DOM из render().',
				},
				{
					kind: 'code',
					title: 'Counter на MC',
					lang: 'js',
					code: code`
						class Counter extends MC {
							constructor() {
								super();
								this.countState = super.state(0);
							}

							render({ countState }, { title }) {
								const [count, setCount] = countState;

								return $('<section>')
									.addClass('counter')
									.append(
										$('<h2>').text(title),
										$('<button type="button">')
											.text('Clicked: ' + count)
											.on('click', () => setCount(count + 1))
									);
							}
						}

						$('#root').append(
							$.MC(Counter, { title: 'Hello MC' }, 'counter-root')
						);
					`,
				},
				{
					kind: 'list',
					title: 'Что здесь важно',
					items: [
						'this.countState = super.state(0) создает локальный MCState.',
						'В render состояние приходит по имени свойства: { countState }.',
						'Тройка состояния имеет форму [value, setter, stateRef].',
						'setCount(count + 1) вызывает state.set() и планирует обновление.',
						'Последний аргумент $.MC(..., key) задает стабильную identity компонента.',
					],
				},
			],
		},
		{
			id: 'jquery-to-mc',
			group: 'Старт',
			title: 'Из jQuery в MC',
			short: 'jQuery -> MC',
			summary: 'Как переносить привычный jQuery-код в реактивную модель MC постепенно.',
			keywords: ['jquery migration', 'legacy', 'state', 'render', 'events'],
			blocks: [
				{
					kind: 'lead',
					text: 'MC особенно полезен там, где уже есть jQuery-приложение. Не нужно переписывать всё: можно вынести один виджет в компонент, заменить ручные DOM-мутации на state + render и оставить остальной код как есть.',
				},
				{
					kind: 'code',
					title: 'Было: ручная DOM-мутация',
					lang: 'js',
					code: code`
						const $counter = $('#counter');
						let count = 0;

						$('#increment').on('click', () => {
							count += 1;
							$counter.text(count);
						});
					`,
				},
				{
					kind: 'code',
					title: 'Стало: state описывает UI',
					lang: 'js',
					code: code`
						class Counter extends MC {
							constructor() {
								super();
								this.countState = super.state(0);
							}

							render({ countState }) {
								const [count, setCount] = countState;

								return $('<div>').append(
									$('<span>').text(count),
									$('<button type="button">')
										.text('+')
										.on('click', () => setCount(count + 1))
								);
							}
						}
					`,
				},
				{
					kind: 'table',
					title: 'Как переводить привычные паттерны',
					columns: ['jQuery-подход', 'MC-подход'],
					rows: [
						['Глобальная переменная хранит UI-состояние', 'Локальный super.state() или MC.uState(key).'],
						['После каждого события вручную меняем DOM', 'Событие меняет state, render возвращает новый DOM-образ.'],
						['$(selector).on(...) после вставки разметки', '.on(...) прямо на создаваемом jQuery-элементе внутри render().'],
						['window/document listeners живут отдельно', 'Добавить в mounted(), снять в unmounted().'],
						['Большой виджет сам управляет внутренним DOM', 'Обернуть root в MC.host() и управлять children вручную.'],
					],
				},
			],
		},
		{
			id: 'when-to-use',
			group: 'Старт',
			title: 'Когда MC подходит',
			short: 'Когда подходит',
			summary: 'Где MC дает максимум пользы, а где лучше выбрать другой инструмент.',
			keywords: ['when to use', 'legacy', 'jquery', 'react', 'vue', 'tradeoffs'],
			blocks: [
				{
					kind: 'lead',
					text: 'MC стоит выбирать, когда нужно добавить реактивность в существующее jQuery-приложение без полной миграции, сборки и новой экосистемы. Он хорош как эволюционный слой: отдельные виджеты можно переписывать постепенно.',
				},
				{
					kind: 'cards',
					title: 'MC хорошо подходит',
					cards: [
						{
							title: 'Legacy jQuery интерфейсы',
							text: 'Когда уже есть jQuery, серверные страницы и много существующего DOM-кода.',
						},
						{
							title: 'Постепенная реактивность',
							text: 'Можно начать с одного компонента или модального окна, не меняя весь frontend stack.',
						},
						{
							title: 'Виджеты без сборки',
							text: 'Подключили script после jQuery и смонтировали $.MC(...) на странице.',
						},
						{
							title: 'Императивные зоны',
							text: 'Canvas, video, карты, старые плагины и ручной DOM можно аккуратно оставить через MC.host().',
						},
					],
				},
				{
					kind: 'cards',
					title: 'Где MC не лучший выбор',
					cards: [
						{
							title: 'Новая большая SPA с экосистемой',
							text: 'Если нужны router, SSR, огромная библиотека компонентов и tooling, React/Vue/Svelte будут естественнее.',
						},
						{
							title: 'Команда ожидает JSX/TSX',
							text: 'MC работает с jQuery builders. Это плюс для legacy, но не всем нравится как основной UI DSL.',
						},
						{
							title: 'Сложный global state domain',
							text: 'MC.uState достаточно прост. Для больших доменных моделей может понадобиться отдельный state manager.',
						},
						{
							title: 'Нужна строгая декларативность',
							text: 'MC допускает императивный DOM. Это практично, но требует дисциплины в архитектуре.',
						},
					],
				},
				{
					kind: 'callout',
					tone: 'important',
					title: 'Честное позиционирование',
					text: 'MC - не “просто helper” и не замена всей современной frontend-экосистемы. Это компактный UI runtime для тех мест, где jQuery уже живет, а реактивная модель уже нужна.',
				},
			],
		},
		{
			id: 'render-contract',
			group: 'Компоненты',
			title: 'Контракт render()',
			short: 'render()',
			summary: 'Что принимает render() и какие значения можно возвращать.',
			keywords: ['render', 'return', 'fragment', 'null', 'documentfragment'],
			blocks: [
				{
					kind: 'text',
					title: 'Сигнатура',
					text: [
						'Для class component render вызывается как render(states, props, vdom). states - объект троек [value, setter, stateRef], props - shallow copy переданного объекта, vdom - внутреннее описание экземпляра.',
						'Для function container функция вызывается как fn(values, props), где values - массив текущих значений зависимых состояний.',
					],
				},
				{
					kind: 'table',
					title: 'Допустимые return-значения',
					columns: ['Значение', 'Как трактуется'],
					rows: [
						['jQuery-объект', 'Обычный путь: return $("<div>").append(...).'],
						['HTMLElement', 'Можно вернуть сырой DOM-узел.'],
						['DocumentFragment', 'MC обернет его в <mc style="display:contents">. Удобно через $("</>").'],
						['$.MC(Child, ...)', 'Дочерний компонент будет обернут, чтобы VDOM не делил один DOM-узел.'],
						['null / undefined', 'Будет создан скрытый пустой <mc>. Это нормальный способ условно ничего не рисовать.'],
						['Тот же DOM-элемент, что и раньше', 'Persistent DOM: diff пропускается, элемент управляется компонентом вручную.'],
					],
				},
				{
					kind: 'code',
					title: 'Несколько корневых узлов через fragment',
					lang: 'js',
					code: code`
						class Toolbar extends MC {
							render() {
								return $('</>').append(
									$('<button type="button">').text('Save'),
									$('<button type="button">').text('Cancel')
								);
							}
						}
					`,
				},
				{
					kind: 'code',
					title: 'Условный пустой render',
					lang: 'js',
					code: code`
						class Modal extends MC {
							render({}, { isOpen }) {
								if (!isOpen) {
									return null;
								}

								return $('<div>').addClass('modal');
							}
						}
					`,
				},
			],
		},
		{
			id: 'class-components',
			group: 'Компоненты',
			title: 'Class components',
			short: 'Классы',
			summary: 'Constructor, props, локальные поля и методы компонента.',
			keywords: ['class', 'extends MC', 'constructor', 'props', 'methods'],
			blocks: [
				{
					kind: 'text',
					title: 'Создание экземпляра',
					text: [
						'MC создает компонент через new Component(props, context, uniquekey), затем присваивает instance.mc, instance.uniquekey и parentKey. Поэтому constructor может принимать props, если компоненту нужны начальные параметры до первого render().',
						'Локальные состояния лучше создавать только в constructor. Нереактивные поля тоже можно хранить на this: кэши, сервисы, socket instances, lock-флаги, ссылки на внешние контроллеры.',
					],
				},
				{
					kind: 'code',
					title: 'Компонент с props в constructor',
					lang: 'js',
					code: code`
						class DataProvider extends MC {
							constructor({ initialQuery }) {
								super();
								this.isLoadingState = super.state(true);
								this.itemsState = super.state([]);

								if (initialQuery) {
									this.query = initialQuery;
								}
							}

							render({ isLoadingState, itemsState }) {
								const [isLoading] = isLoadingState;
								const [items] = itemsState;

								return $('<div>').text(
									isLoading ? 'Loading...' : 'Items: ' + items.length
								);
							}
						}
					`,
				},
				{
					kind: 'list',
					title: 'Практические правила',
					items: [
						'Методы компонента можно вызывать из обработчиков: .on("click", () => this.reload()).',
						'Асинхронные операции обычно пишут результат в локальный state через this.someState.set(value).',
						'Если компонент подписался на window/document/socket вручную, снимайте подписки в unmounted().',
						'Для нескольких экземпляров одного класса рядом почти всегда нужен явный key.',
					],
				},
			],
		},
		{
			id: 'state',
			group: 'Состояния',
			title: 'MCState и локальное состояние',
			short: 'State',
			summary: 'super.state(), state.set(), state.get(), state.peek() и модель обновлений.',
			keywords: ['state', 'MCState', 'get', 'set', 'peek', 'deep clone', 'batch'],
			blocks: [
				{
					kind: 'lead',
					text: 'MCState - единица реактивности. Компонент подписывается на состояния, которые попали в его normalized.states. При изменении state runtime обновляет подписчиков и эффекты.',
				},
				{
					kind: 'table',
					title: 'Методы MCState',
					columns: ['Метод', 'Описание'],
					rows: [
						['set(value)', 'Устанавливает новое значение, если оно отличается. Планирует batched flush.'],
						['get()', 'Возвращает глубокую копию значения. Безопасно мутировать копию перед set().'],
						['peek()', 'Возвращает текущее значение без копирования. Быстрее, но результат нельзя мутировать.'],
					],
				},
				{
					kind: 'code',
					title: 'Обновление массива',
					lang: 'js',
					code: code`
						addItem(title) {
							const items = this.itemsState.get(); // deep clone
							items.push({ id: Date.now(), title });
							this.itemsState.set(items);
						}

						countItemsFast() {
							return this.itemsState.peek().length; // только чтение
						}
					`,
				},
				{
					kind: 'callout',
					tone: 'warning',
					title: 'Не мутируйте peek()',
					text: 'peek() нужен для быстрого чтения. Если изменить объект, полученный через peek(), MC не узнает об изменении, пока не будет вызван set() с новым значением.',
				},
				{
					kind: 'text',
					title: 'Сравнение значений',
					text: [
						'Перед flush MC проверяет, действительно ли значение изменилось. Для примитивов используется ===, для объектов есть быстрый shallow-path и fallback на deepEqual. Date, RegExp, Map и Set имеют отдельную обработку.',
						'Если новое значение глубоко равно старому, перерисовки не будет. Это полезно для защиты от лишних flush, но означает, что set() с эквивалентной копией ничего не изменит.',
					],
				},
			],
		},
		{
			id: 'global-state',
			group: 'Состояния',
			title: 'Глобальные состояния и data flow',
			short: 'uState',
			summary: 'MC.uState(), уникальные ключи и передача данных между независимыми частями интерфейса.',
			keywords: ['uState', 'global state', 'traceKey', 'forceUpdate', 'data flow'],
			blocks: [
				{
					kind: 'text',
					title: 'MC.uState(value, key, forceUpdate)',
					text: [
						'Глобальное состояние создается или переиспользуется по строковому ключу. Ключ обязателен. Если состояние уже существует, MC.uState вернет его же экземпляр.',
						'Третий аргумент forceUpdate заставляет существующее состояние получить новое значение через set(value). Без forceUpdate начальное value используется только при первом создании.',
					],
				},
				{
					kind: 'code',
					title: 'Глобальный флаг открытия',
					lang: 'js',
					code: code`
						class Entry {
							constructor() {
								this.isOpenState = MC.uState(false, 'is-open-panel');

								$(document.body).append(
									$.MC(([isOpen]) => {
										if (!isOpen) return null;
										return $.MC(Panel, {
											close: () => this.isOpenState.set(false),
										}, 'panel');
									}, [this.isOpenState], 'panel-gate')
								);
							}

							open() {
								this.isOpenState.set(true);
							}
						}
					`,
				},
				{
					kind: 'list',
					title: 'Передача состояния вниз',
					items: [
						'Локальный state нельзя передавать дочернему компоненту как dependency массива $.MC(Child, [localState]). MC специально логирует такую ошибку.',
						'Обычный путь: передайте value и setter через props.',
						'Если ребенку нужен именно stateRef для effect, передайте stateRef как обычный prop, а уже внутри ребенка используйте его в $.MC.effect(..., [stateRef]).',
						'Для состояния, которое должно быть общим для разных веток дерева, используйте MC.uState с уникальным ключом.',
					],
				},
				{
					kind: 'code',
					title: 'Передача value/setter/stateRef как props',
					lang: 'js',
					code: code`
						render({ selectedState }) {
							const [selected, setSelected, selectedRef] = selectedState;

							return $.MC(Child, {
								selected,
								setSelected,
								selectedRef,
							}, 'child');
						}

						class Child extends MC {
							render({}, { selectedRef }) {
								$.MC.effect(([selected]) => {
									console.log('selected changed', selected);
								}, [selectedRef]);

								return $('<div>');
							}
						}
					`,
				},
			],
		},
		{
			id: 'effects',
			group: 'Состояния',
			title: 'Effects',
			short: 'Effects',
			summary: '$.MC.effect и $.MC.deferredEffect: зависимости, cleanup и безопасные side effects.',
			keywords: ['effect', 'deferredEffect', 'cleanup', 'dependencies', 'side effect'],
			blocks: [
				{
					kind: 'lead',
					text: 'Effects нужны для side effects: запросов, синхронизации с внешними объектами, подписок, реакции на state changes. В зависимости передаются MCState-экземпляры, а callback получает массив их значений.',
				},
				{
					kind: 'code',
					title: 'Effect по состояниям',
					lang: 'js',
					code: code`
						render({ pickedEventState, isLoadingState }) {
							const [pickedEvent] = pickedEventState;
							const [isLoading] = isLoadingState;
							const [, , pickedEventRef] = pickedEventState;
							const [, , isLoadingRef] = isLoadingState;

							$.MC.effect(([nextPickedEvent, nextIsLoading]) => {
								if (nextIsLoading) return;
								this.loadEvent(nextPickedEvent);
							}, [pickedEventRef, isLoadingRef], 'load-picked-event');

							return $('<div>').text(pickedEvent);
						}
					`,
				},
				{
					kind: 'callout',
					tone: 'danger',
					title: 'Не передавайте обычные значения в deps',
					text: 'deps должны быть MCState-like объектами с get() и set(). Массив вида [count, label] не является корректной зависимостью для текущего MC.js.',
				},
				{
					kind: 'tabs',
					title: 'Effect deps: неверно и верно',
					tabs: [
						{
							id: 'wrong',
							title: 'Неверно',
							tone: 'danger',
							lang: 'js',
							caption: 'Так callback не подписан на MCState и может не сработать как ожидается.',
							code: code`
								render({ countState }) {
									const [count] = countState;

									$.MC.effect(([nextCount]) => {
										console.log(nextCount);
									}, [count]); // обычное число, не stateRef

									return $('<div>').text(count);
								}
							`,
						},
						{
							id: 'right',
							title: 'Верно',
							tone: 'good',
							lang: 'js',
							caption: 'Третий элемент tuple - это тот же MCState, подходящий для deps.',
							code: code`
								render({ countState }) {
									const [count, setCount, countRef] = countState;

									$.MC.effect(([nextCount]) => {
										console.log(nextCount);
									}, [countRef], 'count-effect');

									return $('<button type="button">')
										.text(count)
										.on('click', () => setCount(count + 1));
								}
							`,
						},
					],
				},
				{
					kind: 'table',
					title: 'Варианты эффекта',
					columns: ['Вызов', 'Когда запускается'],
					rows: [
						['$.MC.effect(fn, [stateRef])', 'После DOM-коммита, когда изменилось одно из зависимых состояний.'],
						['$.MC.effect(fn, [])', 'Один раз при создании effect. Обычный effect запускается синхронно.'],
						['$.MC.deferredEffect(fn, [])', 'Один раз после полного flush, mounted() и актуализации refs.'],
						['$.MC.deferredEffect(fn, [stateRef])', 'После изменения deps, но отложенно до конца всех каскадных flush.'],
					],
				},
				{
					kind: 'code',
					title: 'Cleanup при unmount',
					lang: 'js',
					code: code`
						render({ openState }) {
							const [, , openRef] = openState;

							$.MC.effect(([isOpen]) => {
								if (!isOpen) return;

								const onResize = () => this.remeasure();
								window.addEventListener('resize', onResize);

								return () => {
									window.removeEventListener('resize', onResize);
								};
							}, [openRef], 'resize-while-open');

							return $('<div>');
						}
					`,
				},
			],
		},
		{
			id: 'function-containers',
			group: 'Компоненты',
			title: 'Function containers и memo',
			short: 'FC и memo',
			summary: 'Функциональные контейнеры, зависимости и отличие от class components.',
			keywords: ['function container', 'memo', '$.MC.memo', 'deps'],
			blocks: [
				{
					kind: 'text',
					title: 'Когда использовать',
					text: [
						'Function container - это функция, которую MC подписывает на массив состояний. Она хороша для небольших reactive wrappers: условный gate, короткий derived view, интеграционный слой вокруг глобального state.',
						'Если компоненту нужны lifecycle, локальные states или много методов, используйте class component.',
					],
				},
				{
					kind: 'code',
					title: 'Gate-компонент как в entrypoint',
					lang: 'js',
					code: code`
						const isOpenState = MC.uState(false, 'is-open-app');

						$(document.documentElement).append(
							$.MC(([isOpen]) => {
								if (!isOpen) return null;

								return $.MC(App, {
									close: () => isOpenState.set(false),
								}, 'app-root');
							}, [isOpenState], 'app-gate')
						);
					`,
				},
				{
					kind: 'callout',
					tone: 'warning',
					title: 'deps обязательны',
					text: 'createFunctionContainer логирует ошибку, если dependency array пустой или отсутствует. Для статического UI используйте class component или обычную jQuery-разметку.',
				},
				{
					kind: 'text',
					title: '$.MC.memo',
					text: [
						'$.MC.memo работает поверх function container. Если контейнер уже существует, memo возвращает текущий HTML без немедленного rerender. Реактивные изменения все равно приходят через подписанные states.',
						'Для повторяющихся function containers используйте явный key. Ключ FC строится из текста функции и iteratorKey; одинаковые inline-функции без key могут конфликтовать.',
					],
				},
			],
		},
		{
			id: 'keys',
			group: 'Компоненты',
			title: 'Ключи и identity',
			short: 'Keys',
			summary: 'Как MC понимает, что это тот же компонент, и когда explicit key обязателен.',
			keywords: ['key', 'identity', 'list', 'same component', 'siblings'],
			blocks: [
				{
					kind: 'lead',
					text: 'Ключ определяет identity компонента в дереве. От него зависит, сохранится ли локальный state, будет ли вызван unmounted(), и какой DOM-узел diff будет патчить.',
				},
				{
					kind: 'text',
					title: 'Автоматический ключ',
					text: [
						'Если key не передан, MC генерирует его из component, набора prop-ключей, state-ключей и context. Значения props в этот ключ не входят.',
						'Это удобно для одиночных компонентов, но опасно для двух одинаковых sibling-компонентов с одинаковой формой props.',
					],
				},
				{
					kind: 'code',
					title: 'Правильно: key в списке',
					lang: 'js',
					code: code`
						render({}, { users }) {
							return $('<div>').append(
								users.map((user) =>
									$.MC(UserCard, { user }, 'user-' + user.id)
								)
							);
						}
					`,
				},
				{
					kind: 'code',
					title: 'Правильно: key для условных providers',
					lang: 'js',
					code: code`
						return $('<div>').append(
							currentMode === 'list' &&
								$.MC(ListProvider, props, 'workspace-list-provider'),

							currentMode === 'details' &&
								$.MC(DetailsProvider, props, 'workspace-details-provider')
						);
					`,
				},
				{
					kind: 'list',
					title: 'Когда key обязателен',
					items: [
						'В списках и map().',
						'У двух и более одинаковых компонентов рядом.',
						'У условно переключаемых крупных веток UI.',
						'У компонентов, чей локальный state должен быть привязан к конкретной сущности.',
						'У function containers, если одна и та же функция используется больше одного раза.',
					],
				},
			],
		},
		{
			id: 'lifecycle',
			group: 'Компоненты',
			title: 'Lifecycle',
			short: 'Lifecycle',
			summary: 'mounted(), updated(), unmounted() и момент, когда компонент считается подключенным.',
			keywords: ['mounted', 'updated', 'unmounted', 'cleanup', 'dom observer'],
			blocks: [
				{
					kind: 'table',
					title: 'Lifecycle methods',
					columns: ['Метод', 'Когда вызывается'],
					rows: [
						['mounted(states, props, vdom)', 'После того как DOM компонента подключен к document. refs уже доступны.'],
						['updated(prevHTML, currentHTML, vdom)', 'После повторного render/diff, если компонент уже mounted и DOM подключен.'],
						['unmounted(states, props, vdom)', 'При cleanup компонента: удаление из DOM, замена identity, очистка observer-ом.'],
					],
				},
				{
					kind: 'callout',
					tone: 'important',
					title: 'Про updated()',
					text: 'В type declarations updated описан как states/props/vdom, но текущий MC.js вызывает instance.updated(prevHTML, currentHTML, vdom). В документации для текущей реализации лучше опираться на фактическое поведение.',
				},
				{
					kind: 'code',
					title: 'Подписка на window',
					lang: 'js',
					code: code`
						class HotkeyPanel extends MC {
							constructor() {
								super();
								this._onKeydown = (event) => {
									if (event.code === 'Escape') this.close();
								};
							}

							mounted() {
								window.addEventListener('keydown', this._onKeydown, true);
							}

							unmounted() {
								window.removeEventListener('keydown', this._onKeydown, true);
							}

							render() {
								return $('<div>').addClass('panel');
							}
						}
					`,
				},
				{
					kind: 'text',
					title: 'Mount и внешнее добавление в DOM',
					text: [
						'$.MC(...) может создать DOM-узел до того, как он окажется в document. MC хранит такие roots в pending set и через MutationObserver вызывает mounted после подключения.',
						'Если MC-узел удалили внешним jQuery-кодом, observer собирает удаленную подветку и вызывает cleanup для function containers, class components, refs и effects.',
					],
				},
			],
		},
		{
			id: 'refs-host',
			group: 'DOM',
			title: 'Refs, host и императивный DOM',
			short: 'Refs и host',
			summary: 'MC.ref(), MC.host(), canvas/video и сторонние библиотеки.',
			keywords: ['ref', 'host', 'canvas', 'video', 'imperative dom', 'persistent dom'],
			blocks: [
				{
					kind: 'lead',
					text: 'MC не заставляет весь DOM быть декларативным. Для canvas, video, map widgets, editors и legacy plugins можно получить DOM-ссылку и управлять частью дерева вручную.',
				},
				{
					kind: 'table',
					title: 'API',
					columns: ['API', 'Что делает'],
					rows: [
						['MC.ref(jqOrEl, callback)', 'callback(el) при подключении и callback(null) при detach/replace.'],
						['MC.ref(jqOrEl, refObject)', 'Пишет element в refObject.current и очищает current при detach.'],
						['MC.host(jqOrEl, ref?)', 'Помечает элемент как host: MC обновляет сам host, но не diff-ит его children.'],
					],
				},
				{
					kind: 'code',
					title: 'Canvas с MC.host',
					lang: 'js',
					code: code`
						class BBoxCanvas extends MC {
							draw(canvas, boxes) {
								const ctx = canvas.getContext('2d');
								ctx.clearRect(0, 0, canvas.width, canvas.height);
								// draw boxes...
							}

							render({}, { boxes }) {
								return MC.host(
									$('<canvas>').addClass('bbox-canvas'),
									(canvas) => {
										if (canvas) this.draw(canvas, boxes);
									}
								);
							}
						}
					`,
				},
				{
					kind: 'code',
					title: 'Object ref',
					lang: 'js',
					code: code`
						class FocusInput extends MC {
							constructor() {
								super();
								this.inputRef = { current: null };
							}

							mounted() {
								this.inputRef.current?.focus();
							}

							render() {
								return MC.ref($('<input type="text">'), this.inputRef);
							}
						}
					`,
				},
				{
					kind: 'callout',
					tone: 'warning',
					title: 'host отключает diff детей',
					text: 'Если элемент помечен MC.host(), все дочерние узлы внутри него остаются под вашей ответственностью. Это правильно для video/canvas/plugin roots, но не для обычной декларативной верстки.',
				},
			],
		},
		{
			id: 'events-forms',
			group: 'DOM',
			title: 'События и формы',
			short: 'Events',
			summary: 'jQuery events, diff обработчиков, input/select/checkbox особенности.',
			keywords: ['events', 'on', 'bind', 'forms', 'input', 'select', 'checkbox'],
			blocks: [
				{
					kind: 'text',
					title: 'События через jQuery',
					text: [
						'MC патчит $.fn.on или $.fn.bind и сохраняет обработчики в __mcEvents. Поэтому события, добавленные через .on() внутри render(), участвуют в diff и корректно снимаются/добавляются.',
						'Нативные addEventListener используйте в mounted/unmounted, если это подписка на window/document или внешний объект.',
					],
				},
				{
					kind: 'code',
					title: 'Controlled input',
					lang: 'js',
					code: code`
						class SearchBox extends MC {
							constructor() {
								super();
								this.queryState = super.state('');
							}

							render({ queryState }) {
								const [query, setQuery] = queryState;

								return $('<input type="search">')
									.val(query)
									.attr('placeholder', 'Search')
									.on('input', (event) => setQuery(event.target.value));
							}
						}
					`,
				},
				{
					kind: 'list',
					title: 'Что diff учитывает для форм',
					items: [
						'Для input/textarea/select значение синхронизируется через DOM property value и attribute value.',
						'Для select MC дополнительно выставляет selected у option.',
						'Для checkbox/radio checked обрабатывается отдельно через property checked и attribute checked.',
						'Если вы управляете формой сторонним plugin-ом, вынесите root в MC.host().',
					],
				},
			],
		},
		{
			id: 'diff',
			group: 'DOM',
			title: 'DOM diff и flush',
			short: 'Diff',
			summary: 'Как MC обновляет DOM, сортирует dirty states и запускает эффекты.',
			keywords: ['diff', 'flush', 'batch', 'dirty', 'dom commit', 'mutation observer'],
			blocks: [
				{
					kind: 'text',
					title: 'Flush pipeline',
					text: [
						'state.set() добавляет state.id в очередь и планирует microtask. Все синхронные set() в одном тике обычно попадают в один flush.',
						'Во flush MC собирает dirty states, сортирует глобальные перед локальными, а локальные - deep-first. Затем дедуплицирует подписанные function containers, components и effects.',
						'Сначала выполняется DOM diff, потом обычные effects. Deferred effects запускаются еще позже: после завершения всех re-flush циклов.',
					],
				},
				{
					kind: 'cards',
					title: 'Что сравнивает diff',
					cards: [
						{ title: 'Node type/name', text: 'При смене типа узла или tagName происходит replace.' },
						{ title: 'Attributes', text: 'Обычные атрибуты, value и checked имеют отдельные правила.' },
						{ title: 'Style/class', text: 'style и class сравниваются как строки атрибутов.' },
						{ title: 'Events', text: 'jQuery handlers diff-ятся через snapshot __mcEvents.' },
						{ title: 'Children', text: 'MC-компоненты матчятся как keyed children, остальное позиционно.' },
						{ title: 'Refs', text: 'ref callbacks/object refs переносятся и очищаются при detach.' },
					],
				},
				{
					kind: 'callout',
					tone: 'important',
					title: 'Защита от бесконечного цикла',
					text: 'MC.MAX_REFLUSH по умолчанию равен 100. Если render() или effect без условия постоянно вызывает set(), runtime остановит цикл и выведет ошибку.',
				},
			],
		},
		{
			id: 'performance',
			group: 'Практика',
			title: 'Производительность',
			short: 'Performance',
			summary: 'Батчинг, тяжелые компоненты, debug timing и persistent DOM.',
			keywords: ['performance', 'batch', 'debug', 'slow flush', 'persistent dom'],
			blocks: [
				{
					kind: 'text',
					title: 'Батчинг',
					text: [
						'Синхронные set() автоматически собираются в microtask. Для async-контекстов можно явно обернуть серию обновлений в MC.batch(fn), чтобы запланировать один flush после fn.',
					],
				},
				{
					kind: 'code',
					title: 'MC.batch',
					lang: 'js',
					code: code`
						MC.batch(() => {
							this.isLoadingState.set(true);
							this.errorState.set(false);
							this.itemsState.set([]);
						});
					`,
				},
				{
					kind: 'list',
					title: 'Практические приемы',
					items: [
						'Дробите большие экраны на компоненты с явными keys.',
						'Не создавайте тяжелые DOM-поддеревья в render без необходимости.',
						'Для canvas/video/map/editor используйте persistent DOM или MC.host().',
						'Передавайте в props только нужные значения, а не крупные mutable объекты без причины.',
						'Включайте MC.debugMode = true на стенде, чтобы видеть slow flush и тяжелые элементы.',
					],
				},
				{
					kind: 'callout',
					tone: 'important',
					title: 'Slow flush warning',
					text: 'При debugMode runtime логирует длительность flush. Если flush дольше 16ms, MC предупреждает и показывает самые тяжелые components/effects/function containers.',
				},
			],
		},
		{
			id: 'mc-lab',
			group: 'Лаборатория',
			title: 'MC Lab',
			short: 'MC Lab',
			summary: 'Живой стенд: event, state.set, flush, render, diff и effect в одном цикле.',
			keywords: ['lab', 'runtime', 'cycle', 'flush', 'interactive', 'state', 'effect'],
			blocks: [
				{
					kind: 'lead',
					text: 'MC Lab показывает цикл обновления как runtime-сцену: нажмите действие, посмотрите trace, состояние, preview DOM и effect-log. Документация здесь сама становится MC-компонентом, который объясняет MC.',
				},
				{
					kind: 'lab',
					title: 'Runtime cycle lab',
				},
			],
		},
		{
			id: 'visual-diff',
			group: 'Лаборатория',
			title: 'Visual Diff Simulator',
			short: 'Visual Diff',
			summary: 'Сравнение старого и нового DOM-образа: что MC сохраняет, патчит или заменяет.',
			keywords: ['diff', 'visual', 'dom', 'patch', 'keyed', 'replace', 'attributes'],
			blocks: [
				{
					kind: 'lead',
					text: 'Diff легче понять как набор решений. Runtime смотрит на старый и новый DOM-образ, сохраняет совместимые узлы, обновляет точечные отличия и заменяет ветку только там, где identity уже другая.',
				},
				{
					kind: 'diff-simulator',
					title: 'DOM patch decisions',
				},
			],
		},
		{
			id: 'identity-playground',
			group: 'Лаборатория',
			title: 'Identity Playground',
			short: 'Identity',
			summary: 'Сравнение position keys и entity keys: где остается локальный state.',
			keywords: ['identity', 'key', 'local state', 'list', 'position', 'entity'],
			blocks: [
				{
					kind: 'lead',
					text: 'Самая частая магия MC - это не render, а identity. Эта площадка специально показывает, как локальный state ведет себя при перестановке списка, если ключ привязан к позиции или к сущности.',
				},
				{
					kind: 'identity-playground',
					title: 'Position key vs entity key',
				},
			],
		},
		{
			id: 'rosetta-stone',
			group: 'Лаборатория',
			title: 'Rosetta Stone',
			short: 'Rosetta',
			summary: 'Одна задача тремя языками: ручной jQuery, MC и React-like ошибка.',
			keywords: ['rosetta', 'jquery', 'migration', 'react', 'mistake', 'translation'],
			blocks: [
				{
					kind: 'lead',
					text: 'Rosetta Stone переводит привычные frontend-рефлексы на язык MC. Здесь одна маленькая задача показана как ручная DOM-мутация, как правильный MC-компонент и как ошибка мышления из другой экосистемы.',
				},
				{
					kind: 'rosetta',
					title: 'Одна задача, три подхода',
				},
			],
		},
		{
			id: 'runtime-tree',
			group: 'Лаборатория',
			title: 'Runtime Tree Viewer',
			short: 'Runtime Tree',
			summary: 'Живое дерево component/function/effect коллекций текущей страницы документации.',
			keywords: ['runtime tree', 'component tree', 'iMC', 'componentCollection', 'effectCollection', 'fcCollection'],
			blocks: [
				{
					kind: 'lead',
					text: 'Этот viewer смотрит прямо в window.iMC и показывает, как текущая документация собрана из MC-компонентов, function containers и effects. Это диагностический слой: он ничего не меняет в runtime, только читает коллекции.',
				},
				{
					kind: 'component-tree',
					title: 'Live MC collections',
				},
			],
		},
		{
			id: 'live-demos',
			group: 'Практика',
			title: 'Живые мини-демо',
			short: 'Демо',
			summary: 'Маленькие интерактивные примеры, которые показывают state, effects и MC.host прямо на странице.',
			keywords: ['demo', 'counter', 'effect', 'host', 'canvas', 'interactive'],
			blocks: [
				{
					kind: 'lead',
					text: 'Эти блоки не являются отдельным стендом. Они маленькие специально: каждый показывает одну механику MC и рядом легко сопоставляется с остальной документацией.',
				},
				{
					kind: 'demo',
					demo: 'counter',
					title: 'State + render',
					text: 'Кнопка меняет локальный state. render получает новое значение и MC патчит DOM.',
				},
				{
					kind: 'demo',
					demo: 'effect-log',
					title: 'Effect по stateRef',
					text: 'Effect подписан на третий элемент tuple. При изменении count он добавляет запись в локальный лог.',
				},
				{
					kind: 'demo',
					demo: 'host-canvas',
					title: 'MC.host + canvas',
					text: 'Canvas остается императивной зоной. MC не diff-ит его children, а компонент сам перерисовывает содержимое через ref.',
				},
				{
					kind: 'demo',
					demo: 'keyed-list',
					title: 'Keyed list и локальный state',
					text: 'Карточки можно переставлять, а их внутренний счетчик остается при своей сущности, потому что key построен от item.id.',
				},
				{
					kind: 'demo',
					demo: 'batching',
					title: 'Несколько set() в один flush',
					text: 'Три состояния меняются в одном обработчике. MC группирует синхронные изменения, и экран обновляется одним проходом.',
				},
				{
					kind: 'demo',
					demo: 'state-boundary',
					title: 'Граница локального состояния',
					text: 'Изменение props сохраняет локальный state ребенка, а смена key создает новый экземпляр и сбрасывает его локальное состояние.',
				},
			],
		},
		{
			id: 'debugging',
			group: 'Практика',
			title: 'Отладка',
			short: 'Debug',
			summary: 'Логи, типичные ошибки и window.iMC для диагностики.',
			keywords: ['debug', 'logs', 'iMC', 'errors', 'warnings'],
			blocks: [
				{
					kind: 'table',
					title: 'Логирование',
					columns: ['Настройка', 'Поведение'],
					rows: [
						['MC.debugMode = false', 'По умолчанию видны error и warn.'],
						['MC.debugMode = true', 'Дополнительно видны info/debug, flush timing и slow flush diagnostics.'],
						['MC.MAX_REFLUSH', 'Лимит каскадных flush перед ошибкой бесконечного цикла.'],
						['window.iMC', 'Root instance: коллекции states, components, function containers, effects.'],
					],
				},
				{
					kind: 'list',
					title: 'Частые сообщения',
					items: [
						'Пустой компонент: первый аргумент $.MC оказался null/undefined.',
						'Неизвестный тип компонента: передан экземпляр, объект или результат вызова вместо function/class.',
						'Неправильное назначение: локальный state передан дочернему компоненту как dependency.',
						'state.set() вызван напрямую в render(): высокий риск бесконечного цикла.',
						'Ошибка чтения массива состояний: function container создан без dependency array.',
					],
				},
				{
					kind: 'code',
					title: 'Быстрая диагностика в консоли',
					lang: 'js',
					code: code`
						MC.debugMode = true;

						// Все состояния:
						MC.getState();

						// Конкретное глобальное состояние:
						MC.getState('widget:is-open');

						// Внутренние коллекции:
						iMC.componentCollection;
						iMC.effectCollection;
					`,
				},
			],
		},
		{
			id: 'architecture-patterns',
			group: 'Практика',
			title: 'Архитектурные паттерны',
			short: 'Архитектура',
			summary: 'Нейтральные схемы для entrypoint, app shell, provider-like веток и stateRef bridges.',
			keywords: ['architecture', 'entrypoint', 'app shell', 'provider', 'bridge', 'stateRef', 'gate'],
			blocks: [
				{
					kind: 'text',
					title: 'Entrypoint без наследования от MC',
					text: [
						'Внешняя точка входа может быть обычным JS-классом или функцией. Ей не обязательно наследоваться от MC: достаточно создать глобальные states, подписать горячие клавиши или внешние события и смонтировать gate function container.',
						'Gate подписан на глобальные states. Когда виджет закрыт, он возвращает null. Когда открыт - возвращает корневой $.MC(AppShell, ...).',
					],
				},
				{
					kind: 'code',
					title: 'Gate pattern',
					lang: 'js',
					code: code`
						class WidgetEntry {
							constructor() {
								this.isOpenState = MC.uState(false, 'widget:is-open');
								this.startParams = null;

								$(document.documentElement).append(
									$.MC(([isOpen]) => {
										if (!isOpen) return null;

										return $.MC(AppShell, {
											params: this.startParams,
											close: () => this.isOpenState.set(false),
										}, 'widget-app-shell');
									}, [this.isOpenState], 'widget-gate')
								);
							}

							open(params = null) {
								this.startParams = params;
								this.isOpenState.set(true);
							}
						}
					`,
				},
				{
					kind: 'text',
					title: 'App shell как владелец состояния',
					text: [
						'Корневой компонент удобно делать владельцем app-level состояния: mode, selectedItem, filters, loading, openedPanel. Дочерним компонентам он передает обычные props: value, setter callbacks и, при необходимости, stateRef.',
						'Если дочерняя ветка должна реагировать на изменение родительского state через $.MC.effect, передавайте третий элемент tuple как обычный prop. Это не нарушает правило о запрете local state в child dependencies, потому что dependency создается уже внутри дочернего компонента.',
					],
				},
				{
					kind: 'code',
					title: 'value/setter/stateRef bridge',
					lang: 'js',
					code: code`
						class AppShell extends MC {
							constructor() {
								super();
								this.modeState = super.state('list');
								this.selectedItemState = super.state(null);
							}

							render({ modeState, selectedItemState }) {
								const [mode, setMode] = modeState;
								const [selectedItem, setSelectedItem, selectedItemRef] = selectedItemState;

								return $('<div>').append(
									$.MC(Tabs, { mode, setMode }, 'tabs'),

									mode === 'list' &&
										$.MC(ListProvider, {
											selectedItem,
											setSelectedItem,
											selectedItemRef,
										}, 'list-provider'),

									mode === 'details' &&
										$.MC(DetailsProvider, {
											selectedItem,
											selectedItemRef,
										}, 'details-provider')
								);
							}
						}
					`,
				},
				{
					kind: 'list',
					title: 'Почему это хороший базовый паттерн',
					items: [
						'AppShell остается владельцем app-level state.',
						'Дочерние ветки не получают local states как child deps, значит не нарушают ограничение MC.',
						'Provider-like компоненты могут использовать переданный stateRef внутри своих effects.',
						'Крупные ветки имеют стабильные keys: tabs, list-provider, details-provider, modal-host.',
						'External listeners добавляются в mounted и снимаются в unmounted.',
					],
				},
				{
					kind: 'callout',
					tone: 'important',
					title: 'Provider-like не значит context',
					text: 'В MC provider часто означает просто крупный компонент-ветку, который инкапсулирует загрузку, локальные states и методы. Для этого не нужен специальный Context API: обычно достаточно props, callbacks и stateRef bridges.',
				},
			],
		},
		{
			id: 'context',
			group: 'API',
			title: 'Context',
			short: 'Context',
			summary: 'MC.uContext и текущее состояние context API.',
			keywords: ['context', 'uContext', 'advanced'],
			blocks: [
				{
					kind: 'text',
					title: 'Что есть в текущем MC.js',
					text: [
						'MC.uContext(key) создает или возвращает MCcontext по ключу. normalizeArgs умеет распознать context и передать его в constructor компонента, а key generation учитывает context.',
						'В большинстве интерфейсов context не нужен. Для обычной передачи данных предпочтительнее props, stateRef через props или MC.uState: эти механики проще читать, тестировать и отлаживать.',
					],
				},
				{
					kind: 'code',
					title: 'Базовая форма',
					lang: 'js',
					code: code`
						const appContext = MC.uContext('app-context');

						class Panel extends MC {
							constructor(props, context) {
								super();
								this.context = context;
							}

							render() {
								return $('<div>').text(this.context?.key || 'no context');
							}
						}

						$('#root').append(
							$.MC(Panel, appContext, { title: 'Panel' }, 'panel')
						);
					`,
				},
				{
					kind: 'callout',
					tone: 'warning',
					title: 'Используйте осторожно',
					text: 'Context API в MC.js ниже уровнем, чем state/effect/component API. Если нет явной причины, документируйте и используйте props/uState: они понятнее и лучше представлены в живом коде проекта.',
				},
			],
		},
		{
			id: 'api-reference',
			group: 'API',
			title: 'API reference',
			short: 'Reference',
			summary: 'Сводная таблица публичного API текущего MC.js.',
			keywords: ['api', 'reference', 'methods', 'static'],
			blocks: [
				{
					kind: 'table',
					title: 'Static MC API',
					columns: ['API', 'Описание'],
					rows: [
						['MC.init()', 'Идемпотентный bootstrap. Обычно auto-init уже сделал работу.'],
						['MC.uState(value, key, forceUpdate?)', 'Создать/получить глобальный MCState по key.'],
						['MC.uContext(key)', 'Создать/получить MCcontext по key.'],
						['MC.getState(key?)', 'Получить массив состояний по traceKey или все states без key.'],
						['MC.getContext(key)', 'Получить context по key.'],
						['MC.ref(jqOrEl, cbOrRef)', 'Назначить callback/object ref на DOM-узел.'],
						['MC.host(jqOrEl, cbOrRef?)', 'Пометить DOM-узел как host и опционально назначить ref.'],
						['MC.batch(fn)', 'Подавить flush внутри fn и запланировать один flush после.'],
						['MC.enableFragmentShortSyntax()', 'Включить $("</>") как DocumentFragment. Обычно включается bootstrap-ом.'],
						['MC.disableFragmentShortSyntax()', 'Откатить patch fragment short syntax.'],
						['MC.debugMode', 'Флаг подробного логирования.'],
						['MC.MAX_REFLUSH', 'Лимит каскадных re-flush.'],
					],
				},
				{
					kind: 'table',
					title: '$.MC API',
					columns: ['API', 'Описание'],
					rows: [
						['$.MC(Component, props?, key?)', 'Создать или обновить class component. Возвращает DOM-узел.'],
						['$.MC(Component, [states], props?, key?)', 'Class component с внешними state dependencies. Не для local states вниз.'],
						['$.MC(fn, [states], props?, key?)', 'Function container. fn получает массив values и props.'],
						['$.MC.memo(fn, [states], props?, key?)', 'Мемоизированный function container.'],
						['$.MC.effect(fn, [states], key?)', 'Effect по MCState dependencies.'],
						['$.MC.deferredEffect(fn, [states], key?)', 'Effect после полного flush/mounted/refs.'],
					],
				},
				{
					kind: 'table',
					title: 'Instance API',
					columns: ['API', 'Описание'],
					rows: [
						['super.state(value)', 'Создать локальный MCState компонента.'],
						['render(states, props, vdom)', 'Вернуть jQuery/DOM/fragment/$.MC/null.'],
						['mounted(states, props, vdom)', 'Lifecycle после подключения DOM.'],
						['updated(prevHTML, currentHTML, vdom)', 'Lifecycle после обновления DOM в текущей реализации.'],
						['unmounted(states, props, vdom)', 'Lifecycle при cleanup компонента.'],
					],
				},
				{
					kind: 'table',
					title: 'MCState API',
					columns: ['API', 'Описание'],
					rows: [
						['state.set(value)', 'Обновить значение и запланировать flush, если значение изменилось.'],
						['state.get()', 'Получить deep clone.'],
						['state.peek()', 'Получить raw value для чтения без clone.'],
						['state.id', 'Внутренний UUID состояния.'],
						['state.traceKey / nameProp', 'Ключ/имя для диагностики и формирования states object.'],
					],
				},
			],
		},
		{
			id: 'pitfalls',
			group: 'Практика',
			title: 'Частые ошибки',
			short: 'Ошибки',
			summary: 'Что чаще всего ломает MC-приложения и как это исправлять.',
			keywords: ['pitfalls', 'errors', 'best practices', 'checklist'],
			blocks: [
				{
					kind: 'table',
					title: 'Ошибка -> исправление',
					columns: ['Симптом', 'Что сделать'],
					rows: [
						['Локальный state не передается ребенку', 'Передайте value/setter props или используйте глобальный MC.uState.'],
						['Effect не реагирует или логирует неверный state', 'Передавайте stateRef, а не value. Используйте третий элемент tuple.'],
						['Две карточки делят локальный state', 'Добавьте явный key каждому sibling/list item.'],
						['Бесконечный flush', 'Не вызывайте set() напрямую в render без условия. Перенесите side effect в обработчик или $.MC.effect.'],
						['Canvas/video сбрасывается diff-ом', 'Используйте MC.host или persistent DOM.'],
						['Подписка на window остается после закрытия', 'Снимайте listener в unmounted или возвращайте cleanup из effect.'],
						['Function container конфликтует в списке', 'Передайте iterator key последним аргументом.'],
						['Props изменились, но локальный state сохранился от старой сущности', 'Key должен отражать identity сущности, например item.id.'],
					],
				},
				{
					kind: 'callout',
					tone: 'warning',
					title: 'Это не React',
					text: 'В MC deps эффекта - это MCState, а не произвольные значения; render возвращает jQuery/DOM, а не JSX; локальный state нельзя прокинуть вниз как child dependency. Эти ограничения не случайны: они защищают identity и уменьшают неожиданные rerender-цепочки.',
				},
				{
					kind: 'do-dont',
					title: 'Быстрые правила',
					do: [
						{ title: 'Создавайте state в constructor', text: 'Так у экземпляра стабильная реактивная модель на весь lifecycle.' },
						{ title: 'Передавайте value/setter через props', text: 'Дочерние компоненты остаются простыми, а владелец state остается явным.' },
						{ title: 'Ставьте key на identity', text: 'В списках и условных ветках key должен соответствовать сущности, а не позиции.' },
						{ title: 'Выносите side effects из render', text: 'Используйте handlers, mounted/unmounted, effect или deferredEffect.' },
					],
					dont: [
						{ title: 'Не мутируйте peek()', text: 'peek() только для быстрого чтения. Для изменений берите get(), меняйте копию и вызывайте set().' },
						{ title: 'Не используйте deps как в React', text: 'В deps идут MCState/stateRef, а не count, object, callback или массив произвольных значений.' },
						{ title: 'Не давайте двум sibling одинаковую identity', text: 'Иначе локальный state и lifecycle могут переехать не туда.' },
						{ title: 'Не diff-ите plugin DOM', text: 'Для canvas, video, map/editor roots используйте MC.host().' },
					],
				},
				{
					kind: 'code',
					title: 'Плохо: set в render',
					lang: 'js',
					code: code`
						render({ readyState }) {
							const [ready, setReady] = readyState;

							if (!ready) {
								setReady(true); // риск re-flush loop
							}

							return $('<div>');
						}
					`,
				},
				{
					kind: 'code',
					title: 'Лучше: guarded effect',
					lang: 'js',
					code: code`
						render({ readyState }) {
							const [ready, setReady, readyRef] = readyState;

							$.MC.effect(([nextReady]) => {
								if (!nextReady) setReady(true);
							}, [readyRef], 'mark-ready');

							return $('<div>').text(String(ready));
						}
					`,
				},
			],
		},
		{
			id: 'recipes',
			group: 'Практика',
			title: 'Рецепты',
			short: 'Рецепты',
			summary: 'Готовые мини-паттерны для типовых задач.',
			keywords: ['recipes', 'patterns', 'modal', 'fetch', 'list', 'search'],
			blocks: [
				{
					kind: 'code',
					title: 'Модальное окно с open/close',
					lang: 'js',
					code: code`
						class ModalHost extends MC {
							constructor() {
								super();
								this.openState = super.state(false);
							}

							render({ openState }) {
								const [open, setOpen] = openState;

								return $('<div>').append(
									$('<button type="button">')
										.text('Open')
										.on('click', () => setOpen(true)),

									open && $.MC(Modal, {
										close: () => setOpen(false),
									}, 'modal')
								);
							}
						}
					`,
				},
				{
					kind: 'code',
					title: 'Асинхронная загрузка в mounted',
					lang: 'js',
					code: code`
						class UsersPanel extends MC {
							constructor() {
								super();
								this.usersState = super.state([]);
								this.loadingState = super.state(true);
								this.errorState = super.state(null);
							}

							async mounted() {
								try {
									const users = await QUERY.GET_Users();
									this.usersState.set(users);
								} catch (error) {
									this.errorState.set(error);
								} finally {
									this.loadingState.set(false);
								}
							}

							render({ usersState, loadingState, errorState }) {
								const [users] = usersState;
								const [loading] = loadingState;
								const [error] = errorState;

								if (loading) return $('<div>').text('Loading...');
								if (error) return $('<div>').text('Failed');

								return $('<ul>').append(
									users.map((user) => $('<li>').text(user.name))
								);
							}
						}
					`,
				},
				{
					kind: 'code',
					title: 'Поиск по локальному state',
					lang: 'js',
					code: code`
						class FilteredList extends MC {
							constructor() {
								super();
								this.queryState = super.state('');
							}

							render({ queryState }, { items }) {
								const [query, setQuery] = queryState;
								const normalized = query.trim().toLowerCase();
								const filtered = items.filter((item) =>
									item.title.toLowerCase().includes(normalized)
								);

								return $('<div>').append(
									$('<input type="search">')
										.val(query)
										.on('input', (event) => setQuery(event.target.value)),

									$('<div>').append(
										filtered.map((item) =>
											$.MC(ItemCard, { item }, 'item-' + item.id)
										)
									)
								);
							}
						}
					`,
				},
			],
		},
		{
			id: 'templates',
			group: 'Практика',
			title: 'Шаблоны кода',
			short: 'Шаблоны',
			summary: 'Копируемые заготовки для частых MC-сценариев.',
			keywords: ['templates', 'copy', 'starter', 'boilerplate', 'class component', 'effect'],
			blocks: [
				{
					kind: 'lead',
					text: 'Эта страница - быстрый набор стартовых форм. В каждом шаблоне оставлена только механика MC: компонент, effect, gate, async mounted или host-zone.',
				},
				{
					kind: 'template-grid',
					title: 'Выберите заготовку',
					templates: CODE_TEMPLATES,
				},
				{
					kind: 'callout',
					tone: 'important',
					title: 'Ключи лучше переименовывать сразу',
					text: 'В шаблонах ключи намеренно человеческие. После копирования дайте им имя конкретной области: widget-shell, user-row-42, report-filter-panel. Это сильно упрощает отладку identity.',
				},
			],
		},
		{
			id: 'cheatsheet',
			group: 'API',
			title: 'Краткая памятка',
			short: 'Памятка',
			summary: 'Самые частые формы вызовов в одном месте.',
			keywords: ['cheatsheet', 'summary', 'quick reference'],
			blocks: [
				{
					kind: 'code',
					title: 'Компоненты',
					lang: 'js',
					code: code`
						// Class component
						$.MC(Header, { title: 'Docs' }, 'docs-header')

						// Class component with external global state dependency
						$.MC(App, [isHideState], { props }, 'app')

						// Function container
						$.MC(([isOpen]) => {
							return isOpen ? $.MC(App, {}, 'app') : null;
						}, [isOpenState], 'app-gate')
					`,
				},
				{
					kind: 'code',
					title: 'State и effects',
					lang: 'js',
					code: code`
						// Local
						this.countState = super.state(0);

						// Global
						const openState = MC.uState(false, 'open-state');

						// In render
						const [count, setCount, countRef] = countState;

						// Effect
						$.MC.effect(([nextCount]) => {
							console.log(nextCount);
						}, [countRef], 'count-log');
					`,
				},
				{
					kind: 'code',
					title: 'Refs',
					lang: 'js',
					code: code`
						MC.ref($('<input>'), (input) => {
							if (input) input.focus();
						});

						MC.host($('<canvas>'), (canvas) => {
							if (canvas) draw(canvas);
						});
					`,
				},
			],
		},
	];

	const SPA_PRIMER_PAGE = {
		id: 'spa-primer',
		group: 'Старт',
		title: 'SPA-мышление с нуля',
		short: 'SPA с нуля',
		summary: 'Как думать об интерфейсе как о состоянии, даже если раньше вы писали только jQuery-скрипты.',
		keywords: ['spa', 'beginner', 'state', 'render', 'interface', 'новичок'],
		blocks: [
			{
				kind: 'lead',
				text: 'Чтобы пользоваться MC, не обязательно знать React, Vue или устройство больших SPA. Но важно понять один сдвиг мышления: интерфейс перестает быть набором разрозненных DOM-команд и становится отображением текущего состояния.',
			},
			{
				kind: 'text',
				title: 'Что такое SPA-подход простыми словами',
				text: [
					'В обычном серверном интерфейсе страница часто приходит уже готовой: пользователь нажал кнопку, сервер вернул новую HTML-страницу или кусок HTML. В jQuery-коде поверх такой страницы мы обычно ищем элементы через selector и вручную меняем текст, классы, атрибуты, видимость и обработчики.',
					'SPA-подход не обязательно означает один огромный сайт на React. В практическом смысле это подход, где часть страницы живет как маленькое приложение: у нее есть состояние, события меняют это состояние, а экран автоматически приводится к виду, который соответствует новому состоянию.',
					'MC дает именно такой маленький SPA-слой поверх jQuery. Он не требует сборки, JSX или router. Вы можете взять один виджет, описать его через component + state + render, и оставить остальную страницу обычной.',
				],
			},
			{
				kind: 'cards',
				title: 'Три слова, которые надо привыкнуть видеть',
				cards: [
					{
						title: 'State',
						text: 'Данные, от которых зависит внешний вид: открыт ли modal, выбранный item, строка поиска, список результатов, флаг loading.',
					},
					{
						title: 'Render',
						text: 'Функция, которая смотрит на текущее state/props и возвращает DOM-описание: что пользователь должен видеть прямо сейчас.',
					},
					{
						title: 'Effect',
						text: 'Побочное действие: запрос, подписка, запись в console, синхронизация со сторонним widget, реакция на изменение state.',
					},
					{
						title: 'Key',
						text: 'Имя identity компонента. Оно отвечает на вопрос: это тот же самый экземпляр или нужно создать новый?',
					},
				],
			},
			{
				kind: 'text',
				title: 'Главное отличие от ручного jQuery',
				text: [
					'В ручном jQuery код часто выглядит как цепочка действий: найти кнопку, найти блок, поменять текст, добавить класс, снять класс, показать loader, спрятать loader. Чем больше состояний у интерфейса, тем сложнее помнить, какие DOM-команды уже были выполнены и какие еще нужны.',
					'В MC вы стараетесь описывать не последовательность DOM-мутаций, а итоговую картину. Если loading=true, render возвращает loader. Если items пустой, render возвращает empty state. Если selectedItem есть, render возвращает details. Runtime сам сравнит старую и новую картину и применит минимальные изменения к DOM.',
				],
			},
			{
				kind: 'list',
				title: 'Как читать остальную документацию',
				items: [
					'Сначала прочитайте “Что такое MC”, “Ментальная модель” и “Первый компонент”. Не пытайтесь сразу запомнить все API.',
					'Когда видите render(), задавайте вопрос: “Какой DOM должен соответствовать текущим state и props?”.',
					'Когда видите state.set(), думайте: “Я не меняю DOM напрямую, я сообщаю runtime, что данные изменились”.',
					'Когда видите key, думайте про личность компонента: “Это та же карточка или новая карточка?”.',
					'Когда видите effect, проверяйте: “Это точно побочное действие, которое нельзя просто выразить через render?”.',
				],
			},
			{
				kind: 'callout',
				tone: 'important',
				title: 'MC можно учить постепенно',
				text: 'Не нужно сразу переписывать весь интерфейс. Самый безопасный путь: выбрать маленький виджет, сделать его class component, перенести одно состояние в super.state(), а потом расширять границу компонента только когда модель стала понятной.',
			},
		],
	};

	const BEGINNER_EXPANSIONS = {
		overview: [
			{
				kind: 'text',
				title: 'Зачем вообще нужен runtime',
				modes: ['learn', 'deep'],
				text: [
					'Runtime - это слой, который берет на себя повторяющуюся работу интерфейса: хранить связи между состояниями и компонентами, понимать, кому нужна перерисовка, вызывать lifecycle и аккуратно обновлять DOM. Без такого слоя эту работу обычно делают руками: хранить флаги в переменных, искать элементы selector-ами и помнить, какие куски UI нужно обновить после каждого события.',
					'MC маленький по сравнению с большими frontend-фреймворками, но по роли он делает именно runtime-работу. Поэтому его лучше воспринимать не как набор helper-функций, а как компактную реактивную среду внутри jQuery-страницы.',
				],
			},
			{
				kind: 'list',
				title: 'Какие проблемы MC закрывает для новичка',
				modes: ['learn'],
				items: [
					'Не нужно вручную синхронизировать все DOM-элементы после каждого изменения данных.',
					'Не нужно держать в голове, какие обработчики нужно снять при удалении виджета: lifecycle и cleanup дают для этого место.',
					'Не нужно придумывать свой mini-state-manager для каждого modal, filter panel или списка.',
					'Можно оставить jQuery builders, но получить предсказуемую модель state -> render -> diff.',
				],
			},
		],
		install: [
			{
				kind: 'text',
				title: 'Что происходит при загрузке страницы',
				modes: ['learn'],
				text: [
					'Сначала браузер загружает jQuery. После этого MC добавляет в jQuery функцию $.MC и несколько связанных API. С этого момента можно создавать компоненты и вставлять их в DOM так же, как вы вставляли обычные jQuery-элементы.',
					'Важно понимать, что $.MC(...) не заменяет весь document. Он возвращает DOM-узел компонента. Вы сами выбираете, куда его вставить: в #root, в body, в documentElement или внутрь существующей серверной страницы.',
				],
			},
			{
				kind: 'callout',
				tone: 'warning',
				title: 'Не смешивайте версии без причины',
				modes: ['learn', 'deep'],
				text: 'Документация описывает MicroComponent/MC.js. Если на странице случайно подключить другую версию MC или старый стендовый bundle, поведение lifecycle, diff или helper API может отличаться. Для новых виджетов держите один источник runtime на странице.',
			},
		],
		'mental-model': [
			{
				kind: 'text',
				title: 'Почему цикл важнее отдельных методов',
				modes: ['learn'],
				text: [
					'Новичку легко застрять на вопросе “какой метод вызвать?”. В MC полезнее сначала видеть общий цикл. Пользователь делает действие, действие меняет state, изменение state ставит компонент в очередь, render строит новую картину, diff применяет ее к DOM, effects реагируют после commit.',
					'Когда этот цикл понятен, отдельные API становятся естественными. super.state() создает данные для цикла. set() запускает цикл. render() описывает результат. effect() подключает внешнее действие к изменению данных.',
				],
			},
			{
				kind: 'list',
				title: 'Как не думать о render()',
				modes: ['learn'],
				items: [
					'Не думайте о render как о “функции, которая прямо сейчас перерисовывает всю страницу”.',
					'Не думайте о render как о месте для запросов, setInterval или window listeners.',
					'Не думайте о render как о цепочке “найти старый DOM и поправить его”.',
					'Думайте о render как о честном ответе на вопрос: “какой DOM соответствует текущему состоянию?”.',
				],
			},
		],
		'quick-start': [
			{
				kind: 'text',
				title: 'Разбор первого компонента по шагам',
				modes: ['learn'],
				text: [
					'constructor выполняется один раз при создании экземпляра компонента. Здесь удобно создать локальное состояние через super.state(0). Это состояние принадлежит конкретному Counter: если на странице два Counter с разными key, у каждого будет свой count.',
					'render может вызываться много раз. Каждый раз он получает актуальное значение count и setter setCount. Когда пользователь нажимает кнопку, обработчик вызывает setCount(count + 1). После этого MC сам решает, когда выполнить flush и какой DOM нужно обновить.',
					'Обратите внимание: в обработчике нет $("#some-id").text(...). Код не ищет DOM вручную. Он меняет состояние, а DOM становится следствием состояния.',
				],
			},
			{
				kind: 'callout',
				tone: 'important',
				title: 'Первый навык',
				modes: ['learn'],
				text: 'Если вы только начинаете, тренируйтесь переводить любые UI-фразы в state. “Открыта ли панель?” -> openState. “Что введено в поле?” -> queryState. “Какие элементы загружены?” -> itemsState. Это главный навык перед изучением более сложных API.',
			},
		],
		'jquery-to-mc': [
			{
				kind: 'text',
				title: 'Как переносить код без большого переписывания',
				modes: ['learn'],
				text: [
					'Не начинайте миграцию с самой большой страницы. Выберите небольшой участок, где есть понятное состояние: counter, filter, dropdown, modal, tabs, маленький список. Оберните только этот участок в компонент и оставьте внешний HTML как есть.',
					'Сначала замените одну ручную DOM-мутацию на state. Например, вместо $label.text(value) сделайте valueState и верните $label в render. Когда этот переход станет понятным, переносите следующие связанные элементы.',
				],
			},
			{
				kind: 'list',
				title: 'Хороший порядок миграции',
				modes: ['learn'],
				items: [
					'Опишите, какие данные влияют на внешний вид виджета.',
					'Создайте class component и перенесите эти данные в super.state().',
					'Верните текущую разметку из render через jQuery builders.',
					'Перенесите click/input handlers внутрь render.',
					'Удалите старые ручные обновления DOM только после того, как state-путь работает.',
				],
			},
		],
		'when-to-use': [
			{
				kind: 'text',
				title: 'MC как слой, а не новая религия',
				modes: ['learn'],
				text: [
					'MC особенно хорош, когда проект уже живет на серверных страницах и jQuery. В такой среде полный переход на большой SPA-framework может быть дорогим: нужно менять сборку, маршрутизацию, привычки команды и много инфраструктуры.',
					'MC позволяет добавить реактивную модель там, где она уже нужна, но не заставляет ломать все остальное. Один modal, одна панель фильтров или один сложный widget могут стать MC-компонентами, а соседний код останется обычным.',
				],
			},
		],
		'render-contract': [
			{
				kind: 'text',
				title: 'Почему render возвращает новый DOM-образ',
				modes: ['learn'],
				text: [
					'На первый взгляд кажется расточительным каждый раз создавать jQuery-элементы заново. Но MC использует эти элементы как описание желаемого результата. Runtime сравнивает это описание с уже подключенным DOM и переносит только нужные изменения.',
					'Это снимает с вас обязанность помнить все старые значения. Вы не пишете “если раньше было open, убери класс; если теперь loading, покажи spinner”. Вы просто возвращаете DOM для текущего open/loading/items, а diff занимается переходом между старым и новым видом.',
				],
			},
			{
				kind: 'callout',
				tone: 'warning',
				title: 'Не храните возвращенный jQuery-объект как источник правды',
				modes: ['learn'],
				text: 'DOM, который вы возвращаете из render, нужен runtime для сравнения. Источником правды должны оставаться state и props. Если нужно хранить внешний объект или DOM-ссылку, используйте field на this, MC.ref или MC.host в зависимости от задачи.',
			},
		],
		'class-components': [
			{
				kind: 'text',
				title: 'Компонент как владелец маленькой области UI',
				modes: ['learn'],
				text: [
					'Class component удобно воспринимать как “владельца” конкретной области интерфейса. Он знает свои локальные states, свои обработчики, свои подписки и то, как выглядит его DOM. Это помогает не размазывать логику виджета по нескольким внешним файлам и selector-ам.',
					'Методы класса хороши для действий: reload(), close(), selectItem(item), submit(). render хорош для описания вида. constructor хорош для начальной структуры. mounted/unmounted хороши для связи с внешним миром.',
				],
			},
			{
				kind: 'list',
				title: 'Что можно хранить на this',
				modes: ['learn'],
				items: [
					'Локальные MCState, созданные через super.state().',
					'Нереактивные кэши и служебные флаги, которые не должны сами вызывать render.',
					'Ссылки на внешние controllers, timers, sockets или plugin instances.',
					'Методы действий, которые вызываются из DOM events или lifecycle.',
				],
			},
		],
		state: [
			{
				kind: 'text',
				title: 'State - это не просто переменная',
				modes: ['learn'],
				text: [
					'Обычная переменная меняется молча. Если написать count += 1, MC не узнает, что интерфейс должен обновиться. MCState отличается тем, что set(value) не только сохраняет новое значение, но и сообщает runtime: “зависимые компоненты и effects нужно проверить”.',
					'Поэтому не стоит обходить setter. Если данные влияют на DOM, храните их в MCState и меняйте через set(). Если данные не влияют на DOM и нужны только как внутренний helper, их можно держать обычным полем на this.',
				],
			},
			{
				kind: 'list',
				title: 'Как выбирать форму состояния',
				modes: ['learn'],
				items: [
					'boolean подходит для open/closed, loading/not loading, enabled/disabled.',
					'string подходит для query, mode, selected tab, текстового input.',
					'number подходит для counters, indexes, progress values.',
					'array подходит для списков, но обновляйте его через новую копию.',
					'object подходит для формы или выбранной сущности, но не превращайте один object в хаотичное хранилище всего экрана.',
				],
			},
		],
		'global-state': [
			{
				kind: 'text',
				title: 'Когда локального state уже мало',
				modes: ['learn'],
				text: [
					'Локальный state принадлежит одному компоненту. Это хорошо, пока состояние нужно только внутри этой ветки. Но иногда два независимых места страницы должны смотреть на одно значение: например, глобальный overlay, состояние открытого виджета, текущий пользовательский режим или внешний entrypoint.',
					'Для таких случаев есть MC.uState(value, key). Ключ делает состояние переиспользуемым: кто бы ни вызвал MC.uState с тем же key, получит тот же MCState. Это удобно, но требует дисциплины именования, потому что key становится частью архитектуры.',
				],
			},
			{
				kind: 'callout',
				tone: 'warning',
				title: 'Глобальный state не должен быть мусорной корзиной',
				modes: ['learn'],
				text: 'Не переносите все локальные states в MC.uState “на всякий случай”. Чем глобальнее состояние, тем сложнее понять, кто его меняет. Начинайте с локального state и поднимайте его выше только когда действительно появились независимые потребители.',
			},
		],
		effects: [
			{
				kind: 'text',
				title: 'Почему effects отделены от render',
				modes: ['learn'],
				text: [
					'Render может вызываться часто, и его задача - описать DOM. Если внутри render делать запросы, подписываться на window или менять state без защиты, поведение быстро станет непредсказуемым. Один и тот же render может повториться из-за другого state, и side effect выполнится снова.',
					'Effect нужен как контролируемое место для побочных действий. Он говорит: “когда изменятся вот эти MCState, выполни этот код после DOM commit”. Так side effects становятся связаны с данными, а не случайно спрятаны внутри построения DOM.',
				],
			},
			{
				kind: 'list',
				title: 'Хорошие задачи для effect',
				modes: ['learn'],
				items: [
					'Загрузить данные, когда изменился выбранный item или фильтр.',
					'Подписаться на resize, когда панель открыта, и вернуть cleanup.',
					'Синхронизировать внешний plugin после изменения state.',
					'Логировать или отправить analytics-событие после конкретного изменения.',
					'Отложенно сфокусировать элемент через deferredEffect после mounted/refs.',
				],
			},
		],
		'function-containers': [
			{
				kind: 'text',
				title: 'Почему function container не заменяет class component',
				modes: ['learn'],
				text: [
					'Function container кажется проще, потому что это просто функция. Но у него нет локального constructor-state, удобных методов и полноценной роли владельца UI. Он хорош как тонкая реактивная прослойка: показать/скрыть корневой компонент, вывести маленький derived fragment, связать глобальный state с DOM.',
					'Если код начинает расти, появляются несколько handlers, lifecycle или локальное состояние, лучше сразу перейти к class component. Это делает границы ответственности понятнее.',
				],
			},
		],
		keys: [
			{
				kind: 'text',
				title: 'Identity на бытовом примере',
				modes: ['learn'],
				text: [
					'Представьте список вкладок, карточек или строк таблицы. Если элементы поменялись местами, это не значит, что первая карточка стала другой сущностью. Возможно, та же карточка просто переехала ниже. Key объясняет runtime, где “та же самая” сущность.',
					'Если key привязан к позиции, локальный state может переехать вместе с позицией. Если key привязан к id сущности, state останется у нужной карточки даже после сортировки, фильтрации или перестановки.',
				],
			},
			{
				kind: 'callout',
				tone: 'important',
				title: 'Хороший key отвечает на вопрос “кто это?”',
				modes: ['learn'],
				text: 'item-42 обычно хороший key, потому что он связан с сущностью. row-0 часто плохой key для сортируемого списка, потому что он связан только с местом на экране. Для крупных режимов UI используйте осмысленные ключи вроде details-provider или edit-form.',
			},
		],
		lifecycle: [
			{
				kind: 'text',
				title: 'Зачем нужен lifecycle, если есть render',
				modes: ['learn'],
				text: [
					'Render описывает DOM, но не все задачи являются DOM-описанием. Иногда нужно подписаться на window, запустить timer, подключить сторонний plugin, измерить размер элемента или снять ресурс при удалении компонента. Для таких задач есть lifecycle.',
					'mounted означает: DOM уже в document, refs доступны, можно делать действия, которым нужен настоящий подключенный элемент. unmounted означает: компонент уходит, нужно убрать внешние подписки и ресурсы. updated полезен, когда нужно отреагировать именно на факт DOM-обновления.',
				],
			},
			{
				kind: 'list',
				title: 'Типичный lifecycle-чеклист',
				modes: ['learn'],
				items: [
					'Добавили window/document listener в mounted - снимите его в unmounted.',
					'Создали timer или interval - сохраните id на this и очистите при unmount.',
					'Инициализировали plugin - уничтожьте или detach-ните его в unmounted.',
					'Нужен focus после появления input - делайте это после mounted или deferredEffect.',
				],
			},
		],
		'refs-host': [
			{
				kind: 'text',
				title: 'Когда декларативности недостаточно',
				modes: ['learn'],
				text: [
					'Большую часть обычного UI удобно описывать через render: кнопки, списки, формы, панели, empty states. Но есть зоны, где DOM является только оболочкой для другого мира: canvas рисуется вручную, video управляется browser API, map/editor/plugin сам создает внутреннюю разметку.',
					'В таких местах не нужно бороться с MC diff. Используйте MC.host, чтобы сказать runtime: “этот элемент мой, но его children не трогай”. Используйте MC.ref, когда нужно получить настоящий DOM-элемент после подключения.',
				],
			},
		],
		'events-forms': [
			{
				kind: 'text',
				title: 'Controlled input без мистики',
				modes: ['learn'],
				text: [
					'Controlled input означает, что значение поля хранится в state. Пользователь печатает - input event вызывает setQuery(event.target.value). render снова получает query и выставляет .val(query). В итоге state и DOM-поле не расходятся.',
					'Такой подход особенно полезен, когда от поля зависят фильтрация, кнопка submit, подсказки, validation message или запрос на сервер. Вам не нужно каждый раз читать значение selector-ом; оно уже живет в state.',
				],
			},
			{
				kind: 'callout',
				tone: 'warning',
				title: 'Не дублируйте источник правды',
				modes: ['learn'],
				text: 'Если значение input хранится в queryState, не держите параллельно отдельную переменную query и не считайте DOM value главным источником. Один источник правды проще отлаживать.',
			},
		],
		diff: [
			{
				kind: 'text',
				title: 'Diff не равен полной перерисовке',
				modes: ['learn'],
				text: [
					'Когда state меняется, компонент действительно возвращает новый DOM-образ. Но это не значит, что браузер каждый раз уничтожает и создает весь реальный DOM заново. MC сравнивает старый и новый образ и применяет изменения точечно.',
					'Если изменился только текст кнопки, будет обновлен текст. Если поменялся class, будет обновлен class. Если key говорит, что это тот же компонент, runtime старается сохранить его identity и локальный state. Replace происходит там, где узел действительно стал другим.',
				],
			},
			{
				kind: 'list',
				title: 'Что помогает diff работать предсказуемо',
				modes: ['learn'],
				items: [
					'Стабильные keys для списков и условных веток.',
					'Чистый render без случайных side effects.',
					'Одинаковая структура DOM там, где вы ожидаете patch, а не replace.',
					'MC.host для зон, где children управляются вручную.',
				],
			},
		],
		performance: [
			{
				kind: 'text',
				title: 'Производительность начинается с формы состояния',
				modes: ['learn'],
				text: [
					'В реактивном интерфейсе дорогой не сам факт render, а лишняя работа внутри render и слишком широкая область обновления. Если весь экран зависит от одного огромного object state, любое изменение этого object может заставить думать слишком много компонентов.',
					'Лучше держать state ближе к месту использования и дробить экран на компоненты. Тогда изменение маленького локального state обновит маленькую область, а не всю страницу.',
				],
			},
			{
				kind: 'list',
				title: 'Сначала измеряйте, потом оптимизируйте',
				modes: ['learn'],
				items: [
					'Включите MC.debugMode на стенде и посмотрите slow flush diagnostics.',
					'Проверьте, не создаете ли вы тяжелые DOM-деревья без необходимости.',
					'Проверьте keys: неправильная identity часто выглядит как “тормозит и сбрасывает состояние”.',
					'Проверьте effects: бесконтрольный set внутри effect может вызвать каскадные flush.',
				],
			},
		],
		'mc-lab': [
			{
				kind: 'text',
				title: 'Как пользоваться лабораторией',
				modes: ['learn'],
				text: [
					'Нажмите Run event и смотрите слева направо. Сначала появляется событие, потом dirty state, потом microtask flush, render, diff и effect. Это тот же цикл, который происходит в обычном компоненте, только разложенный на видимые шаги.',
					'Панель Why did this render? показывает не внутренний profiler, а учебное объяснение причины обновления: что нажали, какой state стал dirty, какой компонент подписан и какие effects ожидаются после commit.',
				],
			},
		],
		'visual-diff': [
			{
				kind: 'text',
				title: 'Что именно показывает simulator',
				modes: ['learn'],
				text: [
					'Слева показан старый DOM-образ, справа новый DOM-образ. Между ними не “магия”, а набор решений: сохранить узел, обновить текст, поменять атрибут, сопоставить child по key или заменить ветку.',
					'В реальном runtime решений больше, но смысл тот же. Simulator нужен, чтобы перестать бояться фразы “render возвращает новый DOM”: новый образ еще не означает грубую пересборку реального DOM.',
				],
			},
		],
		'identity-playground': [
			{
				kind: 'text',
				title: 'Что наблюдать в playground',
				modes: ['learn'],
				text: [
					'Нажмите local state на карточках, потом Rotate или Reverse. В режиме entity key счетчик остается у своей Alpha/Bravo/Charlie. В режиме position key счетчик привязан к месту, поэтому после перестановки может оказаться у другой сущности.',
					'Это одна из самых важных практических тем. Большинство странных “почему state переехал?” начинается с key, который описывает позицию, а не identity.',
				],
			},
		],
		'rosetta-stone': [
			{
				kind: 'text',
				title: 'Зачем сравнивать три подхода',
				modes: ['learn'],
				text: [
					'jQuery-пример показывает привычный императивный стиль: событие сразу меняет DOM. MC-пример показывает реактивный стиль: событие меняет state, а render описывает DOM. React-like ошибка показывает, что похожие слова вроде effect/deps не означают одинаковые правила.',
					'Пользуйтесь этой страницей как переводчиком. Если в голове появилась jQuery-команда “найти и поменять”, спросите: какое state должно измениться? Если появилась React-привычка “положить value в deps”, спросите: где здесь MCState/stateRef?',
				],
			},
		],
		'runtime-tree': [
			{
				kind: 'text',
				title: 'Как читать дерево runtime',
				modes: ['learn', 'deep'],
				text: [
					'Viewer показывает не DOM-дерево браузера, а внутренние коллекции MC. Component - это class component. Function container - реактивная функция. Effect и deferredEffect - side-effect подписки. У каждого узла есть key, по которому runtime хранит identity.',
					'Это полезно для отладки: можно увидеть, растет ли количество effects, остаются ли detached-компоненты, появляются ли неожиданные function containers. Для новичка это еще и способ увидеть, что MC действительно строит живую структуру приложения.',
				],
			},
		],
		'live-demos': [
			{
				kind: 'text',
				title: 'Демки как упражнения',
				modes: ['learn'],
				text: [
					'Не просто нажимайте кнопки. После каждого действия проговаривайте цепочку: какой handler сработал, какой state изменился, какой компонент должен обновиться, какой DOM изменился и есть ли effect после commit.',
					'Если эта цепочка стала привычной на маленьких демках, читать и писать большие MC-компоненты становится значительно легче.',
				],
			},
		],
		debugging: [
			{
				kind: 'text',
				title: 'Отладка начинается с вопроса “кто владеет состоянием?”',
				modes: ['learn'],
				text: [
					'Когда UI ведет себя странно, сначала найдите state, который должен объяснять этот вид. Если кнопка активна, где хранится active? Если modal открыт, где openState? Если список пустой, где itemsState и loadingState?',
					'Потом проверьте путь: кто вызывает set(), какой component читает state в render, есть ли правильный key, нет ли effect, который меняет state обратно. Такая цепочка почти всегда быстрее случайного console.log в разных местах.',
				],
			},
		],
		'architecture-patterns': [
			{
				kind: 'text',
				title: 'Как расти от одного компонента к приложению',
				modes: ['learn'],
				text: [
					'Маленький компонент может сам хранить все state. Но когда экран растет, появляется естественное разделение: entrypoint открывает приложение, AppShell владеет app-level состоянием, дочерние provider-like ветки отвечают за свои сценарии, а маленькие presentational components получают value/callback props.',
					'Не пытайтесь сразу построить идеальную архитектуру. Начните с понятного AppShell, выделяйте дочерние компоненты там, где появилась отдельная ответственность, и ставьте key на крупные условные ветки.',
				],
			},
		],
		context: [
			{
				kind: 'text',
				title: 'Почему context стоит оставить на потом',
				modes: ['learn'],
				text: [
					'Context выглядит привлекательно, когда не хочется прокидывать props. Но для новичка он часто прячет data flow. Если значение важно для чтения и отладки, явные props или MC.uState с хорошим key обычно понятнее.',
					'Используйте context только когда у вас есть повторяющаяся инфраструктурная зависимость и команда понимает, как она попадает в компоненты. Для обычных UI-данных начинайте с props/state.',
				],
			},
		],
		'api-reference': [
			{
				kind: 'text',
				title: 'Как пользоваться reference',
				modes: ['learn'],
				text: [
					'Reference не нужно читать подряд как учебник. Возвращайтесь сюда, когда уже понимаете задачу и хотите проверить форму вызова: какие аргументы принимает API, что он возвращает и в какой фазе lifecycle его правильно использовать.',
					'Если вы новичок, сначала ищите в reference знакомые слова: state, render, effect, host, key. Остальные методы станут понятнее после практических разделов и лабораторий.',
				],
			},
		],
		pitfalls: [
			{
				kind: 'text',
				title: 'Ошибки - это почти всегда нарушение модели',
				modes: ['learn'],
				text: [
					'Большинство проблем в MC не случайны. Они возникают, когда render начинает делать side effects, key перестает описывать identity, state мутируется в обход setter или effect получает не stateRef, а обычное значение.',
					'Хорошая новость: эти ошибки хорошо диагностируются, если возвращаться к базовой модели. Данные живут в state. Render описывает DOM. Effects делают внешние действия. Key описывает identity.',
				],
			},
		],
		recipes: [
			{
				kind: 'text',
				title: 'Как читать рецепты',
				modes: ['learn'],
				text: [
					'Рецепт - это не догма, а стартовая форма. Смотрите, где создается state, где вызывается set(), какой DOM возвращает render и какие props передаются вниз. После этого адаптируйте имена, keys и границы компонентов под свой экран.',
					'Если рецепт кажется слишком большим, скопируйте только один прием: например, async loading в mounted или open/close для modal. MC хорошо учится маленькими кусками.',
				],
			},
		],
		templates: [
			{
				kind: 'text',
				title: 'Шаблон - это каркас, не готовая архитектура',
				modes: ['learn'],
				text: [
					'Копируемые шаблоны помогают не вспоминать синтаксис с нуля. Но после вставки важно переименовать states, methods и keys так, чтобы они описывали конкретную задачу. Хорошие имена в MC сильно помогают отладке.',
					'Например, key widget-shell нормален для абстрактного шаблона, но в реальном коде лучше назвать его user-filter-shell или report-settings-modal. Тогда runtime tree и debug logs будут читаться как карта приложения.',
				],
			},
		],
		cheatsheet: [
			{
				kind: 'text',
				title: 'Памятка после понимания модели',
				modes: ['learn'],
				text: [
					'Эта страница специально короткая. Она полезна, когда вы уже поняли цикл MC и хотите быстро вспомнить форму вызова. Если какой-то пример здесь кажется непонятным, вернитесь к соответствующему разделу: State, Effects, Refs или Function containers.',
				],
			},
		],
	};

	function insertBeginnerBlocks(page, blocks) {
		if (!blocks || !blocks.length) return;

		const insertAfterLead = page.blocks.findIndex((block) => block.kind === 'lead');
		const insertIndex = insertAfterLead >= 0 ? insertAfterLead + 1 : 0;
		page.blocks.splice(insertIndex, 0, ...blocks);
	}

	function applyBeginnerExpansions() {
		DOCS.unshift(SPA_PRIMER_PAGE);
		DOCS.forEach((page) => {
			insertBeginnerBlocks(page, BEGINNER_EXPANSIONS[page.id]);
		});
	}

	applyBeginnerExpansions();

	function getPage(id) {
		return DOCS.find((page) => page.id === id) || DOCS[0];
	}

	function getStoredPageId() {
		if (window.location.hash) {
			return getHashPageId();
		}

		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			return isKnownPageId(stored) ? stored : DOCS[0].id;
		} catch (_error) {
			return DOCS[0].id;
		}
	}

	function storePageId(id) {
		try {
			localStorage.setItem(STORAGE_KEY, id);
		} catch (_error) {
			// ignore storage failures
		}
	}

	function setHashPage(id) {
		if (window.location.hash === '#' + id) return;
		window.location.hash = id;
	}

	function normalizeSearch(value) {
		return String(value || '').trim().toLowerCase();
	}

	function pageMatches(page, query) {
		if (!query) return true;
		const haystack = [
			page.group,
			page.title,
			page.short,
			page.summary,
			...(page.keywords || []),
		].join(' ').toLowerCase();
		return haystack.includes(query);
	}

	function groupedPages(pages) {
		const groups = [];
		const byName = new Map();

		pages.forEach((page) => {
			if (!byName.has(page.group)) {
				const group = { name: page.group, pages: [] };
				byName.set(page.group, group);
				groups.push(group);
			}
			byName.get(page.group).pages.push(page);
		});

		return groups;
	}

	function nextPrev(activeId) {
		const index = DOCS.findIndex((page) => page.id === activeId);
		return {
			prev: index > 0 ? DOCS[index - 1] : null,
			next: index >= 0 && index < DOCS.length - 1 ? DOCS[index + 1] : null,
			index: index < 0 ? 0 : index,
		};
	}

	class DocsShell extends MC {
		constructor() {
			super();
			this.activePageState = super.state(getStoredPageId());
			this.searchState = super.state('');
			this.navOpenState = super.state(false);
			this.themeState = super.state(getStoredTheme());
			this.readModeState = super.state(getStoredReadMode());
			this.paletteOpenState = super.state(false);
			this.paletteQueryState = super.state('');
			this._onHashChange = null;
			this._onKeydown = null;
			this._themeMedia = null;
			this._onThemeMediaChange = null;
		}

		mounted({ activePageState, searchState, themeState, paletteOpenState, paletteQueryState }) {
			const [, setActivePage] = activePageState;
			const [, setSearch] = searchState;
			const [theme] = themeState;
			const [, setPaletteOpen] = paletteOpenState;
			const [, setPaletteQuery] = paletteQueryState;

			applyTheme(theme);

			this._onHashChange = () => {
				const id = getHashPageId();
				if (isKnownPageId(id)) {
					setActivePage(id);
					storePageId(id);
				}
			};

			this._onKeydown = (event) => {
				if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
					event.preventDefault();
					setPaletteQuery('');
					setPaletteOpen(true);
					return;
				}

				if (event.key === 'Escape' && this.paletteOpenState.peek()) {
					event.preventDefault();
					setPaletteOpen(false);
					return;
				}

				if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) {
					return;
				}

				const target = event.target;
				const tag = target && target.tagName ? target.tagName.toLowerCase() : '';
				if (tag === 'input' || tag === 'textarea' || target?.isContentEditable) {
					return;
				}

				event.preventDefault();
				const input = document.querySelector('.docs-search input');
				if (input) {
					input.focus();
					input.select();
					setSearch('');
				}
			};

			window.addEventListener('hashchange', this._onHashChange);
			window.addEventListener('keydown', this._onKeydown, true);

			if (window.matchMedia) {
				this._themeMedia = window.matchMedia('(prefers-color-scheme: dark)');
				this._onThemeMediaChange = () => {
					if (this.themeState.peek() === 'system') {
						applyTheme('system');
					}
				};
				this._themeMedia.addEventListener?.('change', this._onThemeMediaChange);
			}
		}

		unmounted() {
			if (this._onHashChange) {
				window.removeEventListener('hashchange', this._onHashChange);
			}
			if (this._onKeydown) {
				window.removeEventListener('keydown', this._onKeydown, true);
			}
			if (this._themeMedia && this._onThemeMediaChange) {
				this._themeMedia.removeEventListener?.('change', this._onThemeMediaChange);
			}
		}

		render({ activePageState, searchState, navOpenState, themeState, readModeState, paletteOpenState, paletteQueryState }) {
			const [activeId, setActiveId, activeRef] = activePageState;
			const [search, setSearch] = searchState;
			const [navOpen, setNavOpen] = navOpenState;
			const [theme, setTheme, themeRef] = themeState;
			const [readMode, setReadMode, readModeRef] = readModeState;
			const [paletteOpen, setPaletteOpen] = paletteOpenState;
			const [paletteQuery, setPaletteQuery] = paletteQueryState;
			const query = normalizeSearch(search);
			const visiblePages = DOCS.filter((page) => pageMatches(page, query));
			const activePage = getPage(activeId);
			const progress = nextPrev(activeId);

			const goTo = (id) => {
				setActiveId(id);
				storePageId(id);
				setHashPage(id);
				setNavOpen(false);
				setPaletteOpen(false);
			};

			$.MC.effect(() => {
				const main = document.querySelector('.docs-main');
				if (main) {
					main.scrollTo({ top: 0, behavior: 'smooth' });
				}
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}, [activeRef], 'docs-scroll-to-top');

			$.MC.effect(([nextTheme]) => {
				storeTheme(nextTheme);
				applyTheme(nextTheme);
			}, [themeRef], 'docs-theme-apply');

			$.MC.effect(([nextMode]) => {
				storeReadMode(nextMode);
			}, [readModeRef], 'docs-read-mode-store');

			return $('<div>')
				.addClass('docs-app')
				.addClass('docs-app--mode-' + readMode)
				.toggleClass('docs-app--nav-open', navOpen)
				.append(
					$.MC(DocsSidebar, {
						activeId,
						search,
						setSearch,
						visiblePages,
						query,
						goTo,
						closeNav: () => setNavOpen(false),
					}, 'docs-sidebar'),
					$('<div>')
						.addClass('docs-backdrop')
						.on('click', () => setNavOpen(false)),
					$('<main>')
						.addClass('docs-main')
						.append(
							$.MC(DocsHeader, {
								activePage,
								progress,
								theme,
								setTheme,
								readMode,
								setReadMode,
								openPalette: () => {
									setPaletteQuery('');
									setPaletteOpen(true);
								},
								openNav: () => setNavOpen(true),
							}, 'docs-header'),
							$.MC(PageView, {
								page: activePage,
								activeId,
								readMode,
								goTo,
							}, 'page-' + activePage.id)
						),
					$.MC(CommandPalette, {
						isOpen: paletteOpen,
						query: paletteQuery,
						setQuery: setPaletteQuery,
						close: () => setPaletteOpen(false),
						goTo,
						theme,
						setTheme,
						readMode,
						setReadMode,
					}, 'docs-command-palette')
				);
		}
	}

	class DocsSidebar extends MC {
		render({}, { activeId, search, setSearch, visiblePages, query, goTo, closeNav }) {
			const groups = groupedPages(visiblePages);

			return $('<aside>')
				.addClass('docs-sidebar')
				.append(
					$('<div>')
						.addClass('docs-brand')
						.append(
							$('<button type="button">')
								.addClass('docs-icon-button docs-sidebar__close')
								.attr('aria-label', 'Закрыть меню')
								.text('×')
								.on('click', closeNav),
							$('<div>')
								.addClass('docs-logo')
								.text('MC'),
							$('<div>').append(
								$('<div>').addClass('docs-brand__title').text('Micro Component'),
								$('<div>').addClass('docs-brand__meta').text('v8.1 runtime docs')
							)
						),
					$('<a>')
						.addClass('docs-ai-link')
						.attr('href', AI_DOCS_URL)
						.attr('target', '_blank')
						.attr('rel', 'noopener')
						.text('AI Markdown: MC.ai.md'),
					$('<label>')
						.addClass('docs-search')
						.append(
							$('<span>').text('Поиск /'),
							$('<input type="search">')
								.val(search)
								.attr('placeholder', 'state, effect, refs...')
								.on('input', (event) => setSearch(event.target.value))
						),
					$('<div>')
						.addClass('docs-search-chips')
						.append(
							SEARCH_CHIPS.map((chip) =>
								$('<button type="button">')
									.text(chip)
									.on('click', () => setSearch(chip))
							)
						),
					$.MC(RuntimeInspector, {}, 'docs-runtime-inspector'),
					$('<nav>')
						.addClass('docs-nav')
						.append(
							groups.length
								? groups.map((group) => this.renderGroup(group, activeId, query, goTo))
								: $('<div>')
										.addClass('docs-empty')
										.append(
											$('<strong>').text('Разделы не найдены'),
											$('<span>').text('Попробуйте state, effect, key или ref.')
										)
						)
				);
		}

		renderGroup(group, activeId, query, goTo) {
			return $('<section>')
				.addClass('docs-nav-group')
				.append(
					$('<h2>').text(group.name),
					group.pages.map((page) =>
						$('<button type="button">')
							.addClass('docs-nav-item')
							.toggleClass('is-active', page.id === activeId)
							.on('click', () => goTo(page.id))
							.append(
								renderHighlightedText(page.short || page.title, query, 'docs-nav-item__title'),
								renderHighlightedText(page.summary, query, 'docs-nav-item__summary')
							)
					)
				);
		}
	}

	class DocsHeader extends MC {
		render({}, { activePage, progress, theme, setTheme, readMode, setReadMode, openPalette, openNav }) {
			const percent = Math.round(((progress.index + 1) / DOCS.length) * 100);

			return $('<header>')
				.addClass('docs-topbar')
				.append(
					$('<button type="button">')
						.addClass('docs-icon-button docs-topbar__menu')
						.attr('aria-label', 'Открыть меню')
						.text('☰')
						.on('click', openNav),
					$('<div>')
						.addClass('docs-topbar__text')
						.append(
							$('<div>').addClass('docs-kicker').text(activePage.group),
							$('<h1>').text(activePage.title),
							$('<p>').text(activePage.summary)
						),
					$('<div>')
						.addClass('docs-topbar__actions')
						.append(
							$('<button type="button">')
								.addClass('docs-command-button')
								.text('Command')
								.on('click', openPalette),
							$.MC(ReadingModeControl, {
								readMode,
								setReadMode,
							}, 'docs-reading-mode'),
							$.MC(RuntimePulse, {}, 'docs-runtime-pulse'),
							$.MC(ThemeControl, {
								theme,
								setTheme,
							}, 'docs-theme-control')
						),
					$('<div>')
						.addClass('docs-progress')
						.append(
							$('<span>').text((progress.index + 1) + ' / ' + DOCS.length),
							$('<div>')
								.addClass('docs-progress__bar')
								.append($('<i>').css({ width: percent + '%' }))
						)
				);
		}
	}

	class ThemeControl extends MC {
		render({}, { theme, setTheme }) {
			return $('<div>')
				.addClass('docs-theme-control')
				.attr('aria-label', 'Theme')
				.append(
					THEME_OPTIONS.map((item) =>
						$('<button type="button">')
							.toggleClass('is-active', item.id === theme)
							.text(item.label)
							.on('click', () => setTheme(item.id))
					)
				);
		}
	}

	class ReadingModeControl extends MC {
		render({}, { readMode, setReadMode }) {
			return $('<div>')
				.addClass('docs-reading-mode')
				.append(
					READING_MODES.map((item) =>
						$('<button type="button">')
							.toggleClass('is-active', item.id === readMode)
							.text(item.label)
							.on('click', () => setReadMode(item.id))
					)
				);
		}
	}

	class RuntimePulse extends MC {
		constructor() {
			super();
			this.snapshotState = super.state(getRuntimeSnapshot());
			this._timer = null;
		}

		mounted({ snapshotState }) {
			const [, setSnapshot] = snapshotState;
			this._timer = setInterval(() => {
				setSnapshot(getRuntimeSnapshot());
			}, 1200);
		}

		unmounted() {
			if (this._timer) {
				clearInterval(this._timer);
				this._timer = null;
			}
		}

		render({ snapshotState }) {
			const [snapshot] = snapshotState;
			const total = snapshot.states + snapshot.components + snapshot.functions + snapshot.effects;

			return $('<div>')
				.addClass('docs-pulse')
				.toggleClass('is-debug', snapshot.debug)
				.append(
					$('<i>'),
					$('<span>').text('runtime'),
					$('<strong>').text(total)
				);
		}
	}

	class CommandPalette extends MC {
		constructor() {
			super();
			this._focusQueued = false;
			this._focusTimer = null;
		}

		unmounted() {
			if (this._focusTimer) {
				clearTimeout(this._focusTimer);
				this._focusTimer = null;
			}
		}

		focusInputSoon() {
			if (this._focusTimer) {
				clearTimeout(this._focusTimer);
			}
			this._focusTimer = setTimeout(() => {
				const input = document.querySelector('.docs-command-palette input');
				if (input) {
					input.focus();
					input.select();
				}
			}, 0);
		}

		runItem(item, close) {
			item.run();
			close();
		}

		render({}, { isOpen, query, setQuery, close, goTo, theme, setTheme, readMode, setReadMode }) {
			if (!isOpen) {
				this._focusQueued = false;
				return null;
			}

			const items = buildCommandItems(query, {
				goTo,
				theme,
				setTheme,
				readMode,
				setReadMode,
			});
			const first = items[0];

			if (!this._focusQueued) {
				this._focusQueued = true;
				this.focusInputSoon();
			}

			return $('<div>')
				.addClass('docs-command-palette')
				.append(
					$('<div>')
						.addClass('docs-command-palette__backdrop')
						.on('click', close),
					$('<section>')
						.addClass('docs-command-palette__panel')
						.append(
							$('<div>')
								.addClass('docs-command-palette__input')
								.append(
									$('<input type="search">')
										.val(query)
										.attr('placeholder', 'Page, API, template, mode...')
										.on('input', (event) => setQuery(event.target.value))
										.on('keydown', (event) => {
											if (event.key === 'Escape') {
												event.preventDefault();
												close();
											}
											if (event.key === 'Enter' && first) {
												event.preventDefault();
												this.runItem(first, close);
											}
										})
								),
							$('<div>')
								.addClass('docs-command-palette__list')
								.append(
									items.length
										? items.map((item) =>
												$('<button type="button">')
													.addClass('docs-command-palette__item')
													.on('click', () => this.runItem(item, close))
													.append(
														$('<span>').text(item.meta),
														$('<strong>').text(item.title),
														$('<small>').text(item.summary)
													)
											)
										: $('<div>')
												.addClass('docs-command-palette__empty')
												.text('Ничего не найдено')
								)
						)
				);
		}
	}

	class RuntimeInspector extends MC {
		constructor() {
			super();
			this.snapshotState = super.state(getRuntimeSnapshot());
		}

		refresh(setSnapshot) {
			setSnapshot(getRuntimeSnapshot());
		}

		toggleDebug(setSnapshot) {
			MC.debugMode = !MC.debugMode;
			setSnapshot(getRuntimeSnapshot());
		}

		render({ snapshotState }) {
			const [snapshot, setSnapshot] = snapshotState;

			return $('<section>')
				.addClass('docs-runtime')
				.append(
					$('<div>')
						.addClass('docs-runtime__head')
						.append(
							$('<strong>').text('Runtime'),
							$('<button type="button">')
								.text('Refresh')
								.on('click', () => this.refresh(setSnapshot))
						),
					$('<div>')
						.addClass('docs-runtime__grid')
						.append(
							this.metric('States', snapshot.states),
							this.metric('Components', snapshot.components),
							this.metric('FC', snapshot.functions),
							this.metric('Effects', snapshot.effects)
						),
					$('<button type="button">')
						.addClass('docs-runtime__debug')
						.toggleClass('is-active', snapshot.debug)
						.text(snapshot.debug ? 'debugMode: on' : 'debugMode: off')
						.on('click', () => this.toggleDebug(setSnapshot))
				);
		}

		metric(label, value) {
			return $('<div>')
				.addClass('docs-runtime__metric')
				.append(
					$('<span>').text(label),
					$('<strong>').text(value)
				);
		}
	}

	class PageView extends MC {
		render({}, { page, activeId, readMode, goTo }) {
			const nav = nextPrev(activeId);
			const visibleBlocks = getVisibleBlocks(page.blocks, readMode);

			return $('<article>')
				.addClass('doc-page')
				.append(
					$('<div>')
						.addClass('doc-page__intro')
						.append(
							$('<span>').addClass('doc-page__group').text(page.group),
							$('<h2>').text(page.title),
							$('<p>').text(page.summary)
						),
					$('<div>')
						.addClass('doc-blocks')
						.append(
							visibleBlocks.map((block, index) =>
								$.MC(BlockView, {
									block,
									pageId: page.id,
									index,
								}, page.id + '-block-' + index)
							)
						),
					$('<footer>')
						.addClass('doc-pager')
						.append(
							nav.prev
								? $('<button type="button">')
										.addClass('doc-pager__button')
										.on('click', () => goTo(nav.prev.id))
										.append(
											$('<span>').text('Назад'),
											$('<strong>').text(nav.prev.title)
										)
								: $('<span>'),
							nav.next
								? $('<button type="button">')
										.addClass('doc-pager__button doc-pager__button--next')
										.on('click', () => goTo(nav.next.id))
										.append(
											$('<span>').text('Дальше'),
											$('<strong>').text(nav.next.title)
										)
								: $('<span>')
						)
				);
		}
	}

	class BlockView extends MC {
		render({}, { block, pageId, index }) {
			switch (block.kind) {
				case 'lead':
					return $('<section>')
						.addClass('doc-lead')
						.text(block.text);

				case 'text':
					return this.renderText(block);

				case 'list':
					return this.renderList(block);

				case 'cards':
					return this.renderCards(block);

				case 'flow':
					return $.MC(FlowStepper, {
						block,
					}, pageId + '-flow-' + index);

				case 'table':
					return this.renderTable(block);

				case 'callout':
					return this.renderCallout(block);

				case 'tabs':
					return $.MC(TabbedCodeBlock, {
						block,
					}, pageId + '-tabs-' + index);

				case 'do-dont':
					return this.renderDoDont(block);

				case 'template-grid':
					return $.MC(TemplateGallery, {
						block,
					}, pageId + '-templates-' + index);

				case 'lab':
					return $.MC(MCLab, {
						block,
					}, pageId + '-lab-' + index);

				case 'diff-simulator':
					return $.MC(VisualDiffSimulator, {
						block,
					}, pageId + '-diff-' + index);

				case 'identity-playground':
					return $.MC(IdentityPlayground, {
						block,
					}, pageId + '-identity-' + index);

				case 'rosetta':
					return $.MC(RosettaStone, {
						block,
					}, pageId + '-rosetta-' + index);

				case 'component-tree':
					return $.MC(ComponentTreeViewer, {
						block,
					}, pageId + '-component-tree-' + index);

				case 'code':
					return $.MC(CodeBlock, {
						title: block.title,
						lang: block.lang,
						codeText: block.code,
					}, pageId + '-code-' + index);

				case 'demo':
					return $.MC(DemoBlock, {
						block,
					}, pageId + '-demo-' + index);

				default:
					return null;
			}
		}

		renderText(block) {
			const paragraphs = Array.isArray(block.text) ? block.text : [block.text];
			return $('<section>')
				.addClass('doc-section')
				.append(
					block.title ? $('<h3>').text(block.title) : null,
					paragraphs.map((text) => $('<p>').text(text))
				);
		}

		renderList(block) {
			return $('<section>')
				.addClass('doc-section')
				.append(
					block.title ? $('<h3>').text(block.title) : null,
					$('<ul>')
						.addClass('doc-list')
						.append(
							(block.items || []).map((item) =>
								$('<li>').append($('<span>').text(item))
							)
						)
				);
		}

		renderCards(block) {
			return $('<section>')
				.addClass('doc-section')
				.append(
					block.title ? $('<h3>').text(block.title) : null,
					$('<div>')
						.addClass('doc-card-grid')
						.append(
							(block.cards || []).map((card) =>
								$('<div>')
									.addClass('doc-card')
									.append(
										$('<h4>').text(card.title),
										$('<p>').text(card.text)
									)
							)
						)
				);
		}

		renderTable(block) {
			return $('<section>')
				.addClass('doc-section doc-table-section')
				.append(
					block.title ? $('<h3>').text(block.title) : null,
					$('<div>')
						.addClass('doc-table-wrap')
						.append(
							$('<table>')
								.addClass('doc-table')
								.append(
									$('<thead>').append(
										$('<tr>').append(
											(block.columns || []).map((column) =>
												$('<th>').text(column)
											)
										)
									),
									$('<tbody>').append(
										(block.rows || []).map((row) =>
											$('<tr>').append(
												row.map((cell) => $('<td>').text(cell))
											)
										)
									)
								)
						)
				);
		}

		renderCallout(block) {
			return $('<section>')
				.addClass('doc-callout')
				.addClass('doc-callout--' + (block.tone || 'neutral'))
				.append(
					$('<strong>').text(block.title),
					$('<p>').text(block.text)
				);
		}

		renderDoDont(block) {
			return $('<section>')
				.addClass('doc-section doc-do-dont')
				.append(
					block.title ? $('<h3>').text(block.title) : null,
					$('<div>')
						.addClass('doc-do-dont__grid')
						.append(
							this.renderRuleColumn('Делайте', 'do', block.do || []),
							this.renderRuleColumn('Избегайте', 'dont', block.dont || [])
						)
				);
		}

		renderRuleColumn(title, tone, items) {
			return $('<div>')
				.addClass('doc-rule-column doc-rule-column--' + tone)
				.append(
					$('<h4>').text(title),
					items.map((item) =>
						$('<div>')
							.addClass('doc-rule')
							.append(
								$('<strong>').text(item.title),
								$('<p>').text(item.text)
							)
					)
				);
		}
	}

	class FlowStepper extends MC {
		constructor() {
			super();
			this.activeStepState = super.state(0);
		}

		render({ activeStepState }, { block }) {
			const [activeStep, setActiveStep] = activeStepState;
			const steps = block.steps || [];
			const max = Math.max(steps.length - 1, 0);
			const index = Math.min(activeStep, max);
			const current = steps[index] || {};

			return $('<section>')
				.addClass('doc-section doc-flow')
				.append(
					block.title ? $('<h3>').text(block.title) : null,
					$('<div>')
						.addClass('doc-flow__rail')
						.append(
							steps.map((step, stepIndex) =>
								$('<button type="button">')
									.toggleClass('is-active', stepIndex === index)
									.toggleClass('is-done', stepIndex < index)
									.on('click', () => setActiveStep(stepIndex))
									.append(
										$('<span>').text(stepIndex + 1),
										$('<strong>').text(step.label)
									)
							)
						),
					$('<div>')
						.addClass('doc-flow__detail')
						.append(
							$('<span>').text((index + 1) + ' / ' + steps.length),
							$('<h4>').text(current.title || ''),
							$('<p>').text(current.text || ''),
							$('<div>')
								.addClass('doc-flow__actions')
								.append(
									$('<button type="button">')
										.prop('disabled', index === 0)
										.text('Назад')
										.on('click', () => setActiveStep(Math.max(index - 1, 0))),
									$('<button type="button">')
										.prop('disabled', index === max)
										.text('Дальше')
										.on('click', () => setActiveStep(Math.min(index + 1, max)))
								)
						)
				);
		}
	}

	class TabbedCodeBlock extends MC {
		constructor() {
			super();
			this.activeTabState = super.state(null);
			this.copiedState = super.state(false);
			this._copyTimer = null;
		}

		unmounted() {
			if (this._copyTimer) {
				clearTimeout(this._copyTimer);
				this._copyTimer = null;
			}
		}

		copy(codeText, setCopied) {
			copyTextToClipboard(codeText).then(() => {
				setCopied(true);
				if (this._copyTimer) clearTimeout(this._copyTimer);
				this._copyTimer = setTimeout(() => setCopied(false), 1200);
			}).catch(() => {});
		}

		render({ activeTabState, copiedState }, { block }) {
			const [activeId, setActiveId] = activeTabState;
			const [copied, setCopied] = copiedState;
			const tabs = block.tabs || [];
			const active = tabs.find((tab) => tab.id === activeId) || tabs[0] || {};

			return $('<section>')
				.addClass('doc-section doc-tabs')
				.append(
					block.title ? $('<h3>').text(block.title) : null,
					$('<div>')
						.addClass('doc-tabs__buttons')
						.append(
							tabs.map((tab) =>
								$('<button type="button">')
									.addClass('doc-tabs__button')
									.addClass('doc-tabs__button--' + (tab.tone || 'neutral'))
									.toggleClass('is-active', tab.id === active.id)
									.text(tab.title)
									.on('click', () => {
										setActiveId(tab.id);
										setCopied(false);
									})
							)
						),
					active.caption ? $('<p>').addClass('doc-tabs__caption').text(active.caption) : null,
					$('<div>')
						.addClass('doc-tabs__code')
						.append(
							$('<div>')
								.addClass('doc-tabs__code-head')
								.append(
									$('<span>').text(active.lang || 'text'),
									$('<button type="button">')
										.text(copied ? 'Скопировано' : 'Копировать')
										.on('click', () => this.copy(active.code || '', setCopied))
								),
							$('<pre>').append(
								renderCodeElement(active.code || '', active.lang || 'text')
							)
						)
				);
		}
	}

	class TemplateGallery extends MC {
		constructor() {
			super();
			this.activeTemplateState = super.state(null);
			this.copiedState = super.state(false);
			this._copyTimer = null;
		}

		unmounted() {
			if (this._copyTimer) {
				clearTimeout(this._copyTimer);
				this._copyTimer = null;
			}
		}

		copy(codeText, setCopied) {
			copyTextToClipboard(codeText).then(() => {
				setCopied(true);
				if (this._copyTimer) clearTimeout(this._copyTimer);
				this._copyTimer = setTimeout(() => setCopied(false), 1200);
			}).catch(() => {});
		}

		render({ activeTemplateState, copiedState }, { block }) {
			const templates = block.templates || [];
			const [activeId, setActiveId] = activeTemplateState;
			const [copied, setCopied] = copiedState;
			const active = templates.find((item) => item.id === activeId) || templates[0] || {};

			return $('<section>')
				.addClass('doc-section doc-template-gallery')
				.append(
					block.title ? $('<h3>').text(block.title) : null,
					$('<div>')
						.addClass('doc-template-gallery__layout')
						.append(
							$('<div>')
								.addClass('doc-template-gallery__list')
								.append(
									templates.map((item) =>
										$('<button type="button">')
											.toggleClass('is-active', item.id === active.id)
											.on('click', () => {
												setActiveId(item.id);
												setCopied(false);
											})
											.append(
												$('<strong>').text(item.title),
												$('<span>').text(item.lang)
											)
									)
								),
							$('<div>')
								.addClass('doc-template-gallery__code')
								.append(
									$('<div>')
										.addClass('doc-template-gallery__head')
										.append(
											$('<strong>').text(active.title || 'Template'),
											$('<button type="button">')
												.text(copied ? 'Скопировано' : 'Копировать')
												.on('click', () => this.copy(active.code || '', setCopied))
									),
									$('<pre>').append(
										renderCodeElement(active.code || '', active.lang || 'text')
									)
								)
						)
				);
		}
	}

	class MCLab extends MC {
		constructor() {
			super();
			this.countState = super.state(0);
			this.flagState = super.state(false);
			this.activeStepState = super.state(0);
			this.traceState = super.state(['lab mounted']);
			this.whyState = super.state({
				trigger: 'initial mount',
				dirtyState: 'component creation',
				subscriber: 'MCLab',
				rendered: 'initial preview, trace and effects',
				effects: 'countRef and flagRef effects are registered',
			});
			this.renderCount = 0;
			this._timers = [];
		}

		unmounted() {
			this.clearTimers();
		}

		clearTimers() {
			this._timers.forEach((timer) => clearTimeout(timer));
			this._timers = [];
		}

		pushTrace(line) {
			const nextTrace = this.traceState.peek().slice(-7);
			nextTrace.push(line);
			this.traceState.set(nextTrace);
		}

		explainRender(setWhy, nextWhy) {
			setWhy({
				trigger: nextWhy.trigger,
				dirtyState: nextWhy.dirtyState,
				subscriber: 'MCLab',
				rendered: nextWhy.rendered,
				effects: nextWhy.effects,
			});
		}

		runCycle(count, setCount, setActiveStep, setWhy) {
			this.clearTimers();
			this.explainRender(setWhy, {
				trigger: 'Run event button',
				dirtyState: 'activeStepState -> countState',
				rendered: 'step rail advances, preview count updates, trace receives new lines',
				effects: 'countRef effect logs after DOM commit',
			});
			this.pushTrace('event: click captured');
			setActiveStep(0);

			LAB_STEPS.slice(1).forEach((step, index) => {
				const timer = setTimeout(() => {
					setActiveStep(index + 1);
					this.pushTrace(step.id + ': ' + step.text);
					if (step.id === 'set') {
						setCount(count + 1);
					}
				}, 180 * (index + 1));
				this._timers.push(timer);
			});
		}

		render({ countState, flagState, activeStepState, traceState, whyState }) {
			this.renderCount += 1;
			const [count, setCount, countRef] = countState;
			const [flag, setFlag, flagRef] = flagState;
			const [activeStep, setActiveStep] = activeStepState;
			const [trace, setTrace] = traceState;
			const [why, setWhy] = whyState;

			$.MC.effect(([nextCount]) => {
				this.pushTrace('effect: count -> ' + nextCount);
			}, [countRef], 'mc-lab-count-effect');

			$.MC.effect(([nextFlag]) => {
				this.pushTrace('effect: flag -> ' + (nextFlag ? 'on' : 'off'));
			}, [flagRef], 'mc-lab-flag-effect');

			return $('<section>')
				.addClass('doc-lab')
				.append(
					$('<div>')
						.addClass('doc-lab__stage')
						.append(
							LAB_STEPS.map((step, index) =>
								$('<div>')
									.addClass('doc-lab-step')
									.toggleClass('is-active', index === activeStep)
									.toggleClass('is-past', index < activeStep)
									.append(
										$('<span>').text(String(index + 1).padStart(2, '0')),
										$('<strong>').text(step.title),
										$('<p>').text(step.text)
									)
							)
						),
					$('<div>')
						.addClass('doc-lab__workspace')
						.append(
							$('<div>')
								.addClass('doc-lab-preview')
								.toggleClass('is-on', flag)
								.append(
									$('<span>').text('render output'),
									$('<strong>').text('count: ' + count),
									$('<em>').text('flag: ' + (flag ? 'on' : 'off'))
								),
							this.renderWhyPanel(why, this.renderCount),
							$('<div>')
								.addClass('doc-lab__actions')
								.append(
									$('<button type="button">')
										.text('Run event')
										.on('click', () => this.runCycle(count, setCount, setActiveStep, setWhy)),
									$('<button type="button">')
										.text('Toggle flag')
										.on('click', () => {
											this.explainRender(setWhy, {
												trigger: 'Toggle flag button',
												dirtyState: 'flagState',
												rendered: 'preview tone and flag label',
												effects: 'flagRef effect logs after commit',
											});
											setFlag(!flag);
										}),
									$('<button type="button">')
										.text('Reset')
										.on('click', () => {
											this.clearTimers();
											this.explainRender(setWhy, {
												trigger: 'Reset button',
												dirtyState: 'countState, flagState, activeStepState, traceState',
												rendered: 'lab returns to initial visual state',
												effects: 'countRef and flagRef effects may run if values changed',
											});
											setCount(0);
											setFlag(false);
											setActiveStep(0);
											setTrace(['lab reset']);
										})
								),
							$('<div>')
								.addClass('doc-lab-trace')
								.append(
									trace.map((line) =>
										$('<div>').text(line)
									)
								)
						)
				);
		}

		renderWhyPanel(why, renderCount) {
			return $('<div>')
				.addClass('doc-lab-why')
				.append(
					$('<div>')
						.addClass('doc-lab-why__head')
						.append(
							$('<span>').text('Why did this render?'),
							$('<strong>').text('#' + renderCount)
						),
					this.renderWhyRow('trigger', why.trigger),
					this.renderWhyRow('dirty state', why.dirtyState),
					this.renderWhyRow('subscriber', why.subscriber),
					this.renderWhyRow('rendered', why.rendered),
					this.renderWhyRow('effects', why.effects)
				);
		}

		renderWhyRow(label, value) {
			return $('<div>')
				.addClass('doc-lab-why__row')
				.append(
					$('<span>').text(label),
					$('<strong>').text(value || 'none')
				);
		}
	}

	class VisualDiffSimulator extends MC {
		constructor() {
			super();
			this.scenarioState = super.state(DIFF_SCENARIOS[0].id);
			this.activeOpState = super.state(0);
		}

		render({ scenarioState, activeOpState }) {
			const [scenarioId, setScenarioId] = scenarioState;
			const [activeOp, setActiveOp] = activeOpState;
			const scenario = DIFF_SCENARIOS.find((item) => item.id === scenarioId) || DIFF_SCENARIOS[0];

			return $('<section>')
				.addClass('doc-diff-sim')
				.append(
					$('<div>')
						.addClass('doc-diff-sim__tabs')
						.append(
							DIFF_SCENARIOS.map((item) =>
								$('<button type="button">')
									.toggleClass('is-active', item.id === scenario.id)
									.text(item.title)
									.on('click', () => {
										setScenarioId(item.id);
										setActiveOp(0);
									})
							)
						),
					$('<div>')
						.addClass('doc-diff-sim__trees')
						.append(
							this.renderTree('old DOM', scenario.oldTree),
							$('<div>').addClass('doc-diff-arrow').text('patch'),
							this.renderTree('new DOM', scenario.newTree)
						),
					$('<div>')
						.addClass('doc-diff-sim__ops')
						.append(
							scenario.ops.map((operation, index) =>
								$('<button type="button">')
									.toggleClass('is-active', index === activeOp)
									.on('click', () => setActiveOp(index))
									.append(
										$('<span>').text(index + 1),
										$('<strong>').text(operation)
									)
							)
						)
				);
		}

		renderTree(title, lines) {
			return $('<div>')
				.addClass('doc-diff-tree')
				.append(
					$('<span>').text(title),
					$('<pre>').append(
						$('<code>').text((lines || []).join('\n'))
					)
				);
		}
	}

	class IdentityPlayground extends MC {
		constructor() {
			super();
			this.keyModeState = super.state('entity');
			this.itemsState = super.state([
				{ id: 'alpha', title: 'Alpha' },
				{ id: 'bravo', title: 'Bravo' },
				{ id: 'charlie', title: 'Charlie' },
			]);
		}

		rotate(items) {
			return items.length > 1 ? items.slice(1).concat(items[0]) : items;
		}

		render({ keyModeState, itemsState }) {
			const [keyMode, setKeyMode] = keyModeState;
			const [items, setItems] = itemsState;

			return $('<section>')
				.addClass('doc-identity')
				.append(
					$('<div>')
						.addClass('doc-identity__toolbar')
						.append(
							$('<div>')
								.addClass('doc-identity__modes')
								.append(
									$('<button type="button">')
										.toggleClass('is-active', keyMode === 'entity')
										.text('entity key')
										.on('click', () => setKeyMode('entity')),
									$('<button type="button">')
										.toggleClass('is-active', keyMode === 'position')
										.text('position key')
										.on('click', () => setKeyMode('position'))
								),
							$('<div>')
								.addClass('doc-identity__actions')
								.append(
									$('<button type="button">')
										.text('Rotate')
										.on('click', () => setItems(this.rotate(items))),
									$('<button type="button">')
										.text('Reverse')
										.on('click', () => setItems(items.slice().reverse())),
									$('<button type="button">')
										.text('Reset')
										.on('click', () => setItems([
											{ id: 'alpha', title: 'Alpha' },
											{ id: 'bravo', title: 'Bravo' },
											{ id: 'charlie', title: 'Charlie' },
										]))
								)
						),
					$('<div>')
						.addClass('doc-identity__grid')
						.append(
							items.map((item, index) =>
								$.MC(IdentityPlaygroundCard, {
									item,
									index,
									keyMode,
								}, keyMode === 'entity' ? 'identity-' + item.id : 'identity-slot-' + index)
							)
						)
				);
		}
	}

	class IdentityPlaygroundCard extends MC {
		constructor() {
			super();
			this.localState = super.state(0);
		}

		render({ localState }, { item, index, keyMode }) {
			const [local, setLocal] = localState;
			const keyLabel = keyMode === 'entity' ? item.id : 'slot-' + index;

			return $('<div>')
				.addClass('doc-identity-card')
				.append(
					$('<span>').text('key: ' + keyLabel),
					$('<strong>').text(item.title),
					$('<button type="button">')
						.text('local state ' + local)
						.on('click', () => setLocal(local + 1))
				);
		}
	}

	class RosettaStone extends MC {
		constructor() {
			super();
			this.activeState = super.state('mc');
		}

		getCases() {
			return [
				{
					id: 'jquery',
					title: 'jQuery',
					label: 'manual DOM',
					text: 'Состояние живет рядом, DOM меняется вручную после каждого события.',
					lang: 'js',
					code: code`
						let count = 0;
						const $value = $('#counter-value');

						$('#increment').on('click', () => {
							count += 1;
							$value.text(count);
						});
					`,
				},
				{
					id: 'mc',
					title: 'MC',
					label: 'state + render',
					text: 'Событие меняет state. render описывает DOM для текущего значения.',
					lang: 'js',
					code: code`
						class Counter extends MC {
							constructor() {
								super();
								this.countState = super.state(0);
							}

							render({ countState }) {
								const [count, setCount] = countState;

								return $('<button type="button">')
									.text('Clicked: ' + count)
									.on('click', () => setCount(count + 1));
							}
						}
					`,
				},
				{
					id: 'mistake',
					title: 'React-like',
					label: 'wrong transfer',
					text: 'В MC deps - это MCState/stateRef. Обычные values не являются подпиской.',
					lang: 'js',
					code: code`
						render({ countState }) {
							const [count] = countState;

							$.MC.effect(([nextCount]) => {
								console.log(nextCount);
							}, [count]); // not MCState

							return $('<div>').text(count);
						}
					`,
				},
			];
		}

		render({ activeState }) {
			const [activeId, setActiveId] = activeState;
			const cases = this.getCases();
			const active = cases.find((item) => item.id === activeId) || cases[0];

			return $('<section>')
				.addClass('doc-rosetta')
				.append(
					$('<div>')
						.addClass('doc-rosetta__cards')
						.append(
							cases.map((item) =>
								$('<button type="button">')
									.toggleClass('is-active', item.id === active.id)
									.on('click', () => setActiveId(item.id))
									.append(
										$('<span>').text(item.label),
										$('<strong>').text(item.title),
										$('<p>').text(item.text)
									)
							)
						),
					$('<div>')
						.addClass('doc-rosetta__code')
						.append(
							$('<div>')
								.addClass('doc-rosetta__head')
								.append(
									$('<strong>').text(active.title),
									$('<span>').text(active.lang)
							),
							$('<pre>').append(
								renderCodeElement(active.code, active.lang)
							)
						)
				);
		}
	}

	class ComponentTreeViewer extends MC {
		constructor() {
			super();
			this.snapshotState = super.state(getRuntimeTreeSnapshot());
			this._timer = null;
		}

		mounted({ snapshotState }) {
			const [, setSnapshot] = snapshotState;
			this._timer = setInterval(() => {
				setSnapshot(getRuntimeTreeSnapshot());
			}, 1600);
		}

		unmounted() {
			if (this._timer) {
				clearInterval(this._timer);
				this._timer = null;
			}
		}

		render({ snapshotState }) {
			const [snapshot, setSnapshot] = snapshotState;
			const roots = snapshot.roots || [];

			return $('<section>')
				.addClass('doc-tree-viewer')
				.append(
					$('<div>')
						.addClass('doc-tree-viewer__head')
						.append(
							$('<div>').append(
								$('<span>').text('window.iMC'),
								$('<strong>').text(snapshot.total + ' runtime nodes')
							),
							$('<button type="button">')
								.text('Refresh')
								.on('click', () => setSnapshot(getRuntimeTreeSnapshot()))
						),
					$('<div>')
						.addClass('doc-tree-viewer__legend')
						.append(
							this.legendItem('component', 'Component'),
							this.legendItem('fc', 'Function container'),
							this.legendItem('effect', 'Effect'),
							this.legendItem('deferred', 'Deferred')
						),
					$('<div>')
						.addClass('doc-tree-viewer__tree')
						.append(
							roots.length
								? roots.slice(0, 80).map((node) => this.renderNode(node, 0))
								: $('<div>').addClass('doc-tree-viewer__empty').text('Runtime tree is empty')
						)
				);
		}

		legendItem(type, label) {
			return $('<span>')
				.addClass('doc-tree-chip doc-tree-chip--' + type)
				.text(label);
		}

		renderNode(node, depth) {
			const children = node.children || [];

			return $('<div>')
				.addClass('doc-tree-node')
				.css({ '--depth': depth })
				.append(
					$('<div>')
						.addClass('doc-tree-node__row')
						.append(
							$('<span>')
								.addClass('doc-tree-chip doc-tree-chip--' + node.type)
								.text(node.type),
							$('<strong>').text(node.name),
							$('<small>').text(shortRuntimeKey(node.key)),
							node.meta ? $('<em>').text(node.meta) : null
						),
					children.length
						? $('<div>')
								.addClass('doc-tree-node__children')
								.append(
									children.slice(0, 30).map((child) => this.renderNode(child, depth + 1)),
									children.length > 30
										? $('<div>').addClass('doc-tree-node__more').text('+' + (children.length - 30) + ' more')
										: null
								)
						: null
				);
		}
	}

	class CodeBlock extends MC {
		constructor() {
			super();
			this.copiedState = super.state(false);
			this._copyTimer = null;
		}

		unmounted() {
			if (this._copyTimer) {
				clearTimeout(this._copyTimer);
				this._copyTimer = null;
			}
		}

		copy(codeText, setCopied) {
			copyTextToClipboard(codeText).then(() => {
				setCopied(true);
				if (this._copyTimer) clearTimeout(this._copyTimer);
				this._copyTimer = setTimeout(() => setCopied(false), 1200);
			}).catch(() => {});
		}

		render({ copiedState }, { title, lang, codeText }) {
			const [copied, setCopied] = copiedState;

			return $('<section>')
				.addClass('doc-code-block')
				.append(
					$('<div>')
						.addClass('doc-code-block__head')
						.append(
							$('<div>').append(
								$('<h3>').text(title || 'Code'),
								$('<span>').text(lang || 'text')
							),
							$('<button type="button">')
								.text(copied ? 'Скопировано' : 'Копировать')
								.on('click', () => this.copy(codeText, setCopied))
							),
					$('<pre>').append(
						renderCodeElement(codeText, lang || 'text')
					)
				);
		}
	}

	class DemoBlock extends MC {
		render({}, { block }) {
			return $('<section>')
				.addClass('doc-demo')
				.append(
					$('<div>')
						.addClass('doc-demo__text')
						.append(
							$('<h3>').text(block.title),
							$('<p>').text(block.text)
						),
					this.renderDemo(block.demo)
				);
		}

		renderDemo(type) {
			switch (type) {
				case 'counter':
					return $.MC(DemoCounter, {}, 'demo-counter');
				case 'effect-log':
					return $.MC(DemoEffectLog, {}, 'demo-effect-log');
				case 'host-canvas':
					return $.MC(DemoHostCanvas, {}, 'demo-host-canvas');
				case 'keyed-list':
					return $.MC(DemoKeyedList, {}, 'demo-keyed-list');
				case 'batching':
					return $.MC(DemoBatching, {}, 'demo-batching');
				case 'state-boundary':
					return $.MC(DemoStateBoundary, {}, 'demo-state-boundary');
				default:
					return $('<div>').addClass('doc-demo__box').text('Demo not found');
			}
		}
	}

	class DemoCounter extends MC {
		constructor() {
			super();
			this.countState = super.state(0);
		}

		render({ countState }) {
			const [count, setCount] = countState;

			return $('<div>')
				.addClass('doc-demo__box')
				.append(
					$('<div>').addClass('doc-demo__value').text(count),
					$('<div>')
						.addClass('doc-demo__actions')
						.append(
							$('<button type="button">')
								.text('+1')
								.on('click', () => setCount(count + 1)),
							$('<button type="button">')
								.text('Reset')
								.on('click', () => setCount(0))
						)
				);
		}
	}

	class DemoEffectLog extends MC {
		constructor() {
			super();
			this.countState = super.state(0);
			this.logState = super.state([]);
		}

		render({ countState, logState }) {
			const [count, setCount, countRef] = countState;
			const [log, setLog] = logState;

			$.MC.effect(([nextCount]) => {
				const nextLog = this.logState.peek().slice(-4);
				nextLog.unshift('count changed -> ' + nextCount);
				setLog(nextLog);
			}, [countRef], 'demo-effect-log-listener');

			return $('<div>')
				.addClass('doc-demo__box')
				.append(
					$('<div>').addClass('doc-demo__value').text(count),
					$('<div>')
						.addClass('doc-demo__actions')
						.append(
							$('<button type="button">')
								.text('Change count')
								.on('click', () => setCount(count + 1)),
							$('<button type="button">')
								.text('Clear log')
								.on('click', () => setLog([]))
						),
					$('<div>')
						.addClass('doc-demo__log')
						.append(
							log.length
								? log.map((line) => $('<div>').text(line))
								: $('<div>').text('Лог появится после первого изменения')
						)
				);
		}
	}

	class DemoHostCanvas extends MC {
		constructor() {
			super();
			this.toneState = super.state('teal');
		}

		draw(canvas, tone) {
			if (!canvas) return;
			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			const dpr = window.devicePixelRatio || 1;
			const width = 280;
			const height = 140;
			canvas.width = Math.round(width * dpr);
			canvas.height = Math.round(height * dpr);
			canvas.style.width = width + 'px';
			canvas.style.height = height + 'px';

			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.clearRect(0, 0, width, height);
			ctx.fillStyle = tone === 'green' ? '#2e7d32' : tone === 'amber' ? '#9a6500' : '#147d78';
			ctx.fillRect(18, 18, width - 36, height - 36);
			ctx.fillStyle = '#ffffff';
			ctx.font = '700 18px system-ui';
			ctx.fillText('MC.host canvas', 42, 76);
		}

		render({ toneState }) {
			const [tone, setTone] = toneState;

			return $('<div>')
				.addClass('doc-demo__box')
				.append(
					MC.host(
						$('<canvas>').addClass('doc-demo__canvas'),
						(canvas) => this.draw(canvas, tone)
					),
					$('<div>')
						.addClass('doc-demo__actions')
						.append(
							$('<button type="button">')
								.text('Teal')
								.on('click', () => setTone('teal')),
							$('<button type="button">')
								.text('Green')
								.on('click', () => setTone('green')),
							$('<button type="button">')
								.text('Amber')
								.on('click', () => setTone('amber'))
						)
				);
		}
	}

	class DemoKeyedList extends MC {
		constructor() {
			super();
			this.itemsState = super.state([
				{ id: 'alpha', title: 'Alpha' },
				{ id: 'bravo', title: 'Bravo' },
				{ id: 'charlie', title: 'Charlie' },
			]);
		}

		rotate(items) {
			if (items.length < 2) return items;
			return items.slice(1).concat(items[0]);
		}

		render({ itemsState }) {
			const [items, setItems] = itemsState;

			return $('<div>')
				.addClass('doc-demo__box doc-demo__box--wide')
				.append(
					$('<div>')
						.addClass('doc-demo__actions')
						.append(
							$('<button type="button">')
								.text('Rotate')
								.on('click', () => setItems(this.rotate(items))),
							$('<button type="button">')
								.text('Reverse')
								.on('click', () => setItems(items.slice().reverse())),
							$('<button type="button">')
								.text('Reset order')
								.on('click', () => setItems([
									{ id: 'alpha', title: 'Alpha' },
									{ id: 'bravo', title: 'Bravo' },
									{ id: 'charlie', title: 'Charlie' },
								]))
						),
					$('<div>')
						.addClass('doc-demo-list')
						.append(
							items.map((item) =>
								$.MC(DemoStatefulItem, { item }, 'demo-keyed-item-' + item.id)
							)
						)
				);
		}
	}

	class DemoStatefulItem extends MC {
		constructor() {
			super();
			this.clicksState = super.state(0);
		}

		render({ clicksState }, { item }) {
			const [clicks, setClicks] = clicksState;

			return $('<div>')
				.addClass('doc-demo-item')
				.append(
					$('<div>').append(
						$('<strong>').text(item.title),
						$('<span>').text('key: ' + item.id)
					),
					$('<button type="button">')
						.text('local ' + clicks)
						.on('click', () => setClicks(clicks + 1))
				);
		}
	}

	class DemoBatching extends MC {
		constructor() {
			super();
			this.aState = super.state(0);
			this.bState = super.state(0);
			this.cState = super.state(0);
			this.renderCount = 0;
		}

		render({ aState, bState, cState }) {
			const [a, setA] = aState;
			const [b, setB] = bState;
			const [c, setC] = cState;
			this.renderCount += 1;

			const bumpAll = () => {
				setA(a + 1);
				setB(b + 1);
				setC(c + 1);
			};

			const batchAll = () => {
				MC.batch(() => {
					setA(a + 1);
					setB(b + 1);
					setC(c + 1);
				});
			};

			return $('<div>')
				.addClass('doc-demo__box doc-demo__box--wide')
				.append(
					$('<div>')
						.addClass('doc-demo-meters')
						.append(
							this.renderMeter('A', a),
							this.renderMeter('B', b),
							this.renderMeter('C', c)
						),
					$('<div>')
						.addClass('doc-demo__actions')
						.append(
							$('<button type="button">')
								.text('3 sync set()')
								.on('click', bumpAll),
							$('<button type="button">')
								.text('MC.batch()')
								.on('click', batchAll),
							$('<button type="button">')
								.text('Reset')
								.on('click', () => {
									setA(0);
									setB(0);
									setC(0);
								})
						),
					$('<div>')
						.addClass('doc-demo-note')
						.text('Render calls in this component: ' + this.renderCount)
				);
		}

		renderMeter(label, value) {
			return $('<div>')
				.addClass('doc-demo-meter')
				.append(
					$('<span>').text(label),
					$('<strong>').text(value)
				);
		}
	}

	class DemoStateBoundary extends MC {
		constructor() {
			super();
			this.variantState = super.state('compact');
			this.childKeyState = super.state(1);
		}

		render({ variantState, childKeyState }) {
			const [variant, setVariant] = variantState;
			const [childKey, setChildKey] = childKeyState;
			const nextVariant = variant === 'compact' ? 'expanded' : 'compact';

			return $('<div>')
				.addClass('doc-demo__box doc-demo__box--wide')
				.append(
					$('<div>')
						.addClass('doc-demo__actions')
						.append(
							$('<button type="button">')
								.text('Change props')
								.on('click', () => setVariant(nextVariant)),
							$('<button type="button">')
								.text('New key')
								.on('click', () => setChildKey(childKey + 1))
						),
					$.MC(DemoBoundaryChild, {
						variant,
						childKey,
					}, 'demo-boundary-child-' + childKey)
				);
		}
	}

	class DemoBoundaryChild extends MC {
		constructor() {
			super();
			this.localState = super.state(0);
		}

		render({ localState }, { variant, childKey }) {
			const [local, setLocal] = localState;

			return $('<div>')
				.addClass('doc-demo-boundary')
				.append(
					$('<div>').append(
						$('<strong>').text('child key: ' + childKey),
						$('<span>').text('props.variant: ' + variant)
					),
					$('<button type="button">')
						.text('local state ' + local)
						.on('click', () => setLocal(local + 1))
				);
		}
	}

	$(function () {
		$('#root').append($.MC(DocsShell, {}, 'mc-docs-shell'));
	});
})();
