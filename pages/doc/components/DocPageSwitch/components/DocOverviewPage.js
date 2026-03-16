import CodeBlock from "../../CodeBlock.js";
import HeroStatMini from "../../HeroStatMini.js";
import InfoCard from "../../InfoCard.js";
import MiniBullet from "../../MiniBullet.js";
import SectionHeader from "../../SectionHeader.js";

export default class DocOverviewPage extends MC {
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