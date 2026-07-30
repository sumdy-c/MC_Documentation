export default class DocTopbar extends MC {
  render(
    {},
    { setPage, sectionTitle = "Документация", sectionGroup = "MC" },
  ) {
    return $("<div>")
      .addClass("mc-doc-topbar mc-doc-anim-in")
      .append(
        $("<button>")
          .addClass("mc-doc-back-btn")
          .attr("type", "button")
          .on("click", () => {
            window.history.replaceState(
              null,
              "",
              `${window.location.pathname}${window.location.search}`,
            );
            setPage("main");
          })
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
              .text(sectionGroup),
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
