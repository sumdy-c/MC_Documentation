export default class DocTopbar extends MC {
  render({}, { setPage, section = "overview" }) {
    const sectionTitle = section;

    return $("<div>")
      .addClass("mc-doc-topbar mc-doc-anim-in")
      .append(
        $("<button>")
          .addClass("mc-doc-back-btn")
          .attr("type", "button")
          .on("click", () => setPage("main"))
          .append(
            $("<span>").addClass("mc-doc-back-btn_text").text("Back to main"),
          ),
        $("<div>")
          .addClass("mc-doc-breadcrumbs")
          .append(
            $("<span>").addClass("mc-doc-breadcrumbs_item").text("MC"),
            $("<span>").addClass("mc-doc-breadcrumbs_sep").text("/"),
            $("<span>")
              .addClass("mc-doc-breadcrumbs_item")
              .text("Documentation"),
            $("<span>").addClass("mc-doc-breadcrumbs_sep").text("/"),
            $("<span>")
              .addClass(
                "mc-doc-breadcrumbs_item mc-doc-breadcrumbs_item--active",
              )
              .text(sectionTitle),
          ),
      );
  }
}