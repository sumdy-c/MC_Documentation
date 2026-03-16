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
            text: "MC — это jQuery-first runtime для компонентного UI. Он нужен в тех случаях, когда обычный jQuery уже перестаёт удобно держать сложность интерфейса, а полный переход на другой стек либо слишком дорогой, либо просто не нужен. MC добавляет поверх привычного DOM-подхода компоненты, state, effect-логику и более управляемые обновления, не заставляя переписывать существующий проект целиком.",
          },
          "overview-header",
        ),

        $("<div>")
          .addClass("mc-doc-hero-strip")
          .append(
            $.MC(
              HeroStatMini,
              {
                label: "Runtime",
                value: "jQuery-first",
              },
              "ov-mini-1",
            ),
            $.MC(
              HeroStatMini,
              {
                label: "Core",
                value: "State + Components",
              },
              "ov-mini-2",
            ),
            $.MC(
              HeroStatMini,
              {
                label: "Best fit",
                value: "Legacy / internal UI",
              },
              "ov-mini-3",
            ),
            $.MC(
              HeroStatMini,
              {
                label: "Start",
                value: "MC.init()",
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
                title: "Why MC exists",
                text: "Когда проект уже живёт на jQuery, проблема обычно не в самом DOM, а в росте хаоса вокруг него. Интерфейс постепенно превращается в набор разбросанных обработчиков, ручных перерисовок и скрытых зависимостей. MC нужен затем, чтобы вернуть UI структуру и управляемость без тотального переписывания продукта.",
              },
              "overview-card-why",
            ),
            $.MC(
              InfoCard,
              {
                title: "What MC adds",
                text: "MC добавляет компонентную композицию, локальный и разделяемый state, effects, lifecycle, memo и более предсказуемую схему обновлений. Это не просто более удобный синтаксис, а runtime-слой, который делает интерфейс заметно стабильнее в долгой разработке.",
              },
              "overview-card-adds",
            ),
            $.MC(
              InfoCard,
              {
                title: "What MC is not",
                text: "MC не пытается быть универсальной заменой всему фронтенд-ландшафту. Это не огромная экосистема, которая решает любую задачу по шаблону, а лёгкий runtime-слой, который можно постепенно внедрить в существующий проект.",
              },
              "overview-card-not",
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
                      .text("WHY PEOPLE USE IT"),
                    $("<h3>")
                      .addClass("mc-doc-wide-panel_title")
                      .text("Зачем использовать MC"),
                  ),
                $("<p>")
                  .addClass("mc-doc-wide-panel_text")
                  .text(
                    "MC обычно появляется там, где проект уже существует, активно используется и не может позволить себе большой переписывающий рефакторинг только ради смены UI-стека. Вместо резкого переезда он позволяет двигаться постепенно: сохранять рабочий jQuery-код и одновременно приводить интерфейс к компонентной системе.",
                  ),
                $("<div>")
                  .addClass("mc-doc-mini-list")
                  .append(
                    $.MC(
                      MiniBullet,
                      {
                        text: "Снижает хаос ручных DOM-манипуляций на больших экранах.",
                      },
                      "overview-b-1",
                    ),
                    $.MC(
                      MiniBullet,
                      {
                        text: "Позволяет разделить интерфейс на понятные переиспользуемые части.",
                      },
                      "overview-b-2",
                    ),
                    $.MC(
                      MiniBullet,
                      {
                        text: "Даёт state-модель без отказа от jQuery и существующего кода.",
                      },
                      "overview-b-3",
                    ),
                    $.MC(
                      MiniBullet,
                      {
                        text: "Подходит для постепенной модернизации legacy UI.",
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
                      .text("Как на MC стоит смотреть"),
                  ),
                $("<p>")
                  .addClass("mc-doc-wide-panel_text")
                  .text(
                    "На MC лучше смотреть не как на «магический UI-фреймворк», а как на инженерный runtime-слой поверх DOM. Он знает, какие компоненты существуют, какие state они читают, когда нужно обновиться и как аккуратно применить эти изменения к реальному дереву.",
                  ),
                $("<div>")
                  .addClass("mc-doc-mini-list")
                  .append(
                    $.MC(
                      MiniBullet,
                      {
                        text: "Компоненты строят UI через jQuery и возвращают DOM output, а не скрытую абстракцию.",
                      },
                      "overview-b-5",
                    ),
                    $.MC(
                      MiniBullet,
                      {
                        text: "State подписывает только те части UI, которые действительно его используют.",
                      },
                      "overview-b-6",
                    ),
                    $.MC(
                      MiniBullet,
                      {
                        text: "Effects и lifecycle привязаны к реальному коммиту в DOM.",
                      },
                      "overview-b-7",
                    ),
                    $.MC(
                      MiniBullet,
                      {
                        text: "MC помогает управлять сложностью интерфейса, а не просто менять стиль кода.",
                      },
                      "overview-b-8",
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
                  .text("GOOD FIT"),
                $("<h3>")
                  .addClass("mc-doc-wide-panel_title")
                  .text("Когда MC особенно уместен"),
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "MC особенно полезен не в абстрактной теории, а в конкретных типах продуктов. В первую очередь это внутренние системы, legacy-панели, административные интерфейсы, инженерные инструменты, операторские экраны и любой UI, который уже стал сложным, долго живёт и должен развиваться без большого перезапуска.",
              ),
            $("<div>")
              .addClass("mc-doc-mini-list")
              .append(
                $.MC(
                  MiniBullet,
                  {
                    text: "Большой jQuery-проект, который нельзя безопасно переписать целиком.",
                  },
                  "overview-b-9",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Внутренний продукт, где важнее контроль над runtime, чем модный стек.",
                  },
                  "overview-b-10",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Сложные экраны и плотные рабочие интерфейсы без JSX и build-step.",
                  },
                  "overview-b-11",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Переходный этап между ручным jQuery и более системным UI-подходом.",
                  },
                  "overview-b-12",
                ),
              ),
            $("<div>")
              .addClass("mc-doc-callout")
              .text(
                "Главная ценность MC не в том, что он «современнее jQuery», а в том, что он помогает удерживать архитектуру там, где интерфейс уже стал большим и дорогим для хаотичной поддержки.",
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
                      .text("TOO MUCH"),
                    $("<h3>")
                      .addClass("mc-doc-wide-panel_title")
                      .text("Когда MC может быть избыточным"),
                  ),
                $("<p>")
                  .addClass("mc-doc-wide-panel_text")
                  .text(
                    "Не каждый интерфейс требует отдельного runtime-слоя. Если перед вами простая страница, немного событий и почти нет долгоживущего client-side state, то MC может оказаться тяжелее, чем сама задача.",
                  ),
                $("<div>")
                  .addClass("mc-doc-mini-list")
                  .append(
                    $.MC(
                      MiniBullet,
                      {
                        text: "Один-два простых экрана с минимальной интерактивностью.",
                      },
                      "overview-b-13",
                    ),
                    $.MC(
                      MiniBullet,
                      {
                        text: "Страница в основном серверная, а JavaScript используется точечно.",
                      },
                      "overview-b-14",
                    ),
                    $.MC(
                      MiniBullet,
                      {
                        text: "Нет заметного повторного использования UI-частей и сложных обновлений.",
                      },
                      "overview-b-15",
                    ),
                    $.MC(
                      MiniBullet,
                      {
                        text: "Стоимость введения runtime выше, чем практическая выгода от него.",
                      },
                      "overview-b-16",
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
                      .text("NOT ENOUGH"),
                    $("<h3>")
                      .addClass("mc-doc-wide-panel_title")
                      .text("Когда лучше выбрать другой путь"),
                  ),
                $("<p>")
                  .addClass("mc-doc-wide-panel_text")
                  .text(
                    "Есть задачи, где MC может быть недостаточным не потому, что он плохой, а потому что проекту нужен другой масштаб и другой набор инструментов. Например, если продукту нужна большая экосистема библиотек, привычный для рынка стек или стандартизированный enterprise-подход.",
                  ),
                $("<div>")
                  .addClass("mc-doc-mini-list")
                  .append(
                    $.MC(
                      MiniBullet,
                      {
                        text: "Большая команда, которой нужен общепринятый ecosystem-first стек.",
                      },
                      "overview-b-17",
                    ),
                    $.MC(
                      MiniBullet,
                      {
                        text: "Публичный продукт со сложной сборкой, маршрутизацией и большим количеством внешних пакетов.",
                      },
                      "overview-b-18",
                    ),
                    $.MC(
                      MiniBullet,
                      {
                        text: "Проект, где критична стандартизация под рынок найма и быстрый onboarding.",
                      },
                      "overview-b-19",
                    ),
                    $.MC(
                      MiniBullet,
                      {
                        text: "Задача, где рациональнее сразу строить на React, Vue или Solid-подобной экосистеме.",
                      },
                      "overview-b-20",
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
                  .text("ALTERNATIVES"),
                $("<h3>")
                  .addClass("mc-doc-wide-panel_title")
                  .text("Что выбрать вместо MC, если задача другая"),
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "Выбор стека лучше начинать не с вопроса «что круче», а с вопроса «какую проблему нужно решить». Если MC не совпадает с задачей, это нормально. Значит, нужен другой инструмент.",
              ),
            $("<div>")
              .addClass("mc-doc-mini-list")
              .append(
                $.MC(
                  MiniBullet,
                  {
                    text: "Оставаться на чистом jQuery — если интерфейс маленький и его сложность действительно низкая.",
                  },
                  "overview-b-21",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Взять Alpine.js или похожий лёгкий слой — если нужна небольшая интерактивность поверх HTML.",
                  },
                  "overview-b-22",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Взять htmx или server-driven подход — если основная логика живёт на сервере.",
                  },
                  "overview-b-23",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Взять React, Vue или Solid — если нужна крупная экосистема и привычный рынок tooling.",
                  },
                  "overview-b-24",
                ),
              ),
            $("<div>")
              .addClass("mc-doc-callout")
              .text(
                "MC — сильный выбор в своей нише. Но хороший runtime — это не тот, который подходит всем, а тот, который уменьшает стоимость именно вашего проекта.",
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
                      .text("ADOPTION"),
                    $("<h3>")
                      .addClass("mc-doc-wide-panel_title")
                      .text("Как MC обычно внедряют"),
                  ),
                $("<p>")
                  .addClass("mc-doc-wide-panel_text")
                  .text(
                    "MC не требует революции. Обычно внедрение начинается не с переписывания всего приложения, а с одного проблемного экрана или нового модуля. После этого вокруг него постепенно появляется более системная компонентная архитектура.",
                  ),
                $("<div>")
                  .addClass("mc-doc-mini-list")
                  .append(
                    $.MC(
                      MiniBullet,
                      {
                        text: "Сначала — новый экран или isolated feature.",
                      },
                      "overview-b-25",
                    ),
                    $.MC(
                      MiniBullet,
                      {
                        text: "Потом — повторно используемые компоненты и локальный state.",
                      },
                      "overview-b-26",
                    ),
                    $.MC(
                      MiniBullet,
                      {
                        text: "Дальше — shared state, эффекты и более чистые сценарии обновления.",
                      },
                      "overview-b-27",
                    ),
                    $.MC(
                      MiniBullet,
                      {
                        text: "И только затем — постепенное вытеснение хаотичного procedural UI.",
                      },
                      "overview-b-28",
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
                      .text("TRADE-OFFS"),
                    $("<h3>")
                      .addClass("mc-doc-wide-panel_title")
                      .text("Какие компромиссы стоит понимать заранее"),
                  ),
                $("<p>")
                  .addClass("mc-doc-wide-panel_text")
                  .text(
                    "MC даёт контроль и позволяет модернизировать интерфейс постепенно, но этот выбор тоже имеет цену. Нужно понимать сам runtime, дисциплинированно держать компонентные границы и принимать, что это более инженерный, а не массово-стандартный путь.",
                  ),
                $("<div>")
                  .addClass("mc-doc-mini-list")
                  .append(
                    $.MC(
                      MiniBullet,
                      {
                        text: "Готовой внешней экосистемы меньше, чем у массовых framework-платформ.",
                      },
                      "overview-b-29",
                    ),
                    $.MC(
                      MiniBullet,
                      {
                        text: "Больше ответственности ложится на внутреннюю архитектурную дисциплину проекта.",
                      },
                      "overview-b-30",
                    ),
                    $.MC(
                      MiniBullet,
                      {
                        text: "Важно понимать не только API, но и модель работы самого runtime.",
                      },
                      "overview-b-31",
                    ),
                    $.MC(
                      MiniBullet,
                      {
                        text: "Взамен получается точный контроль и хорошая совместимость с существующим DOM-кодом.",
                      },
                      "overview-b-32",
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
                "На старте нужно запомнить одно правило: сначала подключается jQuery, затем MC, затем один раз вызывается MC.init(), и только после этого компоненты монтируются в DOM.",
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
                  .text("SUMMARY"),
                $("<h3>")
                  .addClass("mc-doc-wide-panel_title")
                  .text("Что важно вынести из этого раздела"),
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "MC — это не просто ещё один способ писать UI, а практический runtime для тех случаев, где нужен компонентный подход поверх jQuery и реального DOM. Если проект совпадает с этим профилем, MC помогает уменьшить архитектурную сложность и сохранить контроль над интерфейсом. Если не совпадает, разумнее сразу выбрать более подходящий инструмент.",
              ),
            $("<div>")
              .addClass("mc-doc-mini-list")
              .append(
                $.MC(
                  MiniBullet,
                  {
                    text: "MC нужен для управления сложностью интерфейса, а не ради смены синтаксиса.",
                  },
                  "overview-b-33",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Он особенно полезен в legacy и внутренних продуктах.",
                  },
                  "overview-b-34",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Он не обязан быть ответом на любую UI-задачу.",
                  },
                  "overview-b-35",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "MC подходит не только для постепенной модернизации jQuery-проектов, но и для новых приложений, где нужен DOM-first подход, компонентная структура и контроль над runtime.",
                  },
                  "overview-b-36",
                ),
              ),
          ),
      );
  }
}