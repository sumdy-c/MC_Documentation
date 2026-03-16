import CodeBlock from "./CodeBlock.js";

export default class CodeCard extends MC {
  render({}, { title = "", subtitle = "", code = "" }) {
    return $("<article>")
      .addClass("mc-doc-code-card")
      .append(
        $("<div>")
          .addClass("mc-doc-code-card_head")
          .append(
            $("<div>").addClass("mc-doc-code-card_title").text(title),
            $("<div>").addClass("mc-doc-code-card_subtitle").text(subtitle),
          ),
        $.MC(CodeBlock, { code }, `${title}-code-block`),
      );
  }
}