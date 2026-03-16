import SectionHeading from "./components/SectionHeading.js";
import SignalCard from "./components/SignalCard.js";

export default class DocsCodeShowcase extends MC {
  render() {
    return $("<section>")
      .addClass("mc-docs_section mc-docs_fade-up mc-docs_fade-up--delay-4")
      .append(
        $.MC(
          SectionHeading,
          {
            kicker: "STYLE",
            title: "MC feels like MC",
            text: "Главная страница документации тоже собрана как дерево небольших компонентов. То есть сам обзор уже показывает подход фреймворка на практике.",
          },
          "showcase-heading",
        ),
        $("<div>")
          .addClass("mc-docs_showcase-grid")
          .append(
            $("<div>")
              .addClass("mc-docs_showcase-card")
              .append(
                $("<div>")
                  .addClass("mc-docs_code-window")
                  .append(
                    $("<div>").addClass("mc-docs_code-head").text("Main.js"),
                    $("<pre>")
                      .addClass("mc-docs_code")
                      .text(
                        `export default class Main extends MC {
    render() {
        return $('<main>').append(
            $.MC(DocsHero),
            $.MC(DocsArchitecture),
            $.MC(DocsFeatureGrid)
        );
    }
}`,
                      ),
                  ),
              ),
            $("<div>")
              .addClass("mc-docs_showcase-side")
              .append(
                $.MC(
                  SignalCard,
                  {
                    label: "Approach",
                    value: "Composable",
                  },
                  "signal-composable",
                ),
                $.MC(
                  SignalCard,
                  {
                    label: "Visual tone",
                    value: "Technical / calm / dark",
                  },
                  "signal-visual",
                ),
                $.MC(
                  SignalCard,
                  {
                    label: "Goal",
                    value: "Make the docs look like the runtime",
                  },
                  "signal-goal",
                ),
              ),
          ),
      );
  }
}
