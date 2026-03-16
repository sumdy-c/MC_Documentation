export default class HeroStatMini extends MC {
  render({}, { label = "", value = "" }) {
    return $("<div>")
      .addClass("mc-doc-hero-mini")
      .append(
        $("<div>").addClass("mc-doc-hero-mini_label").text(label),
        $("<div>").addClass("mc-doc-hero-mini_value").text(value),
      );
  }
}