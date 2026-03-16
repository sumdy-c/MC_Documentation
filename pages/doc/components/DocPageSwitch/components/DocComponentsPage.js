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
            title: "Class and function components",
            text: "В MC можно строить интерфейс как из class-компонентов, так и из обычных функций. Оба подхода могут жить рядом, и это удобно для постепенного роста проекта.",
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
                text: "Подходит, когда у компонента есть собственный local state, методы, lifecycle и более сложное поведение.",
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
                title: "Function component",
                text: "Хорош для небольших UI-частей и композиции. Особенно удобен там, где не нужен тяжёлый класс.",
                code: `function Counter(_s, { initial = 0 }) {
    const countState = MC.uState(initial);
    const count = countState.get();

    return $('<div>').append(
        $('<button>')
            .text('+')
            .on('click', () => countState.set(count + 1)),
        $('<span>').text(' ' + count)
    );
}`,
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
                  .text("COMPOSITION"),
                $("<h3>")
                  .addClass("mc-doc-wide-panel_title")
                  .text("Компоненты собираются через $.MC(...)"),
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
            $.MC(Button, { text: 'Close', onClick: () => console.log('close') })
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
                    text: "Компоненты можно свободно вкладывать друг в друга.",
                  },
                  "cmp-b-1",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Props передаются вторым аргументом в render/function component.",
                  },
                  "cmp-b-2",
                ),
                $.MC(
                  MiniBullet,
                  {
                    text: "Страница или крупный виджет обычно собираются из множества маленьких компонентов.",
                  },
                  "cmp-b-3",
                ),
              ),
          ),
      );
  }
}