const DOC_PAGES = [
  {
    id: "overview",
    title: "Overview",
    text: "Что такое MC и где он полезен",
  },
  {
    id: "installation",
    title: "Installation",
    text: "Подключение, MC.init() и первый старт",
  },
  {
    id: "components",
    title: "Components",
    text: "Class / function components и композиция",
  },
  {
    id: "state",
    title: "State",
    text: "Local state, shared state и context",
  },
  {
    id: "effects",
    title: "Effects",
    text: "effect, memo и реакция на изменения",
  },
  {
    id: "lifecycle",
    title: "Lifecycle",
    text: "mounted, unmounted, ref и host",
  },
];

export default class Doc extends MC {
  constructor() {
    super();
    this.sectionState = super.state("overview");
  }

  render({ sectionState }, { setPage }) {
    const [section, setSection, instanceSection] = sectionState;

    $.MC.effect(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, [instanceSection]);

    return $("<main>")
      .addClass("mc-doc-page")
      .append(
        $.MC(DocBackdrop, {}, "doc-backdrop"),
        $("<div>")
          .addClass("mc-doc-page_shell")
          .append(
            $.MC(DocTopbar, { setPage, section }, "doc-topbar"),
            $("<section>")
              .addClass("mc-doc-page_layout")
              .append(
                $.MC(
                  DocSidebar,
                  {
                    section,
                    setSection,
                    pages: DOC_PAGES,
                  },
                  "doc-sidebar",
                ),
                $("<div>")
                  .addClass("mc-doc-page_content")
                  .append($.MC(DocPageSwitch, { section }, "doc-page-switch")),
              ),
          ),
      );
  }
}

class DocPageSwitch extends MC {
  render({}, { section }) {
    let page = null;

    if (section === "installation") {
      page = $.MC(DocInstallPage, {}, "doc-install-page");
    } else if (section === "components") {
      page = $.MC(DocComponentsPage, {}, "doc-components-page");
    } else if (section === "state") {
      page = $.MC(DocStatePage, {}, "doc-state-page");
    } else if (section === "effects") {
      page = $.MC(DocEffectsPage, {}, "doc-effects-page");
    } else if (section === "lifecycle") {
      page = $.MC(DocLifecyclePage, {}, "doc-lifecycle-page");
    } else {
      page = $.MC(DocOverviewPage, {}, "doc-overview-page");
    }

    return $("<div>").append(page);
  }
}

class DocComponentsPage extends MC {
  render() {
    return $("<section>")
      .addClass("mc-doc-section mc-doc-anim-in mc-doc-anim-in--d2")
      .append(
        $.MC(
          SectionHeader,
          {
            kicker: "COMPONENTS",
            title: "Class and function components",
            text: "В MC можно строить интерфейс как из class-компонентов, так и из обычных функций. Оба подхода могут жить рядом, и это удобно для постепенного роста проекта.",
          },
          "components-header",
        ),

        $("<div>")
          .addClass("mc-doc-compare-grid")
          .append(
            $.MC(
              CompareCard,
              {
                title: "Class component",
                text: "Подходит, когда у компонента есть собственный local state, методы, lifecycle и более сложное поведение.",
                code: `class Counter extends MC {
    constructor() {
        super();
        this.countState = super.state(0);
    }

    render({ countState }) {
        const [count, setCount] = countState;

        return $('<div>').append(
            $('<button>')
                .text('+')
                .on('click', () => setCount(count + 1)),
            $('<span>').text(' ' + count)
        );
    }
}`,
              },
              "cmp-class-card",
            ),

            $.MC(
              CompareCard,
              {
                title: "Function component",
                text: "Хорош для небольших UI-частей и композиции. Особенно удобен там, где не нужен тяжёлый класс.",
                code: `function Counter(_s, { initial = 0 }) {
    const countState = MC.uState(initial);
    const count = countState.get();

    return $('<div>').append(
        $('<button>')
            .text('+')
            .on('click', () => countState.set(count + 1)),
        $('<span>').text(' ' + count)
    );
}`,
              },
              "cmp-fn-card",
            ),
          ),

        $("<div>")
          .addClass("mc-doc-wide-panel")
          .append(
            $("<div>")
              .addClass("mc-doc-wide-panel_head")
              .append(
                $("<div>")
                  .addClass("mc-doc-pill mc-doc-pill--soft")
                  .text("COMPOSITION"),
                $("<h3>")
                  .addClass("mc-doc-wide-panel_title")
                  .text("Компоненты собираются через $.MC(...)"),
              ),
            $.MC(
              CodeBlock,
              {
                code: `class Button extends MC {
    render(_, { text, onClick }) {
        return $('<button>')
            .text(text)
            .on('click', onClick);
    }
}

class Toolbar extends MC {
    render() {
        return $('<div>').append(
            $.MC(Button, { text: 'Save', onClick: () => console.log('save') }),
            $.MC(Button, { text: 'Close', onClick: () => console.log('close') })
        );
    }
}`,
              },
              "components-compose-code",
            ),
            $("<div>")
              .addClass("mc-doc-mini-list")
              .append(
                $.MC(
                  MiniBullet,
                  {
                    text: "Компоненты можно свободно вкладывать друг в друга.",
                  },
                  "cmp-b-1",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Props передаются вторым аргументом в render/function component.",
                  },
                  "cmp-b-2",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Страница или крупный виджет обычно собираются из множества маленьких компонентов.",
                  },
                  "cmp-b-3",
                ),
              ),
          ),
      );
  }
}

class DocStatePage extends MC {
  render() {
    return $("<section>")
      .addClass("mc-doc-section mc-doc-anim-in mc-doc-anim-in--d2")
      .append(
        $.MC(
          SectionHeader,
          {
            kicker: "STATE",
            title: "Local, shared and context state",
            text: "MC даёт несколько уровней хранения данных. На практике это удобно: локальное поведение остаётся внутри компонента, а разделяемые данные можно вынести выше.",
          },
          "state-header",
        ),

        $("<div>")
          .addClass("mc-doc-cards-grid")
          .append(
            $.MC(
              InfoCard,
              {
                title: "Local state",
                text: "В class-компонентах состояние обычно создаётся через super.state(...). Это хороший выбор для UI-флагов, локальных настроек и поведения конкретного компонента.",
              },
              "state-card-local",
            ),
            $.MC(
              InfoCard,
              {
                title: "Shared state",
                text: "Если одно значение должно использоваться в нескольких местах, удобно поднимать его через MC.uState(...) и работать с ним как с общим источником данных.",
              },
              "state-card-shared",
            ),
            $.MC(
              InfoCard,
              {
                title: "Context",
                text: "Для общих зависимостей и контекстной информации можно использовать MC.uContext(...), не превращая всё подряд в глобальные переменные.",
              },
              "state-card-context",
            ),
          ),

        $("<div>")
          .addClass("mc-doc-install-grid")
          .append(
            $.MC(
              CodeCard,
              {
                title: "Local state",
                subtitle: "class component",
                code: `class Panel extends MC {
    constructor() {
        super();
        this.openState = super.state(false);
    }

    render({ openState }) {
        const [open, setOpen] = openState;

        return $('<div>').append(
            $('<button>')
                .text(open ? 'Hide' : 'Show')
                .on('click', () => setOpen(!open))
        );
    }
}`,
              },
              "state-code-local",
            ),

            $.MC(
              CodeCard,
              {
                title: "Shared state",
                subtitle: "uState",
                code: `const socketState = MC.uState(null, 'socket-state');

function StatusWidget() {
    const value = socketState.get();

    return $('<div>').text(
        value ? 'Connected' : 'Disconnected'
    );
}`,
              },
              "state-code-shared",
            ),
          ),

        $("<div>")
          .addClass("mc-doc-wide-panel")
          .append(
            $("<div>")
              .addClass("mc-doc-wide-panel_head")
              .append(
                $("<div>")
                  .addClass("mc-doc-pill mc-doc-pill--soft")
                  .text("PRACTICAL RULE"),
                $("<h3>")
                  .addClass("mc-doc-wide-panel_title")
                  .text("Как не запутаться"),
              ),
            $("<div>")
              .addClass("mc-doc-mini-list")
              .append(
                $.MC(
                  MiniBullet,
                  {
                    text: "Если значение живёт только внутри одного компонента — начни с local state.",
                  },
                  "state-rule-1",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Если его читают разные части интерфейса — поднимай в shared state.",
                  },
                  "state-rule-2",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Если нужен общий “канал окружения” — смотри в сторону context.",
                  },
                  "state-rule-3",
                ),
              ),
          ),
      );
  }
}

class DocEffectsPage extends MC {
  render() {
    return $("<section>")
      .addClass("mc-doc-section mc-doc-anim-in mc-doc-anim-in--d2")
      .append(
        $.MC(
          SectionHeader,
          {
            kicker: "EFFECTS",
            title: "effect and memo",
            text: "Когда нужно не просто перерисовать UI, а выполнить побочное действие в ответ на изменение данных, используется effect. Для вычислительно тяжёлых кусков пригодится memo.",
          },
          "effects-header",
        ),

        $("<div>")
          .addClass("mc-doc-install-grid")
          .append(
            $.MC(
              CodeCard,
              {
                title: "Effect",
                subtitle: "$.MC.effect",
                code: `$.MC.effect(() => {
    console.log('selected item changed');
}, [instanceSelectedItem]);`,
              },
              "effect-code-1",
            ),

            $.MC(
              CodeCard,
              {
                title: "Memo",
                subtitle: "$.MC.memo",
                code: `const result = $.MC.memo(() => {
    return heavyCalculation(data);
}, [instanceData]);`,
              },
              "effect-code-2",
            ),
          ),

        $("<div>")
          .addClass("mc-doc-step-grid")
          .append(
            $.MC(
              StepCard,
              {
                index: "01",
                title: "Render describes UI",
                text: "render должен в первую очередь описывать DOM-output, а не выполнять побочные операции.",
              },
              "eff-step-1",
            ),
            $.MC(
              StepCard,
              {
                index: "02",
                title: "Effect reacts to changes",
                text: "Если действие должно случиться после изменения состояния или зависимостей — для этого лучше использовать effect.",
              },
              "eff-step-2",
            ),
            $.MC(
              StepCard,
              {
                index: "03",
                title: "Memo avoids repeated heavy work",
                text: "Если вычисление тяжёлое и зависит от ограниченного набора входов, его имеет смысл мемоизировать.",
              },
              "eff-step-3",
            ),
          ),

        $("<div>")
          .addClass("mc-doc-wide-panel")
          .append(
            $("<div>")
              .addClass("mc-doc-wide-panel_head")
              .append(
                $("<div>")
                  .addClass("mc-doc-pill mc-doc-pill--soft")
                  .text("REAL USAGE"),
                $("<h3>")
                  .addClass("mc-doc-wide-panel_title")
                  .text("Как это обычно выглядит"),
              ),
            $.MC(
              CodeBlock,
              {
                code: `$.MC.effect(() => {
    if (!onVideoPlay) {
        setVideoPause(false);
    }
}, [instanceVideoPlay]);`,
              },
              "effects-real-code",
            ),
            $("<div>")
              .addClass("mc-doc-callout")
              .text(
                "Хорошее практическое правило: если код должен случиться “в ответ на изменение”, а не “в момент построения DOM”, лучше вынести его в effect.",
              ),
          ),
      );
  }
}

class DocLifecyclePage extends MC {
  render() {
    return $("<section>")
      .addClass("mc-doc-section mc-doc-anim-in mc-doc-anim-in--d2")
      .append(
        $.MC(
          SectionHeader,
          {
            kicker: "LIFECYCLE",
            title: "mounted, unmounted, ref and host",
            text: "MC даёт lifecycle-слой для кода, который должен жить рядом с реальным DOM: подписки, глобальные listeners, refs и интеграция с уже существующими узлами.",
          },
          "lifecycle-header",
        ),

        $("<div>")
          .addClass("mc-doc-cards-grid")
          .append(
            $.MC(
              InfoCard,
              {
                title: "mounted",
                text: "Подходит для действий после появления компонента в DOM: listeners, внешние подключения, инициализация сторонних сущностей.",
              },
              "life-card-mounted",
            ),
            $.MC(
              InfoCard,
              {
                title: "unmounted",
                text: "Используется для очистки: removeEventListener, destroy, отмена подписок и безопасный выход из компонента.",
              },
              "life-card-unmounted",
            ),
            $.MC(
              InfoCard,
              {
                title: "ref / host",
                text: "Через ref можно получить доступ к реальному элементу, а host помогает явно пометить хостовый узел при интеграции с DOM.",
              },
              "life-card-ref",
            ),
          ),

        $("<div>")
          .addClass("mc-doc-install-grid")
          .append(
            $.MC(
              CodeCard,
              {
                title: "Lifecycle methods",
                subtitle: "class component",
                code: `class Player extends MC {
    mounted() {
        window.addEventListener('keydown', this.onKeyDown);
    }

    unmounted() {
        window.removeEventListener('keydown', this.onKeyDown);
    }

    render() {
        return $('<div>').text('Player');
    }
}`,
              },
              "life-code-lifecycle",
            ),

            $.MC(
              CodeCard,
              {
                title: "ref / host",
                subtitle: "DOM access",
                code: `const elRef = { current: null };

return MC.host(
    $('<div>').append(
        MC.ref($('<canvas>'), elRef)
    )
);`,
              },
              "life-code-ref",
            ),
          ),

        $("<div>")
          .addClass("mc-doc-wide-panel")
          .append(
            $("<div>")
              .addClass("mc-doc-wide-panel_head")
              .append(
                $("<div>")
                  .addClass("mc-doc-pill mc-doc-pill--soft")
                  .text("PRACTICAL NOTE"),
                $("<h3>")
                  .addClass("mc-doc-wide-panel_title")
                  .text("Что сюда обычно выносить"),
              ),
            $("<div>")
              .addClass("mc-doc-mini-list")
              .append(
                $.MC(
                  MiniBullet,
                  { text: "window / document listeners" },
                  "life-rule-1",
                ),
                $.MC(
                  MiniBullet,
                  { text: "интеграцию с canvas / video / third-party widgets" },
                  "life-rule-2",
                ),
                $.MC(
                  MiniBullet,
                  { text: "ручной доступ к DOM-элементу через ref" },
                  "life-rule-3",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "обязательную очистку всего, что было навешано в mounted",
                  },
                  "life-rule-4",
                ),
              ),
          ),
      );
  }
}

class HeroStatMini extends MC {
  render({}, { label = "", value = "" }) {
    return $("<div>")
      .addClass("mc-doc-hero-mini")
      .append(
        $("<div>").addClass("mc-doc-hero-mini_label").text(label),
        $("<div>").addClass("mc-doc-hero-mini_value").text(value),
      );
  }
}

class StepCard extends MC {
  render({}, { index = "", title = "", text = "" }) {
    return $("<article>")
      .addClass("mc-doc-step-card")
      .append(
        $("<div>").addClass("mc-doc-step-card_index").text(index),
        $("<div>").addClass("mc-doc-step-card_title").text(title),
        $("<div>").addClass("mc-doc-step-card_text").text(text),
      );
  }
}

class CompareCard extends MC {
  render({}, { title = "", text = "", code = "" }) {
    return $("<article>")
      .addClass("mc-doc-compare-card")
      .append(
        $("<div>").addClass("mc-doc-compare-card_title").text(title),
        $("<div>").addClass("mc-doc-compare-card_text").text(text),
        $.MC(CodeBlock, { code }, `${title}-compare-code`),
      );
  }
}

class DocSidebar extends MC {
  render({}, { section = "overview", setSection, pages = [] }) {
    return $("<aside>")
      .addClass("mc-doc-sidebar mc-doc-anim-in mc-doc-anim-in--d1")
      .append(
        $("<div>").addClass("mc-doc-sidebar_title").text("Sections"),

        $("<div>")
          .addClass("mc-doc-sidebar_nav")
          .append(
            pages.map((page) =>
              $.MC(
                SidebarNavButton,
                {
                  title: page.title,
                  text: page.text,
                  active: section === page.id,
                  onClick: () => setSection(page.id),
                },
                `doc-nav-${page.id}`,
              ),
            ),
          ),

        $("<div>")
          .addClass("mc-doc-sidebar_hint")
          .text(
            "Стартовый слой документации. Потом сюда спокойно добавятся architecture, rendering, keys и API reference.",
          ),
      );
  }
}

class DocTopbar extends MC {
  render({}, { setPage, section = "overview" }) {
    const sectionTitle =
      section === "installation" ? "Installation" : "Overview";

    return $("<div>")
      .addClass("mc-doc-topbar mc-doc-anim-in")
      .append(
        $("<button>")
          .addClass("mc-doc-back-btn")
          .attr("type", "button")
          .on("click", () => setPage("main"))
          .append(
            $("<span>").addClass("mc-doc-back-btn_text").text("Back to main"),
          ),
        $("<div>")
          .addClass("mc-doc-breadcrumbs")
          .append(
            $("<span>").addClass("mc-doc-breadcrumbs_item").text("MC"),
            $("<span>").addClass("mc-doc-breadcrumbs_sep").text("/"),
            $("<span>")
              .addClass("mc-doc-breadcrumbs_item")
              .text("Documentation"),
            $("<span>").addClass("mc-doc-breadcrumbs_sep").text("/"),
            $("<span>")
              .addClass(
                "mc-doc-breadcrumbs_item mc-doc-breadcrumbs_item--active",
              )
              .text(sectionTitle),
          ),
      );
  }
}

class DocBackdrop extends MC {
  render() {
    return $("<div>")
      .addClass("mc-doc-page_backdrop")
      .append(
        $("<div>").addClass("mc-doc-page_grid"),
        $("<div>").addClass("mc-doc-page_orb mc-doc-page_orb--a"),
        $("<div>").addClass("mc-doc-page_orb mc-doc-page_orb--b"),
        $("<div>").addClass("mc-doc-page_noise"),
      );
  }
}

class SidebarNavButton extends MC {
  render({}, { title = "", text = "", active = false, onClick }) {
    return $("<button>")
      .addClass(`mc-doc-nav-btn ${active ? "mc-doc-nav-btn--active" : ""}`)
      .attr("type", "button")
      .on("click", onClick)
      .append(
        $("<div>").addClass("mc-doc-nav-btn_title").text(title),
        $("<div>").addClass("mc-doc-nav-btn_text").text(text),
      );
  }
}

class DocOverviewPage extends MC {
  render() {
    return $("<section>")
      .addClass("mc-doc-section mc-doc-anim-in mc-doc-anim-in--d2")
      .append(
        $.MC(
          SectionHeader,
          {
            kicker: "OVERVIEW",
            title: "What is MC",
            text: "MC — это jQuery-first runtime для компонентного UI. Он не пытается заставить тебя выкинуть существующий DOM-подход, а добавляет поверх него state, композицию, effect-логику и более управляемые обновления.",
          },
          "overview-header",
        ),

        $("<div>")
          .addClass("mc-doc-hero-strip")
          .append(
            $.MC(
              HeroStatMini,
              {
                label: "Style",
                value: "DOM-first",
              },
              "ov-mini-1",
            ),
            $.MC(
              HeroStatMini,
              {
                label: "API",
                value: "Components + hooks",
              },
              "ov-mini-2",
            ),
            $.MC(
              HeroStatMini,
              {
                label: "Fit",
                value: "Legacy and internal apps",
              },
              "ov-mini-3",
            ),
            $.MC(
              HeroStatMini,
              {
                label: "Start",
                value: "jQuery → MC.init()",
              },
              "ov-mini-4",
            ),
          ),

        $("<div>")
          .addClass("mc-doc-cards-grid")
          .append(
            $.MC(
              InfoCard,
              {
                title: "Why it exists",
                text: "Когда проект уже живёт на jQuery, полный переезд на другой UI-стек часто слишком дорогой. MC позволяет получить компонентную организацию и реактивные обновления без тотального переписывания.",
              },
              "overview-card-why",
            ),
            $.MC(
              InfoCard,
              {
                title: "What it adds",
                text: "Локальный и разделяемый state, function/class components, эффекты, memo, lifecycle и повторное использование UI-частей в более вменяемой форме.",
              },
              "overview-card-adds",
            ),
            $.MC(
              InfoCard,
              {
                title: "How it feels",
                text: "Ты всё ещё работаешь с JavaScript и jQuery-элементами, но уже пишешь UI как систему небольших частей, а не как набор ручных DOM-манипуляций.",
              },
              "overview-card-feel",
            ),
          ),

        $("<div>")
          .addClass("mc-doc-two-col")
          .append(
            $("<div>")
              .addClass("mc-doc-wide-panel")
              .append(
                $("<div>")
                  .addClass("mc-doc-wide-panel_head")
                  .append(
                    $("<div>")
                      .addClass("mc-doc-pill mc-doc-pill--soft")
                      .text("USE CASES"),
                    $("<h3>")
                      .addClass("mc-doc-wide-panel_title")
                      .text("Где MC особенно уместен"),
                  ),
                $("<div>")
                  .addClass("mc-doc-mini-list")
                  .append(
                    $.MC(
                      MiniBullet,
                      {
                        text: "Большой jQuery-проект, который уже нельзя легко переписать целиком.",
                      },
                      "overview-b-1",
                    ),
                    $.MC(
                      MiniBullet,
                      {
                        text: "Внутренний продукт, где нужен собственный UI-runtime и контроль над поведением.",
                      },
                      "overview-b-2",
                    ),
                    $.MC(
                      MiniBullet,
                      {
                        text: "Сложные экраны, которые хочется разрезать на компоненты без build-step и JSX.",
                      },
                      "overview-b-3",
                    ),
                    $.MC(
                      MiniBullet,
                      {
                        text: "Постепенная модернизация legacy UI вместо большого “перезапуска фронта”.",
                      },
                      "overview-b-4",
                    ),
                  ),
              ),

            $("<div>")
              .addClass("mc-doc-wide-panel")
              .append(
                $("<div>")
                  .addClass("mc-doc-wide-panel_head")
                  .append(
                    $("<div>")
                      .addClass("mc-doc-pill mc-doc-pill--soft")
                      .text("MENTAL MODEL"),
                    $("<h3>")
                      .addClass("mc-doc-wide-panel_title")
                      .text("Как на это смотреть"),
                  ),
                $("<p>")
                  .addClass("mc-doc-wide-panel_text")
                  .text(
                    "MC ближе не к “магической платформе”, а к инженерному runtime-слою. Он держит state, связывает его с компонентами, планирует обновления и после этого аккуратно применяет изменения в реальный DOM.",
                  ),
                $("<div>")
                  .addClass("mc-doc-mini-list")
                  .append(
                    $.MC(
                      MiniBullet,
                      { text: "Компоненты возвращают jQuery / DOM output." },
                      "overview-b-5",
                    ),
                    $.MC(
                      MiniBullet,
                      {
                        text: "State подписывает только тех, кто реально его читает.",
                      },
                      "overview-b-6",
                    ),
                    $.MC(
                      MiniBullet,
                      {
                        text: "Effects и lifecycle живут вокруг реального DOM-коммита.",
                      },
                      "overview-b-7",
                    ),
                  ),
              ),
          ),

        $("<div>")
          .addClass("mc-doc-wide-panel")
          .append(
            $("<div>")
              .addClass("mc-doc-wide-panel_head")
              .append(
                $("<div>")
                  .addClass("mc-doc-pill mc-doc-pill--soft")
                  .text("MINIMAL EXAMPLE"),
                $("<h3>")
                  .addClass("mc-doc-wide-panel_title")
                  .text("Самая короткая рабочая форма"),
              ),
            $.MC(
              CodeBlock,
              {
                code: `class App extends MC {
    constructor() {
        super();
    }

    render() {
        return $('<div>').text('MC is running');
    }
}

MC.init();

$('#app').append(
    $.MC(App)
);`,
              },
              "overview-min-example",
            ),
            $("<div>")
              .addClass("mc-doc-callout")
              .text(
                "Если тебе нужно запомнить только одну вещь на старте: сначала подключается jQuery, потом MC, потом один раз вызывается MC.init(), и уже после этого можно монтировать компоненты.",
              ),
          ),
      );
  }
}

class DocInstallPage extends MC {
  render() {
    return $("<section>")
      .addClass("mc-doc-section mc-doc-anim-in mc-doc-anim-in--d2")
      .append(
        $.MC(
          SectionHeader,
          {
            kicker: "INSTALLATION",
            title: "Install and initialize",
            text: "На старте важно всего три вещи: подключить jQuery, подключить MC после него и один раз вызвать MC.init() до монтирования приложения.",
          },
          "install-header",
        ),

        $("<div>")
          .addClass("mc-doc-install-grid")
          .append(
            $.MC(
              CodeCard,
              {
                title: "Install package",
                subtitle: "npm",
                code: `npm install jquery-micro_component`,
              },
              "install-card-npm",
            ),

            $.MC(
              CodeCard,
              {
                title: "Connect scripts",
                subtitle: "HTML",
                code: `<script src="./node_modules/jquery/dist/jquery.min.js"></script>
<script src="./node_modules/jquery-micro_component/MC.min.js"></script>
<script>
  MC.init();
</script>`,
              },
              "install-card-connect",
            ),
          ),

        $("<div>")
          .addClass("mc-doc-step-grid")
          .append(
            $.MC(
              StepCard,
              {
                index: "01",
                title: "Connect jQuery first",
                text: "MC расширяет jQuery-окружение, поэтому jQuery должен быть доступен раньше.",
              },
              "install-step-1",
            ),
            $.MC(
              StepCard,
              {
                index: "02",
                title: "Load MC after jQuery",
                text: "После подключения библиотека сможет зарегистрировать свой runtime поверх window.$.",
              },
              "install-step-2",
            ),
            $.MC(
              StepCard,
              {
                index: "03",
                title: "Call MC.init() once",
                text: "Инициализация делается один раз на страницу. После этого доступны $.MC, $.MC.effect и $.MC.memo.",
              },
              "install-step-3",
            ),
          ),

        $("<div>")
          .addClass("mc-doc-wide-panel")
          .append(
            $("<div>")
              .addClass("mc-doc-wide-panel_head")
              .append(
                $("<div>")
                  .addClass("mc-doc-pill mc-doc-pill--soft")
                  .text("FIRST APP"),
                $("<h3>")
                  .addClass("mc-doc-wide-panel_title")
                  .text("Minimal start"),
              ),
            $.MC(
              CodeBlock,
              {
                code: `MC.init();

class App extends MC {
    render() {
        return $('<div>').text('Hello from MC');
    }
}

$('#app').append(
    $.MC(App)
);`,
              },
              "install-code-start",
            ),
            $("<div>")
              .addClass("mc-doc-note-row")
              .append(
                $.MC(
                  NoteCard,
                  {
                    title: "Important",
                    text: "Не пропускай MC.init(). Без него runtime не инициализируется и $.MC не будет поднят в window.$.",
                  },
                  "install-note-1",
                ),
                $.MC(
                  NoteCard,
                  {
                    title: "Manual mode",
                    text: "Если npm не нужен, можно просто скачать MC.min.js и подключить его вручную после jQuery.",
                  },
                  "install-note-2",
                ),
              ),
          ),
      );
  }
}

class SectionHeader extends MC {
  render({}, { kicker = "", title = "", text = "" }) {
    return $("<div>")
      .addClass("mc-doc-section_header")
      .append(
        $("<div>").addClass("mc-doc-pill").text(kicker),
        $("<h2>").addClass("mc-doc-section_title").text(title),
        $("<p>").addClass("mc-doc-section_text").text(text),
      );
  }
}

class InfoCard extends MC {
  render({}, { title = "", text = "" }) {
    return $("<article>")
      .addClass("mc-doc-card")
      .append(
        $("<div>").addClass("mc-doc-card_glow"),
        $("<h3>").addClass("mc-doc-card_title").text(title),
        $("<p>").addClass("mc-doc-card_text").text(text),
      );
  }
}

class MiniBullet extends MC {
  render({}, { text = "" }) {
    return $("<div>")
      .addClass("mc-doc-mini-bullet")
      .append(
        $("<span>").addClass("mc-doc-mini-bullet_dot"),
        $("<span>").addClass("mc-doc-mini-bullet_text").text(text),
      );
  }
}

class CodeCard extends MC {
  render({}, { title = "", subtitle = "", code = "" }) {
    return $("<article>")
      .addClass("mc-doc-code-card")
      .append(
        $("<div>")
          .addClass("mc-doc-code-card_head")
          .append(
            $("<div>").addClass("mc-doc-code-card_title").text(title),
            $("<div>").addClass("mc-doc-code-card_subtitle").text(subtitle),
          ),
        $.MC(CodeBlock, { code }, `${title}-code-block`),
      );
  }
}

class CodeBlock extends MC {
  render({}, { code = "" }) {
    return $("<pre>").addClass("mc-doc-code").append($("<code>").text(code));
  }
}

class NoteCard extends MC {
  render({}, { title = "", text = "" }) {
    return $("<article>")
      .addClass("mc-doc-note-card")
      .append(
        $("<div>").addClass("mc-doc-note-card_title").text(title),
        $("<div>").addClass("mc-doc-note-card_text").text(text),
      );
  }
}
