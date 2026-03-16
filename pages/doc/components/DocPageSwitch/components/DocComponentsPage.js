import CodeBlock from "../../CodeBlock.js";
import CompareCard from "../../CompareCard.js";
import MiniBullet from "../../MiniBullet.js";
import SectionHeader from "../../SectionHeader.js";

export default class DocComponentsPage extends MC {
  render() {
    return $("<section>")
      .addClass("mc-doc-section mc-doc-anim-in mc-doc-anim-in--d2")
      .append(
        $.MC(
          SectionHeader,
          {
            kicker: "COMPONENTS",
            title: "Class components and function containers",
            text: "В MC интерфейс собирается через class-компоненты и функциональные контейнеры. Class-компонент подходит для самостоятельного UI-блока со своим состоянием, методами и lifecycle. Функциональный контейнер удобен как лёгкий слой композиции над state, props и условным рендером. Оба подхода могут спокойно жить рядом в одном приложении.",
          },
          "components-header",
        ),

        $("<div>")
          .addClass("mc-doc-compare-grid")
          .append(
            $.MC(
              CompareCard,
              {
                title: "Class component",
                text: "Основная единица UI в MC. Подходит для компонентов с собственным local state, методами экземпляра, lifecycle и более сложной логикой поведения.",
                code: `class Counter extends MC {
    constructor() {
        super();
        this.countState = super.state(0);
    }

    render({ countState }) {
        const [count, setCount] = countState;

        return $('<div>').append(
            $('<button>')
                .text('+')
                .on('click', () => setCount(count + 1)),
            $('<span>').text(' ' + count)
        );
    }
}`,
              },
              "cmp-class-card",
            ),

            $.MC(
              CompareCard,
              {
                title: "Function container",
                text: "Лёгкий способ отрисовать кусок UI от зависимостей и props без создания отдельного class-компонента. Удобен для условного рендера, локальной композиции и небольших runtime-вставок.",
                code: `$.MC(([isOpen], { title }) => {
    return isOpen
        ? $('<div>').text(title)
        : null;
}, { title: 'Panel' }, [isOpenState], 'panel-visibility')`,
              },
              "cmp-fn-card",
            ),
          ),

        $("<div>")
          .addClass("mc-doc-wide-panel")
          .append(
            $("<div>")
              .addClass("mc-doc-wide-panel_head")
              .append(
                $("<div>")
                  .addClass("mc-doc-pill mc-doc-pill--soft")
                  .text("CORE IDEA"),
                $("<h3>")
                  .addClass("mc-doc-wide-panel_title")
                  .text("Что в MC считается компонентом"),
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "Главная основа MC — class-компонент, унаследованный от MC. Именно он является полноценной единицей интерфейса со своим экземпляром, локальным state, методами и lifecycle. Функция в MC — это не отдельная альтернативная архитектура, а удобный контейнерный способ связать state, props и кусок DOM-вывода без создания отдельного класса.",
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "Поэтому class-компоненты и функциональные контейнеры не конкурируют между собой. Обычно class-компоненты держат основную структуру интерфейса, а функции используются там, где нужен лёгкий слой композиции, переключение фрагмента UI по состоянию или короткая inline-вставка прямо в родительский рендер.",
              ),
            $("<div>")
              .addClass("mc-doc-mini-list")
              .append(
                $.MC(
                  MiniBullet,
                  {
                    text: "Class-компонент — основная runtime-единица интерфейса.",
                  },
                  "cmp-b-1",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Функция в MC — это контейнерный рендер-слой, а не отдельная модель компонента уровня класса.",
                  },
                  "cmp-b-2",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Оба режима подключаются через один и тот же entrypoint: $.MC(...).",
                  },
                  "cmp-b-3",
                ),
              ),
          ),

        $("<div>")
          .addClass("mc-doc-wide-panel")
          .append(
            $("<div>")
              .addClass("mc-doc-wide-panel_head")
              .append(
                $("<div>")
                  .addClass("mc-doc-pill mc-doc-pill--soft")
                  .text("CLASS COMPONENTS"),
                $("<h3>")
                  .addClass("mc-doc-wide-panel_title")
                  .text("Когда использовать class-компонент"),
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "Class-компонент стоит использовать тогда, когда UI-блок должен жить как самостоятельная сущность: хранить собственное состояние, иметь методы экземпляра, обслуживать внутренние обработчики, использовать lifecycle или расти в отдельную переиспользуемую часть приложения.",
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "Это основной и самый полный способ строить интерфейс в MC. Если компонент имеет долгую жизнь, собственное поведение и должен быть понятен как отдельный модуль системы, class-компонент почти всегда является лучшим выбором.",
              ),
            $.MC(
              CodeBlock,
              {
                code: `class ToolbarButton extends MC {
    constructor() {
        super();
        this.hoverState = super.state(false);
    }

    render({ hoverState }, { text, onClick }) {
        const [isHover, setHover] = hoverState;

        return $('<button>')
            .addClass('toolbar-button')
            .toggleClass('toolbar-button--hover', isHover)
            .text(text)
            .on('mouseenter', () => setHover(true))
            .on('mouseleave', () => setHover(false))
            .on('click', onClick);
    }
}`,
              },
              "components-class-code",
            ),
            $("<div>")
              .addClass("mc-doc-mini-list")
              .append(
                $.MC(
                  MiniBullet,
                  {
                    text: "Локальный state обычно создаётся в constructor через super.state(...).",
                  },
                  "cmp-b-4",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "В render state приходит уже собранным объектом states, где ключи соответствуют полям экземпляра.",
                  },
                  "cmp-b-5",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Props приходят вторым аргументом render и описывают внешний контракт компонента.",
                  },
                  "cmp-b-6",
                ),
              ),
          ),

        $("<div>")
          .addClass("mc-doc-wide-panel")
          .append(
            $("<div>")
              .addClass("mc-doc-wide-panel_head")
              .append(
                $("<div>")
                  .addClass("mc-doc-pill mc-doc-pill--soft")
                  .text("FUNCTION CONTAINERS"),
                $("<h3>")
                  .addClass("mc-doc-wide-panel_title")
                  .text("Что такое функциональный контейнер"),
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "Функциональный контейнер в MC вызывается не сам по себе, а через $.MC(fn, ...). Он получает значения зависимостей из deps и при необходимости props, после чего возвращает jQuery / DOM output. Это делает его удобным для небольших реактивных вставок прямо внутри другого компонента или модуля.",
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "Здесь важно не путать его с class-компонентом. Функциональный контейнер не заменяет модель экземпляра компонента и обычно не используется как носитель собственной долгоживущей внутренней структуры. Его сила — в короткой и точной композиции вокруг зависимостей.",
              ),
            $.MC(
              CodeBlock,
              {
                code: `$.MC(([isOpenLesogramm]) => {
    return $('<div>').append(
        isOpenLesogramm && $.MC(LesogrammApp, {
            cameraCid: this.cameraCid,
            isOpenLesogramm,
            setOpenLesogramm: () => this.isOpenGlobalState.set(!isOpenLesogramm),
        }, 'mc-comp-LesogrammApp-entryApp')
    );
}, [this.isOpenGlobalState])`,
              },
              "components-fn-code-main",
            ),
            $("<div>")
              .addClass("mc-doc-mini-list")
              .append(
                $.MC(
                  MiniBullet,
                  {
                    text: "Первый аргумент функции — значения зависимостей из deps.",
                  },
                  "cmp-b-7",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Функция возвращает UI-фрагмент, который можно условно включать или выключать.",
                  },
                  "cmp-b-8",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Внутри контейнера можно свободно вкладывать class-компоненты через $.MC(...).",
                  },
                  "cmp-b-9",
                ),
              ),
          ),

        $("<div>")
          .addClass("mc-doc-wide-panel")
          .append(
            $("<div>")
              .addClass("mc-doc-wide-panel_head")
              .append(
                $("<div>")
                  .addClass("mc-doc-pill mc-doc-pill--soft")
                  .text("SIGNATURE"),
                $("<h3>")
                  .addClass("mc-doc-wide-panel_title")
                  .text("Как устроен вызов $.MC(...)"),
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "Обе модели — и class-компоненты, и функциональные контейнеры — подключаются через $.MC(...). Разница в том, что class-компонент передаётся как класс, а контейнер — как функция. Дополнительно runtime может принять props, deps и key в разных допустимых комбинациях.",
              ),
            $.MC(
              CodeBlock,
              {
                code: `// class-component
$.MC(ComponentClass, { text: 'Save' }, 'save-button')

// class-component + deps
$.MC(ComponentClass, [someState], { text: 'Save' }, 'save-button')

// function container + deps
$.MC(([value]) => {
    return $('<div>').text(value);
}, [someState])

// function container + props + deps + key
$.MC(([state], { text }) => {
    return state
        ? $('<div>').text(text)
        : null;
}, { text: 'Visible' }, [someState], 'visible-block')`,
              },
              "components-signature-code",
            ),
            $("<div>")
              .addClass("mc-doc-mini-list")
              .append(
                $.MC(
                  MiniBullet,
                  {
                    text: "props описывают внешний контракт рендера.",
                  },
                  "cmp-b-10",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "deps задают список state-зависимостей, на которые подписан конкретный рендер.",
                  },
                  "cmp-b-11",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "key помогает стабилизировать конкретный узел или компонент в дереве.",
                  },
                  "cmp-b-12",
                ),
              ),
          ),

        $("<div>")
          .addClass("mc-doc-wide-panel")
          .append(
            $("<div>")
              .addClass("mc-doc-wide-panel_head")
              .append(
                $("<div>")
                  .addClass("mc-doc-pill mc-doc-pill--soft")
                  .text("DEPS"),
                $("<h3>")
                  .addClass("mc-doc-wide-panel_title")
                  .text("Как работают dependencies в функциональном контейнере"),
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "В функциональном контейнере основной источник реактивности — это deps. В массиве deps передаются state-объекты, а в саму функцию приходят уже их текущие значения в том же порядке. Это делает контейнер компактным и предсказуемым: функция просто описывает UI как отображение текущего набора значений.",
              ),
            $.MC(
              CodeBlock,
              {
                code: `$.MC((state) => {
    const [view] = state;

    return view
        ? $('<span>')
            .addClass('side-bar-search-field_close-icon')
            .on('click', () => {
                viewClearSearchButton.set(false);
                $('#side-bar-search-field').val('');
                showSearchResults('');
            })
        : null;
}, [viewClearSearchButton])`,
              },
              "components-deps-code",
            ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "Такой контейнер не хранит собственную модель экземпляра. Он просто получает актуальные значения зависимостей и решает, какой DOM-фрагмент вернуть сейчас. Это особенно удобно для коротких UI-ответвлений, inline-кнопок, иконок, служебных блоков и условных вставок в рендере.",
              ),
          ),

        $("<div>")
          .addClass("mc-doc-wide-panel")
          .append(
            $("<div>")
              .addClass("mc-doc-wide-panel_head")
              .append(
                $("<div>")
                  .addClass("mc-doc-pill mc-doc-pill--soft")
                  .text("PROPS + DEPS"),
                $("<h3>")
                  .addClass("mc-doc-wide-panel_title")
                  .text("Полный контейнер: зависимости, props и key"),
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "Функциональный контейнер может одновременно принимать и deps, и props. Это полезно, когда UI зависит и от внешнего контракта, и от подписки на state. В таком виде контейнер становится удобной точкой для очень локальной композиции без выделения отдельного класса.",
              ),
            $.MC(
              CodeBlock,
              {
                code: `$.MC(([state], { text }) => {
    if (state) {
        return $('<div>')
            .attr({ title: 'Очистить поле' })
            .append(removeIcon);
    }

    return $('<div>')
        .attr({ title: \`Сгенерировать новый пароль \${text}\` })
        .append(magicStickIcon);
}, { text }, [inputState], 'generate-password-button')`,
              },
              "components-props-deps-code",
            ),
            $("<div>")
              .addClass("mc-doc-mini-list")
              .append(
                $.MC(
                  MiniBullet,
                  {
                    text: "Первый аргумент контейнера — значения deps.",
                  },
                  "cmp-b-13",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Второй аргумент — props, переданные в $.MC(...).",
                  },
                  "cmp-b-14",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Последний аргумент key полезен для стабильного позиционирования контейнера в дереве.",
                  },
                  "cmp-b-15",
                ),
              ),
          ),

        $("<div>")
          .addClass("mc-doc-wide-panel")
          .append(
            $("<div>")
              .addClass("mc-doc-wide-panel_head")
              .append(
                $("<div>")
                  .addClass("mc-doc-pill mc-doc-pill--soft")
                  .text("COMPOSITION"),
                $("<h3>")
                  .addClass("mc-doc-wide-panel_title")
                  .text("Как компоненты собираются друг с другом"),
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "Композиция в MC строится через $.MC(...). Class-компоненты можно свободно вкладывать друг в друга, а функциональные контейнеры удобно использовать как промежуточный реактивный слой между состоянием и вложенным компонентом. Это позволяет собирать и крупные экраны, и небольшие UI-узлы из множества маленьких частей.",
              ),
            $.MC(
              CodeBlock,
              {
                code: `class Button extends MC {
    render(_, { text, onClick }) {
        return $('<button>')
            .text(text)
            .on('click', onClick);
    }
}

class Toolbar extends MC {
    render() {
        return $('<div>').append(
            $.MC(Button, { text: 'Save', onClick: () => console.log('save') }),
            $.MC(Button, { text: 'Close', onClick: () => console.log('close') }),
            $.MC(([isDanger]) => {
                return isDanger
                    ? $.MC(Button, { text: 'Delete', onClick: () => console.log('delete') }, 'delete-btn')
                    : null;
            }, [dangerState])
        );
    }
}`,
              },
              "components-compose-code",
            ),
            $("<div>")
              .addClass("mc-doc-mini-list")
              .append(
                $.MC(
                  MiniBullet,
                  {
                    text: "Обычный путь — собирать экран из class-компонентов как из основных модулей.",
                  },
                  "cmp-b-16",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Функциональные контейнеры хорошо подходят для локальных реактивных прослоек внутри родительского рендера.",
                  },
                  "cmp-b-17",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Такой стиль помогает не раздувать количество классов там, где нужен только небольшой conditional block.",
                  },
                  "cmp-b-18",
                ),
              ),
          ),

        $("<div>")
          .addClass("mc-doc-wide-panel")
          .append(
            $("<div>")
              .addClass("mc-doc-wide-panel_head")
              .append(
                $("<div>")
                  .addClass("mc-doc-pill mc-doc-pill--soft")
                  .text("CHOICE"),
                $("<h3>")
                  .addClass("mc-doc-wide-panel_title")
                  .text("Что выбирать на практике"),
              ),
            $("<p>")
              .addClass("mc-doc-wide-panel_text")
              .text(
                "Практическое правило простое. Если перед вами самостоятельный UI-блок, который будет жить дольше одного локального условия, лучше делать class-компонент. Если нужно коротко связать несколько state-зависимостей с DOM-фрагментом, показать или скрыть кусок интерфейса, вставить небольшой реактивный рендер рядом с основным кодом — лучше подойдёт функциональный контейнер.",
              ),
            $("<div>")
              .addClass("mc-doc-mini-list")
              .append(
                $.MC(
                  MiniBullet,
                  {
                    text: "Class-компонент — для самостоятельного UI-модуля с поведением и ростом.",
                  },
                  "cmp-b-19",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Функциональный контейнер — для лёгкой реактивной композиции вокруг deps и props.",
                  },
                  "cmp-b-20",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Если код начинает обрастать внутренней логикой и собственной жизнью, контейнер обычно стоит превратить в class-компонент.",
                  },
                  "cmp-b-21",
                ),
              ),
          ),
      );
  }
}