export default class NoteCard extends MC {
  render({}, { title = "", text = "" }) {
    return $("<article>")
      .addClass("mc-doc-note-card")
      .append(
        $("<div>").addClass("mc-doc-note-card_title").text(title),
        $("<div>").addClass("mc-doc-note-card_text").text(text),
      );
  }
}
