import PreviewLine from "./components/PreviewLine.js";

export default class PreviewWindow extends MC {
  render() {
    return $("<div>")
      .addClass("mc-docs_preview-window")
      .append(
        $("<div>")
          .addClass("mc-docs_preview-topbar")
          .append(
            $("<span>").addClass("mc-docs_dot"),
            $("<span>").addClass("mc-docs_dot"),
            $("<span>").addClass("mc-docs_dot"),
            $("<div>")
              .addClass("mc-docs_preview-title")
              .text("MC runtime / live mental model"),
          ),
        $("<div>")
          .addClass("mc-docs_preview-body")
          .append(
            $.MC(
              PreviewLine,
              {
                label: "state",
                value: "tracks subscribers across virtual / fn / effect scopes",
              },
              "preview-line-state",
            ),
            $.MC(
              PreviewLine,
              {
                label: "scheduler",
                value: "batches updates and flushes in microtask",
              },
              "preview-line-scheduler",
            ),
            $.MC(
              PreviewLine,
              {
                label: "diff",
                value: "compares VDOM output and preserves keyed identity",
              },
              "preview-line-diff",
            ),
            $.MC(
              PreviewLine,
              {
                label: "patch",
                value: "applies minimal DOM mutations and reconnects refs",
              },
              "preview-line-patch",
            ),
            $.MC(
              PreviewLine,
              {
                label: "lifecycle",
                value: "mounted / updated / unmounted around real DOM work",
              },
              "preview-line-lifecycle",
            ),
          ),
      );
  }
}
