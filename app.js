import Architecture from "./pages/architecture/Architecture.js";
import Doc from "./pages/doc/doc.js";
import Main from "./pages/main/main.js";

const APP_PAGE_STORAGE_KEY = "mc-doc-page";
const APP_PAGES = new Set(["main", "doc", "architecture"]);

function getInitialPage() {
  try {
    const savedPage = localStorage.getItem(APP_PAGE_STORAGE_KEY);
    return APP_PAGES.has(savedPage) ? savedPage : "main";
  } catch (error) {
    return "main";
  }
}

export default class App extends MC {
  constructor() {
    super();
    this.pageState = super.state(getInitialPage());
  }

  render({ pageState }) {
    const [page, setPage, pageStateRef] = pageState;

    $.MC.effect(
      ([currentPage]) => {
        try {
          localStorage.setItem(APP_PAGE_STORAGE_KEY, currentPage);
        } catch (error) {}
      },
      [pageStateRef],
    );

    return $("<div>").append(
      page === "main" && $.MC(Main, { setPage }),
      page === "doc" && $.MC(Doc, { setPage }),
      page === "architecture" && $.MC(Architecture, { setPage }),
    );
  }
}
