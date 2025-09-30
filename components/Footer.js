class Footer extends MC {
  constructor() {
    super();
  }

  render() {
    return $("<footer>")
      .addClass("border-t border-gray-700")
      .append(
        $("<div>")
          .addClass("mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8")
          .append(
            $("<div>")
              .addClass(
                "flex flex-col items-center justify-between gap-8 md:flex-row"
              )
              .append(
                $("<div>")
                  .addClass("flex flex-wrap items-center justify-center gap-6")
                  .append(
                    $("<a>")
                      .addClass(
                        "text-sm font-medium hover:font-bold text-text-dark/70 hover:text-accent-dark"
                      )
                      .attr("href", "#")
                      .text("Документация"),
                    $("<a>")
                      .addClass(
                        "text-sm font-medium hover:font-bold text-text-dark/70 hover:text-accent-dark"
                      )
                      .attr("href", "#")
                      .text("Примеры"),
                    $("<a>")
                      .addClass(
                        "text-sm font-medium hover:font-bold text-text-dark/70 hover:text-accent-dark"
                      )
                      .attr("href", "#")
                      .text("API")
                  ),
                $("<p>")
                  .addClass("text-sm text-text-dark/70")
                  .text("© 2025 Micro Component. Open Source Software.")
              )
          )
      );
  }
}
