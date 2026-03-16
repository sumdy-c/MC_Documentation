import CodeBlock from "./CodeBlock.js";

export default class CompareCard extends MC {
  render({}, { title = "", text = "", code = "" }) {
    return $("<article>")
      .addClass("mc-doc-compare-card")
      .append(
        $("<div>").addClass("mc-doc-compare-card_title").text(title),
        $("<div>").addClass("mc-doc-compare-card_text").text(text),
        $.MC(CodeBlock, { code }, `${title}-compare-code`),
      );
  }
}