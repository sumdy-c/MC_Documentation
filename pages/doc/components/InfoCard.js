export default class InfoCard extends MC {
  render({}, { title = "", text = "" }) {
    return $("<article>")
      .addClass("mc-doc-card")
      .append(
        $("<div>").addClass("mc-doc-card_glow"),
        $("<h3>").addClass("mc-doc-card_title").text(title),
        $("<p>").addClass("mc-doc-card_text").text(text),
      );
  }
}