class DocsPage extends MC {
  constructor(_p, _s) {
    super();
    //local states
    const contentStorage = localStorage.getItem("content-docs");
    this.currentContent = super.state(
      contentStorage ? contentStorage : "start"
    );

    const toBoolean = (str) => str === 'true';
    const shStorage = localStorage.getItem("sidebarHide");
    this.hideSidebarState = super.state(toBoolean(shStorage));

    //global states
    const [sidebarHide] = MC.getState("sidebarHide_mcUniqueState");
    this.sidebarHide = sidebarHide;

    this.localTestState = super.state(false);
  }

  setContent(content) {
    this.currentContent.set(content);
    localStorage.setItem("content-docs", content);
  }

  hideSidebar(value) {
    this.hideSidebarState.set(value);
  }

  render(state) {
    const [currentContent, hideSidebarState] = state.local;

      $.MC.effect(([state]) => {
        this.hideSidebar(state);
      }, [this.sidebarHide]);

      $.MC.effect(([localState]) => {
        console.log('localState');
        console.log(localState);
      }, [this.localTestState]);

    return $("<main>")
      .addClass(
        `flex-grow container mx-auto px-3 sm:px-4 lg:px-6 py-4 lg:py-8 prose prose-xs dark:prose-invert max-w-none selection:bg-blue-900 selection:text-white`
      )
      .append(
        $("<div>")
          .addClass("flex flex-col lg:flex-row")
          // Sidebar
          .append(
            hideSidebarState
              ? $("<aside>")
                  .addClass("analog_sidebar transition-100")
                  .append($("<span>").text(currentContent))
                  .on("click", () => {
                    this.hideSidebar(false);
                  })
              : $.MC(Sidebar, [this.sidebarHide], {
                  currentContent: currentContent,
                  setContent: (content) => this.setContent(content),
                  hidePanel: () => this.hideSidebar(true),
                }, 'side_bar_key') // без ключа множественно пересоздаёт компонент
          )
          // Контент
          .append(
            currentContent === "start" && $.MC(StartContent),
            currentContent === "install" && $.MC(InstallContent),
            currentContent === "philosophy" && $.MC(PhilosophyContent),
            currentContent === "fast_start" && $.MC(FastStartContent),
            currentContent === 'stateAndRnd' && $.MC(StateAndRender),
            currentContent === 'testPage' && $.MC(TestPage),
          ),
        // вынести навигацию в отдельный компонент
        $("<div>")
          .addClass(
            "flex justify-between items-center mt-8 pt-4 border-t border-border-light dark:border-border-dark text-xs"
          )
          .append(
            $("<div>")
              .addClass("text-secondary hover:underline flex items-center")
              .append(""),
            $("<button>")
              .addClass("text-secondary hover:underline flex items-center")
              .attr("href", "")
              .append(`Перейти к разделу - "?"`).on('click', () => this.localTestState.set(!this.localTestState.get()))
          )
      );
  }
}
