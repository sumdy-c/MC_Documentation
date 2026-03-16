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