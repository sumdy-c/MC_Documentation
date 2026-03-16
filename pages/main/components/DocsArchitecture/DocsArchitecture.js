import SectionHeading from "../DocsCodeShowcase/components/SectionHeading.js";
import TimelineCard from "./components/TimelineCard.js";

export default class DocsArchitecture extends MC {
  render() {
    return $("<section>")
      .addClass("mc-docs_section mc-docs_fade-up mc-docs_fade-up--delay-2")
      .append(
        $.MC(
          SectionHeading,
          {
            kicker: "PIPELINE",
            title: "Как мыслит MC",
            text: "Главная ценность MC — связанный pipeline: чтение state, планирование обновлений, render, diff, patch и lifecycle вокруг реального DOM.",
          },
          "architecture-heading",
        ),
        $("<div>")
          .addClass("mc-docs_timeline")
          .append(
            $.MC(
              TimelineCard,
              {
                index: "01",
                title: "State read",
                text: "Компонент читает state и регистрирует фактическую зависимость.",
              },
              "timeline-state",
            ),
            $.MC(
              TimelineCard,
              {
                index: "02",
                title: "Update scheduling",
                text: "set() не рендерит хаотично, а складывает обновления в контролируемый flush.",
              },
              "timeline-scheduler",
            ),
            $.MC(
              TimelineCard,
              {
                index: "03",
                title: "Render to virtual output",
                text: "Компонент возвращает следующее состояние DOM-дерева.",
              },
              "timeline-render",
            ),
            $.MC(
              TimelineCard,
              {
                index: "04",
                title: "Diff / Patch",
                text: "MC сравнивает деревья и вносит реальные изменения минимально и предсказуемо.",
              },
              "timeline-diff",
            ),
            $.MC(
              TimelineCard,
              {
                index: "05",
                title: "Lifecycle & refs",
                text: "После коммита восстанавливаются refs, вызываются mounted / updated и очищаются мёртвые связи.",
              },
              "timeline-lifecycle",
            ),
          ),
      );
  }
}
