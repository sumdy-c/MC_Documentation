export class StepCard extends MC {
  render({}, { index = "", title = "", text = "" }) {
    return $("<article>")
      .addClass("mc-doc-step-card")
      .append(
        $("<div>").addClass("mc-doc-step-card_index").text(index),
        $("<div>").addClass("mc-doc-step-card_title").text(title),
        $("<div>").addClass("mc-doc-step-card_text").text(text),
      );
  }
}