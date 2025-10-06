class Counter extends MC {
  constructor() {
    super();
    this.counter = super.state(0);
  }

  render(states) {
    const [count] = states.local;

    return $("<div>").append(
      $("<span>").text(count),

      $("<div>").append(
        buttonOutline("-1").on("click", () => {
          this.counter.set(count - 1);
        }),
        buttonOutline("+1").on("click", () => {
          this.counter.set(count + 1);
        })
      )
    );
  }
}
class FastStartContent extends MC {
  constructor() {
    super();
    this.countState = MC.uState(0, "init_state_counter_fast-start_lesson");
  }

  render() {
    return container(
      articleWrapper(
        sectionTitle("Быстрый старт"),
        heading1("# Попробуем"),
        textP(
          "Раздел «Быстрый старт» для MC носит условный характер. Ведь плагин, формирующий архитектуру проекта, лучше изучать вдумчиво. Но если хочется просто попробовать — всё максимально просто. В отличие от тяжёлых фреймворков со сборками и CLI, MC можно запустить и протестировать буквально за пять минут."
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

        $("<div>")
          .css({
            display: "flex",
            "justify-content": "space-around",
          })
          .append(
            codeBlock(
              "Пример реализации простого счётчика на MC",
              "Создадим реактивный компонент (в index.html) и отобразим его на странице:",
              `<script src="../jquery-x.x.x.min.js"></script>
<script src="../MC.min.js"></script>
<script>MC.init()</script>

<script>
  // Подождем пока загрузится вёрстка
  document.addEventListener('DOMContentLoaded', () => {
    // Создадим глобальный объект состояния.
    const countState = MC.uState(0, 'init_state_counter');

    // Привяжем куда-то наш компонент, пусть будет body
    $('body').append(
      // Обратите внимание. MC вызывается как простой плагин для jQuery
      $.MC(([count]) => { // тут будет значение вашего countState
        // Все что он делает возвращает вёрстку которую вы напишите.
        return $('<div>').append(
          $('<span>').text(count),
          
          $('<div>').append(
            $('<button>').text('-1').on('click', () => {
              // кнопка просто меняет значение состояния, получая текущее
              countState.set(countState.get() - 1);
            }),
            $('<button>').text('+1').on('click', () => {
              countState.set(countState.get() + 1);
            })
          )
        )
      }, [countState]) // сюда обязательно следует отдать state
    )
  })
</script>`
            ),
            card([
              textMuted(
                "На выходе мы можем получить пример простого счётчика:"
              ),
              $.MC(
                ([count]) => {
                  return $("<div>").append(
                    $("<span>").text(count),

                    $("<div>").append(
                      buttonOutline("-1").on("click", () => {
                        this.countState.set(this.countState.get() - 1);
                      }),
                      buttonOutline("+1").on("click", () => {
                        this.countState.set(this.countState.get() + 1);
                      })
                    )
                  );
                },
                [this.countState],
                "fn_lesson_function_mc-fast_start"
              ),
            ]).css({ marginTop: "2rem" })
          ),

        spacer("10px"),

        textP(
          `Обратите внимание: мы изменяем только данные — не трогаем DOM-элементы и не заменяем их. Один раз вернув компонент и подписав его на countState, мы передаём всю работу по обновлению интерфейса фреймоплагину MC. Подробнее об этом можно узнать в разделе «Состояние и рендеринг».`
        ),

        spacer(),

        heading1("# У меня уже существующий проект использующий jQuery!"),
        textP(`<strong>И это то - на что надеется МС!</strong>`),

        spacer("10px"),
        textP(`Хотя на MC удобно писать и новые проекты (взять хотя бы эту документацию), его настоящая сила раскрывается именно на уже существующих кодовых базах. Там, где сложно вписать Vue или React, MC работает естественно — «как дома». Подключить MC просто: фактически, вы можете использовать его почти как jQuery-селекторы. Давайте создадим в готовом компоненте простой счётчик.`),

        $("<div>")
          .css({
            display: "flex",
            "justify-content": "space-around",
          })
          .append(
            codeBlock(
              "Пример реализации просто счётчика на MC",
              "Создадим реактивный компонент (в index.html) и отобразим его на странице:",
              `<script src="../jquery-x.x.x.min.js"></script>
<script src="../MC.min.js"></script>
<script>MC.init()</script>

<script>
  class Counter extends MC {
    constructor() {
      super();
      this.counter = super.state(0);
    }

    render(states) {
      const [count] = states.local;

      return $("<div>").append(
        $("<span>").text(count),

        $("<div>").append(
          $('<button>').text('-1').on("click", () => {
            this.counter.set(count - 1);
          }),
          $('<button>').text('-1').on("click", () => {
            this.counter.set(count + 1);
          })
        )
      );
    }
  }


  // Допустим тут была ваша старая логика.
  $('<div>').append(
    $('<span>').text('Какая-то логика'),
    $.MC(Counter),
    $('<div>').text('Еще что-то'),
  )
</script>`
            ),
            card([
              textMuted("Все будет работать, и мы не тронули основную логику:"),
              $("<div>").append(
                $("<span>").text("Какая-то логика"),
                $.MC(Counter),
                $("<div>").text("Еще что-то")
              ),
            ]).css({ marginTop: "2rem" })
          )
      ),

      spacer('10px'),

      textSpan('Чтобы вам было проще разобраться, мы не меняли смысл и вёрстку в функциональном контейнере и классовом компоненте. Так вы сможете увидеть сам принцип работы MC, не путаясь в деталях реализации.'),

      spacer(),

      infoBox('Однако...', '...чтобы по-настоящему понять возможности MC, стоит изучать его постепенно. В следующих разделах мы подробнее разберём ключевые принципы — состояние, рендеринг и реактивность, — чтобы вы могли использовать MC максимально эффективно.'),
    );
  }
}
