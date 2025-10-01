class MainPage extends MC {
  constructor(_p, _s, vdomID) {
    super();
    this.animClass = cssManager.cmpCss('fader', vdomID);
  }

  render(_s, { goToDocs }) {
    return $("<main>")
      .addClass(`${this.animClass} flex flex-1 justify-center px-4 sm:px-6 lg:px-8 pb-10`)
      .append(
        $("<div>")
          .addClass("w-full max-w-6xl")
          .append(
            // Первый блок (центральный экран)
            $("<div>")
              .addClass(
                "w-full h-screen flex items-center justify-center bg-transparent"
              )
              .append(
                $("<div>")
                  .addClass(
                    "flex flex-col items-center justify-center gap-6 p-6 text-center sm:gap-8 max-w-3xl"
                  )
                  .append(
                    $("<div>")
                      .addClass("flex flex-col gap-4 items-center")
                      .append(
                        $("<h1>")
                          .addClass(
                            "text-4xl font-extrabold tracking-tighter sm:text-6xl flex items-center gap-2"
                          )
                          .append(
                            "Micro Component",
                            $("<span>")
                              .css({
                                fontSize: "16px",
                              })
                              .addClass(
                                "px-2 py-1 text-sm font-semibold text-primary bg-accent-dark/30 rounded-lg border border-accent-dark"
                              )
                              .text("v 7")
                          ),
                        $("<p>")
                          .addClass(
                            "mx-auto text-base text-text-dark/70 sm:text-lg"
                          )
                          .text(
                            "Реактивность в jQuery: контроль рендеринга, минимальный оверхед и гибкая работа с состояниями."
                          )
                      ),
                    $("<button>")
                    .on('click', () => {
                        goToDocs();
                    })
                    .addClass(
                    "flex h-12 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-accent-dark px-6 text-base font-bold text-primary shadow-lg shadow-accent-dark/30 transition-all hover:bg-blue-400"
                    )
                    .append(
                    $("<span>").addClass("truncate").text("Исследовать")
                    )
                  )
              ),

            // Ключевые возможности
            $("<div>")
              .addClass("flex flex-col gap-10 py-10")
              .append(
                $("<div>")
                  .addClass("flex flex-col gap-4 text-center")
                  .append(
                    $("<h1>")
                      .addClass("text-3xl font-bold tracking-tight sm:text-4xl")
                      .text("Ключевые возможности")
                  ),
                $("<div>")
                  .addClass("grid grid-cols-1 gap-8 md:grid-cols-3")
                  .append(
                    $("<div>")
                      .addClass(
                        "flex flex-col gap-4 p-6 border border-gray-700 rounded-xl shadow-md bg-background-dark/50 cursor-pointer transition-all hover:shadow-xl hover:border-accent-dark"
                      )
                      .append(
                        $("<p>")
                          .addClass("text-base font-medium text-accent-dark")
                          .text("Компонентный API"),
                        $("<p>")
                          .addClass("text-sm text-text-dark/70")
                          .text(
                            "Создание интерфейсов из переиспользуемых блоков."
                          )
                      )
                      .on("click", () => (window.location.href = "#docs")), // ссылка на документацию

                    $("<div>")
                      .addClass(
                        "flex flex-col gap-4 p-6 border border-gray-700 rounded-xl shadow-md bg-background-dark/50 cursor-pointer transition-all hover:shadow-xl hover:border-accent-dark"
                      )
                      .append(
                        $("<p>")
                          .addClass("text-base font-medium text-accent-dark")
                          .text("Декларативные состояния"),
                        $("<p>")
                          .addClass("text-sm text-text-dark/70")
                          .text("Простая синхронизация данных и UI.")
                      )
                      .on("click", () => (window.location.href = "#state")),

                    $("<div>")
                      .addClass(
                        "flex flex-col gap-4 p-6 border border-gray-700 rounded-xl shadow-md bg-background-dark/50 cursor-pointer transition-all hover:shadow-xl hover:border-accent-dark"
                      )
                      .append(
                        $("<p>")
                          .addClass("text-base font-medium text-accent-dark")
                          .text("Легкая интеграция"),
                        $("<p>")
                          .addClass("text-sm text-text-dark/70")
                          .text(
                            "Разработан для постепенной интеграции реактивных подходов в существующие проекты"
                          )
                      )
                      .on("click", () => (window.location.href = "#events"))
                  )
              ),

            // Примеры кода и производительность
            $("<div>")
              .addClass("mt-20 grid grid-cols-1 gap-10 md:grid-cols-2")
              .append(
                $("<div>")
                  .addClass("flex flex-col gap-4")
                  .append(
                    $("<h3>")
                      .addClass("text-2xl font-bold tracking-tight")
                      .text("Пример кода"),
                    $("<p>")
                      .addClass("text-base text-text-dark/70")
                      .text("Как работает компонент в Micro Component v7."),
                    $("<div>")
                      .addClass("rounded-xl bg-code-bg p-6")
                      .append(
                        $("<pre>").append(
                          $("<code>").addClass("text-sm text-text-dark/70")
                            .text(`// Классовый компонент
class HelloDeveloper extends MC {
    constructor() {
        super();
    }

    render(_s, { name }) {
        return $('<div>').text('Привет в МС ' + name + "!");
    }
}

// Использование
$.MC(HelloDeveloper, { name: "Имя" });`)
                        )
                      )
                  ),
                $("<div>")
                  .addClass("flex flex-col gap-4")
                  .append(
                    $("<h3>")
                      .addClass("text-2xl font-bold tracking-tight")
                      .text("Производительность"),
                    $("<p>")
                      .addClass("text-base text-text-dark/70")
                      .text(
                        "MCv7 сокращает количество перерисовок DOM, обеспечивая более быструю и плавную работу интерфейса"
                      ),
                    $("<div>")
                      .addClass("rounded-xl bg-code-bg p-6")
                      .append(
                        $("<pre>").append(
                          $("<code>").addClass("text-sm text-text-dark/70")
                            .text(`// Протестированно:
// - Корректное обновление DOM при любом уровне вложенности
// - Синхронизация данных
// - Работа с большими списками`)
                        )
                      )
                  )
              ),

            // Архитектура
            $("<div>")
              .addClass("flex flex-col gap-16 py-20")
              .append(
                $("<div>")
                  .addClass("flex flex-col gap-4 text-center")
                  .append(
                    $("<h1>")
                      .addClass("text-3xl font-bold tracking-tight sm:text-4xl")
                      .text("Архитектура"),
                    $("<p>")
                      .addClass(
                        "mx-auto max-w-3xl text-base text-text-dark/70 sm:text-lg"
                      )
                      .text(
                        "Runtime-обновления интерфейса, работающие изолированно и не затрагивающие существующую кодовую базу"
                      )
                  ),

                //block
                $("<div>")
                  .addClass("space-y-4")
                  .append(
                    $("<div>")
                      .addClass(
                        "border border-accent-dark/20 rounded-xl overflow-hidden"
                      )
                      .append(
                        $("<button>")
                          .addClass(
                            "w-full flex items-center justify-between p-4 text-left text-accent-dark font-bold hover:bg-accent-dark/10 transition-colors"
                          )
                          .text("⚙️ Автоматический контроль")
                          .on("click", function () {
                            $(this).next().slideToggle(200);
                          }),
                        $("<div>")
                          .addClass("p-4 text-sm text-text-dark/70 hidden")
                          .text(
                            "MC позволяет разработчику создавать компоненты привычным способом, используя привычный синтаксис и подходы, к которым он уже привык. Всё, что разработчику нужно сделать, — это описать компонент и его содержимое (привычным способом), а MC автоматически обновляет только ту часть интерфейса, которая действительно изменилась."
                          )
                      ),
                    $("<div>")
                      .addClass(
                        "border border-accent-dark/20 rounded-xl overflow-hidden"
                      )
                      .append(
                        $("<button>")
                          .addClass(
                            "w-full flex items-center justify-between p-4 text-left text-accent-dark font-bold hover:bg-accent-dark/10 transition-colors"
                          )
                          .text("⚡ Реактивное ядро")
                          .on("click", function () {
                            $(this).next().slideToggle(200);
                          }),
                        $("<div>")
                          .addClass("p-4 text-sm text-text-dark/70 hidden")
                          .text(
                            "MC обеспечивает мгновенное обновление интерфейса при изменении состояния приложения, минимизируя количество перерисовок DOM и повышая общую отзывчивость страницы. Система позволяет точно управлять обновлениями компонентов, обновляя только те части интерфейса, которые действительно изменились, что существенно снижает нагрузку на браузер и ускоряет работу. Благодаря эффективному управлению состояниями, разработчик получает полный контроль над логикой приложения: данные и UI остаются синхронизированными в реальном времени, а любые изменения состояния автоматически отражаются на интерфейсе без необходимости ручного вмешательства."
                          )
                      ),
                    $("<div>")
                      .addClass(
                        "border border-accent-dark/20 rounded-xl overflow-hidden"
                      )
                      .append(
                        $("<button>")
                          .addClass(
                            "w-full flex items-center justify-between p-4 text-left text-accent-dark font-bold hover:bg-accent-dark/10 transition-colors"
                          )
                          .text("📦 Что в коробке")
                          .on("click", function () {
                            $(this).next().slideToggle(200);
                          }),
                        $("<div>")
                          .addClass("p-4 text-sm text-text-dark/70 hidden")
                          .text(
                            "MC обеспечивает обновление интерфейса и отдельных компонентов без лишней и перегруженности. Плагин оптимизирован для работы с существующими проектами, позволяя внедрять современные реактивные подходы без необходимости сложной интеграции. При этом MC обладает гибкой структурой: в будущем можно легко подключать плагины и расширения, расширяя функциональность без изменения базового ядра. Такой подход обеспечивает высокую производительность, чистоту кода и удобство поддержки на протяжении всего жизненного цикла проекта."
                          )                      )
                  )

                //block
              )
          )
      );
  }
}
