// Generated from NEW_ADD/mc_dev/docs_app.js for the public documentation.
const DOC_CONTENT = [
  {
    "id": "spa-primer",
    "group": "Старт",
    "title": "SPA-мышление с нуля",
    "short": "SPA с нуля",
    "summary": "Как думать об интерфейсе как о состоянии, даже если раньше вы писали только jQuery-скрипты.",
    "keywords": [
      "spa",
      "beginner",
      "state",
      "render",
      "interface",
      "новичок"
    ],
    "blocks": [
      {
        "kind": "lead",
        "text": "Чтобы пользоваться MC, не обязательно знать React, Vue или устройство больших SPA. Но важно понять один сдвиг мышления: интерфейс перестает быть набором разрозненных DOM-команд и становится отображением текущего состояния."
      },
      {
        "kind": "text",
        "title": "Что такое SPA-подход простыми словами",
        "text": [
          "В обычном серверном интерфейсе страница часто приходит уже готовой: пользователь нажал кнопку, сервер вернул новую HTML-страницу или кусок HTML. В jQuery-коде поверх такой страницы мы обычно ищем элементы через selector и вручную меняем текст, классы, атрибуты, видимость и обработчики.",
          "SPA-подход не обязательно означает один огромный сайт на React. В практическом смысле это подход, где часть страницы живет как маленькое приложение: у нее есть состояние, события меняют это состояние, а экран автоматически приводится к виду, который соответствует новому состоянию.",
          "MC дает именно такой маленький SPA-слой поверх jQuery. Он не требует сборки, JSX или router. Вы можете взять один виджет, описать его через component + state + render, и оставить остальную страницу обычной."
        ]
      },
      {
        "kind": "cards",
        "title": "Три слова, которые надо привыкнуть видеть",
        "cards": [
          {
            "title": "State",
            "text": "Данные, от которых зависит внешний вид: открыт ли modal, выбранный item, строка поиска, список результатов, флаг loading."
          },
          {
            "title": "Render",
            "text": "Функция, которая смотрит на текущее state/props и возвращает DOM-описание: что пользователь должен видеть прямо сейчас."
          },
          {
            "title": "Effect",
            "text": "Побочное действие: запрос, подписка, запись в console, синхронизация со сторонним widget, реакция на изменение state."
          },
          {
            "title": "Key",
            "text": "Имя identity компонента. Оно отвечает на вопрос: это тот же самый экземпляр или нужно создать новый?"
          }
        ]
      },
      {
        "kind": "text",
        "title": "Главное отличие от ручного jQuery",
        "text": [
          "В ручном jQuery код часто выглядит как цепочка действий: найти кнопку, найти блок, поменять текст, добавить класс, снять класс, показать loader, спрятать loader. Чем больше состояний у интерфейса, тем сложнее помнить, какие DOM-команды уже были выполнены и какие еще нужны.",
          "В MC вы стараетесь описывать не последовательность DOM-мутаций, а итоговую картину. Если loading=true, render возвращает loader. Если items пустой, render возвращает empty state. Если selectedItem есть, render возвращает details. Runtime сам сравнит старую и новую картину и применит минимальные изменения к DOM."
        ]
      },
      {
        "kind": "list",
        "title": "Как читать остальную документацию",
        "items": [
          "Сначала прочитайте “Что такое MC”, “Ментальная модель” и “Первый компонент”. Не пытайтесь сразу запомнить все API.",
          "Когда видите render(), задавайте вопрос: “Какой DOM должен соответствовать текущим state и props?”.",
          "Когда видите state.set(), думайте: “Я не меняю DOM напрямую, я сообщаю runtime, что данные изменились”.",
          "Когда видите key, думайте про личность компонента: “Это та же карточка или новая карточка?”.",
          "Когда видите effect, проверяйте: “Это точно побочное действие, которое нельзя просто выразить через render?”."
        ]
      },
      {
        "kind": "callout",
        "tone": "important",
        "title": "MC можно учить постепенно",
        "text": "Не нужно сразу переписывать весь интерфейс. Самый безопасный путь: выбрать маленький виджет, сделать его class component, перенести одно состояние в super.state(), а потом расширять границу компонента только когда модель стала понятной."
      }
    ]
  },
  {
    "id": "overview",
    "group": "Старт",
    "title": "Что такое MC",
    "short": "Обзор",
    "summary": "Micro Component: реактивные компоненты поверх jQuery без сборки и JSX.",
    "keywords": [
      "mc",
      "micro component",
      "jquery",
      "runtime",
      "архитектура"
    ],
    "blocks": [
      {
        "kind": "lead",
        "text": "MC (Micro Component) - компактный UI runtime поверх jQuery для реактивных компонентов, state, effects, lifecycle и DOM diff в legacy-приложениях. По роли это уже мини-фреймворк, но без отдельной сборки, JSX и большой внешней экосистемы."
      },
      {
        "kind": "text",
        "title": "Зачем вообще нужен runtime",
        "modes": [
          "learn",
          "deep"
        ],
        "text": [
          "Runtime - это слой, который берет на себя повторяющуюся работу интерфейса: хранить связи между состояниями и компонентами, понимать, кому нужна перерисовка, вызывать lifecycle и аккуратно обновлять DOM. Без такого слоя эту работу обычно делают руками: хранить флаги в переменных, искать элементы selector-ами и помнить, какие куски UI нужно обновить после каждого события.",
          "MC маленький по сравнению с большими frontend-фреймворками, но по роли он делает именно runtime-работу. Поэтому его лучше воспринимать не как набор helper-функций, а как компактную реактивную среду внутри jQuery-страницы."
        ]
      },
      {
        "kind": "list",
        "title": "Какие проблемы MC закрывает для новичка",
        "modes": [
          "learn"
        ],
        "items": [
          "Не нужно вручную синхронизировать все DOM-элементы после каждого изменения данных.",
          "Не нужно держать в голове, какие обработчики нужно снять при удалении виджета: lifecycle и cleanup дают для этого место.",
          "Не нужно придумывать свой mini-state-manager для каждого modal, filter panel или списка.",
          "Можно оставить jQuery builders, но получить предсказуемую модель state -> render -> diff."
        ]
      },
      {
        "kind": "cards",
        "title": "Главные идеи",
        "cards": [
          {
            "title": "jQuery остается основой",
            "text": "render() возвращает jQuery-объект, DOM-элемент, DocumentFragment, дочерний $.MC(...) или null."
          },
          {
            "title": "State управляет перерисовкой",
            "text": "state.set(nextValue) планирует батчированный flush. Обновляются только подписанные компоненты, контейнеры и эффекты."
          },
          {
            "title": "Компоненты живут в дереве",
            "text": "Класс extends MC получает props, локальные state, lifecycle и стабильный ключ в дереве рендера."
          },
          {
            "title": "Императивный DOM не запрещен",
            "text": "Для canvas, video и сторонних виджетов есть MC.ref() и MC.host(), чтобы безопасно работать с DOM напрямую."
          }
        ]
      },
      {
        "kind": "list",
        "title": "Что библиотека делает сама",
        "items": [
          "Автоматически инициализируется после загрузки jQuery или при первом вызове $.MC().",
          "Патчит jQuery .on()/.bind(), чтобы diff мог корректно менять обработчики событий.",
          "Сравнивает старый и новый DOM, обновляет атрибуты, классы, стили, события и дочерние узлы.",
          "Вызывает mounted(), updated(), unmounted() и cleanup-функции эффектов.",
          "Следит за удалением MC-узлов из DOM через MutationObserver и чистит внутренние коллекции."
        ]
      },
      {
        "kind": "callout",
        "tone": "important",
        "title": "Версия документации",
        "text": "Документация описывает публичный runtime MC v8.1. Проверяйте, что на странице подключена одна версия MC и что она загружается после jQuery."
      }
    ]
  },
  {
    "id": "install",
    "group": "Старт",
    "title": "Подключение и инициализация",
    "short": "Подключение",
    "summary": "Как подключить jQuery, MC.js и запустить первый компонент.",
    "keywords": [
      "script",
      "jquery",
      "init",
      "bootstrap",
      "auto init"
    ],
    "blocks": [
      {
        "kind": "text",
        "title": "Что происходит при загрузке страницы",
        "modes": [
          "learn"
        ],
        "text": [
          "Сначала браузер загружает jQuery. После этого MC добавляет в jQuery функцию $.MC и несколько связанных API. С этого момента можно создавать компоненты и вставлять их в DOM так же, как вы вставляли обычные jQuery-элементы.",
          "Важно понимать, что $.MC(...) не заменяет весь document. Он возвращает DOM-узел компонента. Вы сами выбираете, куда его вставить: в #root, в body, в documentElement или внутрь существующей серверной страницы."
        ]
      },
      {
        "kind": "callout",
        "tone": "warning",
        "title": "Не смешивайте версии без причины",
        "modes": [
          "learn",
          "deep"
        ],
        "text": "Документация описывает MicroComponent/MC.js. Если на странице случайно подключить другую версию MC или старый стендовый bundle, поведение lifecycle, diff или helper API может отличаться. Для новых виджетов держите один источник runtime на странице."
      },
      {
        "kind": "text",
        "title": "Порядок подключения",
        "text": [
          "MC должен загружаться после jQuery. Начиная с текущей версии, ручной MC.init() обычно не нужен: runtime пробует инициализироваться сразу, на DOMContentLoaded и затем коротким polling, если jQuery подключается асинхронно.",
          "Если страница подключает jQuery позже вручную, можно вызвать MC.init() после появления window.$. Повторный вызов безопасен: bootstrap идемпотентен."
        ]
      },
      {
        "kind": "code",
        "title": "Минимальная HTML-страница",
        "lang": "html",
        "code": "<div id=\"root\"></div>\n\n\t\t\t\t\t\t<script src=\"./vendor/jquery.min.js\"></script>\n\t\t\t\t\t\t<script src=\"./vendor/MC.js\"></script>\n\t\t\t\t\t\t<script src=\"./main.js\" type=\"module\"></script>"
      },
      {
        "kind": "code",
        "title": "Ручная инициализация, если она нужна",
        "lang": "js",
        "code": "// Обычно не требуется, но безопасно:\n\t\t\t\t\t\tMC.init();\n\n\t\t\t\t\t\t// Для подробных логов:\n\t\t\t\t\t\tMC.debugMode = true;"
      },
      {
        "kind": "table",
        "title": "Что появляется после bootstrap",
        "columns": [
          "Глобальное имя",
          "Назначение"
        ],
        "rows": [
          [
            "$.MC",
            "Монтирование class-компонентов и function containers."
          ],
          [
            "$.MC.memo",
            "Мемоизированный function container."
          ],
          [
            "$.MC.effect",
            "Реактивный эффект по MCState-зависимостям."
          ],
          [
            "$.MC.deferredEffect",
            "Эффект после полного завершения flush и mounted/refs."
          ],
          [
            "window.iMC",
            "Root-instance для диагностики внутренних коллекций."
          ]
        ]
      }
    ]
  },
  {
    "id": "mental-model",
    "group": "Старт",
    "title": "Ментальная модель",
    "short": "Модель",
    "summary": "Как думать о MC: state changes, flush, render, diff, lifecycle и effects.",
    "keywords": [
      "mental model",
      "state set",
      "flush",
      "render",
      "diff",
      "effects",
      "lifecycle"
    ],
    "blocks": [
      {
        "kind": "lead",
        "text": "MC проще понимать как цикл. Событие вызывает state.set(), runtime собирает изменения, перерисовывает подписчиков, применяет DOM diff, актуализирует refs/lifecycle и только потом запускает effects."
      },
      {
        "kind": "text",
        "title": "Почему цикл важнее отдельных методов",
        "modes": [
          "learn"
        ],
        "text": [
          "Новичку легко застрять на вопросе “какой метод вызвать?”. В MC полезнее сначала видеть общий цикл. Пользователь делает действие, действие меняет state, изменение state ставит компонент в очередь, render строит новую картину, diff применяет ее к DOM, effects реагируют после commit.",
          "Когда этот цикл понятен, отдельные API становятся естественными. super.state() создает данные для цикла. set() запускает цикл. render() описывает результат. effect() подключает внешнее действие к изменению данных."
        ]
      },
      {
        "kind": "list",
        "title": "Как не думать о render()",
        "modes": [
          "learn"
        ],
        "items": [
          "Не думайте о render как о “функции, которая прямо сейчас перерисовывает всю страницу”.",
          "Не думайте о render как о месте для запросов, setInterval или window listeners.",
          "Не думайте о render как о цепочке “найти старый DOM и поправить его”.",
          "Думайте о render как о честном ответе на вопрос: “какой DOM соответствует текущему состоянию?”."
        ]
      },
      {
        "kind": "cards",
        "title": "Один цикл обновления",
        "cards": [
          {
            "title": "1. Событие",
            "text": "Пользовательский click/input, ответ API, socket event или таймер вызывает setter состояния."
          },
          {
            "title": "2. state.set()",
            "text": "MC сравнивает новое значение со старым и добавляет state.id в очередь dirty states."
          },
          {
            "title": "3. Flush",
            "text": "В microtask runtime группирует изменения, сортирует подписчиков и дедуплицирует компоненты."
          },
          {
            "title": "4. render()",
            "text": "Подписанные компоненты получают свежие [value, setter, stateRef] и возвращают новый DOM-образ."
          },
          {
            "title": "5. DOM diff",
            "text": "MC патчит атрибуты, классы, стили, события, text nodes, children и keyed MC-компоненты."
          },
          {
            "title": "6. Effects",
            "text": "После DOM-коммита запускаются обычные effects, а deferred effects ждут конца всех re-flush."
          }
        ]
      },
      {
        "kind": "flow",
        "title": "Flush как цепочка",
        "steps": [
          {
            "label": "event",
            "title": "Событие",
            "text": "Handler получает текущее значение из render-closure и вызывает setter."
          },
          {
            "label": "set",
            "title": "Dirty state",
            "text": "state.set() сравнивает значения и добавляет state.id в очередь обновлений."
          },
          {
            "label": "batch",
            "title": "Microtask flush",
            "text": "Несколько синхронных set() схлопываются в один проход runtime."
          },
          {
            "label": "render",
            "title": "Новый DOM-образ",
            "text": "Компонент получает свежие tuples и возвращает jQuery/DOM/fragment/null."
          },
          {
            "label": "diff",
            "title": "DOM commit",
            "text": "MC патчит существующий DOM, стараясь сохранить identity и refs."
          },
          {
            "label": "effect",
            "title": "Effects",
            "text": "После commit запускаются effects, deferred effects ждут полного завершения."
          }
        ]
      },
      {
        "kind": "code",
        "title": "Событие -> state -> render",
        "lang": "js",
        "code": "class Toggle extends MC {\n\t\t\t\t\t\t\tconstructor() {\n\t\t\t\t\t\t\t\tsuper();\n\t\t\t\t\t\t\t\tthis.openState = super.state(false);\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\trender({ openState }) {\n\t\t\t\t\t\t\t\tconst [open, setOpen] = openState;\n\n\t\t\t\t\t\t\t\treturn $('<button type=\"button\">')\n\t\t\t\t\t\t\t\t\t.text(open ? 'Open' : 'Closed')\n\t\t\t\t\t\t\t\t\t.on('click', () => setOpen(!open));\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}"
      },
      {
        "kind": "callout",
        "tone": "important",
        "title": "render должен быть почти чистым",
        "text": "В render описывайте DOM для текущих state/props. Side effects, подписки, фокус, измерения и внешние вызовы лучше держать в обработчиках, mounted/unmounted, $.MC.effect или $.MC.deferredEffect."
      }
    ]
  },
  {
    "id": "quick-start",
    "group": "Старт",
    "title": "Первый компонент",
    "short": "Quick start",
    "summary": "Минимальный class component с локальным состоянием и обработчиком клика.",
    "keywords": [
      "quick start",
      "component",
      "render",
      "state",
      "click"
    ],
    "blocks": [
      {
        "kind": "lead",
        "text": "Рекомендуемый базовый стиль MC - классовые компоненты. Компонент наследуется от MC, создает локальные состояния в constructor и возвращает DOM из render()."
      },
      {
        "kind": "text",
        "title": "Разбор первого компонента по шагам",
        "modes": [
          "learn"
        ],
        "text": [
          "constructor выполняется один раз при создании экземпляра компонента. Здесь удобно создать локальное состояние через super.state(0). Это состояние принадлежит конкретному Counter: если на странице два Counter с разными key, у каждого будет свой count.",
          "render может вызываться много раз. Каждый раз он получает актуальное значение count и setter setCount. Когда пользователь нажимает кнопку, обработчик вызывает setCount(count + 1). После этого MC сам решает, когда выполнить flush и какой DOM нужно обновить.",
          "Обратите внимание: в обработчике нет $(\"#some-id\").text(...). Код не ищет DOM вручную. Он меняет состояние, а DOM становится следствием состояния."
        ]
      },
      {
        "kind": "callout",
        "tone": "important",
        "title": "Первый навык",
        "modes": [
          "learn"
        ],
        "text": "Если вы только начинаете, тренируйтесь переводить любые UI-фразы в state. “Открыта ли панель?” -> openState. “Что введено в поле?” -> queryState. “Какие элементы загружены?” -> itemsState. Это главный навык перед изучением более сложных API."
      },
      {
        "kind": "code",
        "title": "Counter на MC",
        "lang": "js",
        "code": "class Counter extends MC {\n\t\t\t\t\t\t\tconstructor() {\n\t\t\t\t\t\t\t\tsuper();\n\t\t\t\t\t\t\t\tthis.countState = super.state(0);\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\trender({ countState }, { title }) {\n\t\t\t\t\t\t\t\tconst [count, setCount] = countState;\n\n\t\t\t\t\t\t\t\treturn $('<section>')\n\t\t\t\t\t\t\t\t\t.addClass('counter')\n\t\t\t\t\t\t\t\t\t.append(\n\t\t\t\t\t\t\t\t\t\t$('<h2>').text(title),\n\t\t\t\t\t\t\t\t\t\t$('<button type=\"button\">')\n\t\t\t\t\t\t\t\t\t\t\t.text('Clicked: ' + count)\n\t\t\t\t\t\t\t\t\t\t\t.on('click', () => setCount(count + 1))\n\t\t\t\t\t\t\t\t\t);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\t$('#root').append(\n\t\t\t\t\t\t\t$.MC(Counter, { title: 'Hello MC' }, 'counter-root')\n\t\t\t\t\t\t);"
      },
      {
        "kind": "list",
        "title": "Что здесь важно",
        "items": [
          "this.countState = super.state(0) создает локальный MCState.",
          "В render состояние приходит по имени свойства: { countState }.",
          "Тройка состояния имеет форму [value, setter, stateRef].",
          "setCount(count + 1) вызывает state.set() и планирует обновление.",
          "Последний аргумент $.MC(..., key) задает стабильную identity компонента."
        ]
      }
    ]
  },
  {
    "id": "jquery-to-mc",
    "group": "Старт",
    "title": "Из jQuery в MC",
    "short": "jQuery -> MC",
    "summary": "Как переносить привычный jQuery-код в реактивную модель MC постепенно.",
    "keywords": [
      "jquery migration",
      "legacy",
      "state",
      "render",
      "events"
    ],
    "blocks": [
      {
        "kind": "lead",
        "text": "MC особенно полезен там, где уже есть jQuery-приложение. Не нужно переписывать всё: можно вынести один виджет в компонент, заменить ручные DOM-мутации на state + render и оставить остальной код как есть."
      },
      {
        "kind": "text",
        "title": "Как переносить код без большого переписывания",
        "modes": [
          "learn"
        ],
        "text": [
          "Не начинайте миграцию с самой большой страницы. Выберите небольшой участок, где есть понятное состояние: counter, filter, dropdown, modal, tabs, маленький список. Оберните только этот участок в компонент и оставьте внешний HTML как есть.",
          "Сначала замените одну ручную DOM-мутацию на state. Например, вместо $label.text(value) сделайте valueState и верните $label в render. Когда этот переход станет понятным, переносите следующие связанные элементы."
        ]
      },
      {
        "kind": "list",
        "title": "Хороший порядок миграции",
        "modes": [
          "learn"
        ],
        "items": [
          "Опишите, какие данные влияют на внешний вид виджета.",
          "Создайте class component и перенесите эти данные в super.state().",
          "Верните текущую разметку из render через jQuery builders.",
          "Перенесите click/input handlers внутрь render.",
          "Удалите старые ручные обновления DOM только после того, как state-путь работает."
        ]
      },
      {
        "kind": "code",
        "title": "Было: ручная DOM-мутация",
        "lang": "js",
        "code": "const $counter = $('#counter');\n\t\t\t\t\t\tlet count = 0;\n\n\t\t\t\t\t\t$('#increment').on('click', () => {\n\t\t\t\t\t\t\tcount += 1;\n\t\t\t\t\t\t\t$counter.text(count);\n\t\t\t\t\t\t});"
      },
      {
        "kind": "code",
        "title": "Стало: state описывает UI",
        "lang": "js",
        "code": "class Counter extends MC {\n\t\t\t\t\t\t\tconstructor() {\n\t\t\t\t\t\t\t\tsuper();\n\t\t\t\t\t\t\t\tthis.countState = super.state(0);\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\trender({ countState }) {\n\t\t\t\t\t\t\t\tconst [count, setCount] = countState;\n\n\t\t\t\t\t\t\t\treturn $('<div>').append(\n\t\t\t\t\t\t\t\t\t$('<span>').text(count),\n\t\t\t\t\t\t\t\t\t$('<button type=\"button\">')\n\t\t\t\t\t\t\t\t\t\t.text('+')\n\t\t\t\t\t\t\t\t\t\t.on('click', () => setCount(count + 1))\n\t\t\t\t\t\t\t\t);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}"
      },
      {
        "kind": "table",
        "title": "Как переводить привычные паттерны",
        "columns": [
          "jQuery-подход",
          "MC-подход"
        ],
        "rows": [
          [
            "Глобальная переменная хранит UI-состояние",
            "Локальный super.state() или MC.uState(key)."
          ],
          [
            "После каждого события вручную меняем DOM",
            "Событие меняет state, render возвращает новый DOM-образ."
          ],
          [
            "$(selector).on(...) после вставки разметки",
            ".on(...) прямо на создаваемом jQuery-элементе внутри render()."
          ],
          [
            "window/document listeners живут отдельно",
            "Добавить в mounted(), снять в unmounted()."
          ],
          [
            "Большой виджет сам управляет внутренним DOM",
            "Обернуть root в MC.host() и управлять children вручную."
          ]
        ]
      }
    ]
  },
  {
    "id": "when-to-use",
    "group": "Старт",
    "title": "Когда MC подходит",
    "short": "Когда подходит",
    "summary": "Где MC дает максимум пользы, а где лучше выбрать другой инструмент.",
    "keywords": [
      "when to use",
      "legacy",
      "jquery",
      "react",
      "vue",
      "tradeoffs"
    ],
    "blocks": [
      {
        "kind": "lead",
        "text": "MC стоит выбирать, когда нужно добавить реактивность в существующее jQuery-приложение без полной миграции, сборки и новой экосистемы. Он хорош как эволюционный слой: отдельные виджеты можно переписывать постепенно."
      },
      {
        "kind": "text",
        "title": "MC как слой, а не новая религия",
        "modes": [
          "learn"
        ],
        "text": [
          "MC особенно хорош, когда проект уже живет на серверных страницах и jQuery. В такой среде полный переход на большой SPA-framework может быть дорогим: нужно менять сборку, маршрутизацию, привычки команды и много инфраструктуры.",
          "MC позволяет добавить реактивную модель там, где она уже нужна, но не заставляет ломать все остальное. Один modal, одна панель фильтров или один сложный widget могут стать MC-компонентами, а соседний код останется обычным."
        ]
      },
      {
        "kind": "cards",
        "title": "MC хорошо подходит",
        "cards": [
          {
            "title": "Legacy jQuery интерфейсы",
            "text": "Когда уже есть jQuery, серверные страницы и много существующего DOM-кода."
          },
          {
            "title": "Постепенная реактивность",
            "text": "Можно начать с одного компонента или модального окна, не меняя весь frontend stack."
          },
          {
            "title": "Виджеты без сборки",
            "text": "Подключили script после jQuery и смонтировали $.MC(...) на странице."
          },
          {
            "title": "Императивные зоны",
            "text": "Canvas, video, карты, старые плагины и ручной DOM можно аккуратно оставить через MC.host()."
          }
        ]
      },
      {
        "kind": "cards",
        "title": "Где MC не лучший выбор",
        "cards": [
          {
            "title": "Новая большая SPA с экосистемой",
            "text": "Если нужны router, SSR, огромная библиотека компонентов и tooling, React/Vue/Svelte будут естественнее."
          },
          {
            "title": "Команда ожидает JSX/TSX",
            "text": "MC работает с jQuery builders. Это плюс для legacy, но не всем нравится как основной UI DSL."
          },
          {
            "title": "Сложный global state domain",
            "text": "MC.uState достаточно прост. Для больших доменных моделей может понадобиться отдельный state manager."
          },
          {
            "title": "Нужна строгая декларативность",
            "text": "MC допускает императивный DOM. Это практично, но требует дисциплины в архитектуре."
          }
        ]
      },
      {
        "kind": "callout",
        "tone": "important",
        "title": "Честное позиционирование",
        "text": "MC - не “просто helper” и не замена всей современной frontend-экосистемы. Это компактный UI runtime для тех мест, где jQuery уже живет, а реактивная модель уже нужна."
      }
    ]
  },
  {
    "id": "render-contract",
    "group": "Компоненты",
    "title": "Контракт render()",
    "short": "render()",
    "summary": "Что принимает render() и какие значения можно возвращать.",
    "keywords": [
      "render",
      "return",
      "fragment",
      "null",
      "documentfragment"
    ],
    "blocks": [
      {
        "kind": "text",
        "title": "Почему render возвращает новый DOM-образ",
        "modes": [
          "learn"
        ],
        "text": [
          "На первый взгляд кажется расточительным каждый раз создавать jQuery-элементы заново. Но MC использует эти элементы как описание желаемого результата. Runtime сравнивает это описание с уже подключенным DOM и переносит только нужные изменения.",
          "Это снимает с вас обязанность помнить все старые значения. Вы не пишете “если раньше было open, убери класс; если теперь loading, покажи spinner”. Вы просто возвращаете DOM для текущего open/loading/items, а diff занимается переходом между старым и новым видом."
        ]
      },
      {
        "kind": "callout",
        "tone": "warning",
        "title": "Не храните возвращенный jQuery-объект как источник правды",
        "modes": [
          "learn"
        ],
        "text": "DOM, который вы возвращаете из render, нужен runtime для сравнения. Источником правды должны оставаться state и props. Если нужно хранить внешний объект или DOM-ссылку, используйте field на this, MC.ref или MC.host в зависимости от задачи."
      },
      {
        "kind": "text",
        "title": "Сигнатура",
        "text": [
          "Для class component render вызывается как render(states, props, vdom). states - объект троек [value, setter, stateRef], props - shallow copy переданного объекта, vdom - внутреннее описание экземпляра.",
          "Для function container функция вызывается как fn(values, props), где values - массив текущих значений зависимых состояний."
        ]
      },
      {
        "kind": "table",
        "title": "Допустимые return-значения",
        "columns": [
          "Значение",
          "Как трактуется"
        ],
        "rows": [
          [
            "jQuery-объект",
            "Обычный путь: return $(\"<div>\").append(...)."
          ],
          [
            "HTMLElement",
            "Можно вернуть сырой DOM-узел."
          ],
          [
            "DocumentFragment",
            "MC обернет его в <mc style=\"display:contents\">. Удобно через $(\"</>\")."
          ],
          [
            "$.MC(Child, ...)",
            "Дочерний компонент будет обернут, чтобы VDOM не делил один DOM-узел."
          ],
          [
            "null / undefined",
            "Будет создан скрытый пустой <mc>. Это нормальный способ условно ничего не рисовать."
          ],
          [
            "Тот же DOM-элемент, что и раньше",
            "Persistent DOM: diff пропускается, элемент управляется компонентом вручную."
          ]
        ]
      },
      {
        "kind": "code",
        "title": "Несколько корневых узлов через fragment",
        "lang": "js",
        "code": "class Toolbar extends MC {\n\t\t\t\t\t\t\trender() {\n\t\t\t\t\t\t\t\treturn $('</>').append(\n\t\t\t\t\t\t\t\t\t$('<button type=\"button\">').text('Save'),\n\t\t\t\t\t\t\t\t\t$('<button type=\"button\">').text('Cancel')\n\t\t\t\t\t\t\t\t);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}"
      },
      {
        "kind": "code",
        "title": "Условный пустой render",
        "lang": "js",
        "code": "class Modal extends MC {\n\t\t\t\t\t\t\trender({}, { isOpen }) {\n\t\t\t\t\t\t\t\tif (!isOpen) {\n\t\t\t\t\t\t\t\t\treturn null;\n\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\treturn $('<div>').addClass('modal');\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}"
      }
    ]
  },
  {
    "id": "class-components",
    "group": "Компоненты",
    "title": "Class components",
    "short": "Классы",
    "summary": "Constructor, props, локальные поля и методы компонента.",
    "keywords": [
      "class",
      "extends MC",
      "constructor",
      "props",
      "methods"
    ],
    "blocks": [
      {
        "kind": "text",
        "title": "Компонент как владелец маленькой области UI",
        "modes": [
          "learn"
        ],
        "text": [
          "Class component удобно воспринимать как “владельца” конкретной области интерфейса. Он знает свои локальные states, свои обработчики, свои подписки и то, как выглядит его DOM. Это помогает не размазывать логику виджета по нескольким внешним файлам и selector-ам.",
          "Методы класса хороши для действий: reload(), close(), selectItem(item), submit(). render хорош для описания вида. constructor хорош для начальной структуры. mounted/unmounted хороши для связи с внешним миром."
        ]
      },
      {
        "kind": "list",
        "title": "Что можно хранить на this",
        "modes": [
          "learn"
        ],
        "items": [
          "Локальные MCState, созданные через super.state().",
          "Нереактивные кэши и служебные флаги, которые не должны сами вызывать render.",
          "Ссылки на внешние controllers, timers, sockets или plugin instances.",
          "Методы действий, которые вызываются из DOM events или lifecycle."
        ]
      },
      {
        "kind": "text",
        "title": "Создание экземпляра",
        "text": [
          "MC создает компонент через new Component(props, context, uniquekey), затем присваивает instance.mc, instance.uniquekey и parentKey. Поэтому constructor может принимать props, если компоненту нужны начальные параметры до первого render().",
          "Локальные состояния лучше создавать только в constructor. Нереактивные поля тоже можно хранить на this: кэши, сервисы, socket instances, lock-флаги, ссылки на внешние контроллеры."
        ]
      },
      {
        "kind": "code",
        "title": "Компонент с props в constructor",
        "lang": "js",
        "code": "class DataProvider extends MC {\n\t\t\t\t\t\t\tconstructor({ initialQuery }) {\n\t\t\t\t\t\t\t\tsuper();\n\t\t\t\t\t\t\t\tthis.isLoadingState = super.state(true);\n\t\t\t\t\t\t\t\tthis.itemsState = super.state([]);\n\n\t\t\t\t\t\t\t\tif (initialQuery) {\n\t\t\t\t\t\t\t\t\tthis.query = initialQuery;\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\trender({ isLoadingState, itemsState }) {\n\t\t\t\t\t\t\t\tconst [isLoading] = isLoadingState;\n\t\t\t\t\t\t\t\tconst [items] = itemsState;\n\n\t\t\t\t\t\t\t\treturn $('<div>').text(\n\t\t\t\t\t\t\t\t\tisLoading ? 'Loading...' : 'Items: ' + items.length\n\t\t\t\t\t\t\t\t);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}"
      },
      {
        "kind": "list",
        "title": "Практические правила",
        "items": [
          "Методы компонента можно вызывать из обработчиков: .on(\"click\", () => this.reload()).",
          "Асинхронные операции обычно пишут результат в локальный state через this.someState.set(value).",
          "Если компонент подписался на window/document/socket вручную, снимайте подписки в unmounted().",
          "Для нескольких экземпляров одного класса рядом почти всегда нужен явный key."
        ]
      }
    ]
  },
  {
    "id": "state",
    "group": "Состояния",
    "title": "MCState и локальное состояние",
    "short": "State",
    "summary": "super.state(), state.set(), state.get(), state.peek() и модель обновлений.",
    "keywords": [
      "state",
      "MCState",
      "get",
      "set",
      "peek",
      "deep clone",
      "batch"
    ],
    "blocks": [
      {
        "kind": "lead",
        "text": "MCState - единица реактивности. Компонент подписывается на состояния, которые попали в его normalized.states. При изменении state runtime обновляет подписчиков и эффекты."
      },
      {
        "kind": "text",
        "title": "State - это не просто переменная",
        "modes": [
          "learn"
        ],
        "text": [
          "Обычная переменная меняется молча. Если написать count += 1, MC не узнает, что интерфейс должен обновиться. MCState отличается тем, что set(value) не только сохраняет новое значение, но и сообщает runtime: “зависимые компоненты и effects нужно проверить”.",
          "Поэтому не стоит обходить setter. Если данные влияют на DOM, храните их в MCState и меняйте через set(). Если данные не влияют на DOM и нужны только как внутренний helper, их можно держать обычным полем на this."
        ]
      },
      {
        "kind": "list",
        "title": "Как выбирать форму состояния",
        "modes": [
          "learn"
        ],
        "items": [
          "boolean подходит для open/closed, loading/not loading, enabled/disabled.",
          "string подходит для query, mode, selected tab, текстового input.",
          "number подходит для counters, indexes, progress values.",
          "array подходит для списков, но обновляйте его через новую копию.",
          "object подходит для формы или выбранной сущности, но не превращайте один object в хаотичное хранилище всего экрана."
        ]
      },
      {
        "kind": "table",
        "title": "Методы MCState",
        "columns": [
          "Метод",
          "Описание"
        ],
        "rows": [
          [
            "set(value)",
            "Устанавливает новое значение, если оно отличается. Планирует batched flush."
          ],
          [
            "get()",
            "Возвращает глубокую копию значения. Безопасно мутировать копию перед set()."
          ],
          [
            "peek()",
            "Возвращает текущее значение без копирования. Быстрее, но результат нельзя мутировать."
          ]
        ]
      },
      {
        "kind": "code",
        "title": "Обновление массива",
        "lang": "js",
        "code": "addItem(title) {\n\t\t\t\t\t\t\tconst items = this.itemsState.get(); // deep clone\n\t\t\t\t\t\t\titems.push({ id: Date.now(), title });\n\t\t\t\t\t\t\tthis.itemsState.set(items);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tcountItemsFast() {\n\t\t\t\t\t\t\treturn this.itemsState.peek().length; // только чтение\n\t\t\t\t\t\t}"
      },
      {
        "kind": "callout",
        "tone": "warning",
        "title": "Не мутируйте peek()",
        "text": "peek() нужен для быстрого чтения. Если изменить объект, полученный через peek(), MC не узнает об изменении, пока не будет вызван set() с новым значением."
      },
      {
        "kind": "text",
        "title": "Сравнение значений",
        "text": [
          "Перед flush MC проверяет, действительно ли значение изменилось. Для примитивов используется ===, для объектов есть быстрый shallow-path и fallback на deepEqual. Date, RegExp, Map и Set имеют отдельную обработку.",
          "Если новое значение глубоко равно старому, перерисовки не будет. Это полезно для защиты от лишних flush, но означает, что set() с эквивалентной копией ничего не изменит."
        ]
      }
    ]
  },
  {
    "id": "global-state",
    "group": "Состояния",
    "title": "Глобальные состояния и data flow",
    "short": "uState",
    "summary": "MC.uState(), уникальные ключи и передача данных между независимыми частями интерфейса.",
    "keywords": [
      "uState",
      "global state",
      "traceKey",
      "forceUpdate",
      "data flow"
    ],
    "blocks": [
      {
        "kind": "text",
        "title": "Когда локального state уже мало",
        "modes": [
          "learn"
        ],
        "text": [
          "Локальный state принадлежит одному компоненту. Это хорошо, пока состояние нужно только внутри этой ветки. Но иногда два независимых места страницы должны смотреть на одно значение: например, глобальный overlay, состояние открытого виджета, текущий пользовательский режим или внешний entrypoint.",
          "Для таких случаев есть MC.uState(value, key). Ключ делает состояние переиспользуемым: кто бы ни вызвал MC.uState с тем же key, получит тот же MCState. Это удобно, но требует дисциплины именования, потому что key становится частью архитектуры."
        ]
      },
      {
        "kind": "callout",
        "tone": "warning",
        "title": "Глобальный state не должен быть мусорной корзиной",
        "modes": [
          "learn"
        ],
        "text": "Не переносите все локальные states в MC.uState “на всякий случай”. Чем глобальнее состояние, тем сложнее понять, кто его меняет. Начинайте с локального state и поднимайте его выше только когда действительно появились независимые потребители."
      },
      {
        "kind": "text",
        "title": "MC.uState(value, key, forceUpdate)",
        "text": [
          "Глобальное состояние создается или переиспользуется по строковому ключу. Ключ обязателен. Если состояние уже существует, MC.uState вернет его же экземпляр.",
          "Третий аргумент forceUpdate заставляет существующее состояние получить новое значение через set(value). Без forceUpdate начальное value используется только при первом создании."
        ]
      },
      {
        "kind": "code",
        "title": "Глобальный флаг открытия",
        "lang": "js",
        "code": "class Entry {\n\t\t\t\t\t\t\tconstructor() {\n\t\t\t\t\t\t\t\tthis.isOpenState = MC.uState(false, 'is-open-panel');\n\n\t\t\t\t\t\t\t\t$(document.body).append(\n\t\t\t\t\t\t\t\t\t$.MC(([isOpen]) => {\n\t\t\t\t\t\t\t\t\t\tif (!isOpen) return null;\n\t\t\t\t\t\t\t\t\t\treturn $.MC(Panel, {\n\t\t\t\t\t\t\t\t\t\t\tclose: () => this.isOpenState.set(false),\n\t\t\t\t\t\t\t\t\t\t}, 'panel');\n\t\t\t\t\t\t\t\t\t}, [this.isOpenState], 'panel-gate')\n\t\t\t\t\t\t\t\t);\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\topen() {\n\t\t\t\t\t\t\t\tthis.isOpenState.set(true);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}"
      },
      {
        "kind": "list",
        "title": "Передача состояния вниз",
        "items": [
          "Локальный state нельзя передавать дочернему компоненту как dependency массива $.MC(Child, [localState]). MC специально логирует такую ошибку.",
          "Обычный путь: передайте value и setter через props.",
          "Если ребенку нужен именно stateRef для effect, передайте stateRef как обычный prop, а уже внутри ребенка используйте его в $.MC.effect(..., [stateRef]).",
          "Для состояния, которое должно быть общим для разных веток дерева, используйте MC.uState с уникальным ключом."
        ]
      },
      {
        "kind": "code",
        "title": "Передача value/setter/stateRef как props",
        "lang": "js",
        "code": "render({ selectedState }) {\n\t\t\t\t\t\t\tconst [selected, setSelected, selectedRef] = selectedState;\n\n\t\t\t\t\t\t\treturn $.MC(Child, {\n\t\t\t\t\t\t\t\tselected,\n\t\t\t\t\t\t\t\tsetSelected,\n\t\t\t\t\t\t\t\tselectedRef,\n\t\t\t\t\t\t\t}, 'child');\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tclass Child extends MC {\n\t\t\t\t\t\t\trender({}, { selectedRef }) {\n\t\t\t\t\t\t\t\t$.MC.effect(([selected]) => {\n\t\t\t\t\t\t\t\t\tconsole.log('selected changed', selected);\n\t\t\t\t\t\t\t\t}, [selectedRef]);\n\n\t\t\t\t\t\t\t\treturn $('<div>');\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}"
      }
    ]
  },
  {
    "id": "effects",
    "group": "Состояния",
    "title": "Effects",
    "short": "Effects",
    "summary": "$.MC.effect и $.MC.deferredEffect: зависимости, cleanup и безопасные side effects.",
    "keywords": [
      "effect",
      "deferredEffect",
      "cleanup",
      "dependencies",
      "side effect"
    ],
    "blocks": [
      {
        "kind": "lead",
        "text": "Effects нужны для side effects: запросов, синхронизации с внешними объектами, подписок, реакции на state changes. В зависимости передаются MCState-экземпляры, а callback получает массив их значений."
      },
      {
        "kind": "text",
        "title": "Почему effects отделены от render",
        "modes": [
          "learn"
        ],
        "text": [
          "Render может вызываться часто, и его задача - описать DOM. Если внутри render делать запросы, подписываться на window или менять state без защиты, поведение быстро станет непредсказуемым. Один и тот же render может повториться из-за другого state, и side effect выполнится снова.",
          "Effect нужен как контролируемое место для побочных действий. Он говорит: “когда изменятся вот эти MCState, выполни этот код после DOM commit”. Так side effects становятся связаны с данными, а не случайно спрятаны внутри построения DOM."
        ]
      },
      {
        "kind": "list",
        "title": "Хорошие задачи для effect",
        "modes": [
          "learn"
        ],
        "items": [
          "Загрузить данные, когда изменился выбранный item или фильтр.",
          "Подписаться на resize, когда панель открыта, и вернуть cleanup.",
          "Синхронизировать внешний plugin после изменения state.",
          "Логировать или отправить analytics-событие после конкретного изменения.",
          "Отложенно сфокусировать элемент через deferredEffect после mounted/refs."
        ]
      },
      {
        "kind": "code",
        "title": "Effect по состояниям",
        "lang": "js",
        "code": "render({ pickedEventState, isLoadingState }) {\n\t\t\t\t\t\t\tconst [pickedEvent] = pickedEventState;\n\t\t\t\t\t\t\tconst [isLoading] = isLoadingState;\n\t\t\t\t\t\t\tconst [, , pickedEventRef] = pickedEventState;\n\t\t\t\t\t\t\tconst [, , isLoadingRef] = isLoadingState;\n\n\t\t\t\t\t\t\t$.MC.effect(([nextPickedEvent, nextIsLoading]) => {\n\t\t\t\t\t\t\t\tif (nextIsLoading) return;\n\t\t\t\t\t\t\t\tthis.loadEvent(nextPickedEvent);\n\t\t\t\t\t\t\t}, [pickedEventRef, isLoadingRef], 'load-picked-event');\n\n\t\t\t\t\t\t\treturn $('<div>').text(pickedEvent);\n\t\t\t\t\t\t}"
      },
      {
        "kind": "callout",
        "tone": "danger",
        "title": "Не передавайте обычные значения в deps",
        "text": "deps должны быть MCState-like объектами с get() и set(). Массив вида [count, label] не является корректной зависимостью для текущего MC.js."
      },
      {
        "kind": "tabs",
        "title": "Effect deps: неверно и верно",
        "tabs": [
          {
            "id": "wrong",
            "title": "Неверно",
            "tone": "danger",
            "lang": "js",
            "caption": "Так callback не подписан на MCState и может не сработать как ожидается.",
            "code": "render({ countState }) {\n\t\t\t\t\t\t\t\t\tconst [count] = countState;\n\n\t\t\t\t\t\t\t\t\t$.MC.effect(([nextCount]) => {\n\t\t\t\t\t\t\t\t\t\tconsole.log(nextCount);\n\t\t\t\t\t\t\t\t\t}, [count]); // обычное число, не stateRef\n\n\t\t\t\t\t\t\t\t\treturn $('<div>').text(count);\n\t\t\t\t\t\t\t\t}"
          },
          {
            "id": "right",
            "title": "Верно",
            "tone": "good",
            "lang": "js",
            "caption": "Третий элемент tuple - это тот же MCState, подходящий для deps.",
            "code": "render({ countState }) {\n\t\t\t\t\t\t\t\t\tconst [count, setCount, countRef] = countState;\n\n\t\t\t\t\t\t\t\t\t$.MC.effect(([nextCount]) => {\n\t\t\t\t\t\t\t\t\t\tconsole.log(nextCount);\n\t\t\t\t\t\t\t\t\t}, [countRef], 'count-effect');\n\n\t\t\t\t\t\t\t\t\treturn $('<button type=\"button\">')\n\t\t\t\t\t\t\t\t\t\t.text(count)\n\t\t\t\t\t\t\t\t\t\t.on('click', () => setCount(count + 1));\n\t\t\t\t\t\t\t\t}"
          }
        ]
      },
      {
        "kind": "table",
        "title": "Варианты эффекта",
        "columns": [
          "Вызов",
          "Когда запускается"
        ],
        "rows": [
          [
            "$.MC.effect(fn, [stateRef])",
            "После DOM-коммита, когда изменилось одно из зависимых состояний."
          ],
          [
            "$.MC.effect(fn, [])",
            "Один раз при создании effect. Обычный effect запускается синхронно."
          ],
          [
            "$.MC.deferredEffect(fn, [])",
            "Один раз после полного flush, mounted() и актуализации refs."
          ],
          [
            "$.MC.deferredEffect(fn, [stateRef])",
            "После изменения deps, но отложенно до конца всех каскадных flush."
          ]
        ]
      },
      {
        "kind": "code",
        "title": "Cleanup при unmount",
        "lang": "js",
        "code": "render({ openState }) {\n\t\t\t\t\t\t\tconst [, , openRef] = openState;\n\n\t\t\t\t\t\t\t$.MC.effect(([isOpen]) => {\n\t\t\t\t\t\t\t\tif (!isOpen) return;\n\n\t\t\t\t\t\t\t\tconst onResize = () => this.remeasure();\n\t\t\t\t\t\t\t\twindow.addEventListener('resize', onResize);\n\n\t\t\t\t\t\t\t\treturn () => {\n\t\t\t\t\t\t\t\t\twindow.removeEventListener('resize', onResize);\n\t\t\t\t\t\t\t\t};\n\t\t\t\t\t\t\t}, [openRef], 'resize-while-open');\n\n\t\t\t\t\t\t\treturn $('<div>');\n\t\t\t\t\t\t}"
      }
    ]
  },
  {
    "id": "function-containers",
    "group": "Компоненты",
    "title": "Function containers и memo",
    "short": "FC и memo",
    "summary": "Функциональные контейнеры, зависимости и отличие от class components.",
    "keywords": [
      "function container",
      "memo",
      "$.MC.memo",
      "deps"
    ],
    "blocks": [
      {
        "kind": "text",
        "title": "Почему function container не заменяет class component",
        "modes": [
          "learn"
        ],
        "text": [
          "Function container кажется проще, потому что это просто функция. Но у него нет локального constructor-state, удобных методов и полноценной роли владельца UI. Он хорош как тонкая реактивная прослойка: показать/скрыть корневой компонент, вывести маленький derived fragment, связать глобальный state с DOM.",
          "Если код начинает расти, появляются несколько handlers, lifecycle или локальное состояние, лучше сразу перейти к class component. Это делает границы ответственности понятнее."
        ]
      },
      {
        "kind": "text",
        "title": "Когда использовать",
        "text": [
          "Function container - это функция, которую MC подписывает на массив состояний. Она хороша для небольших reactive wrappers: условный gate, короткий derived view, интеграционный слой вокруг глобального state.",
          "Если компоненту нужны lifecycle, локальные states или много методов, используйте class component."
        ]
      },
      {
        "kind": "code",
        "title": "Gate-компонент как в entrypoint",
        "lang": "js",
        "code": "const isOpenState = MC.uState(false, 'is-open-app');\n\n\t\t\t\t\t\t$(document.documentElement).append(\n\t\t\t\t\t\t\t$.MC(([isOpen]) => {\n\t\t\t\t\t\t\t\tif (!isOpen) return null;\n\n\t\t\t\t\t\t\t\treturn $.MC(App, {\n\t\t\t\t\t\t\t\t\tclose: () => isOpenState.set(false),\n\t\t\t\t\t\t\t\t}, 'app-root');\n\t\t\t\t\t\t\t}, [isOpenState], 'app-gate')\n\t\t\t\t\t\t);"
      },
      {
        "kind": "callout",
        "tone": "warning",
        "title": "deps обязательны",
        "text": "createFunctionContainer логирует ошибку, если dependency array пустой или отсутствует. Для статического UI используйте class component или обычную jQuery-разметку."
      },
      {
        "kind": "text",
        "title": "$.MC.memo",
        "text": [
          "$.MC.memo работает поверх function container. Если контейнер уже существует, memo возвращает текущий HTML без немедленного rerender. Реактивные изменения все равно приходят через подписанные states.",
          "Для повторяющихся function containers используйте явный key. Ключ FC строится из текста функции и iteratorKey; одинаковые inline-функции без key могут конфликтовать."
        ]
      }
    ]
  },
  {
    "id": "keys",
    "group": "Компоненты",
    "title": "Ключи и identity",
    "short": "Keys",
    "summary": "Как MC понимает, что это тот же компонент, и когда explicit key обязателен.",
    "keywords": [
      "key",
      "identity",
      "list",
      "same component",
      "siblings"
    ],
    "blocks": [
      {
        "kind": "lead",
        "text": "Ключ определяет identity компонента в дереве. От него зависит, сохранится ли локальный state, будет ли вызван unmounted(), и какой DOM-узел diff будет патчить."
      },
      {
        "kind": "text",
        "title": "Identity на бытовом примере",
        "modes": [
          "learn"
        ],
        "text": [
          "Представьте список вкладок, карточек или строк таблицы. Если элементы поменялись местами, это не значит, что первая карточка стала другой сущностью. Возможно, та же карточка просто переехала ниже. Key объясняет runtime, где “та же самая” сущность.",
          "Если key привязан к позиции, локальный state может переехать вместе с позицией. Если key привязан к id сущности, state останется у нужной карточки даже после сортировки, фильтрации или перестановки."
        ]
      },
      {
        "kind": "callout",
        "tone": "important",
        "title": "Хороший key отвечает на вопрос “кто это?”",
        "modes": [
          "learn"
        ],
        "text": "item-42 обычно хороший key, потому что он связан с сущностью. row-0 часто плохой key для сортируемого списка, потому что он связан только с местом на экране. Для крупных режимов UI используйте осмысленные ключи вроде details-provider или edit-form."
      },
      {
        "kind": "text",
        "title": "Автоматический ключ",
        "text": [
          "Если key не передан, MC генерирует его из component, набора prop-ключей, state-ключей и context. Значения props в этот ключ не входят.",
          "Это удобно для одиночных компонентов, но опасно для двух одинаковых sibling-компонентов с одинаковой формой props."
        ]
      },
      {
        "kind": "code",
        "title": "Правильно: key в списке",
        "lang": "js",
        "code": "render({}, { users }) {\n\t\t\t\t\t\t\treturn $('<div>').append(\n\t\t\t\t\t\t\t\tusers.map((user) =>\n\t\t\t\t\t\t\t\t\t$.MC(UserCard, { user }, 'user-' + user.id)\n\t\t\t\t\t\t\t\t)\n\t\t\t\t\t\t\t);\n\t\t\t\t\t\t}"
      },
      {
        "kind": "code",
        "title": "Правильно: key для условных providers",
        "lang": "js",
        "code": "return $('<div>').append(\n\t\t\t\t\t\t\tcurrentMode === 'list' &&\n\t\t\t\t\t\t\t\t$.MC(ListProvider, props, 'workspace-list-provider'),\n\n\t\t\t\t\t\t\tcurrentMode === 'details' &&\n\t\t\t\t\t\t\t\t$.MC(DetailsProvider, props, 'workspace-details-provider')\n\t\t\t\t\t\t);"
      },
      {
        "kind": "list",
        "title": "Когда key обязателен",
        "items": [
          "В списках и map().",
          "У двух и более одинаковых компонентов рядом.",
          "У условно переключаемых крупных веток UI.",
          "У компонентов, чей локальный state должен быть привязан к конкретной сущности.",
          "У function containers, если одна и та же функция используется больше одного раза."
        ]
      }
    ]
  },
  {
    "id": "lifecycle",
    "group": "Компоненты",
    "title": "Lifecycle",
    "short": "Lifecycle",
    "summary": "mounted(), updated(), unmounted() и момент, когда компонент считается подключенным.",
    "keywords": [
      "mounted",
      "updated",
      "unmounted",
      "cleanup",
      "dom observer"
    ],
    "blocks": [
      {
        "kind": "text",
        "title": "Зачем нужен lifecycle, если есть render",
        "modes": [
          "learn"
        ],
        "text": [
          "Render описывает DOM, но не все задачи являются DOM-описанием. Иногда нужно подписаться на window, запустить timer, подключить сторонний plugin, измерить размер элемента или снять ресурс при удалении компонента. Для таких задач есть lifecycle.",
          "mounted означает: DOM уже в document, refs доступны, можно делать действия, которым нужен настоящий подключенный элемент. unmounted означает: компонент уходит, нужно убрать внешние подписки и ресурсы. updated полезен, когда нужно отреагировать именно на факт DOM-обновления."
        ]
      },
      {
        "kind": "list",
        "title": "Типичный lifecycle-чеклист",
        "modes": [
          "learn"
        ],
        "items": [
          "Добавили window/document listener в mounted - снимите его в unmounted.",
          "Создали timer или interval - сохраните id на this и очистите при unmount.",
          "Инициализировали plugin - уничтожьте или detach-ните его в unmounted.",
          "Нужен focus после появления input - делайте это после mounted или deferredEffect."
        ]
      },
      {
        "kind": "table",
        "title": "Lifecycle methods",
        "columns": [
          "Метод",
          "Когда вызывается"
        ],
        "rows": [
          [
            "mounted(states, props, vdom)",
            "После того как DOM компонента подключен к document. refs уже доступны."
          ],
          [
            "updated(prevHTML, currentHTML, vdom)",
            "После повторного render/diff, если компонент уже mounted и DOM подключен."
          ],
          [
            "unmounted(states, props, vdom)",
            "При cleanup компонента: удаление из DOM, замена identity, очистка observer-ом."
          ]
        ]
      },
      {
        "kind": "callout",
        "tone": "important",
        "title": "Про updated()",
        "text": "В type declarations updated описан как states/props/vdom, но текущий MC.js вызывает instance.updated(prevHTML, currentHTML, vdom). В документации для текущей реализации лучше опираться на фактическое поведение."
      },
      {
        "kind": "code",
        "title": "Подписка на window",
        "lang": "js",
        "code": "class HotkeyPanel extends MC {\n\t\t\t\t\t\t\tconstructor() {\n\t\t\t\t\t\t\t\tsuper();\n\t\t\t\t\t\t\t\tthis._onKeydown = (event) => {\n\t\t\t\t\t\t\t\t\tif (event.code === 'Escape') this.close();\n\t\t\t\t\t\t\t\t};\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\tmounted() {\n\t\t\t\t\t\t\t\twindow.addEventListener('keydown', this._onKeydown, true);\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\tunmounted() {\n\t\t\t\t\t\t\t\twindow.removeEventListener('keydown', this._onKeydown, true);\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\trender() {\n\t\t\t\t\t\t\t\treturn $('<div>').addClass('panel');\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}"
      },
      {
        "kind": "text",
        "title": "Mount и внешнее добавление в DOM",
        "text": [
          "$.MC(...) может создать DOM-узел до того, как он окажется в document. MC хранит такие roots в pending set и через MutationObserver вызывает mounted после подключения.",
          "Если MC-узел удалили внешним jQuery-кодом, observer собирает удаленную подветку и вызывает cleanup для function containers, class components, refs и effects."
        ]
      }
    ]
  },
  {
    "id": "refs-host",
    "group": "DOM",
    "title": "Refs, host и императивный DOM",
    "short": "Refs и host",
    "summary": "MC.ref(), MC.host(), canvas/video и сторонние библиотеки.",
    "keywords": [
      "ref",
      "host",
      "canvas",
      "video",
      "imperative dom",
      "persistent dom"
    ],
    "blocks": [
      {
        "kind": "lead",
        "text": "MC не заставляет весь DOM быть декларативным. Для canvas, video, map widgets, editors и legacy plugins можно получить DOM-ссылку и управлять частью дерева вручную."
      },
      {
        "kind": "text",
        "title": "Когда декларативности недостаточно",
        "modes": [
          "learn"
        ],
        "text": [
          "Большую часть обычного UI удобно описывать через render: кнопки, списки, формы, панели, empty states. Но есть зоны, где DOM является только оболочкой для другого мира: canvas рисуется вручную, video управляется browser API, map/editor/plugin сам создает внутреннюю разметку.",
          "В таких местах не нужно бороться с MC diff. Используйте MC.host, чтобы сказать runtime: “этот элемент мой, но его children не трогай”. Используйте MC.ref, когда нужно получить настоящий DOM-элемент после подключения."
        ]
      },
      {
        "kind": "table",
        "title": "API",
        "columns": [
          "API",
          "Что делает"
        ],
        "rows": [
          [
            "MC.ref(jqOrEl, callback)",
            "callback(el) при подключении и callback(null) при detach/replace."
          ],
          [
            "MC.ref(jqOrEl, refObject)",
            "Пишет element в refObject.current и очищает current при detach."
          ],
          [
            "MC.host(jqOrEl, ref?)",
            "Помечает элемент как host: MC обновляет сам host, но не diff-ит его children."
          ]
        ]
      },
      {
        "kind": "code",
        "title": "Canvas с MC.host",
        "lang": "js",
        "code": "class BBoxCanvas extends MC {\n\t\t\t\t\t\t\tdraw(canvas, boxes) {\n\t\t\t\t\t\t\t\tconst ctx = canvas.getContext('2d');\n\t\t\t\t\t\t\t\tctx.clearRect(0, 0, canvas.width, canvas.height);\n\t\t\t\t\t\t\t\t// draw boxes...\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\trender({}, { boxes }) {\n\t\t\t\t\t\t\t\treturn MC.host(\n\t\t\t\t\t\t\t\t\t$('<canvas>').addClass('bbox-canvas'),\n\t\t\t\t\t\t\t\t\t(canvas) => {\n\t\t\t\t\t\t\t\t\t\tif (canvas) this.draw(canvas, boxes);\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}"
      },
      {
        "kind": "code",
        "title": "Object ref",
        "lang": "js",
        "code": "class FocusInput extends MC {\n\t\t\t\t\t\t\tconstructor() {\n\t\t\t\t\t\t\t\tsuper();\n\t\t\t\t\t\t\t\tthis.inputRef = { current: null };\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\tmounted() {\n\t\t\t\t\t\t\t\tthis.inputRef.current?.focus();\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\trender() {\n\t\t\t\t\t\t\t\treturn MC.ref($('<input type=\"text\">'), this.inputRef);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}"
      },
      {
        "kind": "callout",
        "tone": "warning",
        "title": "host отключает diff детей",
        "text": "Если элемент помечен MC.host(), все дочерние узлы внутри него остаются под вашей ответственностью. Это правильно для video/canvas/plugin roots, но не для обычной декларативной верстки."
      }
    ]
  },
  {
    "id": "events-forms",
    "group": "DOM",
    "title": "События и формы",
    "short": "Events",
    "summary": "jQuery events, diff обработчиков, input/select/checkbox особенности.",
    "keywords": [
      "events",
      "on",
      "bind",
      "forms",
      "input",
      "select",
      "checkbox"
    ],
    "blocks": [
      {
        "kind": "text",
        "title": "Controlled input без мистики",
        "modes": [
          "learn"
        ],
        "text": [
          "Controlled input означает, что значение поля хранится в state. Пользователь печатает - input event вызывает setQuery(event.target.value). render снова получает query и выставляет .val(query). В итоге state и DOM-поле не расходятся.",
          "Такой подход особенно полезен, когда от поля зависят фильтрация, кнопка submit, подсказки, validation message или запрос на сервер. Вам не нужно каждый раз читать значение selector-ом; оно уже живет в state."
        ]
      },
      {
        "kind": "callout",
        "tone": "warning",
        "title": "Не дублируйте источник правды",
        "modes": [
          "learn"
        ],
        "text": "Если значение input хранится в queryState, не держите параллельно отдельную переменную query и не считайте DOM value главным источником. Один источник правды проще отлаживать."
      },
      {
        "kind": "text",
        "title": "События через jQuery",
        "text": [
          "MC патчит $.fn.on или $.fn.bind и сохраняет обработчики в __mcEvents. Поэтому события, добавленные через .on() внутри render(), участвуют в diff и корректно снимаются/добавляются.",
          "Нативные addEventListener используйте в mounted/unmounted, если это подписка на window/document или внешний объект."
        ]
      },
      {
        "kind": "code",
        "title": "Controlled input",
        "lang": "js",
        "code": "class SearchBox extends MC {\n\t\t\t\t\t\t\tconstructor() {\n\t\t\t\t\t\t\t\tsuper();\n\t\t\t\t\t\t\t\tthis.queryState = super.state('');\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\trender({ queryState }) {\n\t\t\t\t\t\t\t\tconst [query, setQuery] = queryState;\n\n\t\t\t\t\t\t\t\treturn $('<input type=\"search\">')\n\t\t\t\t\t\t\t\t\t.val(query)\n\t\t\t\t\t\t\t\t\t.attr('placeholder', 'Search')\n\t\t\t\t\t\t\t\t\t.on('input', (event) => setQuery(event.target.value));\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}"
      },
      {
        "kind": "list",
        "title": "Что diff учитывает для форм",
        "items": [
          "Для input/textarea/select значение синхронизируется через DOM property value и attribute value.",
          "Для select MC дополнительно выставляет selected у option.",
          "Для checkbox/radio checked обрабатывается отдельно через property checked и attribute checked.",
          "Если вы управляете формой сторонним plugin-ом, вынесите root в MC.host()."
        ]
      }
    ]
  },
  {
    "id": "diff",
    "group": "DOM",
    "title": "DOM diff и flush",
    "short": "Diff",
    "summary": "Как MC обновляет DOM, сортирует dirty states и запускает эффекты.",
    "keywords": [
      "diff",
      "flush",
      "batch",
      "dirty",
      "dom commit",
      "mutation observer"
    ],
    "blocks": [
      {
        "kind": "text",
        "title": "Diff не равен полной перерисовке",
        "modes": [
          "learn"
        ],
        "text": [
          "Когда state меняется, компонент действительно возвращает новый DOM-образ. Но это не значит, что браузер каждый раз уничтожает и создает весь реальный DOM заново. MC сравнивает старый и новый образ и применяет изменения точечно.",
          "Если изменился только текст кнопки, будет обновлен текст. Если поменялся class, будет обновлен class. Если key говорит, что это тот же компонент, runtime старается сохранить его identity и локальный state. Replace происходит там, где узел действительно стал другим."
        ]
      },
      {
        "kind": "list",
        "title": "Что помогает diff работать предсказуемо",
        "modes": [
          "learn"
        ],
        "items": [
          "Стабильные keys для списков и условных веток.",
          "Чистый render без случайных side effects.",
          "Одинаковая структура DOM там, где вы ожидаете patch, а не replace.",
          "MC.host для зон, где children управляются вручную."
        ]
      },
      {
        "kind": "text",
        "title": "Flush pipeline",
        "text": [
          "state.set() добавляет state.id в очередь и планирует microtask. Все синхронные set() в одном тике обычно попадают в один flush.",
          "Во flush MC собирает dirty states, сортирует глобальные перед локальными, а локальные - deep-first. Затем дедуплицирует подписанные function containers, components и effects.",
          "Сначала выполняется DOM diff, потом обычные effects. Deferred effects запускаются еще позже: после завершения всех re-flush циклов."
        ]
      },
      {
        "kind": "cards",
        "title": "Что сравнивает diff",
        "cards": [
          {
            "title": "Node type/name",
            "text": "При смене типа узла или tagName происходит replace."
          },
          {
            "title": "Attributes",
            "text": "Обычные атрибуты, value и checked имеют отдельные правила."
          },
          {
            "title": "Style/class",
            "text": "style и class сравниваются как строки атрибутов."
          },
          {
            "title": "Events",
            "text": "jQuery handlers diff-ятся через snapshot __mcEvents."
          },
          {
            "title": "Children",
            "text": "MC-компоненты матчятся как keyed children, остальное позиционно."
          },
          {
            "title": "Refs",
            "text": "ref callbacks/object refs переносятся и очищаются при detach."
          }
        ]
      },
      {
        "kind": "callout",
        "tone": "important",
        "title": "Защита от бесконечного цикла",
        "text": "MC.MAX_REFLUSH по умолчанию равен 100. Если render() или effect без условия постоянно вызывает set(), runtime остановит цикл и выведет ошибку."
      }
    ]
  },
  {
    "id": "performance",
    "group": "Практика",
    "title": "Производительность",
    "short": "Performance",
    "summary": "Батчинг, тяжелые компоненты, debug timing и persistent DOM.",
    "keywords": [
      "performance",
      "batch",
      "debug",
      "slow flush",
      "persistent dom"
    ],
    "blocks": [
      {
        "kind": "text",
        "title": "Производительность начинается с формы состояния",
        "modes": [
          "learn"
        ],
        "text": [
          "В реактивном интерфейсе дорогой не сам факт render, а лишняя работа внутри render и слишком широкая область обновления. Если весь экран зависит от одного огромного object state, любое изменение этого object может заставить думать слишком много компонентов.",
          "Лучше держать state ближе к месту использования и дробить экран на компоненты. Тогда изменение маленького локального state обновит маленькую область, а не всю страницу."
        ]
      },
      {
        "kind": "list",
        "title": "Сначала измеряйте, потом оптимизируйте",
        "modes": [
          "learn"
        ],
        "items": [
          "Включите MC.debugMode на стенде и посмотрите slow flush diagnostics.",
          "Проверьте, не создаете ли вы тяжелые DOM-деревья без необходимости.",
          "Проверьте keys: неправильная identity часто выглядит как “тормозит и сбрасывает состояние”.",
          "Проверьте effects: бесконтрольный set внутри effect может вызвать каскадные flush."
        ]
      },
      {
        "kind": "text",
        "title": "Батчинг",
        "text": [
          "Синхронные set() автоматически собираются в microtask. Для async-контекстов можно явно обернуть серию обновлений в MC.batch(fn), чтобы запланировать один flush после fn."
        ]
      },
      {
        "kind": "code",
        "title": "MC.batch",
        "lang": "js",
        "code": "MC.batch(() => {\n\t\t\t\t\t\t\tthis.isLoadingState.set(true);\n\t\t\t\t\t\t\tthis.errorState.set(false);\n\t\t\t\t\t\t\tthis.itemsState.set([]);\n\t\t\t\t\t\t});"
      },
      {
        "kind": "list",
        "title": "Практические приемы",
        "items": [
          "Дробите большие экраны на компоненты с явными keys.",
          "Не создавайте тяжелые DOM-поддеревья в render без необходимости.",
          "Для canvas/video/map/editor используйте persistent DOM или MC.host().",
          "Передавайте в props только нужные значения, а не крупные mutable объекты без причины.",
          "Включайте MC.debugMode = true на стенде, чтобы видеть slow flush и тяжелые элементы."
        ]
      },
      {
        "kind": "callout",
        "tone": "important",
        "title": "Slow flush warning",
        "text": "При debugMode runtime логирует длительность flush. Если flush дольше 16ms, MC предупреждает и показывает самые тяжелые components/effects/function containers."
      }
    ]
  },
  {
    "id": "mc-lab",
    "group": "Лаборатория",
    "title": "MC Lab",
    "short": "MC Lab",
    "summary": "Живой стенд: event, state.set, flush, render, diff и effect в одном цикле.",
    "keywords": [
      "lab",
      "runtime",
      "cycle",
      "flush",
      "interactive",
      "state",
      "effect"
    ],
    "blocks": [
      {
        "kind": "lead",
        "text": "MC Lab показывает цикл обновления как runtime-сцену: нажмите действие, посмотрите trace, состояние, preview DOM и effect-log. Документация здесь сама становится MC-компонентом, который объясняет MC."
      },
      {
        "kind": "text",
        "title": "Как пользоваться лабораторией",
        "modes": [
          "learn"
        ],
        "text": [
          "Нажимайте «Следующий этап» и смотрите слева направо. Сначала появляется событие, потом dirty state, затем microtask flush, render, diff и effect. Это тот же цикл, который происходит в обычном компоненте, только разложенный на видимые шаги.",
          "Preview показывает текущий render output, а Runtime trace сохраняет последние этапы цикла. На шаге state.set меняется count, поэтому связь между состоянием, новым DOM-образом и последующим commit видна прямо в стенде."
        ]
      },
      {
        "kind": "lab",
        "title": "Runtime cycle lab"
      }
    ]
  },
  {
    "id": "visual-diff",
    "group": "Лаборатория",
    "title": "Visual Diff Simulator",
    "short": "Visual Diff",
    "summary": "Сравнение старого и нового DOM-образа: что MC сохраняет, патчит или заменяет.",
    "keywords": [
      "diff",
      "visual",
      "dom",
      "patch",
      "keyed",
      "replace",
      "attributes"
    ],
    "blocks": [
      {
        "kind": "lead",
        "text": "Diff легче понять как набор решений. Runtime смотрит на старый и новый DOM-образ, сохраняет совместимые узлы, обновляет точечные отличия и заменяет ветку только там, где identity уже другая."
      },
      {
        "kind": "text",
        "title": "Что именно показывает simulator",
        "modes": [
          "learn"
        ],
        "text": [
          "Слева показан старый DOM-образ, справа новый DOM-образ. Между ними не “магия”, а набор решений: сохранить узел, обновить текст, поменять атрибут, сопоставить child по key или заменить ветку.",
          "В реальном runtime решений больше, но смысл тот же. Simulator нужен, чтобы перестать бояться фразы “render возвращает новый DOM”: новый образ еще не означает грубую пересборку реального DOM."
        ]
      },
      {
        "kind": "diff-simulator",
        "title": "DOM patch decisions"
      }
    ]
  },
  {
    "id": "identity-playground",
    "group": "Лаборатория",
    "title": "Identity Playground",
    "short": "Identity",
    "summary": "Сравнение position keys и entity keys: где остается локальный state.",
    "keywords": [
      "identity",
      "key",
      "local state",
      "list",
      "position",
      "entity"
    ],
    "blocks": [
      {
        "kind": "lead",
        "text": "Самая частая магия MC - это не render, а identity. Эта площадка специально показывает, как локальный state ведет себя при перестановке списка, если ключ привязан к позиции или к сущности."
      },
      {
        "kind": "text",
        "title": "Что наблюдать в playground",
        "modes": [
          "learn"
        ],
        "text": [
          "Нажмите local state на карточках, потом Rotate или Reverse. В режиме entity key счетчик остается у своей Alpha/Bravo/Charlie. В режиме position key счетчик привязан к месту, поэтому после перестановки может оказаться у другой сущности.",
          "Это одна из самых важных практических тем. Большинство странных “почему state переехал?” начинается с key, который описывает позицию, а не identity."
        ]
      },
      {
        "kind": "identity-playground",
        "title": "Position key vs entity key"
      }
    ]
  },
  {
    "id": "rosetta-stone",
    "group": "Лаборатория",
    "title": "Rosetta Stone",
    "short": "Rosetta",
    "summary": "Одна задача тремя языками: ручной jQuery, MC и React-like ошибка.",
    "keywords": [
      "rosetta",
      "jquery",
      "migration",
      "react",
      "mistake",
      "translation"
    ],
    "blocks": [
      {
        "kind": "lead",
        "text": "Rosetta Stone переводит привычные frontend-рефлексы на язык MC. Здесь одна маленькая задача показана как ручная DOM-мутация, как правильный MC-компонент и как ошибка мышления из другой экосистемы."
      },
      {
        "kind": "text",
        "title": "Зачем сравнивать три подхода",
        "modes": [
          "learn"
        ],
        "text": [
          "jQuery-пример показывает привычный императивный стиль: событие сразу меняет DOM. MC-пример показывает реактивный стиль: событие меняет state, а render описывает DOM. React-like ошибка показывает, что похожие слова вроде effect/deps не означают одинаковые правила.",
          "Пользуйтесь этой страницей как переводчиком. Если в голове появилась jQuery-команда “найти и поменять”, спросите: какое state должно измениться? Если появилась React-привычка “положить value в deps”, спросите: где здесь MCState/stateRef?"
        ]
      },
      {
        "kind": "rosetta",
        "title": "Одна задача, три подхода"
      }
    ]
  },
  {
    "id": "runtime-tree",
    "group": "Лаборатория",
    "title": "Runtime Tree Viewer",
    "short": "Runtime Tree",
    "summary": "Живое дерево component/function/effect коллекций текущей страницы документации.",
    "keywords": [
      "runtime tree",
      "component tree",
      "iMC",
      "componentCollection",
      "effectCollection",
      "fcCollection"
    ],
    "blocks": [
      {
        "kind": "lead",
        "text": "Этот viewer смотрит прямо в window.iMC и показывает, как текущая документация собрана из MC-компонентов, function containers и effects. Это диагностический слой: он ничего не меняет в runtime, только читает коллекции."
      },
      {
        "kind": "text",
        "title": "Как читать дерево runtime",
        "modes": [
          "learn",
          "deep"
        ],
        "text": [
          "Viewer показывает не DOM-дерево браузера, а внутренние коллекции MC. Component - это class component. Function container - реактивная функция. Effect и deferredEffect - side-effect подписки. У каждого узла есть key, по которому runtime хранит identity.",
          "Это полезно для отладки: можно увидеть, растет ли количество effects, остаются ли detached-компоненты, появляются ли неожиданные function containers. Для новичка это еще и способ увидеть, что MC действительно строит живую структуру приложения."
        ]
      },
      {
        "kind": "component-tree",
        "title": "Live MC collections"
      }
    ]
  },
  {
    "id": "live-demos",
    "group": "Практика",
    "title": "Живые мини-демо",
    "short": "Демо",
    "summary": "Маленькие интерактивные примеры, которые показывают state, effects и MC.host прямо на странице.",
    "keywords": [
      "demo",
      "counter",
      "effect",
      "host",
      "canvas",
      "interactive"
    ],
    "blocks": [
      {
        "kind": "lead",
        "text": "Эти блоки не являются отдельным стендом. Они маленькие специально: каждый показывает одну механику MC и рядом легко сопоставляется с остальной документацией."
      },
      {
        "kind": "text",
        "title": "Демки как упражнения",
        "modes": [
          "learn"
        ],
        "text": [
          "Не просто нажимайте кнопки. После каждого действия проговаривайте цепочку: какой handler сработал, какой state изменился, какой компонент должен обновиться, какой DOM изменился и есть ли effect после commit.",
          "Если эта цепочка стала привычной на маленьких демках, читать и писать большие MC-компоненты становится значительно легче."
        ]
      },
      {
        "kind": "demo",
        "demo": "counter",
        "title": "State + render",
        "text": "Кнопка меняет локальный state. render получает новое значение и MC патчит DOM."
      },
      {
        "kind": "demo",
        "demo": "effect-log",
        "title": "Effect по stateRef",
        "text": "Effect подписан на третий элемент tuple. При изменении count он добавляет запись в локальный лог."
      },
      {
        "kind": "demo",
        "demo": "host-canvas",
        "title": "MC.host + canvas",
        "text": "Canvas остается императивной зоной. MC не diff-ит его children, а компонент сам перерисовывает содержимое через ref."
      },
      {
        "kind": "demo",
        "demo": "keyed-list",
        "title": "Keyed list и локальный state",
        "text": "Карточки можно переставлять, а их внутренний счетчик остается при своей сущности, потому что key построен от item.id."
      },
      {
        "kind": "demo",
        "demo": "batching",
        "title": "Несколько set() в один flush",
        "text": "Три состояния меняются в одном обработчике. MC группирует синхронные изменения, и экран обновляется одним проходом."
      },
      {
        "kind": "demo",
        "demo": "state-boundary",
        "title": "Граница локального состояния",
        "text": "Изменение props сохраняет локальный state ребенка, а смена key создает новый экземпляр и сбрасывает его локальное состояние."
      }
    ]
  },
  {
    "id": "debugging",
    "group": "Практика",
    "title": "Отладка",
    "short": "Debug",
    "summary": "Логи, типичные ошибки и window.iMC для диагностики.",
    "keywords": [
      "debug",
      "logs",
      "iMC",
      "errors",
      "warnings"
    ],
    "blocks": [
      {
        "kind": "text",
        "title": "Отладка начинается с вопроса “кто владеет состоянием?”",
        "modes": [
          "learn"
        ],
        "text": [
          "Когда UI ведет себя странно, сначала найдите state, который должен объяснять этот вид. Если кнопка активна, где хранится active? Если modal открыт, где openState? Если список пустой, где itemsState и loadingState?",
          "Потом проверьте путь: кто вызывает set(), какой component читает state в render, есть ли правильный key, нет ли effect, который меняет state обратно. Такая цепочка почти всегда быстрее случайного console.log в разных местах."
        ]
      },
      {
        "kind": "table",
        "title": "Логирование",
        "columns": [
          "Настройка",
          "Поведение"
        ],
        "rows": [
          [
            "MC.debugMode = false",
            "По умолчанию видны error и warn."
          ],
          [
            "MC.debugMode = true",
            "Дополнительно видны info/debug, flush timing и slow flush diagnostics."
          ],
          [
            "MC.MAX_REFLUSH",
            "Лимит каскадных flush перед ошибкой бесконечного цикла."
          ],
          [
            "window.iMC",
            "Root instance: коллекции states, components, function containers, effects."
          ]
        ]
      },
      {
        "kind": "list",
        "title": "Частые сообщения",
        "items": [
          "Пустой компонент: первый аргумент $.MC оказался null/undefined.",
          "Неизвестный тип компонента: передан экземпляр, объект или результат вызова вместо function/class.",
          "Неправильное назначение: локальный state передан дочернему компоненту как dependency.",
          "state.set() вызван напрямую в render(): высокий риск бесконечного цикла.",
          "Ошибка чтения массива состояний: function container создан без dependency array."
        ]
      },
      {
        "kind": "code",
        "title": "Быстрая диагностика в консоли",
        "lang": "js",
        "code": "MC.debugMode = true;\n\n\t\t\t\t\t\t// Все состояния:\n\t\t\t\t\t\tMC.getState();\n\n\t\t\t\t\t\t// Конкретное глобальное состояние:\n\t\t\t\t\t\tMC.getState('widget:is-open');\n\n\t\t\t\t\t\t// Внутренние коллекции:\n\t\t\t\t\t\tiMC.componentCollection;\n\t\t\t\t\t\tiMC.effectCollection;"
      }
    ]
  },
  {
    "id": "architecture-patterns",
    "group": "Практика",
    "title": "Архитектурные паттерны",
    "short": "Архитектура",
    "summary": "Нейтральные схемы для entrypoint, app shell, provider-like веток и stateRef bridges.",
    "keywords": [
      "architecture",
      "entrypoint",
      "app shell",
      "provider",
      "bridge",
      "stateRef",
      "gate"
    ],
    "blocks": [
      {
        "kind": "text",
        "title": "Как расти от одного компонента к приложению",
        "modes": [
          "learn"
        ],
        "text": [
          "Маленький компонент может сам хранить все state. Но когда экран растет, появляется естественное разделение: entrypoint открывает приложение, AppShell владеет app-level состоянием, дочерние provider-like ветки отвечают за свои сценарии, а маленькие presentational components получают value/callback props.",
          "Не пытайтесь сразу построить идеальную архитектуру. Начните с понятного AppShell, выделяйте дочерние компоненты там, где появилась отдельная ответственность, и ставьте key на крупные условные ветки."
        ]
      },
      {
        "kind": "text",
        "title": "Entrypoint без наследования от MC",
        "text": [
          "Внешняя точка входа может быть обычным JS-классом или функцией. Ей не обязательно наследоваться от MC: достаточно создать глобальные states, подписать горячие клавиши или внешние события и смонтировать gate function container.",
          "Gate подписан на глобальные states. Когда виджет закрыт, он возвращает null. Когда открыт - возвращает корневой $.MC(AppShell, ...)."
        ]
      },
      {
        "kind": "code",
        "title": "Gate pattern",
        "lang": "js",
        "code": "class WidgetEntry {\n\t\t\t\t\t\t\tconstructor() {\n\t\t\t\t\t\t\t\tthis.isOpenState = MC.uState(false, 'widget:is-open');\n\t\t\t\t\t\t\t\tthis.startParams = null;\n\n\t\t\t\t\t\t\t\t$(document.documentElement).append(\n\t\t\t\t\t\t\t\t\t$.MC(([isOpen]) => {\n\t\t\t\t\t\t\t\t\t\tif (!isOpen) return null;\n\n\t\t\t\t\t\t\t\t\t\treturn $.MC(AppShell, {\n\t\t\t\t\t\t\t\t\t\t\tparams: this.startParams,\n\t\t\t\t\t\t\t\t\t\t\tclose: () => this.isOpenState.set(false),\n\t\t\t\t\t\t\t\t\t\t}, 'widget-app-shell');\n\t\t\t\t\t\t\t\t\t}, [this.isOpenState], 'widget-gate')\n\t\t\t\t\t\t\t\t);\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\topen(params = null) {\n\t\t\t\t\t\t\t\tthis.startParams = params;\n\t\t\t\t\t\t\t\tthis.isOpenState.set(true);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}"
      },
      {
        "kind": "text",
        "title": "App shell как владелец состояния",
        "text": [
          "Корневой компонент удобно делать владельцем app-level состояния: mode, selectedItem, filters, loading, openedPanel. Дочерним компонентам он передает обычные props: value, setter callbacks и, при необходимости, stateRef.",
          "Если дочерняя ветка должна реагировать на изменение родительского state через $.MC.effect, передавайте третий элемент tuple как обычный prop. Это не нарушает правило о запрете local state в child dependencies, потому что dependency создается уже внутри дочернего компонента."
        ]
      },
      {
        "kind": "code",
        "title": "value/setter/stateRef bridge",
        "lang": "js",
        "code": "class AppShell extends MC {\n\t\t\t\t\t\t\tconstructor() {\n\t\t\t\t\t\t\t\tsuper();\n\t\t\t\t\t\t\t\tthis.modeState = super.state('list');\n\t\t\t\t\t\t\t\tthis.selectedItemState = super.state(null);\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\trender({ modeState, selectedItemState }) {\n\t\t\t\t\t\t\t\tconst [mode, setMode] = modeState;\n\t\t\t\t\t\t\t\tconst [selectedItem, setSelectedItem, selectedItemRef] = selectedItemState;\n\n\t\t\t\t\t\t\t\treturn $('<div>').append(\n\t\t\t\t\t\t\t\t\t$.MC(Tabs, { mode, setMode }, 'tabs'),\n\n\t\t\t\t\t\t\t\t\tmode === 'list' &&\n\t\t\t\t\t\t\t\t\t\t$.MC(ListProvider, {\n\t\t\t\t\t\t\t\t\t\t\tselectedItem,\n\t\t\t\t\t\t\t\t\t\t\tsetSelectedItem,\n\t\t\t\t\t\t\t\t\t\t\tselectedItemRef,\n\t\t\t\t\t\t\t\t\t\t}, 'list-provider'),\n\n\t\t\t\t\t\t\t\t\tmode === 'details' &&\n\t\t\t\t\t\t\t\t\t\t$.MC(DetailsProvider, {\n\t\t\t\t\t\t\t\t\t\t\tselectedItem,\n\t\t\t\t\t\t\t\t\t\t\tselectedItemRef,\n\t\t\t\t\t\t\t\t\t\t}, 'details-provider')\n\t\t\t\t\t\t\t\t);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}"
      },
      {
        "kind": "list",
        "title": "Почему это хороший базовый паттерн",
        "items": [
          "AppShell остается владельцем app-level state.",
          "Дочерние ветки не получают local states как child deps, значит не нарушают ограничение MC.",
          "Provider-like компоненты могут использовать переданный stateRef внутри своих effects.",
          "Крупные ветки имеют стабильные keys: tabs, list-provider, details-provider, modal-host.",
          "External listeners добавляются в mounted и снимаются в unmounted."
        ]
      },
      {
        "kind": "callout",
        "tone": "important",
        "title": "Provider-like не значит context",
        "text": "В MC provider часто означает просто крупный компонент-ветку, который инкапсулирует загрузку, локальные states и методы. Для этого не нужен специальный Context API: обычно достаточно props, callbacks и stateRef bridges."
      }
    ]
  },
  {
    "id": "context",
    "group": "API",
    "title": "Context",
    "short": "Context",
    "summary": "MC.uContext и текущее состояние context API.",
    "keywords": [
      "context",
      "uContext",
      "advanced"
    ],
    "blocks": [
      {
        "kind": "text",
        "title": "Почему context стоит оставить на потом",
        "modes": [
          "learn"
        ],
        "text": [
          "Context выглядит привлекательно, когда не хочется прокидывать props. Но для новичка он часто прячет data flow. Если значение важно для чтения и отладки, явные props или MC.uState с хорошим key обычно понятнее.",
          "Используйте context только когда у вас есть повторяющаяся инфраструктурная зависимость и команда понимает, как она попадает в компоненты. Для обычных UI-данных начинайте с props/state."
        ]
      },
      {
        "kind": "text",
        "title": "Что есть в текущем MC.js",
        "text": [
          "MC.uContext(key) создает или возвращает MCcontext по ключу. normalizeArgs умеет распознать context и передать его в constructor компонента, а key generation учитывает context.",
          "В большинстве интерфейсов context не нужен. Для обычной передачи данных предпочтительнее props, stateRef через props или MC.uState: эти механики проще читать, тестировать и отлаживать."
        ]
      },
      {
        "kind": "code",
        "title": "Базовая форма",
        "lang": "js",
        "code": "const appContext = MC.uContext('app-context');\n\n\t\t\t\t\t\tclass Panel extends MC {\n\t\t\t\t\t\t\tconstructor(props, context) {\n\t\t\t\t\t\t\t\tsuper();\n\t\t\t\t\t\t\t\tthis.context = context;\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\trender() {\n\t\t\t\t\t\t\t\treturn $('<div>').text(this.context?.key || 'no context');\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\t$('#root').append(\n\t\t\t\t\t\t\t$.MC(Panel, appContext, { title: 'Panel' }, 'panel')\n\t\t\t\t\t\t);"
      },
      {
        "kind": "callout",
        "tone": "warning",
        "title": "Используйте осторожно",
        "text": "Context API в MC.js ниже уровнем, чем state/effect/component API. Если нет явной причины, документируйте и используйте props/uState: они понятнее и лучше представлены в живом коде проекта."
      }
    ]
  },
  {
    "id": "api-reference",
    "group": "API",
    "title": "API reference",
    "short": "Reference",
    "summary": "Сводная таблица публичного API текущего MC.js.",
    "keywords": [
      "api",
      "reference",
      "methods",
      "static"
    ],
    "blocks": [
      {
        "kind": "text",
        "title": "Как пользоваться reference",
        "modes": [
          "learn"
        ],
        "text": [
          "Reference не нужно читать подряд как учебник. Возвращайтесь сюда, когда уже понимаете задачу и хотите проверить форму вызова: какие аргументы принимает API, что он возвращает и в какой фазе lifecycle его правильно использовать.",
          "Если вы новичок, сначала ищите в reference знакомые слова: state, render, effect, host, key. Остальные методы станут понятнее после практических разделов и лабораторий."
        ]
      },
      {
        "kind": "table",
        "title": "Static MC API",
        "columns": [
          "API",
          "Описание"
        ],
        "rows": [
          [
            "MC.init()",
            "Идемпотентный bootstrap. Обычно auto-init уже сделал работу."
          ],
          [
            "MC.uState(value, key, forceUpdate?)",
            "Создать/получить глобальный MCState по key."
          ],
          [
            "MC.uContext(key)",
            "Создать/получить MCcontext по key."
          ],
          [
            "MC.getState(key?)",
            "Получить массив состояний по traceKey или все states без key."
          ],
          [
            "MC.getContext(key)",
            "Получить context по key."
          ],
          [
            "MC.ref(jqOrEl, cbOrRef)",
            "Назначить callback/object ref на DOM-узел."
          ],
          [
            "MC.host(jqOrEl, cbOrRef?)",
            "Пометить DOM-узел как host и опционально назначить ref."
          ],
          [
            "MC.batch(fn)",
            "Подавить flush внутри fn и запланировать один flush после."
          ],
          [
            "MC.enableFragmentShortSyntax()",
            "Включить $(\"</>\") как DocumentFragment. Обычно включается bootstrap-ом."
          ],
          [
            "MC.disableFragmentShortSyntax()",
            "Откатить patch fragment short syntax."
          ],
          [
            "MC.debugMode",
            "Флаг подробного логирования."
          ],
          [
            "MC.MAX_REFLUSH",
            "Лимит каскадных re-flush."
          ]
        ]
      },
      {
        "kind": "table",
        "title": "$.MC API",
        "columns": [
          "API",
          "Описание"
        ],
        "rows": [
          [
            "$.MC(Component, props?, key?)",
            "Создать или обновить class component. Возвращает DOM-узел."
          ],
          [
            "$.MC(Component, [states], props?, key?)",
            "Class component с внешними state dependencies. Не для local states вниз."
          ],
          [
            "$.MC(fn, [states], props?, key?)",
            "Function container. fn получает массив values и props."
          ],
          [
            "$.MC.memo(fn, [states], props?, key?)",
            "Мемоизированный function container."
          ],
          [
            "$.MC.effect(fn, [states], key?)",
            "Effect по MCState dependencies."
          ],
          [
            "$.MC.deferredEffect(fn, [states], key?)",
            "Effect после полного flush/mounted/refs."
          ]
        ]
      },
      {
        "kind": "table",
        "title": "Instance API",
        "columns": [
          "API",
          "Описание"
        ],
        "rows": [
          [
            "super.state(value)",
            "Создать локальный MCState компонента."
          ],
          [
            "render(states, props, vdom)",
            "Вернуть jQuery/DOM/fragment/$.MC/null."
          ],
          [
            "mounted(states, props, vdom)",
            "Lifecycle после подключения DOM."
          ],
          [
            "updated(prevHTML, currentHTML, vdom)",
            "Lifecycle после обновления DOM в текущей реализации."
          ],
          [
            "unmounted(states, props, vdom)",
            "Lifecycle при cleanup компонента."
          ]
        ]
      },
      {
        "kind": "table",
        "title": "MCState API",
        "columns": [
          "API",
          "Описание"
        ],
        "rows": [
          [
            "state.set(value)",
            "Обновить значение и запланировать flush, если значение изменилось."
          ],
          [
            "state.get()",
            "Получить deep clone."
          ],
          [
            "state.peek()",
            "Получить raw value для чтения без clone."
          ],
          [
            "state.id",
            "Внутренний UUID состояния."
          ],
          [
            "state.traceKey / nameProp",
            "Ключ/имя для диагностики и формирования states object."
          ]
        ]
      }
    ]
  },
  {
    "id": "pitfalls",
    "group": "Практика",
    "title": "Частые ошибки",
    "short": "Ошибки",
    "summary": "Что чаще всего ломает MC-приложения и как это исправлять.",
    "keywords": [
      "pitfalls",
      "errors",
      "best practices",
      "checklist"
    ],
    "blocks": [
      {
        "kind": "text",
        "title": "Ошибки - это почти всегда нарушение модели",
        "modes": [
          "learn"
        ],
        "text": [
          "Большинство проблем в MC не случайны. Они возникают, когда render начинает делать side effects, key перестает описывать identity, state мутируется в обход setter или effect получает не stateRef, а обычное значение.",
          "Хорошая новость: эти ошибки хорошо диагностируются, если возвращаться к базовой модели. Данные живут в state. Render описывает DOM. Effects делают внешние действия. Key описывает identity."
        ]
      },
      {
        "kind": "table",
        "title": "Ошибка -> исправление",
        "columns": [
          "Симптом",
          "Что сделать"
        ],
        "rows": [
          [
            "Локальный state не передается ребенку",
            "Передайте value/setter props или используйте глобальный MC.uState."
          ],
          [
            "Effect не реагирует или логирует неверный state",
            "Передавайте stateRef, а не value. Используйте третий элемент tuple."
          ],
          [
            "Две карточки делят локальный state",
            "Добавьте явный key каждому sibling/list item."
          ],
          [
            "Бесконечный flush",
            "Не вызывайте set() напрямую в render без условия. Перенесите side effect в обработчик или $.MC.effect."
          ],
          [
            "Canvas/video сбрасывается diff-ом",
            "Используйте MC.host или persistent DOM."
          ],
          [
            "Подписка на window остается после закрытия",
            "Снимайте listener в unmounted или возвращайте cleanup из effect."
          ],
          [
            "Function container конфликтует в списке",
            "Передайте iterator key последним аргументом."
          ],
          [
            "Props изменились, но локальный state сохранился от старой сущности",
            "Key должен отражать identity сущности, например item.id."
          ]
        ]
      },
      {
        "kind": "callout",
        "tone": "warning",
        "title": "Это не React",
        "text": "В MC deps эффекта - это MCState, а не произвольные значения; render возвращает jQuery/DOM, а не JSX; локальный state нельзя прокинуть вниз как child dependency. Эти ограничения не случайны: они защищают identity и уменьшают неожиданные rerender-цепочки."
      },
      {
        "kind": "do-dont",
        "title": "Быстрые правила",
        "do": [
          {
            "title": "Создавайте state в constructor",
            "text": "Так у экземпляра стабильная реактивная модель на весь lifecycle."
          },
          {
            "title": "Передавайте value/setter через props",
            "text": "Дочерние компоненты остаются простыми, а владелец state остается явным."
          },
          {
            "title": "Ставьте key на identity",
            "text": "В списках и условных ветках key должен соответствовать сущности, а не позиции."
          },
          {
            "title": "Выносите side effects из render",
            "text": "Используйте handlers, mounted/unmounted, effect или deferredEffect."
          }
        ],
        "dont": [
          {
            "title": "Не мутируйте peek()",
            "text": "peek() только для быстрого чтения. Для изменений берите get(), меняйте копию и вызывайте set()."
          },
          {
            "title": "Не используйте deps как в React",
            "text": "В deps идут MCState/stateRef, а не count, object, callback или массив произвольных значений."
          },
          {
            "title": "Не давайте двум sibling одинаковую identity",
            "text": "Иначе локальный state и lifecycle могут переехать не туда."
          },
          {
            "title": "Не diff-ите plugin DOM",
            "text": "Для canvas, video, map/editor roots используйте MC.host()."
          }
        ]
      },
      {
        "kind": "code",
        "title": "Плохо: set в render",
        "lang": "js",
        "code": "render({ readyState }) {\n\t\t\t\t\t\t\tconst [ready, setReady] = readyState;\n\n\t\t\t\t\t\t\tif (!ready) {\n\t\t\t\t\t\t\t\tsetReady(true); // риск re-flush loop\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\treturn $('<div>');\n\t\t\t\t\t\t}"
      },
      {
        "kind": "code",
        "title": "Лучше: guarded effect",
        "lang": "js",
        "code": "render({ readyState }) {\n\t\t\t\t\t\t\tconst [ready, setReady, readyRef] = readyState;\n\n\t\t\t\t\t\t\t$.MC.effect(([nextReady]) => {\n\t\t\t\t\t\t\t\tif (!nextReady) setReady(true);\n\t\t\t\t\t\t\t}, [readyRef], 'mark-ready');\n\n\t\t\t\t\t\t\treturn $('<div>').text(String(ready));\n\t\t\t\t\t\t}"
      }
    ]
  },
  {
    "id": "recipes",
    "group": "Практика",
    "title": "Рецепты",
    "short": "Рецепты",
    "summary": "Готовые мини-паттерны для типовых задач.",
    "keywords": [
      "recipes",
      "patterns",
      "modal",
      "fetch",
      "list",
      "search"
    ],
    "blocks": [
      {
        "kind": "text",
        "title": "Как читать рецепты",
        "modes": [
          "learn"
        ],
        "text": [
          "Рецепт - это не догма, а стартовая форма. Смотрите, где создается state, где вызывается set(), какой DOM возвращает render и какие props передаются вниз. После этого адаптируйте имена, keys и границы компонентов под свой экран.",
          "Если рецепт кажется слишком большим, скопируйте только один прием: например, async loading в mounted или open/close для modal. MC хорошо учится маленькими кусками."
        ]
      },
      {
        "kind": "code",
        "title": "Модальное окно с open/close",
        "lang": "js",
        "code": "class ModalHost extends MC {\n\t\t\t\t\t\t\tconstructor() {\n\t\t\t\t\t\t\t\tsuper();\n\t\t\t\t\t\t\t\tthis.openState = super.state(false);\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\trender({ openState }) {\n\t\t\t\t\t\t\t\tconst [open, setOpen] = openState;\n\n\t\t\t\t\t\t\t\treturn $('<div>').append(\n\t\t\t\t\t\t\t\t\t$('<button type=\"button\">')\n\t\t\t\t\t\t\t\t\t\t.text('Open')\n\t\t\t\t\t\t\t\t\t\t.on('click', () => setOpen(true)),\n\n\t\t\t\t\t\t\t\t\topen && $.MC(Modal, {\n\t\t\t\t\t\t\t\t\t\tclose: () => setOpen(false),\n\t\t\t\t\t\t\t\t\t}, 'modal')\n\t\t\t\t\t\t\t\t);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}"
      },
      {
        "kind": "code",
        "title": "Асинхронная загрузка в mounted",
        "lang": "js",
        "code": "class UsersPanel extends MC {\n\t\t\t\t\t\t\tconstructor() {\n\t\t\t\t\t\t\t\tsuper();\n\t\t\t\t\t\t\t\tthis.usersState = super.state([]);\n\t\t\t\t\t\t\t\tthis.loadingState = super.state(true);\n\t\t\t\t\t\t\t\tthis.errorState = super.state(null);\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\tasync mounted() {\n\t\t\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\t\t\tconst response = await fetch('/api/users');\n\t\t\t\t\t\t\t\t\tconst users = await response.json();\n\t\t\t\t\t\t\t\t\tthis.usersState.set(users);\n\t\t\t\t\t\t\t\t} catch (error) {\n\t\t\t\t\t\t\t\t\tthis.errorState.set(error);\n\t\t\t\t\t\t\t\t} finally {\n\t\t\t\t\t\t\t\t\tthis.loadingState.set(false);\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\trender({ usersState, loadingState, errorState }) {\n\t\t\t\t\t\t\t\tconst [users] = usersState;\n\t\t\t\t\t\t\t\tconst [loading] = loadingState;\n\t\t\t\t\t\t\t\tconst [error] = errorState;\n\n\t\t\t\t\t\t\t\tif (loading) return $('<div>').text('Loading...');\n\t\t\t\t\t\t\t\tif (error) return $('<div>').text('Failed');\n\n\t\t\t\t\t\t\t\treturn $('<ul>').append(\n\t\t\t\t\t\t\t\t\tusers.map((user) => $('<li>').text(user.name))\n\t\t\t\t\t\t\t\t);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}"
      },
      {
        "kind": "code",
        "title": "Поиск по локальному state",
        "lang": "js",
        "code": "class FilteredList extends MC {\n\t\t\t\t\t\t\tconstructor() {\n\t\t\t\t\t\t\t\tsuper();\n\t\t\t\t\t\t\t\tthis.queryState = super.state('');\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\trender({ queryState }, { items }) {\n\t\t\t\t\t\t\t\tconst [query, setQuery] = queryState;\n\t\t\t\t\t\t\t\tconst normalized = query.trim().toLowerCase();\n\t\t\t\t\t\t\t\tconst filtered = items.filter((item) =>\n\t\t\t\t\t\t\t\t\titem.title.toLowerCase().includes(normalized)\n\t\t\t\t\t\t\t\t);\n\n\t\t\t\t\t\t\t\treturn $('<div>').append(\n\t\t\t\t\t\t\t\t\t$('<input type=\"search\">')\n\t\t\t\t\t\t\t\t\t\t.val(query)\n\t\t\t\t\t\t\t\t\t\t.on('input', (event) => setQuery(event.target.value)),\n\n\t\t\t\t\t\t\t\t\t$('<div>').append(\n\t\t\t\t\t\t\t\t\t\tfiltered.map((item) =>\n\t\t\t\t\t\t\t\t\t\t\t$.MC(ItemCard, { item }, 'item-' + item.id)\n\t\t\t\t\t\t\t\t\t\t)\n\t\t\t\t\t\t\t\t\t)\n\t\t\t\t\t\t\t\t);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}"
      }
    ]
  },
  {
    "id": "templates",
    "group": "Практика",
    "title": "Шаблоны кода",
    "short": "Шаблоны",
    "summary": "Копируемые заготовки для частых MC-сценариев.",
    "keywords": [
      "templates",
      "copy",
      "starter",
      "boilerplate",
      "class component",
      "effect"
    ],
    "blocks": [
      {
        "kind": "lead",
        "text": "Эта страница - быстрый набор стартовых форм. В каждом шаблоне оставлена только механика MC: компонент, effect, gate, async mounted или host-zone."
      },
      {
        "kind": "text",
        "title": "Шаблон - это каркас, не готовая архитектура",
        "modes": [
          "learn"
        ],
        "text": [
          "Копируемые шаблоны помогают не вспоминать синтаксис с нуля. Но после вставки важно переименовать states, methods и keys так, чтобы они описывали конкретную задачу. Хорошие имена в MC сильно помогают отладке.",
          "Например, key widget-shell нормален для абстрактного шаблона, но в реальном коде лучше назвать его user-filter-shell или report-settings-modal. Тогда runtime tree и debug logs будут читаться как карта приложения."
        ]
      },
      {
        "kind": "template-grid",
        "title": "Выберите заготовку",
        "templates": [
          {
            "id": "class-component",
            "title": "Class component",
            "lang": "js",
            "code": "class Widget extends MC {\n\t\t\t\t\tconstructor() {\n\t\t\t\t\t\tsuper();\n\t\t\t\t\t\tthis.valueState = super.state(null);\n\t\t\t\t\t}\n\n\t\t\t\t\trender({ valueState }, { title }) {\n\t\t\t\t\t\tconst [value, setValue, valueRef] = valueState;\n\n\t\t\t\t\t\treturn $('<section>').append(\n\t\t\t\t\t\t\t$('<h2>').text(title),\n\t\t\t\t\t\t\t$('<button type=\"button\">')\n\t\t\t\t\t\t\t\t.text(String(value))\n\t\t\t\t\t\t\t\t.on('click', () => setValue(Date.now()))\n\t\t\t\t\t\t);\n\t\t\t\t\t}\n\t\t\t\t}"
          },
          {
            "id": "effect",
            "title": "Effect",
            "lang": "js",
            "code": "render({ selectedState }) {\n\t\t\t\t\tconst [selected, setSelected, selectedRef] = selectedState;\n\n\t\t\t\t\t$.MC.effect(([nextSelected]) => {\n\t\t\t\t\t\tif (!nextSelected) return;\n\t\t\t\t\t\tthis.loadDetails(nextSelected);\n\t\t\t\t\t}, [selectedRef], 'load-selected-details');\n\n\t\t\t\t\treturn $('<div>');\n\t\t\t\t}"
          },
          {
            "id": "global-gate",
            "title": "Global state gate",
            "lang": "js",
            "code": "const openState = MC.uState(false, 'widget:is-open');\n\n\t\t\t\t$(document.body).append(\n\t\t\t\t\t$.MC(([isOpen]) => {\n\t\t\t\t\t\tif (!isOpen) return null;\n\n\t\t\t\t\t\treturn $.MC(AppShell, {\n\t\t\t\t\t\t\tclose: () => openState.set(false),\n\t\t\t\t\t\t}, 'widget-shell');\n\t\t\t\t\t}, [openState], 'widget-gate')\n\t\t\t\t);"
          },
          {
            "id": "async-mounted",
            "title": "Async mounted",
            "lang": "js",
            "code": "class DataPanel extends MC {\n\t\t\t\t\tconstructor() {\n\t\t\t\t\t\tsuper();\n\t\t\t\t\t\tthis.itemsState = super.state([]);\n\t\t\t\t\t\tthis.loadingState = super.state(true);\n\t\t\t\t\t}\n\n\t\t\t\t\tasync mounted() {\n\t\t\t\t\t\tconst items = await api.loadItems();\n\t\t\t\t\t\tthis.itemsState.set(items);\n\t\t\t\t\t\tthis.loadingState.set(false);\n\t\t\t\t\t}\n\t\t\t\t}"
          },
          {
            "id": "host-canvas",
            "title": "Canvas host",
            "lang": "js",
            "code": "render({}, { model }) {\n\t\t\t\t\treturn MC.host($('<canvas>'), (canvas) => {\n\t\t\t\t\t\tif (!canvas) return;\n\t\t\t\t\t\tthis.draw(canvas, model);\n\t\t\t\t\t});\n\t\t\t\t}"
          }
        ]
      },
      {
        "kind": "callout",
        "tone": "important",
        "title": "Ключи лучше переименовывать сразу",
        "text": "В шаблонах ключи намеренно человеческие. После копирования дайте им имя конкретной области: widget-shell, user-row-42, report-filter-panel. Это сильно упрощает отладку identity."
      }
    ]
  },
  {
    "id": "cheatsheet",
    "group": "API",
    "title": "Краткая памятка",
    "short": "Памятка",
    "summary": "Самые частые формы вызовов в одном месте.",
    "keywords": [
      "cheatsheet",
      "summary",
      "quick reference"
    ],
    "blocks": [
      {
        "kind": "text",
        "title": "Памятка после понимания модели",
        "modes": [
          "learn"
        ],
        "text": [
          "Эта страница специально короткая. Она полезна, когда вы уже поняли цикл MC и хотите быстро вспомнить форму вызова. Если какой-то пример здесь кажется непонятным, вернитесь к соответствующему разделу: State, Effects, Refs или Function containers."
        ]
      },
      {
        "kind": "code",
        "title": "Компоненты",
        "lang": "js",
        "code": "// Class component\n\t\t\t\t\t\t$.MC(Header, { title: 'Docs' }, 'docs-header')\n\n\t\t\t\t\t\t// Class component with external global state dependency\n\t\t\t\t\t\t$.MC(App, [isHideState], { props }, 'app')\n\n\t\t\t\t\t\t// Function container\n\t\t\t\t\t\t$.MC(([isOpen]) => {\n\t\t\t\t\t\t\treturn isOpen ? $.MC(App, {}, 'app') : null;\n\t\t\t\t\t\t}, [isOpenState], 'app-gate')"
      },
      {
        "kind": "code",
        "title": "State и effects",
        "lang": "js",
        "code": "// Local\n\t\t\t\t\t\tthis.countState = super.state(0);\n\n\t\t\t\t\t\t// Global\n\t\t\t\t\t\tconst openState = MC.uState(false, 'open-state');\n\n\t\t\t\t\t\t// In render\n\t\t\t\t\t\tconst [count, setCount, countRef] = countState;\n\n\t\t\t\t\t\t// Effect\n\t\t\t\t\t\t$.MC.effect(([nextCount]) => {\n\t\t\t\t\t\t\tconsole.log(nextCount);\n\t\t\t\t\t\t}, [countRef], 'count-log');"
      },
      {
        "kind": "code",
        "title": "Refs",
        "lang": "js",
        "code": "MC.ref($('<input>'), (input) => {\n\t\t\t\t\t\t\tif (input) input.focus();\n\t\t\t\t\t\t});\n\n\t\t\t\t\t\tMC.host($('<canvas>'), (canvas) => {\n\t\t\t\t\t\t\tif (canvas) draw(canvas);\n\t\t\t\t\t\t});"
      }
    ]
  }
];

export default DOC_CONTENT;
