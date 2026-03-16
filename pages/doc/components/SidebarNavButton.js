export default class SidebarNavButton extends MC {
  render({}, { title = "", text = "", active = false, onClick }) {
    return $("<button>")
      .addClass(`mc-doc-nav-btn ${active ? "mc-doc-nav-btn--active" : ""}`)
      .attr("type", "button")
      .on("click", onClick)
      .append(
        $("<div>").addClass("mc-doc-nav-btn_title").text(title),
        $("<div>").addClass("mc-doc-nav-btn_text").text(text),
      );
  }
}
