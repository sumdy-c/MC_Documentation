class DocsPage extends MC {
  constructor(_p, _s, vdomID) {
    super();
    const content = localStorage.getItem('content-docs');
    this.animClass = cssManager.cmpCss('fader', vdomID);
    this.currentContent = super.state(content ? content : 'start');
  }

  setContent(content) {
    this.currentContent.set(content);
    localStorage.setItem('content-docs', content);
  }

  render(state) {
    const [currentContent] = state.local;

    return $("<main>")
      .addClass(
        `${this.animClass} flex-grow container mx-auto px-3 sm:px-4 lg:px-6 py-4 lg:py-8 prose prose-xs dark:prose-invert max-w-none selection:bg-blue-900 selection:text-white`
      )
      .append(
        $("<div>")
          .addClass("flex flex-col lg:flex-row")
          // Sidebar
          .append(
            $.MC(Sidebar, {
              currentContent: currentContent,
              setContent: (content) => this.setContent(content),
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
