import DocBackdrop from "./components/DocBackdrop.js";
import DocPageSwitch from "./components/DocPageSwitch/DocPageSwitch.js";
import DocSidebar from "./components/DocSidebar.js";
import DocTopbar from "./components/DocTopbar.js";

const DOC_PAGES = [
  {
    id: "overview",
    title: "Overview",
    text: "Что такое MC и где он полезен",
  },
  {
    id: "installation",
    title: "Installation",
    text: "Подключение, MC.init() и первый старт",
  },
  {
    id: "components",
    title: "Components",
    text: "Class / function components и композиция",
  },
  {
    id: "state",
    title: "State",
    text: "Local state, shared state и context",
  },
  {
    id: "effects",
    title: "Effects",
    text: "effect, memo и реакция на изменения",
  },
  {
    id: "lifecycle",
    title: "Lifecycle",
    text: "mounted, unmounted, ref и host",
  },
];

export default class Doc extends MC {
  constructor() {
    super();
    this.sectionState = super.state("overview");
  }

  render({ sectionState }, { setPage }) {
    const [section, setSection, instanceSection] = sectionState;

    $.MC.effect(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, [instanceSection]);

    return $("<main>")
      .addClass("mc-doc-page")
      .append(
        $.MC(DocBackdrop, {}, "doc-backdrop"),
        $("<div>")
          .addClass("mc-doc-page_shell")
          .append(
            $.MC(DocTopbar, { setPage, section }, "doc-topbar"),
            $("<section>")
              .addClass("mc-doc-page_layout")
              .append(
                $.MC(
                  DocSidebar,
                  {
                    section,
                    setSection,
                    pages: DOC_PAGES,
                  },
                  "doc-sidebar",
                ),
                $("<div>")
                  .addClass("mc-doc-page_content")
                  .append($.MC(DocPageSwitch, { section }, "doc-page-switch")),
              ),
          ),
      );
  }
}