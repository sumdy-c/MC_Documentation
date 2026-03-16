import SidebarNavButton from "./SidebarNavButton.js";

export default class DocSidebar extends MC {
  render({}, { section = "overview", setSection, pages = [] }) {
    return $("<aside>")
      .addClass("mc-doc-sidebar mc-doc-anim-in mc-doc-anim-in--d1")
      .append(
        $("<div>").addClass("mc-doc-sidebar_title").text("Sections"),

        $("<div>")
          .addClass("mc-doc-sidebar_nav")
          .append(
            pages.map((page) =>
              $.MC(
                SidebarNavButton,
                {
                  title: page.title,
                  text: page.text,
                  active: section === page.id,
                  onClick: () => setSection(page.id),
                },
                `doc-nav-${page.id}`,
              ),
            ),
          ),

        $("<div>")
          .addClass("mc-doc-sidebar_hint")
          .text(
            "Стартовый слой документации. Потом сюда спокойно добавятся architecture, rendering, keys и API reference.",
          ),
      );
  }
}