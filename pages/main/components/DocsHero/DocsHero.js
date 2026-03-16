import HeroButton from "./components/HeroButton.js";
import PreviewWindow from "./components/PreviewWindow/PreviewWindow.js";
import StatCard from "./components/StatCard.js";

export default class DocsHero extends MC {
  render({}, { setPage }) {
    return $("<section>")
      .addClass("mc-docs_hero mc-docs_fade-up")
      .append(
        $("<div>")
          .addClass("mc-docs_hero-inner")
          .append(
            $("<div>")
              .addClass("mc-docs_eyebrow")
              .text("INTERNAL DOCUMENTATION / MC RUNTIME"),
            $("<h1>")
              .addClass("mc-docs_title")
              .append(
                $("<span>").text("MC"),
                $("<span>")
                  .addClass("mc-docs_title-gradient")
                  .text("Runtime for jQuery apps"),
              ),
            $("<p>")
              .addClass("mc-docs_subtitle")
              .text(
                "Собственный runtime с state, effect, lifecycle, diff/patch и аккуратной интеграцией с DOM-first архитектурой.",
              ),
            $("<div>")
              .addClass("mc-docs_hero-actions")
              .append(
                $.MC(
                  HeroButton,
                  {
                    label: "Start reading",
                    kind: "primary",
                    onClick: () => setPage('doc')
                  },
                  "hero-btn-primary",
                ),
                $.MC(
                  HeroButton,
                  {
                    label: "Architecture overview",
                    kind: "ghost",
                    onClick: () => setPage('architecture')
                  },
                  "hero-btn-ghost",
                ),
              ),
            $("<div>")
              .addClass("mc-docs_stat-row")
              .append(
                $.MC(
                  StatCard,
                  {
                    label: "Runtime",
                    value: "Stateful",
                    meta: "Own lifecycle & scheduler",
                  },
                  "stat-runtime",
                ),
                $.MC(
                  StatCard,
                  {
                    label: "Rendering",
                    value: "Diff / Patch",
                    meta: "DOM updates with keyed children",
                  },
                  "stat-rendering",
                ),
                $.MC(
                  StatCard,
                  {
                    label: "Interop",
                    value: "jQuery-first",
                    meta: "Designed for real legacy surfaces",
                  },
                  "stat-interop",
                ),
              ),
          ),
        $("<div>")
          .addClass("mc-docs_hero-panel")
          .append($.MC(PreviewWindow, {}, "hero-preview-window")),
      );
  }
}
