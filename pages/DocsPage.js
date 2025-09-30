class DocsPage extends MC {
  constructor() {
    super();
  }

  render() {
    return $("<main>")
      .addClass(
        "flex-grow container mx-auto px-3 sm:px-4 lg:px-6 py-4 lg:py-8 prose prose-xs dark:prose-invert max-w-none selection:bg-blue-900 selection:text-white"
      )
      .append(
        $("<div>")
          .addClass("flex flex-col lg:flex-row")
          // Sidebar
          .append(
            $("<aside>")
              .addClass("w-full lg:w-48 lg:pr-4 mb-8 lg:mb-0")
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
                          $("<a>")
                            .addClass(
                              "block px-2 py-1 rounded text-xs text-text-light dark:text-text-dark bg-primary/10 dark:bg-primary/20 font-medium hover:bg-primary/20 dark:hover:bg-primary/30 hover:text-text-light dark:hover:text-text-dark no-underline"
                            )
                            .attr("href", "#")
                            .text("Введение")
                        ),
                        $("<li>").append(
                          $("<a>")
                            .addClass(
                              "block px-2 py-1 rounded text-xs text-text-muted-light dark:text-text-muted-dark hover:bg-gray-200 dark:hover:bg-card-dark hover:text-text-light dark:hover:text-text-dark no-underline"
                            )
                            .attr("href", "#")
                            .text("Установка")
                        ),
                        $("<li>").append(
                          $("<a>")
                            .addClass(
                              "block px-2 py-1 rounded text-xs text-text-muted-light dark:text-text-muted-dark hover:bg-gray-200 dark:hover:bg-card-dark hover:text-text-light dark:hover:text-text-dark no-underline"
                            )
                            .attr("href", "#")
                            .text("Ваш первый компонент")
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
                          $("<a>")
                            .addClass(
                              "block px-2 py-1 rounded text-xs text-text-muted-light dark:text-text-muted-dark hover:bg-gray-200 dark:hover:bg-card-dark hover:text-text-light dark:hover:text-text-dark no-underline"
                            )
                            .attr("href", "#")
                            .text("Состояние и рендеринг")
                        ),
                        $("<li>").append(
                          $("<a>")
                            .addClass(
                              "block px-2 py-1 rounded text-xs text-text-muted-light dark:text-text-muted-dark hover:bg-gray-200 dark:hover:bg-card-dark hover:text-text-light dark:hover:text-text-dark no-underline"
                            )
                            .attr("href", "#")
                            .text("Жизненный цикл")
                        ),
                        $("<li>").append(
                          $("<a>")
                            .addClass(
                              "block px-2 py-1 rounded text-xs text-text-muted-light dark:text-text-muted-dark hover:bg-gray-200 dark:hover:bg-card-dark hover:text-text-light dark:hover:text-text-dark no-underline"
                            )
                            .attr("href", "#")
                            .text("События")
                        )
                      )
                  )
                  // Раздел "API"
                  .append(
                    $("<h3>")
                      .addClass(
                        "text-[10px] font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider mt-4 mb-2"
                      )
                      .text("API"),
                    $("<ul>")
                      .addClass("space-y-1")
                      .append(
                        $("<li>").append(
                          $("<a>")
                            .addClass(
                              "block px-2 py-1 rounded text-xs text-text-muted-light dark:text-text-muted-dark hover:bg-gray-200 dark:hover:bg-card-dark hover:text-text-light dark:hover:text-text-dark no-underline"
                            )
                            .attr("href", "#")
                            .text("MicroComponent")
                        ),
                        $("<li>").append(
                          $("<a>")
                            .addClass(
                              "block px-2 py-1 rounded text-xs text-text-muted-light dark:text-text-muted-dark hover:bg-gray-200 dark:hover:bg-card-dark hover:text-text-light dark:hover:text-text-dark no-underline"
                            )
                            .attr("href", "#")
                            .text("createStore")
                        )
                      )
                  )
              )
          )
          // Контент
          .append(
            $("<div>")
              .addClass("flex-1 lg:pl-4")
              .append(
                $("<article>")
                  .addClass(
                    "prose prose-xs dark:prose-invert max-w-none prose-h1:text-2xl prose-h1:font-bold prose-h1:text-text-light prose-h1:dark:text-text-dark prose-a:text-primary hover:prose-a:text-primary/80 selection:bg-blue-900 selection:text-white"
                  )
                  .append(
                    $("<div>")
                      .addClass("mb-4")
                      .append(
                        $("<span>")
                          .addClass("text-secondary font-semibold text-xs")
                          .text("Введение")
                      ),
                    $("<h1>")
                      .addClass("text-2xl")
                      .text("Что такое Micro Component?"),
                    $("<p>")
                      .addClass("lead text-xs")
                      .text(
                        "Micro Component — это ультралегкая библиотека для создания реактивных интерфейсов с минимальным оверхедом и фокусом на производительность."
                      ),
                    $("<p>")
                      .addClass("text-xs")
                      .text(
                        "Она создана для разработчиков, которые ценят простоту и скорость, и хотят полного контроля над кодом. В отличие от крупных фреймворков, Micro Component не навязывает сложную архитектуру, предоставляя минимальный набор инструментов для динамических веб-приложений."
                      ),
                    $("<h2>")
                      .addClass("text-lg mt-6")
                      .text("Ключевые принципы"),
                    $("<ul>")
                      .addClass("text-xs space-y-1")
                      .append(
                        $("<li>").html(
                          "<strong>Минимализм:</strong> Ядро очень компактно — подключайте только необходимое."
                        ),
                        $("<li>").html(
                          "<strong>Производительность:</strong> Эффективный рендеринг DOM обеспечивает скорость даже на сложных интерфейсах."
                        ),
                        $("<li>").html(
                          "<strong>Простота:</strong> API интуитивно понятен, начать можно через несколько минут."
                        ),
                        $("<li>").html(
                          "<strong>Гибкость:</strong> Легко интегрируется с существующими проектами и библиотеками."
                        )
                      ),
                    $("<h2>")
                      .addClass("text-lg mt-6")
                      .text("Когда использовать Micro Component?"),
                    $("<p>").addClass("text-xs").text("Подходит для:"),
                    $("<ul>")
                      .addClass("text-xs space-y-1")
                      .append(
                        $("<li>").html(
                          "<strong>Небольших и средних проектов</strong>, где большие фреймворки избыточны."
                        ),
                        $("<li>").html(
                          "<strong>Небольших и средних проектов</strong>, где большие фреймворки избыточны."
                        ),
                        $("<li>").html(
                          "<strong>Небольших и средних проектов</strong>, где большие фреймворки избыточны."
                        )
                      ),
                    $("<div>")
                      .addClass(
                        "mt-8 p-4 rounded-lg bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark text-xs"
                      )
                      .append(
                        $("<h3>")
                          .addClass(
                            "mt-0 text-base font-semibold text-text-light dark:text-text-dark"
                          )
                          .text("Пример кода"),
                        $("<p>")
                          .addClass(
                            "text-xxs text-text-muted-light dark:text-text-muted-dark mb-2"
                          )
                          .text('Простой компонент "Hello, World":'),
                        $("<pre>")
                          .addClass(
                            "bg-gray-800 text-white rounded-md p-2 text-xxs"
                          )
                          .append(
                            $("<code>").addClass("language-js").html(`
// Создание компонента
class HelloDeveloper extends MC.Component {
    constructor(name) {
        super();
        this.name = name;
    }
    render() {
        return \`&lt;div&gt;Привет \${this.name}!&lt;/div&gt;\`;
    }
}
// Использование
MC.mount(document.body, new HelloDeveloper('мир'));
                      `)
                          )
                      ),
                    $("<div>")
                      .addClass(
                        "flex justify-between items-center mt-8 pt-4 border-t border-border-light dark:border-border-dark text-xs"
                      )
                      .append(
                        $("<div>")
                          .addClass(
                            "text-secondary hover:underline flex items-center"
                          )
                          .append(""),
                        $("<button>")
                          .addClass(
                            "text-secondary hover:underline flex items-center"
                          )
                          .attr("href", "")
                          .append(`Перейти к разделу - "Установка"`)
                      )
                  )
              )
          )
      );
  }
}
