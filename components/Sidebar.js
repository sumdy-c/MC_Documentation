class Sidebar extends MC {
  constructor() {
    super();
    this.buttonClasses = {
      picked:
        "block px-2 py-1 rounded text-xs font-semibold text-text-light dark:text-text-dark border-b-2 border-secondary cursor-default",
      static:
        "block px-2 py-1 rounded text-xs text-text-muted-light dark:text-text-muted-dark hover:bg-gray-200 dark:hover:bg-card-dark hover:text-text-light dark:hover:text-text-dark",
    };
  }

  getButtonClass(content, btn) {
    return this.buttonClasses[content === btn ? "picked" : "static"];
  }

  render(states, { currentContent, setContent, hidePanel }) {
    const [sidebarHide] = states.global;
    return $("<aside>")
      .addClass("transition-100 w-full lg:w-48 lg:pr-4 mb-8 lg:mb-0")
      .append(
        $("<nav>")
          .addClass("sticky top-20")
          // Раздел "Начало работы"
          .append(
            $("<h3>")
              .addClass(
                "text-[10px] font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider mb-2"
              )
              .text("Начало работы"),
            $("<ul>")
              .addClass("space-y-1")
              .append(
                $("<li>").append(
                  $("<button>")
                    .addClass(this.getButtonClass(currentContent, "start"))
                    .text("Введение")
                    .on("click", () => setContent("start"))
                ),
                $("<li>").append(
                  $("<button>")
                    .addClass(this.getButtonClass(currentContent, "install"))
                    .text("Установка")
                    .on("click", () => setContent("install"))
                ),
                $("<li>").append(
                  $("<button>")
                    .addClass(this.getButtonClass(currentContent, "philosophy"))
                    .text("Философия")
                    .on("click", () => setContent("philosophy"))
                ),
                $("<li>").append(
                  $("<button>")
                    .addClass(this.getButtonClass(currentContent, "fast_start"))
                    .text("Быстрый старт")
                    .on("click", () => setContent("fast_start"))
                )
              )
          )
          // Раздел "Основные концепции"
          .append(
            $("<h3>")
              .addClass(
                "text-[10px] font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider mt-4 mb-2"
              )
              .text("Основные концепции"),
            $("<ul>")
              .addClass("space-y-1")
              .append(
                $("<li>").append(
                  $("<button>")
                    .addClass(this.getButtonClass(currentContent, "dfsfsdf"))
                    .attr("href", "#")
                    .text("Состояние и рендеринг")
                ),
                $("<li>").append(
                  $("<button>")
                    .addClass(this.getButtonClass(currentContent, "sdfsd"))
                    .attr("href", "#")
                    .text("Жизненный цикл ")
                ),
                $("<li>").append(
                  $("<button>")
                    .addClass(
                      this.getButtonClass(currentContent, "dfsfsdfsdfsdf")
                    )
                    .attr("href", "#")
                    .text("Мемоизация")
                ),
                $("<li>").append(
                  $("<button>")
                    .addClass(
                      this.getButtonClass(currentContent, "dfsfsdfsdfsdf")
                    )
                    .attr("href", "#")
                    .text("Изолирование контекста")
                ),
                $("<li>").append(
                  $("<button>")
                    .addClass(
                      this.getButtonClass(currentContent, "dfsfsdfsdfsdf")
                    )
                    .attr("href", "#")
                    .text("Миграция с v.6")
                ),
                $("<li>").append(
                  $("<button>")
                    .addClass(
                      this.getButtonClass(currentContent, "dfsfsdfsdfsdf")
                    )
                    .attr("href", "#")
                    .text("Оптимизации")
                ),
              )
          )
          // Раздел "Функциональные контейнеры"
          .append(
            $("<h3>")
              .addClass(
                "text-[10px] font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider mt-4 mb-2"
              )
              .text("Развитие до v8"),
            $("<ul>")
              .addClass("space-y-1")
              .append(
                $("<li>").append(
                  $("<button>")
                    .addClass(this.getButtonClass(currentContent, "dfsfsdf"))
                    .attr("href", "#")
                    .text("Фрагмент")
                ),
              )
          )

          
      )
      .on("mouseleave", () => {
        sidebarHide && hidePanel();
      });
  }
}
