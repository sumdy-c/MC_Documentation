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