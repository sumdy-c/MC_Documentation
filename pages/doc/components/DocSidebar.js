import SidebarNavButton from "./SidebarNavButton.js";

export default class DocSidebar extends MC {
  constructor() {
    super();
    this.searchState = super.state("");
  }

  groupPages(pages) {
    return pages.reduce((groups, page) => {
      const group = groups.find((item) => item.name === page.group);
      if (group) {
        group.pages.push(page);
      } else {
        groups.push({ name: page.group, pages: [page] });
      }
      return groups;
    }, []);
  }

  render({ searchState }, { section = "overview", setSection, pages = [] }) {
    const [search, setSearch] = searchState;
    const query = search.trim().toLowerCase();
    const visiblePages = pages.filter((page) =>
      [
        page.group,
        page.title,
        page.short,
        page.summary,
        ...(page.keywords || []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
    const groups = this.groupPages(visiblePages);

    return $("<aside>")
      .addClass("mc-doc-sidebar mc-doc-anim-in mc-doc-anim-in--d1")
      .append(
        $("<div>")
          .addClass("mc-doc-sidebar_head")
          .append(
            $("<div>").addClass("mc-doc-sidebar_title").text("Документация"),
            $("<span>")
              .addClass("mc-doc-sidebar_version")
              .text("MC v8.1"),
          ),

        $("<label>")
          .addClass("mc-doc-sidebar_search")
          .append(
            $("<span>").text("Поиск"),
            $("<input>")
              .attr("type", "search")
              .attr("placeholder", "state, effect, key...")
              .val(search)
              .on("input", (event) => setSearch(event.target.value)),
          ),

        $("<div>")
          .addClass("mc-doc-sidebar_nav")
          .append(
            groups.length
              ? groups.map((group) =>
                  $("<section>")
                    .addClass("mc-doc-sidebar_group")
                    .append(
                      $("<div>")
                        .addClass("mc-doc-sidebar_group-title")
                        .text(group.name),
                      group.pages.map((page) =>
                        $.MC(
                          SidebarNavButton,
                          {
                            title: page.short || page.title,
                            text: page.summary,
                            active: section === page.id,
                            onClick: () => setSection(page.id),
                          },
                          `doc-nav-${page.id}`,
                        ),
                      ),
                    ),
                )
              : $("<div>")
                  .addClass("mc-doc-sidebar_empty")
                  .text("Разделы не найдены"),
          ),
      );
  }
}
