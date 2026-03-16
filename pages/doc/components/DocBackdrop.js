export default class DocBackdrop extends MC {
  render() {
    return $("<div>")
      .addClass("mc-doc-page_backdrop")
      .append(
        $("<div>").addClass("mc-doc-page_grid"),
        $("<div>").addClass("mc-doc-page_orb mc-doc-page_orb--a"),
        $("<div>").addClass("mc-doc-page_orb mc-doc-page_orb--b"),
        $("<div>").addClass("mc-doc-page_noise"),
      );
  }
}
