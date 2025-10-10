const rowFunctionContainer = ([lessonThreeFCState], { iter }) => {
  const row = $("<tr>")
    .css({
      backgroundColor: iter % 2 === 0 ? "#f1f5f9" : "#ffffff",
      transition: "background-color 0.2s",
    })
    .hover(
      function () {
        $(this).css("background-color", "#e2e8f0");
      },
      function () {
        $(this).css("background-color", iter % 2 === 0 ? "#f1f5f9" : "#ffffff");
      }
    );

  row.append(
    $("<td>")
      .text(iter)
      .css({ padding: "8px", border: "1px solid #e2e8f0", fontWeight: 500 }),
    $("<td>")
      .text(
        `${
          lessonThreeFCState.charAt(0).toUpperCase() +
          lessonThreeFCState.slice(1)
        } ` + iter
      )
      .css({ padding: "8px", border: "1px solid #e2e8f0" }),
    $("<td>")
      .text(
        `Описание ${lessonThreeFCState ? `${lessonThreeFCState}a` : ""} ` + iter
      )
      .css({ padding: "8px", border: "1px solid #e2e8f0", color: "#475569" })
  );

  return row;
};

const tableFunctionContainer = ([lessonTwoFCState]) => {
  const lessonThreeFCState = MC.uState("урок", "lessonThreeFCState_state_mc-lesson_stateAmdRender");

  const table = $("<table>").css({
    width: "100%",
    borderCollapse: "collapse",
    fontFamily: "system-ui, sans-serif",
    marginTop: "10px",
  });

  const header = $("<tr>").css({
    backgroundColor: "#1e293b",
    color: "#fff",
    textAlign: "left",
  });

  header.append(
    $("<th>").text("№").css({ padding: "8px", border: "1px solid #334155" }),
    $("<th>")
      .text("Название")
      .css({ padding: "8px", border: "1px solid #334155" }),
    $("<th>")
      .text("Описание")
      .css({ padding: "8px", border: "1px solid #334155" })
  );

  table.append(header);

  for (let i = 1; i <= lessonTwoFCState; i++) {
    const $row = $.MC(rowFunctionContainer, { iter: i }, [lessonThreeFCState], `unique_key_${i}`);

    table.append($row);
  }

  return $("<div>").css({ minWidth: '500px' }).append(
    $.MC(([lessonThreeFCState], { count }) => {
      return $("<h1>").text(`Список ${lessonThreeFCState ? `${lessonThreeFCState}ов` : 'Без темы'} (${count})`).css({
        fontSize: "20px",
        fontWeight: "600",
        marginBottom: "8px",
        fontFamily: "system-ui",
      });
    }, { count: lessonTwoFCState },[lessonThreeFCState]),
    
    $("<select>")
        .css({ color: "#000", margin: "5px" })
        .val(lessonThreeFCState.get())
        .append(
          $("<option>").text("урок").val("урок"),
          $("<option>").text("вопрос").val("вопрос"),
          $("<option>").text("тест").val("тест"),
          $("<option>").text("студент").val("студент"),
          $("<option>").text("экзамен").val("экзамен"),
          $("<option>").text("документ").val("документ")
        )
        .on("change", (e) => {
          lessonThreeFCState.set(e.target.value);
      }),
    $("<div>")
      .css({
        maxHeight: "800px",
        overflowY: "auto",
      })
      .append(table)
  );
};

class StateAndRender extends MC {
  constructor() {
    super();
    this.lessonTextSpanState = MC.uState(
      "Какой-то div",
      "test_state_mc-lesson_stateAmdRender"
    );
    this.lessonFirstFCState = MC.uState(
      1,
      "lessonFirstFCState_state_mc-lesson_stateAmdRender"
    );
    this.lessonTwoFCState = MC.uState(
      5,
      "lessonTwoFCState_state_mc-lesson_stateAmdRender"
    );
  }

  render() {
    return container(
      $("<div>").append(
        articleWrapper(
          sectionTitle("Состояние и Рендер"),
          heading1("# Что такое состояние в MC"),
          textP(
            `Исторически, начиная с версий v4–v6, функциональные контейнеры и классовые компоненты в MC рассматривались отдельно. 
            Каждый из подходов имел собственный раздел документации, со своими примерами и нюансами использования.`
          ),
          textP(
            `В версии v7 структура документации была пересмотрена: разделы объединены в один — <strong>«Состояние и рендеринг»</strong>. 
            Это решение оказалось более логичным, ведь механизм рендеринга в MC по сути един, 
            а различия между функциональными и классовыми подходами касаются лишь способа объявления и управления состоянием.`
          ),
          spacer("10px"),
          infoBox(
            "Получается...",
            `Теперь оба подхода рассматриваются вместе. Это упрощает восприятие концепций и позволяет лучше понять, 
            как MC работает с состоянием, реактивностью и перерисовкой интерфейса в целом.`
          ),

          heading2(
            "# Глобальное состояние | Начало исследования функциональных контейнеров"
          ),

          textP(
            `Функциональные контейнеры в MC — это простота реактивного подхода. 
            Они позволяют описывать логику и состояние компонента через простую функцию, 
            при этом сохраняя полный контроль над реакциями и обновлениями.`
          ),
          textP(
            `В отличие от классовых компонентов, где состояние чаще описывается в виде свойств экземпляра, 
            функциональные контейнеры используют внутреннюю систему подписок MC. 
            Это делает их особенно удобными для создания лёгких, локальных элементов интерфейса.`
          ),

          $("<div>")
            .css({
              display: "flex",
              "justify-content": "space-around",
            })
            .append(
              codeBlock(
                "Пример простого функционального контейнера МС",
                "Тут мы просто отображаем текст, пока оставим реактивность.",
                `// Создадим глобальный объект состояния.
const textSpanState = MC.uState('text_state_value', 'init_state');

$.MC(() => {
    // Все что он делает возвращает вёрстку которую вы напишите.
    return $('<div>').css({ backgroundColor: '#000', padding: '5px' }).append(
            $('<span>').text('Какой-то span'),
        )
}, [textSpanState])`
              ),
              card([
                textMuted(
                  "Контейнер действительно отрисовал наш <span>, как ожидалось:"
                ),
                spacer(),
                $.MC(
                  () => {
                    // Все что он делает возвращает вёрстку которую вы напишите.
                    return $("<div>")
                      .css({ backgroundColor: "#000", padding: "5px" })
                      .append($("<span>").text("Какой-то span"));
                  },
                  [this.lessonTextSpanState],
                  "fn_lesson_function_mc-lesson_stateAmdRender"
                ),
                spacer(),
                textMuted(
                  "Но на практике такое использование функционального контейнера не несёт особого смысла."
                ),
                textMuted(
                  "Он пока что просто выводит разметку, не реагируя на состояние или изменения данных."
                ),
              ]).css({ marginTop: "2rem" })
            ),
          spacer(),

          textP(
            `Чтобы функциональные контейнеры действительно имели смысл, 
  им нужно с чем-то работать — с изменяющимися данными. 
  Именно для этого в MC существует понятие - <strong>состояние</strong>.`
          ),

          spacer("10px"),

          infoBox(
            "Что же такое состояние в MC?",
            `<strong>Состояние (State)</strong> — это реактивное значение, хранящее данные компонента. 
  При его изменении MC автоматически вызывает обновление всех контейнеров, 
  которые используют это состояние. Таким образом, интерфейс всегда отражает актуальные данные.`
          ),

          spacer("10px"),

          textP(
            `Состояния могут быть как глобальными — общими для разных частей приложения, 
  так и локальными — существующими только внутри одного компонента (Локальные состояния очень мощная функция МС, которую мы рассмотрим позже).`
          ),

          spacer("10px"),

          textP(`В MC они создаются через функцию 
            \`<strong>MC.uState(initialValue, key)</strong>\`,
            где \`<strong>key</strong>\` — уникальный идентификатор (ниже введётся объяснение зачем они нужны), 
  а \`<strong>initialValue</strong>\` — начальное значение.`),

          spacer("10px"),

          textP(
            `Давайте теперь посмотрим, как использовать это состояние для обновления нашего интерфейса:`
          ),

          $("<div>")
            .css({
              display: "flex",
              "justify-content": "space-around",
            })
            .append(
              codeBlock(
                "Пример простого функционального контейнера МС",
                "Тут мы поменяем текст в div, который пользователь пожелает ввести в div",
                `// Создадим глобальный объект состояния.
const textDivState = MC.uState('Какой-то div', 'init_state');

// теперь получим значение состояния. Обратите внимание, что это массив!
$.MC(([textDiv]) => {

return $("<div>")
    .css({ backgroundColor: "#000", padding: "5px" })
    .append(
        // тут мы используем textDiv как начальное значение текста в div
        // и сразу тут мы можем проверить, пустое ли значение в textDiv ?
        $("<div>").text(textDiv ? textDiv : 'Нет текста'),

        // тут мы используем textDiv как начальное значение текста в input
        $('<input>').val(textDiv).on('input', (e) => {
            // обратите внимание, что мы меняем непосредственно сам textDivState
            textDivState.set(e.target.value);
        })
    );
},[textDivState]);`
              ),
              card([
                textMuted(
                  "Теперь мы можем попробовать изменить значение input:"
                ),
                spacer(),
                $.MC(
                  ([lessonTextSpanState]) => {
                    // Все что он делает возвращает вёрстку которую вы напишите.
                    return $("<div>")
                      .css({ backgroundColor: "#000", padding: "5px" })
                      .append(
                        $("<div>").text(
                          lessonTextSpanState
                            ? lessonTextSpanState
                            : "Нет текста"
                        ),

                        $("<input>")
                          .attr("id", "lesson_StateAndRender_part_two-inpt")
                          .css({ color: "#000" })
                          .attr({ value: lessonTextSpanState })
                          .on("input", (e) => {
                            this.lessonTextSpanState.set(e.target.value);
                          })
                      );
                  },
                  [this.lessonTextSpanState],
                  "fn_lesson_function_mc-lesson_stateAmdRender_part_two"
                ),
                spacer(),
                textMuted(
                  "Теперь при изменении значения в input обновляется и span."
                ),
                textMuted(
                  "Можно увидеть как контейнер реагирует на состояние."
                ),
                textMuted(
                  "MC автоматически обновляет интерфейс при изменении данных:"
                ),
                heading3("Без прямого вмешательства в DOM."),
              ]).css({ marginTop: "2rem" })
            ),
          spacer(),
          textP(
            `Сейчас мы разобрали один из самых простых случаев применения Micro Component. 
  На практике функциональные контейнеры обладают куда большей гибкостью и возможностями. 
  Для нас сейчас важно понять базовый принцип: <strong>состояние — это основа реактивности MC</strong>. 
  Мы только что познакомились с одной из его форм — <strong>глобальным состоянием</strong>.`
          ),

          spacer("10px"),

          infoBox(
            "Глобальное состояние ",
            ` — это объект данных, доступный из любой части приложения в пределах страницы. 
  Такое состояние можно получить и использовать в любом контейнере или компоненте, просто указав тот же ключ.  
  Это позволяет связывать между собой разрозненные элементы интерфейса, делая обновления данных централизованными и синхронными.`
          ),

          spacer("10px"),

          textP(
            `В отличие от локального состояния, глобальное может быть прочитано и изменено из любого места — 
  например, из другой функции, модуля или даже отдельного виджета. 
  Локальное же состояние живёт только внутри своего контейнера и не может быть «привязано» к другим элементам. Но на него мы посмотрим когда будем изучать классовые компоненты.`
          ),

          heading2(
            "? Необязательный блок | Углублённое исследование работы состояния"
          ),
          spacer("10px"),

          textMuted(`⚙️ Этот раздел не обязателен к изучению, однако он будет особенно полезен тем, кто хочет глубже понять, как Micro Component управляет состоянием на уровне внутренней архитектуры. 
Здесь мы разбираем класс MCState — основу системы управления состоянием, обеспечивающую реактивность, оптимизацию и согласованность данных.`),

          spacer("10px"),

          infoBox(
            `💡 MCState`,
            `внутренняя сущность, описывающая текущее значение состояния и все его связи. 
Каждое состояние представлено экземпляром этого класса и может быть:
Локальным — доступным только внутри одного компонента.
Глобальным — доступным из любого места приложения по ключу (key).`
          ),

          spacer("10px"),
          heading3(`# Структура MCState`),

          ulList([
            "id — уникальный идентификатор состояния.",
            "value — текущее значение состояния.",
            "traceKey — ключ состояния.",
            "virtualCollection — коллекция виртуальных элементов (виртуальных DOM-узлов), связанных с этим состоянием.",
            "fcCollection — набор функциональных контейнеров (Function Containers), которые зависят от состояния.",
            "effectCollection — список эффектов, которые должны выполниться при его изменении.",
            "passport — разрешение на изменение состояния, выдаваемое движком MCEngine при регистрации.",
            "local — ссылка на компонент, если состояние локальное.",
            "_version и _identityHash — внутренние поля оптимизации, ускоряющие сравнение значений и предотвращающие ненужные ререндеры.",
          ]),

          spacer("10px"),

          textMuted(`Перед установкой нового значения MCState выполняет несколько уровней проверки: от быстрой (shallow) до полного глубокого сравнения. 
Это гарантирует, что интерфейс обновится только при реальных изменениях данных, а не при простом пересоздании объектов или ссылок.`),

          spacer("10px"),

          textP(`<strong> - Основные методы</strong>`),

          ulList([
            "set(newValue) — устанавливает новое значение, если оно действительно изменилось.",
            "get() — возвращает глубокую копию текущего значения, предотвращая прямые мутации.",
            "initial() — выполняет принудительную инициализацию без изменения состояния.",
            "computeShallowIdentity(value) — создаёт «подпись» значения для быстрой проверки изменений.",
            "deepEqual(a, b) — рекурсивное сравнение любых структур данных.",
            "deepClone(value) — глубокое копирование, включая циклические ссылки, массивы, карты и множества.",
          ]),
          spacer("10px"),
          textP(
            "<strong>Обратите внимание, если вы не уверены что делаете используйте только get и set для конфигурации состояния. Этого хватит в 99.9% случаев.</strong>"
          ),
          spacer("10px"),
          textP(`Продвинутые пользователи могут напрямую влиять на алгоритм сравнения состояния, модифицируя поведение <strong>computeShallowIdentity()</strong> или реализуя собственный механизм вычисления «подписи» состояния.  
Кроме того, возможен прямой доступ к внутреннему паспорту состояния через <strong>passport.value</strong>, что позволяет вручную переназначать данные, обходя стандартные проверки.`),
          spacer("10px"),
          textP(`<strong>Однако делать это строго не рекомендуется.</strong>  
Внутренний механизм MCState уже включает множество уровней оптимизации и безопасных проверок.  
Ручное вмешательство может привести к рассинхронизации контейнеров, потере связей в virtualCollection и нарушению реактивности.  
Если требуется особое поведение — лучше реализовать собственный слой поверх стандартных API MC.`)
        ),

        heading2("# Функциональные контейнеры: Углублённое исследование"),

        textP(
          `Важно понимать: приложение можно реализовать целиком на классовых компонентах, целиком на функциональных контейнерах, либо комбинировать оба подхода.`
        ),

        spacer("10px"),

        infoBox(
          `Постепенно углубляясь`,
          `Чтобы не перегружать читателя сейчас - сфокусируемся на функциональных контейнерах — разберём их глубже: как они подписываются на состояние, как управляют эффектами, как оптимизируются и как взаимодействуют с движком рендера. 
  В отдельных разделах будет показано, как те же концепции применимы и для классовых компонентов или в гибридных архитектурах.`
        ),

        spacer("10px"),

        textP(`В этом подразделе мы пройдём следующие ключевые темы:`),

        spacer("10px"),

        ulList([
          "Жизненный цикл функционального контейнера: инициализация, подписки, очистка.",
          "Оптимизации: когда контейнеры пересчитываются и как избежать лишних ререндеров.",
          "Паттерны организации кода: композиция, мемоизация и разделение ответственности.",
        ]),

        spacer(),

        heading3("## Что такое функциональный контейнер"),
        textP(`Фунциональный контейнер - это легкий поставщик HTML для вашего ресурса. Для объяснения работы состояний мы уже столкнулись с его применением, давайте теперь посмотрим \
        полный синтаксис для полного понимания силы такой структуры.`),
        spacer("10px"),
        $("<div>")
          .css({
            display: "flex",
            "justify-content": "space-around",
          })
          .append(
            codeBlock(
              "Функциональный контейнер",
              "Сделаем что-то более сложное на этот раз",
              `// Мы разберём все что тут происходит
const rowFunctionContainer = ${rowFunctionContainer.toString()}

const tableFunctionContainer = ${tableFunctionContainer.toString()}

// Использование
const lessonTwoFCState = MC.uState(5, 'lessonTwoFCState_key');

$('#any_component').append(

  $('<button>').text("row--")
    .css({ margin: "0 5px" })
    .on("click", () => {
      let newValue = lessonTwoFCState.get() - 1;
      if (newValue < 0) {
        newValue = 0;
      }
      lessonTwoFCState.set(newValue);
  }),

  $('<button>').text("row++")
    .css({ margin: "0 5px" })
    .on("click", () => {
      let newValue = lessonTwoFCState.get() + 1;
      lessonTwoFCState.set(newValue);
  }),

  $.MC(tableFunctionContainer, [lessonTwoFCState])
)
`
            ),
            card([
              spacer(),
              buttonOutline(`row--`)
                .css({ margin: "0 5px" })
                .on("click", () => {
                  let newValue = this.lessonTwoFCState.get() - 1;
                  if (newValue < 0) {
                    newValue = 0;
                  }
                  this.lessonTwoFCState.set(newValue);
                }),

              buttonOutline("row++")
                .css({ margin: "0 5px" })
                .on("click", () => {
                  let newValue = this.lessonTwoFCState.get() + 1;
                  this.lessonTwoFCState.set(newValue);
                }),

              $.MC(tableFunctionContainer, [this.lessonTwoFCState]),

              spacer(),
            ]).css({ marginTop: "2rem" })
          ),
        spacer(),
        textP('Стоит сразу отметить важный момент:'),
        spacer('10px'),
        infoBox('Не про jQuery', `В контексте данной документации мы не рассматриваем использование jQuery. Подразумевается что при подключении реактивного фреймоплагина \ 
        - вы уже на достаточном уровне знаете эту библиотеку.`),
        spacer('10px'),
        textP('Давайте вернёмся к нашему примеру. Начать его рассматривать стоит с подключения элемента к странице.'),
        spacer('10px'),
        textP('Допустим мы взяли любой элемент который вы до этого создали, с id - "any_component", в него мы добавили самым привычным для jQuery способом 2 кнопки. А ниже них, включили в него конструкцию которую вы до этого могли не встречать - <strong>$.MC(tableFunctionContainer, [lessonTwoFCState])</strong>'),
        textP('<strong>tableFunctionContainer</strong> - это тот же callback. Поскольку она будет использоватся в единичном экземпляре, нам не интересно добавлять сюда ключ.'),
      )
    );
  }
}
