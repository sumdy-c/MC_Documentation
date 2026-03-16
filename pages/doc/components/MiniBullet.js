export default class MiniBullet extends MC {
  render({}, { text = "" }) {
    return $("<div>")
      .addClass("mc-doc-mini-bullet")
      .append(
        $("<span>").addClass("mc-doc-mini-bullet_dot"),
        $("<span>").addClass("mc-doc-mini-bullet_text").text(text),
      );
  }
}
