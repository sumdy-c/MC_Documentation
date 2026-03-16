import CodeBlock from "../../CodeBlock.js";
import CodeCard from "../../CodeCard.js";
import NoteCard from "../../NoteCard.js";
import SectionHeader from "../../SectionHeader.js";
import { StepCard } from "../../StepCard.js";

export default class DocInstallPage extends MC {
  render() {
    return $("<section>")
      .addClass("mc-doc-section mc-doc-anim-in mc-doc-anim-in--d2")
      .append(
        $.MC(
          SectionHeader,
          {
            kicker: "INSTALLATION",
            title: "Install and initialize",
            text: "Установка MC сводится к одному базовому правилу: в момент загрузки runtime jQuery уже должен существовать в окружении. Дальше MC поднимает свой слой поверх этого экземпляра, регистрирует $.MC и связанные entrypoints, после чего приложение можно монтировать в DOM.",
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
                title: "Runtime file",
                subtitle: "MC.min.js",
                code: `<script src="YOUR_MC_MIN_JS_URL"></script>`,
              },
              "install-card-runtime",
            ),

            $.MC(
              CodeCard,
              {
                title: "Source code",
                subtitle: "Git",
                code: `git clone YOUR_GIT_URL`,
              },
              "install-card-git",
            ),

            $.MC(
              CodeCard,
              {
                title: "jQuery policy",
                subtitle: "Compatibility",
                code: `Works with any jQuery version >= 1.0.0`,
              },
              "install-card-jquery-policy",
            ),
          ),

        $("<div>")
          .addClass("mc-doc-step-grid")
          .append(
            $.MC(
              StepCard,
              {
                index: "01",
                title: "Make jQuery available first",
                text: "MC не везёт jQuery с собой и не создаёт отдельную копию зависимости. Runtime встраивается в уже существующий экземпляр jQuery, поэтому тот должен быть поднят раньше.",
              },
              "install-step-1",
            ),
            $.MC(
              StepCard,
              {
                index: "02",
                title: "Load the MC runtime",
                text: "После загрузки MC регистрирует свой слой поверх активного jQuery-окружения и делает доступными такие entrypoints, как $.MC, $.MC.effect и $.MC.memo.",
              },
              "install-step-2",
            ),
            $.MC(
              StepCard,
              {
                index: "03",
                title: "Initialize in MCv7",
                text: "В MCv7 инициализация делается через MC.init() и вызывается один раз до монтирования приложения. В MCv8 этот шаг планируется сделать необязательным.",
              },
              "install-step-3",
            ),
            $.MC(
              StepCard,
              {
                index: "04",
                title: "Mount the root component",
                text: "После этого корневой компонент можно вставлять в DOM. Начиная с этого момента runtime уже управляет состоянием, эффектами и обновлениями интерфейса.",
              },
              "install-step-4",
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
                  .text("CLASSIC SETUP"),
                $("<h3>")
                  .addClass("mc-doc-wide-panel_title")
                  .text("Подключение через script tags"),
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "Классический browser-first сценарий остаётся базовым способом установки MCv7. Он особенно хорошо подходит для внутренних систем, legacy-экранов и проектов, где не нужен обязательный build-step.",
              ),
            $.MC(
              CodeBlock,
              {
                code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <script src="./node_modules/jquery/dist/jquery.min.js"></script>
  <script src="./node_modules/jquery-micro_component/MC.min.js"></script>
  <script>
    MC.init();
  </script>

  <script type="module" src="./app.js"></script>
  <title>MC App</title>
</head>
<body>
  <div id="app"></div>
</body>
</html>`,
              },
              "install-code-browser",
            ),
            $("<div>")
              .addClass("mc-doc-note-row")
              .append(
                $.MC(
                  NoteCard,
                  {
                    title: "Engine only",
                    text: "MC поставляет только сам runtime. jQuery намеренно не вшивается внутрь, чтобы не навязывать проекту чужую версию зависимости и не создавать вторую копию библиотеки.",
                  },
                  "install-note-engine-only",
                ),
                $.MC(
                  NoteCard,
                  {
                    title: "Why that matters",
                    text: "Такой подход позволяет встраивать MC в уже существующие приложения без миграции jQuery и без риска конфликтов между несколькими экземплярами одной и той же библиотеки.",
                  },
                  "install-note-why-engine-only",
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
                  .text("FIRST APP"),
                $("<h3>")
                  .addClass("mc-doc-wide-panel_title")
                  .text("Минимальный старт"),
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "В MCv7 старт приложения выглядит прямолинейно: инициализация, описание компонента, монтирование в корневой контейнер. Здесь нет отдельного bootstrap-фреймворка — точкой входа остаётся обычный JavaScript-файл приложения.",
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
                    title: "MCv7",
                    text: "В текущей версии MC.init() обязателен и должен быть вызван до первого рендера компонентного дерева.",
                  },
                  "install-note-v7-init",
                ),
                $.MC(
                  NoteCard,
                  {
                    title: "MCv8",
                    text: "В MCv8 явный init-вызов планируется убрать из обязательного сценария. При этом старый MC.init() останется совместимым и не будет ломать приложение.",
                  },
                  "install-note-v8-init",
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
                  .text("WHY JQUERY FIRST"),
                $("<h3>")
                  .addClass("mc-doc-wide-panel_title")
                  .text("Почему jQuery должен быть доступен раньше"),
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "Технически MC использует jQuery как host-layer. Во время загрузки runtime должен получить доступ к уже существующему объекту jQuery и зарегистрировать на нём свои точки входа. Именно поэтому порядок подключения здесь не условность, а часть контракта установки.",
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "Если jQuery отсутствует в момент загрузки MC, runtime просто некуда встраивать. Если же jQuery уже поднят, MC работает с тем экземпляром, который реально живёт в приложении, а не с внутренней копией зависимости.",
              ),
            $("<div>")
              .addClass("mc-doc-note-row")
              .append(
                $.MC(
                  NoteCard,
                  {
                    title: "Namespace",
                    text: "На практике это означает, что MC расширяет существующее jQuery-окружение и добавляет runtime entrypoints поверх него.",
                  },
                  "install-note-namespace",
                ),
                $.MC(
                  NoteCard,
                  {
                    title: "Compatibility",
                    text: "Поскольку собственная копия jQuery не поставляется, MC может работать с любой уже выбранной версией библиотеки, начиная с jQuery 1.0.0.",
                  },
                  "install-note-compatibility",
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
                  .text("BUNDLERS"),
                $("<h3>")
                  .addClass("mc-doc-wide-panel_title")
                  .text("Как сборщики работают с MC"),
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "В сборщиках логика не меняется, меняется только способ доставки кода. Вместо script tags приложение собирается вокруг entry-модуля. В нём сначала импортируется jQuery, затем этот экземпляр при необходимости пробрасывается в глобальную область, после чего загружается MC runtime как side-effect import. Только после этого имеет смысл монтировать приложение.",
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "Причина, по которой MCv7 не оформлен как полноценно bundler-first поставка, не в невозможности работы со сборщиками. Причина в том, что текущая версия ориентирована на минимальный runtime без отдельного модульного слоя. Для bundler-сценариев в MCv8 логично выделить более явную схему подключения и добавить служебные возможности, которые удобнее поддерживать именно в модульной поставке.",
              ),
            $.MC(
              CodeBlock,
              {
                code: `import $ from "jquery";

window.$ = $;
window.jQuery = $;

import "jquery-micro_component/MC.min.js";
import App from "./App.js";

MC.init();

$("#app").append(
    $.MC(App)
);`,
              },
              "install-code-bundler",
            ),
            $("<div>")
              .addClass("mc-doc-note-row")
              .append(
                $.MC(
                  NoteCard,
                  {
                    title: "What the bundler actually does",
                    text: "Сборщик разрешает граф импортов, собирает jQuery и runtime в общий bundle и гарантирует порядок исполнения entry-модуля. Для MCv7 важно, чтобы к моменту выполнения runtime глобальный jQuery уже существовал.",
                  },
                  "install-note-bundler-mechanics",
                ),
                $.MC(
                  NoteCard,
                  {
                    title: "Why MCv8 matters here",
                    text: "В MCv8 планируется удобнее закрыть bundler-сценарий: убрать обязательный init-ритуал и сделать более естественную точку входа для модульных приложений, включая автоматические идентификаторы компонентов.",
                  },
                  "install-note-bundler-v8",
                ),
              ),
            $("<div>")
              .addClass("mc-doc-callout")
              .text(
                "Практически это означает следующее: в MCv7 сборщики использовать можно, но текущая модель остаётся browser-first. В MCv8 bundler-oriented подключение имеет смысл сделать отдельным штатным сценарием, а не побочным эффектом от global runtime.",
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
                  .text("TYPE SUPPORT"),
                $("<h3>")
                  .addClass("mc-doc-wide-panel_title")
                  .text("Экспериментальная типизация в MCv7"),
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "В MCv7 доступна тестовая TypeScript-типизация через mc.d.ts. Она рассчитана прежде всего на JavaScript-проекты, которым нужна подсказка по API, базовая инференция props и более аккуратная работа редактора с компонентами, состоянием и entrypoints вроде $.MC.effect.",
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "Полезная особенность этой схемы в том, что props можно частично вытаскивать прямо из сигнатуры render(), даже если проект написан на JavaScript без ручной generic-типизации компонентов. Это не заменяет полноценную TS-интеграцию, но даёт хороший editor-level слой уже сейчас.",
              ),
            $.MC(
              CodeBlock,
              {
                code: `{
  "compilerOptions": {
    "checkJs": false,
    "typeRoots": [
      "./clientscript/MicroComponent/node_modules/@types",
      "./node_modules/@types"
    ]
  },
  "include": [
    "clientscript/**/*.js",
    "clientscript/**/*.d.ts",
    "mc_dev/**/*.js"
  ]
}`,
              },
              "install-code-jsconfig",
            ),
            $("<div>")
              .addClass("mc-doc-note-row")
              .append(
                $.MC(
                  NoteCard,
                  {
                    title: "How to connect it",
                    text: "Достаточно положить mc.d.ts в зону, которую видит проект, и убедиться, что jsconfig.json включает .d.ts-файлы. После этого VS Code сможет подхватывать типы для JavaScript-файлов.",
                  },
                  "install-note-types-connect",
                ),
                $.MC(
                  NoteCard,
                  {
                    title: "What to expect",
                    text: "В текущем виде это скорее editor-support слой, чем жёсткий стабильный публичный контракт. Для автодополнения и навигации этого уже достаточно, но модель ещё можно считать экспериментальной.",
                  },
                  "install-note-types-experimental",
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
                  .text("VS CODE"),
                $("<h3>")
                  .addClass("mc-doc-wide-panel_title")
                  .text("Настройка редактора"),
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "Для JavaScript-проекта этого обычно достаточно: подключить mc.d.ts, описать include/typeRoots в jsconfig.json и перезапустить TypeScript Server в VS Code. После этого редактор начнёт подсказывать базовые конструкции MC прямо в .js-файлах.",
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "Сниппеты для компонентов, state, effects и lifecycle лучше хранить отдельно в пользовательских snippets VS Code. Их нет смысла переписывать в документацию целиком: важнее сам факт, что MC хорошо ложится на JS-first workflow с шаблонами под class components и runtime helpers.",
              ),
            $("<div>")
              .addClass("mc-doc-note-row")
              .append(
                $.MC(
                  NoteCard,
                  {
                    title: "Autocomplete",
                    text: "Даже при checkJs: false редактор может использовать d.ts для подсказок и навигации по API.",
                  },
                  "install-note-vscode-autocomplete",
                ),
                $.MC(
                  NoteCard,
                  {
                    title: "Stricter mode",
                    text: "Если нужен более жёсткий анализ JavaScript-кода, можно точечно включать // @ts-check или поднимать checkJs для отдельных зон проекта.",
                  },
                  "install-note-vscode-strict",
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
                  .text("LINKS"),
                $("<h3>")
                  .addClass("mc-doc-wide-panel_title")
                  .text("Основные ссылки"),
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .append(
                "NPM: ",
                $("<a>")
                  .attr({
                    href: "YOUR_NPM_URL",
                    target: "_blank",
                    rel: "noreferrer",
                  })
                  .text("YOUR_NPM_URL"),
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .append(
                "Git: ",
                $("<a>")
                  .attr({
                    href: "YOUR_GIT_URL",
                    target: "_blank",
                    rel: "noreferrer",
                  })
                  .text("YOUR_GIT_URL"),
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .append(
                "MC.min.js: ",
                $("<a>")
                  .attr({
                    href: "YOUR_MC_MIN_JS_URL",
                    target: "_blank",
                    rel: "noreferrer",
                  })
                  .text("YOUR_MC_MIN_JS_URL"),
              ),
            $("<div>")
              .addClass("mc-doc-callout")
              .text(
                "Для browser-first интеграции обычно хватает jQuery и MC.min.js. Для npm-сценария имеет смысл дополнительно держать ссылку на репозиторий и на экспериментальные d.ts-файлы, если проект использует editor-level типизацию.",
              ),
          ),
      );
  }
}