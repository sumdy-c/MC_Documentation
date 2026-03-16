import CodeCard from "../../CodeCard.js";
import InfoCard from "../../InfoCard.js";
import MiniBullet from "../../MiniBullet.js";
import SectionHeader from "../../SectionHeader.js";

export default class DocStatePage extends MC {
  render() {
    return $("<section>")
      .addClass("mc-doc-section mc-doc-anim-in mc-doc-anim-in--d2")
      .append(
        $.MC(
          SectionHeader,
          {
            kicker: "STATE",
            title: "Local and global state",
            text: "В MCv7 есть два основных вида состояния: local state и global state. Local state живёт внутри экземпляра class-компонента и подходит для его собственного поведения. Global state создаётся через MC.uState(...) и может использоваться как общий источник данных между разными частями интерфейса.",
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
                text: "Локальное состояние создаётся внутри class-компонента через super.state(...). Оно принадлежит конкретному экземпляру компонента и хорошо подходит для UI-флагов, внутренних режимов, локальных переключателей и поведения, которое не должно жить вне этого компонента.",
              },
              "state-card-local",
            ),
            $.MC(
              InfoCard,
              {
                title: "Global state",
                text: "Глобальное состояние создаётся через MC.uState(value, key, forceUpdate). Оно живёт отдельно от конкретного компонента и может передаваться через deps в те части интерфейса, которые должны на него подписываться.",
              },
              "state-card-global",
            ),
            $.MC(
              InfoCard,
              {
                title: "MCv7 note",
                text: "В MCv7 context как отдельный рабочий уровень состояния отсутствует. Старый MC.Context() был актуален ранее, но в текущей версии ничего не делает и не рассматривается как часть основной state-модели.",
              },
              "state-card-note",
            ),
          ),

        $("<div>")
          .addClass("mc-doc-install-grid")
          .append(
            $.MC(
              CodeCard,
              {
                title: "Local state",
                subtitle: "inside class component",
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
                title: "Global state",
                subtitle: "MC.uState(...)",
                code: `const testGlobalState = MC.uState(false, 'globalStateKey', false);

$(document.body).append(
    $.MC(TestComp, [testGlobalState], 'test-comp')
);`,
              },
              "state-code-global",
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
                  .text("LOCAL STATE"),
                $("<h3>")
                  .addClass("mc-doc-wide-panel_title")
                  .text("Как работает local state"),
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "Local state создаётся через super.state(...) внутри class-компонента. Такое состояние принадлежит текущему экземпляру компонента и существует вместе с ним. Когда компонент размонтируется, его local state тоже исчезает вместе с экземпляром.",
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "Это делает local state правильным выбором для всего, что не должно жить вне конкретного UI-блока: открыто ли меню, активен ли hover, какой сейчас локальный режим, скрыт ли служебный элемент и так далее.",
              ),
            $("<div>")
              .addClass("mc-doc-mini-list")
              .append(
                $.MC(
                  MiniBullet,
                  {
                    text: "Local state создаётся только внутри class-компонента.",
                  },
                  "state-rule-1",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Он принадлежит конкретному экземпляру и удаляется вместе с ним.",
                  },
                  "state-rule-2",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Его не нужно отдельно привязывать через deps, потому что он уже является частью самого компонента.",
                  },
                  "state-rule-3",
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
                  .text("GLOBAL STATE"),
                $("<h3>")
                  .addClass("mc-doc-wide-panel_title")
                  .text("Как работает global state"),
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "Global state создаётся через MC.uState(value, key, forceUpdate). В отличие от local state он не принадлежит конкретному экземпляру компонента. Это отдельный источник состояния, который можно передавать через deps в любые компоненты и контейнеры, где требуется подписка на это значение.",
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "Именно поэтому global state удобно использовать как общее состояние для нескольких частей интерфейса: открытие приложения, состояние сокета, активная сущность, режим страницы, глобальный флаг видимости и другие значения, которые должны читаться не в одном месте.",
              ),
            $.MC(
              CodeCard,
              {
                title: "Create global state",
                subtitle: "uState signature",
                code: `const testGlobalState = MC.uState(false, 'globalStateKey', false);`,
              },
              "state-code-global-signature",
            ),
            $("<div>")
              .addClass("mc-doc-mini-list")
              .append(
                $.MC(
                  MiniBullet,
                  {
                    text: "Первый аргумент — начальное значение state.",
                  },
                  "state-rule-4",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Второй аргумент — ключ, по которому state будет доступен в подписанных компонентах.",
                  },
                  "state-rule-5",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Третий аргумент — force update.",
                  },
                  "state-rule-6",
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
                  .text("BINDING"),
                $("<h3>")
                  .addClass("mc-doc-wide-panel_title")
                  .text("Как global state привязывается к компоненту"),
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "Чтобы component или function container подписался на global state, этот state передаётся в deps через $.MC(...). После этого runtime добавляет его в объект states внутри render class-компонента или передаёт текущее значение в функциональный контейнер.",
              ),
            $.MC(
              CodeCard,
              {
                title: "Bind state to component",
                subtitle: "$.MC(Component, [state])",
                code: `const testGlobalState = MC.uState(false, 'globalStateKey', false);

$(document.body).append(
    $.MC(TestComp, [testGlobalState], 'test-comp')
);`,
              },
              "state-code-bind-global",
            ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "Такой binding нужен именно для global state. Local state не привязывается через deps, потому что он уже принадлежит самому компоненту. Если родитель обновляется по своему local state, дочерний рендер и так будет перестроен в рамках обычного дерева.",
              ),
            $("<div>")
              .addClass("mc-doc-mini-list")
              .append(
                $.MC(
                  MiniBullet,
                  {
                    text: "Global state можно подписывать на component через deps.",
                  },
                  "state-rule-7",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Local state через deps не передаётся и в этом нет необходимости.",
                  },
                  "state-rule-8",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Если состояние должно жить дольше конкретного экземпляра — это признак global state, а не local state.",
                  },
                  "state-rule-9",
                ),
              ),
          ),

        $("<div>")
          .addClass("mc-doc-install-grid")
          .append(
            $.MC(
              CodeCard,
              {
                title: "Access by object key",
                subtitle: "camelCase key",
                code: `class TestComp extends MC {
    constructor() {
        super();
    }

    render({ globalStateKey }) {
        const [value, setValue, stateRef] = globalStateKey;

        return $('<div>').text(String(value));
    }
}`,
              },
              "state-code-object-key",
            ),

            $.MC(
              CodeCard,
              {
                title: "Access by bracket syntax",
                subtitle: "key with dashes",
                code: `class TestComp extends MC {
    constructor() {
        super();
    }

    render(states) {
        const [value, setValue, stateRef] = states['global-state-key'];

        return $('<div>').text(String(value));
    }
}`,
              },
              "state-code-bracket-key",
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
                  .text("KEYS"),
                $("<h3>")
                  .addClass("mc-doc-wide-panel_title")
                  .text("Как ключ влияет на доступ к состоянию"),
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "Ключ global state определяет, под каким именем это состояние появится в states. Если ключ совместим с обычным доступом через свойство, можно использовать деструктуризацию прямо в render({ ... }). Если в ключе есть дефис или другой неудобный для точки синтаксис, лучше использовать states['key-name'].",
              ),
            $("<div>")
              .addClass("mc-doc-mini-list")
              .append(
                $.MC(
                  MiniBullet,
                  {
                    text: "globalStateKey → можно читать через render({ globalStateKey }).",
                  },
                  "state-rule-10",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "global-state-key → лучше читать через states['global-state-key'].",
                  },
                  "state-rule-11",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Оба варианта корректны, разница только в форме доступа.",
                  },
                  "state-rule-12",
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
                  .text("GLOBAL INSIDE CLASS"),
                $("<h3>")
                  .addClass("mc-doc-wide-panel_title")
                  .text("Global state внутри constructor"),
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "Global state можно создавать и внутри constructor class-компонента. Но важно понимать, что от этого он не становится local state. Он всё равно остаётся глобальным и не удаляется автоматически при размонтировании компонента.",
              ),
            $.MC(
              CodeCard,
              {
                title: "Global state in constructor",
                subtitle: "still global",
                code: `class TestComp extends MC {
    constructor() {
        super();
        this.testGlobalState = MC.uState(false, 'globalStateKey', true);
    }

    render() {
        return $.MC(TestCompChild, [this.testGlobalState]);
    }
}`,
              },
              "state-code-global-in-constructor",
            ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "Это полезно, когда компонент выступает точкой сборки и хочет прокинуть global state дальше в дочерние части дерева. Но semantics здесь не меняется: если компонент исчезнет, созданный global state не будет автоматически уничтожен так же, как удаляется local state экземпляра.",
              ),
            $("<div>")
              .addClass("mc-doc-mini-list")
              .append(
                $.MC(
                  MiniBullet,
                  {
                    text: "Место создания global state не меняет его природу.",
                  },
                  "state-rule-13",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Даже внутри constructor global state остаётся внешним по отношению к жизненному циклу компонента.",
                  },
                  "state-rule-14",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Такой state удобно прокидывать в дочки через deps.",
                  },
                  "state-rule-15",
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
                  .text("FORCE UPDATE"),
                $("<h3>")
                  .addClass("mc-doc-wide-panel_title")
                  .text("Третий аргумент MC.uState(...)"),
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "Третий аргумент в MC.uState(value, key, forceUpdate) — это force update. Он участвует в механике обновления global state и должен рассматриваться как часть его runtime-настройки.",
              ),
            $.MC(
              CodeCard,
              {
                title: "forceUpdate flag",
                subtitle: "third argument",
                code: `const stateA = MC.uState(false, 'globalStateKey', false);
const stateB = MC.uState(false, 'globalStateKey', true);`,
              },
              "state-code-force-update",
            ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "На практике этот флаг стоит использовать осознанно и только там, где действительно нужен такой режим обновления. Для большинства обычных UI-сценариев достаточно сначала правильно определить, должно ли состояние быть local или global, и только потом решать, нужен ли специальный режим обновления.",
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
                    text: "Если значение нужно только одному экземпляру компонента — начните с local state.",
                  },
                  "state-rule-16",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Если значение должно переживать конкретный component и использоваться в нескольких местах — это global state.",
                  },
                  "state-rule-17",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Если global state должен влиять на component, передавайте его через deps в $.MC(...).",
                  },
                  "state-rule-18",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Не путайте global state, созданный в constructor, с local state: он всё равно не принадлежит жизненному циклу экземпляра.",
                  },
                  "state-rule-19",
                ),
              ),
          ),
      );
  }
}