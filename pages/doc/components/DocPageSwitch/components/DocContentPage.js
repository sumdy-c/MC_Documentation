import CodeCard from "../../CodeCard.js";
import CompareCard from "../../CompareCard.js";
import InfoCard from "../../InfoCard.js";
import MiniBullet from "../../MiniBullet.js";
import NoteCard from "../../NoteCard.js";
import SectionHeader from "../../SectionHeader.js";
import { StepCard } from "../../StepCard.js";

const LAB_STEPS = [
  ["event", "Handler получает текущий snapshot из render."],
  ["state.set", "MCState сравнивает value и помечает state dirty."],
  ["microtask", "Runtime группирует изменения и готовит flush."],
  ["render", "Компонент получает свежий tuple и строит новый DOM-образ."],
  ["diff", "Существующий DOM патчится без полной пересборки."],
  ["effect", "Side effects запускаются после commit."],
];

const DIFF_SCENARIOS = [
  ["Text node", "Сохранить элемент и обновить только textContent."],
  ["Attributes", "Синхронизировать properties, class и атрибуты."],
  ["Keyed children", "Сопоставить детей по key и сохранить local state."],
  ["Replace", "Заменить ветку, если изменился тип узла или tagName."],
];

const ROSETTA_CASES = [
  {
    title: "jQuery",
    text: "Состояние живёт рядом, DOM меняется вручную после каждого события.",
    code: `let count = 0;
const $value = $('#counter-value');

$('#increment').on('click', () => {
    count += 1;
    $value.text(count);
});`,
  },
  {
    title: "MC",
    text: "Событие меняет state, а render описывает DOM для текущего значения.",
    code: `class Counter extends MC {
    constructor() {
        super();
        this.countState = super.state(0);
    }

    render({ countState }) {
        const [count, setCount] = countState;

        return $('<button type="button">')
            .text('Clicked: ' + count)
            .on('click', () => setCount(count + 1));
    }
}`,
  },
  {
    title: "React-like ошибка",
    text: "В MC deps — это MCState/stateRef. Обычные values не являются подпиской.",
    code: `render({ countState }) {
    const [count] = countState;

    $.MC.effect(([nextCount]) => {
        console.log(nextCount);
    }, [count]); // count не является MCState
}`,
  },
];

export default class DocContentPage extends MC {
  render({}, { page, previousPage, nextPage, setSection }) {
    if (!page) return null;

    return $("<section>")
      .addClass("mc-doc-section mc-doc-anim-in mc-doc-anim-in--d2")
      .append(
        $.MC(
          SectionHeader,
          {
            kicker: page.group,
            title: page.title,
            text: page.summary,
          },
          `${page.id}-header`,
        ),
        $("<div>")
          .addClass("mc-doc-content_blocks")
          .append(
            (page.blocks || []).map((block, index) =>
              this.renderBlock(block, `${page.id}-${index}`),
            ),
          ),
        this.renderPager(previousPage, nextPage, setSection),
      );
  }

  renderBlock(block, key) {
    switch (block.kind) {
      case "lead":
        return this.renderLead(block);
      case "text":
        return this.renderText(block);
      case "list":
        return this.renderList(block);
      case "cards":
        return this.renderCards(block, key);
      case "flow":
        return this.renderFlow(block, key);
      case "table":
        return this.renderTable(block);
      case "callout":
        return this.renderCallout(block, key);
      case "code":
        return this.renderCode(block, key);
      case "tabs":
        return this.renderTabs(block, key);
      case "do-dont":
        return this.renderDoDont(block, key);
      case "template-grid":
        return this.renderTemplates(block, key);
      case "lab":
        return this.renderLab(block, key);
      case "diff-simulator":
        return this.renderDiff(block, key);
      case "identity-playground":
        return this.renderIdentity(block, key);
      case "rosetta":
        return this.renderRosetta(block, key);
      case "component-tree":
        return this.renderRuntimeTree(block, key);
      case "demo":
        return this.renderDemo(block, key);
      default:
        return null;
    }
  }

  panel(title) {
    return $("<div>")
      .addClass("mc-doc-wide-panel mc-doc-content_panel")
      .append(
        title
          ? $("<div>")
              .addClass("mc-doc-wide-panel_head")
              .append($("<h3>").addClass("mc-doc-wide-panel_title").text(title))
          : null,
      );
  }

  renderLead(block) {
    return this.panel()
      .addClass("mc-doc-content_lead")
      .append($("<p>").addClass("mc-doc-wide-panel_text").text(block.text));
  }

  renderText(block) {
    const paragraphs = Array.isArray(block.text) ? block.text : [block.text];
    return this.panel(block.title).append(
      paragraphs.map((text) =>
        $("<p>").addClass("mc-doc-wide-panel_text").text(text),
      ),
    );
  }

  renderList(block) {
    return this.panel(block.title).append(
      $("<div>")
        .addClass("mc-doc-mini-list")
        .append(
          (block.items || []).map((text, index) =>
            $.MC(MiniBullet, { text }, `${block.title}-item-${index}`),
          ),
        ),
    );
  }

  renderCards(block, key) {
    return $("<div>")
      .addClass("mc-doc-content_group")
      .append(
        block.title
          ? $("<h3>").addClass("mc-doc-content_group-title").text(block.title)
          : null,
        $("<div>")
          .addClass("mc-doc-cards-grid")
          .append(
            (block.cards || []).map((card, index) =>
              $.MC(InfoCard, card, `${key}-card-${index}`),
            ),
          ),
      );
  }

  renderFlow(block, key) {
    return $("<div>")
      .addClass("mc-doc-content_group")
      .append(
        $("<h3>").addClass("mc-doc-content_group-title").text(block.title),
        $("<div>")
          .addClass("mc-doc-step-grid")
          .append(
            (block.steps || []).map((step, index) =>
              $.MC(
                StepCard,
                {
                  index: step.label || String(index + 1).padStart(2, "0"),
                  title: step.title,
                  text: step.text,
                },
                `${key}-step-${index}`,
              ),
            ),
          ),
      );
  }

  renderTable(block) {
    return this.panel(block.title).append(
      $("<div>")
        .addClass("mc-doc-table_wrap")
        .append(
          $("<table>")
            .addClass("mc-doc-table")
            .append(
              $("<thead>").append(
                $("<tr>").append(
                  (block.columns || []).map((column) =>
                    $("<th>").text(column),
                  ),
                ),
              ),
              $("<tbody>").append(
                (block.rows || []).map((row) =>
                  $("<tr>").append(row.map((cell) => $("<td>").text(cell))),
                ),
              ),
            ),
        ),
    );
  }

  renderCallout(block, key) {
    return $("<div>")
      .addClass(`mc-doc-content_callout mc-doc-content_callout--${block.tone}`)
      .append(
        $.MC(
          NoteCard,
          { title: block.title, text: block.text },
          `${key}-callout`,
        ),
      );
  }

  renderCode(block, key) {
    return $.MC(
      CodeCard,
      {
        title: block.title,
        subtitle: block.lang || "text",
        code: block.code || "",
      },
      `${key}-code`,
    );
  }

  renderTabs(block, key) {
    return $("<div>")
      .addClass("mc-doc-content_group")
      .append(
        $("<h3>").addClass("mc-doc-content_group-title").text(block.title),
        $("<div>")
          .addClass("mc-doc-compare-grid")
          .append(
            (block.tabs || []).map((tab, index) =>
              $.MC(
                CompareCard,
                {
                  title: tab.title,
                  text: tab.caption,
                  code: tab.code,
                },
                `${key}-tab-${index}`,
              ),
            ),
          ),
      );
  }

  renderDoDont(block, key) {
    return $("<div>")
      .addClass("mc-doc-content_group")
      .append(
        $("<h3>").addClass("mc-doc-content_group-title").text(block.title),
        $("<div>")
          .addClass("mc-doc-compare-grid")
          .append(
            this.renderRules("Делайте", block.do || [], `${key}-do`),
            this.renderRules("Избегайте", block.dont || [], `${key}-dont`),
          ),
      );
  }

  renderRules(title, rules, key) {
    return $("<div>")
      .addClass("mc-doc-wide-panel")
      .append(
        $("<h3>").addClass("mc-doc-wide-panel_title").text(title),
        $("<div>")
          .addClass("mc-doc-content_rules")
          .append(
            rules.map((rule, index) =>
              $.MC(InfoCard, rule, `${key}-${index}`),
            ),
          ),
      );
  }

  renderTemplates(block, key) {
    return $("<div>")
      .addClass("mc-doc-content_group")
      .append(
        $("<h3>").addClass("mc-doc-content_group-title").text(block.title),
        (block.templates || []).map((template, index) =>
          $.MC(
            CodeCard,
            {
              title: template.title,
              subtitle: template.lang || "js",
              code: template.code,
            },
            `${key}-template-${index}`,
          ),
        ),
      );
  }

  renderLab(block, key) {
    return $.MC(
      PublicLab,
      { title: block.title },
      `${key}-interactive-lab`,
    );
  }

  renderDiff(block, key) {
    return $.MC(
      PublicDiffSimulator,
      { title: block.title },
      `${key}-interactive-diff`,
    );
  }

  renderIdentity(block, key) {
    return $.MC(
      PublicIdentityPlayground,
      { title: block.title },
      `${key}-interactive-identity`,
    );
  }

  renderRosetta(block, key) {
    return $.MC(
      PublicRosetta,
      { title: block.title },
      `${key}-interactive-rosetta`,
    );
  }

  renderRuntimeTree(block, key) {
    return $.MC(
      PublicRuntimeInspector,
      { title: block.title },
      `${key}-interactive-runtime`,
    );
  }

  renderDemo(block, key) {
    return $.MC(PublicDemo, { block }, `${key}-demo-${block.demo}`);
  }

  renderPager(previousPage, nextPage, setSection) {
    return $("<div>")
      .addClass("mc-doc-pager")
      .append(
        previousPage
          ? $("<button>")
              .attr("type", "button")
              .addClass("mc-doc-pager_button")
              .on("click", () => setSection(previousPage.id))
              .append(
                $("<span>").text("Назад"),
                $("<strong>").text(previousPage.title),
              )
          : $("<span>"),
        nextPage
          ? $("<button>")
              .attr("type", "button")
              .addClass("mc-doc-pager_button mc-doc-pager_button--next")
              .on("click", () => setSection(nextPage.id))
              .append(
                $("<span>").text("Дальше"),
                $("<strong>").text(nextPage.title),
              )
          : $("<span>"),
      );
  }
}

class PublicLab extends MC {
  constructor() {
    super();
    this.stepState = super.state(0);
    this.countState = super.state(0);
    this.traceState = super.state(["lab ready"]);
  }

  render({ stepState, countState, traceState }, { title }) {
    const [step, setStep] = stepState;
    const [count, setCount] = countState;
    const [trace, setTrace] = traceState;
    const active = LAB_STEPS[step];

    const advance = () => {
      const nextStep = (step + 1) % LAB_STEPS.length;
      const [nextTitle, nextText] = LAB_STEPS[nextStep];
      if (nextTitle === "state.set") setCount(count + 1);
      setTrace(trace.concat(`${nextTitle}: ${nextText}`).slice(-6));
      setStep(nextStep);
    };

    return $("<div>")
      .addClass("mc-doc-content_group mc-doc-lab")
      .append(
        $("<h3>").addClass("mc-doc-content_group-title").text(title),
        $("<div>")
          .addClass("mc-doc-lab_steps")
          .append(
            LAB_STEPS.map(([stepTitle], index) =>
              $("<button>")
                .attr("type", "button")
                .toggleClass("is-active", index === step)
                .on("click", () => setStep(index))
                .append(
                  $("<span>").text(String(index + 1).padStart(2, "0")),
                  $("<strong>").text(stepTitle),
                ),
            ),
          ),
        $("<div>")
          .addClass("mc-doc-lab_workspace")
          .append(
            $("<div>")
              .addClass("mc-doc-lab_preview")
              .append(
                $("<span>").text("render output"),
                $("<strong>").text(`count: ${count}`),
                $("<p>").text(active[1]),
              ),
            $("<div>")
              .addClass("mc-doc-lab_trace")
              .append(
                $("<span>").text("Runtime trace"),
                trace.map((line) => $("<code>").text(line)),
              ),
          ),
        $("<div>")
          .addClass("mc-doc-lab_actions")
          .append(
            $("<button>")
              .attr("type", "button")
              .text("Следующий этап")
              .on("click", advance),
            $("<button>")
              .attr("type", "button")
              .text("Сбросить")
              .on("click", () => {
                setStep(0);
                setCount(0);
                setTrace(["lab reset"]);
              }),
          ),
      );
  }
}

class PublicDiffSimulator extends MC {
  constructor() {
    super();
    this.scenarioState = super.state(0);
  }

  render({ scenarioState }, { title }) {
    const [scenarioIndex, setScenarioIndex] = scenarioState;
    const [scenarioTitle, description] = DIFF_SCENARIOS[scenarioIndex];

    return $("<div>")
      .addClass("mc-doc-content_group mc-doc-simulator")
      .append(
        $("<h3>").addClass("mc-doc-content_group-title").text(title),
        $("<div>")
          .addClass("mc-doc-control_row")
          .append(
            DIFF_SCENARIOS.map(([itemTitle], index) =>
              $("<button>")
                .attr("type", "button")
                .toggleClass("is-active", index === scenarioIndex)
                .text(itemTitle)
                .on("click", () => setScenarioIndex(index)),
            ),
          ),
        $("<div>")
          .addClass("mc-doc-diff_stage")
          .append(
            $("<div>")
              .append(
                $("<span>").text("old DOM"),
                $("<strong>").text(
                  scenarioTitle === "Replace" ? "section.panel" : "node: old",
                ),
              ),
            $("<i>").text("patch"),
            $("<div>")
              .append(
                $("<span>").text("new DOM"),
                $("<strong>").text(
                  scenarioTitle === "Replace" ? "dialog.panel" : "node: new",
                ),
              ),
          ),
        $("<p>").addClass("mc-doc-simulator_result").text(description),
      );
  }
}

class PublicIdentityPlayground extends MC {
  constructor() {
    super();
    this.modeState = super.state("entity");
    this.itemsState = super.state([
      { id: "alpha", title: "Alpha" },
      { id: "bravo", title: "Bravo" },
      { id: "charlie", title: "Charlie" },
    ]);
  }

  render({ modeState, itemsState }, { title }) {
    const [mode, setMode] = modeState;
    const [items, setItems] = itemsState;

    return $("<div>")
      .addClass("mc-doc-content_group")
      .append(
        $("<h3>").addClass("mc-doc-content_group-title").text(title),
        $("<div>")
          .addClass("mc-doc-control_row")
          .append(
            $("<button>")
              .attr("type", "button")
              .toggleClass("is-active", mode === "entity")
              .text("entity key")
              .on("click", () => setMode("entity")),
            $("<button>")
              .attr("type", "button")
              .toggleClass("is-active", mode === "position")
              .text("position key")
              .on("click", () => setMode("position")),
            $("<button>")
              .attr("type", "button")
              .text("Переставить")
              .on("click", () => setItems(items.slice(1).concat(items[0]))),
          ),
        $("<div>")
          .addClass("mc-doc-identity_grid")
          .append(
            items.map((item, index) =>
              $.MC(
                PublicIdentityCard,
                { item, index, mode },
                mode === "entity"
                  ? `public-identity-${item.id}`
                  : `public-identity-slot-${index}`,
              ),
            ),
          ),
        $("<p>")
          .addClass("mc-doc-simulator_result")
          .text(
            mode === "entity"
              ? "Local state следует за сущностью, потому что key построен от item.id."
              : "Local state остаётся в позиции и после перестановки может перейти к другой сущности.",
          ),
      );
  }
}

class PublicIdentityCard extends MC {
  constructor() {
    super();
    this.localState = super.state(0);
  }

  render({ localState }, { item, index, mode }) {
    const [local, setLocal] = localState;
    const key = mode === "entity" ? item.id : `slot-${index}`;

    return $("<article>")
      .addClass("mc-doc-identity_card")
      .append(
        $("<span>").text(`key: ${key}`),
        $("<strong>").text(item.title),
        $("<button>")
          .attr("type", "button")
          .text(`local state ${local}`)
          .on("click", () => setLocal(local + 1)),
      );
  }
}

class PublicRosetta extends MC {
  constructor() {
    super();
    this.activeState = super.state(1);
  }

  render({ activeState }, { title }) {
    const [activeIndex, setActiveIndex] = activeState;
    const active = ROSETTA_CASES[activeIndex];

    return $("<div>")
      .addClass("mc-doc-content_group")
      .append(
        $("<h3>").addClass("mc-doc-content_group-title").text(title),
        $("<div>")
          .addClass("mc-doc-control_row")
          .append(
            ROSETTA_CASES.map((item, index) =>
              $("<button>")
                .attr("type", "button")
                .toggleClass("is-active", index === activeIndex)
                .text(item.title)
                .on("click", () => setActiveIndex(index)),
            ),
          ),
        $("<p>").addClass("mc-doc-simulator_result").text(active.text),
        $.MC(
          CodeCard,
          {
            title: active.title,
            subtitle: "js",
            code: active.code,
          },
          `public-rosetta-code-${activeIndex}`,
        ),
      );
  }
}

function getRuntimeMetrics() {
  const runtime = window.iMC;
  return [
    ["Components", runtime?.componentCollection?.size || 0],
    ["Functions", runtime?.fcCollection?.size || 0],
    ["Effects", runtime?.effectCollection?.size || 0],
    ["States", runtime?.stateCollection?.size || runtime?.states?.size || 0],
  ];
}

class PublicRuntimeInspector extends MC {
  constructor() {
    super();
    this.metricsState = super.state(getRuntimeMetrics());
  }

  render({ metricsState }, { title }) {
    const [metrics, setMetrics] = metricsState;

    return $("<div>")
      .addClass("mc-doc-content_group")
      .append(
        $("<h3>").addClass("mc-doc-content_group-title").text(title),
        $("<div>")
          .addClass("mc-doc-runtime_grid")
          .append(
            metrics.map(([label, value]) =>
              $("<article>")
                .append(
                  $("<span>").text(label),
                  $("<strong>").text(value),
                ),
            ),
          ),
        $("<div>")
          .addClass("mc-doc-control_row")
          .append(
            $("<button>")
              .attr("type", "button")
              .text("Обновить snapshot")
              .on("click", () => setMetrics(getRuntimeMetrics())),
          ),
        $("<p>")
          .addClass("mc-doc-simulator_result")
          .text(
            "Viewer только читает коллекции window.iMC и не изменяет состояние runtime.",
          ),
      );
  }
}

class PublicDemo extends MC {
  constructor() {
    super();
    this.countState = super.state(0);
    this.logState = super.state([]);
    this.toneState = super.state("teal");
    this.itemsState = super.state(["Alpha", "Bravo", "Charlie"]);
    this.aState = super.state(0);
    this.bState = super.state(0);
    this.cState = super.state(0);
    this.variantState = super.state("compact");
    this.childKeyState = super.state(1);
  }

  render(states, { block }) {
    return $("<div>")
      .addClass("mc-doc-content_demo")
      .append(
        $("<div>")
          .addClass("mc-doc-demo_head")
          .append(
            $("<h3>").text(block.title),
            $("<p>").text(block.text),
          ),
        this.renderDemo(states, block.demo),
      );
  }

  renderDemo(states, type) {
    if (type === "effect-log") return this.renderEffectLog(states);
    if (type === "host-canvas") return this.renderHost(states);
    if (type === "keyed-list") return this.renderKeyedList(states);
    if (type === "batching") return this.renderBatching(states);
    if (type === "state-boundary") return this.renderBoundary(states);
    return this.renderCounter(states);
  }

  renderCounter({ countState }) {
    const [count, setCount] = countState;
    return this.actions(
      $("<strong>").addClass("mc-doc-demo_value").text(count),
      $("<button>")
        .attr("type", "button")
        .text("+1")
        .on("click", () => setCount(count + 1)),
      $("<button>")
        .attr("type", "button")
        .text("Reset")
        .on("click", () => setCount(0)),
    );
  }

  renderEffectLog({ countState, logState }) {
    const [count, setCount, countRef] = countState;
    const [log, setLog] = logState;

    $.MC.effect(
      ([nextCount]) => {
        if (nextCount === 0) return;
        setLog(
          this.logState
            .peek()
            .concat(`count changed → ${nextCount}`)
            .slice(-4),
        );
      },
      [countRef],
      "public-demo-effect-log",
    );

    return $("<div>")
      .append(
        this.actions(
          $("<strong>").addClass("mc-doc-demo_value").text(count),
          $("<button>")
            .attr("type", "button")
            .text("Изменить count")
            .on("click", () => setCount(count + 1)),
          $("<button>")
            .attr("type", "button")
            .text("Очистить лог")
            .on("click", () => setLog([])),
        ),
        $("<div>")
          .addClass("mc-doc-demo_log")
          .append(
            log.length
              ? log.map((line) => $("<code>").text(line))
              : $("<span>").text("Лог появится после изменения"),
          ),
      );
  }

  renderHost({ toneState }) {
    const [tone, setTone] = toneState;
    const tones = ["teal", "blue", "amber"];
    return $("<div>")
      .addClass("mc-doc-demo_host")
      .attr("data-tone", tone)
      .append(
        $("<strong>").text("MC.host zone"),
        $("<span>").text(`imperative canvas: ${tone}`),
        $("<button>")
          .attr("type", "button")
          .text("Сменить цвет")
          .on("click", () => {
            const index = (tones.indexOf(tone) + 1) % tones.length;
            setTone(tones[index]);
          }),
      );
  }

  renderKeyedList({ itemsState }) {
    const [items, setItems] = itemsState;
    return $("<div>")
      .append(
        $("<div>")
          .addClass("mc-doc-identity_grid")
          .append(
            items.map((title) =>
              $.MC(
                PublicIdentityCard,
                { item: { id: title.toLowerCase(), title }, mode: "entity" },
                `public-demo-item-${title}`,
              ),
            ),
          ),
        this.actions(
          $("<button>")
            .attr("type", "button")
            .text("Переставить")
            .on("click", () => setItems(items.slice(1).concat(items[0]))),
        ),
      );
  }

  renderBatching({ aState, bState, cState }) {
    const [a, setA] = aState;
    const [b, setB] = bState;
    const [c, setC] = cState;
    return this.actions(
      $("<strong>")
        .addClass("mc-doc-demo_value")
        .text(`${a} · ${b} · ${c}`),
      $("<button>")
        .attr("type", "button")
        .text("Три set()")
        .on("click", () => {
          setA(a + 1);
          setB(b + 1);
          setC(c + 1);
        }),
      $("<button>")
        .attr("type", "button")
        .text("Reset")
        .on("click", () => {
          setA(0);
          setB(0);
          setC(0);
        }),
    );
  }

  renderBoundary({ variantState, childKeyState }) {
    const [variant, setVariant] = variantState;
    const [childKey, setChildKey] = childKeyState;
    return $("<div>")
      .append(
        this.actions(
          $("<button>")
            .attr("type", "button")
            .text("Изменить props")
            .on("click", () =>
              setVariant(variant === "compact" ? "expanded" : "compact"),
            ),
          $("<button>")
            .attr("type", "button")
            .text("Новый key")
            .on("click", () => setChildKey(childKey + 1)),
        ),
        $.MC(
          PublicBoundaryChild,
          { variant, childKey },
          `public-boundary-child-${childKey}`,
        ),
      );
  }

  actions(...children) {
    return $("<div>").addClass("mc-doc-demo_actions").append(children);
  }
}

class PublicBoundaryChild extends MC {
  constructor() {
    super();
    this.localState = super.state(0);
  }

  render({ localState }, { variant, childKey }) {
    const [local, setLocal] = localState;
    return $("<div>")
      .addClass("mc-doc-boundary_child")
      .append(
        $("<span>").text(`key ${childKey} · props ${variant}`),
        $("<button>")
          .attr("type", "button")
          .text(`local state ${local}`)
          .on("click", () => setLocal(local + 1)),
      );
  }
}
