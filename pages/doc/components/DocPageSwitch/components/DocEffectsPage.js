import CodeBlock from "../../CodeBlock.js";
import CodeCard from "../../CodeCard.js";
import SectionHeader from "../../SectionHeader.js";
import { StepCard } from "../../StepCard.js";

export default class DocEffectsPage extends MC {
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

