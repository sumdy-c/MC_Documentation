class FastStartContent extends MC {
  constructor() {
    super();
  }

  render() {
    return container(
      articleWrapper(
        sectionTitle("Быстрый старт"),
        heading1("# Попробуем"),
        textP(
          "Для фреймо-плагина типа MC этот раздел немного условен — ведь часто \
      фреймворки требуют сложной сборки или CLI-инструментов. В случае MC всё \
      гораздо проще: здесь действительно можно «попробовать за пять минут»."
        ),

        spacer("10px"),

        textP(
          "Micro Component не требует сборщиков, npm или особых зависимостей. \
      Всё, что нужно — подключить jQuery и сам файл " +
            "MC.js" +
            " в ваш проект. После этого вы уже можете описывать компоненты MC."
        ),

        spacer("10px"),

        textMuted(
          "MC задуман так, чтобы вы могли встроить его в существующий проект, \
      не ломая текущую структуру и не переходя на новые инструменты."
        ),

        spacer("10px"),

        textP(
          "Ниже — минимальный пример, который можно вставить прямо в HTML-файл:"
        ),

        codeBlock(
          "Пример базового компонента",
          "Создадим реактивный компонент (в index.html) и отобразим его на странице:",
          `<script src="../jquery-x.x.x.min.js"></script>
<script src="../MC.min.js"></script>

<script>
      document.addEventListener('DOMContentLoaded', () => {
        const countState = MC.uState(0, 'init_state_counter');

        $('body').append(
          $.MC(([count]) => {
            return $('<div>').append(
              $('<span>').text(count),
              
              $('<div>').append(
                $('<button>').text('-1').on('click', () => {
                  countState.set(countState.get() - 1);
                }),
                $('<button>').text('+1').on('click', () => {
                  countState.set(countState.get() + 1);
                })
              )
            )
          }, [countState])
        )
      })
</script>`
        ),

        spacer("10px"),

        
      )
    );
  }
}
