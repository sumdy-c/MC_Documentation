export default class SectionHeader extends MC {
  render({}, { kicker = "", title = "", text = "" }) {
    return $("<div>")
      .addClass("mc-doc-section_header")
      .append(
        $("<div>").addClass("mc-doc-pill").text(kicker),
        $("<h2>").addClass("mc-doc-section_title").text(title),
        $("<p>").addClass("mc-doc-section_text").text(text),
      );
  }
}
