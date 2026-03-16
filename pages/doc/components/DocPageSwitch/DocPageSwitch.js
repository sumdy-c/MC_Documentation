import DocComponentsPage from "./components/DocComponentsPage.js";
import DocEffectsPage from "./components/DocEffectsPage.js";
import DocInstallPage from "./components/DocInstallPage.js";
import DocLifecyclePage from "./components/DocLifecyclePage.js";
import DocOverviewPage from "./components/DocOverviewPage.js";
import DocStatePage from "./components/DocStatePage.js";

export default class DocPageSwitch extends MC {
  render({}, { section }) {
    let page = null;

    if (section === "installation") {
      page = $.MC(DocInstallPage, {}, "doc-install-page");
    } else if (section === "components") {
      page = $.MC(DocComponentsPage, {}, "doc-components-page");
    } else if (section === "state") {
      page = $.MC(DocStatePage, {}, "doc-state-page");
    } else if (section === "effects") {
      page = $.MC(DocEffectsPage, {}, "doc-effects-page");
    } else if (section === "lifecycle") {
      page = $.MC(DocLifecyclePage, {}, "doc-lifecycle-page");
    } else {
      page = $.MC(DocOverviewPage, {}, "doc-overview-page");
    }

    return $("<div>").append(page);
  }
}