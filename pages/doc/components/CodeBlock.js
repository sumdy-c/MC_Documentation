export default class CodeBlock extends MC {
  render({}, { code = "" }) {
    return $("<pre>").addClass("mc-doc-code").append($("<code>").text(code));
  }
}