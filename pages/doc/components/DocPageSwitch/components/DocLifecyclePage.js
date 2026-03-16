import CodeCard from "../../CodeCard.js";
import InfoCard from "../../InfoCard.js";
import MiniBullet from "../../MiniBullet.js";
import SectionHeader from "../../SectionHeader.js";

export default class DocLifecyclePage extends MC {
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
