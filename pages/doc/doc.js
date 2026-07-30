import DocBackdrop from "./components/DocBackdrop.js";
import DocPageSwitch from "./components/DocPageSwitch/DocPageSwitch.js";
import DocSidebar from "./components/DocSidebar.js";
import DocTopbar from "./components/DocTopbar.js";
import DOC_CONTENT from "./content/DocContent.js";

const DOC_PAGE_IDS = new Set(DOC_CONTENT.map((page) => page.id));

function getInitialSection() {
  const hashSection = window.location.hash.replace(/^#/, "");
  return DOC_PAGE_IDS.has(hashSection) ? hashSection : "overview";
}

export default class Doc extends MC {
  constructor() {
    super();
    this.sectionState = super.state(getInitialSection());
  }

  render({ sectionState }, { setPage }) {
    const [section, setSection, instanceSection] = sectionState;
    const activePage =
      DOC_CONTENT.find((page) => page.id === section) || DOC_CONTENT[0];

    $.MC.effect(() => {
      window.history.replaceState(null, "", `#${section}`);
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
            $.MC(
              DocTopbar,
              {
                setPage,
                sectionTitle: activePage.title,
                sectionGroup: activePage.group,
              },
              "doc-topbar",
            ),
            $("<section>")
              .addClass("mc-doc-page_layout")
              .append(
                $.MC(
                  DocSidebar,
                  {
                    section,
                    setSection,
                    pages: DOC_CONTENT,
                  },
                  "doc-sidebar",
                ),
                $("<div>")
                  .addClass("mc-doc-page_content")
                  .append(
                    $.MC(
                      DocPageSwitch,
                      {
                        section,
                        pages: DOC_CONTENT,
                        setSection,
                      },
                      "doc-page-switch",
                    ),
                  ),
              ),
          ),
      );
  }
}
