class DocsPage extends MC {
  constructor(_p, _s) {
    super();
    const content = localStorage.getItem('content-docs');
    //local states
    this.currentContent = super.state(content ? content : 'start');
    this.visibleSidebarState = super.state(true);
    //global states
    const [ sidebarHide ] = MC.getState("sidebarHide_mcUniqueState");
    this.sidebarHide = sidebarHide;
  }

  setContent(content) {
    this.currentContent.set(content);
    localStorage.setItem('content-docs', content);
  }

  visibleSidebar(value) {
    this.visibleSidebarState.set(value);
  }

  render(state) {
    const [currentContent, visibleSidebarState] = state.local;

    $.MC.effect(([state]) => {
        // this.visibleSidebar(state);
    }, [this.sidebarHide]);

    return $("<main>")
      .addClass(
        `flex-grow container mx-auto px-3 sm:px-4 lg:px-6 py-4 lg:py-8 prose prose-xs dark:prose-invert max-w-none selection:bg-blue-900 selection:text-white`
      )
      .append(
        $("<div>")
          .addClass("flex flex-col lg:flex-row")
          // Sidebar
          .append(
            visibleSidebarState ? $.MC(Sidebar, [this.sidebarHide], {
              currentContent: currentContent,
              setContent: (content) => this.setContent(content),
              hidePanel: () => this.visibleSidebar(false),
            }) : 
            $('<aside>').addClass('analog_sidebar transition-100').append(
              $('<span>').text(currentContent)
            ).on('click', () => {
              this.visibleSidebar(true);
            })
          )
          // Контент
          .append(
            currentContent === "start" && $.MC(StartContent),
            currentContent === "install" && $.MC(InstallContent),
            currentContent === 'philosophy' && $.MC(PhilosophyContent),
            currentContent === 'fast_start' && $.MC(FastStartContent),
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
              .append(`Перейти к разделу - "?"`)
          )
      );
  }
}
