class AppDocs extends MC {
  /**
   * Текущая страница
   */
  page;

  constructor() {
    super();
    this.PAGES = {
      MAIN: "main",
      DOCS: "docs",
    };

    const page = localStorage.getItem("page");
    this.page = super.state(page ? page : this.PAGES.MAIN);
    this.blackMirrorState = super.state(false);

    // settings | global State
    const sidebarHide = localStorage.getItem("sidebarHide");
    this.sidebarHideStateGlobal = MC.uState(typeof sidebarHide === 'boolean' ? sidebarHide : false, 'sidebarHide_mcUniqueState');

    this.fr = true
  }

  setPage(page) {
    this.page.set(page);
    localStorage.setItem("page", page);
  }

  setBlackMiror(value) {
    this.blackMirrorState.set(value);
  }

  render(states) {
    const [page, blackMirror] = states.local;

    $.MC.effect(([sidebarHideStateGlobal]) => {
        if(this.fr) {
            return;
        }

        localStorage.setItem("sidebarHide", sidebarHideStateGlobal);

    }, [this.sidebarHideStateGlobal]);

    this.fr = false;

    return $("<div>")
      .addClass("relative flex h-auto min-h-screen w-full flex-col")
      .append(
        $("<div>")
          .addClass("flex h-full grow flex-col")
          .append(
            $.MC(Header, {
              currentPage: page,
              goToDocs: () => this.setPage(this.PAGES.DOCS),
              goToHome: () => this.setPage(this.PAGES.MAIN),
            }),
            $("<div>").append(
              page === this.PAGES.MAIN &&
                $.MC(MainPage, {
                  goToDocs: () => this.setPage(this.PAGES.DOCS),
                }),
              page === this.PAGES.DOCS && $.MC(DocsPage)
            ),
            $.MC(Footer),
            blackMirror && $.MC(BlackMirror),
            
            page === this.PAGES.DOCS && $.MC(Settings, {
              activatedBlackMiror: (value) => this.setBlackMiror(value),
            })
          )
      );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  $("#root").append($.MC(AppDocs));
});
