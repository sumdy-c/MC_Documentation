import DocContentPage from "./components/DocContentPage.js";

export default class DocPageSwitch extends MC {
  render({}, { section, pages = [], setSection }) {
    const pageIndex = Math.max(
      pages.findIndex((page) => page.id === section),
      0,
    );
    const page = pages[pageIndex] || pages[0];

    return $("<div>").append(
      $.MC(
        DocContentPage,
        {
          page,
          previousPage: pages[pageIndex - 1] || null,
          nextPage: pages[pageIndex + 1] || null,
          setSection,
        },
        `doc-content-${page.id}`,
      ),
    );
  }
}
